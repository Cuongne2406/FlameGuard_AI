import React, { useState } from 'react';

const AddTransactionModal = ({ isOpen, onClose, onRefresh }) => {
    const [formData, setFormData] = useState({
        title: '',
        amount: '',
        type: 'INCOME', // Mặc định là Thu
        category: 'Hội Phí'
    });
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem("access_token");
            const response = await fetch("http://127.0.0.1:8000/api/v1/transactions/", {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                alert("✅ Giao dịch thành công!");
                onRefresh();
                onClose();
                setFormData({ title: '', amount: '', type: 'INCOME', category: 'Hội Phí' });
            } else {
                alert("Lỗi khi tạo giao dịch");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden p-6">
                <h3 className="text-xl font-bold mb-4 text-slate-800">Tạo Giao Dịch Mới</h3>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label className="text-sm font-semibold">Loại Giao Dịch</label>
                        <div className="flex gap-4 mt-2">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="radio" name="type" checked={formData.type === 'INCOME'} onChange={() => setFormData({...formData, type: 'INCOME'})} />
                                <span className="text-green-600 font-bold">Thu (Income)</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="radio" name="type" checked={formData.type === 'EXPENSE'} onChange={() => setFormData({...formData, type: 'EXPENSE'})} />
                                <span className="text-red-600 font-bold">Chi (Expense)</span>
                            </label>
                        </div>
                    </div>
                    <div>
                        <label className="text-sm font-semibold">Nội dung</label>
                        <input required className="w-full border rounded p-2 mt-1" placeholder="Vd: Thu hội phí tháng 10" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                    </div>
                    <div>
                        <label className="text-sm font-semibold">Số tiền (VNĐ)</label>
                        <input required type="number" className="w-full border rounded p-2 mt-1 font-mono" placeholder="500000" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} />
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-slate-500 hover:bg-slate-100 rounded">Hủy</button>
                        <button type="submit" disabled={loading} className="px-4 py-2 bg-primary text-white rounded font-bold hover:bg-primary-hover">
                            {loading ? "Đang xử lý..." : "Lưu Giao Dịch"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddTransactionModal;