from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

from app.api.deps import get_db
from app.schemas.finance_schemas import AssetLoanCreate, AssetLoanUpdate, AssetLoanResponse
from app.services import finance_service

router = APIRouter()

@router.post("/", response_model=AssetLoanResponse)
def create_asset_loan(
    *,
    db: Session = Depends(get_db),
    loan_in: AssetLoanCreate,
):
    return finance_service.create_asset_loan(db=db, loan_in=loan_in)

@router.get("/", response_model=List[AssetLoanResponse])
def read_asset_loans(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    return finance_service.get_asset_loans(db, skip=skip, limit=limit)

@router.put("/{loan_id}", response_model=AssetLoanResponse)
def update_asset_loan(
    *,
    db: Session = Depends(get_db),
    loan_id: UUID,
    loan_in: AssetLoanUpdate,
):
    return finance_service.update_asset_loan(db=db, loan_id=loan_id, loan_in=loan_in)
