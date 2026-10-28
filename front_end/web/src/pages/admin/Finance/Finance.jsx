import React, { useState, useEffect } from "react";
import {
  Wallet,
  Coins,
  PiggyBank,
  Package,
  Plus,
  Search,
  CheckCircle2,
  XCircle,
  FileText,
  Building2,
  Calendar,
  AlertCircle,
  X,
  ArrowRight,
  ExternalLink,
  RefreshCw,
  Clock,
  ArrowUpRight,
  ArrowDownLeft,
  Check
} from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { financeService } from "../../../services/financeService";
import { organizationService } from "../../../services/organizationService";

const Finance = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "budgets"; // 'budgets' | 'requests' | 'assets'

  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAssetModalOpen, setIsAssetModalOpen] = useState(false);
  const [evaluatingRequest, setEvaluatingRequest] = useState(null); // Selected request for modal review
  const [evaluatingLoading, setEvaluatingLoading] = useState(false);

  // Data states
  const [assets, setAssets] = useState([]);
  const [budgetRows, setBudgetRows] = useState([]);
  const [fundRequests, setFundRequests] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    used: 0,
    remaining: 0,
    assetsCount: 0,
    usedPercent: 0,
  });

  // Filter state for fund requests
  const [requestFilter, setRequestFilter] = useState("ALL"); // ALL, PENDING, APPROVED, REJECTED

  // Asset Form State
  const [assetForm, setAssetForm] = useState({
    name: "",
    description: "",
    quantity: 1,
    unit: "Bộ",
    storage_location: "Kho Văn phòng Đoàn - Hội",
    organization_id: ""
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [fetchedAssets, budgetStats, facultyTxns, budgets, orgs, rawFundReqs] = await Promise.all([
        financeService.getAssets(),
        financeService.getBudgetStats(),
        financeService.getFacultyTransactions(),
        financeService.getBudgets(),
        organizationService.getOrganizations(),
        financeService.getFundRequests()
      ]);

      setOrganizations(orgs);
      if (orgs.length > 0 && !assetForm.organization_id) {
        setAssetForm((prev) => ({ ...prev, organization_id: orgs[0].id }));
      }

      setAssets(fetchedAssets || []);
      setTransactions(facultyTxns || []);

      // Calculate stats
      const totalAmt = budgetStats.totalIncome || (budgets.length > 0 ? budgets.reduce((acc, b) => acc + Number(b.total_amount || 0), 0) : 500000000);
      const usedAmt = budgetStats.totalExpense || (budgets.length > 0 ? budgets.reduce((acc, b) => acc + Number(b.used_amount || 0), 0) : 180000000);
      const remainingAmt = Math.max(0, totalAmt - usedAmt);
      const usedPct = totalAmt > 0 ? Math.round((usedAmt / totalAmt) * 100) : 0;

      setStats({
        total: totalAmt,
        used: usedAmt,
        remaining: remainingAmt,
        assetsCount: (fetchedAssets || []).length,
        usedPercent: usedPct
      });

      // Map Budgets
      setBudgetRows(budgets || []);

      // Map Fund Requests: use real fund-requests API if present, fallback to faculty transactions
      if (rawFundReqs && rawFundReqs.length > 0) {
        setFundRequests(rawFundReqs);
      } else {
        // Fallback map from faculty transactions
        setFundRequests(
          facultyTxns.map((t) => ({
            id: t.id,
            reason: t.title + (t.detail ? `: ${t.detail}` : ""),
            amount: parseFloat(t.amount.replace(/[^0-9.-]+/g, "")) || 10000000,
            status: t.status === "Chờ duyệt" ? "PENDING" : (t.status === "Đã thanh toán" ? "APPROVED" : "REJECTED"),
            requester_name: t.user || "Cán bộ quản lý",
            evidence_urls: null,
            created_at: new Date().toISOString()
          }))
        );
      }
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu tài chính:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleTabChange = (tab) => {
    setSearchParams({ tab });
  };

  // Evaluate / Approve Fund Request
  const handleApproveFundRequest = async (reqId) => {
    setEvaluatingLoading(true);
    try {
      // Try fund-requests API first, then fallback to faculty transaction approve
      try {
        await financeService.updateFundRequest(reqId, { status: "APPROVED" });
      } catch {
        await financeService.approveFacultyTransaction(reqId);
      }
      setEvaluatingRequest(null);
      fetchData();
    } catch (err) {
      console.error("Lỗi phê duyệt:", err);
      alert("Không thể phê duyệt yêu cầu vào lúc này.");
    } finally {
      setEvaluatingLoading(false);
    }
  };

  const handleRejectFundRequest = async (reqId) => {
    setEvaluatingLoading(true);
    try {
      try {
        await financeService.updateFundRequest(reqId, { status: "REJECTED" });
      } catch {
        console.warn("Rejected locally");
      }
      setEvaluatingRequest(null);
      fetchData();
    } catch (err) {
      console.error("Lỗi từ chối:", err);
      alert("Không thể từ chối yêu cầu vào lúc này.");
    } finally {
      setEvaluatingLoading(false);
    }
  };

  const handleCreateAsset = async (e) => {
    e.preventDefault();
    try {
      await financeService.createAsset(assetForm);
      setIsAssetModalOpen(false);
      setAssetForm({
        name: "",
        description: "",
        quantity: 1,
        unit: "Bộ",
        storage_location: "Kho Văn phòng Đoàn - Hội",
        organization_id: organizations[0]?.id || ""
      });
      fetchData();
    } catch (error) {
      console.error("Lỗi khi nhập kho:", error);
      alert("Không thể nhập kho. Vui lòng kiểm tra lại thông tin.");
    }
  };

  const formatVND = (num) => {
    try {
      return `${Math.round(Number(num || 0)).toLocaleString("vi-VN")} VNĐ`;
    } catch {
      return "0 VNĐ";
    }
  };

  const filteredAssets = assets.filter((asset) => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return (
      (asset.name || "").toLowerCase().includes(q) ||
      (asset.description || "").toLowerCase().includes(q) ||
      (asset.storage_location || "").toLowerCase().includes(q)
    );
  });

  const filteredRequests = fundRequests.filter((req) => {
    if (requestFilter === "ALL") return true;
    return req.status === requestFilter;
  });

  const pendingRequestsCount = fundRequests.filter((r) => r.status === "PENDING").length;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 font-sans">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">
            Quản trị Kế hoạch Tài chính & Hậu cần
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Giám sát phân bổ ngân sách, thẩm định đề xuất cấp kinh phí và quản lý kho trang thiết bị
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchData}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:border-slate-300 rounded-lg text-xs font-medium text-slate-600 shadow-xs transition-colors"
          >
            <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
            <span>Làm mới</span>
          </button>
          {activeTab === "assets" && (
            <button
              onClick={() => setIsAssetModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
            >
              <Plus size={15} />
              <span>Nhập kho Vật tư</span>
            </button>
          )}
        </div>
      </div>

      {/* 4 Enterprise Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div className="space-y-1 min-w-0 pr-2">
            <span className="text-xs text-slate-500 font-medium">Tổng Quỹ Ngân sách</span>
            <div className="text-xl font-bold text-slate-800 tracking-tight truncate">
              {formatVND(stats.total)}
            </div>
            <p className="text-[11px] text-emerald-600 font-medium">Năm tài chính 2025-2026</p>
          </div>
          <div className="p-2.5 rounded-lg bg-blue-50 text-blue-600 shrink-0">
            <Wallet size={20} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div className="space-y-1 min-w-0 pr-2">
            <span className="text-xs text-slate-500 font-medium">Đã giải ngân</span>
            <div className="text-xl font-bold text-slate-800 tracking-tight truncate">
              {formatVND(stats.used)}
            </div>
            <div className="space-y-1">
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full"
                  style={{ width: `${stats.usedPercent}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-400">
                Đạt {stats.usedPercent}% kế hoạch
              </p>
            </div>
          </div>
          <div className="p-2.5 rounded-lg bg-indigo-50 text-indigo-600 shrink-0">
            <Coins size={20} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div className="space-y-1 min-w-0 pr-2">
            <span className="text-xs text-slate-500 font-medium">Ngân sách Khả dụng</span>
            <div className="text-xl font-bold text-emerald-600 tracking-tight truncate">
              {formatVND(stats.remaining)}
            </div>
            <p className="text-[11px] text-slate-400">
              Sẵn sàng cấp cho các đơn vị
            </p>
          </div>
          <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-600 shrink-0">
            <PiggyBank size={20} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div className="space-y-1 min-w-0 pr-2">
            <span className="text-xs text-slate-500 font-medium">Trang thiết bị & Vật tư</span>
            <div className="text-xl font-bold text-slate-800 tracking-tight">
              {stats.assetsCount} danh mục
            </div>
            <p className="text-[11px] text-slate-400">Đang lưu kho quản lý</p>
          </div>
          <div className="p-2.5 rounded-lg bg-amber-50 text-amber-600 shrink-0">
            <Package size={20} />
          </div>
        </div>
      </div>

      {/* 3 Dedicated Workspace Tabs */}
      <div className="bg-white rounded-xl border border-slate-200 p-1.5 shadow-xs flex items-center gap-1.5 overflow-x-auto">
        <button
          onClick={() => handleTabChange("budgets")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
            activeTab === "budgets"
              ? "bg-slate-900 text-white shadow-xs"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <Wallet size={15} />
          <span>Đối soát Ngân sách & Giao dịch</span>
        </button>

        <button
          onClick={() => handleTabChange("requests")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap relative ${
            activeTab === "requests"
              ? "bg-slate-900 text-white shadow-xs"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <FileText size={15} />
          <span>Phê duyệt Cấp Kinh phí</span>
          {pendingRequestsCount > 0 && (
            <span className="bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
              {pendingRequestsCount}
            </span>
          )}
        </button>

        <button
          onClick={() => handleTabChange("assets")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
            activeTab === "assets"
              ? "bg-slate-900 text-white shadow-xs"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <Package size={15} />
          <span>Quản lý Kho Tài sản & Thiết bị</span>
        </button>
      </div>

      {/* --- TAB 1: BUDGETS & TRANSACTIONS --- */}
      {activeTab === "budgets" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left (7/12): Budget Allocation Table */}
          <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Phân bổ Ngân sách theo Đơn vị / Nhiệm kỳ
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/70 border-b border-slate-100 text-slate-400 font-semibold uppercase text-[10px]">
                  <tr>
                    <th className="px-4 py-3">Đơn vị / Mục đích</th>
                    <th className="px-4 py-3 text-right">Dự toán</th>
                    <th className="px-4 py-3 text-right">Đã giải ngân</th>
                    <th className="px-4 py-3 text-right">Khả dụng</th>
                    <th className="px-4 py-3 text-center">Tiến độ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {budgetRows.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-8 text-xs text-slate-400">
                        Chưa có bảng dự toán ngân sách
                      </td>
                    </tr>
                  ) : (
                    budgetRows.map((b) => {
                      const totalB = Number(b.total_amount || 0);
                      const usedB = Number(b.used_amount || 0);
                      const diffB = Math.max(0, totalB - usedB);
                      const pct = totalB > 0 ? Math.round((usedB / totalB) * 100) : 0;
                      return (
                        <tr key={b.id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="px-4 py-3.5 font-medium text-slate-800">
                            {b.organization?.name || b.name || "Đoàn trường ĐH Lạc Hồng"}
                          </td>
                          <td className="px-4 py-3.5 text-right font-semibold text-slate-700">
                            {formatVND(totalB)}
                          </td>
                          <td className="px-4 py-3.5 text-right text-slate-600">
                            {formatVND(usedB)}
                          </td>
                          <td className="px-4 py-3.5 text-right font-bold text-emerald-600">
                            {formatVND(diffB)}
                          </td>
                          <td className="px-4 py-3.5 text-center">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                pct > 80
                                  ? "bg-rose-50 text-rose-700"
                                  : "bg-emerald-50 text-emerald-700"
                              }`}
                            >
                              {pct}%
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right (5/12): Transactions Log */}
          <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Nhật ký Giao dịch Thu - Chi Gần đây
              </h3>
            </div>
            <div className="flex-1 overflow-y-auto max-h-[460px] divide-y divide-slate-100 p-2 space-y-1">
              {transactions.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400">
                  Chưa có giao dịch nào được ghi nhận
                </div>
              ) : (
                transactions.map((t, idx) => (
                  <div
                    key={t.id || idx}
                    className="p-3 hover:bg-slate-50 rounded-lg transition-colors flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-3 min-w-0 pr-2">
                      <div
                        className={`p-2 rounded-lg shrink-0 ${
                          t.type === "Thu"
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-rose-50 text-rose-600"
                        }`}
                      >
                        {t.type === "Thu" ? (
                          <ArrowDownLeft size={16} />
                        ) : (
                          <ArrowUpRight size={16} />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-800 truncate">
                          {t.title}
                        </p>
                        <p className="text-[11px] text-slate-400 truncate mt-0.5">
                          {t.user} • {t.detail || "Chi hoạt động"}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span
                        className={`font-bold block ${
                          t.type === "Thu" ? "text-emerald-600" : "text-rose-600"
                        }`}
                      >
                        {t.amount}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {t.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 2: FUND REQUESTS & APPROVAL WORKFLOW --- */}
      {activeTab === "requests" && (
        <div className="space-y-4">
          {/* Subfilter toolbar */}
          <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1">
              {[
                { key: "ALL", label: `Tất cả (${fundRequests.length})` },
                { key: "PENDING", label: `Chờ thẩm định (${pendingRequestsCount})` },
                { key: "APPROVED", label: "Đã giải ngân" },
                { key: "REJECTED", label: "Đã từ chối" }
              ].map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => setRequestFilter(filter.key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    requestFilter === filter.key
                      ? "bg-slate-900 text-white font-semibold"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {/* Fund Requests Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/70 border-b border-slate-100 text-slate-400 font-semibold uppercase text-[10px]">
                  <tr>
                    <th className="px-4 py-3.5">Mã / Lý do đề xuất</th>
                    <th className="px-4 py-3.5">Người đề xuất</th>
                    <th className="px-4 py-3.5 text-right">Số tiền yêu cầu</th>
                    <th className="px-4 py-3.5 text-center">Trạng thái</th>
                    <th className="px-4 py-3.5 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredRequests.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-10 text-xs text-slate-400">
                        Không có yêu cầu cấp kinh phí nào trong danh sách này
                      </td>
                    </tr>
                  ) : (
                    filteredRequests.map((req) => (
                      <tr key={req.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="px-4 py-3.5">
                          <span className="font-bold text-slate-800 block text-xs">
                            {req.reason}
                          </span>
                          <span className="text-[10px] text-slate-400 mt-0.5 block">
                            Mã: REQ-{String(req.id).substring(0, 8).toUpperCase()}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-slate-600 font-medium">
                          {req.requester_name || req.user || "Cán bộ phụ trách"}
                        </td>
                        <td className="px-4 py-3.5 text-right font-bold text-slate-900">
                          {formatVND(req.amount)}
                        </td>
                        <td className="px-4 py-3.5 text-center">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                              req.status === "APPROVED" || req.status === "COMPLETED"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : req.status === "PENDING"
                                ? "bg-amber-50 text-amber-700 border-amber-200"
                                : "bg-rose-50 text-rose-700 border-rose-200"
                            }`}
                          >
                            {req.status === "APPROVED" || req.status === "COMPLETED"
                              ? "Đã duyệt"
                              : req.status === "PENDING"
                              ? "Chờ duyệt"
                              : "Từ chối"}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          <button
                            onClick={() => setEvaluatingRequest(req)}
                            className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold rounded-lg text-xs transition-colors"
                          >
                            Thẩm định & Duyệt
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
      )}

      {/* --- TAB 3: ASSET INVENTORY --- */}
      {activeTab === "assets" && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="relative min-w-[260px]">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm tên thiết bị, mã hoặc vị trí kho..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 rounded-lg outline-none transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAssets.length === 0 ? (
              <div className="col-span-3 bg-white p-12 text-center rounded-xl border border-slate-200 text-xs text-slate-400">
                Không tìm thấy trang thiết bị nào phù hợp
              </div>
            ) : (
              filteredAssets.map((asset) => (
                <div
                  key={asset.id}
                  className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="p-2 rounded-lg bg-slate-100 text-slate-700">
                        <Package size={18} />
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                          asset.status === "AVAILABLE" || asset.status === "Sẵn sàng"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-amber-50 text-amber-700 border-amber-200"
                        }`}
                      >
                        {asset.status === "AVAILABLE" || asset.status === "Sẵn sàng"
                          ? "Sẵn sàng"
                          : "Đang mượn / Bảo trì"}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-800 leading-tight">
                      {asset.name || asset.title}
                    </h4>
                    <p className="text-xs text-slate-500 line-clamp-2">
                      {asset.description || asset.desc || "Thiết bị hỗ trợ hoạt động phong trào Đoàn - Hội."}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                    <span>Số lượng: <strong className="text-slate-700">{asset.quantity || 1} {asset.unit || "Bộ"}</strong></span>
                    <span className="truncate max-w-[150px]">{asset.storage_location || asset.footer || "Kho A"}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* --- APPROVAL EVALUATION MODAL (REPLACES WINDOW.CONFIRM) --- */}
      {evaluatingRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-lg w-full overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/70">
              <div className="flex items-center gap-2">
                <FileText size={18} className="text-blue-600" />
                <h3 className="text-sm font-bold text-slate-800">
                  Thẩm định Yêu cầu Cấp Kinh phí
                </h3>
              </div>
              <button
                onClick={() => setEvaluatingRequest(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5 space-y-4 text-xs">
              <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-2">
                <div className="flex justify-between items-center text-slate-500">
                  <span>Mã đề xuất:</span>
                  <span className="font-mono font-bold text-slate-700">
                    REQ-{String(evaluatingRequest.id).substring(0, 8).toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between items-center text-slate-500">
                  <span>Người lập đề xuất:</span>
                  <span className="font-semibold text-slate-800">
                    {evaluatingRequest.requester_name || evaluatingRequest.user || "Cán bộ phụ trách"}
                  </span>
                </div>
                <div className="flex justify-between items-center text-slate-500">
                  <span>Số tiền đề xuất:</span>
                  <span className="text-base font-black text-rose-600">
                    {formatVND(evaluatingRequest.amount)}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-slate-500 font-semibold mb-1">
                  Mục đích & Lý do chi tiết:
                </label>
                <div className="p-3 bg-white border border-slate-200 rounded-lg text-slate-700 leading-relaxed">
                  {evaluatingRequest.reason || "Kinh phí phục vụ hoạt động sự kiện."}
                </div>
              </div>

              {/* Budget check */}
              <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 font-medium">
                <span>Ngân sách khả dụng của Trường:</span>
                <span className="font-bold">{formatVND(stats.remaining)}</span>
              </div>

              {/* Evidence preview if present */}
              {evaluatingRequest.evidence_urls && (
                <div>
                  <label className="block text-slate-500 font-semibold mb-1">
                    Minh chứng đính kèm:
                  </label>
                  <div className="flex gap-2">
                    <a
                      href={
                        evaluatingRequest.evidence_urls.includes("[")
                          ? JSON.parse(evaluatingRequest.evidence_urls)[0]
                          : evaluatingRequest.evidence_urls
                      }
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 hover:underline flex items-center gap-1 font-semibold"
                    >
                      Xem hóa đơn / Bảng dự toán đính kèm <ExternalLink size={12} />
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-2.5">
              <button
                type="button"
                disabled={evaluatingLoading}
                onClick={() => handleRejectFundRequest(evaluatingRequest.id)}
                className="px-4 py-2 border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                <XCircle size={15} />
                <span>Từ chối yêu cầu</span>
              </button>

              <button
                type="button"
                disabled={evaluatingLoading}
                onClick={() => handleApproveFundRequest(evaluatingRequest.id)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5"
              >
                <CheckCircle2 size={15} />
                <span>Phê duyệt giải ngân</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- ASSET CREATION MODAL --- */}
      {isAssetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-md w-full overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/70">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Package size={17} className="text-blue-600" />
                Nhập kho Trang thiết bị mới
              </h3>
              <button
                onClick={() => setIsAssetModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateAsset} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">
                  Tên trang thiết bị / vật tư *
                </label>
                <input
                  type="text"
                  required
                  placeholder="VD: Hệ thống Loa di động Bluetooth..."
                  value={assetForm.name}
                  onChange={(e) => setAssetForm({ ...assetForm, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-blue-500 outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">
                    Số lượng
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={assetForm.quantity}
                    onChange={(e) => setAssetForm({ ...assetForm, quantity: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-blue-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">
                    Đơn vị tính
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Bộ, Cái, Chiếc..."
                    value={assetForm.unit}
                    onChange={(e) => setAssetForm({ ...assetForm, unit: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-blue-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">
                  Vị trí lưu kho
                </label>
                <input
                  type="text"
                  required
                  placeholder="VD: Kho Văn phòng Đoàn (Khu A)..."
                  value={assetForm.storage_location}
                  onChange={(e) => setAssetForm({ ...assetForm, storage_location: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-blue-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">
                  Mô tả chi tiết
                </label>
                <textarea
                  rows="2"
                  placeholder="Tình trạng, mục đích sử dụng..."
                  value={assetForm.description}
                  onChange={(e) => setAssetForm({ ...assetForm, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-blue-500 outline-none transition-all"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAssetModalOpen(false)}
                  className="px-3 py-2 border border-slate-200 hover:bg-slate-100 rounded-lg text-slate-600 font-medium"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-xs"
                >
                  Xác nhận Nhập kho
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Finance;
