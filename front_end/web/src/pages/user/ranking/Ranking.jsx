import React, { useState } from 'react';
import { Card, Button, Avatar, Badge, Tabs, Modal } from '../../../components/ui';

/**
 * Ranking Page - Bảng xếp hạng thi đua
 */
const Ranking = () => {
    const tabs = [
        { id: 'semester', label: 'Học kỳ này' },
        { id: 'month', label: 'Tháng này' },
        { id: 'year', label: 'Năm học 2023-2024' },
    ];
    const [activeTab, setActiveTab] = useState('semester');
    const [isLoading, setIsLoading] = useState(false);
    const [isRulesOpen, setIsRulesOpen] = useState(false);
    const [isShareOpen, setIsShareOpen] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    const [visibleCount, setVisibleCount] = useState(5);

    const handleTabChange = (tabId) => {
        setIsLoading(true);
        setActiveTab(tabId);
        // Giả lập load dữ liệu trong 400ms
        setTimeout(() => setIsLoading(false), 400);
    };

    const shareUrl = "https://flameguard-ai.lhu.edu.vn/ranking/me";

    const handleCopy = () => {
        navigator.clipboard.writeText(shareUrl);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    // Mock ranking data for different tabs
    const rankingData = {
        semester: {
            top3: [
                { rank: 2, name: 'Trần Thị Bích Ngọc', class: 'Lớp CNPM2021', score: 850, avatar: 'https://i.pravatar.cc/150?u=1' },
                { rank: 1, name: 'Nguyễn Minh Quân', class: 'Lớp KHMT2020', score: 1240, avatar: 'https://i.pravatar.cc/150?u=2' },
                { rank: 3, name: 'Lê Thị Vân', class: 'Lớp HTTT2022', score: 795, avatar: 'https://i.pravatar.cc/150?u=3' },
            ],
            listRank: [
                { rank: 4, name: 'Phạm Minh Hoàng', class: 'CNTT K21', events: 18, score: 750, avatar: 'https://i.pravatar.cc/150?u=4' },
                { rank: 5, name: 'Đỗ Thanh Hải', class: 'KHMT K22', events: 15, score: 620, avatar: 'https://i.pravatar.cc/150?u=5' },
                { rank: 6, name: 'Nguyễn Bích Diệp', class: 'TTNT K21', events: 12, score: 585, avatar: 'https://i.pravatar.cc/150?u=6' },
                { rank: 7, name: 'Tôi (Nguyễn Văn A)', class: 'CNTT K21', events: 10, score: 540, avatar: null, isMe: true },
                { rank: 8, name: 'Vũ Gia Bảo', class: 'ANM K22', events: 8, score: 490, avatar: 'https://i.pravatar.cc/150?u=8' },
            ]
        },
        month: {
            top3: [
                { rank: 2, name: 'Nguyễn Văn A', class: 'CNTT K21', score: 320, avatar: null },
                { rank: 1, name: 'Lê Thị Vân', class: 'Lớp HTTT2022', score: 450, avatar: 'https://i.pravatar.cc/150?u=3' },
                { rank: 3, name: 'Đỗ Thanh Hải', class: 'KHMT K22', score: 280, avatar: 'https://i.pravatar.cc/150?u=5' },
            ],
            listRank: [
                { rank: 4, name: 'Trần Thị Bích Ngọc', class: 'Lớp CNPM2021', events: 5, score: 250, avatar: 'https://i.pravatar.cc/150?u=1' },
                { rank: 5, name: 'Phạm Minh Hoàng', class: 'CNTT K21', events: 4, score: 210, avatar: 'https://i.pravatar.cc/150?u=4' },
                { rank: 6, name: 'Vũ Gia Bảo', class: 'ANM K22', events: 3, score: 180, avatar: 'https://i.pravatar.cc/150?u=8' },
            ]
        },
        year: {
            top3: [
                { rank: 2, name: 'Phạm Minh Hoàng', class: 'CNTT K21', score: 2850, avatar: 'https://i.pravatar.cc/150?u=4' },
                { rank: 1, name: 'Trần Thị Bích Ngọc', class: 'Lớp CNPM2021', score: 3100, avatar: 'https://i.pravatar.cc/150?u=1' },
                { rank: 3, name: 'Nguyễn Minh Quân', class: 'Lớp KHMT2020', score: 2750, avatar: 'https://i.pravatar.cc/150?u=2' },
            ],
            listRank: [
                { rank: 4, name: 'Lê Thị Vân', class: 'Lớp HTTT2022', events: 45, score: 2400, avatar: 'https://i.pravatar.cc/150?u=3' },
                { rank: 5, name: 'Đỗ Thanh Hải', class: 'KHMT K22', events: 40, score: 2150, avatar: 'https://i.pravatar.cc/150?u=5' },
                { rank: 6, name: 'Nguyễn Văn A', class: 'CNTT K21', events: 38, score: 1980, avatar: null, isMe: true },
            ]
        }
    };

    const currentData = rankingData[activeTab] || rankingData.semester;
    const { top3, listRank } = currentData;

    return (
        <div className={`space-y-8 transition-opacity duration-300 ${isLoading ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
            {/* Header */}
            <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Bảng Xếp Hạng Thi Đua</h1>
                <p className="text-gray-500">Vinh danh những Đoàn viên năng nổ và tích cực nhất</p>
            </div>

            {/* Actions */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <Tabs
                    tabs={tabs}
                    defaultTab={activeTab}
                    onChange={handleTabChange}
                    variant="underline"
                />
                <div className="flex gap-2 w-full md:w-auto">
                    <Button
                        variant="primary"
                        size="sm"
                        leftIcon={<span className="material-symbols-outlined">info</span>}
                        onClick={() => setIsRulesOpen(true)}
                        className="flex-1 md:flex-none"
                    >
                        Quy định tính điểm
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        leftIcon={<span className="material-symbols-outlined">share</span>}
                        onClick={() => setIsShareOpen(true)}
                        className="flex-1 md:flex-none"
                    >
                        Chia sẻ
                    </Button>
                </div>
            </div>

            {/* Podium (Top 3) */}
            <div className="flex items-end justify-center gap-3 md:gap-8 pb-8 pt-20 border-b border-gray-100 overflow-x-auto min-h-[480px]">
                {/* Rank 2 */}
                <div className="flex flex-col items-center flex-1 max-w-[180px]">
                    <div className="relative mb-3">
                        <Badge variant="gray" className="absolute -top-3 left-1/2 -translate-x-1/2 shadow-sm z-10 px-3 py-1 bg-gray-100 border-gray-200 text-gray-700 font-bold">HẠNG 2</Badge>
                        <div className="w-20 h-20 md:w-24 md:h-24 rounded-full p-1 border-4 border-gray-300 bg-white">
                            <img src={top3[0].avatar} alt="" className="w-full h-full rounded-full object-cover" />
                        </div>
                    </div>
                    <div className="bg-gray-50/50 p-4 rounded-t-2xl w-full text-center h-40 flex flex-col justify-end pb-6 shadow-sm border-x border-t border-gray-100">
                        <h3 className="font-bold text-gray-900 line-clamp-1 text-sm md:text-base">{top3[0].name}</h3>
                        <p className="text-[10px] md:text-xs text-gray-500 mb-2">{top3[0].class}</p>
                        <div className="bg-gray-200/50 py-1.5 px-3 rounded-lg text-gray-700 font-bold text-base md:text-lg">
                            {top3[0].score} <span className="text-[10px] md:text-xs font-normal opacity-70">ĐIỂM</span>
                        </div>
                    </div>
                </div>

                {/* Rank 1 */}
                <div className="flex flex-col items-center flex-1 max-w-[220px]">
                    <div className="relative mb-4">
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex flex-col items-center">
                            <span className="material-symbols-outlined text-yellow-400 text-4xl animate-bounce">crown</span>
                        </div>
                        <Badge variant="warning" className="absolute -top-3 left-1/2 -translate-x-1/2 shadow-lg z-10 px-4 py-1.5 bg-yellow-400 border-yellow-500 text-white font-black">HẠNG 1</Badge>
                        <div className="w-28 h-28 md:w-36 md:h-36 rounded-full p-1.5 border-4 border-yellow-400 shadow-2xl bg-white">
                            <img src={top3[1].avatar} alt="" className="w-full h-full rounded-full object-cover" />
                        </div>
                    </div>
                    <div className="bg-yellow-50/50 p-5 rounded-t-3xl w-full text-center h-56 flex flex-col justify-end pb-8 shadow-md border-x-2 border-t-2 border-yellow-200 relative">
                        <h3 className="font-bold text-gray-900 text-base md:text-xl line-clamp-1 mb-1">{top3[1].name}</h3>
                        <p className="text-xs md:text-sm text-yellow-700 mb-4">{top3[1].class}</p>
                        <div className="bg-yellow-400 py-2 px-6 rounded-xl text-white font-black text-lg md:text-2xl inline-block mb-3 shadow-lg shadow-yellow-200">
                            {top3[1].score.toLocaleString()} <span className="text-xs font-medium">ĐIỂM</span>
                        </div>
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full whitespace-nowrap shadow-sm border border-yellow-100">
                            <span className="material-symbols-outlined text-yellow-500 text-sm">emoji_events</span>
                            <span className="text-[10px] md:text-xs text-yellow-700 font-bold uppercase tracking-wider">Đang dẫn đầu</span>
                        </div>
                    </div>
                </div>

                {/* Rank 3 */}
                <div className="flex flex-col items-center flex-1 max-w-[180px]">
                    <div className="relative mb-3">
                        <Badge variant="warning" className="absolute -top-3 left-1/2 -translate-x-1/2 shadow-sm z-10 px-3 py-1 bg-orange-100 border-orange-200 text-orange-700 font-bold">HẠNG 3</Badge>
                        <div className="w-20 h-20 md:w-24 md:h-24 rounded-full p-1 border-4 border-orange-200 bg-white">
                            <img src={top3[2].avatar} alt="" className="w-full h-full rounded-full object-cover" />
                        </div>
                    </div>
                    <div className="bg-orange-50/50 p-4 rounded-t-2xl w-full text-center h-40 flex flex-col justify-end pb-6 shadow-sm border-x border-t border-orange-100">
                        <h3 className="font-bold text-gray-900 line-clamp-1 text-sm md:text-base">{top3[2].name}</h3>
                        <p className="text-[10px] md:text-xs text-gray-500 mb-2">{top3[2].class}</p>
                        <div className="bg-orange-100/50 py-1.5 px-3 rounded-lg text-orange-800 font-bold text-base md:text-lg">
                            {top3[2].score} <span className="text-[10px] md:text-xs font-normal opacity-70">ĐIỂM</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* List Table */}
            <Card title="Danh sách chi tiết" subtitle={`Cập nhật: ${new Date().toLocaleDateString('vi-VN')}`}>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                                <th className="pb-3 pl-4">Thứ hạng</th>
                                <th className="pb-3">Họ và tên</th>
                                <th className="pb-3">Tổng sự kiện</th>
                                <th className="pb-3 pr-4 text-right">Điểm tích lũy</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {listRank.slice(0, visibleCount).map((item) => (
                                <tr
                                    key={item.rank}
                                    className={`
                                        group hover:bg-gray-50 transition-colors
                                        ${item.isMe ? 'bg-blue-50 hover:bg-blue-50' : ''}
                                    `}
                                >
                                    <td className="py-4 pl-4 font-bold text-gray-500 group-hover:text-primary">
                                        #{item.rank}
                                    </td>
                                    <td className="py-4">
                                        <div className="flex items-center gap-3">
                                            <Avatar src={item.avatar} name={item.name} size="sm" />
                                            <div>
                                                <p className={`font-medium ${item.isMe ? 'text-primary' : 'text-gray-900'}`}>
                                                    {item.name}
                                                </p>
                                                <p className="text-xs text-gray-500">{item.class}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 text-sm text-gray-600">
                                        {item.events} sự kiện
                                    </td>
                                    <td className="py-4 pr-4 text-right">
                                        <span className="font-bold text-gray-900 bg-gray-100 px-2 py-1 rounded">
                                            {item.score} pts
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {visibleCount < listRank.length && (
                    <div className="text-center mt-4">
                        <Button variant="ghost" size="sm" onClick={() => setVisibleCount(listRank.length)}>Xem thêm toàn bộ bảng xếp hạng</Button>
                    </div>
                )}
            </Card>

            {/* Modal Quy định */}
            <Modal
                isOpen={isRulesOpen}
                onClose={() => setIsRulesOpen(false)}
                title="Quy định tính điểm thi đua"
                footer={<Button variant="primary" fullWidth onClick={() => setIsRulesOpen(false)}>Đã hiểu</Button>}
            >
                <div className="space-y-6">
                    <div className="bg-blue-50 p-4 rounded-xl">
                        <p className="text-sm text-gray-700 leading-relaxed">
                            Hệ thống tính điểm dựa trên sự tham gia tích cực của Đoàn viên trong các hoạt động, phong trào và thành tích cá nhân.
                        </p>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-start gap-3">
                            <span className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex-shrink-0 flex items-center justify-center font-bold text-xs">1</span>
                            <div>
                                <p className="text-sm font-bold text-gray-900">Hoạt động phong trào</p>
                                <p className="text-xs text-gray-500">Mỗi sự kiện tham gia tích lũy từ 5 - 15 điểm rèn luyện.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <span className="w-6 h-6 rounded-full bg-yellow-100 text-yellow-600 flex-shrink-0 flex items-center justify-center font-bold text-xs">2</span>
                            <div>
                                <p className="text-sm font-bold text-gray-900">Thành tích & Khen thưởng</p>
                                <p className="text-xs text-gray-500">Các chứng nhận Học thuật/Tình nguyện được cộng từ 20 - 50 điểm.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <span className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex-shrink-0 flex items-center justify-center font-bold text-xs">3</span>
                            <div>
                                <p className="text-sm font-bold text-gray-900">Điểm danh (Check-in)</p>
                                <p className="text-xs text-gray-500">Điểm danh đúng giờ và hoàn thành nhiệm vụ được cộng thêm điểm thưởng.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>

            {/* Modal Chia sẻ */}
            <Modal
                isOpen={isShareOpen}
                onClose={() => setIsShareOpen(false)}
                title="Chia sẻ thành tích"
            >
                <div className="space-y-6">
                    <div className="p-6 bg-gradient-to-br from-primary to-blue-600 rounded-2xl text-white text-center shadow-lg">
                        <Avatar src={null} name="Nguyễn Văn A" size="lg" className="mx-auto mb-3 border-4 border-white/20" />
                        <h4 className="text-xl font-black">Hạng #7</h4>
                        <p className="text-sm opacity-80 mb-4">Nguyễn Văn A - CNTT K21</p>
                        <div className="inline-block bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-sm font-bold">
                            540 Điểm rèn luyện
                        </div>
                    </div>

                    <div className="space-y-3">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Sao chép liên kết để chia sẻ</p>
                        <div className="flex gap-2">
                            <div className="flex-1 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm text-gray-500 truncate">
                                {shareUrl}
                            </div>
                            <Button
                                variant={isCopied ? "success" : "primary"}
                                onClick={handleCopy}
                            >
                                <span className="material-symbols-outlined text-sm">
                                    {isCopied ? 'check' : 'content_copy'}
                                </span>
                            </Button>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default Ranking;
