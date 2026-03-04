import React, { useState } from 'react';
import Toast from '../../../components/ui/Toast';
import Toggle from '../../../components/ui/Toggle';

const SubAdminClasses = () => {
    const [toast, setToast] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [step, setStep] = useState(1);

    const classes = [
        { id: '23CT112', name: 'Chi đoàn 23CT112', tech: 'Kỹ thuật Phần mềm', leader: 'Nguyễn Văn A', online: true, status: 'Vững mạnh', statusColor: 'emerald', fee: 100, activity: 98, total: '45/45', avatar: 'NV' },
        { id: '22CT111', name: 'Chi đoàn 22CT111', tech: 'Kỹ thuật Phần mềm', leader: 'Trần Thị B', online: false, lastSeen: '2h', status: 'Khá', statusColor: 'blue', fee: 60, activity: 75, total: '40/42', avatar: 'TB' },
        { id: '23CT113', name: 'Chi đoàn 23CT113', tech: 'Kỹ thuật Phần mềm', leader: 'Lê Văn C', online: false, lastSeen: '1d', status: 'Yếu', statusColor: 'rose', fee: 20, activity: 0, total: '38/40', avatar: 'LC', alert: 'Thiếu báo cáo tháng' },
    ];

    const stats = [
        { label: 'Tổng Chi đoàn', val: '20', sub: '100% đã có BCH', icon: 'corporate_fare', color: 'blue' },
        { label: 'Cảnh báo Rủi ro', val: '02 Lớp', sub: 'Cần theo dõi sát sao', icon: 'warning', color: 'rose' },
        { label: 'Thu Đoàn phí', val: '92%', sub: 'Còn 3.5tr chưa thu', icon: 'payments', color: 'emerald' },
        { label: 'Tổng Sinh viên', val: '1,500', sub: 'Active App 98%', icon: 'groups', color: 'blue', isBadge: true },
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
                        <span className="text-blue-600 underline">Quản lý Chi đoàn</span>
                    </nav>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Danh sách Chi đoàn & Tình trạng Hoạt động</h1>
                </div>
                <div className="flex items-center gap-3">
                    <select className="h-10 px-4 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-600 outline-none">
                        <option>Năm học: 2025-2026</option>
                    </select>
                    <select className="h-10 px-4 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-600 outline-none">
                        <option>Tháng 11</option>
                    </select>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {stats.map((s, i) => (
                    <div key={i} className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col justify-between h-40 relative group overflow-hidden hover:shadow-xl transition-all">
                        <div className="flex justify-between items-start">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">{s.label}</p>
                            <div className={`h-10 w-10 rounded-xl bg-${s.color}-50 text-${s.color}-600 flex items-center justify-center shrink-0 overflow-hidden`}>
                                <span className="material-symbols-outlined text-xl">{s.icon}</span>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <p className={`text-4xl font-bold text-slate-900 tracking-tighter italic ${s.color === 'rose' ? 'text-rose-600' : ''}`}>{s.val}</p>
                            {s.isBadge ? (
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[9px] font-bold uppercase tracking-widest">
                                    <span className="material-symbols-outlined text-xs">analytics</span> {s.sub}
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <span className={`h-1.5 w-1.5 rounded-full ${s.color === 'emerald' ? 'bg-orange-500' : 'bg-emerald-500'}`}></span>
                                    <p className={`text-[10px] font-bold uppercase tracking-widest ${s.color === 'emerald' ? 'text-orange-500' : 'text-emerald-500'}`}>{s.sub}</p>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Table Section */}
            <div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-sm overflow-hidden">
                <div className="p-8 border-b border-slate-50 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="relative flex-1 max-w-md">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-300">search</span>
                        <input type="text" placeholder="Tìm tên lớp, Bí thư, MSSV..." className="w-full h-12 pl-12 pr-4 rounded-xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-2 ring-blue-500/10 outline-none text-sm font-medium" />
                    </div>
                    <div className="flex items-center gap-3">
                        <select className="h-10 px-4 rounded-xl border border-slate-200 bg-white text-[11px] font-bold text-slate-500 outline-none">
                            <option>Trạng thái: Tất cả</option>
                        </select>
                        <select className="h-10 px-4 rounded-xl border border-slate-200 bg-white text-[11px] font-bold text-slate-500 outline-none">
                            <option>Xếp loại: Mạnh/Khá/Yếu</option>
                        </select>
                        <button className="h-10 px-4 rounded-xl border border-slate-200 text-slate-600 text-[11px] font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-slate-50 transition-all">
                            <span className="material-symbols-outlined text-lg">download</span> Xuất Excel
                        </button>
                        <button onClick={() => setShowAddModal(true)} className="h-10 px-6 rounded-xl bg-blue-600 text-white text-[11px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all">
                            <span className="material-symbols-outlined text-lg font-bold text-white">add</span> Thêm Chi đoàn
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-10 py-5 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tên Chi đoàn</th>
                                <th className="px-8 py-5 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ban cán sự (Bí thư)</th>
                                <th className="px-8 py-5 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sĩ số</th>
                                <th className="px-8 py-5 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sức khỏe (Đoàn phí & Phong trào)</th>
                                <th className="px-8 py-5 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Xếp loại</th>
                                <th className="px-10 py-5 text-right text-[10px] font-bold text-slate-400 uppercase tracking-widest">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {classes.map((cls, i) => (
                                <tr key={cls.id} className="hover:bg-slate-50/50 transition-colors group relative">
                                    <td className="px-10 py-6">
                                        <p className="text-sm font-bold text-slate-900 italic tracking-tight uppercase">{cls.id}</p>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-black text-[10px] border-2 border-white shadow-sm">{cls.avatar}</div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-700">{cls.leader}</p>
                                                <div className="flex items-center gap-1.5 mt-0.5">
                                                    <span className={`h-1.5 w-1.5 rounded-full ${cls.online ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                                                        {cls.online ? 'Online' : `Offline ${cls.lastSeen}`}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-sm font-bold text-slate-500 italic">{cls.total}</td>
                                    <td className="px-8 py-6">
                                        <div className="space-y-4 max-w-[180px]">
                                            <div className="flex items-center gap-3">
                                                <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                                                    <div className={`h-full ${cls.fee >= 80 ? 'bg-emerald-500' : cls.fee >= 50 ? 'bg-orange-400' : 'bg-rose-500'} rounded-full`} style={{ width: `${cls.fee}%` }}></div>
                                                </div>
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter w-8">{cls.fee}%</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="material-symbols-outlined text-amber-400 text-sm">star</span>
                                                <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">{cls.activity} pts</span>
                                            </div>
                                            {cls.alert && (
                                                <div className="flex items-center gap-2 text-rose-500 mt-2">
                                                    <span className="material-symbols-outlined text-[14px]">error</span>
                                                    <p className="text-[9px] font-black uppercase tracking-widest italic">{cls.alert}</p>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`px-4 py-1.5 rounded-2xl bg-${cls.statusColor}-50 text-${cls.statusColor}-600 text-[10px] font-black italic tracking-widest border border-${cls.statusColor}-100`}>
                                            {cls.status}
                                        </span>
                                    </td>
                                    <td className="px-10 py-6 text-right relative">
                                        {cls.alert ? (
                                            <button onClick={() => handleAction('Đã gửi nhắc nhở tới Bí thư lớp!')} className="h-10 px-4 rounded-xl border border-rose-200 bg-rose-50 text-rose-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-rose-600 hover:text-white transition-all ml-auto">
                                                <span className="material-symbols-outlined text-lg">notifications</span> Gửi Nhắc nhở
                                            </button>
                                        ) : (
                                            <button className="h-10 w-10 flex items-center justify-center text-slate-300 hover:text-slate-600 transition-colors ml-auto">
                                                <span className="material-symbols-outlined text-2xl">more_vert</span>
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="p-8 border-t border-slate-50 flex items-center justify-between">
                    <p className="text-xs font-bold text-slate-400 italic">Hiển thị 1-10 trên 20 kết quả</p>
                    <div className="flex items-center gap-1">
                        <button className="h-8 w-8 flex items-center justify-center text-slate-300 hover:text-slate-900"><span className="material-symbols-outlined">chevron_left</span></button>
                        <button className="h-8 w-8 rounded-lg bg-white border border-blue-600 text-blue-600 text-[11px] font-bold">1</button>
                        <button className="h-8 w-8 text-slate-400 text-[11px] font-bold hover:text-slate-900">2</button>
                        <button className="h-8 w-8 flex items-center justify-center text-slate-300 hover:text-slate-900"><span className="material-symbols-outlined">chevron_right</span></button>
                    </div>
                </div>
            </div>

            <footer className="text-center pt-8 text-[11px] font-medium text-slate-400 italic">
                © 2025 Digital Youth Union System (DYUS). All rights reserved.<br />
                Module: Faculty Class Management Center - Khoa Công Nghệ Thông Tin
            </footer>

            {/* Add Class Modal Overlay */}
            {showAddModal && (
                <div className="fixed inset-[-10px] z-[70] overflow-y-auto bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="min-h-full flex items-center justify-center p-4">
                        <div className="bg-white rounded-[2.5rem] w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-100 flex flex-col">
                            <div className="px-10 py-8 border-b border-slate-50 flex items-center justify-between">
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 tracking-tight">Thêm Chi đoàn mới</h3>
                                    <p className="text-xs font-semibold text-slate-400 mt-1">Khởi tạo thông tin cho chi đoàn mới trong hệ thống.</p>
                                </div>
                                <button onClick={() => setShowAddModal(false)} className="h-10 w-10 flex items-center justify-center text-slate-300 hover:text-rose-500 transition-colors">
                                    <span className="material-symbols-outlined text-2xl">close</span>
                                </button>
                            </div>

                            {/* Modal Navigation (Stepper) */}
                            <div className="p-10 pb-0">
                                <div className="flex items-center justify-between max-w-sm mx-auto relative mb-12">
                                    <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -translate-y-1/2 z-0"></div>
                                    {[1, 2, 3].map(s => (
                                        <div key={s} className="relative z-10 flex flex-col items-center gap-3">
                                            <div className={`h-8 w-8 rounded-full flex items-center justify-center text-[11px] font-black transition-all ${step >= s ? 'bg-blue-600 text-white ring-4 ring-blue-50' : 'bg-white border-2 border-slate-100 text-slate-300'}`}>
                                                {step > s ? <span className="material-symbols-outlined text-sm">check</span> : s}
                                            </div>
                                            <p className={`text-[9px] font-black uppercase tracking-widest absolute -bottom-6 text-nowrap ${step >= s ? 'text-blue-600' : 'text-slate-300'}`}>
                                                {s === 1 ? 'Thông tin cơ bản' : s === 2 ? 'Nhân sự & Danh sách' : 'Xác nhận'}
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                {/* Step Container */}
                                <div className="min-h-[300px] flex flex-col">
                                    {step === 1 && (
                                        <div className="space-y-6 pt-4 animate-in slide-in-from-right-4 duration-500">
                                            <h4 className="text-lg font-bold text-slate-900 italic tracking-tight">1. Thông tin chung</h4>
                                            <div className="grid grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Mã Chi đoàn <span className="text-rose-500 font-black">*</span></label>
                                                    <div className="relative">
                                                        <input type="text" placeholder="Ví dụ: 25CT111" className="w-full h-11 pl-4 pr-10 rounded-xl border border-slate-200 outline-none focus:border-blue-500 transition-all font-bold text-slate-700 text-sm" />
                                                        <span className="material-symbols-outlined absolute right-3 top-2.5 text-slate-300 text-lg">badge</span>
                                                    </div>
                                                    <p className="text-[9px] font-semibold text-slate-400 mt-1 ml-1">Mã lớp phải là duy nhất.</p>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Niên khóa <span className="text-rose-500 font-black">*</span></label>
                                                    <select className="w-full h-11 px-4 rounded-xl border border-slate-200 font-bold text-slate-700 text-sm outline-none">
                                                        <option>2025-2029</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Chuyên ngành <span className="text-rose-500 font-black">*</span></label>
                                                <select className="w-full h-11 px-4 rounded-xl border border-slate-200 font-bold text-slate-700 text-sm outline-none">
                                                    <option>Kỹ thuật Phần mềm (Software Engineering)</option>
                                                </select>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Giáo viên Chủ nhiệm</label>
                                                <div className="relative">
                                                    <input type="text" placeholder="Nhập tên giáo viên..." className="w-full h-11 pl-4 pr-10 rounded-xl border border-slate-200 outline-none focus:border-blue-500 transition-all font-bold text-slate-700 text-sm" />
                                                    <span className="material-symbols-outlined absolute right-3 top-2.5 text-slate-300 text-lg">person_pin</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {step === 2 && (
                                        <div className="space-y-8 pt-4 animate-in slide-in-from-right-4 duration-500">
                                            <div className="space-y-2 text-center py-6 border-2 border-dashed border-slate-100 rounded-[2rem] bg-slate-50/50 hover:bg-white hover:border-blue-200 transition-all cursor-pointer group">
                                                <div className="h-12 w-12 rounded-2xl bg-white text-slate-300 group-hover:bg-blue-50 group-hover:text-blue-500 transition-all flex items-center justify-center mx-auto shadow-sm">
                                                    <span className="material-symbols-outlined text-2xl">cloud_upload</span>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-900 italic tracking-tight"><span className="text-blue-600 underline">Tải lên tệp</span> hoặc kéo thả vào đây</p>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase mt-1 tracking-widest">Excel, CSV lên đến 10MB</p>
                                                </div>
                                            </div>

                                            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-9 w-9 bg-white rounded-lg flex items-center justify-center text-emerald-500 shadow-sm"><span className="material-symbols-outlined">description</span></div>
                                                    <div>
                                                        <p className="text-xs font-bold text-slate-700">DS_Lop_25CT111.xlsx</p>
                                                        <p className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest">✅ Đã tải lên (45 sinh viên)</p>
                                                    </div>
                                                </div>
                                                <button className="h-8 w-8 flex items-center justify-center text-slate-300 hover:text-rose-500"><span className="material-symbols-outlined text-sm">delete</span></button>
                                            </div>

                                            <div className="space-y-3">
                                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Chỉ định Bí thư lâm thời (Tùy chọn)</label>
                                                <div className="relative">
                                                    <input type="text" placeholder="Tìm sinh viên trong danh sách..." className="w-full h-11 pl-4 pr-10 rounded-xl border border-slate-200 font-bold text-slate-700 text-sm italic" />
                                                    <button className="absolute right-3 top-2 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all">Đã chọn ×</button>
                                                    <span className="material-symbols-outlined absolute left-4 top-2.5 text-slate-300 text-lg">group</span>
                                                </div>
                                                <p className="text-[9px] font-bold text-slate-400 italic ml-1 leading-relaxed">Người được chỉ định sẽ có quyền truy cập quản lý Chi đoàn ngay lập tức.</p>
                                            </div>
                                        </div>
                                    )}

                                    {step === 3 && (
                                        <div className="space-y-8 pt-4 animate-in slide-in-from-right-4 duration-500">
                                            <div className="p-6 rounded-[2rem] border-2 border-blue-100 bg-blue-50/20 space-y-4">
                                                <h4 className="text-sm font-black text-blue-600 uppercase tracking-widest italic flex items-center gap-2">
                                                    <span className="material-symbols-outlined text-lg">verified</span> Xác nhận thông tin tin
                                                </h4>
                                                <div className="bg-white rounded-2xl p-6 shadow-sm border border-blue-50 space-y-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center text-white"><span className="material-symbols-outlined">school</span></div>
                                                        <div>
                                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">CHI ĐOÀN / LỚP</p>
                                                            <p className="text-lg font-black text-slate-900 italic uppercase">25CT111 - Kỹ thuật Phần mềm</p>
                                                        </div>
                                                        <span className="ml-auto px-2 py-1 bg-slate-100 rounded text-[9px] font-black text-slate-500 italic uppercase">Khóa 2025</span>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="flex items-center gap-3">
                                                            <span className="material-symbols-outlined text-slate-400 text-lg">groups</span>
                                                            <p className="text-sm font-bold text-slate-700 italic">45 Sinh viên</p>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            <span className="material-symbols-outlined text-slate-400 text-lg">person</span>
                                                            <p className="text-sm font-bold text-slate-700 italic">Lê Văn A</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-100 mb-2">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center"><span className="material-symbols-outlined">mail</span></div>
                                                        <div><p className="text-xs font-bold text-slate-900 tracking-tight">Gửi Email kích hoạt</p><p className="text-[10px] text-slate-400 font-medium">Gửi thông tin đăng nhập cho Bí thư và Ban cán sự lớp</p></div>
                                                    </div>
                                                    <Toggle enabled={true} />
                                                </div>
                                                <div className="flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-100">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center"><span className="material-symbols-outlined">forum</span></div>
                                                        <div><p className="text-xs font-bold text-slate-900 tracking-tight">Tạo Group Zalo</p><p className="text-[10px] text-slate-400 font-medium">Tự động tạo nhóm chat Zalo cho lớp và thêm Bí thư</p></div>
                                                    </div>
                                                    <Toggle enabled={true} />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="px-10 py-8 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 mt-auto">
                                <button onClick={() => step === 1 ? setShowAddModal(false) : setStep(s => s - 1)} className="h-11 px-8 rounded-xl bg-white border border-slate-200 text-slate-400 text-[11px] font-black uppercase tracking-widest hover:text-slate-900 transition-all">
                                    {step === 1 ? 'Hủy' : 'Quay lại'}
                                </button>
                                {step < 3 ? (
                                    <button onClick={() => setStep(s => s + 1)} className="h-11 px-10 rounded-xl bg-blue-600 text-white text-[11px] font-black uppercase tracking-widest shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all flex items-center gap-2">
                                        Tiếp tục <span className="material-symbols-outlined text-lg">arrow_forward</span>
                                    </button>
                                ) : (
                                    <button onClick={() => { setShowAddModal(false); setStep(1); handleAction('Khởi tạo Chi đoàn 25CT111 thành công!'); }} className="h-11 px-10 rounded-xl bg-emerald-600 text-white text-[11px] font-black uppercase tracking-widest shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all flex items-center gap-2">
                                        <span className="material-symbols-outlined text-lg">verified</span> Hoàn tất & Khởi tạo
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </div>
    );
};

export default SubAdminClasses;
