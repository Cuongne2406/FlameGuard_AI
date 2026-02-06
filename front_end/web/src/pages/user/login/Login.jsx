import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Toast } from '../../../components/ui';
import RegisterForm from '../../../components/UserComponents/RegisterForm';
import ForgotPasswordForm from '../../../components/UserComponents/ForgotPasswordForm';

const Login = () => {
  const navigate = useNavigate();
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isForgotOpen, setIsForgotOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  // Hàm xử lý đăng nhập giả
  const handleFakeLogin = (role) => {
    localStorage.setItem('userRole', role);
    localStorage.setItem('accessToken', 'fake-token-123456');

    if (role === 'SUPER_ADMIN') {
      alert("Đang vào với quyền: ADMIN TỔNG");
      navigate('/admin/dashboard');
    }
    else if (role === 'SUB_ADMIN') {
      alert("Đang vào với quyền: BÍ THƯ CHI ĐOÀN");
      navigate('/admin-sub/dashboard');
    }
    else if (role === 'STUDENT') {
      alert("Đang vào với quyền: SINH VIÊN");
      navigate('/home');
    }
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
      {showToast && (
        <Toast
          message={toastMsg}
          type="success"
          onClose={() => setShowToast(false)}
        />
      )}

      <div className="text-center space-y-2 animate-fade-in">
        <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-blue-100 rotate-3">
          <span className="material-symbols-outlined text-white text-3xl">school</span>
        </div>
        <h1 className="text-3xl font-black text-[#1e293b] uppercase tracking-tight">Hệ Thống YouthHub</h1>
        <p className="text-gray-400 font-medium">Hệ sinh thái số quản lý hoạt động Đoàn Khoa</p>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-2xl shadow-blue-50/50 flex flex-col gap-4 w-full max-w-md border border-gray-100 animate-slide-up">
        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest text-center mb-2">Chọn vai trò truy cập nhanh</p>

        <button
          onClick={() => handleFakeLogin('SUPER_ADMIN')}
          className="flex items-center justify-between gap-3 bg-[#1e293b] hover:bg-black text-white font-bold py-4 px-6 rounded-xl transition-all active:scale-95 group"
        >
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-blue-400">admin_panel_settings</span>
            <span>ADMIN TỔNG</span>
          </div>
          <span className="material-symbols-outlined opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0">chevron_right</span>
        </button>

        <button
          onClick={() => handleFakeLogin('SUB_ADMIN')}
          className="flex items-center justify-between gap-3 bg-[#f2a60d] hover:bg-[#d9950b] text-white font-bold py-4 px-6 rounded-xl transition-all active:scale-95 group"
        >
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined">local_police</span>
            <span>BÍ THƯ CHI ĐOÀN</span>
          </div>
          <span className="material-symbols-outlined opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0">chevron_right</span>
        </button>

        <div className="relative flex py-3 items-center">
          <div className="flex-grow border-t border-gray-100"></div>
          <span className="flex-shrink-0 mx-4 text-gray-300 text-[10px] font-bold uppercase tracking-tighter">Cổng sinh viên</span>
          <div className="flex-grow border-t border-gray-100"></div>
        </div>

        <button
          onClick={() => handleFakeLogin('STUDENT')}
          className="flex items-center justify-between gap-3 bg-[#007bff] hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-xl transition-all active:scale-95 group"
        >
          <div className="flex items-center gap-3 transition-all">
            <span className="material-symbols-outlined">person</span>
            <span>ĐOÀN VIÊN ĐĂNG NHẬP</span>
          </div>
          <span className="material-symbols-outlined opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0">chevron_right</span>
        </button>

        <div className="mt-4 flex flex-col gap-3">
          <button
            onClick={() => setIsForgotOpen(true)}
            className="text-sm text-gray-500 hover:text-primary font-medium transition-colors"
          >
            Bạn quên mật khẩu?
          </button>
          <div className="pt-4 border-t border-gray-50 text-center">
            <p className="text-sm text-gray-500">
              Chưa có tài khoản?{' '}
              <button
                onClick={() => setIsRegisterOpen(true)}
                className="text-primary font-bold hover:underline"
              >
                Đăng ký ngay
              </button>
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 text-gray-400 font-mono text-[10px]">
        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
        DEVELOPMENT MODE ACTIVE • VER 2.0
      </div>

      {/* Modal Đăng ký */}
      <Modal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        title="Đăng Ký Thành Viên Mới"
        size="xl"
      >
        <RegisterForm
          onSuccess={() => handleSuccess('Đăng ký tài khoản thành công!')}
          onToggleLogin={() => setIsRegisterOpen(false)}
        />
      </Modal>

      {/* Modal Quên mật khẩu */}
      <Modal
        isOpen={isForgotOpen}
        onClose={() => setIsForgotOpen(false)}
        title="Khôi Phục Mật Khẩu"
        size="lg"
      >
        <ForgotPasswordForm
          onSuccess={() => handleSuccess('Đã đặt lại mật khẩu thành công!')}
          onToggleLogin={() => setIsForgotOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default Login;