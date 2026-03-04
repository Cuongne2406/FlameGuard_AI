import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Toast from '../../../components/ui/Toast';
import Toggle from '../../../components/ui/Toggle';

const SubAdminEvents = () => {
    const navigate = useNavigate();
    const [toast, setToast] = useState(null);
    const [activeTab, setActiveTab] = useState('Tất cả');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [createStep, setCreateStep] = useState(1);
    const [showManualCheckinModal, setShowManualCheckinModal] = useState(false);

    const stats = [
        { label: 'Tổng sự kiện năm', val: '12', sub: '80% Target', icon: 'event_note', color: 'blue' },
        { label: 'Lượt tham gia', val: '3,500', sub: 'Avg 300 SV/event', icon: 'groups', color: 'blue' },
        { label: 'Kinh phí đã chi', val: '25.000.000', unit: 'VNĐ', sub: '', icon: 'payments', color: 'orange' },
    ];

    const events = [
        {
            id: 'ITTD2026',
            title: 'Ngày hội Công nghệ - IT Tech Day 2026',
            time: '08:00 - 17:00, Hôm nay',
            location: 'Hội trường A',
            type: 'Sự kiện Cấp Khoa',
            status: 'Đang diễn ra (Live)',
            statusColor: 'blue',
            progress: 90,
            attendees: '450/500',
            actions: [
                { label: 'Điểm danh thủ công', icon: 'person_search', primary: true, action: () => setShowManualCheckinModal(true) },
                { label: 'Xem báo cáo', icon: 'analytics', primary: false, action: () => navigate('/admin_sub/events/ITTD2026/live') }
            ]
        },
        {
            id: 'CW5',
            title: 'Cuộc thi Lập trình - Code War Season 5',
            time: '20/11/2026',
            location: 'Đội nhóm (3 người)',
            type: 'Học thuật',
            status: 'Đang mở đăng ký',
            statusColor: 'orange',
            count: 'Đã có 120 Đội đăng ký',
            actions: [
                { label: 'Duyệt danh sách thi', icon: 'fact_check', primary: false, action: () => navigate('/admin_sub/events/CW5/registrations') },
                { label: 'Chỉnh sửa', icon: 'edit', primary: false, action: () => handleAction('Mở trình chỉnh sửa sự kiện...') }
            ]
        },
        {
            id: 'SOCCER2025',
            title: 'Giải Bóng đá Nam Khoa CNTT 2025',
            time: '-',
            location: '',
            type: 'Văn thể mỹ',
            status: 'Đã hoàn thành',
            statusColor: 'emerald',
            actions: [
                { label: 'Xem tổng kết', icon: 'summarize', primary: false, action: () => handleAction('Đang tải báo cáo tổng kết...') }
            ]
        }
    ];

    const handleAction = (msg) => {
        setToast({ message: msg, type: 'success' });
    };

    return (
        <div className="p-4 md:p-8 bg-[#F8FAFC] min-h-screen space-y-8 font-sans">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <nav className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                        <span className="material-symbols-outlined text-[14px]">home</span>
                        <span>Tổng quan</span>
                        <span>/</span>
                        <span className="text-blue-600 underline">Sự kiện Khoa</span>
                    </nav>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight italic">Quản lý Sự kiện & Phong trào Khoa CNTT</h1>
                </div>
                <div className="flex items-center gap-3">
                    <select className="h-10 px-4 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-600 outline-none">
                        <option>Năm học 2025-2026</option>
                    </select>
                    <button onClick={() => { setShowCreateModal(true); setCreateStep(1); }} className="h-12 px-6 rounded-xl bg-blue-600 text-white text-[11px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all">
                        <span className="material-symbols-outlined text-lg font-bold">add</span> Tạo Sự kiện Mới
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {stats.map((s, i) => (
                    <div key={i} className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm flex flex-col justify-between h-44 relative group overflow-hidden hover:shadow-xl transition-all">
                        <div className="flex justify-between items-start">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">{s.label}</p>
                            <div className={`h-12 w-12 rounded-2xl bg-${s.color}-50 text-${s.color}-600 flex items-center justify-center shrink-0 overflow-hidden`}>
                                <span className="material-symbols-outlined text-2xl">{s.icon}</span>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-baseline gap-2">
                                <p className="text-4xl font-bold text-slate-900 tracking-tighter italic">{s.val}</p>
                                {s.unit && <span className="text-xs font-bold text-slate-400 uppercase">{s.unit}</span>}
                            </div>
                            {s.sub && (
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-bold uppercase tracking-widest">
                                    <span className="material-symbols-outlined text-xs">trending_up</span> {s.sub}
                                </div>
                            )}
                            {s.unit && (
                                <div className="h-1 w-full bg-slate-50 rounded-full overflow-hidden">
                                    <div className="h-full bg-orange-500 rounded-full" style={{ width: '65%' }}></div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Filter & List */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex bg-white border border-slate-100 p-1.5 rounded-2xl shadow-sm">
                        {['Tất cả', 'Đang diễn ra (Live)', 'Sắp tới', 'Đã kết thúc'].map(t => (
                            <button
                                key={t}
                                onClick={() => setActiveTab(t)}
                                className={`h-10 px-6 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all ${activeTab === t ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'text-slate-400 hover:text-slate-600'}`}>
                                {t}
                            </button>
                        ))}
                    </div>
                    <div className="flex items-center gap-3">
                        <select className="h-11 px-4 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-500 outline-none min-w-[180px]">
                            <option>Loại hình: Tất cả</option>
                        </select>
                    </div>
                </div>

                <div className="space-y-8 pb-10">
                    {events.map((ev) => (
                        <div key={ev.id} className="bg-white border border-slate-100 rounded-[2.5rem] p-10 shadow-sm relative group hover:shadow-2xl transition-all border-l-8 overflow-hidden" style={{ borderLeftColor: ev.statusColor === 'blue' ? '#2563eb' : ev.statusColor === 'orange' ? '#f97316' : '#10b981' }}>
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10">
                                <div className="flex-1 space-y-6">
                                    <div className="flex items-center gap-4">
                                        <span className={`px-4 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 ${ev.statusColor === 'blue' ? 'bg-blue-50 text-blue-600' : ev.statusColor === 'orange' ? 'bg-orange-50 text-orange-600' : 'bg-emerald-50 text-emerald-600'}`}>
                                            <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse"></span>
                                            {ev.status}
                                        </span>
                                        <span className="px-4 py-1.5 bg-slate-50 text-slate-400 rounded-xl text-[10px] font-bold uppercase tracking-widest border border-slate-100">
                                            {ev.type}
                                        </span>
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-900 italic tracking-tight uppercase leading-none">{ev.title}</h3>
                                    <div className="flex flex-wrap items-center gap-8">
                                        <div className="flex items-center gap-3 text-slate-400">
                                            <span className="material-symbols-outlined text-xl">schedule</span>
                                            <p className="text-sm font-bold tracking-tight text-slate-600">{ev.time}</p>
                                        </div>
                                        {ev.location && (
                                            <div className="flex items-center gap-3 text-slate-400">
                                                <span className="material-symbols-outlined text-xl">location_on</span>
                                                <p className="text-sm font-bold tracking-tight text-slate-600">{ev.location}</p>
                                            </div>
                                        )}
                                        {ev.attendees && (
                                            <div className="flex items-center gap-3 text-slate-400">
                                                <span className="material-symbols-outlined text-xl">groups</span>
                                                <p className="text-sm font-bold tracking-tight text-slate-600">{ev.attendees} tham gia</p>
                                            </div>
                                        )}
                                    </div>

                                    {ev.progress && (
                                        <div className="max-w-xl p-6 rounded-2xl bg-slate-50/50 border border-slate-50">
                                            <div className="flex justify-between items-end mb-4">
                                                <p className="text-[11px] font-black text-slate-900 uppercase italic tracking-widest">Check-in Realtime</p>
                                                <p className="text-sm font-black text-blue-600 italic uppercase">{ev.attendees} ({ev.progress}%)</p>
                                            </div>
                                            <div className="h-2 w-full bg-white rounded-full overflow-hidden shadow-inner border border-slate-100">
                                                <div className="h-full bg-blue-600 rounded-full transition-all duration-1000" style={{ width: `${ev.progress}%` }}></div>
                                            </div>
                                            <p className="text-[9px] font-bold text-slate-400 uppercase mt-2 tracking-widest flex items-center gap-2">
                                                <span className="material-symbols-outlined text-xs">sync</span> Hệ thống đang ghi nhận check-in qua QR Code...
                                            </p>
                                        </div>
                                    )}

                                    {ev.count && (
                                        <div className="flex items-center gap-3 text-orange-600">
                                            <span className="material-symbols-outlined text-lg">info</span>
                                            <p className="text-sm font-black italic tracking-tight">Đã có <span className="underline decoration-2 underline-offset-4">{ev.count.split(' ')[2]}</span> Đội đăng ký</p>
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-col gap-3 min-w-[240px]">
                                    {ev.actions.map((act, i) => (
                                        <button
                                            key={i}
                                            onClick={act.action}
                                            className={`h-12 w-full px-8 rounded-2xl flex items-center justify-center gap-3 text-[11px] font-black uppercase tracking-[0.1em] transition-all shadow-sm ${act.primary ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-100' : 'bg-white border border-slate-200 text-slate-900 hover:bg-slate-50'}`}>
                                            <span className="material-symbols-outlined text-xl">{act.icon}</span>
                                            {act.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 5-Step Create Event Modal */}
            {showCreateModal && (
                <div className="fixed inset-[-10px] z-[70] overflow-y-auto bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="min-h-full flex items-center justify-center p-4">
                        <div className="bg-white rounded-[2.5rem] w-full max-w-4xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-100 flex flex-col max-h-[90vh]">
                            <div className="px-10 py-8 border-b border-slate-50 flex items-center justify-between">
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 tracking-tight italic uppercase">Tạo Sự kiện Mới - Năm học 2025-2026</h3>
                                </div>
                                <button onClick={() => setShowCreateModal(false)} className="h-10 w-10 flex items-center justify-center text-slate-300 hover:text-rose-500 transition-colors">
                                    <span className="material-symbols-outlined text-2xl">close</span>
                                </button>
                            </div>

                            {/* Stepper */}
                            <div className="p-8 pb-0">
                                <div className="flex items-center justify-between max-w-3xl mx-auto relative mb-12">
                                    <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -translate-y-1/2 z-0"></div>
                                    {[1, 2, 3, 4, 5].map(s => (
                                        <div key={s} className="relative z-10 flex flex-col items-center gap-3">
                                            <div className={`h-10 w-10 rounded-full flex items-center justify-center text-xs font-black transition-all ${createStep >= s ? 'bg-blue-600 text-white ring-4 ring-blue-50' : createStep > s ? 'bg-emerald-500 text-white' : 'bg-white border-2 border-slate-100 text-slate-300'}`}>
                                                {createStep > s ? <span className="material-symbols-outlined text-sm">check</span> : s}
                                            </div>
                                            <p className={`text-[9px] font-black uppercase tracking-widest absolute -bottom-8 text-nowrap text-center w-32 ${createStep >= s ? 'text-blue-600' : 'text-slate-300'}`}>
                                                {s === 1 ? 'Thông tin & Địa điểm' : s === 2 ? 'Hình thức tham gia' : s === 3 ? 'Kinh phí & Tài trợ' : s === 4 ? 'Cấu hình Công nghệ' : 'Xác nhận'}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-10 pt-4">
                                {createStep === 1 && (
                                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in slide-in-from-right-4 duration-500">
                                        <div className="lg:col-span-12">
                                            <h4 className="text-lg font-bold text-slate-900 italic tracking-tight mb-6">1. Thông tin chung & Địa điểm</h4>
                                        </div>
                                        <div className="lg:col-span-7 space-y-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tên sự kiện <span className="text-rose-500 font-bold">*</span></label>
                                                <input type="text" placeholder="Cuộc thi Lập trình Code War 2026" className="w-full h-12 px-6 rounded-xl border border-slate-200 outline-none focus:border-blue-500 font-bold text-slate-700 shadow-sm" />
                                            </div>
                                            <div className="grid grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phân loại <span className="text-rose-500 font-bold">*</span></label>
                                                    <select className="w-full h-12 px-6 rounded-xl border border-slate-200 outline-none focus:border-blue-500 font-bold text-slate-700 bg-white">
                                                        <option>• Học thuật</option>
                                                        <option>• Văn thể mỹ</option>
                                                    </select>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Thời gian <span className="text-rose-500 font-bold">*</span></label>
                                                    <div className="relative">
                                                        <input type="text" placeholder="20/11/2026 - 22/11/2026" className="w-full h-12 pl-12 pr-6 rounded-xl border border-slate-200 outline-none font-bold text-slate-700 bg-white" />
                                                        <span className="material-symbols-outlined absolute left-4 top-3 text-slate-300">calendar_today</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Địa điểm (Room Booking) <span className="text-rose-500 font-bold">*</span></label>
                                                <div className="flex items-center gap-3">
                                                    <div className="relative flex-1">
                                                        <input type="text" placeholder="Hội trường A (Sức chứa 500)" className="w-full h-12 pl-12 pr-6 rounded-xl border border-slate-200 outline-none font-bold text-slate-700 bg-white" />
                                                        <span className="material-symbols-outlined absolute left-4 top-3 text-slate-300">location_on</span>
                                                    </div>
                                                    <span className="px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-1 border border-emerald-100">
                                                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span> Trống lịch
                                                    </span>
                                                </div>
                                                <p className="text-[9px] font-bold text-slate-400 italic ml-1">Hệ thống tự động kiểm tra lịch phòng dựa trên thời gian bạn chọn.</p>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mô tả ngắn</label>
                                                <textarea placeholder="Mô tả sơ lược về mục đích và ý nghĩa sự kiện..." className="w-full h-32 p-6 rounded-2xl border border-slate-200 outline-none focus:border-blue-500 font-medium text-slate-700 resize-none"></textarea>
                                            </div>
                                        </div>
                                        <div className="lg:col-span-5 space-y-8">
                                            <div className="space-y-4">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Ảnh bìa sự kiện (Banner)</label>
                                                <div className="h-56 rounded-[2.5rem] border-2 border-dashed border-slate-100 bg-slate-50/50 flex flex-col items-center justify-center p-8 text-center group hover:border-blue-300 hover:bg-white transition-all cursor-pointer">
                                                    <div className="h-12 w-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 transition-transform">
                                                        <span className="material-symbols-outlined">cloud_upload</span>
                                                    </div>
                                                    <p className="text-sm font-black italic text-slate-900 tracking-tight">Click để tải ảnh lên</p>
                                                    <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-widest">PNG, JPG tối đa 5MB</p>
                                                    <p className="text-[9px] font-medium text-slate-300 mt-1 uppercase tracking-widest italic">Kích thước chuẩn 1920×1080 (16:9)</p>
                                                </div>
                                            </div>
                                            <div className="p-8 rounded-[2rem] bg-blue-50/50 border border-blue-100 relative overflow-hidden group">
                                                <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-8xl text-blue-600/5 group-hover:scale-125 transition-transform">lightbulb</span>
                                                <h5 className="flex items-center gap-2 text-blue-600 text-xs font-black uppercase tracking-widest mb-4">
                                                    <span className="material-symbols-outlined text-lg">tips_and_updates</span> Mẹo tạo sự kiện
                                                </h5>
                                                <ul className="space-y-3 relative z-10">
                                                    {['Đặt tên ngắn gọn, dễ nhớ.', 'Chọn ảnh bìa chất lượng cao để thu hút sinh viên.', 'Kiểm tra kỹ thời gian để tránh trùng lịch thi.'].map((tip, i) => (
                                                        <li key={i} className="text-[10px] font-bold text-slate-600 flex items-start gap-3">
                                                            <span className="h-1.5 w-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0"></span> {tip}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {createStep === 2 && (
                                    <div className="space-y-10 animate-in slide-in-from-right-4 duration-500">
                                        <div>
                                            <h4 className="flex items-center gap-3 text-lg font-bold text-slate-900 italic tracking-tight mb-6">
                                                <span className="material-symbols-outlined text-blue-600">groups</span> Hình thức tham gia
                                            </h4>
                                            <div className="grid grid-cols-2 gap-6">
                                                <div className="p-6 rounded-[2rem] border-2 border-slate-100 bg-slate-50/30 flex flex-col gap-4 cursor-pointer hover:border-blue-200 transition-all">
                                                    <div className="h-10 w-10 rounded-full border-2 border-slate-200"></div>
                                                    <div>
                                                        <p className="font-black text-slate-900 italic">Cá nhân</p>
                                                        <p className="text-[10px] font-medium text-slate-400 mt-1 tracking-tight">Sinh viên đăng ký và tham gia độc lập</p>
                                                    </div>
                                                </div>
                                                <div className="p-6 rounded-[2rem] border-2 border-blue-600 bg-blue-50/20 flex flex-col gap-4 relative overflow-hidden">
                                                    <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white"><span className="material-symbols-outlined text-sm">check</span></div>
                                                    <div>
                                                        <p className="font-black text-blue-600 italic">Đội nhóm</p>
                                                        <p className="text-[10px] font-medium text-blue-400 mt-1 tracking-tight">Đăng ký theo nhóm, yêu cầu trưởng nhóm</p>
                                                    </div>
                                                    <span className="material-symbols-outlined absolute -right-2 -top-2 text-4xl text-blue-600/10">verified</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-8 rounded-[2.5rem] bg-slate-50/50 border border-slate-100 flex flex-col gap-8">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic leading-none">Cấu hình đội thi</p>
                                            <div className="grid grid-cols-2 gap-10">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Số lượng tối thiểu (Min)</label>
                                                    <div className="relative">
                                                        <input type="number" defaultValue={3} className="h-11 w-full border border-slate-200 rounded-xl px-4 font-black italic" />
                                                        <span className="absolute right-4 top-3 text-[10px] font-bold text-slate-300 uppercase italic">Thành viên</span>
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Số lượng tối đa (Max)</label>
                                                    <div className="relative">
                                                        <input type="number" defaultValue={5} className="h-11 w-full border border-slate-200 rounded-xl px-4 font-black italic" />
                                                        <span className="absolute right-4 top-3 text-[10px] font-bold text-slate-300 uppercase italic">Thành viên</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <p className="text-[10px] font-bold text-orange-600 italic flex items-center gap-2">
                                                <span className="material-symbols-outlined text-sm">info</span> Hệ thống sẽ tự động đóng form đăng ký đội nếu số lượng thành viên không hợp lệ.
                                            </p>
                                        </div>

                                        <div>
                                            <h4 className="flex items-center gap-3 text-lg font-bold text-slate-900 italic tracking-tight mb-6">
                                                <span className="material-symbols-outlined text-blue-600">person_pin</span> Đối tượng tham gia
                                            </h4>
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-4 p-5 rounded-2xl bg-white border border-blue-100 shadow-sm relative overflow-hidden">
                                                    <input type="checkbox" defaultChecked className="h-6 w-6 rounded border-blue-600 text-blue-600" />
                                                    <div>
                                                        <p className="text-sm font-black text-slate-900 italic tracking-tight">Sinh viên Khoa CNTT (Hệ thống tự động xác thực)</p>
                                                        <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mt-0.5 leading-none">Chỉ cho phép tài khoản có mã sinh viên thuộc khoa CNTT đăng nhập và đăng ký.</p>
                                                    </div>
                                                    <span className="material-symbols-outlined absolute -right-2 top-0 text-3xl text-blue-600/5">shield_person</span>
                                                </div>
                                                <div className="flex items-center gap-4 p-5 rounded-2xl bg-white border border-slate-100 hover:border-blue-200 transition-all">
                                                    <input type="checkbox" className="h-6 w-6 rounded border-slate-200 text-blue-600" />
                                                    <div>
                                                        <p className="text-sm font-black text-slate-900 italic tracking-tight">Sinh viên ngoài khoa / Khách mời</p>
                                                        <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mt-0.5 leading-none">Cho phép đăng ký không cần tài khoản sinh viên (Form mở rộng).</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            <div className="flex items-center justify-between">
                                                <h4 className="flex items-center gap-3 text-lg font-bold text-slate-900 italic tracking-tight">
                                                    <span className="material-symbols-outlined text-blue-600">contract_edit</span> Thông tin bổ sung
                                                </h4>
                                                <div className="flex items-center gap-3">
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Thu thập thêm thông tin</p>
                                                    <Toggle enabled={true} />
                                                </div>
                                            </div>
                                            <div className="p-10 rounded-[2.5rem] bg-slate-50/50 border border-slate-100 space-y-6">
                                                <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] italic leading-none">Trường thông tin cần thu thập</p>
                                                <div className="flex flex-wrap gap-3">
                                                    {['Size áo', 'Link Github'].map(tag => (
                                                        <div key={tag} className="px-6 py-2 bg-white rounded-xl border border-slate-200 shadow-sm flex items-center gap-3 group hover:border-rose-300 transition-all cursor-pointer">
                                                            <span className="text-[11px] font-black italic text-slate-700 tracking-tight">{tag}</span>
                                                            <span className="material-symbols-outlined text-slate-300 text-sm group-hover:text-rose-500">close</span>
                                                        </div>
                                                    ))}
                                                    <button className="h-10 px-6 rounded-xl border-2 border-dashed border-slate-200 text-slate-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:border-blue-400 hover:text-blue-600 transition-all">
                                                        <span className="material-symbols-outlined text-lg">add</span> Thêm
                                                    </button>
                                                </div>
                                                <input type="text" placeholder="Nhập tên trường thông tin (VD: Số điện thoại, Email phụ...)" className="w-full h-14 px-8 rounded-2xl border border-slate-200 outline-none font-medium text-slate-600 italic shadow-inner" />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {createStep === 3 && (
                                    <div className="space-y-12 animate-in slide-in-from-right-4 duration-500 pb-10">
                                        <div className="space-y-8">
                                            <h4 className="flex items-center gap-3 text-lg font-bold text-slate-900 italic tracking-tight">
                                                <span className="material-symbols-outlined text-blue-600">payments</span> Dự trù Kinh phí
                                            </h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tổng kinh phí dự kiến</label>
                                                    <div className="relative">
                                                        <input type="text" placeholder="20.000.000" className="h-14 w-full border border-slate-200 rounded-2xl px-6 font-black italic tracking-tight text-lg text-slate-900 shadow-sm focus:border-blue-500 outline-none" />
                                                        <span className="absolute right-6 top-4 font-bold text-slate-300 text-xs italic">VNĐ</span>
                                                    </div>
                                                </div>
                                                <div className="space-y-3">
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nguồn kinh phí</label>
                                                    <div className="flex flex-wrap gap-6 pt-2">
                                                        {['Quỹ Khoa', 'Quỹ Đoàn', 'Tài trợ'].map((n) => (
                                                            <div key={n} className="flex items-center gap-3 cursor-pointer group">
                                                                <input type="checkbox" defaultChecked={n === 'Quỹ Khoa'} className="h-5 w-5 rounded border-slate-200 text-blue-600 focus:ring-blue-500" />
                                                                <span className="text-[11px] font-black uppercase italic text-slate-500 group-hover:text-slate-900 transition-colors tracking-widest">{n}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-8">
                                            <h4 className="flex items-center gap-3 text-lg font-bold text-slate-900 italic tracking-tight">
                                                <span className="material-symbols-outlined text-blue-600">assignment_ind</span> Phân công Đơn vị
                                            </h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Đơn vị tổ chức (Host)</label>
                                                    <div className="relative">
                                                        <select className="h-14 w-full border border-slate-200 rounded-2xl px-6 font-black italic text-slate-600 bg-white outline-none focus:border-blue-500 transition-all appearance-none">
                                                            <option>CLB Lập trình & AI</option>
                                                            <option>BCH Đoàn Khoa</option>
                                                        </select>
                                                        <span className="material-symbols-outlined absolute right-4 top-4 text-slate-300">expand_more</span>
                                                    </div>
                                                    <p className="text-[9px] font-bold text-slate-400 italic ml-1 mt-2">Đơn vị này sẽ chịu trách nhiệm chính về nội dung và vận hành.</p>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Trưởng Ban Tổ Chức</label>
                                                    <div className="h-14 w-full bg-white border border-slate-200 rounded-2xl px-6 flex items-center justify-between group hover:border-blue-100 transition-all">
                                                        <div className="flex items-center gap-3">
                                                            <span className="material-symbols-outlined text-blue-600 text-lg">person</span>
                                                            <p className="text-sm font-bold text-slate-900 italic">Trần Văn Code (Chủ nhiệm CLB)</p>
                                                        </div>
                                                        <span className="material-symbols-outlined text-slate-300 text-sm group-hover:text-blue-600 cursor-pointer">edit</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-8 rounded-[2rem] bg-blue-50/30 border border-blue-100 flex items-start gap-4">
                                            <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center text-blue-600 shadow-sm shrink-0">
                                                <span className="material-symbols-outlined text-xl">info</span>
                                            </div>
                                            <p className="text-sm font-bold text-blue-700 leading-relaxed italic">Hệ thống sẽ gửi thông báo giao nhiệm vụ cho đơn vị chủ trì sau khi công bố sự kiện. Vui lòng đảm bảo thông tin liên hệ của Trưởng BTC là chính xác.</p>
                                        </div>
                                    </div>
                                )}

                                {createStep === 4 && (
                                    <div className="space-y-12 animate-in slide-in-from-right-4 duration-500 pb-10">
                                        <div className="space-y-8">
                                            <h4 className="flex items-center gap-3 text-lg font-bold text-slate-900 italic tracking-tight">
                                                <span className="material-symbols-outlined text-blue-600">hub</span> Cấu hình Công nghệ
                                            </h4>
                                            <div className="p-10 rounded-[2.5rem] bg-slate-50/50 border border-slate-100 space-y-10 relative overflow-hidden">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center text-blue-600 shadow-sm"><span className="material-symbols-outlined text-2xl">qr_code_2</span></div>
                                                    <div>
                                                        <p className="text-base font-black text-slate-900 italic tracking-tight uppercase leading-none">Smart Check-in</p>
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Cấu hình hệ thống điểm danh tự động và kiểm soát ra vào</p>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 gap-10">
                                                    <div className="p-6 rounded-2xl bg-white border border-blue-100 shadow-sm flex items-center justify-between group hover:shadow-lg transition-all">
                                                        <div className="flex items-center gap-4">
                                                            <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center"><span className="material-symbols-outlined text-xl">update</span></div>
                                                            <div>
                                                                <p className="text-xs font-black text-slate-900 italic uppercase">QR Code động (Dynamic QR)</p>
                                                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight mt-0.5 leading-tight">Mã QR thay đổi mỗi <span className="text-blue-600">15 giây</span> để chống gian lận chụp ảnh màn hình.</p>
                                                            </div>
                                                        </div>
                                                        <input type="checkbox" defaultChecked className="h-6 w-6 rounded border-blue-600 text-blue-600" />
                                                    </div>
                                                    <div className="p-6 rounded-2xl bg-white border border-blue-100 shadow-sm flex items-center justify-between group hover:shadow-lg transition-all">
                                                        <div className="flex items-center gap-4">
                                                            <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center"><span className="material-symbols-outlined text-xl">location_on</span></div>
                                                            <div>
                                                                <p className="text-xs font-black text-slate-900 italic uppercase">Geofencing (Giới hạn vị trí)</p>
                                                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight mt-0.5 leading-tight">Chỉ cho phép check-in trong bán kính <span className="text-blue-600">100m</span> quanh <span className="text-slate-900">Hội trường A</span>.</p>
                                                            </div>
                                                        </div>
                                                        <input type="checkbox" defaultChecked className="h-6 w-6 rounded border-blue-600 text-blue-600" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-8">
                                            <div className="flex items-center justify-between">
                                                <h4 className="flex items-center gap-3 text-lg font-bold text-slate-900 italic tracking-tight">
                                                    <span className="material-symbols-outlined text-blue-600">verified</span> Chứng nhận điện tử (E-Certificate)
                                                </h4>
                                                <Toggle enabled={true} />
                                            </div>
                                            <div className="p-10 rounded-[2.5rem] bg-slate-50/50 border border-slate-100 space-y-10 relative overflow-hidden">
                                                <div className="flex items-center gap-6">
                                                    <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center text-orange-500 shadow-sm"><span className="material-symbols-outlined text-2xl">workspace_premium</span></div>
                                                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] italic">Tự động cấp chứng nhận blockchain sau khi hoàn thành sự kiện</p>
                                                </div>

                                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                                                    <div className="lg:col-span-12">
                                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">CHỌN MẪU CHỨNG NHẬN</p>
                                                    </div>
                                                    <div className="lg:col-span-5 grid grid-cols-2 gap-4">
                                                        {[
                                                            { label: 'Học thuật - Blue Theme', color: 'blue', img: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=200&q=80', active: true },
                                                            { label: 'Văn thể - Red Theme', color: 'rose', img: 'https://images.unsplash.com/photo-1557683311-eac922347aa1?w=200&q=80' },
                                                            { label: 'Tình nguyện - Green Theme', color: 'emerald', img: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=200&q=80' },
                                                            { label: 'Tải lên mẫu', icon: 'cloud_upload' }
                                                        ].map((tmpl, i) => (
                                                            <div key={i} className={`rounded-xl border-2 transition-all cursor-pointer overflow-hidden p-1 ${tmpl.active ? 'border-blue-600 bg-blue-50 shadow-lg' : 'border-white hover:border-slate-200'}`}>
                                                                {tmpl.icon ? (
                                                                    <div className="h-28 bg-white border-2 border-dashed border-slate-100 rounded-lg flex flex-col items-center justify-center text-slate-300">
                                                                        <span className="material-symbols-outlined text-3xl">{tmpl.icon}</span>
                                                                        <p className="text-[8px] font-black uppercase mt-2 tracking-widest">{tmpl.label}</p>
                                                                    </div>
                                                                ) : (
                                                                    <div className="relative h-28 bg-white rounded-lg overflow-hidden group">
                                                                        <img src={tmpl.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                                                                        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                                            <span className="text-white text-[8px] font-black uppercase underline">Xem mẫu</span>
                                                                        </div>
                                                                        <div className="absolute bottom-0 left-0 w-full bg-white/90 backdrop-blur-sm p-2">
                                                                            <p className="text-[8px] font-black uppercase tracking-tight text-slate-900 text-center truncate">{tmpl.label}</p>
                                                                        </div>
                                                                        {tmpl.active && <div className="absolute top-2 right-2 h-5 w-5 bg-blue-600 rounded-full flex items-center justify-center text-white ring-2 ring-white shadow-sm"><span className="material-symbols-outlined text-[10px] font-black">check</span></div>}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className="lg:col-span-7">
                                                        <div className="h-full bg-white rounded-3xl border border-slate-100 shadow-2xl p-10 flex flex-col items-center justify-center relative overflow-hidden group">
                                                            {/* Certificate Mockup */}
                                                            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-600 via-transparent to-transparent"></div>
                                                            <div className="text-center space-y-4 relative z-10 scale-90">
                                                                <div className="h-12 w-12 rounded-full bg-blue-600 text-white flex items-center justify-center mx-auto text-xl font-black shadow-lg">F</div>
                                                                <div>
                                                                    <p className="text-[9px] font-bold text-slate-400 tracking-widest uppercase">ĐOÀN KHOA CÔNG NGHỆ THÔNG TIN</p>
                                                                    <p className="text-2xl font-black text-blue-600 tracking-tight italic uppercase mt-1">CHỨNG NHẬN THAM GIA</p>
                                                                </div>
                                                                <div className="py-2 border-y border-slate-100 italic">
                                                                    <p className="text-[8px] font-bold uppercase text-slate-400 tracking-[0.2em] mb-1">Chứng nhận sinh viên:</p>
                                                                    <p className="text-xl font-bold text-slate-900">Nguyễn Văn A</p>
                                                                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">MSSV: 2252xxxx</p>
                                                                </div>
                                                                <p className="text-[8px] font-semibold text-slate-400 max-w-[240px] leading-relaxed italic mx-auto">Đã hoàn thành xuất sắc vai trò tham gia trong sự kiện: <br /><span className="text-blue-600 font-black">Ngày hội Công nghệ - IT Tech Day 2026</span></p>
                                                            </div>
                                                            <button className="absolute bottom-6 right-8 text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 hover:text-slate-900 transition-all opacity-0 group-hover:opacity-100">
                                                                <span className="material-symbols-outlined text-lg">visibility</span> Preview
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {createStep === 5 && (
                                    <div className="h-full flex flex-col items-center justify-center space-y-8 animate-in zoom-in-95 duration-700 py-10">
                                        <div className="h-32 w-32 rounded-full bg-emerald-50 border-4 border-emerald-100 flex items-center justify-center text-emerald-500 relative shadow-2xl shadow-emerald-100">
                                            <span className="material-symbols-outlined text-6xl animate-bounce">verified</span>
                                            <div className="absolute inset-x-0 -bottom-2 flex justify-center">
                                                <span className="px-4 py-1.5 bg-emerald-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">Ready to launch</span>
                                            </div>
                                        </div>
                                        <div className="text-center space-y-3">
                                            <h3 className="text-3xl font-black text-slate-900 italic tracking-tight uppercase">Mọi thứ đã sẵn sàng!</h3>
                                            <p className="text-slate-400 font-bold max-w-sm italic">Sự kiện của bạn đã được cấu hình hoàn tất. <br />Sau khi nhấn công bố, thông tin sẽ được hiển thị tới sinh viên toàn khoa.</p>
                                        </div>
                                        <div className="p-8 rounded-[2rem] border-2 border-slate-50 bg-slate-50/20 max-w-lg w-full divide-y divide-slate-100 shadow-inner">
                                            <div className="pb-4 mb-4 grid grid-cols-2 gap-4">
                                                <div><p className="text-[8px] font-black uppercase text-slate-400 italic">Sự kiện</p><p className="font-black italic text-slate-900 tracking-tight uppercase">IT Tech Day 2026</p></div>
                                                <div><p className="text-[8px] font-black uppercase text-slate-400 italic">Hình thức</p><p className="font-black italic text-blue-600 tracking-tight uppercase">Đội nhóm (3-5 SV)</p></div>
                                            </div>
                                            <div className="pt-4 grid grid-cols-2 gap-4">
                                                <div><p className="text-[8px] font-black uppercase text-slate-400 italic">Địa điểm</p><p className="font-bold italic text-slate-700">Hội trường A</p></div>
                                                <div><p className="text-[8px] font-black uppercase text-slate-400 italic">Công nghệ</p><p className="font-bold italic text-emerald-600 uppercase tracking-widest flex items-center gap-1"><span className="material-symbols-outlined text-[12px]">verified</span> Smart Check-in Active</p></div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="px-10 py-8 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 shrink-0">
                                <button onClick={() => createStep === 1 ? setShowCreateModal(false) : setCreateStep(s => s - 1)} className="h-12 px-10 rounded-xl bg-white border border-slate-200 text-slate-400 text-[11px] font-black uppercase tracking-widest hover:text-slate-900 transition-all">
                                    {createStep === 1 ? 'Hủy bỏ' : 'Quay lại'}
                                </button>
                                <div className="flex gap-3">
                                    {createStep === 5 && (
                                        <button onClick={() => setShowCreateModal(false)} className="h-12 px-10 rounded-xl bg-white border border-slate-200 text-slate-900 text-[11px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-slate-50">
                                            <span className="material-symbols-outlined text-lg">save</span> Lưu nháp
                                        </button>
                                    )}
                                    <button onClick={() => createStep < 5 ? setCreateStep(s => s + 1) : setShowCreateModal(false)} className={`h-12 px-10 rounded-xl text-white text-[11px] font-black uppercase tracking-widest shadow-xl flex items-center gap-3 transition-all ${createStep === 5 ? 'bg-blue-600 shadow-blue-100 hover:bg-blue-700' : 'bg-blue-600 shadow-blue-100 hover:bg-blue-700'}`}>
                                        {createStep === 5 ? 'Hoàn tất & Công bố' : 'Tiếp tục'}
                                        <span className="material-symbols-outlined text-xl">{createStep === 5 ? 'rocket_launch' : 'arrow_forward'}</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Manual Check-in Modal */}
            {showManualCheckinModal && (
                <div className="fixed inset-[-10px] z-[70] overflow-y-auto bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="min-h-full flex items-center justify-center p-4">
                        <div className="bg-white rounded-[2.5rem] w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-100">
                            <div className="px-8 pt-8 flex items-center justify-between uppercase">
                                <div className="flex items-center gap-3 text-blue-600">
                                    <span className="material-symbols-outlined font-black">edit_note</span>
                                    <h3 className="text-sm font-black italic tracking-tighter">Điểm danh Thủ công (Manual Check-in)</h3>
                                </div>
                                <button onClick={() => setShowManualCheckinModal(false)} className="text-slate-300 hover:text-rose-500 transition-colors">
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>

                            <div className="p-8 space-y-8">
                                <div className="space-y-2">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Tìm kiếm sinh viên</p>
                                    <div className="relative">
                                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-300">search</span>
                                        <input type="text" placeholder="Nhập MSSV hoặc Tên sinh viên..." className="w-full h-12 pl-12 pr-4 rounded-xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-2 ring-blue-500/10 outline-none text-sm font-medium italic" />
                                    </div>
                                </div>

                                <div className="p-6 rounded-[2rem] bg-indigo-50/50 border border-indigo-100 space-y-6 relative overflow-hidden group">
                                    <div className="flex items-center justify-between relative z-10">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <p className="text-base font-black text-slate-900 italic tracking-tight">Phạm Văn D</p>
                                                <span className="px-2 py-0.5 bg-white rounded text-[9px] font-black text-slate-400 uppercase italic">MSSV: 24CT115</span>
                                            </div>
                                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Lớp: 24CT115 - Kỹ thuật Phần mềm</p>
                                        </div>
                                        <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center text-slate-300 text-lg shadow-sm">👤</div>
                                    </div>
                                    <div className="h-px bg-indigo-100 group-hover:scale-x-110 transition-transform"></div>
                                    <div className="flex items-center gap-2 text-slate-400">
                                        <span className="h-3 w-3 rounded-full border-2 border-slate-200"></span>
                                        <p className="text-[10px] font-black uppercase tracking-widest italic">Chưa check-in</p>
                                    </div>
                                    <button onClick={() => { handleAction('Đã check-in cho Phạm Văn D thành công!'); setShowManualCheckinModal(false); }} className="w-full h-12 rounded-xl bg-blue-600 text-white text-[11px] font-black uppercase tracking-widest shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all flex items-center justify-center gap-2 mt-4">
                                        <span className="material-symbols-outlined text-sm">verified</span> Xác nhận Check-in
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] italic">NHẬT KÝ THỦ CÔNG GẦN ĐÂY</p>
                                    <div className="space-y-2">
                                        {[
                                            { name: 'Lê Thị E', id: '23CT111', time: '08:20' },
                                            { name: 'Nguyễn Văn F', id: '21CT112', time: '08:18' }
                                        ].map((log, i) => (
                                            <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50/50 border border-slate-100 group">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-6 w-6 rounded-lg bg-white flex items-center justify-center text-emerald-500 shadow-sm border border-emerald-100"><span className="material-symbols-outlined text-sm font-black">check</span></div>
                                                    <div>
                                                        <p className="text-xs font-black text-slate-800 italic uppercase leading-none">{log.name} <span className="text-slate-400 text-[9px] font-bold ml-1">({log.id})</span></p>
                                                        <p className="text-[9px] font-medium text-slate-400 uppercase tracking-widest mt-1">Checked by Admin</p>
                                                    </div>
                                                </div>
                                                <p className="text-[10px] font-bold text-slate-300 italic">{log.time}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </div>
    );
};

export default SubAdminEvents;
