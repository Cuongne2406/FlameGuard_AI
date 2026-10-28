import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, Search, Calendar, FileText, ChevronRight, Eye, Edit3, Trash2, 
  Download, ExternalLink, X, CheckCircle2, Clock, AlertCircle, Layers
} from 'lucide-react';
import { awardService } from '../../services/awardService';
import AwardStatusBadge from './AwardStatusBadge';

const AwardPeriodsView = ({ isAdmin = false, onSelectPeriodForApplications }) => {
  const [periods, setPeriods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [debouncedKeyword, setDebouncedKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [yearFilter, setYearFilter] = useState('ALL');
  
  // Modal states
  const [selectedPeriod, setSelectedPeriod] = useState(null);
  const [periodStandards, setPeriodStandards] = useState([]);
  const [loadingStandards, setLoadingStandards] = useState(false);
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingPeriod, setEditingPeriod] = useState(null);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    year: new Date().getFullYear(),
    description: '',
    start_date: '',
    end_date: '',
    submission_deadline: '',
    decision_file_url: '',
    status: 'UPCOMING'
  });
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  // Debounce search 500ms
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedKeyword(keyword);
    }, 500);
    return () => clearTimeout(handler);
  }, [keyword]);

  const fetchPeriods = async () => {
    setLoading(true);
    try {
      const data = await awardService.getPeriods({
        status: statusFilter,
        year: yearFilter !== 'ALL' ? parseInt(yearFilter) : undefined,
        keyword: debouncedKeyword
      });
      setPeriods(data);
    } catch (err) {
      console.error('Error fetching periods:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPeriods();
  }, [statusFilter, yearFilter, debouncedKeyword]);

  const handleOpenDetail = async (period) => {
    setSelectedPeriod(period);
    setLoadingStandards(true);
    try {
      const stds = await awardService.getStandards(period.id);
      setPeriodStandards(stds);
    } catch (err) {
      console.error('Error fetching standards:', err);
    } finally {
      setLoadingStandards(false);
    }
  };

  const handleOpenCreate = (periodToEdit = null) => {
    if (periodToEdit) {
      setEditingPeriod(periodToEdit);
      setFormData({
        code: periodToEdit.code,
        name: periodToEdit.name,
        year: periodToEdit.year,
        description: periodToEdit.description || '',
        start_date: periodToEdit.start_date || '',
        end_date: periodToEdit.end_date || '',
        submission_deadline: periodToEdit.submission_deadline ? periodToEdit.submission_deadline.slice(0, 16) : '',
        decision_file_url: periodToEdit.decision_file_url || '',
        status: periodToEdit.status || 'UPCOMING'
      });
    } else {
      setEditingPeriod(null);
      const currentYear = new Date().getFullYear();
      setFormData({
        code: `SV5T-${currentYear}-${currentYear + 1}`,
        name: `Xét chọn Danh hiệu Sinh viên 5 Tốt cấp Trường năm học ${currentYear} - ${currentYear + 1}`,
        year: currentYear,
        description: '',
        start_date: `${currentYear}-09-01`,
        end_date: `${currentYear + 1}-06-30`,
        submission_deadline: `${currentYear + 1}-05-31T23:59`,
        decision_file_url: '',
        status: 'UPCOMING'
      });
    }
    setFormError('');
    setShowCreateModal(true);
  };

  const handleSavePeriod = async (e) => {
    e.preventDefault();
    setFormSubmitting(true);
    setFormError('');
    try {
      if (editingPeriod) {
        await awardService.updatePeriod(editingPeriod.id, formData);
      } else {
        await awardService.createPeriod(formData);
      }
      setShowCreateModal(false);
      await fetchPeriods();
    } catch (err) {
      setFormError(err.message || 'Lỗi khi lưu đợt khen thưởng');
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDeletePeriod = async (id, name) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa đợt '${name}'?`)) return;
    try {
      await awardService.deletePeriod(id);
      await fetchPeriods();
      if (selectedPeriod?.id === id) setSelectedPeriod(null);
    } catch (err) {
      alert(err.message || 'Lỗi khi xóa đợt khen thưởng');
    }
  };

  const yearsList = useMemo(() => {
    const setYears = new Set(periods.map(p => p.year));
    setYears.add(new Date().getFullYear());
    return Array.from(setYears).sort((a, b) => b - a);
  }, [periods]);

  return (
    <div className="space-y-6">
      {/* 1. Header Toolbar */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Quản lý Đợt khen thưởng SV5T</h2>
          <p className="text-xs text-slate-500 mt-1">
            Theo dõi, thiết lập tiêu chuẩn và hạn nộp hồ sơ xét chọn qua từng năm học
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {isAdmin && (
            <button
              onClick={() => handleOpenCreate()}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
            >
              <Plus size={16} />
              Tạo đợt khen thưởng
            </button>
          )}
        </div>
      </div>

      {/* 2. Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm theo mã hoặc tên đợt..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs font-medium border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 text-xs font-medium border border-slate-200 rounded-lg outline-none focus:border-blue-500 bg-white text-slate-700"
          >
            <option value="ALL">Tất cả trạng thái</option>
            <option value="ONGOING">Đang diễn ra</option>
            <option value="UPCOMING">Chưa bắt đầu</option>
            <option value="ENDED">Đã kết thúc</option>
          </select>
        </div>

        <div>
          <select
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            className="w-full px-3 py-2 text-xs font-medium border border-slate-200 rounded-lg outline-none focus:border-blue-500 bg-white text-slate-700"
          >
            <option value="ALL">Tất cả năm học</option>
            {yearsList.map(y => (
              <option key={y} value={y}>Năm học {y} - {y + 1}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 3. Table of Periods */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <th className="py-3.5 px-4">MÃ ĐỢT</th>
                <th className="py-3.5 px-4">TÊN ĐỢT KHEN THƯỞNG</th>
                <th className="py-3.5 px-4">THỜI GIAN DIỄN RA</th>
                <th className="py-3.5 px-4">HẠN CHÓT NỘP</th>
                <th className="py-3.5 px-4 text-center">TIÊU CHUẨN</th>
                <th className="py-3.5 px-4 text-center">SỐ HỒ SƠ</th>
                <th className="py-3.5 px-4">TRẠNG THÁI</th>
                <th className="py-3.5 px-4 text-right">THAO TÁC</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="8" className="text-center py-10 text-slate-400">
                    Đang tải danh sách đợt khen thưởng...
                  </td>
                </tr>
              ) : periods.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-10 text-slate-400">
                    Không tìm thấy đợt khen thưởng nào phù hợp
                  </td>
                </tr>
              ) : (
                periods.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-bold text-blue-600 font-mono">
                      {p.code}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-800">
                      <div>{p.name}</div>
                      {p.description && (
                        <p className="text-[11px] text-slate-500 font-normal line-clamp-1 mt-0.5">
                          {p.description}
                        </p>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                      {p.start_date} → {p.end_date}
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-700 whitespace-nowrap">
                      {p.submission_deadline ? new Date(p.submission_deadline).toLocaleDateString('vi-VN', {
                        hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric'
                      }) : 'N/A'}
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-slate-700">
                      {p.standards_count}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => onSelectPeriodForApplications && onSelectPeriodForApplications(p.id)}
                        className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 font-bold hover:underline"
                      >
                        {p.applications_count} hồ sơ
                      </button>
                    </td>
                    <td className="py-3 px-4">
                      <AwardStatusBadge status={p.status} />
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => handleOpenDetail(p)}
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-md transition-colors"
                          title="Xem chi tiết & Tiêu chuẩn"
                        >
                          <Eye size={15} />
                        </button>
                        {isAdmin && (
                          <>
                            <button
                              onClick={() => handleOpenCreate(p)}
                              className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-slate-100 rounded-md transition-colors"
                              title="Chỉnh sửa đợt"
                            >
                              <Edit3 size={15} />
                            </button>
                            <button
                              onClick={() => handleDeletePeriod(p.id, p.name)}
                              className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-slate-100 rounded-md transition-colors"
                              title="Xóa đợt"
                            >
                              <Trash2 size={15} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Modal Chi tiết đợt khen thưởng & Bảng tiêu chuẩn */}
      {selectedPeriod && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSelectedPeriod(null)} />
          <div className="relative z-10 w-full max-w-4xl bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4">
              <div>
                <span className="text-[11px] font-mono font-bold text-blue-600">{selectedPeriod.code}</span>
                <h3 className="text-base font-bold text-slate-800">{selectedPeriod.name}</h3>
              </div>
              <button onClick={() => setSelectedPeriod(null)} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60">
                <X size={18} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6">
              {/* Info grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-500 block font-medium">Thời gian diễn ra:</span>
                  <span className="font-semibold text-slate-800">{selectedPeriod.start_date} → {selectedPeriod.end_date}</span>
                </div>
                <div>
                  <span className="text-slate-500 block font-medium">Hạn chót nộp hồ sơ:</span>
                  <span className="font-semibold text-rose-600">
                    {new Date(selectedPeriod.submission_deadline).toLocaleString('vi-VN')}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block font-medium">Trạng thái đợt:</span>
                  <AwardStatusBadge status={selectedPeriod.status} />
                </div>
              </div>

              {selectedPeriod.decision_file_url && (
                <div className="flex items-center justify-between bg-blue-50/60 border border-blue-200 px-4 py-3 rounded-xl text-xs">
                  <div className="flex items-center gap-2 text-blue-800 font-medium">
                    <FileText size={16} className="text-blue-600" />
                    <span>Văn bản quyết định / Hướng dẫn tiêu chí xét chọn ban hành kèm theo</span>
                  </div>
                  <a
                    href={selectedPeriod.decision_file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 font-bold text-blue-600 hover:underline"
                  >
                    Xem văn bản <ExternalLink size={13} />
                  </a>
                </div>
              )}

              {/* Bảng tiêu chuẩn 4 cột chuẩn Enterprise */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <Layers size={16} className="text-blue-600" />
                    Bảng tiêu chuẩn đánh giá Sinh viên 5 Tốt ({periodStandards.length} tiêu chuẩn)
                  </h4>
                </div>

                <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                        <th className="py-3 px-3.5 w-1/5">TIÊU CHÍ</th>
                        <th className="py-3 px-3.5 w-2/5">TIÊU CHUẨN</th>
                        <th className="py-3 px-3.5 w-1/4">YÊU CẦU MINH CHỨNG</th>
                        <th className="py-3 px-3.5 w-1/6">VĂN BẢN</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {loadingStandards ? (
                        <tr>
                          <td colSpan="4" className="text-center py-6 text-slate-400">
                            Đang tải bộ tiêu chuẩn...
                          </td>
                        </tr>
                      ) : periodStandards.length === 0 ? (
                        <tr>
                          <td colSpan="4" className="text-center py-6 text-slate-400">
                            Chưa có tiêu chuẩn nào được thiết lập cho đợt này.
                          </td>
                        </tr>
                      ) : (
                        periodStandards.map((std) => (
                          <tr key={std.id} className="hover:bg-slate-50/50">
                            <td className="py-2.5 px-3.5 font-bold text-slate-800 align-top">
                              {std.criteria_name}
                            </td>
                            <td className="py-2.5 px-3.5 text-slate-700 align-top">
                              <div className="font-semibold text-slate-900">{std.title}</div>
                              {std.rule_type === 'REQUIRED' ? (
                                <span className="inline-block mt-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                                  Bắt buộc
                                </span>
                              ) : (
                                <span className="inline-block mt-1 px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold">
                                  {std.group_name || `Chọn ít nhất ${std.min_select_count || 1}`}
                                </span>
                              )}
                            </td>
                            <td className="py-2.5 px-3.5 text-slate-600 align-top">
                              {std.evidence_requirement || '—'}
                            </td>
                            <td className="py-2.5 px-3.5 text-slate-500 font-mono text-[11px] align-top">
                              {std.document_reference || '—'}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-200 bg-slate-50 px-6 py-3.5 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedPeriod(null)}
                className="px-4 py-2 bg-slate-200 text-slate-700 hover:bg-slate-300 font-semibold text-xs rounded-lg transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Modal Tạo / Sửa đợt khen thưởng */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowCreateModal(false)} />
          <div className="relative z-10 w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4">
              <h3 className="text-base font-bold text-slate-800">
                {editingPeriod ? 'Chỉnh sửa đợt khen thưởng' : 'Tạo đợt khen thưởng mới'}
              </h3>
              <button onClick={() => setShowCreateModal(false)} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSavePeriod} className="p-6 space-y-4 text-xs">
              {formError && (
                <div className="p-3 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg font-medium flex items-center gap-2">
                  <AlertCircle size={16} />
                  {formError}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-bold uppercase tracking-wider mb-1">
                    Mã đợt <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500 font-mono"
                    placeholder="SV5T-2026-2027"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-bold uppercase tracking-wider mb-1">
                    Năm học <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-bold uppercase tracking-wider mb-1">
                  Tên đợt khen thưởng <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500 font-semibold"
                  placeholder="Xét chọn Danh hiệu Sinh viên 5 Tốt..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-bold uppercase tracking-wider mb-1">
                    Ngày bắt đầu <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-bold uppercase tracking-wider mb-1">
                    Ngày kết thúc <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-bold uppercase tracking-wider mb-1">
                  Hạn chót nộp hồ sơ <span className="text-rose-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  required
                  value={formData.submission_deadline}
                  onChange={(e) => setFormData({ ...formData, submission_deadline: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-bold uppercase tracking-wider mb-1">
                  Trạng thái đợt
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500 bg-white"
                >
                  <option value="UPCOMING">Chưa bắt đầu</option>
                  <option value="ONGOING">Đang diễn ra (Cho phép nộp)</option>
                  <option value="ENDED">Đã kết thúc</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-bold uppercase tracking-wider mb-1">
                  Mô tả / Hướng dẫn
                </label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500"
                  placeholder="Nhập thông tin giới thiệu hoặc chỉ dẫn cụ thể..."
                />
              </div>

              <div className="flex gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm transition-colors disabled:opacity-50"
                >
                  {formSubmitting ? 'Đang lưu...' : 'Lưu đợt khen thưởng'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AwardPeriodsView;
