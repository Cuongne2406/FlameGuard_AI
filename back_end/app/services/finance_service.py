from sqlalchemy import func
from sqlalchemy.orm import Session
from uuid import UUID
from fastapi import HTTPException
from app.models.finance import Budget, FundRequest, Asset, AssetLoan, FinanceTransaction, TransactionType, StudentFee
from app.models.core import AcademicTerm, User
from datetime import datetime, date
from app.schemas.finance_schemas import (
    BudgetCreate, BudgetUpdate,
    FundRequestCreate, FundRequestUpdate,
    AssetCreate, AssetUpdate,
    AssetLoanCreate, AssetLoanUpdate,
    TransactionCreate
)

# ==========================================
# Budget Services
# ==========================================
def create_budget(db: Session, budget_in: BudgetCreate):
    db_budget = Budget(**budget_in.dict())
    db.add(db_budget)
    db.commit()
    db.refresh(db_budget)
    return db_budget

def get_budgets(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Budget).offset(skip).limit(limit).all()

def update_budget(db: Session, budget_id: UUID, budget_in: BudgetUpdate):
    db_budget = db.query(Budget).filter(Budget.id == budget_id).first()
    if not db_budget:
        raise HTTPException(status_code=404, detail="Budget not found")
    
    update_data = budget_in.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_budget, key, value)
        
    db.commit()
    db.refresh(db_budget)
    return db_budget

def delete_budget(db: Session, budget_id: UUID):
    db_budget = db.query(Budget).filter(Budget.id == budget_id).first()
    if not db_budget:
        raise HTTPException(status_code=404, detail="Budget not found")
    db.delete(db_budget)
    db.commit()
    return {"message": "Budget deleted successfully"}


# ==========================================
# Fund Request Services
# ==========================================
def create_fund_request(db: Session, request_in: FundRequestCreate):
    # Determine if budget has enough funds (Optional business logic)
    budget = db.query(Budget).filter(Budget.id == request_in.budget_id).first()
    if not budget:
        raise HTTPException(status_code=404, detail="Budget not found")
        
    available = budget.total_amount - budget.used_amount
    if request_in.amount > available:
         raise HTTPException(status_code=400, detail="Requested amount exceeds available budget")

    db_request = FundRequest(**request_in.dict())
    db.add(db_request)
    db.commit()
    db.refresh(db_request)
    return db_request

def get_fund_requests(db: Session, skip: int = 0, limit: int = 100):
    return db.query(FundRequest).offset(skip).limit(limit).all()

def update_fund_request(db: Session, request_id: UUID, request_in: FundRequestUpdate):
    db_request = db.query(FundRequest).filter(FundRequest.id == request_id).first()
    if not db_request:
        raise HTTPException(status_code=404, detail="Fund request not found")
    
    # Process approval logic if status changes to APPROVED or DISBURSED
    old_status = db_request.status.value
    new_status = request_in.status.value if request_in.status else old_status

    if old_status != "Disbursed" and new_status == "Disbursed":
        # Deduct from budget
        budget = db.query(Budget).filter(Budget.id == db_request.budget_id).first()
        budget.used_amount += db_request.amount

    update_data = request_in.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_request, key, value)
        
    db.commit()
    db.refresh(db_request)
    return db_request


# ==========================================
# Asset Services
# ==========================================
def create_asset(db: Session, asset_in: AssetCreate):
    db_asset = Asset(**asset_in.dict())
    db.add(db_asset)
    db.commit()
    db.refresh(db_asset)
    return db_asset

def get_assets(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Asset).offset(skip).limit(limit).all()

def update_asset(db: Session, asset_id: UUID, asset_in: AssetUpdate):
    db_asset = db.query(Asset).filter(Asset.id == asset_id).first()
    if not db_asset:
        raise HTTPException(status_code=404, detail="Asset not found")
    
    update_data = asset_in.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_asset, key, value)
        
    db.commit()
    db.refresh(db_asset)
    return db_asset

def delete_asset(db: Session, asset_id: UUID):
    db_asset = db.query(Asset).filter(Asset.id == asset_id).first()
    if not db_asset:
        raise HTTPException(status_code=404, detail="Asset not found")
    db.delete(db_asset)
    db.commit()
    return {"message": "Asset deleted successfully"}


# ==========================================
# Asset Loan Services
# ==========================================
def create_asset_loan(db: Session, loan_in: AssetLoanCreate):
    # Check if asset exists and has enough quantity
    asset = db.query(Asset).filter(Asset.id == loan_in.asset_id).first()
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")
        
    # Optional logic: verify available quantity by checking current strictly borrowed loans
    current_loans = sum(
        loan.borrowed_quantity for loan in db.query(AssetLoan).filter(
            AssetLoan.asset_id == asset.id,
            AssetLoan.status == "Borrowed"
        ).all()
    )
    
    available_qty = asset.quantity - current_loans
    if loan_in.borrowed_quantity > available_qty:
        raise HTTPException(status_code=400, detail="Not enough available assets to loan")

    db_loan = AssetLoan(**loan_in.dict())
    db.add(db_loan)
    db.commit()
    db.refresh(db_loan)
    return db_loan

