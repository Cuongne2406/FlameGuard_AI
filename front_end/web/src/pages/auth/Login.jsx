import React from 'react';

const Login = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Đăng Nhập</h2>
        <button 
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          onClick={() => window.location.href = '/admin/dashboard'}
        >
          Vào trang Admin (Demo)
        </button>
      </div>
    </div>
  );
};

export default Login;