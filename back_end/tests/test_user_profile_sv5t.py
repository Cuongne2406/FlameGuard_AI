import os
import sys
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
import sys
import requests

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")
    sys.stderr.reconfigure(encoding="utf-8")

BASE_URL = "http://127.0.0.1:8000/api/v1"

def run_tests():
    print("=" * 60)
    print("TEST: PROFILE SV5T & USER SETTINGS AUTO-FILL BACKEND API")
    print("=" * 60)

    # 1. Login as sinhvien
    print("\n1. Đăng nhập tài khoản 'sinhvien'...")
    login_res = requests.post(
        f"{BASE_URL}/auth/login",
        data={"username": "sinhvien", "password": "123456"}
    )
    if login_res.status_code != 200:
        login_res = requests.post(
            f"{BASE_URL}/auth/login",
            data={"username": "sinhvien", "password": "password123"}
        )
    
    if login_res.status_code != 200:
        print(f"❌ Login failed: {login_res.status_code} - {login_res.text}")
        sys.exit(1)
        
    token_data = login_res.json()
    token = token_data.get("access_token")
    headers = {"Authorization": f"Bearer {token}"}
    print("✅ Đăng nhập thành công! Token:", token[:20] + "...")

    # 2. Get current profile
    print("\n2. Gọi GET /users/me...")
    me_res = requests.get(f"{BASE_URL}/users/me", headers=headers)
    assert me_res.status_code == 200, f"GET /users/me failed: {me_res.text}"
    user_me = me_res.json()
    print(f"✅ Dữ liệu hiện tại của user: {user_me.get('full_name')} (MSSV: {user_me.get('student_id')})")

    # 3. Update profile with full SV5T details
    print("\n3. Gọi PUT /users/me để cập nhật toàn bộ trường thông tin SV5T...")
    update_payload = {
        "full_name": "Nguyễn Hoàng Nam",
        "email": "sinhvien@lhu.edu.vn",
        "phone_number": "0912345678",
        "cccd": "075204001234",
        "gender": "Nam",
        "date_of_birth": "2004-06-24",
        "ethnicity": "Kinh",
        "religion": "Không",
        "address": "Phường Bửu Long, TP. Biên Hòa, Đồng Nai",
        "academic_year_num": 3,
        "school_name": "Trường Đại học Lạc Hồng",
        "faculty_name": "Khoa Công nghệ Thông tin",
        "class_name": "21CT111",
        "education_level": "Đại học",
        "gpa": 3.85,
        "training_score": 95,
        "union_position": "Bí thư Chi đoàn 21CT111",
        "political_status": "Đoàn viên ưu tú",
        "achievement_summary": "Giải Nhì NCKH cấp Trường 2024, Cán bộ Đoàn xuất sắc năm học 2023-2024."
    }

    put_res = requests.put(f"{BASE_URL}/users/me", json=update_payload, headers=headers)
    assert put_res.status_code == 200, f"PUT /users/me failed: {put_res.status_code} - {put_res.text}"
    updated_user = put_res.json()
    print("✅ PUT /users/me thành công!")

    # 4. Verify with fresh GET /users/me
    print("\n4. Gọi lại GET /users/me để kiểm tra độ chính xác 100% của dữ liệu đã lưu...")
    verify_res = requests.get(f"{BASE_URL}/users/me", headers=headers)
    assert verify_res.status_code == 200, f"Verify GET failed: {verify_res.text}"
    verified_data = verify_res.json()

    checked_fields = [
        ("cccd", "075204001234"),
        ("gender", "Nam"),
        ("date_of_birth", "2004-06-24"),
        ("ethnicity", "Kinh"),
        ("religion", "Không"),
        ("address", "Phường Bửu Long, TP. Biên Hòa, Đồng Nai"),
        ("academic_year_num", 3),
        ("school_name", "Trường Đại học Lạc Hồng"),
        ("faculty_name", "Khoa Công nghệ Thông tin"),
        ("class_name", "21CT111"),
        ("education_level", "Đại học"),
        ("gpa", 3.85),
        ("training_score", 95),
        ("union_position", "Bí thư Chi đoàn 21CT111"),
        ("political_status", "Đoàn viên ưu tú"),
        ("phone_number", "0912345678"),
        ("achievement_summary", "Giải Nhì NCKH cấp Trường 2024, Cán bộ Đoàn xuất sắc năm học 2023-2024.")
    ]

    for field, expected in checked_fields:
        actual = verified_data.get(field)
        # Convert date to string if needed
        if field == "date_of_birth" and actual:
            actual = str(actual).split("T")[0]
        if field in ["gpa"]:
            actual = float(actual)
            expected = float(expected)
        assert actual == expected, f"Mismatch on {field}: expected {expected}, got {actual}"
        print(f"  ✓ {field}: {actual}")

    # 5. Verify /users/search endpoint
    print("\n5. Kiểm tra API GET /users/search?q=sinhvien...")
    search_res = requests.get(f"{BASE_URL}/users/search?q=sinhvien", headers=headers)
    assert search_res.status_code == 200, f"Search failed: {search_res.text}"
    search_results = search_res.json()
    assert len(search_results) > 0, "No user returned from search"
    matched = next((u for u in search_results if u.get("student_id") == verified_data.get("student_id") or u.get("email") == verified_data.get("email")), None)
    assert matched is not None, "Sinhvien not found in search results"
    assert matched.get("cccd") == "075204001234", f"Search result cccd mismatch: {matched.get('cccd')}"
    assert matched.get("faculty_name") == "Khoa Công nghệ Thông tin", f"Search result faculty mismatch: {matched.get('faculty_name')}"
    print("✅ Search endpoint trả về đầy đủ toàn bộ trường SV5T!")

    print("\n" + "=" * 60)
    print("🎉 TẤT CẢ CÁC BƯỚC KIỂM THỬ BACKEND ĐỀU THÀNH CÔNG 100%!")
    print("=" * 60)

if __name__ == "__main__":
    run_tests()
