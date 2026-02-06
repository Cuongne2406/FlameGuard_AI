from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func, extract
from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel
from app.api.deps import get_db, get_current_user
from app.models.transaction import Transaction, TransactionType
from app.models.user import User

router = APIRouter()

class TransactionCreate(BaseModel):
    title: str
    amount: float
    type: str # INCOME hoặc EXPENSE
    category: str = "General"

# 1. API Tạo giao dịch (Thu/Chi)
@router.post("/", status_code=201)
def create_transaction(
    trans_in: TransactionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role not in ["SUPER_ADMIN", "ADMIN", "SUB_ADMIN"]:
        raise HTTPException(status_code=403, detail="Không đủ quyền")

    new_trans = Transaction(
        title=trans_in.title,
        amount=trans_in.amount,
        type=trans_in.type,
        category=trans_in.category,
        creator_id=current_user.id
    )
    db.add(new_trans)
    db.commit()
    return {"message": "Giao dịch thành công"}

# 2. API Lấy danh sách & Thống kê
@router.get("/")
def get_transactions(
    db: Session = Depends(get_db),
    search: Optional[str] = None,
    month: Optional[int] = None,
    year: Optional[int] = None
):
    # --- A. Lấy danh sách giao dịch ---
    query = db.query(Transaction)
    if search:
        query = query.filter(Transaction.title.ilike(f"%{search}%"))
    if month and year:
        query = query.filter(
            extract('month', Transaction.created_at) == month,
            extract('year', Transaction.created_at) == year
        )
    
    transactions = query.order_by(Transaction.created_at.desc()).all()

    # --- B. Tính toán thống kê (Tổng quỹ, Thu/Chi tháng này) ---
    # 1. Tổng quỹ (Tất cả Thu - Tất cả Chi từ trước đến nay)
    total_income = db.query(func.sum(Transaction.amount)).filter(Transaction.type == "INCOME").scalar() or 0
    total_expense = db.query(func.sum(Transaction.amount)).filter(Transaction.type == "EXPENSE").scalar() or 0
    balance = total_income - total_expense

    # 2. Thống kê Tháng Này (hoặc tháng được chọn)
    now = datetime.now()
    target_month = month or now.month
    target_year = year or now.year

    month_income = db.query(func.sum(Transaction.amount)).filter(
        Transaction.type == "INCOME",
        extract('month', Transaction.created_at) == target_month,
        extract('year', Transaction.created_at) == target_year
    ).scalar() or 0

    month_expense = db.query(func.sum(Transaction.amount)).filter(
        Transaction.type == "EXPENSE",
        extract('month', Transaction.created_at) == target_month,
        extract('year', Transaction.created_at) == target_year
    ).scalar() or 0

    return {
        "stats": {
            "balance": balance,
            "month_income": month_income,
            "month_expense": month_expense
        },
        "transactions": transactions
    }