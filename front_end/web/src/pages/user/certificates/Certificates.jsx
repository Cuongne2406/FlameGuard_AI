import React, { useState, useEffect } from 'react';
import { CertificateCard, Tabs, Pagination, Input, Button, Modal, Badge } from '../../../components/ui';

/**
 * Certificates Page - Kho chứng nhận (Đã kết nối API /me)
 */
const Certificates = () => {
    const tabs = [
        { id: 'all', label: 'Tất cả' },
        { id: 'volunteer', label: 'Tình nguyện' },
        { id: 'academic', label: 'Học thuật' },
        { id: 'award', label: 'Khen thưởng năm học' },
    ];

    // --- STATE QUẢN LÝ DỮ LIỆU & UI ---
    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedCert, setSelectedCert] = useState(null);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // Filter states
    const [filterMonth, setFilterMonth] = useState('');
    const [filterYear, setFilterYear] = useState('');
    const [filterLevel, setFilterLevel] = useState('');

    // --- 1. HÀM GỌI API LẤY DỮ LIỆU ---
    const fetchCertificates = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("access_token");
            
            // Xây dựng tham số lọc gửi lên Backend
            const params = new URLSearchParams();
            if (activeTab !== 'all') params.append('type', activeTab);
            if (searchQuery) params.append('search', searchQuery);
            if (filterYear) params.append('year', filterYear);
            if (filterLevel) params.append('level', filterLevel);
            
            const response = await fetch(`http://127.0.0.1:8000/api/v1/certificates/me?${params.toString()}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setCertificates(data);
            }
        } catch (error) {
            console.error("Lỗi tải chứng nhận:", error);
        } finally {
            setLoading(false);
        }
    };

    // Tự động tải lại khi các bộ lọc chính thay đổi
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchCertificates();
            setCurrentPage(1); // Reset về trang 1 khi lọc
        }, 300); // Đợi 300ms để tránh gọi API liên tục khi gõ search

        return () => clearTimeout(delayDebounceFn);
    }, [activeTab, searchQuery, filterYear, filterLevel]);

    // --- 2. LOGIC LỌC TẠI CLIENT (Dành cho lọc Tháng) ---
    const displayCerts = certificates.filter(c => !filterMonth || c.month === filterMonth);

    // Phân trang
    const itemsPerPage = 6;
    const totalPages = Math.ceil(displayCerts.length / itemsPerPage);
    const paginatedCerts = displayCerts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Kho Chứng Nhận</h1>
                    <p className="text-gray-500 mt-1">Lưu trữ và quản lý tất cả chứng nhận điện tử của bạn.</p>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <Input
                        placeholder="Tìm chứng nhận..."
                        leftIcon={<span className="material-symbols-outlined">search</span>}
                        className="w-full md:w-64"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Button
                        variant="outline"
                        leftIcon={<span className="material-symbols-outlined">filter_list</span>}
                        onClick={() => setIsFilterOpen(true)}
                    >
                        Lọc
                    </Button>
                </div>
            </div>

            {/* Tabs */}
            <Tabs
                tabs={tabs}
                defaultTab={activeTab}
                onChange={setActiveTab}
                variant="pills"
            />

            {/* Grid Dữ liệu */}
            {loading ? (
                <div className="py-20 text-center text-gray-400">Đang truy xuất kho dữ liệu...</div>
            ) : paginatedCerts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {paginatedCerts.map((cert) => (
                        <CertificateCard
                            key={cert.id}
                            {...cert}
                            onViewDetail={() => setSelectedCert(cert)}
                        />
                    ))}
                </div>
            ) : (
                <div className="py-20 text-center bg-white rounded-2xl border border-dashed border-gray-200">
                    <span className="material-symbols-outlined text-5xl text-gray-200 mb-2">folder_open</span>
                    <p className="text-gray-500 font-medium">Không tìm thấy chứng nhận nào</p>
                    <p className="text-gray-400 text-sm">Vui lòng thay đổi bộ lọc hoặc từ khóa tìm kiếm.</p>
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center pt-6">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </div>
            )}

            {/* Modal Chi tiết (DỮ LIỆU ĐỘNG) */}
            <Modal
                isOpen={!!selectedCert}
                onClose={() => setSelectedCert(null)}
                title="Chi tiết chứng nhận"
                footer={
                    <div className="flex justify-end gap-3">
                        <Button variant="outline" onClick={() => setSelectedCert(null)}>Đóng</Button>
                        <Button variant="primary" leftIcon={<span className="material-symbols-outlined">download</span>}>
                            Tải file gốc
                        </Button>
                    </div>
                }
            >
                {selectedCert && (
                    <div className="space-y-6">
                        <div className="aspect-[4/3] rounded-xl overflow-hidden border border-gray-100 shadow-sm">
                            <img src={selectedCert.image} alt={selectedCert.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between items-start gap-4">
                                <h4 className="text-xl font-bold text-gray-900 leading-tight">
                                    {selectedCert.title}
                                </h4>
                                <Badge variant="primary" className="shrink-0">{selectedCert.code}</Badge>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                                <div className="space-y-1">
                                    <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Đơn vị cấp</p>
                                    <p className="text-sm font-semibold text-gray-700">{selectedCert.issuer}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Thời gian</p>
                                    <p className="text-sm font-semibold text-gray-700">{selectedCert.date}</p>
                                </div>
                            </div>
                            <div className="space-y-1 pt-2">
                                <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Mô tả thành tích</p>
                                <p className="text-sm text-gray-600 leading-relaxed italic border-l-4 border-primary/20 pl-3">
                                    "{selectedCert.description || "Thành tích được ghi nhận chính thức trên hệ thống quản lý Đoàn viên."}"
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Modal Bộ lọc */}
            <Modal
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                title="Lọc chứng nhận"
                footer={
                    <div className="flex justify-end gap-3">
                        <Button variant="outline" onClick={() => {
                            setFilterMonth('');
                            setFilterYear('');
                            setFilterLevel('');
                            setIsFilterOpen(false);
                        }}>Xóa lọc</Button>
                        <Button variant="primary" onClick={() => setIsFilterOpen(false)}>Áp dụng</Button>
                    </div>
                }
            >
                <div className="space-y-6">
                    <div className="space-y-3">
                        <label className="text-sm font-bold text-gray-700">Theo thời gian</label>
                        <div className="grid grid-cols-2 gap-4">
                            <select
                                value={filterMonth}
                                onChange={(e) => setFilterMonth(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-100 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                            >
                                <option value="">Tất cả các tháng</option>
                                {[...Array(12)].map((_, i) => (
                                    <option key={i + 1} value={`Tháng ${i + 1}`}>Tháng {i + 1}</option>
                                ))}
                            </select>
                            <select
                                value={filterYear}
                                onChange={(e) => setFilterYear(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-100 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                            >
                                <option value="">Tất cả các năm</option>
                                <option value="2024">2024</option>
                                <option value="2023">2023</option>
                                <option value="2022">2022</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-sm font-bold text-gray-700">Cấp khen thưởng</label>
                        <div className="flex flex-wrap gap-2">
                            {['Cấp Thành phố', 'Cấp Trường', 'Cấp Khoa', 'Cấp CLB'].map(level => (
                                <button
                                    key={level}
                                    onClick={() => setFilterLevel(level === filterLevel ? '' : level)}
                                    className={`px-4 py-2 rounded-full border transition-all text-xs font-medium ${filterLevel === level
                                            ? 'bg-primary border-primary text-white shadow-md'
                                            : 'border-gray-100 bg-gray-50 text-gray-600 hover:bg-gray-100'
                                        }`}
                                >
                                    {level}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default Certificates;