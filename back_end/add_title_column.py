from app.db.session import SessionLocal
from sqlalchemy import text

def add_missing_column():
    db = SessionLocal()
    try:
        print("Đang thêm cột title vào bảng digital_documents...")
        db.execute(text("ALTER TABLE digital_documents ADD COLUMN IF NOT EXISTS title VARCHAR;"))
        db.commit()
        print("Đã thêm cột thành công!")
    except Exception as e:
        print(f"Lỗi: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    add_missing_column()
