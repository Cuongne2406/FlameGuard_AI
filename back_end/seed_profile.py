import sys
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Thêm thư mục gốc vào path để import app
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.db.base_class import Base
from app.models.core import User, UserSkill, UserExperience
from app.models.awards import Award
from datetime import datetime, date

# Database URL - Lấy từ .env
SQLALCHEMY_DATABASE_URL = "postgresql://postgres:123123123@localhost:5432/youthhub_db"

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def seed():
    # 1. Tạo bảng mới nếu chưa có
    print("Initializing tables...")
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        # 2. Tìm User hiện tại (User Test)
        user = db.query(User).filter(User.full_name == "User Test").first()
        if not user:
            print("User 'User Test' not found. Creating a test user...")
            user = User(
                full_name="User Test",
                email="user@test.com",
                student_id="USER",
                level=5,
                training_score=95
            )
            db.add(user)
            db.commit()
            db.refresh(user)
        
        # 2b. Tìm hoặc tạo User thứ hai
        user2 = db.query(User).filter(User.full_name == "User Second").first()
        if not user2:
            print("Creating second test user...")
            user2 = User(
                full_name="User Second",
                email="user2@test.com",
                student_id="USER2",
                level=2,
                training_score=75
            )
            db.add(user2)
            db.commit()
            db.refresh(user2)
        
        print(f"Seeding data for: {user.full_name} and {user2.full_name}")
        
        # 3. Seed Skills cho User Test
        db.query(UserSkill).filter(UserSkill.user_id == user.id).delete()
        skills = [
            UserSkill(user_id=user.id, name="Lãnh đạo", level=92),
            UserSkill(user_id=user.id, name="Giao tiếp", level=88),
            UserSkill(user_id=user.id, name="Kỹ thuật", level=95),
            UserSkill(user_id=user.id, name="Sáng tạo", level=82),
            UserSkill(user_id=user.id, name="Phân tích", level=90)
        ]
        db.add_all(skills)
        
        # 4. Seed Experiences cho User Test
        db.query(UserExperience).filter(UserExperience.user_id == user.id).delete()
        exps = [
            UserExperience(
                user_id=user.id, 
                role="Trưởng ban Công nghệ", 
                location="Khoa CNTT - LHU", 
                period="2024 - Nay",
                bullets='["Quản lý đội ngũ 15 thành viên", "Triển khai hệ thống DYUS", "Tổ chức Hackathon 2024"]'
            ),
            UserExperience(
                user_id=user.id, 
                role="Bí thư Lớp", 
                location="Lớp 23CT112", 
                period="2023 - 2024",
                bullets='["Điều phối hoạt động phong trào", "Đạt giải Nhất thi đua năm học"]'
            )
        ]
        db.add_all(exps)
        
        # 5. Seed Awards (Cleared as requested)
        db.query(Award).filter(Award.user_id == user.id).delete()
        # Không còn dữ liệu mẫu ở đây
        
        db.commit()
        print("Seeding completed successfully!")
        
    except Exception as e:
        print(f"Error seeding: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed()
