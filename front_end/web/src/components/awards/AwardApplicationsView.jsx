import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Search,
  Filter,
  Download,
  Plus,
  Eye,
  Edit3,
  Trash2,
  Send,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Columns,
  Check,
  RefreshCw,
  FileSpreadsheet,
} from "lucide-react";
import * as XLSX from "xlsx";
import AwardStatusBadge from "./AwardStatusBadge";
import AwardApplicationDetailModal from "./AwardApplicationDetailModal";
import AwardApplicationFormModal from "./AwardApplicationFormModal";
import { awardService } from "../../services/awardService";

const AwardApplicationsView = ({ currentUser, role = "ADMIN", onRefreshParent, organization_id = "" }) => {
  // Filters state
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [targetTypeFilter, setTargetTypeFilter] = useState("");
  const [periodFilter, setPeriodFilter] = useState("");
  const [unitFilter, setUnitFilter] = useState(organization_id || "");

  useEffect(() => {
    if (organization_id) {
      setUnitFilter(organization_id);
    }
  }, [organization_id]);

  // Data state
  const [applications, setApplications] = useState([]);
  const [periods, setPeriods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Modals state
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedApplicationId, setSelectedApplicationId] = useState(null);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingApplication, setEditingApplication] = useState(null);
  const [formMode, setFormMode] = useState("create"); // "create" | "edit" | "resubmit"

  // Column visibility state
  const [showColumnDropdown, setShowColumnDropdown] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState({
    code: true,
    candidate: true,
    unit: true,
    scores: true,
    period: true,
    status: true,
    isLate: true,
    submittedAt: true,
    actions: true,
  });

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Load periods for filter
  useEffect(() => {
    const loadPeriods = async () => {
      try {
        const data = await awardService.getPeriods();
        setPeriods(data || []);
      } catch (err) {
        console.error("Error loading periods for filter:", err);
      }
    };
    loadPeriods();
  }, []);

  // Fetch applications
  const fetchApplications = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        skip: (page - 1) * pageSize,
        limit: pageSize,
      };
      if (debouncedSearch) params.search = debouncedSearch;
      if (statusFilter) params.status = statusFilter;
      if (yearFilter) params.year = parseInt(yearFilter, 10);
      if (targetTypeFilter) params.target_type = targetTypeFilter;
      if (periodFilter) params.period_id = periodFilter;
      if (unitFilter) params.organization_id = unitFilter;

      const data = await awardService.getApplications(params);
      setApplications(data || []);
      setTotalCount(data?.length || 0); // When backend returns array
    } catch (err) {
      console.error("Error fetching applications:", err);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, debouncedSearch, statusFilter, yearFilter, targetTypeFilter, periodFilter, unitFilter]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  // Extract unique units for filter dropdown
  const uniqueUnits = useMemo(() => {
    const unitsMap = new Map();
    applications.forEach((app) => {
      if (app.school_name) {
        unitsMap.set(app.school_name, app.school_name);
      }
    });
    return Array.from(unitsMap.keys());
  }, [applications]);

  // Check if current user can edit this application
  const canEditApp = (app) => {
    if (!app) return false;
    if (role === "ADMIN" || role === "UNIVERSITY_ADMIN") return true;
    if ((app.status === "DRAFT" || app.status === "RETURNED") && app.created_by_id === currentUser?.id) {
      return true;
    }
    if (app.status === "PROVINCE_RETURNED") {
      // School officer can supplement
      return true;
    }
    return false;
  };

  const handleOpenDetail = (appId) => {
    setSelectedApplicationId(appId);
    setDetailModalOpen(true);
  };

  const handleOpenCreate = () => {
    setEditingApplication(null);
    setFormMode("create");
    setFormModalOpen(true);
  };

  const handleOpenEdit = (app) => {
    setEditingApplication(app);
    if (app.status === "PROVINCE_RETURNED") {
      setFormMode("resubmit");
    } else {
      setFormMode("edit");
    }
    setFormModalOpen(true);
  };

  const handleDeleteDraft = async (app) => {
    if (app.status !== "DRAFT") {
      alert("Chỉ có thể xóa hồ sơ ở trạng thái Nháp!");
      return;
    }
    if (window.confirm(`Bạn có chắc chắn muốn xóa hồ sơ ${app.application_code}?`)) {
      try {
        await awardService.deleteApplication(app.id);
        fetchApplications();
      } catch (err) {
        alert(err.response?.data?.detail || "Lỗi khi xóa hồ sơ");
      }
    }
  };

  const handleSubmitDraft = async (app) => {
    if (!window.confirm(`Xác nhận nộp hồ sơ ${app.application_code} lên cấp xét duyệt?`)) return;
    try {
      await awardService.submitApplication(app.id);
      alert("Nộp hồ sơ thành công!");
      fetchApplications();
    } catch (err) {
      alert(err.response?.data?.detail || "Lỗi khi nộp hồ sơ. Vui lòng kiểm tra lại minh chứng!");
    }
  };

  // Export to Excel function using xlsx
  const handleExportExcel = () => {
    const exportData = applications.map((app, index) => ({
      STT: index + 1,
      "Mã hồ sơ": app.application_code,
      "Loại đối tượng": app.target_type === "INDIVIDUAL" ? "Cá nhân" : "Tập thể",
      "Họ và tên / Tên tập thể": app.full_name,
      MSSV: app.student_code || "—",
      Trường: app.school_name || "—",
      Khoa: app.faculty_name || "—",
      Lớp: app.class_name || "—",
      "Năm thứ": app.academic_year_num ? `Năm ${app.academic_year_num}` : "—",
      GPA: app.gpa != null ? app.gpa : "—",
      ĐRL: app.training_score != null ? app.training_score : "—",
      "Đoàn / Hội": app.political_status || "—",
      "Chức vụ": app.union_position || "—",
      "Đợt xét chọn": app.period_code || "—",
      "Trạng thái": app.status,
      "Gửi muộn": app.is_late_submission ? "Có" : "Không",
      "Ngày tạo": app.created_at ? new Date(app.created_at).toLocaleDateString("vi-VN") : "—",
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    const sheetName = targetTypeFilter === "COLLECTIVE" ? "DS_TapThe_SV5T" : "DS_SinhVien_5Tot";
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

    // Auto column widths
    const maxProps = Object.keys(exportData[0] || {}).map((key) => ({
      wch: Math.max(key.length, 14),
    }));
    worksheet["!cols"] = maxProps;

    const fileName = `${sheetName}_${new Date().toISOString().slice(0, 10)}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  const toggleColumn = (key) => {
    setVisibleColumns((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-4">
      {/* 1. FILTER & CONTROLS TOOLBAR */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Search box */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
            <input
              type="text"
              placeholder="Tìm kiếm theo mã hồ sơ, họ tên, MSSV, trường, lớp..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Column visibility toggle */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowColumnDropdown(!showColumnDropdown)}
                className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
              >
                <Columns size={15} className="text-slate-500" />
                <span>Cột</span>
              </button>

              {showColumnDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-lg py-2 z-30">
                  <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                    Ẩn / Hiện cột
                  </div>
                  {Object.entries({
                    code: "Mã hồ sơ",
                    candidate: "Ứng viên / Tập thể",
                    unit: "Đơn vị / Trường",
                    scores: "Điểm GPA / ĐRL",
                    period: "Đợt khen thưởng",
                    status: "Trạng thái",
                    isLate: "Hạn nộp",
                    submittedAt: "Ngày tạo",
                  }).map(([key, label]) => (
                    <label
                      key={key}
                      className="flex items-center gap-2 px-3 py-1.5 hover:bg-slate-50 cursor-pointer text-xs text-slate-700"
                    >
                      <input
                        type="checkbox"
                        checked={visibleColumns[key]}
                        onChange={() => toggleColumn(key)}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-3.5 w-3.5"
                      />
                      <span>{label}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Refresh */}
            <button
              type="button"
              onClick={fetchApplications}
              className="p-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors shadow-sm"
              title="Tải lại dữ liệu"
            >
              <RefreshCw size={16} className={loading ? "animate-spin text-blue-600" : ""} />
            </button>

            {/* Export Excel */}
            <button
              type="button"
              onClick={handleExportExcel}
              disabled={applications.length === 0}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-emerald-700 hover:bg-emerald-50 hover:border-emerald-300 transition-all shadow-sm disabled:opacity-50"
            >
              <FileSpreadsheet size={16} className="text-emerald-600" />
              <span>{targetTypeFilter === "COLLECTIVE" ? "Xuất DS tập thể" : "Xuất DS sinh viên"}</span>
            </button>

            {/* Create application button */}
            <button
              type="button"
              onClick={handleOpenCreate}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors shadow-sm"
            >
              <Plus size={16} />
              <span>Lập hồ sơ mới</span>
            </button>
          </div>
        </div>

        {/* Filters row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 pt-2 border-t border-slate-100 text-xs">
          {/* Status filter */}
          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">Trạng thái</label>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="DRAFT">Nháp</option>
              <option value="PENDING_SCHOOL">Chờ Khoa sơ duyệt</option>
              <option value="PENDING_PROVINCE">Chờ Đoàn Trường duyệt</option>
              <option value="PROVINCE_RETURNED">Đoàn Trường yêu cầu bổ sung</option>
              <option value="QUALIFIED">Đủ tiêu chuẩn</option>
              <option value="UNQUALIFIED">Chưa đủ tiêu chuẩn</option>
              <option value="RETURNED">Khoa trả về bổ sung</option>
              <option value="APPROVED">Đã phê duyệt</option>
              <option value="REJECTED">Hồ sơ không đạt</option>
            </select>
          </div>

          {/* Period filter */}
          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">Đợt xét chọn</label>
            <select
              value={periodFilter}
              onChange={(e) => {
                setPeriodFilter(e.target.value);
                setPage(1);
              }}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Tất cả các đợt</option>
              {periods.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.code} ({p.name})
                </option>
              ))}
            </select>
          </div>

          {/* Target Type filter */}
          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">Đối tượng</label>
            <select
              value={targetTypeFilter}
              onChange={(e) => {
                setTargetTypeFilter(e.target.value);
                setPage(1);
              }}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Tất cả đối tượng</option>
              <option value="INDIVIDUAL">Cá nhân</option>
              <option value="COLLECTIVE">Tập thể</option>
            </select>
          </div>

          {/* Year filter */}
          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">Năm học</label>
            <select
              value={yearFilter}
              onChange={(e) => {
                setYearFilter(e.target.value);
                setPage(1);
              }}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Tất cả các năm</option>
              <option value="2026">2026</option>
              <option value="2025">2025</option>
              <option value="2024">2024</option>
            </select>
          </div>

          {/* Unit / School filter */}
          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">Đơn vị / Trường</label>
            <select
              value={unitFilter}
              onChange={(e) => {
                setUnitFilter(e.target.value);
                setPage(1);
              }}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Tất cả đơn vị</option>
              {uniqueUnits.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 2. APPLICATIONS TABLE */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/90 border-b border-slate-200 text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
                {visibleColumns.code && <th className="py-3 px-4">Mã hồ sơ</th>}
                {visibleColumns.candidate && <th className="py-3 px-4">Ứng viên / Tập thể</th>}
                {visibleColumns.unit && <th className="py-3 px-4">Đơn vị</th>}
                {visibleColumns.scores && <th className="py-3 px-4 text-center">GPA / ĐRL</th>}
                {visibleColumns.period && <th className="py-3 px-4">Đợt xét chọn</th>}
                {visibleColumns.status && <th className="py-3 px-4">Trạng thái</th>}
                {visibleColumns.isLate && <th className="py-3 px-4 text-center">Hạn nộp</th>}
                {visibleColumns.submittedAt && <th className="py-3 px-4">Ngày tạo</th>}
                {visibleColumns.actions && <th className="py-3 px-4 text-right">Thao tác</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {loading ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    <RefreshCw size={24} className="animate-spin text-blue-600 mx-auto mb-2" />
                    Đang tải danh sách hồ sơ...
                  </td>
                </tr>
              ) : applications.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    Không tìm thấy hồ sơ nào phù hợp với điều kiện lọc.
                  </td>
                </tr>
              ) : (
                applications.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Code */}
                    {visibleColumns.code && (
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                        {app.application_code}
                      </td>
                    )}

                    {/* Candidate */}
                    {visibleColumns.candidate && (
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900">{app.full_name}</div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                          {app.target_type === "COLLECTIVE" ? (
                            <span className="inline-block px-1.5 py-0.2 bg-purple-50 text-purple-700 rounded text-[10px] font-medium border border-purple-200">
                              Tập thể
                            </span>
                          ) : (
                            <span>MSSV: {app.student_code || "—"}</span>
                          )}
                          {app.academic_year_num && <span>• Năm {app.academic_year_num}</span>}
                        </div>
                      </td>
                    )}

                    {/* Unit */}
                    {visibleColumns.unit && (
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-slate-700">{app.school_name || "—"}</div>
                        <div className="text-[11px] text-slate-400">
                          {app.faculty_name} {app.class_name ? `• ${app.class_name}` : ""}
                        </div>
                      </td>
                    )}

                    {/* Scores */}
                    {visibleColumns.scores && (
                      <td className="py-3.5 px-4 text-center">
                        {app.target_type === "INDIVIDUAL" ? (
                          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-slate-50 border border-slate-200 rounded font-medium text-slate-700 text-[11px]">
                            <span>GPA: <strong className="text-blue-700">{app.gpa ?? "—"}</strong></span>
                            <span>|</span>
                            <span>ĐRL: <strong className="text-emerald-700">{app.training_score ?? "—"}</strong></span>
                          </div>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                    )}

                    {/* Period */}
                    {visibleColumns.period && (
                      <td className="py-3.5 px-4">
                        <span className="font-medium text-slate-700">{app.period_code || "—"}</span>
                      </td>
                    )}

                    {/* Status */}
                    {visibleColumns.status && (
                      <td className="py-3.5 px-4">
                        <AwardStatusBadge status={app.status} />
                      </td>
                    )}

                    {/* Late flag */}
                    {visibleColumns.isLate && (
                      <td className="py-3.5 px-4 text-center">
                        {app.is_late_submission ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-50 text-amber-700 border border-amber-200">
                            <AlertTriangle size={10} /> Gửi muộn
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[11px]">Đúng hạn</span>
                        )}
                      </td>
                    )}

                    {/* Submitted Date */}
                    {visibleColumns.submittedAt && (
                      <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                        {app.created_at ? new Date(app.created_at).toLocaleDateString("vi-VN") : "—"}
                      </td>
                    )}

                    {/* Actions */}
                    {visibleColumns.actions && (
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {/* View detail */}
                          <button
                            type="button"
                            onClick={() => handleOpenDetail(app.id)}
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                            title="Xem chi tiết hồ sơ"
                          >
                            <Eye size={15} />
                          </button>

                          {/* Edit / Resubmit */}
                          {canEditApp(app) && (
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(app)}
                              className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-md transition-colors"
                              title={app.status === "PROVINCE_RETURNED" ? "Bổ sung hồ sơ" : "Chỉnh sửa hồ sơ"}
                            >
                              <Edit3 size={15} />
                            </button>
                          )}

                          {/* Submit draft */}
                          {(app.status === "DRAFT" || app.status === "RETURNED") && (
                            <button
                              type="button"
                              onClick={() => handleSubmitDraft(app)}
                              className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors"
                              title="Nộp hồ sơ lên cấp xét duyệt"
                            >
                              <Send size={15} />
                            </button>
                          )}

                          {/* Delete draft */}
                          {app.status === "DRAFT" && (
                            <button
                              type="button"
                              onClick={() => handleDeleteDraft(app)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                              title="Xóa hồ sơ nháp"
                            >
                              <Trash2 size={15} />
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination bar */}
        <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div>
            Hiển thị <strong>{applications.length}</strong> hồ sơ
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="p-1.5 rounded border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition-colors"
            >
              <ChevronLeft size={15} />
            </button>
            <span className="font-medium text-slate-700">Trang {page}</span>
            <button
              type="button"
              disabled={applications.length < pageSize}
              onClick={() => setPage((p) => p + 1)}
              className="p-1.5 rounded border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition-colors"
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* 3. MODALS */}
      {/* Detail Modal */}
      <AwardApplicationDetailModal
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        applicationId={selectedApplicationId}
        role={role}
        onActionSuccess={() => {
          fetchApplications();
          if (onRefreshParent) onRefreshParent();
        }}
      />

      {/* Form Modal (Create / Edit / Resubmit) */}
      <AwardApplicationFormModal
        isOpen={formModalOpen}
        onClose={() => setFormModalOpen(false)}
        application={editingApplication}
        mode={formMode}
        onSuccess={() => {
          fetchApplications();
          if (onRefreshParent) onRefreshParent();
        }}
      />
    </div>
  );
};

export default AwardApplicationsView;
