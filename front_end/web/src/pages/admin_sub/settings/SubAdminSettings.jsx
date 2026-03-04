import React, { useState } from 'react';
import Toast from '../../../components/ui/Toast';
import Toggle from '../../../components/ui/Toggle';

const SubAdminSettings = () => {
  const [toast, setToast] = useState(null);
  const [toggles, setToggles] = useState({
    twoFactor: true,
    emailAlert: true,
    zaloAlert: true,
    dailyDigest: false,
  });

  // Modals state
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [signatureTab, setSignatureTab] = useState('draw');
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const devices = [
    { id: 1, name: 'MacBook Pro', location: 'Ho Chi Minh City', browser: 'Chrome', ip: '192.168.1.1', status: 'Current', color: 'emerald' },
    { id: 2, name: 'iPhone 15', location: 'Dong Nai', browser: 'Safari Mobile', time: '2 hours ago', icon: 'smartphone' },
  ];

  const team = [
    { id: 1, name: 'Nguyễn Văn A', role: 'Phó Bí thư', permissions: { events: true, finance: false, posts: true }, initial: 'VA' },
  ];

  const searchResults = [
    { id: 'TB', name: 'Trần Thị B', mssv: '23CT113', role: 'Phó Bí thư Đoàn Khoa', initial: 'TB', color: 'rose' },
    { id: 'LC', name: 'Lê Văn C', mssv: '22CT111', role: 'Ủy viên BTV', initial: 'LC', color: 'blue' },
  ];

  const handleToggle = (key) => {
    setToggles(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleAction = (msg) => {
    setToast({ message: msg, type: 'success' });
  };

  const handleSignatureContinue = () => {
    setShowSignatureModal(false);
    setShowSecurityModal(true);
  };

  const handleAddMemberContinue = () => {
    if (!selectedMember) {
      setToast({ message: 'Vui lòng chọn một thành viên', type: 'error' });
      return;
    }
    setShowAddMemberModal(false);
    setShowPermissionsModal(true);
  };

  return (
    <div className="p-4 md:p-8 bg-[#F8FAFC] min-h-screen space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <nav className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
            <span className="material-symbols-outlined text-[14px]">home</span>
            <span>Tổng quan</span>
            <span>/</span>
            <span className="text-blue-600 underline">Cài đặt & Hồ sơ</span>
          </nav>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Thiết lập Tài khoản & Cấu hình Khoa</h1>
        </div>
        <div className="h-10 w-10 border border-slate-200 rounded-xl bg-white flex items-center justify-center relative cursor-pointer">
          <span className="material-symbols-outlined text-slate-400">notifications</span>
          <span className="absolute top-2 right-2.5 h-2 w-2 rounded-full bg-rose-500 border-2 border-white"></span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column */}
        <div className="lg:col-span-4 space-y-8">
          {/* Profile Card */}
          <div className="bg-white border border-slate-100 rounded-[2rem] p-10 shadow-sm space-y-8 text-center relative overflow-hidden">
            <div className="relative inline-block">
              <div className="h-32 w-32 rounded-full bg-blue-500 flex items-center justify-center text-white text-4xl font-black italic shadow-2xl mx-auto ring-8 ring-blue-50">
                LH
              </div>
              <button className="absolute bottom-0 right-0 h-10 w-10 bg-white rounded-full shadow-lg border border-slate-100 flex items-center justify-center text-slate-400 hover:text-blue-600 transition-all">
                <span className="material-symbols-outlined text-xl">edit</span>
              </button>
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Lê Trọng Phúc Hậu</h3>
              <div className="mt-3 px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest inline-block border border-blue-100 italic">
                Bí thư Đoàn Khoa
              </div>
            </div>

            <div className="space-y-6 pt-6 text-left border-t border-slate-50">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email (Verified)</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-3 text-slate-300">mail</span>
                  <input type="text" defaultValue="hau.ltp@lhu.edu.vn" className="w-full h-12 pl-12 pr-10 rounded-xl border border-slate-100 bg-slate-50/50 text-sm font-bold text-slate-700 outline-none" />
                  <span className="material-symbols-outlined absolute right-4 top-3 text-emerald-500">check_circle</span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Số điện thoại</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-3 text-slate-300">call</span>
                  <input type="text" defaultValue="0909 123 456" className="w-full h-12 pl-12 pr-4 rounded-xl border border-slate-100 bg-slate-50/50 text-sm font-bold text-slate-700 outline-none" />
                </div>
              </div>
            </div>
          </div>

          {/* E-Signature */}
          <div className="bg-white border border-slate-100 rounded-[2rem] p-10 shadow-sm space-y-6">
            <div className="flex items-center gap-3 text-blue-600 border-b border-slate-50 pb-4">
              <span className="material-symbols-outlined font-black">edit_square</span>
              <h3 className="text-xs font-black uppercase tracking-widest italic">Chữ ký số (E-Signature)</h3>
            </div>
            <div className="h-32 rounded-2xl border-2 border-dashed border-slate-100 bg-slate-50/50 flex items-center justify-center p-6 grayscale opacity-80 group hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer">
              <div className="p-4 bg-white/80 rounded-xl shadow-sm border border-slate-100">
                <img src="https://img.freepik.com/free-vector/hand-drawn-signature-collection_23-2148408933.jpg" alt="Signature" className="h-16 w-32 object-contain mix-blend-multiply" />
              </div>
            </div>
            <p className="text-[10px] font-medium text-slate-400 leading-relaxed italic">Chữ ký này sẽ được áp dụng lên các văn bản và phiếu chi điện tử.</p>
            <button onClick={() => setShowSignatureModal(true)} className="w-full h-12 rounded-xl bg-white border border-slate-200 text-slate-900 text-[10px] font-black uppercase tracking-widest shadow-sm hover:bg-slate-900 hover:text-white transition-all flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-sm font-black">draw</span> Cập nhật Chữ ký
            </button>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-8 space-y-8">
          {/* Account Security */}
          <div className="bg-white border border-slate-100 rounded-[2rem] p-10 shadow-sm space-y-8">
            <div className="flex items-center gap-3 text-blue-600">
              <span className="material-symbols-outlined font-black">security</span>
              <h3 className="text-sm font-black uppercase tracking-widest italic">Account Security</h3>
            </div>

            <div className="space-y-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-700">Mật khẩu</p>
                  <p className="text-xs font-medium text-slate-300 mt-1 tracking-[0.3em]">•••••••••••••••••</p>
                </div>
                <button className="text-xs font-black text-blue-600 uppercase hover:underline">Đổi mật khẩu</button>
              </div>

              <div className="flex items-center justify-between p-6 rounded-2xl bg-slate-50/50 border border-slate-50 transition-all hover:bg-white hover:shadow-xl hover:border-blue-100 group">
                <div className="space-y-1">
                  <p className="text-sm font-bold text-slate-900 italic uppercase">Xác thực 2 lớp (2FA)</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tăng cường bảo mật cho tài khoản của bạn</p>
                </div>
                <Toggle enabled={toggles.twoFactor} onToggle={() => handleToggle('twoFactor')} />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    Thiết bị đang đăng nhập
                  </p>
                  <button className="text-[10px] font-black text-rose-500 uppercase tracking-widest hover:underline">Đăng xuất tất cả</button>
                </div>
                <div className="space-y-3">
                  {devices.map(d => (
                    <div key={d.id} className="p-4 rounded-xl border border-slate-50 bg-white flex items-center justify-between group hover:shadow-lg transition-all">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all">
                          <span className="material-symbols-outlined">{d.icon || 'laptop_mac'}</span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-bold text-slate-700">{d.name}</p>
                            {d.status && <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-600 text-[8px] font-black uppercase rounded tracking-widest">{d.status}</span>}
                          </div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5 italic">{d.location} • {d.browser} • {d.ip || d.time}</p>
                        </div>
                      </div>
                      {!d.status && <button className="h-8 w-8 text-slate-300 hover:text-rose-500 transition-colors"><span className="material-symbols-outlined text-lg">logout</span></button>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="bg-white border border-slate-100 rounded-[2rem] p-10 shadow-sm space-y-8">
            <div className="flex items-center gap-3 text-blue-600">
              <span className="material-symbols-outlined font-black">notifications_active</span>
              <h3 className="text-sm font-black uppercase tracking-widest italic">Notification Settings</h3>
            </div>

            <div className="space-y-6">
              {[
                { key: 'emailAlert', title: 'Email Alert', desc: 'Nhận thông báo khi có yêu cầu rút tiền mới' },
                { key: 'zaloAlert', title: 'Zalo Alert', desc: 'Nhắc nhở lịch họp qua Zalo OA' },
                { key: 'dailyDigest', title: 'Daily Digest', desc: 'Tổng hợp hoạt động trong ngày gửi vào 8:00 PM' },
              ].map(n => (
                <div key={n.key} className="flex items-center justify-between p-4 bg-white">
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-slate-900">{n.title}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">{n.desc}</p>
                  </div>
                  <Toggle enabled={toggles[n.key]} onToggle={() => handleToggle(n.key)} />
                </div>
              ))}
            </div>
          </div>

          {/* Permissions Table (Ban Thường vụ) */}
          <div className="bg-white border border-slate-100 rounded-[2rem] p-10 shadow-sm space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-slate-800">
                <span className="material-symbols-outlined font-black">group_add</span>
                <h3 className="text-sm font-black uppercase tracking-widest italic">Phân quyền Ban Thường vụ</h3>
              </div>
              <button onClick={() => setShowAddMemberModal(true)} className="text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-2 hover:underline">
                <span className="material-symbols-outlined text-lg">add</span> Thêm người
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Thành viên</th>
                    <th className="px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Duyệt sự kiện</th>
                    <th className="px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Duyệt tài chính</th>
                    <th className="px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Đăng bài viết</th>
                    <th className="px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {team.map(m => (
                    <tr key={m.id} className="group hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-6">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-black text-[10px] border border-blue-100 shadow-inner italic">{m.initial}</div>
                          <div>
                            <p className="text-sm font-black text-slate-900 italic tracking-tight uppercase">{m.name}</p>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{m.role}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-6 text-center">
                        <input type="checkbox" checked={m.permissions.events} readOnly className="h-5 w-5 rounded-lg border-2 border-slate-200 text-blue-600 focus:ring-blue-500/20 transition-all cursor-pointer" />
                      </td>
                      <td className="px-4 py-6 text-center">
                        <input type="checkbox" checked={m.permissions.finance} readOnly className="h-5 w-5 rounded-lg border-2 border-slate-200 text-blue-600 focus:ring-blue-500/20 transition-all cursor-pointer" />
                      </td>
                      <td className="px-4 py-6 text-center">
                        <input type="checkbox" checked={m.permissions.posts} readOnly className="h-5 w-5 rounded-lg border-2 border-slate-200 text-blue-600 focus:ring-blue-500/20 transition-all cursor-pointer" />
                      </td>
                      <td className="px-4 py-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className="h-8 w-8 rounded-lg bg-white border border-slate-100 text-slate-400 hover:text-blue-600 transition-all shadow-sm">
                            <span className="material-symbols-outlined text-sm">edit</span>
                          </button>
                          <button className="h-8 w-8 rounded-lg bg-white border border-slate-100 text-slate-400 hover:text-rose-600 transition-all shadow-sm">
                            <span className="material-symbols-outlined text-sm">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Update Signature */}
      {showSignatureModal && (
        <div className="fixed inset-[-10px] z-[70] overflow-y-auto bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="min-h-full flex items-center justify-center p-4">
            <div className="bg-white rounded-[2.5rem] w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-100">
              <div className="px-10 py-8 border-b border-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-3 text-slate-900">
                  <span className="material-symbols-outlined text-blue-600">draw</span>
                  <h3 className="text-xl font-bold tracking-tight">Cập nhật Mẫu Chữ ký số</h3>
                </div>
                <button onClick={() => setShowSignatureModal(false)} className="h-10 w-10 flex items-center justify-center text-slate-300 hover:text-rose-500 transition-colors">
                  <span className="material-symbols-outlined text-2xl">close</span>
                </button>
              </div>

              <div className="p-10 space-y-8">
                <p className="text-sm font-medium text-slate-500 leading-relaxed italic">Vui lòng vẽ chữ ký của bạn vào khung bên dưới. Chữ ký này sẽ được sử dụng để xác thực các văn bản điện tử.</p>

                <div className="flex gap-10 border-b border-slate-100">
                  <button onClick={() => setSignatureTab('draw')} className={`pb-4 text-[11px] font-black uppercase tracking-widest transition-all relative flex items-center gap-2 ${signatureTab === 'draw' ? 'text-blue-600' : 'text-slate-400'}`}>
                    <span className="material-symbols-outlined text-lg">brush</span> Vẽ trực tiếp
                    {signatureTab === 'draw' && <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-600 rounded-t-full"></div>}
                  </button>
                  <button onClick={() => setSignatureTab('upload')} className={`pb-4 text-[11px] font-black uppercase tracking-widest transition-all relative flex items-center gap-2 ${signatureTab === 'upload' ? 'text-blue-600' : 'text-slate-400'}`}>
                    <span className="material-symbols-outlined text-lg">upload_file</span> Tải lên ảnh
                    {signatureTab === 'upload' && <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-600 rounded-t-full"></div>}
                  </button>
                </div>

                {signatureTab === 'draw' ? (
                  <div className="space-y-6">
                    <div className="h-64 rounded-[2rem] border-2 border-slate-100 bg-slate-50/50 flex flex-col items-center justify-center relative overflow-hidden group">
                      <div className="absolute top-4 right-4 flex gap-2">
                        <button className="h-10 w-10 flex items-center justify-center bg-white rounded-xl shadow-sm border border-blue-100 text-blue-600"><span className="material-symbols-outlined text-lg">edit</span></button>
                        <button className="h-10 w-10 flex items-center justify-center bg-white rounded-xl shadow-sm border border-slate-100 text-slate-400 hover:text-blue-600"><span className="material-symbols-outlined text-lg">ink_eraser</span></button>
                        <button className="h-10 w-10 flex items-center justify-center bg-white rounded-xl shadow-sm border border-slate-100 text-slate-400 hover:text-blue-600"><span className="material-symbols-outlined text-lg">undo</span></button>
                        <button className="h-10 w-10 flex items-center justify-center bg-white rounded-xl shadow-sm border border-slate-100 text-slate-400 hover:text-rose-500"><span className="material-symbols-outlined text-lg">delete</span></button>
                      </div>
                      <img src="https://img.freepik.com/free-vector/hand-drawn-signature-collection_23-2148408933.jpg" alt="Signature preview" className="h-32 opacity-80 mix-blend-multiply" />
                      <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-slate-300 uppercase tracking-widest">DYUS Secure Sign v2.0</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="h-64 rounded-[2rem] border-2 border-dashed border-slate-100 bg-slate-50/50 flex flex-col items-center justify-center group hover:bg-slate-100/50 transition-all cursor-pointer">
                      <div className="h-16 w-16 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-300 group-hover:text-blue-600 group-hover:scale-110 transition-all">
                        <span className="material-symbols-outlined text-3xl">upload</span>
                      </div>
                      <p className="text-sm font-bold text-slate-700 mt-4"><span className="text-blue-600">Bấm để chọn</span> hoặc kéo thả ảnh</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">PNG, JPG (Tối đa 2MB)</p>
                    </div>
                    <div className="p-4 rounded-xl border border-slate-100 bg-white flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                          <span className="material-symbols-outlined text-lg">image</span>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-700">signature_scan.png</p>
                          <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mt-0.5 flex items-center gap-1"><span className="material-symbols-outlined text-[12px]">check</span> Đã tải lên thành công</p>
                        </div>
                      </div>
                      <button className="h-8 w-8 flex items-center justify-center text-slate-300 hover:text-rose-500"><span className="material-symbols-outlined text-lg">delete</span></button>
                    </div>
                    <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-50 flex items-start gap-4">
                      <span className="material-symbols-outlined text-blue-500">info</span>
                      <p className="text-[11px] font-bold text-blue-600 leading-relaxed italic">Hệ thống sẽ tự động tách nền trắng để chữ ký hiển thị tốt nhất trên văn bản.</p>
                    </div>
                  </div>
                )}

                <div className="flex gap-4 pt-4 border-t border-slate-50">
                  <button onClick={() => setShowSignatureModal(false)} className="flex-1 h-14 rounded-2xl bg-slate-50 text-slate-900 text-[11px] font-black uppercase tracking-widest hover:bg-slate-100">Hủy bỏ</button>
                  <button onClick={handleSignatureContinue} className="flex-1 h-14 rounded-2xl bg-blue-600 text-white text-[11px] font-black uppercase tracking-widest shadow-xl shadow-blue-100 hover:bg-blue-700 flex items-center justify-center gap-2">
                    Tiếp tục & Lưu <span className="material-symbols-outlined text-xl">arrow_forward</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Security Verification */}
      {showSecurityModal && (
        <div className="fixed inset-[-10px] z-[80] overflow-y-auto bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="min-h-full flex items-center justify-center p-4">
            <div className="bg-white rounded-[2.5rem] w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-100">
              <div className="px-10 py-8 border-b border-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-3 text-slate-900">
                  <span className="material-symbols-outlined text-indigo-500">verified_user</span>
                  <h3 className="text-lg font-bold tracking-tight">Xác thực Bảo mật</h3>
                </div>
                <button onClick={() => setShowSecurityModal(false)} className="h-10 w-10 flex items-center justify-center text-slate-300 hover:text-rose-500 transition-colors">
                  <span className="material-symbols-outlined text-2xl">close</span>
                </button>
              </div>

              <div className="p-10 space-y-8 text-center">
                <div className="p-8 rounded-[2rem] bg-indigo-50 flex items-start gap-4 text-left">
                  <span className="material-symbols-outlined text-indigo-600 bg-white h-10 w-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm">lock</span>
                  <p className="text-xs font-bold text-slate-600 leading-relaxed italic">Vì lý do an toàn, vui lòng xác nhận danh tính trước khi thay đổi Chữ ký số.</p>
                </div>

                <div className="space-y-3 text-left">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mật khẩu quản trị</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-4 text-slate-300">vpn_key</span>
                    <input type="password" placeholder="••••••••••••" className="w-full h-14 pl-12 pr-4 rounded-xl border border-slate-100 bg-slate-50/50 text-sm font-bold text-slate-700 focus:bg-white transition-all outline-none" />
                  </div>
                  <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-2 mt-2 hover:underline">
                    <span className="material-symbols-outlined text-lg">chat_bubble</span> Gửi mã OTP qua Zalo
                  </button>
                </div>

                <div className="flex gap-4 pt-4 border-t border-slate-50">
                  <button onClick={() => setShowSecurityModal(false)} className="flex-1 h-14 rounded-2xl bg-slate-50 text-slate-900 text-[11px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all">Hủy bỏ</button>
                  <button onClick={() => { setShowSecurityModal(false); handleAction('Chữ ký số đã được cập nhật!'); }} className="flex-1 h-14 rounded-2xl bg-emerald-500 text-white text-[11px] font-black uppercase tracking-widest shadow-xl shadow-emerald-100 hover:bg-emerald-600 flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined">check_circle</span> Xác nhận & Cập nhật
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add Member to team */}
      {showAddMemberModal && (
        <div className="fixed inset-[-10px] z-[70] overflow-y-auto bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="min-h-full flex items-center justify-center p-4">
            <div className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-100">
              <div className="px-10 py-8 border-b border-slate-50 flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">Thêm Thành viên vào Ban Thường vụ</h3>
                <button onClick={() => setShowAddMemberModal(false)} className="h-10 w-10 flex items-center justify-center text-slate-300 hover:text-rose-500 transition-colors">
                  <span className="material-symbols-outlined text-2xl">close</span>
                </button>
              </div>

              <div className="p-10 space-y-8">
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-4 text-slate-300">search</span>
                  <input
                    type="text"
                    placeholder="Nhập Tên hoặc MSSV của cán bộ..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-14 pl-12 pr-4 rounded-xl border border-slate-200 outline-none focus:ring-4 ring-blue-500/10 font-medium text-sm"
                  />
                </div>

                <div className="space-y-6">
                  <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">
                    <span>KẾT QUẢ TÌM KIẾM</span>
                    <span>Tìm thấy 2 kết quả</span>
                  </div>
                  <div className="space-y-3">
                    {searchResults.map(res => (
                      <div
                        key={res.id}
                        onClick={() => setSelectedMember(res)}
                        className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${selectedMember?.id === res.id ? 'bg-blue-50 border-blue-500 ring-4 ring-blue-500/10' : 'bg-white border-slate-100 hover:bg-slate-50'}`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`h-12 w-12 rounded-full flex items-center justify-center font-black text-xs text-white shadow-inner italic ${res.color === 'rose' ? 'bg-rose-400' : 'bg-blue-400'}`}>{res.initial}</div>
                          <div>
                            <p className="text-sm font-bold text-slate-900">{res.name}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5 whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px]">MSSV: {res.mssv} • <span className="text-blue-600">{res.role}</span></p>
                          </div>
                        </div>
                        <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center transition-all ${selectedMember?.id === res.id ? 'border-blue-600' : 'border-slate-200'}`}>
                          {selectedMember?.id === res.id && <div className="h-3 w-3 rounded-full bg-blue-600"></div>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4 pt-4 border-t border-slate-50">
                  <button onClick={() => setShowAddMemberModal(false)} className="flex-1 h-14 rounded-2xl bg-slate-50 text-slate-900 text-[11px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all">Hủy</button>
                  <button onClick={handleAddMemberContinue} className="flex-1 h-14 rounded-2xl bg-blue-600 text-white text-[11px] font-black uppercase tracking-widest shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all">Tiếp tục</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Permissions Setup */}
      {showPermissionsModal && (
        <div className="fixed inset-[-10px] z-[70] overflow-y-auto bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="min-h-full flex items-center justify-center p-4">
            <div className="bg-white rounded-[2.5rem] w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-100">
              <div className="px-10 py-8 border-b border-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="h-12 w-12 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center font-black text-xs border border-rose-100 italic shadow-inner">TB</div>
                    <div className="absolute -bottom-1 -right-1 h-5 w-5 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center text-white"><span className="material-symbols-outlined text-[12px] font-black">check</span></div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 tracking-tight">Thiết lập Quyền hạn</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">cho: <span className="text-slate-900 italic font-black">Trần Thị B</span> • <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[9px] font-black italic">Phó Bí thư</span></p>
                  </div>
                </div>
                <button onClick={() => setShowPermissionsModal(false)} className="h-10 w-10 flex items-center justify-center text-slate-300 hover:text-rose-500 transition-colors">
                  <span className="material-symbols-outlined text-2xl focus:outline-none">close</span>
                </button>
              </div>

              <div className="p-10 space-y-8">
                <p className="text-sm font-medium text-slate-500 leading-relaxed italic">Vui lòng chọn các nhóm quyền hạn cụ thể cho thành viên này. Các thay đổi sẽ có hiệu lực ngay sau khi xác nhận.</p>

                <div className="space-y-6">
                  {/* Section 1 */}
                  <div className="p-8 rounded-[2rem] border border-slate-100 space-y-6 relative overflow-hidden group">
                    <div className="flex items-center gap-3 text-slate-900 border-b border-slate-50 pb-4">
                      <span className="material-symbols-outlined text-blue-600">event_available</span>
                      <h4 className="text-xs font-black uppercase tracking-widest italic">1. Quản lý Sự kiện</h4>
                    </div>
                    <div className="space-y-6">
                      <div className="flex items-start gap-4 cursor-pointer group/item">
                        <input type="checkbox" defaultChecked className="h-6 w-6 rounded-lg border-2 border-slate-200 text-blue-600 focus:ring-blue-500/20 mt-0.5" />
                        <div>
                          <p className="text-sm font-bold text-slate-900 italic">Duyệt kế hoạch tổ chức</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Cho phép xem và phê duyệt kế hoạch trước khi diễn ra.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4 cursor-pointer group/item">
                        <input type="checkbox" defaultChecked className="h-6 w-6 rounded-lg border-2 border-slate-200 text-blue-600 focus:ring-blue-500/20 mt-0.5" />
                        <div>
                          <p className="text-sm font-bold text-slate-900 italic">Đăng bài truyền thông</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Quyền đăng tải và chỉnh sửa bài viết trên trang tin tức.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Section 2 */}
                  <div className="p-8 rounded-[2rem] border border-slate-100 space-y-6 relative overflow-hidden group">
                    <div className="flex items-center gap-3 text-slate-900 border-b border-slate-50 pb-4">
                      <span className="material-symbols-outlined text-blue-600">payments</span>
                      <h4 className="text-xs font-black uppercase tracking-widest italic">2. Quản lý Tài chính</h4>
                    </div>
                    <div className="space-y-6">
                      <div className="flex items-start gap-4 cursor-pointer group/item">
                        <input type="checkbox" className="h-6 w-6 rounded-lg border-2 border-slate-200 text-blue-600 focus:ring-blue-500/20 mt-0.5" />
                        <div>
                          <p className="text-sm font-bold text-slate-900 italic">Duyệt chi ngân sách</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Quyền phê duyệt các khoản chi tiêu của Đoàn khoa.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4 cursor-pointer group/item">
                        <input type="checkbox" defaultChecked className="h-6 w-6 rounded-lg border-2 border-slate-200 text-blue-600 focus:ring-blue-500/20 mt-0.5" />
                        <div>
                          <p className="text-sm font-bold text-slate-900 italic">Xem báo cáo thu chi</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Chỉ xem thống kê tài chính, không có quyền chỉnh sửa.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Section 3 */}
                  <div className="p-8 rounded-[2rem] border border-slate-100 space-y-6 relative overflow-hidden group">
                    <div className="flex items-center gap-3 text-slate-900 border-b border-slate-50 pb-4">
                      <span className="material-symbols-outlined text-blue-600">group_add</span>
                      <h4 className="text-xs font-black uppercase tracking-widest italic">3. Quản lý Nhân sự</h4>
                    </div>
                    <div className="space-y-6">
                      <div className="flex items-start gap-4 cursor-pointer group/item">
                        <input type="checkbox" defaultChecked className="h-6 w-6 rounded-lg border-2 border-slate-200 text-blue-600 focus:ring-blue-500/20 mt-0.5" />
                        <div>
                          <p className="text-sm font-bold text-slate-900 italic">Duyệt hồ sơ Đoàn viên mới</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Quyền chấp thuận hồ sơ đoàn viên mới gia nhập.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 rounded-2xl bg-amber-50 border border-amber-100 flex items-start gap-4 text-amber-800">
                    <span className="material-symbols-outlined shrink-0">warning</span>
                    <p className="text-[11px] font-bold leading-relaxed italic">Thành viên này sẽ truy cập được các dữ liệu nhạy cảm đã chọn. Vui lòng kiểm tra kỹ.</p>
                  </div>
                </div>

                <div className="flex gap-4 pt-4 border-t border-slate-50">
                  <button onClick={() => { setShowPermissionsModal(false); setShowAddMemberModal(true); }} className="flex-1 h-14 rounded-2xl bg-slate-50 text-slate-900 text-[11px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all">Quay lại</button>
                  <button onClick={() => { setShowPermissionsModal(false); handleAction('Đã ủy quyền thành công cho Trần Thị B!'); }} className="flex-1 h-14 rounded-2xl bg-blue-600 text-white text-[11px] font-black uppercase tracking-widest shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-lg font-black">verified</span> Xác nhận Ủy quyền
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default SubAdminSettings;
