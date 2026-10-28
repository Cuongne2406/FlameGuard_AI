from typing import Optional, List
from sqlalchemy import func
from sqlalchemy.orm import Session
from uuid import UUID
from fastapi import HTTPException
from app.models.finance import Budget, FundRequest, Asset, AssetLoan, FinanceTransaction, TransactionType, StudentFee, FundRequestStatus
from app.models.core import AcademicTerm, User, Organization
from datetime import datetime, date
from app.schemas.finance_schemas import (
    BudgetCreate, BudgetUpdate,
    FundRequestCreate, FundRequestUpdate, FundRequestResponse,
    AssetCreate, AssetUpdate,
    AssetLoanCreate, AssetLoanUpdate,
    TransactionCreate,
    StudentFeeItemResponse, StudentFeeOverviewResponse
)
from app.services import notification_service
from app.schemas.notification_schemas import NotificationCreate

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
def create_fund_request(
    db: Session, 
    request_in: FundRequestCreate, 
    user: Optional[User] = None, 
    faculty_org: Optional[Organization] = None
):
    budget_id = request_in.budget_id
    if not budget_id and faculty_org:
        current_term = db.query(AcademicTerm).filter(AcademicTerm.is_current == True).first()
        term_id = current_term.id if current_term else db.query(AcademicTerm).first().id
        budget = db.query(Budget).filter(Budget.organization_id == faculty_org.id).first()
        if not budget:
            budget = Budget(
                organization_id=faculty_org.id, 
                academic_term_id=term_id, 
                total_amount=50000000, 
                used_amount=0
            )
            db.add(budget)
            db.commit()
            db.refresh(budget)
        budget_id = budget.id

    if not budget_id:
        budget = db.query(Budget).first()
        if budget:
            budget_id = budget.id
        else:
            raise HTTPException(status_code=400, detail="Chưa có ngân sách nào được thiết lập")

    req_data = request_in.dict()
    req_data["budget_id"] = budget_id
    if user and not req_data.get("requested_by"):
        req_data["requested_by"] = user.id
    elif not req_data.get("requested_by"):
        if user:
            req_data["requested_by"] = user.id
        else:
            first_user = db.query(User).first()
            if first_user:
                req_data["requested_by"] = first_user.id

    req_data["status"] = FundRequestStatus.PENDING
    db_request = FundRequest(**req_data)
    db.add(db_request)
    db.commit()
    db.refresh(db_request)
    return db_request

def get_fund_requests(db: Session, skip: int = 0, limit: int = 100, faculty_org: Optional[Organization] = None):
    query = db.query(FundRequest)
    if faculty_org:
        query = query.join(Budget, FundRequest.budget_id == Budget.id).filter(
            (Budget.organization_id == faculty_org.id) | 
            (FundRequest.requested_by == faculty_org.leader_user_id)
        )
    requests = query.order_by(FundRequest.id.desc()).offset(skip).limit(limit).all()
    results = []
    for r in requests:
        res = FundRequestResponse.from_orm(r)
        if r.requester:
            res.requester_name = r.requester.full_name
        if r.budget and r.budget.organization:
            res.budget_name = r.budget.organization.name
        results.append(res)
    return results

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

    # Gửi thông báo nếu thay đổi trạng thái quỹ
    if new_status != old_status and new_status in ["APPROVED", "REJECTED", "DISBURSED"]:
        try:
            notif_title = "Cập nhật Phiếu Xin Cấu Quỹ"
            notif_msg = f"Yêu cầu cấp quỹ của bạn đã được cập nhật thành: {new_status}"
            if new_status == "DISBURSED":
                notif_title = "Giải ngân thành công"
                notif_msg = f"Yêu cầu cấp vốn {db_request.amount}đ của bạn đã được giải ngân."
                
            notification_service.create_notification(
                db=db,
                notification_in=NotificationCreate(
                    user_id=db_request.requested_by,
                    title=notif_title,
                    message=notif_msg
                )
            )
        except Exception:
            pass

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

    # Gửi thông báo đổi trạng thái Mượn Tài sản
    if loan_in.status:
        try:
            new_st = loan_in.status.value if hasattr(loan_in.status, "value") else loan_in.status
            notification_service.create_notification(
                db=db,
                notification_in=NotificationCreate(
                    user_id=db_loan.borrowed_by,
                    title="Cấu nhật Mượn Tài sản",
                    message=f"Phiếu mượn tài sản của bạn đã chuyển sang trạng thái: {new_st}."
                )
            )
        except Exception:
            pass

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

def get_transactions(db: Session, skip: int = 0, limit: int = 100, faculty_org: Optional[Organization] = None):
    query = db.query(FinanceTransaction)
    if faculty_org:
        query = query.join(Budget, FinanceTransaction.budget_id == Budget.id).filter(
            Budget.organization_id == faculty_org.id
        )
    return query.order_by(FinanceTransaction.created_at.desc()).offset(skip).limit(limit).all()

def get_faculty_finance_stats(db: Session, faculty_org: Optional[Organization] = None):
    # 1. Quỹ hiện tại (Budget)
    budget_query = db.query(Budget.total_amount, Budget.used_amount)
    if faculty_org:
        budget_query = budget_query.filter(Budget.organization_id == faculty_org.id)
    budgets = budget_query.all()
    fund_sum = sum(b[0] for b in budgets) or 0
    used_sum = sum(b[1] for b in budgets) or 0
    
    # 2. Tổng Thu/Chi từ Transactions
    txn_query = db.query(FinanceTransaction)
    if faculty_org:
        txn_query = txn_query.join(Budget, FinanceTransaction.budget_id == Budget.id).filter(
            Budget.organization_id == faculty_org.id
        )
        
    total_income = sum(t.amount for t in txn_query.filter(FinanceTransaction.type == TransactionType.INCOME).all()) or 0
    total_expense = sum(t.amount for t in txn_query.filter(FinanceTransaction.type == TransactionType.EXPENSE).all()) or 0
    
    # 3. Tiến độ thu Đoàn phí (Fee Progress)
    current_term = db.query(AcademicTerm).filter(AcademicTerm.is_current == True).first()
    term_name = f"{current_term.semester_name} {current_term.year_name}" if current_term else "Kỳ học hiện tại"
    
    student_query = db.query(User)
    fee_query = db.query(StudentFee).filter(StudentFee.status == "PAID")
    if current_term:
        fee_query = fee_query.filter(StudentFee.academic_term_id == current_term.id)
        
    if faculty_org:
        class_orgs = db.query(Organization.id).filter(Organization.parent_id == faculty_org.id).all()
        class_ids = [c[0] for c in class_orgs]
        if class_ids:
            student_query = student_query.filter(User.class_id.in_(class_ids))
            fee_query = fee_query.join(User, StudentFee.user_id == User.id).filter(User.class_id.in_(class_ids))
            
    total_students = student_query.count()
    paid_students = fee_query.count()
    fee_percent = (paid_students / total_students * 100) if total_students > 0 else 0
    
    # 4. Chi tiêu trong tháng (Monthly Expense)
    today = date.today()
    start_of_month = datetime(today.year, today.month, 1)
    monthly_exp_q = db.query(func.sum(FinanceTransaction.amount)).filter(
        FinanceTransaction.type == TransactionType.EXPENSE,
        FinanceTransaction.created_at >= start_of_month
    )
    if faculty_org:
        monthly_exp_q = monthly_exp_q.join(Budget, FinanceTransaction.budget_id == Budget.id).filter(
            Budget.organization_id == faculty_org.id
        )
    monthly_exp_sum = monthly_exp_q.scalar() or 0
    
    # 5. Top category chi (Category)
    top_cat_q = db.query(FinanceTransaction.title).filter(
        FinanceTransaction.type == TransactionType.EXPENSE
    )
    if faculty_org:
        top_cat_q = top_cat_q.join(Budget, FinanceTransaction.budget_id == Budget.id).filter(
            Budget.organization_id == faculty_org.id
        )
    top_cat = top_cat_q.order_by(FinanceTransaction.amount.desc()).first()
    top_cat_name = top_cat[0] if top_cat else "Chưa có chi tiêu"
    
    # 6. Nguồn tài trợ ngoài (External Funding)
    ext_q = db.query(func.sum(FinanceTransaction.amount)).filter(
        FinanceTransaction.type == TransactionType.INCOME,
        FinanceTransaction.title.like("%Tài trợ%")
    )
    if faculty_org:
        ext_q = ext_q.join(Budget, FinanceTransaction.budget_id == Budget.id).filter(
            Budget.organization_id == faculty_org.id
        )
    external_income = ext_q.scalar() or 0
    
    sponsor_q = db.query(FinanceTransaction.title).filter(
        FinanceTransaction.type == TransactionType.INCOME,
        FinanceTransaction.title.like("%Tài trợ%")
    )
    if faculty_org:
        sponsor_q = sponsor_q.join(Budget, FinanceTransaction.budget_id == Budget.id).filter(
            Budget.organization_id == faculty_org.id
        )
    latest_sponsor_txn = sponsor_q.order_by(FinanceTransaction.created_at.desc()).first()
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
            "remainingCount": max(0, total_students - paid_students)
        },
        "monthlyExpense": float(monthly_exp_sum),
        "topExpenseCategory": top_cat_name,
        "externalFunding": float(external_income),
        "latestSponsor": latest_sponsor_name
    }

