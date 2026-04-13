from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from uuid import UUID
from datetime import date, datetime
from enum import Enum

# ==========================================
# Enums from Models
# ==========================================
class UserStatusEnum(str, Enum):
    ACTIVE = "ACTIVE"
    INACTIVE = "INACTIVE"
    SUSPENDED = "SUSPENDED"

class OrgTypeEnum(str, Enum):
    UNIVERSITY = "UNIVERSITY"
    FACULTY = "FACULTY"
    CLUB = "CLUB"
    CLASS = "CLASS"

class OrgStatusEnum(str, Enum):
    ACTIVE = "ACTIVE"
    INACTIVE = "INACTIVE"


# ==========================================
# Permission Schemas
# ==========================================
class PermissionBase(BaseModel):
    resource_name: str
    action: str

class PermissionCreate(PermissionBase):
    pass

class PermissionUpdate(BaseModel):
    resource_name: Optional[str] = None
    action: Optional[str] = None

class PermissionResponse(PermissionBase):
    id: UUID

    class Config:
        from_attributes = True


# ==========================================
# Role Schemas
# ==========================================
class RoleBase(BaseModel):
    name: str
    description: Optional[str] = None

class RoleCreate(RoleBase):
    permission_ids: Optional[List[UUID]] = []

class RoleUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    permission_ids: Optional[List[UUID]] = None

class RoleResponse(RoleBase):
    id: UUID
    permissions: List[PermissionResponse] = []

    class Config:
        from_attributes = True


# ==========================================
# Organization Schemas
# ==========================================
class OrganizationBase(BaseModel):
    name: str
    type: OrgTypeEnum
    description: Optional[str] = None
    parent_id: Optional[UUID] = None
    status: OrgStatusEnum = OrgStatusEnum.ACTIVE
    fee_percentage: float = 0.0
    activity_points: int = 0
    avatar_url: Optional[str] = None
    icon: Optional[str] = None
    classification: Optional[str] = None
    warning_message: Optional[str] = None
    warning_deadline: Optional[datetime] = None
    last_activity_at: Optional[datetime] = None

class OrganizationCreate(OrganizationBase):
    pass

class OrganizationUpdate(BaseModel):
    name: Optional[str] = None
    type: Optional[OrgTypeEnum] = None
    description: Optional[str] = None
    parent_id: Optional[UUID] = None
    status: Optional[OrgStatusEnum] = None
    fee_percentage: Optional[float] = None
    activity_points: Optional[int] = None
    avatar_url: Optional[str] = None
    icon: Optional[str] = None
    classification: Optional[str] = None
    warning_message: Optional[str] = None
    warning_deadline: Optional[datetime] = None
    last_activity_at: Optional[datetime] = None

class OrganizationResponse(OrganizationBase):
    id: UUID
    leader_name: Optional[str] = None
    leader_student_id: Optional[str] = None
    total_members: Optional[int] = 0

    class Config:
        from_attributes = True

class UserOrgMiniResponse(BaseModel):
    organization_id: UUID
    organization_name: str
    title: Optional[str] = None
    is_primary: bool = False
    joined_date: Optional[date] = None

    class Config:
        from_attributes = True


# ==========================================
# UserOrganization Schemas
# ==========================================
class UserOrganizationBase(BaseModel):
    user_id: UUID
    organization_id: UUID
    title: Optional[str] = None
    is_primary: bool = False
    joined_date: Optional[date] = None

class UserOrganizationCreate(UserOrganizationBase):
    pass

class UserOrganizationResponse(UserOrganizationBase):
    id: UUID

    class Config:
        from_attributes = True

# ==========================================
# Club Proposal Schemas
# ==========================================
class ClubProposalBase(BaseModel):
    title: str
    description: Optional[str] = None
    amount: Optional[float] = None
    organization_id: Optional[UUID] = None
    icon: Optional[str] = "help"

class ClubProposalCreate(ClubProposalBase):
    pass

class ClubProposalResponse(ClubProposalBase):
    id: UUID
    requested_by: UUID
    status: str
    created_at: date
    requester_name: Optional[str] = None

    class Config:
        from_attributes = True


# ==========================================
# Academic Term Schemas
# ==========================================
class AcademicTermBase(BaseModel):
    year_name: str
    semester_name: str
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    is_current: bool = False

class AcademicTermCreate(AcademicTermBase):
    pass

class AcademicTermUpdate(BaseModel):
    year_name: Optional[str] = None
    semester_name: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    is_current: Optional[bool] = None

class AcademicTermResponse(AcademicTermBase):
    id: UUID

    class Config:
        from_attributes = True

class ClubDashboardStats(BaseModel):
    totalClubs: int
    totalMembers: int
    totalBudget: float


# ==========================================
# User Schemas
# ==========================================
class UserBase(BaseModel):
    student_id: Optional[str] = None
    full_name: str
    email: EmailStr
    phone_number: Optional[str] = None
    status: UserStatusEnum = UserStatusEnum.ACTIVE
    avatar_url: Optional[str] = None
    is_2fa_enabled: bool = False
    email_alerts_enabled: bool = True
    zalo_alerts_enabled: bool = True
    daily_digest_enabled: bool = False
    signature_data: Optional[str] = None
    device_id: Optional[str] = None
    push_token: Optional[str] = None

class UserCreate(UserBase):
    password: str
    class_id: Optional[UUID] = None
    role_ids: Optional[List[UUID]] = []

class UserUpdate(BaseModel):
    student_id: Optional[str] = None
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone_number: Optional[str] = None
    status: Optional[UserStatusEnum] = None
    avatar_url: Optional[str] = None
    is_2fa_enabled: Optional[bool] = None
    email_alerts_enabled: Optional[bool] = None
    zalo_alerts_enabled: Optional[bool] = None
    daily_digest_enabled: Optional[bool] = None
    signature_data: Optional[str] = None
    class_id: Optional[UUID] = None
    device_id: Optional[str] = None
    push_token: Optional[str] = None
    password: Optional[str] = None
    role_ids: Optional[List[UUID]] = None

class UserResponse(UserBase):
    id: UUID
    last_login_at: Optional[date] = None
    level: int = 1
    training_score: int = 0
    university: Optional[str] = None
    address: Optional[str] = None
    class_id: Optional[UUID] = None
    class_name: Optional[str] = None
    role_title: Optional[str] = None
    activity_count: int = 0
    award_count: int = 0
    roles: List[RoleResponse] = []
    organizations: List[UserOrgMiniResponse] = []

    class Config:
        from_attributes = True

# ==========================================
# Auth Schemas
# ==========================================
class Token(BaseModel):
    access_token: Optional[str] = None
    token_type: Optional[str] = None
    requires_2fa: bool = False
    user_id: Optional[UUID] = None

class VerifyOTP(BaseModel):
    user_id: UUID
    otp_code: str

class TokenPayload(BaseModel):
    sub: Optional[str] = None
