import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Toast from '../../../components/ui/Toast';
import Toggle from '../../../components/ui/Toggle';

const EventFeedbackAnalysis = () => {
    const { id } = useParams();
    const [toast, setToast] = useState(null);
    const [activeTab, setActiveTab] = useState('Phản hồi có hình ảnh 🖼️');
    const [privateMode, setPrivateMode] = useState(true);

    const stats = [
        { label: 'MỨC ĐỘ HÀI LÒNG', val: '4.8', total: '/ 5.0', sub: 'Dựa trên 350 lượt đánh giá', icon: 'star', color: 'orange' },
    ];

    const sentiment = [
        { label: 'Tích cực (Positive)', value: '85%', color: 'emerald', count: 300 },
        { label: 'Trung lập (Neutral)', value: '10%', color: 'orange', count: 35 },
        { label: 'Tiêu cực (Negative)', value: '5%', color: 'rose', count: 15 },
    ];

    const keywords = [
        { text: 'Diễn giả hay', color: 'emerald', size: 'text-3xl font-black italic' },
        { text: 'Quà tặng xịn', color: 'emerald', size: 'text-2xl font-bold' },
        { text: 'Kiến thức thực tế', color: 'emerald', size: 'text-xl font-bold' },
        { text: 'MC Vui tính', color: 'emerald', size: 'text-sm font-medium opacity-50' },
        { text: 'Đồ ăn ngon', color: 'emerald', size: 'text-xs font-medium opacity-30' },
        { text: 'Wifi yếu', color: 'rose', size: 'text-2xl font-black italic' },
        { text: 'Hội trường nóng', color: 'rose', size: 'text-xl font-bold italic' },
        { text: 'Check-in lâu', color: 'rose', size: 'text-sm font-bold' },
        { text: 'Âm thanh rè', color: 'rose', size: 'text-xs font-medium opacity-50' },
    ];

    const feedbacks = [
        {
            user: '[Ẩn danh] (Khóa 23)',
            isConfidential: true,
            avatar: '👤',
            time: '2 giờ trước',
            content: '"Đăng ký trên App rất nhanh nhưng khi đến hội trường Wifi lại không load được mã QR để điểm danh. Mong Khoa hỗ trợ thêm thiết bị phát."',
            tags: ['#HạTầng', '#Wifi'],
            type: 'Negative'
        }
    ];

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
                        <span className="text-blue-600 underline">Phân tích phản hồi</span>
                    </nav>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight italic uppercase">Phân tích Phản hồi & Ý kiến Sinh viên</h1>
                </div>
                <div className="flex items-center gap-4 bg-white p-3 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-3 pr-4 border-r border-slate-100">
                        <span className="material-symbols-outlined text-slate-400">lock</span>
                        <p className="text-[11px] font-black text-slate-900 uppercase tracking-widest leading-none">Private Mode</p>
                    </div>
                    <Toggle enabled={privateMode} setEnabled={setPrivateMode} />
                    <span className="text-[11px] font-black text-emerald-600 uppercase tracking-widest underline underline-offset-4 decoration-2">ON</span>
                </div>
            </div>

            {/* AI Insights Top Row */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Rating & Sentiment */}
                <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Overall Rating */}
                    <div className="bg-white border border-slate-100 rounded-[2.5rem] p-10 shadow-sm flex flex-col justify-between h-80 relative overflow-hidden group hover:shadow-xl transition-all">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">MỨC ĐỘ HÀI LÒNG</p>
                                    <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest mt-1">Dựa trên 350 lượt đánh giá</p>
                                </div>
                                <div className="h-10 w-10 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-xl">star</span>
                                </div>
                            </div>
                            <div className="flex items-baseline gap-3">
                                <p className="text-7xl font-black text-slate-900 tracking-tighter italic">4.8</p>
                                <p className="text-2xl font-bold text-slate-300 italic">/ 5.0</p>
                            </div>
                        </div>
                        <div className="h-3 w-full bg-slate-50 rounded-full overflow-hidden shadow-inner border border-slate-100">
                            <div className="h-full bg-orange-400 rounded-full" style={{ width: '96%' }}></div>
                        </div>
                    </div>

                    {/* Sentiment Breakdown */}
                    <div className="bg-white border border-slate-100 rounded-[2.5rem] p-10 shadow-sm h-80 flex flex-col justify-between hover:shadow-xl transition-all">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">PHÂN TÍCH CẢM XÚC</p>
                        <div className="flex items-center justify-between gap-6">
                            <div className="space-y-4 flex-1">
                                {sentiment.map(s => (
                                    <div key={s.label} className="flex items-center justify-between group">
                                        <div className="flex items-center gap-3">
                                            <div className={`h-2 w-2 rounded-full bg-${s.color}-500`}></div>
                                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{s.label}</p>
                                        </div>
                                        <p className="text-[11px] font-black text-slate-900 italic tracking-tighter">{s.value}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="relative h-40 w-40 flex items-center justify-center">
                                {/* Mock Donut Chart using SVG */}
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle cx="80" cy="80" r="70" stroke="#f1f5f9" strokeWidth="20" fill="transparent" />
                                    <circle cx="80" cy="80" r="70" stroke="#10b981" strokeWidth="20" fill="transparent" strokeDasharray="440" strokeDashoffset="66" />
                                    <circle cx="80" cy="80" r="70" stroke="#f97316" strokeWidth="20" fill="transparent" strokeDasharray="440" strokeDashoffset="400" />
                                </svg>
                                <div className="absolute flex flex-col items-center">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total</p>
                                    <p className="text-xl font-black text-slate-900 italic">350</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* AI Insight Sidebar */}
                <div className="lg:col-span-4 bg-blue-600 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-blue-200 relative overflow-hidden group flex flex-col h-full min-h-[500px]">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <span className="material-symbols-outlined text-9xl transform rotate-12">neurology</span>
                    </div>
                    <div className="space-y-10 relative z-10 flex flex-col h-full">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
                                <span className="material-symbols-outlined">psychology_alt</span>
                            </div>
                            <p className="text-xs font-black uppercase tracking-[0.2em] italic">AI STRATEGIC SUMMARY</p>
                        </div>
                        <p className="text-xl font-black italic tracking-tight leading-relaxed">
                            "Dựa trên 350 phản hồi, sinh viên cực kỳ hứng thú với các cuộc thi học thuật có giải thưởng <span className="text-emerald-400 underline decoration-2 decoration-emerald-400/30 underline-offset-8">(+45%)</span>. Tuy nhiên, cần cải thiện hạ tầng Wifi tại Hội trường A để nâng cao trải nghiệm thực tế."
                        </p>
                        <div className="mt-auto space-y-4">
                            <div className="p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/10">
                                <p className="text-[10px] font-black uppercase tracking-widest text-blue-200 mb-2 italic">Từ khóa nổi bật:</p>
                                <div className="flex flex-wrap gap-2">
                                    {['#HọcThuật', '#Wifi', '#CheckIn'].map(tag => <span key={tag} className="px-3 py-1 bg-white/20 rounded-lg text-[9px] font-black tracking-widest">{tag}</span>)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Word Cloud Section */}
            <div className="bg-white border border-slate-100 rounded-[2.5rem] p-12 shadow-sm relative overflow-hidden group hover:shadow-2xl transition-all">
                <div className="flex items-center justify-between mb-12">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] italic">Từ khóa nổi bật (WORD CLOUD)</p>
                    <button className="h-10 w-10 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors">
                        <span className="material-symbols-outlined text-2xl">download</span>
                    </button>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-10 py-10">
                    {keywords.map((k, i) => (
                        <span key={i} className={`cursor-pointer transition-all hover:scale-110 ${k.size} text-${k.color}-550 group-hover:drop-shadow-sm`} style={{ color: k.color === 'emerald' ? '#10b981' : '#f43f5e' }}>
                            {k.text}
                        </span>
                    ))}
                </div>
                <div className="flex items-center justify-center gap-10 mt-12 border-t border-slate-50 pt-8">
                    <div className="flex items-center gap-3">
                        <div className="h-2.5 w-2.5 rounded-full bg-emerald-500"></div>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Tích cực</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="h-2.5 w-2.5 rounded-full bg-rose-500"></div>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Tiêu cực</p>
                    </div>
                </div>
            </div>

            {/* Detailed Feedback List */}
            <div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-sm overflow-hidden min-h-[500px]">
                <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em] italic">Chi tiết Phản hồi (Feedback)</h3>
                    <div className="flex items-center gap-2 p-1.5 bg-slate-50/50 rounded-xl border border-slate-100">
                        {['Tất cả', 'Góp ý tiêu cực 🔴', 'Khen ngợi 🟢', 'Phản hồi có hình ảnh 🖼️'].map(f => (
                            <button
                                key={f}
                                onClick={() => setActiveTab(f)}
                                className={`h-10 px-6 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === f ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}>
                                {f.split(' ')[0]}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="p-10 space-y-8 pb-20">
                    {feedbacks.map((f, i) => (
                        <div key={i} className="p-10 rounded-[2.5rem] bg-rose-50/20 border border-rose-100 space-y-8 relative animate-in slide-in-from-bottom-6 duration-700">
                            <div className="flex items-start justify-between">
                                <div className="flex gap-6 items-start">
                                    <div className="h-14 w-14 rounded-full bg-white border border-rose-100 flex items-center justify-center text-slate-300 text-xl shadow-sm italic">👤</div>
                                    <div>
                                        <div className="flex items-center gap-3">
                                            <p className="text-base font-black text-slate-900 italic tracking-tight">{f.user}</p>
                                            {f.isConfidential && <span className="px-2 py-0.5 bg-slate-100 rounded text-[9px] font-black text-slate-400 uppercase tracking-widest italic">Confidential</span>}
                                        </div>
                                        <p className="text-[11px] font-bold text-slate-400 mt-1 italic tracking-widest">{f.time}</p>
                                    </div>
                                </div>
                                <button className="h-10 w-10 flex items-center justify-center text-rose-400 hover:bg-rose-500 hover:text-white rounded-xl transition-all"><span className="material-symbols-outlined">thumb_down</span></button>
                            </div>

                            <div className="pl-[80px] space-y-8">
                                <div className="p-8 bg-white/60 backdrop-blur-md rounded-[2rem] border border-rose-200/50 shadow-sm relative italic leading-relaxed text-slate-700 font-medium text-lg">
                                    <span className="text-3xl font-black text-rose-200 absolute -left-2 -top-2">"</span>
                                    {f.content.replace(/"/g, '')}
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-slate-400 text-sm">label</span>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-2">AI TAGS:</p>
                                    <div className="flex gap-2">
                                        {f.tags.map(t => <span key={t} className="px-3 py-1.5 bg-slate-100 rounded-lg text-[9px] font-black tracking-widest text-slate-600 hover:bg-white hover:shadow-sm transition-all cursor-pointer italic">{t}</span>)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <footer className="text-center pt-8 text-[11px] font-medium text-slate-400 italic">
                © 2025 Digital Youth Union System (DYUS). All rights reserved.<br />
                AI Module: Sentiment Engine v5.2 - Khoa Công Nghệ Thông Tin
            </footer>

            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </div>
    );
};

export default EventFeedbackAnalysis;
