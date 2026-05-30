import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Flag,
  Sparkles,
  Calendar,
} from "lucide-react";
import { campaignService } from "../../../services/campaignService";
import { eventService } from "../../../services/eventService";

const CalendarView = ({ onSelectCampaign }) => {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchCalendarData = async () => {
      try {
        const [campsData, eventsData] = await Promise.all([
          campaignService.getCampaigns(),
          eventService.getEvents()
        ]);
        setCampaigns(campsData);
        
        const mappedCamps = campsData.map(camp => {
           const startDate = camp.start_date ? new Date(camp.start_date) : null;
           return {
              id: camp.id,
              day: startDate ? startDate.getDate() : null,
              month: startDate ? startDate.getMonth() : null,
              year: startDate ? startDate.getFullYear() : null,
              title: camp.name,
              isCampaign: true,
              color: camp.unit.includes("CNTT") ? "bg-orange-500" : 
                     camp.unit.includes("Xây dựng") ? "bg-emerald-500" : "bg-blue-600"
           };
        }).filter(e => e.day !== null);

        const mappedEvts = (eventsData || []).map(evt => {
           const startTime = evt.start_time ? new Date(evt.start_time) : null;
           return {
              id: evt.id,
              day: startTime ? startTime.getDate() : null,
              month: startTime ? startTime.getMonth() : null,
              year: startTime ? startTime.getFullYear() : null,
              title: evt.name,
              isCampaign: false,
              color: "bg-purple-600"
           };
        }).filter(e => e.day !== null);

        setEvents([...mappedCamps, ...mappedEvts]);
      } catch (error) {
        console.error("Failed to fetch calendar data:", error);
      }
    };
    fetchCalendarData();
  }, []);

  const monthNames = ["Tháng 01", "Tháng 02", "Tháng 03", "Tháng 04", "Tháng 05", "Tháng 06", "Tháng 07", "Tháng 08", "Tháng 09", "Tháng 10", "Tháng 11", "Tháng 12"];
  const currentMonthName = monthNames[currentDate.getMonth()];
  const currentYear = currentDate.getFullYear();

  // Logic tính toán ngày trong tháng
  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => {
    const day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1; // Chuyển về Mon-Sun (0-6)
  };

  const daysInMonth = getDaysInMonth(currentYear, currentDate.getMonth());
  const firstDay = getFirstDayOfMonth(currentYear, currentDate.getMonth());
  
  const calendarDays = [];
  for (let i = 0; i < firstDay; i++) calendarDays.push(null);
  for (let i = 1; i <= daysInMonth; i++) calendarDays.push(i);

  const rows = [];
  for (let i = 0; i < calendarDays.length; i += 7) {
    rows.push(calendarDays.slice(i, i + 7));
  }

  return (
    <div className="flex gap-6 h-full animate-in fade-in duration-500">
      <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="flex bg-slate-100 p-0.5 rounded-lg">
              <button className="px-3 py-1 text-[11px] font-bold bg-white shadow-sm rounded-md">Tháng</button>
              <button className="px-3 py-1 text-[11px] font-bold text-slate-400">Tuần</button>
              <button className="px-3 py-1 text-[11px] font-bold text-slate-400">Ngày</button>
            </div>
            <div className="flex items-center gap-1 border border-slate-200 rounded-lg p-1">
              <button className="p-1 hover:bg-slate-50 rounded" onClick={() => setCurrentDate(new Date(currentYear, currentDate.getMonth() - 1, 1))}>
                <ChevronLeft size={14} />
              </button>
              <button className="px-2 py-1 text-[10px] font-bold uppercase" onClick={() => setCurrentDate(new Date())}>Today</button>
              <button className="p-1 hover:bg-slate-50 rounded" onClick={() => setCurrentDate(new Date(currentYear, currentDate.getMonth() + 1, 1))}>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
          <h3 className="text-lg font-black text-slate-800 tracking-tight">{currentMonthName}, {currentYear}</h3>
          <button 
            onClick={() => navigate("/admin/campaigns/calendar/create-event")}
            className="flex items-center gap-2 bg-[#0061D5] text-white px-4 py-2 rounded-lg text-xs font-bold shadow-lg shadow-blue-100 active:scale-95 transition-all"
          >
            <Plus size={16} /> Tạo sự kiện
          </button>
        </div>

        <div className="flex-1 overflow-auto">
          <table className="w-full h-full border-collapse table-fixed">
            <thead>
              <tr className="bg-slate-50/50">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                  <th key={day} className="py-3 border-r border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase">{day}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((week, rowIndex) => (
                <tr key={rowIndex} className="min-h-28">
                  {week.map((dayNum, colIndex) => (
                    <td key={colIndex} className="border-r border-slate-100 p-2 relative align-top hover:bg-slate-50/30 transition-colors h-28">
                      {dayNum && (
                        <>
                          <span className="text-xs font-bold text-slate-400">{dayNum}</span>
                          <div className="mt-1 space-y-1">
                            {events.filter(e => e.day === dayNum && e.month === currentDate.getMonth() && e.year === currentYear).map((evt, i) => (
                               <EventTag 
                                 key={i} 
                                 color={evt.color} 
                                 title={evt.title} 
                                 icon={evt.isCampaign ? <Flag size={10} fill="white" /> : <Calendar size={10} />} 
                                 onClick={() => {
                                    if (evt.isCampaign) {
                                      navigate(`/admin/campaigns/details/${evt.id}`);
                                    } else {
                                      navigate(`/admin/campaigns/calendar/details/${evt.id}`);
                                    }
                                  }}
                               />
                            ))}
                          </div>
                        </>
                      )}
                    </td>
                  ))}
                  {week.length < 7 && Array.from({ length: 7 - week.length }).map((_, i) => (
                    <td key={`empty-${i}`} className="border-r border-slate-100 p-2"></td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="w-80 space-y-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 border-b pb-2">CHỦ GIẢI & PHÂN LOẠI</h4>
          <div className="space-y-3">
            <LegendItem color="bg-blue-600" label="Cấp Trường (Chiến dịch)" />
            <LegendItem color="bg-emerald-500" label="Khoa Xây dựng (Chiến dịch)" />
            <LegendItem color="bg-orange-500" label="Khoa CNTT (Chiến dịch)" />
            <LegendItem color="bg-purple-600" label="Sự kiện Chi tiết (Events)" />
          </div>
        </div>

        {/* AI Density Suggestion */}
        <div className="bg-blue-50/50 rounded-2xl border border-blue-100 p-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3 opacity-10"><Sparkles size={40} /></div>
          <h4 className="flex items-center gap-2 text-[11px] font-bold text-blue-700 mb-2"><Sparkles size={14} /> Mật độ sự kiện</h4>
          <p className="text-[11px] text-blue-600 leading-relaxed font-medium">
            Có {events.filter(e => e.month === currentDate.getMonth()).length} chiến dịch diễn ra trong tháng này. Hãy chú ý điều phối nhân sự.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 border-b pb-2">SẮP DIỄN RA</h4>
          <div className="space-y-5">
            {campaigns.length === 0 ? (
               <div className="text-[11px] text-slate-400 italic">Chưa có sự kiện nào.</div>
            ) : (
                campaigns.slice(0, 3).map((camp) => (
                   <UpcomingEvent 
                      key={camp.id} 
                      date={camp.start_date ? new Date(camp.start_date).getDate() : "?"} 
                      month={camp.start_date ? new Date(camp.start_date).toLocaleDateString("vi-VN", { month: "short" }).toUpperCase() : "?"} 
                      title={camp.name} 
                      time={camp.time} 
                      onClick={() => navigate(`/admin/campaigns/details/${camp.id}`)}
                    />
                ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const EventTag = ({ color, title, icon, onClick }) => (
  <div 
    onClick={onClick}
    className={`${color} text-white p-1 rounded flex items-center gap-1 text-[9px] font-bold shadow-sm truncate cursor-pointer hover:scale-[1.02] active:scale-95 transition-all`}
  >
    {icon} <span className="truncate">{title}</span>
  </div>
);

const LegendItem = ({ color, label }) => (
  <div className="flex items-center gap-3">
    <div className={`w-3 h-3 rounded-full ${color}`}></div>
    <span className="text-[11px] font-bold text-slate-600">{label}</span>
  </div>
);

const UpcomingEvent = ({ date, month, title, time, onClick }) => (
  <div onClick={onClick} className="flex items-start gap-4 group cursor-pointer">
    <div className="text-center border-r border-slate-100 pr-4 min-w-[50px]">
      <div className="text-[9px] font-bold text-slate-400 uppercase">{month}</div>
      <div className="text-xl font-black text-slate-800">{date}</div>
    </div>
    <div className="flex-1 min-w-0">
      <h5 className="text-[11px] font-bold text-slate-700 group-hover:text-blue-600 transition-colors leading-tight mb-1 truncate">{title}</h5>
      <p className="text-[10px] text-slate-400 font-medium truncate">{time}</p>
    </div>
  </div>
);

export default CalendarView;
