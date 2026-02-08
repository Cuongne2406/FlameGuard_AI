import React, { useState } from 'react';

const AddMemberModal = ({ isOpen, onClose, onRefresh }) => {
    const [formData, setFormData] = useState({
        full_name: '',
        mssv: '',
        class_name: '',
        role: 'STUDENT'
    });
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem("access_token");
            const response = await fetch("http://127.0.0.1:8000/api/v1/users/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                alert("✅ Thêm thành công!");
                onRefresh(); // Load lại danh sách bên ngoài
                onClose();   // Đóng modal
                setFormData({ full_name: '', mssv: '', class_name: '', role: 'STUDENT' }); // Reset form
            } else {
                const err = await response.json();
                alert("❌ Lỗi: " + err.detail);
            }
        } catch (error) {
            alert("Lỗi kết nối server");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100">
                {/* Header */}
                <div className="bg-primary px-6 py-4 flex justify-between items-center">
                    <h3 className="text-white font-bold text-lg">Thêm Nhân Sự Mới</h3>
                    <button onClick={onClose} className="text-white/80 hover:text-white">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
                    <div>
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Họ và Tên</label>
                        <input 
                            required
                            className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                            placeholder="Nguyễn Văn A"
                            value={formData.full_name}
                            onChange={e => setFormData({...formData, full_name: e.target.value})}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">MSSV</label>
                            <input 
                                required
                                className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                                placeholder="123..."
                                value={formData.mssv}
                                onChange={e => setFormData({...formData, mssv: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Lớp / Chi Đoàn</label>
                            <input 
                                className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                                placeholder="19CNTT1"
                                value={formData.class_name}
                                onChange={e => setFormData({...formData, class_name: e.target.value})}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Chức vụ</label>
                        <select 
                            className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                            value={formData.role}
                            onChange={e => setFormData({...formData, role: e.target.value})}
                        >
                            <option value="STUDENT">Đoàn Viên (Sinh viên)</option>
                            <option value="SUB_ADMIN">Ban Chấp Hành (Cán bộ)</option>
                        </select>
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg dark:text-slate-300 dark:hover:bg-slate-700">Hủy</button>
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="px-6 py-2 bg-primary text-white font-bold rounded-lg hover:bg-primary-hover shadow-lg shadow-primary/30 flex items-center gap-2"
                        >
                            {loading ? "Đang lưu..." : <><span className="material-symbols-outlined text-sm">save</span> Lưu lại</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddMemberModal;