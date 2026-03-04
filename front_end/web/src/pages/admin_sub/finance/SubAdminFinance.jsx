import React, { useState } from 'react';
import Toast from '../../../components/ui/Toast';

const SubAdminFinance = () => {
    const [toast, setToast] = useState(null);
    const [activeTab, setActiveTab] = useState('Tất cả');

    const transactions = [
        { id: '1', title: 'Chi hoạt động', detail: 'Mua nước uống & Băng rôn', user: 'Trần Thị B', amount: '-1.500.000 VNĐ', status: 'Đã thanh toán', statusColor: 'emerald', icon: 'shopping_bag', color: 'rose' },
        { id: '2', title: 'Thu Đoàn phí', detail: 'Chi đoàn 23CT112 nộp phí', user: 'Nguyễn Văn A', amount: '+2.500.000 VNĐ', status: 'Đã nhập quỹ', statusColor: 'emerald', icon: 'payments', color: 'emerald' },
        { id: '3', title: 'Tạm ứng', detail: 'CLB Văn nghệ thuê trang phục', user: 'Lê Văn C', amount: '500.000 VNĐ', status: 'Chờ Bí thư duyệt', statusColor: 'orange', icon: 'pending_actions', color: 'orange', actionRequired: true },
    ];

    return (
        <div className="p-4 md:p-8 bg-[#F8FAFC] min-h-screen space-y-8 font-sans">
            {/* Header */}
            <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-lg">
                        <span className="material-symbols-outlined text-3xl">account_balance</span>
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Tài chính Đoàn - Hội Khoa CNTT</h1>
                        <p className="text-xs font-medium text-slate-400 mt-0.5">Dashboard Quản lý Quỹ & Minh bạch Tài chính</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="h-10 px-4 rounded-xl border border-slate-100 bg-emerald-50 text-emerald-600 flex items-center gap-2 shadow-sm italic text-[10px] font-bold uppercase tracking-widest">
                        <span className="material-symbols-outlined text-sm">verified_user</span> An toàn (Đã đối soát tháng 10)
                    </div>
                    <select className="h-10 px-4 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-600 outline-none">
                        <option>Năm học 2025-2026</option>
                    </select>
                    <div className="h-10 w-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center relative cursor-pointer">
                        <span className="material-symbols-outlined text-slate-400">notifications</span>
                        <span className="absolute top-2 right-2.5 h-2 w-2 rounded-full bg-rose-500 border-2 border-white"></span>
                    </div>
                </div>
            </header>

            {/* Fund Summary Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Total Fund */}
                <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm space-y-8 relative overflow-hidden group">
                    <div className="flex justify-between items-start">
                        <div className="space-y-4">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">TỔNG QUỸ HIỆN CÓ</p>
                            <p className="text-4xl font-bold text-emerald-600 tracking-tighter italic">50.500.000</p>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">VNĐ</p>
                        </div>
                        <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                            <span className="material-symbols-outlined text-3xl">account_balance_wallet</span>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-50">
                        <div>
                            <p className="text-[9px] font-bold text-slate-300 uppercase italic">Quỹ Đoàn</p>
                            <p className="text-xs font-bold text-slate-900 mt-1">30.000.000</p>
                            <p className="text-[9px] font-bold text-slate-400 uppercase">VNĐ</p>
                        </div>
                        <div className="text-right">
                            <p className="text-[9px] font-bold text-slate-300 uppercase italic">Quỹ Hội</p>
                            <p className="text-xs font-bold text-slate-900 mt-1">20.500.000</p>
                            <p className="text-[9px] font-bold text-slate-400 uppercase">VNĐ</p>
                        </div>
                    </div>
                </div>

                {/* Progress Card */}
                <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm space-y-6">
                    <div className="flex justify-between items-start">
                        <div className="space-y-2">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Tiến độ thu Đoàn phí KY1/2026</p>
                            <div className="flex items-baseline gap-2 pt-4">
                                <span className="text-3xl font-bold text-slate-900 tracking-tighter">92%</span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">1380/1500 SV</span>
                            </div>
                        </div>
                        <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                            <span className="material-symbols-outlined">download</span>
                        </div>
                    </div>
                    <div className="h-1.5 rounded-full bg-slate-50 overflow-hidden"><div className="h-full bg-blue-600 rounded-full" style={{ width: '92%' }}></div></div>
                    <div className="flex items-center justify-between gap-3 pt-2">
                        <p className="text-[10px] font-bold text-rose-500 uppercase tracking-widest leading-tight">Còn 120 bạn chưa đóng</p>
                        <button className="h-10 px-4 rounded-xl bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest shadow-sm">Gửi nhắc nhở</button>
                    </div>
                </div>

                {/* Expense Card */}
                <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm space-y-8">
                    <div className="flex justify-between items-start">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Đã chi trong tháng</p>
                        <div className="h-10 w-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                            <span className="material-symbols-outlined">north_east</span>
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-rose-600 tracking-tighter italic">-5.200.000</p>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                        <p className="text-[9px] font-bold text-slate-400 uppercase italic">Chủ yếu cho: <span className="text-slate-900">Giải bóng đá & In ấn</span></p>
                    </div>
                </div>

                {/* Sourcing Card */}
                <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm space-y-8">
                    <div className="flex justify-between items-start">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Nguồn tài trợ ngoài</p>
                        <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                            <span className="material-symbols-outlined">handshake</span>
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-emerald-600 tracking-tighter italic">+10.000.000</p>
                    <div className="p-3 rounded-xl bg-slate-50/50 border border-emerald-100 flex items-center gap-2">
                        <span className="material-symbols-outlined text-emerald-500 text-sm">check_circle</span>
                        <p className="text-[9px] font-bold text-slate-400 uppercase italic leading-none">Từ Doanh nghiệp ABC</p>
                    </div>
                </div>
            </div>

            {/* History Section */}
            <div className="bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-sm">
                <div className="px-10 py-6 border-b border-slate-50 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-3">
                        <span className="material-symbols-outlined text-blue-600">history</span>
                        Lịch sử Thu/Chi Gần Nhất
                    </h3>
                    <div className="flex bg-blue-600 p-1 rounded-xl">
                        {['Tất cả', 'Thu', 'Chi', 'Chờ duyệt'].map(t => (
                            <button key={t} onClick={() => setActiveTab(t)} className={`h-10 px-5 rounded-lg text-[11px] font-bold uppercase tracking-widest transition-all ${activeTab === t ? 'bg-white text-blue-600 shadow-sm' : 'text-blue-100'}`}>{t}</button>
                        ))}
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-10 py-5 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">NỘI DUNG GIAO DỊCH</th>
                                <th className="px-8 py-5 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">NGƯỜI THỰC HIỆN</th>
                                <th className="px-8 py-5 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">SỐ TIỀN</th>
                                <th className="px-8 py-5 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">TRẠNG THÁI</th>
                                <th className="px-10 py-5 text-right text-[10px] font-bold text-slate-400 uppercase tracking-widest">HÀNH ĐỘNG</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {transactions.map((tr) => (
                                <tr key={tr.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-10 py-8">
                                        <div className="flex items-center gap-4">
                                            <div className={`h-10 w-10 rounded-xl bg-${tr.color}-50 text-${tr.color}-600 flex items-center justify-center shrink-0 overflow-hidden`}>
                                                <span className="material-symbols-outlined text-xl">{tr.icon}</span>
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-900">{tr.title}</p>
                                                <p className="text-[11px] font-medium text-slate-400 italic mt-1 leading-none">{tr.detail}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-8 text-sm font-bold text-slate-700">{tr.user}</td>
                                    <td className={`px-8 py-8 text-sm font-bold italic ${tr.amount.startsWith('+') ? 'text-emerald-600' : 'text-rose-600'}`}>{tr.amount}</td>
                                    <td className="px-8 py-8">
                                        <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest italic flex items-center gap-2 w-fit ${tr.statusColor === 'emerald' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-orange-50 text-orange-600 border border-orange-100'
                                            }`}>
                                            <span className="material-symbols-outlined text-sm">{tr.statusColor === 'emerald' ? 'check_circle' : 'hourglass_empty'}</span>
                                            {tr.status}
                                        </span>
                                    </td>
                                    <td className="px-10 py-8">
                                        <div className="flex items-center justify-end gap-3">
                                            {tr.actionRequired ? (
                                                <button className="h-10 px-5 rounded-xl bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-100">Duyệt chi ngay</button>
                                            ) : null}
                                            <button className="h-10 w-10 rounded-xl hover:bg-slate-100 text-slate-300 transition-colors">
                                                <span className="material-symbols-outlined">more_vert</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-col md:flex-row items-center gap-6">
                <button className="flex-1 h-16 rounded-[2rem] bg-blue-600 text-white font-black text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all active:scale-[0.98]">
                    <span className="material-symbols-outlined text-2xl">add_circle</span>
                    Lập phiếu Thu/Chi
                </button>
                <button className="flex-1 h-16 rounded-[2rem] bg-white border border-slate-100 text-slate-900 font-black text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-sm hover:bg-slate-50 transition-all active:scale-[0.98]">
                    <span className="material-symbols-outlined text-2xl">picture_as_pdf</span>
                    Xuất báo cáo tài chính (PDF)
                </button>
            </div>

            <footer className="text-center pt-8 text-[11px] font-medium text-slate-400 italic">
                © 2025 Digital Youth Union System (DYUS). All rights reserved.<br />
                Module: Faculty Financial Management v2.0 - Khoa Công Nghệ Thông Tin
            </footer>

            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </div>
    );
};

export default SubAdminFinance;
