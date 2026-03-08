import uuid
from sqlalchemy import Column, String, Integer, Enum, ForeignKey, DateTime, Numeric, Text
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from app.db.base_class import Base
import enum

class FundRequestStatus(enum.Enum):
    PENDING = "PENDING"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"
    DISBURSED = "DISBURSED"

class AssetStatus(enum.Enum):
    AVAILABLE = "AVAILABLE"
    IN_USE = "IN_USE"
    MAINTENANCE = "MAINTENANCE"
    BROKEN = "BROKEN"

class AssetLoanStatus(enum.Enum):
    REQUESTED = "REQUESTED"
    APPROVED = "APPROVED"
    BORROWED = "BORROWED"
    RETURNED = "RETURNED"
    OVERDUE = "OVERDUE"

class Budget(Base):
    __tablename__ = "budgets"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    organization_id = Column(UUID(as_uuid=True), ForeignKey("organizations.id"), nullable=False)
    academic_term_id = Column(UUID(as_uuid=True), ForeignKey("academic_terms.id"), nullable=False)
    total_amount = Column(Numeric(15, 2), default=0)
    used_amount = Column(Numeric(15, 2), default=0)
    # available_amount could be a hybrid property or derived.
    
    organization = relationship("Organization", back_populates="budgets")
    academic_term = relationship("AcademicTerm", back_populates="budgets")
    fund_requests = relationship("FundRequest", back_populates="budget")

class FundRequest(Base):
    __tablename__ = "fund_requests"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    budget_id = Column(UUID(as_uuid=True), ForeignKey("budgets.id"), nullable=False)
    event_id = Column(UUID(as_uuid=True), ForeignKey("events.id"), nullable=True)
    requested_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    amount = Column(Numeric(15, 2), nullable=False)
    reason = Column(Text)
    status = Column(Enum(FundRequestStatus), default=FundRequestStatus.PENDING)
    approved_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    approved_at = Column(DateTime(timezone=True), nullable=True)
    
    budget = relationship("Budget", back_populates="fund_requests")
    event = relationship("Event", back_populates="fund_requests")
    requester = relationship("User", foreign_keys=[requested_by], back_populates="fund_requests")
    approver = relationship("User", foreign_keys=[approved_by])

class Asset(Base):
    __tablename__ = "assets"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    organization_id = Column(UUID(as_uuid=True), ForeignKey("organizations.id"), nullable=False)
    name = Column(String, nullable=False)
    description = Column(Text)
    quantity = Column(Integer, default=1)
    unit = Column(String)  # Ví dụ: Cái, Bộ, Chiếc
    storage_location = Column(String)
    status = Column(Enum(AssetStatus), default=AssetStatus.AVAILABLE)
    
    organization = relationship("Organization", back_populates="assets")
    loans = relationship("AssetLoan", back_populates="asset")

class AssetLoan(Base):
    __tablename__ = "asset_loans"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    asset_id = Column(UUID(as_uuid=True), ForeignKey("assets.id"), nullable=False)
    borrowed_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    borrowed_quantity = Column(Integer, default=1)
    borrow_date = Column(DateTime(timezone=True))
    expected_return_date = Column(DateTime(timezone=True))
    actual_return_date = Column(DateTime(timezone=True), nullable=True)
    status = Column(Enum(AssetLoanStatus), default=AssetLoanStatus.REQUESTED)
    
    asset = relationship("Asset", back_populates="loans")
    borrower = relationship("User", back_populates="asset_loans")
