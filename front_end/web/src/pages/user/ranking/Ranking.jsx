import React, { useState, useEffect } from 'react';
import { Card, Button, Avatar, Badge, Tabs, Modal } from '../../../components/ui';

/**
 * Ranking Page - Bảng xếp hạng thi đua (Kết nối API)
 */
const Ranking = () => {
    const tabs = [
        { id: 'semester', label: 'Học kỳ này' },
        { id: 'month', label: 'Tháng này' },
        { id: 'year', label: 'Năm học 2023-2024' },
    ];

    const [activeTab, setActiveTab] = useState('semester');
    const [isLoading, setIsLoading] = useState(true);
    const [isRulesOpen, setIsRulesOpen] = useState(false);
    const [isShareOpen, setIsShareOpen] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    const [visibleCount, setVisibleCount] = useState(5);

    // --- 1. STATE LƯU DỮ LIỆU TỪ API ---
    const [data, setData] = useState({ top3: [], listRank: [] });
    const [myRank, setMyRank] = useState(null); // Lưu thông tin hạng của tôi để chia sẻ

    // --- 2. HÀM GỌI API ---
    const fetchRanking = async (period) => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem("access_token");
            const response = await fetch(`http://127.0.0.1:8000/api/v1/ranking/?period=${period}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const result = await response.json();
                setData(result);
                
                // Tìm thông tin "isMe" để phục vụ tính năng chia sẻ
                const meInTop = result.top3.find(u => u.isMe);
                const meInList = result.listRank.find(u => u.isMe);
                setMyRank(meInTop || meInList || null);
            }
        } catch (error) {
            console.error("Lỗi tải bảng xếp hạng:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Gọi API khi lần đầu load trang hoặc khi đổi Tab
    useEffect(() => {
        fetchRanking(activeTab);
    }, [activeTab]);

    const handleTabChange = (tabId) => {
        setActiveTab(tabId);
        setVisibleCount(5); // Reset số lượng hiển thị khi đổi tab
    };

    const shareUrl = window.location.href;

    const handleCopy = () => {
        navigator.clipboard.writeText(shareUrl);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    // Giải nén dữ liệu (dùng optional chaining để tránh lỗi nếu mảng rỗng)
    const top2 = data.top3[0]; // Hạng 2
    const top1 = data.top3[1]; // Hạng 1
    const top3 = data.top3[2]; // Hạng 3
    const listRank = data.listRank;

    return (
        <div className={`space-y-8 transition-all duration-300 ${isLoading ? 'opacity-60 grayscale-[0.5]' : 'opacity-100'}`}>
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
                    <Button variant="primary" size="sm" leftIcon={<span className="material-symbols-outlined">info</span>} onClick={() => setIsRulesOpen(true)} className="flex-1 md:flex-none">
                        Quy định tính điểm
                    </Button>
                    <Button variant="outline" size="sm" leftIcon={<span className="material-symbols-outlined">share</span>} onClick={() => setIsShareOpen(true)} className="flex-1 md:flex-none">
                        Chia sẻ
                    </Button>
                </div>
            </div>

            {/* Podium (Top 3) */}
            <div className="flex items-end justify-center gap-3 md:gap-8 pb-8 pt-20 border-b border-gray-100 overflow-x-auto min-h-[480px]">
                {/* Podium Rank 2 */}
                {top2 && (
                    <div className="flex flex-col items-center flex-1 max-w-[180px] animate-fade-in-up">
                        <div className="relative mb-3">
                            <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 shadow-sm z-10 px-3 py-1 bg-gray-100 border-gray-200 text-gray-700 font-bold">HẠNG 2</Badge>
                            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full p-1 border-4 border-gray-300 bg-white shadow-md">
                                <Avatar src={top2.avatar} name={top2.name} className="w-full h-full" />
                            </div>
                        </div>
                        <div className="bg-gray-50/50 p-4 rounded-t-2xl w-full text-center h-40 flex flex-col justify-end pb-6 shadow-sm border-x border-t border-gray-100">
                            <h3 className="font-bold text-gray-900 line-clamp-1 text-sm md:text-base">{top2.name}</h3>
                            <p className="text-[10px] md:text-xs text-gray-500 mb-2">{top2.class}</p>
                            <div className="bg-gray-200/50 py-1.5 px-3 rounded-lg text-gray-700 font-bold text-base md:text-lg">
                                {top2.score} <span className="text-[10px] md:text-xs font-normal opacity-70">pts</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Podium Rank 1 */}
                {top1 && (
                    <div className="flex flex-col items-center flex-1 max-w-[220px] animate-fade-in-up delay-100">
                        <div className="relative mb-4">
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex flex-col items-center">
                                <span className="material-symbols-outlined text-yellow-400 text-4xl animate-bounce">crown</span>
                            </div>
                            <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 shadow-lg z-10 px-4 py-1.5 bg-yellow-400 border-yellow-500 text-white font-black">HẠNG 1</Badge>
                            <div className="w-28 h-28 md:w-36 md:h-36 rounded-full p-1.5 border-4 border-yellow-400 shadow-2xl bg-white">
                                <Avatar src={top1.avatar} name={top1.name} className="w-full h-full" />
                            </div>
                        </div>
                        <div className="bg-yellow-50/50 p-5 rounded-t-3xl w-full text-center h-56 flex flex-col justify-end pb-8 shadow-md border-x-2 border-t-2 border-yellow-200 relative">
                            <h3 className="font-bold text-gray-900 text-base md:text-xl line-clamp-1 mb-1">{top1.name}</h3>
                            <p className="text-xs md:text-sm text-yellow-700 mb-4">{top1.class}</p>
                            <div className="bg-yellow-400 py-2 px-6 rounded-xl text-white font-black text-lg md:text-2xl inline-block mb-3 shadow-lg">
                                {top1.score.toLocaleString()} <span className="text-xs font-medium">pts</span>
                            </div>
                            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full border border-yellow-100">
                                <span className="material-symbols-outlined text-yellow-500 text-sm">emoji_events</span>
                                <span className="text-[10px] md:text-xs text-yellow-700 font-bold uppercase whitespace-nowrap">Dẫn đầu bảng</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Podium Rank 3 */}
                {top3 && (
                    <div className="flex flex-col items-center flex-1 max-w-[180px] animate-fade-in-up delay-200">
                        <div className="relative mb-3">
                            <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 shadow-sm z-10 px-3 py-1 bg-orange-100 border-orange-200 text-orange-700 font-bold">HẠNG 3</Badge>
                            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full p-1 border-4 border-orange-200 bg-white shadow-md">
                                <Avatar src={top3.avatar} name={top3.name} className="w-full h-full" />
                            </div>
                        </div>
                        <div className="bg-orange-50/50 p-4 rounded-t-2xl w-full text-center h-40 flex flex-col justify-end pb-6 shadow-sm border-x border-t border-orange-100">
                            <h3 className="font-bold text-gray-900 line-clamp-1 text-sm md:text-base">{top3.name}</h3>
                            <p className="text-[10px] md:text-xs text-gray-500 mb-2">{top3.class}</p>
                            <div className="bg-orange-100/50 py-1.5 px-3 rounded-lg text-orange-800 font-bold text-base md:text-lg">
                                {top3.score} <span className="text-[10px] md:text-xs font-normal opacity-70">pts</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* List Table */}
            <Card title="Danh sách chi tiết" subtitle={`Cập nhật: ${new Date().toLocaleDateString('vi-VN')}`}>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                                <th className="pb-3 pl-4">Thứ hạng</th>
                                <th className="pb-3">Họ và tên</th>
                                <th className="pb-3">Sự kiện</th>
                                <th className="pb-3 pr-4 text-right">Điểm tích lũy</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {listRank.length > 0 ? listRank.slice(0, visibleCount).map((item) => (
                                <tr key={item.id} className={`group hover:bg-gray-50 transition-colors ${item.isMe ? 'bg-blue-50/80' : ''}`}>
                                    <td className="py-4 pl-4 font-bold text-gray-500 group-hover:text-primary">#{item.rank}</td>
                                    <td className="py-4">
                                        <div className="flex items-center gap-3">
                                            <Avatar src={item.avatar} name={item.name} size="sm" />
                                            <div>
                                                <p className={`font-medium ${item.isMe ? 'text-primary' : 'text-gray-900'}`}>{item.name}</p>
                                                <p className="text-xs text-gray-500">{item.class}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 text-sm text-gray-600">{item.events} lần</td>
                                    <td className="py-4 pr-4 text-right">
                                        <span className="font-bold text-gray-900 bg-gray-100 px-2 py-1 rounded">{item.score} pts</span>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="4" className="py-10 text-center text-gray-400 italic">Chưa có dữ liệu xếp hạng trong giai đoạn này</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                {visibleCount < listRank.length && (
                    <div className="text-center mt-4 border-t border-gray-50 pt-4">
                        <Button variant="ghost" size="sm" onClick={() => setVisibleCount(listRank.length)}>Xem toàn bộ bảng xếp hạng</Button>
                    </div>
                )}
            </Card>

            {/* Modal Quy định */}
            <Modal isOpen={isRulesOpen} onClose={() => setIsRulesOpen(false)} title="Quy định tính điểm thi đua">
                <div className="space-y-6">
                    <div className="bg-blue-50 p-4 rounded-xl text-sm text-blue-800 leading-relaxed italic">
                        Hệ thống tính điểm dựa trên sự tham gia tích cực của Đoàn viên trong các hoạt động, phong trào và thành tích cá nhân.
                    </div>
                    <div className="space-y-4">
                        {[
                            { id: 1, color: 'bg-green-100 text-green-600', title: 'Hoạt động phong trào', desc: 'Mỗi sự kiện tham gia tích lũy từ 5 - 15 điểm rèn luyện.' },
                            { id: 2, color: 'bg-yellow-100 text-yellow-600', title: 'Thành tích & Khen thưởng', desc: 'Các chứng nhận Học thuật/Tình nguyện được cộng từ 20 - 50 điểm.' },
                            { id: 3, color: 'bg-red-100 text-red-600', title: 'Điểm danh (Check-in)', desc: 'Điểm danh đúng giờ và hoàn thành nhiệm vụ được cộng thêm điểm thưởng.' }
                        ].map(rule => (
                            <div key={rule.id} className="flex items-start gap-3">
                                <span className={`w-6 h-6 rounded-full ${rule.color} flex-shrink-0 flex items-center justify-center font-bold text-xs`}>{rule.id}</span>
                                <div>
                                    <p className="text-sm font-bold text-gray-900">{rule.title}</p>
                                    <p className="text-xs text-gray-500">{rule.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <Button variant="primary" fullWidth onClick={() => setIsRulesOpen(false)}>Tôi đã rõ</Button>
                </div>
            </Modal>

            {/* Modal Chia sẻ (DỮ LIỆU ĐỘNG THEO RANK CỦA TÔI) */}
            <Modal isOpen={isShareOpen} onClose={() => setIsShareOpen(false)} title="Chia sẻ thành tích">
                <div className="space-y-6">
                    <div className="p-6 bg-gradient-to-br from-primary to-blue-600 rounded-2xl text-white text-center shadow-lg">
                        <Avatar src={myRank?.avatar} name={myRank?.name || "User"} size="lg" className="mx-auto mb-3 border-4 border-white/20" />
                        <h4 className="text-xl font-black">{myRank ? `Hạng #${myRank.rank}` : "Chưa có hạng"}</h4>
                        <p className="text-sm opacity-80 mb-4">{myRank?.name || "Thành viên"} - {myRank?.class || "LHU"}</p>
                        <div className="inline-block bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-sm font-bold">
                            {myRank?.score || 0} Điểm rèn luyện
                        </div>
                    </div>

                    <div className="space-y-3">
                        <p className="text-xs font-bold text-gray-400 uppercase text-center">Sao chép liên kết chia sẻ</p>
                        <div className="flex gap-2">
                            <div className="flex-1 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm text-gray-500 truncate">{shareUrl}</div>
                            <Button variant={isCopied ? "success" : "primary"} onClick={handleCopy}>
                                <span className="material-symbols-outlined text-sm">{isCopied ? 'check' : 'content_copy'}</span>
                            </Button>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default Ranking;