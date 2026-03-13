from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
from uuid import UUID

from app.api.deps import get_db
from app.schemas.finance_schemas import BudgetCreate, BudgetUpdate, BudgetResponse
from app.services import finance_service
from app.models.finance import Budget

router = APIRouter()

@router.post("/", response_model=BudgetResponse)
def create_budget(
    *,
    db: Session = Depends(get_db),
    budget_in: BudgetCreate,
):
    return finance_service.create_budget(db=db, budget_in=budget_in)

@router.get("/", response_model=List[BudgetResponse])
def read_budgets(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    return finance_service.get_budgets(db, skip=skip, limit=limit)

@router.get("/stats")
def get_budget_stats(db: Session = Depends(get_db)):
    """Fetch budget statistics for Admin Finance Dashboard"""
    total_income = db.query(func.sum(Budget.total_amount)).scalar() or 0
    total_expense = db.query(func.sum(Budget.used_amount)).scalar() or 0
    return {
        "totalIncome": float(total_income),
        "totalExpense": float(total_expense),
        "remaining": float(total_income - total_expense)
    }

@router.put("/{budget_id}", response_model=BudgetResponse)
def update_budget(
    *,
    db: Session = Depends(get_db),
    budget_id: UUID,
    budget_in: BudgetUpdate,
):
    return finance_service.update_budget(db=db, budget_id=budget_id, budget_in=budget_in)

@router.delete("/{budget_id}")
def delete_budget(
    *,
    db: Session = Depends(get_db),
    budget_id: UUID,
):
    return finance_service.delete_budget(db=db, budget_id=budget_id)
