import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Toast from '../../../components/ui/Toast';
import CreateEvent from '../../../components/common/CreateEvent';
import EditEvent from '../../../components/common/EditEvent';
import EventManualCheckin from './EventManualCheckin';
import { eventService } from '../../../services/eventService';

const SubAdminEvents = () => {
    const navigate = useNavigate();
    const [toast, setToast] = useState(null);
    const [activeTab, setActiveTab] = useState('Tất cả');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [showManualCheckinModal, setShowManualCheckinModal] = useState(false);
    const [selectedEventId, setSelectedEventId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [events, setEvents] = useState([]);
    const [statsData, setStatsData] = useState({ totalEvents: '0', totalParticipants: '0', totalBudget: '0' });

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const data = await eventService.getEvents();
            // Map the backend event data to match the UI structure roughly
            const mappedEvents = data.map(ev => ({
                id: ev.id,
                title: ev.name,
                time: String(ev.start_time),
                location: ev.location,
                type: ev.event_type || 'Sự kiện Cáo Khoa',
                status: ev.status === 'PUBLISHED' ? 'Đang mở đăng ký' : ev.status === 'DRAFT' ? 'Sắp tới' : ev.status === 'COMPLETED' ? 'Đã kết thúc' : 'Đang diễn ra (Live)',
                statusColor: ev.status === 'PUBLISHED' ? 'orange' : ev.status === 'COMPLETED' ? 'emerald' : 'blue',
                progress: null, // Dynamic features to be added later
                attendees: `${ev.current_participants || 0}/${ev.max_participants || 100}`,
                actions: ev.status === 'COMPLETED' 
                    ? [{ label: 'Xem tổng kết', icon: 'summarize', primary: false, showFor: ['ended'] }]
                    : [
                        { label: 'Điểm danh thủ công', icon: 'person_search', primary: true, showFor: ['live'] },
                        { label: 'Xem báo cáo', icon: 'analytics', primary: false, showFor: ['live', 'ended'] },
                        { label: 'Duyệt danh sách thi', icon: 'fact_check', primary: false, showFor: ['open'] },
                        { label: 'Chỉnh sửa', icon: 'edit', primary: false, showFor: ['upcoming', 'open'] }
                    ]
            }));
            setEvents(mappedEvents);

            // Tải dữ liệu thống kê sự kiện
            const statsRes = await eventService.getEventStats();
            if (statsRes) {
                setStatsData({
                    totalEvents: statsRes.totalEvents || '0',
                    totalParticipants: statsRes.totalParticipants || '0',
                    totalBudget: statsRes.totalBudget || '0'
                });
            }
        } catch (err) {
            console.error("Failed to fetch events:", err);
            // Fallback to empty if fails
        } finally {
            setLoading(false);
        }
    };

    const stats = [
        { label: 'Tổng sự kiện năm', val: statsData.totalEvents, sub: '', icon: 'event_note', color: 'blue' },
        { label: 'Lượt tham gia', val: statsData.totalParticipants, sub: '', icon: 'groups', color: 'blue' },
        { label: 'Kinh phí đã chi', val: statsData.totalBudget, unit: 'VNĐ', sub: '', icon: 'payments', color: 'orange' },
    ];

    const getEventState = (status) => {
        if (status.includes('Đang diễn ra') || status.includes('Live')) return 'live';
        if (status.includes('Đang mở đăng ký')) return 'open';
        if (status.includes('Sắp tới')) return 'upcoming';
        if (status.includes('Đã kết thúc')) return 'ended';
        return 'upcoming';
    };

    const filteredEvents = events.filter(event => {
        if (activeTab === 'Tất cả') return true;
        if (activeTab === 'Đang diễn ra (Live)') return event.status.includes('Đang diễn ra') || event.status.includes('Đang mở');
        if (activeTab === 'Sắp tới') return event.status === 'Sắp tới';
        if (activeTab === 'Đã kết thúc') return event.status === 'Đã kết thúc';
        return true;
    });

    const handleAction = (msg) => {
        setToast({ message: msg, type: 'success' });
    };

    const handleCreateSuccess = (newEvent) => {
        setEvents(prev => [newEvent, ...prev]);
        setToast({ message: 'Tạo sự kiện thành công!', type: 'success' });
    };

    const handleEditSuccess = (updatedEvent) => {
        setEvents(prev => prev.map(e => e.id === updatedEvent.id ? updatedEvent : e));
        setToast({ message: 'Cập nhật sự kiện thành công!', type: 'success' });
    };

    const handleDelete = async (eventId) => {
        if (window.confirm('Bạn có chắc muốn xóa sự kiện này?')) {
            try {
                await eventService.deleteEvent(eventId);
                setEvents(prev => prev.filter(e => e.id !== eventId));
                setToast({ message: 'Đã xóa sự kiện!', type: 'success' });
            } catch (err) {
                 setToast({ message: 'Lỗi khi xóa sự kiện', type: 'error' });
            }
        }
    };

    const handleActionClick = (action, event) => {
        const state = getEventState(event.status);
        if (action.label === 'Điểm danh thủ công' && state === 'live') {
            setSelectedEventId(event.id);
            setShowManualCheckinModal(true);
        } else if (action.label === 'Xem báo cáo' && (state === 'live' || state === 'ended')) {
            navigate(`/admin_sub/events/${event.id}/live`);
        } else if (action.label === 'Duyệt danh sách thi' && state === 'open') {
            navigate(`/admin_sub/events/${event.id}/registrations`);
        } else if (action.label === 'Chỉnh sửa' && (state === 'upcoming' || state === 'open')) {
            setSelectedEvent(event);
            setShowEditModal(true);
        } else if (action.label === 'Xem tổng kết' && state === 'ended') {
            navigate(`/admin_sub/events/${event.id}/feedback`);
        }
    };

    return (
        <div className="p-4 md:p-6 lg:p-8 bg-[#F8FAFC] min-h-screen space-y-6 md:space-y-8 font-sans">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 lg:gap-6">
                <div>
                    <nav className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                        <span className="material-symbols-outlined text-sm">home</span>
                        <span>Tổng quan</span>
                        <span>/</span>
                        <span className="text-blue-600 underline">Sự kiện Khoa</span>
                    </nav>
                    <h1 className="text-xl md:text-2xl font-bold text-slate-900">Quản lý Sự kiện & Phong trào Khoa CNTT</h1>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <select className="h-10 px-4 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-600 outline-none">
                        <option>Năm học 2025-2026</option>
                    </select>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="h-10 md:h-12 px-4 md:px-6 rounded-xl bg-blue-600 text-white text-xs font-bold uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all"
                    >
                        <span className="material-symbols-outlined text-lg font-bold">add</span>
                        <span className="hidden sm:inline">Tạo Sự kiện Mới</span>
                        <span className="sm:hidden">Tạo</span>
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
                {stats.map((s, i) => (
                    <div key={i} className="bg-white border border-slate-100 rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-sm flex flex-col justify-between h-40 md:h-44 relative group overflow-hidden hover:shadow-xl transition-all">
                        <div className="flex justify-between items-start">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{s.label}</p>
                            <div className={`h-10 w-10 md:h-12 md:w-12 rounded-xl md:rounded-2xl bg-${s.color}-50 text-${s.color}-600 flex items-center justify-center shrink-0`}>
                                <span className="material-symbols-outlined text-xl md:text-2xl">{s.icon}</span>
                            </div>
                        </div>
                        <div className="space-y-2 md:space-y-3">
                            <div className="flex items-baseline gap-2">
                                <p className="text-2xl md:text-4xl font-bold text-slate-900 tracking-tighter">{s.val}</p>
                                {s.unit && <span className="text-xs font-bold text-slate-400 uppercase">{s.unit}</span>}
                            </div>
                            {s.sub && (
                                <div className="inline-flex items-center gap-2 px-2 md:px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold uppercase tracking-widest">
                                    <span className="material-symbols-outlined text-xs">trending_up</span> {s.sub}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Filter Tabs */}
            <div className="space-y-6">
                <div className="overflow-x-auto pb-2 -mx-4 px-4">
                    <div className="flex gap-2 min-w-max">
                        {['Tất cả', 'Đang diễn ra (Live)', 'Sắp tới', 'Đã kết thúc'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`h-10 px-4 md:px-6 rounded-xl text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-all ${
                                    activeTab === tab
                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-100'
                                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Event List */}
                <div className="space-y-4 md:space-y-6 lg:space-y-8 pb-10">
                    {filteredEvents.length === 0 ? (
                        <div className="text-center py-16 md:py-20 bg-white rounded-2xl md:rounded-[2.5rem] border border-slate-100">
                            <span className="material-symbols-outlined text-5xl md:text-6xl text-slate-300">event_busy</span>
                            <p className="text-base md:text-lg font-bold text-slate-400 mt-4">Không có sự kiện nào</p>
                        </div>
                    ) : (
                        filteredEvents.map((ev) => {
                            const state = getEventState(ev.status);
                            return (
                                <div
                                    key={ev.id}
                                    className="bg-white border border-slate-100 rounded-2xl md:rounded-[2.5rem] p-6 md:p-8 lg:p-10 shadow-sm relative group hover:shadow-2xl transition-all border-l-4 md:border-l-8 overflow-hidden"
                                    style={{ borderLeftColor: ev.statusColor === 'blue' ? '#2563eb' : ev.statusColor === 'orange' ? '#f97316' : '#10b981' }}
                                >
                                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 md:gap-8 lg:gap-10">
                                        <div className="flex-1 space-y-4 md:space-y-6">
                                            <div className="flex flex-wrap items-center gap-2 md:gap-4">
                                                <span className={`px-3 md:px-4 py-1 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center gap-2 ${
                                                    ev.statusColor === 'blue' ? 'bg-blue-50 text-blue-600' :
                                                    ev.statusColor === 'orange' ? 'bg-orange-50 text-orange-600' :
                                                    'bg-emerald-50 text-emerald-600'
                                                }`}>
                                                    <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse"></span>
                                                    {ev.status}
                                                </span>
                                                <span className="px-3 md:px-4 py-1 bg-slate-50 text-slate-400 rounded-xl text-xs font-bold uppercase tracking-widest border border-slate-100">
                                                    {ev.type}
                                                </span>
                                            </div>
                                            <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-slate-900 uppercase">{ev.title}</h3>
                                            <div className="flex flex-wrap items-center gap-4 md:gap-6 lg:gap-8">
                                                <div className="flex items-center gap-2 text-slate-400">
                                                    <span className="material-symbols-outlined text-lg md:text-xl">schedule</span>
                                                    <p className="text-sm font-bold text-slate-600">{ev.time}</p>
                                                </div>
                                                {ev.location && (
                                                    <div className="flex items-center gap-2 text-slate-400">
                                                        <span className="material-symbols-outlined text-lg md:text-xl">location_on</span>
                                                        <p className="text-sm font-bold text-slate-600">{ev.location}</p>
                                                    </div>
                                                )}
                                                {ev.attendees && (
                                                    <div className="flex items-center gap-2 text-slate-400">
                                                        <span className="material-symbols-outlined text-lg md:text-xl">groups</span>
                                                        <p className="text-sm font-bold text-slate-600">{ev.attendees} tham gia</p>
                                                    </div>
                                                )}
                                            </div>

                                            {ev.progress && (
                                                <div className="max-w-xl p-4 md:p-6 rounded-xl md:rounded-2xl bg-slate-50/50 border border-slate-50">
                                                    <div className="flex justify-between items-end mb-3 md:mb-4">
                                                        <p className="text-xs font-bold text-slate-900 uppercase tracking-widest">Check-in Realtime</p>
                                                        <p className="text-sm font-bold text-blue-600 uppercase">{ev.attendees} ({ev.progress}%)</p>
                                                    </div>
                                                    <div className="h-2 w-full bg-white rounded-full overflow-hidden shadow-inner border border-slate-100">
                                                        <div className="h-full bg-blue-600 rounded-full transition-all duration-1000" style={{ width: `${ev.progress}%` }}></div>
                                                    </div>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase mt-2 tracking-widest flex items-center gap-2">
                                                        <span className="material-symbols-outlined text-xs">sync</span> Hệ thống đang ghi nhận check-in qua QR Code...
                                                    </p>
                                                </div>
                                            )}

                                            {ev.count && (
                                                <div className="flex items-center gap-2 text-orange-600">
                                                    <span className="material-symbols-outlined text-lg">info</span>
                                                    <p className="text-sm font-bold tracking-tight">{ev.count}</p>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex flex-col sm:flex-row lg:flex-col gap-3 min-w-[200px] md:min-w-[240px]">
                                            {ev.actions
                                                .filter(act => act.showFor.includes(state))
                                                .map((act, i) => (
                                                    <button
                                                        key={i}
                                                        onClick={() => handleActionClick(act, ev)}
                                                        className={`h-10 md:h-12 w-full px-4 md:px-8 rounded-xl md:rounded-2xl flex items-center justify-center gap-2 md:gap-3 text-xs font-bold uppercase tracking-widest transition-all shadow-sm ${
                                                            act.primary
                                                                ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-100'
                                                                : 'bg-white border border-slate-200 text-slate-900 hover:bg-slate-50'
                                                        }`}
                                                    >
                                                        <span className="material-symbols-outlined text-lg md:text-xl">{act.icon}</span>
                                                        <span className="hidden sm:inline">{act.label}</span>
                                                    </button>
                                                ))}
                                            {(state === 'upcoming' || state === 'ended') && (
                                                <button
                                                    onClick={() => handleDelete(ev.id)}
                                                    className="h-10 md:h-12 w-full px-4 md:px-8 rounded-xl md:rounded-2xl flex items-center justify-center gap-2 md:gap-3 text-xs font-bold uppercase tracking-widest transition-all shadow-sm bg-white border border-rose-200 text-rose-600 hover:bg-rose-50"
                                                >
                                                    <span className="material-symbols-outlined text-lg md:text-xl">delete</span>
                                                    <span className="hidden sm:inline">Xóa</span>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            <footer className="text-center pt-6 md:pt-8 text-xs font-medium text-slate-400 italic">
                © 2025 Digital Youth Union System (DYUS). All rights reserved.<br />
                Module: Faculty Event Management Center - Khoa Công Nghệ Thông Tin
            </footer>

            <CreateEvent
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onSuccess={handleCreateSuccess}
            />

            <EditEvent
                isOpen={showEditModal}
                onClose={() => setShowEditModal(false)}
                event={selectedEvent}
                onSuccess={handleEditSuccess}
            />

            {showManualCheckinModal && (
                <EventManualCheckin
                    eventId={selectedEventId}
                    onClose={() => setShowManualCheckinModal(false)}
                />
            )}

            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </div>
    );
};

export default SubAdminEvents;