def get_asset_loans(db: Session, skip: int = 0, limit: int = 100):
    return db.query(AssetLoan).offset(skip).limit(limit).all()

def update_asset_loan(db: Session, loan_id: UUID, loan_in: AssetLoanUpdate):
    db_loan = db.query(AssetLoan).filter(AssetLoan.id == loan_id).first()
    if not db_loan:
        raise HTTPException(status_code=404, detail="Asset loan not found")
    
    update_data = loan_in.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_loan, key, value)
        
    db.commit()
    db.refresh(db_loan)
    return db_loan

# ==========================================
# Finance Transaction Services
# ==========================================
def create_transaction(db: Session, txn_in: TransactionCreate):
    db_txn = FinanceTransaction(**txn_in.dict())
    
    # Update Budget
    budget = db.query(Budget).filter(Budget.id == txn_in.budget_id).first()
    if budget:
        if txn_in.type.value == "INCOME":
            budget.total_amount += txn_in.amount
        else:
            budget.used_amount += txn_in.amount
            
    db.add(db_txn)
    db.commit()
    db.refresh(db_txn)
    return db_txn

def get_transactions(db: Session, skip: int = 0, limit: int = 100):
    return db.query(FinanceTransaction).order_by(FinanceTransaction.created_at.desc()).offset(skip).limit(limit).all()

def get_faculty_finance_stats(db: Session):
    # 1. Quỹ hiện tại (Budget)
    total_fund = db.query(Budget.total_amount).all()
    total_used = db.query(Budget.used_amount).all()
    fund_sum = sum(f[0] for f in total_fund) or 0
    used_sum = sum(u[0] for u in total_used) or 0
    
    # 2. Tổng Thu/Chi từ Transactions
    income_txns = db.query(FinanceTransaction.amount).filter(FinanceTransaction.type == TransactionType.INCOME).all()
    expense_txns = db.query(FinanceTransaction.amount).filter(FinanceTransaction.type == TransactionType.EXPENSE).all()
    total_income = sum(t[0] for t in income_txns) or 0
    total_expense = sum(t[0] for t in expense_txns) or 0
    
    # 3. Tiến độ thu Đoàn phí (Fee Progress)
    current_term = db.query(AcademicTerm).filter(AcademicTerm.is_current == True).first()
    term_name = f"{current_term.semester_name} {current_term.year_name}" if current_term else "Kỳ học hiện tại"
    
    total_students = db.query(User).count()
    paid_students = db.query(StudentFee).filter(
        StudentFee.status == "PAID",
        StudentFee.academic_term_id == (current_term.id if current_term else None)
    ).count()
    
    fee_percent = (paid_students / total_students * 100) if total_students > 0 else 0
    
    # 4. Chi tiêu trong tháng (Monthly Expense)
    today = date.today()
    start_of_month = datetime(today.year, today.month, 1)
    monthly_exp_sum = db.query(func.sum(FinanceTransaction.amount)).filter(
        FinanceTransaction.type == TransactionType.EXPENSE,
        FinanceTransaction.created_at >= start_of_month
    ).scalar() or 0
    
    # 5. Top category chi (Category)
    # Giả định lấy title có nhiều tiền nhất hoặc category nếu có
    top_cat = db.query(FinanceTransaction.title).filter(
        FinanceTransaction.type == TransactionType.EXPENSE
    ).order_by(FinanceTransaction.amount.desc()).first()
    top_cat_name = top_cat[0] if top_cat else "Chưa có chi tiêu"
    
    # 6. Nguồn tài trợ ngoài (External Funding)
    # Giả định lọc transactions có title chứa "Tài trợ" hoặc category "SPONSOR"
    external_income = db.query(func.sum(FinanceTransaction.amount)).filter(
        FinanceTransaction.type == TransactionType.INCOME,
        FinanceTransaction.title.like("%Tài trợ%")
    ).scalar() or 0
    
    latest_sponsor_txn = db.query(FinanceTransaction.title).filter(
        FinanceTransaction.type == TransactionType.INCOME,
        FinanceTransaction.title.like("%Tài trợ%")
    ).order_by(FinanceTransaction.created_at.desc()).first()
    latest_sponsor_name = latest_sponsor_txn[0] if latest_sponsor_txn else "Chưa có tài trợ"

    return {
        "totalFund": float(fund_sum - used_sum),
        "totalIncome": float(total_income),
        "totalExpense": float(total_expense),
        "remaining": float(fund_sum - used_sum),
        "feeProgress": {
            "percent": round(fee_percent, 1),
            "paidCount": paid_students,
            "totalCount": total_students,
            "termName": term_name,
            "remainingCount": total_students - paid_students
        },
        "monthlyExpense": float(monthly_exp_sum),
        "topExpenseCategory": top_cat_name,
        "externalFunding": float(external_income),
        "latestSponsor": latest_sponsor_name
    }
