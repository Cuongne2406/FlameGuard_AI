from datetime import timedelta
from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.api import deps
from app.core import security
from app.core.config import settings
from app.models.core import User, AuthProvider
from app.schemas.core_schemas import Token
from app.schemas.ai_audit_schemas import AuditLogCreate
from app.services import ai_audit_service, core_service
from app.core.s4h_client import s4h_login, s4h_get_user_info
from datetime import datetime
from app.models.settings import SystemSetting
from app.services import email_service
from app.schemas.core_schemas import VerifyOTP

def get_session_timeout(db: Session) -> int:
    setting = db.query(SystemSetting).filter(SystemSetting.key == "SESSION_TIMEOUT").first()
    if setting and setting.value.isdigit():
        return int(setting.value)
    return settings.ACCESS_TOKEN_EXPIRE_MINUTES

router = APIRouter()

@router.post("/login", response_model=Token)
async def login_access_token(
    db: Session = Depends(deps.get_db), form_data: OAuth2PasswordRequestForm = Depends()
) -> Any:
    """
    OAuth2 compatible token login, get an access token for future requests.
    - Bước 1: Ưu tiên S4H API.
    - Bước 2: Dò DB Local nếu S4H nói sai.
    """
    
    # 1. Thử xác thực với S4H
    s4h_response = await s4h_login(form_data.username, form_data.password)
    if s4h_response and "token" in s4h_response:
        # Lấy thông tin User S4H bằng token vừa được cấp
        user_info = await s4h_get_user_info(s4h_response["token"])
        if user_info:
            # Mapping thông tin từ S4H sang FlameGuard
            email = user_info.get("email", form_data.username if "@" in form_data.username else f"{form_data.username}@s4h.edu.vn")
            first_name = user_info.get("firstName", "")
            last_name = user_info.get("lastName", "")
            full_name = f"{last_name} {first_name}".strip() or email
            
            # ID định danh từ S4H (là UUID string)
            # Lưu ý: FlameGuard dùng student_id để mapping nếu có, hoặc dùng email.
            student_id = user_info.get("student_id") or (None if "@" in form_data.username else form_data.username)
            
            # Tìm xem user đã tồn tại chưa dựa trên Email (vì email là duy nhất)
            user = db.query(User).filter(User.email == email).first()
            if not user and student_id:
                user = db.query(User).filter(User.student_id == student_id).first()
                
            if not user:
                # Tự động tạo user mới (Auto-Sync)
                user = User(
                    email=email,
                    full_name=full_name,
                    student_id=student_id,
                    auth_provider=AuthProvider.S4H,
                )
                db.add(user)
                db.flush() # Lấy ID tạm thời để gán role
            
            # Đảm bảo User có ít nhất role STUDENT (Repair logic cho account cũ)
            if not user.roles:
                from app.models.core import Role
                student_role = db.query(Role).filter(Role.name == "STUDENT").first()
                if student_role:
                    user.roles.append(student_role)
                
            db.commit()
            db.refresh(user)
            
            # Ghi nhật ký đăng nhập
            ai_audit_service.create_system_audit_log(db, AuditLogCreate(
                user_id=user.id,
                action="LOGIN",
                entity_type="Authentication",
                entity_id=user.id,
                created_at=datetime.now()
            ))

            # 2FA Check
            is_2fa_required_globally = db.query(SystemSetting).filter(SystemSetting.key == "TWO_FACTOR_REQUIRED").first()
            if (is_2fa_required_globally and is_2fa_required_globally.value == "true") or user.is_2fa_enabled:
                otp = email_service.generate_otp()
                user.otp_code = otp
                user.otp_expires_at = datetime.now() + timedelta(minutes=5)
                db.commit()
                
                # Gửi email (Chạy sync cho demo hoặc dùng background task)
                await email_service.send_otp_email(user.email, otp)
                
                return {
                    "access_token": "",
                    "token_type": "bearer",
                    "requires_2fa": True,
                    "user_id": user.id
                }

            # Cấp phát Token nội bộ FlameGuard
            timeout_minutes = get_session_timeout(db)
            access_token_expires = timedelta(minutes=timeout_minutes)
            return {
                "access_token": security.create_access_token(
                    user.id, expires_delta=access_token_expires
                ),
                "token_type": "bearer",
            }
    
    # 2. Xử lý Local Fallback (nếu S4H báo lỗi)
    user = db.query(User).filter(User.student_id == form_data.username).first()
    if not user or not user.password_hash or not security.verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Mã số sinh viên (username) hoặc mật khẩu không chính xác",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    # Ghi nhật ký đăng nhập Local
    ai_audit_service.create_system_audit_log(db, AuditLogCreate(
        user_id=user.id,
        action="LOGIN",
        entity_type="Authentication",
        entity_id=user.id,
        created_at=datetime.now()
    ))

    # 2FA Check cho Local
    is_2fa_required_globally = db.query(SystemSetting).filter(SystemSetting.key == "TWO_FACTOR_REQUIRED").first()
    if (is_2fa_required_globally and is_2fa_required_globally.value == "true") or user.is_2fa_enabled:
        otp = email_service.generate_otp()
        user.otp_code = otp
        user.otp_expires_at = datetime.now() + timedelta(minutes=5)
        db.commit()
        await email_service.send_otp_email(user.email, otp)
        return {
            "access_token": "",
            "token_type": "bearer",
            "requires_2fa": True,
            "user_id": user.id
        }

    timeout_minutes = get_session_timeout(db)
    access_token_expires = timedelta(minutes=timeout_minutes)
    return {
        "access_token": security.create_access_token(
            user.id, expires_delta=access_token_expires
        ),
        "token_type": "bearer",
    }

@router.post("/verify-2fa", response_model=Token)
async def verify_2fa_otp(
    *,
    db: Session = Depends(deps.get_db),
    verify_in: VerifyOTP
) -> Any:
    """
    Xác thực mã OTP 2 lớp và cấp Token chính thức.
    """
    user = db.query(User).filter(User.id == verify_in.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    if not user.otp_code or user.otp_code != verify_in.otp_code:
        raise HTTPException(status_code=400, detail="Mã xác thực không đúng")
        
    if not user.otp_expires_at or user.otp_expires_at < datetime.now():
        raise HTTPException(status_code=400, detail="Mã xác thực đã hết hạn")
        
    # Reset OTP sau khi dùng thành công
    user.otp_code = None
    user.otp_expires_at = None
    db.commit()
    
    # Cấp Token
    timeout_minutes = get_session_timeout(db)
    access_token_expires = timedelta(minutes=timeout_minutes)
    return {
        "access_token": security.create_access_token(
            user.id, expires_delta=access_token_expires
        ),
        "token_type": "bearer",
    }
