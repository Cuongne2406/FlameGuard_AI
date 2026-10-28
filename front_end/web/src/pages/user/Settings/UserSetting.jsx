import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Award,
  Bell,
  Building2,
  Calendar,
  Camera,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  FileText,
  GraduationCap,
  Languages,
  Loader2,
  Lock,
  Mail,
  MapPin,
  Phone,
  RotateCcw,
  Save,
  ShieldCheck,
  Sparkles,
  User,
  Users,
  X,
} from "lucide-react";
import { AuthContext } from "../../../context/AuthContext";
import { userService } from "../../../services/userService";
import { Toggle } from "../../../components/admin/ui/Toggle";

const UserSetting = () => {
  const { user, checkUserLogged } = useContext(AuthContext);
  const [twoFactor, setTwoFactor] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState({ type: "", text: "" });
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ current_password: "", new_password: "", confirm_password: "" });
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState({ type: "", text: "" });
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const fileInputRef = useRef(null);

  // Form State - 3 Groups for SV5T profile
  const [formData, setFormData] = useState({
    // Nhóm 1: Thông tin cá nhân
    full_name: "",
    cccd: "",
    date_of_birth: "",
    gender: "Nam",
    ethnicity: "Kinh",
    religion: "Không",
    address: "",

    // Nhóm 2: Thông tin học tập
    student_id: "",
    academic_year_num: 3,
    school_name: "Trường Đại học Lạc Hồng",
    faculty_name: "",
    class_name: "",
    education_level: "Đại học",
    gpa: 0.0,
    training_score: 0,

    // Nhóm 3: Đoàn - Hội, Liên hệ & Thành tích
    union_position: "Đoàn viên",
    political_status: "Đoàn viên",
    phone_number: "",
    email: "",
    achievement_summary: "",
  });

  const populateFormData = (userData) => {
    if (!userData) return;
    setFormData({
      full_name: userData.full_name || "",
      cccd: userData.cccd || "",
      date_of_birth: userData.date_of_birth ? String(userData.date_of_birth).split("T")[0] : "",
      gender: userData.gender || "Nam",
      ethnicity: userData.ethnicity || "Kinh",
      religion: userData.religion || "Không",
      address: userData.address || "",

      student_id: userData.student_id || "",
      academic_year_num: userData.academic_year_num ?? 3,
      school_name: userData.school_name || "Trường Đại học Lạc Hồng",
      faculty_name: userData.faculty_name || "",
      class_name: userData.class_name || "",
      education_level: userData.education_level || "Đại học",
      gpa: userData.gpa ?? 0.0,
      training_score: userData.training_score ?? 0,

      union_position: userData.union_position || "Đoàn viên",
      political_status: userData.political_status || "Đoàn viên",
      phone_number: userData.phone_number || "",
      email: userData.email || "",
      achievement_summary: userData.achievement_summary || "",
    });
    setTwoFactor(userData.is_2fa_enabled || false);
  };

  useEffect(() => {
    if (user) {
      populateFormData(user);
    }
    // Lấy thông tin mới nhất từ máy chủ để nạp đầy đủ các cột mới trong DB
    const loadFreshUser = async () => {
      try {
        const fresh = await userService.getMe();
        if (fresh) {
          populateFormData(fresh);
        }
      } catch (err) {
        console.error("Lỗi khi tải thông tin người dùng mới nhất:", err);
      }
    };
    loadFreshUser();
  }, [user]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setSaveMessage({ type: "error", text: "Kích thước ảnh không vượt quá 5MB" });
      return;
    }

    setIsUploadingAvatar(true);
    setSaveMessage({ type: "", text: "" });

    try {
      await userService.uploadAvatar(file);
      await checkUserLogged();
      setSaveMessage({ type: "success", text: "Cập nhật ảnh đại diện thành công!" });
    } catch (error) {
      setSaveMessage({ type: "error", text: error.message || "Lỗi khi tải ảnh lên" });
    } finally {
      setIsUploadingAvatar(false);
      setTimeout(() => setSaveMessage({ type: "", text: "" }), 3000);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleReset = async () => {
    setIsSaving(true);
    setSaveMessage({ type: "", text: "" });
    try {
      const fresh = await userService.getMe();
      if (fresh) {
        populateFormData(fresh);
      } else if (user) {
        populateFormData(user);
      }
      setSaveMessage({ type: "success", text: "Đã khôi phục dữ liệu đã lưu gần nhất!" });
    } catch {
      if (user) populateFormData(user);
      setSaveMessage({ type: "success", text: "Đã khôi phục thông tin!" });
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveMessage({ type: "", text: "" }), 3000);
    }
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    setSaveMessage({ type: "", text: "" });

    try {
      const payload = {
        ...formData,
        academic_year_num: parseInt(formData.academic_year_num, 10) || 1,
        gpa: parseFloat(formData.gpa) || 0.0,
        training_score: parseInt(formData.training_score, 10) || 0,
        date_of_birth: formData.date_of_birth || null,
        is_2fa_enabled: twoFactor,
      };

      await userService.updateMe(payload);
      await checkUserLogged();
      setSaveMessage({ type: "success", text: "Cập nhật hồ sơ thành công!" });
    } catch (error) {
      setSaveMessage({
        type: "error",
        text: error.message || "Có lỗi xảy ra khi lưu thông tin",
      });
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveMessage({ type: "", text: "" }), 3500);
    }
  };

  return (
    <div className="space-y-6">
      <section className="app-card overflow-hidden">
        {/* Hero Header */}
        <div className="app-hero relative px-5 pb-8 pt-6 md:px-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.22),transparent_28%)]" />
          <div className="relative flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="inline-flex rounded-full bg-white/18 px-3 py-1 text-[11px] font-black text-white">
                CÀI ĐẶT TÀI KHOẢN & HỒ SƠ
              </div>
              <h2 className="mt-4 text-3xl font-black tracking-tight text-white md:text-4xl">
                Hồ sơ cá nhân & Học tập
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/85">
                Quản lý toàn bộ thông tin cá nhân, học tập và thành tích thi đua — Dữ liệu này được tự động điền khi bạn lập hồ sơ Sinh viên 5 Tốt (SV5T).
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {saveMessage.text && (
                <span
                  className={`rounded-full px-4 py-2 text-sm font-bold shadow-sm ${
                    saveMessage.type === "success"
                      ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                      : "bg-rose-100 text-rose-800 border border-rose-200"
                  }`}
                >
                  {saveMessage.text}
                </span>
              )}
              <button
                type="button"
                onClick={handleReset}
                disabled={isSaving}
                className="rounded-full bg-white/16 px-5 py-3 text-sm font-black text-white hover:bg-white/25 transition-all"
              >
                <span className="inline-flex items-center gap-2">
                  <RotateCcw size={16} />
                  Khôi phục
                </span>
              </button>
              <button
                type="button"
                onClick={handleSaveProfile}
                disabled={isSaving}
                className="rounded-full bg-white px-5 py-3 text-sm font-black text-indigo-600 hover:bg-white/95 shadow-md transition-all active:scale-95"
              >
                <span className="inline-flex items-center gap-2">
                  {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid gap-6 p-5 lg:grid-cols-[300px_1fr] md:p-6">
          {/* Left Card: Summary & Avatar */}
          <div className="space-y-6">
            <div className="app-card p-6 text-center border border-slate-200/80 shadow-sm">
              <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
              <div className="relative mx-auto h-32 w-32">
                <img
                  src={
                    user?.avatar_url ||
                    `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.student_id || formData.student_id || "Felix"}`
                  }
                  alt="Avatar"
                  className="h-full w-full rounded-full border-4 border-white object-cover shadow-md"
                />
                <button
                  type="button"
                  onClick={handleAvatarClick}
                  disabled={isUploadingAvatar}
                  className="absolute bottom-1 right-1 flex h-10 w-10 items-center justify-center rounded-full border-4 border-white bg-indigo-600 text-white hover:bg-indigo-700 shadow-md transition-transform hover:scale-105"
                  title="Thay đổi ảnh đại diện"
                >
                  {isUploadingAvatar ? <Loader2 size={16} className="animate-spin" /> : <Camera size={16} />}
                </button>
              </div>

              <h3 className="mt-5 text-xl font-black text-slate-800">
                {formData.full_name || user?.full_name || "Chưa cập nhật"}
              </h3>
              <p className="mt-1 font-mono text-xs font-bold uppercase tracking-[0.15em] text-indigo-600 bg-indigo-50/70 inline-block px-3 py-1 rounded-full">
                MSSV: {formData.student_id || user?.student_id || "---"}
              </p>

              <div className="mt-4 flex flex-col gap-2 text-left">
                <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-3.5 py-2.5 text-xs font-semibold text-slate-700 border border-slate-100">
                  <GraduationCap size={16} className="text-indigo-600 shrink-0" />
                  <span className="truncate">{formData.faculty_name || "Khoa Công nghệ Thông tin"}</span>
                </div>
                <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-3.5 py-2.5 text-xs font-semibold text-slate-700 border border-slate-100">
                  <Users size={16} className="text-emerald-600 shrink-0" />
                  <span className="truncate">Lớp: {formData.class_name || "Chưa phân lớp"}</span>
                </div>
              </div>

              {/* Quick stats: GPA & Điểm Rèn Luyện */}
              <div className="mt-5 grid grid-cols-2 gap-3 border-t border-slate-100 pt-5">
                <div className="rounded-2xl bg-amber-50/70 p-3 text-center border border-amber-100">
                  <p className="text-[10px] font-black uppercase tracking-wider text-amber-700">Điểm GPA</p>
                  <p className="mt-1 text-xl font-black text-amber-900">{formData.gpa ?? "0.0"}</p>
                </div>
                <div className="rounded-2xl bg-emerald-50/70 p-3 text-center border border-emerald-100">
                  <p className="text-[10px] font-black uppercase tracking-wider text-emerald-700">Điểm RL</p>
                  <p className="mt-1 text-xl font-black text-emerald-900">{formData.training_score ?? 0}</p>
                </div>
              </div>

              {/* Role badge */}
              <div className="mt-4 text-xs font-medium text-slate-500">
                Chức vụ: <span className="font-bold text-slate-700">{formData.union_position || "Đoàn viên"}</span>
              </div>
            </div>

            {/* Auto-fill Notice Info Box */}
            <div className="rounded-2xl bg-gradient-to-br from-indigo-50/80 to-blue-50/80 p-5 border border-indigo-100/80 text-xs text-slate-600 space-y-2">
              <div className="flex items-center gap-2 text-indigo-700 font-bold">
                <Sparkles size={16} />
                <span>Tự động điền SV5T</span>
              </div>
              <p className="leading-5">
                Hệ thống sẽ dùng thông tin trong hồ sơ này để điền tự động khi bạn tạo hồ sơ xét chọn <strong>Sinh viên 5 Tốt</strong>. Bạn không cần phải nhập lại nhiều lần!
              </p>
            </div>
          </div>

          {/* Right Column: 3 Group Profile Form + Security */}
          <div className="space-y-6">
            {/* MAIN CARD: Hồ sơ cá nhân & Học tập */}
            <div className="app-card p-6 border border-slate-200/80 shadow-sm space-y-7">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                    <FileText size={20} className="text-indigo-600" />
                    Hồ sơ cá nhân & Học tập
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Dùng để tự động điền Hồ sơ Sinh viên 5 Tốt và các danh hiệu thi đua
                  </p>
                </div>
                <span className="inline-flex items-center gap-1.5 self-start rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-700 border border-emerald-200">
                  <Sparkles size={13} />
                  Tự động đồng bộ
                </span>
              </div>

              {/* NHÓM 1: THÔNG TIN CÁ NHÂN */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-indigo-700 bg-indigo-50/60 px-3 py-2 rounded-xl border border-indigo-100">
                  <User size={15} />
                  <span>Nhóm 1 — Thông tin cá nhân</span>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="ml-1 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Họ và tên <span className="text-rose-500">*</span>
                    </label>
                    <div className="mt-1.5 flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 focus-within:border-indigo-500 focus-within:bg-white transition-all">
                      <User size={16} className="text-slate-400 shrink-0" />
                      <input
                        type="text"
                        value={formData.full_name}
                        onChange={(e) => handleChange("full_name", e.target.value)}
                        placeholder="Nguyễn Văn A"
                        className="w-full bg-transparent text-sm font-semibold text-slate-800 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="ml-1 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Số CCCD / CMND <span className="text-rose-500">*</span>
                    </label>
                    <div className="mt-1.5 flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 focus-within:border-indigo-500 focus-within:bg-white transition-all">
                      <CreditCard size={16} className="text-slate-400 shrink-0" />
                      <input
                        type="text"
                        value={formData.cccd}
                        onChange={(e) => handleChange("cccd", e.target.value)}
                        placeholder="075204001234"
                        className="w-full bg-transparent font-mono text-sm font-semibold text-slate-800 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="ml-1 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Ngày sinh
                    </label>
                    <div className="mt-1.5 flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 focus-within:border-indigo-500 focus-within:bg-white transition-all">
                      <Calendar size={16} className="text-slate-400 shrink-0" />
                      <input
                        type="date"
                        value={formData.date_of_birth}
                        onChange={(e) => handleChange("date_of_birth", e.target.value)}
                        className="w-full bg-transparent text-sm font-semibold text-slate-800 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="ml-1 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Giới tính
                    </label>
                    <select
                      value={formData.gender}
                      onChange={(e) => handleChange("gender", e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-semibold text-slate-800 outline-none focus:border-indigo-500 focus:bg-white transition-all"
                    >
                      <option value="Nam">Nam</option>
                      <option value="Nữ">Nữ</option>
                      <option value="Khác">Khác</option>
                    </select>
                  </div>

                  <div>
                    <label className="ml-1 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Dân tộc
                    </label>
                    <input
                      type="text"
                      value={formData.ethnicity}
                      onChange={(e) => handleChange("ethnicity", e.target.value)}
                      placeholder="Kinh"
                      className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-semibold text-slate-800 outline-none focus:border-indigo-500 focus:bg-white transition-all"
                    />
                  </div>

                  <div>
                    <label className="ml-1 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Tôn giáo
                    </label>
                    <input
                      type="text"
                      value={formData.religion}
                      onChange={(e) => handleChange("religion", e.target.value)}
                      placeholder="Không"
                      className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-semibold text-slate-800 outline-none focus:border-indigo-500 focus:bg-white transition-all"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="ml-1 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Địa chỉ thường trú
                    </label>
                    <div className="mt-1.5 flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 focus-within:border-indigo-500 focus-within:bg-white transition-all">
                      <MapPin size={16} className="text-slate-400 shrink-0" />
                      <input
                        type="text"
                        value={formData.address}
                        onChange={(e) => handleChange("address", e.target.value)}
                        placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố..."
                        className="w-full bg-transparent text-sm font-semibold text-slate-800 outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* NHÓM 2: THÔNG TIN HỌC TẬP */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-emerald-700 bg-emerald-50/60 px-3 py-2 rounded-xl border border-emerald-100">
                  <GraduationCap size={16} />
                  <span>Nhóm 2 — Thông tin học tập</span>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="ml-1 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Mã số sinh viên (MSSV) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.student_id}
                      onChange={(e) => handleChange("student_id", e.target.value)}
                      placeholder="121000123"
                      className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 font-mono text-sm font-bold text-slate-800 outline-none focus:border-indigo-500 focus:bg-white transition-all"
                    />
                  </div>

                  <div>
                    <label className="ml-1 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Sinh viên năm thứ
                    </label>
                    <select
                      value={formData.academic_year_num}
                      onChange={(e) => handleChange("academic_year_num", parseInt(e.target.value, 10))}
                      className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-semibold text-slate-800 outline-none focus:border-indigo-500 focus:bg-white transition-all"
                    >
                      <option value={1}>Năm 1</option>
                      <option value={2}>Năm 2</option>
                      <option value={3}>Năm 3</option>
                      <option value={4}>Năm 4</option>
                      <option value={5}>Năm 5</option>
                    </select>
                  </div>

                  <div>
                    <label className="ml-1 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Trường trực thuộc
                    </label>
                    <div className="mt-1.5 flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 focus-within:border-indigo-500 focus-within:bg-white transition-all">
                      <Building2 size={16} className="text-slate-400 shrink-0" />
                      <input
                        type="text"
                        value={formData.school_name}
                        onChange={(e) => handleChange("school_name", e.target.value)}
                        placeholder="Trường Đại học Lạc Hồng"
                        className="w-full bg-transparent text-sm font-semibold text-slate-800 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="ml-1 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Khoa / Bộ môn
                    </label>
                    <input
                      type="text"
                      value={formData.faculty_name}
                      onChange={(e) => handleChange("faculty_name", e.target.value)}
                      placeholder="Khoa Công nghệ Thông tin"
                      className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-semibold text-slate-800 outline-none focus:border-indigo-500 focus:bg-white transition-all"
                    />
                  </div>

                  <div>
                    <label className="ml-1 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Chi đoàn / Lớp
                    </label>
                    <input
                      type="text"
                      value={formData.class_name}
                      onChange={(e) => handleChange("class_name", e.target.value)}
                      placeholder="21CT111"
                      className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 font-semibold text-sm text-slate-800 outline-none focus:border-indigo-500 focus:bg-white transition-all"
                    />
                  </div>

                  <div>
                    <label className="ml-1 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Trình độ đào tạo
                    </label>
                    <select
                      value={formData.education_level}
                      onChange={(e) => handleChange("education_level", e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-semibold text-slate-800 outline-none focus:border-indigo-500 focus:bg-white transition-all"
                    >
                      <option value="Đại học">Đại học</option>
                      <option value="Cao đẳng">Cao đẳng</option>
                      <option value="Sau đại học">Sau đại học</option>
                    </select>
                  </div>

                  <div>
                    <label className="ml-1 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Điểm GPA (Học tập)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="4"
                      value={formData.gpa}
                      onChange={(e) => handleChange("gpa", e.target.value)}
                      placeholder="3.65"
                      className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 font-bold text-sm text-amber-700 outline-none focus:border-indigo-500 focus:bg-white transition-all"
                    />
                  </div>

                  <div>
                    <label className="ml-1 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Điểm Rèn luyện (ĐRL)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={formData.training_score}
                      onChange={(e) => handleChange("training_score", e.target.value)}
                      placeholder="92"
                      className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 font-bold text-sm text-emerald-700 outline-none focus:border-indigo-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* NHÓM 3: ĐOÀN - HỘI, LIÊN HỆ & THÀNH TÍCH */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-amber-700 bg-amber-50/60 px-3 py-2 rounded-xl border border-amber-100">
                  <Award size={16} />
                  <span>Nhóm 3 — Đoàn - Hội, Liên hệ & Thành tích</span>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="ml-1 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Chức vụ Đoàn - Hội
                    </label>
                    <input
                      type="text"
                      value={formData.union_position}
                      onChange={(e) => handleChange("union_position", e.target.value)}
                      placeholder="Đoàn viên / Bí thư Chi đoàn / ..."
                      className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-semibold text-slate-800 outline-none focus:border-indigo-500 focus:bg-white transition-all"
                    />
                  </div>

                  <div>
                    <label className="ml-1 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Tình trạng chính trị
                    </label>
                    <select
                      value={formData.political_status}
                      onChange={(e) => handleChange("political_status", e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-semibold text-slate-800 outline-none focus:border-indigo-500 focus:bg-white transition-all"
                    >
                      <option value="Đoàn viên">Đoàn viên</option>
                      <option value="Đảng viên">Đảng viên</option>
                      <option value="Thanh niên">Thanh niên</option>
                      <option value="Khác">Khác</option>
                    </select>
                  </div>

                  <div>
                    <label className="ml-1 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Số điện thoại liên hệ
                    </label>
                    <div className="mt-1.5 flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 focus-within:border-indigo-500 focus-within:bg-white transition-all">
                      <Phone size={16} className="text-slate-400 shrink-0" />
                      <input
                        type="tel"
                        value={formData.phone_number}
                        onChange={(e) => handleChange("phone_number", e.target.value)}
                        placeholder="0912345678"
                        className="w-full bg-transparent text-sm font-semibold text-slate-800 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="ml-1 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Email liên kết
                    </label>
                    <div className="mt-1.5 flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 focus-within:border-indigo-500 focus-within:bg-white transition-all">
                      <Mail size={16} className="text-slate-400 shrink-0" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        placeholder="sinhvien@lhu.edu.vn"
                        className="w-full bg-transparent text-sm font-semibold text-slate-800 outline-none"
                      />
                      <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="ml-1 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Tóm tắt thành tích nổi bật trong năm học
                    </label>
                    <textarea
                      rows={3}
                      value={formData.achievement_summary}
                      onChange={(e) => handleChange("achievement_summary", e.target.value)}
                      placeholder="Nêu tóm tắt các thành tích tiêu biểu (Học tập, NCKH, Hoạt động tình nguyện, Khen thưởng các cấp...)"
                      className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm font-medium text-slate-800 outline-none focus:border-indigo-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Bảo mật & đăng nhập */}
            <div className="app-card p-6 border border-slate-200/80 shadow-sm">
              <div className="flex items-center gap-2">
                <ShieldCheck size={18} className="text-indigo-600" />
                <h3 className="text-lg font-black text-slate-800">Bảo mật & đăng nhập</h3>
              </div>

              <div className="mt-5 space-y-4">
                <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <div>
                    <p className="text-sm font-black text-slate-800">Mật khẩu</p>
                    <p className="mt-1 text-xs text-slate-500">Cập nhật định kỳ để tăng mức an toàn tài khoản.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsPasswordModalOpen(true)}
                    className="rounded-full bg-white px-4 py-2 text-xs font-black text-slate-700 shadow-sm border border-slate-200 hover:bg-slate-100 transition-colors"
                  >
                    Đổi mật khẩu
                  </button>
                </div>

                <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <div>
                    <p className="text-sm font-black text-slate-800">Xác thực 2 bước (2FA)</p>
                    <p className="mt-1 text-xs text-slate-500">Tăng cường bảo vệ cho tài khoản của bạn.</p>
                  </div>
                  <Toggle checked={twoFactor} onChange={(value) => setTwoFactor(value)} />
                </div>
              </div>
            </div>

            {/* Thông báo & Ngôn ngữ */}
            <div className="grid gap-6 md:grid-cols-2">
              <div className="app-card p-6 border border-slate-200/80 shadow-sm">
                <div className="flex items-center gap-2">
                  <Bell size={18} className="text-amber-500" />
                  <h3 className="text-lg font-black text-slate-800">Thông báo</h3>
                </div>
                <p className="mt-3 text-xs leading-6 text-slate-500">
                  Thông báo hệ thống về xét duyệt SV5T, hoạt động Đoàn - Hội và khen thưởng được đồng bộ liên tục đến tài khoản của bạn.
                </p>
              </div>

              <div className="app-card p-6 border border-slate-200/80 shadow-sm">
                <div className="flex items-center gap-2">
                  <Languages size={18} className="text-emerald-500" />
                  <h3 className="text-lg font-black text-slate-800">Ngôn ngữ</h3>
                </div>
                <select className="mt-3 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-semibold text-slate-700 outline-none">
                  <option>Tiếng Việt (Vietnamese)</option>
                  <option>English (US)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modal Đổi Mật Khẩu */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setIsPasswordModalOpen(false)} />
          <div className="app-card relative z-10 w-full max-w-md overflow-hidden bg-white rounded-2xl shadow-xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <Lock size={18} />
                </div>
                <h3 className="text-base font-bold text-slate-800">Cập nhật mật khẩu</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsPasswordModalOpen(false)}
                className="rounded-full p-2 text-slate-400 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!passwordForm.current_password || !passwordForm.new_password) {
                  setPasswordMessage({ type: "error", text: "Vui lòng nhập đầy đủ mật khẩu." });
                  return;
                }
                if (passwordForm.new_password !== passwordForm.confirm_password) {
                  setPasswordMessage({ type: "error", text: "Mật khẩu xác nhận không khớp." });
                  return;
                }
                setIsChangingPassword(true);
                setPasswordMessage({ type: "", text: "" });
                try {
                  await userService.changePassword({
                    current_password: passwordForm.current_password,
                    new_password: passwordForm.new_password,
                  });
                  setPasswordMessage({ type: "success", text: "Đổi mật khẩu thành công!" });
                  setTimeout(() => {
                    setIsPasswordModalOpen(false);
                    setPasswordForm({ current_password: "", new_password: "", confirm_password: "" });
                    setPasswordMessage({ type: "", text: "" });
                  }, 1500);
                } catch (err) {
                  setPasswordMessage({ type: "error", text: err.message || "Đổi mật khẩu thất bại." });
                } finally {
                  setIsChangingPassword(false);
                }
              }}
              className="space-y-4 p-6"
            >
              {passwordMessage.text && (
                <div
                  className={`p-3 rounded-lg text-xs font-semibold ${
                    passwordMessage.type === "success"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-rose-50 text-rose-700 border border-rose-200"
                  }`}
                >
                  {passwordMessage.text}
                </div>
              )}

              <div>
                <label className="ml-1 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Mật khẩu hiện tại
                </label>
                <div className="mt-1.5 flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5">
                  <Lock size={16} className="text-slate-400" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={passwordForm.current_password}
                    onChange={(e) => setPasswordForm({ ...passwordForm, current_password: e.target.value })}
                    className="w-full bg-transparent text-sm font-semibold text-slate-700 outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="ml-1 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Mật khẩu mới
                </label>
                <div className="mt-1.5 flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5">
                  <Lock size={16} className="text-slate-400" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={passwordForm.new_password}
                    onChange={(e) => setPasswordForm({ ...passwordForm, new_password: e.target.value })}
                    className="w-full bg-transparent text-sm font-semibold text-slate-700 outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="ml-1 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Xác nhận mật khẩu mới
                </label>
                <div className="mt-1.5 flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5">
                  <Lock size={16} className="text-slate-400" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={passwordForm.confirm_password}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirm_password: e.target.value })}
                    className="w-full bg-transparent text-sm font-semibold text-slate-700 outline-none"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="flex-1 rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-200"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isChangingPassword}
                  className="flex-[1.4] rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-indigo-700 disabled:opacity-50"
                >
                  {isChangingPassword ? "Đang xử lý..." : "Xác nhận"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserSetting;
