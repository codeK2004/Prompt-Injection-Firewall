from sqlalchemy import Column, Integer, String, Text, DateTime
from datetime import datetime
from .db import Base

class PromptLog(Base):
    __tablename__ = "prompt_logs"

    id = Column(Integer, primary_key=True, index=True)
    prompt = Column(Text)
    rule_score = Column(Integer)
    ai_score = Column(Integer)
    decision = Column(String)
    timestamp = Column(DateTime, default=datetime.utcnow)
