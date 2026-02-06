from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from sqlalchemy.orm import Session
from app.core.config import settings
from app.db.session import get_db
from app.models.user import User

# Chỉ định đường dẫn để lấy token (dùng cho nút Authorize trên Swagger)
oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/login")

def get_current_user(
    db: Session = Depends(get_db),
    token: str = Depends(oauth2_scheme)
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Token không hợp lệ hoặc đã hết hạn",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        # 1. Giải mã Token
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        mssv: str = payload.get("sub") # Lấy MSSV từ trong token ra
        if mssv is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    # 2. Tìm user trong database dựa vào MSSV vừa giải mã
    user = db.query(User).filter(User.mssv == mssv).first()
    if user is None:
        raise credentials_exception
        
    return user