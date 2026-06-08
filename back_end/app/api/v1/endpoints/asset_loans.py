from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

from app.api.deps import get_db, get_current_active_user
from app.schemas.finance_schemas import AssetLoanCreate, AssetLoanUpdate, AssetLoanResponse
from app.services import finance_service
from app.models.finance import AssetLoan

router = APIRouter()

@router.post("/", response_model=AssetLoanResponse)
def create_asset_loan(
    *,
    db: Session = Depends(get_db),
    loan_in: AssetLoanCreate,
    current_user = Depends(get_current_active_user),
):
    is_admin = any(role.name in ["ADMIN", "UNIVERSITY_ADMIN", "FACULTY_ADMIN"] for role in current_user.roles)
    if not is_admin:
        loan_in.borrowed_by = current_user.id
    return finance_service.create_asset_loan(db=db, loan_in=loan_in)

@router.get("/", response_model=List[AssetLoanResponse])
def read_asset_loans(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user),
):
    is_admin = any(role.name in ["ADMIN", "UNIVERSITY_ADMIN", "FACULTY_ADMIN"] for role in current_user.roles)
    if is_admin:
        return finance_service.get_asset_loans(db, skip=skip, limit=limit)
    return db.query(AssetLoan).filter(AssetLoan.borrowed_by == current_user.id).offset(skip).limit(limit).all()

@router.put("/{loan_id}", response_model=AssetLoanResponse)
def update_asset_loan(
    *,
    db: Session = Depends(get_db),
    loan_id: UUID,
    loan_in: AssetLoanUpdate,
    current_user = Depends(get_current_active_user),
):
    is_admin = any(role.name in ["ADMIN", "UNIVERSITY_ADMIN", "FACULTY_ADMIN"] for role in current_user.roles)
    if not is_admin:
        raise HTTPException(status_code=403, detail="Bạn không có quyền cập nhật phiếu mượn tài sản")
    return finance_service.update_asset_loan(db=db, loan_id=loan_id, loan_in=loan_in)

