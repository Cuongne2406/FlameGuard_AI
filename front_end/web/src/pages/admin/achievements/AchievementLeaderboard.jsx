import React from 'react';

const AchievementLeaderboard = () => {
  // Mock Data: Top 3 Cá Nhân (Podium)
  const topStudents = [
    {
      rank: 2,
      name: "Trần Thị B",
      class: "11B2",
      points: "4,800",
      avatar: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAy5o8gTdFU87NlRG7hrqNCg84jMZ3VnuFH4kJuW_HVR3ZeK5SSEVrh4RYEryJUPrXadUzSUywIJkT62w0WfIz8ZC36DIkvSSn81sOepwYCVxa_7nh9F8aWNN6hiUrHiM1vfOMhFCGeKtnFDZZqIZX9cTNXsEX6S1KBpAlc-vd3JK4ss-3jWOWRLkEGpU9nYq0kQAp0exX4G13-HJ51AVuw60-xs1F0uXfCyym9_5fds27b7Nbm5DfXtVBfYEnD65d3xT2ZL5vEg2WJ')",
      color: "border-silver",
      badgeColor: "bg-silver",
      badges: [{ icon: "volunteer_activism", label: "Hiến Máu", color: "text-red-600 bg-red-50" }]
    },
    {
      rank: 1,
      name: "Nguyễn Văn A",
      class: "12A1",
      points: "5,000",
      avatar: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAdzkThZ_lL3larp59OKjcPN68jQmDAqzICHKas2NUSJZAo71BDCHUfXInOLNTbNDzUJT4LeJ_-nIvKuaVvay8fpLwTfpTj6fwIZdhZRmOwm_J5UHAHj_CfEsL_DroOEuIU6dy8TXqiaQKbCWKs9x_Wvtahu3gzzyJrJnxD6u7N1O95Ki7pjnSkaqMw9-PhS8Yx-tSvKL2d4Blsbm4CGuN4F8UjpF23oKWPXAK-xbxQPG7L62ka_rsHtD6D2JMOvN3hb5x-dqjJDDbX')",
      color: "border-accent", // Gold
      badgeColor: "bg-accent",
      badges: [
        { icon: "eco", label: "Mùa Hè Xanh", color: "text-blue-700 bg-blue-50" },
        { icon: "stars", label: "Sinh Viên 5 Tốt", color: "text-amber-700 bg-amber-50" }
      ]
    },
    {
      rank: 3,
      name: "Lê Văn C",
      class: "10C3",
      points: "4,500",
      avatar: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuD-tZWHaVEFcvg_B3Hi8_LdGk86ycJWnnb7h1gJngf0idq-mfYNjfB69vXGKxN339RTcjvXSl_zG1NYfuj6cSTM2W724_8ki8kU3K0kAlIpKH6ojfoo8GRfQLSwaVQg0JuplN8KEdP5vjpKP2dTnBebMrHXH8u5SH-955oaYFBv1158W4RwdtagW7sf8iOHP_-sJuI41Tu2l13c-958BlXShLb5-u02R9AUlSDIu3isihadT6MXLIpYL2J7o6x9BBEjfxpJGYzr892n')",
      color: "border-bronze",
      badgeColor: "bg-bronze",
      badges: [{ icon: "school", label: "Học Tập Tốt", color: "text-purple-600 bg-purple-50" }]
    }
  ];

  // Mock Data: Bảng Xếp Hạng Tập Thể
  const classRankings = [
    {
      rank: 1,
      name: "Chi Đoàn 12A1",
      faculty: "Khoa CNTT",
      points: "12,500",
      trend: "up", // up, down, neutral
      trendVal: "+12%",
      badges: [
        { icon: "volunteer_activism", color: "bg-red-100 text-red-600" },
        { icon: "forest", color: "bg-green-100 text-green-600" },
        { text: "+2", color: "bg-slate-100 text-slate-600" }
      ],
      avatarColor: "bg-blue-100 text-blue-600"
    },
    {
      rank: 2,
      name: "Chi Đoàn 11B2",
      faculty: "Khoa Ngôn Ngữ Anh",
      points: "11,200",
      trend: "down",
      trendVal: "-2%",
      badges: [
        { icon: "rocket_launch", color: "bg-amber-100 text-amber-600" }
      ],
      avatarColor: "bg-purple-100 text-purple-600"
    },
    {
      rank: 3,
      name: "Chi Đoàn 10C3",
      faculty: "Khoa Tài Chính",
      points: "10,800",
      trend: "neutral",
      trendVal: "0%",
      badges: [
        { icon: "school", color: "bg-blue-100 text-blue-600" },
        { icon: "palette", color: "bg-pink-100 text-pink-600" }
      ],
      avatarColor: "bg-cyan-100 text-cyan-600"
    },
    {
      rank: 4,
      name: "Chi Đoàn 12A2",
      faculty: "Khoa Kỹ Thuật",
      points: "9,450",
      trend: "up",
      trendVal: "+5%",
      badges: [
        { icon: "memory", color: "bg-indigo-100 text-indigo-600" }
      ],
      avatarColor: "bg-orange-100 text-orange-600"
    },
    {
      rank: 5,
      name: "Chi Đoàn 11D1",
      faculty: "Khoa Dược",
      points: "8,920",
      trend: "up",
      trendVal: "+2%",
      badges: [
        { icon: "ecg_heart", color: "bg-emerald-100 text-emerald-600" }
      ],
      avatarColor: "bg-teal-100 text-teal-600"
    }
  ];

  return (
    <div className="flex flex-col h-full bg-[#f8fafc] dark:bg-background-dark overflow-y-auto custom-scrollbar">
      
      {/* --- HERO SECTION (PODIUM) --- */}
      <div className="relative bg-gradient-to-b from-primary/5 to-[#f8fafc] dark:to-background-dark pb-12 pt-10 px-4 md:px-10">
        <div className="max-w-[1200px] mx-auto">
          {/* Page Heading */}
          <div className="mb-10 text-center">
            <h1 className="text-3xl md:text-5xl font-black leading-tight tracking-tight mb-3 uppercase text-primary dark:text-primary-light">
              Bảng Xếp Hạng Thi Đua
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-lg font-normal max-w-2xl mx-auto">
              Vinh danh các cá nhân và tập thể xuất sắc trong Học kỳ I, năm học 2024-2025.
            </p>
          </div>

          {/* Podium Grid */}
          <div className="flex flex-col md:flex-row items-end justify-center gap-6 md:gap-8 pb-8">
            {/* Chúng ta map thủ công để chỉnh order hiển thị: 2 - 1 - 3 */}
            <PodiumCard student={topStudents[0]} order="order-2 md:order-1" />
            <PodiumCard student={topStudents[1]} order="order-1 md:order-2" isChampion />
            <PodiumCard student={topStudents[2]} order="order-3" />
          </div>
        </div>
      </div>

      {/* --- TABLE SECTION --- */}
      <div className="flex-1 px-4 md:px-10 pb-10">
        <div className="max-w-[1200px] mx-auto flex flex-col">
          
          {/* Header & Search */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <h2 className="text-slate-900 dark:text-white tracking-tight text-2xl font-bold">Xếp Hạng Chi Đoàn</h2>
            <div className="w-full md:w-96">
              <div className="flex w-full items-center rounded-xl h-11 shadow-sm bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                <div className="text-slate-400 flex items-center justify-center pl-4 pr-2">
                  <span className="material-symbols-outlined">search</span>
                </div>
                <input 
                  className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 h-full" 
                  placeholder="Tìm kiếm tên lớp hoặc sinh viên..." 
                />
              </div>
            </div>
          </div>

          {/* Main Table */}
          <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1e293b] shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                    <Th className="text-center w-20">Hạng</Th>
                    <Th>Tên Chi Đoàn</Th>
                    <Th>Tổng Điểm</Th>
                    <Th>Xu Hướng</Th>
                    <Th>Thành Tích Nổi Bật</Th>
                    <Th className="text-right">Thao Tác</Th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {classRankings.map((item) => (
                    <tr key={item.rank} className="hover:bg-blue-50/30 dark:hover:bg-slate-700/30 transition-colors group cursor-pointer">
                      <td className="py-4 px-6 text-center">
                        <RankBadge rank={item.rank} />
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className={`size-10 rounded-full flex items-center justify-center font-bold text-sm ${item.avatarColor}`}>
                            {item.name.split(" ").pop()}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white">{item.name}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{item.faculty}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-bold text-slate-900 dark:text-white text-lg">{item.points}</span>
                      </td>
                      <td className="py-4 px-6">
                        <TrendBadge type={item.trend} value={item.trendVal} />
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex -space-x-2 overflow-hidden">
                          {item.badges.map((badge, idx) => (
                            <div key={idx} className={`inline-flex items-center justify-center size-8 rounded-full ring-2 ring-white dark:ring-[#1e293b] ${badge.color}`} title="Achievement">
                              {badge.icon ? <span className="material-symbols-outlined text-[16px]">{badge.icon}</span> : <span className="text-xs font-bold">{badge.text}</span>}
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button className="text-primary hover:bg-primary/10 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors">Xem Chi Tiết</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination Footer */}
            <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 px-6 py-3">
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Hiển thị 1-5 trên 24 Lớp</p>
              <div className="flex gap-2">
                <button className="rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-600 disabled:opacity-50">Trước</button>
                <button className="rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-600">Sau</button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

// --- Sub Components ---

const PodiumCard = ({ student, order, isChampion }) => {
  const heightClass = isChampion ? "w-full md:w-80 z-10 md:-mb-6 md:pb-12 shadow-xl" : "w-full md:w-72 shadow-lg";
  const rankSize = isChampion ? "size-32 border-4" : "size-24 border-2";
  const pointsSize = isChampion ? "text-3xl text-accent" : "text-xl text-primary";
  const titleSize = isChampion ? "text-xl text-slate-900 dark:text-white" : "text-lg text-slate-800 dark:text-slate-200";

  return (
    <div className={`flex flex-col items-center rounded-2xl bg-white dark:bg-[#1e293b] p-6 border-t-4 ${student.color} relative transition-transform hover:-translate-y-1 ${order} ${heightClass}`}>
      {isChampion && (
        <div className="absolute -top-8 left-1/2 -translate-x-1/2">
          <span className="material-symbols-outlined text-6xl text-accent drop-shadow-sm">emoji_events</span>
        </div>
      )}
      
      {!isChampion && (
        <div className={`absolute -top-5 flex size-10 items-center justify-center rounded-full ${student.badgeColor} text-white font-bold text-lg border-4 border-white dark:border-[#1e293b] shadow-sm`}>
          {student.rank}
        </div>
      )}

      <div className={`mb-4 ${isChampion ? 'mt-6' : ''} p-1 rounded-full border-dashed ${student.color}`}>
        <div className={`${rankSize} bg-center bg-no-repeat bg-cover rounded-full ${student.color}`} style={{ backgroundImage: student.avatar }}></div>
      </div>
      
      <h3 className={`${titleSize} font-bold`}>{student.name}</h3>
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{student.class}</p>
      
      <div className={`mt-2 flex items-center gap-1 font-black ${pointsSize}`}>
        <span>{student.points}</span>
        <span className="text-xs font-normal text-slate-400 uppercase pt-1">pts</span>
      </div>

      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {student.badges.map((badge, idx) => (
          <span key={idx} className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${badge.color}`}>
            <span className="material-symbols-outlined text-[14px]">{badge.icon}</span> {badge.label}
          </span>
        ))}
      </div>
    </div>
  );
};

const Th = ({ children, className = "" }) => (
  <th className={`py-4 px-6 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 ${className}`}>
    {children}
  </th>
);

const RankBadge = ({ rank }) => {
  if (rank === 1) return <div className="inline-flex size-8 items-center justify-center rounded-full bg-accent/10 text-accent font-bold">1</div>;
  if (rank === 2) return <div className="inline-flex size-8 items-center justify-center rounded-full bg-slate-100 text-slate-600 font-bold dark:bg-slate-700 dark:text-slate-300">2</div>;
  if (rank === 3) return <div className="inline-flex size-8 items-center justify-center rounded-full bg-slate-100 text-slate-600 font-bold dark:bg-slate-700 dark:text-slate-300">3</div>;
  return <div className="inline-flex size-8 items-center justify-center rounded-full bg-slate-50 text-slate-400 font-medium dark:bg-slate-800/50">{rank}</div>;
};

const TrendBadge = ({ type, value }) => {
  if (type === 'up') return (
    <div className="flex items-center gap-1 text-green-600 bg-green-50 dark:bg-green-900/30 dark:text-green-400 px-2 py-1 rounded-md w-fit text-xs font-medium">
      <span className="material-symbols-outlined text-[16px]">trending_up</span> {value}
    </div>
  );
  if (type === 'down') return (
    <div className="flex items-center gap-1 text-red-600 bg-red-50 dark:bg-red-900/30 dark:text-red-400 px-2 py-1 rounded-md w-fit text-xs font-medium">
      <span className="material-symbols-outlined text-[16px]">trending_down</span> {value}
    </div>
  );
  return (
    <div className="flex items-center gap-1 text-slate-500 bg-slate-100 dark:bg-slate-700 dark:text-slate-300 px-2 py-1 rounded-md w-fit text-xs font-medium">
      <span className="material-symbols-outlined text-[16px]">remove</span> {value}
    </div>
  );
};

export default AchievementLeaderboard;