import React, { useState } from 'react';
import { 
  X, Check, AlertCircle, FileText, CheckCircle2, XCircle, RotateCcw, 
  Award, Clock, Download, ExternalLink, ShieldCheck, Edit3, MessageSquare,
  Send, AlertTriangle, ArrowRight, CornerDownRight, CheckSquare, Loader2
} from 'lucide-react';
import { awardService } from '../../services/awardService';
import AwardStatusBadge from './AwardStatusBadge';

const AwardApplicationDetailModal = ({
  isOpen,
  onClose,
  application,
  onRefresh,
  currentUser = null,
  onOpenEdit = null
}) => {
  if (!isOpen || !application) return null;

  // Role detection
  const roleNames = currentUser?.roles?.map(r => r.name.toUpperCase()) || [];
  const isAdmin = roleNames.includes('ADMIN') || roleNames.includes('UNIVERSITY_ADMIN') || roleNames.includes('SUPERADMIN');
  const isProvince = roleNames.includes('PROVINCE') || roleNames.includes('THANHPHO') || roleNames.includes('CITY_ADMIN') || isAdmin;
  const isLeader = roleNames.includes('LEADER') || roleNames.includes('CHUTICH') || isAdmin;
  const isSchool = roleNames.includes('FACULTY_ADMIN') || roleNames.includes('SCHOOL') || isAdmin;
  const isCreator = application.created_by_id === currentUser?.id || isAdmin;

  // Evaluation state (grading mode)
  const [isGradingMode, setIsGradingMode] = useState(false);
  const [gradingState, setGradingState] = useState(() => {
    const map = {};
    (application.items || []).forEach(it => {
      map[it.id] = {
        eval_status: it.eval_status || null,
        eval_note: it.eval_note || ''
      };
    });
    return map;
  });

  // Modal dialog states
  const [activeModalAction, setActiveModalAction] = useState(null); // 'CONCLUDE_RETURN', 'CONCLUDE_QUALIFIED', 'LEADER_APPROVE', 'LEADER_REJECT', 'LEADER_RETURN', 'SCHOOL_FEEDBACK'
  const [modalReason, setModalReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [actionError, setActionError] = useState('');

  // Handle inline grading buttons
  const setItemGrade = (itemId, status) => {
    setGradingState(prev => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        eval_status: status
      }
    }));
  };

  const setItemNote = (itemId, note) => {
    setGradingState(prev => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        eval_note: note
      }
    }));
  };

  // Save temp evaluation
  const handleSaveTempEvaluation = async () => {
    setSubmitting(true);
    setActionError('');
    try {
      const itemsList = Object.keys(gradingState).map(itemId => ({
        item_id: itemId,
        eval_status: gradingState[itemId].eval_status,
        eval_note: gradingState[itemId].eval_note
      }));
      await awardService.evaluateApplication(application.id, {
        items: itemsList,
        is_temp_save: true
      });
      setIsGradingMode(false);
      if (onRefresh) onRefresh();
    } catch (err) {
      setActionError(err.message || 'Lỗi khi lưu tạm kết quả chấm điểm');
    } finally {
      setSubmitting(false);
    }
  };

  // Conclude Qualification dialog check
  const handleInitiateConcludeQualified = () => {
    // Check if any items have FAILED or not graded
    const failedItems = (application.items || []).filter(
      it => it.is_selected && gradingState[it.id]?.eval_status === 'FAILED'
    );
    const unreviewedItems = (application.items || []).filter(
      it => it.is_selected && !gradingState[it.id]?.eval_status
    );

    if (failedItems.length > 0 || unreviewedItems.length > 0) {
      setModalReason(`Cảnh báo: Hiện còn ${failedItems.length} tiêu chuẩn bị đánh giá 'Không đạt' và ${unreviewedItems.length} tiêu chuẩn chưa chấm điểm. Bạn có chắc chắn muốn kết luận Đủ tiêu chuẩn?`);
    } else {
      setModalReason('Hồ sơ đạt đầy đủ các tiêu chuẩn Sinh viên 5 Tốt.');
    }
    setActiveModalAction('CONCLUDE_QUALIFIED');
  };

  // Execute modal actions
  const handleExecuteModalAction = async () => {
    setSubmitting(true);
    setActionError('');
    try {
      if (activeModalAction === 'CONCLUDE_QUALIFIED') {
        await awardService.concludeApplication(application.id, {
          conclusion: 'QUALIFIED',
          reason: modalReason
        });
      } else if (activeModalAction === 'CONCLUDE_RETURN') {
        if (!modalReason.trim()) {
          setActionError('Vui lòng nhập lý do trả lại hồ sơ về trường.');
          setSubmitting(false);
          return;
        }
        await awardService.concludeApplication(application.id, {
          conclusion: 'RETURN_TO_SCHOOL',
          reason: modalReason
        });
      } else if (activeModalAction === 'LEADER_APPROVE') {
        await awardService.decisionApplication(application.id, {
          decision: 'APPROVED',
          note: modalReason
        });
      } else if (activeModalAction === 'LEADER_REJECT') {
        if (!modalReason.trim()) {
          setActionError('Vui lòng nhập lý do từ chối hồ sơ.');
          setSubmitting(false);
          return;
        }
        await awardService.decisionApplication(application.id, {
          decision: 'REJECTED',
          note: modalReason
        });
      } else if (activeModalAction === 'LEADER_RETURN') {
        if (!modalReason.trim()) {
          setActionError('Vui lòng nhập lý do trả lại hồ sơ.');
          setSubmitting(false);
          return;
        }
        await awardService.decisionApplication(application.id, {
          decision: 'RETURNED',
          note: modalReason
        });
      } else if (activeModalAction === 'SCHOOL_FEEDBACK') {
        if (!modalReason.trim()) {
          setActionError('Vui lòng nhập nội dung góp ý chỉnh sửa.');
          setSubmitting(false);
          return;
        }
        await awardService.feedbackApplication(application.id, {
          note: modalReason
        });
      }
      setActiveModalAction(null);
      setModalReason('');
      if (onRefresh) onRefresh();
    } catch (err) {
      setActionError(err.message || 'Lỗi khi thực hiện thao tác xét duyệt.');
    } finally {
      setSubmitting(false);
    }
  };

  // Submit to province directly (for school / creator)
  const handleSubmitToProvince = async () => {
    if (!window.confirm('Bạn có chắc chắn muốn gửi hồ sơ này lên Đoàn Trường để thẩm định?')) return;
    setSubmitting(true);
    try {
      await awardService.submitApplication(application.id);
      if (onRefresh) onRefresh();
    } catch (err) {
      alert(err.message || 'Lỗi khi gửi hồ sơ');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative z-10 w-full max-w-5xl bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4">
          <div className="flex items-center gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-blue-600 text-sm">{application.application_code}</span>
                <AwardStatusBadge status={application.status} isLate={application.is_late_submission} />
                <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200 font-semibold">
                  {application.target_type === 'COLLECTIVE' ? 'Tập thể' : 'Cá nhân'}
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-800 mt-1">{application.full_name}</h3>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60">
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs">
          {actionError && (
            <div className="p-3.5 bg-rose-50 text-rose-700 border border-rose-200 rounded-xl font-medium flex items-center gap-2">
              <AlertCircle size={18} className="shrink-0" />
              <span>{actionError}</span>
            </div>
          )}

          {/* Khối 3 cột thông tin hồ sơ */}
          <div className="bg-slate-50 rounded-xl border border-slate-200 p-5 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Cột 1: Thông tin cá nhân */}
            <div className="space-y-2">
              <span className="font-bold text-slate-500 uppercase tracking-wider block text-[11px] border-b border-slate-200 pb-1">
                Thông tin cá nhân
              </span>
              <p><span className="text-slate-500 font-medium">Họ và tên:</span> <span className="font-bold text-slate-800">{application.full_name}</span></p>
              <p><span className="text-slate-500 font-medium">Giới tính / Ngày sinh:</span> <span className="font-semibold text-slate-700">{application.gender || 'N/A'} · {application.date_of_birth || 'N/A'}</span></p>
              <p><span className="text-slate-500 font-medium">Số CCCD/CMND:</span> <span className="font-mono font-semibold text-slate-700">{application.cccd || 'N/A'}</span></p>
              <p><span className="text-slate-500 font-medium">Dân tộc / Tôn giáo:</span> <span className="font-semibold text-slate-700">{application.ethnicity || 'Kinh'} · {application.religion || 'Không'}</span></p>
              <p><span className="text-slate-500 font-medium">Địa chỉ thường trú:</span> <span className="font-semibold text-slate-700">{application.address || 'N/A'}</span></p>
            </div>

            {/* Cột 2: Thông tin học tập */}
            <div className="space-y-2">
              <span className="font-bold text-slate-500 uppercase tracking-wider block text-[11px] border-b border-slate-200 pb-1">
                Thông tin học tập
              </span>
              <p><span className="text-slate-500 font-medium">Mã số sinh viên:</span> <span className="font-mono font-bold text-blue-600">{application.student_code || application.student_id || 'N/A'}</span></p>
              <p><span className="text-slate-500 font-medium">Trường:</span> <span className="font-semibold text-slate-700">{application.school_name || 'ĐH Lạc Hồng'}</span></p>
              <p><span className="text-slate-500 font-medium">Khoa / Lớp:</span> <span className="font-semibold text-slate-700">{application.faculty_name} · {application.class_name}</span></p>
              <p><span className="text-slate-500 font-medium">Sinh viên năm:</span> <span className="font-semibold text-slate-700">Năm thứ {application.academic_year_num || 3} ({application.education_level || 'Đại học'})</span></p>
              <div className="flex items-center gap-3 pt-1">
                <span className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-200 font-bold">
                  GPA: {application.gpa ?? 'N/A'}
                </span>
                <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                  ĐRL: {application.training_score ?? 'N/A'}
                </span>
              </div>
            </div>

            {/* Cột 3: Đoàn - Hội & Liên hệ */}
            <div className="space-y-2">
              <span className="font-bold text-slate-500 uppercase tracking-wider block text-[11px] border-b border-slate-200 pb-1">
                Đoàn - Hội & Liên hệ
              </span>
              <p><span className="text-slate-500 font-medium">Chức vụ Đoàn - Hội:</span> <span className="font-semibold text-slate-700">{application.union_position || 'Đoàn viên'}</span></p>
              <p><span className="text-slate-500 font-medium">Tình trạng chính trị:</span> <span className="font-semibold text-slate-700">{application.political_status || 'Đoàn viên'}</span></p>
              <p><span className="text-slate-500 font-medium">Số điện thoại:</span> <span className="font-semibold text-slate-700">{application.phone_number || 'N/A'}</span></p>
              <p><span className="text-slate-500 font-medium">Email:</span> <span className="font-semibold text-slate-700">{application.email || 'N/A'}</span></p>
              <p><span className="text-slate-500 font-medium">Đợt xét chọn:</span> <span className="font-bold text-blue-600">{application.period_code || 'N/A'}</span></p>
            </div>
          </div>

          {/* Tóm tắt thành tích */}
          {application.achievement_summary && (
            <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-1 shadow-xs">
              <span className="font-bold text-slate-700 uppercase tracking-wider block text-[11px]">
                Tóm tắt thành tích nổi bật
              </span>
              <p className="text-slate-700 leading-relaxed font-medium">
                {application.achievement_summary}
              </p>
            </div>
          )}

          {/* Bảng Minh chứng Tiêu chuẩn & Chế độ Chấm điểm */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 px-5 py-3.5 border-b border-slate-200">
              <div>
                <h4 className="text-sm font-bold text-slate-800">
                  Minh chứng các tiêu chuẩn xét chọn SV5T ({application.items?.length || 0} tiêu chuẩn)
                </h4>
                <p className="text-[11px] text-slate-500">
                  Xem chi tiết giải trình, tài liệu minh chứng và kết quả thẩm định
                </p>
              </div>

              {/* Chế độ chấm điểm cho Thành phố / Admin */}
              {isProvince && (
                <div className="flex items-center gap-2">
                  {!isGradingMode ? (
                    <button
                      type="button"
                      onClick={() => setIsGradingMode(true)}
                      className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs inline-flex items-center gap-1.5 shadow-sm transition-colors"
                    >
                      <CheckSquare size={14} />
                      Chấm điểm · Cấp Trường
                    </button>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => setIsGradingMode(false)}
                        className="px-3 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold text-xs transition-colors"
                      >
                        Hủy chấm
                      </button>
                      <button
                        type="button"
                        disabled={submitting}
                        onClick={handleSaveTempEvaluation}
                        className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs inline-flex items-center gap-1.5 shadow-sm transition-colors disabled:opacity-50"
                      >
                        {submitting ? 'Đang lưu...' : 'Lưu tạm'}
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/80 text-slate-600 font-semibold border-b border-slate-200">
                    <th className="py-3 px-4 w-1/4">TIÊU CHUẨN</th>
                    <th className="py-3 px-4 w-1/4">GIẢI TRÌNH</th>
                    <th className="py-3 px-4 w-1/4">MINH CHỨNG (FILE)</th>
                    <th className="py-3 px-4 w-1/4 text-center">
                      {isGradingMode ? 'CHẤM ĐIỂM (ĐẠT / KHÔNG ĐẠT)' : 'KẾT QUẢ THẨM ĐỊNH'}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(application.items || []).map((it) => {
                    const std = it.standard || {};
                    const grade = gradingState[it.id] || { eval_status: it.eval_status, eval_note: it.eval_note };

                    return (
                      <tr key={it.id} className={it.is_selected ? 'hover:bg-slate-50/60' : 'opacity-40 bg-slate-50/40'}>
                        <td className="py-3 px-4 align-top">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                            {std.criteria_name}
                          </span>
                          <span className="font-semibold text-slate-800 block mt-0.5">
                            {std.title || 'Tiêu chuẩn'}
                          </span>
                          {std.rule_type === 'REQUIRED' ? (
                            <span className="inline-block mt-1 px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                              Bắt buộc
                            </span>
                          ) : (
                            <span className="inline-block mt-1 px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold">
                              {std.group_name || 'Lựa chọn'}
                            </span>
                          )}
                        </td>

                        <td className="py-3 px-4 align-top text-slate-700 font-medium">
                          {it.is_selected ? (
                            it.explanation || <span className="text-slate-400 italic">Không có giải trình</span>
                          ) : (
                            <span className="text-slate-400 italic">Không tích chọn</span>
                          )}
                        </td>

                        <td className="py-3 px-4 align-top">
                          {it.evidence_files && it.evidence_files.length > 0 ? (
                            <div className="space-y-1.5">
                              {it.evidence_files.map((f, fIdx) => (
                                <a
                                  key={fIdx}
                                  href={f.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-blue-50/80 hover:bg-blue-100 border border-blue-200 text-blue-700 font-medium truncate max-w-full transition-colors"
                                >
                                  <FileText size={12} className="shrink-0 text-blue-600" />
                                  <span className="truncate">{f.name}</span>
                                  <ExternalLink size={10} className="shrink-0 text-blue-500 ml-1" />
                                </a>
                              ))}
                            </div>
                          ) : (
                            <span className="text-slate-400 italic">Chưa đính kèm file</span>
                          )}
                        </td>

                        <td className="py-3 px-4 align-top">
                          {isGradingMode ? (
                            <div className="space-y-2">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => setItemGrade(it.id, 'PASSED')}
                                  className={`px-3 py-1 rounded-md font-bold text-xs transition-colors border ${
                                    grade.eval_status === 'PASSED'
                                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                                      : 'bg-white text-emerald-700 border-emerald-200 hover:bg-emerald-50'
                                  }`}
                                >
                                  ✓ Đạt
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setItemGrade(it.id, 'FAILED')}
                                  className={`px-3 py-1 rounded-md font-bold text-xs transition-colors border ${
                                    grade.eval_status === 'FAILED'
                                      ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                                      : 'bg-white text-rose-700 border-rose-200 hover:bg-rose-50'
                                  }`}
                                >
                                  ✕ Không đạt
                                </button>
                              </div>
                              <input
                                type="text"
                                placeholder="Lý do / ghi chú..."
                                value={grade.eval_note || ''}
                                onChange={(e) => setItemNote(it.id, e.target.value)}
                                className="w-full px-2.5 py-1 text-[11px] border border-slate-200 rounded outline-none focus:border-blue-500"
                              />
                            </div>
                          ) : (
                            <div className="text-center">
                              {it.eval_status ? (
                                <AwardStatusBadge status={it.eval_status} />
                              ) : (
                                <span className="text-slate-400 italic">Chưa chấm điểm</span>
                              )}
                              {it.eval_note && (
                                <p className="text-[11px] text-slate-500 mt-1 italic">
                                  {it.eval_note}
                                </p>
                              )}
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Tab Timeline Lịch sử xét duyệt */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Clock size={16} className="text-blue-600" />
              Lịch sử xét duyệt hồ sơ ({application.histories?.length || 0} thao tác)
            </h4>

            {application.histories && application.histories.length > 0 ? (
              <div className="relative border-l border-slate-200 ml-3 pl-4 space-y-4 pt-1">
                {application.histories.map((h) => (
                  <div key={h.id} className="relative">
                    <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-blue-500 border-2 border-white ring-2 ring-blue-100" />
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-slate-800">{h.action}</span>
                      {h.from_status && h.to_status && (
                        <div className="inline-flex items-center gap-1.5 text-[11px]">
                          <AwardStatusBadge status={h.from_status} size="xs" showIcon={false} />
                          <ArrowRight size={11} className="text-slate-400" />
                          <AwardStatusBadge status={h.to_status} size="xs" showIcon={false} />
                        </div>
                      )}
                      <span className="text-[11px] text-slate-400 ml-auto">
                        {h.created_at ? new Date(h.created_at).toLocaleString('vi-VN') : ''}
                      </span>
                    </div>
                    <div className="text-slate-600 text-[11px] mt-0.5">
                      Thực hiện bởi: <span className="font-semibold text-slate-700">{h.actor_name || 'Hệ thống'}</span>
                    </div>
                    {h.note && (
                      <p className="mt-1 p-2 rounded bg-slate-50 border border-slate-200 text-slate-700 text-[11px] italic">
                        "{h.note}"
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-400 italic">Chưa có nhật ký xét duyệt cho hồ sơ này.</p>
            )}
          </div>
        </div>

        {/* Footer Workflow Actions Bar */}
        <div className="border-t border-slate-200 bg-slate-50 px-6 py-4 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-colors text-xs"
          >
            Đóng
          </button>

          {/* Workflow Buttons based on Status & Role */}
          <div className="flex flex-wrap items-center gap-2">
            {/* 1. Trạng thái Đoàn Trường yêu cầu bổ sung (PROVINCE_RETURNED) cho Khoa / Người nộp */}
            {application.status === 'PROVINCE_RETURNED' && (isSchool || isCreator) && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    if (onOpenEdit) onOpenEdit(application);
                  }}
                  className="px-3.5 py-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 font-bold text-slate-700 text-xs shadow-xs"
                >
                  <Edit3 size={13} className="inline mr-1" />
                  Bổ sung hồ sơ
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveModalAction('SCHOOL_FEEDBACK');
                    setModalReason('');
                  }}
                  className="px-3.5 py-2 rounded-lg bg-amber-50 border border-amber-200 hover:bg-amber-100 font-bold text-amber-700 text-xs shadow-xs"
                >
                  <RotateCcw size={13} className="inline mr-1" />
                  Góp ý chỉnh sửa
                </button>
                <button
                  type="button"
                  disabled={submitting}
                  onClick={handleSubmitToProvince}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-colors"
                >
                  <Send size={13} className="inline mr-1" />
                  Gửi lên Đoàn Trường
                </button>
              </>
            )}

            {/* 2. Trạng thái Trả về (RETURNED) cho Người lập */}
            {application.status === 'RETURNED' && (isCreator || isSchool) && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    if (onOpenEdit) onOpenEdit(application);
                  }}
                  className="px-3.5 py-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 font-bold text-slate-700 text-xs shadow-xs"
                >
                  <Edit3 size={13} className="inline mr-1" />
                  Chỉnh sửa hồ sơ
                </button>
                <button
                  type="button"
                  disabled={submitting}
                  onClick={handleSubmitToProvince}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-colors"
                >
                  <Send size={13} className="inline mr-1" />
                  Nộp lại hồ sơ
                </button>
              </>
            )}

            {/* 3. Cụm nút Thẩm định của Ban Thường vụ Đoàn Trường (PENDING_PROVINCE) */}
            {application.status === 'PENDING_PROVINCE' && isProvince && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setActiveModalAction('CONCLUDE_RETURN');
                    setModalReason('');
                  }}
                  className="px-3.5 py-2 rounded-lg bg-amber-50 border border-amber-200 hover:bg-amber-100 font-bold text-amber-700 text-xs shadow-xs"
                >
                  <RotateCcw size={13} className="inline mr-1" />
                  Yêu cầu bổ sung
                </button>
                <button
                  type="button"
                  onClick={handleInitiateConcludeQualified}
                  className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-sm transition-colors"
                >
                  <Award size={13} className="inline mr-1" />
                  Đủ tiêu chuẩn
                </button>
              </>
            )}

            {/* 4. Cụm nút Quyết định của Chủ tịch hội đồng (QUALIFIED) */}
            {application.status === 'QUALIFIED' && isLeader && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setActiveModalAction('LEADER_RETURN');
                    setModalReason('');
                  }}
                  className="px-3.5 py-2 rounded-lg bg-amber-50 border border-amber-200 hover:bg-amber-100 font-bold text-amber-700 text-xs shadow-xs"
                >
                  <RotateCcw size={13} className="inline mr-1" />
                  Trả lại
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveModalAction('LEADER_REJECT');
                    setModalReason('');
                  }}
                  className="px-3.5 py-2 rounded-lg bg-rose-50 border border-rose-200 hover:bg-rose-100 font-bold text-rose-700 text-xs shadow-xs"
                >
                  <XCircle size={13} className="inline mr-1" />
                  Từ chối
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveModalAction('LEADER_APPROVE');
                    setModalReason('Đạt chuẩn Danh hiệu Sinh viên 5 Tốt cấp Trường');
                  }}
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-colors"
                >
                  <CheckCircle2 size={13} className="inline mr-1" />
                  Phê duyệt hồ sơ
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation & Reason Modals */}
      {activeModalAction && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setActiveModalAction(null)} />
          <div className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                {activeModalAction.includes('APPROVE') && <CheckCircle2 size={16} className="text-emerald-600" />}
                {activeModalAction.includes('REJECT') && <XCircle size={16} className="text-rose-600" />}
                {activeModalAction.includes('RETURN') && <RotateCcw size={16} className="text-amber-600" />}
                {activeModalAction.includes('QUALIFIED') && <Award size={16} className="text-purple-600" />}
                Xác nhận thao tác xét duyệt
              </h4>
              <button onClick={() => setActiveModalAction(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X size={16} />
              </button>
            </div>

            {actionError && (
              <div className="p-2.5 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg font-medium">
                {actionError}
              </div>
            )}

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                {activeModalAction.includes('REJECT') || activeModalAction.includes('RETURN') ? (
                  <>Lý do / Nội dung bắt buộc: <span className="text-rose-500">*</span></>
                ) : (
                  'Ghi chú / Quyết định kèm theo (Tùy chọn):'
                )}
              </label>
              <textarea
                rows="4"
                value={modalReason}
                onChange={(e) => setModalReason(e.target.value)}
                placeholder="Nhập nội dung phản hồi, số quyết định hoặc lý do..."
                className="w-full p-2.5 border border-slate-200 rounded-lg outline-none focus:border-blue-500 font-medium"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setActiveModalAction(null)}
                className="flex-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-colors"
              >
                Hủy
              </button>
              <button
                type="button"
                disabled={submitting}
                onClick={handleExecuteModalAction}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm transition-colors disabled:opacity-50"
              >
                {submitting ? 'Đang lưu...' : 'Xác nhận lưu'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AwardApplicationDetailModal;
