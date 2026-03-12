import React, { useState, useEffect } from "react";
import { Calendar, MapPin, Users } from "lucide-react";
import { publicService } from "../../services/publicService";

const ActivityCard = ({ title, date, location, status, participants, image_url }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all">
    <div className="h-40 bg-slate-200 relative">
      <img
        src={image_url || "https://images.unsplash.com/photo-1540317580384-e5d43867caa6?auto=format&fit=crop&q=80"}
        className="w-full h-full object-cover"
        alt={title}
      />
      <span
        className={`absolute top-3 right-3 px-3 py-1 rounded-full text-[10px] font-bold text-white ${status === "Sắp diễn ra" ? "bg-green-500" : "bg-blue-500"}`}
      >
        {status}
      </span>
    </div>
    <div className="p-5">
      <h3 className="font-bold text-gray-800 leading-tight mb-3 line-clamp-2">
        {title}
      </h3>
      <div className="space-y-2 text-xs text-gray-500">
        <div className="flex items-center gap-2">
          <Calendar size={14} /> {date}
        </div>
        <div className="flex items-center gap-2">
          <MapPin size={14} /> {location}
        </div>
        <div className="flex items-center gap-2">
          <Users size={14} /> {participants} đoàn viên dự kiến
        </div>
      </div>
      <button className="w-full mt-4 py-2 bg-blue-50 text-blue-600 rounded-xl font-bold text-xs hover:bg-blue-600 hover:text-white transition-all">
        Đăng ký ngay
      </button>
    </div>
  </div>
);

const Activities = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const data = await publicService.getActivities();
        setActivities(data);
      } catch (error) {
        console.error("Failed to fetch activities:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchActivities();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-black text-gray-900 mb-2 uppercase italic">
        Hoạt động sắp tới
      </h1>
      <p className="text-gray-500 mb-8">
        Nơi tổng hợp các phong trào, sự kiện dành cho Đoàn viên sinh viên.
      </p>

      {loading ? (
        <div className="text-center py-10 text-slate-500 font-bold">Đang tải dữ liệu...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {activities.length > 0 ? (
            activities.map((activity) => (
              <ActivityCard
                key={activity.id}
                title={activity.title}
                date={activity.date}
                location={activity.location}
                status={activity.status}
                participants={activity.participants}
                image_url={activity.image_url}
              />
            ))
          ) : (
            <div className="col-span-full py-10 text-center text-slate-500 italic">
              Không có hoạt động nào.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
export default Activities;