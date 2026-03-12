from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

from app.api.deps import get_db, get_current_active_admin, get_current_active_user
from app.schemas.core_schemas import UserCreate, UserUpdate, UserResponse
from app.services import core_service
from app.core.s4h_client import s4h_check_user_exists
from app.models.core import User

router = APIRouter()

@router.post("/", response_model=UserResponse)
async def create_user(
    *,
    db: Session = Depends(get_db),
    user_in: UserCreate,
    current_admin: User = Depends(get_current_active_admin),
):
    """
    Create new user (Admin Provisioning only).
    """
    # 1. S4H Cross Check
    if user_in.student_id:
        exists_in_s4h = await s4h_check_user_exists(user_in.student_id)
        if exists_in_s4h:
            raise HTTPException(
                status_code=400, 
                detail="Mã số sinh viên này đã tồn tại trên hệ thống S4H. Hãy yêu cầu sinh viên đăng nhập bằng mật khẩu S4H."
            )
            
    # 2. Force Default Password
    user_in.password = "123456"
    
    # 3. Handle local database checks & creation via service
    # core_service.create_user already checks for local email and student_id duplicates.
    # It also handles auth_provider=LOCAL natively.
    return core_service.create_user(db=db, user_in=user_in)

@router.get("/me", response_model=UserResponse)
def read_users_me(
    current_user: User = Depends(get_current_active_user)
):
    """
    Get current user profile (used by frontend to check roles/redirects).
    """
    return current_user

@router.get("/me/events")
def read_user_my_events(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Lấy danh sách sự kiện cá nhân đã đăng ký cho User Dashboard & My Events
    """
    from app.models.events import EventRegistration
    registrations = db.query(EventRegistration).filter(EventRegistration.user_id == current_user.id).all()
    events_data = []
    
    # Mock some data if empty to prevent empty screens initially
    if not registrations:
        return [
            {
                "id": "mock-event-1",
                "name": "Hội thảo Tương lai AI trong Kỷ nguyên số",
                "start_time": "2026-03-25T08:00:00",
                "location": "Hội trường A",
                "status": "LIVE"
            },
            {
                "id": "mock-event-2",
                "name": "Khai mạc Hội thao cấp Trường 2026",
                "start_time": "2026-04-10T07:30:00",
                "location": "Sân vận động Phú Thọ",
                "status": "PUBLISHED"
            }
        ]

    for reg in registrations:
        if reg.event:
            events_data.append({
                "id": str(reg.event.id),
                "name": reg.event.name,
                "start_time": reg.event.start_time.isoformat() if reg.event.start_time else None,
                "location": reg.event.location,
                "status": reg.event.status.value if reg.event.status else "DRAFT"
            })
    return events_data

@router.get("/me/wallet_transactions")
def read_user_wallet_transactions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Lấy lịch sử giao dịch và đóng đoàn phí cho User Wallet
    """
    # Simulate wallet transactions since we don't have a direct Wallet DB table for individual students yet
    return [
        {
            "id": 1,
            "title": "Nạp quỹ Lớp 23CT112",
            "date": "Hôm nay, 14:30",
            "amount": "+250.000đ",
            "type": "Thu",
            "status": "Thành công"
        },
        {
            "id": 2,
            "title": "Đóng Đoàn phí Tháng 3",
            "date": "Hôm qua, 09:15",
            "amount": "-50.000đ",
            "type": "Chi",
            "status": "Thành công"
        },
        {
            "id": 3,
            "title": "Ủng hộ Quỹ Mùa Hè Xanh",
            "date": "10 Thg 03, 16:45",
            "amount": "-100.000đ",
            "type": "Chi",
            "status": "Thành công"
        }
    ]

@router.get("/me/profile_stats")
def read_user_profile_stats(
    current_user: User = Depends(get_current_active_user)
):
    """
    Trọng tâm cung cấp dữ liệu Radar Chart và Certificates cho trang Profile
    """
    return {
        "skills": [
            {"subject": "Tình nguyện", "A": 100, "fullMark": 100},
            {"subject": "Hội nhập", "A": 75, "fullMark": 100},
            {"subject": "Học tập", "A": 85, "fullMark": 100},
            {"subject": "Thể lực", "A": 40, "fullMark": 100},
            {"subject": "Đạo đức", "A": 90, "fullMark": 100},
        ],
        "recent_certificates": [
            {
                "id": "1",
                "title": "Giải Nhất Hackathon 2026",
                "time": "Tháng 02/2026"
            },
            {
                "id": "2",
                "title": "Cán bộ Đoàn tiêu biểu",
                "time": "2024 - 2025"
            }
        ],
        "experiences": [
            {
                "id": "exp-1",
                "role": "Trưởng BTC IT Tech Day",
                "period": "03/2026 - Hiện tại",
                "location": "Đại học Lạc Hồng, Đồng Nai",
                "bullets": [
                    "Lãnh đạo nhóm 20 thành viên nòng cốt.",
                    "Tổ chức thành công sự kiện công nghệ quy mô 500 sinh viên tham gia."
                ]
            }
        ]
    }

@router.get("/", response_model=List[UserResponse])
def read_users(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    return core_service.get_users(db, skip=skip, limit=limit)

@router.put("/{user_id}", response_model=UserResponse)
def update_user(
    *,
    db: Session = Depends(get_db),
    user_id: UUID,
    user_in: UserUpdate,
):
    return core_service.update_user(db=db, user_id=user_id, user_in=user_in)

@router.delete("/{user_id}")
def delete_user(
    *,
    db: Session = Depends(get_db),
    user_id: UUID,
):
    return core_service.delete_user(db=db, user_id=user_id)
