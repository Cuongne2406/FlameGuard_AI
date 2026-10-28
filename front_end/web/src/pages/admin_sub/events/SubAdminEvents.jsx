import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Calendar, 
  Users, 
  Wallet, 
  Plus, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  Radio, 
  BarChart2, 
  QrCode, 
  CheckSquare, 
  FileText, 
  ChevronRight, 
  Edit, 
  Building2,
  Sparkles,
  MapPin
} from "lucide-react";
import { AuthContext } from "../../../context/AuthContext";
import Toast from "../../../components/ui/Toast";
import CreateEvent from "../../../components/common/CreateEvent";
import EditEvent from "../../../components/common/EditEvent";
import { eventService } from "../../../services/eventService";

const SubAdminEvents = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const facultyName = user?.managed_org_name || "Khoa Công nghệ Thông tin";

  const [toast, setToast] = useState(null);
  const [activeTab, setActiveTab] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [statsData, setStatsData] = useState({
    totalEvents: "0",
    totalParticipants: "0",
    totalBudget: "0"
  });

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const data = await eventService.getEvents();
      const mappedEvents = Array.isArray(data)
        ? data.map((ev) => ({
            id: ev.id,
            title: ev.name,
            name: ev.name,
            time: ev.start_time
              ? new Date(ev.start_time).toLocaleDateString("vi-VN", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit"
                })
              : "Chưa cập nhật",
            location: ev.location || "Hội trường Lạc Hồng",
            type: ev.event_type || "Sự kiện Cấp Khoa",
            status: ev.status,
            attendees: `${ev.current_participants || ev.participant_count || 0}/${ev.capacity || 100}`,
            registered_count: ev.current_participants || ev.participant_count || 0
          }))
        : [];

      setEvents(mappedEvents);

      const statsRes = await eventService.getEventStats();
      if (statsRes) {
        setStatsData({
          totalEvents: statsRes.totalEvents || mappedEvents.length.toString(),
          totalParticipants: statsRes.totalParticipants || "480",
          totalBudget: statsRes.totalBudget || "12,500,000"
        });
      }
    } catch (err) {
      console.error("Failed to fetch events:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const filteredEvents = events.filter((ev) => {
    const matchesSearch =
      ev.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.location?.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeTab === "ALL") return matchesSearch;
    if (activeTab === "LIVE") {
      return matchesSearch && (ev.status === "LIVE" || ev.status === "HAPPENING");
    }
    if (activeTab === "UPCOMING") {
      return matchesSearch && (ev.status === "PUBLISHED" || ev.status === "DRAFT" || ev.status === "UPCOMING");
    }
    if (activeTab === "COMPLETED") {
      return matchesSearch && ev.status === "COMPLETED";
    }
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div>
          <h2 className="text-lg md:text-xl font-bold text-slate-900">
            Quản lý Sự kiện & Phong trào {facultyName}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Điều hành chiến dịch, tổ chức điểm danh QR Code, tích lũy điểm rèn luyện và khảo sát ý kiến
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors shadow-xs self-start md:self-auto"
        >
          <Plus size={14} />
          <span>+ Tạo Sự kiện Mới</span>
        </button>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Tổng sự kiện Khoa tổ chức</span>
            <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Calendar size={16} />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{statsData.totalEvents}</span>
            <span className="text-xs text-slate-400">hoạt động</span>
          </div>
          <p className="text-[11px] text-blue-600 font-medium mt-1">Gắn kết chiến dịch cấp Trường</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Lượt Đoàn viên check-in</span>
            <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Users size={16} />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{statsData.totalParticipants}</span>
            <span className="text-xs text-slate-400">lượt tham gia</span>
          </div>
          <p className="text-[11px] text-emerald-600 font-medium mt-1">+5 Điểm rèn luyện / sự kiện</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Kinh phí Sự kiện Giải ngân</span>
            <div className="h-8 w-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Wallet size={16} />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{statsData.totalBudget}</span>
            <span className="text-xs text-slate-400">VNĐ</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Theo dự toán ngân sách đã duyệt</p>
        </div>
      </div>

      {/* Main List Container */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        {/* Toolbar & Filter Tabs */}
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {[
              { id: "ALL", label: "Tất cả" },
              { id: "LIVE", label: "Đang diễn ra (Live)" },
              { id: "UPCOMING", label: "Sắp tới" },
              { id: "COMPLETED", label: "Đã hoàn thành" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? "bg-blue-600 text-white shadow-xs"
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm theo tên sự kiện, địa điểm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:border-blue-500"
            />
          </div>
        </div>

        {/* Events Grid / Cards */}
        <div className="p-5">
          {loading ? (
            <div className="py-12 text-center text-xs text-slate-400">Đang tải danh sách sự kiện...</div>
          ) : filteredEvents.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              Không có sự kiện nào trong danh mục này
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredEvents.map((ev) => {
                const isLive = ev.status === "LIVE" || ev.status === "HAPPENING";
                const isCompleted = ev.status === "COMPLETED";
                return (
                  <div
                    key={ev.id}
                    className="border border-slate-200 rounded-xl p-4 hover:border-blue-300 transition-all flex flex-col justify-between space-y-3 bg-white"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            isLive
                              ? "bg-rose-50 text-rose-600 border border-rose-200"
                              : isCompleted
                              ? "bg-slate-100 text-slate-600 border border-slate-200"
                              : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          }`}
                        >
                          {isLive && <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse"></span>}
                          {isLive ? "Đang diễn ra (Live)" : isCompleted ? "Đã kết thúc" : "Đang mở đăng ký"}
                        </span>

                        <span className="text-[11px] text-slate-400 flex items-center gap-1">
                          <Clock size={12} />
                          {ev.time}
                        </span>
                      </div>

                      <h3 className="text-sm font-bold text-slate-900 line-clamp-1">{ev.title}</h3>

                      <p className="text-xs text-slate-500 flex items-center gap-1.5">
                        <MapPin size={13} className="text-slate-400 shrink-0" />
                        <span className="truncate">{ev.location}</span>
                      </p>

                      <div className="text-xs text-slate-600 flex items-center justify-between pt-1">
                        <span>Đã đăng ký: <strong className="text-slate-900">{ev.attendees}</strong> sinh viên</span>
                        <span className="text-[11px] text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded">
                          +5 Điểm rèn luyện
                        </span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => navigate(`/admin_sub/events/${ev.id}/checkin`)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold transition-colors"
                      >
                        <QrCode size={13} />
                        <span>Điểm danh</span>
                      </button>

                      <button
                        onClick={() => navigate(`/admin_sub/events/${ev.id}/live`)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
                      >
                        <BarChart2 size={13} />
                        <span>Live Monitor</span>
                      </button>

                      <button
                        onClick={() => navigate(`/admin_sub/events/${ev.id}/approvals`)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
                      >
                        <CheckSquare size={13} />
                        <span>Duyệt DS ({ev.registered_count})</span>
                      </button>

                      {isCompleted && (
                        <button
                          onClick={() => navigate(`/admin_sub/events/${ev.id}/feedback`)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg text-xs font-semibold transition-colors ml-auto"
                        >
                          <FileText size={13} />
                          <span>Tổng kết AI</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Modal Tạo sự kiện */}
      {showCreateModal && (
        <CreateEvent
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            fetchEvents();
            setToast({ message: "✅ Tạo sự kiện Khoa thành công!", type: "success" });
          }}
        />
      )}

      {/* Modal Chỉnh sửa */}
      {showEditModal && selectedEvent && (
        <EditEvent
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          eventData={selectedEvent}
          onSuccess={() => {
            fetchEvents();
            setToast({ message: "✅ Cập nhật sự kiện thành công!", type: "success" });
          }}
        />
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default SubAdminEvents;