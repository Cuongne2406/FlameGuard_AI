import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Toast } from '../../../components/ui';
import RegisterForm from '../../../components/UserComponents/RegisterForm';
import ForgotPasswordForm from '../../../components/UserComponents/ForgotPasswordForm';

/**
 * Login Page - Giao diện đăng nhập cao cấp tích hợp API thực tế
 */
const Login = () => {
  const navigate = useNavigate();

  // UI State
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isForgotOpen, setIsForgotOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  // Auth State
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // --- 1. HÀM XỬ LÝ ĐĂNG NHẬP THỰC TẾ ---
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username,
          password: password
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || 'Đăng nhập thất bại!');

      localStorage.setItem('access_token', data.access_token);

      // Lấy thông tin User để xác định Role
      const meResponse = await fetch('http://127.0.0.1:8000/api/v1/users/me', {
        headers: { 'Authorization': `Bearer ${data.access_token}` }
      });

      if (!meResponse.ok) throw new Error("Không thể xác thực vai trò người dùng.");

      const userData = await meResponse.json();
      localStorage.setItem('user_role', userData.role);

      // Điều hướng
      if (userData.role === 'SUPER_ADMIN') navigate('/admin/dashboard');
      else if (userData.role === 'SUB_ADMIN' || userData.role === 'ADMIN') navigate('/admin-sub/dashboard');
      else navigate('/home');

    } catch (err) {
      setError(err.message);
      localStorage.removeItem('access_token');
      localStorage.removeItem('user_role');
    } finally {
      setLoading(false);
    }
  };

  // --- 2. HÀM LOGIN NHANH (CHO DEV) ---
  const handleFakeLogin = (role) => {
    localStorage.setItem('user_role', role);
    localStorage.setItem('access_token', 'dev-token-only');
    if (role === 'SUPER_ADMIN') navigate('/admin/dashboard');
    else if (role === 'SUB_ADMIN') navigate('/admin-sub/dashboard');
    else navigate('/home');
  };

  const handleSuccess = (msg) => {
    setIsRegisterOpen(false);
    setIsForgotOpen(false);
    setToastMsg(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#f8faff] gap-6 font-display relative p-4">
      {showToast && <Toast message={toastMsg} type="success" onClose={() => setShowToast(false)} />}

      {/* Header */}
      <div className="text-center space-y-2 animate-fade-in">
        <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-blue-100 rotate-3">
          <span className="material-symbols-outlined text-white text-3xl">school</span>
        </div>
        <h1 className="text-3xl font-black text-[#1e293b] uppercase tracking-tight">Hệ Thống YouthHub</h1>
        <p className="text-gray-400 font-medium text-sm md:text-base">Hệ sinh thái số quản lý hoạt động Đoàn Khoa</p>
      </div>

      {/* Main Login Card */}
      <div className="bg-white p-8 rounded-3xl shadow-2xl shadow-blue-50/50 flex flex-col gap-6 w-full max-w-md border border-gray-100 animate-slide-up">
        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-xs font-bold animate-shake text-center">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleLogin}>
          <div className="space-y-4">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 text-lg">person</span>
              <input
                type="text"
                required
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                placeholder="Tài khoản / MSSV"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 text-lg">lock</span>
              <input
                type="password"
                required
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                placeholder="Mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-[0.98] disabled:bg-gray-300"
          >
            {loading ? "Đang xác thực..." : "Đăng Nhập"}
          </button>

          <div className="text-right">
            <button type="button" onClick={() => setIsForgotOpen(true)} className="text-xs text-gray-400 hover:text-primary font-medium">Bạn quên mật khẩu?</button>
          </div>
        </form>

        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-gray-100"></div>
          <span className="flex-shrink-0 mx-4 text-gray-300 text-[10px] font-bold uppercase tracking-widest">Hoặc đăng ký</span>
          <div className="flex-grow border-t border-gray-100"></div>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-500">
            Chưa có tài khoản?{' '}
            <button onClick={() => setIsRegisterOpen(true)} className="text-primary font-bold hover:underline">Hãy đăng ký ngay</button>
          </p>
        </div>
      </div>

      {/* Quick Access (Dev Only) */}
      <div className="w-full max-w-md space-y-3">
        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest text-center">Truy cập nhanh (Chế độ phát triển)</p>
        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => handleFakeLogin('SUPER_ADMIN')} className="flex items-center justify-center gap-2 bg-[#1e293b] text-white py-2 rounded-lg text-[10px] font-bold opacity-80 hover:opacity-100 transition-all">
            <span className="material-symbols-outlined text-sm">admin_panel_settings</span> ADMIN TỔNG
          </button>
          <button onClick={() => handleFakeLogin('SUB_ADMIN')} className="flex items-center justify-center gap-2 bg-[#f2a60d] text-white py-2 rounded-lg text-[10px] font-bold opacity-80 hover:opacity-100 transition-all">
            <span className="material-symbols-outlined text-sm">local_police</span> BÍ THƯ CHI ĐOÀN
          </button>
        </div>
      </div>

      {/* Modals */}
      <Modal isOpen={isRegisterOpen} onClose={() => setIsRegisterOpen(false)} title="Đăng Ký Thành Viên Mới" size="xl">
        <RegisterForm onSuccess={() => handleSuccess('Đăng ký tài khoản thành công!')} onToggleLogin={() => setIsRegisterOpen(false)} />
      </Modal>

      <Modal isOpen={isForgotOpen} onClose={() => setIsForgotOpen(false)} title="Khôi Phục Mật Khẩu" size="lg">
        <ForgotPasswordForm onSuccess={() => handleSuccess('Đã đặt lại mật khẩu thành công!')} onToggleLogin={() => setIsForgotOpen(false)} />
      </Modal>
    </div>
  );
};

export default Login;