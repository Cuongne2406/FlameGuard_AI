import React, { useState, useEffect } from 'react';
import Toast from '../../../components/ui/Toast';
import Modal from '../../../components/ui/Modal';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { organizationService } from '../../../services/organizationService';

const SubAdminClubs = () => {
    const [toast, setToast] = useState(null);
    const [loading, setLoading] = useState(true);
    const [clubs, setClubs] = useState([]);

    useEffect(() => {
        const fetchClubs = async () => {
            try {
                const data = await organizationService.getOrganizations('CLUB');
                setClubs(data);
            } catch (err) {
                console.error("Failed to fetch clubs:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchClubs();
    }, []);

    const [proposals, setProposals] = useState([
        {
            id: 'p1',
            title: 'CLB AI: Xin bảo trợ chuyên môn cho cuộc thi Hackathon',
            user: 'Trần Văn Code',
            time: '2 giờ trước',
            icon: 'smart_toy',
            status: 'pending',
        },
        {
            id: 'p2',
            title: 'Đội Văn nghệ: Xin hỗ trợ 2.000.000đ thuê âm thanh',
            user: 'Lê Thị Hát',
            time: '1 ngày trước',
            icon: 'music_note',
            status: 'pending',
        },
        {
            id: 'p3',
            title: 'CLB AI: Đề xuất tổ chức buổi offline tháng 12',
            user: 'Trần Văn Code',
            time: '3 ngày trước',
            icon: 'smart_toy',
            status: 'approved',
        },
    ]);

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showManageModal, setShowManageModal] = useState(false);
    const [showSupportModal, setShowSupportModal] = useState(false);
    const [showAllProposalsModal, setShowAllProposalsModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedClub, setSelectedClub] = useState(null);
    const [selectedProposal, setSelectedProposal] = useState(null);

    const [newClub, setNewClub] = useState({
        name: '',
        leader: '',
        members: '',
        nextEvent: '',
        activity: 0,
        budget: 0,
    });

    const [supportRequest, setSupportRequest] = useState({
        title: '',
        description: '',
        amount: '',
    });

    const handleAction = (msg) => setToast({ message: msg, type: 'success' });

    const handleCreateClub = () => {
        if (!newClub.name) {
            setToast({ message: 'Vui lòng nhập tên CLB', type: 'error' });
            return;
        }
        const club = {
            id: `club-${Date.now()}`,
            name: newClub.name,
            leader: newClub.leader || 'Chưa có',
            members: newClub.members || '0',
            nextEvent: newClub.nextEvent || null,
            activity: newClub.activity || 0,
            budget: newClub.budget || 0,
            status: 'active',
            borderColor: 'blue',
            statusText: 'Mới thành lập',
            statusColor: 'emerald',
            icon: 'groups',
        };
        setClubs([...clubs, club]);
        setShowCreateModal(false);
        setNewClub({ name: '', leader: '', members: '', nextEvent: '', activity: 0, budget: 0 });
        handleAction('Thành lập CLB thành công!');
    };

    const handleManageClub = () => {
        if (!selectedClub) return;
        setClubs(clubs.map(c => c.id === selectedClub.id ? selectedClub : c));
        setShowManageModal(false);
        setSelectedClub(null);
        handleAction('Cập nhật CLB thành công!');
    };

    const handleSupportRequest = () => {
        const newProposal = {
            id: `prop-${Date.now()}`,
            title: supportRequest.title,
            user: 'Bí thư Khoa',
            time: 'Vừa xong',
            icon: 'help',
            status: 'pending',
        };
        setProposals([newProposal, ...proposals]);
        setShowSupportModal(false);
        setSupportRequest({ title: '', description: '', amount: '' });
        handleAction('Đã gửi yêu cầu hỗ trợ!');
    };

    const handleApproveProposal = (proposal) => {
        setProposals(proposals.map(p => p.id === proposal.id ? { ...p, status: 'approved' } : p));
        handleAction('Đã duyệt đề xuất!');
    };

    const handleRejectProposal = (proposal) => {
        setProposals(proposals.filter(p => p.id !== proposal.id));
        if (selectedProposal?.id === proposal.id) setShowDetailModal(false);
        handleAction('Đã từ chối đề xuất!');
    };

    const exportApprovedProposals = () => {
        const approved = proposals.filter(p => p.status === 'approved');
        const data = [
            ['Tiêu đề', 'Người gửi', 'Thời gian'],
            ...approved.map(p => [p.title, p.user, p.time])
        ];
        const ws = XLSX.utils.aoa_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'DeXuatDaDuyet');
        const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        saveAs(new Blob([buffer]), 'DeXuat_DaDuyet.xlsx');
        handleAction('Xuất Excel thành công!');
    };

    return (
        <div className="p-4 md:p-6 lg:p-8 bg-[#F8FAFC] min-h-screen space-y-6 md:space-y-8 font-sans">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-lg">
                        <span className="material-symbols-outlined text-2xl md:text-3xl">diversity_3</span>
                    </div>
                    <div>
                        <h1 className="text-lg md:text-xl lg:text-2xl font-bold text-slate-900">Hệ sinh thái CLB & Đội nhóm</h1>
                        <p className="text-xs md:text-sm text-slate-400 mt-0.5">Quản lý hoạt động, nhân sự và tài chính các tổ chức trực thuộc Đoàn - Hội.</p>
                    </div>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="h-10 md:h-12 px-4 md:px-6 rounded-xl bg-blue-600 text-white text-xs md:text-sm font-bold flex items-center gap-2 shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all w-full lg:w-auto justify-center"
                >
                    <span className="material-symbols-outlined text-xl">add_circle</span> Thành lập CLB mới
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {[
                    { label: 'Tổng số tổ chức', val: '05 CLB/Đội', icon: 'groups', color: 'blue' },
                    { label: 'Nhân sự nòng cốt', val: '150 Thành viên', icon: 'group_work', color: 'indigo' },
                    { label: 'Tổng ngân sách CLB', val: '15.000.000 VNĐ', icon: 'account_balance_wallet', color: 'emerald' },
                ].map((s, i) => (
                    <div key={i} className="bg-white border border-slate-100 rounded-2xl p-4 md:p-6 shadow-sm flex items-center gap-4 hover:shadow-md transition-all">
                        <div className={`h-12 w-12 md:h-16 md:w-16 rounded-xl md:rounded-2xl bg-${s.color}-50 text-${s.color}-600 flex items-center justify-center shrink-0`}>
                            <span className="material-symbols-outlined text-2xl md:text-3xl">{s.icon}</span>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{s.label}</p>
                            <p className="text-lg md:text-2xl font-bold text-slate-900 mt-1 uppercase">{s.val}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Club Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {clubs.map((club) => (
                    <div
                        key={club.id}
                        className={`bg-white border-t-4 border-${club.borderColor}-500 rounded-2xl p-4 md:p-6 shadow-sm space-y-4 hover:shadow-xl transition-all flex flex-col h-full`}
                    >
                        <div className="flex justify-between items-start">
                            <div className="h-12 w-12 md:h-16 md:w-16 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                                <span className="material-symbols-outlined text-2xl md:text-3xl text-slate-400">{club.icon}</span>
                            </div>
                            <span className={`px-2 py-1 md:px-3 md:py-1.5 bg-${club.statusColor}-50 text-${club.statusColor}-600 text-xs font-bold uppercase tracking-widest rounded-lg flex items-center gap-1`}>
                                <span className={`h-1.5 w-1.5 rounded-full bg-${club.statusColor}-500 animate-pulse`}></span>
                                <span className="hidden sm:inline">{club.statusText}</span>
                            </span>
                        </div>
                        <div>
                            <h3 className="text-base md:text-lg font-bold text-slate-900 leading-tight">{club.name}</h3>
                            <p className="text-xs font-bold text-slate-400 mt-1">Chủ nhiệm: {club.leader}</p>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-slate-600">
                                <span className="material-symbols-outlined text-lg opacity-40">group</span>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                    Thành viên: <span className="text-slate-900">{club.members}</span>
                                </p>
                            </div>
                            {club.nextEvent && (
                                <div className="flex items-center gap-2 text-blue-600">
                                    <span className="material-symbols-outlined text-lg opacity-40">event</span>
                                    <p className="text-xs font-bold uppercase tracking-widest">Next: <span className="hover:underline cursor-pointer">{club.nextEvent}</span></p>
                                </div>
                            )}
                        </div>
                        <div className="space-y-2 pt-2 border-t border-slate-50">
                            <div className="space-y-1">
                                <div className="flex justify-between text-xs font-bold text-slate-400 uppercase">
                                    <span>Hoạt động</span>
                                    <span className="text-blue-600">{club.activity}%</span>
                                </div>
                                <div className="h-1.5 rounded-full bg-slate-50">
                                    <div className="h-full bg-blue-500 rounded-full" style={{ width: `${club.activity}%` }}></div>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <div className="flex justify-between text-xs font-bold text-slate-400 uppercase">
                                    <span>Ngân sách</span>
                                    <span className={club.budget < 20 ? 'text-rose-500' : 'text-emerald-500'}>{club.budget}%</span>
                                </div>
                                <div className="h-1.5 rounded-full bg-slate-50">
                                    <div className={`h-full ${club.budget < 20 ? 'bg-rose-500' : 'bg-emerald-500'} rounded-full`} style={{ width: `${club.budget}%` }}></div>
                                </div>
                            </div>
                            {club.warningMsg && (
                                <div className="bg-amber-50 rounded-xl p-4 border border-amber-100 space-y-2 text-center mt-2">
                                    <span className="material-symbols-outlined text-amber-500 text-3xl">warning</span>
                                    <p className="text-xs font-bold text-amber-800">{club.warningMsg}</p>
                                    <p className="text-xs text-amber-600 uppercase tracking-widest font-bold">{club.warningDeadline}</p>
                                </div>
                            )}
                        </div>
                        {club.status === 'warning' ? (
                            <button
                                onClick={() => { setSelectedClub(club); setShowSupportModal(true); }}
                                className="w-full h-10 md:h-12 bg-amber-50 border border-amber-100 rounded-xl text-xs font-bold uppercase tracking-widest text-amber-600 hover:bg-amber-600 hover:text-white transition-all mt-2"
                            >
                                Hỗ trợ tổ chức
                            </button>
                        ) : (
                            <button
                                onClick={() => { setSelectedClub(club); setShowManageModal(true); }}
                                className="w-full h-10 md:h-12 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all mt-2"
                            >
                                Quản lý
                            </button>
                        )}
                    </div>
                ))}
            </div>

            {/* Proposals Section */}
            <div className="bg-white border border-slate-100 rounded-2xl md:rounded-[2.5rem] p-4 md:p-6 lg:p-8 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h3 className="text-base md:text-lg font-bold text-slate-900 flex items-center gap-2">
                        <span className="material-symbols-outlined text-blue-600">rate_review</span> Đề xuất từ các CLB
                    </h3>
                    <button
                        onClick={() => setShowAllProposalsModal(true)}
                        className="text-xs font-bold text-blue-600 underline underline-offset-4 decoration-2"
                    >
                        Xem tất cả
                    </button>
                </div>
                <div className="space-y-3">
                    {proposals.filter(p => p.status === 'pending').slice(0, 2).map((prop) => (
                        <div key={prop.id} className="p-4 rounded-xl border border-slate-50 bg-slate-50/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-white hover:shadow-md transition-all">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400">
                                    <span className="material-symbols-outlined">{prop.icon}</span>
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{prop.title}</p>
                                    <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">{prop.user} • {prop.time}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 self-end sm:self-auto">
                                <button
                                    onClick={() => handleApproveProposal(prop)}
                                    className="h-9 px-4 rounded-xl bg-emerald-600 text-white text-xs font-bold uppercase tracking-widest shadow-lg shadow-emerald-100"
                                >
                                    Duyệt
                                </button>
                                <button
                                    onClick={() => { setSelectedProposal(prop); setShowDetailModal(true); }}
                                    className="h-9 px-4 rounded-xl bg-white border border-slate-200 text-slate-400 text-xs font-bold uppercase tracking-widest"
                                >
                                    Chi tiết
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Approved proposals */}
                <div className="mt-6 pt-4 border-t border-slate-100">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                        <h4 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                            <span className="material-symbols-outlined text-green-600">check_circle</span> Đề xuất đã duyệt
                        </h4>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={exportApprovedProposals}
                            leftIcon={<span className="material-symbols-outlined">download</span>}
                        >
                            Xuất Excel
                        </Button>
                    </div>
                    <div className="space-y-2">
                        {proposals.filter(p => p.status === 'approved').length > 0 ? (
                            proposals.filter(p => p.status === 'approved').map((prop) => (
                                <div key={prop.id} className="p-3 rounded-lg bg-green-50/30 border border-green-100 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="material-symbols-outlined text-green-600">task_alt</span>
                                        <div>
                                            <p className="text-sm font-bold text-slate-800">{prop.title}</p>
                                            <p className="text-xs text-slate-500">{prop.user} • {prop.time}</p>
                                        </div>
                                    </div>
                                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">Đã duyệt</span>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-slate-400 italic">Chưa có đề xuất nào được duyệt.</p>
                        )}
                    </div>
                </div>
            </div>

            <footer className="text-center pt-6 text-xs font-medium text-slate-400">
                © 2025 Digital Youth Union System (DYUS). All rights reserved.<br />
                Module: Faculty Club Management - Khoa Công Nghệ Thông Tin
            </footer>

            {/* Modals (giữ nguyên nội dung, chỉ thêm responsive class) */}
            <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Thành lập CLB mới" size="md">
                <div className="space-y-4 py-2">
                    <Input label="Tên CLB" value={newClub.name} onChange={(e) => setNewClub({ ...newClub, name: e.target.value })} />
                    <Input label="Chủ nhiệm" value={newClub.leader} onChange={(e) => setNewClub({ ...newClub, leader: e.target.value })} />
                    <Input label="Số lượng thành viên" value={newClub.members} onChange={(e) => setNewClub({ ...newClub, members: e.target.value })} />
                    <Input label="Sự kiện sắp tới" value={newClub.nextEvent} onChange={(e) => setNewClub({ ...newClub, nextEvent: e.target.value })} />
                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                        <Button variant="outline" className="flex-1" onClick={() => setShowCreateModal(false)}>Hủy</Button>
                        <Button variant="primary" className="flex-1" onClick={handleCreateClub}>Hoàn tất</Button>
                    </div>
                </div>
            </Modal>

            <Modal isOpen={showManageModal} onClose={() => setShowManageModal(false)} title="Quản lý CLB" size="md">
                {selectedClub && (
                    <div className="space-y-4 py-2">
                        <Input label="Tên CLB" value={selectedClub.name} onChange={(e) => setSelectedClub({ ...selectedClub, name: e.target.value })} />
                        <Input label="Chủ nhiệm" value={selectedClub.leader} onChange={(e) => setSelectedClub({ ...selectedClub, leader: e.target.value })} />
                        <Input label="Số lượng thành viên" value={selectedClub.members} onChange={(e) => setSelectedClub({ ...selectedClub, members: e.target.value })} />
                        <Input label="Sự kiện sắp tới" value={selectedClub.nextEvent || ''} onChange={(e) => setSelectedClub({ ...selectedClub, nextEvent: e.target.value })} />
                        <div className="flex flex-col sm:flex-row gap-3 pt-4">
                            <Button variant="outline" className="flex-1" onClick={() => setShowManageModal(false)}>Hủy</Button>
                            <Button variant="primary" className="flex-1" onClick={handleManageClub}>Lưu thay đổi</Button>
                        </div>
                    </div>
                )}
            </Modal>

            <Modal isOpen={showSupportModal} onClose={() => setShowSupportModal(false)} title="Yêu cầu hỗ trợ" size="md">
                <div className="space-y-4 py-2">
                    <Input label="Tiêu đề" value={supportRequest.title} onChange={(e) => setSupportRequest({ ...supportRequest, title: e.target.value })} />
                    <Input label="Mô tả" value={supportRequest.description} onChange={(e) => setSupportRequest({ ...supportRequest, description: e.target.value })} />
                    <Input label="Số tiền (VNĐ)" value={supportRequest.amount} onChange={(e) => setSupportRequest({ ...supportRequest, amount: e.target.value })} />
                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                        <Button variant="outline" className="flex-1" onClick={() => setShowSupportModal(false)}>Hủy</Button>
                        <Button variant="primary" className="flex-1" onClick={handleSupportRequest}>Gửi yêu cầu</Button>
                    </div>
                </div>
            </Modal>

            <Modal isOpen={showDetailModal} onClose={() => setShowDetailModal(false)} title="Chi tiết đề xuất" size="md">
                {selectedProposal && (
                    <div className="space-y-4 py-2">
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase">Tiêu đề</p>
                            <p className="text-sm font-bold">{selectedProposal.title}</p>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase">Người gửi</p>
                            <p className="text-sm font-bold">{selectedProposal.user}</p>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase">Thời gian</p>
                            <p className="text-sm font-bold">{selectedProposal.time}</p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 pt-4">
                            <Button variant="danger" className="flex-1" onClick={() => handleRejectProposal(selectedProposal)}>
                                Từ chối
                            </Button>
                            <Button variant="primary" className="flex-1" onClick={() => { handleApproveProposal(selectedProposal); setShowDetailModal(false); }}>
                                Duyệt
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>

            <Modal isOpen={showAllProposalsModal} onClose={() => setShowAllProposalsModal(false)} title="Tất cả đề xuất" size="lg">
                <div className="space-y-3 py-2 max-h-96 overflow-y-auto">
                    {proposals.map((prop) => (
                        <div key={prop.id} className="p-3 border rounded-lg flex items-center justify-between">
                            <div>
                                <p className="font-bold text-sm">{prop.title}</p>
                                <p className="text-xs text-slate-500">{prop.user} • {prop.time}</p>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                prop.status === 'approved' ? 'bg-green-100 text-green-700' :
                                prop.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                            }`}>
                                {prop.status === 'approved' ? 'Đã duyệt' : prop.status === 'rejected' ? 'Từ chối' : 'Chờ duyệt'}
                            </span>
                        </div>
                    ))}
                </div>
            </Modal>

            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </div>
    );
};

export default SubAdminClubs;