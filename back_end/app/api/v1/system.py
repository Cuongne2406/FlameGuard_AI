import shutil
import os
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional

from app.api.deps import get_db, get_current_user
from app.models.user import User
from app.models.system_setting import SystemSetting
from app.models.access_log import AccessLog

router = APIRouter()

# --- 1. SCHEMA DỮ LIỆU (Cập nhật đầy đủ các trường mới nhất) ---
class SystemSettingSchema(BaseModel):
    unit_name: str
    current_academic_year: str
    is_2fa_enabled: bool
    logo_url: Optional[str] = None
    
    # Bảo mật
    is_geo_block_enabled: bool = False
    min_password_length: int = 8
    password_expiry_days: int = 90

    # --- [FIX QUAN TRỌNG] THÊM 3 TRƯỜNG THÔNG BÁO ---
    is_email_enabled: bool = True
    is_mobile_enabled: bool = True
    is_zalo_enabled: bool = False
    
    class Config:
        from_attributes = True

# --- 2. API LẤY CẤU HÌNH ---
@router.get("/", response_model=SystemSettingSchema)
def get_system_settings(db: Session = Depends(get_db)):
    settings = db.query(SystemSetting).first()
    
    if not settings:
        settings = SystemSetting()
        db.add(settings)
        db.commit()
        db.refresh(settings)
        
    return settings

# --- 3. API CẬP NHẬT CẤU HÌNH ---
@router.put("/", response_model=SystemSettingSchema)
def update_system_settings(
    setting_in: SystemSettingSchema,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "SUPER_ADMIN":
        raise HTTPException(status_code=403, detail="Chỉ Quản trị viên cấp cao mới được sửa cấu hình hệ thống")

    settings = db.query(SystemSetting).first()
    if not settings:
        settings = SystemSetting()
        db.add(settings)

    # 1. Cập nhật thông tin chung
    settings.unit_name = setting_in.unit_name
    settings.current_academic_year = setting_in.current_academic_year
    
    # 2. Cập nhật bảo mật
    settings.is_2fa_enabled = setting_in.is_2fa_enabled
    settings.is_geo_block_enabled = setting_in.is_geo_block_enabled
    settings.min_password_length = setting_in.min_password_length
    settings.password_expiry_days = setting_in.password_expiry_days
    
    # 3. [FIX QUAN TRỌNG] Cập nhật thông báo
    # Đây là đoạn code bị thiếu khiến nút gạt không lưu được
    settings.is_email_enabled = setting_in.is_email_enabled
    settings.is_mobile_enabled = setting_in.is_mobile_enabled
    settings.is_zalo_enabled = setting_in.is_zalo_enabled
    
    db.commit()
    db.refresh(settings)
    return settings

# --- 4. API UPLOAD LOGO ---
@router.post("/logo")
def upload_system_logo(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "SUPER_ADMIN":
        raise HTTPException(status_code=403, detail="Không đủ quyền")

    directory = "static/images"
    if not os.path.exists(directory):
        os.makedirs(directory, exist_ok=True)

    file_location = f"{directory}/system_logo.png" 
    with open(file_location, "wb+") as file_object:
        shutil.copyfileobj(file.file, file_object)
    
    logo_url = f"http://127.0.0.1:8000/{file_location}?t={os.urandom(4).hex()}" 
    
    settings = db.query(SystemSetting).first()
    if not settings:
        settings = SystemSetting()
        db.add(settings)
    
    settings.logo_url = logo_url
    db.commit()
    return {"message": "Upload logo thành công", "logo_url": logo_url}

# --- 5. API XÓA LOGO ---
@router.delete("/logo")
def delete_system_logo(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "SUPER_ADMIN":
        raise HTTPException(status_code=403, detail="Không đủ quyền")

    settings = db.query(SystemSetting).first()
    if settings:
        settings.logo_url = None 
        db.commit()
    return {"message": "Đã xóa logo, trở về mặc định"}

# --- 6. API LẤY LOGS ---
@router.get("/logs")
def get_access_logs(
    limit: int = 10,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role not in ["SUPER_ADMIN", "ADMIN"]:
        raise HTTPException(status_code=403, detail="Không đủ quyền")
        
    logs = db.query(AccessLog).order_by(AccessLog.created_at.desc()).limit(limit).all()
    return logs