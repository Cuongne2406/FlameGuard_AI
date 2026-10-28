import os
import uuid
import enum
from datetime import datetime, date, timedelta
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.models.core import User, Organization, OrgType, AcademicTerm
from app.models.events import Campaign, CampaignStatus, Event, EventStatus, EventQA, EventFeedback
from dotenv import load_dotenv

def seed_events_data():
    # Load .env
    load_dotenv()
    db_url = os.getenv("DATABASE_URL")
    
    if not db_url:
        print("Error: DATABASE_URL not found in .env")
        return

    engine = create_engine(db_url)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = SessionLocal()

    try:
        # 1. Get or Create Academic Term
        term = db.query(AcademicTerm).filter(AcademicTerm.is_current == True).first()
        if not term:
            print("Creating default Academic Term...")
            term = AcademicTerm(
                id=uuid.uuid4(),
                year_name="2025-2026",
                semester_name="Học kỳ 2",
                start_date=date(2026, 1, 1),
                end_date=date(2026, 7, 30),
                is_current=True
            )
            db.add(term)
            db.commit()
            db.refresh(term)

        # 2. Get or Create Organization
        org = db.query(Organization).filter(Organization.name == "Đoàn Thanh niên LHU").first()
        if not org:
            print("Creating default Organization...")
            org = Organization(
                id=uuid.uuid4(),
                name="Đoàn Thanh niên LHU",
                type=OrgType.UNIVERSITY,
                description="Đoàn trường Đại học Lạc Hồng",
                activity_points=100
            )
            db.add(org)
            db.commit()
            db.refresh(org)

        # 3. Get or Create Campaign
        campaign = db.query(Campaign).filter(Campaign.name == "Chiến dịch Hoạt động Thanh niên 2026").first()
        if not campaign:
            print("Creating default Campaign...")
            campaign = Campaign(
                id=uuid.uuid4(),
                organization_id=org.id,
                academic_term_id=term.id,
                name="Chiến dịch Hoạt động Thanh niên 2026",
                description="Hành trình kết nối sinh viên LHU qua các hoạt động ý nghĩa",
                start_date=date(2026, 2, 1),
                end_date=date(2026, 6, 30),
                status=CampaignStatus.ONGOING,
                total_budget_allocated=50000000.00
            )
            db.add(campaign)
            db.commit()
            db.refresh(campaign)

        # Get a user for Q&A and Feedback seeding
        demo_user = db.query(User).filter(User.student_id == "user").first()
        user_id = demo_user.id if demo_user else None

        # 4. Define Mock Events
        now = datetime.now()
        mock_events_data = [
            {
                "name": "Hội thảo Trí tuệ Nhân tạo & Tương lai Công nghệ",
                "location": "Hội trường I.401, Cơ sở 1 LHU",
                "start_time": now + timedelta(days=2, hours=2),
                "end_time": now + timedelta(days=2, hours=5),
                "capacity": 200,
                "status": EventStatus.PUBLISHED,
                "points_awarded": 15,
                "description": "Hội thảo chuyên sâu chia sẻ về xu hướng Generative AI, ChatGPT và cơ hội nghề nghiệp tương lai dành cho sinh viên Lạc Hồng.",
                "image_url": "https://picsum.photos/seed/ai_event/800/600",
                "qas": [
                    {"question": "Sự kiện này có cấp giấy chứng nhận (Certificate) tham gia không ạ?", "answer": "Có em nhé! Giấy chứng nhận và điểm rèn luyện sẽ được tự động đồng bộ vào tài khoản cá nhân sau khi check-in.", "is_answered": True},
                    {"question": "Sinh viên khóa mới (K26) có tham gia được không ạ?", "answer": "Chào em, sự kiện chào đón tất cả các bạn sinh viên LHU ở mọi ngành học và mọi khóa nhé!", "is_answered": True}
                ],
                "feedbacks": []
            },
            {
                "name": "Chiến dịch Tình nguyện Mùa hè Xanh 2026",
                "location": "Xã Phú Lý, Huyện Vĩnh Cửu, Đồng Nai",
                "start_time": now + timedelta(days=10),
                "end_time": now + timedelta(days=25),
                "capacity": 80,
                "status": EventStatus.LIVE,
                "points_awarded": 50,
                "description": "Chiến dịch tình nguyện lớn nhất trong năm của sinh viên LHU, thực hiện các công trình thanh niên: xây dựng đường giao thông, dạy học cho trẻ em vùng sâu và thăm hỏi gia đình chính sách.",
                "image_url": "https://picsum.photos/seed/muahexanh/800/600",
                "qas": [
                    {"question": "Chi phí ăn ở của chiến dịch sẽ do nhà trường hỗ trợ hoàn toàn đúng không ạ?", "answer": "Đúng rồi em nhé, Đoàn trường sẽ hỗ trợ toàn bộ xe di chuyển, dụng cụ lao động và trợ cấp ăn uống cho các tình nguyện viên.", "is_answered": True}
                ],
                "feedbacks": []
            },
            {
                "name": "Giải Bóng đá Nam Sinh viên FlameGuard Cup",
                "location": "Sân bóng đá cỏ nhân tạo LHU",
                "start_time": now - timedelta(days=3),
                "end_time": now - timedelta(days=3, hours=-4),
                "capacity": 300,
                "status": EventStatus.ENDED,
                "points_awarded": 20,
                "description": "Ngày hội bóng đá lớn nhất học kỳ, quy tụ hơn 16 đội tuyển xuất sắc nhất đến từ các khoa. Hãy cùng cổ vũ hết mình cho đội bóng yêu thích của bạn!",
                "image_url": "https://picsum.photos/seed/soccer/800/600",
                "qas": [],
                "feedbacks": [
                    {"rating": 5, "comment": "Trận đấu cực kỳ kịch tính và tổ chức rất chuyên nghiệp. Rất thích giải đấu này!"},
                    {"rating": 4, "comment": "Giải đấu tuyệt vời, hy vọng lần tới sẽ có thêm nhiều hoạt động bên lề sôi động hơn."}
                ]
            },
            {
                "name": "Hội thảo Kỹ năng Viết CV và Phỏng vấn Xin việc",
                "location": "Phòng thực hành Đa phương tiện, Cơ sở Song Ngữ LHU",
                "start_time": now + timedelta(days=5, hours=1),
                "end_time": now + timedelta(days=5, hours=4),
                "capacity": 100,
                "status": EventStatus.DRAFT,
                "points_awarded": 10,
                "description": "Chia sẻ từ các chuyên gia nhân sự hàng đầu về cách thiết kế CV chuyên nghiệp, cách trả lời phỏng vấn ấn tượng và những sai lầm cần tránh khi ứng tuyển vào các tập đoàn lớn.",
                "image_url": "https://picsum.photos/seed/cv_seminar/800/600",
                "qas": [],
                "feedbacks": []
            },
            {
                "name": "Ngày hội Hiến máu Nhân đạo - LHU 2026",
                "location": "Sảnh Trung tâm, Cơ sở 2 LHU",
                "start_time": now - timedelta(days=1),
                "end_time": now - timedelta(days=1, hours=-5),
                "capacity": 500,
                "status": EventStatus.ENDED,
                "points_awarded": 25,
                "description": "Một giọt máu cho đi - Một cuộc đời ở lại. Hoạt động hiến máu thiện nguyện thường niên kết hợp với Hội Chữ thập đỏ Đồng Nai.",
                "image_url": "https://picsum.photos/seed/blood_donation/800/600",
                "qas": [],
                "feedbacks": [
                    {"rating": 5, "comment": "Quy trình hiến máu nhanh gọn, các anh chị bác sĩ và các bạn tình nguyện viên hỗ trợ cực kỳ chu đáo."}
                ]
            }
        ]

        # 5. Insert Events
        for event_data in mock_events_data:
            existing_event = db.query(Event).filter(Event.name == event_data["name"]).first()
            if not existing_event:
                print(f"Creating event: {event_data['name'].encode('ascii', 'ignore').decode('ascii')}")
                new_event = Event(
                    id=uuid.uuid4(),
                    campaign_id=campaign.id,
                    org_id=org.id,
                    name=event_data["name"],
                    location=event_data["location"],
                    start_time=event_data["start_time"],
                    end_time=event_data["end_time"],
                    capacity=event_data["capacity"],
                    status=event_data["status"],
                    description=event_data["description"],
                    image_url=event_data["image_url"],
                    points_awarded=event_data["points_awarded"]
                )
                db.add(new_event)
                db.commit()
                db.refresh(new_event)

                # Seed Event Q&As
                for qa in event_data["qas"]:
                    new_qa = EventQA(
                        id=uuid.uuid4(),
                        event_id=new_event.id,
                        user_id=user_id,
                        question=qa["question"],
                        answer=qa["answer"],
                        is_answered=qa["is_answered"]
                    )
                    db.add(new_qa)

                # Seed Event Feedbacks
                for fb in event_data["feedbacks"]:
                    if user_id:
                        new_fb = EventFeedback(
                            id=uuid.uuid4(),
                            event_id=new_event.id,
                            user_id=user_id,
                            rating=fb["rating"],
                            comment=fb["comment"]
                        )
                        db.add(new_fb)
                
                db.commit()
            else:
                print(f"Event already exists. Updating start/end times...")
                existing_event.start_time = event_data["start_time"]
                existing_event.end_time = event_data["end_time"]
                db.commit()

        print("\nSuccessfully seeded events, campaigns, academic terms, Q&As, and feedbacks!")

    except Exception as e:
        db.rollback()
        print(f"An error occurred during seeding: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_events_data()
