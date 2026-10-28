import React, { useState, useRef, useEffect } from 'react';
import { 
  Home, Save, Edit2, Mail, CheckCircle, CheckCircle2, Phone, 
  FileSignature, PenTool, Shield, Laptop, Smartphone, LogOut, 
  Bell, UserPlus, Plus, Edit, Trash2, Eraser, Undo, Upload, 
  X, Search 
} from 'lucide-react';
import Toast from '../../../components/ui/Toast';
import Toggle from '../../../components/ui/Toggle';
import Modal from '../../../components/ui/Modal';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import SignatureCanvas from 'react-signature-canvas';
import { userService } from '../../../services/userService';

const SubAdminSettings = () => {
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);

  // Profile
  const [profile, setProfile] = useState({
    name: '',
    role: '',
    email: '',
    phone: '',
    avatar: null,
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  // Security
  const [toggles, setToggles] = useState({
    twoFactor: false,
    emailAlert: true,
    zaloAlert: true,
    dailyDigest: false,
  });

  const [devices, setDevices] = useState([]);

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
  const [team, setTeam] = useState([]);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [newMember, setNewMember] = useState({ id: '', name: '', mssv: '', role: '' });
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, title: '', message: '', onConfirm: null });

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.length >= 2) {
        const res = await userService.searchUsers(searchQuery);
        setSearchResults(res);
      } else {
        setSearchResults([]);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [userData, devicesData, teamData] = await Promise.all([
        userService.getMe(),
        userService.getDevices(),
        userService.getTeam()
      ]);

      if (userData) {
        setProfile({
          name: userData.full_name,
          role: userData.role_title || 'Thành viên',
          email: userData.email,
          phone: userData.phone_number || 'Chưa cập nhật',
          avatar: userData.avatar_url
        });
        setToggles({
          twoFactor: userData.is_2fa_enabled,
          emailAlert: userData.email_alerts_enabled,
          zaloAlert: userData.zalo_alerts_enabled,
          dailyDigest: userData.daily_digest_enabled
        });
        setSignature(userData.signature_data);
        if (userData.avatar_url) setAvatarPreview(userData.avatar_url);
      }

      if (devicesData) setDevices(devicesData);
      if (teamData) setTeam(teamData);
    } catch (error) {
      setToast({ message: 'Lỗi tải dữ liệu từ máy chủ', type: 'error' });
    } finally {
      setLoading(false);
    }
  };



  // Avatar upload
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);
      
      try {
        const response = await userService.uploadAvatar(file);
        if (response && response.avatar_url) {
          setAvatarPreview(response.avatar_url);
          setProfile(prev => ({ ...prev, avatar: response.avatar_url }));
          setToast({ message: 'Đã cập nhật ảnh đại diện lên bộ nhớ đám mây!', type: 'success' });
        }
      } catch (error) {
        setToast({ message: 'Lỗi cập nhật ảnh lên dịch vụ đám mây!', type: 'error' });
        // Fallback to old preview if needed or just show error
      }
    }
  };

  // Toggles chỉ đổi state local
  const handleToggle = (key) => {
    setToggles(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Nút Lưu thay đổi tổng (Email, Phone, 2FA, Notification settings)
  const handleSaveSettings = async () => {
    try {
      await userService.updateMe({
        email: profile.email,
        phone_number: profile.phone,
        is_2fa_enabled: toggles.twoFactor,
        email_alerts_enabled: toggles.emailAlert,
        zalo_alerts_enabled: toggles.zaloAlert,
        daily_digest_enabled: toggles.dailyDigest
      });
      setToast({ message: 'Thông tin đã được cập nhật thành công lên hệ thống!', type: 'success' });
    } catch (error) {
      setToast({ message: 'Có lỗi xảy ra khi lưu cài đặt!', type: 'error' });
    }
  };

  // Devices: logout all others
  const handleLogoutAll = async () => {
    try {
      await userService.logoutAllDevices();
      setToast({ message: 'Đã đăng xuất thành công khỏi tất cả thiết bị khác', type: 'success' });
      fetchData();
    } catch (error) {
      setToast({ message: 'Lỗi khi đăng xuất thiết bị', type: 'error' });
    }
  };

  const handleLogoutDevice = async (id) => {
    try {
      await userService.logoutDevice(id);
      setToast({ message: 'Đã đăng xuất thiết bị', type: 'success' });
      fetchData();
    } catch (error) {
      setToast({ message: 'Lỗi khi đăng xuất thiết bị', type: 'error' });
    }
  };

  // Signature handlers
  const clearSignature = () => {
    setConfirmModal({
      isOpen: true,
      title: 'Xác nhận xóa chữ ký',
      message: 'Bạn có chắc chắn muốn xóa chữ ký điện tử hiện tại? Thao tác này không thể hoàn tác.',
      onConfirm: async () => {
        if (signatureCanvasRef.current) {
          signatureCanvasRef.current.clear();
        }
        setSignature(null);
        setSignatureImage(null);
        try {
          await userService.updateMe({ signature_data: null });
          setToast({ message: 'Đã xóa chữ ký số!', type: 'success' });
        } catch (error) {
          setToast({ message: 'Lỗi khi xóa chữ ký!', type: 'error' });
        }
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  const undoSignature = () => {
    if (signatureCanvasRef.current) {
      signatureCanvasRef.current.clear();
    }
  };

  const saveSignature = async () => {
    let signatureData = null;
    if (signatureTab === 'draw' && signatureCanvasRef.current) {
      signatureData = signatureCanvasRef.current.toDataURL();
    } else if (signatureTab === 'upload' && signatureImage) {
      signatureData = signatureImage;
    }

    if (signatureData) {
      setSignature(signatureData);
      try {
        await userService.updateMe({ signature_data: signatureData });
        setShowSignatureModal(false);
        setToast({ message: 'Đã cập nhật chữ ký số!', type: 'success' });
      } catch (error) {
        setToast({ message: 'Lỗi lưu chữ ký!', type: 'error' });
      }
    }
  };

  // Password change
  const handlePasswordNext = async () => {
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
      
      try {
        await userService.updateMe({ password: newPassword });
        setShowPasswordModal(false);
        setPasswordStep(1);
        setEmail('');
        setOtp('');
        setNewPassword('');
        setConfirmPassword('');
        setToast({ message: 'Đổi mật khẩu thành công!', type: 'success' });
      } catch (error) {
        setToast({ message: 'Lỗi khi đổi mật khẩu', type: 'error' });
      }
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
    setConfirmModal({
      isOpen: true,
      title: 'Xóa cán bộ Ban Thường vụ',
      message: 'Bạn có chắc chắn muốn xóa thành viên này khỏi Ban Thường vụ Khoa?',
      onConfirm: async () => {
        try {
          await userService.removeTeamMember(id);
          setToast({ message: 'Đã xóa thành viên khỏi Ban Thường vụ', type: 'success' });
          fetchData();
        } catch (error) {
          setToast({ message: 'Lỗi xóa thành viên: ' + error.message, type: 'error' });
        }
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  const handlePermissionChange = (memberId, perm) => {
    setTeam(prev => prev.map(m =>
      m.id === memberId ? { ...m, permissions: { ...m.permissions, [perm]: !m.permissions[perm] } } : m
    ));
    if (selectedMember && selectedMember.id === memberId) {
      setSelectedMember(prev => ({ ...prev, permissions: { ...prev.permissions, [perm]: !prev.permissions[perm] } }));
    }
  };

  const handleSavePermissions = async () => {
    if (selectedMember) {
      try {
        await userService.updateTeamPermissions(selectedMember.id, selectedMember.permissions);
        setToast({ message: 'Đã lưu phân quyền', type: 'success' });
        setShowPermissionsModal(false);
        fetchData();
      } catch (e) {
        setToast({ message: 'Lỗi lưu phân quyền', type: 'error' });
      }
    }
  };

  const handleAddMember = async () => {
    if (!newMember.id || !newMember.role) {
      setToast({ message: 'Vui lòng chọn thành viên và nhập Vai trò', type: 'error' });
      return;
    }
    try {
      await userService.addTeamMember({ user_id: newMember.id, role: newMember.role });
      setNewMember({ id: '', name: '', mssv: '', role: '' });
      setShowAddMemberModal(false);
      setToast({ message: 'Thêm thành viên thành công!', type: 'success' });
      fetchData();
    } catch (error) {
      setToast({ message: 'Lỗi thêm thành viên (có thể đã tồn tại)!', type: 'error' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Shield size={22} className="text-blue-600" />
            Thiết lập Tài khoản & Cấu hình Khoa
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Quản trị thông tin cán bộ, chữ ký số điện tử, bảo mật 2 lớp và phân quyền Ban Thường vụ.
          </p>
        </div>
        <button
          onClick={handleSaveSettings}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-all flex items-center justify-center gap-1.5 self-start sm:self-auto"
        >
          <Save size={14} />
          Lưu thay đổi
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column */}
        <div className="lg:col-span-4 space-y-6">
          {/* Profile Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6 text-center relative overflow-hidden">
            <div className="relative inline-block">
              <div className="h-28 w-28 rounded-full bg-blue-600 flex items-center justify-center text-white text-3xl font-bold shadow-md mx-auto ring-4 ring-blue-50">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="avatar" className="w-full h-full rounded-full object-cover" />
                ) : (
                  profile.name.split(' ').map(w => w[0]).join('').slice(0,2)
                )}
              </div>
              <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 h-8 w-8 bg-white rounded-full shadow-md border border-slate-200 flex items-center justify-center text-slate-500 hover:text-blue-600 transition-all cursor-pointer">
                <Edit2 size={14} />
                <input type="file" id="avatar-upload" accept="image/*" className="hidden" onChange={handleAvatarChange} />
              </label>
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">{profile.name}</h3>
              <div className="mt-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-semibold inline-block border border-blue-200">
                {profile.role}
              </div>
            </div>

            <div className="space-y-4 pt-4 text-left border-t border-slate-100">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500">Email</label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="w-full h-9 pl-9 pr-8 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-800 outline-none transition-all focus:border-blue-500"
                    placeholder="Nhập email của bạn"
                  />
                  <CheckCircle2 size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500">Số điện thoại</label>
                <div className="relative">
                  <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    className="w-full h-9 pl-9 pr-3 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-800 outline-none transition-all focus:border-blue-500"
                    placeholder="Nhập số điện thoại"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* E-Signature */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-blue-600 border-b border-slate-100 pb-3">
              <FileSignature size={16} />
              <h3 className="text-xs font-bold uppercase tracking-wider">Chữ ký số (E-Signature)</h3>
            </div>
            <div className="h-28 rounded-lg border-2 border-dashed border-slate-200 bg-slate-50/50 flex items-center justify-center p-4">
              {signature ? (
                <img src={signature} alt="Signature" className="h-14 object-contain" />
              ) : (
                <p className="text-xs text-slate-400">Chưa tạo chữ ký điện tử</p>
              )}
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Chữ ký được áp dụng khi Bí thư Khoa phê duyệt văn bản hoặc xác nhận phiếu chi.
            </p>
            <button 
              onClick={() => setShowSignatureModal(true)} 
              className="w-full py-2 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold shadow-sm transition-all flex items-center justify-center gap-1.5"
            >
              <PenTool size={13} /> Cập nhật Chữ ký
            </button>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-8 space-y-6">
          {/* Account Security */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
            <div className="flex items-center gap-2 text-blue-600">
              <Shield size={16} />
              <h3 className="text-xs font-bold uppercase tracking-wider">Bảo mật tài khoản</h3>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <p className="text-xs font-semibold text-slate-800">Mật khẩu đăng nhập</p>
                  <p className="text-xs text-slate-400 mt-0.5 tracking-widest">••••••••••••</p>
                </div>
                <button 
                  onClick={() => setShowPasswordModal(true)} 
                  className="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 rounded-lg text-xs font-semibold text-blue-600 transition-all"
                >
                  Đổi mật khẩu
                </button>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-slate-800">Xác thực 2 lớp (2FA)</p>
                  <p className="text-[11px] text-slate-500">Bảo vệ tài khoản qua mã OTP email khi đăng nhập</p>
                </div>
                <Toggle
                  checked={toggles.twoFactor}
                  onChange={() => handleToggle('twoFactor')}
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Thiết bị đang đăng nhập ({devices.length})
                  </p>
                  <button 
                    onClick={handleLogoutAll} 
                    className="text-xs font-semibold text-rose-600 hover:underline"
                  >
                    Đăng xuất tất cả
                  </button>
                </div>
                <div className="space-y-2">
                  {devices.map(d => (
                    <div key={d.id} className="p-3.5 rounded-lg border border-slate-200 bg-white flex items-center justify-between hover:bg-slate-50/50 transition-all">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                          {d.icon === 'phone' ? <Smartphone size={15} /> : <Laptop size={15} />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-xs font-bold text-slate-800">{d.name}</p>
                            {d.status === 'Current' && (
                              <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-semibold rounded">
                                Hiện tại
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5">{d.location} • {d.browser} • {d.ip || d.time}</p>
                        </div>
                      </div>
                      {d.status !== 'Current' && (
                        <button 
                          onClick={() => handleLogoutDevice(d.id)} 
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded transition-colors"
                          title="Đăng xuất thiết bị này"
                        >
                          <LogOut size={15} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-blue-600">
              <Bell size={16} />
              <h3 className="text-xs font-bold uppercase tracking-wider">Tùy chọn Thông báo</h3>
            </div>

            <div className="space-y-3">
              {[
                { key: 'emailAlert', title: 'Thông báo Email', desc: 'Nhận email khi có văn bản hoặc đăng ký sự kiện cần duyệt' },
                { key: 'zaloAlert', title: 'Thông báo Zalo OA', desc: 'Nhận tin nhắn báo cáo tiến độ và lịch công tác' },
                { key: 'dailyDigest', title: 'Báo cáo tổng kết ngày (8:00 PM)', desc: 'Tổng hợp số lượng hoàn thành và KPI trong ngày' },
              ].map(n => (
                <div key={n.key} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50/50">
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-slate-800">{n.title}</p>
                    <p className="text-[11px] text-slate-500">{n.desc}</p>
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
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-900">
                <UserPlus size={16} className="text-blue-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider">Phân quyền Ban Thường vụ Khoa</h3>
              </div>
              <button 
                onClick={() => setShowAddMemberModal(true)} 
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm flex items-center gap-1 transition-all"
              >
                <Plus size={13} /> Thêm cán bộ
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/70 border-b border-slate-200 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    <th className="py-2.5 px-4">Thành viên</th>
                    <th className="py-2.5 px-3 text-center">Duyệt sự kiện</th>
                    <th className="py-2.5 px-3 text-center">Duyệt tài chính</th>
                    <th className="py-2.5 px-3 text-center">Đăng bài viết</th>
                    <th className="py-2.5 px-4 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                  {team.map(m => (
                    <tr key={m.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0">
                            {m.initial}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{m.name}</p>
                            <p className="text-[11px] text-slate-500 mt-0.5">{m.role}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <input
                          type="checkbox"
                          checked={m.permissions?.events}
                          onChange={() => handlePermissionChange(m.id, 'events')}
                          className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500/20 cursor-pointer"
                        />
                      </td>
                      <td className="py-3 px-3 text-center">
                        <input
                          type="checkbox"
                          checked={m.permissions?.finance}
                          onChange={() => handlePermissionChange(m.id, 'finance')}
                          className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500/20 cursor-pointer"
                        />
                      </td>
                      <td className="py-3 px-3 text-center">
                        <input
                          type="checkbox"
                          checked={m.permissions?.posts}
                          onChange={() => handlePermissionChange(m.id, 'posts')}
                          className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500/20 cursor-pointer"
                        />
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button 
                            onClick={() => handleEditPermissions(m)} 
                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                            title="Chỉnh sửa quyền"
                          >
                            <Edit size={14} />
                          </button>
                          <button 
                            onClick={() => handleDeleteMember(m.id)} 
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                            title="Xóa khỏi Ban Thường vụ"
                          >
                            <Trash2 size={14} />
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
                <Button variant="outline" size="sm" onClick={() => signatureCanvasRef.current?.clear()} className="flex items-center gap-1">
                  <Eraser size={14} /> Xóa
                </Button>
                <Button variant="outline" size="sm" onClick={undoSignature} className="flex items-center gap-1">
                  <Undo size={14} /> Hoàn tác
                </Button>
                <Button variant="outline" size="sm" onClick={clearSignature} className="flex items-center gap-1 text-rose-600">
                  <Trash2 size={14} /> Xóa tất cả
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
                  <Upload size={36} className="mx-auto text-slate-300" />
                  <p className="text-sm font-bold text-slate-700 mt-2">Click để chọn ảnh</p>
                  <p className="text-xs text-slate-400">PNG, JPG tối đa 2MB</p>
                </label>
              </div>
              {signatureImage && (
                <div className="relative inline-block">
                  <img src={signatureImage} alt="Signature" className="h-20 border rounded" />
                  <button
                    onClick={() => setSignatureImage(null)}
                    className="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full w-5 h-5 flex items-center justify-center shadow-sm"
                  >
                    <X size={12} />
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
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Nhập tên hoặc MSSV..."
                className="w-full h-10 pl-9 pr-4 rounded-xl border border-slate-200 text-xs outline-none focus:border-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {searchResults.length === 0 && searchQuery.length >= 2 && <p className="text-xs text-slate-400 p-2">Không tìm thấy cán bộ nào.</p>}
              {searchResults.map(r => (
                <div
                  key={r.id}
                  onClick={() => setNewMember({ id: r.id, name: r.name, mssv: r.mssv, role: newMember.role })}
                  className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${newMember.id === r.id ? 'border-blue-500 bg-blue-50' : 'border-slate-100 hover:bg-slate-50'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full flex items-center justify-center font-bold text-white bg-blue-400">
                      {r.initial}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{r.name}</p>
                      <p className="text-xs text-slate-500">{r.mssv} • {r.role}</p>
                    </div>
                  </div>
                  {newMember.id === r.id ? <CheckCircle2 size={16} className="text-blue-600" /> : <span className="text-blue-600 text-sm font-semibold">Chọn</span>}
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
              <Button variant="primary" className="flex-1" onClick={handleSavePermissions}>Lưu phân quyền</Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Enterprise Confirmation Modal */}
      <Modal 
        isOpen={confirmModal.isOpen} 
        onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))} 
        title={confirmModal.title} 
        size="sm"
      >
        <div className="space-y-4 py-2 text-xs">
          <p className="text-slate-600 leading-relaxed font-medium">
            {confirmModal.message}
          </p>
          <div className="flex gap-2 pt-3 border-t border-slate-100">
            <button
              onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
              className="flex-1 py-2 px-3 border border-slate-200 hover:bg-slate-50 rounded-lg text-slate-700 font-semibold"
            >
              Hủy
            </button>
            <button
              onClick={confirmModal.onConfirm}
              className="flex-1 py-2 px-3 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-semibold shadow-sm"
            >
              Xác nhận
            </button>
          </div>
        </div>
      </Modal>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default SubAdminSettings;