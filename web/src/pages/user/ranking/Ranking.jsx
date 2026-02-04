import { useState } from 'react';
import { Card, Button, Avatar, Badge, Tabs } from '../../../components/ui';

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

    // Mock ranking data
    const top3 = [
        {
            rank: 2,
            name: 'Trần Thị Bích Ngọc',
            class: 'Lớp CNPM2021',
            score: 850,
            avatar: 'https://i.pravatar.cc/150?u=1'
        },
        {
            rank: 1,
            name: 'Nguyễn Minh Quân',
            class: 'Lớp KHMT2020',
            score: 1240,
            avatar: 'https://i.pravatar.cc/150?u=2'
        },
        {
            rank: 3,
            name: 'Lê Thị Vân',
            class: 'Lớp HTTT2022',
            score: 795,
            avatar: 'https://i.pravatar.cc/150?u=3'
        },
    ];

    const listRank = [
        { rank: 4, name: 'Phạm Minh Hoàng', class: 'CNTT K21', events: 18, score: 750, avatar: 'https://i.pravatar.cc/150?u=4' },
        { rank: 5, name: 'Đỗ Thanh Hải', class: 'KHMT K22', events: 15, score: 620, avatar: 'https://i.pravatar.cc/150?u=5' },
        { rank: 6, name: 'Nguyễn Bích Diệp', class: 'TTNT K21', events: 12, score: 585, avatar: 'https://i.pravatar.cc/150?u=6' },
        { rank: 7, name: 'Tôi (Nguyễn Văn A)', class: 'CNTT K21', events: 10, score: 540, avatar: null, isMe: true }, // Highlight current user
        { rank: 8, name: 'Vũ Gia Bảo', class: 'ANM K22', events: 8, score: 490, avatar: 'https://i.pravatar.cc/150?u=8' },
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Bảng Xếp Hạng Thi Đua</h1>
                <p className="text-gray-500">Vinh danh những Đoàn viên năng nổ và tích cực nhất</p>
            </div>

            {/* Actions */}
            <div className="flex justify-between items-center">
                <Tabs
                    tabs={tabs}
                    defaultTab={activeTab}
                    onChange={setActiveTab}
                    variant="underline"
                />
                <div className="flex gap-2">
                    <Button variant="primary" size="sm" leftIcon={<span className="material-symbols-outlined">info</span>}>
                        Quy định tính điểm
                    </Button>
                    <Button variant="outline" size="sm" leftIcon={<span className="material-symbols-outlined">share</span>}>
                        Chia sẻ
                    </Button>
                </div>
            </div>

            {/* Podium (Top 3) */}
            <div className="flex items-end justify-center gap-4 md:gap-8 pb-8 border-b border-gray-100">
                {/* Rank 2 */}
                <div className="flex flex-col items-center">
                    <div className="relative mb-3">
                        <Badge variant="gray" className="absolute -top-3 left-1/2 -translate-x-1/2 shadow-sm z-10 px-3">HẠNG 2</Badge>
                        <div className="w-20 h-20 md:w-24 md:h-24 rounded-full p-1 border-4 border-gray-300">
                            <img src={top3[0].avatar} alt="" className="w-full h-full rounded-full object-cover" />
                        </div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-t-xl w-32 md:w-48 text-center h-40 flex flex-col justify-end pb-4 shadow-sm">
                        <h3 className="font-bold text-gray-900 line-clamp-1">{top3[0].name}</h3>
                        <p className="text-xs text-gray-500 mb-2">{top3[0].class}</p>
                        <div className="bg-gray-200 py-1 px-3 rounded text-gray-700 font-bold text-lg">
                            {top3[0].score} <span className="text-xs font-normal">ĐIỂM</span>
                        </div>
                    </div>
                </div>

                {/* Rank 1 */}
                <div className="flex flex-col items-center">
                    <div className="relative mb-3">
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2">
                            <span className="material-symbols-outlined text-yellow-400 text-4xl drop-shadow-sm">crown</span>
                        </div>
                        <div className="w-24 h-24 md:w-32 md:h-32 rounded-full p-1 border-4 border-yellow-400 shadow-xl bg-white">
                            <img src={top3[1].avatar} alt="" className="w-full h-full rounded-full object-cover" />
                        </div>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-t-xl w-40 md:w-56 text-center h-52 flex flex-col justify-end pb-4 shadow-md border-t-4 border-yellow-400 relative">
                        <h3 className="font-bold text-gray-900 text-lg line-clamp-1">{top3[1].name}</h3>
                        <p className="text-sm text-yellow-700 mb-3">{top3[1].class}</p>
                        <div className="bg-yellow-100 py-1.5 px-4 rounded text-yellow-700 font-bold text-xl inline-block mb-2">
                            {top3[1].score.toLocaleString()} <span className="text-xs font-normal">ĐIỂM</span>
                        </div>
                        <Badge variant="academic" size="sm" className="absolute bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-blue-100 text-blue-600">
                            🏆 Đang dẫn đầu
                        </Badge>
                    </div>
                </div>

                {/* Rank 3 */}
                <div className="flex flex-col items-center">
                    <div className="relative mb-3">
                        <Badge variant="warning" className="absolute -top-3 left-1/2 -translate-x-1/2 shadow-sm z-10 px-3 bg-orange-100 text-orange-700">HẠNG 3</Badge>
                        <div className="w-20 h-20 md:w-24 md:h-24 rounded-full p-1 border-4 border-orange-200">
                            <img src={top3[2].avatar} alt="" className="w-full h-full rounded-full object-cover" />
                        </div>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-t-xl w-32 md:w-48 text-center h-32 flex flex-col justify-end pb-4 shadow-sm">
                        <h3 className="font-bold text-gray-900 line-clamp-1">{top3[2].name}</h3>
                        <p className="text-xs text-gray-500 mb-2">{top3[2].class}</p>
                        <div className="bg-orange-100 py-1 px-3 rounded text-orange-800 font-bold text-lg">
                            {top3[2].score} <span className="text-xs font-normal">ĐIỂM</span>
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
                            {listRank.map((item) => (
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
                <div className="text-center mt-4">
                    <Button variant="ghost" size="sm">Xem thêm toàn bộ bảng xếp hạng</Button>
                </div>
            </Card>
        </div>
    );
};

export default Ranking;
