import React, { useState, useEffect, useContext } from 'react';
import { 
  Wallet, ArrowUpRight, ArrowDownLeft, Clock, CheckCircle2, XCircle, 
  Plus, Download, RefreshCw, Send, CheckSquare, Search, FileText, 
  Building2, Users, AlertCircle, Coins
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import Toast from '../../../components/ui/Toast';
import Modal from '../../../components/ui/Modal';
import { financeService } from '../../../services/financeService';
import { AuthContext } from '../../../context/AuthContext';

const SubAdminFinance = () => {
  const { user } = useContext(AuthContext);
  const [toast, setToast] = useState(null);
  const [activeTab, setActiveTab] = useState('transactions'); // 'transactions' | 'fund_requests' | 'student_fees'
  const [loading, setLoading] = useState(false);

  // Stats & Transaction states
  const [statsData, setStatsData] = useState({ totalFund: 0, totalIncome: 0, totalExpense: 0, remaining: 0 });
  const [transactions, setTransactions] = useState([]);
  const [txnFilter, setTxnFilter] = useState('ALL'); // 'ALL' | 'INCOME' | 'EXPENSE'

  // Fund Requests states
  const [fundRequests, setFundRequests] = useState([]);
  const [showFundReqModal, setShowFundReqModal] = useState(false);
  const [fundReqForm, setFundReqForm] = useState({
    title: '',
    amount: '',
    reason: '',
  });

  // Student Fees states
  const [studentFeesOverview, setStudentFeesOverview] = useState({
    totalStudents: 0,
    paidCount: 0,
    pendingCount: 0,
    totalCollected: 0,
    percentPaid: 0,
    items: []
  });
  const [feeSearchTerm, setFeeSearchTerm] = useState('');

  // Internal Transaction modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTransaction, setNewTransaction] = useState({
    type: 'Thu',
    title: '',
    amount: '',
    description: '',
    from: ''
  });

  const facultyTitle = user?.managed_org_name || 'Đoàn - Hội Khoa Công nghệ Thông tin';

  const loadData = async () => {
    setLoading(true);
    try {
      const [stats, txns, reqs, fees] = await Promise.all([
        financeService.getBudgetStats().catch(() => ({ totalFund: 0, totalIncome: 0, totalExpense: 0 })),
        financeService.getFacultyTransactions().catch(() => []),
        financeService.getFundRequests().catch(() => []),
        financeService.getStudentFees().catch(() => ({ items: [] }))
      ]);

      if (stats) setStatsData(stats);
      if (txns) setTransactions(txns);
      if (reqs) setFundRequests(reqs);
      if (fees) setStudentFeesOverview(fees);
    } catch (err) {
      console.error('Failed to load finance data:', err);
      setToast({ message: 'Lỗi nạp dữ liệu tài chính: ' + err.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handler: Create Internal Transaction (Thu/Chi Khoa)
  const handleCreateTransaction = async (e) => {
    e.preventDefault();
    const amountNum = parseFloat(newTransaction.amount) || 0;
    if (amountNum <= 0) {
      setToast({ message: 'Số tiền phải lớn hơn 0', type: 'error' });
      return;
    }

    try {
      await financeService.createFacultyTransaction({
        type: newTransaction.type,
        title: newTransaction.title,
        detail: newTransaction.description,
        user: newTransaction.from || user?.full_name || 'Ban Chấp Hành Khoa',
        amount: amountNum.toString()
      });

      setShowCreateModal(false);
      setNewTransaction({ type: 'Thu', title: '', amount: '', description: '', from: '' });
      setToast({ message: 'Tạo phiếu giao dịch nội bộ thành công!', type: 'success' });
      loadData();
    } catch (error) {
      setToast({ message: 'Lỗi tạo phiếu: ' + error.message, type: 'error' });
    }
  };

  // Handler: Create Fund Request to University
  const handleCreateFundRequest = async (e) => {
    e.preventDefault();
    const amountNum = parseFloat(fundReqForm.amount) || 0;
    if (amountNum <= 0) {
      setToast({ message: 'Số tiền đề xuất phải lớn hơn 0', type: 'error' });
      return;
    }

    try {
      await financeService.createFundRequest({
        title: fundReqForm.title,
        amount: amountNum,
        reason: fundReqForm.reason
      });

      setShowFundReqModal(false);
      setFundReqForm({ title: '', amount: '', reason: '' });
      setToast({ message: 'Đã gửi phiếu xin cấp kinh phí lên Ban Quản trị Trường!', type: 'success' });
      loadData();
    } catch (error) {
      setToast({ message: 'Lỗi gửi đề xuất: ' + error.message, type: 'error' });
    }
  };

  // Handler: Toggle Student Fee Status
  const handleToggleFeeStatus = async (fee) => {
    const nextStatus = fee.status === 'PAID' ? 'PENDING' : 'PAID';
    try {
      await financeService.updateStudentFeeStatus(fee.id, nextStatus);
      setToast({ 
        message: nextStatus === 'PAID' ? `Đã xác nhận thu phí cho ${fee.student_name}` : `Đã chuyển về chưa thu`, 
        type: 'success' 
      });
      loadData();
    } catch (error) {
      setToast({ message: 'Lỗi cập nhật đoàn phí: ' + error.message, type: 'error' });
    }
  };

  // Export internal ledger to Excel
  const exportToExcel = () => {
    const data = [
      ['Loại giao dịch', 'Tiêu đề phiếu', 'Nội dung chi tiết', 'Người thực hiện / Đơn vị', 'Số tiền (VNĐ)', 'Trạng thái'],
      ...transactions.map(t => [t.type, t.title, t.detail, t.user, t.amount, t.status])
    ];
    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'So_Quy_Khoa');
    const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([buffer]), `So_Quy_${(user?.managed_org_name || 'Khoa').replace(/\s+/g, '_')}.xlsx`);
    setToast({ message: 'Đã xuất sổ quỹ Khoa (.xlsx) thành công!', type: 'success' });
  };

  // Filtered transactions
  const filteredTransactions = transactions.filter(t => {
    if (txnFilter === 'INCOME') return t.type === 'Thu';
    if (txnFilter === 'EXPENSE') return t.type === 'Chi';
    return true;
  });

  // Filtered student fees
  const feeItems = studentFeesOverview?.items || [];
  const filteredFees = feeItems.filter(f => 
    (f.student_name || '').toLowerCase().includes(feeSearchTerm.toLowerCase()) ||
    (f.student_code || '').toLowerCase().includes(feeSearchTerm.toLowerCase()) ||
    (f.class_name || '').toLowerCase().includes(feeSearchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Wallet size={22} className="text-blue-600" />
            Tài chính & Quỹ Đoàn {facultyTitle}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Quản trị sổ quỹ nội bộ Khoa, lập dự trù cấp kinh phí từ Nhà trường và theo dõi đóng Đoàn phí các Chi đoàn.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportToExcel}
            className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg text-xs font-semibold text-slate-700 shadow-sm transition-all"
          >
            <Download size={14} />
            Xuất Excel
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-xs font-semibold text-white shadow-sm transition-all"
          >
            <Plus size={15} />
            Lập phiếu Thu/Chi
          </button>
        </div>
      </div>

      {/* Compact Metric Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Số dư Quỹ Khoa</span>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <Wallet size={16} />
            </div>
          </div>
          <div className="text-xl font-bold text-slate-900">
            {(statsData.totalFund || 0).toLocaleString()} <span className="text-xs font-normal text-slate-500">VNĐ</span>
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">
            Tổng thu: +{(statsData.totalIncome || 0).toLocaleString()} đ
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Tổng Đã Chi Phí</span>
            <div className="p-2 rounded-lg bg-rose-50 text-rose-600">
              <ArrowDownLeft size={16} />
            </div>
          </div>
          <div className="text-xl font-bold text-rose-600">
            -{(statsData.totalExpense || 0).toLocaleString()} <span className="text-xs font-normal text-slate-500">VNĐ</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Chi hoạt động phong trào & sự kiện
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Kinh Phí Chờ Trường Cấp</span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
              <Building2 size={16} />
            </div>
          </div>
          <div className="text-xl font-bold text-amber-600">
            {fundRequests.filter(r => r.status === 'PENDING').length} <span className="text-xs font-normal text-slate-500">phiếu chờ</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Gửi tới Admin Đoàn Trường
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Tiến Độ Thu Đoàn Phí</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <Coins size={16} />
            </div>
          </div>
          <div className="text-xl font-bold text-slate-900">
            {studentFeesOverview.percentPaid || 0}%
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Đã thu {studentFeesOverview.paidCount || 0} / {studentFeesOverview.totalStudents || 0} đoàn viên
          </div>
        </div>
      </div>

      {/* Main Tabs Container */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        {/* Navigation Tabs Header */}
        <div className="px-5 pt-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('transactions')}
              className={`pb-3.5 px-3 text-xs font-bold tracking-tight transition-all relative flex items-center gap-1.5 ${
                activeTab === 'transactions'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Wallet size={15} />
              Sổ Quỹ & Giao dịch Nội bộ Khoa
              <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-600">
                {transactions.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('fund_requests')}
              className={`pb-3.5 px-3 text-xs font-bold tracking-tight transition-all relative flex items-center gap-1.5 ${
                activeTab === 'fund_requests'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Building2 size={15} />
              Đề xuất Cấp Kinh phí lên Trường
              <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-600">
                {fundRequests.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('student_fees')}
              className={`pb-3.5 px-3 text-xs font-bold tracking-tight transition-all relative flex items-center gap-1.5 ${
                activeTab === 'student_fees'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Coins size={15} />
              Theo dõi Đóng Đoàn phí Chi đoàn
              <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-600">
                {studentFeesOverview?.items?.length || 0}
              </span>
            </button>
          </div>

          {activeTab === 'transactions' && (
            <div className="pb-3 flex items-center gap-1">
              {['ALL', 'INCOME', 'EXPENSE'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setTxnFilter(filter)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                    txnFilter === filter
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {filter === 'ALL' ? 'Tất cả' : filter === 'INCOME' ? 'Khoản Thu' : 'Khoản Chi'}
                </button>
              ))}
            </div>
          )}

          {activeTab === 'fund_requests' && (
            <div className="pb-3">
              <button
                onClick={() => setShowFundReqModal(true)}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-all flex items-center gap-1"
              >
                <Plus size={14} />
                Lập phiếu Xin Cấp Kinh Phí
              </button>
            </div>
          )}

          {activeTab === 'student_fees' && (
            <div className="pb-3 w-full sm:w-64">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Tìm theo MSSV, Họ tên, Chi đoàn..."
                  value={feeSearchTerm}
                  onChange={(e) => setFeeSearchTerm(e.target.value)}
                  className="w-full h-8 pl-8 pr-3 text-xs rounded-lg border border-slate-200 outline-none focus:border-blue-500 bg-slate-50/50"
                />
              </div>
            </div>
          )}
        </div>

        {/* Tab 1: Transactions Table */}
        {activeTab === 'transactions' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-200 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  <th className="py-3 px-5">Khoản mục</th>
                  <th className="py-3 px-4">Người lập / Phụ trách</th>
                  <th className="py-3 px-4">Loại</th>
                  <th className="py-3 px-4">Số tiền</th>
                  <th className="py-3 px-4">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-12 text-center text-slate-400">
                      <Wallet size={36} className="mx-auto text-slate-300 mb-2" />
                      Chưa có giao dịch thu/chi nội bộ nào
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-5">
                        <div className="font-semibold text-slate-900">{t.title}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{t.detail || 'Không có mô tả'}</div>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-800">
                        {t.user}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold ${
                          t.type === 'Thu' 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}>
                          {t.type === 'Thu' ? <ArrowUpRight size={12} /> : <ArrowDownLeft size={12} />}
                          {t.type}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        {t.amount} đ
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 size={12} /> {t.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 2: Fund Requests Table (Faculty -> University) */}
        {activeTab === 'fund_requests' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-200 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  <th className="py-3 px-5">Nội dung đề xuất</th>
                  <th className="py-3 px-4">Lý do & Thuyết minh</th>
                  <th className="py-3 px-4">Số tiền xin cấp</th>
                  <th className="py-3 px-4">Cấp phê duyệt</th>
                  <th className="py-3 px-4">Trạng thái Phê duyệt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {fundRequests.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-12 text-center text-slate-400">
                      <Building2 size={36} className="mx-auto text-slate-300 mb-2" />
                      Khoa chưa gửi đề xuất cấp kinh phí nào lên Trường
                    </td>
                  </tr>
                ) : (
                  fundRequests.map((req) => (
                    <tr key={req.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-5 font-semibold text-slate-900">
                        {req.title}
                        <div className="text-[11px] text-slate-500 font-normal">
                          Gửi ngày {req.created_at ? new Date(req.created_at).toLocaleDateString('vi-VN') : 'Gần đây'}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 max-w-xs">
                        <p className="line-clamp-2">{req.reason || 'Kinh phí phục vụ hoạt động cấp Khoa'}</p>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-blue-700">
                        {(req.amount || 0).toLocaleString()} VNĐ
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-700">
                        Đoàn Trường / Đại học
                      </td>
                      <td className="py-3.5 px-4">
                        {req.status === 'APPROVED' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 size={12} /> Đã duyệt giải ngân
                          </span>
                        ) : req.status === 'REJECTED' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                            <XCircle size={12} /> Nhà trường từ chối
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                            <Clock size={12} /> Chờ Trường duyệt
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 3: Student Fees Monitoring Table */}
        {activeTab === 'student_fees' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-200 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  <th className="py-3 px-5">Họ và Tên Đoàn viên</th>
                  <th className="py-3 px-4">Mã số SV</th>
                  <th className="py-3 px-4">Chi đoàn</th>
                  <th className="py-3 px-4">Mức đóng</th>
                  <th className="py-3 px-4">Học kỳ / Năm</th>
                  <th className="py-3 px-4">Trạng thái đóng</th>
                  <th className="py-3 px-5 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {filteredFees.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="py-12 text-center text-slate-400">
                      <Coins size={36} className="mx-auto text-slate-300 mb-2" />
                      Không tìm thấy bản ghi Đoàn phí nào
                    </td>
                  </tr>
                ) : (
                  filteredFees.map((fee) => (
                    <tr key={fee.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-5 font-semibold text-slate-900">
                        {fee.student_name}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-600">
                        {fee.student_code}
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-700">
                        {fee.class_name}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        {(fee.amount || 50000).toLocaleString()} đ
                      </td>
                      <td className="py-3.5 px-4 text-slate-500">
                        {fee.academic_year || '2025 - 2026'}
                      </td>
                      <td className="py-3.5 px-4">
                        {fee.status === 'PAID' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 size={12} /> Đã nộp
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                            <Clock size={12} /> Chưa thu
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-5 text-right">
                        <button
                          onClick={() => handleToggleFeeStatus(fee)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-all inline-flex items-center gap-1 ${
                            fee.status === 'PAID'
                              ? 'border border-slate-200 hover:bg-slate-100 text-slate-600'
                              : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                          }`}
                        >
                          <CheckCircle2 size={13} />
                          {fee.status === 'PAID' ? 'Hủy thu' : 'Xác nhận thu'}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal: Create Internal Transaction */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Lập Phiếu Thu / Chi Nội Bộ Khoa"
        size="md"
      >
        <form onSubmit={handleCreateTransaction} className="space-y-4 py-2 text-xs">
          <div className="space-y-1">
            <label className="text-slate-500 font-semibold block">Phân loại giao dịch</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setNewTransaction(p => ({ ...p, type: 'Thu' }))}
                className={`py-2 rounded-lg font-semibold flex items-center justify-center gap-1.5 border transition-all ${
                  newTransaction.type === 'Thu'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300 ring-2 ring-emerald-500/10'
                    : 'bg-white border-slate-200 text-slate-600'
                }`}
              >
                <ArrowUpRight size={14} /> Khoản Thu (+ Quỹ)
              </button>
              <button
                type="button"
                onClick={() => setNewTransaction(p => ({ ...p, type: 'Chi' }))}
                className={`py-2 rounded-lg font-semibold flex items-center justify-center gap-1.5 border transition-all ${
                  newTransaction.type === 'Chi'
                    ? 'bg-rose-50 text-rose-700 border-rose-300 ring-2 ring-rose-500/10'
                    : 'bg-white border-slate-200 text-slate-600'
                }`}
              >
                <ArrowDownLeft size={14} /> Khoản Chi (- Quỹ)
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-slate-500 font-semibold block">Tiêu đề phiếu <span className="text-rose-500">*</span></label>
            <input
              type="text"
              required
              placeholder="VD: Thu đoàn phí Chi đoàn 21CT111 hoặc Chi mua nước giải lao..."
              value={newTransaction.title}
              onChange={(e) => setNewTransaction(p => ({ ...p, title: e.target.value }))}
              className="w-full h-9 px-3 rounded-lg border border-slate-200 text-slate-900 outline-none focus:border-blue-500 font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-slate-500 font-semibold block">Số tiền (VNĐ) <span className="text-rose-500">*</span></label>
              <input
                type="number"
                required
                min="1000"
                step="1000"
                placeholder="500000"
                value={newTransaction.amount}
                onChange={(e) => setNewTransaction(p => ({ ...p, amount: e.target.value }))}
                className="w-full h-9 px-3 rounded-lg border border-slate-200 text-slate-900 outline-none focus:border-blue-500 font-medium"
              />
            </div>
            <div className="space-y-1">
              <label className="text-slate-500 font-semibold block">Người thực hiện / Ban</label>
              <input
                type="text"
                placeholder="Bí thư / Ban Tài chính"
                value={newTransaction.from}
                onChange={(e) => setNewTransaction(p => ({ ...p, from: e.target.value }))}
                className="w-full h-9 px-3 rounded-lg border border-slate-200 text-slate-900 outline-none focus:border-blue-500 font-medium"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-slate-500 font-semibold block">Chi tiết giải trình</label>
            <textarea
              rows="3"
              placeholder="Ghi chú chi tiết mục đích thu chi..."
              value={newTransaction.description}
              onChange={(e) => setNewTransaction(p => ({ ...p, description: e.target.value }))}
              className="w-full p-2.5 rounded-lg border border-slate-200 text-slate-900 outline-none focus:border-blue-500 resize-none font-medium"
            />
          </div>

          <div className="flex gap-2 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setShowCreateModal(false)}
              className="flex-1 py-2 px-3 border border-slate-200 hover:bg-slate-50 rounded-lg text-slate-700 font-semibold"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-sm"
            >
              Lưu Phiếu
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Create Fund Request to University */}
      <Modal
        isOpen={showFundReqModal}
        onClose={() => setShowFundReqModal(false)}
        title="Lập Đề Xuất Cấp Kinh Phí Gửi Lên Trường"
        size="md"
      >
        <form onSubmit={handleCreateFundRequest} className="space-y-4 py-2 text-xs">
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-800 leading-relaxed">
            Phiếu đề xuất sau khi gửi sẽ xuất hiện trực tiếp trong Hàng đợi Xét duyệt của <strong>Admin Đoàn Trường</strong>.
          </div>

          <div className="space-y-1">
            <label className="text-slate-500 font-semibold block">Tiêu đề đề xuất <span className="text-rose-500">*</span></label>
            <input
              type="text"
              required
              placeholder="VD: Kinh phí tổ chức Hội thảo Khoa học Sinh viên Khoa CNTT 2026"
              value={fundReqForm.title}
              onChange={(e) => setFundReqForm(p => ({ ...p, title: e.target.value }))}
              className="w-full h-9 px-3 rounded-lg border border-slate-200 text-slate-900 outline-none focus:border-blue-500 font-medium"
            />
          </div>

          <div className="space-y-1">
            <label className="text-slate-500 font-semibold block">Số tiền đề xuất cấp (VNĐ) <span className="text-rose-500">*</span></label>
            <input
              type="number"
              required
              min="100000"
              step="50000"
              placeholder="5000000"
              value={fundReqForm.amount}
              onChange={(e) => setFundReqForm(p => ({ ...p, amount: e.target.value }))}
              className="w-full h-9 px-3 rounded-lg border border-slate-200 text-slate-900 outline-none focus:border-blue-500 font-medium"
            />
          </div>

          <div className="space-y-1">
            <label className="text-slate-500 font-semibold block">Mục đích & Dự toán chi tiết <span className="text-rose-500">*</span></label>
            <textarea
              rows="4"
              required
              placeholder="Trình bày cụ thể mục tiêu, đối tượng thụ hưởng và bảng phân bổ dự toán xin cấp..."
              value={fundReqForm.reason}
              onChange={(e) => setFundReqForm(p => ({ ...p, reason: e.target.value }))}
              className="w-full p-2.5 rounded-lg border border-slate-200 text-slate-900 outline-none focus:border-blue-500 resize-none font-medium"
            />
          </div>

          <div className="flex gap-2 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setShowFundReqModal(false)}
              className="flex-1 py-2 px-3 border border-slate-200 hover:bg-slate-50 rounded-lg text-slate-700 font-semibold"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-sm flex items-center justify-center gap-1.5"
            >
              <Send size={13} />
              Gửi Lên Đoàn Trường
            </button>
          </div>
        </form>
      </Modal>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default SubAdminFinance;