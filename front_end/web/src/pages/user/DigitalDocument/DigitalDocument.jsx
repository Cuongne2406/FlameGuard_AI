import React, { useContext, useEffect, useMemo, useState } from "react";
import {
  CheckCircle,
  ChevronRight,
  CloudUpload,
  Download,
  FileText,
  Filter,
  Printer,
  Search,
  X,
} from "lucide-react";
import { AuthContext } from "../../../context/AuthContext";
import { awardService } from "../../../services/awardService";
import { documentService } from "../../../services/documentService";

const tabs = ["Đoàn - Hội Khoa", "Đoàn Trường", "Mẫu đơn"];

const DigitalDocument = () => {
  const { user } = useContext(AuthContext);
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    award_name: "Sinh viên 5 tốt cấp Trường",
    description: "",
    evidence_url: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docData = await documentService.getDocuments();
        setDocs(Array.isArray(docData) ? docData : []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredDocs = useMemo(() => {
    let source = docs;

    source = source.filter((doc) => {
      const title = (doc.title || "").toLowerCase();
      const type = (doc.document_type || "").toLowerCase();
      if (activeTab === 0) return !title.includes("trường") && !type.includes("form");
      if (activeTab === 1) return title.includes("trường");
      return title.includes("mẫu") || title.includes("đơn") || type.includes("form");
    });

    if (!searchQuery.trim()) return source;
    const query = searchQuery.toLowerCase();
    return source.filter((doc) => {
      const title = (doc.title || "").toLowerCase();
      const code = (doc.document_code || "").toLowerCase();
      const content = (doc.purpose || "").toLowerCase();
      return title.includes(query) || code.includes(query) || content.includes(query);
    });
  }, [activeTab, docs, searchQuery]);

  const handleApplyAward = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      if (!user) {
        alert("Vui lòng đăng nhập để nộp hồ sơ!");
        return;
      }

      await awardService.createAward({
        ...formData,
        user_id: user.id,
      });
      setIsSubmitModalOpen(false);
      setFormData({ ...formData, description: "", evidence_url: "" });
      alert("Gửi hồ sơ xét duyệt thành công!");
    } catch (error) {
      alert("Lỗi khi nộp hồ sơ. Vui lòng thử lại!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <section className="app-card overflow-hidden">
        <div className="app-hero relative px-5 pb-8 pt-6 md:px-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.22),transparent_28%)]" />
          <div className="relative grid gap-5 lg:grid-cols-[1.3fr_0.85fr]">
            <div>
              <div className="inline-flex rounded-full bg-white/18 px-3 py-1 text-[11px] font-black text-white">
                DỊCH VỤ HÀNH CHÍNH
              </div>
              <h2 className="mt-4 text-3xl font-black tracking-tight text-white md:text-4xl">
                Văn bản & Thủ tục
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/82">
                Web user đang đi theo app: tài liệu rõ ràng hơn, thao tác nộp hồ sơ và xem văn bản gọn hơn.
              </p>
            </div>

            <div className="app-gradient-panel flex flex-col justify-between gap-4 px-5 py-5 text-white">
              <div>
                <div className="inline-flex rounded-full bg-white/18 px-3 py-1 text-[11px] font-black">
                  NỘP HỒ SƠ NHANH
                </div>
                <h3 className="mt-3 text-2xl font-black">Sinh viên 5 tốt online</h3>
                <p className="mt-2 text-sm leading-6 text-white/84">
                  Tạo đường dẫn minh chứng và nộp hồ sơ trực tiếp trên web giống mạch thao tác ở app.
                </p>
              </div>
              <button
                onClick={() => setIsSubmitModalOpen(true)}
                className="inline-flex w-fit items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-black text-orange-600"
              >
                <CloudUpload size={18} />
                Mở biểu mẫu
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6 p-5 md:p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap gap-3">
              {tabs.map((tab, index) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(index)}
                  className={index === activeTab ? "app-chip app-chip-active" : "app-chip"}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="flex w-full items-center gap-3 md:w-auto">
              <div className="flex flex-1 items-center gap-3 rounded-full border border-slate-100 bg-white px-4 py-3 md:min-w-[320px]">
                <Search size={18} className="text-slate-400" />
                <input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Tìm văn bản, mã tài liệu..."
                  className="w-full bg-transparent text-sm font-medium text-slate-700 outline-none placeholder:text-slate-400"
                />
              </div>
              <button className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-100 bg-white text-slate-400">
                <Filter size={18} />
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {activeTab === 2 && (
              <button
                onClick={() => setIsSubmitModalOpen(true)}
                className="app-card flex w-full items-center gap-4 p-5 text-left hover:-translate-y-0.5"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[18px] bg-orange-100 text-orange-600">
                  <CloudUpload size={20} />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="inline-flex rounded-full bg-orange-500 px-2 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-white">
                    Thủ tục điện tử
                  </span>
                  <p className="mt-3 text-sm font-black text-slate-800">
                    Nộp minh chứng xét duyệt Danh hiệu Sinh viên 5 tốt
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    Biểu mẫu nhanh dành cho sinh viên đủ điều kiện.
                  </p>
                </div>
                <ChevronRight size={18} className="shrink-0 text-orange-400" />
              </button>
            )}

            {loading ? (
              [1, 2, 3].map((item) => <div key={item} className="app-card h-24 animate-pulse" />)
            ) : filteredDocs.length > 0 ? (
              filteredDocs.map((doc) => (
                <button
                  key={doc.id}
                  onClick={() => setSelectedDoc(doc)}
                  className="app-card flex w-full items-center gap-4 p-5 text-left hover:-translate-y-0.5"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[18px] bg-indigo-50 text-indigo-600">
                    <FileText size={20} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-black text-slate-800">
                      {doc.title || "Tài liệu không tên"}
                    </p>
                    <p className="mt-1 text-xs font-medium text-slate-500">
                      Mã: {doc.document_code || "Chưa có"} •{" "}
                      {doc.request_date
                        ? new Date(doc.request_date).toLocaleDateString("vi-VN")
                        : "Không rõ ngày"}
                    </p>
                  </div>
                  <ChevronRight size={18} className="shrink-0 text-slate-300" />
                </button>
              ))
            ) : (
              <div className="rounded-[28px] border border-slate-100 bg-white px-6 py-16 text-center shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[22px] bg-slate-50 text-slate-300">
                  <FileText size={28} />
                </div>
                <p className="mt-5 text-sm font-bold uppercase tracking-[0.22em] text-slate-400">
                  Chưa có văn bản phù hợp
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {selectedDoc && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setSelectedDoc(null)} />
          <div className="app-card relative z-10 flex h-[90vh] w-full max-w-5xl flex-col overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-[16px] bg-indigo-50 text-indigo-600">
                  <FileText size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-800">Trích xuất văn bản</h4>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                    Số hiệu: {selectedDoc.document_code || "N/A"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="rounded-full p-2 text-slate-400 hover:bg-white">
                  <Download size={16} />
                </button>
                <button className="rounded-full p-2 text-slate-400 hover:bg-white">
                  <Printer size={16} />
                </button>
                <button onClick={() => setSelectedDoc(null)} className="rounded-full p-2 text-slate-400 hover:bg-white">
                  <X size={16} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-auto bg-slate-100 p-4 md:p-8">
              <div className="mx-auto max-w-3xl bg-white p-8 shadow-[0_18px_40px_rgba(15,23,42,0.08)] md:p-12">
                <div className="flex justify-between text-center text-xs font-bold text-slate-700">
                  <div>
                    ĐOÀN TNCS HỒ CHÍ MINH
                    <br />
                    TRƯỜNG ĐẠI HỌC
                  </div>
                  <div>
                    CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
                    <br />
                    Độc lập - Tự do - Hạnh phúc
                  </div>
                </div>

                <div className="mt-12 text-center">
                  <h3 className="text-lg font-black uppercase text-slate-900">
                    {selectedDoc.document_type || "Văn bản hành chính"}
                  </h3>
                  <p className="mt-2 text-base font-bold text-slate-700">
                    V/v {selectedDoc.title || "Không có tiêu đề"}
                  </p>
                </div>

                <div className="mt-10 whitespace-pre-wrap text-sm leading-8 text-slate-700">
                  {selectedDoc.purpose || "Chưa có nội dung chi tiết được cập nhật trong văn bản này."}
                </div>

                <div className="mt-16 flex justify-end">
                  <div className="rounded-[18px] border-4 border-rose-500 p-4 text-center text-rose-600">
                    <p className="text-xs font-black uppercase">Ký bởi hệ thống</p>
                    <p className="mt-2 text-[11px] font-bold">
                      {selectedDoc.request_date
                        ? new Date(selectedDoc.request_date).toLocaleDateString("vi-VN")
                        : "Không rõ ngày"}
                    </p>
                    <CheckCircle className="mx-auto mt-2" size={20} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setIsSubmitModalOpen(false)} />
          <div className="app-card relative z-10 w-full max-w-xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-[18px] bg-orange-500 text-white">
                  <CloudUpload size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-800">Nộp hồ sơ trực tuyến</h3>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                    Sinh viên 5 tốt
                  </p>
                </div>
              </div>
              <button onClick={() => setIsSubmitModalOpen(false)} className="rounded-full p-2 text-slate-400 hover:bg-slate-100">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleApplyAward} className="space-y-5 p-6">
              <input
                readOnly
                value={formData.award_name}
                className="w-full rounded-[20px] border border-slate-100 bg-slate-50 px-5 py-4 text-sm font-bold text-slate-600 outline-none"
              />
              <input
                required
                type="url"
                value={formData.evidence_url}
                onChange={(event) =>
                  setFormData((prev) => ({ ...prev, evidence_url: event.target.value }))
                }
                placeholder="https://drive.google.com/..."
                className="w-full rounded-[20px] border border-slate-200 bg-white px-5 py-4 text-sm font-semibold text-slate-700 outline-none focus:border-orange-300"
              />
              <textarea
                rows={4}
                value={formData.description}
                onChange={(event) =>
                  setFormData((prev) => ({ ...prev, description: event.target.value }))
                }
                placeholder="Mô tả ngắn gọn thành tích và hồ sơ của bạn..."
                className="w-full resize-none rounded-[20px] border border-slate-200 bg-white px-5 py-4 text-sm font-semibold text-slate-700 outline-none focus:border-orange-300"
              />
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsSubmitModalOpen(false)}
                  className="flex-1 rounded-full bg-slate-100 px-5 py-3 text-sm font-black text-slate-500"
                >
                  Hủy
                </button>
                <button
                  disabled={isSubmitting}
                  type="submit"
                  className="flex-[1.5] rounded-full bg-orange-500 px-5 py-3 text-sm font-black text-white"
                >
                  {isSubmitting ? "Đang gửi..." : "Xác nhận nộp hồ sơ"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DigitalDocument;
