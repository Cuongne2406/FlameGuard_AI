from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import Optional, List
from sqlalchemy import func
from app.api.deps import get_db
from app.models.core import User
from app.models.finance import Budget
from app.models.events import Event
from app.models.ai import AISentiment

router = APIRouter()

@router.get("/dashboard")
def get_system_dashboard(year: Optional[str] = None, semester: Optional[str] = None, db: Session = Depends(get_db)):
    # 1. Total Members
    total_members = db.query(User).count()
    
    # 2. Total Budget
    budget_sum = db.query(func.sum(Budget.total_amount)).scalar() or 0
    total_budget_str = f"{budget_sum:,.0f} VNĐ"
    
    # 3. Active Events
    active_events = db.query(Event).filter(Event.status == "LIVE").count()

    # 4. Timeline Events (Real data from DB)
    upcoming_events = db.query(Event).order_by(Event.start_time.asc()).limit(3).all()
    timelines_data = []
    colors = ["bg-blue-600", "bg-yellow-500", "bg-emerald-500"]
    for idx, evt in enumerate(upcoming_events):
        start_str = evt.start_time.strftime("%d/%m") if evt.start_time else "TBA"
        end_str = evt.end_time.strftime("%d/%m/%Y") if evt.end_time else "TBA"
        date_str = f"{start_str} - {end_str}"
        percent = 100 if evt.status == "ENDED" else (50 if evt.status == "LIVE" else 0)
        status_str = "Hoàn thành" if evt.status == "ENDED" else ("Đang diễn ra" if evt.status == "LIVE" else "Sắp diễn ra")
        color_class = colors[idx % len(colors)]
        
        timelines_data.append({
            "id": str(evt.id),
            "label": evt.name,
            "date": date_str,
            "percent": percent,
            "status": status_str,
            "color": color_class
        })

    # 5. Risks (No fake data, fetch real logic if available, else empty)
    risks_data = []
    
    # 6. AI Sentiments
    positive_count = db.query(AISentiment).filter(AISentiment.sentiment_score >= 0.7).count()
    negative_count = db.query(AISentiment).filter(AISentiment.sentiment_score <= 0.3).count()
    neutral_count = db.query(AISentiment).filter(
        (AISentiment.sentiment_score > 0.3) & (AISentiment.sentiment_score < 0.7)
    ).count()
    
    total_sentiments = positive_count + negative_count + neutral_count
    
    if total_sentiments == 0:
        sentiment_data = []
        ai_keywords = []
    else:
        sentiment_data = [
            { "name": "Tích cực", "value": round((positive_count / total_sentiments) * 100), "color": "#4F46E5" },
            { "name": "Tiêu cực", "value": round((negative_count / total_sentiments) * 100), "color": "#EF4444" },
            { "name": "Trung lập", "value": round((neutral_count / total_sentiments) * 100), "color": "#CBD5E1" }
        ]
        # Get latest distinct keywords
        all_sentiments = db.query(AISentiment.detected_keywords).all()
        keywords_set = set()
        for s in all_sentiments:
            if s[0] and isinstance(s[0], list):
                keywords_set.update(s[0])
        ai_keywords = list(keywords_set)[:5]

    # 7. Suggested Event for User Dashboard
    suggested_event = db.query(Event).filter(Event.status == "LIVE").order_by(Event.start_time.asc()).first()
    suggested_event_data = None
    if suggested_event:
        suggested_event_data = {
            "id": str(suggested_event.id),
            "name": suggested_event.name,
            "date": suggested_event.start_time.strftime("%d/%m/%Y") if suggested_event.start_time else "TBA",
            "location": suggested_event.location
        }

    return {
        "stats": {
            "totalMembers": f"{total_members:,}",
            "memberGrowth": "+5.2% so với kỳ trước",
            "totalBudgetStr": total_budget_str,
            "budgetLeftPercent": 15,
            "activeEvents": active_events
        },
        "timelines": timelines_data,
        "risks": risks_data,
        "aiSentiment": sentiment_data,
        "aiKeywords": ai_keywords or ["Chưa có dữ liệu"],
        "suggestedEvent": suggested_event_data,
        "quickActions": [
            {"id": 1, "title": "Giấy xác nhận SV", "icon": "file_text", "primary": True},
            {"id": 2, "title": "Bảng điểm Rèn luyện", "icon": "bar_chart", "primary": False},
            {"id": 3, "title": "Đăng ký Event", "icon": "event", "primary": False}
        ]
    }
