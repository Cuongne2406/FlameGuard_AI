from pydantic import BaseModel
from typing import Optional, List
from uuid import UUID
from datetime import datetime
from enum import Enum
from decimal import Decimal

# ==========================================
# Enums from Models
# ==========================================
class FundRequestStatusEnum(str, Enum):
    PENDING = "PENDING"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"
    DISBURSED = "DISBURSED"

class AssetStatusEnum(str, Enum):
    AVAILABLE = "AVAILABLE"
    IN_USE = "IN_USE"
    MAINTENANCE = "MAINTENANCE"
    BROKEN = "BROKEN"

class AssetLoanStatusEnum(str, Enum):
    REQUESTED = "REQUESTED"
    APPROVED = "APPROVED"
    BORROWED = "BORROWED"
    RETURNED = "RETURNED"
    OVERDUE = "OVERDUE"

# ==========================================
# Budget Schemas
# ==========================================
class BudgetBase(BaseModel):
    total_amount: Decimal = Decimal("0.00")
    used_amount: Decimal = Decimal("0.00")

class BudgetCreate(BudgetBase):
    organization_id: UUID
    academic_term_id: UUID

class BudgetUpdate(BaseModel):
    total_amount: Optional[Decimal] = None
    used_amount: Optional[Decimal] = None

class BudgetResponse(BudgetBase):
    id: UUID
    organization_id: UUID
    academic_term_id: UUID

    class Config:
        from_attributes = True


# ==========================================
# Fund Request Schemas
# ==========================================
class FundRequestBase(BaseModel):
    amount: Decimal
    reason: Optional[str] = None
    status: FundRequestStatusEnum = FundRequestStatusEnum.PENDING

class FundRequestCreate(FundRequestBase):
    budget_id: UUID
    event_id: Optional[UUID] = None
    requested_by: UUID

class FundRequestUpdate(BaseModel):
    amount: Optional[Decimal] = None
    reason: Optional[str] = None
    status: Optional[FundRequestStatusEnum] = None
    approved_by: Optional[UUID] = None
    approved_at: Optional[datetime] = None

class FundRequestResponse(FundRequestBase):
    id: UUID
    budget_id: UUID
    event_id: Optional[UUID] = None
    requested_by: UUID
    approved_by: Optional[UUID] = None
    approved_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ==========================================
# Asset Schemas
# ==========================================
class AssetBase(BaseModel):
    name: str
    description: Optional[str] = None
    quantity: int = 1
    unit: Optional[str] = None
    storage_location: Optional[str] = None
    status: AssetStatusEnum = AssetStatusEnum.AVAILABLE

class AssetCreate(AssetBase):
    organization_id: UUID

class AssetUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    quantity: Optional[int] = None
    unit: Optional[str] = None
    storage_location: Optional[str] = None
    status: Optional[AssetStatusEnum] = None

class AssetResponse(AssetBase):
    id: UUID
    organization_id: UUID

    class Config:
        from_attributes = True


# ==========================================
# Asset Loan Schemas
# ==========================================
class AssetLoanBase(BaseModel):
    borrowed_quantity: int = 1
    borrow_date: Optional[datetime] = None
    expected_return_date: Optional[datetime] = None
    actual_return_date: Optional[datetime] = None
    status: AssetLoanStatusEnum = AssetLoanStatusEnum.REQUESTED

class AssetLoanCreate(AssetLoanBase):
    asset_id: UUID
    borrowed_by: UUID

class AssetLoanUpdate(BaseModel):
    borrowed_quantity: Optional[int] = None
    borrow_date: Optional[datetime] = None
    expected_return_date: Optional[datetime] = None
    actual_return_date: Optional[datetime] = None
    status: Optional[AssetLoanStatusEnum] = None

class AssetLoanResponse(AssetLoanBase):
    id: UUID
    asset_id: UUID
    borrowed_by: UUID

    class Config:
        from_attributes = True
