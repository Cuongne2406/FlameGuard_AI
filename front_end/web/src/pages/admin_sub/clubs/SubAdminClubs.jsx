import React, { useState, useEffect, useContext } from "react";
import { 
  Sparkles, 
  Users, 
  Wallet, 
  Plus, 
  FileDown, 
  CheckCircle2, 
  Clock, 
  Building2, 
  Calendar, 
  ArrowRight, 
  Award, 
  AlertCircle,
  HelpCircle,
  Trash2,
  Edit,
  X,
  Send
} from "lucide-react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { AuthContext } from "../../../context/AuthContext";
import Toast from "../../../components/ui/Toast";
import Modal from "../../../components/ui/Modal";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import { organizationService } from "../../../services/organizationService";

const SubAdminClubs = () => {
  const { user } = useContext(AuthContext);
  const facultyName = user?.managed_org_name || "Khoa Công nghệ Thông tin";

  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [clubs, setClubs] = useState([]);
  const [clubStats, setClubStats] = useState({ totalClubs: 0, totalMembers: 0, totalBudget: 0 });
  const [proposals, setProposals] = useState([]);

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showManageModal, setShowManageModal] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [showAllProposalsModal, setShowAllProposalsModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const [selectedClub, setSelectedClub] = useState(null);
  const [selectedProposal, setSelectedProposal] = useState(null);

  const [newClub, setNewClub] = useState({
    name: "",
    leader: "",
    members: "",
    nextEvent: "",
    activity: 85,
    budget: 50
  });

  const [supportRequest, setSupportRequest] = useState({
    title: "",
    description: "",
    amount: ""
  });

  const handleAction = (msg) => setToast({ message: msg, type: "success" });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [clubsData, statsData, proposalsData] = await Promise.all([
        organizationService.getClubsDetailed(),
        organizationService.getClubsStats(),
        organizationService.getClubProposals()
      ]);
      setClubs(Array.isArray(clubsData) ? clubsData : []);
      if (statsData) setClubStats(statsData);
      setProposals(Array.isArray(proposalsData) ? proposalsData : []);
    } catch (err) {
      console.error("Failed to fetch Clubs data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateClub = async () => {
    if (!newClub.name) {
      setToast({ message: "Vui lòng nhập tên CLB", type: "error" });
      return;
    }
    try {
      const apiData = {
        name: newClub.name,
        type: "CLUB",
        description: `Chủ nhiệm: ${newClub.leader || "Chưa có"}`,
        status: "ACTIVE"
      };
      const result = await organizationService.createOrganization(apiData);
      setClubs((prev) => [...prev, result]);
      setShowCreateModal(false);
      setNewClub({ name: "", leader: "", members: "", nextEvent: "", activity: 85, budget: 50 });
      handleAction("Thành lập CLB thành công!");
      fetchData();
    } catch (err) {
      setToast({ message: "Lỗi khi thành lập CLB", type: "error" });
    }
  };

  const handleManageClub = async () => {
    if (!selectedClub) return;
    try {
      const apiData = {
        name: selectedClub.name,
        description: selectedClub.description
      };
      await organizationService.updateOrganization(selectedClub.id, apiData);
      setShowManageModal(false);
      setSelectedClub(null);
      handleAction("Cập nhật CLB thành công!");
      fetchData();
    } catch (err) {
      setToast({ message: "Lỗi khi cập nhật CLB", type: "error" });
    }
  };

  const handleDeleteClub = async () => {
    if (!selectedClub) return;
    try {
      await organizationService.deleteOrganization(selectedClub.id);
      setClubs((prev) => prev.filter((c) => c.id !== selectedClub.id));
      setShowManageModal(false);
      setSelectedClub(null);
      handleAction("Đã giải thể / xóa CLB thành công!");
    } catch (err) {
      setToast({ message: "Lỗi khi xóa CLB", type: "error" });
    }
  };

  // Submit real support request / proposal
  const handleSupportRequest = async () => {
    if (!supportRequest.title) {
      setToast({ message: "Vui lòng nhập tiêu đề đề xuất hỗ trợ", type: "error" });
      return;
    }
    try {
      const payload = {
        title: supportRequest.title,
        description: supportRequest.description,
        amount: parseFloat(supportRequest.amount) || 0,
        icon: "sparkles"
      };
      const created = await organizationService.createClubProposal(payload);
      setProposals((prev) => [created, ...prev]);
      setShowSupportModal(false);
      setSupportRequest({ title: "", description: "", amount: "" });
      handleAction("Đã gửi đề xuất hỗ trợ lên hệ thống!");
    } catch (err) {
      setToast({ message: "Lỗi khi gửi đề xuất", type: "error" });
    }
  };

  const handleApproveProposal = async (proposal) => {
    try {
      await organizationService.approveClubProposal(proposal.id);
      setProposals((prev) =>
        prev.map((p) => (p.id === proposal.id ? { ...p, status: "approved" } : p))
      );
      handleAction("Đã duyệt đề xuất hoạt động của CLB!");
    } catch (err) {
      setToast({ message: "Không thể duyệt đề xuất", type: "error" });
    }
  };

  const exportApprovedProposals = () => {
    const approved = proposals.filter((p) => p.status === "approved" || p.status === "APPROVED");
    const data = [
      ["STT", "Tiêu đề đề xuất", "Người gửi", "Thời gian", "Kinh phí", "Trạng thái"],
      ...approved.map((p, i) => [
        i + 1,
        p.title,
        p.user || "Chủ nhiệm CLB",
        p.time || "Gần đây",
        p.amount ? `${p.amount.toLocaleString()} đ` : "0 đ",
        "Đã duyệt"
      ])
    ];
    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "DeXuatCLB");
    const buffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([buffer]), `DeXuat_CLB_DaDuyet_${facultyName.replace(/\s+/g, "_")}.xlsx`);
    handleAction("Xuất Excel thành công!");
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div>
          <h2 className="text-lg md:text-xl font-bold text-slate-900">
            Hệ sinh thái Câu lạc bộ & Đội nhóm
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Quản lý hoạt động ngoại khóa, hỗ trợ kinh phí và đề xuất của các CLB trực thuộc {facultyName}
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors shadow-xs self-start md:self-auto"
        >
          <Plus size={14} />
          <span>+ Thành lập CLB mới</span>
        </button>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Tổng số CLB & Đội nhóm</span>
            <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Building2 size={16} />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{clubStats.totalClubs || clubs.length}</span>
            <span className="text-xs text-slate-400">Tổ chức</span>
          </div>
          <p className="text-[11px] text-blue-600 font-medium mt-1">Trực thuộc Đoàn - Hội Khoa</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Đoàn viên & Thành viên nòng cốt</span>
            <div className="h-8 w-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Users size={16} />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{clubStats.totalMembers || 180}</span>
            <span className="text-xs text-slate-400">Thành viên</span>
          </div>
          <p className="text-[11px] text-indigo-600 font-medium mt-1">Tham gia thường xuyên hàng tuần</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Tổng Ngân sách hỗ trợ CLB</span>
            <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Wallet size={16} />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">
              {((clubStats.totalBudget || 15000000) / 1000000).toFixed(1)}
            </span>
            <span className="text-xs text-slate-400">Triệu VNĐ</span>
          </div>
          <p className="text-[11px] text-emerald-600 font-medium mt-1">Giải ngân hoạt động phong trào</p>
        </div>
      </div>

      {/* Clubs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? (
          <div className="col-span-full py-12 text-center text-xs text-slate-400">
            Đang tải dữ liệu CLB...
          </div>
        ) : clubs.length === 0 ? (
          <div className="col-span-full py-12 text-center text-xs text-slate-400">
            Chưa có CLB nào trực thuộc Khoa. Nhấn "+ Thành lập CLB mới" để bắt đầu.
          </div>
        ) : (
          clubs.map((club) => {
            const isWarning = club.status === "warning" || club.statusText === "Cần củng cố";
            return (
              <div
                key={club.id}
                className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs hover:border-blue-300 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
                      <Sparkles size={20} />
                    </div>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        isWarning
                          ? "bg-amber-50 text-amber-700 border border-amber-200"
                          : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${isWarning ? "bg-amber-500" : "bg-emerald-500"}`}
                      ></span>
                      {club.statusText || "Hoạt động tốt"}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-900 line-clamp-1">{club.name}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Chủ nhiệm: {club.leader || "Đang cập nhật"}</p>
                  </div>

                  <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs text-slate-600">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Thành viên:</span>
                      <strong className="text-slate-800">{club.members || 35} bạn</strong>
                    </div>

                    {club.nextEvent && (
                      <div className="flex items-center justify-between text-blue-600">
                        <span className="text-slate-400">Kế hoạch tới:</span>
                        <span className="truncate max-w-[140px] font-medium">{club.nextEvent}</span>
                      </div>
                    )}

                    <div className="pt-1 space-y-1">
                      <div className="flex justify-between text-[11px] text-slate-500">
                        <span>Hoạt động: {club.activity || 85}%</span>
                        <span>Quỹ CLB: {club.budget || 50}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden flex">
                        <div
                          className="bg-blue-600 h-full"
                          style={{ width: `${club.activity || 85}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-3 border-t border-slate-100 flex items-center gap-2">
                  {isWarning ? (
                    <button
                      onClick={() => {
                        setSelectedClub(club);
                        setShowSupportModal(true);
                      }}
                      className="w-full py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 rounded-lg text-xs font-semibold transition-colors"
                    >
                      Hỗ trợ tổ chức
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setSelectedClub(club);
                        setShowManageModal(true);
                      }}
                      className="w-full py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
                    >
                      Quản lý CLB
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Proposals Section */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Award size={16} className="text-blue-600" />
              <span>Đề xuất Hoạt động & Hỗ trợ từ các CLB</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Phê duyệt kế hoạch sinh hoạt, dự trù kinh phí của các CLB trực thuộc Khoa
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={exportApprovedProposals}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
            >
              <FileDown size={13} />
              <span>Xuất đã duyệt</span>
            </button>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {proposals.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              Chưa có đề xuất nào từ các CLB
            </div>
          ) : (
            proposals.slice(0, 5).map((prop) => {
              const isApproved = prop.status === "approved" || prop.status === "APPROVED";
              return (
                <div
                  key={prop.id}
                  className="py-3 px-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/60 rounded-lg transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          isApproved
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}
                      >
                        {isApproved ? "Đã phê duyệt" : "Chờ duyệt"}
                      </span>
                      <span className="text-[11px] text-slate-400">{prop.time || "Gần đây"}</span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-800 truncate mt-1">{prop.title}</h4>
                    <p className="text-[11px] text-slate-500">
                      Gửi bởi: <strong className="text-slate-700">{prop.user || "Chủ nhiệm CLB"}</strong>
                      {prop.amount > 0 && (
                        <span> • Dự trù: {prop.amount.toLocaleString()} đ</span>
                      )}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                    {!isApproved && (
                      <button
                        onClick={() => handleApproveProposal(prop)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-colors"
                      >
                        Phê duyệt
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setSelectedProposal(prop);
                        setShowDetailModal(true);
                      }}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
                    >
                      Chi tiết
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Modal Thành lập CLB mới */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Thành lập Câu lạc bộ Mới"
        size="md"
      >
        <div className="space-y-4 py-2">
          <Input
            label="Tên CLB / Đội nhóm"
            placeholder="VD: CLB Lập trình Di động Flutter..."
            value={newClub.name}
            onChange={(e) => setNewClub({ ...newClub, name: e.target.value })}
          />
          <Input
            label="Chủ nhiệm lâm thời (Họ tên hoặc MSSV)"
            placeholder="VD: Nguyễn Văn A (21CT111)..."
            value={newClub.leader}
            onChange={(e) => setNewClub({ ...newClub, leader: e.target.value })}
          />
          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <Button variant="outline" onClick={() => setShowCreateModal(false)}>
              Hủy
            </Button>
            <Button variant="primary" onClick={handleCreateClub}>
              Tạo CLB
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal Quản lý CLB */}
      <Modal
        isOpen={showManageModal}
        onClose={() => setShowManageModal(false)}
        title={`Quản lý • ${selectedClub?.name}`}
        size="md"
      >
        {selectedClub && (
          <div className="space-y-4 py-2">
            <Input
              label="Tên CLB"
              value={selectedClub.name}
              onChange={(e) => setSelectedClub({ ...selectedClub, name: e.target.value })}
            />
            <div className="flex justify-between items-center pt-3 border-t border-slate-100">
              <Button variant="danger" onClick={handleDeleteClub}>
                Giải thể CLB
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setShowManageModal(false)}>
                  Đóng
                </Button>
                <Button variant="primary" onClick={handleManageClub}>
                  Lưu thay đổi
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal Gửi đề xuất hỗ trợ */}
      <Modal
        isOpen={showSupportModal}
        onClose={() => setShowSupportModal(false)}
        title={`Đề xuất Hỗ trợ • ${selectedClub?.name}`}
        size="md"
      >
        <div className="space-y-4 py-2">
          <Input
            label="Tiêu đề đề xuất hỗ trợ"
            placeholder="VD: Hỗ trợ kinh phí tổ chức cuộc thi Hackathon Khoa..."
            value={supportRequest.title}
            onChange={(e) => setSupportRequest({ ...supportRequest, title: e.target.value })}
          />
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Mô tả chi tiết</label>
            <textarea
              rows={3}
              placeholder="Nội dung cần Đoàn Khoa hỗ trợ (địa điểm, kinh phí, cố vấn)..."
              value={supportRequest.description}
              onChange={(e) => setSupportRequest({ ...supportRequest, description: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg outline-none focus:border-blue-500"
            />
          </div>
          <Input
            label="Kinh phí dự trù (VNĐ nếu có)"
            placeholder="VD: 2000000"
            type="number"
            value={supportRequest.amount}
            onChange={(e) => setSupportRequest({ ...supportRequest, amount: e.target.value })}
          />
          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <Button variant="outline" onClick={() => setShowSupportModal(false)}>
              Hủy
            </Button>
            <Button variant="primary" onClick={handleSupportRequest}>
              Gửi đề xuất
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal Chi tiết đề xuất */}
      <Modal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title="Chi tiết Đề xuất CLB"
        size="md"
      >
        {selectedProposal && (
          <div className="space-y-3 py-2 text-xs">
            <div>
              <span className="text-slate-400">Tiêu đề:</span>
              <p className="font-bold text-slate-900 text-sm mt-0.5">{selectedProposal.title}</p>
            </div>
            <div>
              <span className="text-slate-400">Người gửi:</span>
              <p className="font-medium text-slate-800">{selectedProposal.user || "Chủ nhiệm CLB"}</p>
            </div>
            {selectedProposal.description && (
              <div>
                <span className="text-slate-400">Nội dung chi tiết:</span>
                <p className="p-3 bg-slate-50 rounded-lg text-slate-700 mt-1 whitespace-pre-wrap">
                  {selectedProposal.description}
                </p>
              </div>
            )}
            <div className="flex justify-end pt-3 border-t border-slate-100">
              <Button variant="outline" onClick={() => setShowDetailModal(false)}>
                Đóng
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default SubAdminClubs;