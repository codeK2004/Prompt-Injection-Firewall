from fastapi import APIRouter, Depends, WebSocket, WebSocketDisconnect
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
from database.db import SessionLocal
from database.models import PromptLog

router = APIRouter()

# -----------------------------
# DATABASE DEPENDENCY
# -----------------------------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# -----------------------------
# NORMAL ANALYTICS ENDPOINT
# -----------------------------
@router.get("/analytics")
def get_analytics(db: Session = Depends(get_db)):

    total_prompts = db.query(PromptLog).count()

    allowed = db.query(PromptLog).filter(PromptLog.decision == "ALLOW").count()
    blocked = db.query(PromptLog).filter(PromptLog.decision == "BLOCK").count()

    avg_rule = db.query(func.avg(PromptLog.rule_score)).scalar() or 0
    avg_ai = db.query(func.avg(PromptLog.ai_score)).scalar() or 0

    daily_stats = db.query(
        func.date(PromptLog.timestamp).label("date"),
        func.count().label("count")
    ).group_by(func.date(PromptLog.timestamp)).all()

    return {
        "total_prompts": total_prompts,
        "allowed": allowed,
        "blocked": blocked,
        "average_rule_score": float(round(avg_rule, 2)),
        "average_ai_score": float(round(avg_ai, 2)),
        "daily_trend": [
            {"date": str(d.date), "count": d.count}
            for d in daily_stats
        ]
    }

# -----------------------------
# WEBSOCKET REAL-TIME SUPPORT
# -----------------------------
# -----------------------------
# WEBSOCKET REAL-TIME SUPPORT
# -----------------------------
active_connections: List[WebSocket] = []
active_log_connections: List[WebSocket] = []

@router.websocket("/ws/analytics")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    active_connections.append(websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        active_connections.remove(websocket)

@router.websocket("/ws/logs")
async def websocket_logs_endpoint(websocket: WebSocket):
    await websocket.accept()
    active_log_connections.append(websocket)
    print(f"DEBUG: Client connected to /ws/logs. Total clients: {len(active_log_connections)}")
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        active_log_connections.remove(websocket)
        print(f"DEBUG: Client disconnected from /ws/logs. Total clients: {len(active_log_connections)}")

# -----------------------------
# BROADCAST FUNCTION
# -----------------------------
async def broadcast_update(data):
    for connection in active_connections:
        try:
            await connection.send_json(data)
        except Exception as e:
            print(f"Error broadcasting analytics: {e}")
            try:
                active_connections.remove(connection)
            except ValueError:
                pass

async def broadcast_new_log(log_data):
    print(f"DEBUG: Broadcasting new log to {len(active_log_connections)} clients. Data: {log_data}")
    for connection in active_log_connections:
        try:
            await connection.send_json(log_data)
        except Exception as e:
             print(f"Error broadcasting log: {e}")
             try:
                 active_log_connections.remove(connection)
             except ValueError:
                 pass
