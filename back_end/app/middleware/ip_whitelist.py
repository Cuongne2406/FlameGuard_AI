from fastapi import Request, HTTPException
from starlette.middleware.base import BaseHTTPMiddleware
from app.models.settings import SystemSetting
from app.db.session import SessionLocal

class IPWhitelistMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # Chỉ kiểm tra các route admin
        if request.url.path.startswith("/api/v1/admin") or "/settings" in request.url.path:
            db = SessionLocal()
            try:
                setting = db.query(SystemSetting).filter(SystemSetting.key == "IP_WHITELIST").first()
                if setting and setting.value:
                    allowed_ips = [ip.strip() for ip in setting.value.split(",") if ip.strip()]
                    
                    if allowed_ips:
                        client_ip = request.client.host
                        
                        # Kiểm tra X-Forwarded-For nếu chạy sau Proxy
                        forwarded_for = request.headers.get("X-Forwarded-For")
                        if forwarded_for:
                            client_ip = forwarded_for.split(",")[0].strip()
                        
                        if client_ip not in allowed_ips and "127.0.0.1" not in allowed_ips:
                             raise HTTPException(status_code=403, detail=f"IP {client_ip} không được phép truy cập vùng Admin.")
            finally:
                db.close()
                
        response = await call_next(request)
        return response
