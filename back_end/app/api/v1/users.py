from fastapi import APIRouter, Depends, HTTPException, Body, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.api import deps
from app.models.achievement import Achievement
from app.models.user import User
from passlib.context import CryptContext

# CHỈ IMPORT TỪ ĐÂY - KHÔNG KHAI BÁO LẠI TRONG FILE NÀY
from app.schemas.user import UserUpdate, UserResponse, UserCreate

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password: str):
    return pwd_context.hash(password)

router = APIRouter()

# 2. API Lấy danh sách User (Dành cho Admin) - ĐANG THIẾU CÁI NÀY
@router.get("/", status_code=200)
def read_users(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    search: Optional[str] = None,
    current_user: User = Depends(deps.get_current_user)
):
    # Kiểm tra quyền Admin
    # if current_user.role not in ["SUPER_ADMIN", "ADMIN", "SUB_ADMIN"]:
    #      raise HTTPException(status_code=403, detail="Không đủ quyền")
    
    query = db.query(User)
    
    # Logic tìm kiếm
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            (User.full_name.ilike(search_term)) | 
            (User.mssv.ilike(search_term)) |
            (User.class_name.ilike(search_term))
        )
        
    # Sắp xếp và phân trang
    users = query.order_by(User.id.desc()).offset(skip).limit(limit).all()
    
    # Xóa password hash trước khi trả về (mặc dù Schema UserResponse đã lọc, nhưng làm thêm cho chắc)
    for user in users:
        user.hashed_password = None
        
    return users

# 1. API Tạo User (Admin dùng)
@router.post("/", status_code=201, response_model=UserResponse)
def create_user(
    user_in: UserCreate,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    if current_user.role not in ["SUPER_ADMIN", "ADMIN"]:
        raise HTTPException(status_code=403, detail="Không đủ quyền hạn")
    
    db_user = db.query(User).filter(User.mssv == user_in.mssv).first()
    if db_user:
        raise HTTPException(status_code=400, detail="MSSV đã tồn tại")
    
    new_user = User(
        mssv=user_in.mssv,
        full_name=user_in.full_name,
        hashed_password=get_password_hash(user_in.password),
        role=user_in.role,
        email=user_in.email
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

# 2. API Lấy hồ sơ cá nhân (Dữ liệu lồng nhau cho Frontend)
@router.get("/me/profile")
def get_my_profile(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    achievements = []
    # Kiểm tra an toàn nếu user chưa có achievements
    user_achievements = getattr(current_user, 'achievements', [])
    for ach in user_achievements:
        achievements.append({
            "id": ach.id,
            "title": ach.title,
            "type": ach.type,
            "year": ach.school_year,
            "date": ach.date.strftime("%d/%m/%Y") if ach.date else ""
        })

    return {
        "id": current_user.id,
        "name": current_user.full_name,
        "studentId": current_user.mssv,
        "chidoan": current_user.class_name,
        "avatar": current_user.avatar_url,
        "joinedDate": current_user.join_date.strftime("%d/%m/%Y") if current_user.join_date else "Chưa cập nhật",
        "role": current_user.union_position,
        "email": current_user.email,
        "info": {
            "birthday": current_user.birthday.strftime("%d/%m/%Y") if current_user.birthday else "",
            "gender": current_user.gender or "Nam",
            "phone": current_user.phone or "",
            "ethnicity": current_user.ethnicity or "Kinh",
            "address": current_user.address or ""
        },
        "awards": achievements
    }

# 3. API CẬP NHẬT HỒ SƠ (API TRỌNG TÂM)
@router.put("/me/profile")
def update_my_profile(
    data: UserUpdate,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    # Cập nhật thông tin từ Schema gửi lên
    if data.full_name is not None: current_user.full_name = data.full_name
    if data.phone is not None: current_user.phone = data.phone
    if data.gender is not None: current_user.gender = data.gender
    if data.birthday is not None: current_user.birthday = data.birthday
    if data.ethnicity is not None: current_user.ethnicity = data.ethnicity
    if data.address is not None: current_user.address = data.address

    db.commit()
    db.refresh(current_user)
    return {"message": "Cập nhật thành công!"}


@router.get("/me", response_model=UserResponse)
def read_user_me(current_user: User = Depends(deps.get_current_user)):
    """
    API lấy thông tin cơ bản của user đang đăng nhập
    (Dùng cho Header, Sidebar hoặc AuthContext)
    """
    return current_user