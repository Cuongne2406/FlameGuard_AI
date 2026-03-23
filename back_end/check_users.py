import sqlalchemy
from sqlalchemy import create_engine, text

DATABASE_URL = "postgresql://postgres:123123123@localhost:5432/youthhub_db"
engine = create_engine(DATABASE_URL)

try:
    with engine.connect() as conn:
        print("Checking users in DB...")
        query = text("SELECT id, student_id, full_name, email FROM users WHERE student_id IN ('admin', '123000991')")
        res = conn.execute(query).fetchall()
        with open('db_report.txt', 'w', encoding='utf-8') as f:
            for r in res:
                line = f"ID: {r.id} | StudentID: {r.student_id} | Name: {r.full_name} | Email: '{r.email}'"
                print(line)
                f.write(line + "\n")
        print("Report saved to db_report.txt")
except Exception as e:
    print(f"Error: {e}")
