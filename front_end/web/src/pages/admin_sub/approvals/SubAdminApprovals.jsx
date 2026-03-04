import React, { useState } from 'react';
import Toast from '../../../components/ui/Toast';

const SubAdminApprovals = () => {
    const [toast, setToast] = useState(null);
    const [activeTab, setActiveTab] = useState('Queue');

    const handleAction = (msg) => {
        setToast({ message: msg, type: 'success' });
    };

    return (
        <div className="p-4 md:p-8 bg-[#F8FAFC] min-h-screen space-y-10 font-sans">
            {/* Header with Search */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <nav className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                        <span className="material-symbols-outlined text-[14px]">home</span>
                        <span>Tổng quan</span>
                        <span>/</span>
                        <span className="text-blue-600 underline">Xét duyệt & Văn bản</span>
                    </nav>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Trung tâm Hành chính & Xét duyệt Điện tử</h1>
                </div>
                <div className="relative w-full lg:w-96">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-300">search</span>
                    <input
                        type="text"
                        placeholder="Tìm kiếm văn bản, số hiệu, tên người gửi..."
                        className="w-full h-12 pl-12 pr-4 rounded-xl border border-slate-200 bg-white shadow-sm outline-none focus:ring-2 ring-blue-500/10 text-sm font-medium"
                    />
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { label: 'Chờ xử lý', val: '05', sub: 'Yêu cầu mới cần duyệt', color: 'orange', icon: 'pending_actions' },
                    { label: 'Đã duyệt tháng này', val: '120', sub: 'Hồ sơ hoàn tất', color: 'emerald', icon: 'verified' },
                    { label: 'Văn bản từ Trường', val: '03', sub: 'Văn bản chưa đọc', color: 'blue', icon: 'mail' },
                ].map((s, i) => (
                    <div key={i} className={`bg-white border-l-4 border-${s.color}-500 rounded-2xl p-6 shadow-sm flex items-center gap-6 group hover:shadow-xl transition-all`}>
                        <div className={`h-12 w-12 rounded-xl bg-${s.color}-50 text-${s.color}-600 flex items-center justify-center shrink-0 overflow-hidden`}>
                            <span className="material-symbols-outlined text-2xl">{s.icon}</span>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">{s.label}</p>
                            <p className="text-3xl font-black text-slate-900 tracking-tighter leading-none italic">{s.val}</p>
                            <p className="text-[10px] font-bold text-emerald-600 mt-2 uppercase tracking-widest">{s.sub}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Section with Tabs */}
            <div className="space-y-8">
                <div className="flex border-b border-slate-200 gap-8">
                    <button
                        onClick={() => setActiveTab('Queue')}
                        className={`pb-4 text-sm font-bold uppercase tracking-widest transition-all relative flex items-center gap-3 ${activeTab === 'Queue' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}>
                        <span className="material-symbols-outlined">add_box</span> Yêu cầu từ Chi đoàn & CLB (Queue)
                        {activeTab === 'Queue' && <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-600 rounded-t-full"></div>}
                    </button>
                    <button
                        onClick={() => setActiveTab('Repo')}
                        className={`pb-4 text-sm font-bold uppercase tracking-widest transition-all relative flex items-center gap-3 ${activeTab === 'Repo' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}>
                        <span className="material-symbols-outlined">folder_open</span> Quản lý Văn bản Đi/Đến (Document Repository)
                        {activeTab === 'Repo' && <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-600 rounded-t-full"></div>}
                    </button>
                </div>

                {/* Queue List */}
                <div className="space-y-8">
                    {/* Card 1: Finance Request */}
                    <div className="bg-white border border-slate-100 rounded-[2.5rem] p-10 shadow-sm space-y-8 group hover:shadow-2xl transition-all border-l-8 border-transparent hover:border-blue-500">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                            <div className="flex items-start gap-6">
                                <div className="h-16 w-16 rounded-[1.5rem] bg-emerald-50 text-emerald-500 flex items-center justify-center border border-emerald-100 shadow-sm shrink-0 overflow-hidden">
                                    <span className="material-symbols-outlined text-3xl">payments</span>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-xl font-bold text-slate-900 leading-tight italic uppercase tracking-tighter">Xin quyết toán kinh phí</h3>
                                    <div className="flex items-center gap-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                                        <span>Gửi bởi: <span className="text-blue-600">Chi đoàn 23CT112</span></span>
                                    </div>
                                    <p className="text-sm font-medium text-slate-600 mt-4 leading-relaxed italic">Subject: Quyết toán chiến dịch Mùa Hè Xanh mặt trận 1</p>
                                    <div className="flex items-center gap-6 mt-4">
                                        <p className="text-[10px] font-black text-slate-400 uppercase italic">Tổng tiền: <span className="text-slate-900">2.500.000 VNĐ</span></p>
                                        <div className="flex items-center gap-2 text-blue-600 text-[11px] font-bold underline underline-offset-4 decoration-2 cursor-pointer">
                                            <span className="material-symbols-outlined text-sm">picture_as_pdf</span> Hoa_don_do_scan.pdf
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col gap-3 lg:w-48">
                                <button onClick={() => handleAction('Đã ký số và chuyển ứng dụng tiền!')} className="h-12 rounded-xl bg-blue-600 text-white text-[11px] font-black uppercase tracking-[0.1em] shadow-lg shadow-blue-100 flex items-center justify-center gap-2">
                                    <span className="material-symbols-outlined">history_edu</span> Ký số & Chuyển tiền
                                </button>
                                <button className="h-12 rounded-xl border border-slate-200 text-slate-900 text-[11px] font-black uppercase tracking-[0.1em] hover:bg-slate-50">Từ chối</button>
                            </div>
                        </div>
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-bold border border-emerald-100 italic">
                            <span className="material-symbols-outlined text-sm">auto_awesome</span> AI Check: Đã khớp với dự trù ngân sách
                        </div>
                    </div>

                    {/* Card 2: Facility Request */}
                    <div className="bg-white border border-slate-100 rounded-[2.5rem] p-10 shadow-sm space-y-8 group hover:shadow-2xl transition-all border-l-8 border-transparent hover:border-orange-500">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                            <div className="flex items-start gap-6">
                                <div className="h-16 w-16 rounded-[1.5rem] bg-indigo-50 text-indigo-500 flex items-center justify-center border border-indigo-100 shadow-sm shrink-0 overflow-hidden">
                                    <span className="material-symbols-outlined text-3xl">apartment</span>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-xl font-bold text-slate-900 leading-tight italic uppercase tracking-tighter">Mượn cơ sở vật chất</h3>
                                    <div className="flex items-center gap-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                                        <span>Gửi bởi: <span className="text-blue-600">CLB Robot & AI</span></span>
                                    </div>
                                    <p className="text-sm font-medium text-slate-600 mt-4 italic leading-relaxed">Subject: Mượn phòng Lab C.302 cho buổi Workshop</p>
                                    <div className="flex items-center gap-6 mt-4">
                                        <p className="text-[10px] font-black text-slate-400 uppercase italic flex items-center gap-2">
                                            <span className="material-symbols-outlined text-sm">schedule</span> 14:00 - 17:00, Thứ 7 (20/11)
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col gap-3 lg:w-48">
                                <button className="h-12 rounded-xl bg-orange-600 text-white text-[11px] font-black uppercase tracking-[0.1em] shadow-lg shadow-orange-100 flex items-center justify-center gap-2">
                                    <span className="material-symbols-outlined">update</span> Yêu cầu đổi giờ
                                </button>
                                <button className="h-12 rounded-xl border border-slate-200 text-slate-900 text-[11px] font-black uppercase tracking-[0.1em] hover:bg-slate-50">Vẫn duyệt</button>
                            </div>
                        </div>
                        <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100 flex items-start gap-4 text-amber-800">
                            <span className="material-symbols-outlined">warning</span>
                            <p className="text-xs font-bold leading-relaxed italic">Cảnh báo: Phòng C.302 đã có lớp 21CT111 đăng ký lúc 15:00</p>
                        </div>
                    </div>

                    {/* Card 3: Event Request */}
                    <div className="bg-white border border-slate-100 rounded-[2.5rem] p-10 shadow-sm space-y-8 group hover:shadow-2xl transition-all border-l-8 border-transparent hover:border-blue-700">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                            <div className="flex items-start gap-6">
                                <div className="h-16 w-16 rounded-[1.5rem] bg-indigo-50 text-indigo-500 flex items-center justify-center border border-indigo-100 shadow-sm shrink-0 overflow-hidden">
                                    <span className="material-symbols-outlined text-3xl">assignment</span>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-xl font-bold text-slate-900 leading-tight italic uppercase tracking-tighter">Kế hoạch Đại hội</h3>
                                    <div className="flex items-center gap-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                                        <span>Gửi bởi: <span className="text-blue-600">Chi đoàn 22CT111</span></span>
                                    </div>
                                    <p className="text-sm font-medium text-slate-600 mt-4 leading-relaxed italic">Subject: Kế hoạch Đại hội Chi đoàn nhiệm kỳ mới</p>
                                </div>
                            </div>
                            <div className="flex flex-col gap-3 lg:w-48">
                                <button className="h-12 rounded-xl bg-blue-700 text-white text-[11px] font-black uppercase tracking-[0.1em] shadow-lg shadow-blue-100 flex items-center justify-center gap-2">
                                    <span className="material-symbols-outlined">verified</span> Duyệt kế hoạch
                                </button>
                                <button className="h-12 rounded-xl border border-slate-200 text-slate-900 text-[11px] font-black uppercase tracking-[0.1em] hover:bg-slate-50">Xem chi tiết</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <footer className="text-center pt-8 text-[11px] font-medium text-slate-400 italic border-t border-slate-100">
                © 2025 Digital Youth Union System (DYUS). All rights reserved.<br />
                Module: Approval & Document Center v2.0 - Khoa Công Nghệ Thông Tin
            </footer>

            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </div>
    );
};

export default SubAdminApprovals;
