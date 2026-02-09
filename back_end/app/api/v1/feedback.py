import os
from dotenv import load_dotenv
from fastapi import APIRouter, HTTPException
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from app.schemas.feedback import FeedbackCreate

# 1. Tải các biến môi trường từ file .env
load_dotenv()

router = APIRouter()

# 2. Cấu hình SMTP Gmail (Lấy thông tin an toàn từ .env)
conf = ConnectionConfig(
    MAIL_USERNAME = os.getenv("MAIL_USERNAME"),
    MAIL_PASSWORD = os.getenv("MAIL_PASSWORD"),
    MAIL_FROM = os.getenv("MAIL_USERNAME"),
    MAIL_PORT = 587,
    MAIL_SERVER = "smtp.gmail.com",
    MAIL_STARTTLS = True,
    MAIL_SSL_TLS = False,
    USE_CREDENTIALS = True
)

@router.post("/send-feedback")
async def send_feedback(data: FeedbackCreate):
    # 3. Thiết kế giao diện Email gửi về cho Admin (Đã làm đẹp hơn)
    html = f"""
    <div style="font-family: sans-serif; color: #333; max-width: 600px; border: 1px solid #eee; padding: 20px; border-radius: 15px;">
        <h2 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">📩 Feedback mới từ YouthHub</h2>
        <p style="margin-top: 20px;"><b>👤 Người gửi:</b> {data.name}</p>
        <p><b>📧 Email liên hệ:</b> {data.email}</p>
        <p><b>📌 Chủ đề:</b> {data.subject}</p>
        <div style="background-color: #f9fafb; padding: 15px; border-radius: 10px; border-left: 4px solid #2563eb; margin-top: 15px;">
            <p><b>💬 Nội dung tin nhắn:</b></p>
            <p style="white-space: pre-line;">{data.message}</p>
        </div>
        <p style="font-size: 11px; color: #9ca3af; margin-top: 30px; text-align: center;">
            Đây là thông báo tự động từ hệ thống Đoàn khoa YouthHub.
        </p>
    </div>
    """

    # 4. Cấu hình tin nhắn
    message = MessageSchema(
        subject=f"[YouthHub Feedback] {data.subject}",
        # QUAN TRỌNG: Gửi về chính email của bạn để bạn nhận được feedback
        recipients=[os.getenv("MAIL_USERNAME")], 
        body=html,
        subtype="html"
    )

    fm = FastMail(conf)
    
    try:
        # 5. Thực hiện gửi mail
        await fm.send_message(message)
        return {
            "status": "success", 
            "message": "Cảm ơn bạn! Feedback đã được gửi đến Ban chỉ huy Đoàn khoa."
        }
    except Exception as e:
        # In lỗi ra terminal để bạn debug nếu có vấn đề
        print(f"LỖI GỬI MAIL: {str(e)}")
        raise HTTPException(
            status_code=500, 
            detail="Hệ thống gửi mail đang gặp sự cố. Vui lòng thử lại sau!"
        )