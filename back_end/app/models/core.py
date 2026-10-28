import uuid
from sqlalchemy import Column, String, Integer, Float, Boolean, Enum, ForeignKey, Date, Table, Text, Numeric, DateTime, func
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
    level = Column(Integer, default=1)
    training_score = Column(Integer, default=0)
    class_id = Column(UUID(as_uuid=True), ForeignKey("organizations.id"), nullable=True)
    class_name = Column(String, nullable=True) # Denormalized for display speed
    academic_year = Column(Integer, nullable=True) # e.g. 2021
    bio = Column(Text, nullable=True)
    social_links = Column(String, nullable=True) # Store as JSON string or URL
    device_id = Column(String, nullable=True)
    push_token = Column(String, nullable=True)
    is_profile_updated = Column(Boolean, default=False)
    
    # Thông tin cá nhân phục vụ SV5T
    cccd = Column(String, nullable=True)
    gender = Column(String, nullable=True, default="Nam")
    date_of_birth = Column(Date, nullable=True)
    ethnicity = Column(String, nullable=True, default="Kinh")
    religion = Column(String, nullable=True, default="Không")
    address = Column(String, nullable=True)
    
    # Thông tin học tập phục vụ SV5T
    academic_year_num = Column(Integer, nullable=True, default=3)
    school_name = Column(String, nullable=True, default="Trường Đại học Lạc Hồng")
    faculty_name = Column(String, nullable=True)
    education_level = Column(String, nullable=True, default="Đại học")
    gpa = Column(Float, nullable=True, default=0.0)
    
    # Đoàn - Hội & Thành tích phục vụ SV5T
    union_position = Column(String, nullable=True, default="Đoàn viên")
    political_status = Column(String, nullable=True, default="Đoàn viên")
    achievement_summary = Column(Text, nullable=True)
    
    # Settings & Profile
    is_2fa_enabled = Column(Boolean, default=False)
    otp_code = Column(String, nullable=True)
    otp_expires_at = Column(DateTime, nullable=True)
    email_alerts_enabled = Column(Boolean, default=True)
    zalo_alerts_enabled = Column(Boolean, default=True)
    daily_digest_enabled = Column(Boolean, default=False)
    
    roles = relationship("Role", secondary=user_roles, back_populates="users")
    organizations = relationship("UserOrganization", back_populates="user")
    study_class = relationship("Organization", foreign_keys=[class_id])
    event_registrations = relationship("EventRegistration", back_populates="user")
    fund_requests = relationship("FundRequest", foreign_keys="[FundRequest.requested_by]", back_populates="requester")
    asset_loans = relationship("AssetLoan", back_populates="borrower")
    skills = relationship("UserSkill", back_populates="user", cascade="all, delete-orphan")
    experiences = relationship("UserExperience", back_populates="user", cascade="all, delete-orphan")

class UserSkill(Base):
    __tablename__ = "user_skills"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    name = Column(String, nullable=False)
    level = Column(Integer, default=0)
    
    user = relationship("User", back_populates="skills")

class UserExperience(Base):
    __tablename__ = "user_experiences"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    role = Column(String, nullable=False)
    location = Column(String)
    period = Column(String) # e.g., "2023 - Nay"
    bullets = Column(String) # Store as JSON string or text for simplicity
    
    user = relationship("User", back_populates="experiences")

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
    
    # Extended fields for Classes & Clubs
    fee_percentage = Column(Numeric(5, 2), default=0.0)
    avatar_url = Column(String)
    icon = Column(String)
    warning_message = Column(Text, nullable=True)
    warning_deadline = Column(DateTime, nullable=True)
    last_activity_at = Column(DateTime, nullable=True)
    leader_user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    contact_email = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    activity_points = Column(Integer, default=0)
    classification = Column(String, nullable=True)
    
    parent = relationship("Organization", remote_side=[id], backref="children")
    leader = relationship("User", foreign_keys=[leader_user_id])
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

class ClubProposal(Base):
    __tablename__ = "club_proposals"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    organization_id = Column(UUID(as_uuid=True), ForeignKey("organizations.id"), nullable=True) # Linked club if already exists
    title = Column(String, nullable=False)
    description = Column(Text)
    amount = Column(Numeric(15, 2), nullable=True)
    requested_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    status = Column(String, default="PENDING") # PENDING, APPROVED, REJECTED
    created_at = Column(DateTime(timezone=True), default=func.now())
    icon = Column(String, default="help")
    
    organization = relationship("Organization")
    requester = relationship("User")

class PointCategory(Base):
    __tablename__ = "point_categories"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False) # e.g., Ethics, Academic, Community
    max_score = Column(Integer, default=20)
    description = Column(String)

class PointLog(Base):
    __tablename__ = "point_logs"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    event_id = Column(UUID(as_uuid=True), ForeignKey("events.id"), nullable=True)
    category_id = Column(UUID(as_uuid=True), ForeignKey("point_categories.id"), nullable=True)
    points = Column(Integer, nullable=False) # Positive or negative
    reason = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), default=func.now())
    
    user = relationship("User", backref="point_logs")
    event = relationship("Event")
    category = relationship("PointCategory")


