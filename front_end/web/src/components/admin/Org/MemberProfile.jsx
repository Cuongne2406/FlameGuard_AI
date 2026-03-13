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
} from "lucide-react";
import { userService } from "../../../services/userService";

// --- 1. MODAL THÊM MỚI / CHỈNH SỬA ---
const MemberModal = ({ isOpen, onClose, member, onSave }) => {
  const [formData, setFormData] = useState(
    member || { name: "", role: "UVBCH", unit: "Khoa CNTT", status: "Active" },
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="text-xl font-black text-slate-800">
            {member ? "Chỉnh sửa Cán bộ" : "Thêm Cán bộ mới"}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white rounded-full transition-colors"
          >
            <X size={20} className="text-slate-400" />
          </button>
        </div>
        <div className="p-8 space-y-4">
          <div>
            <label className="text-[11px] font-black uppercase text-slate-400 ml-2">
              Họ và tên
            </label>
            <input
              className="w-full px-5 py-3 mt-1 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-100 outline-none transition-all font-bold"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Nhập tên cán bộ..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-black uppercase text-slate-400 ml-2">
                Chức vụ
              </label>
              <select
                className="w-full px-5 py-3 mt-1 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold"
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
              >
                <option>Bí thư LCĐ</option>
                <option>Phó Bí thư</option>
                <option>UVBCH</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] font-black uppercase text-slate-400 ml-2">
                Đơn vị
              </label>
              <input
                className="w-full px-5 py-3 mt-1 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold"
                value={formData.unit}
                onChange={(e) =>
                  setFormData({ ...formData, unit: e.target.value })
                }
              />
            </div>
          </div>
        </div>
        <div className="px-8 py-6 bg-slate-50 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 text-sm font-bold text-slate-500 hover:text-slate-700"
          >
            Hủy bỏ
          </button>
          <button
            onClick={() => onSave(formData)}
            className="flex-1 py-3 bg-blue-600 text-white rounded-2xl text-sm font-black shadow-lg shadow-blue-200"
          >
            Lưu thay đổi
          </button>
        </div>
      </div>
    </div>
  );
};

// --- 2. MODAL XÓA (THEO STYLE ẢNH THỨ 2) ---
const DeleteModal = ({ isOpen, onClose, member, onDelete }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-sm rounded-[2rem] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-8 duration-300">
        <div className="p-8 text-center">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={32} />
          </div>
          <h3 className="text-xl font-black text-slate-800 mb-2">
            Xác nhận miễn nhiệm
          </h3>
          <p className="text-sm text-slate-500 font-medium px-4">
            Bạn có chắc chắn muốn miễn nhiệm chức vụ của đồng chí{" "}
            <span className="text-slate-800 font-bold">{member?.name}</span>?
          </p>
        </div>
        <div className="p-4 bg-slate-50 flex flex-col gap-2">
          <button
            onClick={() => onDelete(member.id)}
            className="w-full py-4 bg-emerald-500 text-white rounded-2xl font-black text-sm flex items-center justify-center gap-2"
          >
            <UserCheck size={18} /> Hoàn thành nhiệm kỳ
          </button>
          <button className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-sm">
            Chuyển chức vụ
          </button>
          <button
            onClick={onClose}
            className="w-full py-4 bg-white border border-slate-200 text-red-500 rounded-2xl font-black text-sm"
          >
            Xóa hoàn toàn
          </button>
        </div>
      </div>
    </div>
  );
};

