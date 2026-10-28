import random
import string
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig, MessageType
from app.core.config import settings
from pydantic import EmailStr

conf = ConnectionConfig(
    MAIL_USERNAME = getattr(settings, "MAIL_USERNAME", "mock_user"),
    MAIL_PASSWORD = getattr(settings, "MAIL_PASSWORD", "mock_pass"),
    MAIL_FROM = getattr(settings, "MAIL_FROM", "no-reply@dyus.edu.vn"),
    MAIL_PORT = getattr(settings, "MAIL_PORT", 587),
    MAIL_SERVER = getattr(settings, "MAIL_SERVER", "smtp.gmail.com"),
    MAIL_STARTTLS = True,
    MAIL_SSL_TLS = False,
    USE_CREDENTIALS = True,
    VALIDATE_CERTS = True
)

async def send_otp_email(email: EmailStr, otp: str, full_name: str = "Người dùng"):
    import html
    safe_name = html.escape(full_name)
    message = MessageSchema(
        subject="DYUS Platform - Mã xác thực 2 lớp (2FA)",
        recipients=[email],
        body=f"""
        <html>
            <body style="font-family: sans-serif; padding: 20px; color: #333;">
                <h2 style="color: #2563eb;">Xác thực đăng nhập DYUS Platform</h2>
                <p>Chào <b>{safe_name}</b>,</p>
                <p>Mã xác thực 2 lớp của bạn là: <b style="font-size: 24px; color: #1e40af; letter-spacing: 5px;">{otp}</b></p>
                <p>Email nhận mã: {email}</p>
                <p>Mã này sẽ hết hạn sau 5 phút. Nếu bạn không thực hiện đăng nhập, vui lòng đổi mật khẩu ngay lập tức.</p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                <p style="font-size: 11px; color: #999;">Đây là email tự động từ hệ thống DYUS Platform, vui lòng không trả lời.</p>
            </body>
        </html>
        """,
        subtype=MessageType.html
    )

    fm = FastMail(conf)
    # Trong môi trường dev/test, nếu không có config thật thì chỉ in ra console
    if conf.MAIL_USERNAME == "mock_user":
        print(f"DEBUG: [EMAIL OTP to {email}] -> {otp}")
        return True
        
    await fm.send_message(message)
    return True

def generate_otp(length: int = 6) -> str:
    return ''.join(random.choices(string.digits, k=length))
