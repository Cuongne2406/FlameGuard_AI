import os
import uuid
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.models.core import User, UserStatus, AuthProvider, Role
from app.core.security import get_password_hash
from dotenv import load_dotenv

def create_admin_and_user():
    # Load .env
    load_dotenv()
    db_url = os.getenv("DATABASE_URL")
    
    if not db_url:
        print("Error: DATABASE_URL not found in .env")
        return

    engine = create_engine(db_url)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = SessionLocal()

    try:
        # 1. Ensure Roles exist
        admin_role = db.query(Role).filter(Role.name == "ADMIN").first()
        if not admin_role:
            print("Creating ADMIN role...")
            admin_role = Role(
                id=uuid.uuid4(),
                name="ADMIN",
                description="System Administrator with full access"
            )
            db.add(admin_role)
            db.commit()
            db.refresh(admin_role)

        student_role = db.query(Role).filter(Role.name == "STUDENT").first()
        if not student_role:
            print("Creating STUDENT role...")
            student_role = Role(
                id=uuid.uuid4(),
                name="STUDENT",
                description="Regular Student User"
            )
            db.add(student_role)
            db.commit()
            db.refresh(student_role)

        # 2. Create Admin Account
        admin_student_id = "admin"
        admin_password = "admin123"
        admin_email = "admin@flameguard.ai"
        admin_fullname = "System Administrator"

        existing_admin = db.query(User).filter(User.student_id == admin_student_id).first()
        if not existing_admin:
            new_admin = User(
                id=uuid.uuid4(),
                student_id=admin_student_id,
                full_name=admin_fullname,
                email=admin_email,
                password_hash=get_password_hash(admin_password),
                auth_provider=AuthProvider.LOCAL,
                status=UserStatus.ACTIVE,
                level=9,
                training_score=0
            )
            new_admin.roles.append(admin_role)
            db.add(new_admin)
            db.commit()
            db.refresh(new_admin)
            print(f"Successfully created ADMIN account:")
            print(f"  - Username (Student ID): {admin_student_id}")
            print(f"  - Password: {admin_password}")
            print(f"  - Email: {admin_email}")
        else:
            existing_admin.password_hash = get_password_hash(admin_password)
            existing_admin.email = admin_email
            existing_admin.full_name = admin_fullname
            if admin_role not in existing_admin.roles:
                existing_admin.roles.append(admin_role)
            db.commit()
            print(f"Successfully updated/reset existing ADMIN account:")
            print(f"  - Username (Student ID): {admin_student_id}")
            print(f"  - Password: {admin_password}")
            print(f"  - Email: {admin_email}")

        # 3. Create User Account
        user_student_id = "user"
        user_password = "user123"
        user_email = "user@flameguard.ai"
        user_fullname = "Regular User"

        existing_user = db.query(User).filter(User.student_id == user_student_id).first()
        if not existing_user:
            new_user = User(
                id=uuid.uuid4(),
                student_id=user_student_id,
                full_name=user_fullname,
                email=user_email,
                password_hash=get_password_hash(user_password),
                auth_provider=AuthProvider.LOCAL,
                status=UserStatus.ACTIVE,
                level=1,
                training_score=0
            )
            new_user.roles.append(student_role)
            db.add(new_user)
            db.commit()
            db.refresh(new_user)
            print(f"Successfully created USER account:")
            print(f"  - Username (Student ID): {user_student_id}")
            print(f"  - Password: {user_password}")
            print(f"  - Email: {user_email}")
        else:
            existing_user.password_hash = get_password_hash(user_password)
            existing_user.email = user_email
            existing_user.full_name = user_fullname
            if student_role not in existing_user.roles:
                existing_user.roles.append(student_role)
            db.commit()
            print(f"Successfully updated/reset existing USER account:")
            print(f"  - Username (Student ID): {user_student_id}")
            print(f"  - Password: {user_password}")
            print(f"  - Email: {user_email}")

    except Exception as e:
        db.rollback()
        print(f"An error occurred: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    create_admin_and_user()
