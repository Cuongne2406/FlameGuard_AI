import React from 'react';

const SubAdminAIAnalysis = () => {
    return (
        <div className="p-4 md:p-8 bg-[#F8FAFC] min-h-screen space-y-8 font-sans">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-sm">
                        <span className="material-symbols-outlined text-3xl">psychology</span>
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 tracking-tight italic uppercase">Trung tâm Tham mưu & Phân tích Dữ liệu Khoa CNTT</h1>
                        <p className="text-xs font-bold text-blue-600 mt-1 uppercase tracking-widest flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
                            AI đang phân tích dữ liệu từ 20 Chi đoàn và 1,500 sinh viên
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button className="h-10 px-4 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-500 flex items-center gap-2">
                        <span className="material-symbols-outlined text-xl">calendar_month</span> Tháng 11, 2025
                    </button>
                    <div className="h-10 w-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center relative cursor-pointer">
                        <span className="material-symbols-outlined text-slate-400">notifications</span>
                        <span className="absolute top-2 right-2.5 h-2 w-2 rounded-full bg-rose-500 border-2 border-white text-white flex items-center justify-center"></span>
                    </div>
                </div>
            </div>

            {/* Monitoring Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left: Class Monitoring */}
                <div className="lg:col-span-8 bg-white border border-slate-100 rounded-[2.5rem] p-10 shadow-sm space-y-8">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-3">
                            <span className="material-symbols-outlined text-blue-600">monitor_heart</span>
                            Giám sát Hiệu quả Hoạt động 20 Lớp
                        </h3>
                        <span className="px-3 py-1 bg-slate-50 text-slate-400 text-[10px] font-bold uppercase tracking-widest rounded-lg">Live Updated</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
                        {/* Top Tier Side */}
                        <div className="bg-emerald-50/30 rounded-[2rem] p-8 border border-emerald-50 space-y-6">
                            <h4 className="text-sm font-bold text-emerald-800 flex items-center gap-3 uppercase italic leading-none">
                                <span className="material-symbols-outlined">workspace_premium</span>
                                Nhóm Dẫn đầu (Top Tier)
                            </h4>
                            <div className="flex flex-wrap gap-3">
                                {['23CT112', '21CT111'].map(tag => (
                                    <span key={tag} className="px-4 py-2 bg-white border border-emerald-100 rounded-xl text-xs font-bold text-slate-700 shadow-sm">{tag}</span>
                                ))}
                                <span className="px-4 py-2 bg-white border border-emerald-100 rounded-xl text-xs font-bold text-slate-400 shadow-sm">+3 others</span>
                            </div>
                            <p className="text-[11px] font-bold text-emerald-600/70 italic leading-relaxed uppercase tracking-widest">Các lớp này hoàn thành 100% KPI tháng.</p>
                        </div>
                        {/* Needs Attention Side */}
                        <div className="space-y-4">
                            <h4 className="text-sm font-bold text-rose-600 flex items-center gap-3 uppercase italic leading-none">
                                <span className="material-symbols-outlined">warning</span>
                                Cảnh báo (Needs Attention)
                            </h4>
                            <div className="p-5 rounded-2xl bg-rose-50/50 border border-rose-100 space-y-4 relative overflow-hidden group">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <p className="text-sm font-bold text-slate-900">Lớp 23CT113</p>
                                        <p className="text-[10px] font-medium text-slate-400 leading-relaxed max-w-[180px]">Tỷ lệ tham gia sự kiện giảm mạnh tháng này.</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-rose-600 font-bold text-[10px] bg-rose-100 px-2 py-0.5 rounded leading-none italic">-30% Engagement</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2 bg-white/60 p-2 rounded-lg border border-rose-50">
                                    <span className="material-symbols-outlined text-indigo-500 text-sm">psychology</span>
                                    <p className="text-[9px] font-bold text-indigo-600 italic">AI Suggestion: Gặp Bí thư lớp nhắc nhở</p>
                                </div>
                            </div>
                            <div className="p-5 rounded-2xl bg-orange-50/50 border border-orange-100 flex justify-between items-center group">
                                <div className="space-y-1">
                                    <p className="text-sm font-bold text-slate-900 uppercase italic">Lớp 22CT111</p>
                                    <p className="text-[10px] font-medium text-slate-400">Còn 15 bạn chưa đóng BHYT. Hạn chót: 3 ngày.</p>
                                </div>
                                <button className="h-8 w-8 rounded-lg bg-orange-600 text-white flex items-center justify-center shadow-lg shadow-orange-100 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="material-symbols-outlined text-xl">send</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Interests & Recommendations */}
                <div className="lg:col-span-4 bg-white border border-slate-100 rounded-[2.5rem] p-10 shadow-sm space-y-8">
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-3 italic">
                        <span className="material-symbols-outlined text-indigo-600">query_stats</span>
                        Sinh viên IT đang quan tâm gì?
                    </h3>
                    <div className="h-64 bg-slate-50/50 rounded-3xl border border-slate-100 p-8 flex flex-col items-center justify-center relative overflow-hidden">
                        <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
                            <span className="text-2xl font-black text-blue-600 italic tracking-tighter hover:scale-110 transition-transform cursor-pointer">ReactJS</span>
                            <span className="text-4xl font-black text-slate-900 italic tracking-tighter hover:scale-110 transition-transform cursor-pointer">Generative AI</span>
                            <span className="text-lg font-bold text-slate-300 uppercase tracking-widest">Internship</span>
                            <span className="text-2xl font-black text-slate-700 italic tracking-tighter hover:scale-110 transition-transform cursor-pointer">DevOps</span>
                            <span className="text-sm font-bold text-slate-400">Soft Skills</span>
                        </div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-12 -translate-y-1/2 h-40 w-40 bg-blue-500/5 rounded-full blur-3xl"></div>
                    </div>
                    <div className="p-6 rounded-3xl bg-indigo-50/50 border border-indigo-100 space-y-4 relative overflow-hidden group">
                        <div className="flex items-center gap-3 mb-2">
                            <span className="material-symbols-outlined text-indigo-600 text-xl">temp_preferences_custom</span>
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-600 italic">AI Recommendation</h4>
                        </div>
                        <p className="text-[11px] font-medium text-slate-600 leading-relaxed italic">
                            Dựa trên xu hướng tìm kiếm, Khoa nên tổ chức Workshop:
                            <span className="block text-indigo-700 font-bold text-sm mt-3 uppercase tracking-tighter italic">"Ứng dụng AI trong Lập trình & Debugging"</span>
                        </p>
                        <button className="w-full h-11 bg-white border border-indigo-100 rounded-xl text-[10px] font-bold text-slate-900 uppercase tracking-widest shadow-sm hover:bg-indigo-600 hover:text-white transition-all">Lên kế hoạch cho tháng sau</button>
                    </div>
                </div>
            </div>

            {/* ROI Analysis Section */}
            <div className="bg-white border border-slate-100 rounded-[2.5rem] p-10 shadow-sm space-y-10">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-3">
                        <span className="material-symbols-outlined text-emerald-500">payments</span>
                        Hiệu quả Đầu tư Sự kiện (ROI Analysis)
                    </h3>
                    <button className="text-xs font-bold text-blue-600 underline underline-offset-4 decoration-2">Xem chi tiết báo cáo tài chính</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {/* High ROI */}
                    <div className="space-y-6">
                        <div className="p-3 bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase tracking-widest rounded-lg inline-block italic">High Efficiency</div>
                        <h4 className="text-xl font-bold text-slate-900 italic uppercase">Hội thao Khoa CNTT</h4>
                        <div className="h-1 rounded-full bg-slate-50"><div className="h-full bg-emerald-500 rounded-full" style={{ width: '90%' }}></div></div>
                        <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest italic pt-4">
                            <span>Chi phí / người:</span>
                            <span className="text-slate-900">20.000 VNĐ</span>
                        </div>
                    </div>
                    {/* Low ROI */}
                    <div className="space-y-6">
                        <div className="p-3 bg-rose-50 text-rose-600 text-[10px] font-bold uppercase tracking-widest rounded-lg inline-block italic">Low Efficiency</div>
                        <h4 className="text-xl font-bold text-slate-900 italic uppercase">Gala Chào Tân Sinh Viên</h4>
                        <div className="h-1 rounded-full bg-slate-50"><div className="h-full bg-rose-500 rounded-full" style={{ width: '40%' }}></div></div>
                        <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest italic pt-4">
                            <span>Chi phí / người:</span>
                            <span className="text-slate-900">200.000 VNĐ</span>
                        </div>
                    </div>
                    {/* AI Strategic Card */}
                    <div className="bg-blue-600 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 h-full w-40 bg-white/5 translate-x-12 -rotate-12 group-hover:translate-x-0 transition-transform duration-1000"></div>
                        <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-40 mb-6 italic flex items-center gap-3">
                            <span className="material-symbols-outlined text-xl">auto_awesome</span> AI STRATEGIC INSIGHT
                        </h4>
                        <p className="text-sm font-bold italic leading-relaxed opacity-90 max-w-xs mb-8">
                            "Để xuất cắt giảm ngân sách trang trí (Decoration) của các sự kiện nhỏ và chuyển sang <span className="text-amber-300 underline underline-offset-4 decoration-amber-300/50">Giải thưởng Hackathon</span>. Dữ liệu cho thấy sinh viên hứng thú hơn 45% với các cuộc thi học thuật có giải thưởng."
                        </p>
                        <button className="w-full h-12 bg-white/10 border border-white/20 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white hover:text-blue-600 transition-all shadow-xl">Áp dụng đề xuất này</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SubAdminAIAnalysis;
