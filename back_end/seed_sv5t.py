import uuid
import sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
from datetime import date, datetime, timedelta, timezone
from app.db.session import engine, SessionLocal
from app.core.security import get_password_hash
from app.models.core import User, Role, Organization, OrgType, OrgStatus, UserOrganization, AcademicTerm
from app.models.awards import (
    Award, AwardPeriod, AwardStandard, AwardApplicationItem, AwardApprovalHistory
)
from app.models.finance import (
    Budget, FundRequest, FundRequestStatus, Asset, AssetStatus, FinanceTransaction, TransactionType, TransactionStatus, StudentFee
)
from app.models.events import (
    Campaign, CampaignStatus, Event, EventStatus, EventIncident, EventRegistration, EventRegistrationStatus
)
from app.models.ai import (
    AISentiment, SentimentLabel, AIPrediction, AIAudit, AuditAction
)
from app.models.documents import DigitalDocument, DocumentStatus


def seed_data():
    db = SessionLocal()
    print("Bắt đầu Seed dữ liệu SV5T toàn diện...")
    
    try:
        # 1. Seed Roles
        roles_data = [
            ("ADMIN", "Quản trị viên toàn quyền hệ thống"),
            ("UNIVERSITY_ADMIN", "Ban Thường vụ Đoàn Trường / Cấp Trường"),
            ("PROVINCE", "Ban Thường vụ Đoàn Trường (Thẩm định cấp Trường)"),
            ("LEADER", "Chủ tịch Hội đồng Khen thưởng Cấp Trường"),
            ("FACULTY_ADMIN", "Ban Chấp hành Đoàn Khoa / Cấp Khoa"),
            ("STUDENT", "Sinh viên / Đoàn viên Chi đoàn")
        ]
        role_objs = {}
        for r_name, r_desc in roles_data:
            role = db.query(Role).filter(Role.name == r_name).first()
            if not role:
                role = Role(name=r_name, description=r_desc)
                db.add(role)
                db.commit()
                db.refresh(role)
            else:
                role.description = r_desc
                db.commit()
            role_objs[r_name] = role
        print("Đã kiểm tra và tạo Roles thành công.")

        # 2. Seed Organizations
        orgs_data = [
            ("Trường Đại học Lạc Hồng", OrgType.UNIVERSITY, "Đoàn Trường Đại học Lạc Hồng (Cơ quan quản lý cao nhất)", None),
        ]
        org_objs = {}
        for name, o_type, desc, parent_id in orgs_data:
            org = db.query(Organization).filter(Organization.name == name).first()
            if not org:
                org = Organization(name=name, type=o_type, description=desc, status=OrgStatus.ACTIVE)
                db.add(org)
                db.commit()
                db.refresh(org)
            org_objs[name] = org

        # Khoa & Chi đoàn LHU
        lhu_org = org_objs["Trường Đại học Lạc Hồng"]

        faculties_data = [
            ("Khoa Công nghệ Thông tin - LHU", "Khoa CNTT Đại học Lạc Hồng"),
            ("Khoa Dược - LHU", "Khoa Dược Đại học Lạc Hồng"),
            ("Khoa Kinh tế - Quản trị Quốc tế - LHU", "Khoa Kinh tế Quản trị Đại học Lạc Hồng"),
            ("Khoa Ngôn ngữ Anh - LHU", "Khoa Ngôn ngữ Anh Đại học Lạc Hồng"),
        ]
        faculty_objs = {}
        for f_name, f_desc in faculties_data:
            f_org = db.query(Organization).filter(Organization.name == f_name).first()
            if not f_org:
                f_org = Organization(
                    name=f_name,
                    type=OrgType.FACULTY,
                    parent_id=lhu_org.id,
                    description=f_desc,
                    status=OrgStatus.ACTIVE
                )
                db.add(f_org)
                db.commit()
                db.refresh(f_org)
            else:
                f_org.parent_id = lhu_org.id
                db.commit()
            faculty_objs[f_name] = f_org
            org_objs[f_name] = f_org

        faculty_cntt = faculty_objs["Khoa Công nghệ Thông tin - LHU"]
        org_objs["Khoa CNTT"] = faculty_cntt

        # Seed các Chi đoàn trực thuộc Khoa CNTT
        classes_data = [
            ("Chi đoàn 21CT111", "Chi đoàn khóa 2021 Khoa CNTT", 95),
            ("Chi đoàn 21CT112", "Chi đoàn khóa 2021 Lớp 2 Khoa CNTT", 88),
            ("Chi đoàn 22CT111", "Chi đoàn khóa 2022 Khoa CNTT", 90),
        ]
        class_objs = {}
        for c_name, c_desc, c_pts in classes_data:
            c_org = db.query(Organization).filter(Organization.name == c_name).first()
            if not c_org:
                c_org = Organization(
                    name=c_name,
                    type=OrgType.CLASS,
                    parent_id=faculty_cntt.id,
                    description=c_desc,
                    status=OrgStatus.ACTIVE,
                    activity_points=c_pts
                )
                db.add(c_org)
                db.commit()
                db.refresh(c_org)
            else:
                c_org.parent_id = faculty_cntt.id
                db.commit()
            class_objs[c_name] = c_org
            org_objs[c_name] = c_org

        class_21ct111 = class_objs["Chi đoàn 21CT111"]

        # Seed các CLB trực thuộc Khoa CNTT
        clubs_data = [
            ("CLB Lập trình LHU", "Câu lạc bộ Học thuật và Lập trình thi đấu"),
            ("CLB AI & Robotics", "Câu lạc bộ Nghiên cứu Trí tuệ Nhân tạo & Tự động hóa"),
        ]
        for cl_name, cl_desc in clubs_data:
            cl_org = db.query(Organization).filter(Organization.name == cl_name).first()
            if not cl_org:
                cl_org = Organization(
                    name=cl_name,
                    type=OrgType.CLUB,
                    parent_id=faculty_cntt.id,
                    description=cl_desc,
                    status=OrgStatus.ACTIVE
                )
                db.add(cl_org)
                db.commit()
                db.refresh(cl_org)
            else:
                cl_org.parent_id = faculty_cntt.id
                db.commit()
            org_objs[cl_name] = cl_org

        print("Đã tạo Organizations (Trường, 4 Khoa, 3 Chi đoàn, 2 CLB) thành công.")

        # 3. Seed Users with Uniform Password
        password_raw = "123456"
        pw_hash = get_password_hash(password_raw)

        users_info = [
            ("admin", "admin@flameguard.ai", "Trịnh Quốc Cường (Bí thư Đoàn Trường)", ["ADMIN", "UNIVERSITY_ADMIN"], lhu_org),
            ("thanhpho", "thanhpho@lhu.edu.vn", "Nguyễn Văn Thành (Ban Thường vụ Đoàn Trường)", ["UNIVERSITY_ADMIN", "PROVINCE"], lhu_org),
            ("chutich", "chutich@lhu.edu.vn", "Lê Hoàng Phúc (Hội đồng Khen thưởng Cấp Trường)", ["LEADER", "UNIVERSITY_ADMIN"], lhu_org),
            ("truonglachong", "doanhoi@lhu.edu.vn", "Trần Minh Tâm (Bí thư Đoàn Khoa CNTT)", ["FACULTY_ADMIN"], faculty_cntt),
            ("truong", "truong@lhu.edu.vn", "Cán bộ Quản lý Khoa CNTT LHU", ["FACULTY_ADMIN"], faculty_cntt),
            ("sinhvien", "sinhvien@lhu.edu.vn", "Nguyễn Hoàng Nam (Sinh viên)", ["STUDENT"], class_21ct111),
            ("sinhvien2", "sinhvien2@lhu.edu.vn", "Lê Thị Mai (Sinh viên 21CT112)", ["STUDENT"], class_objs["Chi đoàn 21CT112"]),
            ("sinhvien3", "sinhvien3@lhu.edu.vn", "Phạm Quốc Tuấn (Sinh viên 22CT111)", ["STUDENT"], class_objs["Chi đoàn 22CT111"]),
        ]

        user_objs = {}
        for username, email, full_name, role_names, org in users_info:
            user = db.query(User).filter((User.student_id == username) | (User.email == email)).first()
            if not user:
                user = User(
                    student_id=username,
                    email=email,
                    full_name=full_name,
                    password_hash=pw_hash,
                    class_name=org.name if org.type == OrgType.CLASS else "21CT111",
                    class_id=org.id if org.type == OrgType.CLASS else None,
                    training_score=92
                )
                db.add(user)
                db.flush()
            else:
                user.password_hash = pw_hash
                user.full_name = full_name
                user.student_id = username
                if org.type == OrgType.CLASS:
                    user.class_id = org.id
                    user.class_name = org.name

            # Cập nhật thông tin SV5T phong phú cho tài khoản sinhvien
            if username == "sinhvien":
                user.full_name = "Nguyễn Hoàng Nam"
                user.cccd = "075204001234"
                user.gender = "Nam"
                user.date_of_birth = date(2004, 6, 24)
                user.ethnicity = "Kinh"
                user.religion = "Không"
                user.address = "Phường Bửu Long, TP. Biên Hòa, Đồng Nai"
                user.academic_year_num = 3
                user.school_name = "Trường Đại học Lạc Hồng"
                user.faculty_name = "Khoa Công nghệ Thông tin"
                user.class_name = "21CT111"
                user.class_id = class_21ct111.id
                user.education_level = "Đại học"
                user.gpa = 3.65
                user.training_score = 92
                user.union_position = "Ủy viên BCH Chi đoàn"
                user.political_status = "Đoàn viên"
                user.phone_number = "0912345678"
                user.achievement_summary = "Đạt danh hiệu Sinh viên Giỏi năm học 2025-2026, Điểm rèn luyện Xuất sắc (92/100). Đạt giải Nhì NCKH cấp Trường với đề tài Ứng dụng AI trong quản lý Đoàn viên. Tham gia tích cực chiến dịch Mùa hè xanh và hiến máu tình nguyện 2 lần."
            else:
                user.school_name = "Trường Đại học Lạc Hồng"
                user.faculty_name = "Khoa Công nghệ Thông tin" if ("truong" in username or "sinhvien" in username) else "Văn phòng Đoàn Trường"
                user.union_position = "Ủy viên Ban Thường vụ Đoàn Trường" if ("ADMIN" in role_names or "PROVINCE" in role_names) else ("Bí thư Đoàn Khoa" if username == "truonglachong" else "Đoàn viên")
                user.political_status = "Đảng viên" if ("ADMIN" in role_names or "LEADER" in role_names or "PROVINCE" in role_names) else "Đoàn viên"
                user.phone_number = "0988776655"
            
            # Assign roles
            for r_name in role_names:
                role_obj = role_objs.get(r_name)
                if role_obj and role_obj not in user.roles:
                    user.roles.append(role_obj)

            # Assign UserOrganization
            uo = db.query(UserOrganization).filter(
                UserOrganization.user_id == user.id,
                UserOrganization.organization_id == org.id
            ).first()
            if not uo:
                uo = UserOrganization(
                    user_id=user.id,
                    organization_id=org.id,
                    title="Bí thư Đoàn Khoa" if username == "truonglachong" else ("Ban Thường vụ Đoàn Trường" if ("ADMIN" in role_names or "PROVINCE" in role_names) else "Thành viên"),
                    is_primary=True
                )
                db.add(uo)
            else:
                uo.title = "Bí thư Đoàn Khoa" if username == "truonglachong" else ("Ban Thường vụ Đoàn Trường" if ("ADMIN" in role_names or "PROVINCE" in role_names) else "Thành viên")

            db.commit()
            db.refresh(user)
            user_objs[username] = user

        # Gán rõ leader_user_id cho Khoa CNTT
        faculty_cntt.leader_user_id = user_objs["truonglachong"].id
        db.commit()

        print("Đã tạo Users & phân quyền SV5T thành công (mật khẩu: 123456).")

        # 4. Seed 3 Award Periods
        p_ongoing = db.query(AwardPeriod).filter(AwardPeriod.code == "SV5T-2026-2027").first()
        if not p_ongoing:
            p_ongoing = AwardPeriod(
                code="SV5T-2026-2027",
                name="Xét chọn Danh hiệu Sinh viên 5 Tốt cấp Trường năm học 2026 - 2027",
                year=2026,
                description="Đợt xét chọn Danh hiệu Sinh viên 5 Tốt và Tập thể Sinh viên 5 Tốt cấp Trường năm học 2026-2027 dành cho sinh viên và các chi đoàn trực thuộc các Khoa.",
                start_date=date(2026, 9, 1),
                end_date=date(2027, 6, 30),
                submission_deadline=datetime(2027, 5, 31, 23, 59, 59, tzinfo=timezone.utc),
                decision_file_url="https://res.cloudinary.com/dtb6uvcw7/image/upload/v1774168616/system/decision_sv5t_2026_2027.pdf",
                quotas={"CNTT": 15, "DUOC": 10, "KINHTE": 12, "NGOAINGU": 8},
                status="ONGOING"
            )
            db.add(p_ongoing)
            db.commit()
            db.refresh(p_ongoing)
        else:
            p_ongoing.name = "Xét chọn Danh hiệu Sinh viên 5 Tốt cấp Trường năm học 2026 - 2027"
            p_ongoing.description = "Đợt xét chọn Danh hiệu Sinh viên 5 Tốt và Tập thể Sinh viên 5 Tốt cấp Trường năm học 2026-2027 dành cho sinh viên và các chi đoàn trực thuộc các Khoa."
            p_ongoing.quotas = {"CNTT": 15, "DUOC": 10, "KINHTE": 12, "NGOAINGU": 8}
            db.commit()

        p_ended = db.query(AwardPeriod).filter(AwardPeriod.code == "SV5T-2025-2026").first()
        if not p_ended:
            p_ended = AwardPeriod(
                code="SV5T-2025-2026",
                name="Xét chọn Danh hiệu Sinh viên 5 Tốt cấp Trường năm học 2025 - 2026",
                year=2025,
                description="Đợt xét chọn Danh hiệu Sinh viên 5 Tốt cấp Trường năm học 2025-2026 (Đã tổng kết).",
                start_date=date(2025, 9, 1),
                end_date=date(2026, 6, 30),
                submission_deadline=datetime(2026, 5, 31, 23, 59, 59, tzinfo=timezone.utc),
                status="ENDED"
            )
            db.add(p_ended)
            db.commit()
            db.refresh(p_ended)
        else:
            p_ended.name = "Xét chọn Danh hiệu Sinh viên 5 Tốt cấp Trường năm học 2025 - 2026"
            db.commit()

        p_upcoming = db.query(AwardPeriod).filter(AwardPeriod.code == "HS3RL-2026-2027").first()
        if not p_upcoming:
            p_upcoming = AwardPeriod(
                code="HS3RL-2026-2027",
                name="Xét chọn Danh hiệu Học sinh 3 Rèn luyện cấp Trường năm học 2026 - 2027",
                year=2026,
                description="Đợt xét chọn dành cho khối học sinh, sinh viên đào tạo nghề trực thuộc Trường.",
                start_date=date(2026, 11, 1),
                end_date=date(2027, 7, 31),
                submission_deadline=datetime(2027, 6, 30, 23, 59, 59, tzinfo=timezone.utc),
                status="UPCOMING"
            )
            db.add(p_upcoming)
            db.commit()
            db.refresh(p_upcoming)
        else:
            p_upcoming.name = "Xét chọn Danh hiệu Học sinh 3 Rèn luyện cấp Trường năm học 2026 - 2027"
            db.commit()

        print("Đã tạo 3 Đợt khen thưởng mẫu.")

        # 5. Seed Standards for SV5T-2026-2027
        standards_data = [
            # 1. Đạo đức tốt
            ("1. Đạo đức tốt", "Điểm rèn luyện trung bình năm học đạt từ 90 điểm trở lên (hoặc xếp loại Xuất sắc)", "Bảng điểm rèn luyện có xác nhận của Nhà trường", "HD số 01-HD/TWHSV", "REQUIRED", None, None, 1, 1),
            ("1. Đạo đức tốt", "Không vi phạm pháp luật và các quy chế, nội quy của Nhà trường", "Bản cam đoan và giấy xác nhận hạnh kiểm của đơn vị đào tạo", "Điều lệ Hội Sinh viên VN", "REQUIRED", None, None, 1, 2),
            ("1. Đạo đức tốt", "Đạt danh hiệu Đoàn viên xuất sắc hoặc Thanh niên tiên tiến làm theo lời Bác", "Giấy chứng nhận Đoàn viên xuất sắc hoặc quyết định khen thưởng", "Kế hoạch năm học", "GROUP_SELECT", "GROUP_DAODUC_1", "Chọn ít nhất 1 trong 2 tiêu chuẩn sau", 1, 3),
            ("1. Đạo đức tốt", "Tham gia tích cực và đạt kết quả tốt trong các diễn đàn học tập Nghị quyết, pháp luật", "Giấy chứng nhận tham gia hoặc ảnh chụp minh chứng", "Kế hoạch năm học", "GROUP_SELECT", "GROUP_DAODUC_1", "Chọn ít nhất 1 trong 2 tiêu chuẩn sau", 1, 4),

            # 2. Học tập tốt
            ("2. Học tập tốt", "Điểm trung bình chung học tập (GPA) năm học đạt từ 3.2/4.0 trở lên", "Bảng điểm học tập năm học có mộc đỏ xác nhận của Phòng Đào tạo", "Quy chế Đào tạo ĐH", "REQUIRED", None, None, 1, 5),
            ("2. Học tập tốt", "Tham gia đề tài Nghiên cứu khoa học sinh viên các cấp nghiệm thu Đạt", "Quyết định giao đề tài hoặc biên bản nghiệm thu đề tài NCKH", "HD NCKH LHU", "GROUP_SELECT", "GROUP_HOCTAP_1", "Chọn ít nhất 1 trong 3 tiêu chuẩn học thuật sau", 1, 6),
            ("2. Học tập tốt", "Có bài báo khoa học đăng trên kỷ yếu hội thảo hoặc tạp chí khoa học chuyên ngành", "Bản chụp bài báo kèm mục lục kỷ yếu/tạp chí", "Danh mục Scopus/Tạp chí", "GROUP_SELECT", "GROUP_HOCTAP_1", "Chọn ít nhất 1 trong 3 tiêu chuẩn học thuật sau", 1, 7),
            ("2. Học tập tốt", "Đạt giải trong các cuộc thi học thuật, sáng tạo kỹ thuật, kỳ thi tay nghề cấp trường trở lên", "Giấy khen hoặc giấy chứng nhận đạt giải", "QĐ khen thưởng", "GROUP_SELECT", "GROUP_HOCTAP_1", "Chọn ít nhất 1 trong 3 tiêu chuẩn học thuật sau", 1, 8),

            # 3. Thể lực tốt
            ("3. Thể lực tốt", "Đạt tiêu chuẩn Rèn luyện thể lực theo quy định hiện hành hoặc danh hiệu Thanh niên khỏe", "Bảng kết quả kiểm tra thể lực hoặc giấy chứng nhận Thanh niên khỏe", "Thông tư Bộ GD&ĐT", "REQUIRED", None, None, 1, 9),
            ("3. Thể lực tốt", "Đạt giải trong các hội thao, giải thi đấu thể dục thể thao cấp trường trở lên", "Giấy chứng nhận giải thưởng thể thao", "QĐ BTC Hội thao", "GROUP_SELECT", "GROUP_THELUC_1", "Chọn ít nhất 1 trong 2 tiêu chuẩn sau", 1, 10),
            ("3. Thể lực tốt", "Là thành viên tích cực của đội tuyển thể thao hoặc Ban chủ nhiệm CLB thể dục thể thao", "Giấy xác nhận của Ban chủ nhiệm CLB hoặc Khoa Giáo dục Thể chất", "Xác nhận CLB", "GROUP_SELECT", "GROUP_THELUC_1", "Chọn ít nhất 1 trong 2 tiêu chuẩn sau", 1, 11),

            # 4. Tình nguyện tốt
            ("4. Tình nguyện tốt", "Tham gia ít nhất 05 ngày tình nguyện trong năm học (Chiến dịch Mùa hè xanh, Tiếp sức mùa thi...)", "Giấy chứng nhận tham gia chiến dịch tình nguyện có xác nhận của Đoàn trường", "Kế hoạch Chiến dịch hè", "REQUIRED", None, None, 1, 12),
            ("4. Tình nguyện tốt", "Được khen thưởng trong các hoạt động tình nguyện hoặc tham gia hiến máu tình nguyện từ 1 lần trở lên", "Giấy chứng nhận hiến máu tình nguyện hoặc giấy khen cấp trường", "Ban chỉ đạo Vận động HMTN", "REQUIRED", None, None, 1, 13),

            # 5. Hội nhập tốt
            ("5. Hội nhập tốt", "Đạt chứng chỉ năng lực tiếng Anh (TOEIC 550+, IELTS 5.0+ hoặc tương đương)", "Bản scan chứng chỉ tiếng Anh còn hiệu lực", "Khung năng lực ngoại ngữ VN", "REQUIRED", None, None, 1, 14),
            ("5. Hội nhập tốt", "Tham gia các chương trình giao lưu sinh viên quốc tế, hội nghị quốc tế hoặc CLB tiếng Anh", "Giấy chứng nhận tham gia chương trình hoặc xác nhận của Đoàn trường", "Kế hoạch HTQT", "REQUIRED", None, None, 1, 15),
        ]

        standard_objs = []
        # Clear existing standards for this period if any
        db.query(AwardStandard).filter(AwardStandard.period_id == p_ongoing.id).delete()
        db.commit()

        for c_name, title, ev_req, doc_ref, r_type, g_code, g_name, min_sel, o_num in standards_data:
            std = AwardStandard(
                period_id=p_ongoing.id,
                criteria_name=c_name,
                title=title,
                evidence_requirement=ev_req,
                document_reference=doc_ref,
                rule_type=r_type,
                group_code=g_code,
                group_name=g_name,
                min_select_count=min_sel,
                order_num=o_num
            )
            db.add(std)
            standard_objs.append(std)
        db.commit()
        print(f"Đã tạo {len(standard_objs)} Tiêu chuẩn 5 Tốt cho đợt {p_ongoing.code}.")

        # 6. Seed 12 Applications across all states
        evidence_sample = [
            {"name": "Bang_diem_hoc_tap_GPA3.6.pdf", "url": "https://res.cloudinary.com/dtb6uvcw7/image/upload/v1774168616/sample_gpa.pdf"},
            {"name": "Giay_chung_nhan_NCKH.pdf", "url": "https://res.cloudinary.com/dtb6uvcw7/image/upload/v1774168616/sample_nckh.pdf"},
            {"name": "Chung_chi_IELTS_6.0.pdf", "url": "https://res.cloudinary.com/dtb6uvcw7/image/upload/v1774168616/sample_ielts.pdf"},
            {"name": "Giay_khen_Mua_he_xanh.pdf", "url": "https://res.cloudinary.com/dtb6uvcw7/image/upload/v1774168616/sample_mhx.pdf"}
        ]

        sample_apps = [
            ("HS-2026-001", "DRAFT", "INDIVIDUAL", "Trần Đình Khang", "121000101", 3.45, 92, "Đoàn viên", "21CT111", "Đại học", False, "Tự đề cử danh hiệu SV5T năm học 2026-2027"),
            ("HS-2026-002", "PENDING_SCHOOL", "INDIVIDUAL", "Lê Thị Thảo Vy", "121000102", 3.65, 95, "Đoàn viên", "21CT112", "Đại học", False, "Đạt thành tích học tập giỏi và tham gia tốt chiến dịch Mùa hè xanh"),
            ("HS-2026-003", "PENDING_PROVINCE", "INDIVIDUAL", "Nguyễn Hoàng Nam", "121000103", 3.82, 98, "Đảng viên", "21CT111", "Đại học", False, "Giải Nhất NCKH cấp Trường, IELTS 6.5, Bí thư chi đoàn gương mẫu"),
            ("HS-2026-004", "PROVINCE_RETURNED", "INDIVIDUAL", "Phạm Quốc Bảo", "121000104", 3.25, 88, "Đoàn viên", "21CT113", "Đại học", False, "Thành tích học tập và rèn luyện khá tốt"),
            ("HS-2026-005", "QUALIFIED", "INDIVIDUAL", "Đỗ Mai Phương", "121000105", 3.75, 96, "Đoàn viên", "21QT111", "Đại học", False, "Cán bộ Hội xuất sắc, giải Nhì tiếng Anh Eureka"),
            ("HS-2026-006", "UNQUALIFIED", "INDIVIDUAL", "Vũ Minh Tuấn", "121000106", 2.90, 78, "Đoàn viên", "21KT111", "Đại học", False, "Hồ sơ chưa đạt chuẩn GPA tối thiểu 3.2"),
            ("HS-2026-007", "RETURNED", "INDIVIDUAL", "Bùi Thanh Trúc", "121000107", 3.30, 91, "Đoàn viên", "21DL111", "Đại học", False, "Cần làm rõ văn bản xác nhận số ngày tình nguyện hè"),
            ("HS-2026-008", "APPROVED", "INDIVIDUAL", "Phan Gia Huy", "121000108", 3.90, 100, "Đảng viên", "21CT111", "Đại học", False, "Sinh viên 5 Tốt tiêu biểu tỉnh Đồng Nai, giải Ba sinh viên NCKH Bộ GD&ĐT"),
            ("HS-2026-009", "REJECTED", "INDIVIDUAL", "Hoàng Văn Đức", "121000109", 3.20, 85, "Đoàn viên", "21CK111", "Đại học", False, "Vi phạm quy chế thi học kỳ 1"),
            ("HS-2026-010", "APPROVED", "COLLECTIVE", "Chi đoàn 21CT111 - LHU", None, 3.42, 94, "Đoàn viên", "21CT111", "Đại học", False, "Tập thể Sinh viên 5 Tốt xuất sắc có 100% sinh viên đạt chuẩn thể lực"),
            ("HS-2026-011", "PENDING_PROVINCE", "INDIVIDUAL", "Đặng Thùy Dung", "121000111", 3.55, 93, "Đoàn viên", "21AV111", "Đại học", True, "Nộp muộn sau hạn do tham gia giao lưu tại Nhật Bản"),
            ("HS-2026-012", "QUALIFIED", "INDIVIDUAL", "Trịnh Anh Tuấn", "121000112", 3.68, 97, "Đảng viên", "21XD111", "Đại học", False, "Huy chương Bạc giải Thể thao sinh viên toàn tỉnh")
        ]

        # Delete old applications in this period
        db.query(Award).filter(Award.period_id == p_ongoing.id).delete()
        db.commit()

        for code, status, t_type, name, mssv, gpa, score, pol_status, cls, edu, is_late, summary in sample_apps:
            app = Award(
                application_code=code,
                period_id=p_ongoing.id,
                created_by_id=user_objs["sinhvien"].id if code == "HS-2026-001" else user_objs["truonglachong"].id,
                organization_id=org_objs["Trường Đại học Lạc Hồng"].id,
                target_type=t_type,
                full_name=name,
                address="Biên Hòa, Đồng Nai",
                date_of_birth=date(2003, 5, 20),
                gender="Nam" if "Văn" in name or "Khang" in name or "Nam" in name or "Huy" in name or "Tuấn" in name else "Nữ",
                cccd="075203001234",
                ethnicity="Kinh",
                religion="Không",
                student_code=mssv,
                academic_year_num=3,
                school_name="Trường Đại học Lạc Hồng",
                faculty_name="Khoa Công nghệ Thông tin",
                class_name=cls,
                education_level=edu,
                gpa=gpa,
                training_score=score,
                union_position="Ủy viên BCH Chi đoàn" if "Đảng" in pol_status else "Đoàn viên",
                political_status=pol_status,
                phone_number="0912345678",
                email=f"{mssv}@lhu.edu.vn" if mssv else "doanhoi.21ct111@lhu.edu.vn",
                achievement_summary=summary,
                legal_commitment=True,
                is_late_submission=is_late,
                status=status,
                award_name="Danh hiệu Sinh viên 5 Tốt",
                awarded_date=date(2026, 10, 15) if status == "APPROVED" else None
            )
            db.add(app)
            db.commit()
            db.refresh(app)

            # Add Application Items for this application
            for std in standard_objs:
                # Select required and some group select
                is_sel = True if std.rule_type == "REQUIRED" else (std.order_num in [3, 6, 10])
                ev_status = "PASSED" if status in ["QUALIFIED", "APPROVED"] else ("FAILED" if std.order_num == 14 and status == "PROVINCE_RETURNED" else None)
                ev_note = "Minh chứng rõ ràng, hợp lệ" if ev_status == "PASSED" else ("Cần bổ sung chứng chỉ ngoại ngữ" if ev_status == "FAILED" else None)
                
                item = AwardApplicationItem(
                    application_id=app.id,
                    standard_id=std.id,
                    is_selected=is_sel,
                    explanation=f"Minh chứng cho tiêu chuẩn: {std.title[:40]}...",
                    evidence_files=evidence_sample if is_sel else [],
                    eval_status=ev_status,
                    eval_note=ev_note,
                    is_temp_saved=False
                )
                db.add(item)
            db.commit()

            # Add Approval Histories
            h1 = AwardApprovalHistory(
                application_id=app.id,
                action="Nộp hồ sơ lên Đoàn Trường",
                from_status="DRAFT" if status != "DRAFT" else None,
                to_status=status if status in ["DRAFT", "PENDING_PROVINCE", "PENDING_SCHOOL"] else "PENDING_PROVINCE",
                actor_id=user_objs["truonglachong"].id,
                actor_name="Trần Minh Tâm (Bí thư Đoàn Khoa CNTT)",
                note="Nộp đúng hạn quy định" if not is_late else "Gửi muộn sau hạn chót nộp",
                created_at=datetime.now() - timedelta(days=5)
            )
            db.add(h1)

            if status in ["QUALIFIED", "APPROVED", "REJECTED", "RETURNED", "PROVINCE_RETURNED"]:
                action_eval = "Đánh giá tiêu chuẩn & Lưu tạm"
                h_eval = AwardApprovalHistory(
                    application_id=app.id,
                    action=action_eval,
                    from_status="PENDING_PROVINCE",
                    to_status="PENDING_PROVINCE",
                    actor_id=user_objs["thanhpho"].id,
                    actor_name="Nguyễn Văn Thành (Ban Thường vụ Đoàn Trường)",
                    note="Đã thẩm định toàn bộ các tiêu chuẩn minh chứng",
                    created_at=datetime.now() - timedelta(days=3)
                )
                db.add(h_eval)

            if status == "PROVINCE_RETURNED":
                h2 = AwardApprovalHistory(
                    application_id=app.id,
                    action="Đoàn Trường yêu cầu bổ sung hồ sơ",
                    from_status="PENDING_PROVINCE",
                    to_status="PROVINCE_RETURNED",
                    actor_id=user_objs["thanhpho"].id,
                    actor_name="Nguyễn Văn Thành (Ban Thường vụ Đoàn Trường)",
                    note="Thiếu minh chứng ngoại ngữ, yêu cầu bổ sung bảng điểm TOEIC/IELTS hợp lệ",
                    created_at=datetime.now() - timedelta(days=2)
                )
                db.add(h2)

            if status == "RETURNED":
                h2 = AwardApprovalHistory(
                    application_id=app.id,
                    action="Chủ tịch hội đồng trả lại hồ sơ",
                    from_status="QUALIFIED",
                    to_status="RETURNED",
                    actor_id=user_objs["chutich"].id,
                    actor_name="Lê Hoàng Phúc (Hội đồng Khen thưởng Cấp Trường)",
                    note="Cần xác minh cụ thể số ngày tham gia hoạt động tình nguyện hè",
                    created_at=datetime.now() - timedelta(days=1)
                )
                db.add(h2)

            if status == "QUALIFIED":
                h2 = AwardApprovalHistory(
                    application_id=app.id,
                    action="Xác nhận hồ sơ Đủ tiêu chuẩn",
                    from_status="PENDING_PROVINCE",
                    to_status="QUALIFIED",
                    actor_id=user_objs["thanhpho"].id,
                    actor_name="Nguyễn Văn Thành (Ban Thường vụ Đoàn Trường)",
                    note="Hồ sơ đạt đầy đủ 5/5 tiêu chí Sinh viên 5 Tốt",
                    created_at=datetime.now() - timedelta(days=2)
                )
                db.add(h2)

            if status == "APPROVED":
                h_qual = AwardApprovalHistory(
                    application_id=app.id,
                    action="Xác nhận hồ sơ Đủ tiêu chuẩn",
                    from_status="PENDING_PROVINCE",
                    to_status="QUALIFIED",
                    actor_id=user_objs["thanhpho"].id,
                    actor_name="Nguyễn Văn Thành (Ban Thường vụ Đoàn Trường)",
                    note="Hồ sơ xuất sắc đạt chuẩn",
                    created_at=datetime.now() - timedelta(days=3)
                )
                db.add(h_qual)

                h_appr = AwardApprovalHistory(
                    application_id=app.id,
                    action="Phê duyệt hồ sơ",
                    from_status="QUALIFIED",
                    to_status="APPROVED",
                    actor_id=user_objs["chutich"].id,
                    actor_name="Lê Hoàng Phúc (Hội đồng Khen thưởng Cấp Trường)",
                    note="Đạt danh hiệu Sinh viên 5 Tốt cấp Trường theo Quyết định số 128/QĐ-ĐTN",
                    created_at=datetime.now() - timedelta(days=1)
                )
                db.add(h_appr)

            if status == "REJECTED":
                h_rej = AwardApprovalHistory(
                    application_id=app.id,
                    action="Từ chối hồ sơ",
                    from_status="QUALIFIED",
                    to_status="REJECTED",
                    actor_id=user_objs["chutich"].id,
                    actor_name="Lê Hoàng Phúc (Hội đồng Khen thưởng Cấp Trường)",
                    note="Hồ sơ vi phạm quy chế thi trong học kỳ 1, không đạt tiêu chuẩn Đạo đức tốt",
                    created_at=datetime.now() - timedelta(days=1)
                )
                db.add(h_rej)

            db.commit()

        print(f"Đã tạo 12 hồ sơ mẫu cho toàn bộ các trạng thái xét duyệt thành công.")

        # 6. Seed Academic Terms, Budgets, Fund Requests, Transactions & Assets
        print("[-] Đang seed dữ liệu Tài chính & Hậu cần...")
        curr_term = db.query(AcademicTerm).filter(AcademicTerm.year_name == "2025-2026", AcademicTerm.semester_name == "Học kỳ 1").first()
        if not curr_term:
            curr_term = AcademicTerm(
                year_name="2025-2026",
                semester_name="Học kỳ 1",
                start_date=date(2025, 8, 15),
                end_date=date(2026, 1, 15),
                is_current=True
            )
            db.add(curr_term)
            db.commit()
            db.refresh(curr_term)

        # Budget for LHU
        budget = db.query(Budget).filter(Budget.organization_id == lhu_org.id, Budget.academic_term_id == curr_term.id).first()
        if not budget:
            budget = Budget(
                organization_id=lhu_org.id,
                academic_term_id=curr_term.id,
                total_amount=500000000,
                used_amount=180000000
            )
            db.add(budget)
            db.commit()
            db.refresh(budget)
        else:
            budget.total_amount = 500000000
            budget.used_amount = 180000000
            db.commit()

        # Fund Requests
        fund_reqs = [
            ("Kinh phí tổ chức Chiến dịch Mùa Hè Xanh 2026", 25000000, FundRequestStatus.PENDING, user_objs["truong"].id, None, None, '["https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800"]'),
            ("Mua sắm trang thiết bị âm thanh & loa di động phục vụ Giải bóng đá Sinh viên", 15000000, FundRequestStatus.PENDING, user_objs["truonglachong"].id, None, None, '["https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800"]'),
            ("In ấn tài liệu kỷ yếu và backdrop Hội thảo AI & Chuyển đổi số", 8500000, FundRequestStatus.APPROVED, user_objs["truong"].id, user_objs["admin"].id, datetime.now() - timedelta(days=2), '["https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800"]'),
            ("Khen thưởng sinh viên tiêu biểu và Cán bộ Đoàn xuất sắc Học kỳ 1", 12000000, FundRequestStatus.APPROVED, user_objs["truonglachong"].id, user_objs["admin"].id, datetime.now() - timedelta(days=5), '["https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800"]')
        ]
        for reason, amt, status, req_by, appr_by, appr_at, ev_url in fund_reqs:
            existing_fr = db.query(FundRequest).filter(FundRequest.budget_id == budget.id, FundRequest.reason == reason).first()
            if not existing_fr:
                fr = FundRequest(
                    budget_id=budget.id,
                    requested_by=req_by,
                    amount=amt,
                    reason=reason,
                    status=status,
                    approved_by=appr_by,
                    approved_at=appr_at,
                    evidence_urls=ev_url
                )
                db.add(fr)

        # Transactions
        txs = [
            (TransactionType.INCOME, "Cấp bổ sung ngân sách hoạt động phong trào Đợt 1", "Phân bổ kinh phí từ quỹ Đại học Lạc Hồng", 500000000, "Phòng Kế hoạch Tài chính"),
            (TransactionType.EXPENSE, "Chi khen thưởng SV5T và Cán bộ Đoàn xuất sắc", "Giải ngân theo quyết định khen thưởng", 12000000, "Thủ quỹ Đoàn trường"),
            (TransactionType.EXPENSE, "Tạm ứng in ấn tài liệu Hội thảo Chuyển đổi số", "Thanh toán tạm ứng hợp đồng in ấn", 8500000, "Văn phòng Đoàn LHU")
        ]
        for t_type, t_title, t_desc, t_amt, t_perf in txs:
            ex_tx = db.query(FinanceTransaction).filter(FinanceTransaction.budget_id == budget.id, FinanceTransaction.title == t_title).first()
            if not ex_tx:
                tx = FinanceTransaction(
                    budget_id=budget.id,
                    type=t_type,
                    title=t_title,
                    description=t_desc,
                    amount=t_amt,
                    performed_by_name=t_perf,
                    status=TransactionStatus.COMPLETED
                )
                db.add(tx)

        # Assets
        assets_data = [
            ("Hệ thống Loa di động Bluetooth Công suất lớn", "Phục vụ sự kiện ngoài trời và hoạt động tình nguyện", 4, "Bộ", "Kho Văn phòng Đoàn - Hội (Khu A)", AssetStatus.AVAILABLE),
            ("Bộ đàm Motorola liên lạc sự kiện sân bãi", "Thiết bị điều phối an ninh và hậu cần sự kiện", 12, "Chiếc", "Kho Thiết bị Đoàn trường", AssetStatus.AVAILABLE),
            ("Khung Backdrop di động nhôm định hình 3x4m", "Khung nhôm di động tháo lắp nhanh phục vụ backdrop sự kiện", 2, "Bộ", "Kho Hội trường D", AssetStatus.IN_USE)
        ]
        for a_name, a_desc, a_qty, a_unit, a_loc, a_stat in assets_data:
            ex_asset = db.query(Asset).filter(Asset.organization_id == lhu_org.id, Asset.name == a_name).first()
            if not ex_asset:
                asset_obj = Asset(
                    organization_id=lhu_org.id,
                    name=a_name,
                    description=a_desc,
                    quantity=a_qty,
                    unit=a_unit,
                    storage_location=a_loc,
                    status=a_stat
                )
                db.add(asset_obj)

        db.commit()
        print("Đã seed Ngân sách, Đề xuất chi, Giao dịch và Kho vật tư thành công.")

        # 7. Seed Campaigns & Events
        print("[-] Đang seed Chiến dịch & Sự kiện...")
        campaigns_data = [
            ("Chiến dịch Mùa Hè Xanh 2026", "Chiến dịch tình nguyện hè trọng điểm toàn tỉnh tại các huyện vùng sâu vùng xa", date(2026, 6, 15), date(2026, 7, 30), CampaignStatus.ONGOING, 60000000),
            ("Tiếp Sức Mùa Thi 2026", "Chương trình hỗ trợ sĩ tử và phụ huynh tại các điểm thi tốt nghiệp THPT", date(2026, 5, 20), date(2026, 6, 28), CampaignStatus.PLANNING, 35000000),
            ("Chủ Nhật Xanh Toàn Trường", "Phong trào giữ gìn khuôn viên xanh - sạch - đẹp và phân loại rác thải", date(2026, 2, 1), date(2026, 4, 30), CampaignStatus.ONGOING, 15000000),
            ("Hội thảo AI & Chuyển đổi số Đoàn Hội", "Hội thảo chuyên đề ứng dụng AI và công nghệ dữ liệu trong công tác Đoàn", date(2026, 3, 1), date(2026, 3, 25), CampaignStatus.ONGOING, 20000000),
        ]
        camp_objs = {}
        for c_name, c_desc, c_s, c_e, c_stat, c_bgt in campaigns_data:
            ex_c = db.query(Campaign).filter(Campaign.name == c_name).first()
            if not ex_c:
                c = Campaign(
                    organization_id=lhu_org.id,
                    academic_term_id=curr_term.id,
                    name=c_name,
                    description=c_desc,
                    start_date=c_s,
                    end_date=c_e,
                    status=c_stat,
                    total_budget_allocated=c_bgt
                )
                db.add(c)
                db.commit()
                db.refresh(c)
                camp_objs[c_name] = c
            else:
                camp_objs[c_name] = ex_c

        # Events
        events_data = [
            ("Lễ Ra Quân Ngày Chủ Nhật Xanh", "Khuôn viên Cơ sở 1 - LHU", datetime.now() - timedelta(hours=2), datetime.now() + timedelta(hours=3), 300, EventStatus.LIVE, "Lễ ra quân tổng vệ sinh và tuyên truyền bảo vệ môi trường", 15, camp_objs.get("Chủ Nhật Xanh Toàn Trường")),
            ("Tọa đàm AI và Cơ hội Việc làm Ngành Công nghệ", "Hội trường D - LHU", datetime.now() + timedelta(days=3), datetime.now() + timedelta(days=3, hours=3), 250, EventStatus.PUBLISHED, "Diễn giả doanh nghiệp chia sẻ xu hướng tuyển dụng IT", 10, camp_objs.get("Hội thảo AI & Chuyển đổi số Đoàn Hội")),
            ("Giải Bóng đá Sinh viên LHU Cup 2026", "Sân vận động Thể thao Biên Hòa", datetime.now() + timedelta(days=7), datetime.now() + timedelta(days=14), 500, EventStatus.PUBLISHED, "Giải đấu thường niên gắn kết đoàn viên các khoa", 20, camp_objs.get("Tiếp Sức Mùa Thi 2026")),
        ]
        for e_name, e_loc, e_start, e_end, e_cap, e_stat, e_desc, e_pts, c_obj in events_data:
            ex_e = db.query(Event).filter(Event.name == e_name).first()
            if not ex_e:
                evt = Event(
                    campaign_id=c_obj.id if c_obj else None,
                    name=e_name,
                    location=e_loc,
                    start_time=e_start,
                    end_time=e_end,
                    capacity=e_cap,
                    status=e_stat,
                    description=e_desc,
                    points_awarded=e_pts,
                    org_id=lhu_org.id
                )
                db.add(evt)
                db.commit()
                db.refresh(evt)

                # Add an incident
                if "Tọa đàm" in e_name:
                    ex_inc = db.query(EventIncident).filter(EventIncident.event_id == evt.id).first()
                    if not ex_inc:
                        inc = EventIncident(
                            event_id=evt.id,
                            reported_by=user_objs["sinhvien"].id,
                            description="Hệ thống âm thanh tại Hội trường D chập chờn trong buổi tổng duyệt Tọa đàm",
                            severity="Medium",
                            status="PENDING"
                        )
                        db.add(inc)
                        db.commit()

        print("Đã seed Chiến dịch, Sự kiện và Báo cáo sự cố thành công.")

        # 8. Seed AI Sentiments & AIAudits
        print("[-] Đang seed dữ liệu AI Phân tích cảm xúc & Kiểm duyệt...")
        sentiments_samples = [
            ("Cổng thông tin Sinh viên 5 Tốt trực tuyến năm nay rất tiện lợi, tải minh chứng cực nhanh!", 0.92, SentimentLabel.POSITIVE, ["#SinhVien5Tot", "#FlameGuard", "#HocBongLHU"]),
            ("Rất tự hào khi được đại diện Chi đoàn tham gia Chiến dịch Mùa Hè Xanh năm nay.", 0.88, SentimentLabel.POSITIVE, ["#MuaHeXanh", "#DoanHoiBienHoa"]),
            ("Hoạt động workshop chuyển đổi số của CLB IT rất bổ ích, học hỏi thêm nhiều kiến thức GenAI.", 0.85, SentimentLabel.POSITIVE, ["#CLB_IT", "#ChuyenDoiSo"]),
            ("Thủ tục nộp hồ sơ trực tuyến giúp tiết kiệm rất nhiều giấy tờ in ấn, giao diện dễ dùng.", 0.90, SentimentLabel.POSITIVE, ["#SinhVien5Tot", "#CongNgheSo"]),
            ("Phong trào Ngày Chủ Nhật Xanh tạo không khí rất sôi nổi và gắn kết sinh viên.", 0.82, SentimentLabel.POSITIVE, ["#ChuNhatXanh", "#BaoVeMoiTruong"]),
            ("Chúc mừng các bạn sinh viên xuất sắc đã đạt chuẩn Sinh viên 5 Tốt cấp Tỉnh năm nay!", 0.95, SentimentLabel.POSITIVE, ["#SinhVien5Tot", "#TuHaoLHU"]),
            ("Chờ đợi thông báo chính thức về danh sách khen thưởng đợt 2 của Đoàn trường.", 0.78, SentimentLabel.POSITIVE, ["#KhenThuong", "#SV5T"]),
            ("Giải bóng đá năm nay ban tổ chức chuẩn bị sân bãi rất chuyên nghiệp và chu đáo.", 0.84, SentimentLabel.POSITIVE, ["#LHUCup2026", "#TheThaoSV"]),
            ("Hoạt động hiến máu tình nguyện đợt 1 diễn ra trật tự, y bác sĩ nhiệt tình hướng dẫn.", 0.89, SentimentLabel.POSITIVE, ["#HienMauTinhNguyen", "#LHU"]),
            ("Các bạn cán bộ hướng dẫn nộp hồ sơ rất nhiệt tình và giải đáp thắc mắc chi tiết.", 0.86, SentimentLabel.POSITIVE, ["#CanBoDoan", "#HoTroSV"]),
            ("Mong Ban Thường vụ tiếp tục tổ chức thêm nhiều hoạt động kỹ năng mềm cho sinh viên.", 0.76, SentimentLabel.POSITIVE, ["#KyNangMem", "#SVLHU"]),
            ("Cho mình hỏi thời gian nhận giấy chứng nhận SV5T bản cứng là vào ngày nào vậy?", 0.52, SentimentLabel.NEUTRAL, ["#SinhVien5Tot", "#ThacMac"]),
            ("Quy trình xin cấp giấy xác nhận Đoàn viên cần liên hệ qua văn phòng hay làm online?", 0.48, SentimentLabel.NEUTRAL, ["#XacNhanDoanVien", "#ThuTuc"]),
            ("Cần công bố sớm hơn lịch thi đấu vòng bán kết bóng đá để các lớp sắp xếp cổ vũ.", 0.50, SentimentLabel.NEUTRAL, ["#LHUCup2026", "#LichThiDau"]),
            ("Máy lạnh tại Hội trường D hoạt động khá yếu khi tập trung đông người, mong ban quản lý xem xét.", 0.22, SentimentLabel.NEGATIVE, ["#HoiTruongD", "#PhanAnh"])
        ]
        for txt, score, lbl, kw in sentiments_samples:
            ex_s = db.query(AISentiment).filter(AISentiment.content_excerpt == txt).first()
            if not ex_s:
                s_obj = AISentiment(
                    source_type="Portal",
                    source_id="FEEDBACK_SYS",
                    content_excerpt=txt,
                    sentiment_score=score,
                    sentiment_label=lbl,
                    detected_keywords=kw,
                    analyzed_at=datetime.now() - timedelta(hours=len(txt) % 48)
                )
                db.add(s_obj)

        audits_samples = [
            ("Comment", "Cổng thông tin SV5T trực tuyến rất trực quan, tải minh chứng cực nhanh!", AuditAction.AUTO_PUBLISHED, "Nội dung phản hồi mang tính tích cực, lành mạnh"),
            ("Post", "Tuyển thành viên CLB Tin học - Cơ hội thực chiến dự án thực tế", AuditAction.AUTO_PUBLISHED, "Thông tin câu lạc bộ học thuật chính đáng"),
            ("Comment", "Mua đồ án công nghệ thông tin giá rẻ liên hệ zalo 09xx...", AuditAction.AUTO_HIDDEN, "Phát hiện nội dung gian lận học thuật & spam thương mại"),
            ("Comment", "Đề nghị bổ sung thêm quạt thông gió tại sảnh nhà B", AuditAction.AUTO_PUBLISHED, "Góp ý cải thiện cơ sở vật chất xây dựng"),
            ("Post", "Phản ánh thái độ gửi xe khu vực cổng phụ trường", AuditAction.FLAGGED_FOR_REVIEW, "Cần cán bộ kiểm tra và xác minh thông tin phản ánh"),
        ]
        for c_type, c_txt, act, reas in audits_samples:
            ex_aud = db.query(AIAudit).filter(AIAudit.content_text == c_txt).first()
            if not ex_aud:
                aud = AIAudit(
                    content_type=c_type,
                    content_text=c_txt,
                    action_taken=act,
                    reason=reas,
                    processed_at=datetime.now() - timedelta(hours=12)
                )
                db.add(aud)

        db.commit()
        print("Đã seed AI Sentiment (15 mẫu) và AI Audit (5 mẫu) thành công.")

        # 9. Seed Digital Documents
        print("[-] Đang seed Văn bản số & Hồ sơ hành chính...")
        docs_samples = [
            (user_objs["sinhvien"].id, "VB-2026/012", "Giấy xác nhận Đoàn viên", "Đơn xin cấp Giấy xác nhận Đoàn viên ưu tú năm 2026", DocumentStatus.PENDING, "Nộp hồ sơ xét học bổng Doanh nghiệp tài trợ", datetime.now() - timedelta(days=1), None),
            (user_objs["truong"].id, "TTr-ĐH-2026/05", "Tờ trình", "Tờ trình xin phê duyệt Kế hoạch Ngày hội Sáng tạo Trẻ LHU 2026", DocumentStatus.PENDING, "Phê duyệt chủ trương và địa điểm tổ chức", datetime.now() - timedelta(days=2), None),
            (user_objs["truonglachong"].id, "CV-HSV-2026/08", "Công văn", "Công văn phối hợp tổ chức Ngày hội Hiến máu Tình nguyện Đợt 1", DocumentStatus.APPROVED, "Gửi Hội Chữ Thập Đỏ Tỉnh Đồng Nai", datetime.now() - timedelta(days=5), datetime.now() - timedelta(days=3)),
            (user_objs["truong"].id, "QĐ-ĐTN-2026/22", "Quyết định", "Quyết định công nhận Ban Chấp hành Chi đoàn 21CT111 nhiệm kỳ mới", DocumentStatus.APPROVED, "Ban hành quyết định nhân sự đoàn cơ sở", datetime.now() - timedelta(days=10), datetime.now() - timedelta(days=8)),
        ]
        for u_id, code, d_type, title, status, purp, req_d, proc_d in docs_samples:
            ex_d = db.query(DigitalDocument).filter(DigitalDocument.document_code == code).first()
            if not ex_d:
                doc = DigitalDocument(
                    user_id=u_id,
                    document_code=code,
                    document_type=d_type,
                    title=title,
                    status=status,
                    purpose=purp,
                    request_date=req_d,
                    processed_date=proc_d,
                    is_public=True
                )
                db.add(doc)

        db.commit()
        print("Đã seed 4 Văn bản số thành công.")

        # 10. Seed AcademicTerm, Faculty Budget, Finance Transactions, StudentFees & FundRequest
        print("[-] Đang seed Dữ liệu Tài chính Khoa & Đoàn phí...")
        term = db.query(AcademicTerm).filter(
            AcademicTerm.year_name == "2025-2026",
            AcademicTerm.semester_name == "Học kỳ 1"
        ).first()
        if not term:
            term = AcademicTerm(
                year_name="2025-2026",
                semester_name="Học kỳ 1",
                start_date=date(2025, 9, 1),
                end_date=date(2026, 1, 31),
                is_current=True
            )
            db.add(term)
            db.commit()
            db.refresh(term)

        # Ngân sách Khoa CNTT
        faculty_budget = db.query(Budget).filter(Budget.organization_id == faculty_cntt.id).first()
        if not faculty_budget:
            faculty_budget = Budget(
                organization_id=faculty_cntt.id,
                academic_term_id=term.id,
                total_amount=25000000,
                used_amount=6500000
            )
            db.add(faculty_budget)
            db.commit()
            db.refresh(faculty_budget)

        # Giao dịch nội bộ Khoa
        txns_data = [
            (faculty_budget.id, TransactionType.INCOME, "Thu đoàn phí Chi đoàn 21CT111", 2500000, "Thu đoàn phí đợt 1 năm học 2025-2026", "Ban Tài chính Khoa", TransactionStatus.COMPLETED),
            (faculty_budget.id, TransactionType.INCOME, "Thu đoàn phí Chi đoàn 21CT112", 2000000, "Thu đoàn phí đợt 1 năm học 2025-2026", "Ban Tài chính Khoa", TransactionStatus.COMPLETED),
            (faculty_budget.id, TransactionType.EXPENSE, "Chi mua nước giải lao và tài liệu Hội thảo", 1200000, "Phục vụ Hội thảo AI & Big Data", "Bí thư Khoa", TransactionStatus.COMPLETED),
            (faculty_budget.id, TransactionType.EXPENSE, "Chi in ấn khen thưởng đợt 1", 800000, "In giấy khen và chứng nhận sinh viên xuất sắc", "Ủy viên BCH", TransactionStatus.COMPLETED),
        ]
        for b_id, t_type, title, amt, desc, perf, stat in txns_data:
            ex_txn = db.query(FinanceTransaction).filter(FinanceTransaction.title == title).first()
            if not ex_txn:
                txn = FinanceTransaction(
                    budget_id=b_id,
                    type=t_type,
                    title=title,
                    amount=amt,
                    description=desc,
                    performed_by_name=perf,
                    status=stat
                )
                db.add(txn)

        # Đoàn phí (StudentFee)
        fees_data = [
            (user_objs["sinhvien"].id, "Đoàn phí HK1 (2025-2026)", 50000, "PAID", datetime.now(timezone.utc) - timedelta(days=5)),
            (user_objs["sinhvien2"].id, "Đoàn phí HK1 (2025-2026)", 50000, "PAID", datetime.now(timezone.utc) - timedelta(days=3)),
            (user_objs["sinhvien3"].id, "Đoàn phí HK1 (2025-2026)", 50000, "PENDING", None),
        ]
        for u_id, title, amt, stat, p_at in fees_data:
            ex_fee = db.query(StudentFee).filter(StudentFee.user_id == u_id, StudentFee.academic_term_id == term.id).first()
            if not ex_fee:
                s_fee = StudentFee(
                    user_id=u_id,
                    academic_term_id=term.id,
                    title=title,
                    amount=amt,
                    status=stat,
                    paid_at=p_at
                )
                db.add(s_fee)

        # Đề xuất xin cấp kinh phí lên Trường (FundRequest PENDING)
        pending_req = db.query(FundRequest).filter(FundRequest.reason == "Kinh phí tổ chức Hội thao Khoa CNTT 2026").first()
        if not pending_req:
            pending_req = FundRequest(
                budget_id=faculty_budget.id,
                requested_by=user_objs["truonglachong"].id,
                amount=5000000,
                reason="Kinh phí tổ chức Hội thao Khoa CNTT 2026",
                status=FundRequestStatus.PENDING
            )
            db.add(pending_req)

        db.commit()
        print("Đã seed Ngân sách Khoa, Giao dịch, Đoàn phí và Đề xuất cấp kinh phí thành công.")

    except Exception as e:
        db.rollback()
        print(f"Lỗi khi seed dữ liệu: {e}")
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    seed_data()

