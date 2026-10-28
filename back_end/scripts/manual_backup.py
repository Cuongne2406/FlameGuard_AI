import os
import json
import uuid
from datetime import date, datetime
from sqlalchemy import create_engine, MetaData, Table, select
from sqlalchemy.orm import sessionmaker

# Handle UUID and datetime for JSON serialization
class CustomEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, uuid.UUID):
            return str(obj)
        if isinstance(obj, (date, datetime)):
            return obj.isoformat()
        return super().default(obj)

DATABASE_URL = "postgresql://postgres:123123123@localhost:5432/youthhub_db"
engine = create_engine(DATABASE_URL)
metadata = MetaData()
Session = sessionmaker(bind=engine)
session = Session()

def backup_table(table_name):
    try:
        table = Table(table_name, metadata, autoload_with=engine)
        stmt = select(table)
        results = session.execute(stmt).mappings().all()
        
        data = [dict(row) for row in results]
        
        backup_dir = "db_backups"
        if not os.path.exists(backup_dir):
            os.makedirs(backup_dir)
            
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"{backup_dir}/{table_name}_{timestamp}.json"
        
        with open(filename, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, cls=CustomEncoder, ensure_ascii=False)
        
        print(f"Backup {table_name} successful: {filename}")
    except Exception as e:
        print(f"Error backing up {table_name}: {e}")

if __name__ == "__main__":
    tables = ["users", "organizations", "events", "campaigns", "event_registrations"]
    for t in tables:
        backup_table(t)
    session.close()
