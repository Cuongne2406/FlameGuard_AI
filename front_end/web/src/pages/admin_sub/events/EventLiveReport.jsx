import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Toast from '../../../components/ui/Toast';
import { eventService } from '../../../services/eventService';

const EventLiveReport = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [toast, setToast] = useState(null);
    const [activeTab, setActiveTab] = useState('qa');
    const [checkinPaused, setCheckinPaused] = useState(false);
    const [showAllClasses, setShowAllClasses] = useState(false);
    const [eventData, setEventData] = useState(null);
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReportData = async () => {
            try {
                setLoading(true);
                const [evt, regs] = await Promise.all([
                    eventService.getEvent(id),
                    eventService.getEventRegistrations(id)
                ]);
                setEventData(evt);
                setRegistrations(regs);
            } catch (err) {
                console.error("Failed to fetch live report data", err);
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchReportData();
    }, [id]);

    const checkedInCount = registrations.filter(r => r.status === 'ATTENDED').length;
    const totalRegCount = registrations.length || 1; // avoid division by zero
    const checkinPercent = ((checkedInCount / totalRegCount) * 100).toFixed(1);

    const stats = [
        { label: 'Tổng Check-in', val: checkedInCount.toString(), total: `/ ${totalRegCount}`, percent: `${checkinPercent}%`, sub: 'Dữ liệu thời gian thực', icon: 'qr_code_scanner', color: 'blue' },
        { label: 'Đại biểu & Khách mời', val: '0', total: '/ 0 Đại biểu', sub: 'Chưa có data API', icon: 'badge', color: 'orange', extra: '', statusIcon: 'check_circle' },
        { label: 'Tương tác Q&A', val: '2', sub: 'Chủ đề hot: Tuyển dụng', icon: 'forum', color: 'indigo', unit: 'câu hỏi' },
    ];

    const chartData = [10, 25, 40, 85, 30, 20, 15, 12, 10];
    const rankings = [
        { rank: 1, name: '23CT112', percent: 100 },
        { rank: 2, name: '21CT111', percent: 95 },
        { rank: 3, name: '22CT112', percent: 88 },
        { rank: 4, name: '23CT113', percent: 12, contact: true },
    ];
    const allRankings = rankings; // Giả lập, thực tế có thể fetch thêm

    const qaList = [
        { id: 1, user: 'Nguyễn Văn A', question: 'Cơ hội thực tập tại công ty ABC?', time: '10:25', answered: true },
        { id: 2, user: 'Trần Thị B', question: 'Khi nào có kết quả vòng loại?', time: '10:30', answered: false },
    ];

    const feedbackList = [
        { id: 1, user: 'Lê Văn C', content: 'Âm thanh hơi nhỏ ở dãy cuối', time: '10:15' },
    ];

    const handlePauseCheckin = () => {
        setCheckinPaused(!checkinPaused);
        setToast({ message: checkinPaused ? 'Đã tiếp tục check-in' : 'Đã tạm dừng check-in', type: 'info' });
    };

    return (
        <div className="p-4 md:p-8 bg-[#F8FAFC] min-h-screen space-y-8 font-sans">
            {/* Header với breadcrumb */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <nav className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                        <button onClick={() => navigate('/admin_sub/events')} className="hover:text-blue-600">Sự kiện Khoa</button>
                        <span>/</span>
                        <span className="text-blue-600 underline">Giám sát Trực tiếp</span>
                    </nav>
                    <h1 className="text-2xl font-bold text-slate-900">Báo cáo Giám sát Trực tiếp: {eventData?.name || 'Đang tải...'}</h1>
                    <div className="flex items-center gap-6 mt-2">
                        <p className="flex items-center gap-2 text-xs font-bold text-rose-600 uppercase tracking-widest">
                            <span className="h-2 w-2 rounded-full bg-rose-600 animate-pulse"></span> LIVE NOW
                        </p>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                            <span className="material-symbols-outlined text-sm align-middle mr-1">history</span> {eventData ? `Tối đa: ${eventData.max_participants} người` : ''}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handlePauseCheckin}
                        className={`h-12 px-6 rounded-xl border border-slate-200 bg-white text-xs font-bold uppercase tracking-widest flex items-center gap-3 shadow-sm ${
                            checkinPaused ? 'text-rose-600 border-rose-200' : 'text-slate-900'
                        }`}
                    >
                        <span className="material-symbols-outlined text-lg">{checkinPaused ? 'play_circle' : 'pause_circle'}</span>
                        {checkinPaused ? 'Tiếp tục Check-in' : 'Tạm dừng Check-in'}
                    </button>
                    <button className="h-12 px-6 rounded-xl bg-blue-600 text-white text-xs font-bold uppercase tracking-widest flex items-center gap-3 shadow-lg shadow-blue-100">
                        <span className="material-symbols-outlined text-lg">notifications_active</span> Gửi Push thông báo
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {stats.map((s, i) => (
                    <div key={i} className={`bg-white border-l-8 rounded-2xl p-8 shadow-sm group hover:shadow-xl transition-all border-${s.color}-500 flex flex-col justify-between h-48`}>
                        <div className="flex justify-between items-start">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{s.label}</p>
                            <div className={`h-10 w-10 rounded-xl bg-slate-50 text-${s.color}-600 flex items-center justify-center`}>
                                <span className="material-symbols-outlined">{s.icon}</span>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-baseline gap-2">
                                <p className="text-4xl font-bold text-slate-900 tracking-tighter">{s.val}</p>
                                <span className="text-xs font-bold text-slate-400 uppercase">{s.total || s.unit} <span className="text-blue-600 ml-1">{s.percent}</span></span>
                            </div>
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    {s.statusIcon && <span className="material-symbols-outlined text-xs text-emerald-500">{s.statusIcon}</span>}
                                    <p className={`text-xs font-bold uppercase ${s.color === 'blue' ? 'text-emerald-500' : 'text-slate-400'}`}>{s.sub}</p>
                                </div>
                                {s.extra && <p className="text-xs font-bold text-slate-400 uppercase italic leading-none ml-5">• {s.extra}</p>}
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
                        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-3">
                            <span className="material-symbols-outlined text-blue-600">show_chart</span> Diễn biến Check-in theo thời gian thực
                        </h3>
                        <select className="h-10 px-4 rounded-xl border border-slate-100 bg-slate-50 text-xs font-bold uppercase tracking-widest outline-none">
                            <option>1 giờ qua</option>
                        </select>
                    </div>
                    <div className="h-64 flex items-end gap-1.5 px-4 relative">
                        {/* Chart bars (giữ nguyên) */}
                        {chartData.map((h, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-4 group">
                                <div className={`w-full rounded-t-lg transition-all duration-700 ${i === 3 ? 'bg-blue-600 shadow-lg shadow-blue-100' : 'bg-blue-200 group-hover:bg-blue-400'}`} style={{ height: `${h}%` }}>
                                    {i === 3 && <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-blue-600 uppercase">Peak</div>}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between px-4 text-xs font-bold text-slate-300 uppercase tracking-widest">
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
                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Tỷ lệ tham gia theo Chi đoàn</h3>
                        <button
                            onClick={() => setShowAllClasses(!showAllClasses)}
                            className="text-xs font-bold text-blue-600 underline underline-offset-4 uppercase tracking-widest"
                        >
                            {showAllClasses ? 'Thu gọn' : 'Xem tất cả'}
                        </button>
                    </div>
                    <div className="space-y-4">
                        <div className="grid grid-cols-4 px-4 text-xs font-bold text-slate-300 uppercase tracking-widest">
                            <span>Hạng</span>
                            <span className="col-span-2">Chi đoàn</span>
                            <span className="text-right">Tỷ lệ</span>
                        </div>
                        {(showAllClasses ? allRankings : rankings.slice(0, 3)).map((r) => (
                            <div key={r.rank} className={`p-4 rounded-xl border flex items-center justify-between group transition-all ${r.contact ? 'bg-rose-50/30 border-rose-50' : 'bg-slate-50/50 border-transparent hover:bg-white hover:shadow-lg'}`}>
                                <div className="flex items-center gap-6">
                                    <div className="w-4 text-xs font-bold text-slate-400">
                                        {r.rank === 1 ? '🥇' : r.rank === 2 ? '🥈' : `#${r.rank}`}
                                    </div>
                                    <p className="text-sm font-bold text-slate-900">{r.name}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <p className={`text-sm font-bold ${r.percent >= 90 ? 'text-emerald-600' : 'text-rose-600'}`}>{r.percent}%</p>
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
                        <button
                            onClick={() => setActiveTab('qa')}
                            className={`pb-4 text-sm font-bold uppercase tracking-widest transition-all relative ${activeTab === 'qa' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}>
                            Câu hỏi Q&A ({qaList.length})
                            {activeTab === 'qa' && <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-600 rounded-t-full"></div>}
                        </button>
                        <button
                            onClick={() => setActiveTab('feedback')}
                            className={`pb-4 text-sm font-bold uppercase tracking-widest transition-all relative ${activeTab === 'feedback' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}>
                            Phản hồi Sự cố ({feedbackList.length})
                            {activeTab === 'feedback' && <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-600 rounded-t-full"></div>}
                        </button>
                    </div>
                </div>
                <div className="p-10 space-y-6">
                    {activeTab === 'qa' ? (
                        <div className="space-y-4">
                            {qaList.map(q => (
                                <div key={q.id} className="p-6 rounded-2xl border border-slate-100 bg-white flex items-start justify-between">
                                    <div>
                                        <p className="text-sm font-bold text-slate-900">{q.user}</p>
                                        <p className="text-base mt-2">{q.question}</p>
                                        <p className="text-xs font-bold text-slate-400 mt-1">{q.time}</p>
                                    </div>
                                    {q.answered ? (
                                        <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-lg">Đã trả lời</span>
                                    ) : (
                                        <button className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg">Trả lời</button>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {feedbackList.map(f => (
                                <div key={f.id} className="p-6 rounded-2xl border border-slate-100 bg-white">
                                    <p className="text-sm font-bold text-slate-900">{f.user}</p>
                                    <p className="text-base mt-2">{f.content}</p>
                                    <p className="text-xs font-bold text-slate-400 mt-1">{f.time}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <footer className="text-center pt-8 text-xs font-medium text-slate-400 italic">
                © 2025 Digital Youth Union System (DYUS). All rights reserved.<br />
                Module: Real-time Event Monitoring Center v3.0 - Khoa Công Nghệ Thông Tin
            </footer>

            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </div>
    );
};

export default EventLiveReport;