import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { eventService } from "../../../services/eventService";
import {
  Search,
  Calendar as CalendarIcon,
  Users,
  MapPin,
  QrCode,
  ChevronLeft,
  ChevronRight,
  Bell,
  Star,
  X,
  Download,
  Share2,
  Trophy,
  CheckCircle2,
  Layout,
  MessageSquare,
} from "lucide-react";

// --- 1. MODAL CHI TIẾT THỂ LỆ (Ảnh 1) ---
const EventDetailModal = ({ isOpen, onClose, onRegisterClick }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      <div className="relative bg-white w-full max-w-[900px] max-h-[90vh] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-10 p-2 bg-white/20 hover:bg-white/40 rounded-full text-white transition-colors"
        >
          <X size={20} />
        </button>
        <div className="overflow-y-auto flex-1">
          <div className="h-64 bg-slate-900 relative">
            <img
              src={isOpen?.banner_url || "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80"}
              className="w-full h-full object-cover opacity-40"
              alt="banner"
            />
            <div className="absolute inset-0 p-10 flex flex-col justify-end bg-gradient-to-t from-slate-900 via-transparent">
              <div className="flex gap-2 mb-4">
                <span className="bg-orange-500 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase">
                  Đang mở đăng ký
                </span>
                <span className="bg-slate-700 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase">
                  Học thuật
                </span>
              </div>
              <h2 className="text-4xl font-black text-white flex items-center gap-3">
                <Trophy className="text-yellow-400" size={36} /> {isOpen?.name || "Chi tiết Sự kiện"}
              </h2>
            </div>
          </div>
          <div className="p-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                <CalendarIcon
                  className="mx-auto text-blue-600 mb-2"
                  size={20}
                />
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  Thời gian
                </p>
                <p className="text-xs font-black text-slate-800">{isOpen?.start_time ? new Date(isOpen.start_time).toLocaleDateString() : "Chưa xác định"}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                <MapPin className="mx-auto text-purple-600 mb-2" size={20} />
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  Địa điểm
                </p>
                <p className="text-xs font-black text-slate-800">
                  {isOpen?.location || "Chưa xác định"}
                </p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                <Users className="mx-auto text-emerald-600 mb-2" size={20} />
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  Sức chứa
                </p>
                <p className="text-xs font-black text-slate-800">
                  {isOpen?.capacity || "Chưa xác định"}
                </p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                <Star className="mx-auto text-orange-600 mb-2" size={20} />
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  Quyền lợi
                </p>
                <p className="text-xs font-black text-slate-800">+ Điểm RL</p>
              </div>
            </div>
            <h4 className="font-black text-slate-800 flex items-center gap-2 mb-3">
              <Layout size={18} className="text-blue-600" /> Giới thiệu chung
            </h4>
            <p className="text-sm text-slate-500 leading-relaxed font-medium italic mb-6">
              {isOpen?.description || "Chưa có thông tin mô tả."}
            </p>
          </div>
        </div>
        <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <button className="text-blue-600 font-bold text-xs flex items-center gap-2 px-4 py-2 hover:bg-blue-50 rounded-xl transition-all">
            <Share2 size={16} /> Chia sẻ
          </button>
          <button
            onClick={() => onRegisterClick(isOpen)}
            className="px-10 py-4 bg-blue-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-blue-200 hover:scale-105 transition-all flex items-center gap-2"
          >
            Tạo Đội & Đăng ký ngay
          </button>
        </div>
      </div>
    </div>
  );
};

