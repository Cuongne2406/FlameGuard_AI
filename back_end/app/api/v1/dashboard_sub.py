# back_end/app/api/v1/dashboard_sub.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.api import deps
from app.models.user import User
from app.models.event import Event
from app.models.participation import Participation
from app.models.achievement import Achievement
from datetime import datetime


router = APIRouter()

@router.get("/stats")
def get_sub_admin_stats(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    # 1. Lấy thông tin lớp của Sub Admin
    my_class = current_user.class_name
    
    # 2. Đếm số thành viên trong lớp
    total_students = db.query(User).filter(User.class_name == my_class).count()
    
    # 3. Tính tỷ lệ tham gia sự kiện gần nhất của lớp
    # (Logic này có thể phức tạp tùy vào cách bạn lưu, ở đây ví dụ đơn giản)
    last_event = db.query(Event).order_by(Event.start_time.desc()).first()
    attendance_rate = 0
    if last_event and total_students > 0:
        attended_count = db.query(Participation).join(User).filter(
            Participation.event_id == last_event.id,
            User.class_name == my_class,
            Participation.status == "ATTENDED"
        ).count()
        attendance_rate = int((attended_count / total_students) * 100)

    # 4. Lấy danh sách hoạt động gần đây của lớp
    recent_activities = db.query(Participation).join(User).filter(
        User.class_name == my_class
    ).order_by(Participation.check_in_time.desc()).limit(5).all()
    
    formatted_activities = []
    for act in recent_activities:
        formatted_activities.append({
            "name": act.user.full_name,
            "action": f"Vừa check-in: {act.event.title}",
            "time": act.check_in_time.strftime("%H:%M %d/%m"),
            "avatar": act.user.avatar_url
        })

    return {
        "greeting": f"Chào buổi sáng, Đ/c {current_user.full_name.split()[-1]}!",
        "date": datetime.now().strftime("Thứ %w, %d/%m/%Y"),
        "attendance_rate": attendance_rate,
        "fund": "1.500.000đ", # Ví dụ hardcode hoặc lấy từ bảng Fund nếu có
        "recent_activities": formatted_activities
    }


@router.get("/management")
def get_management_dashboard(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    # 1. Xác định lớp của Sub Admin
    my_class = current_user.class_name
    
    # --- THỐNG KÊ (STATS) ---
    # a. Tổng đoàn viên
    total_members = db.query(User).filter(User.class_name == my_class).count()
    
    # b. Điểm trung bình (Giả sử lấy từ bảng điểm rèn luyện hoặc tính tổng)
    # Ví dụ: Tính trung bình tổng điểm tham gia của tất cả thành viên trong lớp
    # Logic này tùy thuộc vào DB của bạn, đây là ví dụ:
    avg_score_query = db.query(func.avg(Participation.earned_points)).join(User).filter(User.class_name == my_class).scalar()
    avg_score = round(avg_score_query, 1) if avg_score_query else 0.0
    
    # c. Yêu cầu cần duyệt (Giả sử là các Participation có status='PENDING')
    pending_requests = db.query(Participation).join(User).filter(
        User.class_name == my_class,
        Participation.status == 'PENDING' # Hoặc trạng thái chờ duyệt của bạn
    ).count()

    # --- HOẠT ĐỘNG GẦN ĐÂY (ACTIVITIES) ---
    # Lấy 5 hoạt động mới nhất của thành viên trong lớp
    recent_acts = db.query(Participation).join(User).filter(
        User.class_name == my_class
    ).order_by(Participation.check_in_time.desc()).limit(5).all()
    
    formatted_activities = []
    for act in recent_acts:
        status_map = {
            "ATTENDED": ("success", "Thành công"),
            "PENDING": ("pending", "Chờ duyệt"),
            "REJECTED": ("info", "Từ chối") # Ví dụ
        }
        st_code, st_text = status_map.get(act.status, ("info", "Thông báo"))
        
        formatted_activities.append({
            "id": act.id,
            "name": act.user.full_name,
            "time": act.check_in_time.strftime("%H:%M %d/%m"), # Format thời gian
            "desc": f"Check-in: {act.event.title}", # Hoặc nội dung khác
            "avatar": act.user.avatar_url,
            "status": st_code,
            "statusText": st_text
        })

    return {
        "stats": {
            "total_members": total_members,
            "avg_score": avg_score,
            "trend": "+0.5 trend", # Có thể tính toán so với tháng trước nếu muốn
            "pending_requests": pending_requests
        },
        "activities": formatted_activities
    }