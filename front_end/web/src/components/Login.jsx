import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, User, Loader2, ShieldCheck } from "lucide-react";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login: loginContext, roles } = useContext(AuthContext);

  // State quản lý dữ liệu nhập vào
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorContext, setErrorContext] = useState("");
  const [loading, setLoading] = useState(false);

  // Hàm xử lý khi bấm nút Đăng Nhập
  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorContext("");
    setLoading(true);

    try {
      const success = await loginContext(username, password);
      
      if (success) {
        // Sau khi AuthContext update state, trigger check role (trong thực tế có thể check từ response hoặc chờ Context update)
        // Để linh hoạt hơn ở đây mình lấy raw token từ localStorage ra decode (hoặc fetch profile)
        // Lưu ý: Do state update bất đồng bộ, check roles ngay lúc này từ Context có thể rỗng, 
        // nhưng Context checkUserLogged đã gọi ở AuthContext. Ta nên redirect về mặc định.
        // Tốt nhất là fetch lại user locally để redirect chuẩn xác nhất:
        const token = localStorage.getItem('accessToken');
        if (token) {
           const { userService } = await import('../services/userService');
           const profile = await userService.getMe();
           const isAdmin = profile.roles && profile.roles.find(r => 
               r.name === 'FACULTY_ADMIN' || r.name === 'UNIVERSITY_ADMIN'
           );
           if (isAdmin) {
             navigate("/admin/dashboard");
           } else {
             navigate("/user/dashboard");
           }
        }
      } else {
        setErrorContext("Tên đăng nhập hoặc mật khẩu không chính xác!");
      }
    } catch (err) {
      setErrorContext(err.message || "Đã xảy ra lỗi hệ thống!");
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