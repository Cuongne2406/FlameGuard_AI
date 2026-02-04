// import React from 'react';
// import { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { Button, Input } from '../../../components/ui';

// /**
//  * Login Page - Trang đăng nhập cho đoàn viên
//  */
// const Login = () => {
//     const navigate = useNavigate();
//     const [formData, setFormData] = useState({
//         studentId: '',
//         password: '',
//         remember: false,
//     });

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         // TODO: Call API login
//         console.log('Login:', formData);
//         navigate('/home');
//     };

//     return (
//         <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
//             {/* Background Image */}
//             <div
//                 className="absolute inset-0 bg-cover bg-center bg-no-repeat"
//                 style={{
//                     backgroundImage: `url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1920&q=80')`,
//                 }}
//             >
//                 <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
//             </div>

//             {/* Login Card */}
//             <div className="relative z-10 w-full max-w-md mx-4">
//                 <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-8">
//                     {/* Logo */}
//                     <div className="flex justify-center mb-6">
//                         <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center shadow-lg">
//                             <span className="text-3xl">🏛️</span>
//                         </div>
//                     </div>

//                     {/* Title */}
//                     <div className="text-center mb-8">
//                         <h1 className="text-2xl font-bold text-gray-900 mb-2">Đăng Nhập</h1>
//                         <p className="text-gray-500 text-sm">
//                             Hệ sinh thái số quản lý hoạt động Đoàn
//                         </p>
//                     </div>

//                     {/* Form */}
//                     <form onSubmit={handleSubmit} className="space-y-5">
//                         {/* Student ID */}
//                         <Input
//                             label="Mã số sinh viên / Đoàn viên"
//                             placeholder="Nhập mã số của bạn"
//                             value={formData.studentId}
//                             onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
//                             leftIcon={<span className="material-symbols-outlined text-lg">person</span>}
//                         />

//                         {/* Password */}
//                         <Input
//                             type="password"
//                             label="Mật khẩu"
//                             placeholder="Nhập mật khẩu"
//                             value={formData.password}
//                             onChange={(e) => setFormData({ ...formData, password: e.target.value })}
//                             leftIcon={<span className="material-symbols-outlined text-lg">lock</span>}
//                         />

//                         {/* Remember & Forgot */}
//                         <div className="flex items-center justify-between text-sm">
//                             <label className="flex items-center gap-2 cursor-pointer">
//                                 <input
//                                     type="checkbox"
//                                     checked={formData.remember}
//                                     onChange={(e) => setFormData({ ...formData, remember: e.target.checked })}
//                                     className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
//                                 />
//                                 <span className="text-gray-600">Ghi nhớ đăng nhập</span>
//                             </label>
//                             <Link to="/forgot-password" className="text-primary hover:underline font-medium">
//                                 Quên mật khẩu?
//                             </Link>
//                         </div>

//                         {/* Submit Button */}
//                         <Button type="submit" fullWidth size="lg"
//                             rightIcon={<span className="material-symbols-outlined">arrow_forward</span>}
//                         >
//                             Đăng nhập
//                         </Button>
//                     </form>

//                     {/* Register Link */}
//                     <div className="text-center mt-6 text-sm text-gray-600">
//                         Chưa có tài khoản?{' '}
//                         <Link to="/register" className="text-primary hover:underline font-semibold">
//                             Đăng ký ngay
//                         </Link>
//                     </div>

//                     {/* Footer */}
//                     <div className="text-center mt-8 pt-6 border-t border-gray-100">
//                         <p className="text-xs text-gray-400">
//                             Hệ thống dành cho Đoàn viên và Cán bộ quản lý. Liên hệ Văn phòng Đoàn<br />
//                             để được hỗ trợ kỹ thuật.
//                         </p>
//                     </div>
//                 </div>

//                 {/* Copyright */}
//                 <p className="text-center text-white/80 text-xs mt-4">
//                     © 2024 Hệ thống Quản lý Đoàn Khoa. Developed for Digital Transformation.
//                 </p>
//             </div>
//         </div>
//     );
// };

// export default Login;



import React from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  // Hàm xử lý đăng nhập giả
  const handleFakeLogin = (role) => {
    // 1. Lưu role vào bộ nhớ trình duyệt (LocalStorage)
    // Để sau này các trang khác biết ông này là ai
    localStorage.setItem('userRole', role);
    localStorage.setItem('accessToken', 'fake-token-123456');

    // 2. Điều hướng dựa trên Role
    if (role === 'SUPER_ADMIN') {
      alert("Đang vào với quyền: ADMIN TỔNG");
      navigate('/admin/dashboard'); // Chuyển sang Dashboard của BẠN
    } 
    else if (role === 'STUDENT') {
      alert("Đang vào với quyền: SINH VIÊN");
      navigate('/home'); // Chuyển sang Dashboard của BẠN KIA (UserHome)
    }
    else {
      // Ví dụ Manager/Sub-admin nếu sau này làm
      navigate('/admin/dashboard'); 
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 gap-6">
      <h1 className="text-3xl font-bold text-primary">Giả Lập Đăng Nhập (No Backend)</h1>
      
      <div className="bg-white p-8 rounded-xl shadow-lg flex flex-col gap-4 w-96">
        <p className="text-gray-500 text-center mb-4">Chọn vai trò để test giao diện:</p>

        {/* NÚT 1: VÀO ADMIN */}
        <button 
          onClick={() => handleFakeLogin('SUPER_ADMIN')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded transition-colors"
        >
          Đăng nhập làm ADMIN (Của bạn)
        </button>

        {/* NÚT 2: VÀO USER */}
        <button 
          onClick={() => handleFakeLogin('STUDENT')}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded transition-colors"
        >
          Đăng nhập làm USER (Của bạn kia)
        </button>

        {/* NÚT 3: VÀO SUB-ADMIN (Nếu cần test sau này) */}
        {/* <button 
          onClick={() => handleFakeLogin('MANAGER')}
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded transition-colors"
        >
          Đăng nhập làm SUB-ADMIN
        </button> */}
      </div>
      
      <p className="text-xs text-gray-400">
        Lưu ý: Đây chỉ là giao diện test khi chưa có API.
      </p>
    </div>
  );
};

export default Login;