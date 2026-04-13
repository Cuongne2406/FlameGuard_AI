import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()
db_url = os.getenv("DATABASE_URL")

try:
    conn = psycopg2.connect(db_url)
    cur = conn.cursor()
    
    # Lấy danh sách cột của bảng users
    cur.execute("""
        SELECT column_name, data_type, is_nullable 
        FROM information_schema.columns 
        WHERE table_name = 'users';
    """)
    print("Columns in 'users' table:")
    for col in cur.fetchall():
        print(col)
        
    cur.close()
    conn.close()
except Exception as e:
    print("Error:", e)
