import sys
import os

# Ensure the app module can be found
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.orm import Session
from app.db.session import SessionLocal, engine
from app.models.settings import SystemSetting

def seed_settings(db: Session):
    settings_data = [
        # TabGeneral
        {"key": "SYSTEM_NAME", "value": "DYUS MASTER", "description": "Tên hệ thống"},
        {"key": "SYSTEM_MOTTO", "value": "Empowering Student Success", "description": "Khẩu hiệu hệ thống"},
        {"key": "CURRENT_YEAR", "value": "2025-2026", "description": "Năm học hiện tại"},
        {"key": "CURRENT_SEMESTER", "value": "1", "description": "Học kỳ hiện tại"},
        {"key": "AUTO_TRANSITION", "value": "false", "description": "Tự động chuyển học kỳ"},
        {"key": "SMTP_HOST", "value": "smtp.gmail.com", "description": "Cấu hình SMTP Host"},
        {"key": "ZALO_OA_KEY", "value": "", "description": "Zalo OA Secret Key"},
        {"key": "PUSH_NOTIFICATIONS", "value": "true", "description": "Thông báo đẩy"},
        {"key": "PRIMARY_COLOR", "value": "#0056D2", "description": "Màu chủ đạo hệ thống"},
        {"key": "DARK_MODE_SUPPORT", "value": "true", "description": "Hỗ trợ Dark Mode"},
        
        # TabSecurity
        {"key": "TWO_FACTOR_REQUIRED", "value": "false", "description": "Yêu cầu 2FA"},
        {"key": "SESSION_TIMEOUT", "value": "30", "description": "Thời gian hết hạn phiên (phút)"},
        {"key": "PW_MIN_LENGTH", "value": "true", "description": "Yêu cầu độ dài mật khẩu tối thiểu"},
        {"key": "PW_REQUIRE_SYMBOLS", "value": "false", "description": "Yêu cầu biểu tượng trong mật khẩu"},
        {"key": "PW_REQUIRE_UPPERCASE", "value": "false", "description": "Yêu cầu chữ hoa trong mật khẩu"},
        {"key": "PW_EXPIRE_90", "value": "false", "description": "Hết hạn mật khẩu sau 90 ngày"},
        {"key": "AUTO_BACKUP", "value": "true", "description": "Tự động sao lưu dữ liệu"},
        {"key": "WEBHOOK_CALLBACK_URL", "value": "", "description": "URL nhận Webhook"},
        {"key": "WEBHOOK_SECRET", "value": "", "description": "Mã bí mật Webhook"},
    ]

    print("[-] Đang nhập dữ liệu Cài đặt hệ thống (System Settings)...")
    for s in settings_data:
        setting = db.query(SystemSetting).filter_by(key=s["key"]).first()
        if not setting:
            setting = SystemSetting(**s)
            db.add(setting)
            print(f"  [+] Đã thêm key: {s['key']}")
        else:
            print(f"  [-] Đã tồn tại key: {s['key']}")
    db.commit()
    print("[+] Hoàn tất seeding System Settings!")

if __name__ == "__main__":
    print("------------------------------------------")
    print(" BẮT ĐẦU SEEDING SYSTEM SETTINGS")
    print("------------------------------------------")
    db = SessionLocal()
    try:
        seed_settings(db)
        print("------------------------------------------")
        print(" SEEDING HOÀN TẤT THÀNH CÔNG!")
        print("------------------------------------------")
    except Exception as e:
        print(f"Lỗi seeding: {str(e)}")
        db.rollback()
    finally:
        db.close()
