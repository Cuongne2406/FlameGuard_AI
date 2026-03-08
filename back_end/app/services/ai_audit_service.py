from sqlalchemy.orm import Session
from uuid import UUID
from fastapi import HTTPException
from app.models.ai import AISentiment, AIPrediction, AIAudit, ChatbotLog
from app.models.audit import AuditLog
from app.schemas.ai_audit_schemas import (
    AISentimentCreate, AISentimentUpdate,
    AIPredictionCreate, AIPredictionUpdate,
    AIAuditCreate, AIAuditUpdate,
    ChatbotLogCreate, ChatbotLogUpdate,
    AuditLogCreate
)

# ==========================================
# AI Sentiment Services
# ==========================================
def create_ai_sentiment(db: Session, sentiment_in: AISentimentCreate):
    db_sentiment = AISentiment(**sentiment_in.dict())
    db.add(db_sentiment)
    db.commit()
    db.refresh(db_sentiment)
    return db_sentiment

def get_ai_sentiments(db: Session, skip: int = 0, limit: int = 100):
    return db.query(AISentiment).offset(skip).limit(limit).all()

def update_ai_sentiment(db: Session, sentiment_id: UUID, sentiment_in: AISentimentUpdate):
    db_sentiment = db.query(AISentiment).filter(AISentiment.id == sentiment_id).first()
    if not db_sentiment:
        raise HTTPException(status_code=404, detail="AI Sentiment not found")
    
    update_data = sentiment_in.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_sentiment, key, value)
        
    db.commit()
    db.refresh(db_sentiment)
    return db_sentiment

def delete_ai_sentiment(db: Session, sentiment_id: UUID):
    db_sentiment = db.query(AISentiment).filter(AISentiment.id == sentiment_id).first()
    if not db_sentiment:
        raise HTTPException(status_code=404, detail="AI Sentiment not found")
    db.delete(db_sentiment)
    db.commit()
    return {"message": "AI Sentiment deleted successfully"}

# ==========================================
# AI Prediction Services
# ==========================================
def create_ai_prediction(db: Session, prediction_in: AIPredictionCreate):
    db_prediction = AIPrediction(**prediction_in.dict())
    db.add(db_prediction)
    db.commit()
    db.refresh(db_prediction)
    return db_prediction

def get_ai_predictions(db: Session, skip: int = 0, limit: int = 100):
    return db.query(AIPrediction).offset(skip).limit(limit).all()

def update_ai_prediction(db: Session, prediction_id: UUID, prediction_in: AIPredictionUpdate):
    db_prediction = db.query(AIPrediction).filter(AIPrediction.id == prediction_id).first()
    if not db_prediction:
        raise HTTPException(status_code=404, detail="AI Prediction not found")
    
    update_data = prediction_in.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_prediction, key, value)
        
    db.commit()
    db.refresh(db_prediction)
    return db_prediction

def delete_ai_prediction(db: Session, prediction_id: UUID):
    db_prediction = db.query(AIPrediction).filter(AIPrediction.id == prediction_id).first()
    if not db_prediction:
        raise HTTPException(status_code=404, detail="AI Prediction not found")
    db.delete(db_prediction)
    db.commit()
    return {"message": "AI Prediction deleted successfully"}


# ==========================================
# AI Audit Services
# ==========================================
def create_ai_audit(db: Session, audit_in: AIAuditCreate):
    db_audit = AIAudit(**audit_in.dict())
    db.add(db_audit)
    db.commit()
    db.refresh(db_audit)
    return db_audit

def get_ai_audits(db: Session, skip: int = 0, limit: int = 100):
    return db.query(AIAudit).offset(skip).limit(limit).all()

def update_ai_audit(db: Session, audit_id: UUID, audit_in: AIAuditUpdate):
    db_audit = db.query(AIAudit).filter(AIAudit.id == audit_id).first()
    if not db_audit:
        raise HTTPException(status_code=404, detail="AI Audit not found")
    
    update_data = audit_in.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_audit, key, value)
        
    db.commit()
    db.refresh(db_audit)
    return db_audit

def delete_ai_audit(db: Session, audit_id: UUID):
    db_audit = db.query(AIAudit).filter(AIAudit.id == audit_id).first()
    if not db_audit:
        raise HTTPException(status_code=404, detail="AI Audit not found")
    db.delete(db_audit)
    db.commit()
    return {"message": "AI Audit deleted successfully"}

# ==========================================
# Chatbot Log Services
# ==========================================
def create_chatbot_log(db: Session, log_in: ChatbotLogCreate):
    db_log = ChatbotLog(**log_in.dict())
    db.add(db_log)
    db.commit()
    db.refresh(db_log)
    return db_log

def get_chatbot_logs(db: Session, skip: int = 0, limit: int = 100):
    return db.query(ChatbotLog).offset(skip).limit(limit).all()

def update_chatbot_log(db: Session, log_id: UUID, log_in: ChatbotLogUpdate):
    db_log = db.query(ChatbotLog).filter(ChatbotLog.id == log_id).first()
    if not db_log:
        raise HTTPException(status_code=404, detail="Chatbot Log not found")
    
    update_data = log_in.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_log, key, value)
        
    db.commit()
    db.refresh(db_log)
    return db_log

def delete_chatbot_log(db: Session, log_id: UUID):
    db_log = db.query(ChatbotLog).filter(ChatbotLog.id == log_id).first()
    if not db_log:
        raise HTTPException(status_code=404, detail="Chatbot Log not found")
    db.delete(db_log)
    db.commit()
    return {"message": "Chatbot Log deleted successfully"}

# ==========================================
# System Audit Log Services
# ==========================================
def create_system_audit_log(db: Session, log_in: AuditLogCreate):
    # Typically, audit logs are created internally by the system (not fully via outside API)
    # They should not be updated or deleted.
    db_log = AuditLog(**log_in.dict())
    db.add(db_log)
    db.commit()
    db.refresh(db_log)
    return db_log

def get_system_audit_logs(db: Session, skip: int = 0, limit: int = 100):
    return db.query(AuditLog).offset(skip).limit(limit).all()
