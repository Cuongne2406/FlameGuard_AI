import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Bell,
  Camera,
  CheckCircle2,
  ChevronRight,
  Languages,
  Loader2,
  Lock,
  Mail,
  RotateCcw,
  Save,
  ShieldCheck,
  User,
  X,
} from "lucide-react";
import { AuthContext } from "../../../context/AuthContext";
import { userService } from "../../../services/userService";
import { Toggle } from "../../../components/admin/ui/Toggle";

const UserSetting = () => {
  const { user, checkUserLogged } = useContext(AuthContext);
  const [twoFactor, setTwoFactor] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState({ type: "", text: "" });
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!user) return;
    setFullName(user.full_name || "");
    setEmail(user.email || "");
    setTwoFactor(user.is_2fa_enabled || false);
  }, [user]);

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

  const handleSaveProfile = async () => {
    if (!user) return;
    setIsSaving(true);
    setSaveMessage({ type: "", text: "" });

    try {
      await userService.updateMe({
        full_name: fullName,
        email,
        is_2fa_enabled: twoFactor,
      });
      setSaveMessage({ type: "success", text: "Cập nhật thông tin thành công!" });
      await checkUserLogged();
    } catch (error) {
      setSaveMessage({
        type: "error",
        text: error.message || "Có lỗi xảy ra khi lưu thông tin",
      });
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveMessage({ type: "", text: "" }), 3000);
    }
  };

  return (
    <div className="space-y-6">
      <section className="app-card overflow-hidden">
        <div className="app-hero relative px-5 pb-8 pt-6 md:px-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.22),transparent_28%)]" />
          <div className="relative flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="inline-flex rounded-full bg-white/18 px-3 py-1 text-[11px] font-black text-white">
                CÀI ĐẶT TÀI KHOẢN
              </div>
              <h2 className="mt-4 text-3xl font-black tracking-tight text-white md:text-4xl">
                Cá nhân & bảo mật
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/82">
                Màn web này được làm lại theo app user: gọn hơn, rõ hơn và tập trung vào hồ sơ cùng trạng thái tài khoản.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {saveMessage.text && (
                <span className={`rounded-full px-4 py-2 text-sm font-bold ${
                  saveMessage.type === "success"
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-rose-100 text-rose-600"
                }`}>
                  {saveMessage.text}
                </span>
              )}
              <button
                onClick={() => {
                  setFullName(user?.full_name || "");
                  setEmail(user?.email || "");
                  setTwoFactor(user?.is_2fa_enabled || false);
                }}
                className="rounded-full bg-white/16 px-5 py-3 text-sm font-black text-white"
              >
                <span className="inline-flex items-center gap-2">
                  <RotateCcw size={16} />
                  Khôi phục
                </span>
              </button>
              <button
                onClick={handleSaveProfile}
                disabled={isSaving}
                className="rounded-full bg-white px-5 py-3 text-sm font-black text-indigo-600"
              >
                <span className="inline-flex items-center gap-2">
                  <Save size={16} />
                  {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
                </span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid gap-6 p-5 lg:grid-cols-[0.95fr_1.25fr] md:p-6">
          <div className="app-card p-6 text-center">
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
            <div className="relative mx-auto h-32 w-32">
              <img
                src={
                  user?.avatar_url ||
                  `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.student_id || "Felix"}`
                }
                alt="Avatar"
                className="h-full w-full rounded-full border-4 border-white object-cover shadow-md"
              />
              <button
                onClick={handleAvatarClick}
                disabled={isUploadingAvatar}
                className="absolute bottom-1 right-1 flex h-11 w-11 items-center justify-center rounded-full border-4 border-white bg-indigo-600 text-white"
              >
                {isUploadingAvatar ? <Loader2 size={16} className="animate-spin" /> : <Camera size={16} />}
              </button>
            </div>

            <h3 className="mt-5 text-2xl font-black text-slate-800">{user?.full_name}</h3>
            <p className="mt-1 text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
              MSSV: {user?.student_id}
            </p>
            <div className="mt-3 inline-flex rounded-full bg-indigo-50 px-4 py-2 text-xs font-black text-indigo-600">
              Lớp: {user?.class_name || "N/A"}
            </div>
          </div>

          <div className="space-y-6">
            <div className="app-card p-6">
              <div className="flex items-center gap-2">
                <User size={18} className="text-indigo-600" />
                <h3 className="text-lg font-black text-slate-800">Thông tin cơ bản</h3>
              </div>

              <div className="mt-5 grid gap-5 md:grid-cols-2">
                <div>
                  <label className="ml-1 text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
                    Họ và tên
                  </label>
                  <div className="mt-2 flex items-center gap-3 rounded-[20px] border border-slate-100 bg-slate-50 px-4 py-3">
                    <User size={16} className="text-slate-300" />
                    <input
                      value={fullName}
                      onChange={(event) => setFullName(event.target.value)}
                      className="w-full bg-transparent text-sm font-semibold text-slate-700 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="ml-1 text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
                    Email liên kết
                  </label>
                  <div className="mt-2 flex items-center gap-3 rounded-[20px] border border-slate-100 bg-slate-50 px-4 py-3">
                    <Mail size={16} className="text-slate-300" />
                    <input
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      className="w-full bg-transparent text-sm font-semibold text-slate-700 outline-none"
                    />
                    <CheckCircle2 size={16} className="text-emerald-500" />
                  </div>
                </div>
              </div>
            </div>

            <div className="app-card p-6">
              <div className="flex items-center gap-2">
                <ShieldCheck size={18} className="text-indigo-600" />
                <h3 className="text-lg font-black text-slate-800">Bảo mật & đăng nhập</h3>
              </div>

              <div className="mt-5 space-y-5">
                <div className="flex items-center justify-between gap-4 rounded-[22px] border border-slate-100 bg-slate-50 p-4">
                  <div>
                    <p className="text-sm font-black text-slate-800">Mật khẩu</p>
                    <p className="mt-1 text-xs text-slate-500">Cập nhật định kỳ để tăng mức an toàn.</p>
                  </div>
                  <button
                    onClick={() => setIsPasswordModalOpen(true)}
                    className="rounded-full bg-white px-4 py-2 text-xs font-black text-slate-700"
                  >
                    Đổi mật khẩu
                  </button>
                </div>

                <div className="flex items-center justify-between gap-4 rounded-[22px] border border-slate-100 bg-slate-50 p-4">
                  <div>
                    <p className="text-sm font-black text-slate-800">Xác thực 2 bước</p>
                    <p className="mt-1 text-xs text-slate-500">Tăng cường bảo vệ cho tài khoản của bạn.</p>
                  </div>
                  <Toggle checked={twoFactor} onChange={(value) => setTwoFactor(value)} />
                </div>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="app-card p-6">
                <div className="flex items-center gap-2">
                  <Bell size={18} className="text-amber-500" />
                  <h3 className="text-lg font-black text-slate-800">Thông báo</h3>
                </div>
                <p className="mt-4 text-sm leading-7 text-slate-500">
                  Thông báo hệ thống đang hoạt động ổn định và được đồng bộ với màn thông báo riêng trên web.
                </p>
              </div>

              <div className="app-card p-6">
                <div className="flex items-center gap-2">
                  <Languages size={18} className="text-emerald-500" />
                  <h3 className="text-lg font-black text-slate-800">Ngôn ngữ</h3>
                </div>
                <select className="mt-4 w-full rounded-[20px] border border-slate-100 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 outline-none">
                  <option>Tiếng Việt (Vietnamese)</option>
                  <option>English (US)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setIsPasswordModalOpen(false)} />
          <div className="app-card relative z-10 w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-[16px] bg-indigo-50 text-indigo-600">
                  <Lock size={18} />
                </div>
                <h3 className="text-base font-black text-slate-800">Cập nhật mật khẩu</h3>
              </div>
              <button onClick={() => setIsPasswordModalOpen(false)} className="rounded-full p-2 text-slate-400 hover:bg-slate-100">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 p-6">
              {["Mật khẩu hiện tại", "Mật khẩu mới", "Xác nhận mật khẩu mới"].map((label) => (
                <div key={label}>
                  <label className="ml-1 text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
                    {label}
                  </label>
                  <div className="mt-2 flex items-center gap-3 rounded-[20px] border border-slate-100 bg-slate-50 px-4 py-3">
                    <Lock size={16} className="text-slate-300" />
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full bg-transparent text-sm font-semibold text-slate-700 outline-none"
                    />
                  </div>
                </div>
              ))}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="flex-1 rounded-full bg-slate-100 px-5 py-3 text-sm font-black text-slate-500"
                >
                  Hủy
                </button>
                <button className="flex-[1.4] rounded-full bg-indigo-600 px-5 py-3 text-sm font-black text-white">
                  Xác nhận
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserSetting;
