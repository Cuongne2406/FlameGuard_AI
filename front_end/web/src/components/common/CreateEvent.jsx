import React, { useState } from 'react';

const CreateEvent = ({ isOpen, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        title: '', description: '', location: '',
        start_time: '', end_time: '',
        max_participants: 100, points: 10,
        status: 'UPCOMING',
        image_url: ''
    });

    const [activeTab, setActiveTab] = useState('upload'); 
    const [driveLink, setDriveLink] = useState('');
    const [uploadFile, setUploadFile] = useState(null);
    const [isConverting, setIsConverting] = useState(false);
    const [loading, setLoading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState('');

    if (!isOpen) return null;

    const handleDriveLinkChange = (e) => {
        const link = e.target.value;
        setDriveLink(link);
        const idMatch = link.match(/[-\w]{25,}/);
        if (idMatch) {
            const fileId = idMatch[0];
            const directLink = `https://lh3.googleusercontent.com/d/${fileId}`;
            setPreviewUrl(directLink);
            setFormData(prev => ({ ...prev, image_url: directLink }));
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setUploadFile(file);
            setPreviewUrl(URL.createObjectURL(file)); 
        }
    };

    // --- CẬP NHẬT LOGIC handleInputChange ---
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        
        setFormData(prev => {
            const newFormData = { ...prev, [name]: value };

            // Nếu người dùng đổi ngày bắt đầu mà ngày kết thúc hiện tại lại nhỏ hơn ngày bắt đầu mới
            if (name === 'start_time' && prev.end_time && value > prev.end_time) {
                newFormData.end_time = ''; // Reset ngày kết thúc để bắt buộc chọn lại đúng
            }
            
            return newFormData;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // --- CẬP NHẬT LOGIC KIỂM TRA TRƯỚC KHI GỬI ---
        if (formData.end_time && formData.start_time) {
            if (formData.end_time < formData.start_time) {
                alert("❌ Lỗi: Thời gian kết thúc không được nhỏ hơn thời gian bắt đầu!");
                return; // Ngừng thực hiện submit
            }
        }

        setLoading(true);
        try {
            let finalImageUrl = formData.image_url;

            if (activeTab === 'upload' && uploadFile) {
                const uploadData = new FormData();
                uploadData.append('file', uploadFile);

                const uploadRes = await fetch('http://127.0.0.1:8000/api/v1/upload/upload-image', {
                    method: 'POST',
                    body: uploadData 
                });

                if (uploadRes.ok) {
                    const data = await uploadRes.json();
                    finalImageUrl = data.direct_link; 
                } else {
                    throw new Error("Không thể upload ảnh lên máy chủ Drive.");
                }
            }

            const token = localStorage.getItem("access_token");
            const res = await fetch('http://127.0.0.1:8000/api/v1/events/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ ...formData, image_url: finalImageUrl })
            });

            if (res.ok) {
                alert("🎉 Chúc mừng! Sự kiện đã được đăng tải thành công.");
                onSuccess();
                onClose();
                setFormData({ title: '', description: '', location: '', start_time: '', end_time: '', max_participants: 100, points: 10, status: 'UPCOMING', image_url: '' });
                setPreviewUrl('');
                setUploadFile(null);
            } else {
                const err = await res.json();
                alert(`Lỗi: ${err.detail}`);
            }
        } catch (err) {
            alert(`Đã xảy ra lỗi: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md animate-in fade-in" onClick={onClose}></div>

            <div className="relative bg-white dark:bg-[#1e1c16] w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 border border-gray-100 dark:border-[#3d3321]">

                <div className="px-8 py-5 border-b border-gray-100 dark:border-[#3d3321] flex justify-between items-center bg-gray-50/50">
                    <h3 className="text-xl font-black uppercase text-gray-800">Thiết lập sự kiện mới</h3>
                    <button onClick={onClose} className="w-9 h-9 rounded-full hover:bg-gray-200 flex items-center justify-center transition-all">
                        <span className="material-symbols-outlined text-gray-500">close</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-5 max-h-[75vh] overflow-y-auto custom-scrollbar">

                    {/* --- IMAGE HANDLER SECTION (Giữ nguyên) --- */}
                    <div className="bg-blue-50/50 p-6 rounded-[2rem] border-2 border-dashed border-blue-200">
                        <div className="flex gap-2 mb-4 bg-white p-1 rounded-xl w-fit shadow-sm">
                            <button type="button" onClick={() => { setActiveTab('upload'); setPreviewUrl(''); }} className={`px-4 py-2 rounded-lg text-[11px] font-bold transition-all ${activeTab === 'upload' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-400'}`}>TẢI ẢNH LÊN</button>
                            <button type="button" onClick={() => { setActiveTab('drive'); setPreviewUrl(''); }} className={`px-4 py-2 rounded-lg text-[11px] font-bold transition-all ${activeTab === 'drive' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-400'}`}>LINK GOOGLE DRIVE</button>
                        </div>

                        {activeTab === 'upload' && !previewUrl && (
                            <label className="flex flex-col items-center justify-center h-32 w-full bg-white rounded-xl border border-blue-100 cursor-pointer hover:bg-blue-50 transition-colors group">
                                <span className="material-symbols-outlined text-3xl text-blue-300 group-hover:text-blue-500">cloud_upload</span>
                                <span className="text-[11px] font-bold text-gray-500 mt-2">Nhấn để chọn file từ máy tính</span>
                                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                            </label>
                        )}

                        {activeTab === 'drive' && !previewUrl && (
                            <div className="relative">
                                <span className="absolute left-3 top-3 material-symbols-outlined text-gray-400">link</span>
                                <input type="text" placeholder="Dán link Drive vào đây..." className="w-full pl-10 pr-4 py-3 rounded-xl border border-blue-200 bg-white text-sm outline-none" onChange={handleDriveLinkChange} />
                            </div>
                        )}

                        {previewUrl && (
                            <div className="relative h-48 w-full rounded-2xl overflow-hidden border-4 border-white shadow-lg group">
                                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                                <button type="button" onClick={() => { setPreviewUrl(''); setUploadFile(null); setDriveLink(''); setFormData({ ...formData, image_url: '' }) }} className="absolute top-2 right-2 bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center shadow-lg"><span className="material-symbols-outlined text-sm">close</span></button>
                            </div>
                        )}
                    </div>

                    {/* --- OTHER FIELDS --- */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Tên hoạt động *</label>
                            <input name="title" value={formData.title} required className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 ring-blue-100" placeholder="VD: Mùa hè xanh 2026" onChange={handleInputChange} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Địa điểm *</label>
                            <input name="location" value={formData.location} required className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 ring-blue-100" placeholder="Hội trường A" onChange={handleInputChange} />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Bắt đầu *</label>
                            <input 
                                name="start_time" 
                                type="datetime-local" 
                                value={formData.start_time}
                                required 
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none" 
                                onChange={handleInputChange} 
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Kết thúc</label>
                            <input 
                                name="end_time" 
                                type="datetime-local" 
                                value={formData.end_time}
                                min={formData.start_time} // CHẶN CHỌN NGÀY TRÊN LỊCH: Không cho chọn ngày nhỏ hơn ngày bắt đầu
                                className={`w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none ${!formData.start_time ? 'opacity-50 cursor-not-allowed' : ''}`} 
                                disabled={!formData.start_time} // Chỉ cho phép nhập khi đã có ngày bắt đầu
                                onChange={handleInputChange} 
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Mô tả</label>
                        <textarea name="description" value={formData.description} rows="3" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none" onChange={handleInputChange}></textarea>
                    </div>

                    <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black shadow-xl shadow-blue-200 active:scale-95 transition-all uppercase tracking-widest mt-4 disabled:opacity-50">
                        {loading ? 'Đang đăng tải...' : 'Đăng sự kiện'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateEvent;