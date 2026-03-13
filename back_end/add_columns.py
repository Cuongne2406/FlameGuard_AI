import os
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    DATABASE_URL = "postgresql://postgres:123123123@localhost:5432/youthhub_db"

engine = create_engine(DATABASE_URL)

columns_to_add = [
    ("is_2fa_enabled", "BOOLEAN DEFAULT FALSE"),
    ("email_alerts_enabled", "BOOLEAN DEFAULT TRUE"),
    ("zalo_alerts_enabled", "BOOLEAN DEFAULT TRUE"),
    ("daily_digest_enabled", "BOOLEAN DEFAULT FALSE"),
    ("signature_data", "TEXT"),
    ("university", "VARCHAR(255) DEFAULT 'ĐH Lạc Hồng'"),
    ("address", "VARCHAR(255) DEFAULT 'Đồng Nai'")
]

print(f"Connecting to {DATABASE_URL}...")

with engine.connect() as conn:
    for col_name, col_type in columns_to_add:
        # Sử dụng savepoint hoặc đơn giản là tách biệt mỗi lệnh
        try:
            # Check if column exists first to avoid error
            result = conn.execute(text(f"""
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_name='users' AND column_name='{col_name}';
            """)).fetchone()
            
            if not result:
                conn.execute(text(f"ALTER TABLE users ADD COLUMN {col_name} {col_type}"))
                conn.commit()
                print(f"Successfully added column: {col_name}")
            else:
                print(f"Column {col_name} already exists.")
        except Exception as e:
            print(f"Error processing {col_name}: {e}")
            conn.rollback() # Reset transaction if something went wrong

print("Done.")
