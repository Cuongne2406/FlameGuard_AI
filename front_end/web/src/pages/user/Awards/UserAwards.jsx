import React, { useState, useEffect, useContext } from "react";
import {
  Trophy,
  FileText,
  CloudUpload,
  CheckCircle2,
  Clock,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Info,
  X
} from "lucide-react";
import { awardService } from "../../../services/awardService";
import { AuthContext } from "../../../context/AuthContext";

const UserAwards = () => {
  const { user } = useContext(AuthContext);
  const [myApplications, setMyApplications] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    award_name: "Sinh viên 5 Tốt cấp Trường",
    description: "",
    evidence_url: ""
  });

  useEffect(() => {
    fetchMyAwards();
  }, []);

  const fetchMyAwards = async () => {
    try {
      const data = await awardService.getAwardsList();
      // Lọc ra các đơn của chính sinh viên này
      const filtered = data.filter(item => item.user_id === user.id);
      setMyApplications(filtered);
    } catch (err) {
      console.error("Lỗi khi tải danh sách khen thưởng:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await awardService.createAward({
        ...formData,
        user_id: user.id
      });
      setIsModalOpen(false);
      setFormData({ ...formData, description: "", evidence_url: "" });
      fetchMyAwards();
    } catch (err) {
      alert("Lỗi khi nộp hồ sơ. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
      {/* 1. TOP BANNER - PHONG CÁCH PREMIUM */}
      <div className="bg-gradient-to-br from-blue-700 to-indigo-800 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-blue-200">
        <div className="absolute right-[-30px] top-[-30px] opacity-10">
          <Trophy size={240} />
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="space-y-4 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                Đợt xét duyệt 2025
              </span>
            </div>
            <h1 className="text-4xl font-black leading-tight tracking-tight">
              Danh hiệu Sinh viên 5 Tốt
            </h1>
            <p className="text-blue-100 text-sm leading-relaxed opacity-90 font-medium">
              Chào mừng bạn đến với cổng nộp hồ sơ Danh hiệu cấp Trường. Vui lòng đọc kỹ 
              văn bản hướng dẫn trước khi tải lên minh chứng để đảm bảo hồ sơ hợp lệ.
            </p>
            <div className="flex gap-3 pt-2">
              <button className="flex items-center gap-2 bg-white text-blue-700 px-6 py-3 rounded-2xl font-black text-xs hover:bg-blue-50 transition-all shadow-lg active:scale-95">
                <FileText size={16} /> Xem Văn bản Hướng dẫn
              </button>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 bg-orange-500 text-white px-6 py-3 rounded-2xl font-black text-xs hover:bg-orange-600 transition-all shadow-lg shadow-orange-900/20 active:scale-95"
              >
                <CloudUpload size={16} /> Nộp Hồ sơ ngay
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. TRẠNG THÁI HỒ SƠ & LỊCH SỬ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lịch sử nộp đơn */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex justify-between items-center">
            <h3 className="font-black text-slate-800 flex items-center gap-2">
              <Clock className="text-blue-600" size={18} /> Lịch sử Nộp hồ sơ
            </h3>
            <span className="text-[10px] font-bold text-slate-400 uppercase">
              {myApplications.length} Bản ghi
            </span>
          </div>
          
          <div className="p-2">
            {myApplications.length > 0 ? (
              <div className="divide-y divide-slate-50">
                {myApplications.map((app) => (
                  <div key={app.id} className="p-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors rounded-2xl">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg
                        ${app.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-600' : 
                          app.status === 'REJECTED' ? 'bg-rose-50 text-rose-600' : 'bg-blue-50 text-blue-600'}`}>
                        <Trophy size={20} />
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-slate-800 uppercase tracking-tight">
                          {app.award_name}
                        </h4>
                        <p className="text-[11px] text-slate-400 font-bold flex items-center gap-2 mt-0.5">
                          Nộp ngày: {new Date(app.created_at).toLocaleDateString('vi-VN')} 
                          {app.evidence_url && (
                             <a href={app.evidence_url} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline flex items-center gap-1">
                               • <ExternalLink size={10} /> Xem minh chứng
                             </a>
                          )}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end gap-2">
                      <StatusBadge status={app.status} />
                      {app.status === 'PENDING' && (
                        <p className="text-[9px] font-black text-amber-500 uppercase flex items-center gap-1">
                          <AlertCircle size={10} /> Đang chờ duyệt
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-20 text-center space-y-4">
                <div className="bg-slate-50 w-16 h-16 rounded-3xl flex items-center justify-center mx-auto text-slate-300">
                  <FileText size={32} />
                </div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Bạn chưa nộp hồ sơ nào
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Thông tin bổ sung */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
            <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
              Lưu ý quan trọng
            </h4>
            <ul className="space-y-3">
              <li className="flex gap-3">
                <div className="shrink-0 w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                  <Info size={12} />
                </div>
                <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                  Minh chứng nên được lưu trữ trên Google Drive hoặc các trang lưu trữ công khai.
                </p>
              </li>
              <li className="flex gap-3">
                <div className="shrink-0 w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                  <Info size={12} />
                </div>
                <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                  Vui lòng mở quyền truy cập (Công khai) cho link minh chứng.
                </p>
              </li>
            </ul>
          </div>
          
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-6 border border-amber-100 shadow-sm group">
            <h4 className="text-[11px] font-black text-amber-600 uppercase tracking-widest mb-4">
              Hỗ trợ Kỹ thuật
            </h4>
            <p className="text-xs text-amber-900/60 font-medium leading-relaxed mb-4">
              Nếu gặp khó khăn khi upload minh chứng, vui lòng liên hệ Ban Công tác Sinh viên.
            </p>
            <button className="w-full py-3 bg-white text-orange-600 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-sm hover:shadow-md transition-all">
              Gửi phản hồi
            </button>
          </div>
        </div>
      </div>

      {/* 3. MODAL NỘP HỒ SƠ */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-100">
            {/* Modal Header */}
            <div className="bg-slate-50 p-8 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-200">
                  <CloudUpload size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-800">Nộp Hồ sơ Minh chứng</h3>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-tight">Cấp độ: Trường</p>
                </div>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Danh hiệu nộp đơn
                </label>
                <input 
                  type="text" 
                  readOnly 
                  value={formData.award_name}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold text-slate-500 outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Link minh chứng (Google Drive / PDF) <span className="text-red-500">*</span>
                </label>
                <div className="relative group">
                  <CloudUpload className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={20} />
                  <input 
                    required
                    type="url" 
                    placeholder="https://drive.google.com/..."
                    value={formData.evidence_url}
                    onChange={(e) => setFormData({...formData, evidence_url: e.target.value})}
                    className="w-full bg-white border border-slate-200 rounded-2xl pl-14 pr-5 py-4 text-sm font-bold text-slate-700 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm"
                  />
                </div>
                <p className="text-[10px] text-slate-400 italic ml-1">* Đảm bảo link đã được mở quyền truy cập công khai.</p>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Ghi chú bổ sung
                </label>
                <textarea 
                  rows={3}
                  placeholder="Mô tả tóm tắt các thành tích nổi bật của bạn..."
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold text-slate-700 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm resize-none"
                />
              </div>

              {/* Modal Actions */}
              <div className="flex gap-4 pt-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-4 text-xs font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors"
                >
                  Hủy bỏ
                </button>
                <button 
                  disabled={loading}
                  type="submit"
                  className="flex-[2] py-4 bg-blue-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  {loading ? "Đang xử lý..." : (
                    <>
                      Xác nhận Nộp đơn <ChevronRight size={16} />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper internal component
const StatusBadge = ({ status }) => {
  const configs = {
    PENDING: { color: "bg-amber-100 text-amber-600 border-amber-200", icon: <Clock size={12} />, label: "Đang chờ" },
    APPROVED: { color: "bg-emerald-100 text-emerald-600 border-emerald-200", icon: <CheckCircle2 size={12} />, label: "Đã duyệt" },
    REJECTED: { color: "bg-rose-100 text-rose-600 border-rose-200", icon: <AlertCircle size={12} />, label: "Từ chối" }
  };
  const config = configs[status] || configs.PENDING;
  
  return (
    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border flex items-center gap-1.5 ${config.color}`}>
      {config.icon} {config.label}
    </span>
  );
};

export default UserAwards;
