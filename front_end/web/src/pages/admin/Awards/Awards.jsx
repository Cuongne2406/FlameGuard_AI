import React, { useEffect, useMemo, useState } from "react";
import {
  Calendar,
  ExternalLink,
  FileCheck,
  MessageSquare,
  Pencil,
  Save,
  Trophy,
  TrendingUp,
  Users,
  X,
  RotateCcw,
} from "lucide-react";
import { awardService } from "../../../services/awardService";
import Toast from "../../../components/ui/Toast";

const defaultCampaign = {
  award_name: "Sinh vien 5 tot cap Truong",
  title: "Xet duyet Sinh vien 5 Tot cap Truong",
  academic_year: "2025-2026",
  short_label: "Dot xet duyet hien hanh",
  description: "He thong dang mo cong nhan ho so minh chung truc tuyen.",
  deadline: "",
  status_tag: "Dang dien ra",
  submission_open: true,
  button_label: "Nop ho so minh chung ngay",
  remaining_days: null,
};

const statusStyles = {
  PENDING: "bg-amber-100 text-amber-700 border-amber-200",
  APPROVED: "bg-emerald-100 text-emerald-700 border-emerald-200",
  REJECTED: "bg-rose-100 text-rose-700 border-rose-200",
};

const Awards = () => {
  const [campaignConfig, setCampaignConfig] = useState(defaultCampaign);
  const [draftConfig, setDraftConfig] = useState(defaultCampaign);
  const [rankings, setRankings] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [campaignHistory, setCampaignHistory] = useState([]);
  const [stats, setStats] = useState({
    remainingDays: "0",
    submitted: "0",
    approved: "0",
    passRate: "0%",
  });
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [savingConfig, setSavingConfig] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const loadPageData = async (config = campaignConfig) => {
    const [configData, awardsData, statsData, historyData] = await Promise.all([
      awardService.getCurrentCampaignConfig(),
      awardService.getAwardsList({ award_name: config.award_name }),
      awardService.getAwardStats("all", { award_name: config.award_name }),
      awardService.getCampaignHistory(12),
    ]);

    const mergedConfig = { ...defaultCampaign, ...configData };
    setCampaignConfig(mergedConfig);
    setDraftConfig({
      ...mergedConfig,
      deadline: mergedConfig.deadline || "",
    });
    setCandidates(Array.isArray(awardsData) ? awardsData : []);
    setRankings(statsData?.rankings || []);
    setCampaignHistory(Array.isArray(historyData) ? historyData : []);
    if (statsData?.summary) setStats(statsData.summary);
    return mergedConfig;
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const config = await awardService.getCurrentCampaignConfig();
        await loadPageData({ ...defaultCampaign, ...config });
      } catch (error) {
        console.error("Loi khi tai du lieu khen thuong:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const pendingCount = useMemo(
    () => candidates.filter((item) => item.status === "PENDING").length,
    [candidates]
  );

  const handleProcessCandidate = async (status, comments) => {
    if (!selectedCandidate) return;
    setIsProcessing(true);
    try {
      await awardService.updateAwardAssessment(selectedCandidate.id, {
        status,
        comments,
      });
      await loadPageData(campaignConfig);
      setSelectedCandidate(null);
    } catch (error) {
      setToast({ message: "Lỗi khi xử lý hồ sơ.", type: "error" });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSaveConfig = async (event) => {
    event.preventDefault();
    setSavingConfig(true);
    try {
      const payload = {
        ...draftConfig,
        deadline: draftConfig.deadline || null,
      };
      const saved = await awardService.updateCurrentCampaignConfig(payload);
      const merged = { ...defaultCampaign, ...saved };
      setCampaignConfig(merged);
      setDraftConfig({ ...merged, deadline: merged.deadline || "" });
      await loadPageData(merged);
      setShowConfigModal(false);
      setToast({ message: "Cập nhật đợt thi đua hiện tại thành công!", type: "success" });
    } catch (error) {
      setToast({ message: "Không thể cập nhật đợt thi đua hiện tại.", type: "error" });
    } finally {
      setSavingConfig(false);
    }
  };

  const handleReactivateFromHistory = async (historyItem) => {
    if (!window.confirm(`Bạn có chắc chắn muốn khôi phục đợt "${historyItem.title}" làm đợt hiện tại không?`)) {
      return;
    }
    setLoading(true);
    try {
      const payload = {
        award_name: historyItem.award_name,
        title: historyItem.title,
        academic_year: historyItem.academic_year || "",
        short_label: historyItem.short_label || "",
        description: historyItem.description || "",
        deadline: historyItem.deadline || null,
        status_tag: historyItem.status_tag || "",
        submission_open: historyItem.submission_open,
        button_label: historyItem.button_label || "",
      };
      const saved = await awardService.updateCurrentCampaignConfig(payload);
      const merged = { ...defaultCampaign, ...saved };
      setCampaignConfig(merged);
      setDraftConfig({ ...merged, deadline: merged.deadline || "" });
      await loadPageData(merged);
      setToast({ message: "Khôi phục đợt thi đua từ lịch sử thành công!", type: "success" });
    } catch (error) {
      setToast({ message: "Không thể khôi phục đợt thi đua từ lịch sử.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500 relative">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
          <Trophy className="text-blue-600" size={24} />
          Quan ly Thi dua va Khen thuong {campaignConfig.academic_year ? `Nam hoc ${campaignConfig.academic_year}` : ""}
        </h2>
        <div className="flex items-center gap-3">
          <div className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-600 shadow-sm">
            {campaignConfig.award_name}
          </div>
          <button
            onClick={() => setShowConfigModal(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-black text-white shadow-lg shadow-blue-200"
          >
            <Pencil size={14} />
            Chinh dot hien tai
          </button>
        </div>
      </div>

      <div className="bg-[#1D4ED8] rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl shadow-blue-200">
        <div className="absolute right-[-20px] top-[-20px] opacity-10">
          <Trophy size={200} />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="space-y-4 max-w-xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-blue-400/30 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                {campaignConfig.status_tag}
              </span>
              <span className="text-blue-100 text-[10px] font-bold">
                Han chot: {campaignConfig.deadline ? new Date(campaignConfig.deadline).toLocaleDateString("vi-VN") : "Chua cap nhat"}
              </span>
              <span className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider ${campaignConfig.submission_open ? "bg-emerald-400/20 text-emerald-100" : "bg-rose-400/20 text-rose-100"}`}>
                {campaignConfig.submission_open ? "Dang mo nop" : "Tam dong nop"}
              </span>
            </div>
            <h1 className="text-3xl font-black leading-tight">
              {campaignConfig.title}
            </h1>
            <p className="text-blue-100 text-xs leading-relaxed opacity-80 font-medium">
              {campaignConfig.description}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 md:flex md:items-center md:gap-10">
            <SummaryItem label="Ngay con lai" value={stats.remainingDays} />
            <SummaryItem label="Ho so da nop" value={stats.submitted} />
            <SummaryItem label="Da duyet" value={stats.approved} />
            <SummaryItem label="Ty le dat" value={stats.passRate} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.05fr_1.35fr]">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex justify-between items-center">
            <h3 className="font-black text-slate-700 flex items-center gap-2">
              <TrendingUp className="text-amber-500" size={18} />
              Bang vang Thi dua Khoi Khoa/Vien
            </h3>
          </div>
          <div className="p-4">
            <table className="w-full">
              <thead>
                <tr className="text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <th className="px-4 py-3">Hang</th>
                  <th className="px-4 py-3">Don vi</th>
                  <th className="px-4 py-3 text-right">Diem thi dua</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {rankings.length > 0 ? (
                  rankings.map((item, index) => (
                    <tr key={`${item.name || item.class || index}-${index}`} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-4">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shadow-sm ${
                          index === 0
                            ? "bg-amber-100 text-amber-600"
                            : index === 1
                              ? "bg-slate-100 text-slate-500"
                              : "bg-orange-50 text-orange-600"
                        }`}>
                          {item.rank || index + 1}
                        </div>
                      </td>
                      <td className="px-4 py-4 font-bold text-slate-700 text-xs">
                        {item.name || item.class || item.university || "Chua co ten"}
                      </td>
                      <td className="px-4 py-4 text-right font-black text-blue-600 text-sm">
                        {item.score ?? 0}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center py-6 text-xs text-slate-400">
                      Khong co du lieu thi dua.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-6">
            <h3 className="font-black text-slate-700 flex items-center gap-2 text-sm uppercase tracking-tight">
              <FileCheck size={18} className="text-blue-600" />
              Tien do xet duyet ho so
            </h3>
            <div className="flex items-center gap-3 text-xs font-bold text-slate-500">
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-amber-700">
                <Users size={14} />
                {pendingCount} ho so cho duyet
              </span>
              <span className="rounded-full bg-slate-100 px-3 py-1">
                {campaignConfig.award_name}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {!loading && candidates.length > 0 ? (
              candidates.map((candidate) => (
                <CandidateCard
                  key={candidate.id}
                  candidate={candidate}
                  onClick={(item) => setSelectedCandidate(item)}
                />
              ))
            ) : (
              <div className="col-span-2 text-center py-10 text-xs text-slate-400">
                {loading ? "Dang tai du lieu..." : "Chua co ho so nao trong dot hien tai."}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center justify-between gap-3 mb-5">
          <div>
            <h3 className="font-black text-slate-800">Lich su cap nhat dot thi dua</h3>
            <p className="mt-1 text-xs font-medium text-slate-500">
              Admin thay doi dot active bao nhieu lan se duoc luu lai tai day.
            </p>
          </div>
          <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">
            {campaignHistory.length} ban ghi
          </div>
        </div>

        <div className="space-y-3">
          {campaignHistory.length > 0 ? (
            campaignHistory.map((item, index) => (
              <div
                key={`${item.changed_at || item.award_name}-${index}`}
                className="rounded-2xl border border-slate-100 bg-slate-50/70 px-4 py-4"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-black text-slate-800">{item.title}</p>
                      <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-black uppercase text-slate-500 border border-slate-200">
                        {item.award_name}
                      </span>
                      <span className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase ${
                        item.submission_open
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-rose-100 text-rose-700"
                      }`}>
                        {item.submission_open ? "Dang mo nop" : "Da dong nop"}
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-slate-500">
                      Nam hoc {item.academic_year || "Chua cap nhat"} • Han chot{" "}
                      {item.deadline ? new Date(item.deadline).toLocaleDateString("vi-VN") : "Chua cap nhat"}
                    </p>
                    <p className="mt-2 text-sm text-slate-600">{item.description || "Khong co mo ta."}</p>
                  </div>
                  <div className="min-w-[220px] flex flex-col justify-between gap-3 rounded-2xl bg-white px-4 py-3 border border-slate-100">
                    <div>
                      <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
                        Cap nhat boi
                      </p>
                      <p className="mt-2 text-sm font-bold text-slate-800">
                        {item.changed_by_name || "Admin"}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {item.changed_at ? new Date(item.changed_at).toLocaleString("vi-VN") : "Khong ro thoi gian"}
                      </p>
                    </div>
                    <button
                      onClick={() => handleReactivateFromHistory(item)}
                      className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-blue-50 py-2 text-[11px] font-black text-blue-600 hover:bg-blue-600 hover:text-white transition-colors"
                    >
                      <RotateCcw size={12} />
                      Kich hoat lai
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-10 text-center text-sm text-slate-400">
              Chua co lich su cap nhat dot thi dua.
            </div>
          )}
        </div>
      </div>

      <ApplicationDetailModal
        candidate={selectedCandidate}
        onClose={() => setSelectedCandidate(null)}
        onProcess={handleProcessCandidate}
        isProcessing={isProcessing}
      />

      {showConfigModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
            onClick={() => setShowConfigModal(false)}
          />
          <div className="relative w-full max-w-2xl rounded-[2rem] bg-white shadow-2xl border border-slate-100 overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-6 py-5">
              <div>
                <h3 className="text-lg font-black text-slate-800">Cap nhat dot thi dua hien tai</h3>
                <p className="mt-1 text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
                  User se tu dong dong bo theo cau hinh nay
                </p>
              </div>
              <button
                onClick={() => setShowConfigModal(false)}
                className="rounded-full p-2 text-slate-400 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveConfig} className="grid gap-5 p-6 md:grid-cols-2">
              <Field
                label="Ten danh hieu"
                value={draftConfig.award_name}
                onChange={(value) => setDraftConfig((prev) => ({ ...prev, award_name: value }))}
              />
              <Field
                label="Nam hoc"
                value={draftConfig.academic_year || ""}
                onChange={(value) => setDraftConfig((prev) => ({ ...prev, academic_year: value }))}
              />
              <Field
                label="Tieu de hien thi"
                value={draftConfig.title}
                onChange={(value) => setDraftConfig((prev) => ({ ...prev, title: value }))}
              />
              <Field
                label="Nhan trang thai"
                value={draftConfig.status_tag || ""}
                onChange={(value) => setDraftConfig((prev) => ({ ...prev, status_tag: value }))}
              />
              <Field
                label="Nhan ngan"
                value={draftConfig.short_label || ""}
                onChange={(value) => setDraftConfig((prev) => ({ ...prev, short_label: value }))}
              />
              <Field
                label="Nhan nut nop"
                value={draftConfig.button_label || ""}
                onChange={(value) => setDraftConfig((prev) => ({ ...prev, button_label: value }))}
              />
              <div>
                <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
                  Han chot
                </label>
                <input
                  type="date"
                  value={draftConfig.deadline || ""}
                  onChange={(event) =>
                    setDraftConfig((prev) => ({ ...prev, deadline: event.target.value }))
                  }
                  className="w-full rounded-[18px] border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-blue-300"
                />
              </div>
              <div className="flex items-center justify-between rounded-[18px] border border-slate-200 bg-slate-50 px-4 py-3">
                <div>
                  <p className="text-sm font-black text-slate-700">Mo cong nop ho so</p>
                  <p className="mt-1 text-xs text-slate-500">Tat/bat ngay tren man hinh user</p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setDraftConfig((prev) => ({
                      ...prev,
                      submission_open: !prev.submission_open,
                    }))
                  }
                  className={`rounded-full px-4 py-2 text-xs font-black ${
                    draftConfig.submission_open
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-300 text-slate-700"
                  }`}
                >
                  {draftConfig.submission_open ? "Dang mo" : "Da dong"}
                </button>
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
                  Mo ta
                </label>
                <textarea
                  rows={4}
                  value={draftConfig.description || ""}
                  onChange={(event) =>
                    setDraftConfig((prev) => ({ ...prev, description: event.target.value }))
                  }
                  className="w-full resize-none rounded-[18px] border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-blue-300"
                />
              </div>

              <div className="md:col-span-2 flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowConfigModal(false)}
                  className="rounded-full bg-slate-100 px-5 py-3 text-sm font-black text-slate-500"
                >
                  Huy
                </button>
                <button
                  type="submit"
                  disabled={savingConfig}
                  className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-blue-200 disabled:bg-slate-400"
                >
                  <Save size={16} />
                  {savingConfig ? "Dang luu..." : "Luu va dong bo"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

const SummaryItem = ({ label, value }) => (
  <div className="text-center">
    <div className="text-2xl font-black tracking-tight">{value}</div>
    <div className="text-[9px] font-bold uppercase text-blue-200 tracking-widest">
      {label}
    </div>
  </div>
);

const Field = ({ label, value, onChange }) => (
  <div>
    <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
      {label}
    </label>
    <input
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="w-full rounded-[18px] border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-blue-300"
    />
  </div>
);

const CandidateCard = ({ candidate, onClick }) => {
  const displayName = candidate.full_name || "Chua co ten";
  const displayId = candidate.student_id || "N/A";
  const displayUnit = candidate.university || "N/A";
  const statusClass = statusStyles[candidate.status] || "bg-slate-100 text-slate-500 border-slate-200";
  const initial = displayName.split(" ").pop()?.charAt(0) || "?";

  return (
    <div
      onClick={() => onClick(candidate)}
      className="p-4 rounded-2xl border border-slate-100 bg-slate-50/30 flex justify-between items-center hover:shadow-md hover:border-blue-200 cursor-pointer transition-all group"
    >
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-black text-xs uppercase">
          {initial}
        </div>
        <div>
          <h5 className="text-xs font-black text-slate-800">{displayName}</h5>
          <p className="text-[10px] text-slate-400 font-medium">
            {displayId} • {displayUnit}
          </p>
        </div>
      </div>
      <span className={`px-2 py-1 rounded-md text-[9px] font-black uppercase border ${statusClass}`}>
        {candidate.status}
      </span>
    </div>
  );
};

const ApplicationDetailModal = ({ candidate, onClose, onProcess, isProcessing }) => {
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    setFeedback(candidate?.assessment?.comments || "");
  }, [candidate]);

  if (!candidate) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose} />
      <div className="relative bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-100 flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-slate-50 flex justify-between items-start bg-slate-50/50">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-black text-2xl uppercase shadow-inner">
              {candidate.full_name?.split(" ").pop()?.charAt(0) || "?"}
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-800">{candidate.full_name || "Chua co ten"}</h3>
              <p className="text-sm font-bold text-slate-500 mt-1">{candidate.student_id || "N/A"} • {candidate.university || "N/A"}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest border ${statusStyles[candidate.status] || "bg-slate-100 text-slate-500 border-slate-200"}`}>
                  {candidate.status}
                </span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-200 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-8 space-y-6 overflow-y-auto">
          <div className="space-y-2">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ho so khen thuong</h4>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="font-bold text-slate-800 text-sm">{candidate.award_name || "Chua xac dinh"}</div>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                {candidate.description || "Khong co ghi chu them."}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <Calendar size={12} />
              Minh chung
            </h4>
            {candidate.evidence_url ? (
              <a
                href={candidate.evidence_url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-4 bg-blue-50/50 rounded-2xl border border-blue-100 hover:bg-blue-50 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                    <ExternalLink size={18} />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-blue-700">Mo link minh chung</div>
                    <div className="text-[10px] text-blue-400 truncate max-w-[300px]">{candidate.evidence_url}</div>
                  </div>
                </div>
                <div className="text-blue-500 font-bold text-xs uppercase group-hover:underline">Xem ngay</div>
              </a>
            ) : (
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-sm text-slate-500 italic">
                Ung vien khong cung cap link minh chung.
              </div>
            )}
          </div>

          <div className="space-y-2">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <MessageSquare size={12} />
              Phan hoi cho sinh vien
            </h4>
            <textarea
              rows={3}
              value={feedback}
              onChange={(event) => setFeedback(event.target.value)}
              placeholder="Nhap ly do tu choi hoac nhan xet cho ho so..."
              className="w-full bg-white border border-slate-200 rounded-2xl p-4 text-sm font-medium text-slate-700 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all resize-none"
            />
          </div>
        </div>

        {candidate.status === "PENDING" && (
          <div className="p-6 border-t border-slate-100 bg-slate-50 flex gap-4">
            <button
              disabled={isProcessing}
              onClick={() => onProcess("REJECTED", feedback)}
              className="flex-1 py-4 bg-white border border-rose-200 text-rose-600 rounded-2xl text-xs font-black uppercase tracking-widest shadow-sm hover:bg-rose-50 active:scale-95 transition-all text-center"
            >
              Tu choi
            </button>
            <button
              disabled={isProcessing}
              onClick={() => onProcess("APPROVED", feedback)}
              className="flex-[2] py-4 bg-blue-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all text-center"
            >
              {isProcessing ? "Dang xu ly..." : "Duyet ho so"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Awards;
