import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Toast from '../../../components/ui/Toast';

const EventSummary = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [toast, setToast] = useState(null);

    // Giả lập dữ liệu tổng kết
    const summary = {
        title: 'Giải Bóng đá Nam Khoa CNTT 2025',
        totalParticipants: 120,
        averageRating: 4.7,
        feedbackCount: 85,
        highlights: [
            'Giải nhất: Chi đoàn 23CT112',
            'Giải nhì: Chi đoàn 22CT111',
            'Giải ba: Chi đoàn 21CT112',
        ],
    };

    return (
        <div className="p-4 md:p-8 bg-[#F8FAFC] min-h-screen space-y-8 font-sans">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                <button onClick={() => navigate('/admin_sub/events')} className="hover:text-blue-600">Sự kiện Khoa</button>
                <span>/</span>
                <button onClick={() => navigate(`/admin_sub/events/${id}`)} className="hover:text-blue-600">{summary.title}</button>
                <span>/</span>
                <span className="text-blue-600">Tổng kết</span>
            </div>

            <h1 className="text-2xl font-bold text-slate-900">Tổng kết sự kiện: {summary.title}</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Tổng số tham gia</p>
                    <p className="text-4xl font-bold text-slate-900 mt-2">{summary.totalParticipants}</p>
                </div>
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Đánh giá trung bình</p>
                    <p className="text-4xl font-bold text-slate-900 mt-2">{summary.averageRating} / 5</p>
                </div>
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Lượt phản hồi</p>
                    <p className="text-4xl font-bold text-slate-900 mt-2">{summary.feedbackCount}</p>
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold text-slate-900 mb-6">Kết quả nổi bật</h3>
                <ul className="space-y-4">
                    {summary.highlights.map((item, i) => (
                        <li key={i} className="flex items-center gap-4 text-slate-700">
                            <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                            {item}
                        </li>
                    ))}
                </ul>
            </div>

            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </div>
    );
};

export default EventSummary;