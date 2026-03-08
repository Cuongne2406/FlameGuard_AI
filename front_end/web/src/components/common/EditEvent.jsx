import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Toggle from '../ui/Toggle';

const EditEvent = ({ isOpen, onClose, event, onSuccess }) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        location: '',
        locationType: 'preset',
        customLocation: '',
        start_time: '',
        end_time: '',
        max_participants: 100,
        points: 10,
        status: 'UPCOMING',
        image_url: '',
        participationType: 'team',
        minTeamSize: 3,
        maxTeamSize: 5,
        allowInternal: true,
        allowExternal: false,
        additionalFields: [],
        budget: '',
        fundingSource: ['Khoa'],
        hostUnit: '',
        organizer: '',
        smartCheckin: true,
        geofencing: true,
        eCertificate: true,
        certificateTemplate: 'blue',
        certificateImage: null,
    });

    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [additionalFieldInput, setAdditionalFieldInput] = useState('');
    const [showAdditionalFields, setShowAdditionalFields] = useState(false);
    const [availableLocations] = useState([
        { id: 'hall_a', name: 'Hội trường A', capacity: 500, schedule: 'free' },
        { id: 'hall_b', name: 'Hội trường B', capacity: 300, schedule: 'busy' },
        { id: 'room_c302', name: 'Phòng C.302', capacity: 80, schedule: 'free' },
        { id: 'room_c303', name: 'Phòng C.303', capacity: 60, schedule: 'free' },
    ]);
    const [locationCheck, setLocationCheck] = useState(null);
    const [certificateTemplates] = useState([
        { id: 'blue', name: 'Học thuật - Blue Theme', color: 'blue', image: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=200&q=80' },
        { id: 'red', name: 'Văn thể - Red Theme', color: 'rose', image: 'https://images.unsplash.com/photo-1557683311-eac922347aa1?w=200&q=80' },
        { id: 'green', name: 'Tình nguyện - Green Theme', color: 'emerald', image: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=200&q=80' },
    ]);

    // Load dữ liệu sự kiện vào form khi mở modal
    useEffect(() => {
        if (event && isOpen) {
            // Chuyển đổi status từ dạng hiển thị sang dạng lưu trữ
            let statusValue = 'UPCOMING';
            if (event.status === 'Đang diễn ra (Live)') statusValue = 'LIVE';
            else if (event.status === 'Đã kết thúc') statusValue = 'ENDED';
            else statusValue = 'UPCOMING';

            setFormData({
                title: event.title || '',
                description: event.description || '',
                location: event.locationId || '',
                locationType: event.locationType || 'preset',
                customLocation: event.customLocation || '',
                start_time: event.start_time || '',
                end_time: event.end_time || '',
                max_participants: event.max_participants || 100,
                points: event.points || 10,
                status: statusValue,
                image_url: event.image_url || '',
                participationType: event.participationType || 'team',
                minTeamSize: event.minTeamSize || 3,
                maxTeamSize: event.maxTeamSize || 5,
                allowInternal: event.allowInternal !== undefined ? event.allowInternal : true,
                allowExternal: event.allowExternal || false,
                additionalFields: event.additionalFields || [],
                budget: event.budget || '',
                fundingSource: event.fundingSource || ['Khoa'],
                hostUnit: event.hostUnit || '',
                organizer: event.organizer || '',
                smartCheckin: event.smartCheckin !== undefined ? event.smartCheckin : true,
                geofencing: event.geofencing !== undefined ? event.geofencing : true,
                eCertificate: event.eCertificate !== undefined ? event.eCertificate : true,
                certificateTemplate: event.certificateTemplate || 'blue',
                certificateImage: event.certificateImage || null,
            });
            if (event.image_url) setPreviewUrl(event.image_url);
        }
    }, [event, isOpen]);

    // Reset khi đóng
    useEffect(() => {
        if (!isOpen) {
            setStep(1);
            setSelectedFile(null);
            setPreviewUrl('');
            setAdditionalFieldInput('');
            setShowAdditionalFields(false);
            setLocationCheck(null);
        }
    }, [isOpen]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
            setFormData(prev => ({ ...prev, image_url: URL.createObjectURL(file) }));
        }
    };

    const handleCertificateUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, certificateImage: URL.createObjectURL(file) }));
        }
    };

    const handleLocationChange = (e) => {
        const locationId = e.target.value;
        setFormData(prev => ({ ...prev, location: locationId }));

        const selected = availableLocations.find(loc => loc.id === locationId);
        if (selected) {
            setLocationCheck({
                free: selected.schedule === 'free',
                message: selected.schedule === 'free' 
                    ? '✅ Địa điểm còn trống trong khung giờ này' 
                    : '❌ Địa điểm đã có lịch tổ chức, vui lòng chọn khung giờ khác'
            });
        }
    };

    const addAdditionalField = () => {
        if (additionalFieldInput.trim()) {
            setFormData(prev => ({
                ...prev,
                additionalFields: [...prev.additionalFields, additionalFieldInput.trim()]
            }));
            setAdditionalFieldInput('');
        }
    };

    const removeAdditionalField = (index) => {
        setFormData(prev => ({
            ...prev,
            additionalFields: prev.additionalFields.filter((_, i) => i !== index)
        }));
    };

    const toggleFundingSource = (source) => {
        setFormData(prev => ({
            ...prev,
            fundingSource: prev.fundingSource.includes(source)
                ? prev.fundingSource.filter(s => s !== source)
                : [...prev.fundingSource, source]
        }));
    };

    const validateStep = () => {
        if (step === 1) {
            if (!formData.title) return 'Vui lòng nhập tên sự kiện';
            if (!formData.start_time) return 'Vui lòng chọn thời gian bắt đầu';
            if (!formData.end_time) return 'Vui lòng chọn thời gian kết thúc';
            if (formData.end_time < formData.start_time) return 'Thời gian kết thúc phải sau thời gian bắt đầu';
            if (!formData.location && formData.locationType === 'preset') return 'Vui lòng chọn địa điểm';
            if (formData.locationType === 'custom' && !formData.customLocation) return 'Vui lòng nhập địa điểm mới';
            return null;
        }
        if (step === 2) {
            if (formData.participationType === 'team') {
                if (formData.minTeamSize < 2) return 'Số lượng tối thiểu phải từ 2';
                if (formData.maxTeamSize < formData.minTeamSize) return 'Số lượng tối đa phải lớn hơn tối thiểu';
            }
            return null;
        }
        if (step === 3) {
            if (!formData.hostUnit) return 'Vui lòng chọn đơn vị tổ chức';
            if (!formData.organizer) return 'Vui lòng nhập tên trưởng ban tổ chức';
            return null;
        }
        return null;
    };

    const handleNext = () => {
        const error = validateStep();
        if (error) {
            alert(error);
            return;
        }
        if (step < 5) setStep(step + 1);
    };

    const handlePrev = () => {
        if (step > 1) setStep(step - 1);
    };

    const handleSubmit = () => {
        // Chuyển đổi trạng thái
        let newStatus = '';
        if (formData.status === 'UPCOMING') newStatus = 'Sắp tới';
        else if (formData.status === 'LIVE') newStatus = 'Đang diễn ra (Live)';
        else if (formData.status === 'ENDED') newStatus = 'Đã kết thúc';
        else newStatus = 'Sắp tới';

        const updatedEvent = {
            ...event,
            title: formData.title,
            description: formData.description,
            locationId: formData.location,
            locationType: formData.locationType,
            customLocation: formData.customLocation,
            start_time: formData.start_time,
            end_time: formData.end_time,
            max_participants: formData.max_participants,
            points: formData.points,
            status: newStatus,
            statusColor: formData.status === 'LIVE' ? 'blue' : formData.status === 'UPCOMING' ? 'orange' : 'emerald',
            image_url: formData.image_url,
            participationType: formData.participationType,
            minTeamSize: formData.minTeamSize,
            maxTeamSize: formData.maxTeamSize,
            allowInternal: formData.allowInternal,
            allowExternal: formData.allowExternal,
            additionalFields: formData.additionalFields,
            budget: formData.budget,
            fundingSource: formData.fundingSource,
            hostUnit: formData.hostUnit,
            organizer: formData.organizer,
            smartCheckin: formData.smartCheckin,
            geofencing: formData.geofencing,
            eCertificate: formData.eCertificate,
            certificateTemplate: formData.certificateTemplate,
            certificateImage: formData.certificateImage,
            // Giữ nguyên time display cũ, có thể cập nhật sau
            time: formData.start_time 
                ? new Date(formData.start_time).toLocaleString('vi-VN', { 
                    day: '2-digit', month: '2-digit', year: 'numeric', 
                    hour: '2-digit', minute: '2-digit' 
                  })
                : 'Chưa cập nhật',
            location: formData.locationType === 'preset' 
                ? availableLocations.find(l => l.id === formData.location)?.name || formData.location
                : formData.customLocation,
            type: formData.participationType === 'team' ? 'Học thuật' : 'Sự kiện Cấp Khoa',
        };
        onSuccess(updatedEvent);
        onClose();
    };

    if (!isOpen) return null;

    // Stepper Header
    const stepperHeader = (
        <div className="flex items-center justify-between max-w-3xl mx-auto relative mb-12">
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -translate-y-1/2 z-0"></div>
            {[1, 2, 3, 4, 5].map(s => (
                <div key={s} className="relative z-10 flex flex-col items-center gap-3">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        step >= s 
                            ? 'bg-blue-600 text-white ring-4 ring-blue-50' 
                            : 'bg-white border-2 border-slate-100 text-slate-300'
                    }`}>
                        {step > s ? <span className="material-symbols-outlined text-sm">check</span> : s}
                    </div>
                    <p className={`text-[10px] font-bold uppercase tracking-widest absolute -bottom-8 text-nowrap text-center w-32 ${
                        step >= s ? 'text-blue-600' : 'text-slate-300'
                    }`}>
                        {s === 1 ? 'Thông tin & Địa điểm' : 
                         s === 2 ? 'Hình thức tham gia' : 
                         s === 3 ? 'Kinh phí & Tổ chức' : 
                         s === 4 ? 'Công nghệ' : 'Xác nhận'}
                    </p>
                </div>
            ))}
        </div>
    );

    // Step 1: Thông tin & Địa điểm
    const renderStep1 = () => (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in slide-in-from-right-4 duration-500">
            <div className="lg:col-span-12">
                <h4 className="text-lg font-bold text-slate-900 mb-6">1. Thông tin chung & Địa điểm</h4>
            </div>
            <div className="lg:col-span-7 space-y-6">
                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                        Tên sự kiện <span className="text-rose-500 font-bold">*</span>
                    </label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="Cuộc thi Lập trình Code War 2026"
                        className="w-full h-12 px-6 rounded-xl border border-slate-200 outline-none focus:border-blue-500 font-bold text-slate-700"
                    />
                </div>
                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                            Phân loại <span className="text-rose-500 font-bold">*</span>
                        </label>
                        <select
                            name="participationType"
                            value={formData.participationType}
                            onChange={handleInputChange}
                            className="w-full h-12 px-6 rounded-xl border border-slate-200 outline-none font-bold text-slate-700 bg-white"
                        >
                            <option value="individual">• Cá nhân</option>
                            <option value="team">• Đội nhóm</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                            Thời gian <span className="text-rose-500 font-bold">*</span>
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 ml-1">Bắt đầu</label>
                                <input
                                    type="datetime-local"
                                    name="start_time"
                                    value={formData.start_time}
                                    onChange={handleInputChange}
                                    className="w-full h-12 px-4 rounded-xl border border-slate-200 outline-none font-bold text-slate-700"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 ml-1">Kết thúc</label>
                                <input
                                    type="datetime-local"
                                    name="end_time"
                                    value={formData.end_time}
                                    onChange={handleInputChange}
                                    className="w-full h-12 px-4 rounded-xl border border-slate-200 outline-none font-bold text-slate-700"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                        Địa điểm <span className="text-rose-500 font-bold">*</span>
                    </label>
                    <div className="flex gap-2">
                        <select
                            value={formData.location}
                            onChange={handleLocationChange}
                            className="flex-1 h-12 px-6 rounded-xl border border-slate-200 outline-none font-bold text-slate-700 bg-white"
                        >
                            <option value="">Chọn địa điểm</option>
                            {availableLocations.map(loc => (
                                <option key={loc.id} value={loc.id}>
                                    {loc.name} (Sức chứa: {loc.capacity})
                                </option>
                            ))}
                        </select>
                        <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, locationType: 'custom' }))}
                            className="h-12 px-6 rounded-xl bg-blue-50 text-blue-600 font-bold text-xs uppercase tracking-widest hover:bg-blue-100 transition-all"
                        >
                            + Thêm mới
                        </button>
                    </div>
                    {formData.locationType === 'custom' && (
                        <div className="mt-2">
                            <input
                                type="text"
                                name="customLocation"
                                value={formData.customLocation}
                                onChange={handleInputChange}
                                placeholder="Nhập địa điểm mới..."
                                className="w-full h-12 px-6 rounded-xl border border-slate-200 outline-none font-bold text-slate-700"
                            />
                        </div>
                    )}
                    {locationCheck && (
                        <div className={`mt-2 p-3 rounded-xl ${locationCheck.free ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                            {locationCheck.message}
                        </div>
                    )}
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Mô tả ngắn</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Mô tả sơ lược về mục đích và ý nghĩa sự kiện..."
                        className="w-full h-32 p-6 rounded-2xl border border-slate-200 outline-none font-medium text-slate-700 resize-none"
                    />
                </div>
            </div>
            <div className="lg:col-span-5 space-y-8">
                <div className="space-y-4">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Ảnh bìa sự kiện</label>
                    <div className="relative">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                            id="event-image-upload"
                        />
                        {!previewUrl ? (
                            <label
                                htmlFor="event-image-upload"
                                className="h-56 rounded-[2.5rem] border-2 border-dashed border-slate-100 bg-slate-50/50 flex flex-col items-center justify-center p-8 text-center cursor-pointer hover:border-blue-300 hover:bg-white transition-all"
                            >
                                <div className="h-12 w-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 transition-transform">
                                    <span className="material-symbols-outlined">cloud_upload</span>
                                </div>
                                <p className="text-sm font-bold text-slate-900">Click để tải ảnh lên</p>
                                <p className="text-xs font-bold text-slate-400 mt-2 uppercase tracking-widest">PNG, JPG tối đa 5MB</p>
                                <p className="text-[10px] font-medium text-slate-300 mt-1 uppercase tracking-widest">Kích thước chuẩn 1920×1080 (16:9)</p>
                            </label>
                        ) : (
                            <div className="relative h-56 rounded-[2.5rem] overflow-hidden border-2 border-blue-200">
                                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                                <button
                                    onClick={() => {
                                        setSelectedFile(null);
                                        setPreviewUrl('');
                                    }}
                                    className="absolute top-4 right-4 h-10 w-10 bg-rose-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-rose-600 transition-all"
                                >
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                <div className="p-8 rounded-[2rem] bg-blue-50/50 border border-blue-100 relative overflow-hidden">
                    <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-8xl text-blue-600/5">lightbulb</span>
                    <h5 className="flex items-center gap-2 text-blue-600 text-xs font-bold uppercase tracking-widest mb-4">
                        <span className="material-symbols-outlined text-lg">tips_and_updates</span> Mẹo tạo sự kiện
                    </h5>
                    <ul className="space-y-3 relative z-10">
                        {['Đặt tên ngắn gọn, dễ nhớ.', 'Chọn ảnh bìa chất lượng cao để thu hút sinh viên.', 'Kiểm tra kỹ thời gian để tránh trùng lịch thi.'].map((tip, i) => (
                            <li key={i} className="text-xs font-bold text-slate-600 flex items-start gap-3">
                                <span className="h-1.5 w-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0"></span> {tip}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );

    // Step 2: Hình thức tham gia
    const renderStep2 = () => (
        <div className="space-y-10 animate-in slide-in-from-right-4 duration-500">
            <div>
                <h4 className="flex items-center gap-3 text-lg font-bold text-slate-900 mb-6">
                    <span className="material-symbols-outlined text-blue-600">groups</span> Hình thức tham gia
                </h4>
                <div className="grid grid-cols-2 gap-6">
                    <div
                        onClick={() => setFormData(prev => ({ ...prev, participationType: 'individual' }))}
                        className={`p-6 rounded-[2rem] border-2 cursor-pointer transition-all ${
                            formData.participationType === 'individual'
                                ? 'border-blue-600 bg-blue-50/20'
                                : 'border-slate-100 bg-slate-50/30 hover:border-blue-200'
                        }`}
                    >
                        <div className="flex flex-col gap-4">
                            <div className={`h-10 w-10 rounded-full border-2 flex items-center justify-center ${
                                formData.participationType === 'individual' ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-200'
                            }`}>
                                <span className="material-symbols-outlined text-sm">person</span>
                            </div>
                            <div>
                                <p className="font-bold text-slate-900">Cá nhân</p>
                                <p className="text-xs font-medium text-slate-400 mt-1">Sinh viên đăng ký và tham gia độc lập</p>
                            </div>
                        </div>
                    </div>
                    <div
                        onClick={() => setFormData(prev => ({ ...prev, participationType: 'team' }))}
                        className={`p-6 rounded-[2rem] border-2 cursor-pointer transition-all ${
                            formData.participationType === 'team'
                                ? 'border-blue-600 bg-blue-50/20'
                                : 'border-slate-100 bg-slate-50/30 hover:border-blue-200'
                        }`}
                    >
                        <div className="flex flex-col gap-4">
                            <div className={`h-10 w-10 rounded-full border-2 flex items-center justify-center ${
                                formData.participationType === 'team' ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-200'
                            }`}>
                                <span className="material-symbols-outlined text-sm">groups</span>
                            </div>
                            <div>
                                <p className="font-bold text-slate-900">Đội nhóm</p>
                                <p className="text-xs font-medium text-slate-400 mt-1">Đăng ký theo nhóm, yêu cầu trưởng nhóm</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {formData.participationType === 'team' && (
                <div className="p-8 rounded-[2.5rem] bg-slate-50/50 border border-slate-100 space-y-8">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Cấu hình đội thi</p>
                    <div className="grid grid-cols-2 gap-10">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Số lượng tối thiểu</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    name="minTeamSize"
                                    value={formData.minTeamSize}
                                    onChange={handleInputChange}
                                    className="h-11 w-full border border-slate-200 rounded-xl px-4 font-bold"
                                />
                                <span className="absolute right-4 top-3 text-xs font-bold text-slate-300 uppercase">Thành viên</span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Số lượng tối đa</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    name="maxTeamSize"
                                    value={formData.maxTeamSize}
                                    onChange={handleInputChange}
                                    className="h-11 w-full border border-slate-200 rounded-xl px-4 font-bold"
                                />
                                <span className="absolute right-4 top-3 text-xs font-bold text-slate-300 uppercase">Thành viên</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div>
                <h4 className="flex items-center gap-3 text-lg font-bold text-slate-900 mb-6">
                    <span className="material-symbols-outlined text-blue-600">person_pin</span> Đối tượng tham gia
                </h4>
                <div className="space-y-4">
                    <label className="flex items-center gap-4 p-5 rounded-2xl bg-white border border-slate-100 cursor-pointer">
                        <input
                            type="checkbox"
                            name="allowInternal"
                            checked={formData.allowInternal}
                            onChange={handleInputChange}
                            className="h-5 w-5 rounded border-slate-200 text-blue-600"
                        />
                        <div>
                            <p className="text-sm font-bold text-slate-900">Sinh viên Khoa CNTT</p>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Chỉ cho phép tài khoản có mã sinh viên thuộc khoa CNTT đăng nhập và đăng ký.</p>
                        </div>
                    </label>
                    <label className="flex items-center gap-4 p-5 rounded-2xl bg-white border border-slate-100 cursor-pointer">
                        <input
                            type="checkbox"
                            name="allowExternal"
                            checked={formData.allowExternal}
                            onChange={handleInputChange}
                            className="h-5 w-5 rounded border-slate-200 text-blue-600"
                        />
                        <div>
                            <p className="text-sm font-bold text-slate-900">Sinh viên ngoài khoa / Khách mời</p>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Cho phép đăng ký không cần tài khoản sinh viên (Form mở rộng).</p>
                        </div>
                    </label>
                </div>
            </div>

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h4 className="flex items-center gap-3 text-lg font-bold text-slate-900">
                        <span className="material-symbols-outlined text-blue-600">contract_edit</span> Thông tin bổ sung
                    </h4>
                    <Toggle
                        checked={showAdditionalFields}
                        onChange={() => setShowAdditionalFields(!showAdditionalFields)}
                    />
                </div>
                {showAdditionalFields && (
                    <div className="p-10 rounded-[2.5rem] bg-slate-50/50 border border-slate-100 space-y-6">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Trường thông tin cần thu thập</p>
                        <div className="flex flex-wrap gap-3">
                            {formData.additionalFields.map((field, index) => (
                                <div key={index} className="px-6 py-2 bg-white rounded-xl border border-slate-200 flex items-center gap-3">
                                    <span className="text-xs font-bold text-slate-700">{field}</span>
                                    <button onClick={() => removeAdditionalField(index)} className="text-slate-300 hover:text-rose-500">
                                        <span className="material-symbols-outlined text-sm">close</span>
                                    </button>
                                </div>
                            ))}
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={additionalFieldInput}
                                    onChange={(e) => setAdditionalFieldInput(e.target.value)}
                                    placeholder="Nhập tên trường..."
                                    className="h-10 px-4 rounded-xl border border-slate-200 text-sm"
                                />
                                <button
                                    onClick={addAdditionalField}
                                    className="h-10 px-6 rounded-xl bg-blue-600 text-white text-xs font-bold uppercase tracking-widest"
                                >
                                    Thêm
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

    // Step 3: Kinh phí & Tổ chức
    const renderStep3 = () => (
        <div className="space-y-12 animate-in slide-in-from-right-4 duration-500 pb-10">
            <div className="space-y-8">
                <h4 className="flex items-center gap-3 text-lg font-bold text-slate-900">
                    <span className="material-symbols-outlined text-blue-600">payments</span> Dự trù Kinh phí
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Tổng kinh phí dự kiến</label>
                        <div className="relative">
                            <input
                                type="text"
                                name="budget"
                                value={formData.budget}
                                onChange={handleInputChange}
                                placeholder="20.000.000"
                                className="h-14 w-full border border-slate-200 rounded-2xl px-6 font-bold text-lg text-slate-900 focus:border-blue-500 outline-none"
                            />
                            <span className="absolute right-6 top-4 font-bold text-slate-300 text-xs">VNĐ</span>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Nguồn kinh phí</label>
                        <div className="flex flex-wrap gap-6 pt-2">
                            {['Quỹ Khoa', 'Quỹ Đoàn', 'Tài trợ'].map((source) => (
                                <label key={source} className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.fundingSource.includes(source)}
                                        onChange={() => toggleFundingSource(source)}
                                        className="h-5 w-5 rounded border-slate-200 text-blue-600"
                                    />
                                    <span className="text-xs font-bold uppercase text-slate-500">{source}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-8">
                <h4 className="flex items-center gap-3 text-lg font-bold text-slate-900">
                    <span className="material-symbols-outlined text-blue-600">assignment_ind</span> Phân công Đơn vị
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Đơn vị tổ chức (Host)</label>
                        <div className="relative">
                            <select
                                name="hostUnit"
                                value={formData.hostUnit}
                                onChange={handleInputChange}
                                className="h-14 w-full border border-slate-200 rounded-2xl px-6 font-bold text-slate-600 bg-white outline-none appearance-none"
                            >
                                <option value="">Chọn đơn vị</option>
                                <option value="CLB Lập trình & AI">CLB Lập trình & AI</option>
                                <option value="BCH Đoàn Khoa">BCH Đoàn Khoa</option>
                            </select>
                            <span className="material-symbols-outlined absolute right-4 top-4 text-slate-300">expand_more</span>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Trưởng Ban Tổ Chức</label>
                        <div className="relative">
                            <input
                                type="text"
                                name="organizer"
                                value={formData.organizer}
                                onChange={handleInputChange}
                                placeholder="Nhập tên trưởng BTC"
                                className="h-14 w-full border border-slate-200 rounded-2xl px-6 font-bold text-slate-700 outline-none focus:border-blue-500"
                            />
                            <span className="material-symbols-outlined absolute right-4 top-4 text-slate-300">edit</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-8 rounded-[2rem] bg-blue-50/30 border border-blue-100 flex items-start gap-4">
                <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center text-blue-600 shadow-sm shrink-0">
                    <span className="material-symbols-outlined text-xl">info</span>
                </div>
                <p className="text-sm font-bold text-blue-700 leading-relaxed">
                    Hệ thống sẽ gửi thông báo giao nhiệm vụ cho đơn vị chủ trì sau khi công bố sự kiện.
                </p>
            </div>
        </div>
    );

    // Step 4: Công nghệ
    const renderStep4 = () => (
        <div className="space-y-12 animate-in slide-in-from-right-4 duration-500 pb-10">
            <div className="space-y-8">
                <h4 className="flex items-center gap-3 text-lg font-bold text-slate-900">
                    <span className="material-symbols-outlined text-blue-600">hub</span> Cấu hình Công nghệ
                </h4>
                <div className="p-10 rounded-[2.5rem] bg-slate-50/50 border border-slate-100 space-y-10">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center text-blue-600 shadow-sm">
                            <span className="material-symbols-outlined text-2xl">qr_code_2</span>
                        </div>
                        <div>
                            <p className="text-base font-bold text-slate-900 uppercase">Smart Check-in</p>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Cấu hình hệ thống điểm danh tự động</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-10">
                        <label className="p-6 rounded-2xl bg-white border border-blue-100 flex items-center justify-between cursor-pointer">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-xl">update</span>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-900 uppercase">QR Code động</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase">Mã QR thay đổi mỗi 15 giây</p>
                                </div>
                            </div>
                            <input
                                type="checkbox"
                                name="smartCheckin"
                                checked={formData.smartCheckin}
                                onChange={handleInputChange}
                                className="h-5 w-5 rounded border-blue-600 text-blue-600"
                            />
                        </label>
                        <label className="p-6 rounded-2xl bg-white border border-blue-100 flex items-center justify-between cursor-pointer">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-xl">location_on</span>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-900 uppercase">Geofencing</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase">Giới hạn trong bán kính 100m</p>
                                </div>
                            </div>
                            <input
                                type="checkbox"
                                name="geofencing"
                                checked={formData.geofencing}
                                onChange={handleInputChange}
                                className="h-5 w-5 rounded border-blue-600 text-blue-600"
                            />
                        </label>
                    </div>
                </div>
            </div>

            <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <h4 className="flex items-center gap-3 text-lg font-bold text-slate-900">
                        <span className="material-symbols-outlined text-blue-600">verified</span> Chứng nhận điện tử (E-Certificate)
                    </h4>
                    <Toggle
                        checked={formData.eCertificate}
                        onChange={() => setFormData(prev => ({ ...prev, eCertificate: !prev.eCertificate }))}
                    />
                </div>
                {formData.eCertificate && (
                    <div className="p-10 rounded-[2.5rem] bg-slate-50/50 border border-slate-100 space-y-10">
                        <div className="flex items-center gap-6">
                            <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center text-orange-500 shadow-sm">
                                <span className="material-symbols-outlined text-2xl">workspace_premium</span>
                            </div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Tự động cấp chứng nhận sau khi hoàn thành sự kiện</p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                            <div className="lg:col-span-12">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">CHỌN MẪU CHỨNG NHẬN</p>
                            </div>
                            <div className="lg:col-span-5 grid grid-cols-2 gap-4">
                                {certificateTemplates.map((tmpl) => (
                                    <div
                                        key={tmpl.id}
                                        onClick={() => setFormData(prev => ({ ...prev, certificateTemplate: tmpl.id }))}
                                        className={`rounded-xl border-2 cursor-pointer overflow-hidden p-1 transition-all ${
                                            formData.certificateTemplate === tmpl.id
                                                ? 'border-blue-600 bg-blue-50 shadow-lg'
                                                : 'border-white hover:border-slate-200'
                                        }`}
                                    >
                                        <div className="relative h-28 bg-white rounded-lg overflow-hidden">
                                            <img src={tmpl.image} alt={tmpl.name} className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-slate-900/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <span className="text-white text-[8px] font-bold uppercase underline">Xem mẫu</span>
                                            </div>
                                            <div className="absolute bottom-0 left-0 w-full bg-white/90 backdrop-blur-sm p-2">
                                                <p className="text-[8px] font-bold uppercase text-slate-900 text-center truncate">{tmpl.name}</p>
                                            </div>
                                            {formData.certificateTemplate === tmpl.id && (
                                                <div className="absolute top-2 right-2 h-5 w-5 bg-blue-600 rounded-full flex items-center justify-center text-white ring-2 ring-white">
                                                    <span className="material-symbols-outlined text-[10px] font-bold">check</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                <div className="rounded-xl border-2 border-dashed border-slate-200 p-1">
                                    <label className="relative h-28 bg-white rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50 transition-colors">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleCertificateUpload}
                                            className="hidden"
                                        />
                                        <span className="material-symbols-outlined text-3xl text-slate-300">cloud_upload</span>
                                        <p className="text-[8px] font-bold uppercase mt-2 text-slate-400">Tải mẫu lên</p>
                                    </label>
                                </div>
                            </div>
                            <div className="lg:col-span-7">
                                <div className="h-full bg-white rounded-3xl border border-slate-100 shadow-2xl p-10 flex flex-col items-center justify-center relative overflow-hidden">
                                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-600 via-transparent to-transparent"></div>
                                    <div className="text-center space-y-4 relative z-10 scale-90">
                                        <div className="h-12 w-12 rounded-full bg-blue-600 text-white flex items-center justify-center mx-auto text-xl font-bold shadow-lg">F</div>
                                        <div>
                                            <p className="text-[9px] font-bold text-slate-400 tracking-widest uppercase">ĐOÀN KHOA CÔNG NGHỆ THÔNG TIN</p>
                                            <p className="text-2xl font-bold text-blue-600 tracking-tight uppercase mt-1">CHỨNG NHẬN THAM GIA</p>
                                        </div>
                                        <div className="py-2 border-y border-slate-100">
                                            <p className="text-[8px] font-bold uppercase text-slate-400 tracking-widest mb-1">Chứng nhận sinh viên:</p>
                                            <p className="text-xl font-bold text-slate-900">Nguyễn Văn A</p>
                                            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">MSSV: 2252xxxx</p>
                                        </div>
                                        <p className="text-[8px] font-semibold text-slate-400 max-w-[240px] leading-relaxed mx-auto">
                                            Đã hoàn thành xuất sắc vai trò tham gia trong sự kiện: <br />
                                            <span className="text-blue-600 font-bold">{formData.title || 'Tên sự kiện'}</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

    // Step 5: Xác nhận
    const renderStep5 = () => (
        <div className="h-full flex flex-col items-center justify-center space-y-8 animate-in zoom-in-95 duration-700 py-10">
            <div className="h-32 w-32 rounded-full bg-emerald-50 border-4 border-emerald-100 flex items-center justify-center text-emerald-500 relative shadow-2xl shadow-emerald-100">
                <span className="material-symbols-outlined text-6xl animate-bounce">verified</span>
                <div className="absolute inset-x-0 -bottom-2 flex justify-center">
                    <span className="px-4 py-1.5 bg-emerald-600 text-white rounded-full text-xs font-bold uppercase tracking-widest shadow-lg">Ready to launch</span>
                </div>
            </div>
            <div className="text-center space-y-3">
                <h3 className="text-3xl font-bold text-slate-900 tracking-tight uppercase">Mọi thứ đã sẵn sàng!</h3>
                <p className="text-slate-400 font-bold max-w-sm">Sự kiện của bạn đã được cấu hình hoàn tất.</p>
            </div>
            <div className="p-8 rounded-[2rem] border-2 border-slate-50 bg-slate-50/20 max-w-lg w-full divide-y divide-slate-100">
                <div className="pb-4 mb-4 grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-[8px] font-bold uppercase text-slate-400">Sự kiện</p>
                        <p className="font-bold text-slate-900 uppercase">{formData.title || 'Chưa có tên'}</p>
                    </div>
                    <div>
                        <p className="text-[8px] font-bold uppercase text-slate-400">Hình thức</p>
                        <p className="font-bold text-blue-600 uppercase">
                            {formData.participationType === 'team' ? 'Đội nhóm' : 'Cá nhân'}
                        </p>
                    </div>
                </div>
                <div className="pt-4 grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-[8px] font-bold uppercase text-slate-400">Địa điểm</p>
                        <p className="font-bold text-slate-700">
                            {formData.locationType === 'preset'
                                ? availableLocations.find(l => l.id === formData.location)?.name || formData.location
                                : formData.customLocation}
                        </p>
                    </div>
                    <div>
                        <p className="text-[8px] font-bold uppercase text-slate-400">Công nghệ</p>
                        <p className="font-bold text-emerald-600 uppercase tracking-widest flex items-center gap-1">
                            <span className="material-symbols-outlined text-[12px]">verified</span> Smart Check-in {formData.smartCheckin ? 'Active' : 'Off'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Chỉnh sửa Sự kiện"
            size="xl"
            footer={
                <div className="flex justify-end gap-3">
                    <Button
                        variant="outline"
                        onClick={() => step === 1 ? onClose() : handlePrev()}
                    >
                        {step === 1 ? 'Hủy' : 'Quay lại'}
                    </Button>
                    {step < 5 ? (
                        <Button
                            variant="primary"
                            onClick={handleNext}
                            rightIcon={<span className="material-symbols-outlined">arrow_forward</span>}
                        >
                            Tiếp tục
                        </Button>
                    ) : (
                        <Button
                            variant="primary"
                            onClick={handleSubmit}
                            leftIcon={<span className="material-symbols-outlined">check</span>}
                        >
                            Cập nhật & Công bố
                        </Button>
                    )}
                </div>
            }
        >
            {stepperHeader}
            <div className="mt-8">
                {step === 1 && renderStep1()}
                {step === 2 && renderStep2()}
                {step === 3 && renderStep3()}
                {step === 4 && renderStep4()}
                {step === 5 && renderStep5()}
            </div>
        </Modal>
    );
};

export default EditEvent;