import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Save, Sparkles, Building, Calendar, DollarSign, Loader2, AlertCircle } from "lucide-react";
import { organizationService } from "../../../services/organizationService";
import { systemService } from "../../../services/systemService";
import { campaignService } from "../../../services/campaignService";

const CampaignCreatePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);
  const [error, setError] = useState(null);

  // Form options
  const [organizations, setOrganizations] = useState([]);
  const [academicTerms, setAcademicTerms] = useState([]);

  // Form data
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    organization_id: "",
    academic_term_id: "",
    total_budget_allocated: "",
    start_date: "",
    end_date: "",
    status: "PLANNING",
  });

  // Fetch lists on load
  useEffect(() => {
    const loadData = async () => {
      try {
        const [orgsRes, termsRes] = await Promise.all([
          organizationService.getOrganizations(),
          systemService.getAcademicTerms(),
        ]);
        if (Array.isArray(orgsRes)) setOrganizations(orgsRes);
        if (Array.isArray(termsRes)) setAcademicTerms(termsRes);
      } catch (err) {
        console.error("Error fetching form requirements:", err);
        setError("Không thể tải danh sách Đơn vị hoặc Học kỳ. Vui lòng tải lại trang.");
      } finally {
        setFetchingData(false);
      }
    };
    loadData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validations
    if (!formData.name.trim()) return setError("Tên chiến dịch không được để trống!");
    if (!formData.organization_id) return setError("Vui lòng chọn đơn vị phụ trách!");
    if (!formData.academic_term_id) return setError("Vui lòng chọn học kỳ áp dụng!");
    if (!formData.start_date || !formData.end_date) {
      return setError("Vui lòng nhập đầy đủ ngày bắt đầu và kết thúc!");
    }
    if (new Date(formData.start_date) > new Date(formData.end_date)) {
      return setError("Ngày kết thúc phải diễn ra sau ngày bắt đầu!");
    }

    setLoading(true);
    try {
      const budget = parseFloat(formData.total_budget_allocated) || 0;
      const submissionData = {
        ...formData,
        total_budget_allocated: budget,
      };

      await campaignService.createCampaign(submissionData);
      navigate("/admin/campaigns/list");
    } catch (err) {
      console.error("Error creating campaign:", err);
      setError(err.message || "Đã xảy ra lỗi khi tạo chiến dịch. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  if (fetchingData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] gap-3">
        <Loader2 className="animate-spin text-[#0061D5]" size={36} />
        <p className="text-slate-500 font-medium text-sm">Đang tải biểu mẫu thiết lập...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Nút quay lại & Tiêu đề */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-5">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/admin/campaigns/list")}
            className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors border border-slate-200 bg-white shadow-sm"
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1 px-2.5 rounded bg-blue-50 text-blue-600 font-bold text-xs uppercase tracking-wider">Chiến dịch</span>
              <Sparkles size={16} className="text-amber-500 animate-pulse" />
            </div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight mt-1">Tạo Chiến Dịch Mới</h1>
          </div>
        </div>
      </div>

      {/* Thông báo lỗi */}
      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-xl text-red-700 text-sm font-semibold animate-in slide-in-from-top-4 duration-200">
          <AlertCircle size={20} className="shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* Form Nhập Liệu */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
        <div className="p-8 space-y-6">
          {/* Tên chiến dịch */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Tên chiến dịch <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ví dụ: Mùa Hè Xanh 2026, Chiến dịch Xuân Tình Nguyện..."
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white focus:border-[#0061D5] focus:ring-2 focus:ring-blue-100 outline-none transition-all text-slate-700 font-medium placeholder-slate-400 shadow-inner"
            />
          </div>

          {/* Mô tả chi tiết */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Mô tả chi tiết chiến dịch
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              placeholder="Nhập mục tiêu, ý nghĩa và kế hoạch tóm tắt của chiến dịch..."
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white focus:border-[#0061D5] focus:ring-2 focus:ring-blue-100 outline-none transition-all text-slate-700 font-medium placeholder-slate-400 shadow-inner resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Đơn vị tổ chức */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Building size={14} className="text-slate-400" />
                Đơn vị phụ trách <span className="text-red-500">*</span>
              </label>
              <select
                name="organization_id"
                value={formData.organization_id}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-[#0061D5] outline-none transition-all text-slate-700 font-bold cursor-pointer"
              >
                <option value="">-- Chọn Đơn vị --</option>
                {organizations.map((org) => (
                  <option key={org.id} value={org.id}>
                    {org.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Học kỳ áp dụng */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar size={14} className="text-slate-400" />
                Học kỳ áp dụng <span className="text-red-500">*</span>
              </label>
              <select
                name="academic_term_id"
                value={formData.academic_term_id}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-[#0061D5] outline-none transition-all text-slate-700 font-bold cursor-pointer"
              >
                <option value="">-- Chọn Học kỳ --</option>
                {academicTerms.map((term) => (
                  <option key={term.id} value={term.id}>
                    {term.semester_name} ({term.year_name})
                  </option>
                ))}
              </select>
            </div>

            {/* Ngày bắt đầu */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Ngày bắt đầu <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white focus:border-[#0061D5] outline-none transition-all text-slate-700 font-bold shadow-inner"
              />
            </div>

            {/* Ngày kết thúc */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Ngày kết thúc <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white focus:border-[#0061D5] outline-none transition-all text-slate-700 font-bold shadow-inner"
              />
            </div>

            {/* Ngân sách */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <DollarSign size={14} className="text-slate-400" />
                Ngân sách phân bổ (VNĐ) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="total_budget_allocated"
                value={formData.total_budget_allocated}
                onChange={handleChange}
                placeholder="0"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white focus:border-[#0061D5] outline-none transition-all text-slate-700 font-bold placeholder-slate-400 shadow-inner"
              />
            </div>

            {/* Trạng thái */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Trạng thái hoạt động <span className="text-red-500">*</span>
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-[#0061D5] outline-none transition-all text-slate-700 font-bold cursor-pointer"
              >
                <option value="PLANNING">Lên kế hoạch (Planning)</option>
                <option value="ONGOING">Đang diễn ra (Ongoing)</option>
                <option value="COMPLETED">Đã hoàn thành (Completed)</option>
                <option value="CANCELLED">Đã hủy (Cancelled)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Nút hành động */}
        <div className="flex items-center justify-end gap-3 px-8 py-5 bg-slate-50 border-t border-slate-100">
          <button
            type="button"
            onClick={() => navigate("/admin/campaigns/list")}
            className="px-6 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm bg-white hover:bg-slate-50 hover:border-slate-300 transition-colors"
          >
            Hủy bỏ
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-[#0061D5] text-white px-8 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-700 transition-all active:scale-95 shadow-lg shadow-blue-200 disabled:bg-slate-300 disabled:text-slate-500 disabled:shadow-none"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Đang tạo...
              </>
            ) : (
              <>
                <Save size={18} />
                Lưu chiến dịch
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CampaignCreatePage;
