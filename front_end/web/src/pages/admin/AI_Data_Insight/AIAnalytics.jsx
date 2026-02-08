import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AIAnalytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Gọi API Backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await fetch("http://127.0.0.1:8000/api/v1/ai/dashboard-stats", {
            headers: { "Authorization": `Bearer ${token}` }
        });
        if (response.ok) {
            setData(await response.json());
        }
      } catch (error) {
        console.error("Lỗi AI Analysis:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Dữ liệu giả lập cho Biểu đồ (Vì Backend hiện tại chưa trả về Time-series)
  const chartData = [
    { name: 'Tuần 1', thamGia: 40 },
    { name: 'Tuần 2', thamGia: 30 },
    { name: 'Tuần 3', thamGia: 68 },
    { name: 'Tuần 4', thamGia: 50 },
    { name: 'Hiện tại', thamGia: 75 },
    { name: 'Dự báo', thamGia: 90 }, // Điểm dự báo của AI
  ];

  if (loading) return (
    <div className="flex h-full items-center justify-center bg-[#F4F7FA] dark:bg-slate-900">
        <div className="flex flex-col items-center gap-3">
            <span className="material-symbols-outlined text-4xl text-blue-600 animate-spin">smart_toy</span>
            <p className="text-slate-500 font-medium">AI đang phân tích dữ liệu...</p>
        </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-[#F4F7FA] dark:bg-slate-900 p-8 overflow-y-auto custom-scrollbar">
      <div className="max-w-[1280px] mx-auto w-full flex flex-col gap-8">
        
        {/* --- HEADER --- */}
        <div>
            <h2 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-600 text-3xl">psychology</span>
                Trung Tâm Phân Tích AI
            </h2>
            <p className="text-slate-500 mt-1">Dữ liệu thời gian thực & Dự đoán xu hướng hành vi sinh viên</p>
        </div>

        {/* --- OVERVIEW CARDS --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatsCard 
                title="Tổng Sinh Viên" 
                value={data?.overview?.total_students} 
                icon="groups" 
                trend="+5%" 
                color="blue"
            />
            <StatsCard 
                title="Đang Hoạt Động (Active)" 
                value={data?.overview?.active_now} 
                icon="check_circle" 
                subtext="Trong 30 ngày qua"
                color="green"
            />
            <StatsCard 
                title="Tỷ Lệ Tương Tác" 
                value={`${data?.overview?.engagement_rate}%`} 
                icon="ssid_chart" 
                color={data?.overview?.engagement_rate < 50 ? "orange" : "purple"}
            />
        </div>

        {/* --- MAIN SECTION: CHART & PREDICTION --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* LEFT: CHART (Chiếm 2 phần) */}
            <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                        <span className="material-symbols-outlined text-slate-400">monitoring</span>
                        Xu hướng tham gia & Dự báo
                    </h3>
                    <div className="flex gap-4 text-xs font-bold">
                        <span className="flex items-center gap-1 text-blue-600"><div className="w-2 h-2 rounded-full bg-blue-500"></div> Thực tế</span>
                        <span className="flex items-center gap-1 text-cyan-500"><div className="w-2 h-2 rounded-full bg-cyan-400"></div> Dự báo AI</span>
                    </div>
                </div>
                
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                            <Tooltip 
                                contentStyle={{backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                                itemStyle={{color: '#1e293b', fontWeight: 'bold'}}
                            />
                            <Area type="monotone" dataKey="thamGia" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorPv)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* RIGHT: AI PREDICTION BOX (Chiếm 1 phần) */}
            <div className="bg-gradient-to-br from-indigo-600 to-blue-500 rounded-2xl p-6 text-white shadow-xl shadow-blue-500/20 relative overflow-hidden flex flex-col justify-between">
                {/* Background Decor */}
                <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-[150px] opacity-10">smart_toy</span>
                
                <div>
                    <div className="flex items-center gap-2 mb-4 opacity-90">
                        <span className="material-symbols-outlined text-xl animate-pulse">online_prediction</span>
                        <span className="text-sm font-bold uppercase tracking-wider">Dự báo sự kiện tới</span>
                    </div>
                    <h3 className="text-2xl font-bold leading-snug mb-2 line-clamp-2">
                        {data?.prediction?.event_name}
                    </h3>
                    <p className="text-blue-100 text-sm">Dựa trên lịch sử dữ liệu và các yếu tố thời gian.</p>
                </div>

                <div className="mt-8 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <p className="text-xs font-medium text-blue-100 uppercase mb-1">Số lượng tham gia dự kiến</p>
                    <div className="flex items-end gap-2">
                        <span className="text-4xl font-black">{data?.prediction?.predicted_attendance}</span>
                        <span className="text-sm mb-1 opacity-80">sinh viên</span>
                    </div>
                    <div className="mt-2 text-xs flex items-center gap-1 text-green-300 font-bold bg-green-500/20 w-fit px-2 py-0.5 rounded">
                        <span className="material-symbols-outlined text-[14px]">check</span>
                        Độ tin cậy: {data?.prediction?.confidence_score}
                    </div>
                </div>
            </div>
        </div>

        {/* --- BOTTOM: AI INSIGHTS --- */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-blue-100 dark:border-slate-700 overflow-hidden">
            <div className="bg-blue-50/50 dark:bg-slate-900/50 p-4 border-b border-blue-100 dark:border-slate-700 flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-600">tips_and_updates</span>
                <h3 className="font-bold text-slate-800 dark:text-white">Đề xuất hành động từ AI</h3>
                <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ml-2">Mới nhất</span>
            </div>
            
            <div className="divide-y divide-slate-100 dark:divide-slate-700">
                {data?.insights?.map((insight, index) => (
                    <div key={index} className="p-4 flex gap-4 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                        <div className={`mt-1 size-8 rounded-full flex items-center justify-center shrink-0 ${
                            insight.type === 'warning' ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'
                        }`}>
                            <span className="material-symbols-outlined text-lg">
                                {insight.type === 'warning' ? 'priority_high' : 'thumb_up'}
                            </span>
                        </div>
                        <div>
                            <p className="text-slate-800 dark:text-white text-sm font-medium leading-relaxed">
                                {insight.message}
                            </p>
                            <p className="text-slate-400 text-xs mt-1">Phân tích lúc {new Date().toLocaleTimeString()}</p>
                        </div>
                        {insight.type === 'warning' && (
                            <button className="ml-auto text-xs font-bold bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-50 shadow-sm h-fit">
                                Xử lý ngay
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>

      </div>
    </div>
  );
};

// --- Sub Component: Stats Card ---
const StatsCard = ({ title, value, icon, trend, subtext, color }) => {
    const colors = {
        blue: "text-blue-600 bg-blue-50",
        green: "text-green-600 bg-green-50",
        orange: "text-orange-600 bg-orange-50",
        purple: "text-purple-600 bg-purple-50"
    };

    return (
        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">{title}</p>
                    <h4 className="text-2xl font-black text-slate-800 dark:text-white">{value}</h4>
                </div>
                <div className={`p-2 rounded-lg ${colors[color]}`}>
                    <span className="material-symbols-outlined text-xl">{icon}</span>
                </div>
            </div>
            {(trend || subtext) && (
                <div className="mt-4 flex items-center gap-2 text-xs">
                    {trend && <span className="text-green-600 font-bold bg-green-50 px-1.5 py-0.5 rounded">{trend}</span>}
                    {subtext && <span className="text-slate-400">{subtext}</span>}
                </div>
            )}
        </div>
    );
};

export default AIAnalytics;