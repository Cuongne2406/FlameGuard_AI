import React, { useContext, useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Clock,
  CloudUpload,
  FileText,
  Info,
  Trophy,
  X,
} from "lucide-react";
import { awardService } from "../../../services/awardService";
import { AuthContext } from "../../../context/AuthContext";

const statusMap = {
  PENDING: {
    label: "Đang chờ",
    classes: "bg-amber-100 text-amber-600 border-amber-200",
    icon: <Clock size={12} />,
  },
  APPROVED: {
    label: "Đã duyệt",
    classes: "bg-emerald-100 text-emerald-600 border-emerald-200",
    icon: <CheckCircle2 size={12} />,
  },
  REJECTED: {
    label: "Từ chối",
    classes: "bg-rose-100 text-rose-600 border-rose-200",
    icon: <AlertCircle size={12} />,
  },
};

const UserAwards = () => {
  const { user } = useContext(AuthContext);
  const [myApplications, setMyApplications] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    award_name: "Sinh viên 5 tốt cấp Trường",
    description: "",
    evidence_url: "",
  });

  useEffect(() => {
    const fetchMyAwards = async () => {
      try {
        const data = await awardService.getAwardsList();
        const filtered = Array.isArray(data)
          ? data.filter((item) => item.user_id === user?.id)
          : [];
        setMyApplications(filtered);
      } catch (error) {
        console.error("Lỗi khi tải danh sách khen thưởng:", error);
      }
    };

    if (user?.id) fetchMyAwards();
  }, [user?.id]);

  const summary = useMemo(
    () => ({
      total: myApplications.length,
      approved: myApplications.filter((item) => item.status === "APPROVED").length,
      pending: myApplications.filter((item) => item.status === "PENDING").length,
    }),
    [myApplications]
  );

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      await awardService.createAward({
        ...formData,
        user_id: user.id,
      });
      setIsModalOpen(false);
      setFormData({ ...formData, description: "", evidence_url: "" });
      const data = await awardService.getAwardsList();
      const filtered = Array.isArray(data)
        ? data.filter((item) => item.user_id === user?.id)
        : [];
      setMyApplications(filtered);
    } catch (error) {
      alert("Lỗi khi nộp hồ sơ. Vui lòng thử lại!");
    } finally {
      setLoading(false);
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
                ĐỢT XÉT DUYỆT 2026
              </div>
              <h2 className="mt-4 text-3xl font-black tracking-tight text-white md:text-4xl">
                Danh hiệu & Khen thưởng
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/82">
                Web user giờ bám theo app profile: ưu tiên thành tích, hồ sơ cá nhân và theo dõi trạng thái minh bạch hơn.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <button className="rounded-full bg-white px-5 py-3 text-sm font-black text-indigo-600">
                  Xem tiêu chí
                </button>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="rounded-full bg-orange-500 px-5 py-3 text-sm font-black text-white"
                >
                  Nộp hồ sơ ngay
                </button>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              <div className="rounded-[24px] bg-white/16 p-4 text-white backdrop-blur">
                <p className="text-sm text-white/74">Tổng hồ sơ</p>
                <p className="mt-3 text-3xl font-black">{summary.total}</p>
              </div>
              <div className="rounded-[24px] bg-white/16 p-4 text-white backdrop-blur">
                <p className="text-sm text-white/74">Đã duyệt</p>
                <p className="mt-3 text-3xl font-black">{summary.approved}</p>
              </div>
              <div className="rounded-[24px] bg-white/16 p-4 text-white backdrop-blur">
                <p className="text-sm text-white/74">Đang chờ</p>
                <p className="mt-3 text-3xl font-black">{summary.pending}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 p-5 lg:grid-cols-[1.3fr_0.85fr] md:p-6">
          <div className="app-card p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock size={18} className="text-indigo-600" />
                <h3 className="text-xl font-black text-slate-800">Lịch sử nộp hồ sơ</h3>
              </div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
                {summary.total} bản ghi
              </span>
            </div>

            <div className="mt-5 space-y-3">
              {myApplications.length > 0 ? (
                myApplications.map((application) => {
                  const config = statusMap[application.status] || statusMap.PENDING;
                  return (
                    <div key={application.id} className="app-card-muted p-5">
                      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="min-w-0">
                          <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[18px] bg-indigo-50 text-indigo-600">
                              <Trophy size={20} />
                            </div>
                            <div className="min-w-0">
                              <p className="truncate text-sm font-black uppercase tracking-tight text-slate-800">
                                {application.award_name}
                              </p>
                              <p className="mt-1 text-xs font-medium text-slate-500">
                                Nộp ngày {new Date(application.created_at).toLocaleDateString("vi-VN")}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                          <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-widest ${config.classes}`}>
                            {config.icon}
                            {config.label}
                          </span>
                          {application.evidence_url && (
                            <a
                              href={application.evidence_url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs font-bold text-indigo-600 hover:underline"
                            >
                              Xem minh chứng
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="rounded-[28px] border border-slate-100 bg-white px-6 py-16 text-center shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[22px] bg-slate-50 text-slate-300">
                    <FileText size={28} />
                  </div>
                  <p className="mt-5 text-sm font-bold uppercase tracking-[0.22em] text-slate-400">
                    Bạn chưa nộp hồ sơ nào
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="app-card p-6">
              <h3 className="text-lg font-black text-slate-800">Lưu ý quan trọng</h3>
              <div className="mt-5 space-y-4">
                <div className="flex gap-3">
                  <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                    <Info size={14} />
                  </div>
                  <p className="text-sm leading-7 text-slate-500">
                    Minh chứng nên được lưu trên Google Drive hoặc kho lưu trữ công khai.
                  </p>
                </div>
                <div className="flex gap-3">
                  <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                    <Info size={14} />
                  </div>
                  <p className="text-sm leading-7 text-slate-500">
                    Hãy mở quyền truy cập cho đường dẫn minh chứng trước khi gửi hồ sơ.
                  </p>
                </div>
              </div>
            </div>

            <div className="app-card p-6">
              <h3 className="text-lg font-black text-slate-800">Hỗ trợ kỹ thuật</h3>
              <p className="mt-4 text-sm leading-7 text-slate-500">
                Nếu gặp khó khăn khi tải minh chứng hoặc cần xác nhận tiêu chí, bạn có thể liên hệ bộ phận phụ trách.
              </p>
              <button className="mt-5 inline-flex items-center gap-2 rounded-full bg-orange-500 px-5 py-3 text-sm font-black text-white">
                Gửi phản hồi
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {isModalOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setIsModalOpen(false)} />
          <div className="app-card relative z-10 w-full max-w-xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-[18px] bg-indigo-600 text-white">
                  <CloudUpload size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-800">Nộp hồ sơ minh chứng</h3>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                    Sinh viên 5 tốt cấp Trường
                  </p>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="rounded-full p-2 text-slate-400 hover:bg-slate-100">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 p-6">
              <div>
                <label className="ml-1 text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
                  Danh hiệu
                </label>
                <input
                  readOnly
                  value={formData.award_name}
                  className="mt-2 w-full rounded-[20px] border border-slate-100 bg-slate-50 px-5 py-4 text-sm font-bold text-slate-600 outline-none"
                />
              </div>

              <div>
                <label className="ml-1 text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
                  Link minh chứng
                </label>
                <input
                  required
                  type="url"
                  value={formData.evidence_url}
                  onChange={(event) =>
                    setFormData((prev) => ({ ...prev, evidence_url: event.target.value }))
                  }
                  placeholder="https://drive.google.com/..."
                  className="mt-2 w-full rounded-[20px] border border-slate-200 bg-white px-5 py-4 text-sm font-semibold text-slate-700 outline-none focus:border-indigo-300"
                />
              </div>

              <div>
                <label className="ml-1 text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
                  Ghi chú bổ sung
                </label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(event) =>
                    setFormData((prev) => ({ ...prev, description: event.target.value }))
                  }
                  placeholder="Mô tả ngắn gọn thành tích nổi bật của bạn..."
                  className="mt-2 w-full resize-none rounded-[20px] border border-slate-200 bg-white px-5 py-4 text-sm font-semibold text-slate-700 outline-none focus:border-indigo-300"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 rounded-full bg-slate-100 px-5 py-3 text-sm font-black text-slate-500"
                >
                  Hủy
                </button>
                <button
                  disabled={loading}
                  type="submit"
                  className="flex-[1.5] rounded-full bg-indigo-600 px-5 py-3 text-sm font-black text-white shadow-[0_14px_24px_rgba(79,70,229,0.22)]"
                >
                  {loading ? "Đang gửi..." : "Xác nhận nộp hồ sơ"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserAwards;
