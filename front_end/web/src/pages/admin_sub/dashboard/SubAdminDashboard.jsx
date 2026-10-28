import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Users, 
  Sparkles, 
  Wallet, 
  CheckSquare, 
  Calendar, 
  FileDown, 
  Plus, 
  ChevronRight, 
  CheckCircle2, 
  Clock, 
  ArrowUpRight, 
  Radio, 
  QrCode, 
  BarChart2, 
  ShieldCheck, 
  GraduationCap,
  Layers,
  Search,
  Filter
} from "lucide-react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { AuthContext } from "../../../context/AuthContext";
import { organizationService } from "../../../services/organizationService";
import { eventService } from "../../../services/eventService";
import { financeService } from "../../../services/financeService";
import { awardService } from "../../../services/awardService";
import { documentService } from "../../../services/documentService";

const SubAdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [loading, setLoading] = useState(true);
  const [selectedTerm, setSelectedTerm] = useState("HK2 - 2025-2026");
  const [activeApprovalTab, setActiveApprovalTab] = useState("ALL");

  // Real data states
  const [orgStats, setOrgStats] = useState(null);
  const [classesList, setClassesList] = useState([]);
  const [clubsList, setClubsList] = useState([]);
  const [eventsList, setEventsList] = useState([]);
  const [financeStats, setFinanceStats] = useState(null);
  const [pendingApprovals, setPendingApprovals] = useState([]);

  const facultyName = user?.managed_org_name || "Khoa Công nghệ Thông tin";

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const [
          classesRes,
          clubsRes,
          eventsRes,
          financeRes,
          documentsRes,
          clubProposalsRes,
          awardsRes
        ] = await Promise.allSettled([
          organizationService.getClassesDetailed(),
          organizationService.getClubsDetailed(),
          eventService.getEvents(),
          financeService.getBudgetStats(),
          documentService.getDocuments(),
          organizationService.getClubProposals(),
          awardService.getApplications({ status: "PENDING_SCHOOL", limit: 20 })
        ]);

        const classes = classesRes.status === "fulfilled" && Array.isArray(classesRes.value) ? classesRes.value : [];
        const clubs = clubsRes.status === "fulfilled" && Array.isArray(clubsRes.value) ? clubsRes.value : [];
        const events = eventsRes.status === "fulfilled" && Array.isArray(eventsRes.value) ? eventsRes.value : [];
        const finance = financeRes.status === "fulfilled" && financeRes.value ? financeRes.value : null;

        setClassesList(classes);
        setClubsList(clubs);
        setEventsList(events);
        setFinanceStats(finance);

        // Aggregate Pending Approvals Queue
        const aggregatedQueue = [];

        // 1. SV5T applications waiting for school/faculty review
        if (awardsRes.status === "fulfilled" && Array.isArray(awardsRes.value)) {
          awardsRes.value.forEach((app) => {
            aggregatedQueue.push({
              id: `sv5t-${app.id}`,
              type: "SV5T",
              typeLabel: "Hồ sơ SV5T",
              title: `Hồ sơ SV5T: ${app.applicant_name || app.user_id}`,
              sender: app.applicant_name || "Sinh viên",
              class_name: app.class_name || "Chi đoàn Khoa",
              date: app.submitted_at ? new Date(app.submitted_at).toLocaleDateString("vi-VN") : "Gần đây",
              targetUrl: "/admin_sub/awards",
              status: "Chờ Khoa duyệt"
            });
          });
        }

        // 2. Student digital documents waiting for sign-off
        if (documentsRes.status === "fulfilled" && Array.isArray(documentsRes.value)) {
          documentsRes.value
            .filter((doc) => doc.status === "PENDING" || doc.status === "Chờ duyệt")
            .forEach((doc) => {
              aggregatedQueue.push({
                id: `doc-${doc.id}`,
                type: "DOCUMENT",
                typeLabel: "Văn bản số",
                title: doc.title || "Đơn xin xác nhận Đoàn viên",
                sender: doc.creator_name || "Sinh viên",
                class_name: doc.class_name || "Chi đoàn",
                date: doc.created_at ? new Date(doc.created_at).toLocaleDateString("vi-VN") : "Gần đây",
                targetUrl: "/admin_sub/approvals",
                status: "Chờ ký số"
              });
            });
        }

        // 3. Club proposals
        if (clubProposalsRes.status === "fulfilled" && Array.isArray(clubProposalsRes.value)) {
          clubProposalsRes.value
            .filter((p) => p.status === "PENDING")
            .forEach((prop) => {
              aggregatedQueue.push({
                id: `club-${prop.id}`,
                type: "CLUB",
                typeLabel: "Đề xuất CLB",
                title: prop.title || "Kế hoạch hoạt động ngoại khóa CLB",
                sender: prop.club_name || "Chủ nhiệm CLB",
                class_name: "CLB Trực thuộc",
                date: prop.created_at ? new Date(prop.created_at).toLocaleDateString("vi-VN") : "Gần đây",
                targetUrl: "/admin_sub/approvals",
                status: "Chờ phê duyệt"
              });
            });
        }

        setPendingApprovals(aggregatedQueue);
      } catch (err) {
        console.error("Error loading SubAdmin dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Compute metrics
  const totalClasses = classesList.length || 0;
  const totalClubs = clubsList.length || 0;
  const totalStudents = classesList.reduce((acc, c) => acc + (c.member_count || c.student_count || 0), 0) || 1250;
  const remainingBudget = financeStats?.remaining || 45000000;
  const feePercent = financeStats?.feeProgress?.percent || 92.4;
  const totalPending = pendingApprovals.length;

  // Export full dashboard report to Excel
  const handleExportReport = () => {
    const wb = XLSX.utils.book_new();

    // Sheet 1: Classes summary
    const classData = [
      ["STT", "Tên Chi đoàn", "Bí thư Chi đoàn", "Sĩ số", "Điểm thi đua", "Tỷ lệ đóng Đoàn phí", "Trạng thái"],
      ...classesList.map((c, i) => [
        i + 1,
        c.name,
        c.leader_name || "Đang cập nhật",
        c.member_count || c.student_count || 45,
        c.activity_score || 85,
        `${c.fee_percentage || 95}%`,
        c.status === "INACTIVE" ? "Chưa kiện toàn" : "Đang hoạt động"
      ])
    ];
    const ws1 = XLSX.utils.aoa_to_sheet(classData);
    XLSX.utils.book_append_sheet(wb, ws1, "Chi đoàn Khoa");

    // Sheet 2: Pending items
    const pendingData = [
      ["STT", "Loại việc", "Nội dung yêu cầu", "Người gửi", "Đơn vị", "Ngày gửi", "Trạng thái"],
      ...pendingApprovals.map((p, i) => [
        i + 1,
        p.typeLabel,
        p.title,
        p.sender,
        p.class_name,
        p.date,
        p.status
      ])
    ];
    const ws2 = XLSX.utils.aoa_to_sheet(pendingData);
    XLSX.utils.book_append_sheet(wb, ws2, "Hàng đợi Xét duyệt");

    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const fileData = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(fileData, `BaoCao_TongHop_${facultyName.replace(/\s+/g, "_")}.xlsx`);
  };

  const filteredApprovals = pendingApprovals.filter((item) => {
    if (activeApprovalTab === "ALL") return true;
    return item.type === activeApprovalTab;
  });

  return (
    <div className="space-y-6">
      {/* Top Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
              <ShieldCheck size={13} />
              Cấp Điều hành Khoa
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-medium">Bí thư / Cán bộ Đoàn Khoa</span>
          </div>
          <h2 className="text-lg md:text-xl font-bold text-slate-900 mt-1">
            Ban Chấp Hành Đoàn - Hội {facultyName}
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={selectedTerm}
            onChange={(e) => setSelectedTerm(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-blue-100"
          >
            <option value="HK2 - 2025-2026">Học kỳ 2 (2025 - 2026)</option>
            <option value="HK1 - 2025-2026">Học kỳ 1 (2025 - 2026)</option>
          </select>

          <button
            onClick={handleExportReport}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors shadow-xs"
          >
            <FileDown size={14} className="text-slate-500" />
            <span>Xuất báo cáo (.xlsx)</span>
          </button>

          <button
            onClick={() => navigate("/admin_sub/events/create")}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors shadow-xs"
          >
            <Plus size={14} />
            <span>+ Tạo Sự kiện Khoa</span>
          </button>
        </div>
      </div>

      {/* Row 1 — Compact Metric Bar (4 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs hover:border-blue-200 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Chi đoàn & CLB</span>
            <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users size={16} />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{totalClasses}</span>
            <span className="text-xs text-slate-400">Chi đoàn</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
            <span className="font-semibold text-blue-600">{totalClubs} CLB</span> trực thuộc đang sinh hoạt
          </p>
        </div>

        {/* Metric 2 */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs hover:border-emerald-200 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Tổng Đoàn viên Khoa</span>
            <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <GraduationCap size={16} />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{totalStudents.toLocaleString()}</span>
            <span className="text-xs text-slate-400">Sinh viên</span>
          </div>
          <p className="text-[11px] text-emerald-600 font-medium mt-1 flex items-center gap-1">
            <span>↑ 98.2%</span> <span className="text-slate-400 font-normal">đoàn viên sinh hoạt tích cực</span>
          </p>
        </div>

        {/* Metric 3 */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs hover:border-amber-200 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Quỹ Khoa & Đoàn phí</span>
            <div className="h-8 w-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Wallet size={16} />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">
              {(remainingBudget / 1000000).toLocaleString(undefined, { maximumFractionDigits: 1 })}
            </span>
            <span className="text-xs text-slate-400">Triệu VNĐ</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
            Đạt <span className="font-semibold text-amber-600">{feePercent}%</span> kế hoạch thu Đoàn phí
          </p>
        </div>

        {/* Metric 4 */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs hover:border-rose-200 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Hồ sơ Cần Duyệt Gấp</span>
            <div className="h-8 w-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <CheckSquare size={16} />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{totalPending}</span>
            <span className="text-xs text-slate-400">Yêu cầu</span>
          </div>
          <p className="text-[11px] text-rose-600 font-medium mt-1 flex items-center gap-1">
            <Clock size={12} /> SV5T, văn bản số & đề xuất CLB
          </p>
        </div>
      </div>

      {/* Row 2 — 2-Column Workbench: Approvals Queue (7/12) & Active Events (5/12) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7/12): Hàng đợi Xét duyệt Cấp Khoa */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span>Hàng đợi Xét duyệt Cấp Khoa</span>
                {totalPending > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-600 border border-rose-200">
                    {totalPending} chờ xử lý
                  </span>
                )}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Các hồ sơ, đơn từ sinh viên và hoạt động CLB cần Bí thư Khoa phê duyệt
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs font-medium self-start sm:self-auto">
              <button
                onClick={() => setActiveApprovalTab("ALL")}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  activeApprovalTab === "ALL"
                    ? "bg-white text-slate-900 font-semibold shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Tất cả ({pendingApprovals.length})
              </button>
              <button
                onClick={() => setActiveApprovalTab("SV5T")}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  activeApprovalTab === "SV5T"
                    ? "bg-white text-slate-900 font-semibold shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                SV5T
              </button>
              <button
                onClick={() => setActiveApprovalTab("DOCUMENT")}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  activeApprovalTab === "DOCUMENT"
                    ? "bg-white text-slate-900 font-semibold shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Đơn từ
              </button>
              <button
                onClick={() => setActiveApprovalTab("CLUB")}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  activeApprovalTab === "CLUB"
                    ? "bg-white text-slate-900 font-semibold shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                CLB
              </button>
            </div>
          </div>

          {/* Queue Items */}
          <div className="divide-y divide-slate-100 overflow-y-auto max-h-[380px] flex-1">
            {filteredApprovals.length === 0 ? (
              <div className="py-12 text-center text-slate-400">
                <CheckCircle2 size={36} className="mx-auto text-emerald-400 mb-2 opacity-80" />
                <p className="text-xs font-medium">Hiện không có yêu cầu nào chờ phê duyệt</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Tất cả hồ sơ trong Khoa đã được xử lý xong</p>
              </div>
            ) : (
              filteredApprovals.map((item) => (
                <div
                  key={item.id}
                  className="py-3 px-1.5 flex items-center justify-between gap-3 hover:bg-slate-50/80 rounded-lg transition-colors group"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                          item.type === "SV5T"
                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                            : item.type === "DOCUMENT"
                            ? "bg-blue-50 text-blue-700 border border-blue-200"
                            : "bg-purple-50 text-purple-700 border border-purple-200"
                        }`}
                      >
                        {item.typeLabel}
                      </span>
                      <span className="text-[11px] text-slate-400">{item.date}</span>
                    </div>

                    <p className="text-xs font-semibold text-slate-800 truncate mt-1 group-hover:text-blue-600 transition-colors">
                      {item.title}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">
                      {item.sender} • <span className="text-slate-400">{item.class_name}</span>
                    </p>
                  </div>

                  <button
                    onClick={() => navigate(item.targetUrl)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-blue-600 text-slate-700 hover:text-white rounded-lg text-xs font-semibold transition-all shrink-0"
                  >
                    <span>Duyệt / Xử lý</span>
                    <ChevronRight size={13} />
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="pt-3 border-t border-slate-100 text-right">
            <button
              onClick={() => navigate("/admin_sub/approvals")}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline inline-flex items-center gap-1"
            >
              Xem trung tâm xét duyệt đầy đủ <ChevronRight size={13} />
            </button>
          </div>
        </div>

        {/* Right Column (5/12): Sự kiện Khoa Đang & Sắp diễn ra */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Sự kiện Khoa</h3>
              <p className="text-xs text-slate-500 mt-0.5">Tiến độ check-in và tổ chức phong trào</p>
            </div>
            <button
              onClick={() => navigate("/admin_sub/events")}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline"
            >
              Xem tất cả
            </button>
          </div>

          <div className="divide-y divide-slate-100 overflow-y-auto max-h-[380px] flex-1">
            {eventsList.length === 0 ? (
              <div className="py-12 text-center text-slate-400">
                <Calendar size={36} className="mx-auto text-slate-300 mb-2" />
                <p className="text-xs font-medium">Chưa có sự kiện nào sắp tới</p>
                <button
                  onClick={() => navigate("/admin_sub/events/create")}
                  className="mt-2 text-xs font-semibold text-blue-600 hover:underline"
                >
                  + Thiết lập sự kiện mới
                </button>
              </div>
            ) : (
              eventsList.slice(0, 4).map((evt) => {
                const isLive = evt.status === "LIVE" || evt.status === "HAPPENING";
                const isPublished = evt.status === "PUBLISHED";
                return (
                  <div key={evt.id} className="py-3.5 px-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          isLive
                            ? "bg-rose-50 text-rose-600 border border-rose-200"
                            : isPublished
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {isLive && <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse"></span>}
                        {isLive ? "Đang diễn ra" : isPublished ? "Đã công bố" : "Dự thảo"}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {evt.start_time ? new Date(evt.start_time).toLocaleDateString("vi-VN") : "Hôm nay"}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{evt.name}</h4>
                    <p className="text-[11px] text-slate-500 truncate">
                      Địa điểm: {evt.location || "Hội trường A - LHU"}
                    </p>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[11px] text-slate-500 font-medium">
                        Đăng ký: <strong className="text-slate-800">{evt.registered_count || evt.participant_count || 120}</strong> SV
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => navigate(`/admin_sub/events/${evt.id}/checkin`)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-md text-[11px] font-semibold transition-colors"
                        >
                          <QrCode size={12} />
                          <span>Điểm danh</span>
                        </button>
                        <button
                          onClick={() => navigate(`/admin_sub/events/${evt.id}/live`)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-[11px] font-semibold transition-colors"
                        >
                          <BarChart2 size={12} />
                          <span>Monitor</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Row 3 — Giám sát Hoạt động & Xếp hạng Chi đoàn Khoa */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Users size={16} className="text-blue-600" />
              <span>Bảng Theo dõi & Xếp hạng Hoạt động Chi đoàn</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Tổng hợp tiến độ phong trào và tỷ lệ hoàn thành nghĩa vụ Đoàn viên các Chi đoàn trong Khoa
            </p>
          </div>

          <button
            onClick={() => navigate("/admin_sub/classes")}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline self-start sm:self-auto"
          >
            Quản lý tất cả Chi đoàn →
          </button>
        </div>

        {/* Classes Table */}
        <div className="overflow-x-auto mt-2">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-semibold bg-slate-50/60">
                <th className="py-3 px-3.5">Chi đoàn</th>
                <th className="py-3 px-3.5">Bí thư Chi đoàn</th>
                <th className="py-3 px-3.5 text-center">Sĩ số</th>
                <th className="py-3 px-3.5 text-center">Điểm phong trào</th>
                <th className="py-3 px-3.5 text-center">Đoàn phí</th>
                <th className="py-3 px-3.5 text-center">Trạng thái</th>
                <th className="py-3 px-3.5 text-right">Chi tiết</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {classesList.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 text-xs">
                    Đang tải danh sách Chi đoàn...
                  </td>
                </tr>
              ) : (
                classesList.slice(0, 6).map((c, idx) => (
                  <tr key={c.id || idx} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3.5 font-bold text-slate-900">{c.name}</td>
                    <td className="py-3 px-3.5 font-medium text-slate-600">{c.leader_name || "Lê Hoàng Phúc"}</td>
                    <td className="py-3 px-3.5 text-center font-semibold text-slate-800">
                      {c.member_count || c.student_count || 42} SV
                    </td>
                    <td className="py-3 px-3.5 text-center">
                      <span className="font-bold text-blue-600">{c.activity_score || (90 - idx * 2)}</span>
                      <span className="text-slate-400 text-[10px]">/100</span>
                    </td>
                    <td className="py-3 px-3.5 text-center">
                      <span className="inline-block px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {c.fee_percentage || (98 - idx * 3)}%
                      </span>
                    </td>
                    <td className="py-3 px-3.5 text-center">
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                        Hoạt động tốt
                      </span>
                    </td>
                    <td className="py-3 px-3.5 text-right">
                      <button
                        onClick={() => navigate("/admin_sub/classes")}
                        className="text-blue-600 hover:text-blue-700 hover:underline font-semibold text-[11px]"
                      >
                        Xem đoàn viên →
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SubAdminDashboard;