from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

from app.api.deps import get_db, get_current_active_admin
from app.schemas.finance_schemas import (
    TransactionCreate, 
    TransactionResponse, 
    FinanceDashboardStats
)
from app.services import finance_service

router = APIRouter()

@router.get("/stats", response_model=FinanceDashboardStats)
def get_finance_stats(
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_active_admin),
):
    return finance_service.get_faculty_finance_stats(db)

@router.get("/transactions", response_model=List[TransactionResponse])
def get_transactions(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_active_admin),
):
    return finance_service.get_transactions(db, skip=skip, limit=limit)

@router.post("/transactions", response_model=TransactionResponse)
def create_transaction(
    *,
    db: Session = Depends(get_db),
    txn_in: TransactionCreate,
    current_admin = Depends(get_current_active_admin),
):
    return finance_service.create_transaction(db, txn_in=txn_in)

# Approve a pending expense transaction
@router.put("/transactions/{transaction_id}/approve", response_model=TransactionResponse)
def approve_transaction(
    transaction_id: UUID,
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_active_admin),
):
    txn = db.query(finance_service.FinanceTransaction).filter(
        finance_service.FinanceTransaction.id == transaction_id,
        finance_service.FinanceTransaction.status == finance_service.TransactionStatus.PENDING
    ).first()
    
    if not txn:
        raise HTTPException(status_code=404, detail="Pending transaction not found")
    
    txn.status = finance_service.TransactionStatus.COMPLETED
    db.commit()
    db.refresh(txn)
    return txn

