from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

from app.api.deps import get_db, get_current_active_user
from app.schemas.finance_schemas import FundRequestCreate, FundRequestUpdate, FundRequestResponse
from app.services import finance_service
from app.models.finance import FundRequest

router = APIRouter()

@router.post("/", response_model=FundRequestResponse)
def create_fund_request(
    *,
    db: Session = Depends(get_db),
    request_in: FundRequestCreate,
    current_user = Depends(get_current_active_user),
):
    is_admin = any(role.name in ["ADMIN", "UNIVERSITY_ADMIN", "FACULTY_ADMIN"] for role in current_user.roles)
    if not is_admin:
        request_in.requested_by = current_user.id
    return finance_service.create_fund_request(db=db, request_in=request_in)

@router.get("/", response_model=List[FundRequestResponse])
def read_fund_requests(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user),
):
    is_admin = any(role.name in ["ADMIN", "UNIVERSITY_ADMIN", "FACULTY_ADMIN"] for role in current_user.roles)
    if is_admin:
        return finance_service.get_fund_requests(db, skip=skip, limit=limit)
    return db.query(FundRequest).filter(FundRequest.requested_by == current_user.id).offset(skip).limit(limit).all()

@router.put("/{request_id}", response_model=FundRequestResponse)
def update_fund_request(
    *,
    db: Session = Depends(get_db),
    request_id: UUID,
    request_in: FundRequestUpdate,
    current_user = Depends(get_current_active_user),
):
    is_admin = any(role.name in ["ADMIN", "UNIVERSITY_ADMIN", "FACULTY_ADMIN"] for role in current_user.roles)
    if not is_admin:
        raise HTTPException(status_code=403, detail="Bạn không có quyền cập nhật yêu cầu cấp quỹ")
    return finance_service.update_fund_request(db=db, request_id=request_id, request_in=request_in)

