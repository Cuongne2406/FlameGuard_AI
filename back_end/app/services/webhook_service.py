import hmac
import hashlib
import json
import httpx
from datetime import datetime

async def send_webhook_event(webhook_url: str, webhook_secret: str, event_name: str, payload_data: dict):
    if not webhook_url:
        return

    payload = {
        "event": event_name,
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "data": payload_data
    }
    
    payload_str = json.dumps(payload)
    headers = {"Content-Type": "application/json"}
    
    if webhook_secret:
        signature = hmac.new(
            webhook_secret.encode("utf-8"),
            payload_str.encode("utf-8"),
            hashlib.sha256
        ).hexdigest()
        headers["X-Webhook-Signature"] = f"sha256={signature}"

    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(webhook_url, content=payload_str, headers=headers, timeout=5.0)
            print(f"Webhook [{event_name}] ĐÃ GỬI TỚI {webhook_url} | HTTP STATUS: {response.status_code}")
    except Exception as e:
        print(f"LỖI WEBHOOK [{event_name}]: Không thể gửi tới {webhook_url}. Chi tiết: {e}")
