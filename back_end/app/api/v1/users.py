from fastapi import APIRouter, Depends, HTTPException, Body, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from app.api.deps import get_db, get_current_user
from app.models.achievement import Achievement
from app.models.user import User
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password: str):
    return pwd_context.hash(password)

router = APIRouter()

# --- SCHEMA ---
class UserCreate(BaseModel):
    full_name: str
    mssv: str
    class_name: Optional[str] = None
    role: str = "STUDENT"
    email: Optional[str] = None

# 1. API Tạo User
@router.post("/", status_code=201)
def create_user(
    user_in: UserCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role not in ["SUPER_ADMIN", "ADMIN", "SUB_ADMIN"]:
        raise HTTPException(status_code=403, detail="Bạn không có quyền này")
    if db.query(User).filter(User.mssv == user_in.mssv).first():
        raise HTTPException(status_code=400, detail="MSSV này đã tồn tại!")
    
    new_user = User(
        full_name=user_in.full_name,
        mssv=user_in.mssv,
        email=user_in.email or f"{user_in.mssv}@lhu.edu.vn",
        class_name=user_in.class_name,
        role=user_in.role,
        hashed_password=get_password_hash("123123123"), 
        is_active=True
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "Thành công", "id": new_user.id}

# 2. API Lấy danh sách
@router.get("/", status_code=200)
def read_users(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    search: Optional[str] = None,
    current_user: User = Depends(get_current_user)
):
    if current_user.role not in ["SUPER_ADMIN", "ADMIN", "SUB_ADMIN"]:
         raise HTTPException(status_code=403, detail="Không đủ quyền")
    query = db.query(User)
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            (User.full_name.ilike(search_term)) | 
            (User.mssv.ilike(search_term)) |
            (User.class_name.ilike(search_term))
        )
    users = query.order_by(User.id.desc()).offset(skip).limit(limit).all()
    for user in users:
        user.hashed_password = None
    return users

# --- [DÒNG NÀY FIX LỖI 44 LOGIN.JSX] ---
# 3. API Lấy thông tin chính chủ
@router.get("/me", status_code=200)
def get_user_me(
    current_user: User = Depends(get_current_user)
):
    return {
        "id": current_user.id,
        "mssv": current_user.mssv,
        "full_name": current_user.full_name,
        "role": current_user.role.upper() if current_user.role else "STUDENT", # Ép hoa để chắc chắn
        "email": current_user.email,
        "class_name": current_user.class_name
    }


class AchievementDTO(BaseModel):
    id: int
    title: str
    year: str
    type: str
    date: str # Trả về dạng string dd/mm/yyyy cho frontend dễ hiển thị

class UserProfileResponse(BaseModel):
    name: str
    studentId: str
    chidoan: Optional[str]
    avatar: Optional[str]
    role: str
    joinedDate: Optional[str]
    
    info: dict # Chứa birthday, email, phone...
    unionInfo: dict # Chứa position, place...
    awards: List[AchievementDTO]


# --- API LẤY PROFILE ---
@router.get("/me", response_model=UserProfileResponse)
def read_user_me(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # 1. Format dữ liệu ngày tháng
    dob = current_user.birthday.strftime("%d/%m/%Y") if current_user.birthday else "Chưa cập nhật"
    join_d = current_user.join_date.strftime("%d/%m/%Y") if current_user.join_date else "Chưa cập nhật"
    
    # 2. Lấy danh sách khen thưởng từ quan hệ achievements
    # Lưu ý: Vì trong model User đã có relationship achievements, ta truy cập trực tiếp được
    awards_list = []
    for ach in current_user.achievements:
        awards_list.append({
            "id": ach.id,
            "title": ach.title,
            "year": ach.year,
            "type": ach.type,
            "date": ach.date_received.strftime("%d/%m/%Y")
        })

    # 3. Trả về đúng cấu trúc React đang chờ
    return {
        "name": current_user.full_name,
        "studentId": current_user.mssv,
        "chidoan": current_user.class_name or "Chưa cập nhật",
        "avatar": current_user.avatar_url,
        "role": current_user.role, # Ví dụ: STUDENT -> Đoàn viên (Frontend tự map)
        "joinedDate": join_d,
        
        "info": {
            "birthday": dob,
            "gender": current_user.gender or "Chưa cập nhật",
            "email": current_user.email,
            "phone": current_user.phone or "Chưa cập nhật",
            "ethnicity": current_user.ethnicity or "Kinh",
            "address": current_user.address or "Chưa cập nhật"
        },
        
        "unionInfo": {
            "position": current_user.union_position,
            "joinDate": join_d,
            "place": "Trường ĐH Lạc Hồng" # Tạm thời hardcode
        },
        
        "awards": awards_list
    }

# --- API CẬP NHẬT PROFILE (Dành cho tab "Thông tin chung") ---
@router.put("/me")
def update_user_me(
    data: dict = Body(...), # Nhận cục JSON từ frontend
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Cập nhật các trường cho phép
    if "phone" in data: current_user.phone = data["phone"]
    if "address" in data: current_user.address = data["address"]
    if "email" in data: current_user.email = data["email"]
    # ... thêm các trường khác nếu muốn

    db.commit()
    return {"message": "Cập nhật thành công"}