from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta
from app.api.deps import get_db, get_current_user
from app.models.user import User
# from app.models.event import Event (Nếu cần sau này)

router = APIRouter()

@router.get("/summary")
def get_dashboard_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # 1. Thống kê User
    total_students = db.query(User).count()
    
    # --- [SỬA LỖI TẠI ĐÂY] ---
    # Vì đã xóa cột is_paid, ta không query nó nữa.
    # Gán mặc định bằng 0 hoặc logic khác tùy bạn.
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