import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, User, Loader2, ShieldCheck } from "lucide-react";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login: loginContext, verifyOtp, roles } = useContext(AuthContext);

  // State quản lý dữ liệu nhập vào
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorContext, setErrorContext] = useState("");
  const [loading, setLoading] = useState(false);

  // Mới: State cho 2FA
  const [showOtp, setShowOtp] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [userId, setUserId] = useState(null);

  // Hàm chuyển hướng sau khi login/verify thành công
  const redirectUser = async () => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        try {
            const { userService } = await import('../services/userService');
            const profile = await userService.getMe();
            const isAdmin = profile.roles && profile.roles.find(r => 
                r.name === 'FACULTY_ADMIN' || r.name === 'UNIVERSITY_ADMIN' || r.name === 'SUPER_ADMIN'
            );
            if (isAdmin) {
                navigate("/admin/dashboard");
            } else {
                navigate("/user/dashboard");
            }
        } catch (err) {
            console.error("Redirect error:", err);
            navigate("/user/dashboard");
        }
    }
  };

  // Hàm xử lý khi bấm nút Đăng Nhập (Step 1)
  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorContext("");
    setLoading(true);

    try {
      const result = await loginContext(username, password);
      
      if (result.requires2fa) {
        setShowOtp(true);
        setUserId(result.userId);
        setLoading(false);
        return;
      }

      if (result.success) {
        await redirectUser();
      } else {
        setErrorContext("Tên đăng nhập hoặc mật khẩu không chính xác!");
      }
    } catch (err) {
      setErrorContext(err.message || "Đã xảy ra lỗi hệ thống!");
    } finally {
      setLoading(false);
    }
  };

  // Hàm xử lý khi bấm xác nhận OTP (Step 2)
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setErrorContext("");
    setLoading(true);

    try {
      const result = await verifyOtp(userId, otpCode);
      if (result.success) {
        await redirectUser();
      } else {
        setErrorContext(result.error || "Mã xác thực không đúng hoặc đã hết hạn!");
      }
    } catch (err) {
      setErrorContext(err.message || "Lỗi xác thực!");
    } finally {
      setLoading(false);
    }
  };

  // Lệnh return phải nằm ở đây (ngoài handleLogin)
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-4">
      {/* Trang trí nền tảng */}
      <div className="absolute top-0 left-0 w-full h-1 bg-blue-600"></div>

      <div className="max-w-md w-full space-y-8 p-10 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.05)] rounded-[2.5rem] border border-slate-100 relative overflow-hidden">
        {/* Logo & Header */}
        <div className="text-center relative z-10">
          <div className="mx-auto w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200 mb-6 rotate-3">
            <ShieldCheck className="text-white" size={32} />
          </div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">
            LHU <span className="text-blue-600">YouthHub</span>
          </h2>
          <p className="mt-2 text-sm text-slate-500 font-medium">
            Hệ thống quản lý sinh viên & Đoàn viên thế hệ mới
          </p>
        </div>

        {/* Error Alert */}
        {errorContext && (
          <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-2xl animate-in fade-in slide-in-from-top-2 duration-300">
            <span className="block text-xs font-black text-center uppercase tracking-wider">
              {errorContext}
            </span>
          </div>
        )}

        {!showOtp ? (
          <form className="mt-8 space-y-5 relative z-10" onSubmit={handleLogin}>
            <div className="space-y-4">
              {/* Input Tài khoản */}
              <div className="relative">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4 mb-1 block">
                  Tài khoản
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                  </div>
                  <input
                    type="text"
                    required
                    className="block w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 text-slate-900 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 focus:bg-white transition-all font-medium"
                    placeholder="MSSV hoặc Email"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              </div>

              {/* Input Mật khẩu */}
              <div className="relative">
                <div className="flex justify-between items-center ml-4 mb-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">
                    Mật khẩu
                  </label>
                  <a
                    href="#"
                    className="text-[10px] font-black uppercase tracking-widest text-blue-600 hover:underline"
                  >
                    Quên?
                  </a>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                  </div>
                  <input
                    type="password"
                    required
                    className="block w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 text-slate-900 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 focus:bg-white transition-all font-medium"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-black rounded-2xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100 disabled:bg-slate-300 transition-all shadow-xl shadow-blue-100 active:scale-[0.98]"
              >
                {loading ? (
                  <span className="flex items-center gap-2 italic uppercase tracking-widest">
                    <Loader2 className="animate-spin h-4 w-4" />
                    Đang xác thực...
                  </span>
                ) : (
                  <span className="uppercase tracking-[0.15em]">Đăng Nhập</span>
                )}
              </button>
            </div>
          </form>
        ) : (
          <form className="mt-8 space-y-6 animate-in zoom-in-95 duration-300" onSubmit={handleVerifyOtp}>
            <div className="text-center space-y-2">
              <p className="text-xs font-bold text-slate-600">
                Vui lòng nhập mã OTP đã gửi tới Email của bạn
              </p>
              <p className="text-[10px] text-slate-400 font-medium">
                Mã gồm 6 chữ số và hết hạn sau 5 phút.
              </p>
            </div>

            <div className="relative group">
              <input
                type="text"
                maxLength={6}
                required
                autoFocus
                className="block w-full px-4 py-5 bg-slate-50 border-2 border-dashed border-slate-200 text-center text-3xl font-black tracking-[0.5em] text-blue-600 rounded-2xl focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                placeholder="000000"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
              />
            </div>

            <div className="space-y-3">
              <button
                type="submit"
                disabled={loading || otpCode.length !== 6}
                className="w-full py-4 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-black rounded-2xl shadow-xl shadow-emerald-100 transition-all active:scale-[0.98] disabled:bg-slate-200 disabled:shadow-none"
              >
                {loading ? "ĐANG XÁC MINH..." : "XÁC NHẬN MÃ"}
              </button>
              
              <button
                type="button"
                onClick={() => setShowOtp(false)}
                className="w-full py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors"
              >
                Quay lại đăng nhập
              </button>
            </div>
          </form>
        )}

        {/* Footer info */}
        <div className="text-center pt-6 border-t border-slate-50">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
            © 2026 Digital Youth Union System (DYUS)
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;