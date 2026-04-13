import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

db_url = os.getenv("DATABASE_URL")

try:
    print(f"Connecting to: {db_url}")
    conn = psycopg2.connect(db_url)
    cur = conn.cursor()
    cur.execute("SELECT version();")
    print("PostgreSQL connection successful!")
    print("Version:", cur.fetchone())
    
    cur.execute("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';")
    print("Tables found:", cur.fetchall())
    
    cur.close()
    conn.close()
except Exception as e:
    print("PostgreSQL connection FAILED!")
    print("Error:", e)
