from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from uuid import UUID

from app.api.deps import get_db
from app.models.events import Event, EventStatus
from app.models.news import News

router = APIRouter()


@router.get("/activities")
def read_public_activities(db: Session = Depends(get_db)):
    events = db.query(Event).filter(Event.status == EventStatus.PUBLISHED).limit(6).all()

    activities_data = []
    for evt in events:
        activities_data.append(
            {
                "id": str(evt.id),
                "title": evt.name,
                "date": evt.start_time.strftime("%d/%m/%Y") if evt.start_time else "Chua xac dinh",
                "location": evt.location,
                "participants": f"{evt.capacity} Cho" if hasattr(evt, "capacity") and evt.capacity else "N/A",
                "type": "Su kien",
                "image_url": f"https://picsum.photos/seed/{evt.id}/800/600",
            }
        )
    return activities_data


@router.get("/home")
def read_public_home(db: Session = Depends(get_db)):
    featured_event = (
        db.query(Event)
        .filter(Event.status == EventStatus.PUBLISHED)
        .order_by(Event.start_time.desc())
        .first()
    )
    recent_news = db.query(News).order_by(News.created_at.desc()).limit(2).all()
    upcoming_events = db.query(Event).filter(Event.status == EventStatus.PUBLISHED).limit(3).all()

    return {
        "featuredEvent": {
            "title": featured_event.name if featured_event else "Dang cap nhat su kien moi",
            "desc": featured_event.location if featured_event else "Hanh trinh ket noi sinh vien.",
            "image": f"https://picsum.photos/seed/{featured_event.id if featured_event else 'home'}/800/600",
        },
        "news": [
            {
                "id": str(n.id),
                "title": n.title,
                "date": n.created_at.strftime("%d/%m/%Y") if n.created_at else "N/A",
                "image": n.image_url or f"https://picsum.photos/seed/{n.id}/600/400",
            }
            for n in recent_news
        ],
        "upcomingEvents": [
            {
                "day": evt.start_time.strftime("%d") if evt.start_time else "01",
                "month": evt.start_time.strftime("%m") if evt.start_time else "01",
                "title": evt.name,
                "category": "Su kien",
            }
            for evt in upcoming_events
        ],
        "featuredStudent": None,
    }


@router.get("/academic")
def read_public_academic_docs(db: Session = Depends(get_db)):
    from app.models.documents import DigitalDocument

    docs = db.query(DigitalDocument).limit(5).all()
    return [
        {
            "id": str(d.id),
            "title": d.document_type,
            "type": "PDF",
            "size": "N/A",
            "downloads": 0,
        }
        for d in docs
    ]


@router.get("/news")
def read_public_news(db: Session = Depends(get_db)):
    news_list = db.query(News).order_by(News.created_at.desc()).all()
    return [
        {
            "id": str(item.id),
            "title": item.title,
            "category": item.category or "News",
            "date": item.created_at.strftime("%d/%m/%Y") if item.created_at else "N/A",
            "excerpt": item.excerpt
            or (item.content[:180] + "..." if item.content and len(item.content) > 180 else item.content),
            "image": item.image_url or f"https://picsum.photos/seed/{item.id}/900/500",
            "author": item.author.full_name if item.author else "Ban Truyen thong",
        }
        for item in news_list
    ]


@router.get("/news/{news_id}")
def read_news_detail(news_id: UUID, db: Session = Depends(get_db)):
    news = db.query(News).filter(News.id == news_id).first()
    if not news:
        return {"error": "News not found"}

    return {
        "id": str(news.id),
        "title": news.title,
        "category": news.category or "Hoat dong",
        "date": news.created_at.strftime("%d/%m/%Y") if news.created_at else "N/A",
        "readTime": "5 phut doc",
        "author": news.author.full_name if news.author else "Ban Truyen thong",
        "content": news.content or news.excerpt,
        "image": news.image_url or f"https://picsum.photos/seed/{news.id}/900/500",
    }
