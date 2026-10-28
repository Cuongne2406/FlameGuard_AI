from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

from app.api.deps import get_db, get_current_active_admin
from app.schemas.ai_audit_schemas import ChatbotLogCreate, ChatbotLogUpdate, ChatbotLogResponse
from app.services import ai_audit_service

router = APIRouter()

@router.post("/", response_model=ChatbotLogResponse)
def create_chatbot_log(
    *,
    db: Session = Depends(get_db),
    log_in: ChatbotLogCreate,
    current_admin = Depends(get_current_active_admin),
):
    return ai_audit_service.create_chatbot_log(db=db, log_in=log_in)

@router.get("/", response_model=List[ChatbotLogResponse])
def read_chatbot_logs(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_active_admin),
):
    return ai_audit_service.get_chatbot_logs(db, skip=skip, limit=limit)

@router.put("/{log_id}", response_model=ChatbotLogResponse)
def update_chatbot_log(
    *,
    db: Session = Depends(get_db),
    log_id: UUID,
    log_in: ChatbotLogUpdate,
    current_admin = Depends(get_current_active_admin),
):
    return ai_audit_service.update_chatbot_log(db=db, log_id=log_id, log_in=log_in)

@router.delete("/{log_id}")
def delete_chatbot_log(
    *,
    db: Session = Depends(get_db),
    log_id: UUID,
    current_admin = Depends(get_current_active_admin),
):
    return ai_audit_service.delete_chatbot_log(db=db, log_id=log_id)

