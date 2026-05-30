import os
import uuid
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.models.core import User, UserStatus, AuthProvider
from app.core.security import get_password_hash
from dotenv import load_dotenv

def create_new_user():
    # Load .env
    load_dotenv()
    db_url = os.getenv("DATABASE_URL")
    
    if not db_url:
        print("Error: DATABASE_URL not found in .env")
        return

    engine = create_engine(db_url)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = SessionLocal()

    student_id = "1230001941"
    password = "123123123"
    email = "student_1230001941@lhu.edu.vn"
    full_name = "Sinh viên Demo 1230001941"

    # Check if user exists
    existing_user = db.query(User).filter(User.student_id == student_id).first()
    if existing_user:
        print(f"User with student_id {student_id} already exists.")
        db.close()
        return

    # Create user object
    new_user = User(
        id=uuid.uuid4(),
        student_id=student_id,
        full_name=full_name,
        email=email,
        password_hash=get_password_hash(password),
        auth_provider=AuthProvider.LOCAL,
        status=UserStatus.ACTIVE,
        level=1,
        training_score=0
    )

    try:
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        print(f"Successfully created user:")
        print(f" - Student ID: {new_user.student_id}")
        print(f" - Full Name: {new_user.full_name}")
        print(f" - Email: {new_user.email}")
    except Exception as e:
        db.rollback()
        print(f"Error creating user: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    create_new_user()
