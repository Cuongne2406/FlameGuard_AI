import React, { useState, useMemo, useEffect } from "react";
import {
  Search,
  ChevronDown,
  Plus,
  Flag,
  CornerDownRight,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { organizationService } from "../../../services/organizationService";
import { systemService } from "../../../services/systemService";
import { campaignService } from "../../../services/campaignService";
import { Edit2, Trash } from "lucide-react";

const ListView = () => {
  // 1. State quản lý hiển thị Modal
  const [modalMode, setModalMode] = useState({ open: false, type: "create", data: null });

  // 2. State quản lý tìm kiếm và dữ liệu
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [unitFilter, setUnitFilter] = useState("ALL");
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [organizations, setOrganizations] = useState([]);
  const [academicTerms, setAcademicTerms] = useState([]);

  // 3. State cho Form
  const [formData, setFormData] = useState({
    name: "",
    organization_id: "",
    academic_term_id: "",
    total_budget_allocated: "",
    start_date: "",
    end_date: "",
    status: "PLANNING"
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [campaigns, orgs, terms] = await Promise.all([
        campaignService.getCampaigns(),
        organizationService.getOrganizations(),
        systemService.getAcademicTerms()
      ]);
      setActivities(campaigns);
      setOrganizations(orgs);
      setAcademicTerms(terms);
      
      if (orgs.length > 0 && !formData.organization_id) {
          setFormData(prev => ({ ...prev, organization_id: orgs[0].id }));
      }
      if (terms.length > 0 && !formData.academic_term_id) {
          setFormData(prev => ({ ...prev, academic_term_id: terms[0].id }));
      }
    } catch (error) {
      console.error("Failed to fetch campaigns:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (modalMode.type === "edit" && modalMode.data) {
      setFormData({
        name: modalMode.data.name,
        organization_id: modalMode.data.unitId,
        academic_term_id: modalMode.data.termId,
        total_budget_allocated: modalMode.data.budget.replace("tr", ""),
        start_date: modalMode.data.start_date || "",
        end_date: modalMode.data.end_date || "",
        status: modalMode.data.status === "RUNNING" ? "ONGOING" : modalMode.data.status
      });
    } else {
      setFormData({
        name: "",
        organization_id: organizations[0]?.id || "",
        academic_term_id: academicTerms[0]?.id || "",
        total_budget_allocated: "",
        start_date: "",
        end_date: "",
        status: "PLANNING"
      });
    }
  }, [modalMode, organizations, academicTerms]);

  // 4. Logic lọc dữ liệu
  const filteredActivities = useMemo(() => {
    return activities.filter((activity) => {
      // Điều kiện Tìm kiếm văn bản
      const matchSearch = activity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          activity.unit.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Điều kiện Trạng thái (Xử lý trường hợp API Backend trả về RUNNING thay cho ONGOING)
      const normalizedStatus = activity.status === "RUNNING" ? "ONGOING" : activity.status;
      const matchStatus = statusFilter === "ALL" || normalizedStatus === statusFilter;
      
      // Điều kiện Đơn vị
      const matchUnit = unitFilter === "ALL" || activity.unit === unitFilter;

      return matchSearch && matchStatus && matchUnit;
    });
  }, [searchQuery, statusFilter, unitFilter, activities]);

  // 5. Handlers
  const handleSave = async () => {
    // Validation logic
    const requiredFields = [
      { key: 'name', label: 'Tên chiến dịch' },
      { key: 'organization_id', label: 'Đơn vị' },
      { key: 'academic_term_id', label: 'Học kỳ' },
      { key: 'start_date', label: 'Ngày bắt đầu' },
      { key: 'end_date', label: 'Ngày kết thúc' }
    ];

    const missing = requiredFields
      .filter(f => !formData[f.key])
      .map(f => f.label);

    if (missing.length > 0) {
      alert(`Vui lòng điền đầy đủ các thông tin sau:\n- ${missing.join('\n- ')}`);
      return;
    }

    try {
      const payload = {
        ...formData,
        total_budget_allocated: parseFloat(formData.total_budget_allocated) || 0,
        start_date: formData.start_date || null,
        end_date: formData.end_date || null,
      };
      
      if (modalMode.type === "edit") {
        await campaignService.updateCampaign(modalMode.data.id, payload);
      } else {
        await campaignService.createCampaign(payload);
      }
      
      setModalMode({ open: false, type: "create", data: null });
      fetchData();
    } catch (err) {
      console.error("Failed to save campaign:", err);
      alert("Lỗi khi lưu chiến dịch. Vui lòng kiểm tra lại.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa chiến dịch này?")) return;
    try {
      await campaignService.deleteCampaign(id);
      fetchData();
    } catch (err) {
      console.error("Failed to delete campaign:", err);
    }
  };

  return (
    <div className="relative space-y-4 animate-in fade-in duration-500">
      {/* --- THANH CÔNG CỤ --- */}
      <div className="flex flex-wrap items-center gap-3 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Tìm kiếm chiến dịch/khoa..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50/50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium"
          />
        </div>

        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="appearance-none flex items-center justify-between gap-4 px-4 py-2 pr-8 border border-slate-200 rounded-lg text-sm text-slate-600 bg-white hover:border-slate-300 transition-all font-bold min-w-[150px] outline-none cursor-pointer"
          >
            <option value="ALL">Trạng thái: Tất cả</option>
            <option value="PLANNING">Đang lên kế hoạch</option>
            <option value="ONGOING">Đang diễn ra</option>
            <option value="COMPLETED">Đã hoàn thành</option>
            <option value="CANCELLED">Đã hủy</option>
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>

        <div className="relative">
          <select
            value={unitFilter}
            onChange={(e) => setUnitFilter(e.target.value)}
            className="appearance-none flex items-center justify-between gap-4 px-4 py-2 pr-8 border border-slate-200 rounded-lg text-sm text-slate-600 bg-white hover:border-slate-300 transition-all font-bold min-w-[150px] outline-none cursor-pointer max-w-[200px] truncate"
          >
            <option value="ALL">Đơn vị: Tất cả</option>
            {organizations.map(org => (
              <option key={org.id} value={org.name}>{org.name}</option>
            ))}
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>

        <button
          onClick={() => setModalMode({ open: true, type: "create", data: null })}
          className="flex items-center gap-2 bg-[#0061D5] text-white px-5 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition-all active:scale-95 shadow-lg shadow-blue-200"
        >
          <Plus size={18} /> Thêm mới
        </button>
      </div>

      {/* --- BẢNG DỮ LIỆU --- */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tên chiến dịch / Sự kiện</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Đơn vị phụ trách</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center w-32">Ngân sách</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Tiến độ</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredActivities.length > 0 ? (
              filteredActivities.map((activity) => (
                <React.Fragment key={activity.id}>
                  <ParentRow 
                    {...activity} 
                    onEdit={() => setModalMode({ open: true, type: "edit", data: activity })}
                    onDelete={() => handleDelete(activity.id)}
                  />
                  {activity.subActivities?.map((sub) => (
                    <SubRow key={sub.id} {...sub} />
                  ))}
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-10 text-center text-slate-400 text-sm italic">Không tìm thấy kết quả phù hợp...</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* --- MODAL THÊM/SỬA --- */}
      {modalMode.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-bold text-slate-700">{modalMode.type === "edit" ? "Cập nhật chiến dịch" : "Tạo chiến dịch mới"}</h3>
              <button onClick={() => setModalMode({ ...modalMode, open: false })} className="p-1 hover:bg-slate-200 rounded-full transition-colors">
                <X size={20} className="text-slate-500" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                  Tên chiến dịch <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nhập tên chiến dịch..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all font-bold"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                    Đơn vị <span className="text-red-500">*</span>
                  </label>
                  <select 
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 font-bold"
                    value={formData.organization_id}
                    onChange={(e) => setFormData({ ...formData, organization_id: e.target.value })}
                  >
                    {organizations.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                    Học kỳ <span className="text-red-500">*</span>
                  </label>
                  <select 
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 font-bold appearance-none cursor-pointer"
                    value={formData.academic_term_id}
                    onChange={(e) => setFormData({ ...formData, academic_term_id: e.target.value })}
                  >
                    {academicTerms.length > 0 ? (
                      academicTerms.map(t => (
                        <option key={t.id} value={t.id}>
                          {t.semester_name} ({t.year_name})
                        </option>
                      ))
                    ) : (
                      <option value="" disabled>Đang tải học kỳ...</option>
                    )}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                    Ngày bắt đầu <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                    Ngày kết thúc <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Ngân sách (VNĐ)</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={formData.total_budget_allocated}
                      onChange={(e) => setFormData({ ...formData, total_budget_allocated: e.target.value })}
                      placeholder="Ví dụ: 50"
                      className="w-full pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">Tr</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Trạng thái</label>
                  <select 
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="PLANNING">Đang lập kế hoạch</option>
                    <option value="ONGOING">Đang diễn ra</option>
                    <option value="COMPLETED">Đã hoàn thành</option>
                    <option value="CANCELLED">Đã hủy</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button onClick={() => setModalMode({ ...modalMode, open: false })} className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-700">Hủy</button>
              <button 
                onClick={handleSave}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-200 transition-all active:scale-95"
              >
                {modalMode.type === "edit" ? "Cập nhật" : "Tạo mới"}
      </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- GIỮ NGUYÊN CÁC HELPER COMPONENTS CỦA BẠN (CÓ CHỈNH SỬA NHẸ) ---

const FilterDropdown = ({ label }) => (
  <button className="flex items-center justify-between gap-4 px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 bg-white hover:border-slate-300 transition-all min-w-[140px]">
    <span className="truncate">{label}</span>
    <ChevronDown size={14} className="text-slate-400" />
  </button>
);

const ParentRow = ({ name, unit, budget, progress, status, onEdit, onDelete }) => (
  <tr className="hover:bg-slate-50/50 transition-colors cursor-pointer group">
    <td className="px-6 py-4" onClick={onEdit}>
      <div className="flex items-center gap-3">
        <ChevronDown size={14} className="text-slate-300" />
        <div className="w-7 h-7 rounded-md bg-blue-50 flex items-center justify-center text-[#0061D5]">
          <Flag size={12} fill="currentColor" />
        </div>
        <span className="font-bold text-slate-700 text-[13px]">{name}</span>
      </div>
    </td>
    <td className="px-6 py-4 text-center">
      <span className="px-3 py-1 bg-blue-50 text-[#0061D5] rounded-full text-[10px] font-bold uppercase tracking-wider">
        {unit}
      </span>
    </td>
    <td className="px-6 py-4 text-center text-xs font-bold text-slate-700">
      {budget}
    </td>
    <td className="px-6 py-4 text-center">
      <div className="flex flex-col items-center gap-1">
        <div className="w-20 bg-slate-100 h-1.5 rounded-full overflow-hidden">
          <div
            className={`h-full ${progress === 100 ? "bg-emerald-500" : "bg-blue-500"}`}
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <span className="text-[10px] font-black text-slate-400">
          {progress}%
        </span>
      </div>
    </td>
    <td className="px-6 py-4 text-right">
      <div className="flex justify-end items-center gap-2">
         <span
          className={`px-2 py-1 rounded-md text-[9px] font-black border ${
            status === "RUNNING" || status === "ONGOING" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : 
            status === "PLANNING" ? "bg-blue-50 text-blue-600 border-blue-100" :
            "bg-slate-50 text-slate-400 border-slate-100"
          }`}
        >
          {status}
        </span>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
           <button onClick={(e) => { e.stopPropagation(); onEdit(); }} className="p-1.5 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors">
              <Edit2 size={14} />
           </button>
           <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="p-1.5 hover:bg-red-50 text-red-600 rounded-lg transition-colors">
              <Trash size={14} />
           </button>
        </div>
      </div>
    </td>
  </tr>
);

const SubRow = ({ name, unit, budget, progress, status }) => (
  <tr className="bg-slate-50/20 hover:bg-slate-50 transition-colors border-l-2 border-transparent hover:border-blue-200">
    <td className="px-6 py-3 pl-14">
      <div className="flex items-center gap-2 text-slate-400">
        <CornerDownRight size={14} />
        <span className="text-xs font-semibold text-slate-600">{name}</span>
      </div>
    </td>
    <td className="px-6 py-3 text-center">
      <span className="text-[10px] font-bold text-slate-400 italic">
        {unit}
      </span>
    </td>
    <td className="px-6 py-3 text-center text-[11px] text-slate-400 font-medium">
      {budget}
    </td>
    <td className="px-6 py-3 text-center">
      <div className="flex flex-col items-center gap-1">
        <div className="w-16 bg-slate-100 h-1 rounded-full overflow-hidden">
          <div
            className={`h-full ${progress === 100 ? "bg-emerald-400" : "bg-orange-400"}`}
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <span className="text-[9px] font-bold text-slate-300">{progress}%</span>
      </div>
    </td>
    <td className="px-6 py-3 text-right text-[9px] font-black text-slate-300 uppercase tracking-tighter">
      {status}
    </td>
  </tr>
);

export default ListView;
