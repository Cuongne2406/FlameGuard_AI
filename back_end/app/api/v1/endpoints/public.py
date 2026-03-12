from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.api.deps import get_db
from app.models.events import Event, EventStatus

router = APIRouter()

@router.get("/activities")
def read_public_activities(db: Session = Depends(get_db)):
    """
    Lấy danh sách hoạt động công khai để hiển thị trên Landing Page / Activities Page.
    """
    events = db.query(Event).filter(Event.status == EventStatus.PUBLISHED).limit(6).all()
    
    if not events:
        # Fallback if DB is empty
        return [
            {
                "id": "1",
                "title": "Hội thảo Tương lai AI trong Kỷ nguyên số",
                "date": "25 Tháng 03, 2026",
                "location": "Hội trường A",
                "participants": "1.2k Tham gia",
                "type": "Học thuật",
                "image_url": "https://picsum.photos/seed/ai-workshop/800/600"
            },
            {
                "id": "2",
                "title": "Cuộc thi Lập trình viên Tài năng 2026",
                "date": "10 Tháng 04, 2026",
                "location": "Phòng máy B3.01",
                "participants": "500 Đăng ký",
                "type": "Cuộc thi",
                "image_url": "https://picsum.photos/seed/hackathon/800/600"
            },
            {
                "id": "3",
                "title": "Khai mạc Hội thao cấp Trường 2026",
                "date": "20 Tháng 04, 2026",
                "location": "Sân vận động Phú Thọ",
                "participants": "3.5k Tham gia",
                "type": "Thể thao",
                "image_url": "https://picsum.photos/seed/sports/800/600"
            }
        ]

    activities_data = []
    for evt in events:
        activities_data.append({
            "id": str(evt.id),
            "title": evt.name,
            "date": evt.start_time.strftime("%d Tháng %m, %Y") if evt.start_time else "Chưa xác định",
            "location": evt.location,
            "participants": f"{evt.capacity} Chỗ" if hasattr(evt, 'capacity') and evt.capacity else "N/A",
            "type": "Sự kiện",
            "image_url": f"https://picsum.photos/seed/{evt.id}/800/600"
        })
    return activities_data

@router.get("/news")
def read_public_news(db: Session = Depends(get_db)):
    """
    Lấy danh sách tin tức công khai
    """
    return [
        {
            "id": 1,
            "title": "Trường ĐH Tổ chức Lễ Kỷ niệm 30 năm Thành lập",
            "excerpt": "Hơn 10.000 cựu sinh viên và khách mời sẽ tham dự sự kiện lớn nhất năm 2026.",
            "date": "10/03/2026",
            "image": "https://picsum.photos/seed/news1/800/600"
        },
        {
            "id": 2,
            "title": "Khoa CNTT ra mắt Phòng lab AI hiện đại nhất",
            "excerpt": "Được trang bị dàn máy tính hiệu năng cao hỗ trợ huấn luyện các mô hình GenAI.",
            "date": "08/03/2026",
            "image": "https://picsum.photos/seed/news2/800/600"
        }
    ]
