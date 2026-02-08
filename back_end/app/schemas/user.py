from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import date, datetime

# --- 1. Schema ĐĂNG KÝ ---
class UserCreate(BaseModel):
    mssv: str
    password: str
    full_name: str
    role: str = "STUDENT"
    email: Optional[str] = None

# --- 2. Schema CẬP NHẬT ---
# Dùng cho API PUT /me/profile
class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    gender: Optional[str] = None
    birthday: Optional[date] = None
    ethnicity: Optional[str] = None
    address: Optional[str] = None

# --- 3. Schema HIỂN THỊ ---
class UserResponse(BaseModel):
    id: int
    mssv: str
    full_name: str
    role: str
    is_active: bool
    email: Optional[str] = None
    class_name: Optional[str] = None
    avatar_url: Optional[str] = None
    phone: Optional[str] = None

    class Config:
        from_attributes = True

# --- QUAN TRỌNG: Lệnh này giúp sửa lỗi Pydantic v2 ---
UserUpdate.model_rebuild()
UserResponse.model_rebuild()