// --- 2. MODAL FORM ĐĂNG KÝ (Ảnh 2) ---
const RegistrationModal = ({ isOpen, onClose, onSuccess }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      <div className="relative bg-white w-full max-w-[550px] rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="bg-slate-900 p-6 text-white flex justify-between items-center">
          <div>
            <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">
              Xác nhận đăng ký
            </p>
            <h3 className="text-lg font-black">{isOpen?.event?.name || 'Đăng ký tham gia'}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-8 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 ml-2">
                Họ và tên
              </label>
              <input
                disabled
                value={isOpen?.user?.full_name || ""}
                className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-black text-slate-400"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 ml-2">
                MSSV
              </label>
              <input
                disabled
                value={isOpen?.user?.student_id || ""}
                className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-black text-slate-400"
              />
            </div>
          </div>
          <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100 flex gap-3">
            <input type="checkbox" className="mt-1" />
            <p className="text-[11px] text-orange-800 font-bold leading-relaxed">
              Tôi cam kết tham gia đúng giờ. Nếu vắng mặt không lý do, tôi đồng
              ý bị <span className="text-red-600">trừ 2 điểm rèn luyện</span>.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black text-sm"
            >
              Hủy
            </button>
            <button
              onClick={() => onSuccess(isOpen?.event)}
              className="flex-[2] py-4 bg-blue-600 text-white rounded-2xl font-black text-sm shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
            >
              Xác nhận Đăng ký
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- 3. MODAL THÀNH CÔNG (Ảnh 3) ---
const SuccessModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      <div className="relative bg-white w-full max-w-[400px] p-10 rounded-[3rem] shadow-2xl text-center animate-in zoom-in-95 duration-300">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 size={48} fill="currentColor" className="text-white" />
        </div>
        <h3 className="text-2xl font-black text-slate-800 mb-2 tracking-tight">
          Đăng ký thành công!
        </h3>
        <p className="text-slate-500 text-xs font-medium mb-8 leading-relaxed">
          Hệ thống đã ghi nhận tham gia. Hãy kiểm tra Email để nhận vé điện tử
          nhé!
        </p>
        <button
          onClick={onClose}
          className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-blue-200 flex items-center justify-center gap-2 transition-all active:scale-95"
        >
          <QrCode size={18} /> Đăng kí thành công
        </button>
      </div>
    </div>
  );
};

// --- 4. MODAL CHỨNG NHẬN (Trigger từ Card hoàn thành) ---
const CertificateModal = ({ isOpen, onClose, studentName }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      <div className="relative bg-[#f8fafc] w-full max-w-[1000px] h-[90vh] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-10 p-2 bg-white rounded-full shadow-md"
        >
          <X size={20} className="text-slate-400" />
        </button>
        <div className="flex-1 overflow-y-auto p-8 lg:p-12">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-yellow-400 rounded-full mb-6 shadow-xl shadow-yellow-200">
              <Star className="text-white fill-white" size={40} />
            </div>
            <h2 className="text-3xl font-black text-slate-800 tracking-tight">
              Tuyệt vời, <span className="text-blue-600">{studentName}!</span>
            </h2>
            <p className="text-slate-500 font-medium mt-2">
              Bạn đã hoàn thành xuất sắc{" "}
              <span className="font-bold text-slate-700">
                {isOpen?.name || 'Sự kiện'}
              </span>
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8">
              <div className="bg-white border-[16px] border-yellow-50 p-10 rounded-xl shadow-sm relative overflow-hidden flex flex-col items-center justify-between text-center min-h-[500px] ring-1 ring-yellow-100">
                <div className="space-y-6 z-10 w-full">
                  <p className="uppercase tracking-[0.4em] text-[10px] font-black text-orange-500">
                    CHỨNG NHẬN ĐIỆN TỬ
                  </p>
                  <h1 className="text-5xl md:text-7xl font-serif font-bold text-slate-800">
                    CERTIFICATE
                  </h1>
                  <div className="py-6 border-y border-slate-50">
                    <p className="text-sm text-slate-500 mb-3 font-medium">
                      Trân trọng trao tặng cho
                    </p>
                    <h3 className="text-3xl md:text-5xl font-black text-blue-600 border-b-2 border-blue-600 pb-2 px-4 inline-block">
                      {studentName}
                    </h3>
                  </div>
                  <h4 className="text-2xl font-black text-slate-800 uppercase italic">
                    Cầu thủ xuất sắc nhất giải
                  </h4>
                </div>
                <div className="mt-10 w-full flex justify-between items-end px-4">
                  <div className="text-left">
                    <QrCode size={50} className="mb-2 text-slate-800" />
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
                      ID: DYUS-2025-0991
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-serif italic text-blue-900 text-xl">
                      Nguyễn Văn A
                    </p>
                    <div className="h-[2px] w-32 bg-slate-200 my-2 ml-auto" />
                    <p className="text-[10px] font-black text-slate-400 uppercase">
                      Bí thư Đoàn Khoa
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex justify-center gap-4 mt-8">
                <button className="flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all">
                  <Download size={20} /> Tải PDF
                </button>
                <button className="flex items-center gap-2 px-8 py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl font-black text-sm hover:bg-slate-50 transition-all">
                  <Share2 size={20} /> Chia sẻ
                </button>
              </div>
            </div>
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm text-center">
                <h4 className="font-black text-slate-800 mb-4 flex items-center justify-center gap-2">
                  <Star className="text-yellow-500 fill-yellow-500" size={18} />{" "}
                  Phần thưởng
                </h4>
                <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-100">
                  <p className="text-3xl font-black text-emerald-600">+5</p>
                  <p className="text-[10px] font-bold text-emerald-700 uppercase">
                    Điểm rèn luyện
                  </p>
                </div>
                <p className="text-[9px] text-slate-400 mt-4 italic">
                  * Hệ thống đã tự động cộng điểm.
                </p>
              </div>
              <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm text-center">
                <h4 className="font-black text-slate-800 mb-4 text-sm uppercase">
                  Đánh giá Sự kiện
                </h4>
                <div className="flex justify-center gap-1.5 mb-5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      size={24}
                      className={
                        s <= 4
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-slate-200"
                      }
                    />
                  ))}
                </div>
                <textarea
                  placeholder="Để lại cảm nghĩ của bạn..."
                  className="w-full p-4 bg-slate-50 rounded-2xl text-xs min-h-[100px] outline-none"
                />
                <button
                  onClick={onClose}
                  className="w-full mt-4 py-4 bg-slate-900 text-white rounded-2xl text-xs font-black transition-all hover:bg-black"
                >
                  Gửi nhận xét & Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- 5. MODAL VÉ ĐIỆN TỬ (Ảnh E-Ticket) ---
