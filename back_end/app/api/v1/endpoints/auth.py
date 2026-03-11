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
from app.core.s4h_client import s4h_login, s4h_get_user_info

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
            # Lấy student_id từ user_info hoặc từ form_data.username
            student_id = user_info.get("student_id", form_data.username)
            email = user_info.get("email", f"{student_id}@s4h.edu.vn") # Cấp email fallback nếu S4H không trả
            
            # Tìm xem user đã import vào FlameGuard DB chưa dựa trên MSSV
            user = db.query(User).filter(User.student_id == student_id).first()
            if not user:
                # Tự động tạo user mới (Auto-Sync)
                user = User(
                    email=email,
                    full_name=user_info.get("full_name", student_id),
                    student_id=student_id,
                    auth_provider=AuthProvider.S4H,
                    # password_hash để trống vì đăng nhập S4H
                )
                db.add(user)
                db.commit()
                db.refresh(user)
            
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
        
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return {
        "access_token": security.create_access_token(
            user.id, expires_delta=access_token_expires
        ),
        "token_type": "bearer",
    }
