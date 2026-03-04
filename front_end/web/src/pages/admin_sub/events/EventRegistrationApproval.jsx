import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Toast from '../../../components/ui/Toast';

const EventRegistrationApproval = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [toast, setToast] = useState(null);
    const [selectedTeams, setSelectedTeams] = useState([]);

    const stats = [
        { label: 'TỔNG SỐ ĐỘI', val: '120', icon: 'groups', color: 'blue' },
        { label: 'ĐÃ DUYỆT', val: '80', icon: 'check_circle', color: 'emerald' },
        { label: 'CHỜ DUYỆT', val: '35', icon: 'hourglass_empty', color: 'orange' },
        { label: 'BỊ TỪ CHỐI', val: '05', icon: 'cancel', color: 'rose' },
    ];

    const teams = [
        {
            id: 'CW001',
            name: 'Alpha Code',
            members: ['22CT111', '22CT112', '22CT113'],
            time: '10:30 - 20/09/2026',
            status: '100% Đoàn viên',
            statusColor: 'emerald',
            avatar: 'AC',
            memberAvatars: ['https://randomuser.me/api/portraits/thumb/men/1.jpg', 'https://randomuser.me/api/portraits/thumb/women/2.jpg', 'https://randomuser.me/api/portraits/thumb/men/3.jpg']
        },
        {
            id: 'CW002',
            name: 'Beta Tech',
            members: ['230005 không hợp lệ'],
            time: '11:15 - 20/09/2026',
            status: 'Nợ Đoàn phí (1 SV)',
            statusColor: 'orange',
            avatar: 'BT',
            isError: true,
            memberAvatars: ['https://randomuser.me/api/portraits/thumb/women/4.jpg']
        },
        {
            id: 'CW003',
            name: 'Data Squad',
            members: ['23CT201', '23CT202', '23CT203'],
            time: '14:20 - 20/09/2026',
            status: '100% Đoàn viên',
            statusColor: 'emerald',
            avatar: 'DS',
            memberAvatars: ['https://randomuser.me/api/portraits/thumb/men/5.jpg', 'https://randomuser.me/api/portraits/thumb/men/6.jpg', 'https://randomuser.me/api/portraits/thumb/women/7.jpg']
        }
    ];

    const toggleSelection = (teamId) => {
        if (selectedTeams.includes(teamId)) {
            setSelectedTeams(selectedTeams.filter(t => t !== teamId));
        } else {
            setSelectedTeams([...selectedTeams, teamId]);
        }
    };

    const handleAction = (msg) => {
        setToast({ message: msg, type: 'success' });
    };

    return (
        <div className="p-4 md:p-8 bg-[#F8FAFC] min-h-screen space-y-8 font-sans">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex items-start gap-4">
                    <div className="h-10 w-10 mt-1 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg">
                        <span className="material-symbols-outlined font-black">verified</span>
                    </div>
                    <div>
                        <nav className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                            <span>Trang chủ</span>
                            <span>/</span>
                            <span>Sự kiện Khoa</span>
                            <span>/</span>
                            <span className="text-blue-600 underline">Code War Season 5</span>
                        </nav>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight italic uppercase">Duyệt danh sách Đăng ký: Code War Season 5</h1>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button className="h-12 px-6 rounded-xl border border-slate-200 bg-white text-[11px] font-black uppercase tracking-widest text-slate-900 flex items-center gap-3 hover:bg-slate-50 transition-all shadow-sm">
                        <span className="material-symbols-outlined text-lg">description</span> Xuất danh sách (Excel)
                    </button>
                    <button className="h-12 px-6 rounded-xl border border-blue-600 bg-white text-[11px] font-black uppercase tracking-widest text-blue-600 flex items-center gap-3 hover:bg-blue-50 transition-all shadow-sm">
                        <span className="material-symbols-outlined text-lg">add_circle</span> Thêm đội thủ công
                    </button>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {stats.map((s, i) => (
                    <div key={i} className="bg-white border-l-8 border-transparent rounded-2xl p-6 shadow-sm flex items-center justify-between group hover:shadow-xl transition-all" style={{ borderLeftColor: s.color === 'blue' ? '#dbeafe' : s.color === 'emerald' ? '#10b981' : s.color === 'orange' ? '#f97316' : '#ef4444' }}>
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">{s.label}</p>
                            <p className="text-3xl font-black text-slate-900 tracking-tighter italic">{s.val}</p>
                        </div>
                        <div className={`h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-${s.color}-600`}>
                            <span className="material-symbols-outlined">{s.icon}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* List Control */}
            <div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-sm overflow-hidden min-h-[600px] flex flex-col relative">
                <div className="p-8 border-b border-slate-50 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="relative flex-1 max-w-lg">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-300">search</span>
                        <input type="text" placeholder="Tìm tên đội, tên thành viên..." className="w-full h-12 pl-12 pr-4 rounded-xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-2 ring-blue-500/10 outline-none text-sm font-medium" />
                    </div>
                    <div className="flex items-center gap-3">
                        <select className="h-11 px-6 rounded-xl border border-slate-200 bg-white text-[11px] font-black uppercase tracking-widest text-slate-500 outline-none min-w-[180px]">
                            <option>Trạng thái: Chờ duyệt</option>
                        </select>
                        <select className="h-11 px-6 rounded-xl border border-slate-200 bg-white text-[11px] font-black uppercase tracking-widest text-slate-500 outline-none min-w-[140px]">
                            <option>Khóa: Tất cả</option>
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-10 py-5 text-left w-14">
                                    <input type="checkbox" className="h-5 w-5 rounded border-slate-200 text-blue-600 focus:ring-blue-500" />
                                </th>
                                <th className="px-8 py-5 text-left text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Tên Đội</th>
                                <th className="px-8 py-5 text-left text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Thành viên (MSSV)</th>
                                <th className="px-8 py-5 text-left text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Thời gian đăng ký</th>
                                <th className="px-8 py-5 text-left text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Tình trạng Đoàn phí</th>
                                <th className="px-8 py-5 text-right"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {teams.map((t) => (
                                <tr key={t.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-10 py-8">
                                        <input
                                            type="checkbox"
                                            checked={selectedTeams.includes(t.id)}
                                            onChange={() => toggleSelection(t.id)}
                                            className="h-5 w-5 rounded border-slate-200 text-blue-600 focus:ring-blue-500" />
                                    </td>
                                    <td className="px-8 py-8">
                                        <div className="flex items-center gap-4">
                                            <div className="h-12 w-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-black text-xs border-2 border-white shadow-sm italic">{t.avatar}</div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-900">{t.name}</p>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase mt-1 tracking-widest">ID: #{t.id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-8">
                                        <div className="flex -space-x-3 overflow-hidden mb-2">
                                            {t.memberAvatars.map((av, idx) => (
                                                <img key={idx} src={av} className="inline-block h-8 w-8 rounded-full ring-2 ring-white" />
                                            ))}
                                        </div>
                                        <div className="space-y-1">
                                            {t.members.map((m, idx) => (
                                                <p key={idx} className={`text-[10px] font-black uppercase tracking-tight italic ${t.isError ? 'text-rose-500' : 'text-slate-400'}`}>
                                                    {t.isError && <span className="material-symbols-outlined text-[12px] align-middle mr-1">warning</span>}
                                                    {m}
                                                </p>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-8 py-8">
                                        <div className="flex items-center gap-2 text-slate-500">
                                            <span className="material-symbols-outlined text-lg">schedule</span>
                                            <p className="text-[11px] font-bold tracking-tight italic">{t.time}</p>
                                        </div>
                                    </td>
                                    <td className="px-8 py-8">
                                        <span className={`px-4 py-2 rounded-xl text-[10px] font-black italic tracking-widest flex items-center gap-2 w-fit ${t.statusColor === 'emerald' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'}`}>
                                            <span className="material-symbols-outlined text-sm">{t.statusColor === 'emerald' ? 'check_circle' : 'report_problem'}</span>
                                            {t.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-8 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {t.isError ? (
                                                <button onClick={() => handleAction('Đã xóa đội khỏi danh sách!')} className="h-9 px-4 rounded-xl border border-rose-100 bg-white text-rose-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-rose-600 hover:text-white transition-all shadow-sm">
                                                    <span className="material-symbols-outlined text-sm">delete_sweep</span> Loại khỏi danh sách
                                                </button>
                                            ) : (
                                                <button className="h-9 px-4 rounded-xl border border-slate-200 bg-white text-slate-400 text-[10px] font-black uppercase tracking-widest hover:text-slate-600">Từ chối</button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="mt-auto p-10 border-t border-slate-50 flex items-center justify-between">
                    <p className="text-sm font-bold text-slate-400 italic">Hiển thị <span className="text-slate-900">1 đến 3</span> trong số 35 kết quả</p>
                    <div className="flex items-center gap-2">
                        <button className="h-10 w-10 border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-900"><span className="material-symbols-outlined">chevron_left</span></button>
                        <button className="h-10 w-10 bg-blue-600 text-white rounded-xl text-xs font-black italic shadow-lg shadow-blue-100">1</button>
                        <button className="h-10 w-10 border border-slate-200 text-slate-600 rounded-xl text-xs font-black italic hover:bg-slate-50 transition-all">2</button>
                        <button className="h-10 w-10 border border-slate-200 text-slate-600 rounded-xl text-xs font-black italic hover:bg-slate-50 transition-all">3</button>
                        <button className="h-10 w-10 border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-900"><span className="material-symbols-outlined">chevron_right</span></button>
                    </div>
                </div>

                {/* Selection Bar (Floating at bottom of container) */}
                {selectedTeams.length > 0 && (
                    <div className="absolute inset-x-10 bottom-10 p-4 border border-emerald-100 bg-white shadow-2xl rounded-[1.5rem] flex items-center justify-between animate-in slide-in-from-bottom-6 duration-500 z-10">
                        <div className="flex items-center gap-6 divide-x divide-slate-100">
                            <div className="flex items-center gap-3">
                                <input type="checkbox" checked={true} readOnly className="h-6 w-6 rounded border-blue-600 text-blue-600" />
                                <p className="text-sm font-black italic tracking-tighter">Đã chọn {selectedTeams.length} đội</p>
                            </div>
                            <p className="pl-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] max-w-xs leading-relaxed">Các hành động hàng loạt sẽ áp dụng cho các mục đã chọn.</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <button onClick={() => setSelectedTeams([])} className="h-12 px-8 text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900">Hủy bỏ</button>
                            <button onClick={() => handleAction(`Đã phê duyệt ${selectedTeams.length} đội!`)} className="h-12 px-10 rounded-2xl bg-emerald-600 text-white text-[11px] font-black uppercase tracking-widest shadow-xl shadow-emerald-100 flex items-center gap-3 hover:bg-emerald-700 active:scale-95 transition-all">
                                <span className="material-symbols-outlined">done_all</span> Phê duyệt hàng loạt
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <footer className="text-center pt-8 text-[11px] font-medium text-slate-400 italic uppercase tracking-widest">
                © 2025 Digital Youth Union System (DYUS). All rights reserved.<br />
                Module: Faculty Event Management Center - Khoa Công Nghệ Thông Tin
            </footer>

            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </div>
    );
};

export default EventRegistrationApproval;
