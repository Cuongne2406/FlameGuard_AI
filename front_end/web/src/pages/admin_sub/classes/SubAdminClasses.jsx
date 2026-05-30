import React, { useState, useEffect } from 'react';
import Toast from '../../../components/ui/Toast';
import Toggle from '../../../components/ui/Toggle';
import Modal from '../../../components/ui/Modal';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import AddClassModal from '../../../components/admin_sub/AddClassModal';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { organizationService } from '../../../services/organizationService';

const SubAdminClasses = () => {
    const [toast, setToast] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [classes, setClasses] = useState([]);
    const [statsData, setStatsData] = useState({ totalClasses: '0', alertClasses: '0', feePercent: '0', totalStudents: '0' });

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const [data, statsRes] = await Promise.all([
                    organizationService.getClassesDetailed(),
                    organizationService.getOrgStats()
                ]);
                setClasses(data);
                if (statsRes) {
                    setStatsData({
                        totalClasses: statsRes.totalClasses || '0',
                        alertClasses: statsRes.alertClasses || '0',
                        feePercent: statsRes.feePercent || '0',
                        totalStudents: statsRes.totalStudents || '0'
                    });
                }
            } catch (err) {
                console.error("Failed to fetch classes:", err);
                setToast({ message: 'Lỗi tải dữ liệu chi đoàn', type: 'error' });
            } finally {
                setLoading(false);
            }
        };
        fetchClasses();
    }, []);
    // Filter states
    const [showFilterPopup, setShowFilterPopup] = useState(false);
    const [filterStatus, setFilterStatus] = useState('Tất cả');
    const [filterRank, setFilterRank] = useState('Tất cả');
    const [tempFilterStatus, setTempFilterStatus] = useState('Tất cả');
    const [tempFilterRank, setTempFilterRank] = useState('Tất cả');
    const [isFilterActive, setIsFilterActive] = useState(false);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Edit / Delete
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedClass, setSelectedClass] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [classToDelete, setClassToDelete] = useState(null);

    // View Members
    const [showMembersModal, setShowMembersModal] = useState(false);
    const [classMembers, setClassMembers] = useState([]);
    const [loadingMembers, setLoadingMembers] = useState(false);

    // Dropdown menu
    const [openDropdownId, setOpenDropdownId] = useState(null);

    const stats = [
        { label: 'Tổng Chi đoàn', val: statsData.totalClasses, sub: '', icon: 'corporate_fare', color: 'blue' },
        { label: 'Cảnh báo Rủi ro', val: `${statsData.alertClasses} Lớp`, sub: '', icon: 'warning', color: 'rose' },
        { label: 'Thu Đoàn phí', val: `${statsData.feePercent}%`, sub: '', icon: 'payments', color: 'emerald' },
        { label: 'Tổng Sinh viên', val: statsData.totalStudents, sub: '', icon: 'groups', color: 'blue', isBadge: true },
    ];

    // Lọc dữ liệu
    const filteredClasses = classes.filter(cls => {
        const statusMatch = filterStatus === 'Tất cả' ||
            (filterStatus === 'Online' && cls.online) ||
            (filterStatus === 'Offline' && !cls.online);

        const rankMatch = filterRank === 'Tất cả' || cls.status === filterRank;

        return statusMatch && rankMatch;
    });

    // Phân trang
    const totalPages = Math.ceil(filteredClasses.length / itemsPerPage);
    const paginatedClasses = filteredClasses.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Mở popup lọc
    const openFilterPopup = () => {
        setTempFilterStatus(filterStatus);
        setTempFilterRank(filterRank);
        setShowFilterPopup(true);
    };

    // Áp dụng lọc
    const applyFilter = () => {
        setFilterStatus(tempFilterStatus);
        setFilterRank(tempFilterRank);
        setIsFilterActive(true);
        setCurrentPage(1);
        setShowFilterPopup(false);
        setToast({ message: 'Đã áp dụng bộ lọc', type: 'success' });
    };

    // Hủy lọc
    const clearFilter = () => {
        setFilterStatus('Tất cả');
        setFilterRank('Tất cả');
        setIsFilterActive(false);
        setCurrentPage(1);
        setToast({ message: 'Đã hủy lọc', type: 'info' });
    };

    // Xuất Excel
    const exportToExcel = () => {
        const data = [
            ['Mã Chi đoàn', 'Tên Chi đoàn', 'Bí thư', 'Sĩ số', 'Tỉ lệ Đoàn phí', 'Điểm hoạt động', 'Xếp loại', 'Ghi chú'],
            ...paginatedClasses.map(cls => [
                cls.id,
                cls.name,
                cls.leader,
                cls.total,
                `${cls.fee}%`,
                cls.activity,
                cls.status,
                cls.alert || ''
            ])
        ];
        const ws = XLSX.utils.aoa_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'ChiDoan');
        const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        saveAs(new Blob([buffer]), 'DanhSach_ChiDoan.xlsx');
        setToast({ message: 'Xuất Excel thành công!', type: 'success' });
    };

    // Thêm chi đoàn
    const handleAddClass = async (modalData) => {
        try {
            const apiData = {
                name: modalData.name,
                type: 'CLASS',
                description: `Chuyên ngành: ${modalData.tech || ''}`,
                status: 'ACTIVE'
            };
            const result = await organizationService.createOrganization(apiData);
            setClasses(prev => [result, ...prev]);
            setToast({ message: '✅ Thêm chi đoàn thành công!', type: 'success' });
        } catch (err) {
            console.error("Failed to add class:", err);
            setToast({ message: '❌ Lỗi khi thêm chi đoàn', type: 'error' });
        }
    };

    // Sửa chi đoàn
    const handleEditClick = (cls) => {
        setSelectedClass({ ...cls });
        setShowEditModal(true);
        setOpenDropdownId(null);
    };

    const saveEdit = async () => {
        try {
            const apiData = {
                name: selectedClass.name,
                fee_percentage: selectedClass.fee,
                activity_points: selectedClass.activity,
                classification: selectedClass.status
            };
            const result = await organizationService.updateOrganization(selectedClass.id, apiData);
            setClasses(prev => prev.map(c => c.id === selectedClass.id ? { ...c, ...result } : c));
            setShowEditModal(false);
            setSelectedClass(null);
            setToast({ message: '✅ Cập nhật chi đoàn thành công!', type: 'success' });
        } catch (err) {
            setToast({ message: '❌ Lỗi khi cập nhật', type: 'error' });
        }
    };

    // Xóa chi đoàn
    const handleDeleteClick = (cls) => {
        setClassToDelete(cls);
        setShowDeleteModal(true);
        setOpenDropdownId(null);
    };

    const confirmDelete = async () => {
        try {
            await organizationService.deleteOrganization(classToDelete.id);
            setClasses(prev => prev.filter(c => c.id !== classToDelete.id));
            setShowDeleteModal(false);
            setClassToDelete(null);
            setToast({ message: '✅ Đã xóa chi đoàn!', type: 'success' });
        } catch (err) {
            setToast({ message: '❌ Lỗi khi xóa', type: 'error' });
        }
    };

    // Xem danh sách sinh viên
    const handleViewMembers = async (cls) => {
        setSelectedClass(cls);
        setShowMembersModal(true);
        setLoadingMembers(true);
        setOpenDropdownId(null);
        try {
            const members = await organizationService.getOrganizationMembers(cls.id);
            setClassMembers(members);
        } catch (error) {
            setToast({ message: 'Lỗi tải danh sách sinh viên', type: 'error' });
            setClassMembers([]);
        } finally {
            setLoadingMembers(false);
        }
    };

    // Chuyển trang
    const goToPage = (page) => {
        setCurrentPage(page);
    };

    return (
        <div className="p-4 md:p-6 lg:p-8 bg-[#F8FAFC] min-h-screen space-y-6 md:space-y-8 font-sans">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 md:gap-6">
                <div>
                    <nav className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                        <span className="material-symbols-outlined text-sm">home</span>
                        <span>Tổng quan</span>
                        <span>/</span>
                        <span className="text-blue-600 underline">Quản lý Chi đoàn</span>
                    </nav>
                    <h1 className="text-xl md:text-2xl font-bold text-slate-900">Danh sách Chi đoàn & Tình trạng Hoạt động</h1>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <select className="h-10 px-4 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-600 outline-none">
                        <option>Năm học: 2025-2026</option>
                    </select>
                    <select className="h-10 px-4 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-600 outline-none">
                        <option>Tháng 11</option>
                    </select>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {stats.map((s, i) => (
                    <div key={i} className="bg-white border border-slate-100 rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-sm flex flex-col justify-between h-32 md:h-40 relative group overflow-hidden hover:shadow-xl transition-all">
                        <div className="flex justify-between items-start">
                            <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">{s.label}</p>
                            <div className={`h-8 w-8 md:h-10 md:w-10 rounded-xl bg-${s.color}-50 text-${s.color}-600 flex items-center justify-center shrink-0 overflow-hidden`}>
                                <span className="material-symbols-outlined text-lg md:text-xl">{s.icon}</span>
                            </div>
                        </div>
                        <div className="space-y-2 md:space-y-3">
                            <p className={`text-2xl md:text-4xl font-bold text-slate-900 tracking-tighter ${s.color === 'rose' ? 'text-rose-600' : ''}`}>{s.val}</p>
                            {s.isBadge ? (
                                <div className="inline-flex items-center gap-2 px-2 md:px-3 py-0.5 md:py-1 bg-blue-50 text-blue-600 rounded-lg text-[8px] md:text-[9px] font-bold uppercase tracking-widest">
                                    <span className="material-symbols-outlined text-[10px] md:text-xs">analytics</span> {s.sub}
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <span className={`h-1.5 w-1.5 rounded-full ${s.color === 'emerald' ? 'bg-emerald-500' : 'bg-orange-500'}`}></span>
                                    <p className={`text-[9px] md:text-[10px] font-bold uppercase tracking-widest ${s.color === 'emerald' ? 'text-emerald-500' : 'text-orange-500'}`}>{s.sub}</p>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Table Section */}
            <div className="bg-white border border-slate-100 rounded-2xl md:rounded-[2.5rem] shadow-sm overflow-hidden">
                <div className="p-4 md:p-6 lg:p-8 border-b border-slate-50 flex flex-col lg:flex-row lg:items-center justify-between gap-4 md:gap-6">
                    <div className="relative w-full lg:max-w-md">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-300">search</span>
                        <input type="text" placeholder="Tìm tên lớp, Bí thư, MSSV..." className="w-full h-10 md:h-12 pl-12 pr-4 rounded-xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-2 ring-blue-500/10 outline-none text-sm font-medium" />
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        {/* Nút Lọc */}
                        <div className="relative">
                            <button
                                onClick={openFilterPopup}
                                className="h-9 md:h-10 px-3 md:px-4 rounded-xl border border-slate-200 bg-white text-slate-600 text-[11px] font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-slate-50 transition-all"
                            >
                                <span className="material-symbols-outlined text-lg">filter_list</span>
                                <span className="hidden sm:inline">Lọc</span>
                                {isFilterActive && <span className="ml-1 h-2 w-2 rounded-full bg-blue-600"></span>}
                            </button>
                            {showFilterPopup && (
                                <div className="absolute right-0 mt-2 w-64 md:w-72 bg-white rounded-2xl shadow-xl border border-slate-200 z-50 p-4 md:p-6">
                                    <p className="text-xs font-bold text-slate-700 mb-4 uppercase tracking-widest">Tùy chọn lọc</p>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Trạng thái</label>
                                            <select
                                                value={tempFilterStatus}
                                                onChange={(e) => setTempFilterStatus(e.target.value)}
                                                className="w-full h-9 md:h-10 px-3 md:px-4 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 outline-none"
                                            >
                                                <option>Tất cả</option>
                                                <option>Online</option>
                                                <option>Offline</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Xếp loại</label>
                                            <select
                                                value={tempFilterRank}
                                                onChange={(e) => setTempFilterRank(e.target.value)}
                                                className="w-full h-9 md:h-10 px-3 md:px-4 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 outline-none"
                                            >
                                                <option>Tất cả</option>
                                                <option>Vững mạnh</option>
                                                <option>Khá</option>
                                                <option>Yếu</option>
                                            </select>
                                        </div>
                                        <div className="flex gap-3 pt-4">
                                            <Button variant="primary" size="sm" className="flex-1" onClick={applyFilter}>Áp dụng</Button>
                                            <Button variant="outline" size="sm" className="flex-1" onClick={() => setShowFilterPopup(false)}>Đóng</Button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Nút Hủy lọc */}
                        {isFilterActive && (
                            <button
                                onClick={clearFilter}
                                className="h-9 md:h-10 px-3 md:px-4 rounded-xl border border-slate-200 bg-white text-rose-600 text-[11px] font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-rose-50 transition-all"
                            >
                                <span className="material-symbols-outlined text-lg">clear</span>
                                <span className="hidden sm:inline">Hủy lọc</span>
                            </button>
                        )}

                        {/* Nút Xuất Excel */}
                        <button
                            onClick={exportToExcel}
                            className="h-9 md:h-10 px-3 md:px-4 rounded-xl border border-slate-200 text-slate-600 text-[11px] font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-slate-50 transition-all"
                        >
                            <span className="material-symbols-outlined text-lg">download</span>
                            <span className="hidden sm:inline">Xuất Excel</span>
                        </button>

                        {/* Nút Thêm Chi đoàn */}
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="h-9 md:h-10 px-4 md:px-6 rounded-xl bg-blue-600 text-white text-[11px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all"
                        >
                            <span className="material-symbols-outlined text-lg font-bold text-white">add</span>
                            <span className="hidden sm:inline">Thêm</span>
                        </button>
                    </div>
                </div>

                {/* Bảng danh sách */}
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[800px] lg:min-w-full">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-4 md:px-6 lg:px-10 py-4 md:py-5 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tên Chi đoàn</th>
                                <th className="px-4 md:px-6 lg:px-8 py-4 md:py-5 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Bí thư</th>
                                <th className="px-4 md:px-6 lg:px-8 py-4 md:py-5 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sĩ số</th>
                                <th className="hidden lg:table-cell px-4 md:px-6 lg:px-8 py-4 md:py-5 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sức khỏe</th>
                                <th className="px-4 md:px-6 lg:px-8 py-4 md:py-5 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Xếp loại</th>
                                <th className="px-4 md:px-6 lg:px-10 py-4 md:py-5 text-right text-[10px] font-bold text-slate-400 uppercase tracking-widest">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {paginatedClasses.map((cls) => (
                                <tr key={cls.id} className="hover:bg-slate-50/50 transition-colors group relative">
                                    <td className="px-4 md:px-6 lg:px-10 py-4 md:py-6">
                                        <p className="text-sm font-bold text-slate-900 uppercase">{cls.id}</p>
                                    </td>
                                    <td className="px-4 md:px-6 lg:px-8 py-4 md:py-6">
                                        <div className="flex items-center gap-2 md:gap-3">
                                            <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-[9px] md:text-[10px] border-2 border-white shadow-sm">{cls.avatar}</div>
                                            <div>
                                                <p className="text-xs md:text-sm font-bold text-slate-700">{cls.leader}</p>
                                                <div className="flex items-center gap-1.5 mt-0.5">
                                                    <span className={`h-1.5 w-1.5 rounded-full ${cls.online ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
                                                    <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                                                        {cls.online ? 'Online' : `Offline ${cls.lastSeen}`}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 md:px-6 lg:px-8 py-4 md:py-6 text-sm font-bold text-slate-500">{cls.total}</td>
                                    <td className="hidden lg:table-cell px-4 md:px-6 lg:px-8 py-4 md:py-6">
                                        <div className="space-y-3 max-w-[180px]">
                                            <div className="flex items-center gap-3">
                                                <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                                                    <div className={`h-full ${cls.fee >= 80 ? 'bg-emerald-500' : cls.fee >= 50 ? 'bg-orange-400' : 'bg-rose-500'} rounded-full`} style={{ width: `${cls.fee}%` }}></div>
                                                </div>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter w-8">{cls.fee}%</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="material-symbols-outlined text-amber-400 text-sm">star</span>
                                                <span className="text-[10px] font-bold text-slate-900 uppercase tracking-widest">{cls.activity} pts</span>
                                            </div>
                                            {cls.alert && (
                                                <div className="flex items-center gap-2 text-rose-500 mt-2">
                                                    <span className="material-symbols-outlined text-[14px]">error</span>
                                                    <p className="text-[9px] font-bold uppercase tracking-widest">{cls.alert}</p>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-4 md:px-6 lg:px-8 py-4 md:py-6">
                                        <span className={`px-3 md:px-4 py-1 md:py-1.5 rounded-2xl bg-${cls.statusColor}-50 text-${cls.statusColor}-600 text-[9px] md:text-[10px] font-bold tracking-widest border border-${cls.statusColor}-100`}>
                                            {cls.status}
                                        </span>
                                    </td>
                                    <td className="px-4 md:px-6 lg:px-10 py-4 md:py-6 text-right relative">
                                        {cls.alert ? (
                                            <button
                                                onClick={() => setToast({ message: 'Đã gửi nhắc nhở!', type: 'success' })}
                                                className="h-8 md:h-10 px-3 md:px-4 rounded-xl border border-rose-200 bg-rose-50 text-rose-600 text-[9px] md:text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-rose-600 hover:text-white transition-all ml-auto"
                                            >
                                                <span className="material-symbols-outlined text-lg">notifications</span>
                                                <span className="hidden sm:inline">Nhắc nhở</span>
                                            </button>
                                        ) : (
                                            <div className="relative">
                                                <button
                                                    onClick={() => setOpenDropdownId(openDropdownId === cls.id ? null : cls.id)}
                                                    className="h-8 md:h-10 w-8 md:w-10 flex items-center justify-center text-slate-300 hover:text-slate-600 transition-colors ml-auto"
                                                >
                                                    <span className="material-symbols-outlined text-xl md:text-2xl">more_vert</span>
                                                </button>
                                                {openDropdownId === cls.id && (
                                                    <div className="absolute right-0 mt-2 w-36 md:w-40 bg-white rounded-xl shadow-xl border border-slate-200 z-50">
                                                        <div className="py-2">
                                                            <button
                                                                onClick={() => handleViewMembers(cls)}
                                                                className="w-full text-left px-3 md:px-4 py-2 text-xs md:text-sm text-blue-600 hover:bg-blue-50 flex items-center gap-2"
                                                            >
                                                                <span className="material-symbols-outlined">group</span>
                                                                Danh sách
                                                            </button>
                                                            <button
                                                                onClick={() => handleEditClick(cls)}
                                                                className="w-full text-left px-3 md:px-4 py-2 text-xs md:text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                                            >
                                                                <span className="material-symbols-outlined">edit</span>
                                                                Sửa
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteClick(cls)}
                                                                className="w-full text-left px-3 md:px-4 py-2 text-xs md:text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                                            >
                                                                <span className="material-symbols-outlined">delete</span>
                                                                Xóa
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Phân trang */}
                {totalPages > 1 && (
                    <div className="p-4 md:p-6 lg:p-8 border-t border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-xs md:text-sm font-bold text-slate-400">
                            Hiển thị {paginatedClasses.length} trên {filteredClasses.length} kết quả
                        </p>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => goToPage(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="h-7 w-7 md:h-8 md:w-8 flex items-center justify-center text-slate-300 hover:text-slate-900 disabled:opacity-50"
                            >
                                <span className="material-symbols-outlined">chevron_left</span>
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                <button
                                    key={page}
                                    onClick={() => goToPage(page)}
                                    className={`h-7 w-7 md:h-8 md:w-8 rounded-lg text-[10px] md:text-[11px] font-bold ${currentPage === page ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-900'}`}
                                >
                                    {page}
                                </button>
                            ))}
                            <button
                                onClick={() => goToPage(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="h-7 w-7 md:h-8 md:w-8 flex items-center justify-center text-slate-300 hover:text-slate-900 disabled:opacity-50"
                            >
                                <span className="material-symbols-outlined">chevron_right</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <footer className="text-center pt-6 md:pt-8 text-[10px] md:text-xs font-medium text-slate-400">
                © 2025 Digital Youth Union System (DYUS). All rights reserved.<br />
                Module: Faculty Class Management Center - Khoa Công Nghệ Thông Tin
            </footer>

            {/* Modal Thêm Chi đoàn */}
            <AddClassModal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                onSubmit={handleAddClass}
            />

            {/* Modal Sửa Chi đoàn */}
            <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Sửa Chi đoàn" size="md">
                {selectedClass && (
                    <div className="space-y-4 py-2">
                        <Input
                            label="Tên Chi đoàn"
                            value={selectedClass.name}
                            onChange={(e) => setSelectedClass({ ...selectedClass, name: e.target.value })}
                        />
                        <Input
                            label="Bí thư"
                            value={selectedClass.leader}
                            onChange={(e) => setSelectedClass({ ...selectedClass, leader: e.target.value })}
                        />
                        <div className="grid grid-cols-2 gap-4 pt-4">
                            <Button variant="outline" onClick={() => setShowEditModal(false)}>Hủy</Button>
                            <Button variant="primary" onClick={saveEdit}>Lưu thay đổi</Button>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Modal Xác nhận Xóa */}
            <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Xác nhận xóa" size="sm">
                {classToDelete && (
                    <div className="space-y-6 py-2">
                        <p className="text-sm text-gray-600">
                            Bạn có chắc muốn xóa chi đoàn <span className="font-bold">{classToDelete.name}</span> không?
                        </p>
                        <div className="flex gap-4">
                            <Button variant="outline" className="flex-1" onClick={() => setShowDeleteModal(false)}>Hủy</Button>
                            <Button variant="danger" className="flex-1" onClick={confirmDelete}>Xóa</Button>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Modal Danh sách Sinh viên */}
            <Modal isOpen={showMembersModal} onClose={() => setShowMembersModal(false)} title={`Danh sách lớp ${selectedClass?.name}`} size="lg">
                <div className="py-2 max-h-[60vh] overflow-y-auto">
                    {loadingMembers ? (
                        <p className="text-center text-sm text-slate-500 py-8">Đang tải danh sách...</p>
                    ) : classMembers.length === 0 ? (
                        <p className="text-center text-sm text-slate-500 py-8">Chưa có sinh viên nào trong lớp này.</p>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-100 bg-slate-50">
                                    <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">STT</th>
                                    <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">MSSV</th>
                                    <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Họ và tên</th>
                                    <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Chức vụ</th>
                                    <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Trạng thái</th>
                                </tr>
                            </thead>
                            <tbody>
                                {classMembers.map((m, idx) => (
                                    <tr key={m.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                                        <td className="px-4 py-3 text-sm font-medium text-slate-500">{idx + 1}</td>
                                        <td className="px-4 py-3 text-sm font-bold text-slate-700">{m.student_id || '---'}</td>
                                        <td className="px-4 py-3 text-sm font-black text-slate-800">{m.full_name}</td>
                                        <td className="px-4 py-3 text-xs font-bold text-blue-600 bg-blue-50/30 rounded-lg inline-block mt-2 ml-2">{m.title}</td>
                                        <td className="px-4 py-3 text-center text-sm">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase ${m.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                                                {m.status === 'ACTIVE' ? 'Hoạt động' : 'Đã khóa'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
                <div className="flex justify-end pt-6 border-t border-slate-100">
                    <Button variant="outline" onClick={() => setShowMembersModal(false)}>Đóng</Button>
                </div>
            </Modal>

            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </div>
    );
};

export default SubAdminClasses;