const TicketModal = ({ isOpen, onClose, studentInfo }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[1300] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      <div className="relative bg-white w-full max-w-[450px] rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Header của Vé */}
        <div className="bg-blue-600 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 hover:bg-white/20 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
          <div className="flex items-center gap-2 mb-2">
            <QrCode size={16} />
            <p className="text-[10px] font-black uppercase tracking-widest opacity-90">
              Vé điện tử (E-Ticket)
            </p>
          </div>
          <h3 className="text-xl font-black leading-tight">
            💻 Ngày hội Công nghệ - IT Tech Day 2026
          </h3>
          <div className="flex items-center gap-4 mt-3 text-[11px] font-bold">
            <span className="flex items-center gap-1">
              <MapPin size={12} /> Hội trường A
            </span>
            <span className="flex items-center gap-1 text-emerald-300">
              ● Đang diễn ra
            </span>
          </div>
        </div>

        {/* Thân Vé */}
        <div className="p-8 flex flex-col items-center">
          {/* Thông tin sinh viên */}
          <div className="flex items-center gap-4 w-full mb-8">
            <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-slate-100">
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                alt="avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h4 className="font-black text-slate-800">{studentInfo.name}</h4>
              <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase mt-1">
                <span>MSSV: {studentInfo.id}</span>
                <span>Lớp: {studentInfo.class}</span>
              </div>
            </div>
          </div>

          {/* QR Code Section */}
          <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 relative group">
            <div className="bg-white p-4 rounded-2xl shadow-inner">
              <QrCode size={180} className="text-slate-800" />
            </div>
            <div className="mt-4 text-center">
              <p className="text-[10px] font-bold text-slate-400 animate-pulse">
                🔄 Mã tự động làm mới sau 15s...
              </p>
            </div>
          </div>

          {/* Trạng thái & Hướng dẫn */}
          <div className="mt-8 w-full space-y-4">
            <div className="bg-yellow-50 text-yellow-700 py-3 rounded-2xl text-center font-black text-xs border border-yellow-100">
              ● Chưa Check-in
            </div>
            <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 flex gap-3">
              <Bell className="text-blue-500 shrink-0" size={16} />
              <p className="text-[10px] text-blue-700 font-medium leading-relaxed">
                Vui lòng tăng độ sáng màn hình và đưa mã này vào máy quét tại
                bàn Check-in.
              </p>
            </div>
            <button className="w-full text-blue-600 font-bold text-[10px] hover:underline">
              Máy quét không nhận? Bấm vào đây để xem Mã Barcode (Mã vạch)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
// --- MAIN PORTAL COMPONENT ---
const Event = () => {
  const { user } = useContext(AuthContext);
  const [isCertOpen, setIsCertOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [regOpen, setRegOpen] = useState(false); // Can hold { event, user } object to pass to modal
  const [successOpen, setSuccessOpen] = useState(false);
  const [ticketOpen, setTicketOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const [myEvents, setMyEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [allEventsList, myEventsList] = await Promise.all([
          eventService.getEvents(),
          eventService.getUserEvents()
        ]);
        setEvents(allEventsList || []);
        
        // Transform myEvents to match UI requirements
        const formattedMyEvents = (myEventsList || []).map(evt => {
           const d = new Date(evt.start_time);
           return {
              id: evt.id,
              title: evt.name,
              date: evt.start_time ? d.getDate() : '-',
              time: evt.start_time ? d.toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'}) : 'Tuỳ chọn'
           };
        });
        setMyEvents(formattedMyEvents);
      } catch (err) {
        console.error("Failed to load events", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleRegisterConfirmed = async (event) => {
    if (!user || !event) return;
    try {
      await eventService.registerForEvent(event.id, user.id);
      setRegOpen(false);
      setSuccessOpen(true);
    } catch (err) {
      alert("Đăng ký thất bại: " + (err.message || "Lỗi hệ thống"));
    }
  };

  const categories = [
    "Tất cả",
    "Học thuật 📘",
    "Văn thể mỹ 🎨",
    "Tình nguyện ❤️",
    "Sắp diễn ra",
  ];

  const studentInfo = {
    name: user?.full_name || "Lê Trọng Phúc Hậu",
    id: user?.student_id || "23800926",
    class: user?.student_id ? "" : "23CT112",
  };

  return (
    <div className="p-8 space-y-8 bg-slate-50 min-h-screen animate-in fade-in duration-700">
      {/* MODALS RENDER */}
      <EventDetailModal
        isOpen={detailOpen}
        onClose={() => setDetailOpen(false)}
        onRegisterClick={(evt) => {
          setDetailOpen(false);
          setRegOpen({ event: evt, user });
        }}
      />
      <RegistrationModal
        isOpen={regOpen}
        onClose={() => setRegOpen(false)}
        onSuccess={handleRegisterConfirmed}
      />
      <SuccessModal
        isOpen={successOpen}
        onClose={() => setSuccessOpen(false)}
      />
      <CertificateModal
        isOpen={isCertOpen}
        onClose={() => setIsCertOpen(false)}
        studentName="Đoàn Văn Phúc"
      />
      {/* MODALS RENDER - Bổ sung TicketModal vào đây */}
      <TicketModal
        isOpen={ticketOpen}
        onClose={() => setTicketOpen(false)}
        studentInfo={studentInfo}
      />

      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-800 flex items-center gap-2">
            <Star className="text-orange-500 fill-orange-500" size={32} /> Khám
            phá Sự kiện
          </h2>
          <p className="text-slate-500 font-medium">
            Phát triển bản thân qua các hoạt động học thuật và cộng đồng.
          </p>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Tìm kiếm cuộc thi..."
            className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-100 rounded-2xl text-sm outline-none shadow-sm focus:ring-2 focus:ring-blue-100 transition-all"
          />
        </div>
        {categories.map((cat, i) => (
          <button
            key={i}
            className={`px-6 py-3 rounded-2xl text-xs font-black shadow-sm transition-all ${i === 0 ? "bg-blue-600 text-white" : "bg-white text-slate-600 border border-slate-100 hover:bg-slate-50"}`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT CONTENT */}
        <div className="lg:col-span-8 space-y-8">
          {/* AI BANNER */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-[2.5rem] p-8 text-white flex items-center justify-between shadow-2xl shadow-blue-100 relative overflow-hidden group">
            <div className="relative z-10 max-w-md">
              <span className="text-[10px] font-black bg-white/20 px-3 py-1 rounded-full uppercase tracking-widest mb-4 inline-block">
                Gợi ý từ AI 🤖
              </span>
              <h3 className="text-2xl font-black mb-2 leading-tight">
                Hội thảo GenAI trong Lập trình
              </h3>
              <p className="text-blue-100 text-sm mb-6 leading-relaxed">
                Dựa trên chuyên ngành Kỹ thuật Phần mềm của bạn.
              </p>
              <button className="px-8 py-3.5 bg-white text-blue-600 rounded-2xl font-black text-sm hover:scale-105 transition-all flex items-center gap-2">
                Tham gia ngay <ChevronRight size={18} />
              </button>
            </div>
            <div className="absolute right-0 bottom-0 opacity-10 group-hover:scale-110 transition-transform duration-1000">
              <QrCode size={200} />
            </div>
          </div>

          {/* EVENTS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {loading ? (
               <div className="col-span-3 text-center py-10 text-slate-500 font-bold">Đang tải sự kiện...</div>
            ) : events.length === 0 ? (
               <div className="col-span-3 text-center py-10 text-slate-500 font-bold">Không có sự kiện nào.</div>
            ) : events.map(event => (
              <div key={event.id} className={`bg-white rounded-[2rem] border overflow-hidden shadow-sm transition-all duration-500 group relative ${event.status === 'LIVE' ? 'border-blue-500 shadow-xl' : 'border-slate-100 hover:shadow-xl'} ${event.status === 'ENDED' ? 'opacity-75 grayscale-[0.5] hover:grayscale-0 hover:opacity-100' : ''}`}>
                
                {/* Image Section */}
                <div className={`h-48 relative flex flex-col items-center justify-center text-white ${event.status === 'LIVE' ? 'bg-blue-900' : event.status === 'ENDED' ? 'bg-slate-200' : 'bg-slate-900'}`}>
                  {event.status === 'ENDED' ? (
                     <>
                        <img 
                          src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80" 
                          className="w-full h-full object-cover opacity-30" 
                          alt="ended" 
                        />
                        <span className="absolute top-4 left-4 bg-slate-500 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
                          ✓ Đã hoàn thành
                        </span>
                        <span className="text-5xl group-hover:scale-125 transition-transform duration-500">
                          🏁
                        </span>
                     </>
                  ) : event.status === 'LIVE' ? (
                     <>
                        <div className="absolute top-4 left-4 bg-blue-500 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
                          ● Đang diễn ra
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-2">
                          {event.name}
                        </span>
                        <span className="text-3xl font-black">🔥</span>
                     </>
                  ) : (
                     <img
                       src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80"
                       className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-all duration-700"
                       alt="upcoming"
                     />
                  )}
                  {event.status === 'PUBLISHED' && (
                     <span className="absolute top-4 left-4 bg-orange-500 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
                        ● Đang mở đăng ký
                     </span>
                  )}
                </div>

                {/* Content Section */}
                <div className="p-6 space-y-4">
                  <h4 className={`font-black text-lg mb-4 leading-tight ${event.status === 'LIVE' ? 'text-blue-600' : 'text-slate-800'}`}>
                    {event.name}
                  </h4>
                  {event.status === 'DRAFT' || event.status === 'PUBLISHED' ? (
                     <>
                        <div className="space-y-2 text-[11px] text-slate-500 font-bold">
                          <div className="flex items-center gap-2">
                            <CalendarIcon size={14} /> {event.start_time ? new Date(event.start_time).toLocaleDateString() : 'Chưa xác định'}
                          </div>
                          <div className="text-orange-600">
                            🔥 Sức chứa: {event.capacity || 'Không giới hạn'}
                          </div>
                        </div>
                        <button
                          onClick={() => {
                             // This should ideally fetch event details and pass to DetailModal, but for simplicity we directly open reg Open.
                           setDetailOpen(event);
                          }}
                          className="w-full py-4 bg-slate-50 text-slate-800 rounded-2xl text-[11px] font-black hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                        >
                          Xem chi tiết & Thể lệ
                        </button>
                     </>
                  ) : event.status === 'LIVE' ? (
                     <button
                        onClick={() => setTicketOpen(true)}
                        className="w-full py-4 bg-blue-600 text-white rounded-2xl text-[11px] font-black shadow-lg shadow-blue-200 flex items-center justify-center gap-2 hover:bg-blue-700 transition-all active:scale-95"
                     >
                        <QrCode size={18} /> HIỆN MÃ QR CHECK-IN
                     </button>
                  ) : (
                     <button
                        onClick={() => setIsCertOpen(event)}
                        className="w-full py-4 bg-emerald-50 text-emerald-600 rounded-2xl text-[11px] font-black border border-emerald-100 hover:bg-emerald-600 hover:text-white transition-all"
                     >
                        Nhận chứng nhận & Điểm RL
                     </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm">
            <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-8 flex items-center gap-3">
              <CalendarIcon size={20} className="text-blue-600" /> Sự kiện của
              tôi
            </h4>
            <div className="bg-red-50 border border-red-100 rounded-2xl p-5 mb-8 flex gap-4">
              <Bell
                className="text-red-500 shrink-0 animate-bounce"
                size={20}
              />
              <p className="text-[11px] text-red-700 font-bold leading-relaxed uppercase">
                Bạn có 1 sự kiện sắp bắt đầu sau 2 giờ nữa.
              </p>
            </div>
            <div className="space-y-6">
              {myEvents.map((ev) => (
                <div
                  key={ev.id}
                  className="flex items-center gap-4 group cursor-pointer p-2 hover:bg-slate-50 rounded-2xl transition-all"
                >
                  <div className="w-14 h-14 bg-white rounded-2xl flex flex-col items-center justify-center border border-slate-100 group-hover:border-blue-200 group-hover:shadow-sm">
                    <span className="text-[10px] font-black text-slate-400">
                      T3
                    </span>
                    <span className="text-xl font-black text-slate-800">
                      {ev.date}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h5 className="text-sm font-black text-slate-800 group-hover:text-blue-600 transition-colors">
                      {ev.title}
                    </h5>
                    <p className="text-[10px] text-slate-400 font-bold">
                      {ev.time}
                    </p>
                  </div>
                  <ChevronRight
                    size={18}
                    className="text-slate-300 group-hover:translate-x-1 transition-transform"
                  />
                </div>
              ))}
            </div>
            <div className="mt-10 pt-10 border-t border-slate-50">
              <div className="flex items-center justify-between mb-6">
                <span className="text-sm font-black text-slate-800">
                  Tháng 3, 2026
                </span>
                <div className="flex gap-2">
                  <ChevronLeft
                    size={20}
                    className="text-slate-300 cursor-pointer"
                  />
                  <ChevronRight
                    size={20}
                    className="text-slate-600 cursor-pointer"
                  />
                </div>
              </div>
              <div className="grid grid-cols-7 gap-y-3 text-center">
                {["CN", "T2", "T3", "T4", "T5", "T6", "T7"].map((d) => (
                  <span
                    key={d}
                    className="text-[10px] font-black text-slate-300"
                  >
                    {d}
                  </span>
                ))}
                {[...Array(31)].map((_, i) => (
                  <button
                    key={i}
                    className={`text-[12px] font-bold h-10 flex items-center justify-center rounded-xl transition-all ${i + 1 === 3 ? "bg-blue-600 text-white shadow-lg shadow-blue-200" : "hover:bg-slate-50 text-slate-600"}`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FLOATING CHAT */}
      {/* Đã chuyển GlobalChatbot sang UserLayout */}
    </div>
  );
};

export default Event;
