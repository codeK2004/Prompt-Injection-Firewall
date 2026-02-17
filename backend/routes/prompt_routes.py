from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database.db import SessionLocal
from database.models import PromptLog
from schemas.prompt_schema import PromptRequest
from services.preprocessing import preprocess
from services.rule_engine import rule_check
from services.ai_risk import ai_risk
from services.decision_engine import decide
from services.gemini_service import generate_response
from routes.analytics_routes import broadcast_update
from routes.analytics_routes import get_analytics
from datetime import datetime

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/analyze")
async def analyze_prompt(request: PromptRequest, db: Session = Depends(get_db)):

    clean_prompt = preprocess(request.prompt)
    rule_score = rule_check(clean_prompt)
    ai_score = ai_risk(clean_prompt)
    decision = decide(rule_score, ai_score)

    if decision == "ALLOW":
        response_text = generate_response(clean_prompt)
    else:
        response_text = "⚠️ Prompt blocked due to security risk."

    log = PromptLog(
        prompt=request.prompt,
        rule_score=rule_score,
        ai_score=ai_score,
        decision=decision,
        timestamp=datetime.utcnow()
    )

    db.add(log)
    db.commit()

    # 🔥 Get updated analytics
    analytics_data = get_analytics(db)

    # 🔥 Broadcast to all connected dashboards
    await broadcast_update(analytics_data)

    return {
        "decision": decision,
        "rule_score": rule_score,
        "ai_score": ai_score,
        "response": response_text
    }
