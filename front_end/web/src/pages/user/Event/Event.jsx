import React, { useContext, useEffect, useMemo, useState } from "react";
import {
  Bell,
  Calendar,
  CheckCircle2,
  ChevronRight,
  MapPin,
  QrCode,
  Search,
  Sparkles,
  Star,
  Trophy,
  Users,
  X,
} from "lucide-react";
import { AuthContext } from "../../../context/AuthContext";
import { eventService } from "../../../services/eventService";

const filters = ["Tất cả", "Sắp diễn ra", "Đang diễn ra", "Đã kết thúc"];

const getStatusLabel = (status) => {
  switch (status) {
    case "LIVE":
      return "Đang diễn ra";
    case "ENDED":
      return "Đã kết thúc";
    case "PUBLISHED":
      return "Mở đăng ký";
    default:
      return "Sắp diễn ra";
  }
};

const EventModal = ({ event, onClose, onRegister, user }) => {
  if (!event) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose} />
      <div className="app-card relative z-10 flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden">
        <div className="app-hero relative h-64 px-8 pb-8 pt-8">
          <button
            onClick={onClose}
            className="absolute right-6 top-6 rounded-full bg-white/16 p-2 text-white"
          >
            <X size={18} />
          </button>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_28%)]" />
          <div className="relative flex h-full flex-col justify-end">
            <span className="inline-flex w-fit rounded-full bg-white/18 px-3 py-1 text-[11px] font-black text-white">
              {getStatusLabel(event.status)}
            </span>
            <h3 className="mt-4 text-3xl font-black text-white">{event.name}</h3>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/82">
              {event.description || "Sự kiện đang được cập nhật thêm nội dung chi tiết."}
            </p>
          </div>
        </div>

        <div className="grid gap-6 overflow-y-auto p-6 md:grid-cols-4">
          <div className="app-card-muted p-4 text-center">
            <Calendar size={18} className="mx-auto text-indigo-600" />
            <p className="mt-3 text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
              Thời gian
            </p>
            <p className="mt-2 text-sm font-black text-slate-800">
              {event.start_time ? new Date(event.start_time).toLocaleDateString("vi-VN") : "Chưa cập nhật"}
            </p>
          </div>
          <div className="app-card-muted p-4 text-center">
            <MapPin size={18} className="mx-auto text-emerald-500" />
            <p className="mt-3 text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
              Địa điểm
            </p>
            <p className="mt-2 text-sm font-black text-slate-800">
              {event.location || "Chưa cập nhật"}
            </p>
          </div>
          <div className="app-card-muted p-4 text-center">
            <Users size={18} className="mx-auto text-amber-500" />
            <p className="mt-3 text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
              Sức chứa
            </p>
            <p className="mt-2 text-sm font-black text-slate-800">
              {event.capacity || "Không giới hạn"}
            </p>
          </div>
          <div className="app-card-muted p-4 text-center">
            <Trophy size={18} className="mx-auto text-rose-500" />
            <p className="mt-3 text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
              Quyền lợi
            </p>
            <p className="mt-2 text-sm font-black text-slate-800">+ Điểm rèn luyện</p>
          </div>
        </div>

        <div className="border-t border-slate-100 bg-slate-50 p-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="text-sm text-slate-500">
              Sinh viên: <span className="font-bold text-slate-800">{user?.full_name || "Chưa đăng nhập"}</span>
            </div>
            <button
              onClick={() => onRegister(event)}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-indigo-600 px-6 py-3 text-sm font-black text-white shadow-[0_14px_24px_rgba(79,70,229,0.22)]"
            >
              Đăng ký ngay
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Event = () => {
  const { user } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [myEvents, setMyEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("Tất cả");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [allEventsList, myEventsList] = await Promise.all([
          eventService.getEvents(),
          eventService.getUserEvents(),
        ]);
        setEvents(Array.isArray(allEventsList) ? allEventsList : []);
        setMyEvents(Array.isArray(myEventsList) ? myEventsList : []);
      } catch (error) {
        console.error("Failed to load events", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredEvents = useMemo(() => {
    let source = events;

    if (activeFilter !== "Tất cả") {
      source = source.filter((event) => getStatusLabel(event.status) === activeFilter);
    }

    if (!searchQuery.trim()) return source;

    const query = searchQuery.toLowerCase();
    return source.filter((event) => {
      const name = (event.name || "").toLowerCase();
      const location = (event.location || "").toLowerCase();
      const description = (event.description || "").toLowerCase();
      return name.includes(query) || location.includes(query) || description.includes(query);
    });
  }, [activeFilter, events, searchQuery]);

  const handleRegister = async (event) => {
    if (!user || !event) return;

    try {
      await eventService.registerForEvent(event.id, user.id);
      setFeedbackMessage(`Đăng ký thành công cho "${event.name}".`);
      setSelectedEvent(null);
    } catch (error) {
      setFeedbackMessage(error.message || "Đăng ký thất bại. Vui lòng thử lại.");
    }
  };

  return (
    <div className="space-y-6">
      <EventModal
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
        onRegister={handleRegister}
        user={user}
      />

      <section className="app-card overflow-hidden">
        <div className="app-hero relative px-5 pb-8 pt-6 md:px-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.22),transparent_28%)]" />
          <div className="relative grid gap-5 lg:grid-cols-[1.35fr_0.9fr]">
            <div>
              <div className="inline-flex rounded-full bg-white/18 px-3 py-1 text-[11px] font-black text-white">
                KHÁM PHÁ SỰ KIỆN
              </div>
              <h2 className="mt-4 text-3xl font-black tracking-tight text-white md:text-4xl">
                Hoạt động & Sự kiện
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/82">
                Web user đang bám theo app: ưu tiên tìm kiếm nhanh, phân nhóm rõ ràng và cho phép vào sự kiện ngay từ màn chính.
              </p>

              <div className="mt-6 rounded-[26px] bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.08)]">
                <div className="flex items-center gap-3 rounded-[20px] border border-slate-100 bg-slate-50 px-4 py-3">
                  <Search size={18} className="text-slate-400" />
                  <input
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Tìm sự kiện, địa điểm, hoạt động..."
                    className="w-full bg-transparent text-sm font-medium text-slate-700 outline-none placeholder:text-slate-400"
                  />
                </div>

                <div className="mt-4 flex flex-wrap gap-3">
                  {filters.map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setActiveFilter(filter)}
                      className={filter === activeFilter ? "app-chip app-chip-active" : "app-chip"}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="app-gradient-panel flex flex-col justify-between gap-4 px-5 py-5 text-white">
              <div>
                <div className="inline-flex rounded-full bg-white/18 px-3 py-1 text-[11px] font-black">
                  CHECK-IN NHANH
                </div>
                <h3 className="mt-3 text-2xl font-black">Vé điện tử & QR</h3>
                <p className="mt-2 text-sm leading-6 text-white/84">
                  Khi sự kiện bắt đầu, người dùng có thể mở mã QR nhanh để check-in giống app mobile.
                </p>
              </div>
              <div className="inline-flex w-fit items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-black text-indigo-600">
                <QrCode size={18} />
                Sẵn sàng check-in
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 p-5 lg:grid-cols-[1.35fr_0.8fr] md:p-6">
          <div>
            <div className="mb-5 flex items-center gap-2">
              <Sparkles size={18} className="text-amber-500" />
              <h3 className="app-section-title">Danh sách sự kiện</h3>
            </div>

            {feedbackMessage && (
              <div className="mb-4 rounded-[20px] border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
                {feedbackMessage}
              </div>
            )}

            {loading ? (
              <div className="grid gap-4 md:grid-cols-2">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="app-card h-72 animate-pulse" />
                ))}
              </div>
            ) : filteredEvents.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {filteredEvents.map((event) => (
                  <article key={event.id} className="app-card overflow-hidden">
                    <div className="app-hero relative h-44 px-5 py-5">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_30%)]" />
                      <div className="relative flex h-full flex-col justify-between">
                        <div className="flex items-center justify-between gap-3">
                          <span className="inline-flex rounded-full bg-white/18 px-3 py-1 text-[11px] font-black text-white">
                            {getStatusLabel(event.status)}
                          </span>
                          {event.status === "ENDED" ? (
                            <CheckCircle2 size={18} className="text-white/90" />
                          ) : (
                            <Star size={18} className="text-white/90" />
                          )}
                        </div>
                        <div>
                          <h4 className="text-xl font-black leading-7 text-white">{event.name}</h4>
                          <p className="mt-2 line-clamp-2 text-sm leading-6 text-white/82">
                            {event.description || "Sự kiện đang được cập nhật thêm mô tả."}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4 p-5">
                      <div className="flex flex-wrap gap-3">
                        <span className="app-chip">
                          <Calendar size={14} />
                          {event.start_time
                            ? new Date(event.start_time).toLocaleDateString("vi-VN")
                            : "Chưa cập nhật"}
                        </span>
                        <span className="app-chip">
                          <Users size={14} />
                          {event.capacity || "Không giới hạn"}
                        </span>
                      </div>

                      <p className="flex items-center gap-2 text-sm font-medium text-slate-500">
                        <MapPin size={14} />
                        {event.location || "Địa điểm sẽ cập nhật sau"}
                      </p>

                      <button
                        onClick={() => setSelectedEvent(event)}
                        className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-5 py-3 text-sm font-black text-white shadow-[0_14px_24px_rgba(79,70,229,0.22)]"
                      >
                        Xem chi tiết
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="app-card p-10 text-center text-sm font-medium text-slate-500">
                Không có sự kiện nào phù hợp với bộ lọc hiện tại.
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="app-card p-6">
              <div className="flex items-center gap-2">
                <Bell size={18} className="text-rose-500" />
                <h3 className="text-lg font-black text-slate-800">Sự kiện của tôi</h3>
              </div>

              <div className="mt-5 space-y-3">
                {myEvents.length > 0 ? (
                  myEvents.slice(0, 5).map((event) => (
                    <div key={event.id} className="app-card-muted p-4">
                      <p className="text-sm font-black text-slate-800">{event.name || event.title}</p>
                      <p className="mt-1 text-xs font-medium text-slate-500">
                        {event.start_time
                          ? new Date(event.start_time).toLocaleString("vi-VN")
                          : "Thời gian sẽ cập nhật"}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="app-card-muted p-5 text-sm text-slate-500">
                    Bạn chưa có sự kiện nào trong danh sách tham gia.
                  </div>
                )}
              </div>
            </div>

            <div className="app-card p-6">
              <div className="flex items-center gap-2">
                <Trophy size={18} className="text-amber-500" />
                <h3 className="text-lg font-black text-slate-800">Gợi ý từ hệ thống</h3>
              </div>
              <p className="mt-4 text-sm leading-7 text-slate-500">
                Ưu tiên các sự kiện đang mở đăng ký hoặc sắp bắt đầu để giữ nhịp tham gia liên tục và tăng điểm rèn luyện.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Event;
