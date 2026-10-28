import os
import sys
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
import sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

from fastapi.testclient import TestClient
from app.main import app
from app.db.session import SessionLocal
from app.models.core import User, Organization, OrgType, PointLog
from app.models.events import Event, EventRegistration, EventRegistrationStatus
from app.models.finance import Budget, FundRequest, FundRequestStatus

def run_tests():
    client = TestClient(app)
    db = SessionLocal()
    print("=== BẮT ĐẦU KIỂM THỬ TOÀN DIỆN LUỒNG SUBADMIN (FACULTY DATA SCOPING & 3-TIER) ===")

    # 1. Login SubAdmin truonglachong
    print("\n[1] Đăng nhập tài khoản SubAdmin: truonglachong...")
    login_res = client.post("/api/v1/auth/login", data={"username": "truonglachong", "password": "123456"})
    assert login_res.status_code == 200, f"Login failed: {login_res.text}"
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    print("-> Đăng nhập thành công, nhận Bearer token.")

    # 2. Check /users/me managed_org_id and managed_org_name
    print("\n[2] Kiểm tra /api/v1/users/me trả về đơn vị chủ quản...")
    me_res = client.get("/api/v1/users/me", headers=headers)
    assert me_res.status_code == 200, f"/users/me failed: {me_res.text}"
    me_data = me_res.json()
    managed_org_name = me_data.get("managed_org_name")
    managed_org_id = me_data.get("managed_org_id")
    print(f"-> managed_org_id: {managed_org_id}")
    print(f"-> managed_org_name: {managed_org_name}")
    assert managed_org_name is not None and "Khoa" in managed_org_name, f"Expected Faculty name, got {managed_org_name}"
    print("-> [PASS] /users/me trả về đúng thông tin Khoa chủ quản!")

    # 3. Create new Class and verify parent_id auto-assignment
    print("\n[3] Kiểm tra tạo Chi đoàn mới tự động gán parent_id của Khoa...")
    class_payload = {
        "name": f"Chi đoàn Test 23CT999",
        "type": "CLASS",
        "description": "Chi đoàn thử nghiệm Scoping Khoa"
    }
    create_class_res = client.post("/api/v1/organizations/", json=class_payload, headers=headers)
    assert create_class_res.status_code == 200, f"Create class failed: {create_class_res.text}"
    created_class = create_class_res.json()
    assert str(created_class.get("parent_id")) == str(managed_org_id), (
        f"Expected parent_id == {managed_org_id}, got {created_class.get('parent_id')}"
    )
    print(f"-> [PASS] Chi đoàn mới đã được tự động gán parent_id = {managed_org_id} của Khoa!")

    # 4. Check check-in point accumulation (PointLog + training_score)
    print("\n[4] Kiểm tra tích lũy Điểm rèn luyện (+5đ) và PointLog khi điểm danh (ATTENDED)...")
    # Find student
    sinhvien = db.query(User).filter(User.student_id == "sinhvien").first()
    assert sinhvien is not None, "User sinhvien not found in DB"
    initial_score = sinhvien.training_score or 0

    # Find or create an event
    event = db.query(Event).first()
    assert event is not None, "Event not found in DB"

    # Find or create registration for sinhvien
    reg = db.query(EventRegistration).filter(
        EventRegistration.event_id == event.id,
        EventRegistration.user_id == sinhvien.id
    ).first()
    if not reg:
        reg = EventRegistration(
            event_id=event.id,
            user_id=sinhvien.id,
            status=EventRegistrationStatus.REGISTERED
        )
        db.add(reg)
        db.commit()
        db.refresh(reg)

    # Clean existing PointLog for clean test
    db.query(PointLog).filter(
        PointLog.user_id == sinhvien.id,
        PointLog.event_id == event.id
    ).delete()
    db.commit()

    # Call PUT /events/{id}/registrations/{reg_id} with status="ATTENDED"
    checkin_res = client.put(
        f"/api/v1/events/{event.id}/registrations/{reg.id}",
        json={"status": "ATTENDED"},
        headers=headers
    )
    assert checkin_res.status_code == 200, f"Checkin failed: {checkin_res.text}"
    
    # Verify DB update
    db.refresh(sinhvien)
    new_score = sinhvien.training_score or 0
    point_log = db.query(PointLog).filter(
        PointLog.user_id == sinhvien.id,
        PointLog.event_id == event.id
    ).first()
    
    assert point_log is not None, "PointLog record was NOT created!"
    assert new_score == initial_score + (event.points_awarded or 5), (
        f"Score mismatch: expected {initial_score + (event.points_awarded or 5)}, got {new_score}"
    )
    print(f"-> [PASS] Đã tạo PointLog ({point_log.points}đ) và cộng điểm rèn luyện: {initial_score} -> {new_score}!")

    # 5. Check Fund Request creation and visibility to UNIVERSITY_ADMIN
    print("\n[5] Kiểm tra SubAdmin lập FundRequest và Admin Trường nhìn thấy trong hệ thống...")
    budget = db.query(Budget).filter(Budget.organization_id == managed_org_id).first()
    assert budget is not None, "Faculty budget not found"

    fund_req_payload = {
        "budget_id": str(budget.id),
        "amount": 7500000,
        "reason": "Kinh phí tổ chức Chiến dịch Mùa hè xanh Khoa CNTT"
    }
    create_req_res = client.post("/api/v1/fund-requests/", json=fund_req_payload, headers=headers)
    assert create_req_res.status_code == 200, f"FundRequest failed: {create_req_res.text}"
    req_data = create_req_res.json()
    assert req_data.get("status") == "PENDING"
    print("-> SubAdmin đã tạo FundRequest thành công ở trạng thái PENDING.")

    # Login as UNIVERSITY_ADMIN (admin)
    admin_login = client.post("/api/v1/auth/login", data={"username": "admin", "password": "123456"})
    assert admin_login.status_code == 200
    admin_token = admin_login.json()["access_token"]
    admin_headers = {"Authorization": f"Bearer {admin_token}"}

    admin_reqs_res = client.get("/api/v1/fund-requests/", headers=admin_headers)
    assert admin_reqs_res.status_code == 200, f"Get fund-requests failed: {admin_reqs_res.text}"
    admin_reqs = admin_reqs_res.json()
    found_in_admin = any("Mùa hè xanh Khoa CNTT" in (item.get("reason") or item.get("title") or "") for item in admin_reqs)
    assert found_in_admin, "Fund request not visible to University Admin!"
    print(f"-> Đề xuất xuất hiện trong danh sách Quản lý Kinh phí của Admin Trường: {found_in_admin}")
    print("-> [PASS] Luồng đề xuất kinh phí 3 cấp hoạt động hoàn hảo!")

    # 6. Verify Faculty Finance & Student Fees Scoping
    print("\n[6] Kiểm tra API Đoàn phí và Tài chính Khoa...")
    fees_res = client.get("/api/v1/finance/student-fees", headers=headers)
    assert fees_res.status_code == 200, f"Student fees failed: {fees_res.text}"
    fees_data = fees_res.json()
    print(f"-> Tổng sinh viên: {fees_data.get('totalStudents')}, Đã đóng: {fees_data.get('paidCount')}, Tỷ lệ: {fees_data.get('percentPaid')}%")
    assert fees_data.get("totalStudents", 0) > 0, "No students found in fees overview"
    print("-> [PASS] API /finance/student-fees trả về đầy đủ dữ liệu thống kê!")

    db.close()
    print("\n=======================================================")
    print(">>> TẤT CẢ 6 HẠNG MỤC KIỂM THỬ BACKEND ĐỀU ĐẠT 100%! <<<")
    print("=======================================================")

if __name__ == "__main__":
    run_tests()
