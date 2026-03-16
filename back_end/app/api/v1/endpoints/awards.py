from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

from app.api.deps import get_db
from app.models.awards import Award
from app.schemas.award_schemas import AwardCreate, AwardUpdate, AwardResponse

router = APIRouter()

@router.post("/", response_model=AwardResponse)
def create_award(
    *,
    db: Session = Depends(get_db),
    award_in: AwardCreate,
):
    db_obj = Award(**award_in.model_dump())
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

@router.get("/", response_model=List[AwardResponse])
def read_awards(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    # Sử dụng join để lấy thông tin User kèm theo Award
    awards = db.query(Award).offset(skip).limit(limit).all()
    
    # Map các trường từ User sang Award object để khớp với Schema AwardResponse
    for award in awards:
        if award.user:
            award.full_name = award.user.full_name
            award.student_id = award.user.student_id
            award.university = award.user.university
            
    return awards

@router.get("/{award_id}", response_model=AwardResponse)
def read_award(
    award_id: UUID,
    db: Session = Depends(get_db)
):
    award = db.query(Award).filter(Award.id == award_id).first()
    if not award:
        raise HTTPException(status_code=404, detail="Award not found")
    return award

@router.put("/{award_id}", response_model=AwardResponse)
def update_award(
    *,
    db: Session = Depends(get_db),
    award_id: UUID,
    award_in: AwardUpdate,
):
    award = db.query(Award).filter(Award.id == award_id).first()
    if not award:
        raise HTTPException(status_code=404, detail="Award not found")
    
    update_data = award_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(award, field, value)
        
    db.add(award)
    db.commit()
    db.refresh(award)
    return award

@router.get("/stats")
def read_award_stats(
    timescale: str = "Tháng này",
    db: Session = Depends(get_db)
):
    # Đây là endpoint demo, trong thực tế sẽ tính toán từ database
    
    return {
        "summary": {
            "remainingDays": "15",
            "submitted": "128",
            "approved": "85",
            "passRate": "66%"
        },
        "stats": [
            {
                "label": "TỔNG HỒ SƠ",
                "title": "Khen thưởng",
                "val": "128 hồ sơ",
                "icon": "folder_shared",
                "color": "blue",
                "progress": 70,
                "action": "Đang xử lý"
            },
            {
                "label": "HOÀN THÀNH",
                "title": "Đã xét duyệt",
                "val": "85 hồ sơ",
                "icon": "verified",
                "color": "orange",
                "trend": "Tăng 12% so với tháng trước"
            },
            {
                "label": "CẢNH BÁO",
                "title": "Chậm tiến độ",
                "val": "12 chi đoàn",
                "icon": "warning",
                "color": "rose",
                "alert": "Cần nhắc nhở ngay"
            }
        ],
        "rankings": [
            {
                "rank": 1,
                "icon": "🥇",
                "class": "K71-CLC-KHTT",
                "university": "Đại học Công nghệ",
                "dept": "Khoa CNTT",
                "score": 950,
                "trend": "Thăng hạng",
                "trendColor": "emerald",
                "tags": ["Đoàn phí 100%", "5 SV 5 Tốt"]
            },
            {
                "rank": 2,
                "icon": "🥈",
                "class": "K71-CAC-KHTT",
                "university": "Đại học Công nghệ",
                "dept": "Khoa CNTT",
                "score": 920,
                "trend": "Ổn định",
                "trendColor": "slate",
                "tags": ["Đoàn phí 100%"]
            }
        ],
        "warningClass": {
            "rank": 45,
            "class": "K70-T-KHTT",
            "university": "Đại học Công nghệ",
            "dept": "Khoa CNTT",
            "score": 420,
            "trend": "Giảm sâu",
            "note": "Chưa nộp hồ sơ tháng"
        }
    }

@router.delete("/{award_id}")
def delete_award(
    *,
    db: Session = Depends(get_db),
    award_id: UUID,
):
    award = db.query(Award).filter(Award.id == award_id).first()
    if not award:
        raise HTTPException(status_code=404, detail="Award not found")
    db.delete(award)
    db.commit()
    return {"message": "Award deleted successfully"}
