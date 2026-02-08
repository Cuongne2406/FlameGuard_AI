from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.api import deps
from app.models.participation import Participation
from app.models.user import User

router = APIRouter()

@router.get("/me")
def get_my_activities(
    year: str = None, 
    semester: str = None,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    query = db.query(Participation).filter(Participation.user_id == current_user.id)
    
    if year:
        query = query.filter(Participation.school_year == year)
    if semester:
        query = query.filter(Participation.semester == semester)
        
    activities = query.order_by(Participation.date.desc()).all()
    
    # Tính tổng điểm cho Stats Card
    total_points = sum(a.points for a in activities)
    total_count = len(activities)

    return {
        "stats": {
            "total": total_count,
            "points": total_points,
            "rank": "Xuất sắc" if total_points >= 80 else "Khá" # Logic giả định
        },
        "data": activities
    }