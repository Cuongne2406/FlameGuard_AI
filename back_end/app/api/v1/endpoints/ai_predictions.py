from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

from app.api.deps import get_db, get_current_active_admin
from app.schemas.ai_audit_schemas import AIPredictionCreate, AIPredictionUpdate, AIPredictionResponse
from app.services import ai_audit_service

router = APIRouter()

@router.post("/", response_model=AIPredictionResponse)
def create_ai_prediction(
    *,
    db: Session = Depends(get_db),
    prediction_in: AIPredictionCreate,
    current_admin = Depends(get_current_active_admin),
):
    return ai_audit_service.create_ai_prediction(db=db, prediction_in=prediction_in)

@router.get("/", response_model=List[AIPredictionResponse])
def read_ai_predictions(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_active_admin),
):
    return ai_audit_service.get_ai_predictions(db, skip=skip, limit=limit)

@router.put("/{prediction_id}", response_model=AIPredictionResponse)
def update_ai_prediction(
    *,
    db: Session = Depends(get_db),
    prediction_id: UUID,
    prediction_in: AIPredictionUpdate,
    current_admin = Depends(get_current_active_admin),
):
    return ai_audit_service.update_ai_prediction(db=db, prediction_id=prediction_id, prediction_in=prediction_in)

@router.delete("/{prediction_id}")
def delete_ai_prediction(
    *,
    db: Session = Depends(get_db),
    prediction_id: UUID,
    current_admin = Depends(get_current_active_admin),
):
    return ai_audit_service.delete_ai_prediction(db=db, prediction_id=prediction_id)

