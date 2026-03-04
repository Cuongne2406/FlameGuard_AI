import React, { useState } from 'react';
import Toast from '../../../components/ui/Toast';

const SubAdminAwards = () => {
    const [toast, setToast] = useState(null);
    const [showAssessmentModal, setShowAssessmentModal] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [activeTimescale, setActiveTimescale] = useState('Tháng này');

    const stats = [
        { label: 'DẪN ĐẦU THÁNG', title: 'Chi đoàn 23CT112', val: '98 Điểm', icon: 'military_tech', color: 'orange', trend: 'Giữ vững phong độ', badge: '🥇' },
        { label: 'SINH VIÊN 5 TỐT', title: '125 Hồ sơ', sub: 'Đạt chuẩn cấp Khoa', progress: 80, icon: 'school', color: 'blue', action: 'Đã duyệt 80%' },
        { label: 'CẦN NỖ LỰC', title: '03 Chi đoàn', sub: 'Nhóm cuối bảng', icon: 'trending_down', color: 'rose', alert: 'Cần nhắc nhở gấp' },
    ];

    const rankings = [
        { rank: 1, class: '23CT112', dept: 'Kỹ thuật PM', score: '98/100', trend: 'Lên hạng', trendColor: 'emerald', tags: ['100% Đoàn phí', 'Vô địch Bóng đá'], icon: '🏆' },
        { rank: 2, class: '21CT111', dept: 'Mạng MT', score: '95/100', trend: 'Ổn định', trendColor: 'slate', icon: '🥈' },
        { rank: 3, class: '24CT115', dept: 'Tân SV', score: '92/100', trend: 'Lên hạng', trendColor: 'emerald', icon: '🥉' },
    ];

    const warningClass = { rank: 20, class: '23CT113', dept: 'Hệ thống TT', score: '45/100', trend: 'Tụt hạng', trendColor: 'rose', note: 'Chưa nộp báo cáo tháng' };

    const students = [
        { id: 'SV1', name: 'Nguyễn Văn A', class: '23CT112', status: 'Đã duyệt', points: 98, rank: 'Top 5 Khoa' },
        { id: 'SV2', name: 'Trần Thị B', class: '22CT111', status: 'Chờ duyệt', points: 85, rank: 'Tiềm năng' },
    ];

    const categories = [
        { label: 'Tham gia Check-in (+2đ)', active: true },
        { label: 'Đặt câu hỏi hay (+1đ)', active: true },
        { label: 'Hỗ trợ BTC/Hậu cần (+2đ)', active: false },
        { label: 'Speaker/Diễn giả (+5đ)', active: false },
    ];

    const handleAction = (msg) => {
        setToast({ message: msg, type: 'success' });
    };

    return (
        <div className="p-4 md:p-8 bg-[#F8FAFC] min-h-screen space-y-10 font-sans">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shadow-sm">
                            <span className="material-symbols-outlined text-2xl font-bold">emoji_events</span>
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight italic uppercase">Bảng vàng Thi đua & Khen thưởng</h1>
                    </div>
                    <div className="flex items-center gap-4 ml-1">
                        <p className="flex items-center gap-2 text-[10px] font-black text-emerald-600 uppercase tracking-widest italic">
                            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span> Cập nhật theo thời gian thực (Live Updated)
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <select className="h-12 pl-6 pr-12 rounded-2xl bg-white border border-slate-100 shadow-sm text-xs font-black uppercase tracking-widest text-slate-600 outline-none focus:ring-2 ring-blue-500/10 appearance-none min-w-[180px]">
                            <option>Tháng 11/2025</option>
                            <option>Tháng 12/2025</option>
                        </select>
                        <span className="material-symbols-outlined absolute right-4 top-3.5 text-slate-300 pointer-events-none">expand_more</span>
                    </div>
                    <button className="h-12 w-12 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-slate-400 hover:text-rose-500 transition-colors relative">
                        <span className="material-symbols-outlined">notifications</span>
                        <span className="absolute top-3 right-3 h-2 w-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
                    </button>
                    <div className="h-12 w-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-lg overflow-hidden cursor-pointer group hover:scale-105 transition-transform">
                        <span className="material-symbols-outlined text-xl group-hover:rotate-12 transition-transform">settings_suggest</span>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {stats.map((s, i) => (
                    <div key={i} className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm group hover:shadow-2xl transition-all relative overflow-hidden flex flex-col justify-between h-56">
                        <div className="absolute -right-6 -top-6 h-32 w-32 bg-slate-50 rounded-full opacity-50 group-hover:scale-110 transition-transform"></div>
                        <div className="flex justify-between items-start relative z-10">
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 italic">{s.label}</p>
                                <h3 className="text-2xl font-black text-slate-900 italic tracking-tight uppercase leading-tight">{s.title}</h3>
                                <p className={`text-sm font-black mt-1 italic ${s.color === 'orange' ? 'text-amber-500' : s.color === 'blue' ? 'text-blue-600' : 'text-rose-600'}`}>{s.val || s.sub}</p>
                            </div>
                            <div className={`h-14 w-14 rounded-2xl bg-${s.color}-50 text-${s.color}-500 flex items-center justify-center shadow-sm relative overflow-hidden`}>
                                <span className="material-symbols-outlined text-3xl">{s.icon}</span>
                                {s.badge && <span className="absolute -top-1 -right-1 text-lg">{s.badge}</span>}
                                {s.color === 'blue' && <span className="absolute -bottom-1 -left-1 text-lg opacity-20 transform -rotate-12">🎓</span>}
                                {s.color === 'rose' && <span className="material-symbols-outlined absolute -bottom-2 -left-2 text-4xl opacity-10 transform -rotate-12">trending_down</span>}
                            </div>
                        </div>

                        <div className="relative z-10">
                            {s.progress ? (
                                <div className="space-y-3">
                                    <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100 shadow-inner">
                                        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${s.progress}%` }}></div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-xs text-blue-500">verified</span>
                                        <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{s.action}</p>
                                    </div>
                                </div>
                            ) : (
                                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm ${s.color === 'orange' ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'}`}>
                                    <span className="material-symbols-outlined text-sm">{s.color === 'orange' ? 'auto_graph' : 'warning'}</span>
                                    {s.trend || s.alert}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Ranking Table Section */}
            <div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-sm overflow-hidden">
                <div className="p-10 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="h-10 w-10 flex items-center justify-center text-orange-500 bg-orange-50 rounded-xl">
                            <span className="material-symbols-outlined">leaderboard</span>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 tracking-tight italic uppercase">Bảng xếp hạng Chi đoàn</h3>
                    </div>
                    <div className="flex bg-slate-50/50 border border-slate-100 p-1.5 rounded-2xl">
                        {['Tháng này', 'Học kỳ 1', 'Cả năm'].map(t => (
                            <button
                                key={t}
                                onClick={() => setActiveTimescale(t)}
                                className={`h-10 px-8 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${activeTimescale === t ? 'bg-white text-slate-900 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}>
                                {t}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-50 bg-slate-50/20">
                                <th className="py-6 px-10 text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] italic">HẠNG</th>
                                <th className="py-6 px-6 text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] italic">CHI ĐOÀN</th>
                                <th className="py-6 px-6 text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] italic">ĐIỂM SỐ</th>
                                <th className="py-6 px-6 text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] italic">XU HƯỚNG</th>
                                <th className="py-6 px-6 text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] italic">THÀNH TÍCH NỔI BẬT / GHI CHÚ</th>
                                <th className="py-6 px-10 text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] italic text-right">HÀNH ĐỘNG</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {rankings.map((r) => (
                                <tr key={r.rank} className={`group hover:bg-slate-50/50 transition-colors ${r.rank === 1 ? 'bg-amber-50/30' : r.rank === 3 ? 'bg-orange-50/20' : ''}`}>
                                    <td className="py-8 px-10">
                                        <div className="flex items-center gap-4">
                                            <span className="text-2xl">{r.icon}</span>
                                            {/* <span className="text-base font-black italic text-slate-900 tracking-tighter">{r.rank}</span> */}
                                        </div>
                                    </td>
                                    <td className="py-8 px-6">
                                        <div>
                                            <p className="text-base font-black text-slate-900 italic tracking-tight uppercase">{r.class}</p>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Kỹ thuật PM</p>
                                        </div>
                                    </td>
                                    <td className="py-8 px-6">
                                        <p className="text-base font-black text-slate-900 italic tracking-tighter">{r.score}</p>
                                    </td>
                                    <td className="py-8 px-6">
                                        <div className={`flex items-center gap-2 group-hover:scale-105 transition-transform origin-left`}>
                                            <span className={`material-symbols-outlined text-base font-black ${r.trendColor === 'emerald' ? 'text-emerald-500' : 'text-slate-400'}`}>{r.trendColor === 'emerald' ? 'north_east' : 'horizontal_rule'}</span>
                                            <p className={`text-[10px] font-black uppercase tracking-widest ${r.trendColor === 'emerald' ? 'text-emerald-600' : 'text-slate-500'}`}>{r.trend}</p>
                                        </div>
                                    </td>
                                    <td className="py-8 px-6">
                                        <div className="flex flex-wrap gap-2">
                                            {r.tags && r.tags.map(tag => (
                                                <span key={tag} className={`px-3 py-1.5 rounded-lg text-[9px] font-black tracking-widest uppercase flex items-center gap-2 ${tag.includes('Đoàn phí') ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-blue-50 text-blue-600 border border-blue-100'}`}>
                                                    <span className="material-symbols-outlined text-xs">{tag.includes('Đoàn phí') ? 'check_circle' : 'sports_soccer'}</span>
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="py-8 px-10 text-right">
                                        <button className="h-10 w-10 rounded-xl bg-white border border-slate-100 shadow-sm text-slate-400 hover:text-blue-600 hover:border-blue-200 transition-all">
                                            <span className="material-symbols-outlined">visibility</span>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {/* Warning Row */}
                            <tr className="bg-rose-50/30">
                                <td className="py-8 px-10">
                                    <span className="text-base font-black italic text-rose-500 tracking-tighter">{warningClass.rank}</span>
                                </td>
                                <td className="py-8 px-6">
                                    <div>
                                        <p className="text-base font-black text-slate-900 italic tracking-tight uppercase">{warningClass.class}</p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Hệ thống TT</p>
                                    </div>
                                </td>
                                <td className="py-8 px-6 font-black italic text-rose-600">{warningClass.score}</td>
                                <td className="py-8 px-6">
                                    <div className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-base font-black text-rose-500">south_east</span>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-rose-600">Tụt hạng</p>
                                    </div>
                                </td>
                                <td className="py-8 px-6">
                                    <div className="flex items-center gap-3 text-rose-600">
                                        <span className="material-symbols-outlined text-sm font-black">assignment_late</span>
                                        <p className="text-[10px] font-black uppercase tracking-widest">{warningClass.note}</p>
                                    </div>
                                </td>
                                <td className="py-8 px-10 text-right">
                                    <button onClick={() => handleAction('Đã gửi nhắc nhở tới Bí thư Chi đoàn 23CT113!')} className="h-10 px-5 rounded-xl bg-white border border-rose-100 text-rose-600 text-[10px] font-black uppercase tracking-widest shadow-sm hover:bg-rose-600 hover:text-white transition-all flex items-center gap-2 ml-auto">
                                        <span className="material-symbols-outlined text-sm font-black">notifications_active</span> Nhắc nhở
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Individual Assessment Section */}
            <div className="bg-white border border-slate-100 rounded-[2.5rem] p-10 shadow-sm space-y-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="h-10 w-10 flex items-center justify-center text-blue-600 bg-blue-50 rounded-xl">
                            <span className="material-symbols-outlined">stars</span>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 tracking-tight italic uppercase">Xét duyệt Danh hiệu Sinh viên 5 Tốt & Sao Tháng Giêng</h3>
                    </div>
                    <div className="flex items-center gap-4">
                        <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest italic">Tiến độ nộp hồ sơ:</p>
                        <div className="flex items-center gap-3">
                            <div className="h-2 w-48 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                                <div className="h-full bg-blue-600 rounded-full" style={{ width: '70%' }}></div>
                            </div>
                            <p className="text-sm font-black text-blue-600 italic uppercase">70%</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {students.map(st => (
                        <div key={st.id} className="p-8 rounded-[2.5rem] border border-slate-100 bg-slate-50/30 hover:bg-white hover:shadow-2xl transition-all group relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className={`material-symbols-outlined text-4xl text-${st.status === 'Đã duyệt' ? 'emerald' : 'orange'}-500/10 transform rotate-12`}>verified</span>
                            </div>
                            <div className="flex items-start gap-5">
                                <div className="relative h-14 w-14 rounded-full bg-blue-600 flex items-center justify-center text-white text-xl font-black italic shadow-inner shrink-0">
                                    {st.name[0]}
                                    {st.status === 'Đã duyệt' && <div className="absolute -bottom-1 -right-1 h-5 w-5 bg-white rounded-full flex items-center justify-center text-emerald-500 shadow-sm"><span className="material-symbols-outlined text-[10px] font-black">check_circle</span></div>}
                                </div>
                                <div className="space-y-1">
                                    <p className="text-base font-black text-slate-900 italic tracking-tight uppercase">{st.name}</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{st.class} - Hệ thống TT</p>
                                </div>
                            </div>
                            <div className="mt-8 pt-8 border-t border-slate-100 space-y-6">
                                <div className="flex items-center justify-between">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Điểm tích lũy</p>
                                    <span className={`px-2 py-0.5 rounded text-[9px] font-black tracking-widest italic uppercase ${st.rank === 'Top 5 Khoa' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'}`}>{st.rank}</span>
                                </div>
                                <p className="text-2xl font-black text-slate-900 italic tracking-tighter uppercase">{st.points} <span className="text-[10px] not-italic opacity-30">ĐIỂM</span></p>
                            </div>
                            <button onClick={() => { setSelectedStudent(st); setShowAssessmentModal(true); }} className="w-full h-12 rounded-2xl bg-white border border-slate-200 text-slate-900 text-[11px] font-black uppercase tracking-widest shadow-sm hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all mt-6 flex items-center justify-center gap-2">
                                <span className="material-symbols-outlined text-lg">assessment</span> Đánh giá đóng góp
                            </button>
                        </div>
                    ))}
                    {/* Placeholder for empty state or more students */}
                    <div className="p-8 rounded-[2.5rem] border-2 border-dashed border-slate-100 bg-slate-50/20 flex flex-col items-center justify-center text-slate-300 gap-4 group cursor-pointer hover:border-blue-100 hover:bg-white transition-all">
                        <div className="h-12 w-12 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center group-hover:bg-blue-50 group-hover:text-blue-600 transition-all">
                            <span className="material-symbols-outlined text-3xl">add</span>
                        </div>
                        <p className="text-[11px] font-black uppercase tracking-widest">Xem toàn bộ danh sách</p>
                    </div>
                </div>
            </div>

            {/* Assessment Modal */}
            {showAssessmentModal && (
                <div className="fixed inset-[-10px] z-[70] overflow-y-auto bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="min-h-full flex items-center justify-center p-4">
                        <div className="bg-white rounded-[2.5rem] w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-100">
                            <div className="px-8 pt-8 flex items-center justify-between">
                                <div className="flex items-center gap-3 text-blue-600">
                                    <span className="material-symbols-outlined font-black">rate_review</span>
                                    <h3 className="text-sm font-black italic tracking-tighter uppercase">Đánh giá Đóng góp Cá nhân</h3>
                                </div>
                                <button onClick={() => setShowAssessmentModal(false)} className="text-slate-300 hover:text-rose-500 transition-colors">
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>

                            <div className="p-8 space-y-8">
                                {/* Student Info Card */}
                                <div className="p-6 rounded-[2rem] bg-indigo-50/50 border border-indigo-100 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center text-white text-lg font-black italic shadow-inner">
                                            {selectedStudent?.name[0]}
                                        </div>
                                        <div>
                                            <p className="text-base font-black text-slate-900 italic tracking-tight uppercase">{selectedStudent?.name}</p>
                                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5 italic">Chi đoàn: {selectedStudent?.class}</p>
                                        </div>
                                    </div>
                                    <div className="px-3 py-1.5 bg-white rounded-xl shadow-sm border border-indigo-100 flex items-center gap-2">
                                        <span className="text-[10px] text-amber-500 italic">⭐</span>
                                        <p className="text-[10px] font-black text-slate-900 uppercase italic tracking-tighter">{selectedStudent?.rank} ({selectedStudent?.points} điểm)</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 italic leading-none">Chọn sự kiện</p>
                                    <div className="relative">
                                        <select className="w-full h-14 px-6 rounded-2xl border border-slate-100 bg-slate-50/50 text-xs font-black uppercase tracking-widest text-slate-600 outline-none focus:ring-2 ring-blue-500/10 appearance-none">
                                            <option>Hội thảo AI & Big Data</option>
                                            <option>Ngày hội IT Tech Day</option>
                                        </select>
                                        <span className="material-symbols-outlined absolute right-4 top-4 text-slate-300 pointer-events-none">expand_more</span>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 italic leading-none">Tiêu chí đánh giá</p>
                                    <div className="flex flex-wrap gap-2">
                                        {categories.map((c, i) => (
                                            <button key={i} className={`px-4 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all italic ${c.active ? 'bg-blue-600 text-white shadow-lg shadow-blue-100 ring-2 ring-blue-50' : 'bg-white border border-slate-200 text-slate-400 hover:border-blue-200'}`}>
                                                {c.active && <span className="material-symbols-outlined text-xs mr-2 font-black">check</span>}
                                                {c.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 italic leading-none">Ghi chú minh chứng (Bắt buộc)</p>
                                    <div className="relative">
                                        <textarea placeholder="Bạn A đã đặt câu hỏi rất hay về GenAI khiến diễn giả khen ngợi..." className="w-full h-32 p-6 rounded-[2rem] border border-slate-100 bg-slate-50/50 outline-none font-medium text-slate-700 italic placeholder:text-slate-300 resize-none shadow-inner"></textarea>
                                        <button className="absolute bottom-6 right-6 h-10 w-10 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-slate-400 hover:text-blue-600 transition-all">
                                            <span className="material-symbols-outlined">photo_camera</span>
                                        </button>
                                    </div>
                                </div>

                                <div className="p-6 rounded-[2rem] bg-blue-50/50 border border-blue-100 flex items-start gap-4">
                                    <div className="h-8 w-8 bg-white rounded-full flex items-center justify-center text-blue-600 shadow-sm shrink-0">
                                        <span className="material-symbols-outlined text-lg font-black">info</span>
                                    </div>
                                    <p className="text-[11px] font-bold text-blue-700 leading-relaxed italic">Sinh viên này đã được cộng điểm Nổi trội 3 lần trong tháng này.</p>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button onClick={() => setShowAssessmentModal(false)} className="flex-1 h-14 rounded-2xl bg-white border border-slate-200 text-slate-400 text-[11px] font-black uppercase tracking-widest hover:text-slate-900 transition-all">Hủy</button>
                                    <button onClick={() => { handleAction(`Đã duyệt đánh giá & cộng điểm cho ${selectedStudent?.name}!`); setShowAssessmentModal(false); }} className="flex-[2] h-14 rounded-2xl bg-blue-600 text-white text-[11px] font-black uppercase tracking-widest shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
                                        <span className="material-symbols-outlined text-xl">verified</span> Xác nhận & Cộng điểm
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <footer className="text-center pt-8 text-[11px] font-medium text-slate-400 italic">
                © 2025 Digital Youth Union System (DYUS). All rights reserved.<br />
                Module: Talent & Recognition Engine v4.0 - Khoa Công Nghệ Thông Tin
            </footer>

            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </div>
    );
};

export default SubAdminAwards;
