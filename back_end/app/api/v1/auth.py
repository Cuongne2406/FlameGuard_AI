from fastapi import Request
from fastapi.security import OAuth2PasswordRequestForm
from app.core.security import create_access_token
from app.schemas.token import Token
from datetime import timedelta
from app.core.config import settings
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserResponse
from passlib.context import CryptContext
from app.models.system_setting import SystemSetting
from pydantic import BaseModel


router = APIRouter()
pwd_context = CryptContext(
    schemes=["bcrypt"], 
    deprecated="auto",
    bcrypt__truncate_error=False # Thêm dòng này để sửa lỗi 72 bytes
)

@router.post("/register", response_model=UserResponse)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    # 1. Kiểm tra xem MSSV đã tồn tại chưa
    user_exist = db.query(User).filter(User.mssv == user_in.mssv).first()
    if user_exist:
        raise HTTPException(status_code=400, detail="MSSV này đã được đăng ký!")

    # 2. Mã hóa mật khẩu (Không lưu plain text!)
    hashed_password = pwd_context.hash(user_in.password)

    # 3. Tạo user mới
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
        print(f"LOI DATABASE ROI: {e}") # Dòng này sẽ hiện lỗi thật ở Terminal
        raise HTTPException(status_code=500, detail=str(e))
    
    return new_user

@router.post("/login", response_model=Token)
def login_access_token(db: Session = Depends(get_db), form_data: OAuth2PasswordRequestForm = Depends()):
    # 1. Tìm user theo MSSV (username trong form gửi lên chính là mssv)
    user = db.query(User).filter(User.mssv == form_data.username).first()
    
    # 2. Kiểm tra user có tồn tại không HOẶC mật khẩu có đúng không
    if not user or not pwd_context.verify(form_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Sai tài khoản hoặc mật khẩu")
    
    if not user.is_active:
        raise HTTPException(status_code=400, detail="Tài khoản đã bị khóa")

    # 3. Tạo Access Token (Thẻ bài)
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.mssv, "role": user.role}, # Lưu MSSV và Role vào trong thẻ
        expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/login/access-token", response_model=Token) # Lưu ý: response model có thể cần sửa thành Union hoặc Dict nếu muốn trả về thông báo 2FA
def login_access_token(
    db: Session = Depends(get_db), 
    form_data: OAuth2PasswordRequestForm = Depends()
):
    user = authenticate(db, email=form_data.username, password=form_data.password)
    if not user:
        raise HTTPException(status_code=400, detail="Sai email hoặc mật khẩu")

    # --- LOGIC 2FA MỚI ---
    # 1. Kiểm tra cấu hình hệ thống xem có bắt buộc 2FA không
    system_settings = db.query(SystemSetting).first()
    is_2fa_required = system_settings.is_2fa_enabled if system_settings else False

    # 2. Nếu Bắt buộc 2FA VÀ user là Admin/Sub-Admin
    if is_2fa_required and user.role in ["SUPER_ADMIN", "ADMIN", "SUB_ADMIN"]:
        # Sinh mã OTP 6 số
        otp = str(random.randint(100000, 999999))
        
        # Lưu vào DB (Hết hạn sau 5 phút)
        user.otp_code = otp
        user.otp_expires_at = datetime.utcnow() + timedelta(minutes=5)
        db.commit()

        # GIẢ LẬP GỬI EMAIL (In ra console để bạn test)
        print(f"========================================")
        print(f"🔐 MÃ OTP CỦA {user.email} LÀ: {otp}")
        print(f"========================================")

        # Trả về lỗi đặc biệt để Frontend biết đường bật Modal OTP
        # (Cách hack nhẹ: raise lỗi 403 với detail đặc biệt)
        raise HTTPException(status_code=403, detail="REQUIRE_2FA")
    # ---------------------

    # Nếu không cần 2FA thì tạo token như bình thường
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return {
        "access_token": create_access_token(user.id, expires_delta=access_token_expires),
        "token_type": "bearer",
    }


class OTPVerify(BaseModel):
    email: str
    otp: str

@router.post("/verify-otp")
def verify_otp_login(
    otp_data: OTPVerify,
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.email == otp_data.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User không tồn tại")

    # Kiểm tra OTP
    if not user.otp_code or user.otp_code != otp_data.otp:
        raise HTTPException(status_code=400, detail="Mã OTP không đúng")
    
    # Kiểm tra hạn
    if datetime.utcnow() > user.otp_expires_at:
        raise HTTPException(status_code=400, detail="Mã OTP đã hết hạn")

    # Nếu đúng hết: Xóa OTP và cấp Token
    user.otp_code = None
    db.commit()

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return {
        "access_token": create_access_token(user.id, expires_delta=access_token_expires),
        "token_type": "bearer",
    }