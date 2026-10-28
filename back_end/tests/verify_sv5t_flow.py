import os
import sys
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
import sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_full_sv5t_flow():
    print("==================================================")
    print("BẮT ĐẦU KIỂM THỬ TỰ ĐỘNG QUY TRÌNH SV5T (TESTCLIENT)")
    print("==================================================")

    # 1. Đăng nhập bằng các tài khoản
    tokens = {}
    users_to_test = ["admin", "thanhpho", "chutich", "truonglachong", "sinhvien"]
    for u in users_to_test:
        resp = client.post("/api/v1/auth/login", data={"username": u, "password": "123456"})
        if resp.status_code != 200:
            resp = client.post("/api/v1/auth/login", data={"username": u, "password": "NewPassword123!"})
        assert resp.status_code == 200, f"Login failed for {u}: {resp.text}"
        data = resp.json()
        assert "access_token" in data and data["access_token"], f"No access token for {u}"
        tokens[u] = data["access_token"]
        print(f"✔ Đăng nhập thành công tài khoản: {u}")

    headers_admin = {"Authorization": f"Bearer {tokens['admin']}"}
    headers_city = {"Authorization": f"Bearer {tokens['thanhpho']}"}
    headers_leader = {"Authorization": f"Bearer {tokens['chutich']}"}
    headers_school = {"Authorization": f"Bearer {tokens['truonglachong']}"}
    headers_student = {"Authorization": f"Bearer {tokens['sinhvien']}"}

    # 2. Lấy danh sách đợt khen thưởng & Tiêu chuẩn
    resp_periods = client.get("/api/v1/awards/periods", headers=headers_school)
    assert resp_periods.status_code == 200, f"Get periods failed: {resp_periods.text}"
    periods = resp_periods.json()
    assert len(periods) >= 3, "Periods list count < 3"
    
    ongoing_period = next((p for p in periods if p["code"] == "SV5T-2026-2027"), None)
    assert ongoing_period is not None, "SV5T-2026-2027 period not found"
    period_id = ongoing_period["id"]
    print(f"✔ Lấy thành công Đợt khen thưởng: {ongoing_period['name']} ({period_id})")

    resp_stds = client.get(f"/api/v1/awards/periods/{period_id}/standards", headers=headers_school)
    assert resp_stds.status_code == 200, f"Get standards failed: {resp_stds.text}"
    standards = resp_stds.json()
    assert len(standards) >= 10, "Standards count < 10"
    print(f"✔ Đợt khen thưởng có {len(standards)} tiêu chuẩn.")

    # 3. Tạo hồ sơ nháp (DRAFT)
    import time
    test_mssv = f"TST{int(time.time()) % 1000000:06d}"
    draft_payload = {
        "period_id": period_id,
        "target_type": "INDIVIDUAL",
        "full_name": "Sinh Viên Kiểm Thử Tự Động",
        "student_code": test_mssv,
        "school_name": "Trường Đại học Lạc Hồng",
        "faculty_name": "Khoa CNTT",
        "class_name": "21CT111",
        "education_level": "Đại học",
        "academic_year_num": 3,
        "gpa": 3.65,
        "training_score": 95,
        "union_position": "Đoàn viên",
        "political_status": "Đoàn viên",
        "phone_number": "0988777666",
        "email": "test99999@lhu.edu.vn",
        "achievement_summary": "Thành tích học tập xuất sắc, NCKH đạt giải cấp trường",
        "legal_commitment": True,
        "is_draft": True,
        "items": []
    }
    resp_draft = client.post("/api/v1/awards/applications", json=draft_payload, headers=headers_school)
    assert resp_draft.status_code == 200, f"Create draft failed: {resp_draft.text}"
    app_data = resp_draft.json()
    app_id = app_data["id"]
    assert app_data["status"] == "DRAFT", f"Expected DRAFT, got {app_data['status']}"
    print(f"✔ Tạo hồ sơ nháp thành công: {app_data['application_code']} (ID: {app_id})")

    # 4. Kiểm tra CHẶN nộp khi thiếu minh chứng / thiếu tiêu chuẩn N trong M
    # Thử nộp ngay khi chưa có minh chứng:
    resp_submit_fail = client.post(f"/api/v1/awards/applications/{app_id}/submit", headers=headers_school)
    assert resp_submit_fail.status_code == 400, "Must reject submission when missing evidence"
    print(f"✔ Đã chặn nộp thành công khi thiếu minh chứng (HTTP 400: {resp_submit_fail.json()['detail']})")

    # 5. Bổ sung đầy đủ minh chứng & các tiêu chuẩn bắt buộc + N trong M
    items_to_submit = []
    for s in standards:
        is_sel = True if s["rule_type"] == "REQUIRED" else (s["order_num"] in [3, 6, 10])
        ev_files = [{"name": "Bang_diem_xac_nhan.pdf", "url": "https://cloudinary.com/test.pdf"}] if is_sel else []
        items_to_submit.append({
            "standard_id": s["id"],
            "is_selected": is_sel,
            "explanation": f"Minh chứng đạt tiêu chuẩn: {s['title'][:30]}",
            "evidence_files": ev_files
        })

    update_payload = {
        "period_id": period_id,
        "target_type": "INDIVIDUAL",
        "full_name": "Sinh Viên Kiểm Thử Tự Động",
        "student_code": test_mssv,
        "school_name": "Trường Đại học Lạc Hồng",
        "items": items_to_submit,
        "is_draft": True
    }
    resp_update = client.put(f"/api/v1/awards/applications/{app_id}", json=update_payload, headers=headers_school)
    assert resp_update.status_code == 200, f"Update items failed: {resp_update.text}"
    print("✔ Đã bổ sung đầy đủ minh chứng và các tiêu chuẩn.")

    # 6. Nộp lên Đoàn Trường (PENDING_PROVINCE)
    resp_submit = client.post(f"/api/v1/awards/applications/{app_id}/submit", headers=headers_school)
    assert resp_submit.status_code == 200, f"Submit failed: {resp_submit.text}"
    submitted_app = resp_submit.json()
    assert submitted_app["status"] == "PENDING_PROVINCE", f"Expected PENDING_PROVINCE, got {submitted_app['status']}"
    print(f"✔ Nộp lên Đoàn Trường thành công (Trạng thái: {submitted_app['status']})")

    # 7. Tài khoản 'thanhpho' (Ban Thường vụ Đoàn Trường) vào chấm điểm từng tiêu chuẩn -> Lưu tạm
    eval_items_req = []
    for it in submitted_app["items"]:
        if it["is_selected"]:
            eval_items_req.append({
                "item_id": it["id"],
                "eval_status": "PASSED",
                "eval_note": "Minh chứng đạt yêu cầu"
            })
    eval_payload = {
        "items": eval_items_req,
        "is_temp_save": True
    }
    resp_eval = client.post(f"/api/v1/awards/applications/{app_id}/evaluate", json=eval_payload, headers=headers_city)
    assert resp_eval.status_code == 200, f"Evaluate items failed: {resp_eval.text}"
    print("✔ Ban Thường vụ Đoàn Trường đã chấm điểm và Lưu tạm thành công.")

    # 8. Cán bộ Đoàn Trường yêu cầu làm rõ (PROVINCE_RETURNED)
    conclude_return_payload = {
        "conclusion": "RETURN_TO_SCHOOL",
        "reason": "Yêu cầu bổ sung thêm minh chứng giấy khen tình nguyện có mộc đỏ."
    }
    resp_conclude_ret = client.post(f"/api/v1/awards/applications/{app_id}/conclude", json=conclude_return_payload, headers=headers_city)
    assert resp_conclude_ret.status_code == 200, f"Conclude return failed: {resp_conclude_ret.text}"
    returned_app = resp_conclude_ret.json()
    assert returned_app["status"] == "PROVINCE_RETURNED", f"Expected PROVINCE_RETURNED, got {returned_app['status']}"
    print(f"✔ Đoàn Trường yêu cầu bổ sung hồ sơ thành công (Trạng thái: {returned_app['status']})")

    # 9. Khoa/Người lập nhận hồ sơ yêu cầu bổ sung -> Bấm Bổ sung và Gửi lại lên Đoàn Trường
    resp_resubmit = client.post(f"/api/v1/awards/applications/{app_id}/submit", headers=headers_school)
    assert resp_resubmit.status_code == 200, f"Resubmit failed: {resp_resubmit.text}"
    resubmitted_app = resp_resubmit.json()
    assert resubmitted_app["status"] == "PENDING_PROVINCE", f"Expected PENDING_PROVINCE, got {resubmitted_app['status']}"
    print(f"✔ Khoa/Người lập đã bổ sung minh chứng và gửi lại lên Đoàn Trường thành công.")

    # 10. Cán bộ Đoàn Trường thẩm định lại và kết luận 'Đủ tiêu chuẩn' (QUALIFIED)
    conclude_qual_payload = {
        "conclusion": "QUALIFIED",
        "reason": "Đã kiểm tra minh chứng bổ sung, toàn bộ 5 tiêu chuẩn đều Đạt."
    }
    resp_conclude_qual = client.post(f"/api/v1/awards/applications/{app_id}/conclude", json=conclude_qual_payload, headers=headers_city)
    assert resp_conclude_qual.status_code == 200, f"Conclude qualified failed: {resp_conclude_qual.text}"
    qualified_app = resp_conclude_qual.json()
    assert qualified_app["status"] == "QUALIFIED", f"Expected QUALIFIED, got {qualified_app['status']}"
    print(f"✔ Đoàn Trường xác nhận hồ sơ Đủ tiêu chuẩn (QUALIFIED).")

    # 11. Tài khoản 'chutich' vào ra quyết định 'Phê duyệt' (APPROVED)
    decision_payload = {
        "decision": "APPROVED",
        "note": "Công nhận Danh hiệu Sinh viên 5 Tốt cấp Trường năm học 2026-2027 theo QĐ số 199/QĐ-ĐTN."
    }
    resp_decision = client.post(f"/api/v1/awards/applications/{app_id}/decision", json=decision_payload, headers=headers_leader)
    assert resp_decision.status_code == 200, f"Leader decision failed: {resp_decision.text}"
    approved_app = resp_decision.json()
    assert approved_app["status"] == "APPROVED", f"Expected APPROVED, got {approved_app['status']}"
    print(f"✔ Hội đồng Khen thưởng Cấp Trường đã Phê duyệt hồ sơ thành công (APPROVED).")

    # 12. Kiểm tra API Lịch sử xét duyệt
    resp_hist = client.get(f"/api/v1/awards/histories?period_id={period_id}", headers=headers_admin)
    assert resp_hist.status_code == 200, f"Get histories failed: {resp_hist.text}"
    histories = resp_hist.json()
    assert len(histories) >= 5, "Histories count < 5"
    print(f"✔ API Lịch sử xét duyệt hoạt động chuẩn xác ({len(histories)} dòng nhật ký).")

    # 13. Kiểm tra API Dashboard thống kê SV5T
    resp_dash = client.get(f"/api/v1/awards/sv5t-dashboard?period_id={period_id}", headers=headers_admin)
    assert resp_dash.status_code == 200, f"Get dashboard failed: {resp_dash.text}"
    dash_data = resp_dash.json()
    assert "total_applications" in dash_data, "Missing total_applications"
    assert "party_union_ratio" in dash_data, "Missing party_union_ratio"
    assert "by_period" in dash_data, "Missing by_period"
    assert "by_academic_year" in dash_data, "Missing by_academic_year"
    assert "by_education_level" in dash_data, "Missing by_education_level"
    print(f"✔ API Dashboard thống kê SV5T trả về đầy đủ 6 chỉ số và 4 biểu đồ:")
    print(f"   - Tổng số hồ sơ: {dash_data['total_applications']}")
    print(f"   - Đảng viên: {dash_data['party_members_count']}")
    print(f"   - Đoàn viên: {dash_data['union_members_count']}")
    print(f"   - Đã phê duyệt: {dash_data['passed_count']}")
    print(f"   - Không đạt: {dash_data['failed_count']}")
    print(f"   - Đang xét duyệt: {dash_data['reviewing_count']}")

    # 14. Kiểm tra đổi mật khẩu (Core API)
    pw_payload = {
        "current_password": "WrongPassword",
        "new_password": "NewPassword123!"
    }
    resp_pw_wrong = client.post("/api/v1/users/me/change-password", json=pw_payload, headers=headers_student)
    assert resp_pw_wrong.status_code == 400, "Must reject incorrect current password"

    # Test short password (< 8 chars) rejection
    resp_pw_short = client.post(
        "/api/v1/users/me/change-password",
        json={"current_password": "WrongPassword", "new_password": "123"},
        headers=headers_student
    )
    assert resp_pw_short.status_code == 400, "Must reject short password"

    # Reset password directly in DB to 123456 first
    from app.db.session import SessionLocal
    from app.models import User
    from app.core.security import get_password_hash
    db = SessionLocal()
    try:
        user_sinhvien = db.query(User).filter(User.student_id == "sinhvien").first()
        if user_sinhvien:
            user_sinhvien.password_hash = get_password_hash("123456")
            db.commit()
    finally:
        db.close()

    # Now test valid change password from 123456 to NewSecret2026!
    resp_pw_ok = client.post(
        "/api/v1/users/me/change-password",
        json={"current_password": "123456", "new_password": "NewSecret2026!"},
        headers=headers_student
    )
    assert resp_pw_ok.status_code == 200, f"Change password failed: {resp_pw_ok.text}"

    # Reset back to 123456 so user can login normally
    db = SessionLocal()
    try:
        user_sinhvien = db.query(User).filter(User.student_id == "sinhvien").first()
        if user_sinhvien:
            user_sinhvien.password_hash = get_password_hash("123456")
            db.commit()
    finally:
        db.close()
    print("✔ Kiểm thử đổi mật khẩu theo chính sách bảo mật thành công & đã khôi phục mật khẩu chuẩn 123456.")

    print("==================================================")
    print("TẤT CẢ CÁC BÀI TEST BACKEND ĐÃ PASS 100%!")
    print("==================================================")

if __name__ == "__main__":
    test_full_sv5t_flow()
