import React, { useState, useEffect, useContext, useMemo } from "react";
import {
  Trophy,
  Calendar,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  Eye,
  Edit3,
  Send,
  FileCheck,
  ChevronRight,
  Info,
  ExternalLink,
} from "lucide-react";
import { AuthContext } from "../../../context/AuthContext";
import { awardService } from "../../../services/awardService";
import AwardStatusBadge from "../../../components/awards/AwardStatusBadge";
import AwardApplicationDetailModal from "../../../components/awards/AwardApplicationDetailModal";
import AwardApplicationFormModal from "../../../components/awards/AwardApplicationFormModal";

const UserAwards = () => {
  const { user } = useContext(AuthContext);

  const [myApplications, setMyApplications] = useState([]);
  const [periods, setPeriods] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [selectedAppId, setSelectedAppId] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingApp, setEditingApp] = useState(null);
  const [formMode, setFormMode] = useState("create");

  const loadData = async () => {
    setLoading(true);
    try {
      const [appsData, periodsData] = await Promise.all([
        awardService.getApplications(),
        awardService.getPeriods({ status: "ONGOING" }),
      ]);
      // Filter applications belonging to this student
      const userApps = Array.isArray(appsData)
        ? appsData.filter(
            (item) => item.user_id === user?.id || item.student_code === user?.student_id
          )
        : [];
      setMyApplications(userApps);
      setPeriods(periodsData || []);
    } catch (err) {
      console.error("Error loading student awards data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      loadData();
    }
  }, [user?.id]);

  const summary = useMemo(() => {
    return {
      total: myApplications.length,
      approved: myApplications.filter((a) => a.status === "APPROVED").length,
      pending: myApplications.filter((a) =>
        ["PENDING_SCHOOL", "PENDING_PROVINCE", "QUALIFIED"].includes(a.status)
      ).length,
      returned: myApplications.filter((a) =>
        ["RETURNED", "PROVINCE_RETURNED"].includes(a.status)
      ).length,
    };
  }, [myApplications]);

  const handleOpenDetail = (appId) => {
    setSelectedAppId(appId);
    setDetailModalOpen(true);
  };

  const handleCreateNew = () => {
    setEditingApp(null);
    setFormMode("create");
    setFormModalOpen(true);
  };

  const handleEditApp = (app) => {
    setEditingApp(app);
    setFormMode("edit");
    setFormModalOpen(true);
  };

  const handleSubmitDraft = async (app) => {
    if (!window.confirm(`Xác nhận nộp hồ sơ ${app.application_code}?`)) return;
    try {
      await awardService.submitApplication(app.id);
      alert("Nộp hồ sơ thành công!");
      loadData();
    } catch (err) {
      alert(err.response?.data?.detail || "Lỗi khi nộp hồ sơ");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 1. HERO SECTION */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
              <Trophy size={13} />
              CỔNG NỘP HỒ SƠ SINH VIÊN 5 TỐT
            </div>
            <h1 className="text-xl font-bold text-slate-900">
              Hồ sơ Khen thưởng & Danh hiệu Sinh viên 5 Tốt
            </h1>
            <p className="text-xs text-slate-600 leading-relaxed">
              Tự nộp hồ sơ xét chọn danh hiệu Sinh viên 5 Tốt trực tuyến, đính kèm minh chứng cho 5 tiêu chí chuẩn và theo dõi kết quả thẩm định minh bạch từ Hội đồng xét chọn.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleCreateNew}
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors shadow-sm"
            >
              <Plus size={16} />
              <span>Nộp hồ sơ mới</span>
            </button>
          </div>
        </div>

        {/* 4 Summary Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-100">
          <div className="bg-slate-50 border border-slate-200/60 rounded-lg p-3 text-center">
            <p className="text-[11px] font-medium text-slate-500">Tổng số hồ sơ</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{summary.total}</p>
          </div>
          <div className="bg-emerald-50/50 border border-emerald-200/60 rounded-lg p-3 text-center">
            <p className="text-[11px] font-medium text-emerald-700">Đã đạt danh hiệu</p>
            <p className="text-2xl font-bold text-emerald-700 mt-1">{summary.approved}</p>
          </div>
          <div className="bg-sky-50/50 border border-sky-200/60 rounded-lg p-3 text-center">
            <p className="text-[11px] font-medium text-sky-700">Đang xét duyệt</p>
            <p className="text-2xl font-bold text-sky-700 mt-1">{summary.pending}</p>
          </div>
          <div className="bg-amber-50/50 border border-amber-200/60 rounded-lg p-3 text-center">
            <p className="text-[11px] font-medium text-amber-700">Cần bổ sung / Sửa</p>
            <p className="text-2xl font-bold text-amber-700 mt-1">{summary.returned}</p>
          </div>
        </div>
      </div>

      {/* 2. ONGOING PERIODS NOTICE */}
      {periods.length > 0 && (
        <div className="bg-blue-50/60 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
          <Calendar size={18} className="text-blue-600 mt-0.5 shrink-0" />
          <div className="text-xs text-blue-900">
            <p className="font-semibold">Đợt xét chọn đang mở tiếp nhận hồ sơ:</p>
            <ul className="list-disc pl-4 mt-1 space-y-0.5 text-blue-800">
              {periods.map((p) => (
                <li key={p.id}>
                  <strong>{p.name}</strong> ({p.code}) — Hạn nộp hồ sơ:{" "}
                  <strong>
                    {p.submission_deadline
                      ? new Date(p.submission_deadline).toLocaleString("vi-VN")
                      : "Theo thông báo"}
                  </strong>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* 3. MY APPLICATIONS LIST */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText size={16} className="text-blue-600" />
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Danh sách Hồ sơ của Tôi
            </h3>
          </div>
          <span className="text-[11px] font-medium text-slate-500">
            {myApplications.length} hồ sơ đã lập
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {loading ? (
            <div className="p-8 text-center text-xs text-slate-400">Đang tải dữ liệu hồ sơ...</div>
          ) : myApplications.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-12 h-12 rounded-full bg-slate-50 border border-slate-200 text-slate-400 flex items-center justify-center mx-auto mb-3">
                <FileCheck size={22} />
              </div>
              <p className="text-xs font-semibold text-slate-700">Bạn chưa có hồ sơ xét chọn nào</p>
              <p className="text-[11px] text-slate-400 mt-1 max-w-sm mx-auto">
                Hãy bấm "Nộp hồ sơ mới" để bắt đầu khai báo thành tích và đính kèm minh chứng cho đợt xét chọn SV5T đang diễn ra.
              </p>
              <button
                type="button"
                onClick={handleCreateNew}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors shadow-sm"
              >
                Nộp hồ sơ ngay
              </button>
            </div>
          ) : (
            myApplications.map((app) => (
              <div
                key={app.id}
                className="p-4 hover:bg-slate-50/80 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-bold text-slate-800">
                      {app.application_code}
                    </span>
                    <AwardStatusBadge status={app.status} />
                    {app.is_late_submission && (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 font-medium">
                        Gửi muộn
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-semibold text-slate-900 truncate">
                    {app.full_name} · Đợt {app.period_code}
                  </h4>
                  <div className="flex items-center gap-4 text-[11px] text-slate-500 flex-wrap">
                    <span>MSSV: {app.student_code}</span>
                    <span>GPA: {app.gpa ?? "—"}</span>
                    <span>ĐRL: {app.training_score ?? "—"}</span>
                    <span>
                      Ngày tạo:{" "}
                      {app.created_at
                        ? new Date(app.created_at).toLocaleDateString("vi-VN")
                        : "—"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleOpenDetail(app.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
                  >
                    <Eye size={14} className="text-slate-500" />
                    <span>Xem chi tiết</span>
                  </button>

                  {(app.status === "DRAFT" || app.status === "RETURNED") && (
                    <>
                      <button
                        type="button"
                        onClick={() => handleEditApp(app)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-amber-200 rounded-lg text-xs font-medium text-amber-700 hover:bg-amber-50 transition-colors shadow-sm"
                      >
                        <Edit3 size={14} />
                        <span>Sửa</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSubmitDraft(app)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-medium hover:bg-emerald-700 transition-colors shadow-sm"
                      >
                        <Send size={14} />
                        <span>Nộp</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 4. MODALS */}
      <AwardApplicationDetailModal
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        applicationId={selectedAppId}
        role="STUDENT"
        onActionSuccess={loadData}
      />

      <AwardApplicationFormModal
        isOpen={formModalOpen}
        onClose={() => setFormModalOpen(false)}
        application={editingApp}
        mode={formMode}
        onSuccess={loadData}
      />
    </div>
  );
};

export default UserAwards;
