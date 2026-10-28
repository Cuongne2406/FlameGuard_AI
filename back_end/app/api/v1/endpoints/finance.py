from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from uuid import UUID

from app.api.deps import get_db, get_user_faculty_org, get_current_active_user
from app.models.core import Organization, User
from app.schemas.finance_schemas import (
    TransactionCreate, 
    TransactionResponse, 
    FinanceDashboardStats,
    StudentFeeOverviewResponse,
    StudentFeeItemResponse
)
from app.services import finance_service

router = APIRouter()

@router.get("/stats", response_model=FinanceDashboardStats)
def get_finance_stats(
    db: Session = Depends(get_db),
    faculty_org: Optional[Organization] = Depends(get_user_faculty_org)
):
    return finance_service.get_faculty_finance_stats(db, faculty_org=faculty_org)

@router.get("/transactions", response_model=List[TransactionResponse])
def get_transactions(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    faculty_org: Optional[Organization] = Depends(get_user_faculty_org)
):
    return finance_service.get_transactions(db, skip=skip, limit=limit, faculty_org=faculty_org)

@router.post("/transactions", response_model=TransactionResponse)
def create_transaction(
    *,
    db: Session = Depends(get_db),
    txn_in: TransactionCreate
):
    return finance_service.create_transaction(db, txn_in=txn_in)

@router.get("/student-fees", response_model=StudentFeeOverviewResponse)
def get_student_fees(
    db: Session = Depends(get_db),
    faculty_org: Optional[Organization] = Depends(get_user_faculty_org)
):
    return finance_service.get_student_fees_overview(db, faculty_org=faculty_org)

@router.put("/student-fees/{fee_id}/status")
def update_student_fee_status(
    fee_id: UUID,
    status: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    fee = finance_service.toggle_student_fee_status(db, fee_id=fee_id, new_status=status)
    return {
        "id": str(fee.id),
        "status": fee.status,
        "paid_at": fee.paid_at.isoformat() if fee.paid_at else None,
        "message": f"Cập nhật trạng thái Đoàn phí thành công ({fee.status})"
    }

# Approve a pending expense transaction
@router.put("/transactions/{transaction_id}/approve", response_model=TransactionResponse)
def approve_transaction(
    transaction_id: UUID,
    db: Session = Depends(get_db)
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
