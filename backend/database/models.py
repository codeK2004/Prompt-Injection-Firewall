from sqlalchemy import Column, Integer, String, Text, DateTime
from datetime import datetime, timezone, timedelta
from .db import Base

def get_ist_time():
    # IST is UTC+5:30
    return datetime.now(timezone(timedelta(hours=5, minutes=30)))

class PromptLog(Base):
    __tablename__ = "prompt_logs"

    id = Column(Integer, primary_key=True, index=True)
    prompt = Column(Text)
    rule_score = Column(Integer)
    ai_score = Column(Integer)
    decision = Column(String)
    timestamp = Column(DateTime, default=get_ist_time)
