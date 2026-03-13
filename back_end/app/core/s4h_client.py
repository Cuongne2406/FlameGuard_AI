import httpx
from typing import Dict, Any, Optional

S4H_BASE_URL = "https://api-auth.s4h.edu.vn"

async def s4h_login(identifier: str, password: str) -> Optional[Dict[str, Any]]:
    """
    Xác thực qua S4H API. Hỗ trợ cả Email và MSSV.
    """
    async with httpx.AsyncClient(verify=False) as client:
        try:
            # S4H Endpoint: POST /auth/login
            # Identifier có thể là email hoặc student_id
            response = await client.post(
                f"{S4H_BASE_URL}/auth/login",
                json={"email": identifier, "password": password},
                timeout=10.0
            )
            
            if response.status_code in [200, 201]:
                data = response.json()
                # Đồng nhất key token về "token" cho FlameGuard sử dụng
                if "accessToken" in data:
                    data["token"] = data["accessToken"]
                return data
            return None
        except Exception as e:
            print("S4H Login Error:", e)
            return None

async def s4h_get_user_info(s4h_token: str) -> Optional[Dict[str, Any]]:
    """
    Sử dụng Token của S4H để lấy thông tin chi tiết (Tên đầy đủ, MSSV...)
    """
    async with httpx.AsyncClient(verify=False) as client:
        try:
            # Theo route: GET /users/me
            response = await client.get(
                f"{S4H_BASE_URL}/users/me",
                headers={"Authorization": f"Bearer {s4h_token}"},
                timeout=10.0
            )
            
            if response.status_code == 200:
                return response.json()
            return None
        except Exception as e:
            print("S4H Get User Error:", e)
            return None

async def s4h_check_user_exists(student_id: str) -> bool:
    """
    Kiểm tra xem User có tồn tại trên hệ thống S4H không.
    Sử dụng GET /users/{id} theo Swagger mô tả.
    """
    async with httpx.AsyncClient(verify=False) as client:
        try:
            # S4H Endpoint GET /users/{id}
            response = await client.get(
                f"{S4H_BASE_URL}/users/{student_id}",
                timeout=10.0
            )
            # Nếu status là 200, user có tồn tại trên S4H
            if response.status_code == 200:
                return True
            return False
        except Exception:
            return False
    return False
