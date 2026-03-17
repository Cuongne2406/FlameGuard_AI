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

            # Cấp phát Token nội bộ FlameGuard
            access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
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

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return {
        "access_token": security.create_access_token(
            user.id, expires_delta=access_token_expires
        ),
        "token_type": "bearer",
    }
