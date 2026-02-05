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