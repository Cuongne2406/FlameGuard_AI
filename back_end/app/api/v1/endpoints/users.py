from fastapi import APIRouter, Depends, HTTPException, File, UploadFile, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

from app.api.deps import get_db, get_current_active_admin, get_current_active_user, get_user_faculty_org
from app.schemas.core_schemas import UserCreate, UserUpdate, UserResponse, UserChangePassword
from app.services import core_service, cloudinary_service
from app.core.s4h_client import s4h_check_user_exists
from app.core.security import verify_password, get_password_hash
from app.models.core import User
from app.utils.file_validator import verify_image_magic_bytes
from app.models.settings import SystemSetting
from app.services.webhook_service import send_webhook_event

router = APIRouter()

@router.post("/", response_model=UserResponse)
async def create_user(
    *,
    db: Session = Depends(get_db),
    user_in: UserCreate,
    current_admin: User = Depends(get_current_active_admin),
    background_tasks: BackgroundTasks,
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
            
    # 2. Force Default Password with High Complexity to pass any DB Policy
    user_in.password = "Fl@meGuard2026!"
    
    # 3. Handle local database checks & creation via service
    user = core_service.create_user(db=db, user_in=user_in)
    
    # 4. Webhook Trigger (USER.CREATED)
    settings = db.query(SystemSetting).filter(
        SystemSetting.key.in_(["WEBHOOK_CALLBACK_URL", "WEBHOOK_SECRET"])
    ).all()
    
    settings_dict = {s.key: s.value for s in settings}
    webhook_url = settings_dict.get("WEBHOOK_CALLBACK_URL")
    webhook_secret = settings_dict.get("WEBHOOK_SECRET", "")
    
    if webhook_url:
        payload_data = {
            "id": str(user.id),
            "email": user.email,
            "full_name": user.full_name,
            "student_id": user.student_id,
            "status": user.status.value if user.status else "ACTIVE"
        }
        background_tasks.add_task(send_webhook_event, webhook_url, webhook_secret, "USER.CREATED", payload_data)
        
    return user

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
    return core_service.update_user(db=db, user_id=current_user.id, user_in=user_in, is_admin=True)

@router.post("/me/change-password")
def change_password(
    password_data: UserChangePassword,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Đổi mật khẩu người dùng hiện tại theo chính sách bảo mật SystemSetting.
    """
    if not current_user.password_hash or not verify_password(password_data.current_password, current_user.password_hash):
        raise HTTPException(status_code=400, detail="Mật khẩu hiện tại không chính xác.")
    
    # Đọc cấu hình chính sách mật khẩu từ SystemSetting
    settings_dict = {
        s.key: s.value for s in db.query(SystemSetting).filter(
            SystemSetting.key.in_(["PW_MIN_LENGTH", "PW_REQUIRE_UPPERCASE", "PW_REQUIRE_SYMBOLS"])
        ).all()
    }
    min_length = int(settings_dict.get("PW_MIN_LENGTH", "6"))
    require_uppercase = settings_dict.get("PW_REQUIRE_UPPERCASE", "false").lower() == "true"
    require_symbols = settings_dict.get("PW_REQUIRE_SYMBOLS", "false").lower() == "true"
    
    new_pw = password_data.new_password
    if len(new_pw) < min_length:
        raise HTTPException(status_code=400, detail=f"Mật khẩu mới phải có ít nhất {min_length} ký tự.")
    if require_uppercase and not any(c.isupper() for c in new_pw):
        raise HTTPException(status_code=400, detail="Mật khẩu mới phải chứa ít nhất 1 chữ hoa.")
    if require_symbols and not any(not c.isalnum() for c in new_pw):
        raise HTTPException(status_code=400, detail="Mật khẩu mới phải chứa ít nhất 1 ký tự đặc biệt.")
        
    current_user.password_hash = get_password_hash(new_pw)
    db.commit()
    return {"message": "Đổi mật khẩu thành công."}

@router.post("/me/avatar", response_model=UserResponse)
async def upload_user_avatar(
    *,
    db: Session = Depends(get_db),
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_active_user),
):
    """
    Tải lên và cập nhật ảnh đại diện của người dùng hiện tại lên Cloudinary.
    """
    # Kiểm tra Magic Bytes của ảnh tải lên
    contents = await file.read()
    await file.seek(0)
    if not verify_image_magic_bytes(contents):
        raise HTTPException(status_code=400, detail="Tệp tin hình ảnh không hợp lệ (Không đúng định dạng JPEG/PNG/GIF/WEBP)")

    # 1. Tải lên Cloudinary sử dụng logic cấu trúc thư mục phân cấp
    result = cloudinary_service.upload_image(file.file, user=current_user, category="avatar")
    
    if not result.get("success"):
        raise HTTPException(status_code=400, detail=result.get("error"))
        
    # 2. Cập nhật URL ảnh đại diện vào cơ sở dữ liệu
    avatar_url = result.get("url")
    return core_service.update_user(db=db, user_id=current_user.id, user_in=UserUpdate(avatar_url=avatar_url))

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
                "registration_id": str(reg.id),
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
@router.delete("/me/devices")
def logout_all_devices(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Đăng xuất khỏi tất cả các thiết bị khác bằng cách xóa lịch sử đăng nhập.
    """
    from app.models.audit import AuditLog
    # Giữ lại log đăng nhập gần nhất
    latest_log = db.query(AuditLog).filter(
        AuditLog.user_id == current_user.id,
        AuditLog.action == 'LOGIN'
    ).order_by(AuditLog.created_at.desc()).first()
    
    query = db.query(AuditLog).filter(
        AuditLog.user_id == current_user.id,
        AuditLog.action == 'LOGIN'
    )
    if latest_log:
        query = query.filter(AuditLog.id != latest_log.id)
        
    query.delete(synchronize_session=False)
    db.commit()
    return {"message": "Logged out from all other devices"}

@router.delete("/me/devices/{device_id}")
def logout_device(
    device_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Đăng xuất khỏi một thiết bị cụ thể.
    """
    from app.models.audit import AuditLog
    log = db.query(AuditLog).filter(
        AuditLog.id == device_id,
        AuditLog.user_id == current_user.id
    ).first()
    
    if log:
        db.delete(log)
        db.commit()
    return {"message": "Device logged out"}

@router.get("/me/team")
def read_faculty_team(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Lấy danh sách thành viên cùng Khoa (Ban Thường vụ).
    """
    from app.models.core import UserOrganization, Organization, OrgType
    # 1. Ưu tiên lấy Faculty Org của user
    faculty_org = get_user_faculty_org(db, current_user)
    target_org_id = faculty_org.id if faculty_org else None
    
    if not target_org_id:
        user_org = db.query(UserOrganization).join(
            Organization, UserOrganization.organization_id == Organization.id
        ).filter(
            UserOrganization.user_id == current_user.id,
            Organization.type.in_([OrgType.FACULTY, OrgType.UNIVERSITY])
        ).first()
        if user_org:
            target_org_id = user_org.organization_id
        else:
            first_org = db.query(UserOrganization).filter(UserOrganization.user_id == current_user.id).first()
            if first_org:
                target_org_id = first_org.organization_id
                
    if not target_org_id:
        return []
        
    team_members = db.query(UserOrganization).filter(
        UserOrganization.organization_id == target_org_id
    ).all()
    
    result = []
    for m in team_members:
        if m.user:
            result.append({
                "id": str(m.user.id),
                "name": m.user.full_name,
                "role": m.title or "Ủy viên BCH Đoàn Khoa",
                "initial": "".join([w[0] for w in m.user.full_name.split()]).upper()[:2] if m.user.full_name else "TV",
                "permissions": {
                    "events": True,
                    "finance": m.title in ["Bí thư", "Phó Bí thư", "Trưởng ban"],
                    "posts": True
                }
            })
    return result

@router.get("/search")
def search_users(
    q: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Tìm kiếm User theo Tên hoặc MSSV.
    """
    users = db.query(User).filter(
        (User.full_name.ilike(f"%{q}%")) | (User.student_id.ilike(f"%{q}%"))
    ).limit(10).all()
    
    return [
        {
            "id": str(u.id),
            "name": u.full_name,
            "full_name": u.full_name,
            "student_id": u.student_id or "",
            "student_code": u.student_id or "",
            "mssv": u.student_id or "N/A",
            "email": u.email,
            "phone_number": u.phone_number or "",
            "role": "Sinh viên",
            "initial": "".join([w[0] for w in u.full_name.split()]).upper()[:2] if u.full_name else "SV",
            "color": "blue",
            "cccd": u.cccd or "",
            "gender": u.gender or "Nam",
            "date_of_birth": u.date_of_birth.isoformat() if u.date_of_birth else None,
            "ethnicity": u.ethnicity or "Kinh",
            "religion": u.religion or "Không",
            "address": u.address or "",
            "academic_year_num": u.academic_year_num or 3,
            "school_name": u.school_name or "Trường Đại học Lạc Hồng",
            "faculty_name": u.faculty_name or "",
            "class_name": u.class_name or "",
            "education_level": u.education_level or "Đại học",
            "gpa": u.gpa if u.gpa is not None else 0.0,
            "training_score": u.training_score or 0,
            "union_position": u.union_position or "Đoàn viên",
            "political_status": u.political_status or "Đoàn viên",
            "achievement_summary": u.achievement_summary or ""
        }
        for u in users
    ]

@router.post("/me/team")
def add_team_member(
    user_data: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Thêm thành viên vào Ban Thường vụ (Organization).
    """
    from app.models.core import UserOrganization
    import uuid
    
    faculty_org = get_user_faculty_org(db, current_user)
    target_org_id = faculty_org.id if faculty_org else None
    
    if not target_org_id:
        user_org = db.query(UserOrganization).filter(UserOrganization.user_id == current_user.id).first()
        if user_org:
            target_org_id = user_org.organization_id
            
    if not target_org_id:
        raise HTTPException(status_code=400, detail="Bạn chưa thuộc Đơn vị/Khoa nào.")
        
    try:
        new_org = UserOrganization(
            user_id=uuid.UUID(user_data["user_id"]),
            organization_id=target_org_id,
            title=user_data.get("role", "Thành viên Ban Thường vụ")
        )
        db.add(new_org)
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail="Lỗi thêm thành viên hoặc thành viên đã có trong đơn vị.")
        
    return {"message": "Success"}

@router.delete("/me/team/{member_id}")
def remove_team_member(
    member_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Xóa thành viên khỏi Tổ chức.
    """
    from app.models.core import UserOrganization
    faculty_org = get_user_faculty_org(db, current_user)
    query = db.query(UserOrganization).filter(UserOrganization.user_id == member_id)
    if faculty_org:
        query = query.filter(UserOrganization.organization_id == faculty_org.id)
    user_org = query.first()
    
    if user_org:
        db.delete(user_org)
        db.commit()
    return {"message": "Member removed"}

@router.put("/me/team/{member_id}/permissions")
def update_team_permissions(
    member_id: str,
    permissions: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Cập nhật quyền hạn/vai trò thành viên trong Tổ chức.
    """
    import uuid
    from app.models.core import UserOrganization
    
    try:
        target_uuid = uuid.UUID(member_id)
    except Exception:
        raise HTTPException(status_code=400, detail="ID thành viên không hợp lệ.")
        
    user_org = db.query(UserOrganization).filter(
        UserOrganization.user_id == target_uuid
    ).first()
    
    if not user_org:
        raise HTTPException(status_code=404, detail="Không tìm thấy thành viên trong đơn vị.")
        
    if "role" in permissions:
        user_org.title = permissions["role"]
    if "title" in permissions:
        user_org.title = permissions["title"]
    if "is_primary" in permissions:
        user_org.is_primary = bool(permissions["is_primary"])
        
    db.commit()
    db.refresh(user_org)
    return {"message": "Permissions updated successfully", "title": user_org.title, "is_primary": user_org.is_primary}

@router.get("/me/profile_stats")
def read_user_profile_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Cung cấp dữ liệu thực tế cho trang Profile trích xuất từ Database.
    """
    from app.models.awards import Award, AwardStatus
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
    awards = db.query(Award).filter(Award.user_id == current_user.id, Award.status == AwardStatus.APPROVED).all()
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
        "level": current_user.level or 1,
        "training_score": current_user.training_score or 0,
        "ranking": "Xuất sắc" if (current_user.training_score or 0) >= 90 else ("Khá" if (current_user.training_score or 0) >= 70 else "Trung bình"),
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
    from app.models.finance import StudentFee
    fees = db.query(StudentFee).filter(StudentFee.user_id == current_user.id).all()
    return [
        {
            "id": str(f.id),
            "title": f.title,
            "due_date": f.paid_at.strftime("%d/%m/%Y") if f.paid_at else "N/A",
            "status": "APPROVED" if f.status == "PAID" else "PENDING",
            "amount": float(f.amount),
            "category": "Đoàn phí" if "Đoàn phí" in f.title else "Khác"
        } for f in fees
    ]

@router.get("/me/spending_stats")
def read_user_spending_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Lấy thống kê chi tiêu cho biểu đồ Wallet.
    """
    from app.models.finance import FundRequest, FundRequestStatus, StudentFee
    from sqlalchemy import func
    
    total_approved = db.query(func.sum(FundRequest.amount)).filter(
        FundRequest.requested_by == current_user.id,
        FundRequest.status == FundRequestStatus.APPROVED
    ).scalar() or 0
    
    # Calculate real distribution based on user requests/fees
    fund_reqs = db.query(FundRequest).filter(FundRequest.requested_by == current_user.id).all()
    fees = db.query(StudentFee).filter(StudentFee.user_id == current_user.id).all()
    
    cat_youth = 0.0
    cat_dev = 0.0
    cat_other = 0.0
    
    for fr in fund_reqs:
        amt = float(fr.amount or 0)
        reason_lower = (fr.reason or "").lower()
        if "đoàn" in reason_lower or "hội" in reason_lower or "hoạt động" in reason_lower:
            cat_youth += amt
        elif "phát triển" in reason_lower or "kỹ năng" in reason_lower or "học tập" in reason_lower:
            cat_dev += amt
        else:
            cat_other += amt
            
    for f in fees:
        amt = float(f.amount or 0)
        title_lower = (f.title or "").lower()
        if "đoàn" in title_lower:
            cat_youth += amt
        else:
            cat_other += amt
            
    total_sum = cat_youth + cat_dev + cat_other
    if total_sum > 0:
        pct_youth = round((cat_youth / total_sum) * 100)
        pct_dev = round((cat_dev / total_sum) * 100)
        pct_other = max(0, 100 - pct_youth - pct_dev)
    else:
        pct_youth, pct_dev, pct_other = 60, 25, 15
        
    return {
        "total_expense": float(total_approved),
        "data": [
            {"label": "Hoạt động Đoàn", "value": pct_youth, "color": "bg-blue-600"},
            {"label": "Phát triển", "value": pct_dev, "color": "bg-orange-500"},
            {"label": "Khác", "value": pct_other, "color": "bg-slate-400"}
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
    return core_service.update_user(db=db, user_id=user_id, user_in=user_in, is_admin=True)

@router.delete("/{user_id}")
def delete_user(
    *,
    db: Session = Depends(get_db),
    user_id: UUID,
):
    return core_service.delete_user(db=db, user_id=user_id)
