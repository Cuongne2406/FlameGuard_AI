import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Toast from '../../../components/ui/Toast';
import { eventService } from '../../../services/eventService';

const EventManualCheckin = ({ eventId, onClose }) => {
    const navigate = useNavigate();
    const [toast, setToast] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [attendees, setAttendees] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (eventId) {
            fetchAttendees();
        }
    }, [eventId]);

    const fetchAttendees = async () => {
        try {
            setLoading(true);
            const data = await eventService.getEventRegistrations(eventId);
            // Map the registrations to the attendee format
            const mappedAttendees = data.map((reg, index) => ({
                id: reg.id || `ATT-${index}`,
                name: reg.user_id ? `User ${reg.user_id}` : 'Khách mời',
                class: reg.user_id ? 'N/A' : '',
                time: reg.status === 'ATTENDED' ? new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : '--:--',
                status: reg.status === 'ATTENDED' ? 'Checked-in' : 'Pending',
                originalData: reg,
            }));
            setAttendees(mappedAttendees);
        } catch (error) {
            console.error('Failed to fetch attendees:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCheckin = async (id) => {
        try {
            await eventService.updateRegistration(eventId, id, { status: 'ATTENDED' });
            setToast({ message: `Đã điểm danh thành công!`, type: 'success' });
            // Cập nhật state trực tiếp để đổi UI ngay lập tức
            setAttendees(prev => prev.map(a => a.id === id ? { ...a, status: 'Checked-in', time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) } : a));
        } catch (error) {
            setToast({ message: 'Lỗi khi điểm danh', type: 'error' });
        }
    };

    const filteredAttendees = attendees.filter(sv => 
        sv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sv.id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="fixed inset-0 z-[70] overflow-y-auto bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="min-h-full flex items-center justify-center p-4">
                <div className="bg-white rounded-[2.5rem] w-full max-w-4xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-100 flex flex-col max-h-[90vh]">
                    {/* Header */}
                    <div className="px-10 py-8 border-b border-slate-50 flex items-center justify-between">
                        <div>
                            <nav className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                                <button onClick={() => navigate('/admin_sub/events')} className="hover:text-blue-600">Sự kiện Khoa</button>
                                <span>/</span>
                                <span className="text-blue-600 underline">Điểm danh thủ công</span>
                            </nav>
                            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                                <span className="material-symbols-outlined text-blue-600">how_to_reg</span>
                                Hội thảo AI & Big Data 2025
                            </h1>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100 flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                                <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">
                                    Live Check-in: {attendees.filter(a => a.status === 'Checked-in').length} / {attendees.length}
                                </span>
                            </div>
                            <button onClick={onClose} className="h-10 w-10 flex items-center justify-center text-slate-300 hover:text-rose-500">
                                <span className="material-symbols-outlined text-2xl">close</span>
                            </button>
                        </div>
                    </div>

                    <div className="p-10 space-y-8 overflow-y-auto">
                        {/* Search Bar */}
                        <div className="relative max-w-md">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-300">search</span>
                            <input
                                type="text"
                                placeholder="Nhập tên sinh viên hoặc MSSV..."
                                className="w-full h-12 pl-12 pr-4 rounded-xl border border-slate-200 outline-none focus:border-blue-500 font-bold"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        {/* Danh sách sinh viên */}
                        <div className="space-y-4">
                            {filteredAttendees.map((sv) => (
                                <div key={sv.id} className="p-5 rounded-2xl border border-slate-100 bg-slate-50/50 flex items-center justify-between hover:bg-white hover:shadow-xl transition-all">
                                    <div className="flex items-center gap-5">
                                        <div className="h-12 w-12 rounded-full border-2 border-white shadow-sm overflow-hidden bg-slate-200 flex items-center justify-center font-bold text-slate-400">
                                            {sv.name.split(' ').pop().charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-base font-bold text-slate-900">{sv.name}</p>
                                            <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">{sv.id} • Lớp {sv.class}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-8">
                                        <div className="text-right">
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Giờ điểm danh</p>
                                            <p className="text-base font-bold text-slate-900 mt-1">{sv.time}</p>
                                        </div>
                                        {sv.status === 'Pending' ? (
                                            <button
                                                onClick={() => handleCheckin(sv.id)}
                                                className="px-6 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold uppercase tracking-widest hover:bg-blue-700 transition-all"
                                            >
                                                Điểm danh
                                            </button>
                                        ) : (
                                            <span className="px-4 py-2 rounded-xl bg-emerald-50 text-emerald-600 text-xs font-bold uppercase tracking-widest border border-emerald-100">
                                                Đã điểm danh
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </div>
    );
};

export default EventManualCheckin;