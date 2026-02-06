import { useState } from 'react';
import { CertificateCard, Tabs, Pagination, Input, Button } from '../../../components/ui';

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

    // Mock data
    const certificates = [
        {
            id: 1,
            type: 'academic',
            title: 'Giải Nhất Olympic Tin Học 2023',
            issuer: 'Hội Sinh Viên Trường',
            date: '10/05/2023',
            code: 'CERT-IT-2023',
            // Placeholder image
            image: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800&q=80',
            verified: true
        },
        {
            id: 2,
            type: 'award',
            title: 'Đoàn Viên Xuất Sắc 2022-2023',
            issuer: 'BCH Đoàn Trường ĐH CNTT',
            year: '2022-2023',
            code: 'AWARD-2223',
            image: 'https://images.unsplash.com/photo-1579548122080-c35fd6820ecb?w=800&q=80',
            verified: true
        },
        {
            id: 3,
            type: 'volunteer',
            title: 'Chiến dịch Mùa hè xanh 2023',
            issuer: 'Đoàn Khoa Công nghệ Thông tin',
            date: '15/08/2023',
            code: 'VOL-MHX-2023',
            image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&q=80',
            verified: true
        },
        {
            id: 4,
            type: 'summer',
            title: 'Giấy chứng nhận Sinh viên 5 tốt cấp Trường',
            issuer: 'Hội Sinh Viên Trường',
            year: '2023-2024',
            code: 'SV5T-2024',
            image: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=800&q=80',
            verified: true
        },
        {
            id: 5,
            type: 'academic',
            title: 'Giải Khuyến Khích NCKH Cấp Khoa',
            issuer: 'Khoa Công Nghệ Thông Tin',
            date: '20/12/2022',
            code: 'NCKH-2022',
            image: 'https://images.unsplash.com/photo-1606326608690-4e0281b1e588?w=800&q=80',
            verified: true
        },
        {
            id: 6,
            type: 'blood',
            title: 'Hiến máu nhân đạo đợt 1/2023',
            issuer: 'Hội Chữ Thập Đỏ',
            date: '15/03/2023',
            code: 'HM-2023-01',
            image: 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?w=800&q=80',
            verified: true
        }
    ];

    const filteredCerts = activeTab === 'all'
        ? certificates
        : certificates.filter(c => c.type === activeTab || (activeTab === 'volunteer' && ['volunteer', 'summer', 'blood'].includes(c.type)));

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
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Button variant="outline" leftIcon={<span className="material-symbols-outlined">filter_list</span>}>
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

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCerts.map((cert) => (
                    <CertificateCard
                        key={cert.id}
                        type={cert.type}
                        title={cert.title}
                        issuer={cert.issuer}
                        date={cert.date}
                        year={cert.year}
                        code={cert.code}
                        image={cert.image}
                        verified={cert.verified}
                    />
                ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center pt-6">
                <Pagination
                    currentPage={currentPage}
                    totalPages={3}
                    onPageChange={setCurrentPage}
                />
            </div>
        </div>
    );
};

export default Certificates;
