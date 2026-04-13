import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()
db_url = os.getenv("DATABASE_URL")

try:
    conn = psycopg2.connect(db_url)
    cur = conn.cursor()
    
    cur.execute("""
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'awards';
    """)
    print("Columns in 'awards' table:")
    for col in cur.fetchall():
        print(col)
        
    cur.close()
    conn.close()
except Exception as e:
    print("Error:", e)
