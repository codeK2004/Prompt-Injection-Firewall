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
from routes.analytics_routes import broadcast_new_log
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
    
    # ⚡ Pure Rule-Based Logic (Fast & Reliable)
    rule_score = rule_check(clean_prompt)
    ai_score = 0 # AI Scoring disabled by user request
    
    # Decision based purely on rules
    decision = "BLOCK" if rule_score >= 80 else "ALLOW"

    if decision == "ALLOW":
        response_text = await generate_response(clean_prompt)
    else:
        response_text = "⚠️ Prompt blocked due to security risk."
        
    # Derive Risk Label
    if rule_score >= 80:
        risk_label = "MALICIOUS"
    elif rule_score >= 40:
        risk_label = "SUSPICIOUS"
    else:
        risk_label = "SAFE"
    
    timestamp = datetime.utcnow()

    log = PromptLog(
        prompt=request.prompt,
        rule_score=rule_score,
        ai_score=ai_score,
        decision=decision,
        timestamp=timestamp
    )

    db.add(log)
    db.commit()

    # 🔥 Get updated analytics
    analytics_data = get_analytics(db)

    # 🔥 Broadcast to all connected dashboards
    await broadcast_update(analytics_data)
    
    # 🔥 Broadcast new log to live monitor
    await broadcast_new_log({
        "id": log.id,
        "prompt": log.prompt,
        "decision": log.decision,
        "rule_score": log.rule_score,
        "ai_score": log.ai_score,
        "timestamp": str(log.timestamp)
    })

    return {
        "decision": decision,
        "rule_score": rule_score,
        "ai_score": ai_score,
        "risk_label": risk_label,
        "response": response_text
    }

@router.get("/history")
def get_history(limit: int = 50, db: Session = Depends(get_db)):
    logs = db.query(PromptLog).order_by(PromptLog.timestamp.desc()).limit(limit).all()
    return logs

@router.delete("/history")
async def clear_history(db: Session = Depends(get_db)):
    db.query(PromptLog).delete()
    db.commit()
    
    # Broadcast empty state
    await broadcast_update({'total_requests': 0, 'blocked_attempts': 0, 'security_score': 100})
    
    return {"message": "History cleared"}
