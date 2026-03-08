from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from uuid import UUID
from datetime import date
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
        orm_mode = True


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
        orm_mode = True


# ==========================================
# Organization Schemas
# ==========================================
class OrganizationBase(BaseModel):
    name: str
    type: OrgTypeEnum
    description: Optional[str] = None
    parent_id: Optional[UUID] = None
    status: OrgStatusEnum = OrgStatusEnum.ACTIVE

class OrganizationCreate(OrganizationBase):
    pass

class OrganizationUpdate(BaseModel):
    name: Optional[str] = None
    type: Optional[OrgTypeEnum] = None
    description: Optional[str] = None
    parent_id: Optional[UUID] = None
    status: Optional[OrgStatusEnum] = None

class OrganizationResponse(OrganizationBase):
    id: UUID

    class Config:
        orm_mode = True


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
        orm_mode = True


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

class UserCreate(UserBase):
    password: str
    role_ids: Optional[List[UUID]] = []

class UserUpdate(BaseModel):
    student_id: Optional[str] = None
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone_number: Optional[str] = None
    status: Optional[UserStatusEnum] = None
    avatar_url: Optional[str] = None
    password: Optional[str] = None
    role_ids: Optional[List[UUID]] = None

class UserResponse(UserBase):
    id: UUID
    last_login_at: Optional[date] = None
    roles: List[RoleResponse] = []

    class Config:
        orm_mode = True
