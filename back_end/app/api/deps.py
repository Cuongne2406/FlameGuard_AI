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

def get_user_faculty_org(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Xác định Organization (Khoa/Đơn vị) mà user đang quản lý hoặc trực thuộc.
    - Nếu là UNIVERSITY_ADMIN / ADMIN (và không phải chỉ là FACULTY_ADMIN): trả về None (xem toàn trường).
    - Nếu là FACULTY_ADMIN: trả về đối tượng Organization của Khoa tương ứng.
    """
    from app.models.core import Organization, OrgType, UserOrganization
    
    is_university_admin = any(r.name in ["ADMIN", "UNIVERSITY_ADMIN"] for r in current_user.roles)
    is_faculty_admin = any(r.name == "FACULTY_ADMIN" for r in current_user.roles)

    if is_university_admin and not is_faculty_admin:
        return None

    # 1. Tìm org mà user làm leader_user_id (ưu tiên FACULTY)
    leader_org = db.query(Organization).filter(
        Organization.leader_user_id == current_user.id,
        Organization.type == OrgType.FACULTY
    ).first()
    if leader_org:
        return leader_org

    # 2. Tìm qua UserOrganization có Organization.type == OrgType.FACULTY
    fac_uo = db.query(UserOrganization).join(Organization).filter(
        UserOrganization.user_id == current_user.id,
        Organization.type == OrgType.FACULTY
    ).first()
    if fac_uo and fac_uo.organization:
        return fac_uo.organization

    # 3. Tìm qua class_id (nếu lớp có parent là FACULTY)
    if current_user.class_id:
        cls = db.query(Organization).filter(Organization.id == current_user.class_id).first()
        if cls and cls.parent and cls.parent.type == OrgType.FACULTY:
            return cls.parent

    # 4. Tìm qua bất kỳ org nào user tham gia có parent là FACULTY
    user_orgs = db.query(UserOrganization).filter(UserOrganization.user_id == current_user.id).all()
    for uo in user_orgs:
        if uo.organization and uo.organization.parent and uo.organization.parent.type == OrgType.FACULTY:
            return uo.organization.parent

    # 5. Nếu là FACULTY_ADMIN nhưng chưa gán, fallback lấy Khoa CNTT hoặc Khoa đầu tiên
    if is_faculty_admin:
        fallback = db.query(Organization).filter(
            Organization.type == OrgType.FACULTY,
            Organization.name.ilike("%Công nghệ thông tin%")
        ).first() or db.query(Organization).filter(Organization.type == OrgType.FACULTY).first()
        return fallback

    return None