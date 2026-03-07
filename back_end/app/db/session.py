from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.core.config import settings

# Create SQLAlchemy engine
engine = create_engine(
    settings.SQLALCHEMY_DATABASE_URI, 
    pool_pre_ping=True # Ensures idle connections are checked before use
)

# Create SessionLocal class, which creates DB sessions
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    """
    Dependency generator for FastAPI to get a DB session.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
