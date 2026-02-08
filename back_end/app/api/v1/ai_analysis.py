from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.api.deps import get_db
from app.models.event import Event
from app.models.participation import Participation
from app.models.user import User
from datetime import datetime, timedelta

router = APIRouter()

@router.get("/dashboard-stats")
def get_ai_insights(db: Session = Depends(get_db)):
    # 1. THỐNG KÊ CƠ BẢN
    total_students = db.query(User).filter(User.role == "STUDENT").count()
    total_events = db.query(Event).count()
    
    # 2. PHÂN TÍCH "SỨC KHỎE" PHONG TRÀO (Active vs Inactive)
    # Định nghĩa "Active": Có tham gia ít nhất 1 sự kiện trong 30 ngày qua
    last_30_days = datetime.utcnow() - timedelta(days=30)
    
    active_user_count = db.query(Participation.user_id)\
        .filter(Participation.check_in_time >= last_30_days)\
        .distinct().count()
        
    inactive_user_count = total_students - active_user_count
    
    engagement_rate = round((active_user_count / total_students * 100), 1) if total_students > 0 else 0

    # 3. DỰ BÁO SỰ KIỆN SẮP TỚI (Giả lập AI)
    # Logic: Lấy trung bình số người tham gia các sự kiện đã qua (Status = COMPLETED)
    completed_events = db.query(Event).filter(Event.status == "COMPLETED").all()
    
    avg_participants = 0
    if completed_events:
        total_participants = 0
        for event in completed_events:
            # Đếm số người tham gia sự kiện đó
            p_count = db.query(Participation).filter(Participation.event_id == event.id).count()
            total_participants += p_count
        avg_participants = int(total_participants / len(completed_events))
    
    # Lấy 1 sự kiện sắp tới để dự báo
    upcoming_event = db.query(Event).filter(Event.status == "UPCOMING").first()
    prediction = {
        "event_name": upcoming_event.title if upcoming_event else "Chưa có sự kiện",
        "predicted_attendance": int(avg_participants * 1.1), # Giả sử AI dự đoán tăng 10% theo xu hướng
        "confidence_score": "85%"
    }

    # 4. GỢI Ý HÀNH ĐỘNG (Actionable Insights)
    insights = []
    if engagement_rate < 50:
        insights.append({
            "type": "warning",
            "message": f"Tỷ lệ tương tác thấp ({engagement_rate}%). Có {inactive_user_count} sinh viên 'ngủ đông'. Hãy gửi thông báo khảo sát nhu cầu ngay."
        })
    else:
        insights.append({
            "type": "success",
            "message": f"Phong trào đang rất tốt! Tỷ lệ tham gia đạt {engagement_rate}%."
        })

    return {
        "overview": {
            "total_students": total_students,
            "active_now": active_user_count,
            "engagement_rate": engagement_rate
        },
        "prediction": prediction,
        "insights": insights
    }