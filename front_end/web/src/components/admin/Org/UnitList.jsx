import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  Users,
  CheckCircle2,
  Loader2,
  Building2,
} from "lucide-react";
import * as XLSX from "xlsx";
import { organizationService } from "../../../services/organizationService";
import { userService } from "../../../services/userService";

const UnitList = ({ triggerCreateModal, onModalClose }) => {
  const navigate = useNavigate();
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

  // View Members
  const [unitMembers, setUnitMembers] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(false);

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
    setCreatedOrgId(null);
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

  const handleViewMembers = (unit) => {
    navigate(`/admin/organizations/units/${unit.id}/members`, {
      state: { unitName: unit.name }
    });
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
    <div className="space-y-4 font-sans text-slate-900">
      {/* 1. THANH CÔNG CỤ */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
        <div className="relative w-full sm:w-80">
          <div className="relative group">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors pointer-events-none"
              size={15}
            />
            <input
              type="text"
              placeholder="Tìm theo tên đơn vị, lãnh đạo..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-600 transition-all shadow-xs"
            />
          </div>

          {showSuggestions && searchTerm && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-2 bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Gợi ý tìm kiếm
              </div>
              {suggestions.map((u) => (
                <button
                  key={u.id}
                  onClick={() => {
                    setSearchTerm(u.name);
                    setShowSuggestions(false);
                  }}
                  className="w-full px-3 py-2 text-left hover:bg-blue-50 flex items-center justify-between group transition-colors"
                >
                  <span className="text-xs font-semibold text-slate-700 group-hover:text-blue-600">
                    {u.name}
                  </span>
                  <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500 font-medium">
                    {u.type}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          <button
            onClick={exportToExcel}
            className="flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            <Download size={15} />
            <span>Xuất Excel</span>
          </button>
          <button
            onClick={() => {
              setNewUnitName("");
              setModalStep("create");
            }}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus size={15} />
            <span>+ Thêm Đơn vị</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 text-slate-400 gap-3 bg-white rounded-xl border border-slate-200">
          <Loader2 className="animate-spin text-blue-600" size={32} />
          <p className="text-xs font-medium text-slate-500">Đang tải danh sách đơn vị...</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/90 border-b border-slate-200">
                  <th className="py-3 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Thông tin đơn vị
                  </th>
                  <th className="py-3 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Nhân sự phụ trách
                  </th>
                  <th className="py-3 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center">
                    Quy mô
                  </th>
                  <th className="py-3 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center">
                    Thi đua
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
                {filteredUnits.length > 0 ? (
                  filteredUnits.map((unit) => (
                    <tr
                      key={unit.id}
                      className="hover:bg-slate-50/70 transition-colors group"
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 bg-blue-50 text-blue-600 border border-blue-100">
                            <Building2 size={16} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-900 leading-tight">
                              {unit.name}
                            </p>
                            <p className="text-[11px] text-slate-400 mt-0.5">
                              {unit.type}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-blue-600 text-xs font-bold shrink-0">
                            {unit.leader.split(" ").pop().charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-slate-800 leading-tight">
                              {unit.leader}
                            </p>
                            <p className="text-[10px] text-slate-400 mt-0.5">
                              {unit.leaderId ? `${unit.leaderId} • ` : ""}{unit.leaderTitle}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <p className="text-xs font-semibold text-slate-700">
                          {unit.size}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {unit.subUnits}
                        </p>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="inline-flex items-center text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                          {unit.score}đ
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {unit.status === "Active" ? "Đang hoạt động" : unit.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleViewMembers(unit)}
                            title="Danh sách thành viên"
                            className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                          >
                            <Users size={15} />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedUnit(unit);
                              setNewUnitName(unit.name);
                              setNewUnitType(unit.type === 'LCĐ Khoa' ? 'FACULTY' : unit.type === 'CLB/Đội/Nhóm' ? 'CLUB' : 'CLASS');
                              setUserSearchTerm(unit.leaderId || "");
                              setAssignTitle(unit.leaderTitle || "Bí thư");
                              setModalStep("edit");
                            }}
                            title="Chỉnh sửa đơn vị"
                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Edit3 size={15} />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedUnit(unit);
                              setModalStep("delete");
                            }}
                            title="Xóa đơn vị"
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-16 text-center text-slate-400"
                    >
                      <Filter
                        size={36}
                        className="mx-auto mb-2 text-slate-300"
                        strokeWidth={1.5}
                      />
                      <p className="text-xs font-medium text-slate-500">
                        Không tìm thấy đơn vị phù hợp
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/70">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                {modalStep === "create" && "Tạo đơn vị mới"}
                {modalStep === "edit" && "Chỉnh sửa đơn vị"}
                {modalStep === "delete" && "Xác nhận xóa đơn vị"}
                {modalStep === "success" && "Thông báo"}
                {modalStep === "members" && `Danh sách ${selectedUnit?.name}`}
              </h3>
              <button
                onClick={handleCloseModal}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {(modalStep === "create" || modalStep === "edit") && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                      Tên đơn vị *
                    </label>
                    <input
                      type="text"
                      value={newUnitName}
                      onChange={(e) => setNewUnitName(e.target.value)}
                      placeholder="VD: Khoa Ngoại ngữ..."
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all font-medium"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                        Loại hình
                      </label>
                      <select 
                         value={newUnitType}
                         onChange={(e) => setNewUnitType(e.target.value)}
                         className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-700 outline-none focus:border-blue-600"
                      >
                        <option value="FACULTY">Đoàn Khoa</option>
                        <option value="CLUB">CLB / Đội / Nhóm</option>
                        <option value="CLASS">Chi đoàn</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                        Trực thuộc
                      </label>
                      <select className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-700 outline-none focus:border-blue-600">
                        <option>Ban Chấp hành</option>
                      </select>
                    </div>
                  </div>

                  {/* Phần bổ nhiệm lãnh đạo */}
                  <div className="pt-3 border-t border-slate-200">
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                       <UserPlus size={14} className="text-blue-600" />
                       {modalStep === "create" ? "Bổ nhiệm người phụ trách (Tùy chọn)" : "Chỉnh sửa người phụ trách"}
                    </label>
                    <div className="space-y-3">
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
                          className={`w-full px-3.5 py-2.5 bg-white border ${selectedLeader ? 'border-blue-600 ring-2 ring-blue-100' : 'border-slate-300'} rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all font-medium pr-10`}
                        />
                        {userSearchTerm && (
                          <button
                            type="button"
                            onClick={() => {
                              setUserSearchTerm("");
                              setSelectedLeader(null);
                              setUserShowSuggestions(false);
                            }}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 rounded-md text-slate-400 hover:text-slate-600 transition-colors"
                          >
                            <X size={14} />
                          </button>
                        )}
                        {filteredUsers.length > 0 && userShowSuggestions && (
                          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-xl z-[110] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                            {filteredUsers.map(u => (
                              <button
                                key={u.id}
                                type="button"
                                onClick={() => {
                                  setSelectedLeader(u);
                                  setUserSearchTerm(u.full_name);
                                  setUserShowSuggestions(false);
                                }}
                                className="w-full px-3.5 py-2.5 text-left hover:bg-blue-50 flex items-center gap-2.5 border-b border-slate-100 last:border-0 transition-colors"
                              >
                                <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xs font-bold shrink-0">
                                  {u.full_name?.split(" ").pop().charAt(0)}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-bold text-slate-800 truncate">{u.full_name}</p>
                                  <p className="text-[10px] text-slate-400">{u.student_id ? `MSSV: ${u.student_id}` : u.email}</p>
                                </div>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                         <div className="flex-1">
                             <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Chức vụ phụ trách</p>
                             <select 
                               value={assignTitle}
                               onChange={(e) => setAssignTitle(e.target.value)}
                               className="w-full bg-transparent text-xs font-semibold text-slate-800 outline-none"
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
                <div className="text-center space-y-3 py-2">
                  <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto">
                    <AlertTriangle size={28} />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-base font-bold text-slate-900">
                      Bạn có chắc chắn muốn xóa?
                    </h4>
                    <p className="text-xs text-slate-500">
                      Hành động này sẽ xóa vĩnh viễn đơn vị{" "}
                      <span className="font-bold text-rose-600">
                        {selectedUnit?.name}
                      </span>
                    </p>
                  </div>
                </div>
              )}

              {modalStep === "success" && (
                <div className="py-4 text-center">
                  <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-3 text-emerald-600 border border-emerald-100">
                    <CheckCircle2 size={32} />
                  </div>
                  <h4 className="text-base font-bold text-slate-900">
                    Thao tác thành công!
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Dữ liệu đã được cập nhật thành công vào hệ thống.
                  </p>
                </div>
              )}

              {modalStep === "members" && (
                <div className="max-h-[50vh] overflow-y-auto w-full">
                    {loadingMembers ? (
                        <div className="flex flex-col items-center justify-center py-8 text-slate-400 gap-2">
                            <Loader2 className="animate-spin text-blue-600" size={24} />
                            <p className="text-xs font-medium">Đang tải danh sách...</p>
                        </div>
                    ) : unitMembers.length === 0 ? (
                        <p className="text-center text-xs text-slate-500 py-6">Chưa có sinh viên nào trong đơn vị này.</p>
                    ) : (
                        <div className="overflow-x-auto w-full">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                                        <th className="px-3 py-2.5">STT</th>
                                        <th className="px-3 py-2.5">MSSV</th>
                                        <th className="px-3 py-2.5">Họ và tên</th>
                                        <th className="px-3 py-2.5">Chức vụ</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {unitMembers.map((m, idx) => (
                                        <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-3 py-2 text-xs text-slate-500">{idx + 1}</td>
                                            <td className="px-3 py-2 text-xs font-bold text-slate-700">{m.student_id || '---'}</td>
                                            <td className="px-3 py-2 text-xs font-semibold text-slate-800">{m.full_name}</td>
                                            <td className="px-3 py-2">
                                                <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                                                    {m.title}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3.5 bg-slate-50/70 border-t border-slate-200 flex justify-end gap-2.5">
              {modalStep === "delete" ? (
                <>
                  <button
                    onClick={() => setModalStep("none")}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
                  >
                    Xác nhận xóa
                  </button>
                </>
              ) : modalStep === "edit" ? (
                <>
                  <button
                    onClick={() => setModalStep("none")}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleEdit}
                    disabled={!newUnitName || !selectedLeader || isSubmitting}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors disabled:opacity-50 flex items-center gap-1.5"
                  >
                    {isSubmitting && <Loader2 size={14} className="animate-spin" />}
                    Lưu thay đổi
                  </button>
                </>
              ) : modalStep === "create" ? (
                <>
                  <button
                    onClick={() => setModalStep("none")}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleCreate}
                    disabled={!newUnitName || !selectedLeader || isSubmitting}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors disabled:opacity-50 flex items-center gap-1.5"
                  >
                    {isSubmitting && <Loader2 size={14} className="animate-spin" />}
                    Hoàn tất
                  </button>
                </>
              ) : (
                <button
                  onClick={handleCloseModal}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-lg transition-colors"
                >
                  Đóng
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
