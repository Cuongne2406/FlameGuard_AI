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
    const [qaList, setQaList] = useState([]);
    const [incidentList, setIncidentList] = useState([]);
    const [chartData, setChartData] = useState([0, 0, 0, 0, 0]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReportData = async () => {
            try {
                setLoading(true);
                const [evt, regs, qas, incs, liveStats] = await Promise.all([
                    eventService.getEvent(id),
                    eventService.getEventRegistrations(id),
                    eventService.getEventQA(id),
                    eventService.getEventIncidents(id),
                    eventService.getEventLiveStats(id)
                ]);
                setEventData(evt);
                setRegistrations(regs);
                setQaList(qas);
                setIncidentList(incs);
                if (liveStats && liveStats.length > 0) setChartData(liveStats);
            } catch (err) {
                console.error("Failed to fetch live report data", err);
                setToast({ message: 'Lỗi tải dữ liệu giám sát', type: 'error' });
            } finally {
                setLoading(false);
            }
        };
        if (id) {
            fetchReportData();
            // Polling every 30s for "real-time" feel without WebSockets
            const interval = setInterval(fetchReportData, 30000);
            return () => clearInterval(interval);
        }
    }, [id]);

    const checkedInCount = registrations.filter(r => r.status === 'ATTENDED').length;
    const totalRegCount = registrations.length || 1; // avoid division by zero
    const checkinPercent = ((checkedInCount / totalRegCount) * 100).toFixed(1);

    const stats = [
        { label: 'Tổng Check-in', val: checkedInCount.toString(), total: `/ ${totalRegCount}`, percent: `${checkinPercent}%`, sub: 'Dữ liệu thời gian thực', icon: 'qr_code_scanner', color: 'blue' },
        { label: 'Đại biểu & Khách mời', val: '0', total: '/ 0 Đại biểu', sub: 'Tính năng đang phát triển', icon: 'badge', color: 'orange', extra: '', statusIcon: 'check_circle' },
        { label: 'Tương tác Q&A', val: qaList.length.toString(), sub: `${qaList.filter(q => q.is_answered).length} đã xử lý`, icon: 'forum', color: 'indigo', unit: 'câu hỏi' },
    ];


    const rankings = [
        { rank: 1, name: 'Lớp 21CNTT1', percent: 95 },
        { rank: 2, name: 'Lớp 22CNTT2', percent: 88 },
        { rank: 3, name: 'Lớp 21CNTT3', percent: 45, contact: true }
    ];
    const allRankings = rankings;

    const handlePauseCheckin = () => {
        setCheckinPaused(!checkinPaused);
        setToast({ message: checkinPaused ? 'Đã tiếp tục check-in' : 'Đã tạm dừng check-in', type: 'info' });
    };

    const handleAnswerQA = async (qaId) => {
        const answer = prompt("Nhập câu trả lời:");
        if (!answer) return;
        try {
            await eventService.answerQA(qaId, answer);
            setQaList(prev => prev.map(q => q.id === qaId ? { ...q, answer, is_answered: true } : q));
            setToast({ message: 'Đã gửi câu trả lời!', type: 'success' });
        } catch (err) {
            setToast({ message: 'Lỗi khi gửi câu trả lời', type: 'error' });
        }
    };

    const handleUpdateIncidentStatus = async (incidentId, currentStatus) => {
        const nextStatus = currentStatus === 'PENDING' ? 'RESOLVED' : 'PENDING';
        try {
            await eventService.updateIncidentStatus(incidentId, nextStatus);
            setIncidentList(prev => prev.map(i => i.id === incidentId ? { ...i, status: nextStatus } : i));
            setToast({ message: `Đã cập nhật trạng thái: ${nextStatus}`, type: 'success' });
        } catch (err) {
            setToast({ message: 'Lỗi khi cập nhật trạng thái', type: 'error' });
        }
    };

    return (
        <div className="p-4 md:p-8 bg-[#F8FAFC] min-h-screen space-y-8 font-sans">
            {/* Header với breadcrumb */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <nav className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                        <button onClick={() => navigate(-1)} className="hover:text-blue-600">‹ Quay lại</button>
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
                        {/* Chart bars */}
                        {chartData.map((h, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-4 group">
                                <div className={`w-full rounded-t-lg transition-all duration-700 ${Math.max(...chartData) === h && h > 0 ? 'bg-blue-600 shadow-lg shadow-blue-100' : 'bg-blue-200 group-hover:bg-blue-400'}`} style={{ height: `${h > 0 ? (h / Math.max(...chartData)) * 100 : 0}%` }}>
                                    {Math.max(...chartData) === h && h > 0 && <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-blue-600 uppercase">Peak</div>}
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
                            Báo cáo Sự cố ({incidentList.length})
                            {activeTab === 'feedback' && <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-600 rounded-t-full"></div>}
                        </button>
                    </div>
                </div>
                <div className="p-10 space-y-6">
                    {activeTab === 'qa' ? (
                        <div className="space-y-4">
                            {qaList.length === 0 ? (
                                <p className="text-center text-slate-400 py-10 font-bold uppercase tracking-widest">Chưa có câu hỏi nào</p>
                            ) : (
                                qaList.map(q => (
                                    <div key={q.id} className="p-6 rounded-2xl border border-slate-100 bg-white flex items-start justify-between">
                                        <div className="flex-1">
                                            <p className="text-sm font-bold text-slate-900">{q.user_name || 'Người tham gia'}</p>
                                            <p className="text-base mt-2 font-medium">{q.question}</p>
                                            {q.is_answered && (
                                                <div className="mt-4 p-4 bg-blue-50 rounded-xl border-l-4 border-blue-500">
                                                    <p className="text-xs font-bold text-blue-600 uppercase mb-1">Cán bộ phản hồi:</p>
                                                    <p className="text-sm text-slate-700">{q.answer}</p>
                                                </div>
                                            )}
                                            <p className="text-xs font-bold text-slate-400 mt-3">{new Date(q.created_at).toLocaleTimeString()}</p>
                                        </div>
                                        {q.is_answered ? (
                                            <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-lg border border-emerald-100 ml-4 shrink-0">Đã trả lời ✓</span>
                                        ) : (
                                            <button 
                                                onClick={() => handleAnswerQA(q.id)}
                                                className="px-6 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all ml-4 shrink-0"
                                            >
                                                Trả lời
                                            </button>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {incidentList.length === 0 ? (
                                <p className="text-center text-slate-400 py-10 font-bold uppercase tracking-widest">Không có sự cố báo cáo</p>
                            ) : (
                                incidentList.map(f => (
                                    <div key={f.id} className={`p-6 rounded-2xl border-l-8 bg-white flex items-start justify-between shadow-sm transition-all ${f.status === 'RESOLVED' ? 'border-emerald-500' : 'border-rose-500'}`}>
                                        <div>
                                            <div className="flex items-center gap-3">
                                                <p className="text-sm font-bold text-slate-900">{f.reporter_name || 'Cán bộ trực'}</p>
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${f.severity === 'Critical' ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'}`}>
                                                    {f.severity}
                                                </span>
                                            </div>
                                            <p className="text-base mt-2 font-medium">{f.description}</p>
                                            <p className="text-xs font-bold text-slate-400 mt-1">{new Date(f.created_at).toLocaleTimeString()}</p>
                                        </div>
                                        <button 
                                            onClick={() => handleUpdateIncidentStatus(f.id, f.status)}
                                            className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                                                f.status === 'RESOLVED' 
                                                ? 'bg-emerald-50 border-emerald-100 text-emerald-600' 
                                                : 'bg-rose-600 border-transparent text-white shadow-lg shadow-rose-100'
                                            }`}
                                        >
                                            {f.status === 'RESOLVED' ? 'Đã xử lý ✓' : 'Đánh dấu Đã xử lý'}
                                        </button>
                                    </div>
                                ))
                            )}
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