import React, { useState } from 'react';
import { Send, Phone, Mail, MapPin, Loader2, CheckCircle, AlertCircle } from "lucide-react";

const Contact = () => {
  // 1. Quản lý trạng thái Form
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '', // Thêm trường chủ đề
    message: ''
  });
  
  // 2. Quản lý trạng thái Gửi (idle, loading, success, error)
  const [status, setStatus] = useState('idle'); 

  // 3. Hàm cập nhật dữ liệu khi nhập
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 4. Hàm xử lý khi bấm nút Gửi
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');

    try {
      // Gọi API Backend (Đảm bảo backend đang chạy ở port 8000)
      const response = await fetch('http://127.0.0.1:8000/api/v1/feedback/send-feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus('success');
        // Reset form sau khi gửi thành công
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error("Lỗi gửi feedback:", error);
      setStatus('error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 min-h-screen flex items-center">
      <div className="bg-white rounded-[32px] overflow-hidden shadow-2xl border border-gray-100 flex flex-col md:flex-row w-full">
        
        {/* Cột trái: Thông tin liên hệ */}
        <div className="md:w-5/12 bg-blue-700 p-12 text-white flex flex-col justify-between relative overflow-hidden">
          {/* Họa tiết trang trí */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 rounded-full -mr-32 -mt-32 opacity-50"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-500 rounded-full -ml-20 -mb-20 opacity-30"></div>
          
          <div className="relative z-10">
            <h2 className="text-3xl font-black mb-6">Liên hệ với chúng tôi</h2>
            <p className="text-blue-100 mb-10 leading-relaxed text-sm">
              Bạn có thắc mắc hoặc cần hỗ trợ về công tác Đoàn? Hãy để lại thông
              tin, chúng tôi sẽ phản hồi sớm nhất.
            </p>

            <div className="space-y-8">
              <div className="flex items-center gap-5 group">
                <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:bg-white/20 transition-all">
                  <Phone size={20} />
                </div>
                <div>
                  <p className="text-[10px] text-blue-200 uppercase font-bold tracking-wider">Hotline</p>
                  <span className="text-sm font-bold">028.38.XXX.XXX</span>
                </div>
              </div>
              <div className="flex items-center gap-5 group">
                <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:bg-white/20 transition-all">
                  <Mail size={20} />
                </div>
                <div>
                  <p className="text-[10px] text-blue-200 uppercase font-bold tracking-wider">Email</p>
                  <span className="text-sm font-bold">doankhoa.cntt@university.edu.vn</span>
                </div>
              </div>
              <div className="flex items-center gap-5 group">
                <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:bg-white/20 transition-all">
                  <MapPin size={20} />
                </div>
                <div>
                  <p className="text-[10px] text-blue-200 uppercase font-bold tracking-wider">Địa chỉ</p>
                  <span className="text-sm font-bold max-w-[200px] block">
                    Văn phòng Đoàn, Tầng 2, Tòa nhà A
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cột phải: Form nhập liệu */}
        <div className="md:w-7/12 p-12 bg-white relative">
          
          {/* Thông báo trạng thái */}
          {status === 'success' && (
            <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-xl flex items-center gap-3 border border-green-100 animate-in fade-in slide-in-from-top-2">
              <CheckCircle size={20} />
              <span className="text-sm font-bold">Gửi thành công! Chúng tôi sẽ liên hệ lại sớm nhất.</span>
            </div>
          )}
          {status === 'error' && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl flex items-center gap-3 border border-red-100 animate-in fade-in slide-in-from-top-2">
              <AlertCircle size={20} />
              <span className="text-sm font-bold">Có lỗi xảy ra. Vui lòng thử lại sau!</span>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">
                  Họ và tên
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm font-medium"
                  placeholder="Nguyễn Văn A"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">
                  Email liên hệ
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm font-medium"
                  placeholder="sinhvien@example.com"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">
                Chủ đề
              </label>
              <input
                type="text"
                name="subject" // Khớp với Backend
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm font-medium"
                placeholder="V/v Đăng ký tham gia Mùa hè xanh..."
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">
                Nội dung chi tiết
              </label>
              <textarea
                name="message"
                rows="5"
                value={formData.message}
                onChange={handleChange}
                required
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm font-medium resize-none"
                placeholder="Nhập nội dung bạn cần hỗ trợ..."
              ></textarea>
            </div>

            <button 
              type="submit" 
              disabled={status === 'loading'}
              className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {status === 'loading' ? (
                <>
                  <Loader2 size={18} className="animate-spin" /> Đang gửi...
                </>
              ) : (
                <>
                  Gửi yêu cầu <Send size={18} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;