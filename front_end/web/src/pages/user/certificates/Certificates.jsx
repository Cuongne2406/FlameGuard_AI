import React from 'react';
import { useState } from 'react';
import { CertificateCard, Tabs, Pagination, Input, Button, Modal, Badge } from '../../../components/ui';

/**
 * Certificates Page - Kho chứng nhận
 */
const Certificates = () => {
    const tabs = [
        { id: 'all', label: 'Tất cả' },
        { id: 'volunteer', label: 'Tình nguyện' },
        { id: 'academic', label: 'Học thuật' },
        { id: 'award', label: 'Khen thưởng năm học' },
    ];

    const [activeTab, setActiveTab] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedCert, setSelectedCert] = useState(null);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // Filter states
    const [filterMonth, setFilterMonth] = useState('');
    const [filterYear, setFilterYear] = useState('');
    const [filterLevel, setFilterLevel] = useState('');

    // Mock data (updated with level info)
    const certificates = [
        {
            id: 1,
            type: 'academic',
            title: 'Giải Nhất Olympic Tin Học 2023',
            issuer: 'Hội Sinh Viên Trường',
            date: '10/05/2023',
            month: 'Tháng 5',
            year: '2023',
            level: 'Cấp Trường',
            code: 'CERT-IT-2023',
            image: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800&q=80',
            verified: true,
            description: 'Đạt thành tích xuất sắc trong kỳ thi Olympic Tin học sinh viên cấp trường năm 2023.'
        },
        {
            id: 2,
            type: 'award',
            title: 'Đoàn Viên Xuất Sắc 2022-2023',
            issuer: 'BCH Đoàn Trường ĐH CNTT',
            year: '2022',
            month: 'Tháng 6',
            level: 'Cấp Khoa',
            code: 'AWARD-2223',
            image: 'https://images.unsplash.com/photo-1579548122080-c35fd6820ecb?w=800&q=80',
            verified: true,
            description: 'Khen thưởng cá nhân có thành tích xuất sắc trong công tác Đoàn và phong trào thanh niên năm học 2022-2023.'
        },
        {
            id: 3,
            type: 'volunteer',
            title: 'Chiến dịch Mùa hè xanh 2023',
            issuer: 'Đoàn Khoa Công nghệ Thông tin',
            date: '15/08/2023',
            month: 'Tháng 8',
            year: '2023',
            level: 'Cấp Thành phố',
            code: 'VOL-MHX-2023',
            image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&q=80',
            verified: true,
            description: 'Tham gia tích cực và hoàn thành tốt nhiệm vụ trong chiến dịch tình nguyện Mùa hè xanh năm 2023 tại địa phương.'
        },
        {
            id: 4,
            type: 'summer',
            title: 'Giấy chứng nhận Sinh viên 5 tốt cấp Trường',
            issuer: 'Hội Sinh Viên Trường',
            year: '2024',
            month: 'Tháng 1',
            level: 'Cấp Trường',
            code: 'SV5T-2024',
            image: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=800&q=80',
            verified: true,
            description: 'Đạt danh hiệu Sinh viên 5 tốt cấp Trường năm học 2023-2024 dựa trên các tiêu chí: Học tập tốt, Đạo đức tốt, Thể lực tốt, Tình nguyện tốt và Hội nhập tốt.'
        }
    ];

    const filteredCerts = certificates
        .filter(c => activeTab === 'all' || c.type === activeTab || (activeTab === 'volunteer' && ['volunteer', 'summer', 'blood'].includes(c.type)))
        .filter(c => c.title.toLowerCase().includes(searchQuery.toLowerCase()))
        .filter(c => !filterMonth || c.month === filterMonth)
        .filter(c => !filterYear || c.year === filterYear)
        .filter(c => !filterLevel || c.level === filterLevel);

    // Phân trang thực tế
    const itemsPerPage = 3;
    const totalPages = Math.ceil(filteredCerts.length / itemsPerPage);
    const paginatedCerts = filteredCerts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div className="space-y-6">
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
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setCurrentPage(1);
                        }}
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
                onChange={(id) => {
                    setActiveTab(id);
                    setCurrentPage(1);
                }}
                variant="pills"
            />

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedCerts.map((cert) => (
                    <CertificateCard
                        key={cert.id}
                        {...cert}
                        onViewDetail={() => setSelectedCert(cert)}
                    />
                ))}
            </div>

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

            {/* Modal Chi tiết */}
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
                            <div className="flex justify-between items-start">
                                <h4 className="text-xl font-bold text-gray-900 leading-tight">
                                    {selectedCert.title}
                                </h4>
                                <Badge variant="primary">{selectedCert.code}</Badge>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                                <div className="space-y-1">
                                    <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Đơn vị cấp</p>
                                    <p className="text-sm font-semibold text-gray-700">{selectedCert.issuer}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Thời gian</p>
                                    <p className="text-sm font-semibold text-gray-700">{selectedCert.date || selectedCert.year}</p>
                                </div>
                            </div>
                            <div className="space-y-1 pt-2">
                                <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Mô tả thành tích</p>
                                <p className="text-sm text-gray-600 leading-relaxed italic border-l-4 border-primary/20 pl-3">
                                    "{selectedCert.description}"
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
                        <Button variant="primary" onClick={() => setIsFilterOpen(false)}>Áp dụng bộ lọc</Button>
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

                    <div className="space-y-3">
                        <label className="text-sm font-bold text-gray-700">Trạng thái xác thực</label>
                        <div className="flex gap-4">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-primary focus:ring-primary border-gray-300 transition-all cursor-pointer" />
                                <span className="text-sm text-gray-600 group-hover:text-primary transition-colors font-medium">Đã xác thực chính thức</span>
                            </label>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default Certificates;
