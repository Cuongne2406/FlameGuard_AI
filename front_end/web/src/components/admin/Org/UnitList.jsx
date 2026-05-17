import React, { useState, useMemo, useEffect } from "react";
import {
  Search,
  Edit3,
  Trash2,
  ExternalLink,
  Download,
  Plus,
  X,
  AlertTriangle,
  Filter,
  UserPlus,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import * as XLSX from "xlsx";
import { organizationService } from "../../../services/organizationService";
import { userService } from "../../../services/userService";

const UnitList = ({ triggerCreateModal, onModalClose }) => {
  // --- STATE QUẢN LÝ ---
  const [modalStep, setModalStep] = useState("none"); // none, create, assign, success, edit, delete
  const [newUnitName, setNewUnitName] = useState("");
  const [newUnitType, setNewUnitType] = useState("CLUB");
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState(null); 

  // States cho bổ nhiệm nhân sự
  const [allUsers, setAllUsers] = useState([]);
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [selectedLeader, setSelectedLeader] = useState(null);
  const [assignTitle, setAssignTitle] = useState("Bí thư");
  const [userShowSuggestions, setUserShowSuggestions] = useState(false);

  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- FETCH DATA ---
  const fetchUnits = async () => {
    setLoading(true);
    try {
      const data = await organizationService.getOrganizations();
      const formattedUnits = data.map((u) => ({
        id: u.id,
        name: u.name,
        type: u.type === 'CLASS' ? 'LCĐ Khoa' : u.type === 'CLUB' ? 'CLB/Đội/Nhóm' : u.type || 'Đơn vị',
        leader: u.leader_name || "Đang cập nhật",
        leaderId: u.leader_student_id || "",
        leaderTitle: u.type === 'CLASS' ? 'Bí thư LCĐ' : 'Chủ nhiệm',
        size: u.total_members ? `${u.total_members} SV` : '0 SV',
        subUnits: u.type === 'CLASS' ? 'Chi đoàn' : 'Thành viên',
        score: u.activity_score || 80,
        status: u.status || "Active",
      }));
      setUnits(formattedUnits);
    } catch (error) {
      console.error("Failed to fetch units:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const users = await userService.getAllUsers();
      setAllUsers(users);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  useEffect(() => {
    fetchUnits();
    fetchUsers();
  }, []);

  useEffect(() => {
    if (triggerCreateModal) {
      setNewUnitName("");
      setNewUnitType("CLUB");
      setModalStep("create");
    }
  }, [triggerCreateModal]);

  const handleCloseModal = () => {
    setModalStep("none");
    setSelectedLeader(null);
    setUserSearchTerm("");
    if (onModalClose) onModalClose();
  };

  // --- LOGIC TÌM KIẾM ---
  const filteredUnits = useMemo(() => {
    if (!searchTerm) return units;
    return units.filter(
      (unit) =>
        unit.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        unit.leader.toLowerCase().includes(searchTerm.toLowerCase()) ||
        unit.type.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [searchTerm, units]);

  const suggestions = useMemo(() => {
    if (!searchTerm) return [];
    return units
      .filter((u) => u.name.toLowerCase().includes(searchTerm.toLowerCase()))
      .slice(0, 4);
  }, [searchTerm, units]);

  const filteredUsers = useMemo(() => {
    if (!userSearchTerm || !userShowSuggestions) return [];
    const searchLower = userSearchTerm.toLowerCase();
    
    // Nếu đã chọn một người và term đang khớp chính xác tên người đó -> ẩn gợi ý
    if (selectedLeader && (userSearchTerm === selectedLeader.full_name || userSearchTerm === selectedLeader.student_id)) {
      return [];
    }

    return allUsers.filter(u => 
      u.full_name.toLowerCase().includes(searchLower) ||
      (u.student_id && u.student_id.toLowerCase().includes(searchLower))
    ).slice(0, 5);
  }, [userSearchTerm, allUsers, userShowSuggestions, selectedLeader]);

  // Tự động chọn nếu MSSV khớp chính xác & sync với search term
  useEffect(() => {
    if (modalStep === "create" || modalStep === "edit") {
      // 1. Nếu trống -> reset
      if (!userSearchTerm) {
        setSelectedLeader(null);
        return;
      }

      // 2. Tìm match chính xác theo MSSV
      const exactMatch = allUsers.find(u => u.student_id === userSearchTerm);
      if (exactMatch) {
         if (!selectedLeader || selectedLeader.id !== exactMatch.id) {
            setSelectedLeader(exactMatch);
         }
         return;
      }

      // 3. Nếu đang có selectedLeader nhưng term không khớp cả Name và MSSV -> reset
      if (selectedLeader) {
         const isMatchName = userSearchTerm === selectedLeader.full_name;
         const isMatchID = userSearchTerm === selectedLeader.student_id;
         if (!isMatchName && !isMatchID) {
            setSelectedLeader(null);
         }
      }
    }
  }, [userSearchTerm, allUsers, modalStep, selectedLeader]);

  // --- LOGIC XỬ LÝ DỮ LIỆU ---
  const handleCreate = async () => {
    setIsSubmitting(true);
    try {
      // 1. Create Organization
      const res = await organizationService.createOrganization({
        name: newUnitName,
        type: newUnitType,
        parent_id: null 
      });
      
      // 2. Assign Leader if selected
      if (selectedLeader && res.id) {
        await organizationService.assignMember({
          user_id: selectedLeader.id,
          organization_id: res.id,
          title: assignTitle,
          is_primary: true
        });
      }

      setModalStep("success");
      fetchUnits();
    } catch (error) {
      console.error("Create failed", error);
    } finally {
      setIsSubmitting(false);
    }
  };


  const handleDelete = async () => {
    try {
      if (selectedUnit?.id) {
        await organizationService.deleteOrganization(selectedUnit.id);
        setModalStep("none");
        setSelectedUnit(null);
        fetchUnits();
      }
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  const handleEdit = async () => {
    setIsSubmitting(true);
    try {
      if (selectedUnit?.id) {
        // 1. Update Org Info
        await organizationService.updateOrganization(selectedUnit.id, {
          name: newUnitName,
          type: newUnitType
        });

        // 2. Update Leader if changed
        if (selectedLeader) {
          await organizationService.assignMember({
            user_id: selectedLeader.id,
            organization_id: selectedUnit.id,
            title: assignTitle,
            is_primary: true
          });
        }

        setModalStep("success");
        setNewUnitName("");
        fetchUnits();
      }
    } catch (error) {
      console.error("Update failed", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const exportToExcel = () => {
    const dataToExport = filteredUnits.map((u) => ({
      "Tên đơn vị": u.name,
      "Loại hình": u.type,
      "Người đứng đầu": u.leader,
      "Chức vụ": u.leaderTitle,
      "Quy mô": u.size,
      "Điểm thi đua": u.score,
      "Trạng thái": u.status,
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Danh sách đơn vị");
    XLSX.writeFile(workbook, `Danh_Sach_Don_Vi_${new Date().getTime()}.xlsx`);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-4 p-4 md:p-6 bg-white min-h-screen font-sans text-slate-900">
      {/* 1. THANH CÔNG CỤ */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-center mb-6">
        <div className="relative w-full lg:max-w-md">
          <div className="relative group">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors"
              size={18}
            />
            <input
              type="text"
              placeholder="Tìm theo tên, người đứng đầu..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:bg-white focus:border-blue-500 transition-all"
            />
          </div>

          {showSuggestions && searchTerm && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-2xl shadow-2xl z-50 overflow-hidden">
              <div className="px-4 py-2 bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Gợi ý tìm kiếm
              </div>
              {suggestions.map((u) => (
                <button
                  key={u.id}
                  onClick={() => {
                    setSearchTerm(u.name);
                    setShowSuggestions(false);
                  }}
                  className="w-full px-4 py-3 text-left hover:bg-blue-50 flex items-center justify-between group"
                >
                  <span className="text-sm font-bold text-slate-700 group-hover:text-blue-600">
                    {u.name}
                  </span>
                  <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-500">
                    {u.type}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 w-full lg:w-auto">
          <button
            onClick={exportToExcel}
            className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-5 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-black text-slate-600 hover:bg-slate-50 transition-all shadow-sm active:scale-95"
          >
            <Download size={18} />
            <span>Xuất Excel</span>
          </button>
          <button
            onClick={() => {
              setNewUnitName("");
              setModalStep("create");
            }}
            className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 rounded-2xl text-sm font-black text-white shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95"
          >
            <Plus size={18} />
            <span>Thêm Đơn vị</span>
          </button>
        </div>
      </div>

      {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-4">
              <Loader2 className="animate-spin" size={40} />
              <p className="font-bold">Đang tải danh sách đơn vị...</p>
          </div>
      ) : (
      <div className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                  Thông tin đơn vị
                </th>
                <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                  Nhân sự phụ trách
                </th>
                <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center">
                  Quy mô
                </th>
                <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center">
                  Thi đua
                </th>
                <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center">
                  Trạng thái
                </th>
                <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest text-right">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredUnits.length > 0 ? (
                filteredUnits.map((unit) => (
                  <tr
                    key={unit.id}
                    className="hover:bg-blue-50/30 transition-colors group"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                          <ExternalLink size={22} />
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-800 uppercase tracking-tight">
                            {unit.name}
                          </p>
                          <p className="text-[11px] text-slate-400 font-bold">
                            {unit.type}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-slate-100 border-2 border-white shadow-sm flex items-center justify-center text-blue-600 text-[11px] font-black uppercase">
                          {unit.leader.split(" ").pop().charAt(0)}
                        </div>
                        <div>
                          <p className="text-xs font-black text-slate-700">
                            {unit.leader}
                          </p>
                          <p className="text-[10px] text-slate-400 font-medium">
                            {unit.leaderId ? `${unit.leaderId} • ` : ""}{unit.leaderTitle}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <p className="text-xs font-black text-slate-700">
                        {unit.size}
                      </p>
                      <p className="text-[10px] text-slate-400 font-medium">
                        {unit.subUnits}
                      </p>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg">
                        {unit.score}đ
                      </span>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-black uppercase">
                        {unit.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => {
                            setSelectedUnit(unit);
                            setNewUnitName(unit.name);
                            setNewUnitType(unit.type === 'LCĐ Khoa' ? 'FACULTY' : unit.type === 'CLB/Đội/Nhóm' ? 'CLUB' : 'CLASS');
                            // Load existing leader info if available
                            setUserSearchTerm(unit.leaderId || "");
                            setAssignTitle(unit.leaderTitle || "Bí thư");
                            setModalStep("edit");
                          }}
                          className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-white rounded-xl shadow-sm border border-transparent hover:border-slate-100 transition-all"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedUnit(unit);
                            setModalStep("delete");
                          }}
                          className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-white rounded-xl shadow-sm border border-transparent hover:border-slate-100 transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-20 text-center text-slate-300"
                  >
                    <Filter
                      size={48}
                      className="mx-auto mb-3"
                      strokeWidth={1}
                    />
                    <p className="text-sm font-medium">
                      Không tìm thấy dữ liệu
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      )}

      {/* 3. MODAL SYSTEM */}
      {modalStep !== "none" && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-slate-900/40 backdrop-blur-[2px] p-0 sm:p-4">
          <div className="bg-white w-full max-w-lg rounded-t-[2.5rem] sm:rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-slate-50">
              <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">
                {modalStep === "create" && "Tạo đơn vị mới"}
                {modalStep === "edit" && "Chỉnh sửa đơn vị"}
                {modalStep === "delete" && "Xác nhận xóa"}
                {modalStep === "success" && "Thông báo"}
              </h3>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X size={20} className="text-slate-400" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-8">
              {(modalStep === "create" || modalStep === "edit") && (
                <div className="space-y-5">
                  <div>
                    <label className="block text-[11px] font-black text-slate-400 uppercase mb-2 ml-1">
                      Tên đơn vị *
                    </label>
                    <input
                      type="text"
                      value={newUnitName}
                      onChange={(e) => setNewUnitName(e.target.value)}
                      placeholder="VD: Khoa Ngoại ngữ..."
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-bold"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-black text-slate-400 uppercase mb-2 ml-1">
                        Loại hình
                      </label>
                      <select 
                         value={newUnitType}
                         onChange={(e) => setNewUnitType(e.target.value)}
                         className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none font-bold italic"
                      >
                        <option value="FACULTY">Đoàn Khoa</option>
                        <option value="CLUB">CLB / Đội / Nhóm</option>
                        <option value="CLASS">Chi đoàn</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-black text-slate-400 uppercase mb-2 ml-1">
                        Trực thuộc
                      </label>
                      <select className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none font-bold italic">
                        <option>Ban Chấp hành</option>
                      </select>
                    </div>
                  </div>

                  {/* Phần bổ nhiệm lãnh đạo */}
                  <div className="pt-4 border-t border-slate-100">
                    <label className="block text-[11px] font-black text-slate-500 uppercase mb-3 flex items-center gap-2">
                       <UserPlus size={14} className="text-blue-500" />
                       {modalStep === "create" ? "Bổ nhiệm người phụ trách (Tùy chọn)" : "Chỉnh sửa người phụ trách"}
                    </label>
                    <div className="space-y-4">
                      <div className="relative group">
                        <input
                          type="text"
                          value={userSearchTerm}
                          onChange={(e) => {
                            setUserSearchTerm(e.target.value);
                            setUserShowSuggestions(true);
                          }}
                          onFocus={() => setUserShowSuggestions(true)}
                          placeholder="Nhập MSSV hoặc Tên lãnh đạo..."
                          className={`w-full px-5 py-4 bg-slate-50 border ${selectedLeader ? 'border-blue-500 ring-4 ring-blue-500/10' : 'border-slate-200'} rounded-2xl text-sm focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-bold pr-12`}
                        />
                        {userSearchTerm && (
                          <button
                            type="button"
                            onClick={() => {
                              setUserSearchTerm("");
                              setSelectedLeader(null);
                              setUserShowSuggestions(false);
                            }}
                            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-200 rounded-full text-slate-400 transition-colors"
                          >
                            <X size={14} />
                          </button>
                        )}
                        {filteredUsers.length > 0 && userShowSuggestions && (
                          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-2xl shadow-2xl z-[110] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                            {filteredUsers.map(u => (
                              <button
                                key={u.id}
                                type="button"
                                onClick={() => {
                                  setSelectedLeader(u);
                                  setUserSearchTerm(u.full_name);
                                  setUserShowSuggestions(false);
                                }}
                                className="w-full px-4 py-3 text-left hover:bg-blue-50 flex items-center gap-3 border-b border-slate-50 last:border-0"
                              >
                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-[10px] font-bold uppercase">
                                  {u.full_name?.split(" ").pop().charAt(0)}
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm font-bold text-slate-700">{u.full_name}</p>
                                  <p className="text-[10px] text-slate-400">{u.student_id ? `MSSV: ${u.student_id}` : u.email}</p>
                                </div>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-3 p-3 bg-blue-50/50 rounded-2xl border border-blue-100/50">
                         <div className="flex-1">
                             <p className="text-[10px] font-black text-blue-500 uppercase mb-1 ml-1">Chức vụ</p>
                             <select 
                               value={assignTitle}
                               onChange={(e) => setAssignTitle(e.target.value)}
                               className="w-full bg-transparent text-sm font-bold text-slate-700 outline-none"
                             >
                               <option>Bí thư</option>
                               <option>Phó Bí thư</option>
                               <option>Chủ nhiệm CLB</option>
                               <option>Trưởng Đội/Nhóm</option>
                               <option>Ủy viên</option>
                             </select>
                         </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {modalStep === "delete" && (
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto text-red-500">
                    <AlertTriangle size={40} />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-black text-slate-800">
                      Bạn có chắc chắn muốn xóa?
                    </h4>
                    <p className="text-sm text-slate-400">
                      Hành động này sẽ xóa vĩnh viễn đơn vị <br />
                      <span className="font-black text-red-600 uppercase">
                        {selectedUnit?.name}
                      </span>
                    </p>
                  </div>
                </div>
              )}

              {modalStep === "success" && (
                <div className="py-6 text-center">
                  <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-500 shadow-lg shadow-emerald-50">
                    <CheckCircle2 size={48} />
                  </div>
                  <h4 className="text-xl font-black text-slate-800 uppercase italic">
                    Thành công!
                  </h4>
                  <p className="text-sm text-slate-400 mt-2">
                    Dữ liệu đã được cập nhật thành công vào hệ thống.
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-8 py-6 bg-slate-50/50 flex flex-col sm:flex-row justify-end gap-3">
              {modalStep === "delete" ? (
                <>
                  <button
                    onClick={() => setModalStep("none")}
                    className="px-6 py-3 text-sm font-black text-slate-400"
                  >
                    HỦY BỎ
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-8 py-3 bg-red-600 text-white text-sm font-black rounded-xl shadow-lg shadow-red-100 hover:bg-red-700 transition-all active:scale-95"
                  >
                    XÁC NHẬN XÓA
                  </button>
                </>
              ) : modalStep === "edit" ? (
                <>
                  <button
                    onClick={() => setModalStep("none")}
                    className="px-6 py-3 text-sm font-black text-slate-400"
                  >
                    HỦY
                  </button>
                  <button
                    onClick={handleEdit}
                    disabled={!newUnitName || !selectedLeader || isSubmitting}
                    className="px-8 py-3 bg-blue-600 text-white text-sm font-black rounded-xl shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
                  >
                    {isSubmitting && <Loader2 size={16} className="animate-spin" />}
                    LƯU THAY ĐỔI
                  </button>
                </>
              ) : modalStep === "create" ? (
                <>
                  <button
                    onClick={() => setModalStep("none")}
                    className="px-6 py-3 text-sm font-black text-slate-400"
                  >
                    HỦY
                  </button>
                  <button
                    onClick={handleCreate}
                    disabled={!newUnitName || !selectedLeader || isSubmitting}
                    className="px-8 py-3 bg-blue-600 text-white text-sm font-black rounded-xl shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
                  >
                    {isSubmitting && <Loader2 size={16} className="animate-spin" />}
                    HOÀN TẤT
                  </button>
                </>
              ) : (
                <button
                  onClick={handleCloseModal}
                  className="w-full py-4 bg-slate-900 text-white text-sm font-black rounded-2xl uppercase tracking-widest active:scale-95 transition-all shadow-xl shadow-slate-200"
                >
                  ĐÓNG CỬA SỔ
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UnitList;
