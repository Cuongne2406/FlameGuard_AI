from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from app.api.deps import get_db, get_current_user
from app.models.user import User
from app.models.event import Event
from app.models.participation import Participation

router = APIRouter()

@router.get("/leaderboard")
def get_leaderboard(db: Session = Depends(get_db)):
    """
    API tính bảng xếp hạng:
    1. Top Cá nhân (Dựa trên tổng điểm tham gia sự kiện)
    2. Top Chi đoàn (Tổng điểm của tất cả thành viên trong lớp)
    """
    
    # --- 1. TÍNH ĐIỂM CÁ NHÂN ---
    # SQL Logic: Join User -> Participation -> Event. Sum(Event.points) Group By User.
    user_scores = db.query(
        User,
        func.sum(Event.points).label("total_points")
    ).join(Participation, User.id == Participation.user_id)\
     .join(Event, Participation.event_id == Event.id)\
     .filter(User.role == "STUDENT")\
     .group_by(User.id)\
     .order_by(desc("total_points"))\
     .limit(10)\
     .all()

    # Format dữ liệu trả về cho Top 3 và List
    top_individuals = []
    for user, points in user_scores:
        top_individuals.append({
            "id": user.id,
            "full_name": user.full_name,
            "class_name": user.class_name,
            "points": points or 0,
            "avatar_char": user.full_name.split()[-1][0].upper() if user.full_name else "U"
        })

    # --- 2. TÍNH ĐIỂM CHI ĐOÀN (LỚP) ---
    # Logic: Group by class_name
    class_scores = db.query(
        User.class_name,
        func.sum(Event.points).label("total_points"),
        func.count(User.id).label("member_count")
    ).join(Participation, User.id == Participation.user_id)\
     .join(Event, Participation.event_id == Event.id)\
     .filter(User.class_name != None)\
     .group_by(User.class_name)\
     .order_by(desc("total_points"))\
     .limit(20)\
     .all()

    top_classes = []
    for idx, (class_name, points, count) in enumerate(class_scores):
        top_classes.append({
            "rank": idx + 1,
            "class_name": class_name,
            "total_points": points or 0,
            "member_count": count,
            "trend": "+5%" # Hardcode tạm trend
        })

    return {
        "top3": top_individuals[:3], # Lấy 3 người đầu
        "individuals": top_individuals, # Danh sách đầy đủ
        "classes": top_classes
    }