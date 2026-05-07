import psycopg2
from urllib.parse import urlparse
import os
from dotenv import load_dotenv

load_dotenv('back_end/.env')
db_url = os.getenv('DATABASE_URL')
result = urlparse(db_url)
conn = psycopg2.connect(
    dbname=result.path.lstrip('/'),
    user=result.username,
    password=result.password,
    host=result.hostname,
    port=result.port or 5432
)
cur = conn.cursor()
cur.execute("SELECT column_name FROM information_schema.columns WHERE table_name = 'users'")
cols = [row[0] for row in cur.fetchall()]
print("Users columns:", cols)

cur.execute("SELECT column_name FROM information_schema.columns WHERE table_name = 'awards'")
cols = [row[0] for row in cur.fetchall()]
print("Awards columns:", cols)

cur.close()
conn.close()
