from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

from app.api.deps import get_db, get_current_active_admin
from app.schemas.ai_audit_schemas import (
    AuditLogCreate, 
    AuditLogResponse, 
    AuditDisplayResponse,
    PaginatedAuditLogResponse
)
from app.services import ai_audit_service

router = APIRouter()

@router.post("/", response_model=AuditLogResponse)
def create_system_audit_log(
    *,
    db: Session = Depends(get_db),
    log_in: AuditLogCreate,
    current_admin = Depends(get_current_active_admin),
):
    """
    Tạo nhật ký hệ thống (thường được thực hiện ngầm, ít khi qua API công khai).
    """
    return ai_audit_service.create_system_audit_log(db=db, log_in=log_in)

@router.get("/", response_model=PaginatedAuditLogResponse)
def read_system_audit_logs(
    skip: int = 0,
    limit: int = 20,
    date_from: str = None,
    date_to: str = None,
    role: str = None,
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_active_admin),
):
    """
    Lấy danh sách nhật ký hệ thống (Read-only).
    """
    return ai_audit_service.get_system_audit_logs(db, skip=skip, limit=limit, date_from=date_from, date_to=date_to, role=role)

@router.get("/export")
def export_audit_logs(
    date_from: str = None,
    date_to: str = None,
    role: str = None,
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_active_admin),
):
    """
    Xuất danh sách nhật ký hệ thống dưới dạng file CSV.
    """
    return ai_audit_service.export_system_audit_logs(db, date_from=date_from, date_to=date_to, role=role)

