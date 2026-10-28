import React, { useState, useEffect, useContext } from "react";
import { 
  Building2, 
  Users, 
  Wallet, 
  AlertTriangle, 
  Search, 
  Filter, 
  FileDown, 
  Plus, 
  MoreVertical, 
  Edit, 
  Trash2, 
  UserCheck, 
  CheckCircle2, 
  ChevronLeft, 
  ChevronRight, 
  X,
  Star,
  Bell,
  ArrowRight
} from "lucide-react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { AuthContext } from "../../../context/AuthContext";
import Toast from "../../../components/ui/Toast";
import Modal from "../../../components/ui/Modal";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import AddClassModal from "../../../components/admin_sub/AddClassModal";
import { organizationService } from "../../../services/organizationService";

const SubAdminClasses = () => {
  const { user } = useContext(AuthContext);
  const facultyName = user?.managed_org_name || "Khoa Công nghệ Thông tin";

  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [classes, setClasses] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [statsData, setStatsData] = useState({
    totalClasses: "0",
    alertClasses: "0",
    feePercent: "0",
    totalStudents: "0"
  });

  const [showAddModal, setShowAddModal] = useState(false);
  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const [filterStatus, setFilterStatus] = useState("Tất cả");
  const [filterRank, setFilterRank] = useState("Tất cả");

  // Edit / Delete states
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [classToDelete, setClassToDelete] = useState(null);

  // View Members Modal
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [classMembers, setClassMembers] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(false);

  // Dropdown menu
  const [openDropdownId, setOpenDropdownId] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const fetchClassesData = async () => {
    setLoading(true);
    try {
      const [data, statsRes] = await Promise.all([
        organizationService.getClassesDetailed(),
        organizationService.getOrgStats()
      ]);
      setClasses(Array.isArray(data) ? data : []);
      if (statsRes) {
        setStatsData({
          totalClasses: statsRes.totalClasses || (Array.isArray(data) ? data.length : 0),
          alertClasses: statsRes.alertClasses || 0,
          feePercent: statsRes.feePercent || 94,
          totalStudents: statsRes.totalStudents || (Array.isArray(data) ? data.reduce((acc, c) => acc + (c.total || 45), 0) : 0)
        });
      }
    } catch (err) {
      console.error("Failed to fetch classes:", err);
      setToast({ message: "Lỗi khi tải danh sách chi đoàn", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClassesData();
  }, []);

  // Filter & Search
  const filteredClasses = classes.filter((cls) => {
    const matchesSearch =
      cls.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cls.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cls.leader?.toLowerCase().includes(searchQuery.toLowerCase());

    const statusMatch =
      filterStatus === "Tất cả" ||
      (filterStatus === "Online" && cls.online) ||
      (filterStatus === "Offline" && !cls.online);

    const rankMatch = filterRank === "Tất cả" || cls.status === filterRank;

    return matchesSearch && statusMatch && rankMatch;
  });

  const totalPages = Math.ceil(filteredClasses.length / itemsPerPage);
  const paginatedClasses = filteredClasses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Export Excel
  const exportToExcel = () => {
    const data = [
      ["Mã Chi đoàn", "Tên Chi đoàn", "Bí thư Chi đoàn", "Sĩ số", "Đoàn phí", "Điểm phong trào", "Xếp loại", "Trạng thái"],
      ...filteredClasses.map((cls) => [
        cls.id,
        cls.name,
        cls.leader || "Chưa phân công",
        cls.total || 45,
        `${cls.fee || 95}%`,
        cls.activity || 90,
        cls.status || "Vững mạnh",
        cls.alert || "Bình thường"
      ])
    ];
    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "ChiDoanKhoa");
    const buffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([buffer]), `DanhSach_ChiDoan_${facultyName.replace(/\s+/g, "_")}.xlsx`);
    setToast({ message: "Xuất dữ liệu Excel thành công!", type: "success" });
  };

  // Add Class
  const handleAddClass = async (modalData) => {
    try {
      const apiData = {
        name: modalData.className || modalData.name,
        type: "CLASS",
        description: `Chuyên ngành: ${modalData.major || "CNTT"} - Khóa: ${modalData.academicYear || "2025-2029"}`,
        status: "ACTIVE"
      };
      const result = await organizationService.createOrganization(apiData);
      setClasses((prev) => [result, ...prev]);
      setShowAddModal(false);
      setToast({ message: "✅ Thêm chi đoàn thành công!", type: "success" });
      fetchClassesData();
    } catch (err) {
      console.error("Failed to add class:", err);
      setToast({ message: "❌ Lỗi khi thêm chi đoàn", type: "error" });
    }
  };

  // View Members
  const handleViewMembers = async (cls) => {
    setSelectedClass(cls);
    setShowMembersModal(true);
    setLoadingMembers(true);
    setOpenDropdownId(null);
    try {
      const members = await organizationService.getOrganizationMembers(cls.id);
      setClassMembers(Array.isArray(members) ? members : []);
    } catch (err) {
      setClassMembers([]);
    } finally {
      setLoadingMembers(false);
    }
  };

  // Edit Class
  const handleEditClick = (cls) => {
    setSelectedClass({ ...cls });
    setShowEditModal(true);
    setOpenDropdownId(null);
  };

  const saveEdit = async () => {
    try {
      const apiData = {
        name: selectedClass.name,
        description: selectedClass.description
      };
      await organizationService.updateOrganization(selectedClass.id, apiData);
      setClasses((prev) =>
        prev.map((c) => (c.id === selectedClass.id ? { ...c, name: selectedClass.name } : c))
      );
      setShowEditModal(false);
      setSelectedClass(null);
      setToast({ message: "✅ Cập nhật thông tin chi đoàn thành công!", type: "success" });
    } catch (err) {
      setToast({ message: "❌ Lỗi cập nhật", type: "error" });
    }
  };

  // Delete Class
  const handleDeleteClick = (cls) => {
    setClassToDelete(cls);
    setShowDeleteModal(true);
    setOpenDropdownId(null);
  };

  const confirmDelete = async () => {
    try {
      await organizationService.deleteOrganization(classToDelete.id);
      setClasses((prev) => prev.filter((c) => c.id !== classToDelete.id));
      setShowDeleteModal(false);
      setClassToDelete(null);
      setToast({ message: "✅ Đã xóa chi đoàn!", type: "success" });
    } catch (err) {
      setToast({ message: "❌ Không thể xóa chi đoàn này", type: "error" });
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div>
          <h2 className="text-lg md:text-xl font-bold text-slate-900">
            Quản lý Chi đoàn & Tổ chức Cơ sở
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Theo dõi phân cấp, bí thư chi đoàn, tình hình thu đoàn phí và đoàn viên thuộc {facultyName}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={exportToExcel}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors shadow-xs"
          >
            <FileDown size={14} className="text-slate-500" />
            <span>Xuất Excel</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors shadow-xs"
          >
            <Plus size={14} />
            <span>+ Thêm Chi đoàn</span>
          </button>
        </div>
      </div>

      {/* Row 1: Compact Metric Bar (4 KPIs) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Tổng số Chi đoàn</span>
            <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Building2 size={16} />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{statsData.totalClasses}</span>
            <span className="text-xs text-slate-400">Lớp</span>
          </div>
          <p className="text-[11px] text-blue-600 font-medium mt-1">100% đã kiện toàn Ban chấp hành</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Tổng số Đoàn viên</span>
            <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Users size={16} />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{statsData.totalStudents}</span>
            <span className="text-xs text-slate-400">Sinh viên</span>
          </div>
          <p className="text-[11px] text-emerald-600 font-medium mt-1">Sổ đoàn điện tử đồng bộ 100%</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Tỷ lệ Thu Đoàn phí</span>
            <div className="h-8 w-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Wallet size={16} />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{statsData.feePercent}%</span>
            <span className="text-xs text-slate-400">hoàn thành</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Thu đúng hạn theo quy định</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Cảnh báo Cần hỗ trợ</span>
            <div className="h-8 w-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle size={16} />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{statsData.alertClasses}</span>
            <span className="text-xs text-slate-400">Lớp</span>
          </div>
          <p className="text-[11px] text-rose-600 font-medium mt-1">Hoạt động phong trào dưới 50%</p>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        {/* Controls Toolbar */}
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm theo tên chi đoàn, Bí thư..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:border-blue-500 transition-all"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <button
                onClick={() => setShowFilterPopup(!showFilterPopup)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 transition-colors"
              >
                <Filter size={13} />
                <span>Lọc xếp loại</span>
                {(filterStatus !== "Tất cả" || filterRank !== "Tất cả") && (
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-600"></span>
                )}
              </button>

              {showFilterPopup && (
                <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-xl z-50 p-4 space-y-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 uppercase">Trạng thái kết nối</label>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="w-full mt-1 px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg outline-none"
                    >
                      <option>Tất cả</option>
                      <option>Online</option>
                      <option>Offline</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-500 uppercase">Xếp loại Chi đoàn</label>
                    <select
                      value={filterRank}
                      onChange={(e) => setFilterRank(e.target.value)}
                      className="w-full mt-1 px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg outline-none"
                    >
                      <option>Tất cả</option>
                      <option>Vững mạnh</option>
                      <option>Khá</option>
                      <option>Trung bình</option>
                    </select>
                  </div>

                  <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                    <button
                      onClick={() => {
                        setFilterStatus("Tất cả");
                        setFilterRank("Tất cả");
                        setShowFilterPopup(false);
                      }}
                      className="px-2.5 py-1 text-xs text-slate-500 hover:text-slate-700"
                    >
                      Mặc định
                    </button>
                    <button
                      onClick={() => setShowFilterPopup(false)}
                      className="px-3 py-1 bg-blue-600 text-white rounded-md text-xs font-semibold"
                    >
                      Xong
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-semibold bg-slate-50/70">
                <th className="py-3 px-4">Tên Chi đoàn</th>
                <th className="py-3 px-4">Bí thư Chi đoàn</th>
                <th className="py-3 px-4 text-center">Sĩ số</th>
                <th className="py-3 px-4 text-center">Đoàn phí</th>
                <th className="py-3 px-4 text-center">Điểm phong trào</th>
                <th className="py-3 px-4 text-center">Xếp loại</th>
                <th className="py-3 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 text-xs">
                    Đang tải dữ liệu Chi đoàn...
                  </td>
                </tr>
              ) : paginatedClasses.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 text-xs">
                    Không tìm thấy chi đoàn nào phù hợp
                  </td>
                </tr>
              ) : (
                paginatedClasses.map((cls) => (
                  <tr key={cls.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{cls.name}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{cls.id}</div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-full bg-blue-50 text-blue-600 font-bold text-[10px] flex items-center justify-center shrink-0">
                          {cls.avatar || "BT"}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">{cls.leader || "Lê Hoàng Phúc"}</p>
                          <span className="text-[10px] text-slate-400 flex items-center gap-1">
                            <span className={`h-1.5 w-1.5 rounded-full ${cls.online ? "bg-emerald-500" : "bg-slate-300"}`}></span>
                            {cls.online ? "Đang trực tuyến" : "Ngoại tuyến"}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-center font-semibold text-slate-800">
                      {cls.total || 42} SV
                    </td>

                    <td className="py-3 px-4 text-center">
                      <span className="inline-block px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {cls.fee || 95}%
                      </span>
                    </td>

                    <td className="py-3 px-4 text-center font-bold text-blue-600">
                      {cls.activity || 90} <span className="text-slate-400 font-normal text-[10px]">pts</span>
                    </td>

                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 size={11} />
                        {cls.status || "Vững mạnh"}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="relative inline-block">
                        <button
                          onClick={() => setOpenDropdownId(openDropdownId === cls.id ? null : cls.id)}
                          className="p-1 hover:bg-slate-100 rounded-md text-slate-400 hover:text-slate-700 transition-colors"
                        >
                          <MoreVertical size={16} />
                        </button>

                        {openDropdownId === cls.id && (
                          <div className="absolute right-0 mt-1 w-36 bg-white border border-slate-200 rounded-xl shadow-lg z-50 p-1 text-left">
                            <button
                              onClick={() => handleViewMembers(cls)}
                              className="w-full px-2.5 py-1.5 text-xs text-slate-700 hover:bg-slate-50 hover:text-blue-600 rounded-md flex items-center gap-2"
                            >
                              <Users size={13} />
                              <span>Đoàn viên</span>
                            </button>
                            <button
                              onClick={() => handleEditClick(cls)}
                              className="w-full px-2.5 py-1.5 text-xs text-slate-700 hover:bg-slate-50 rounded-md flex items-center gap-2"
                            >
                              <Edit size={13} />
                              <span>Chỉnh sửa</span>
                            </button>
                            <button
                              onClick={() => handleDeleteClick(cls)}
                              className="w-full px-2.5 py-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded-md flex items-center gap-2"
                            >
                              <Trash2 size={13} />
                              <span>Xóa</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-3.5 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
            <span>Hiển thị trang {currentPage} / {totalPages} ({filteredClasses.length} chi đoàn)</span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1 rounded hover:bg-slate-100 disabled:opacity-40"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="px-2 font-semibold text-slate-800">{currentPage}</span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1 rounded hover:bg-slate-100 disabled:opacity-40"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal Thêm Chi đoàn */}
      <AddClassModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddClass}
      />

      {/* Modal Sửa Chi đoàn */}
      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Chỉnh sửa Chi đoàn" size="md">
        {selectedClass && (
          <div className="space-y-4 py-2">
            <Input
              label="Tên Chi đoàn"
              value={selectedClass.name}
              onChange={(e) => setSelectedClass({ ...selectedClass, name: e.target.value })}
            />
            <div className="grid grid-cols-2 gap-4 pt-4">
              <Button variant="outline" onClick={() => setShowEditModal(false)}>Hủy</Button>
              <Button variant="primary" onClick={saveEdit}>Lưu thay đổi</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal Xóa Chi đoàn */}
      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Xác nhận xóa" size="sm">
        {classToDelete && (
          <div className="space-y-4 py-2">
            <p className="text-xs text-slate-600">
              Bạn có chắc chắn muốn xóa chi đoàn <strong className="text-slate-900">{classToDelete.name}</strong> không? Dữ liệu liên quan có thể bị ảnh hưởng.
            </p>
            <div className="flex gap-3 pt-2">
              <Button variant="outline" className="flex-1" onClick={() => setShowDeleteModal(false)}>Hủy</Button>
              <Button variant="danger" className="flex-1" onClick={confirmDelete}>Xác nhận xóa</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal Danh sách Đoàn viên */}
      <Modal
        isOpen={showMembersModal}
        onClose={() => setShowMembersModal(false)}
        title={`Danh sách đoàn viên • ${selectedClass?.name}`}
        size="lg"
      >
        <div className="py-2 max-h-[60vh] overflow-y-auto">
          {loadingMembers ? (
            <p className="text-center text-xs text-slate-400 py-8">Đang tải danh sách đoàn viên...</p>
          ) : classMembers.length === 0 ? (
            <p className="text-center text-xs text-slate-400 py-8">Chưa có sinh viên nào trong chi đoàn này.</p>
          ) : (
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-semibold">
                  <th className="py-2.5 px-3">STT</th>
                  <th className="py-2.5 px-3">MSSV</th>
                  <th className="py-2.5 px-3">Họ và tên</th>
                  <th className="py-2.5 px-3">Chức vụ</th>
                  <th className="py-2.5 px-3 text-center">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {classMembers.map((m, idx) => (
                  <tr key={m.id || idx} className="hover:bg-slate-50/60">
                    <td className="py-2.5 px-3 font-medium text-slate-400">{idx + 1}</td>
                    <td className="py-2.5 px-3 font-mono font-semibold text-slate-800">{m.student_id || "---"}</td>
                    <td className="py-2.5 px-3 font-bold text-slate-900">{m.full_name}</td>
                    <td className="py-2.5 px-3 text-slate-600">{m.title || "Đoàn viên"}</td>
                    <td className="py-2.5 px-3 text-center">
                      <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {m.status || "Đang sinh hoạt"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Modal>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default SubAdminClasses;