// --- 3. COMPONENT CHI TIẾT HỒ SƠ ---
const MemberDetail = ({ member, onBack }) => {
  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="group p-3 bg-white border border-slate-200 hover:border-blue-500 rounded-2xl transition-all shadow-sm"
          >
            <ArrowLeft
              size={20}
              className="text-slate-600 group-hover:text-blue-600"
            />
          </button>
          <div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">
              Hồ sơ chi tiết
            </h2>
            <p className="text-slate-400 text-sm font-medium">
              Quản lý thông tin cán bộ hệ thống
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-5 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
            <Edit3 size={18} /> Chỉnh sửa
          </button>
          <button className="flex items-center gap-2 px-5 py-3 bg-blue-600 rounded-2xl text-sm font-bold text-white shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all">
            <FileText size={18} /> Xuất dữ liệu
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/40 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 opacity-50"></div>
            <div className="relative">
              <div className="relative w-32 h-32 mx-auto mb-6 p-1 border-[4px] border-blue-600 rounded-3xl rotate-3">
                <img
                  src={`https://ui-avatars.com/api/?name=${member.name}&background=0284c7&color=fff&size=128`}
                  className="w-full h-full rounded-2xl object-cover -rotate-3"
                  alt="Avatar"
                />
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-black text-slate-800">
                  {member.name}
                </h3>
                <span className="inline-block px-4 py-1 bg-blue-50 text-blue-600 text-[11px] font-black rounded-full uppercase mt-2">
                  {member.role}
                </span>
              </div>
              <div className="space-y-4 mt-8 pt-8 border-t border-slate-100">
                <ContactInfo
                  icon={<Mail size={16} />}
                  label="Email"
                  value="phuchau.le@gmail.com"
                />
                <ContactInfo
                  icon={<Phone size={16} />}
                  label="Số điện thoại"
                  value="0905 ••• •••"
                />
                <ContactInfo
                  icon={<MapPin size={16} />}
                  label="Đơn vị"
                  value={member.unit}
                />
                <ContactInfo
                  icon={<Calendar size={16} />}
                  label="Ngày vào đoàn"
                  value={member.joinDate || "15/09/2021"}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-12 lg:col-span-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard
              label="Hoạt động"
              value="42"
              sub="Tham gia"
              color="text-blue-600"
            />
            <StatCard
              label="Điểm rèn luyện"
              value="95/100"
              sub="Xuất sắc"
              color="text-emerald-600"
            />
            <StatCard
              label="Khen thưởng"
              value="08"
              sub="Cấp khoa"
              color="text-purple-600"
            />
          </div>
          <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-xl">
            <h4 className="font-black text-slate-800 uppercase text-xs tracking-widest mb-6">
              Lịch sử công tác
            </h4>
            <div className="space-y-6">
              <TimelineItem
                year="2024 - Nay"
                title={member.role}
                desc="Đang đương nhiệm"
                active
              />
              <TimelineItem
                year="2022 - 2024"
                title="Ủy viên BCH"
                desc="Phụ trách phong trào"
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
        const formattedData = data.map(u => ({
          id: u.student_id || `CB-${u.id.substring(0,6)}`,
          userId: u.id,
          name: u.full_name || u.email,
          role: u.role || "Thành viên",
          email: u.email,
          unit: u.organizations?.[0]?.name || "Chưa xếp lớp",
          status: u.is_active ? "Active" : "Inactive",
          joinDate: u.created_at ? new Date(u.created_at).toLocaleDateString() : "15/09/2021",
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
      if (modalMode.type === "edit") {
        if (userService.updateUser && data.userId) {
           await userService.updateUser(data.userId, { full_name: data.name, role: data.role });
        }
        setMembers(members.map((m) => (m.id === data.id ? data : m)));
      } else {
        // Thêm mới
        if (userService.createUser) {
           const res = await userService.createUser({ full_name: data.name, role: data.role, email: `user${Date.now()}@dyus.edu.vn`, password: "password" });
           data.userId = res.id;
        }
        const newMember = {
          ...data,
          id: `CB-${Math.floor(100000 + Math.random() * 900000)}`,
          status: "Active",
        };
        setMembers([newMember, ...members]);
      }
      setModalMode({ open: false, type: "add", data: null });
    } catch (err) {
      console.error("Failed to save member:", err);
    }
  };

  // Handler: Xóa
  const handleDelete = (id) => {
    setMembers(members.filter((m) => m.id !== id));
    setDeleteModal({ open: false, data: null });
  };

  if (selectedMember)
    return (
      <MemberDetail
        member={selectedMember}
        onBack={() => setSelectedMember(null)}
      />
    );

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-[1400px] mx-auto p-4">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">
            Danh sách Cán bộ
          </h1>
          <p className="text-slate-400 text-sm font-medium">
            Tổng cộng {filteredMembers.length} nhân sự
          </p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Tìm tên, mã cán bộ..."
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-100 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm font-medium"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button
            onClick={() =>
              setModalMode({ open: true, type: "add", data: null })
            }
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl text-sm font-bold shadow-lg shadow-blue-200 hover:scale-105 transition-all"
          >
            <Plus size={18} /> Thêm mới
          </button>
        </div>
      </div>

      {/* Bảng dữ liệu */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                Thông tin Cán bộ
              </th>
              <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                Chức vụ
              </th>
              <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                Đơn vị
              </th>
              <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center">
                Trạng thái
              </th>
              <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest text-right">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredMembers.map((m) => (
              <tr
                key={m.id}
                onClick={() => setSelectedMember(m)}
                className="group hover:bg-blue-50/40 transition-all cursor-pointer"
              >
                <td className="px-8 py-5">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-blue-600 font-black shadow-sm border border-white">
                      {m.name.split(" ").pop().charAt(0)}
                    </div>
                    <div>
                      <p className="text-[15px] font-black text-slate-800">
                        {m.name}
                      </p>
                      <p className="text-[11px] text-slate-400 font-bold uppercase">
                        {m.id}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <span className="px-3 py-1.5 bg-blue-50 text-blue-600 text-[10px] font-black rounded-xl uppercase border border-blue-100">
                    {m.role}
                  </span>
                </td>
                <td className="px-6 py-5 text-sm font-bold text-slate-600">
                  {m.unit}
                </td>
                <td className="px-6 py-5 text-center">
                  <div
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase ${m.status === "Active" ? "bg-emerald-50 text-emerald-600" : "bg-slate-50 text-slate-400"}`}
                  >
                    {m.status === "Active" ? "Đang hoạt động" : "Tạm nghỉ"}
                  </div>
                </td>
                <td
                  className="px-8 py-5 text-right"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() =>
                        setModalMode({ open: true, type: "edit", data: m })
                      }
                      className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-all"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => setDeleteModal({ open: true, data: m })}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredMembers.length === 0 && (
          <div className="p-20 text-center text-slate-400 font-bold">
            Không tìm thấy cán bộ nào...
          </div>
        )}
      </div>

      {/* Modals */}
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
  <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
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
