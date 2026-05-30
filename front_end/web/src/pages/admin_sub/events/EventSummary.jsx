import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Toast from '../../../components/ui/Toast';
import { eventService } from '../../../services/eventService';

const EventSummary = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [toast, setToast] = useState(null);
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                setLoading(true);
                const data = await eventService.getEventSummary(id);
                setSummary(data);
            } catch (error) {
                setToast({ message: 'Lỗi tải tổng kết sự kiện: ' + error.message, type: 'error' });
            } finally {
                setLoading(false);
            }
        };
        fetchSummary();
    }, [id]);

    if (loading) return <div className="p-8 text-center text-slate-400 font-bold uppercase tracking-widest">Đang tính toán dữ liệu AI...</div>;
    if (!summary) return <div className="p-8 text-center text-slate-400 font-bold uppercase tracking-widest">Không tìm thấy dữ liệu tổng kết.</div>;

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

            <h1 className="text-2xl font-bold text-slate-900">Tổng kết sự kiện: {summary.name}</h1>
 
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Tổng số đăng ký</p>
                    <p className="text-4xl font-bold text-slate-900 mt-2">{summary.total_participants}</p>
                </div>
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Tham gia thực tế</p>
                    <p className="text-4xl font-bold text-slate-900 mt-2">{summary.attended_count}</p>
                </div>
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Chỉ số hài lòng (AI)</p>
                    <p className="text-4xl font-bold text-slate-900 mt-2">{summary.average_rating} / 5</p>
                </div>
            </div>
 
            <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold text-slate-900 mb-6">Kết quả & Phân tích AI</h3>
                <ul className="space-y-4">
                    {(summary.highlights || []).map((item, i) => (
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