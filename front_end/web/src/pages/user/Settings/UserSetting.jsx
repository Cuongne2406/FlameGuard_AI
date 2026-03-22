import React, { useState, useContext, useEffect, useRef } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { userService } from "../../../services/userService";
import {
  User,
  Mail,
  Phone,
  ShieldCheck,
  Smartphone,
  Laptop,
  Bell,
  Moon,
  Languages,
  Camera,
  CheckCircle2,
  Lock,
  ChevronRight,
  LogOut,
  Save,
  RotateCcw,
  X,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";
import { Toggle } from "../../../components/admin/ui/Toggle";

const UserSetting = () => {
  const { user, checkUserLogged } = useContext(AuthContext);

  const [twoFactor, setTwoFactor] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Form states
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState({ type: '', text: '' });

  // Update form fields when user data is available
  useEffect(() => {
    if (user) {
      setFullName(user.full_name || "");
      setEmail(user.email || "");
      setTwoFactor(user.is_2fa_enabled || false);
    }
  }, [user]);

  // Handle Avatar Upload
  const fileInputRef = useRef(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  const handleAvatarClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
       setSaveMessage({ type: 'error', text: 'Kích thước ảnh không vượt quá 5MB' });
       return;
    }

    setIsUploadingAvatar(true);
    setSaveMessage({ type: '', text: '' });
    
    try {
      await userService.uploadAvatar(file);
      await checkUserLogged(); // Làm mới Context để đồng bộ Avatar
      setSaveMessage({ type: 'success', text: 'Cập nhật ảnh đại diện thành công!' });
    } catch (error) {
       setSaveMessage({ type: 'error', text: error.message || 'Lỗi khi tải ảnh lên' });
    } finally {
      setIsUploadingAvatar(false);
      setTimeout(() => setSaveMessage({ type: '', text: '' }), 3000);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Handle Profile Save
  const handleSaveProfile = async () => {
    if (!user || (!fullName && !email)) return;
    setIsSaving(true);
    setSaveMessage({ type: '', text: '' });
    try {
      await userService.updateMe({
        full_name: fullName,
        email: email,
        is_2fa_enabled: twoFactor
      });
      setSaveMessage({ type: 'success', text: 'Cập nhật thông tin thành công!' });
      await checkUserLogged(); // Refresh global user state
    } catch (error) {
      setSaveMessage({ type: 'error', text: error.message || 'Có lỗi xảy ra khi lưu thông tin' });
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveMessage({ type: '', text: '' }), 3000);
    }
  };

  // State cho Modal Đổi mật khẩu
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  // Component Modal Đổi mật khẩu
  const PasswordModal = () => (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-[2.5rem] w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-xl">
              <Lock size={18} />
            </div>
            <h3 className="font-black text-slate-800 uppercase tracking-tight text-sm">
              Cập nhật mật khẩu
            </h3>
          </div>
          <button
            onClick={() => setIsPasswordModalOpen(false)}
            className="p-2 hover:bg-slate-200 rounded-full transition-colors"
          >
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-8 space-y-5">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-2">
              Mật khẩu hiện tại
            </label>
            <div className="relative">
              <Lock
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                size={16}
              />
              <input
                type="password"
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:border-blue-200 outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-2">
              Mật khẩu mới
            </label>
            <div className="relative">
              <ShieldCheck
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                size={16}
              />
              <input
                type="password"
                placeholder="Tối thiểu 8 ký tự"
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:border-blue-200 outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-2">
              Xác nhận mật khẩu mới
            </label>
            <div className="relative">
              <CheckCircle2
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                size={16}
              />
              <input
                type="password"
                placeholder="Nhập lại mật khẩu mới"
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:border-blue-200 outline-none transition-all"
              />
            </div>
          </div>

          <div className="pt-4 space-y-3">
            <button className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all">
              Xác nhận thay đổi
            </button>
            <button
              onClick={() => setIsPasswordModalOpen(false)}
              className="w-full py-4 text-slate-400 font-black uppercase text-[10px] tracking-widest hover:text-slate-600 transition-all"
            >
              Hủy bỏ
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 p-4">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Trang chủ <ChevronRight size={10} />{" "}
            <span className="text-blue-600">Cài đặt</span>
          </div>
          <h2 className="text-2xl font-black text-slate-800">
            Thiết lập Tài khoản Cá nhân
          </h2>
        </div>

        <div className="flex items-center gap-3">
          {saveMessage.text && (
            <span className={`text-xs font-bold ${saveMessage.type === 'success' ? 'text-emerald-500' : 'text-red-500'} animate-in fade-in`}>
              {saveMessage.text}
            </span>
          )}
          <button 
            onClick={() => {
              setFullName(user?.full_name || "");
              setEmail(user?.email || "");
            }}
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-100 text-slate-600 rounded-xl text-xs font-black hover:bg-slate-200 transition-all"
          >
            <RotateCcw size={16} /> Khôi phục mặc định
          </button>
          <button 
            onClick={handleSaveProfile}
            disabled={isSaving}
            className={`flex items-center gap-2 px-6 py-2.5 ${isSaving ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} text-white rounded-xl text-xs font-black shadow-lg shadow-blue-200 transition-all`}
          >
            <Save size={16} /> {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: PROFILE CARD */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm text-center relative overflow-hidden">
            <div className="relative w-32 h-32 mx-auto mb-6 group">
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept="image/*" 
              />
              <img
                src={user?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.student_id || 'Felix'}`}
                alt="Avatar"
                className="w-full h-full rounded-full border-4 border-slate-50 bg-slate-100 object-cover shadow-inner cursor-pointer"
                onClick={handleAvatarClick}
              />
              <button 
                onClick={handleAvatarClick}
                disabled={isUploadingAvatar}
                className="absolute bottom-0 right-0 p-2.5 bg-blue-600 text-white rounded-full border-4 border-white shadow-lg hover:scale-110 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploadingAvatar ? <Loader2 size={16} className="animate-spin" /> : <Camera size={16} />}
              </button>
            </div>

            <h3 className="text-xl font-black text-slate-800">
              {user?.full_name}
            </h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
              MSSV: {user?.student_id}
            </p>
            <div className="mt-2 inline-block px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase">
              Lớp: {user?.class_name || "N/A"}
            </div>

            <div className="mt-8 space-y-4 text-left">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2">
                  Họ và tên
                </label>
                <div className="relative">
                  <User
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                    size={16}
                  />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-transparent rounded-2xl text-sm font-bold text-slate-700 focus:bg-white focus:border-blue-200 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2">
                  Email liên kết
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                    size={16}
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-10 py-3 bg-slate-50 border border-transparent rounded-2xl text-sm font-bold text-slate-700 focus:bg-white focus:border-blue-200 outline-none transition-all"
                  />
                  <CheckCircle2
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500"
                    size={16}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: SETTINGS */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm">
            <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-3 mb-8">
              <ShieldCheck className="text-blue-600" size={20} /> Bảo mật & Đăng
              nhập
            </h4>

            <div className="space-y-8">
              <div className="flex items-center justify-between group">
                <div>
                  <h5 className="text-sm font-black text-slate-700">
                    Mật khẩu
                  </h5>
                  <p className="text-[11px] text-slate-400 font-medium">
                    Lần đổi gần nhất: 3 tháng trước
                  </p>
                </div>
                {/* NÚT BẤM ĐỂ MỞ MODAL */}
                <button
                  onClick={() => setIsPasswordModalOpen(true)}
                  className="px-4 py-2 bg-slate-50 text-slate-600 rounded-xl text-[10px] font-black uppercase hover:bg-slate-100 transition-all border border-slate-100"
                >
                  Đổi mật khẩu
                </button>
              </div>

              <div className="h-px bg-slate-50"></div>

              <div className="flex items-center justify-between">
                <div>
                  <h5 className="text-sm font-black text-slate-700">
                    Xác thực 2 bước (2FA)
                  </h5>
                  <p className="text-[11px] text-slate-400 font-medium">
                    Tăng cường bảo mật cho tài khoản của bạn
                  </p>
                </div>
                <Toggle 
                  checked={twoFactor}
                  onChange={(val) => setTwoFactor(val)}
                />
              </div>
            </div>
          </div>

          {/* ... Các phần khác giữ nguyên ... */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm">
              <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-3 mb-6">
                <Bell className="text-orange-500" size={20} /> Thông báo
              </h4>
              <div className="space-y-5">
                <p className="text-[10px] text-slate-400 font-medium italic">
                  Hệ thống thông báo đang hoạt động ổn định.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm">
              <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-3 mb-6">
                <Languages className="text-teal-500" size={20} /> Ngôn ngữ
              </h4>
              <select className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-700 outline-none appearance-none cursor-pointer">
                <option>Tiếng Việt (Vietnamese)</option>
                <option>English (US)</option>
              </select>
            </div>
          </div>

          <button className="w-full py-4 bg-red-50 text-red-500 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 border border-red-100 hover:bg-red-100 transition-all">
            <LogOut size={16} /> Đăng xuất khỏi tất cả thiết bị
          </button>
        </div>
      </div>

      {/* RENDER MODAL KHI TRẠNG THÁI LÀ TRUE */}
      {isPasswordModalOpen && <PasswordModal />}
    </div>
  );
};

export default UserSetting;
