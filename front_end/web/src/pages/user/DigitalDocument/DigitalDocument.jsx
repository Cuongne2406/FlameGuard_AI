import React, { useState, useEffect } from "react";
import { documentService } from "../../../services/documentService";
import {
  Search,
  FileText,
  BarChart2,
  CreditCard,
  ArrowRight,
  Download,
  Clock,
  FileCheck,
  Filter,
  MessageSquare,
  ChevronRight,
  Printer,
  X,
  CheckCircle,
} from "lucide-react";

const DigitalDocument = () => {
  const quickServices = [
    {
      id: 1,
      title: "Cấp lại thẻ Đoàn/Hội",
      desc: "Tích hợp mã QR điện tử, không cần thẻ cứng.",
      icon: <CreditCard className="text-purple-600" size={24} />,
      buttonText: "Đăng ký cấp lại",
      primary: false,
    },
  ];

  const [requests, setRequests] = useState([]);
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoc, setSelectedDoc] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reqData, docData] = await Promise.all([
          documentService.getRequests(),
          documentService.getDocuments()
        ]);
        setRequests(reqData);
        setDocs(docData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCreateRequest = async (type) => {
    try {
      const newReq = await documentService.createRequest(type);
      setRequests([newReq, ...requests]);
      alert("Đã gửi yêu cầu thành công!");
    } catch (err) {
      alert("Lỗi khi gửi yêu cầu.");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* 1. BREADCRUMB & HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Trang chủ <ChevronRight size={10} />{" "}
            <span className="text-blue-600">Văn bản & Thủ tục</span>
          </div>
          <h2 className="text-2xl font-black text-slate-800">
            Trung tâm Dịch vụ Hành chính Số
          </h2>
          <p className="text-slate-500 text-sm font-medium">
            Quản lý hồ sơ, yêu cầu văn bản và theo dõi tiến độ xử lý trực tuyến.
          </p>
        </div>

        <div className="relative w-full md:w-80">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Tìm kiếm loại giấy tờ, biểu mẫu..."
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-100 rounded-2xl text-xs focus:ring-2 focus:ring-blue-100 outline-none shadow-sm"
          />
        </div>
      </div>

      {/* 2. QUICK SERVICES (1-CLICK) */}
      <div className="space-y-4">
        <h4 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em] flex items-center gap-2">
          ⚡ Thủ tục nhanh (1-Click)
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickServices.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm hover:shadow-md transition-all group"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="p-4 bg-slate-50 rounded-2xl group-hover:scale-110 transition-transform">
                  {service.icon}
                </div>
                <FileCheck className="text-slate-100" size={32} />
              </div>
              <h5 className="text-lg font-black text-slate-800 mb-2">
                {service.title}
              </h5>
              <p className="text-xs text-slate-400 font-medium leading-relaxed mb-8 h-10">
                {service.desc}
              </p>
              <button
                onClick={() => handleCreateRequest(service.title)}
                className={`w-full py-3.5 rounded-xl text-[11px] font-black flex items-center justify-center gap-2 transition-all
                ${service.primary
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-100 hover:bg-blue-700"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                  }
              `}
              >
                {service.buttonText}{" "}
                {service.primary ? (
                  <ArrowRight size={14} />
                ) : (
                  <Download size={14} />
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* 3. TRẠNG THÁI ĐANG XỬ LÝ (4/12) */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-[2rem] border-2 border-blue-100 p-8 shadow-sm relative overflow-hidden">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <Clock size={20} />
              </div>
              <h4 className="text-sm font-black text-slate-800 uppercase">
                Thủ tục đang xử lý
              </h4>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping ml-auto"></div>
            </div>

            <div className="space-y-6">
              {loading ? (
                <p className="text-xs text-slate-400 font-bold">Đang tải yêu cầu...</p>
              ) : requests.length === 0 ? (
                <p className="text-xs text-slate-400 font-bold">Chưa có thủ tục nào đang xử lý.</p>
              ) : (
                requests.map(req => {
                  // Logic mapping trạng thái
                  const statusMap = {
                    'PENDING': { text: 'Chờ tiếp nhận', progress: 20, time: 'Dự kiến: 24h' },
                    'PROCESSING': { text: 'Đang xử lý', progress: 60, time: 'Dự kiến: 4h' },
                    'APPROVED': { text: 'Đã hoàn tất', progress: 100, time: 'Đã xử lý xong' },
                    'REJECTED': { text: 'Đã từ chối', progress: 0, time: 'Vui lòng kiểm tra lý do' }
                  };
                  const s = statusMap[req.status] || statusMap['PENDING'];

                  return (
                    <div key={req.id} className="space-y-6 border-b border-slate-100 pb-6 mb-6 last:border-0 last:pb-0 last:mb-0">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                          Mã HS: #{req.id.toString().slice(0, 8)}
                        </span>
                        <h5 className="font-black text-slate-800 text-base mt-1">
                          {req.title || req.document_type}
                        </h5>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between items-end">
                          <span className="bg-blue-50 text-blue-600 text-[10px] font-black px-2 py-1 rounded">
                            {s.text}
                          </span>
                          <span className="text-blue-600 font-black text-sm">{s.progress}%</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div className={`bg-blue-600 h-full rounded-full shadow-[0_0_8px_rgba(37,99,235,0.4)]`} style={{ width: `${s.progress}%` }}></div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-[11px] text-slate-400 font-bold">
                        <Clock size={14} /> {s.time}
                      </div>

                      <button className="w-full py-3 bg-slate-50 text-slate-500 rounded-xl text-[10px] font-black border border-slate-100 hover:bg-slate-100 transition-colors">
                        XEM CHI TIẾT TIẾN ĐỘ
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* 4. DANH SÁCH VĂN BẢN (8/12) */}
        <div className="lg:col-span-8">
          <div className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div className="flex gap-4 border-b border-slate-50">
                {["Đoàn - Hội Khoa", "Đoàn Trường", "Mẫu đơn"].map((tab, i) => (
                  <button
                    key={i}
                    className={`pb-4 text-xs font-black uppercase tracking-widest transition-all
                    ${i === 0 ? "text-blue-600 border-b-2 border-blue-600" : "text-slate-400 hover:text-slate-600"}
                  `}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
                <Filter size={20} />
              </button>
            </div>

            <div className="space-y-4">
              {loading ? (
                <p className="text-xs text-slate-400 font-bold">Đang tải văn bản...</p>
              ) : (
                docs.map((doc) => (
                  <div
                    key={doc.id}
                    onClick={() => setSelectedDoc(doc)}
                    className="flex items-center gap-5 p-5 rounded-2xl hover:bg-slate-50 transition-all group cursor-pointer border border-transparent hover:border-blue-100 hover:shadow-sm"
                  >
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-[12px] shrink-0 shadow-sm
                      ${(doc.document_type || "pdf").toLowerCase().includes("pdf") ? "bg-red-50 text-red-500" : (doc.document_type || "doc").toLowerCase().includes("doc") ? "bg-blue-50 text-blue-600" : "bg-emerald-50 text-emerald-600"}
                    `}
                    >
                      {doc.document_type && doc.document_type.toLowerCase().includes("pdf") 
                          ? "PDF" 
                          : doc.document_type && doc.document_type.toLowerCase().includes("doc") 
                            ? "DOC" 
                            : "TXT"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="text-sm font-black text-slate-700 group-hover:text-blue-600 transition-colors truncate">
                        {doc.title || "Tài liệu không tên"}
                      </h5>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-[10px] text-slate-400 font-bold uppercase truncate">
                          Mã: {doc.document_code || "CHƯA CÓ MÃ"}
                        </span>
                        <span className="w-1 h-1 bg-slate-200 rounded-full shrink-0"></span>
                        <span className="text-[10px] text-slate-400 font-bold shrink-0">
                          {doc.request_date ? new Date(doc.request_date).toLocaleDateString('vi-VN') : "N/A"}
                        </span>
                      </div>
                    </div>
                    <ChevronRight
                      size={18}
                      className="text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all shrink-0"
                    />
                  </div>
                ))
              )}
            </div>

            <button className="w-full mt-6 py-3 text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] hover:underline">
              Xem tất cả văn bản
            </button>
          </div>
        </div>
      </div>

      {/* FAB (Floating Action Button) - Trợ lý AI */}
      {/* <button className="fixed bottom-8 right-8 flex items-center gap-3 px-6 py-4 bg-white rounded-full shadow-2xl border border-blue-50 group hover:scale-105 transition-all z-50">
        <span className="text-xs font-black text-slate-700">
          Hỏi Trợ lý DYUS về thủ tục
        </span>
        <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg shadow-blue-200">
          <MessageSquare size={20} fill="currentColor" />
        </div>
      </button> */}

      {/* DOCUMENT VIEWER MODAL */}
      {selectedDoc && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
          {/* Overlay */}
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" 
            onClick={() => setSelectedDoc(null)}
          ></div>

          {/* Modal Container */}
          <div className="relative bg-white w-full max-w-4xl h-full max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300 border border-slate-100">
            {/* Header Toolbar */}
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/80 backdrop-blur-md z-10">
              <div className="flex items-center gap-3">
                <div className="bg-red-50 text-red-600 p-2 rounded-xl shrink-0">
                  <FileText size={16} />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-800 tracking-wide">TRÍCH XUẤT VĂN BẢN</h4>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">
                    Số hiệu: {selectedDoc.document_code || 'N/A'}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-2 px-3 py-2 hover:bg-white rounded-xl text-slate-500 text-[10px] font-bold shadow-sm transition-all border border-transparent hover:border-slate-200">
                  <Download size={14} /> TẢI VỀ
                </button>
                <button className="flex items-center gap-2 px-3 py-2 hover:bg-white rounded-xl text-slate-500 text-[10px] font-bold shadow-sm transition-all border border-transparent hover:border-slate-200">
                  <Printer size={14} /> IN (PDF)
                </button>
                <div className="w-px h-6 bg-slate-200 mx-1"></div>
                <button 
                  className="p-2 bg-red-50 hover:bg-red-100 rounded-xl text-red-500 transition-all cursor-pointer" 
                  onClick={() => setSelectedDoc(null)}
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Viewer Pane (Giấy A4) */}
            <div className="flex-1 overflow-auto p-4 md:p-8 bg-slate-200/50 custom-scrollbar">
              <div className="bg-white mx-auto w-full max-w-2xl min-h-[800px] shadow-lg md:p-12 p-6 flex flex-col gap-6 relative">
                {/* Quốc hiệu Tiêu ngữ */}
                <div className="flex justify-between items-start text-[10px] md:text-xs font-bold text-slate-800">
                  <div className="text-center">ĐOÀN TNCS HỒ CHÍ MINH<br />TRƯỜNG ĐH KỸ THUẬT<br />***</div>
                  <div className="text-center">
                    <span className="font-black">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</span><br />
                    <span className="underline underline-offset-4">Độc lập - Tự do - Hạnh phúc</span>
                  </div>
                </div>

                {/* Tiêu đề văn bản */}
                <div className="text-center mt-12 mb-8 space-y-2">
                  <h3 className="text-base md:text-lg font-black text-slate-900 uppercase">
                    {selectedDoc.document_type || "VĂN BẢN LƯU HÀNH NỘI BỘ"}
                  </h3>
                  <p className="text-xs md:text-sm font-bold text-slate-700 w-3/4 mx-auto leading-relaxed">
                    V/v {selectedDoc.title || 'Không có tiêu đề trích yếu'}
                  </p>
                </div>

                {/* Nội dung */}
                <div className="space-y-4 text-xs md:text-sm leading-8 text-slate-800 text-justify">
                  <p className="whitespace-pre-wrap">{selectedDoc.purpose || "Chưa có nội dung chi tiết được soạn thảo trong văn bản này."}</p>
                </div>

                {/* Chữ ký số điện tử */}
                <div className="absolute bottom-16 md:bottom-24 right-8 md:right-16 rotate-[-10deg] opacity-90 border-4 border-red-600 p-3 md:p-4 rounded-xl text-center select-none pointer-events-none">
                  <div className="text-red-600 font-black text-[10px] md:text-xs uppercase tracking-widest">Ký bởi: ADMIN HỆ THỐNG</div>
                  <div className="text-red-600 font-bold text-[9px] md:text-[10px] mt-1">
                    Ngày phê duyệt: {new Date(selectedDoc.request_date).toLocaleDateString('vi-VN')}
                  </div>
                  <CheckCircle className="mx-auto mt-2 text-red-600" size={24} />
                  <div className="text-red-600 font-black text-[7px] mt-1 opacity-50 uppercase">Digital Signature Verified</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER CỦA HỆ THỐNG */}
      <footer className="text-center py-4 text-[9px] text-slate-400 font-bold uppercase tracking-widest opacity-50">
        © 2026 Digital Youth Union System (DYUS). Designed for the next
        generation.
      </footer>
    </div>
  );
};

export default DigitalDocument;
