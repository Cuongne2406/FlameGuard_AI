import React, { useState } from 'react';

const AddEventModal = ({ isOpen, onClose, onRefresh }) => {
    const [formData, setFormData] = useState({
        title: '',
        location: '',
        start_time: '',
        max_participants: 100,
        status: 'UPCOMING',
        description: ''
    });
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem("access_token");
            const response = await fetch("http://127.0.0.1:8000/api/v1/events/", {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                alert("🎉 Tạo sự kiện thành công!");
                onRefresh();
                onClose();
                setFormData({ title: '', location: '', start_time: '', max_participants: 100, status: 'UPCOMING', description: '' });
            } else {
                alert("Lỗi tạo sự kiện");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in-up">
                <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-6">
                    <h3 className="text-white font-bold text-xl">✨ Tạo Sự Kiện Mới</h3>
                    <p className="text-blue-100 text-sm">Điền thông tin chi tiết sự kiện</p>
                </div>

                <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
                    <div>
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Tên sự kiện</label>
                        <input required className="w-full border rounded-lg p-2.5 mt-1 dark:bg-slate-900 dark:border-slate-700 dark:text-white focus:ring-2 focus:ring-cyan-500 outline-none" 
                            placeholder="Vd: Workshop Kỹ Năng Mềm" 
                            value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Thời gian</label>
                            <input required type="datetime-local" className="w-full border rounded-lg p-2.5 mt-1 dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                                value={formData.start_time} onChange={e => setFormData({...formData, start_time: e.target.value})} />
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Địa điểm</label>
                            <input required className="w-full border rounded-lg p-2.5 mt-1 dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                                placeholder="Hội trường A"
                                value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Số lượng vé</label>
                            <input type="number" className="w-full border rounded-lg p-2.5 mt-1 dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                                value={formData.max_participants} onChange={e => setFormData({...formData, max_participants: e.target.value})} />
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Trạng thái</label>
                            <select className="w-full border rounded-lg p-2.5 mt-1 dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                                value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                                <option value="UPCOMING">Sắp diễn ra</option>
                                <option value="ONGOING">Đang diễn ra</option>
                                <option value="COMPLETED">Đã kết thúc</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button type="button" onClick={onClose} className="px-5 py-2.5 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors">Đóng</button>
                        <button type="submit" disabled={loading} 
                            className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg font-bold shadow-lg hover:shadow-cyan-500/30 hover:-translate-y-0.5 transition-all">
                            {loading ? "Đang tạo..." : "Xác Nhận Tạo"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddEventModal;