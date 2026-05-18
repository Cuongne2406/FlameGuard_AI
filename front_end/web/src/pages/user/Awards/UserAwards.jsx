import React, { useContext, useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Clock,
  CloudUpload,
  FileText,
  Info,
  Lock,
  Trophy,
  X,
} from "lucide-react";
import { awardService } from "../../../services/awardService";
import { AuthContext } from "../../../context/AuthContext";

const statusMap = {
  PENDING: {
    label: "Dang cho",
    classes: "bg-amber-100 text-amber-600 border-amber-200",
    icon: <Clock size={12} />,
  },
  APPROVED: {
    label: "Da duyet",
    classes: "bg-emerald-100 text-emerald-600 border-emerald-200",
    icon: <CheckCircle2 size={12} />,
  },
  REJECTED: {
    label: "Tu choi",
    classes: "bg-rose-100 text-rose-600 border-rose-200",
    icon: <AlertCircle size={12} />,
  },
};

const defaultCampaign = {
  award_name: "Sinh vien 5 tot cap Truong",
  title: "Sinh vien 5 tot",
  academic_year: "2025-2026",
  short_label: "Dot xet duyet hien hanh",
  description: "He thong dang mo cong nhan ho so minh chung truc tuyen.",
  deadline: null,
  status_tag: "Dang dien ra",
  submission_open: true,
  button_label: "Nop ho so minh chung ngay",
  remaining_days: null,
};

