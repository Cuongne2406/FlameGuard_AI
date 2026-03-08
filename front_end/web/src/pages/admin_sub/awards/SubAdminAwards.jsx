import React, { useState } from 'react';
import Toast from '../../../components/ui/Toast';
import Modal from '../../../components/ui/Modal';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const SubAdminAwards = () => {
    const [toast, setToast] = useState(null);
    const [activeTimescale, setActiveTimescale] = useState('Tháng này');
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [showAssessmentModal, setShowAssessmentModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [detailItem, setDetailItem] = useState(null);
    const [showRemindModal, setShowRemindModal] = useState(false);
    const [remindItem, setRemindItem] = useState(null);
    const [showAllStudentsModal, setShowAllStudentsModal] = useState(false);
    const [students, setStudents] = useState([
        { id: 'SV1', name: 'Nguyễn Văn A', class: '23CT112', status: 'Đã duyệt', points: 98, rank: 'Top 5 Khoa', assessed: true, assessment: { criteria: ['Tham gia Check-in', 'Đặt câu hỏi hay'], note: 'Đã tham gia tích cực', image: null } },
        { id: 'SV2', name: 'Trần Thị B', class: '22CT111', status: 'Chờ duyệt', points: 85, rank: 'Tiềm năng', assessed: false, assessment: null },
        { id: 'SV3', name: 'Lê Văn C', class: '23CT113', status: 'Chờ duyệt', points: 45, rank: 'Cần cố gắng', assessed: false },
    ]);

    // Dữ liệu theo thời gian (mô phỏng)
    const dataByTime = {
        'Tháng này': {
            stats: [
                { label: 'Dẫn đầu tháng', title: 'Chi đoàn 23CT112', val: '98 Điểm', icon: 'military_tech', color: 'orange', trend: 'Giữ vững phong độ' },
                { label: 'Sinh viên 5 tốt', title: '125 Hồ sơ', sub: 'Đạt chuẩn cấp Khoa', progress: 80, icon: 'school', color: 'blue', action: 'Đã duyệt 80%' },
                { label: 'Cần nỗ lực', title: '03 Chi đoàn', sub: 'Nhóm cuối bảng', icon: 'trending_down', color: 'rose', alert: 'Cần nhắc nhở gấp' },
            ],
            rankings: [
                { rank: 1, class: '23CT112', dept: 'Kỹ thuật PM', score: '98/100', trend: 'Lên hạng', trendColor: 'emerald', tags: ['100% Đoàn phí', 'Vô địch Bóng đá'], icon: '🏆' },
                { rank: 2, class: '21CT111', dept: 'Mạng MT', score: '95/100', trend: 'Ổn định', trendColor: 'slate', icon: '🥈' },
                { rank: 3, class: '24CT115', dept: 'Tân SV', score: '92/100', trend: 'Lên hạng', trendColor: 'emerald', icon: '🥉' },
                { rank: 4, class: '22CT112', dept: 'Kỹ thuật PM', score: '88/100', trend: 'Ổn định', trendColor: 'slate', icon: '4' },
            ],
            warningClass: { rank: 20, class: '23CT113', dept: 'Hệ thống TT', score: '45/100', trend: 'Tụt hạng', trendColor: 'rose', note: 'Chưa nộp báo cáo tháng' }
        },
        'Học kỳ 1': {
            stats: [
                { label: 'Dẫn đầu học kỳ', title: 'Chi đoàn 21CT111', val: '560 Điểm', icon: 'military_tech', color: 'orange', trend: 'Dẫn đầu bảng' },
                { label: 'Sinh viên 5 tốt', title: '210 Hồ sơ', sub: 'Đạt chuẩn cấp Khoa', progress: 85, icon: 'school', color: 'blue', action: 'Đã duyệt 85%' },
                { label: 'Cần nỗ lực', title: '05 Chi đoàn', sub: 'Nhóm cuối bảng', icon: 'trending_down', color: 'rose', alert: 'Cần theo dõi' },
            ],
            rankings: [
                { rank: 1, class: '21CT111', dept: 'Mạng MT', score: '560/600', trend: 'Lên hạng', trendColor: 'emerald', tags: ['Xuất sắc'], icon: '🏆' },
                { rank: 2, class: '23CT112', dept: 'Kỹ thuật PM', score: '545/600', trend: 'Ổn định', trendColor: 'slate', icon: '🥈' },
            ],
            warningClass: { rank: 18, class: '23CT113', dept: 'Hệ thống TT', score: '320/600', trend: 'Tụt hạng', trendColor: 'rose', note: 'Thiếu hoạt động' }
        },
        'Cả năm': {
            stats: [
                { label: 'Dẫn đầu năm', title: 'Chi đoàn 21CT111', val: '1250 Điểm', icon: 'military_tech', color: 'orange', trend: 'Xuất sắc' },
                { label: 'Sinh viên 5 tốt', title: '350 Hồ sơ', sub: 'Đạt chuẩn cấp Khoa', progress: 90, icon: 'school', color: 'blue', action: 'Đã duyệt 90%' },
                { label: 'Cần nỗ lực', title: '08 Chi đoàn', sub: 'Nhóm cuối bảng', icon: 'trending_down', color: 'rose', alert: 'Cần hỗ trợ' },
            ],
            rankings: [
                { rank: 1, class: '21CT111', dept: 'Mạng MT', score: '1250/1400', trend: 'Lên hạng', trendColor: 'emerald', tags: ['Top 1'], icon: '🏆' },
                { rank: 2, class: '23CT112', dept: 'Kỹ thuật PM', score: '1180/1400', trend: 'Ổn định', trendColor: 'slate', icon: '🥈' },
            ],
            warningClass: { rank: 22, class: '23CT113', dept: 'Hệ thống TT', score: '680/1400', trend: 'Tụt hạng', trendColor: 'rose', note: 'Cần cải thiện' }
        }
    };

    const currentData = dataByTime[activeTimescale] || dataByTime['Tháng này'];
    const stats = currentData.stats;
    const rankings = currentData.rankings;
    const warningClass = currentData.warningClass;

    // State cho assessment modal
    const [assessmentForm, setAssessmentForm] = useState({
        criteria: [],
        note: '',
        image: null
    });
    const criteriaOptions = [
        { id: 'checkin', label: 'Tham gia Check-in (+2đ)' },
        { id: 'question', label: 'Đặt câu hỏi hay (+1đ)' },
        { id: 'support', label: 'Hỗ trợ BTC/Hậu cần (+2đ)' },
        { id: 'speaker', label: 'Speaker/Diễn giả (+5đ)' },
    ];

    // State cho remind modal
    const [remindMessage, setRemindMessage] = useState('');

    // Handlers
    const handleAction = (msg) => {
        setToast({ message: msg, type: 'success' });
    };

    const handleViewDetail = (item) => {
        setDetailItem(item);
        setShowDetailModal(true);
    };

    const handleRemind = (cls) => {
        setRemindItem(cls);
        setShowRemindModal(true);
    };

    const sendRemind = () => {
        setToast({ message: `Đã gửi nhắc nhở tới Bí thư ${remindItem.class}!`, type: 'success' });
        setShowRemindModal(false);
        setRemindMessage('');
    };

    const handleAssess = (student) => {
        setSelectedStudent(student);
        if (student.assessed) {
            setAssessmentForm(student.assessment || { criteria: [], note: '', image: null });
        } else {
            setAssessmentForm({ criteria: [], note: '', image: null });
        }
        setShowAssessmentModal(true);
    };

    const toggleCriteria = (criteriaId) => {
        setAssessmentForm(prev => {
            const newCriteria = prev.criteria.includes(criteriaId)
                ? prev.criteria.filter(id => id !== criteriaId)
                : [...prev.criteria, criteriaId];
            return { ...prev, criteria: newCriteria };
        });
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAssessmentForm(prev => ({ ...prev, image: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const saveAssessment = () => {
        let addedPoints = 0;
        if (assessmentForm.criteria.includes('checkin')) addedPoints += 2;
        if (assessmentForm.criteria.includes('question')) addedPoints += 1;
        if (assessmentForm.criteria.includes('support')) addedPoints += 2;
        if (assessmentForm.criteria.includes('speaker')) addedPoints += 5;

        const newPoints = selectedStudent.points + addedPoints;

        setStudents(prev => prev.map(s =>
            s.id === selectedStudent.id
                ? { ...s, points: newPoints, status: 'Đã duyệt', assessed: true, assessment: { ...assessmentForm } }
                : s
        ));

        setToast({ message: `Đã cộng ${addedPoints} điểm cho ${selectedStudent.name}!`, type: 'success' });
        setShowAssessmentModal(false);
    };

    const updateAssessment = () => {
        let addedPoints = 0;
        if (assessmentForm.criteria.includes('checkin')) addedPoints += 2;
        if (assessmentForm.criteria.includes('question')) addedPoints += 1;
        if (assessmentForm.criteria.includes('support')) addedPoints += 2;
        if (assessmentForm.criteria.includes('speaker')) addedPoints += 5;

        setStudents(prev => prev.map(s =>
            s.id === selectedStudent.id
                ? { ...s, points: selectedStudent.points + addedPoints, assessment: { ...assessmentForm } }
                : s
        ));

        setToast({ message: `Đã cập nhật đánh giá cho ${selectedStudent.name}!`, type: 'success' });
        setShowAssessmentModal(false);
    };

    const exportToExcel = () => {
        const data = [
            ['Họ tên', 'Lớp', 'Điểm', 'Xếp hạng', 'Trạng thái'],
            ...students.map(s => [s.name, s.class, s.points, s.rank, s.status])
        ];
        const ws = XLSX.utils.aoa_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'SinhVien5Tot');
        const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        saveAs(new Blob([buffer]), 'DanhSach_SinhVien5Tot.xlsx');
        setToast({ message: 'Xuất Excel thành công!', type: 'success' });
    };

    return (
        <div className="p-4 md:p-6 lg:p-8 bg-[#F8FAFC] min-h-screen space-y-6 md:space-y-8 font-sans">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shadow-sm">
                        <span className="material-symbols-outlined text-2xl md:text-3xl font-bold">emoji_events</span>
                    </div>
                    <div>
                        <h1 className="text-xl md:text-2xl font-bold text-slate-900 uppercase">Bảng vàng Thi đua & Khen thưởng</h1>
                        <p className="flex items-center gap-2 text-xs font-bold text-emerald-600 uppercase tracking-widest mt-1">
                            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span> Cập nhật theo thời gian thực
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <select
                        className="h-10 md:h-12 pl-4 md:pl-6 pr-8 md:pr-12 rounded-xl md:rounded-2xl bg-white border border-slate-100 shadow-sm text-xs font-bold uppercase tracking-widest text-slate-600 outline-none appearance-none min-w-[140px] md:min-w-[180px]"
                        value={activeTimescale}
                        onChange={(e) => setActiveTimescale(e.target.value)}
                    >
                        <option>Tháng này</option>
                        <option>Học kỳ 1</option>
                        <option>Cả năm</option>
                    </select>
                </div>
            </div>

            {/* Stats Grid - responsive */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
                {stats.map((s, i) => (
                    <div key={i} className="bg-white border border-slate-100 rounded-2xl md:rounded-[2.5rem] p-6 md:p-8 shadow-sm group hover:shadow-2xl transition-all relative overflow-hidden flex flex-col justify-between h-48 md:h-56">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 md:mb-4">{s.label}</p>
                                <h3 className="text-lg md:text-2xl font-bold text-slate-900 uppercase leading-tight">{s.title}</h3>
                                <p className={`text-sm font-bold mt-1 ${s.color === 'orange' ? 'text-amber-500' : s.color === 'blue' ? 'text-blue-600' : 'text-rose-600'}`}>{s.val || s.sub}</p>
                            </div>
                            <div className={`h-10 w-10 md:h-14 md:w-14 rounded-xl md:rounded-2xl bg-${s.color}-50 text-${s.color}-500 flex items-center justify-center shadow-sm`}>
                                <span className="material-symbols-outlined text-2xl md:text-3xl">{s.icon}</span>
                            </div>
                        </div>
                        <div>
                            {s.progress ? (
                                <div className="space-y-2 md:space-y-3">
                                    <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${s.progress}%` }}></div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-xs text-blue-500">verified</span>
                                        <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">{s.action}</p>
                                    </div>
                                </div>
                            ) : (
                                <div className={`inline-flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-lg md:rounded-xl text-xs font-bold uppercase tracking-widest shadow-sm ${s.color === 'orange' ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'}`}>
                                    <span className="material-symbols-outlined text-sm">{s.color === 'orange' ? 'auto_graph' : 'warning'}</span>
                                    {s.trend || s.alert}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Ranking Table */}
            <div className="bg-white border border-slate-100 rounded-2xl md:rounded-[2.5rem] shadow-sm overflow-hidden">
                <div className="p-6 md:p-8 lg:p-10 border-b border-slate-50">
                    <h3 className="text-lg md:text-xl font-bold text-slate-900 uppercase">Bảng xếp hạng Chi đoàn</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px] md:min-w-full">
                        <thead>
                            <tr className="border-b border-slate-50 bg-slate-50/20">
                                <th className="py-4 md:py-6 px-4 md:px-6 lg:px-10 text-xs font-bold text-slate-300 uppercase tracking-widest">HẠNG</th>
                                <th className="py-4 md:py-6 px-3 md:px-4 lg:px-6 text-xs font-bold text-slate-300 uppercase tracking-widest">CHI ĐOÀN</th>
                                <th className="py-4 md:py-6 px-3 md:px-4 lg:px-6 text-xs font-bold text-slate-300 uppercase tracking-widest">ĐIỂM SỐ</th>
                                <th className="py-4 md:py-6 px-3 md:px-4 lg:px-6 text-xs font-bold text-slate-300 uppercase tracking-widest">XU HƯỚNG</th>
                                <th className="py-4 md:py-6 px-3 md:px-4 lg:px-6 text-xs font-bold text-slate-300 uppercase tracking-widest">THÀNH TÍCH</th>
                                <th className="py-4 md:py-6 px-4 md:px-6 lg:px-10 text-xs font-bold text-slate-300 uppercase tracking-widest text-right">HÀNH ĐỘNG</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {rankings.map((r) => (
                                <tr key={r.rank} className={`group hover:bg-slate-50/50 transition-colors ${r.rank === 1 ? 'bg-amber-50/30' : ''}`}>
                                    <td className="py-4 md:py-6 lg:py-8 px-4 md:px-6 lg:px-10">
                                        <span className="text-xl md:text-2xl">{r.icon}</span>
                                    </td>
                                    <td className="py-4 md:py-6 lg:py-8 px-3 md:px-4 lg:px-6">
                                        <p className="text-sm md:text-base font-bold text-slate-900 uppercase">{r.class}</p>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">{r.dept}</p>
                                    </td>
                                    <td className="py-4 md:py-6 lg:py-8 px-3 md:px-4 lg:px-6">
                                        <p className="text-sm md:text-base font-bold text-slate-900">{r.score}</p>
                                    </td>
                                    <td className="py-4 md:py-6 lg:py-8 px-3 md:px-4 lg:px-6">
                                        <div className="flex items-center gap-1 md:gap-2">
                                            <span className={`material-symbols-outlined text-sm md:text-base font-bold ${r.trendColor === 'emerald' ? 'text-emerald-500' : 'text-slate-400'}`}>
                                                {r.trendColor === 'emerald' ? 'north_east' : 'horizontal_rule'}
                                            </span>
                                            <p className={`text-xs font-bold uppercase tracking-widest ${r.trendColor === 'emerald' ? 'text-emerald-600' : 'text-slate-500'}`}>{r.trend}</p>
                                        </div>
                                    </td>
                                    <td className="py-4 md:py-6 lg:py-8 px-3 md:px-4 lg:px-6">
                                        <div className="flex flex-wrap gap-1 md:gap-2">
                                            {r.tags && r.tags.map(tag => (
                                                <span key={tag} className={`px-2 md:px-3 py-1 rounded-lg text-xs font-bold tracking-widest uppercase ${tag.includes('Đoàn phí') ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="py-4 md:py-6 lg:py-8 px-4 md:px-6 lg:px-10 text-right">
                                        <button
                                            onClick={() => handleViewDetail(r)}
                                            className="h-8 w-8 md:h-10 md:w-10 rounded-lg md:rounded-xl bg-white border border-slate-100 shadow-sm text-slate-400 hover:text-blue-600 transition-all"
                                        >
                                            <span className="material-symbols-outlined text-sm md:text-base">visibility</span>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {/* Warning Row */}
                            <tr className="bg-rose-50/30">
                                <td className="py-4 md:py-6 lg:py-8 px-4 md:px-6 lg:px-10">
                                    <span className="text-sm md:text-base font-bold text-rose-500">{warningClass.rank}</span>
                                </td>
                                <td className="py-4 md:py-6 lg:py-8 px-3 md:px-4 lg:px-6">
                                    <p className="text-sm md:text-base font-bold text-slate-900 uppercase">{warningClass.class}</p>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">{warningClass.dept}</p>
                                </td>
                                <td className="py-4 md:py-6 lg:py-8 px-3 md:px-4 lg:px-6 font-bold text-rose-600">{warningClass.score}</td>
                                <td className="py-4 md:py-6 lg:py-8 px-3 md:px-4 lg:px-6">
                                    <div className="flex items-center gap-1 md:gap-2">
                                        <span className="material-symbols-outlined text-sm md:text-base font-bold text-rose-500">south_east</span>
                                        <p className="text-xs font-bold uppercase tracking-widest text-rose-600">{warningClass.trend}</p>
                                    </div>
                                </td>
                                <td className="py-4 md:py-6 lg:py-8 px-3 md:px-4 lg:px-6">
                                    <div className="flex items-center gap-2 text-rose-600">
                                        <span className="material-symbols-outlined text-sm font-bold">assignment_late</span>
                                        <p className="text-xs font-bold uppercase tracking-widest">{warningClass.note}</p>
                                    </div>
                                </td>
                                <td className="py-4 md:py-6 lg:py-8 px-4 md:px-6 lg:px-10 text-right">
                                    <button
                                        onClick={() => handleRemind(warningClass)}
                                        className="h-8 md:h-10 px-3 md:px-5 rounded-lg md:rounded-xl bg-white border border-rose-100 text-rose-600 text-xs font-bold uppercase tracking-widest shadow-sm hover:bg-rose-600 hover:text-white transition-all flex items-center gap-1 md:gap-2 ml-auto"
                                    >
                                        <span className="material-symbols-outlined text-sm">notifications_active</span>
                                        <span className="hidden sm:inline">Nhắc nhở</span>
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Individual Assessment Section */}
            <div className="bg-white border border-slate-100 rounded-2xl md:rounded-[2.5rem] p-6 md:p-8 lg:p-10 shadow-sm space-y-6 md:space-y-8 lg:space-y-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 md:h-10 md:w-10 flex items-center justify-center text-blue-600 bg-blue-50 rounded-lg md:rounded-xl">
                            <span className="material-symbols-outlined text-lg md:text-xl">stars</span>
                        </div>
                        <h3 className="text-lg md:text-xl font-bold text-slate-900 uppercase">Xét duyệt Danh hiệu Sinh viên 5 Tốt</h3>
                    </div>
                    <div className="flex items-center gap-3">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Tiến độ:</p>
                        <div className="flex items-center gap-2">
                            <div className="h-2 w-24 md:w-32 bg-slate-50 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-600 rounded-full" style={{ width: '70%' }}></div>
                            </div>
                            <p className="text-xs md:text-sm font-bold text-blue-600">70%</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
                    {students.map(st => (
                        <div key={st.id} className="p-6 md:p-8 rounded-2xl md:rounded-[2.5rem] border border-slate-100 bg-slate-50/30 hover:bg-white hover:shadow-2xl transition-all group relative overflow-hidden">
                            <div className="flex items-start gap-4">
                                <div className="relative h-12 w-12 md:h-14 md:w-14 rounded-full bg-blue-600 flex items-center justify-center text-white text-lg md:text-xl font-bold shadow-inner shrink-0">
                                    {st.name[0]}
                                    {st.status === 'Đã duyệt' && (
                                        <div className="absolute -bottom-1 -right-1 h-4 w-4 md:h-5 md:w-5 bg-white rounded-full flex items-center justify-center text-emerald-500 shadow-sm">
                                            <span className="material-symbols-outlined text-xs font-bold">check_circle</span>
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <p className="text-sm md:text-base font-bold text-slate-900 uppercase">{st.name}</p>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{st.class}</p>
                                </div>
                            </div>
                            <div className="mt-6 pt-6 border-t border-slate-100 space-y-4">
                                <div className="flex items-center justify-between">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Điểm</p>
                                    <span className={`px-2 py-0.5 rounded text-xs font-bold tracking-widest uppercase ${st.rank === 'Top 5 Khoa' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'}`}>{st.rank}</span>
                                </div>
                                <p className="text-xl md:text-2xl font-bold text-slate-900">{st.points}</p>
                            </div>
                            <button
                                onClick={() => handleAssess(st)}
                                className="w-full h-10 md:h-12 rounded-xl md:rounded-2xl bg-white border border-slate-200 text-slate-900 text-xs font-bold uppercase tracking-widest shadow-sm hover:bg-blue-600 hover:text-white transition-all mt-4 md:mt-6 flex items-center justify-center gap-2"
                            >
                                <span className="material-symbols-outlined text-base md:text-lg">assessment</span>
                                {st.assessed ? 'Sửa' : 'Đánh giá'}
                            </button>
                        </div>
                    ))}
                    {/* Xem toàn bộ */}
                    <div
                        onClick={() => setShowAllStudentsModal(true)}
                        className="p-6 md:p-8 rounded-2xl md:rounded-[2.5rem] border-2 border-dashed border-slate-100 bg-slate-50/20 flex flex-col items-center justify-center text-slate-300 gap-3 group cursor-pointer hover:border-blue-100 hover:bg-white transition-all"
                    >
                        <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl md:rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center group-hover:bg-blue-50 group-hover:text-blue-600 transition-all">
                            <span className="material-symbols-outlined text-2xl md:text-3xl">add</span>
                        </div>
                        <p className="text-xs font-bold uppercase tracking-widest text-center">Xem toàn bộ</p>
                    </div>
                </div>
            </div>

            {/* Modals (giữ nguyên, Modal component đã responsive) */}
            <Modal isOpen={showDetailModal} onClose={() => setShowDetailModal(false)} title="Chi tiết thành tích" size="md">
                {detailItem && (
                    <div className="space-y-3 md:space-y-4 p-2 md:p-4">
                        <p className="text-sm md:text-base"><span className="font-bold">Chi đoàn:</span> {detailItem.class}</p>
                        <p className="text-sm md:text-base"><span className="font-bold">Khoa:</span> {detailItem.dept}</p>
                        <p className="text-sm md:text-base"><span className="font-bold">Điểm:</span> {detailItem.score}</p>
                        <p className="text-sm md:text-base"><span className="font-bold">Xu hướng:</span> {detailItem.trend}</p>
                        <p className="text-sm md:text-base font-bold">Thành tích:</p>
                        <ul className="list-disc pl-5 text-sm md:text-base">
                            {detailItem.tags?.map(tag => <li key={tag}>{tag}</li>)}
                        </ul>
                    </div>
                )}
            </Modal>

            <Modal isOpen={showRemindModal} onClose={() => setShowRemindModal(false)} title="Gửi nhắc nhở" size="sm">
                {remindItem && (
                    <div className="space-y-3 md:space-y-4 p-2 md:p-4">
                        <p className="text-sm">Nhắc nhở chi đoàn <span className="font-bold">{remindItem.class}</span></p>
                        <textarea
                            className="w-full h-20 md:h-24 p-3 border border-slate-200 rounded-lg md:rounded-xl text-sm"
                            placeholder="Nhập nội dung nhắc nhở..."
                            value={remindMessage}
                            onChange={(e) => setRemindMessage(e.target.value)}
                        />
                        <div className="flex gap-3 pt-3">
                            <Button variant="outline" size="sm" className="flex-1" onClick={() => setShowRemindModal(false)}>Hủy</Button>
                            <Button variant="primary" size="sm" className="flex-1" onClick={sendRemind}>Gửi</Button>
                        </div>
                    </div>
                )}
            </Modal>

            <Modal isOpen={showAssessmentModal} onClose={() => setShowAssessmentModal(false)} title={selectedStudent?.assessed ? "Sửa đánh giá" : "Đánh giá đóng góp"} size="lg">
                {selectedStudent && (
                    <div className="space-y-4 md:space-y-6 p-2 md:p-4">
                        <p className="text-sm md:text-base font-bold">Sinh viên: {selectedStudent.name} - {selectedStudent.class}</p>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 md:mb-3">Chọn tiêu chí</p>
                            <div className="flex flex-wrap gap-2">
                                {criteriaOptions.map(c => (
                                    <button
                                        key={c.id}
                                        onClick={() => toggleCriteria(c.id)}
                                        className={`px-3 md:px-4 py-1.5 md:py-2 rounded-lg md:rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
                                            assessmentForm.criteria.includes(c.id)
                                                ? 'bg-blue-600 text-white shadow-md'
                                                : 'bg-white border border-slate-200 text-slate-400 hover:border-blue-200'
                                        }`}
                                    >
                                        {c.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Ghi chú minh chứng</p>
                            <div className="relative">
                                <textarea
                                    className="w-full h-20 md:h-24 p-3 md:p-4 rounded-lg md:rounded-xl border border-slate-200 bg-slate-50/50 outline-none text-sm resize-none"
                                    placeholder="Nhập ghi chú..."
                                    value={assessmentForm.note}
                                    onChange={(e) => setAssessmentForm(prev => ({ ...prev, note: e.target.value }))}
                                />
                                <input type="file" accept="image/*" className="hidden" id="evidence-upload" onChange={handleImageUpload} />
                                <label htmlFor="evidence-upload" className="absolute bottom-3 right-3 h-8 w-8 md:h-10 md:w-10 bg-white rounded-lg shadow-sm border border-slate-100 flex items-center justify-center text-slate-400 hover:text-blue-600 cursor-pointer">
                                    <span className="material-symbols-outlined text-base md:text-lg">photo_camera</span>
                                </label>
                            </div>
                            {assessmentForm.image && (
                                <div className="mt-2 p-2 border rounded-lg flex items-center gap-2">
                                    <img src={assessmentForm.image} alt="evidence" className="h-8 w-8 md:h-10 md:w-10 object-cover rounded" />
                                    <span className="text-xs">Đã chọn ảnh</span>
                                    <button onClick={() => setAssessmentForm(prev => ({ ...prev, image: null }))} className="ml-auto text-red-500">
                                        <span className="material-symbols-outlined text-sm">close</span>
                                    </button>
                                </div>
                            )}
                        </div>
                        <div className="flex gap-3 pt-4">
                            <Button variant="outline" className="flex-1" onClick={() => setShowAssessmentModal(false)}>Hủy</Button>
                            <Button variant="primary" className="flex-1" onClick={selectedStudent?.assessed ? updateAssessment : saveAssessment}>
                                {selectedStudent?.assessed ? 'Cập nhật' : 'Xác nhận'}
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>

            <Modal isOpen={showAllStudentsModal} onClose={() => setShowAllStudentsModal(false)} title="Danh sách Sinh viên 5 Tốt" size="xl">
                <div className="space-y-4 md:space-y-6 p-2 md:p-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                        <p className="text-sm font-bold">Tổng số: {students.length} sinh viên</p>
                        <Button variant="primary" size="sm" onClick={exportToExcel} leftIcon={<span className="material-symbols-outlined text-base">download</span>}>
                            Xuất Excel
                        </Button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[600px] md:min-w-full">
                            <thead>
                                <tr className="bg-slate-50">
                                    <th className="px-3 md:px-4 py-3 text-left text-xs font-bold text-slate-400 uppercase">Họ tên</th>
                                    <th className="px-3 md:px-4 py-3 text-left text-xs font-bold text-slate-400 uppercase">Lớp</th>
                                    <th className="px-3 md:px-4 py-3 text-left text-xs font-bold text-slate-400 uppercase">Điểm</th>
                                    <th className="px-3 md:px-4 py-3 text-left text-xs font-bold text-slate-400 uppercase">Xếp hạng</th>
                                    <th className="px-3 md:px-4 py-3 text-left text-xs font-bold text-slate-400 uppercase">Trạng thái</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {students.map(s => (
                                    <tr key={s.id}>
                                        <td className="px-3 md:px-4 py-3 text-sm md:text-base font-bold">{s.name}</td>
                                        <td className="px-3 md:px-4 py-3 text-sm md:text-base">{s.class}</td>
                                        <td className="px-3 md:px-4 py-3 text-sm md:text-base">{s.points}</td>
                                        <td className="px-3 md:px-4 py-3 text-sm md:text-base">{s.rank}</td>
                                        <td className="px-3 md:px-4 py-3">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${s.status === 'Đã duyệt' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                                {s.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </Modal>

            <footer className="text-center pt-6 md:pt-8 text-xs font-medium text-slate-400">
                © 2025 Digital Youth Union System (DYUS). All rights reserved.<br />
                Module: Talent & Recognition Engine v4.0 - Khoa Công Nghệ Thông Tin
            </footer>

            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </div>
    );
};

export default SubAdminAwards;