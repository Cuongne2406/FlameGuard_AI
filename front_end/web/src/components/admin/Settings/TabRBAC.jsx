import React, { useState, useEffect } from "react";
import {
  Shield,
  CheckCircle2,
  XCircle,
  Eye,
  Plus,
  History,
  Settings,
  Zap,
  Bug,
  Users,
  Search,
  UserPlus,
  ChevronDown,
} from "lucide-react";
import { Toggle } from "../ui/Toggle";
import { activityLogService } from "../../../services/activityLogService";
import { rbacService } from "../../../services/rbacService";
import { userService } from "../../../services/userService";
import { Trash2 } from "lucide-react";

const PROTECTED_ROLES = ["STUDENT", "FACULTY_ADMIN", "UNIVERSITY_ADMIN"];

const TabRBAC = () => {
  const [auditLogs, setAuditLogs] = useState([]);
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [updatingUser, setUpdatingUser] = useState(null);
  const [togglingPerm, setTogglingPerm] = useState(null);
  const [showAddRoleModal, setShowAddRoleModal] = useState(false);
  const [newRoleData, setNewRoleData] = useState({ name: "", description: "" });
  const [isCreatingRole, setIsCreatingRole] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [logsData, rolesData, permsData, usersData] = await Promise.all([
        activityLogService.getLogs({ limit: 4 }),
        rbacService.getRoles(),
        rbacService.getPermissions(),
        userService.getAllUsers(),
      ]);
      setAuditLogs(logsData.items || []);
      setRoles(rolesData);
      setPermissions(permsData);
      setUsers(usersData);
    } catch (err) {
      console.error("Failed to fetch RBAC data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRoleChange = async (userId, roleId) => {
    setUpdatingUser(userId);
    try {
      await userService.updateUser(userId, { role_ids: [roleId] });
      // Refresh user list after update
      const updatedUsers = await userService.getAllUsers();
      setUsers(updatedUsers);
      alert("Cập nhật quyền người dùng thành công!");
    } catch (err) {
      console.error("Failed to update user role:", err);
      alert("Lỗi khi cập nhật quyền. Vui lòng thử lại.");
    } finally {
      setUpdatingUser(null);
    }
  };

  const handlePermissionToggle = async (role, permissionId, hasPermission) => {
    setTogglingPerm({ roleId: role.id, permId: permissionId });
    try {
      let newPermissionIds = role.permissions?.map(p => p.id) || [];
      
      if (hasPermission) {
        newPermissionIds = newPermissionIds.filter(id => id !== permissionId);
      } else {
        newPermissionIds = [...newPermissionIds, permissionId];
      }

      await rbacService.updateRole(role.id, { permission_ids: newPermissionIds });
      
      // Refresh roles data on success
      const updatedRoles = await rbacService.getRoles();
      setRoles(updatedRoles);
    } catch (err) {
      console.error("Failed to toggle permission:", err);
      alert("Lỗi khi cập nhật quyền hạn. Vui lòng thử lại.");
    } finally {
      setTogglingPerm(null);
    }
  };

  const handleCreateRole = async (e) => {
    e.preventDefault();
    if (!newRoleData.name) return alert("Vui lòng nhập tên vai trò");
    
    setIsCreatingRole(true);
    try {
      await rbacService.createRole(newRoleData);
      alert("Tạo vai trò mới thành công!");
      setShowAddRoleModal(false);
      setNewRoleData({ name: "", description: "" });
      // Refresh data
      const updatedRoles = await rbacService.getRoles();
      setRoles(updatedRoles);
    } catch (err) {
      console.error("Failed to create role:", err);
      alert("Lỗi khi tạo vai trò. Vui lòng thử lại.");
    } finally {
      setIsCreatingRole(false);
    }
  };

  const handleDeleteRole = async (role) => {
    if (PROTECTED_ROLES.includes(role.name)) {
      return alert("Không thể xóa các vai trò hệ thống!");
    }

    if (!window.confirm(`Bạn có chắc chắn muốn xóa vai trò "${role.name}"? Hành động này không thể hoàn tác.`)) {
      return;
    }

    try {
      await rbacService.deleteRole(role.id);
      alert("Xóa vai trò thành công!");
      // Refresh data
      const updatedRoles = await rbacService.getRoles();
      setRoles(updatedRoles);
    } catch (err) {
      console.error("Failed to delete role:", err);
      alert("Lỗi khi xóa vai trò. Vui lòng thử lại.");
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch = 
      u.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.student_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === "ALL" || u.roles?.some(r => r.name === roleFilter);
    
    return matchesSearch && matchesRole;
  });

  const recentAuditLogs = auditLogs.length > 0 ? auditLogs.map(log => ({
    action: log.action,
    user: log.user,
    time: log.time,
    type: log.type,
    color: log.type === 'danger' ? 'text-red-500' : log.type === 'success' ? 'text-emerald-500' : 'text-blue-500',
    bg: log.type === 'danger' ? 'bg-red-50' : log.type === 'success' ? 'bg-emerald-50' : 'bg-blue-50'
  })) : [
    {
      action: "No recent activity",
      user: "N/A",
      time: "",
      color: "text-slate-400",
      bg: "bg-slate-50",
    }
  ];

  if (loading) return (
    <div className="flex items-center justify-center p-20">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="flex flex-col lg:flex-row gap-6 animate-in fade-in duration-500">
      {/* CỘT TRÁI: MA TRẬN PHÂN QUYỀN & QUẢN LÝ NGƯỜI DÙNG */}
      <div className="flex-1 space-y-6">
        {/* MA TRẬN PHÂN QUYỀN */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-100 rounded-xl">
                <Shield size={20} className="text-slate-600" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-800">
                  Ma trận Phân quyền (Role-Based Access Control)
                </h3>
              </div>
            </div>
            <button 
              onClick={() => setShowAddRoleModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-[10px] font-black hover:bg-blue-100 transition-all font-sans"
            >
              <Plus size={14} /> Thêm Vai trò Mới
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px] table-fixed">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest font-sans w-[280px]">
                    Quyền hạn / Chức năng
                  </th>
                  {roles.map((role, i) => (
                    <th
                      key={role.id}
                      className={`px-4 py-4 text-[10px] font-black text-center uppercase tracking-tighter font-sans w-32 ${i === 2 ? "text-blue-600" : "text-slate-400"}`}
                    >
                      <div className="relative inline-flex items-center justify-center group/role">
                        <span className="whitespace-nowrap">{role.name}</span>
                        {!PROTECTED_ROLES.includes(role.name) && (
                          <button
                            onClick={() => handleDeleteRole(role)}
                            className="absolute -right-6 opacity-0 group-hover/role:opacity-100 p-1 text-slate-300 hover:text-red-500 transition-all"
                            title="Xóa vai trò"
                          >
                            <Trash2 size={12} />
                          </button>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {permissions.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-5 text-xs font-black text-slate-700 font-sans">
                      {p.resource_name}.{p.action}
                    </td>
                    {roles.map((role) => {
                      const hasPermission = role.permissions?.some(rp => rp.id === p.id);
                      const isToggling = togglingPerm?.roleId === role.id && togglingPerm?.permId === p.id;
                      
                      return (
                        <td key={role.id} className="px-4 py-5">
                          <div className="flex justify-center">
                            <button
                              disabled={isToggling}
                              onClick={() => handlePermissionToggle(role, p.id, hasPermission)}
                              className={`p-1.5 rounded-lg transition-all ${
                                isToggling ? "opacity-50 cursor-wait" : "hover:bg-slate-100 cursor-pointer"
                              }`}
                              title={hasPermission ? "Gỡ quyền" : "Cấp quyền"}
                            >
                              {isToggling ? (
                                <div className="w-[18px] h-[18px] border-2 border-slate-300 border-t-blue-500 rounded-full animate-spin" />
                              ) : hasPermission ? (
                                <CheckCircle2 size={18} className="text-emerald-500" />
                              ) : (
                                <XCircle size={18} className="text-slate-200 hover:text-slate-400" />
                              )}
                            </button>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* QUẢN LÝ NGƯỜI DÙNG & VAI TRÒ */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 font-sans">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-xl">
                <Users size={20} className="text-blue-600" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-800 font-sans">
                  Quản lý Người dùng & Vai trò
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-1 md:max-w-md font-sans">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-sans" size={16} />
                <input
                  type="text"
                  placeholder="Tìm tên, MSSV, email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold font-sans outline-none focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all"
                />
              </div>
              
              <div className="relative">
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="appearance-none pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-black text-slate-600 outline-none focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all cursor-pointer font-sans"
                >
                  <option value="ALL">Tất cả vai trò</option>
                  {roles.map(role => (
                    <option key={role.id} value={role.name}>{role.name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px] font-sans">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest font-sans">
                    Họ và tên
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest font-sans">
                    Email / MSSV
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest font-sans">
                    Vai trò hiện tại
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right font-sans">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50/50 transition-colors font-sans">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-500 font-sans">
                            {user.full_name?.split(" ").pop()?.[0]}
                          </div>
                          <span className="text-xs font-black text-slate-700 font-sans">
                            {user.full_name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5 font-sans">
                        <div className="space-y-0.5 font-sans">
                          <p className="text-xs font-bold text-slate-600 font-sans font-sans">{user.email}</p>
                          <p className="text-[10px] font-black text-slate-400 uppercase font-sans font-sans">{user.student_id || "GLOBAL ADMIN"}</p>
                        </div>
                      </td>
                      <td className="px-6 py-5 font-sans font-sans font-sans">
                        <div className="flex flex-wrap gap-1 font-sans">
                          {user.roles && user.roles.length > 0 ? (
                            user.roles.map(r => (
                              <span key={r.id} className="px-2 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black font-sans font-sans">
                                {r.name}
                              </span>
                            ))
                          ) : (
                            <span className="text-[10px] font-bold text-slate-400 italic font-sans font-sans">Chưa có vai trò</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-5 text-right font-sans font-sans">
                        <div className="relative inline-block text-left group font-sans">
                          <button 
                            disabled={updatingUser === user.id}
                            className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-black hover:bg-slate-200 transition-all disabled:opacity-50 font-sans"
                          >
                            {updatingUser === user.id ? "Đang xử lý..." : "Đổi Vai trò"}
                            <ChevronDown size={12} />
                          </button>
                          
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-1 z-50 invisible group-hover:visible group-focus-within:visible opacity-0 group-hover:opacity-100 transition-all transform origin-top-right scale-95 group-hover:scale-100 font-sans">
                            {roles.map(role => (
                              <button
                                key={role.id}
                                onClick={() => handleRoleChange(user.id, role.id)}
                                className="w-full text-left px-4 py-2 text-[10px] font-black text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-colors font-sans"
                              >
                                {role.name}
                              </button>
                            ))}
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-10 text-center text-xs font-bold text-slate-400 font-sans font-sans">
                      Không tìm thấy người dùng phù hợp.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* CỘT PHẢI: NHẬT KÝ TRUY VẾT NHANH */}
      <div className="w-full lg:w-80 space-y-6 font-sans">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm h-full font-sans">
          <div className="flex items-center gap-3 mb-6 font-sans font-sans">
            <History size={18} className="text-slate-400 font-sans" />
            <h3 className="text-sm font-black text-slate-800 font-sans font-sans">
              Nhật ký Truy vết (Audit Logs)
            </h3>
          </div>

          <div className="space-y-4 font-sans font-sans font-sans">
            {recentAuditLogs.map((log, i) => (
              <div
                key={i}
                className="flex gap-4 p-3 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer group"
              >
                <div
                  className={`w-10 h-10 rounded-full ${log.bg} flex items-center justify-center shrink-0`}
                >
                  {i === 0 ? (
                    <XCircle size={18} className={log.color} />
                  ) : i === 1 ? (
                    <CheckCircle2 size={18} className={log.color} />
                  ) : i === 2 ? (
                    <Zap size={18} className={log.color} />
                  ) : (
                    <Bug size={18} className={log.color} />
                  )}
                </div>
                <div className="space-y-1 overflow-hidden font-sans">
                  <div className="flex justify-between items-center gap-2 font-sans font-sans">
                    <p className="text-[11px] font-black text-slate-700 truncate font-sans">
                      {log.action}
                    </p>
                    <span className="text-[9px] font-bold text-slate-300 whitespace-nowrap font-sans">
                      {log.time}
                    </span>
                  </div>
                  <p className="text-[10px] font-bold text-slate-400 font-sans font-sans">
                    User{" "}
                    <span className="text-slate-600 font-black font-sans">
                      @{log.user}
                    </span>
                  </p>
                </div>
              </div>
            ))}
          </div>

          <button className="w-full mt-6 py-3 text-[10px] font-black text-blue-600 border border-blue-100 rounded-xl hover:bg-blue-50 transition-all font-sans font-sans">
            View Full Logs →
          </button>
        </div>
      </div>

      {/* MODAL THÊM VAI TRÒ */}
      {showAddRoleModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[999] flex items-center justify-center p-4 animate-in fade-in duration-300 font-sans">
          <div className="bg-white w-full max-w-md rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 font-sans">
            <div className="p-8 border-b border-slate-100 bg-slate-50/50 font-sans font-sans">
              <div className="flex items-center gap-3 mb-2 font-sans">
                <div className="p-2 bg-blue-100 rounded-xl font-sans">
                  <Shield size={24} className="text-blue-600" />
                </div>
                <h2 className="text-xl font-black text-slate-800 font-sans font-sans">Thêm Vai trò Mới</h2>
              </div>
              <p className="text-xs font-bold text-slate-400 font-sans">
                Tạo một nhóm quyền hạn mới cho hệ thống.
              </p>
            </div>

            <form onSubmit={handleCreateRole} className="p-8 space-y-6 font-sans">
              <div className="space-y-2 font-sans font-sans">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 font-sans">
                  Tên vai trò (Vd: SUPER_ADMIN)
                </label>
                <input
                  required
                  type="text"
                  value={newRoleData.name}
                  onChange={(e) => setNewRoleData({ ...newRoleData, name: e.target.value })}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-black outline-none focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all font-sans"
                  placeholder="Nhập tên vai trò..."
                />
              </div>

              <div className="space-y-2 font-sans">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 font-sans">
                  Mô tả chi tiết
                </label>
                <textarea
                  value={newRoleData.description}
                  onChange={(e) => setNewRoleData({ ...newRoleData, description: e.target.value })}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all h-24 resize-none font-sans"
                  placeholder="Mô tả các quyền hạn của vai trò này..."
                />
              </div>

              <div className="flex gap-4 pt-4 font-sans font-sans">
                <button
                  type="button"
                  onClick={() => setShowAddRoleModal(false)}
                  className="flex-1 py-4 text-xs font-black text-slate-500 bg-slate-100 rounded-2xl hover:bg-slate-200 transition-all font-sans"
                >
                  Hủy bỏ
                </button>
                <button
                  disabled={isCreatingRole}
                  type="submit"
                  className="flex-1 py-4 text-xs font-black text-white bg-blue-600 rounded-2xl hover:bg-blue-700 shadow-xl shadow-blue-500/20 transition-all disabled:opacity-50 font-sans"
                >
                  {isCreatingRole ? "Đang xử lý..." : "Lưu Vai trò"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TabRBAC;
