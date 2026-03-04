import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Toast from '../../../components/ui/Toast';

const EventLiveReport = () => {
    const { id } = useParams();
    const [toast, setToast] = useState(null);
    const [activeTab, setActiveTab] = useState('Phản hồi Sự cố');

    const stats = [
        { label: 'Tổng Check-in', val: '452', total: '/ 500', percent: '90.4%', sub: '+15 người trong 5 phút qua', icon: 'qr_code_scanner', color: 'blue' },
        { label: 'Đại biểu & Khách mời', val: '05', total: '/ 08 Đại biểu', sub: 'Thầy Trưởng Khoa: Đã đến', icon: 'badge', color: 'orange', extra: 'Doanh nghiệp: Chưa đến', statusIcon: 'check_circle' },
        { label: 'Tương tác Q&A', val: '120', sub: 'Chủ đề hot: Tuyển dụng', icon: 'forum', color: 'indigo', unit: 'câu hỏi' },
    ];

    const chartData = [10, 25, 40, 85, 30, 20, 15, 12, 10]; // Representing the bar chart levels

    const rankings = [
        { rank: 1, name: '23CT112', percent: 100 },
        { rank: 2, name: '21CT111', percent: 95 },
        { rank: 12, name: '23CT113', percent: 12, contact: true },
    ];

    const logs = [
        { id: 'L1', title: 'Mic của diễn giả hơi nhỏ, phía sau không nghe rõ', user: 'SV Nguyễn Văn A - Check-in tại Khu vực C', time: '10:30 AM', resolved: true, resolver: 'Bởi Kỹ thuật viên' }
    ];

    const handleAction = (msg) => {
        setToast({ message: msg, type: 'success' });
    };

    return (
        <div className="p-4 md:p-8 bg-[#F8FAFC] min-h-screen space-y-8 font-sans">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <nav className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                        <span className="material-symbols-outlined text-[12px]">calendar_month</span>
                        <span>Sự kiện</span>
                        <span>/</span>
                        <span>IT Tech Day 2026</span>
                        <span>/</span>
                        <span className="text-blue-600 underline">Giám sát Trực tiếp</span>
                    </nav>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight italic uppercase">Báo cáo Giám sát Trực tiếp: IT Tech Day 2026</h1>
                    <div className="flex items-center gap-6 mt-2">
                        <p className="flex items-center gap-2 text-[10px] font-black text-rose-600 uppercase tracking-widest italic">
                            <span className="h-2 w-2 rounded-full bg-rose-600 animate-pulse"></span> LIVE NOW (08:00 - 17:00)
                        </p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">
                            <span className="material-symbols-outlined text-sm align-middle mr-1">history</span> Sự kiện đã diễn ra: 02 giờ 30 phút
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button className="h-12 px-6 rounded-xl border border-slate-200 bg-white text-[11px] font-black uppercase tracking-widest text-slate-900 flex items-center gap-3 shadow-sm">
                        <span className="material-symbols-outlined text-lg">pause_circle</span> Tạm dừng Check-in
                    </button>
                    <button onClick={() => handleAction('Đã gửi Push tới tất cả SV tham gia!')} className="h-12 px-6 rounded-xl bg-blue-600 text-white text-[11px] font-black uppercase tracking-widest flex items-center gap-3 shadow-lg shadow-blue-100">
                        <span className="material-symbols-outlined text-lg">notifications_active</span> Gửi Push thông báo
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {stats.map((s, i) => (
                    <div key={i} className={`bg-white border-l-4 rounded-2xl p-8 shadow-sm group hover:shadow-xl transition-all border-${s.color}-500 flex flex-col justify-between h-48`}>
                        <div className="flex justify-between items-start">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">{s.label}</p>
                            <div className={`h-10 w-10 rounded-xl bg-slate-50 text-${s.color}-600 flex items-center justify-center`}>
                                <span className="material-symbols-outlined">{s.icon}</span>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-baseline gap-2">
                                <p className="text-4xl font-bold text-slate-900 italic tracking-tighter">{s.val}</p>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">{s.total || s.unit} <span className="text-blue-600 ml-1">{s.percent}</span></span>
                            </div>
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    {s.statusIcon && <span className="material-symbols-outlined text-xs text-emerald-500">{s.statusIcon}</span>}
                                    <p className={`text-[10px] font-bold uppercase tracking-[0.1em] ${s.color === 'blue' ? 'text-emerald-500' : 'text-slate-400'}`}>{s.sub}</p>
                                </div>
                                {s.extra && <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em] italic leading-none ml-5">• {s.extra}</p>}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Visual Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Check-in Chart */}
                <div className="lg:col-span-8 bg-white border border-slate-100 rounded-[2.5rem] p-10 shadow-sm space-y-10">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-3 italic">
                            <span className="material-symbols-outlined text-blue-600">show_chart</span> Diễn biến Check-in theo thời gian thực
                        </h3>
                        <select className="h-10 px-4 rounded-xl border border-slate-100 bg-slate-50 text-[10px] font-black uppercase tracking-widest outline-none">
                            <option>1 giờ qua</option>
                        </select>
                    </div>
                    <div className="h-64 flex items-end gap-1.5 px-4 relative">
                        {/* Chart Grid Lines */}
                        <div className="absolute inset-0 flex flex-col justify-between py-2 px-10 pointer-events-none opacity-5">
                            {[...Array(5)].map((_, i) => <div key={i} className="w-full h-px bg-slate-900"></div>)}
                        </div>
                        {chartData.map((h, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-4 group">
                                <div className={`w-full rounded-t-lg transition-all duration-700 relative ${i === 3 ? 'bg-blue-600 shadow-lg shadow-blue-100' : 'bg-blue-200 group-hover:bg-blue-400'}`} style={{ height: `${h}%` }}>
                                    {i === 3 && <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] font-black text-blue-600 uppercase italic">Peak</div>}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between px-4 text-[10px] font-bold text-slate-300 uppercase tracking-widest italic">
                        <span>07:00</span>
                        <span>07:30</span>
                        <span>08:00</span>
                        <span>09:00</span>
                        <span>Now</span>
                    </div>
                </div>

                {/* Right: Ranking */}
                <div className="lg:col-span-4 bg-white border border-slate-100 rounded-[2.5rem] p-10 shadow-sm space-y-8">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em] italic">Tỷ lệ tham gia theo Chi đoàn</h3>
                        <button className="text-[10px] font-bold text-blue-600 underline underline-offset-4 uppercase tracking-widest">Xem tất cả</button>
                    </div>
                    <div className="space-y-4">
                        <div className="grid grid-cols-4 px-4 text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] italic">
                            <span>Hạng</span>
                            <span className="col-span-2">Chi đoàn</span>
                            <span className="text-right">Tỷ lệ</span>
                        </div>
                        {rankings.map((r) => (
                            <div key={r.rank} className={`p-4 rounded-xl border flex items-center justify-between group transition-all ${r.rank === 12 ? 'bg-rose-50/30 border-rose-50' : 'bg-slate-50/50 border-transparent hover:bg-white hover:shadow-lg'}`}>
                                <div className="flex items-center gap-6">
                                    <div className="w-4 text-xs font-black italic text-slate-400">
                                        {r.rank === 1 ? '🥇' : r.rank === 2 ? '🥈' : `⚠️ ${r.rank}`}
                                    </div>
                                    <p className="text-xs font-black text-slate-900 italic tracking-tight">{r.name}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <p className={`text-xs font-black italic ${r.percent >= 90 ? 'text-emerald-600' : 'text-rose-600'}`}>{r.percent}%</p>
                                    {r.contact && <button className="h-8 w-8 bg-white rounded-lg shadow-sm border border-slate-100 flex items-center justify-center text-rose-500 hover:bg-rose-500 hover:text-white transition-all"><span className="material-symbols-outlined text-sm font-bold">call</span></button>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Tab Section */}
            <div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-sm overflow-hidden min-h-[400px]">
                <div className="p-8 border-b border-slate-50">
                    <div className="flex gap-10">
                        {['Câu hỏi Q&A 120', 'Phản hồi Sự cố 🆘 2 Mới'].map(t => (
                            <button
                                key={t}
                                onClick={() => setActiveTab(t.includes('🆘') ? 'Phản hồi Sự cố' : 'Câu hỏi Q&A')}
                                className={`pb-4 text-sm font-bold uppercase tracking-widest transition-all relative ${activeTab === (t.includes('🆘') ? 'Phản hồi Sự cố' : 'Câu hỏi Q&A') ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}>
                                {t}
                                {activeTab === (t.includes('🆘') ? 'Phản hồi Sự cố' : 'Câu hỏi Q&A') && <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-600 rounded-t-full"></div>}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="p-10 space-y-6">
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.35em] italic">DÒNG SỰ KIỆN MỚI NHẤT</p>
                    {logs.map(log => (
                        <div key={log.id} className="p-8 rounded-[2rem] bg-rose-50/50 border border-rose-100 space-y-6 animate-in slide-in-from-left-4 duration-500">
                            <div className="flex items-start justify-between">
                                <div className="flex gap-6 items-start">
                                    <div className="h-12 w-12 rounded-2xl bg-white border border-rose-100 flex items-center justify-center text-rose-600 shadow-sm shrink-0 overflow-hidden">
                                        <span className="material-symbols-outlined text-2xl animate-pulse">report</span>
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="text-lg font-bold text-slate-900 tracking-tight italic">{log.title}</h4>
                                        <p className="text-xs font-medium text-slate-400 uppercase tracking-widest">{log.user}</p>
                                    </div>
                                </div>
                                <p className="text-[11px] font-black text-slate-400 italic">{log.time}</p>
                            </div>
                            <div className="flex items-center gap-2 pl-[72px]">
                                <span className="material-symbols-outlined text-emerald-500 text-lg">check_circle</span>
                                <p className="text-[11px] font-bold text-emerald-600 uppercase tracking-widest">✅ {log.resolver}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <footer className="text-center pt-8 text-[11px] font-medium text-slate-400 italic">
                © 2025 Digital Youth Union System (DYUS). All rights reserved.<br />
                Module: Real-time Event Monitoring Center v3.0 - Khoa Công Nghệ Thông Tin
            </footer>

            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </div>
    );
};

export default EventLiveReport;
