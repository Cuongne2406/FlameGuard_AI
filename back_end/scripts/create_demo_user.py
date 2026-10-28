import sys
import os

# Ensure the app module can be found
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.models.core import User, Role, AuthProvider, UserStatus
from app.core.security import get_password_hash

def create_demo_user():
    db = SessionLocal()
    try:
        # 1. Find or create Student role
        student_role = db.query(Role).filter(Role.name == "STUDENT").first()
        if not student_role:
            student_role = Role(name="STUDENT", description="Student Role")
            db.add(student_role)
            db.flush()

        # 2. Create Demo User
        username = "2110123"
        password = "Student@123"
        
        user = db.query(User).filter(User.student_id == username).first()
        if user:
            print(f"[-] User {username} exists. Updating password...")
        else:
            print(f"[+] Creating new User {username}...")
            user = User(
                student_id=username,
                full_name="Sinh Vien Demo",
                email="demo@youthhub.edu.vn",
                auth_provider=AuthProvider.LOCAL,
                status=UserStatus.ACTIVE,
                university="Lac Hong University",
                training_score=85,
                level=3
            )
            db.add(user)
        
        user.password_hash = get_password_hash(password)
        
        if student_role not in user.roles:
            user.roles.append(student_role)
            
        db.commit()
        print(f"==========================================")
        print(f" SUCCESS: DEMO ACCOUNT READY")
        print(f"==========================================")
        print(f" Username (MSSV): {username}")
        print(f" Password:       {password}")
        print(f"==========================================")
        
    except Exception as e:
        print(f"Error: {str(e)}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_demo_user()
