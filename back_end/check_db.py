from app.db.session import engine
from sqlalchemy import inspect

inspector = inspect(engine)
columns = inspector.get_columns('digital_documents')
print("Các cột hiện có trong bảng digital_documents:")
for c in columns:
    print("-", c['name'], c['type'])
