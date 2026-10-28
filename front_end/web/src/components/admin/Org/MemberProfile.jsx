import React, { useState, useMemo, useEffect } from "react";
import {
  Search,
  Plus,
  Mail,
  Phone,
  Edit,
  Trash2,
  ArrowLeft,
  Edit3,
  FileText,
  Star,
  MapPin,
  Calendar,
  UserCheck,
  X,
  AlertCircle,
  Download,
} from "lucide-react";
import { userService } from "../../../services/userService";
import { organizationService } from "../../../services/organizationService";

// --- 1. MODAL THÊM MỚI / CHỈNH SỬA ---
const MemberModal = ({ isOpen, onClose, member, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    role: "UVBCH",
    unit: "",
    unitId: "",
    email: "",
    phone_number: "",
    userId: null,
    status: "Active",
  });

  const [searchUser, setSearchUser] = useState("");
  const [searchUnit, setSearchUnit] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const [allOrgs, setAllOrgs] = useState([]);
  const [showUserSuggestions, setShowUserSuggestions] = useState(false);
  const [showUnitSuggestions, setShowUnitSuggestions] = useState(false);

  useEffect(() => {
    if (member) {
      setFormData({
        ...member,
        unit: member.unit || "",
        unitId: "", // Sẽ cần fetch hoặc set nếu có
      });
      setSearchUser(member.name || "");
      setSearchUnit(member.unit || "");
    } else {
      setFormData({ 
        name: "", 
        role: "UVBCH", 
        unit: "", 
        unitId: "", 
        email: "", 
        phone_number: "", 
        userId: null, 
        status: "Active" 
      });
      setSearchUser("");
      setSearchUnit("");
    }
  }, [member, isOpen]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [users, orgs] = await Promise.all([
          userService.getAllUsers(),
          organizationService.getOrganizations()
        ]);
        setAllUsers(users);
        setAllOrgs(orgs);
      } catch (err) {
        console.error("Failed to fetch modal data:", err);
      }
    };
    if (isOpen) fetchData();
  }, [isOpen]);

  const filteredUsers = useMemo(() => {
    if (!searchUser || formData.userId || member) return [];
    return allUsers.filter(u => 
      u.full_name?.toLowerCase().includes(searchUser.toLowerCase()) || 
      u.student_id?.toLowerCase().includes(searchUser.toLowerCase())
    ).slice(0, 5);
  }, [allUsers, searchUser, formData.userId, member]);

  const filteredOrgs = useMemo(() => {
    if (!searchUnit || formData.unitId) return [];
    return allOrgs.filter(o => 
      o.name?.toLowerCase().includes(searchUnit.toLowerCase())
    ).slice(0, 5);
  }, [allOrgs, searchUnit, formData.unitId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150">
        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/70">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
            {member ? "Chỉnh sửa Cán bộ" : "Thêm Cán bộ mới"}
          </h3>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
            <X size={18} />
          </button>
        </div>
        <div className="p-6 space-y-3.5">
          <div className="relative">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-1 block">Họ và tên / MSSV *</label>
            <div className="relative">
              <input
                className={`w-full px-3.5 py-2.5 bg-white border ${formData.userId ? 'border-blue-600 ring-2 ring-blue-100' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all text-xs font-medium`}
                value={searchUser}
                onChange={(e) => {
                  setSearchUser(e.target.value);
                  setFormData(prev => ({ ...prev, name: e.target.value, userId: null }));
                  setShowUserSuggestions(true);
                }}
                placeholder="Tìm MSSV hoặc nhập tên cán bộ..."
              />
              {formData.userId && (
                <button 
                  onClick={() => { setFormData(p => ({...p, userId: null})); setSearchUser(""); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-rose-600 p-1"
                >
                  <X size={14} />
                </button>
              )}
            </div>
            
            {showUserSuggestions && filteredUsers.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                {filteredUsers.map(u => (
                  <button
                    key={u.id}
                    type="button"
                    className="w-full px-3.5 py-2 text-left hover:bg-blue-50 border-b border-slate-100 last:border-0 flex justify-between items-center transition-colors"
                    onClick={() => {
                      setFormData(prev => ({ ...prev, name: u.full_name, userId: u.id, email: u.email }));
                      setSearchUser(u.full_name);
                      setShowUserSuggestions(false);
                    }}
                  >
                    <div>
                      <p className="text-xs font-bold text-slate-800">{u.full_name}</p>
                      <p className="text-[10px] text-slate-400">{u.student_id ? `MSSV: ${u.student_id}` : u.email}</p>
                    </div>
                    <Plus size={14} className="text-blue-600" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-1 block">Email</label>
              <input
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-800 outline-none focus:border-blue-600"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="email@example.com"
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-1 block">Số điện thoại</label>
              <input
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-800 outline-none focus:border-blue-600"
                value={formData.phone_number}
                onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                placeholder="09xxx..."
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-1 block">Chức vụ</label>
              <select
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-800 outline-none focus:border-blue-600"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                <option>Bí thư LCĐ</option>
                <option>Phó Bí thư</option>
                <option>UVBCH</option>
                <option>Chủ nhiệm CLB</option>
              </select>
            </div>
            <div className="relative">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-1 block">Đơn vị trực thuộc *</label>
              <input
                className={`w-full px-3.5 py-2.5 bg-white border ${formData.unitId ? 'border-emerald-600 ring-2 ring-emerald-100' : 'border-slate-300'} rounded-lg text-xs font-medium outline-none transition-all`}
                value={searchUnit}
                onChange={(e) => {
                  setSearchUnit(e.target.value);
                  setFormData(prev => ({ ...prev, unit: e.target.value, unitId: "" }));
                  setShowUnitSuggestions(true);
                }}
                placeholder="Tìm tên khoa/lớp..."
              />
              {showUnitSuggestions && filteredOrgs.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-xl overflow-hidden max-h-48 overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
                  {filteredOrgs.map(o => (
                    <button
                      key={o.id}
                      type="button"
                      className="w-full px-3.5 py-2 text-left hover:bg-emerald-50 border-b border-slate-100 last:border-0 transition-colors"
                      onClick={() => {
                        setFormData(prev => ({ ...prev, unit: o.name, unitId: o.id }));
                        setSearchUnit(o.name);
                        setShowUnitSuggestions(false);
                      }}
                    >
                      <p className="text-xs font-bold text-slate-800">{o.name}</p>
                    </button>
                  ))}
                </div>
              )}
              {formData.unit && !formData.unitId && (
                <p className="text-[10px] text-rose-600 font-semibold mt-1">
                  Vui lòng nhấp chọn từ gợi ý phía trên
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="px-6 py-3.5 bg-slate-50/70 border-t border-slate-200 flex justify-end gap-2.5">
          <button onClick={onClose} className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">
            Hủy bỏ
          </button>
          <button
            onClick={() => onSave(formData)}
            disabled={!formData.name || !formData.unitId}
            className={`px-4 py-2 text-white rounded-lg text-xs font-semibold transition-all ${(!formData.name || !formData.unitId) ? 'bg-slate-300 cursor-not-allowed opacity-50' : 'bg-blue-600 hover:bg-blue-700 shadow-xs'}`}
          >
            Lưu thay đổi
          </button>
        </div>
      </div>
    </div>
  );
};

// --- 2. MODAL XÓA / MIỄN NHIỆM ---
const DeleteModal = ({ isOpen, onClose, member, onDelete }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
      <div className="bg-white w-full max-w-sm rounded-xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150">
        <div className="p-6 text-center">
          <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-3">
            <AlertCircle size={26} />
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-1">
            Xác nhận miễn nhiệm cán bộ
          </h3>
          <p className="text-xs text-slate-500 font-medium px-2">
            Bạn có chắc chắn muốn miễn nhiệm chức vụ của đồng chí{" "}
            <span className="text-slate-800 font-bold">{member?.name}</span>?
          </p>
        </div>
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col gap-2">
          <button
            onClick={() => onDelete(member.id)}
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors"
          >
            <UserCheck size={16} /> Hoàn thành nhiệm kỳ
          </button>
          <button
            onClick={() => onDelete(member.id)}
            className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-semibold text-xs shadow-xs transition-colors"
          >
            Xóa vĩnh viễn khỏi danh sách
          </button>
          <button
            onClick={onClose}
            className="w-full py-2 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 rounded-lg font-semibold text-xs transition-colors"
          >
            Hủy bỏ
          </button>
        </div>
      </div>
    </div>
  );
};

// --- 3. COMPONENT CHI TIẾT HỒ SƠ ---
const MemberDetail = ({ member, onBack, onEdit, onExport }) => {
  return (
    <div className="animate-in fade-in duration-200 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 bg-white border border-slate-200 hover:border-slate-300 rounded-lg transition-colors shadow-xs"
            title="Quay lại danh sách"
          >
            <ArrowLeft
              size={18}
              className="text-slate-600"
            />
          </button>
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Hồ sơ chi tiết cán bộ
            </h2>
            <p className="text-slate-400 text-xs">
              Thông tin công tác và quá trình tham gia Đoàn - Hội
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => onEdit(member)}
            className="flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-xs"
          >
            <Edit3 size={15} /> Chỉnh sửa
          </button>
          <button 
            onClick={() => onExport(member)}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-xs font-semibold text-white shadow-xs transition-colors"
          >
            <FileText size={15} /> Xuất dữ liệu
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-12 lg:col-span-4 space-y-4">
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs relative overflow-hidden">
            <div className="relative text-center">
              <div className="relative w-24 h-24 mx-auto mb-4 p-0.5 border-2 border-blue-600 rounded-xl">
                <img
                  src={member.avatar_url || `https://ui-avatars.com/api/?name=${member.name}&background=0284c7&color=fff&size=128`}
                  className="w-full h-full rounded-lg object-cover"
                  alt="Avatar"
                />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                {member.name}
              </h3>
              <span className="inline-block px-2.5 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold rounded-md mt-1.5">
                {member.role}
              </span>
              <div className="space-y-3 mt-6 pt-4 border-t border-slate-100 text-left">
                <ContactInfo
                  icon={<Phone size={15} />}
                  label="Số điện thoại"
                  value={member.phone_number || "Chưa cập nhật"}
                />
                <ContactInfo
                  icon={<MapPin size={15} />}
                  label="Đơn vị trực thuộc"
                  value={member.unit}
                />
                <ContactInfo
                  icon={<Calendar size={15} />}
                  label="Ngày vào đoàn"
                  value={member.joinDate || "N/A"}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-12 lg:col-span-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <StatCard
              label="Hoạt động"
              value={member.activity_count || "0"}
              sub="Tham gia"
              color="text-blue-600"
            />
            <StatCard
              label="Điểm rèn luyện"
              value={`${member.training_score || "0"}/100`}
              sub={member.training_score >= 90 ? "Xuất sắc" : (member.training_score >= 70 ? "Khá" : "Trung bình")}
              color="text-emerald-600"
            />
            <StatCard
              label="Khen thưởng"
              value={member.award_count || "0"}
              sub="Cấp trường/khoa"
              color="text-indigo-600"
            />
          </div>
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs">
            <h4 className="font-bold text-slate-800 uppercase text-xs tracking-wider mb-4">
              Lịch sử công tác & Bổ nhiệm
            </h4>
            <div className="space-y-4">
              <TimelineItem
                year={`${new Date(member.joinDate).getFullYear() || '2024'} - Nay`}
                title={member.role}
                desc={`Đang phụ trách tại ${member.unit}`}
                active
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- 4. MAIN COMPONENT DANH SÁCH ---
const MemberProfiles = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const data = await userService.getAllUsers();
        // Lọc: Chỉ lấy những người thực sự đã được bổ nhiệm vào đơn vị
        const officers = data.filter(u => u.organizations && u.organizations.length > 0);
        
        const formattedData = officers.map(u => ({
          id: u.student_id || `CB-${u.id.substring(0,6)}`,
          userId: u.id,
          name: u.full_name || u.email,
          role: u.role_title || "Cán bộ",
          email: u.email,
          phone_number: u.phone_number,
          avatar_url: u.avatar_url,
          unit: u.organizations?.[0]?.organization_name || "Đơn vị",
          status: u.status === "ACTIVE" ? "Active" : "Inactive",
          joinDate: u.organizations?.[0]?.joined_date ? new Date(u.organizations[0].joined_date).toLocaleDateString() : (u.created_at ? new Date(u.created_at).toLocaleDateString() : "N/A"),
          activity_count: u.activity_count,
          award_count: u.award_count,
          training_score: u.training_score
        }));
        setMembers(formattedData);
      } catch (err) {
        console.error("Failed to fetch members:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const [selectedMember, setSelectedMember] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [modalMode, setModalMode] = useState({
    open: false,
    type: "add",
    data: null,
  });
  const [deleteModal, setDeleteModal] = useState({ open: false, data: null });

  // Logic Tìm kiếm
  const filteredMembers = useMemo(() => {
    return members.filter(
      (m) =>
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.id.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [members, searchQuery]);

  // Handler: Lưu (Thêm/Sửa)
  const handleSaveMember = async (data) => {
    try {
      let finalUserId = data.userId;
      
      if (modalMode.type === "edit") {
        if (data.userId) {
           await userService.updateUser(data.userId, { 
             full_name: data.name,
             email: data.email,
             phone_number: data.phone_number
           });
        }
        // Nếu chọn đơn vị mới, thực hiện gán
        if (data.unitId) {
           await organizationService.assignMember({
             user_id: data.userId,
             organization_id: data.unitId,
             title: data.role,
             is_primary: true
           });
        }
      } else {
        // Thêm mới
        if (!finalUserId) {
          // Tạo user mới (cho GV/Thầy cô)
          const res = await userService.createUser({ 
            full_name: data.name, 
            email: `cb.${Date.now()}@lhu.edu.vn`, // Tự động tạo email hệ thống
            password: "password123",
            student_id: null
          });
          finalUserId = res.id;
        }
        
        // Gán vào tổ chức
        if (data.unitId) {
          await organizationService.assignMember({
            user_id: finalUserId,
            organization_id: data.unitId,
            title: data.role,
            is_primary: true
          });
        }
      }
      
      // Reload danh sách để cập nhật dữ liệu mới nhất từ BE
      const updatedUsers = await userService.getAllUsers();
      const officers = updatedUsers.filter(u => u.organizations && u.organizations.length > 0);
      const formattedData = officers.map(u => ({
        id: u.student_id || `CB-${u.id.substring(0,6)}`,
        userId: u.id,
        name: u.full_name || u.email,
        role: u.role_title || "Cán bộ",
        email: u.email,
        phone_number: u.phone_number,
        unit: u.organizations?.[0]?.organization_name || "Đơn vị",
        status: u.status === "ACTIVE" ? "Active" : "Inactive",
        joinDate: u.organizations?.[0]?.joined_date ? new Date(u.organizations[0].joined_date).toLocaleDateString() : (u.created_at ? new Date(u.created_at).toLocaleDateString() : "N/A"),
        activity_count: u.activity_count,
        award_count: u.award_count,
        training_score: u.training_score
      }));
      setMembers(formattedData);
      
      setModalMode({ open: false, type: "add", data: null });
    } catch (err) {
      console.error("Failed to save member:", err);
      alert("Lỗi khi lưu cán bộ. Vui lòng kiểm tra lại dữ liệu.");
    }
  };

  // Handler: Xóa
  const handleDelete = (id) => {
    setMembers(members.filter((m) => m.id !== id));
    setDeleteModal({ open: false, data: null });
  };

  // Handler: Xuất dữ liệu cá nhân
  const handleExport = (member) => {
    const headers = ["Mã Cán bộ", "Họ tên", "Chức vụ", "Đơn vị", "Email", "SĐT", "Ngày vào đoàn", "Số hoạt động", "Khen thưởng"];
    const row = [
      member.id,
      member.name,
      member.role,
      member.unit,
      member.email,
      member.phone_number,
      member.joinDate,
      member.activity_count,
      member.award_count
    ];
    
    const csvContent = "\ufeff" 
      + headers.join(",") + "\n"
      + row.join(",");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Ho_so_${member.id}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handler: Xuất toàn bộ danh sách cán bộ
  const handleExportAll = () => {
    const headers = ["Mã Cán bộ", "Họ tên", "Chức vụ", "Đơn vị", "Email", "SĐT", "Ngày vào đoàn", "Số hoạt động", "Khen thưởng", "Trạng thái"];
    const rows = filteredMembers.map(m => [
      m.id,
      m.name,
      m.role,
      m.unit,
      m.email || "",
      m.phone_number || "",
      m.joinDate || "",
      m.activity_count || 0,
      m.award_count || 0,
      m.status === "Active" ? "Đang hoạt động" : "Tạm nghỉ"
    ]);
    
    const csvContent = "\ufeff" + [headers.join(","), ...rows.map(r => r.map(c => `"${c}"`).join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", `Danh_Sach_Can_Bo_${new Date().getTime()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4 font-sans text-slate-900">
      {/* Nội dung chính: Danh sách hoặc Chi tiết */}
      {selectedMember ? (
        <MemberDetail
          member={selectedMember}
          onBack={() => setSelectedMember(null)}
          onEdit={(m) => setModalMode({ open: true, type: "edit", data: m })}
          onExport={handleExport}
        />
      ) : (
        <>
          {/* Thanh công cụ tìm kiếm và thao tác */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
            <div className="relative w-full sm:w-80">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors pointer-events-none"
                size={15}
              />
              <input
                type="text"
                placeholder="Tìm tên, mã cán bộ, chức vụ..."
                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-600 transition-all shadow-xs"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
              <button
                onClick={handleExportAll}
                className="flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg text-xs font-semibold shadow-xs transition-colors"
              >
                <Download size={15} />
                <span>Xuất Excel</span>
              </button>
              <button
                onClick={() =>
                  setModalMode({ open: true, type: "add", data: null })
                }
                className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
              >
                <Plus size={15} />
                <span>+ Thêm mới</span>
              </button>
            </div>
          </div>

          {/* Bảng dữ liệu cán bộ chuẩn Enterprise */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/90 border-b border-slate-200">
                    <th className="py-3 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      Thông tin Cán bộ
                    </th>
                    <th className="py-3 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      Chức vụ
                    </th>
                    <th className="py-3 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      Đơn vị trực thuộc
                    </th>
                    <th className="py-3 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center">
                      Trạng thái
                    </th>
                    <th className="py-3 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredMembers.map((m) => (
                    <tr
                      key={m.id}
                      onClick={() => setSelectedMember(m)}
                      className="hover:bg-slate-50/70 transition-colors group cursor-pointer"
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 font-bold text-xs shrink-0">
                            {m.name.split(" ").pop().charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-900 leading-tight">
                              {m.name}
                            </p>
                            <p className="text-[11px] text-slate-400 mt-0.5">
                              {m.id} {m.email ? `• ${m.email}` : ""}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                          {m.role}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-xs font-medium text-slate-700">
                        {m.unit}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                            m.status === "Active"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-slate-100 text-slate-600 border-slate-200"
                          }`}
                        >
                          {m.status === "Active" ? "Đang hoạt động" : "Tạm nghỉ"}
                        </span>
                      </td>
                      <td
                        className="py-3.5 px-4 text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => setSelectedMember(m)}
                            title="Xem chi tiết"
                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <FileText size={15} />
                          </button>
                          <button
                            onClick={() =>
                              setModalMode({ open: true, type: "edit", data: m })
                            }
                            title="Chỉnh sửa"
                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Edit size={15} />
                          </button>
                          <button
                            onClick={() => setDeleteModal({ open: true, data: m })}
                            title="Miễn nhiệm / Xóa"
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredMembers.length === 0 && (
                <div className="p-16 text-center text-slate-400 text-xs">
                  Không tìm thấy cán bộ phù hợp
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Modals - Luôn ở đây để có thể hiển thị bất kể view nào */}
      <MemberModal
        isOpen={modalMode.open}
        member={modalMode.data}
        onClose={() => setModalMode({ ...modalMode, open: false })}
        onSave={handleSaveMember}
      />
      <DeleteModal
        isOpen={deleteModal.open}
        member={deleteModal.data}
        onClose={() => setDeleteModal({ open: false, data: null })}
        onDelete={handleDelete}
      />
    </div>
  );
};

// --- HELPERS (Giữ nguyên từ code cũ của bạn) ---
const ContactInfo = ({ icon, label, value }) => (
  <div className="flex items-center gap-4">
    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
      {icon}
    </div>
    <div>
      <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">
        {label}
      </p>
      <p className="text-sm font-bold text-slate-700">{value}</p>
    </div>
  </div>
);
const StatCard = ({ label, value, sub, color }) => (
  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
    <p className="text-[11px] font-bold text-slate-400 uppercase mb-1">
      {label}
    </p>
    <div className="flex items-baseline gap-2">
      <h4 className={`text-2xl font-black ${color}`}>{value}</h4>
      <span className="text-[10px] font-bold text-slate-400">{sub}</span>
    </div>
  </div>
);
const TimelineItem = ({ year, title, desc, active }) => (
  <div className="relative pl-10 pb-6 border-l-2 border-slate-50 last:border-0 ml-3">
    <div
      className={`absolute -left-[13px] top-1 w-6 h-6 rounded-xl border-4 border-white shadow-sm ${active ? "bg-blue-600" : "bg-slate-200"}`}
    ></div>
    <p
      className={`text-[11px] font-black uppercase ${active ? "text-blue-600" : "text-slate-400"}`}
    >
      {year}
    </p>
    <h5 className="text-[14px] font-black text-slate-800 mt-1">{title}</h5>
    <p className="text-xs text-slate-500 mt-1">{desc}</p>
  </div>
);

export default MemberProfiles;
