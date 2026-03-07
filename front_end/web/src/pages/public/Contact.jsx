import React from 'react';
import { Send, Phone, Mail, MapPin } from "lucide-react";

const Contact = () => (
  <div className="max-w-7xl mx-auto px-6 py-10">
    <div className="bg-white rounded-[32px] overflow-hidden shadow-xl border flex flex-col md:flex-row">
      <div className="md:w-1/2 bg-blue-700 p-12 text-white">
        <h2 className="text-3xl font-black mb-6">Liên hệ với chúng tôi</h2>
        <p className="text-blue-100 mb-10 leading-relaxed text-sm">
          Bạn có thắc mắc hoặc cần hỗ trợ về công tác Đoàn? Hãy để lại thông
          tin, chúng tôi sẽ phản hồi sớm nhất.
        </p>

        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
              <Phone size={18} />
            </div>
            <span className="text-sm font-medium">028.38.XXX.XXX</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
              <Mail size={18} />
            </div>
            <span className="text-sm font-medium">
              doankhoa.cntt@university.edu.vn
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
              <MapPin size={18} />
            </div>
            <span className="text-sm font-medium">
              Văn phòng Đoàn, Tầng 2, Tòa nhà A
            </span>
          </div>
        </div>
      </div>

      <div className="md:w-1/2 p-12 bg-white">
        <form className="space-y-5">
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Họ và tên
            </label>
            <input
              type="text"
              className="w-full border-b py-2 focus:border-blue-600 outline-none text-sm font-medium"
              placeholder="Nguyễn Văn A"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Email sinh viên
            </label>
            <input
              type="email"
              className="w-full border-b py-2 focus:border-blue-600 outline-none text-sm font-medium"
              placeholder="sinhvien@university.edu.vn"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Nội dung cần hỗ trợ
            </label>
            <textarea
              rows="4"
              className="w-full border rounded-xl p-3 mt-2 focus:ring-2 focus:ring-blue-600 outline-none text-sm"
              placeholder="Nhập tin nhắn của bạn..."
            ></textarea>
          </div>
          <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all">
            Gửi yêu cầu <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  </div>
);
export default Contact;