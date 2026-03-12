import React, { useState, useEffect } from 'react';
import Toast from '../../../components/ui/Toast';
import Modal from '../../../components/ui/Modal';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { eventService } from '../../../services/eventService';
import { financeService } from '../../../services/financeService';

const SubAdminApprovals = () => {
    const [toast, setToast] = useState(null);
    const [activeTab, setActiveTab] = useState('Queue'); // 'Queue' hoặc 'Repo'
    const [searchTerm, setSearchTerm] = useState('');

    const [queueItems, setQueueItems] = useState([]);
    const [repoItems, setRepoItems] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [events, fundReqs] = await Promise.all([
                eventService.getEvents(),
                financeService.getFacultyTransactions()
            ]);

            const allItems = [];

            // Mapping Events
            if (Array.isArray(events)) {
                events.forEach(e => {
                    allItems.push({
                        id: e.id,
                        type: 'event',
                        title: e.name,
                        sender: e.organizer_id || 'System User',
                        subject: e.description,
                        status: e.status || 'PENDING',
                        time: `${e.start_time} - ${e.end_time}`,
                        actions: ['approve', 'reject']
                    });
                });
            }

            // Mapping Finance Requests
            if (Array.isArray(fundReqs)) {
                fundReqs.forEach(f => {
                    allItems.push({
                        id: f.id,
                        type: 'finance',
                        title: f.title || 'Xin quyết toán',
                        sender: f.user || 'System User',
                        subject: f.detail || f.description || '',
                        amount: f.amount ? `${f.amount.toLocaleString()} VNĐ` : '',
                        status: f.status || 'PENDING',
                        actions: ['sign', 'reject']
                    });
                });
            }

            // Split into queue (PENDING) and repo (APPROVED/REJECTED/COMPLETED)
            const pending = allItems.filter(i => i.status === 'PENDING' || i.status === 'DRAFT');
            const done = allItems.filter(i => i.status !== 'PENDING' && i.status !== 'DRAFT');

            setQueueItems(pending);
            setRepoItems(done);
        } catch (error) {
            console.error('Lỗi khi fetch approval items:', error);
            setToast({ message: 'Lỗi tải danh sách phê duyệt: ' + error.message, type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // State cho modal yêu cầu đổi giờ
    const [showRescheduleModal, setShowRescheduleModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [newTime, setNewTime] = useState('');

    // Lọc queue dựa trên searchTerm
    const filteredQueue = queueItems.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.subject && item.subject.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    // Lọc repo
    const filteredRepo = repoItems.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sender.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Xử lý các action
    const handleSignAndPay = async (item) => {
        try {
            await financeService.approveFacultyTransaction(item.id);
            setToast({ message: `Đã ký số và chuyển tiền cho "${item.title}"`, type: 'success' });
            fetchData(); // Reload từ API
        } catch (error) {
            setToast({ message: 'Lỗi ký số: ' + error.message, type: 'error' });
        }
    };

    const handleApprove = async (item) => {
        try {
            if (item.type === 'event') {
                await eventService.updateEvent(item.id, { status: 'APPROVED' });
            } else if (item.type === 'finance') {
                await financeService.approveFacultyTransaction(item.id);
            }
            setToast({ message: `Đã duyệt "${item.title}"`, type: 'success' });
            fetchData();
        } catch (error) {
            setToast({ message: 'Lỗi khi duyệt: ' + error.message, type: 'error' });
        }
    };

    const handleReject = async (item) => {
        try {
            if (item.type === 'event') {
                await eventService.updateEvent(item.id, { status: 'CANCELLED' });
            }
            // Add finance reject if supported
            setToast({ message: `Đã từ chối "${item.title}"`, type: 'info' });
            fetchData();
        } catch (error) {
            setToast({ message: 'Lỗi khi huỷ: ' + error.message, type: 'error' });
        }
    };

    const handleRescheduleRequest = (item) => {
        setSelectedItem(item);
        setNewTime('');
        setShowRescheduleModal(true);
    };

    const submitReschedule = () => {
        setToast({ message: `Đã gửi yêu cầu đổi giờ cho "${selectedItem.title}"`, type: 'success' });
        setShowRescheduleModal(false);
        setSelectedItem(null);
    };

    // Helper để render nút theo action
    const renderActions = (item) => {
        return item.actions.map(action => {
            switch (action) {
                case 'sign':
                    return (
                        <button
                            key="sign"
                            onClick={() => handleSignAndPay(item)}
                            className="h-12 rounded-xl bg-blue-600 text-white text-xs font-bold uppercase tracking-widest shadow-lg shadow-blue-100 flex items-center justify-center gap-2 px-4"
                        >
                            <span className="material-symbols-outlined">history_edu</span> Ký số & Chuyển tiền
                        </button>
                    );
                case 'reject':
                    return (
                        <button
                            key="reject"
                            onClick={() => handleReject(item)}
                            className="h-12 rounded-xl border border-slate-200 text-slate-900 text-xs font-bold uppercase tracking-widest hover:bg-slate-50 px-4"
                        >
                            Từ chối
                        </button>
                    );
                case 'reschedule':
                    return (
                        <button
                            key="reschedule"
                            onClick={() => handleRescheduleRequest(item)}
                            className="h-12 rounded-xl bg-orange-600 text-white text-xs font-bold uppercase tracking-widest shadow-lg shadow-orange-100 flex items-center justify-center gap-2 px-4"
                        >
                            <span className="material-symbols-outlined">update</span> Yêu cầu đổi giờ
                        </button>
                    );
                case 'approve':
                    return (
                        <button
                            key="approve"
                            onClick={() => handleApprove(item)}
                            className="h-12 rounded-xl border border-slate-200 text-slate-900 text-xs font-bold uppercase tracking-widest hover:bg-slate-50 px-4"
                        >
                            Vẫn duyệt
                        </button>
                    );
                default:
                    return null;
            }
        });
    };

    return (
        <div className="p-4 md:p-6 lg:p-8 bg-[#F8FAFC] min-h-screen space-y-6 md:space-y-8 font-sans">
            {/* Header với Search */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <nav className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                        <span className="material-symbols-outlined text-sm">home</span>
                        <span>Tổng quan</span>
                        <span>/</span>
                        <span className="text-blue-600 underline">Xét duyệt & Văn bản</span>
                    </nav>
                    <h1 className="text-xl md:text-2xl font-bold text-slate-900">Trung tâm Hành chính & Xét duyệt Điện tử</h1>
                </div>
                <div className="relative w-full lg:w-96">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-300">search</span>
                    <input
                        type="text"
                        placeholder="Tìm kiếm văn bản, số hiệu, tên người gửi..."
                        className="w-full h-12 pl-12 pr-4 rounded-xl border border-slate-200 bg-white shadow-sm outline-none focus:ring-2 ring-blue-500/10 text-sm font-bold"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {[
                    { label: 'Chờ xử lý', val: queueItems.length.toString().padStart(2, '0'), sub: 'Yêu cầu mới cần duyệt', color: 'orange', icon: 'pending_actions' },
                    { label: 'Đã duyệt tháng này', val: repoItems.length.toString(), sub: 'Hồ sơ hoàn tất', color: 'emerald', icon: 'verified' },
                    { label: 'Văn bản từ Trường', val: '03', sub: 'Văn bản chưa đọc', color: 'blue', icon: 'mail' },
                ].map((s, i) => (
                    <div key={i} className={`bg-white border-l-8 border-${s.color}-500 rounded-2xl p-6 shadow-sm flex items-center gap-4 group hover:shadow-xl transition-all`}>
                        <div className={`h-12 w-12 rounded-xl bg-${s.color}-50 text-${s.color}-600 flex items-center justify-center shrink-0`}>
                            <span className="material-symbols-outlined text-2xl">{s.icon}</span>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">{s.label}</p>
                            <p className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tighter">{s.val}</p>
                            <p className="text-xs font-bold text-emerald-600 mt-2 uppercase tracking-widest">{s.sub}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Section with Tabs */}
            <div className="space-y-6">
                <div className="flex border-b border-slate-200 gap-4 md:gap-8 overflow-x-auto pb-2">
                    <button
                        onClick={() => setActiveTab('Queue')}
                        className={`pb-4 text-sm font-bold uppercase tracking-widest transition-all relative flex items-center gap-2 whitespace-nowrap ${
                            activeTab === 'Queue' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
                        }`}>
                        <span className="material-symbols-outlined">add_box</span> Yêu cầu từ Chi đoàn & CLB ({queueItems.length})
                        {activeTab === 'Queue' && <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-600 rounded-t-full"></div>}
                    </button>
                    <button
                        onClick={() => setActiveTab('Repo')}
                        className={`pb-4 text-sm font-bold uppercase tracking-widest transition-all relative flex items-center gap-2 whitespace-nowrap ${
                            activeTab === 'Repo' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
                        }`}>
                        <span className="material-symbols-outlined">folder_open</span> Quản lý Văn bản Đi/Đến ({repoItems.length})
                        {activeTab === 'Repo' && <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-600 rounded-t-full"></div>}
                    </button>
                </div>

                {/* Nội dung tab */}
                {activeTab === 'Queue' && (
                    <div className="space-y-4 md:space-y-6">
                        {filteredQueue.length === 0 ? (
                            <div className="text-center py-20 bg-white rounded-2xl border border-slate-100">
                                <span className="material-symbols-outlined text-6xl text-slate-300">inbox</span>
                                <p className="text-lg font-bold text-slate-400 mt-4">Không có yêu cầu nào</p>
                            </div>
                        ) : (
                            filteredQueue.map((item) => (
                                <div key={item.id} className="bg-white border border-slate-100 rounded-2xl p-6 md:p-8 shadow-sm space-y-4 md:space-y-6 group hover:shadow-xl transition-all border-l-8 border-transparent hover:border-blue-500">
                                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                        <div className="flex items-start gap-4">
                                            <div className={`h-12 w-12 md:h-16 md:w-16 rounded-2xl ${
                                                item.type === 'finance' ? 'bg-emerald-50 text-emerald-500' :
                                                item.type === 'facility' ? 'bg-indigo-50 text-indigo-500' :
                                                'bg-indigo-50 text-indigo-500'
                                            } flex items-center justify-center border border-slate-100 shadow-sm shrink-0`}>
                                                <span className="material-symbols-outlined text-2xl md:text-3xl">
                                                    {item.type === 'finance' ? 'payments' : item.type === 'facility' ? 'apartment' : 'assignment'}
                                                </span>
                                            </div>
                                            <div className="space-y-1 md:space-y-2">
                                                <h3 className="text-lg md:text-xl font-bold text-slate-900 uppercase">{item.title}</h3>
                                                <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest flex-wrap">
                                                    <span>Gửi bởi: <span className="text-blue-600">{item.sender}</span></span>
                                                </div>
                                                <p className="text-sm font-medium text-slate-600 mt-2 leading-relaxed">{item.subject}</p>
                                                <div className="flex flex-wrap items-center gap-4 mt-2">
                                                    {item.amount && (
                                                        <p className="text-xs font-bold text-slate-400 uppercase">Tổng tiền: <span className="text-slate-900">{item.amount}</span></p>
                                                    )}
                                                    {item.file && (
                                                        <div className="flex items-center gap-2 text-blue-600 text-xs font-bold underline underline-offset-4 decoration-2 cursor-pointer">
                                                            <span className="material-symbols-outlined text-sm">picture_as_pdf</span> {item.file}
                                                        </div>
                                                    )}
                                                    {item.time && (
                                                        <p className="text-xs font-bold text-slate-400 uppercase flex items-center gap-2">
                                                            <span className="material-symbols-outlined text-sm">schedule</span> {item.time}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full lg:w-64">
                                            {renderActions(item)}
                                        </div>
                                    </div>
                                    {item.aiStatus && (
                                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-xs font-bold border border-emerald-100">
                                            <span className="material-symbols-outlined text-sm">auto_awesome</span> AI Check: {item.aiStatus}
                                        </div>
                                    )}
                                    {item.conflict && (
                                        <div className="bg-amber-50 rounded-xl p-4 border border-amber-100 flex items-start gap-3 text-amber-800">
                                            <span className="material-symbols-outlined">warning</span>
                                            <p className="text-xs font-bold leading-relaxed">{item.conflict}</p>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                )}

                {activeTab === 'Repo' && (
                    <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[600px]">
                                <thead>
                                    <tr className="bg-slate-50/50">
                                        <th className="px-4 md:px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">Văn bản</th>
                                        <th className="px-4 md:px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">Người gửi</th>
                                        <th className="px-4 md:px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">Ngày duyệt</th>
                                        <th className="px-4 md:px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">Loại</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {filteredRepo.map((doc) => (
                                        <tr key={doc.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-4 md:px-6 py-4">
                                                <p className="text-sm font-bold text-slate-900">{doc.title}</p>
                                                {doc.details && <p className="text-xs font-medium text-slate-400 mt-1">{doc.details}</p>}
                                            </td>
                                            <td className="px-4 md:px-6 py-4 text-sm font-bold text-slate-700">{doc.sender}</td>
                                            <td className="px-4 md:px-6 py-4 text-sm font-bold text-slate-500">{doc.approvedDate}</td>
                                            <td className="px-4 md:px-6 py-4">
                                                <span className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest ${
                                                    doc.type === 'finance' ? 'bg-emerald-50 text-emerald-600' :
                                                    doc.type === 'event' ? 'bg-blue-50 text-blue-600' :
                                                    'bg-purple-50 text-purple-600'
                                                }`}>
                                                    {doc.type === 'finance' ? 'Tài chính' : doc.type === 'event' ? 'Sự kiện' : 'Quyết định'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            <footer className="text-center pt-8 text-xs font-medium text-slate-400 italic">
                © 2025 Digital Youth Union System (DYUS). All rights reserved.<br />
                Module: Approval & Document Center v2.0 - Khoa Công Nghệ Thông Tin
            </footer>

            {/* Modal yêu cầu đổi giờ */}
            <Modal isOpen={showRescheduleModal} onClose={() => setShowRescheduleModal(false)} title="Yêu cầu đổi giờ" size="md">
                <div className="space-y-6 py-4">
                    <p className="text-sm text-slate-600">Nhập thời gian mới cho yêu cầu:</p>
                    <Input
                        type="datetime-local"
                        value={newTime}
                        onChange={(e) => setNewTime(e.target.value)}
                        className="w-full"
                    />
                    <div className="flex gap-4 pt-4">
                        <Button variant="outline" className="flex-1" onClick={() => setShowRescheduleModal(false)}>Hủy</Button>
                        <Button variant="primary" className="flex-1" onClick={submitReschedule}>Gửi yêu cầu</Button>
                    </div>
                </div>
            </Modal>

            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </div>
    );
};

export default SubAdminApprovals;