def get_student_fees_overview(db: Session, faculty_org: Optional[Organization] = None):
    query = db.query(StudentFee).join(User, StudentFee.user_id == User.id)
    if faculty_org:
        class_orgs = db.query(Organization.id).filter(Organization.parent_id == faculty_org.id).all()
        class_ids = [c[0] for c in class_orgs]
        if class_ids:
            query = query.filter(User.class_id.in_(class_ids))
            
    fees = query.order_by(StudentFee.status.desc(), StudentFee.title).all()
    
    total_students = len(fees)
    paid_count = sum(1 for f in fees if f.status == "PAID")
    pending_count = total_students - paid_count
    total_collected = sum(float(f.amount) for f in fees if f.status == "PAID")
    percent_paid = (paid_count / total_students * 100) if total_students > 0 else 0.0

    items = []
    for f in fees:
        user_class = None
        if f.user and f.user.class_id:
            cls = db.query(Organization).filter(Organization.id == f.user.class_id).first()
            if cls:
                user_class = cls.name
                
        items.append(StudentFeeItemResponse(
            id=f.id,
            user_id=f.user_id,
            full_name=f.user.full_name if f.user else "N/A",
            student_id=f.user.student_id if f.user else "N/A",
            class_name=user_class or "Khoa CNTT",
            title=f.title,
            amount=float(f.amount),
            status=f.status,
            paid_at=f.paid_at
        ))
        
    return {
        "totalStudents": total_students,
        "paidCount": paid_count,
        "pendingCount": pending_count,
        "totalCollected": total_collected,
        "percentPaid": round(percent_paid, 1),
        "items": items
    }

def toggle_student_fee_status(db: Session, fee_id: UUID, new_status: Optional[str] = None):
    fee = db.query(StudentFee).filter(StudentFee.id == fee_id).first()
    if not fee:
        raise HTTPException(status_code=404, detail="Student fee not found")
    if new_status:
        fee.status = new_status
    else:
        fee.status = "PAID" if fee.status == "PENDING" else "PENDING"
    if fee.status == "PAID":
        fee.paid_at = datetime.utcnow()
    else:
        fee.paid_at = None
    db.commit()
    db.refresh(fee)
    return fee
