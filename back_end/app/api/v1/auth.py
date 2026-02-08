# back_end/app/api/v1/auth.py

from datetime import timedelta, datetime
import random # <--- Nhớ import cái này cho 2FA
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.db.session import get_db
from app.core.security import create_access_token
from app.core.config import settings
from app.models.user import User
from app.models.system_setting import SystemSetting
from app.schemas.token import Token
from app.schemas.user import UserCreate, UserResponse
from passlib.context import CryptContext

router = APIRouter()

# Cấu hình Password Hashing
pwd_context = CryptContext(
    schemes=["bcrypt"], 
    deprecated="auto",
    bcrypt__truncate_error=False
)

# --- API ĐĂNG KÝ (Giữ nguyên) ---
@router.post("/register", response_model=UserResponse)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    user_exist = db.query(User).filter(User.mssv == user_in.mssv).first()
    if user_exist:
        raise HTTPException(status_code=400, detail="MSSV này đã được đăng ký!")

    hashed_password = pwd_context.hash(user_in.password)

    new_user = User(
        mssv=user_in.mssv,
        full_name=user_in.full_name,
        hashed_password=hashed_password,
        role=user_in.role
    )
    
    try:
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
    except Exception as e:
        db.rollback()
        print(f"LOI DATABASE: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    
    return new_user

# --- API ĐĂNG NHẬP (Đã sửa lại chuẩn logic MSSV) ---
@router.post("/login", response_model=Token)
def login_access_token(
    db: Session = Depends(get_db), 
    form_data: OAuth2PasswordRequestForm = Depends()
):
    # 1. Tìm user theo MSSV (form_data.username chứa MSSV gửi lên)
    # LƯU Ý: Dùng MSSV, KHÔNG dùng Email
    user = db.query(User).filter(User.mssv == form_data.username).first()
    
    # 2. Kiểm tra mật khẩu
    if not user or not pwd_context.verify(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, # Dùng 401 chuẩn hơn 400
            detail="Sai tài khoản hoặc mật khẩu",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # 3. Kiểm tra khóa tài khoản
    if not user.is_active:
        raise HTTPException(status_code=400, detail="Tài khoản đã bị khóa")

    # 4. LOGIC 2FA (Kiểm tra nếu hệ thống bật 2FA và User là Admin)
    # -----------------------------------------------------------
    system_settings = db.query(SystemSetting).first()
    is_2fa_required = system_settings.is_2fa_enabled if system_settings else False

    if is_2fa_required and user.role in ["SUPER_ADMIN", "ADMIN", "SUB_ADMIN"]:
        # Sinh mã OTP 6 số
        otp = str(random.randint(100000, 999999))
        
        # Lưu vào DB
        user.otp_code = otp
        user.otp_expires_at = datetime.utcnow() + timedelta(minutes=5)
        db.commit()

        # In ra console để test (vì chưa có gửi mail thật)
        print(f"========================================")
        print(f"🔐 MÃ OTP CỦA {user.full_name} ({user.mssv}) LÀ: {otp}")
        print(f"========================================")

        # Trả về lỗi 403 đặc biệt để Frontend biết bật Popup OTP
        raise HTTPException(status_code=403, detail="REQUIRE_2FA")
    # -----------------------------------------------------------

    # 5. Nếu không cần 2FA thì cấp Token luôn
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    # Payload token: sub là MSSV để dễ truy vấn sau này
    access_token = create_access_token(
        data={"sub": user.mssv, "role": user.role, "user_id": user.id},
        expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token, 
        "token_type": "bearer"
    }

# --- API XÁC THỰC OTP (Sửa lại logic tìm theo MSSV) ---
class OTPVerify(BaseModel):
    mssv: str  # Sửa email thành mssv cho đồng bộ
    otp: str

@router.post("/verify-otp")
def verify_otp_login(
    otp_data: OTPVerify,
    db: Session = Depends(get_db)
):
    # Tìm theo MSSV
    user = db.query(User).filter(User.mssv == otp_data.mssv).first()
    if not user:
        raise HTTPException(status_code=404, detail="User không tồn tại")

    # Kiểm tra OTP
    if not user.otp_code or user.otp_code != otp_data.otp:
        raise HTTPException(status_code=400, detail="Mã OTP không đúng")
    
    # Kiểm tra hạn
    if datetime.utcnow() > user.otp_expires_at:
        raise HTTPException(status_code=400, detail="Mã OTP đã hết hạn")

    # Xóa OTP và cấp Token
    user.otp_code = None
    db.commit()

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.mssv, "role": user.role, "user_id": user.id},
        expires_delta=access_token_expires
    )

    return {
        "access_token": access_token, 
        "token_type": "bearer"
    }