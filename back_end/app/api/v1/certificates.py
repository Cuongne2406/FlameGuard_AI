from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.api import deps
from app.models.certificate import Certificate
from app.models.user import User

router = APIRouter()

@router.get("/me")
def get_my_certificates(
    type: str = None, 
    year: str = None,
    level: str = None,
    search: str = None,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    query = db.query(Certificate).filter(Certificate.user_id == current_user.id)
    
    # Logic lọc dữ liệu ngay tại Database (Tối ưu hiệu năng)
    if type and type != 'all':
        if type == 'volunteer': # Lấy cả volunteer, summer, blood
            query = query.filter(Certificate.type.in_(['volunteer', 'summer', 'blood']))
        else:
            query = query.filter(Certificate.type == type)
            
    if year:
        query = query.filter(Certificate.year == year)
        
    if level:
        query = query.filter(Certificate.level == level)
        
    if search:
        query = query.filter(Certificate.title.ilike(f"%{search}%"))

    # Sắp xếp mới nhất lên đầu
    certificates = query.order_by(Certificate.date.desc()).all()
    
    return [
        {
            "id": c.id,
            "type": c.type,
            "title": c.title,
            "issuer": c.issuer,
            "date": c.date.strftime("%d/%m/%Y") if c.date else "",
            "month": f"Tháng {c.date.month}" if c.date else "",
            "year": c.year,
            "level": c.level,
            "code": c.code,
            "image": c.image_url,
            "verified": c.verified,
            "description": c.description
        }
        for c in certificates
    ]