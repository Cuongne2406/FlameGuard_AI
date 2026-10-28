import sys
import os

# Ensure the app module can be found
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.orm import Session
from app.db.session import SessionLocal, engine
from app.models.core import Base, Role, Permission, User, AuthProvider, UserStatus
from app.core.security import get_password_hash

def init_db():
    print("[-] Đang khởi tạo Database Schema...")
    # Tạo tất cả các bảng (nếu chưa có)
    Base.metadata.create_all(bind=engine)
    print("[+] Database Schema đã sẵn sàng.")

def seed_rbac(db: Session):
    # ==========================================
    # 1. ĐỊNH NGHĨA QUYỀN (PERMISSIONS) 
    # ==========================================
    permissions_data = [
        # --- 1. QUYỀN SINH VIÊN / ĐOÀN VIÊN ---
        {"resource_name": "EVENT", "action": "READ"},
        {"resource_name": "EVENT_REGISTRATION", "action": "CREATE"}, # Trải nghiệm Auto-fill đăng ký
        {"resource_name": "E_PORTFOLIO", "action": "READ"},           # Xem hồ sơ Sinh viên 5 tốt
        {"resource_name": "E_PORTFOLIO", "action": "UPDATE"},         # Cập nhật E-Portfolio
        {"resource_name": "CERTIFICATE", "action": "READ"},           # Xem Chứng nhận số
        {"resource_name": "FUND", "action": "READ"},                  # Minh bạch thu chi quỹ lớp
        {"resource_name": "FUND_CONTRIBUTION", "action": "CREATE"},   # Thanh toán Đoàn phí
        {"resource_name": "DOCUMENT_REQUEST", "action": "CREATE"},    # Hành chính 1 chạm (xin giấy xác nhận)
        {"resource_name": "AI_CHAT", "action": "CREATE"},             # Tương tác với DYUS Mentor
        {"resource_name": "EVENT_FEEDBACK", "action": "CREATE"},      # Gửi đánh giá ẩn danh
        
        # --- 2. QUYỀN BÍ THƯ KHOA / LIÊN CHI ---
        {"resource_name": "EVENT", "action": "CREATE"},               # Tạo sự kiện mới
        {"resource_name": "EVENT", "action": "UPDATE"},               # Chỉnh sửa sự kiện
        {"resource_name": "EVENT", "action": "DELETE"},               # Xóa sự kiện
        {"resource_name": "EVENT_REGISTRATION", "action": "UPDATE"},  # Duyệt danh sách đăng ký sự kiện
        {"resource_name": "EVENT_CHECKIN", "action": "CREATE"},       # Giám sát Check-in Real-time
        {"resource_name": "NOTIFICATION", "action": "CREATE"},        # Push Notification khẩn cấp
        {"resource_name": "REPORT", "action": "READ"},                # Báo cáo KPI sự kiện
        {"resource_name": "KPI", "action": "READ"},                   # KPI Thống kê
        {"resource_name": "REWARD_POINT", "action": "UPDATE"},        # Duyệt cộng điểm rèn luyện hàng loạt
        {"resource_name": "CERTIFICATE", "action": "CREATE"},         # Cấp phát lưới Chứng nhận có chữ ký
        {"resource_name": "AI_SENTIMENT", "action": "READ"},          # AI Sentiment Analysis (Phân tích cảm xúc)
        {"resource_name": "EVENT_FEEDBACK", "action": "READ"},        # Đọc Feedback ẩn danh
        {"resource_name": "RANKING", "action": "READ"},               # Xem bảng vàng
        {"resource_name": "RANKING", "action": "UPDATE"},             # Can thiệp đánh giá thi đua
        {"resource_name": "DOCUMENT_REQUEST", "action": "UPDATE"},    # Vê duyệt đơn xin giấy Hành chính điện tử
        {"resource_name": "STUDENT_5_GOOD", "action": "UPDATE_FACULTY"}, # Khóa duyệt "SV5T" cấp Khoa
        
        # --- 3. QUYỀN ĐOÀN TRƯỜNG / SUPER ADMIN ---
        {"resource_name": "TEMPLATE", "action": "CREATE"},            # Ban hành Mẫu chung cho toàn trường
        {"resource_name": "TEMPLATE", "action": "UPDATE"},
        {"resource_name": "TEMPLATE", "action": "DELETE"},
        {"resource_name": "REPORT_UNIVERSITY", "action": "READ"},     # Xem Thống kê dữ liệu Toàn trường (So sánh)
        {"resource_name": "STUDENT_5_GOOD", "action": "UPDATE_UNIVERSITY"}, # Duyệt chốt SV5T cấp trường
    ]

    print("[-] Đang nhập dữ liệu Quyền (Permissions)...")
    db_permissions = []
    for p in permissions_data:
        perm = db.query(Permission).filter_by(resource_name=p["resource_name"], action=p["action"]).first()
        if not perm:
            perm = Permission(**p)
            db.add(perm)
        db_permissions.append(perm)
    db.commit()
    
    # ==========================================
    # 2. ĐỊNH NGHĨA VAI TRÒ (ROLES)
    # ==========================================
    roles_data = [
        {"name": "STUDENT", "description": "1. QUYỀN SINH VIÊN / ĐOÀN VIÊN (User Level)"},
        {"name": "FACULTY_ADMIN", "description": "2. QUYỀN BÍ THƯ KHOA / LIÊN CHI HỘI TRƯỞNG (Admin Level)"},
        {"name": "UNIVERSITY_ADMIN", "description": "3. QUYỀN ĐOÀN TRƯỜNG / HỘI SINH VIÊN TRƯỜNG (Super Admin)"}
    ]
    
    print("[-] Đang nhập dữ liệu Vai trò (Roles)...")
    db_roles = {}
    for r in roles_data:
        role = db.query(Role).filter_by(name=r["name"]).first()
        if not role:
            role = Role(**r)
            db.add(role)
        db_roles[r["name"]] = role
    db.commit()

    # ==========================================
    # 3. GÁN QUYỀN CHO TỪNG ROLE ĐÚNG LOGIC
    # ==========================================
    print("[-] Đang Map Role_Permissions (Gắn quyền cho Role)...")
    
    # Sinh viên: Chỉ lấy các quyền READ cơ bản & CREATE liên quan tới cá nhân
    student_resources = [
        "EVENT", "EVENT_REGISTRATION", "E_PORTFOLIO", "CERTIFICATE", "FUND", 
        "FUND_CONTRIBUTION", "DOCUMENT_REQUEST", "AI_CHAT", "EVENT_FEEDBACK"
    ]
    student_perms = db.query(Permission).filter(
        Permission.resource_name.in_(student_resources),
        Permission.action.in_(["READ", "CREATE", "UPDATE"]) # Sinh viên không có DELETE
    ).all()
    
    # Admin Khoa: Lấy Quyền Sinh viên + Quyền Quản trị Khoa (Trừ quyền của trường)
    faculty_perms = db.query(Permission).filter(Permission.resource_name.notin_([
        "TEMPLATE", "REPORT_UNIVERSITY"
    ])).all() 
    
    # Admin Trường: Toàn quyền cao nhất
    university_perms = db.query(Permission).all() 

    db_roles["STUDENT"].permissions = student_perms
    db_roles["FACULTY_ADMIN"].permissions = faculty_perms
    db_roles["UNIVERSITY_ADMIN"].permissions = university_perms
    db.commit()
    print("[+] Hoàn tất Ma trận Phân Quyền (RBAC)!")

if __name__ == "__main__":
    print("------------------------------------------")
    print(" BẮT ĐẦU CHẠY SEEDING DỮ LIỆU ĐOÀN HỘI")
    print("------------------------------------------")
    init_db()
    db = SessionLocal()
    try:
        seed_rbac(db)
        print("------------------------------------------")
        print(" HOÀN TẤT THÀNH CÔNG THIẾT KẾ CSDL!")
        print("------------------------------------------")
    except Exception as e:
        print(f"Lỗi seeding: {str(e)}")
        db.rollback()
    finally:
        db.close()
