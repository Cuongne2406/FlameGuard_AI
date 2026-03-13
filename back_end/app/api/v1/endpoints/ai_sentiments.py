from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID
from app.models.ai import AISentiment, SentimentLabel
from app.api.deps import get_db
from app.schemas.ai_audit_schemas import AISentimentCreate, AISentimentUpdate, AISentimentResponse
from app.services import ai_audit_service

router = APIRouter()

@router.get("/sub-admin")
def get_sub_admin_ai_sentiments(db: Session = Depends(get_db)):
    """Fetch AI Sentiments mixed with real database metrics for SubAdmin"""
    return ai_audit_service.get_sub_admin_dashboard_analysis(db=db)

@router.get("/admin")
def get_admin_ai_sentiments(db: Session = Depends(get_db)):
    """Fetch overall AI analysis for Admin"""
    return ai_audit_service.get_admin_dashboard_analysis(db=db)

@router.get("/event/{event_id}")
def get_event_feedback_analysis(event_id: str, db: Session = Depends(get_db)):
    """Fetch AI feedback analysis for a specific event"""
    # Query sentiments filtered by source_id (event id)
    sentiments = db.query(AISentiment).filter(AISentiment.source_id == event_id).all()
    
    pos_count = len([s for s in sentiments if s.sentiment_label == SentimentLabel.POSITIVE])
    neg_count = len([s for s in sentiments if s.sentiment_label == SentimentLabel.NEGATIVE])
    neu_count = len([s for s in sentiments if s.sentiment_label == SentimentLabel.NEUTRAL])
    
    avg_score = sum([float(s.sentiment_score) for s in sentiments]) / len(sentiments) if sentiments else 0
    
    # Extract keywords
    all_keywords = []
    for s in sentiments:
        if s.detected_keywords:
            all_keywords.extend(s.detected_keywords)
            
    return {
        "score": round(avg_score, 1),
        "total": len(sentiments),
        "sentiment": [
            {"label": "Tích cực", "value": pos_count, "color": "emerald"},
            {"label": "Trung lập", "value": neu_count, "color": "slate"},
            {"label": "Tiêu cực", "value": neg_count, "color": "rose"}
        ],
        "keywords": list(set(all_keywords))[:10],
        "feedbacks": [
            {
                "user": "Sinh viên",
                "time": s.analyzed_at.strftime("%H:%M %d/%m") if s.analyzed_at else "N/A",
                "content": s.content_excerpt,
                "type": s.sentiment_label.value.lower(),
                "tags": s.detected_keywords or [],
                "avatar": "S"
            } for s in sentiments
        ]
    }

@router.post("/", response_model=AISentimentResponse)
def create_ai_sentiment(
    *,
    db: Session = Depends(get_db),
    sentiment_in: AISentimentCreate,
):
    return ai_audit_service.create_ai_sentiment(db=db, sentiment_in=sentiment_in)

@router.get("/", response_model=List[AISentimentResponse])
def read_ai_sentiments(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    return ai_audit_service.get_ai_sentiments(db, skip=skip, limit=limit)

@router.put("/{sentiment_id}", response_model=AISentimentResponse)
def update_ai_sentiment(
    *,
    db: Session = Depends(get_db),
    sentiment_id: UUID,
    sentiment_in: AISentimentUpdate,
):
    return ai_audit_service.update_ai_sentiment(db=db, sentiment_id=sentiment_id, sentiment_in=sentiment_in)

@router.delete("/{sentiment_id}")
def delete_ai_sentiment(
    *,
    db: Session = Depends(get_db),
    sentiment_id: UUID,
):
    return ai_audit_service.delete_ai_sentiment(db=db, sentiment_id=sentiment_id)
