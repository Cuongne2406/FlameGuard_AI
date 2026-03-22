from typing import Generator
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from sqlalchemy.orm import Session
from pydantic import ValidationError

from app.db.session import SessionLocal
from app.core.config import settings
from app.models.core import User, UserStatus
from app.schemas.core_schemas import TokenPayload

oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"/api/v1/auth/login")

def get_db() -> Generator:
    try:
        db = SessionLocal()
        yield db
    finally:
        db.close()

def get_current_user(
    db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)
) -> User:
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
        )
        token_data = TokenPayload(**payload)
    except (JWTError, ValidationError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    user = db.query(User).filter(User.id == token_data.sub).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

def get_current_active_user(
    current_user: User = Depends(get_current_user),
) -> User:
    if current_user.status != UserStatus.ACTIVE:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user

def get_current_active_admin(
    current_user: User = Depends(get_current_active_user),
) -> User:
    is_admin = any(
        role.name in ["FACULTY_ADMIN", "UNIVERSITY_ADMIN"] 
        for role in current_user.roles
    )
    if not is_admin:
        raise HTTPException(
            status_code=403, detail="The user doesn't have enough privileges"
        )
    return current_user