import sys
import os
from datetime import date

# Ensure the app module can be found
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.models.core import AcademicTerm

def seed_academic_terms(db: Session):
    terms_data = [
        {
            "year_name": "2023-2024",
            "semester_name": "Học kỳ 1",
            "start_date": date(2023, 8, 15),
            "end_date": date(2024, 1, 15),
            "is_current": False
        },
        {
            "year_name": "2023-2024",
            "semester_name": "Học kỳ 2",
            "start_date": date(2024, 2, 1),
            "end_date": date(2024, 7, 1),
            "is_current": False
        },
        {
            "year_name": "2024-2025",
            "semester_name": "Học kỳ 1",
            "start_date": date(2024, 8, 15),
            "end_date": date(2025, 1, 15),
            "is_current": False
        },
        {
            "year_name": "2024-2025",
            "semester_name": "Học kỳ 2",
            "start_date": date(2025, 2, 1),
            "end_date": date(2025, 7, 1),
            "is_current": False
        },
        {
            "year_name": "2025-2026",
            "semester_name": "Học kỳ 1",
            "start_date": date(2025, 8, 15),
            "end_date": date(2026, 1, 15),
            "is_current": True
        },
        {
            "year_name": "2025-2026",
            "semester_name": "Học kỳ 2",
            "start_date": date(2026, 2, 1),
            "end_date": date(2026, 7, 1),
            "is_current": False
        }
    ]

    print("[-] Đang nhập dữ liệu Học kỳ (Academic Terms)...")
    for t in terms_data:
        term = db.query(AcademicTerm).filter_by(
            year_name=t["year_name"], 
            semester_name=t["semester_name"]
        ).first()
        
        if not term:
            term = AcademicTerm(**t)
            db.add(term)
            print(f"  [+] Đã thêm học kỳ: {t['semester_name']} - {t['year_name']}")
        else:
            # Update current status to match the latest seed data
            term.is_current = t["is_current"]
            term.start_date = t["start_date"]
            term.end_date = t["end_date"]
            print(f"  [-] Đã tồn tại & cập nhật học kỳ: {t['semester_name']} - {t['year_name']}")
            
    db.commit()
    print("[+] Hoàn tất seeding Academic Terms!")

if __name__ == "__main__":
    print("------------------------------------------")
    print(" BẮT ĐẦU SEEDING ACADEMIC TERMS")
    print("------------------------------------------")
    db = SessionLocal()
    try:
        seed_academic_terms(db)
        print("------------------------------------------")
        print(" SEEDING HOÀN TẤT THÀNH CÔNG!")
        print("------------------------------------------")
    except Exception as e:
        print(f"Lỗi seeding: {str(e)}")
        db.rollback()
    finally:
        db.close()
