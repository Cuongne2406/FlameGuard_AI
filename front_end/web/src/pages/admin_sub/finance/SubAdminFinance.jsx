import React, { useState, useEffect } from 'react';
import Toast from '../../../components/ui/Toast';
import Modal from '../../../components/ui/Modal';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { financeService } from '../../../services/financeService';

const SubAdminFinance = () => {
    const [toast, setToast] = useState(null);
    const [activeTab, setActiveTab] = useState('Tất cả');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newTransaction, setNewTransaction] = useState({
        type: 'Thu',
        title: '',
        amount: '',
        description: '',
        from: ''
    });

    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statsData, setStatsData] = useState({ totalFund: 0, totalIncome: 0, totalExpense: 0 });

    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                setLoading(true);
                // Fetch stats và transactions song song
                const [stats, txns] = await Promise.all([
                    financeService.getBudgetStats(),
                    financeService.getFacultyTransactions()
                ]);
                
                if (stats) setStatsData(stats);
                if (txns) setTransactions(txns);
            } catch (err) {
                console.error('Failed to fetch finance records', err);
                setToast({ message: 'Lỗi tải dữ liệu tài chính!', type: 'error' });
            } finally {
                setLoading(false);
            }
        };
        loadDashboardData();
    }, []);

    const filteredTransactions = transactions.filter(t => {
        if (activeTab === 'Tất cả') return true;
        if (activeTab === 'Thu') return t.type === 'Thu';
        if (activeTab === 'Chi') return t.type === 'Chi';
        if (activeTab === 'Chờ duyệt') return t.status === 'Chờ duyệt';
        return true;
    });

    const handleApprove = async (id) => {
        try {
            await financeService.approveFacultyTransaction(id);
            setTransactions(prev => prev.map(t =>
                t.id === id ? { ...t, status: 'Đã thanh toán', statusColor: 'emerald', actionRequired: false } : t
            ));
            setToast({ message: 'Đã duyệt chi thành công!', type: 'success' });
        } catch (error) {
            setToast({ message: 'Lỗi duyệt chi!', type: 'error' });
        }
    };

    const handleCreateTransaction = async () => {
        const amountNum = parseFloat(newTransaction.amount) || 0;
        
        const txnData = {
            type: newTransaction.type,
            title: newTransaction.title,
            detail: newTransaction.description,
            user: newTransaction.from || 'Hệ thống',
            amount: amountNum.toString()
        };

        try {
            await financeService.createFacultyTransaction(txnData);
            
            // Reload data sau khi tạo thành công
            const [newStats, newTxns] = await Promise.all([
                financeService.getBudgetStats(),
                financeService.getFacultyTransactions()
            ]);
            setStatsData(newStats);
            setTransactions(newTxns);
            
            setShowCreateModal(false);
            setNewTransaction({ type: 'Thu', title: '', amount: '', description: '', from: '' });
            setToast({ message: 'Đã tạo phiếu thành công!', type: 'success' });
        } catch (error) {
            setToast({ message: 'Lỗi tạo phiếu: ' + (error.message || ''), type: 'error' });
        }
    };

    const exportToExcel = () => {
        const data = [
            ['Loại', 'Tiêu đề', 'Chi tiết', 'Người thực hiện', 'Số tiền', 'Trạng thái'],
            ...filteredTransactions.map(t => [t.type, t.title, t.detail, t.user, t.amount, t.status])
        ];
        const ws = XLSX.utils.aoa_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'TaiChinh');
        const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        saveAs(new Blob([buffer]), 'BaoCao_TaiChinh.xlsx');
        setToast({ message: 'Xuất báo cáo thành công!', type: 'success' });
    };

    return (
        <div className="p-4 md:p-6 lg:p-8 bg-[#F8FAFC] min-h-screen space-y-6 md:space-y-8 font-sans">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 lg:h-12 lg:w-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-lg">
                        <span className="material-symbols-outlined text-2xl lg:text-3xl">account_balance</span>
                    </div>
                    <div>
                        <h1 className="text-lg lg:text-xl font-bold text-slate-900">Tài chính Đoàn - Hội Khoa CNTT</h1>
                        <p className="text-[10px] lg:text-xs font-bold text-slate-400 mt-0.5">Dashboard Quản lý Quỹ & Minh bạch Tài chính</p>
                    </div>
                </div>
                <div className="flex flex-wrap items-center gap-2 lg:gap-3">
                    <div className="h-8 lg:h-10 px-3 lg:px-4 rounded-xl border border-slate-100 bg-emerald-50 text-emerald-600 flex items-center gap-1 lg:gap-2 shadow-sm text-[9px] lg:text-xs font-bold uppercase tracking-widest">
                        <span className="material-symbols-outlined text-xs lg:text-sm">verified_user</span>
                        <span className="hidden sm:inline">An toàn</span> (Đã đối soát)
                    </div>
                    <select className="h-8 lg:h-10 px-3 lg:px-4 rounded-xl border border-slate-200 bg-white text-[9px] lg:text-xs font-bold text-slate-600 outline-none">
                        <option>Năm học 2025-2026</option>
                    </select>
                </div>
            </div>

            {/* Fund Summary Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {/* Tổng quỹ */}
                <div className="bg-white border border-slate-100 rounded-2xl p-5 lg:p-8 shadow-sm space-y-4 lg:space-y-8">
                    <div className="flex justify-between items-start">
                        <div className="space-y-2 lg:space-y-4">
                            <p className="text-[9px] lg:text-xs font-bold text-slate-400 uppercase tracking-widest">TỔNG QUỸ HIỆN CÓ</p>
                            <p className="text-2xl lg:text-4xl font-bold text-emerald-600 tracking-tighter">{statsData.totalFund.toLocaleString()}</p>
                            <p className="text-[9px] lg:text-xs font-bold text-slate-400 uppercase tracking-widest">VNĐ</p>
                        </div>
                        <div className="h-8 w-8 lg:h-12 lg:w-12 rounded-xl lg:rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                            <span className="material-symbols-outlined text-xl lg:text-3xl">account_balance_wallet</span>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 lg:gap-4 pt-3 lg:pt-6 border-t border-slate-50">
                        <div>
                            <p className="text-[8px] lg:text-xs font-bold text-slate-300 uppercase">Thu</p>
                            <p className="text-xs lg:text-sm font-bold text-slate-900 mt-1">+{statsData.totalIncome.toLocaleString()}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-[8px] lg:text-xs font-bold text-slate-300 uppercase">Chi</p>
                            <p className="text-xs lg:text-sm font-bold text-slate-900 mt-1">-{statsData.totalExpense.toLocaleString()}</p>
                        </div>
                    </div>
                </div>

                {/* Tiến độ thu đoàn phí */}
                <div className="bg-white border border-slate-100 rounded-2xl p-5 lg:p-8 shadow-sm space-y-4 lg:space-y-6">
                    <div className="flex justify-between items-start">
                        <div className="space-y-2">
                            <p className="text-[9px] lg:text-xs font-bold text-slate-400 uppercase tracking-widest">Tiến độ thu Đoàn phí {statsData.feeProgress?.termName || 'Kỳ hiện tại'}</p>
                            <div className="flex items-baseline gap-1 lg:gap-2 pt-2 lg:pt-4">
                                <span className="text-2xl lg:text-3xl font-bold text-slate-900 tracking-tighter">{statsData.feeProgress?.percent || 0}%</span>
                                <span className="text-[8px] lg:text-xs font-bold text-slate-400 uppercase">{statsData.feeProgress?.paidCount || 0}/{statsData.feeProgress?.totalCount || 0} SV</span>
                            </div>
                        </div>
                        <div className="h-8 w-8 lg:h-10 lg:w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                            <span className="material-symbols-outlined text-lg lg:text-xl">download</span>
                        </div>
                    </div>
                    <div className="h-1 lg:h-1.5 rounded-full bg-slate-50 overflow-hidden">
                        <div className="h-full bg-blue-600 rounded-full" style={{ width: `${statsData.feeProgress?.percent || 0}%` }}></div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-2">
                        <p className="text-[9px] lg:text-xs font-bold text-rose-500 uppercase tracking-widest">Còn {statsData.feeProgress?.remainingCount || 0} bạn chưa đóng</p>
                        <button className="h-8 lg:h-10 px-3 lg:px-4 rounded-xl bg-blue-50 text-blue-600 text-[9px] lg:text-xs font-bold uppercase tracking-widest shadow-sm whitespace-nowrap">Gửi nhắc nhở</button>
                    </div>
                </div>

                {/* Đã chi trong tháng */}
                <div className="bg-white border border-slate-100 rounded-2xl p-5 lg:p-8 shadow-sm space-y-4 lg:space-y-8">
                    <div className="flex justify-between items-start">
                        <p className="text-[9px] lg:text-xs font-bold text-slate-400 uppercase tracking-widest">Đã chi trong tháng</p>
                        <div className="h-8 w-8 lg:h-10 lg:w-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                            <span className="material-symbols-outlined text-lg lg:text-xl">north_east</span>
                        </div>
                    </div>
                    <p className="text-2xl lg:text-3xl font-bold text-rose-600 tracking-tighter">-{parseFloat(statsData.monthlyExpense || 0).toLocaleString()}đ</p>
                    <div className="p-2 lg:p-3 rounded-xl bg-slate-50 border border-slate-100">
                        <p className="text-[9px] lg:text-xs font-bold text-slate-400 uppercase">Chủ yếu cho: <span className="text-slate-900">{statsData.topExpenseCategory || 'Chưa có chi tiêu'}</span></p>
                    </div>
                </div>

                {/* Nguồn tài trợ ngoài */}
                <div className="bg-white border border-slate-100 rounded-2xl p-5 lg:p-8 shadow-sm space-y-4 lg:space-y-8">
                    <div className="flex justify-between items-start">
                        <p className="text-[9px] lg:text-xs font-bold text-slate-400 uppercase tracking-widest">Nguồn tài trợ ngoài</p>
                        <div className="h-8 w-8 lg:h-10 lg:w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                            <span className="material-symbols-outlined text-lg lg:text-xl">handshake</span>
                        </div>
                    </div>
                    <p className="text-2xl lg:text-3xl font-bold text-emerald-600 tracking-tighter">+{parseFloat(statsData.externalFunding || 0).toLocaleString()}đ</p>
                    <div className="p-2 lg:p-3 rounded-xl bg-slate-50/50 border border-emerald-100 flex items-center gap-1 lg:gap-2">
                        <span className="material-symbols-outlined text-emerald-500 text-xs lg:text-sm">check_circle</span>
                        <p className="text-[9px] lg:text-xs font-bold text-slate-400 uppercase">{statsData.latestSponsor || 'Chưa có tài trợ'}</p>
                    </div>
                </div>
            </div>

            {/* History Section */}
            <div className="bg-white border border-slate-100 rounded-2xl lg:rounded-[2.5rem] overflow-hidden shadow-sm">
                <div className="px-4 md:px-6 lg:px-10 py-4 lg:py-6 border-b border-slate-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <h3 className="text-base lg:text-lg font-bold text-slate-900 flex items-center gap-2 lg:gap-3">
                        <span className="material-symbols-outlined text-blue-600">history</span>
                        Lịch sử Thu/Chi
                    </h3>
                    <div className="flex bg-blue-600 p-1 rounded-xl overflow-x-auto w-full sm:w-auto">
                        {['Tất cả', 'Thu', 'Chi', 'Chờ duyệt'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`h-8 lg:h-10 px-3 lg:px-5 rounded-lg text-[9px] lg:text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap ${
                                    activeTab === tab ? 'bg-white text-blue-600 shadow-sm' : 'text-blue-100'
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-4 md:px-6 lg:px-10 py-3 lg:py-5 text-left text-[9px] lg:text-xs font-bold text-slate-400 uppercase tracking-widest">NỘI DUNG</th>
                                <th className="px-3 md:px-4 lg:px-8 py-3 lg:py-5 text-left text-[9px] lg:text-xs font-bold text-slate-400 uppercase tracking-widest hidden md:table-cell">NGƯỜI THỰC HIỆN</th>
                                <th className="px-3 md:px-4 lg:px-8 py-3 lg:py-5 text-left text-[9px] lg:text-xs font-bold text-slate-400 uppercase tracking-widest">SỐ TIỀN</th>
                                <th className="px-3 md:px-4 lg:px-8 py-3 lg:py-5 text-left text-[9px] lg:text-xs font-bold text-slate-400 uppercase tracking-widest hidden sm:table-cell">TRẠNG THÁI</th>
                                <th className="px-4 md:px-6 lg:px-10 py-3 lg:py-5 text-right text-[9px] lg:text-xs font-bold text-slate-400 uppercase tracking-widest">HÀNH ĐỘNG</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredTransactions.map((tr) => (
                                <tr key={tr.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-4 md:px-6 lg:px-10 py-4 lg:py-8">
                                        <div className="flex items-center gap-3 lg:gap-4">
                                            <div className={`h-8 w-8 lg:h-10 lg:w-10 rounded-lg lg:rounded-xl bg-${tr.color}-50 text-${tr.color}-600 flex items-center justify-center shrink-0`}>
                                                <span className="material-symbols-outlined text-base lg:text-xl">{tr.icon}</span>
                                            </div>
                                            <div>
                                                <p className="text-xs lg:text-sm font-bold text-slate-900">{tr.title}</p>
                                                <p className="text-[9px] lg:text-xs font-bold text-slate-400 mt-0.5 lg:mt-1 hidden sm:block">{tr.detail}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-3 md:px-4 lg:px-8 py-4 lg:py-8 text-xs lg:text-sm font-bold text-slate-700 hidden md:table-cell">{tr.user}</td>
                                    <td className={`px-3 md:px-4 lg:px-8 py-4 lg:py-8 text-xs lg:text-sm font-bold ${tr.amount.startsWith('+') ? 'text-emerald-600' : 'text-rose-600'}`}>{tr.amount}</td>
                                    <td className="px-3 md:px-4 lg:px-8 py-4 lg:py-8 hidden sm:table-cell">
                                        <span className={`px-2 lg:px-3 py-1 lg:py-1.5 rounded-lg text-[9px] lg:text-xs font-bold uppercase tracking-widest flex items-center gap-1 lg:gap-2 w-fit ${
                                            tr.statusColor === 'emerald' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-orange-50 text-orange-600 border border-orange-100'
                                        }`}>
                                            <span className="material-symbols-outlined text-xs lg:text-sm">{tr.statusColor === 'emerald' ? 'check_circle' : 'hourglass_empty'}</span>
                                            <span className="hidden lg:inline">{tr.status}</span>
                                            <span className="lg:hidden">{tr.status === 'Đã thanh toán' ? 'Đã' : 'Chờ'}</span>
                                        </span>
                                    </td>
                                    <td className="px-4 md:px-6 lg:px-10 py-4 lg:py-8 text-right">
                                        {tr.actionRequired ? (
                                            <button
                                                onClick={() => handleApprove(tr.id)}
                                                className="h-8 lg:h-10 px-3 lg:px-5 rounded-lg lg:rounded-xl bg-blue-600 text-white text-[9px] lg:text-xs font-bold uppercase tracking-widest shadow-lg shadow-blue-100 whitespace-nowrap"
                                            >
                                                Duyệt
                                            </button>
                                        ) : (
                                            <span className="text-[9px] lg:text-xs font-bold text-slate-400 uppercase tracking-widest">Đã duyệt</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="w-full sm:flex-1 h-12 lg:h-16 rounded-2xl lg:rounded-[2rem] bg-blue-600 text-white font-bold text-xs lg:text-sm uppercase tracking-widest flex items-center justify-center gap-2 lg:gap-3 shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all"
                >
                    <span className="material-symbols-outlined text-xl lg:text-2xl">add_circle</span>
                    Lập phiếu Thu/Chi
                </button>
                <button
                    onClick={exportToExcel}
                    className="w-full sm:flex-1 h-12 lg:h-16 rounded-2xl lg:rounded-[2rem] bg-white border border-slate-100 text-slate-900 font-bold text-xs lg:text-sm uppercase tracking-widest flex items-center justify-center gap-2 lg:gap-3 shadow-sm hover:bg-slate-50 transition-all"
                >
                    <span className="material-symbols-outlined text-xl lg:text-2xl">picture_as_pdf</span>
                    Xuất báo cáo
                </button>
            </div>

            {/* Modal lập phiếu Thu/Chi */}
            <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Lập phiếu Thu/Chi" size="md">
                <div className="space-y-4 py-2">
                    <div className="flex gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="type"
                                value="Thu"
                                checked={newTransaction.type === 'Thu'}
                                onChange={(e) => setNewTransaction({ ...newTransaction, type: e.target.value })}
                                className="h-4 w-4 text-blue-600"
                            />
                            <span className="text-sm font-bold">Thu</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="type"
                                value="Chi"
                                checked={newTransaction.type === 'Chi'}
                                onChange={(e) => setNewTransaction({ ...newTransaction, type: e.target.value })}
                                className="h-4 w-4 text-blue-600"
                            />
                            <span className="text-sm font-bold">Chi</span>
                        </label>
                    </div>
                    <Input
                        label="Tiêu đề"
                        value={newTransaction.title}
                        onChange={(e) => setNewTransaction({ ...newTransaction, title: e.target.value })}
                        placeholder="VD: Chi mua văn phòng phẩm"
                    />
                    <Input
                        label="Số tiền"
                        type="number"
                        value={newTransaction.amount}
                        onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
                        placeholder="1000000"
                    />
                    <Input
                        label="Mô tả"
                        value={newTransaction.description}
                        onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
                        placeholder="Chi tiết về giao dịch"
                    />
                    <Input
                        label="Người thực hiện / Nguồn"
                        value={newTransaction.from}
                        onChange={(e) => setNewTransaction({ ...newTransaction, from: e.target.value })}
                        placeholder="Tên người nộp / nhận"
                    />
                    <div className="flex gap-4 pt-4">
                        <Button variant="outline" className="flex-1" onClick={() => setShowCreateModal(false)}>Hủy</Button>
                        <Button variant="primary" className="flex-1" onClick={handleCreateTransaction}>Tạo phiếu</Button>
                    </div>
                </div>
            </Modal>

            <footer className="text-center pt-6 lg:pt-8 text-[9px] lg:text-xs font-medium text-slate-400">
                © 2025 Digital Youth Union System (DYUS). All rights reserved.<br />
                Module: Faculty Financial Management v2.0 - Khoa Công Nghệ Thông Tin
            </footer>

            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </div>
    );
};

export default SubAdminFinance;