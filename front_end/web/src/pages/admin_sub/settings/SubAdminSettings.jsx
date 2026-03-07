import React, { useState, useRef, useEffect } from 'react';
import Toast from '../../../components/ui/Toast';
import Toggle from '../../../components/ui/Toggle';
import Modal from '../../../components/ui/Modal';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import SignatureCanvas from 'react-signature-canvas';

const SubAdminSettings = () => {
  const [toast, setToast] = useState(null);
  // Profile
  const [profile, setProfile] = useState({
    name: 'Lê Trọng Phúc Hậu',
    role: 'Bí thư Đoàn Khoa',
    email: 'hau.ltp@lhu.edu.vn',
    phone: '0909 123 456',
    avatar: null,
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  // Security
  const [toggles, setToggles] = useState({
    twoFactor: true,
    emailAlert: true,
    zaloAlert: true,
    dailyDigest: false,
  });

  const [devices, setDevices] = useState([
    { id: 1, name: 'MacBook Pro', location: 'Ho Chi Minh City', browser: 'Chrome', ip: '192.168.1.1', status: 'Current', icon: 'laptop_mac' },
    { id: 2, name: 'iPhone 15', location: 'Dong Nai', browser: 'Safari Mobile', time: '2 hours ago', icon: 'smartphone', status: '' },
  ]);

  // Signature
  const [signature, setSignature] = useState(null);
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [signatureTab, setSignatureTab] = useState('draw');
  const signatureCanvasRef = useRef(null);
  const [signatureImage, setSignatureImage] = useState(null);

  // Password change
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordStep, setPasswordStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Permissions
  const [team, setTeam] = useState([
    { id: 1, name: 'Nguyễn Văn A', role: 'Phó Bí thư', permissions: { events: true, finance: false, posts: true }, initial: 'VA' },
  ]);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [newMember, setNewMember] = useState({ name: '', mssv: '', role: '' });

  // Mock search results
  const searchResults = [
    { id: 'TB', name: 'Trần Thị B', mssv: '23CT113', role: 'Phó Bí thư Đoàn Khoa', initial: 'TB', color: 'rose' },
    { id: 'LC', name: 'Lê Văn C', mssv: '22CT111', role: 'Ủy viên BTV', initial: 'LC', color: 'blue' },
  ];

  const filteredResults = searchResults.filter(r =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.mssv.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Avatar upload
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  // Toggles
  const handleToggle = (key) => {
    setToggles(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Devices: logout all others
  const handleLogoutAll = () => {
    setDevices(devices.map(d => d.status === 'Current' ? d : { ...d, status: 'Logged out' }));
    setToast({ message: 'Đã đăng xuất các thiết bị khác', type: 'success' });
  };

  // Signature handlers
  const clearSignature = () => {
    if (window.confirm('Bạn có chắc muốn xóa chữ ký hiện tại?')) {
      if (signatureCanvasRef.current) {
        signatureCanvasRef.current.clear();
      }
      setSignature(null);
      setSignatureImage(null);
    }
  };

  const undoSignature = () => {
    // Không có undo đơn giản, có thể dùng history stack, nhưng demo thì clear
    if (signatureCanvasRef.current) {
      signatureCanvasRef.current.clear();
    }
  };

  const saveSignature = () => {
    if (signatureTab === 'draw' && signatureCanvasRef.current) {
      const dataUrl = signatureCanvasRef.current.toDataURL();
      setSignature(dataUrl);
    } else if (signatureTab === 'upload' && signatureImage) {
      setSignature(signatureImage);
    }
    setShowSignatureModal(false);
    setToast({ message: 'Đã cập nhật chữ ký số!', type: 'success' });
  };

  // Password change
  const handlePasswordNext = () => {
    if (passwordStep === 1 && !email) {
      setToast({ message: 'Vui lòng nhập email', type: 'error' });
      return;
    }
    if (passwordStep === 2 && !otp) {
      setToast({ message: 'Vui lòng nhập OTP', type: 'error' });
      return;
    }
    if (passwordStep === 3) {
      if (!newPassword || !confirmPassword) {
        setToast({ message: 'Vui lòng nhập mật khẩu mới', type: 'error' });
        return;
      }
      if (newPassword !== confirmPassword) {
        setToast({ message: 'Mật khẩu không khớp', type: 'error' });
        return;
      }
      setShowPasswordModal(false);
      setPasswordStep(1);
      setEmail('');
      setOtp('');
      setNewPassword('');
      setConfirmPassword('');
      setToast({ message: 'Đổi mật khẩu thành công!', type: 'success' });
      return;
    }
    setPasswordStep(prev => prev + 1);
  };

  // Permissions
  const handleEditPermissions = (member) => {
    setSelectedMember(member);
    setShowPermissionsModal(true);
  };

  const handleDeleteMember = (id) => {
    if (window.confirm('Bạn có chắc muốn xóa thành viên này?')) {
      setTeam(team.filter(m => m.id !== id));
      setToast({ message: 'Đã xóa thành viên', type: 'success' });
    }
  };

  const handlePermissionChange = (memberId, perm) => {
    setTeam(prev => prev.map(m =>
      m.id === memberId ? { ...m, permissions: { ...m.permissions, [perm]: !m.permissions[perm] } } : m
    ));
  };

  const handleAddMember = () => {
    if (!newMember.name || !newMember.mssv) {
      setToast({ message: 'Vui lòng nhập đủ thông tin', type: 'error' });
      return;
    }
    const newId = team.length + 1;
    setTeam([...team, {
      id: newId,
      name: newMember.name,
      role: newMember.role || 'Thành viên',
      permissions: { events: false, finance: false, posts: false },
      initial: newMember.name.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase(),
    }]);
    setNewMember({ name: '', mssv: '', role: '' });
    setShowAddMemberModal(false);
    setToast({ message: 'Thêm thành viên thành công!', type: 'success' });
  };

  return (
    <div className="p-4 md:p-8 bg-[#F8FAFC] min-h-screen space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <nav className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
            <span className="material-symbols-outlined text-sm">home</span>
            <span>Tổng quan</span>
            <span>/</span>
            <span className="text-blue-600 underline">Cài đặt & Hồ sơ</span>
          </nav>
          <h1 className="text-2xl font-bold text-slate-900">Thiết lập Tài khoản & Cấu hình Khoa</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column */}
        <div className="lg:col-span-4 space-y-8">
          {/* Profile Card */}
          <div className="bg-white border border-slate-100 rounded-[2rem] p-10 shadow-sm space-y-8 text-center relative overflow-hidden">
            <div className="relative inline-block">
              <div className="h-32 w-32 rounded-full bg-blue-500 flex items-center justify-center text-white text-4xl font-bold shadow-2xl mx-auto ring-8 ring-blue-50">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="avatar" className="w-full h-full rounded-full object-cover" />
                ) : (
                  profile.name.split(' ').map(w => w[0]).join('').slice(0,2)
                )}
              </div>
              <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 h-10 w-10 bg-white rounded-full shadow-lg border border-slate-100 flex items-center justify-center text-slate-400 hover:text-blue-600 transition-all cursor-pointer">
                <span className="material-symbols-outlined text-xl">edit</span>
                <input type="file" id="avatar-upload" accept="image/*" className="hidden" onChange={handleAvatarChange} />
              </label>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-900">{profile.name}</h3>
              <div className="mt-3 px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-xs font-bold uppercase tracking-widest inline-block border border-blue-100">
                {profile.role}
              </div>
            </div>

            <div className="space-y-6 pt-6 text-left border-t border-slate-50">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Email (Đã xác thực)</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-3 text-slate-300">mail</span>
                  <input type="text" value={profile.email} readOnly className="w-full h-12 pl-12 pr-10 rounded-xl border border-slate-100 bg-slate-50/50 text-sm font-bold text-slate-700 outline-none" />
                  <span className="material-symbols-outlined absolute right-4 top-3 text-emerald-500">check_circle</span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Số điện thoại</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-3 text-slate-300">call</span>
                  <input type="text" value={profile.phone} readOnly className="w-full h-12 pl-12 pr-4 rounded-xl border border-slate-100 bg-slate-50/50 text-sm font-bold text-slate-700 outline-none" />
                </div>
              </div>
            </div>
          </div>

          {/* E-Signature */}
          <div className="bg-white border border-slate-100 rounded-[2rem] p-10 shadow-sm space-y-6">
            <div className="flex items-center gap-3 text-blue-600 border-b border-slate-50 pb-4">
              <span className="material-symbols-outlined font-bold">edit_square</span>
              <h3 className="text-xs font-bold uppercase tracking-widest">Chữ ký số (E-Signature)</h3>
            </div>
            <div className="h-32 rounded-2xl border-2 border-dashed border-slate-100 bg-slate-50/50 flex items-center justify-center p-6 opacity-80 hover:opacity-100 transition-all cursor-pointer">
              {signature ? (
                <img src={signature} alt="Signature" className="h-16 object-contain" />
              ) : (
                <p className="text-xs text-slate-400">Chưa có chữ ký</p>
              )}
            </div>
            <p className="text-xs font-medium text-slate-400 leading-relaxed">Chữ ký này sẽ được áp dụng lên các văn bản và phiếu chi điện tử.</p>
            <button onClick={() => setShowSignatureModal(true)} className="w-full h-12 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs font-bold uppercase tracking-widest shadow-sm hover:bg-slate-900 hover:text-white transition-all flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-sm">draw</span> Cập nhật Chữ ký
            </button>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-8 space-y-8">
          {/* Account Security */}
          <div className="bg-white border border-slate-100 rounded-[2rem] p-10 shadow-sm space-y-8">
            <div className="flex items-center gap-3 text-blue-600">
              <span className="material-symbols-outlined font-bold">security</span>
              <h3 className="text-sm font-bold uppercase tracking-widest">Account Security</h3>
            </div>

            <div className="space-y-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-700">Mật khẩu</p>
                  <p className="text-xs font-medium text-slate-300 mt-1 tracking-widest">••••••••••••</p>
                </div>
                <button onClick={() => setShowPasswordModal(true)} className="text-xs font-bold text-blue-600 uppercase hover:underline">Đổi mật khẩu</button>
              </div>

              <div className="flex items-center justify-between p-6 rounded-2xl bg-slate-50/50 border border-slate-50 hover:bg-white hover:shadow-xl hover:border-blue-100 group">
                <div className="space-y-1">
                  <p className="text-sm font-bold text-slate-900 uppercase">Xác thực 2 lớp (2FA)</p>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Tăng cường bảo mật cho tài khoản</p>
                </div>
                <Toggle
                  checked={toggles.twoFactor}
                  onChange={() => handleToggle('twoFactor')}
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    Thiết bị đang đăng nhập
                  </p>
                  <button onClick={handleLogoutAll} className="text-xs font-bold text-rose-500 uppercase tracking-widest hover:underline">Đăng xuất tất cả</button>
                </div>
                <div className="space-y-3">
                  {devices.map(d => (
                    <div key={d.id} className="p-4 rounded-xl border border-slate-50 bg-white flex items-center justify-between group hover:shadow-lg transition-all">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all">
                          <span className="material-symbols-outlined">{d.icon}</span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-bold text-slate-700">{d.name}</p>
                            {d.status === 'Current' && <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-600 text-[8px] font-bold uppercase rounded tracking-widest">Current</span>}
                          </div>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">{d.location} • {d.browser} • {d.ip || d.time}</p>
                        </div>
                      </div>
                      {d.status !== 'Current' && (
                        <button className="h-8 w-8 text-slate-300 hover:text-rose-500 transition-colors">
                          <span className="material-symbols-outlined text-lg">logout</span>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="bg-white border border-slate-100 rounded-[2rem] p-10 shadow-sm space-y-8">
            <div className="flex items-center gap-3 text-blue-600">
              <span className="material-symbols-outlined font-bold">notifications_active</span>
              <h3 className="text-sm font-bold uppercase tracking-widest">Notification Settings</h3>
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
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{n.desc}</p>
                  </div>
                  <Toggle
                    checked={toggles[n.key]}
                    onChange={() => handleToggle(n.key)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Permissions Table */}
          <div className="bg-white border border-slate-100 rounded-[2rem] p-10 shadow-sm space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-slate-800">
                <span className="material-symbols-outlined font-bold">group_add</span>
                <h3 className="text-sm font-bold uppercase tracking-widest">Phân quyền Ban Thường vụ</h3>
              </div>
              <button onClick={() => setShowAddMemberModal(true)} className="text-xs font-bold text-blue-600 uppercase tracking-widest flex items-center gap-2 hover:underline">
                <span className="material-symbols-outlined text-lg">add</span> Thêm người
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-4 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Thành viên</th>
                    <th className="px-4 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Duyệt sự kiện</th>
                    <th className="px-4 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Duyệt tài chính</th>
                    <th className="px-4 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Đăng bài viết</th>
                    <th className="px-4 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {team.map(m => (
                    <tr key={m.id} className="group hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-6">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs border border-blue-100 shadow-inner">
                            {m.initial}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900 uppercase">{m.name}</p>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">{m.role}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-6 text-center">
                        <input
                          type="checkbox"
                          checked={m.permissions.events}
                          onChange={() => handlePermissionChange(m.id, 'events')}
                          className="h-5 w-5 rounded border-2 border-slate-200 text-blue-600 focus:ring-blue-500/20 cursor-pointer"
                        />
                      </td>
                      <td className="px-4 py-6 text-center">
                        <input
                          type="checkbox"
                          checked={m.permissions.finance}
                          onChange={() => handlePermissionChange(m.id, 'finance')}
                          className="h-5 w-5 rounded border-2 border-slate-200 text-blue-600 focus:ring-blue-500/20 cursor-pointer"
                        />
                      </td>
                      <td className="px-4 py-6 text-center">
                        <input
                          type="checkbox"
                          checked={m.permissions.posts}
                          onChange={() => handlePermissionChange(m.id, 'posts')}
                          className="h-5 w-5 rounded border-2 border-slate-200 text-blue-600 focus:ring-blue-500/20 cursor-pointer"
                        />
                      </td>
                      <td className="px-4 py-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => handleEditPermissions(m)} className="h-8 w-8 rounded-lg bg-white border border-slate-100 text-slate-400 hover:text-blue-600 transition-all shadow-sm">
                            <span className="material-symbols-outlined text-sm">edit</span>
                          </button>
                          <button onClick={() => handleDeleteMember(m.id)} className="h-8 w-8 rounded-lg bg-white border border-slate-100 text-slate-400 hover:text-rose-600 transition-all shadow-sm">
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

      {/* Change Password Modal */}
      <Modal isOpen={showPasswordModal} onClose={() => setShowPasswordModal(false)} title="Đổi mật khẩu" size="md">
        <div className="space-y-6 py-4">
          {passwordStep === 1 && (
            <div className="space-y-4">
              <p className="text-sm text-slate-600">Nhập email để nhận mã OTP xác thực</p>
              <Input
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="hau.ltp@lhu.edu.vn"
              />
            </div>
          )}
          {passwordStep === 2 && (
            <div className="space-y-4">
              <p className="text-sm text-slate-600">Mã OTP đã được gửi đến email {email}</p>
              <Input
                label="Mã OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Nhập mã OTP"
              />
            </div>
          )}
          {passwordStep === 3 && (
            <div className="space-y-4">
              <Input
                label="Mật khẩu mới"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <Input
                label="Xác nhận mật khẩu"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          )}
          <div className="flex gap-4 pt-4">
            <Button variant="outline" className="flex-1" onClick={() => setShowPasswordModal(false)}>Hủy</Button>
            <Button variant="primary" className="flex-1" onClick={handlePasswordNext}>
              {passwordStep < 3 ? 'Tiếp tục' : 'Xác nhận'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Signature Modal */}
      <Modal isOpen={showSignatureModal} onClose={() => setShowSignatureModal(false)} title="Cập nhật Chữ ký số" size="lg">
        <div className="space-y-6">
          <div className="flex gap-4 border-b border-slate-100">
            <button
              onClick={() => setSignatureTab('draw')}
              className={`pb-2 text-sm font-bold uppercase tracking-widest transition-all ${signatureTab === 'draw' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-400'}`}
            >
              Vẽ trực tiếp
            </button>
            <button
              onClick={() => setSignatureTab('upload')}
              className={`pb-2 text-sm font-bold uppercase tracking-widest transition-all ${signatureTab === 'upload' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-400'}`}
            >
              Tải ảnh lên
            </button>
          </div>

          {signatureTab === 'draw' ? (
            <div className="space-y-4">
              <div className="border-2 border-slate-200 rounded-lg p-2 bg-white">
                <SignatureCanvas
                  ref={signatureCanvasRef}
                  canvasProps={{ className: 'w-full h-40 border border-slate-100' }}
                  backgroundColor="white"
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => signatureCanvasRef.current?.clear()}>
                  <span className="material-symbols-outlined text-lg">ink_eraser</span> Xóa
                </Button>
                <Button variant="outline" size="sm" onClick={undoSignature}>
                  <span className="material-symbols-outlined text-lg">undo</span> Undo
                </Button>
                <Button variant="outline" size="sm" onClick={clearSignature}>
                  <span className="material-symbols-outlined text-lg">delete</span> Xóa tất cả
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="border-2 border-dashed border-slate-200 rounded-lg p-8 text-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = () => setSignatureImage(reader.result);
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="hidden"
                  id="signature-upload"
                />
                <label htmlFor="signature-upload" className="cursor-pointer">
                  <span className="material-symbols-outlined text-4xl text-slate-300">cloud_upload</span>
                  <p className="text-sm font-bold text-slate-700 mt-2">Click để chọn ảnh</p>
                  <p className="text-xs text-slate-400">PNG, JPG tối đa 2MB</p>
                </label>
              </div>
              {signatureImage && (
                <div className="relative inline-block">
                  <img src={signatureImage} alt="Signature" className="h-20 border rounded" />
                  <button
                    onClick={() => setSignatureImage(null)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                  >
                    <span className="material-symbols-outlined text-sm">close</span>
                  </button>
                </div>
              )}
            </div>
          )}

          <div className="flex gap-4 pt-4 border-t border-slate-100">
            <Button variant="outline" className="flex-1" onClick={() => setShowSignatureModal(false)}>Hủy</Button>
            <Button variant="primary" className="flex-1" onClick={saveSignature}>Lưu chữ ký</Button>
          </div>
        </div>
      </Modal>

      {/* Add Member Modal */}
      <Modal isOpen={showAddMemberModal} onClose={() => setShowAddMemberModal(false)} title="Thêm thành viên vào Ban Thường vụ" size="lg">
        <div className="space-y-6">
          <div className="space-y-4">
            <Input
              label="Tên thành viên"
              value={newMember.name}
              onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
              placeholder="Nhập họ tên"
            />
            <Input
              label="MSSV"
              value={newMember.mssv}
              onChange={(e) => setNewMember({ ...newMember, mssv: e.target.value })}
              placeholder="Nhập mã số sinh viên"
            />
            <Input
              label="Vai trò"
              value={newMember.role}
              onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
              placeholder="Ví dụ: Phó Bí thư"
            />
          </div>

          <div className="space-y-4">
            <p className="text-sm font-bold text-slate-700">Hoặc tìm kiếm từ danh sách cán bộ</p>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-3 text-slate-300">search</span>
              <input
                type="text"
                placeholder="Nhập tên hoặc MSSV..."
                className="w-full h-12 pl-12 pr-4 rounded-xl border border-slate-200 outline-none focus:border-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {filteredResults.map(r => (
                <div
                  key={r.id}
                  onClick={() => setNewMember({ name: r.name, mssv: r.mssv, role: r.role })}
                  className="p-3 rounded-xl border border-slate-100 hover:bg-slate-50 cursor-pointer flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-white ${r.color === 'rose' ? 'bg-rose-400' : 'bg-blue-400'}`}>
                      {r.initial}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{r.name}</p>
                      <p className="text-xs text-slate-500">{r.mssv} • {r.role}</p>
                    </div>
                  </div>
                  <span className="text-blue-600 text-sm">Chọn</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button variant="outline" className="flex-1" onClick={() => setShowAddMemberModal(false)}>Hủy</Button>
            <Button variant="primary" className="flex-1" onClick={handleAddMember}>Thêm thành viên</Button>
          </div>
        </div>
      </Modal>

      {/* Edit Permissions Modal */}
      {showPermissionsModal && selectedMember && (
        <Modal isOpen={showPermissionsModal} onClose={() => setShowPermissionsModal(false)} title="Chỉnh sửa quyền hạn" size="md">
          <div className="space-y-6 py-4">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center font-bold text-blue-600">
                {selectedMember.initial}
              </div>
              <div>
                <p className="text-lg font-bold">{selectedMember.name}</p>
                <p className="text-sm text-slate-500">{selectedMember.role}</p>
              </div>
            </div>
            <div className="space-y-4">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={selectedMember.permissions.events}
                  onChange={() => {
                    const updated = { ...selectedMember, permissions: { ...selectedMember.permissions, events: !selectedMember.permissions.events } };
                    setSelectedMember(updated);
                    setTeam(prev => prev.map(m => m.id === updated.id ? updated : m));
                  }}
                  className="h-5 w-5 rounded border-slate-300 text-blue-600"
                />
                <span>Duyệt sự kiện</span>
              </label>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={selectedMember.permissions.finance}
                  onChange={() => {
                    const updated = { ...selectedMember, permissions: { ...selectedMember.permissions, finance: !selectedMember.permissions.finance } };
                    setSelectedMember(updated);
                    setTeam(prev => prev.map(m => m.id === updated.id ? updated : m));
                  }}
                  className="h-5 w-5 rounded border-slate-300 text-blue-600"
                />
                <span>Duyệt tài chính</span>
              </label>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={selectedMember.permissions.posts}
                  onChange={() => {
                    const updated = { ...selectedMember, permissions: { ...selectedMember.permissions, posts: !selectedMember.permissions.posts } };
                    setSelectedMember(updated);
                    setTeam(prev => prev.map(m => m.id === updated.id ? updated : m));
                  }}
                  className="h-5 w-5 rounded border-slate-300 text-blue-600"
                />
                <span>Đăng bài viết</span>
              </label>
            </div>
            <div className="flex gap-4 pt-4">
              <Button variant="outline" className="flex-1" onClick={() => setShowPermissionsModal(false)}>Đóng</Button>
            </div>
          </div>
        </Modal>
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default SubAdminSettings;