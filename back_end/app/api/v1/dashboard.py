from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta

from app.api.deps import get_db, get_current_user
from app.models.user import User
from app.models.event import Event
from app.models.participation import Participation
from app.schemas.dashboard import StudentDashboardResponse

router = APIRouter()

# --- ENDPOINT 1: DÀNH CHO ROLE USER (SINH VIÊN) ---
@router.get("/student/overview", response_model=StudentDashboardResponse)
def get_student_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "STUDENT":
        raise HTTPException(status_code=403, detail="Yêu cầu quyền Sinh viên")

    # 1. TÍNH TỔNG ĐIỂM THẬT (Từ các sự kiện đã tham gia)
    total_points = db.query(func.sum(Event.points))\
        .join(Participation, Participation.event_id == Event.id)\
        .filter(Participation.user_id == current_user.id)\
        .scalar() or 0

    # 2. ĐẾM SỐ SỰ KIỆN ĐÃ THAM GIA THẬT
    event_count = db.query(Participation).filter(Participation.user_id == current_user.id).count()

    # 3. LẤY NHIỆM VỤ HÔM NAY (Thực tế theo ngày hiện tại)
    today_start = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    today_end = today_start + timedelta(days=1)
    
    today_events = db.query(Event)\
        .filter(Event.start_time >= today_start, Event.start_time < today_end)\
        .limit(3).all()

    tasks = []
    for ev in today_events:
        # Kiểm tra xem user đã tham gia sự kiện này chưa
        is_joined = db.query(Participation).filter(
            Participation.user_id == current_user.id, 
            Participation.event_id == ev.id
        ).first()
        
        tasks.append({
            "id": ev.id,
            "title": ev.title,
            "time": ev.start_time.strftime("%H:%M"),
            "location": ev.location,
            "status": "attended" if is_joined else "pending",
            "requireAttendance": True
        })

    # 4. TÍNH XẾP HẠNG THỰC TẾ (Logic: Đếm số người có tổng điểm cao hơn mình)
    # Query: Tính tổng điểm của tất cả sinh viên
    subquery = db.query(
        Participation.user_id, 
        func.sum(Event.points).label('total_score')
    ).join(Event).group_by(Participation.user_id).subquery()

    higher_scores_count = db.query(subquery).filter(subquery.c.total_score > total_points).count()
    rank_val = higher_scores_count + 1
    
    total_students = db.query(User).filter(User.role == "STUDENT").count()

    return {
        "stats": {
            "points": {
                "value": f"{int(total_points)}/100", 
                "trend": "up" if total_points > 0 else "neutral", 
                "change": "Điểm rèn luyện tích lũy"
            },
            "events": {
                "value": str(event_count), 
                "trend": "up", 
                "change": "Hoạt động đã tham gia"
            },
            "rank": {
                "value": f"{rank_val:02d}/{total_students}", 
                "trend": "neutral", 
                "change": "Xếp hạng toàn khoa"
            }
        },
        "tasks": tasks
    }

@router.get("/summary")
def get_dashboard_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # 1. Thống kê User
    total_students = db.query(User).count()
    
    paid_students = 0 
    unpaid_students = 0
    # -------------------------

    # 2. (Giả lập) Thống kê Điểm AI - Sau này sẽ query bảng AI_Score
    ai_stats = "Trung bình"
    
    # 3. Dữ liệu Recent Check-ins (Lấy 5 người login gần nhất dựa trên last_login)
    recent_checkins_query = db.query(User).filter(User.last_login != None).order_by(User.last_login.desc()).limit(5).all()
    recent_checkins = []
    
    for user in recent_checkins_query:
        # Tính thời gian tương đối cho đẹp (Vd: "Vừa xong", "Admin Login")
        time_str = user.last_login.strftime("%H:%M %d/%m")
        recent_checkins.append({
            "name": user.full_name,
            "event": "Đăng nhập hệ thống", # Tạm thời để text này
            "time": time_str
        })

    # 4. Dữ liệu Biểu đồ (Giả lập để không lỗi frontend)
    chart_data = []
    today = datetime.now()
    for i in range(6, -1, -1):
        date = today - timedelta(days=i)
        # Tạm thời random hoặc để 0, sau này nối bảng Events sau
        count = 0 
        chart_data.append({"date": date.strftime("%d/%m"), "count": count})

    return {
        "stats": {
            "total_students": total_students,
            "ai_status": ai_stats,
            # Thêm trường này nếu frontend cần dùng để vẽ thanh loading
            "total_checkins": 50 
        },
        "fee_status": {
            "paid": paid_students,
            "unpaid": unpaid_students
        },
        "chart": chart_data,
        "recent_checkins": recent_checkins
    }

