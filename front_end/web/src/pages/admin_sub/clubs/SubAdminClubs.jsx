import React from 'react';

const SubAdminClubs = () => {
  return (
    <div className="p-4 md:p-8 bg-[#F8FAFC] min-h-screen space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-lg">
            <span className="material-symbols-outlined text-3xl">diversity_3</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Hệ sinh thái CLB & Đội nhóm 👥</h1>
            <p className="text-xs font-medium text-slate-400 mt-0.5">Quản lý hoạt động, nhân sự và tài chính các tổ chức trực thuộc Đoàn - Hội.</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="h-12 px-6 rounded-xl bg-blue-600 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all">
            <span className="material-symbols-outlined text-xl">add_circle</span> Thành lập CLB mới
          </button>
        </div>
      </div>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { label: 'Tổng số tổ chức', val: '05 CLB/Đội', icon: 'groups', color: 'blue' },
          { label: 'Nhân sự nòng cốt', val: '150 Thành viên', icon: 'group_work', color: 'indigo' },
          { label: 'Tổng ngân sách CLB', val: '15.000.000 VNĐ', icon: 'account_balance_wallet', color: 'emerald' },
        ].map((s, i) => (
          <div key={i} className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm flex items-center gap-6 group hover:shadow-xl transition-all">
            <div className={`h-16 w-16 rounded-2xl bg-${s.color}-50 text-${s.color}-600 flex items-center justify-center shrink-0`}>
              <span className="material-symbols-outlined text-3xl">{s.icon}</span>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{s.label}</p>
              <p className="text-2xl font-black text-slate-900 mt-1 italic tracking-tighter uppercase">{s.val}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid: Club Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Card 1: IAC */}
        <div className="bg-white border-t-4 border-blue-500 rounded-3xl p-8 shadow-sm space-y-8 relative group hover:shadow-2xl transition-all">
          <div className="flex justify-between items-start">
            <div className="h-16 w-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center">
              <span className="material-symbols-outlined text-3xl text-slate-400">precision_manufacturing</span>
            </div>
            <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase tracking-widest rounded-lg flex items-center gap-2 italic">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Rất tích cực
            </span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 leading-tight">CLB Lập trình & AI (IAC)</h3>
            <p className="text-[10px] font-bold text-slate-400 mt-1 italic">Chủ nhiệm: Trần Văn Code</p>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-slate-600">
              <span className="material-symbols-outlined text-xl opacity-40">group</span>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Thành viên: <span className="text-slate-900">80/100</span></p>
            </div>
            <div className="flex items-center gap-3 text-blue-600">
              <span className="material-symbols-outlined text-xl opacity-40">event</span>
              <p className="text-xs font-bold uppercase tracking-widest leading-none">Next: <span className="hover:underline cursor-pointer">Workshop ChatGPT</span></p>
            </div>
          </div>
          <div className="space-y-4 pt-4 border-t border-slate-50">
            <div className="space-y-2">
              <div className="flex justify-between items-end text-[9px] font-bold text-slate-400 uppercase italic"><span>Hoạt động</span><span className="text-blue-600">95%</span></div>
              <div className="h-1.5 rounded-full bg-slate-50"><div className="h-full bg-blue-500 rounded-full" style={{ width: '95%' }}></div></div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-end text-[9px] font-bold text-slate-400 uppercase italic"><span>Ngân sách</span><span className="text-emerald-500">40%</span></div>
              <div className="h-1.5 rounded-full bg-slate-50"><div className="h-full bg-emerald-500 rounded-full" style={{ width: '40%' }}></div></div>
            </div>
          </div>
          <button className="w-full h-12 bg-slate-50 border border-slate-100 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all">Quản lý</button>
        </div>

        {/* Card 2: Văn nghệ */}
        <div className="bg-white border-t-4 border-pink-500 rounded-3xl p-8 shadow-sm space-y-8 relative group hover:shadow-2xl transition-all">
          <div className="flex justify-between items-start">
            <div className="h-16 w-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center">
              <span className="material-symbols-outlined text-3xl text-slate-400">music_note</span>
            </div>
            <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-widest rounded-lg flex items-center gap-2 italic">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse"></span> Ổn định
            </span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 leading-tight">Đội Văn nghệ Xung kích</h3>
            <p className="text-[10px] font-bold text-slate-400 mt-1 italic">Đội trưởng: Lê Thị Hát</p>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-slate-600">
              <span className="material-symbols-outlined text-xl opacity-40">group</span>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Thành viên: <span className="text-slate-900">40</span></p>
            </div>
            <div className="flex items-center gap-3 text-pink-600">
              <span className="material-symbols-outlined text-xl opacity-40">event</span>
              <p className="text-xs font-bold uppercase tracking-widest leading-none">Next: <span className="hover:underline cursor-pointer">Gala Chào Tân SV</span></p>
            </div>
          </div>
          <div className="space-y-4 pt-4 border-t border-slate-50">
            <div className="space-y-2">
              <div className="flex justify-between items-end text-[9px] font-bold text-slate-400 uppercase italic"><span>Hoạt động</span><span className="text-blue-600">80%</span></div>
              <div className="h-1.5 rounded-full bg-slate-50"><div className="h-full bg-blue-500 rounded-full" style={{ width: '80%' }}></div></div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-end text-[9px] font-bold text-slate-400 uppercase italic"><span>Ngân sách</span><span className="text-rose-500">10% (Thấp)</span></div>
              <div className="h-1.5 rounded-full bg-slate-50"><div className="h-full bg-rose-500 rounded-full" style={{ width: '10%' }}></div></div>
            </div>
          </div>
          <button className="w-full h-12 bg-slate-50 border border-slate-100 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all">Quản lý</button>
        </div>

        {/* Card 3: Warning State (CTXH) */}
        <div className="bg-white border-t-4 border-amber-500 rounded-3xl p-8 shadow-sm space-y-8 relative group hover:shadow-2xl transition-all h-full flex flex-col">
          <div className="flex justify-between items-start">
            <div className="h-16 w-16 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center">
              <span className="material-symbols-outlined text-3xl text-rose-500">favorite</span>
            </div>
            <span className="px-3 py-1 bg-amber-50 text-amber-600 text-[10px] font-bold uppercase tracking-widest rounded-lg flex items-center gap-2 italic">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse"></span> Cần kích hoạt lại
            </span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 leading-tight uppercase italic tracking-tighter">Đội Công tác Xã hội (CTXH)</h3>
            <p className="text-[10px] font-bold text-slate-400 mt-2">---</p>
          </div>

          <div className="flex-1 flex flex-col justify-center">
            <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100 space-y-4 text-center">
              <span className="material-symbols-outlined text-amber-500 text-4xl">warning</span>
              <p className="text-xs font-bold text-amber-800 leading-relaxed italic">Chưa kiện toàn Ban chủ nhiệm mới</p>
              <p className="text-[10px] text-amber-600 uppercase tracking-widest font-bold">Cần tổ chức đại hội trước 30/11</p>
            </div>
          </div>

          <button className="w-full h-12 bg-amber-50 border border-amber-100 rounded-2xl text-[10px] font-bold uppercase tracking-widest text-amber-600 hover:bg-amber-600 hover:text-white transition-all mt-6">Hỗ trợ tổ chức</button>
        </div>
      </div>

      {/* Proposals Section */}
      <div className="bg-white border border-slate-100 rounded-[2.5rem] p-10 shadow-sm space-y-8">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-3 italic">
            <span className="material-symbols-outlined text-blue-600">rate_review</span> Đề xuất từ các CLB
          </h3>
          <button className="text-xs font-bold text-blue-600 underline underline-offset-4 decoration-2">Xem tất cả</button>
        </div>
        <div className="space-y-4">
          {[
            { title: 'CLB AI: Xin bảo trợ chuyên môn cho cuộc thi Hackathon', user: 'Trần Văn Code', time: '2 giờ trước', icon: 'smart_toy' },
            { title: 'Đội Văn nghệ: Xin hỗ trợ 2.000.000đ thuê âm thanh', user: 'Lê Thị Hát', time: '1 ngày trước', icon: 'music_note' },
          ].map((p, i) => (
            <div key={i} className="p-6 rounded-3xl border border-slate-50 bg-slate-50/30 flex items-center justify-between hover:bg-white hover:shadow-xl transition-all group">
              <div className="flex items-center gap-5">
                <div className="h-12 w-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400">
                  <span className="material-symbols-outlined">{p.icon}</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{p.title}</p>
                  <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">{p.user} • {p.time}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button className="h-10 px-5 rounded-xl bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-emerald-100">Duyệt</button>
                <button className="h-10 px-5 rounded-xl bg-white border border-slate-200 text-slate-400 text-[10px] font-bold uppercase tracking-widest">Chi tiết</button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <footer className="text-center pt-8 text-[11px] font-medium text-slate-400 italic">
        © 2025 Digital Youth Union System (DYUS). All rights reserved.<br />
        Module: Faculty Financial Management v2.0 - Khoa Công Nghệ Thông Tin
      </footer>
    </div>
  );
};

export default SubAdminClubs;
