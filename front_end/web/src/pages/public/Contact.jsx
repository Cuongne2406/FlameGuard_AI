import React, { useState } from 'react';
import { Send, Phone, Mail, MapPin, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { publicService } from '../../services/publicService';

const Contact = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.full_name || !formData.email || !formData.message) {
      setStatusMessage({ type: 'error', text: 'Vui lòng điền đầy đủ tất cả các trường.' });
      return;
    }

    setSubmitting(true);
    setStatusMessage(null);
    try {
      await publicService.submitContact(formData);
      setStatusMessage({ type: 'success', text: 'Gửi yêu cầu liên hệ thành công! Chúng tôi sẽ phản hồi sớm nhất.' });
      setFormData({ full_name: '', email: '', message: '' });
    } catch (err) {
      setStatusMessage({ type: 'error', text: err.message || 'Lỗi khi gửi thông tin liên hệ. Vui lòng thử lại.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 flex flex-col md:flex-row">
        <div className="md:w-1/2 bg-blue-700 p-10 md:p-12 text-white">
          <h2 className="text-3xl font-bold tracking-tight mb-4">Liên hệ với chúng tôi</h2>
          <p className="text-blue-100 mb-8 leading-relaxed text-sm">
            Bạn có thắc mắc hoặc cần hỗ trợ về công tác Đoàn – Hội, phong trào Sinh viên 5 Tốt? 
            Hãy để lại thông tin, Ban Thường vụ sẽ tiếp nhận và phản hồi sớm nhất.
          </p>

          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                <Phone size={18} />
              </div>
              <div>
                <p className="text-xs text-blue-200 font-medium">Đường dây nóng</p>
                <span className="text-sm font-semibold">0251.3952.922</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                <Mail size={18} />
              </div>
              <div>
                <p className="text-xs text-blue-200 font-medium">Hòm thư điện tử</p>
                <span className="text-sm font-semibold">doanhoi@lhu.edu.vn</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                <MapPin size={18} />
              </div>
              <div>
                <p className="text-xs text-blue-200 font-medium">Địa chỉ văn phòng</p>
                <span className="text-sm font-semibold">Văn phòng Đoàn - Hội, Cơ sở 1, ĐH Lạc Hồng</span>
              </div>
            </div>
          </div>
        </div>

        <div className="md:w-1/2 p-8 md:p-12 bg-white">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider block mb-1">
                Họ và tên <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none text-sm text-slate-800 font-medium"
                placeholder="Nguyễn Văn A"
                required
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider block mb-1">
                Email sinh viên / liên hệ <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none text-sm text-slate-800 font-medium"
                placeholder="sinhvien@lhu.edu.vn"
                required
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider block mb-1">
                Nội dung cần hỗ trợ <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows="4"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full border border-slate-200 rounded-lg p-3.5 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none text-sm text-slate-800 font-medium"
                placeholder="Nhập chi tiết nội dung thắc mắc hoặc đề xuất của bạn..."
                required
              ></textarea>
            </div>

            {statusMessage && (
              <div className={`p-3.5 rounded-lg flex items-center gap-2 text-xs font-semibold ${
                statusMessage.type === 'success' 
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                  : 'bg-rose-50 text-rose-700 border border-rose-200'
              }`}>
                {statusMessage.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                {statusMessage.text}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Đang gửi...
                </>
              ) : (
                <>
                  Gửi yêu cầu <Send size={16} />
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