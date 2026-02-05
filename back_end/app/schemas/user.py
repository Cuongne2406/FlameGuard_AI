from pydantic import BaseModel
from typing import Optional

# Khuôn mẫu khi tạo user mới
class UserCreate(BaseModel):
    mssv: str
    password: str
    full_name: str
    role: str = "STUDENT" # Mặc định là sinh viên

# Khuôn mẫu khi trả dữ liệu về cho Frontend (giấu mật khẩu đi)
class UserResponse(BaseModel):
    id: int
    mssv: str
    full_name: str
    role: str
    is_active: bool

    class Config:
        from_attributes = True