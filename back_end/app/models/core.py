import uuid
from sqlalchemy import Column, String, Boolean, Enum, ForeignKey, Date, Table
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from app.db.base_class import Base
import enum

class UserStatus(enum.Enum):
    ACTIVE = "ACTIVE"
    INACTIVE = "INACTIVE"
    SUSPENDED = "SUSPENDED"

class OrgType(enum.Enum):
    UNIVERSITY = "UNIVERSITY"
    FACULTY = "FACULTY"
    CLUB = "CLUB"
    CLASS = "CLASS"

class AuthProvider(enum.Enum):
    LOCAL = "LOCAL"
    S4H = "S4H"

class OrgStatus(enum.Enum):
    ACTIVE = "ACTIVE"
    INACTIVE = "INACTIVE"

# Association tables
role_permissions = Table(
    "role_permissions",
    Base.metadata,
    Column("role_id", UUID(as_uuid=True), ForeignKey("roles.id"), primary_key=True),
    Column("permission_id", UUID(as_uuid=True), ForeignKey("permissions.id"), primary_key=True),
)

user_roles = Table(
    "user_roles",
    Base.metadata,
    Column("user_id", UUID(as_uuid=True), ForeignKey("users.id"), primary_key=True),
    Column("role_id", UUID(as_uuid=True), ForeignKey("roles.id"), primary_key=True),
)

class User(Base):
    __tablename__ = "users"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    student_id = Column(String, unique=True, index=True)
    full_name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=True) # Tương thích S4H (có thể Null)
    auth_provider = Column(Enum(AuthProvider), default=AuthProvider.LOCAL, nullable=False)
    phone_number = Column(String)
    status = Column(Enum(UserStatus), default=UserStatus.ACTIVE)
    avatar_url = Column(String)
    last_login_at = Column(Date)
    
    roles = relationship("Role", secondary=user_roles, back_populates="users")
    organizations = relationship("UserOrganization", back_populates="user")
    event_registrations = relationship("EventRegistration", back_populates="user")
    fund_requests = relationship("FundRequest", foreign_keys="[FundRequest.requested_by]", back_populates="requester")
    asset_loans = relationship("AssetLoan", back_populates="borrower")

class Role(Base):
    __tablename__ = "roles"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, unique=True, index=True, nullable=False)
    description = Column(String)
    
    users = relationship("User", secondary=user_roles, back_populates="roles")
    permissions = relationship("Permission", secondary=role_permissions, back_populates="roles")

class Permission(Base):
    __tablename__ = "permissions"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    resource_name = Column(String, nullable=False)
    action = Column(String, nullable=False)
    
    roles = relationship("Role", secondary=role_permissions, back_populates="permissions")

class Organization(Base):
    __tablename__ = "organizations"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    parent_id = Column(UUID(as_uuid=True), ForeignKey("organizations.id"), nullable=True)
    name = Column(String, nullable=False)
    type = Column(Enum(OrgType), nullable=False)
    description = Column(String)
    status = Column(Enum(OrgStatus), default=OrgStatus.ACTIVE)
    
    parent = relationship("Organization", remote_side=[id], backref="children")
    members = relationship("UserOrganization", back_populates="organization")
    campaigns = relationship("Campaign", back_populates="organization")
    budgets = relationship("Budget", back_populates="organization")
    assets = relationship("Asset", back_populates="organization")

class UserOrganization(Base):
    __tablename__ = "user_organizations"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    organization_id = Column(UUID(as_uuid=True), ForeignKey("organizations.id"), nullable=False)
    title = Column(String) # Ví dụ: Bí thư, Chủ nhiệm...
    is_primary = Column(Boolean, default=False)
    joined_date = Column(Date)
    
    user = relationship("User", back_populates="organizations")
    organization = relationship("Organization", back_populates="members")

class AcademicTerm(Base):
    __tablename__ = "academic_terms"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    year_name = Column(String, nullable=False)
    semester_name = Column(String, nullable=False)
    start_date = Column(Date)
    end_date = Column(Date)
    is_current = Column(Boolean, default=False)
    
    campaigns = relationship("Campaign", back_populates="academic_term")
    budgets = relationship("Budget", back_populates="academic_term")
