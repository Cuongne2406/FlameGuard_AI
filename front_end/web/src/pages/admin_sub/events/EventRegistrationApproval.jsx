import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Toast from '../../../components/ui/Toast';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { eventService } from '../../../services/eventService';

const EventRegistrationApproval = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [toast, setToast] = useState(null);
    const [selectedTeams, setSelectedTeams] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [showAddTeamModal, setShowAddTeamModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [teams, setTeams] = useState([]);

    useEffect(() => {
        const fetchRegistrations = async () => {
            try {
                setLoading(true);
                const data = await eventService.getEventRegistrations(id);
                // Map API data to the UI format
                // In standard API, data represents list of users registered
                // We mock team wrapping for now or assume each item is a registration
                const mappedRegistrations = data.map((reg, index) => ({
                    id: reg.id || `REG-${index}`,
                    name: reg.user_id ? `User ${reg.user_id}` : 'Tham gia cá nhân',
                    members: reg.user_id ? [reg.user_id] : ['-'],
                    time: new Date(reg.registration_time || Date.now()).toLocaleString(),
                    status: reg.status === 'REGISTERED' ? 'Đã duyệt' : reg.status === 'PENDING' ? 'Chờ duyệt' : 'Từ chối',
                    statusColor: reg.status === 'REGISTERED' ? 'emerald' : reg.status === 'PENDING' ? 'orange' : 'rose',
                    avatar: reg.user_id ? reg.user_id.substring(0, 2).toUpperCase() : 'U',
                    isError: reg.status === 'REJECTED'
                }));
                setTeams(mappedRegistrations);
            } catch (err) {
                console.error("Failed to fetch registrations", err);
            } finally {
                setLoading(false);
            }
        };
        fetchRegistrations();
    }, [id]);

    // Dynamic stats derived from teams
    const stats = [
        { label: 'Tổng số đội', val: teams.length.toString(), icon: 'groups', color: 'blue' },
        { label: 'Đã duyệt', val: teams.filter(t => t.status === 'Đã duyệt').length.toString(), icon: 'check_circle', color: 'emerald' },
        { label: 'Chờ duyệt', val: teams.filter(t => t.status === 'Chờ duyệt').length.toString(), icon: 'hourglass_empty', color: 'orange' },
        { label: 'Bị từ chối', val: teams.filter(t => t.status === 'Từ chối').length.toString(), icon: 'cancel', color: 'rose' },
    ];

    const filteredTeams = teams.filter(team =>
        team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        team.members.some(m => m.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const toggleSelection = (teamId) => {
        setSelectedTeams(prev =>
            prev.includes(teamId) ? prev.filter(id => id !== teamId) : [...prev, teamId]
        );
    };

    const handleAction = (msg) => {
        setToast({ message: msg, type: 'success' });
    };

    const handleReject = async (teamId) => {
        try {
            // Suppose it's an API call to update status to 'REJECTED'
            await eventService.updateRegistration(id, teamId, { status: 'REJECTED' });
            setTeams(prev => prev.filter(t => t.id !== teamId));
            setSelectedTeams(prev => prev.filter(tid => tid !== teamId));
            setToast({ message: 'Đã từ chối đăng ký!', type: 'success' });
        } catch (error) {
            setToast({ message: 'Lỗi khi từ chối đăng ký!', type: 'error' });
        }
    };

    const exportToExcel = () => {
        const data = [
            ['ID', 'Tên đội', 'Thành viên', 'Thời gian đăng ký', 'Tình trạng'],
            ...filteredTeams.map(t => [t.id, t.name, t.members.join(', '), t.time, t.status])
        ];
        const ws = XLSX.utils.aoa_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'DanhSachThi');
        const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        saveAs(new Blob([buffer]), 'DanhSach_Thi.xlsx');
        setToast({ message: 'Xuất Excel thành công!', type: 'success' });
    };

    return (
        <div className="p-4 md:p-8 bg-[#F8FAFC] min-h-screen space-y-8 font-sans">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex items-start gap-4">
                    <div className="h-10 w-10 mt-1 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg">
                        <span className="material-symbols-outlined font-bold">verified</span>
                    </div>
                    <div>
                        <nav className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                            <button onClick={() => navigate('/admin_sub/events')} className="hover:text-blue-600">Sự kiện Khoa</button>
                            <span>/</span>
                            <span className="text-blue-600 underline">Duyệt danh sách thi</span>
                        </nav>
                        <h1 className="text-2xl font-bold text-slate-900 uppercase">Duyệt danh sách Đăng ký: Code War Season 5</h1>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={exportToExcel}
                        className="h-12 px-6 rounded-xl border border-slate-200 bg-white text-xs font-bold uppercase tracking-widest text-slate-900 flex items-center gap-3 hover:bg-slate-50 transition-all shadow-sm"
                    >
                        <span className="material-symbols-outlined text-lg">description</span> Xuất danh sách (Excel)
                    </button>
                    <button
                        onClick={() => setShowAddTeamModal(true)}
                        className="h-12 px-6 rounded-xl border border-blue-600 bg-white text-xs font-bold uppercase tracking-widest text-blue-600 flex items-center gap-3 hover:bg-blue-50 transition-all shadow-sm"
                    >
                        <span className="material-symbols-outlined text-lg">add_circle</span> Thêm đội thủ công
                    </button>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {stats.map((s, i) => (
                    <div key={i} className="bg-white border-l-8 border-transparent rounded-2xl p-6 shadow-sm flex items-center justify-between group hover:shadow-xl transition-all" style={{ borderLeftColor: s.color === 'blue' ? '#dbeafe' : s.color === 'emerald' ? '#10b981' : s.color === 'orange' ? '#f97316' : '#ef4444' }}>
                        <div className="space-y-1">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{s.label}</p>
                            <p className="text-3xl font-bold text-slate-900 tracking-tighter">{s.val}</p>
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
                        <input
                            type="text"
                            placeholder="Tìm tên đội, tên thành viên..."
                            className="w-full h-12 pl-12 pr-4 rounded-xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-2 ring-blue-500/10 outline-none text-sm font-bold"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-10 py-5 text-left w-14">
                                    <input
                                        type="checkbox"
                                        className="h-5 w-5 rounded border-slate-200 text-blue-600 focus:ring-blue-500"
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setSelectedTeams(filteredTeams.map(t => t.id));
                                            } else {
                                                setSelectedTeams([]);
                                            }
                                        }}
                                        checked={selectedTeams.length === filteredTeams.length && filteredTeams.length > 0}
                                    />
                                </th>
                                <th className="px-8 py-5 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">Tên Đội</th>
                                <th className="px-8 py-5 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">Thành viên (MSSV)</th>
                                <th className="px-8 py-5 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">Thời gian đăng ký</th>
                                <th className="px-8 py-5 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">Tình trạng Đoàn phí</th>
                                <th className="px-8 py-5 text-right"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredTeams.map((t) => (
                                <tr key={t.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-10 py-8">
                                        <input
                                            type="checkbox"
                                            checked={selectedTeams.includes(t.id)}
                                            onChange={() => toggleSelection(t.id)}
                                            className="h-5 w-5 rounded border-slate-200 text-blue-600 focus:ring-blue-500"
                                        />
                                    </td>
                                    <td className="px-8 py-8">
                                        <div className="flex items-center gap-4">
                                            <div className="h-12 w-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs border-2 border-white shadow-sm">{t.avatar}</div>
                                            <div>
                                                <p className="text-base font-bold text-slate-900">{t.name}</p>
                                                <p className="text-xs font-bold text-slate-400 uppercase mt-1 tracking-widest">ID: #{t.id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-8">
                                        <div className="flex -space-x-3 overflow-hidden mb-2">
                                            {t.memberAvatars?.map((av, idx) => (
                                                <img key={idx} src={av} className="inline-block h-8 w-8 rounded-full ring-2 ring-white" alt="avatar" />
                                            ))}
                                        </div>
                                        <div className="space-y-1">
                                            {t.members.map((m, idx) => (
                                                <p key={idx} className={`text-xs font-bold uppercase tracking-tight ${t.isError ? 'text-rose-500' : 'text-slate-400'}`}>
                                                    {t.isError && <span className="material-symbols-outlined text-[12px] align-middle mr-1">warning</span>}
                                                    {m}
                                                </p>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-8 py-8">
                                        <div className="flex items-center gap-2 text-slate-500">
                                            <span className="material-symbols-outlined text-lg">schedule</span>
                                            <p className="text-xs font-bold tracking-tight">{t.time}</p>
                                        </div>
                                    </td>
                                    <td className="px-8 py-8">
                                        <span className={`px-4 py-2 rounded-xl text-xs font-bold tracking-widest flex items-center gap-2 w-fit ${t.statusColor === 'emerald' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'}`}>
                                            <span className="material-symbols-outlined text-sm">{t.statusColor === 'emerald' ? 'check_circle' : 'report_problem'}</span>
                                            {t.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-8 text-right">
                                        <button
                                            onClick={() => handleReject(t.id)}
                                            className={`h-9 px-4 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-all ${
                                                t.isError
                                                    ? 'border border-rose-100 bg-white text-rose-600 hover:bg-rose-600 hover:text-white'
                                                    : 'bg-white border border-slate-200 text-slate-400 hover:text-slate-600'
                                            }`}
                                        >
                                            <span className="material-symbols-outlined text-sm">{t.isError ? 'delete_sweep' : 'close'}</span>
                                            {t.isError ? 'Loại khỏi danh sách' : 'Từ chối'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Selection Bar */}
                {selectedTeams.length > 0 && (
                    <div className="absolute inset-x-10 bottom-10 p-4 border border-emerald-100 bg-white shadow-2xl rounded-[1.5rem] flex items-center justify-between animate-in slide-in-from-bottom-6 duration-500 z-10">
                        <div className="flex items-center gap-6 divide-x divide-slate-100">
                            <div className="flex items-center gap-3">
                                <input type="checkbox" checked={true} readOnly className="h-6 w-6 rounded border-blue-600 text-blue-600" />
                                <p className="text-sm font-bold tracking-tighter">Đã chọn {selectedTeams.length} đội</p>
                            </div>
                            <p className="pl-6 text-xs font-bold text-slate-400 uppercase tracking-widest max-w-xs leading-relaxed">Các hành động hàng loạt sẽ áp dụng cho các mục đã chọn.</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <button onClick={() => setSelectedTeams([])} className="h-12 px-8 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-slate-900">Hủy bỏ</button>
                            <button
                                onClick={() => handleAction(`Đã phê duyệt ${selectedTeams.length} đội!`)}
                                className="h-12 px-10 rounded-2xl bg-emerald-600 text-white text-xs font-bold uppercase tracking-widest shadow-xl shadow-emerald-100 flex items-center gap-3 hover:bg-emerald-700 active:scale-95 transition-all"
                            >
                                <span className="material-symbols-outlined">done_all</span> Phê duyệt hàng loạt
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal thêm đội thủ công (giản lược) */}
            {showAddTeamModal && (
                <div className="fixed inset-0 z-[70] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center">
                    <div className="bg-white rounded-[2.5rem] w-full max-w-md p-8">
                        <h3 className="text-xl font-bold mb-6">Thêm đội thủ công</h3>
                        <div className="space-y-4">
                            <input type="text" placeholder="Tên đội" className="w-full h-12 px-4 rounded-xl border border-slate-200" />
                            <input type="text" placeholder="Thành viên (MSSV, cách nhau dấu phẩy)" className="w-full h-12 px-4 rounded-xl border border-slate-200" />
                            <div className="flex gap-4 pt-4">
                                <button onClick={() => setShowAddTeamModal(false)} className="flex-1 h-10 rounded-xl bg-slate-100">Hủy</button>
                                <button onClick={() => { setShowAddTeamModal(false); handleAction('Đã thêm đội mới!'); }} className="flex-1 h-10 rounded-xl bg-blue-600 text-white">Thêm</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <footer className="text-center pt-8 text-xs font-medium text-slate-400 italic">
                © 2025 Digital Youth Union System (DYUS). All rights reserved.<br />
                Module: Faculty Event Management Center - Khoa Công Nghệ Thông Tin
            </footer>

            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </div>
    );
};

export default EventRegistrationApproval;