const UserAwards = () => {
  const { user } = useContext(AuthContext);
  const [campaignConfig, setCampaignConfig] = useState(defaultCampaign);
  const [myApplications, setMyApplications] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [formData, setFormData] = useState({
    award_name: defaultCampaign.award_name,
    description: "",
    evidence_url: "",
  });

  const loadData = async (currentConfig = campaignConfig) => {
    if (!user?.id) return;

    const awards = await awardService.getAwardsList({
      award_name: currentConfig.award_name,
    });
    const filtered = Array.isArray(awards)
      ? awards.filter((item) => item.user_id === user.id)
      : [];
    setMyApplications(filtered);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return;
      setPageLoading(true);

      try {
        const config = await awardService.getCurrentCampaignConfig();
        const mergedConfig = { ...defaultCampaign, ...config };
        setCampaignConfig(mergedConfig);
        setFormData((prev) => ({
          ...prev,
          award_name: mergedConfig.award_name,
        }));
        await loadData(mergedConfig);
      } catch (error) {
        console.error("Khong the tai cau hinh dot khen thuong:", error);
        await loadData(defaultCampaign);
      } finally {
        setPageLoading(false);
      }
    };

    fetchData();
  }, [user?.id]);

  useEffect(() => {
    if (!user?.id) return undefined;

    const syncAwards = async () => {
      try {
        const config = await awardService.getCurrentCampaignConfig();
        const mergedConfig = { ...defaultCampaign, ...config };
        setCampaignConfig(mergedConfig);
        setFormData((prev) => ({ ...prev, award_name: mergedConfig.award_name }));
        await loadData(mergedConfig);
      } catch (error) {
        console.error("Khong the dong bo dot khen thuong moi nhat:", error);
      }
    };

    const intervalId = window.setInterval(syncAwards, 15000);
    const handleFocus = () => syncAwards();
    window.addEventListener("focus", handleFocus);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener("focus", handleFocus);
    };
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
    if (!user?.id || !campaignConfig.submission_open) return;

    setLoading(true);

    try {
      await awardService.createAward({
        ...formData,
        award_name: campaignConfig.award_name,
        user_id: user.id,
      });
      setIsModalOpen(false);
      setFormData({
        award_name: campaignConfig.award_name,
        description: "",
        evidence_url: "",
      });
      await loadData(campaignConfig);
    } catch (error) {
      alert("Loi khi nop ho so. Vui long thu lai.");
    } finally {
      setLoading(false);
    }
  };

  const deadlineText = campaignConfig.deadline
    ? new Date(campaignConfig.deadline).toLocaleDateString("vi-VN")
    : "Chua cap nhat";

  return (
    <div className="space-y-6">
      <section className="app-card overflow-hidden">
        <div className="app-hero relative px-5 pb-8 pt-6 md:px-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.22),transparent_28%)]" />
          <div className="relative grid gap-5 lg:grid-cols-[1.3fr_0.85fr]">
            <div>
              <div className="inline-flex rounded-full bg-white/18 px-3 py-1 text-[11px] font-black text-white">
                {campaignConfig.academic_year || "Nam hoc hien hanh"}
              </div>
              <h2 className="mt-4 text-3xl font-black tracking-tight text-white md:text-4xl">
                {campaignConfig.title}
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/82">
                {campaignConfig.description}
              </p>
              <div className="mt-4 flex flex-wrap gap-3 text-xs font-bold text-white/80">
                <span>Han chot: {deadlineText}</span>
                {campaignConfig.remaining_days !== null && (
                  <span>Con lai: {campaignConfig.remaining_days} ngay</span>
                )}
                <span>Trang thai: {campaignConfig.status_tag}</span>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <button className="rounded-full bg-white px-5 py-3 text-sm font-black text-indigo-600">
                  Xem tieu chi
                </button>
                <button
                  onClick={() => setIsModalOpen(true)}
                  disabled={!campaignConfig.submission_open}
                  className={`rounded-full px-5 py-3 text-sm font-black text-white ${
                    campaignConfig.submission_open
                      ? "bg-orange-500"
                      : "bg-slate-400 cursor-not-allowed"
                  }`}
                >
                  {campaignConfig.submission_open ? campaignConfig.button_label : "Dot nop dang dong"}
                </button>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              <div className="rounded-[24px] bg-white/16 p-4 text-white backdrop-blur">
                <p className="text-sm text-white/74">Tong ho so</p>
                <p className="mt-3 text-3xl font-black">{summary.total}</p>
              </div>
              <div className="rounded-[24px] bg-white/16 p-4 text-white backdrop-blur">
                <p className="text-sm text-white/74">Da duyet</p>
                <p className="mt-3 text-3xl font-black">{summary.approved}</p>
              </div>
              <div className="rounded-[24px] bg-white/16 p-4 text-white backdrop-blur">
                <p className="text-sm text-white/74">Dang cho</p>
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
                <h3 className="text-xl font-black text-slate-800">Ho so cua dot hien tai</h3>
              </div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
                {summary.total} ban ghi
              </span>
            </div>

            <div className="mt-5 space-y-3">
              {pageLoading ? (
                <div className="rounded-[28px] border border-slate-100 bg-white px-6 py-16 text-center shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
                  <p className="text-sm font-bold uppercase tracking-[0.22em] text-slate-400">
                    Dang tai du lieu
                  </p>
                </div>
              ) : myApplications.length > 0 ? (
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
                                Nop ngay {new Date(application.created_at).toLocaleDateString("vi-VN")}
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
                              Xem minh chung
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
                    Ban chua nop ho so cho dot hien tai
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="app-card p-6">
              <h3 className="text-lg font-black text-slate-800">Luu y quan trong</h3>
              <div className="mt-5 space-y-4">
                <div className="flex gap-3">
                  <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                    <Info size={14} />
                  </div>
                  <p className="text-sm leading-7 text-slate-500">
                    Minh chung nen duoc luu tren Google Drive hoac kho cong khai de hoi dong co the truy cap.
                  </p>
                </div>
                <div className="flex gap-3">
                  <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                    <Info size={14} />
                  </div>
                  <p className="text-sm leading-7 text-slate-500">
                    Moi thay doi ten dot, han chot va trang thai nop ho so se duoc dong bo tu admin theo thoi gian thuc.
                  </p>
                </div>
              </div>
            </div>

            <div className="app-card p-6">
              <h3 className="text-lg font-black text-slate-800">Trang thai nop ho so</h3>
              <div className="mt-4 flex items-start gap-3">
                <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-[16px] bg-slate-100 text-slate-500">
                  {campaignConfig.submission_open ? <CloudUpload size={18} /> : <Lock size={18} />}
                </div>
                <div>
                  <p className="text-sm font-black text-slate-700">
                    {campaignConfig.submission_open ? "Dang mo tiep nhan ho so" : "Tam dong cong nop ho so"}
                  </p>
                  <p className="mt-2 text-sm leading-7 text-slate-500">
                    {campaignConfig.submission_open
                      ? "Ban co the nop minh chung cho danh hieu hien dang duoc admin kich hoat."
                      : "Admin da tam dong dot nop. Khi mo lai, man hinh user se tu dong hien dung thong tin dot moi."}
                  </p>
                </div>
              </div>
              <button className="mt-5 inline-flex items-center gap-2 rounded-full bg-orange-500 px-5 py-3 text-sm font-black text-white">
                Gui phan hoi
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
                  <h3 className="text-lg font-black text-slate-800">Nop ho so minh chung</h3>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                    {campaignConfig.award_name}
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
                  Danh hieu
                </label>
                <input
                  readOnly
                  value={campaignConfig.award_name}
                  className="mt-2 w-full rounded-[20px] border border-slate-100 bg-slate-50 px-5 py-4 text-sm font-bold text-slate-600 outline-none"
                />
              </div>

              <div>
                <label className="ml-1 text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
                  Link minh chung
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
                  Ghi chu bo sung
                </label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(event) =>
                    setFormData((prev) => ({ ...prev, description: event.target.value }))
                  }
                  placeholder="Mo ta ngan gon thanh tich noi bat cua ban..."
                  className="mt-2 w-full resize-none rounded-[20px] border border-slate-200 bg-white px-5 py-4 text-sm font-semibold text-slate-700 outline-none focus:border-indigo-300"
                />
              </div>

              <div className="rounded-[20px] bg-slate-50 px-4 py-3 text-xs font-medium text-slate-500">
                Han chot hien tai: {deadlineText}
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 rounded-full bg-slate-100 px-5 py-3 text-sm font-black text-slate-500"
                >
                  Huy
                </button>
                <button
                  disabled={loading || !campaignConfig.submission_open}
                  type="submit"
                  className="flex-[1.5] rounded-full bg-indigo-600 px-5 py-3 text-sm font-black text-white shadow-[0_14px_24px_rgba(79,70,229,0.22)] disabled:bg-slate-400"
                >
                  {loading ? "Dang gui..." : "Xac nhan nop ho so"}
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
