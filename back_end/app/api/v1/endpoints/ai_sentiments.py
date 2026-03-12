from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

from app.api.deps import get_db
from app.schemas.ai_audit_schemas import AISentimentCreate, AISentimentUpdate, AISentimentResponse
from app.services import ai_audit_service

router = APIRouter()

@router.get("/sub-admin")
def get_sub_admin_ai_sentiments(db: Session = Depends(get_db)):
    """Fetch AI Sentiments mixed with real database metrics"""
    return ai_audit_service.get_sub_admin_dashboard_analysis(db=db)

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
