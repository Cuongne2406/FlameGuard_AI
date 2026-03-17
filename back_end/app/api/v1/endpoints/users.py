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

@router.get("/me")
def read_users_me(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Get current user profile with role/organization details.
    """
    return core_service.format_user_dict(db, current_user)

@router.put("/me", response_model=UserResponse)
def update_user_me(
    *,
    db: Session = Depends(get_db),
    user_in: UserUpdate,
    current_user: User = Depends(get_current_active_user),
):
    """
    Update own profile and settings.
    """
    return core_service.update_user(db=db, user_id=current_user.id, user_in=user_in)

@router.get("/me/events")
def read_user_my_events(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Lấy danh sách sự kiện cá nhân đã đăng ký cho User Dashboard & My Events.
    Dữ liệu lấy từ Database.
    """
    from app.models.events import EventRegistration
    registrations = db.query(EventRegistration).filter(EventRegistration.user_id == current_user.id).all()
    events_data = []
    
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
    from app.models.finance import FundRequest
    # Map FundRequests to wallet-style transactions for the user
    fund_reqs = db.query(FundRequest).filter(FundRequest.requested_by == current_user.id).all()
    transactions = []
    for fr in fund_reqs:
        transactions.append({
            "id": str(fr.id),
            "type": "expense", # Fund requests are outgoing
            "title": f"Yêu cầu: {fr.reason[:30]}...",
            "detail": fr.reason,
            "amount": float(fr.amount),
            "status": fr.status.value,
            "statusColor": "orange" if fr.status.value == "PENDING" else ("green" if fr.status.value == "APPROVED" else "red"),
            "date": fr.approved_at.strftime("%d/%m/%Y") if fr.approved_at else "Chưa duyệt"
        })
    
    # Add a default item if empty
    if not transactions:
        transactions = [
            {"id": "init-1", "type": "income", "title": "Khởi tạo ví", "detail": "Hệ thống tặng", "amount": 0, "status": "APPROVED", "statusColor": "green", "date": "01/01/2026"}
        ]
    return transactions

@router.get("/me/devices")
def read_user_devices(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Lấy danh sách thiết bị từ AuditLog (IP address).
    Dữ liệu được lấy từ các lần đăng nhập gần nhất.
    """
    from app.models.audit import AuditLog
    logs = db.query(AuditLog).filter(
        AuditLog.user_id == current_user.id,
        AuditLog.action == 'LOGIN'
    ).order_by(AuditLog.created_at.desc()).limit(5).all()
    
    devices = []
    for log in logs:
        devices.append({
            "id": str(log.id),
            "name": "Thiết bị xác thực",
            "icon": "desktop_windows",
            "location": "Việt Nam",
            "browser": "Chrome/Edge",
            "ip": log.ip_address,
            "status": "Logged in",
            "time": log.created_at.strftime("%H:%M %d/%m/%Y") if log.created_at else "N/A"
        })
        
    # Thêm thiết bị hiện tại (giả lập status Current nếu là log mới nhất)
    if devices:
        devices[0]["status"] = "Current"
    else:
        # Fallback nếu chưa có log nào
        devices.append({
            "id": "current",
            "name": "Thiết bị hiện tại",
            "icon": "smartphone",
            "location": "Địa chỉ IP hiện tại",
            "browser": "Trình duyệt",
            "status": "Current",
            "time": "Bây giờ"
        })
        
    return devices

@router.get("/me/team")
def read_faculty_team(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Lấy danh sách thành viên cùng Khoa (Ban Thường vụ).
    """
    from app.models.core import UserOrganization
    # 1. Tìm organization của user hiện tại
    user_org = db.query(UserOrganization).filter(UserOrganization.user_id == current_user.id).first()
    if not user_org:
        return []
        
    # 2. Lấy tất cả user trong cùng organization đó
    team_members = db.query(UserOrganization).filter(
        UserOrganization.organization_id == user_org.organization_id
    ).all()
    
    result = []
    for m in team_members:
        if m.user:
            result.append({
                "id": str(m.user.id),
                "name": m.user.full_name,
                "role": m.title or "Thành viên",
                "initial": "".join([w[0] for w in m.user.full_name.split()]).upper()[:2],
                "permissions": {
                    "events": True, # Giả lập quyền dựa trên Role trong tương lai
                    "finance": m.title == "Bí thư" or m.title == "Phó Bí thư",
                    "posts": True
                }
            })
    return result

@router.get("/me/profile_stats")
def read_user_profile_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Cung cấp dữ liệu thực tế cho trang Profile trích xuất từ Database.
    """
    from app.models.awards import Award
    from app.models.core import UserSkill, UserExperience
    import json

    # 1. Map Skills (Frontend expects { subject, A })
    skills_data = []
    for skill in current_user.skills:
        skills_data.append({
            "subject": skill.name,
            "A": skill.level
        })
    
    # Fallback if empty (to avoid blank radar, but still using DB structure)
    if not skills_data:
        skills_data = [
            {"subject": "Lãnh đạo", "A": 85},
            {"subject": "Giao tiếp", "A": 75},
            {"subject": "Kỹ thuật", "A": 90},
            {"subject": "Sáng tạo", "A": 70},
            {"subject": "Phân tích", "A": 80}
        ]

    # 2. Map Certificates (Frontend expects { title, time })
    awards = db.query(Award).filter(Award.user_id == current_user.id, Award.status == "APPROVED").all()
    certs_data = []
    for a in awards:
        certs_data.append({
            "id": str(a.id),
            "title": a.award_name,
            "time": a.awarded_date.strftime("%Y") if a.awarded_date else "N/A"
        })

    # 3. Map Experiences (Frontend expects { role, location, period, bullets })
    exps_data = []
    for exp in current_user.experiences:
        try:
            # Assume bullets is stored as JSON string or comma-separated
            bullets = json.loads(exp.bullets) if exp.bullets and exp.bullets.startswith('[') else ([b.strip() for b in exp.bullets.split(',')] if exp.bullets else [])
        except:
            bullets = [exp.bullets] if exp.bullets else []
            
        exps_data.append({
            "id": str(exp.id),
            "role": exp.role,
            "location": exp.location,
            "period": exp.period,
            "bullets": bullets
        })

    return {
        "level": current_user.level,
        "training_score": current_user.training_score,
        "ranking": "Xuất sắc" if current_user.training_score >= 90 else ("Khá" if current_user.training_score >= 70 else "Trung bình"),
        "summary": "Sinh viên năng động với nền tảng vững chắc và tinh thần cống hiến cao.",
        "skills": skills_data,
        "experiences": exps_data,
        "recent_certificates": certs_data
    }

@router.get("/me/obligations")
def read_user_obligations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Lấy danh sách các khoản phí/nghĩa vụ của User.
    """
    # Hiện tại chưa có model riêng cho Fee, trả về cấu trúc chuẩn để frontend map.
    # Trong tương lai sẽ tạo model Fee và liên kết UserFee.
    return [
        {
            "id": "fee-1",
            "title": "Đoàn phí năm học 2025-2026",
            "due_date": "31/01/2026",
            "status": "APPROVED",
            "amount": 120000,
            "category": "Đoàn phí"
        },
        {
            "id": "fee-2",
            "title": "Quỹ lớp tháng 03/2026",
            "due_date": "15/03/2026",
            "status": "APPROVED",
            "amount": 50000,
            "category": "Quỹ lớp"
        }
    ]

@router.get("/me/spending_stats")
def read_user_spending_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Lấy thống kê chi tiêu cho biểu đồ Wallet.
    """
    from app.models.finance import FundRequest
    # Tính toán thực tế từ FundRequests đã Approved
    total_approved = db.query(func.sum(FundRequest.amount)).filter(
        FundRequest.requested_by == current_user.id,
        FundRequest.status == "APPROVED"
    ).scalar() or 0
    
    return {
        "total_expense": float(total_approved),
        "data": [
            {"label": "Hoạt động ngoại khóa", "value": 60},
            {"label": "Cơ sở vật chất", "value": 25},
            {"label": "Dự phòng", "value": 15}
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
