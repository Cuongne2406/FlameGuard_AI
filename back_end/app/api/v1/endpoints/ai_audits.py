from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

from app.api.deps import get_db, get_current_active_admin
from app.schemas.ai_audit_schemas import AIAuditCreate, AIAuditUpdate, AIAuditResponse
from app.services import ai_audit_service

router = APIRouter()

@router.post("/", response_model=AIAuditResponse)
def create_ai_audit(
    *,
    db: Session = Depends(get_db),
    audit_in: AIAuditCreate,
    current_admin = Depends(get_current_active_admin),
):
    return ai_audit_service.create_ai_audit(db=db, audit_in=audit_in)

@router.get("/", response_model=List[AIAuditResponse])
def read_ai_audits(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_active_admin),
):
    return ai_audit_service.get_ai_audits(db, skip=skip, limit=limit)

@router.put("/{audit_id}", response_model=AIAuditResponse)
def update_ai_audit(
    *,
    db: Session = Depends(get_db),
    audit_id: UUID,
    audit_in: AIAuditUpdate,
    current_admin = Depends(get_current_active_admin),
):
    return ai_audit_service.update_ai_audit(db=db, audit_id=audit_id, audit_in=audit_in)

@router.delete("/{audit_id}")
def delete_ai_audit(
    *,
    db: Session = Depends(get_db),
    audit_id: UUID,
    current_admin = Depends(get_current_active_admin),
):
    return ai_audit_service.delete_ai_audit(db=db, audit_id=audit_id)

