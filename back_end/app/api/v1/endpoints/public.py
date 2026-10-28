from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID
from app.api.deps import get_db
from app.models.events import Event, EventStatus
from app.models.news import News

router = APIRouter()

@router.get("/activities")
def read_public_activities(db: Session = Depends(get_db)):
    """
    Lấy danh sách hoạt động công khai để hiển thị trên Landing Page / Activities Page.
    """
    events = db.query(Event).filter(Event.status == EventStatus.PUBLISHED).limit(6).all()
    
    activities_data = []
    for evt in events:
        activities_data.append({
            "id": str(evt.id),
            "title": evt.name,
            "date": evt.start_time.strftime("%d/%m/%Y") if evt.start_time else "Chưa xác định",
            "location": evt.location,
            "participants": f"{evt.capacity} Chỗ" if hasattr(evt, 'capacity') and evt.capacity else "N/A",
            "type": "Sự kiện",
            "image_url": f"https://picsum.photos/seed/{evt.id}/800/600"
        })
    return activities_data

@router.get("/home")
def read_public_home(db: Session = Depends(get_db)):
    """
    Dữ liệu tổng hợp cho trang chủ công khai.
    """
    featured_event = db.query(Event).filter(Event.status == EventStatus.PUBLISHED).order_by(Event.start_time.desc()).first()
    recent_news = db.query(News).order_by(News.created_at.desc()).limit(2).all()
    upcoming_events = db.query(Event).filter(Event.status == EventStatus.PUBLISHED).limit(3).all()
    
    return {
        "featuredEvent": {
            "title": featured_event.name if featured_event else "Đang cập nhật sự kiện mới",
            "desc": featured_event.location if featured_event else "Hành trình kết nối sinh viên.",
            "image": f"https://picsum.photos/seed/{featured_event.id if featured_event else 'home'}/800/600"
        },
        "news": [
            {
                "id": str(n.id),
                "title": n.title,
                "date": n.created_at.strftime("%d/%m/%Y") if n.created_at else "N/A",
                "image": n.image_url or f"https://picsum.photos/seed/{n.id}/600/400"
            }
            for n in recent_news
        ],
        "upcomingEvents": [
            {
                "day": evt.start_time.strftime("%d") if evt.start_time else "01",
                "month": evt.start_time.strftime("%m") if evt.start_time else "01",
                "title": evt.name,
                "category": "Sự kiện"
            }
            for evt in upcoming_events
        ],
        "featuredStudent": None # Sẽ cập nhật khi có bảng Vinh danh/Award
    }

@router.get("/academic")
def read_public_academic_docs(db: Session = Depends(get_db)):
    """
    Dữ liệu tài liệu học thuật cho public page.
    """
    from app.models.documents import DigitalDocument
    docs = db.query(DigitalDocument).limit(5).all()
    return [
        {
            "id": str(d.id),
            "title": d.document_type, # Tạm dùng loại làm tiêu đề hoặc content
            "type": "PDF",
            "size": "N/A",
            "downloads": 0
        }
        for d in docs
    ]

@router.get("/news/{news_id}")
def read_news_detail(news_id: UUID, db: Session = Depends(get_db)):
    """
    Lấy chi tiết một bản tin.
    """
    news = db.query(News).filter(News.id == news_id).first()
    if not news:
        return {"error": "News not found"}
    
    return {
        "id": str(news.id),
        "title": news.title,
        "category": news.category or "Hoạt động",
        "date": news.created_at.strftime("%d/%m/%Y") if news.created_at else "N/A",
        "readTime": "5 phút đọc",
        "author": news.author.full_name if news.author else "Ban Truyền thông",
        "content": news.content or news.excerpt,
        "image": news.image_url or f"https://picsum.photos/seed/{news.id}/900/500"
    }

@router.post("/contact")
def submit_public_contact(
    data: dict,
    db: Session = Depends(get_db)
):
    """
    Tiếp nhận phản hồi / liên hệ từ trang liên hệ công khai và lưu vào nhật ký hệ thống.
    """
    from app.models.audit import AuditLog
    
    audit = AuditLog(
        action="CONTACT_SUBMISSION",
        entity_type="ContactFeedback",
        new_values=data
    )
    db.add(audit)
    db.commit()
    return {"status": "success", "message": "Thông tin liên hệ của bạn đã được gửi thành công!"}
