from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import Optional
from app.api.deps import get_db

router = APIRouter()

@router.get("/dashboard")
def get_system_dashboard(year: Optional[str] = None, semester: Optional[str] = None, db: Session = Depends(get_db)):
    # This is a placeholder for aggregating real data from the database
    # For now, it returns structured data so the frontend dashboards don't 404
    # Real implementation would query multiple tables to get accurate counts
    return {
        "stats": {
            "totalMembers": "15,450",
            "memberGrowth": "+5.2% so với kỳ trước",
            "totalBudgetStr": "2.5 Tỷ VNĐ",
            "budgetLeftPercent": 15,
            "activeEvents": 5
        },
        "timelines": [
            { "id": 1, "label": "Tháng Thanh Niên", "date": "01/03/2026 - 31/03/2026", "percent": 80, "status": "Hoàn thành", "color": "bg-blue-600" },
            { "id": 2, "label": "Chiến dịch Mùa Hè Xanh", "date": "01/07/2026 - 15/08/2026", "percent": 10, "status": "Sắp diễn ra", "color": "bg-yellow-500" },
            { "id": 3, "label": "Chuỗi sự kiện Chào Tân Sinh Viên", "date": "15/09/2025 - 30/10/2025", "percent": 100, "status": "Hoàn thành", "color": "bg-emerald-500" }
        ],
        "risks": [
            { "id": 1, "title": "Hội Trại 26/3", "desc": "Vượt ngân sách dự kiến 15% (Thiếu hóa đơn đỏ)", "color": "bg-red-50" },
            { "id": 2, "title": "Hệ thống Đăng ký (Server Load)", "desc": "Lưu lượng truy cập cao bất thường (90% capacity)", "color": "bg-orange-50" }
        ],
        "aiSentiment": [
            { "name": "Tích cực", "value": 75, "color": "#4F46E5" },
            { "name": "Tiêu cực", "value": 5, "color": "#EF4444" },
            { "name": "Trung lập", "value": 20, "color": "#CBD5E1" }
        ],
        "aiKeywords": ["#MùaHèXanh", "#ĐiểmRènLuyện", "#Wifi_yếu"]
    }
