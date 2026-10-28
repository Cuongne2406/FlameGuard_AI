import React, { useState, useEffect } from 'react';
import { 
  X, Check, AlertCircle, Upload, Trash2, FileText, CheckCircle2, 
  HelpCircle, Sparkles, ExternalLink, ShieldCheck, Loader2
} from 'lucide-react';
import { awardService } from '../../services/awardService';
import { userService } from '../../services/userService';

const AwardApplicationFormModal = ({
  isOpen,
  onClose,
  initialData = null,
  application = null,
  mode = 'create',
  periodId = null,
  onSuccess,
  currentUser = null
}) => {
  const effectiveData = initialData || application;
  const [periods, setPeriods] = useState([]);
  const [selectedPeriodId, setSelectedPeriodId] = useState(periodId || '');
  const [standards, setStandards] = useState([]);
  const [loadingStandards, setLoadingStandards] = useState(false);

  // Form info state
  const [targetType, setTargetType] = useState('INDIVIDUAL');
  const [fullName, setFullName] = useState('');
  const [address, setAddress] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('Nam');
  const [cccd, setCccd] = useState('');
  const [ethnicity, setEthnicity] = useState('Kinh');
  const [religion, setReligion] = useState('Không');

  const [studentCode, setStudentCode] = useState('');
  const [academicYearNum, setAcademicYearNum] = useState(3);
  const [schoolName, setSchoolName] = useState('Trường Đại học Lạc Hồng');
  const [facultyName, setFacultyName] = useState('Khoa Công nghệ Thông tin');
  const [className, setClassName] = useState('21CT111');
  const [educationLevel, setEducationLevel] = useState('Đại học');
  const [gpa, setGpa] = useState(3.5);
  const [trainingScore, setTrainingScore] = useState(90);

  const [unionPosition, setUnionPosition] = useState('Đoàn viên');
  const [politicalStatus, setPoliticalStatus] = useState('Đoàn viên');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');

  const [achievementSummary, setAchievementSummary] = useState('');
  const [legalCommitment, setLegalCommitment] = useState(true);

  // Standards items selection and evidence
  const [itemsMap, setItemsMap] = useState({}); // standardId -> { is_selected, explanation, evidence_files }
  const [uploadingForStdId, setUploadingForStdId] = useState(null);

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [autoFillFeedback, setAutoFillFeedback] = useState('');
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);

  // 1. Load active periods
  useEffect(() => {
    const fetchOngoingPeriods = async () => {
      try {
        const list = await awardService.getPeriods({ status: 'ONGOING' });
        setPeriods(list);
        if (!selectedPeriodId && list.length > 0) {
          setSelectedPeriodId(list[0].id);
        }
      } catch (err) {
        console.error('Error fetching ongoing periods:', err);
      }
    };
    if (isOpen) {
      fetchOngoingPeriods();
    }
  }, [isOpen]);

  // 2. Load Standards when period changes
  useEffect(() => {
    if (!selectedPeriodId) return;
    const fetchStandards = async () => {
      setLoadingStandards(true);
      try {
        const stds = await awardService.getStandards(selectedPeriodId);
        setStandards(stds);

        // Pre-populate items if effectiveData has items
        const initialMap = {};
        if (effectiveData?.items) {
          for (const it of effectiveData.items) {
            initialMap[it.standard_id] = {
              is_selected: it.is_selected,
              explanation: it.explanation || '',
              evidence_files: it.evidence_files || []
            };
          }
        } else {
          // Default: select REQUIRED standards
          for (const s of stds) {
            initialMap[s.id] = {
              is_selected: s.rule_type === 'REQUIRED',
              explanation: '',
              evidence_files: []
            };
          }
        }
        setItemsMap(initialMap);
      } catch (err) {
        console.error('Error fetching standards for period:', err);
      } finally {
        setLoadingStandards(false);
      }
    };
    fetchStandards();
  }, [selectedPeriodId, effectiveData]);

  const applyProfileToForm = (profile) => {
    if (!profile) return;
    setFullName(profile.full_name || '');
    setCccd(profile.cccd || '');
    setGender(profile.gender || 'Nam');
    setDateOfBirth(profile.date_of_birth ? String(profile.date_of_birth).split('T')[0] : '');
    setEthnicity(profile.ethnicity || 'Kinh');
    setReligion(profile.religion || 'Không');
    setAddress(profile.address || '');

    setStudentCode(profile.student_code || profile.student_id || '');
    setAcademicYearNum(profile.academic_year_num ?? 3);
    setSchoolName(profile.school_name || 'Trường Đại học Lạc Hồng');
    setFacultyName(profile.faculty_name || 'Khoa Công nghệ Thông tin');
    setClassName(profile.class_name || '');
    setEducationLevel(profile.education_level || 'Đại học');
    setGpa(profile.gpa ?? 3.5);
    setTrainingScore(profile.training_score ?? 90);

    setUnionPosition(profile.union_position || 'Đoàn viên');
    setPoliticalStatus(profile.political_status || 'Đoàn viên');
    setPhoneNumber(profile.phone_number || '');
    setEmail(profile.email || '');

    setAchievementSummary(profile.achievement_summary || '');
  };

  const handleAutoFill = async () => {
    setIsLoadingProfile(true);
    setAutoFillFeedback('');
    try {
      const freshUser = await userService.getMe();
      if (freshUser) {
        applyProfileToForm(freshUser);
        setAutoFillFeedback('Đã tự động điền thông tin từ Hồ sơ Cài đặt');
      } else if (currentUser) {
        applyProfileToForm(currentUser);
        setAutoFillFeedback('Đã tự động điền thông tin từ Hồ sơ Cài đặt');
      }
    } catch (err) {
      console.error('Lỗi khi lấy thông tin người dùng để tự động điền:', err);
      if (currentUser) {
        applyProfileToForm(currentUser);
        setAutoFillFeedback('Đã tự động điền thông tin từ Hồ sơ Cài đặt');
      }
    } finally {
      setIsLoadingProfile(false);
      setTimeout(() => setAutoFillFeedback(''), 4000);
    }
  };

  // 3. Populate form if editing or auto-fill on mount if creating individual application
  useEffect(() => {
    if (!isOpen) return;

    if (effectiveData) {
      setTargetType(effectiveData.target_type || 'INDIVIDUAL');
      setFullName(effectiveData.full_name || '');
      setAddress(effectiveData.address || '');
      setDateOfBirth(effectiveData.date_of_birth ? String(effectiveData.date_of_birth).split('T')[0] : '');
      setGender(effectiveData.gender || 'Nam');
      setCccd(effectiveData.cccd || '');
      setEthnicity(effectiveData.ethnicity || 'Kinh');
      setReligion(effectiveData.religion || 'Không');

      setStudentCode(effectiveData.student_code || effectiveData.student_id || '');
      setAcademicYearNum(effectiveData.academic_year_num ?? 3);
      setSchoolName(effectiveData.school_name || 'Trường Đại học Lạc Hồng');
      setFacultyName(effectiveData.faculty_name || 'Khoa Công nghệ Thông tin');
      setClassName(effectiveData.class_name || '');
      setEducationLevel(effectiveData.education_level || 'Đại học');
      setGpa(effectiveData.gpa ?? 3.5);
      setTrainingScore(effectiveData.training_score ?? 90);

      setUnionPosition(effectiveData.union_position || 'Đoàn viên');
      setPoliticalStatus(effectiveData.political_status || 'Đoàn viên');
      setPhoneNumber(effectiveData.phone_number || '');
      setEmail(effectiveData.email || '');

      setAchievementSummary(effectiveData.achievement_summary || '');
      setLegalCommitment(effectiveData.legal_commitment ?? true);
      if (effectiveData.period_id) setSelectedPeriodId(effectiveData.period_id);
    } else if (targetType === 'INDIVIDUAL') {
      // Auto-fill on mount for new individual applications
      const autoFillOnMount = async () => {
        try {
          const freshUser = await userService.getMe();
          if (freshUser) {
            applyProfileToForm(freshUser);
          } else if (currentUser) {
            applyProfileToForm(currentUser);
          }
        } catch (err) {
          console.error('Tự động điền khi mở modal thất bại:', err);
          if (currentUser) {
            applyProfileToForm(currentUser);
          }
        }
      };
      autoFillOnMount();
    }
  }, [effectiveData, currentUser, isOpen, targetType]);

  const handleToggleSelectStandard = (stdId) => {
    setItemsMap(prev => ({
      ...prev,
      [stdId]: {
        ...prev[stdId],
        is_selected: !prev[stdId]?.is_selected
      }
    }));
  };

  const handleExplanationChange = (stdId, text) => {
    setItemsMap(prev => ({
      ...prev,
      [stdId]: {
        ...prev[stdId],
        explanation: text
      }
    }));
  };

  const handleFileUpload = async (stdId, event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > 20 * 1024 * 1024) {
      alert('Kích thước file không được vượt quá 20MB');
      return;
    }

    setUploadingForStdId(stdId);
    try {
      const uploaded = await awardService.uploadEvidenceFile(file);
      setItemsMap(prev => {
        const currentFiles = prev[stdId]?.evidence_files || [];
        return {
          ...prev,
          [stdId]: {
            ...prev[stdId],
            is_selected: true, // Auto check when evidence is attached
            evidence_files: [...currentFiles, uploaded]
          }
        };
      });
    } catch (err) {
      alert(err.message || 'Lỗi khi tải file minh chứng lên Cloudinary');
    } finally {
      setUploadingForStdId(null);
      event.target.value = '';
    }
  };

  const handleRemoveFile = (stdId, fileIndex) => {
    setItemsMap(prev => {
      const currentFiles = prev[stdId]?.evidence_files || [];
      const updatedFiles = currentFiles.filter((_, idx) => idx !== fileIndex);
      return {
        ...prev,
        [stdId]: {
          ...prev[stdId],
          evidence_files: updatedFiles
        }
      };
    });
  };

  const handleSubmit = async (isDraftMode = false) => {
    setErrorMessage('');
    
    // Convert itemsMap to list
    const itemsList = standards.map(s => {
      const itemData = itemsMap[s.id] || {};
      return {
        standard_id: s.id,
        is_selected: !!itemData.is_selected,
        explanation: itemData.explanation || '',
        evidence_files: itemData.evidence_files || []
      };
    });

    const payload = {
      period_id: selectedPeriodId,
      target_type: targetType,
      full_name: fullName,
      address,
      date_of_birth: dateOfBirth || null,
      gender,
      cccd,
      ethnicity,
      religion,
      student_code: studentCode,
      academic_year_num: parseInt(academicYearNum) || 3,
      school_name: schoolName,
      faculty_name: facultyName,
      class_name: className,
      education_level: educationLevel,
      gpa: parseFloat(gpa) || 0,
      training_score: parseInt(trainingScore) || 0,
      union_position: unionPosition,
      political_status: politicalStatus,
      phone_number: phoneNumber,
      email,
      achievement_summary: achievementSummary,
      legal_commitment: legalCommitment,
      is_draft: isDraftMode,
      items: itemsList
    };

    setSubmitting(true);
    try {
      if (effectiveData?.id) {
        await awardService.updateApplication(effectiveData.id, payload);
      } else {
        await awardService.createApplication(payload);
      }
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      setErrorMessage(err.message || 'Lỗi khi lưu hồ sơ xét chọn.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative z-10 w-full max-w-5xl bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4">
          <div>
            <h3 className="text-base font-bold text-slate-800">
              {effectiveData ? `Chỉnh sửa / Bổ sung hồ sơ (${effectiveData.application_code || ''})` : 'Lập hồ sơ xét chọn Danh hiệu Sinh viên 5 Tốt'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Vui lòng điền đầy đủ 3 nhóm thông tin và đính kèm minh chứng cho các tiêu chuẩn
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60">
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs">
          {errorMessage && (
            <div className="p-3.5 bg-rose-50 text-rose-700 border border-rose-200 rounded-xl font-medium flex items-center gap-2">
              <AlertCircle size={18} className="shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Section 1: Thông tin người đề cử */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <span className="font-bold text-slate-800 text-sm">1. THÔNG TIN NGƯỜI ĐỀ CỬ</span>
                <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-50">
                  <button
                    type="button"
                    onClick={() => setTargetType('INDIVIDUAL')}
                    className={`px-3 py-1 rounded-md font-semibold ${targetType === 'INDIVIDUAL' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600'}`}
                  >
                    Cá nhân
                  </button>
                  <button
                    type="button"
                    onClick={() => setTargetType('COLLECTIVE')}
                    className={`px-3 py-1 rounded-md font-semibold ${targetType === 'COLLECTIVE' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600'}`}
                  >
                    Tập thể
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                {autoFillFeedback && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-xs animate-in fade-in">
                    <CheckCircle2 size={13} className="text-emerald-600" />
                    {autoFillFeedback}
                  </span>
                )}
                <div className="flex items-center gap-2">
                  <span className="hidden sm:inline-block text-[11px] text-slate-400 italic">
                    Thông tin được đồng bộ tự động từ mục Cài đặt tài khoản
                  </span>
                  <button
                    type="button"
                    onClick={handleAutoFill}
                    disabled={isLoadingProfile}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 font-semibold transition-all active:scale-95 disabled:opacity-60"
                    title="Đồng bộ lại thông tin mới nhất từ Cài đặt"
                  >
                    {isLoadingProfile ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                    Tự động điền thông tin (Auto-fill)
                  </button>
                </div>
              </div>
            </div>

            {/* 3-Column Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Cột 1: Thông tin cá nhân */}
              <div className="space-y-3">
                <span className="font-bold text-slate-500 uppercase tracking-wider block text-[11px] border-b border-slate-100 pb-1">
                  Thông tin cá nhân
                </span>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    {targetType === 'INDIVIDUAL' ? 'Họ và tên' : 'Tên tập thể'} <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Nguyễn Văn A"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500 font-semibold text-slate-800"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">CCCD/CMND</label>
                    <input
                      type="text"
                      value={cccd}
                      onChange={(e) => setCccd(e.target.value)}
                      placeholder="075..."
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Giới tính</label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500 bg-white"
                    >
                      <option value="Nam">Nam</option>
                      <option value="Nữ">Nữ</option>
                      <option value="Khác">Khác</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Ngày sinh</label>
                    <input
                      type="date"
                      value={dateOfBirth}
                      onChange={(e) => setDateOfBirth(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Dân tộc</label>
                    <input
                      type="text"
                      value={ethnicity}
                      onChange={(e) => setEthnicity(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Tôn giáo</label>
                  <input
                    type="text"
                    value={religion}
                    onChange={(e) => setReligion(e.target.value)}
                    placeholder="Không"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Địa chỉ thường trú</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Biên Hòa, Đồng Nai..."
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Cột 2: Thông tin học tập */}
              <div className="space-y-3">
                <span className="font-bold text-slate-500 uppercase tracking-wider block text-[11px] border-b border-slate-100 pb-1">
                  Thông tin học tập
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      Mã số sinh viên <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required={targetType === 'INDIVIDUAL'}
                      value={studentCode}
                      onChange={(e) => setStudentCode(e.target.value)}
                      placeholder="121000..."
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500 font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">SV năm thứ</label>
                    <select
                      value={academicYearNum}
                      onChange={(e) => setAcademicYearNum(parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500 bg-white"
                    >
                      <option value={1}>Năm 1</option>
                      <option value={2}>Năm 2</option>
                      <option value={3}>Năm 3</option>
                      <option value={4}>Năm 4</option>
                      <option value={5}>Năm 5</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Trường trực thuộc</label>
                  <input
                    type="text"
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Khoa / Bộ môn</label>
                    <input
                      type="text"
                      value={facultyName}
                      onChange={(e) => setFacultyName(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Chi đoàn / Lớp</label>
                    <input
                      type="text"
                      value={className}
                      onChange={(e) => setClassName(e.target.value)}
                      placeholder="21CT111"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Trình độ đào tạo</label>
                  <select
                    value={educationLevel}
                    onChange={(e) => setEducationLevel(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500 bg-white"
                  >
                    <option value="Đại học">Đại học</option>
                    <option value="Cao đẳng">Cao đẳng</option>
                    <option value="Sau đại học">Sau đại học</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Điểm GPA (Học tập)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="4.0"
                      value={gpa}
                      onChange={(e) => setGpa(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500 font-bold text-blue-600"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Điểm Rèn luyện</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={trainingScore}
                      onChange={(e) => setTrainingScore(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500 font-bold text-emerald-600"
                    />
                  </div>
                </div>
              </div>

              {/* Cột 3: Đoàn - Hội & Liên hệ */}
              <div className="space-y-3">
                <span className="font-bold text-slate-500 uppercase tracking-wider block text-[11px] border-b border-slate-100 pb-1">
                  Đoàn - Hội & Liên hệ
                </span>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Chức vụ Đoàn - Hội</label>
                  <input
                    type="text"
                    value={unionPosition}
                    onChange={(e) => setUnionPosition(e.target.value)}
                    placeholder="Bí thư Chi đoàn / Đoàn viên..."
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Tình trạng chính trị</label>
                  <select
                    value={politicalStatus}
                    onChange={(e) => setPoliticalStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500 bg-white"
                  >
                    <option value="Đoàn viên">Đoàn viên</option>
                    <option value="Đảng viên">Đảng viên</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Số điện thoại liên hệ</label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="0912..."
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Hòm thư điện tử (Email)</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="sinhvien@lhu.edu.vn"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Tóm tắt thành tích */}
            <div className="pt-2 border-t border-slate-100">
              <label className="font-semibold text-slate-700 block mb-1">
                Tóm tắt thành tích nổi bật trong năm học
              </label>
              <textarea
                rows="2"
                value={achievementSummary}
                onChange={(e) => setAchievementSummary(e.target.value)}
                placeholder="Ghi ngắn gọn các thành tích học thuật, nghiên cứu khoa học, hoạt động tình nguyện tiêu biểu..."
                className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Section 2: Đợt khen thưởng & Bảng tiêu chuẩn minh chứng */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <span className="font-bold text-slate-800 text-sm">2. ĐỢT KHEN THƯỞNG & MINH CHỨNG TIÊU CHUẨN</span>
              <div className="flex items-center gap-2">
                <span className="text-slate-500">Đợt xét chọn:</span>
                <select
                  value={selectedPeriodId}
                  onChange={(e) => setSelectedPeriodId(e.target.value)}
                  className="px-3 py-1.5 border border-slate-200 rounded-lg outline-none focus:border-blue-500 bg-white font-semibold text-blue-600"
                >
                  {periods.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.code})</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Table of Standards */}
            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                    <th className="py-3 px-3 w-12 text-center">TÍCH CHỌN</th>
                    <th className="py-3 px-3 w-1/4">TIÊU CHUẨN</th>
                    <th className="py-3 px-3 w-1/3">GIẢI TRÌNH THÀNH TÍCH</th>
                    <th className="py-3 px-3 w-1/3">FILE MINH CHỨNG (CLOUDINARY)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loadingStandards ? (
                    <tr>
                      <td colSpan="4" className="text-center py-6 text-slate-400">
                        Đang tải danh sách tiêu chuẩn...
                      </td>
                    </tr>
                  ) : standards.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center py-6 text-slate-400">
                        Đợt này chưa thiết lập bộ tiêu chuẩn đánh giá.
                      </td>
                    </tr>
                  ) : (
                    standards.map((std) => {
                      const itemState = itemsMap[std.id] || { is_selected: false, explanation: '', evidence_files: [] };
                      const isUploading = uploadingForStdId === std.id;

                      return (
                        <tr key={std.id} className={itemState.is_selected ? 'bg-blue-50/20' : 'hover:bg-slate-50/50'}>
                          <td className="py-3 px-3 text-center align-top">
                            <input
                              type="checkbox"
                              checked={itemState.is_selected}
                              onChange={() => handleToggleSelectStandard(std.id)}
                              className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer mt-1"
                            />
                          </td>
                          <td className="py-3 px-3 align-top">
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{std.criteria_name}</div>
                            <div className="font-semibold text-slate-800 mt-0.5">{std.title}</div>
                            {std.rule_type === 'REQUIRED' ? (
                              <span className="inline-block mt-1 px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                                Bắt buộc
                              </span>
                            ) : (
                              <span className="inline-block mt-1 px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold">
                                {std.group_name || `Chọn ít nhất ${std.min_select_count}`}
                              </span>
                            )}
                            {std.evidence_requirement && (
                              <p className="text-[11px] text-slate-500 mt-1 italic">
                                Y/cầu: {std.evidence_requirement}
                              </p>
                            )}
                          </td>
                          <td className="py-3 px-3 align-top">
                            <textarea
                              rows="2"
                              value={itemState.explanation}
                              onChange={(e) => handleExplanationChange(std.id, e.target.value)}
                              placeholder="Nhập giải trình, số quyết định, điểm số..."
                              className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg outline-none focus:border-blue-500 text-xs"
                            />
                          </td>
                          <td className="py-3 px-3 align-top">
                            <div className="space-y-2">
                              {/* List of uploaded files */}
                              {itemState.evidence_files && itemState.evidence_files.length > 0 && (
                                <div className="space-y-1">
                                  {itemState.evidence_files.map((f, idx) => (
                                    <div key={idx} className="flex items-center justify-between bg-slate-50 border border-slate-200 px-2.5 py-1 rounded text-[11px]">
                                      <a
                                        href={f.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline flex items-center gap-1 font-medium truncate max-w-[160px]"
                                      >
                                        <FileText size={12} className="shrink-0" />
                                        <span className="truncate">{f.name}</span>
                                      </a>
                                      <button
                                        type="button"
                                        onClick={() => handleRemoveFile(std.id, idx)}
                                        className="text-slate-400 hover:text-rose-600 p-0.5 ml-1"
                                      >
                                        <Trash2 size={12} />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {/* Upload Button */}
                              <div>
                                <label className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-slate-200 hover:bg-slate-50 rounded text-slate-700 cursor-pointer font-medium shadow-xs">
                                  {isUploading ? (
                                    <>
                                      <Loader2 size={13} className="animate-spin text-blue-600" />
                                      <span>Đang tải...</span>
                                    </>
                                  ) : (
                                    <>
                                      <Upload size={13} className="text-slate-500" />
                                      <span>+ Đính kèm file</span>
                                    </>
                                  )}
                                  <input
                                    type="file"
                                    className="hidden"
                                    onChange={(e) => handleFileUpload(std.id, e)}
                                    disabled={isUploading}
                                  />
                                </label>
                              </div>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Legal Commitment Checkbox */}
            <div className="pt-2 flex items-start gap-2.5 bg-slate-50 p-3 rounded-lg border border-slate-200">
              <input
                type="checkbox"
                id="legalCommitment"
                checked={legalCommitment}
                onChange={(e) => setLegalCommitment(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer mt-0.5"
              />
              <label htmlFor="legalCommitment" className="text-[11px] text-slate-700 leading-relaxed cursor-pointer font-medium">
                <span className="font-bold text-slate-900">Cam kết trách nhiệm:</span> Tôi cam đoan mọi thông tin và tài liệu minh chứng đính kèm trong hồ sơ hoàn toàn trung thực và chịu trách nhiệm kỷ luật theo quy định nếu có sai phạm.
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 bg-slate-50 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-colors text-xs"
          >
            Hủy bỏ
          </button>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              disabled={submitting}
              onClick={() => handleSubmit(true)}
              className="flex-1 sm:flex-initial px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold rounded-lg transition-colors text-xs disabled:opacity-50"
            >
              Lưu nháp
            </button>
            <button
              type="button"
              disabled={submitting}
              onClick={() => handleSubmit(false)}
              className="flex-1 sm:flex-initial px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm transition-colors text-xs disabled:opacity-50 inline-flex items-center justify-center gap-1.5"
            >
              {submitting ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                <>
                  <CheckCircle2 size={14} />
                  Nộp hồ sơ lên Đoàn Trường
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AwardApplicationFormModal;
