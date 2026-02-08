from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta
from app.api import deps
from app.models.user import User
from app.models.participation import Participation

router = APIRouter()

@router.get("")
def get_ranking(
    period: str = "semester", # semester, month, year
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    # 1. Xác định khoảng thời gian
    now = datetime.now()
    if period == "month":
        start_date = now.replace(day=1, hour=0, minute=0, second=0)
    elif period == "year":
        start_date = now.replace(month=1, day=1)
    else: # semester (giả định 6 tháng gần nhất)
        start_date = now - timedelta(days=180)

    # 2. Query tổng hợp điểm từ bảng Participation
    # Bạn có thể join thêm bảng Achievement nếu có cột điểm thưởng ở đó
    rank_results = db.query(
        User.id,
        User.full_name,
        User.class_name,
        User.avatar_url,
        func.sum(Participation.earned_points).label("total_score"),
        func.count(Participation.id).label("event_count")
    ).join(Participation, User.id == Participation.user_id)\
     .filter(Participation.check_in_time >= start_date)\
     .group_by(User.id)\
     .order_by(func.sum(Participation.earned_points).desc())\
     .all()

    # 3. Định dạng lại dữ liệu trả về cho Frontend
    formatted_list = []
    for index, item in enumerate(rank_results):
        formatted_list.append({
            "rank": index + 1,
            "id": item.id,
            "name": item.full_name,
            "class": item.class_name or "Chưa cập nhật",
            "avatar": item.avatar_url,
            "score": int(item.total_score or 0),
            "events": item.event_count,
            "isMe": item.id == current_user.id
        })

    # Tách Top 3 và danh sách còn lại
    # Lưu ý: Frontend của bạn muốn Top 3 sắp xếp theo thứ tự: [Hạng 2, Hạng 1, Hạng 3] để hiện podium
    top_3_raw = formatted_list[:3]
    podium = []
    if len(top_3_raw) >= 2: podium.append(top_3_raw[1]) # Hạng 2
    if len(top_3_raw) >= 1: podium.append(top_3_raw[0]) # Hạng 1
    if len(top_3_raw) >= 3: podium.append(top_3_raw[2]) # Hạng 3

    return {
        "top3": podium,
        "listRank": formatted_list[3:] if len(formatted_list) > 3 else []
    }