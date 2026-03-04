import React, { useState } from 'react';
import Toast from '../../../components/ui/Toast';

const EventManualCheckin = () => {
    const [toast, setToast] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    const attendees = [
        { id: '23CT112-001', name: 'Nguyễn Văn An', class: '23CT112', time: '08:15', status: 'Checked-in' },
        { id: '23CT112-045', name: 'Trần Thị Bình', class: '23CT112', time: '--:--', status: 'Pending' },
        { id: '22CT111-012', name: 'Lê Hoàng Long', class: '22CT111', time: '08:20', status: 'Checked-in' },
    ];

    const handleCheckin = (id) => {
        setToast({ message: `Đã điểm danh thành công cho SV: ${id}`, type: 'success' });
    };

    return (
        <div className="p-4 md:p-8 bg-[#F8FAFC] min-h-screen space-y-8 font-sans">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <nav className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                        <span>Sự kiện Khoa</span>
                        <span>/</span>
                        <span className="text-blue-600 underline">Điểm danh thủ công</span>
                    </nav>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-3 italic">
                        <span className="material-symbols-outlined text-blue-600">how_to_reg</span>
                        Hội thảo AI & Big Data 2025
                    </h1>
                </div>
                <div className="flex items-center gap-3">
                    <div className="bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100 flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                        <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest leading-none">Live Check-in: 124 / 450</span>
                    </div>
                </div>
            </div>

            {/* Check-in Interface - Mockup Alignment */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left: Scan & Search */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm space-y-8">
                        <div className="space-y-4">
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest italic flex items-center gap-2">
                                <span className="material-symbols-outlined text-blue-600">qr_code_scanner</span> Quét mã sinh viên
                            </h3>
                            <div className="h-64 rounded-3xl bg-slate-900 flex flex-col items-center justify-center text-white space-y-4 relative overflow-hidden group border-4 border-slate-800">
                                <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <span className="material-symbols-outlined text-6xl animate-pulse">camera_alt</span>
                                <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-50">Camera is active</p>
                                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.8)] animate-scan"></div>
                            </div>
                        </div>
                        <div className="space-y-4 pt-4 border-t border-slate-50">
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest italic flex items-center gap-2">
                                <span className="material-symbols-outlined text-blue-600">search</span> Nhập mã số SV (MSSV)
                            </h3>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="23CT11xxx..."
                                    className="w-full h-14 pl-14 pr-4 rounded-2xl border-2 border-slate-100 bg-slate-50 outline-none focus:bg-white focus:border-blue-400 font-bold text-slate-900 shadow-inner"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <span className="material-symbols-outlined absolute left-4 top-4 text-slate-300">badge</span>
                                <button onClick={() => handleCheckin(searchQuery)} className="absolute right-3 top-3 h-8 px-4 rounded-lg bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-blue-600 transition-all">Submit</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Recent Attendees */}
                <div className="lg:col-span-8">
                    <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm h-full">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest italic flex items-center gap-2">
                                <span className="material-symbols-outlined text-blue-600">list_alt</span> Danh sách ghi nhận gần đây
                            </h3>
                            <button className="text-[11px] font-bold text-blue-600 hover:underline">Xem toàn bộ danh sách</button>
                        </div>
                        <div className="space-y-4">
                            {attendees.map((sv) => (
                                <div key={sv.id} className="p-5 rounded-2xl border border-slate-100 bg-slate-50/50 flex items-center justify-between group transition-all hover:bg-white hover:shadow-xl hover:scale-[1.01] hover:border-blue-100">
                                    <div className="flex items-center gap-5">
                                        <div className="h-12 w-12 rounded-full border-2 border-white shadow-sm overflow-hidden bg-slate-200 flex items-center justify-center font-bold text-slate-400">
                                            {sv.name.split(' ').pop().charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-900 uppercase italic tracking-tighter leading-none">{sv.name}</p>
                                            <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-widest">{sv.id} • Lớp {sv.class}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-8">
                                        <div className="text-right">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Time In</p>
                                            <p className="text-sm font-black text-slate-900 mt-1 italic leading-none">{sv.time}</p>
                                        </div>
                                        <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest italic ${sv.status === 'Checked-in' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-amber-50 text-amber-600 border border-amber-100'
                                            }`}>
                                            {sv.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            <style>{`
                @keyframes scan {
                    0% { top: 0%; opacity: 0; }
                    20% { opacity: 1; }
                    80% { opacity: 1; }
                    100% { top: 100%; opacity: 0; }
                }
                .animate-scan {
                    animation: scan 2.5s infinite linear;
                }
            `}</style>
        </div>
    );
};

export default EventManualCheckin;
