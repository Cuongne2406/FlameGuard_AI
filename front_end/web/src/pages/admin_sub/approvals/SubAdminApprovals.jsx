import React, { useState, useEffect } from 'react';
import { 
  FileText, Calendar, Sparkles, CheckCircle2, XCircle, Search, 
  Clock, Download, Eye, AlertCircle, RefreshCw, Filter, UserCheck, ShieldCheck
} from 'lucide-react';
import Toast from '../../../components/ui/Toast';
import Modal from '../../../components/ui/Modal';
import Button from '../../../components/ui/Button';
import { documentService } from '../../../services/documentService';
import { eventService } from '../../../services/eventService';
import { organizationService } from '../../../services/organizationService';

const SubAdminApprovals = () => {
  const [toast, setToast] = useState(null);
  const [activeTab, setActiveTab] = useState('documents'); // 'documents' | 'registrations' | 'proposals'
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Data states
  const [documents, setDocuments] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [proposals, setProposals] = useState([]);

  // Detail / Action modal states
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [showDocModal, setShowDocModal] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [showProposalModal, setShowProposalModal] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [docsData, regsData, propsData] = await Promise.all([
        documentService.getDocuments().catch(() => []),
        eventService.getPendingRegistrations().catch(() => []),
        organizationService.getClubProposals().catch(() => [])
      ]);

      setDocuments(Array.isArray(docsData) ? docsData : []);
      setRegistrations(Array.isArray(regsData) ? regsData : []);
      setProposals(Array.isArray(propsData) ? propsData : []);
    } catch (error) {
      console.error('Error fetching approvals data:', error);
      setToast({ message: 'Lỗi tải danh mục xét duyệt: ' + error.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Action Handlers - Digital Documents
  const handleApproveDoc = async (docId) => {
    try {
      await documentService.updateDocument(docId, { status: 'APPROVED' });
      setToast({ message: 'Đã phê duyệt văn bản / đơn từ thành công', type: 'success' });
      setShowDocModal(false);
      fetchData();
    } catch (err) {
      setToast({ message: 'Lỗi phê duyệt văn bản: ' + err.message, type: 'error' });
    }
  };

  const handleRejectDoc = async (docId) => {
    try {
      await documentService.updateDocument(docId, { status: 'REJECTED' });
      setToast({ message: 'Đã từ chối văn bản / đơn từ', type: 'info' });
      setShowDocModal(false);
      fetchData();
    } catch (err) {
      setToast({ message: 'Lỗi xử lý văn bản: ' + err.message, type: 'error' });
    }
  };

  // Action Handlers - Event Registrations
  const handleApproveReg = async (regId) => {
    try {
      await eventService.approveRegistration(regId);
      setToast({ message: 'Đã xác nhận đăng ký sự kiện cho sinh viên', type: 'success' });
      fetchData();
    } catch (err) {
      setToast({ message: 'Lỗi duyệt đăng ký: ' + err.message, type: 'error' });
    }
  };

  // Action Handlers - Club Proposals
  const handleApproveProposal = async (propId) => {
    try {
      await organizationService.approveClubProposal(propId);
      setToast({ message: 'Đã phê duyệt đề xuất hoạt động CLB', type: 'success' });
      setShowProposalModal(false);
      fetchData();
    } catch (err) {
      setToast({ message: 'Lỗi phê duyệt đề xuất: ' + err.message, type: 'error' });
    }
  };

  // Filtered Lists
  const filteredDocs = documents.filter(d => 
    (d.title || d.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (d.user_name || d.sender || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredRegs = registrations.filter(r => 
    (r.event_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (r.user_full_name || r.user_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (r.student_code || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredProps = proposals.filter(p => 
    (p.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.club_name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pendingDocsCount = documents.filter(d => d.status === 'PENDING' || !d.status).length;
  const pendingRegsCount = registrations.filter(r => r.status === 'PENDING' || !r.status).length;
  const pendingPropsCount = proposals.filter(p => p.status === 'PENDING' || !p.status).length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <UserCheck size={22} className="text-blue-600" />
            Trung tâm Xét duyệt Cấp Khoa
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Xử lý văn bản xác nhận sinh viên, danh sách đăng ký sự kiện và đề xuất hoạt động từ các CLB trực thuộc.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchData}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg text-xs font-semibold text-slate-700 shadow-sm transition-all"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Làm mới
          </button>
        </div>
      </div>

      {/* KPI Cards / Metric Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div 
          onClick={() => setActiveTab('documents')}
          className={`p-4 rounded-xl border cursor-pointer transition-all ${
            activeTab === 'documents' 
              ? 'bg-blue-50/50 border-blue-300 ring-2 ring-blue-500/10' 
              : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Đơn từ & Xác nhận SV</span>
            <div className="p-2 rounded-lg bg-blue-100 text-blue-700">
              <FileText size={16} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{pendingDocsCount}</span>
            <span className="text-xs text-amber-600 font-semibold">Chờ xem xét</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Tổng cộng {documents.length} đơn gửi lên Khoa</p>
        </div>

        <div 
          onClick={() => setActiveTab('registrations')}
          className={`p-4 rounded-xl border cursor-pointer transition-all ${
            activeTab === 'registrations' 
              ? 'bg-emerald-50/50 border-emerald-300 ring-2 ring-emerald-500/10' 
              : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Đăng ký Sự kiện</span>
            <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700">
              <Calendar size={16} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{pendingRegsCount}</span>
            <span className="text-xs text-amber-600 font-semibold">Chờ cấp vé</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Sinh viên đăng ký các hoạt động phong trào</p>
        </div>

        <div 
          onClick={() => setActiveTab('proposals')}
          className={`p-4 rounded-xl border cursor-pointer transition-all ${
            activeTab === 'proposals' 
              ? 'bg-purple-50/50 border-purple-300 ring-2 ring-purple-500/10' 
              : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Đề xuất CLB & Đội nhóm</span>
            <div className="p-2 rounded-lg bg-purple-100 text-purple-700">
              <Sparkles size={16} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{pendingPropsCount}</span>
            <span className="text-xs text-amber-600 font-semibold">Chờ duyệt kinh phí/kế hoạch</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Hoạt động từ các CLB trực thuộc Khoa</p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        {/* Navigation Tabs & Search */}
        <div className="px-5 pt-4 pb-0 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('documents')}
              className={`pb-3.5 px-3 text-xs font-bold tracking-tight transition-all relative flex items-center gap-1.5 ${
                activeTab === 'documents'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <FileText size={15} />
              Văn bản & Giấy xác nhận
              <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-600">
                {documents.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('registrations')}
              className={`pb-3.5 px-3 text-xs font-bold tracking-tight transition-all relative flex items-center gap-1.5 ${
                activeTab === 'registrations'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Calendar size={15} />
              Duyệt Đăng ký Sự kiện
              <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-600">
                {registrations.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('proposals')}
              className={`pb-3.5 px-3 text-xs font-bold tracking-tight transition-all relative flex items-center gap-1.5 ${
                activeTab === 'proposals'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Sparkles size={15} />
              Đề xuất Hoạt động CLB
              <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-600">
                {proposals.length}
              </span>
            </button>
          </div>

          <div className="pb-3 w-full sm:w-72">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm kiếm trong tab này..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-8 pl-8 pr-3 text-xs rounded-lg border border-slate-200 outline-none focus:border-blue-500 bg-slate-50/50"
              />
            </div>
          </div>
        </div>

        {/* Tab 1: Digital Documents Table */}
        {activeTab === 'documents' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-200 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  <th className="py-3 px-5">Tên văn bản / Đơn từ</th>
                  <th className="py-3 px-4">Sinh viên / Người gửi</th>
                  <th className="py-3 px-4">Ngày gửi</th>
                  <th className="py-3 px-4">Trạng thái</th>
                  <th className="py-3 px-5 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {filteredDocs.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-12 text-center text-slate-400">
                      <FileText size={36} className="mx-auto text-slate-300 mb-2" />
                      Không có văn bản hoặc giấy xác nhận nào
                    </td>
                  </tr>
                ) : (
                  filteredDocs.map((doc) => (
                    <tr key={doc.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-5">
                        <div className="font-semibold text-slate-900">{doc.title || doc.name || 'Đơn xác nhận đoàn viên'}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{doc.description || doc.subject || 'Không có ghi chú thêm'}</div>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-800">
                        {doc.user_name || doc.sender || 'Sinh viên Khoa'}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500">
                        {doc.created_at ? new Date(doc.created_at).toLocaleDateString('vi-VN') : 'Hôm nay'}
                      </td>
                      <td className="py-3.5 px-4">
                        {doc.status === 'APPROVED' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 size={12} /> Đã phê duyệt
                          </span>
                        ) : doc.status === 'REJECTED' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                            <XCircle size={12} /> Đã từ chối
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                            <Clock size={12} /> Chờ duyệt
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => { setSelectedDoc(doc); setShowDocModal(true); }}
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Xem chi tiết"
                          >
                            <Eye size={15} />
                          </button>
                          {doc.status !== 'APPROVED' && (
                            <button
                              onClick={() => handleApproveDoc(doc.id)}
                              className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-all flex items-center gap-1"
                            >
                              <CheckCircle2 size={13} /> Duyệt
                            </button>
                          )}
                          {doc.status !== 'REJECTED' && (
                            <button
                              onClick={() => handleRejectDoc(doc.id)}
                              className="px-2 py-1.5 border border-slate-200 hover:bg-rose-50 hover:text-rose-600 text-slate-600 rounded-lg text-xs font-medium transition-all"
                            >
                              Từ chối
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 2: Event Registrations Table */}
        {activeTab === 'registrations' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-200 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  <th className="py-3 px-5">Sự kiện</th>
                  <th className="py-3 px-4">Họ tên Sinh viên</th>
                  <th className="py-3 px-4">Mã số SV</th>
                  <th className="py-3 px-4">Chi đoàn / Lớp</th>
                  <th className="py-3 px-4">Thời gian đăng ký</th>
                  <th className="py-3 px-5 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {filteredRegs.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-12 text-center text-slate-400">
                      <Calendar size={36} className="mx-auto text-slate-300 mb-2" />
                      Không có lượt đăng ký sự kiện nào cần duyệt
                    </td>
                  </tr>
                ) : (
                  filteredRegs.map((reg) => (
                    <tr key={reg.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-5 font-semibold text-slate-900">
                        {reg.event_name || 'Sự kiện Khoa'}
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-800">
                        {reg.user_full_name || reg.user_name || 'Sinh viên'}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-600">
                        {reg.student_code || '---'}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        {reg.class_name || 'Chi đoàn Khoa'}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500">
                        {reg.created_at ? new Date(reg.created_at).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' }) : 'Vừa xong'}
                      </td>
                      <td className="py-3.5 px-5 text-right">
                        <button
                          onClick={() => handleApproveReg(reg.id)}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-all inline-flex items-center gap-1"
                        >
                          <CheckCircle2 size={13} /> Duyệt vé
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 3: Club Proposals Table */}
        {activeTab === 'proposals' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-200 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  <th className="py-3 px-5">Tên đề xuất / Kế hoạch</th>
                  <th className="py-3 px-4">CLB / Đội nhóm</th>
                  <th className="py-3 px-4">Kinh phí dự trù</th>
                  <th className="py-3 px-4">Trạng thái</th>
                  <th className="py-3 px-5 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {filteredProps.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-12 text-center text-slate-400">
                      <Sparkles size={36} className="mx-auto text-slate-300 mb-2" />
                      Không có đề xuất hoạt động nào từ CLB
                    </td>
                  </tr>
                ) : (
                  filteredProps.map((prop) => (
                    <tr key={prop.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-5">
                        <div className="font-semibold text-slate-900">{prop.title}</div>
                        <div className="text-[11px] text-slate-500 line-clamp-1">{prop.description || 'Không có mô tả'}</div>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-purple-700">
                        {prop.club_name || 'CLB Khoa'}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-900">
                        {prop.estimated_budget ? `${prop.estimated_budget.toLocaleString()} đ` : '0 đ'}
                      </td>
                      <td className="py-3.5 px-4">
                        {prop.status === 'APPROVED' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 size={12} /> Đã duyệt
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                            <Clock size={12} /> Chờ Bí thư duyệt
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => { setSelectedProposal(prop); setShowProposalModal(true); }}
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Xem chi tiết"
                          >
                            <Eye size={15} />
                          </button>
                          {prop.status !== 'APPROVED' && (
                            <button
                              onClick={() => handleApproveProposal(prop.id)}
                              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-all inline-flex items-center gap-1"
                            >
                              <CheckCircle2 size={13} /> Phê duyệt
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Modal - Digital Document */}
      <Modal 
        isOpen={showDocModal} 
        onClose={() => setShowDocModal(false)} 
        title="Chi tiết Văn bản & Giấy xác nhận"
        size="md"
      >
        {selectedDoc && (
          <div className="space-y-4 py-2 text-xs">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <div>
                <span className="text-slate-400 font-semibold uppercase text-[10px] block">Tiêu đề</span>
                <span className="font-bold text-slate-900 text-sm">{selectedDoc.title || selectedDoc.name}</span>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <span className="text-slate-400 font-semibold uppercase text-[10px] block">Người gửi</span>
                  <span className="font-semibold text-slate-800">{selectedDoc.user_name || selectedDoc.sender || 'Sinh viên'}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold uppercase text-[10px] block">Ngày tạo</span>
                  <span className="text-slate-600">{selectedDoc.created_at ? new Date(selectedDoc.created_at).toLocaleString('vi-VN') : 'Gần đây'}</span>
                </div>
              </div>
            </div>

            <div>
              <span className="text-slate-500 font-semibold block mb-1">Nội dung chi tiết / Lý do:</span>
              <p className="p-3 bg-white border border-slate-200 rounded-xl text-slate-700 leading-relaxed">
                {selectedDoc.description || selectedDoc.content || 'Sinh viên yêu cầu xin giấy xác nhận đoàn viên hoàn thành nhiệm vụ năm học.'}
              </p>
            </div>

            {selectedDoc.file_url && (
              <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-700">
                <span className="font-medium flex items-center gap-2">
                  <FileText size={16} /> File đính kèm kèm theo
                </span>
                <a 
                  href={selectedDoc.file_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-[11px]"
                >
                  Tải xuống
                </a>
              </div>
            )}

            <div className="flex gap-2 pt-3 border-t border-slate-200">
              <button
                onClick={() => handleRejectDoc(selectedDoc.id)}
                className="flex-1 py-2 px-3 border border-slate-200 hover:bg-rose-50 hover:text-rose-600 rounded-lg text-slate-700 font-semibold transition-all"
              >
                Từ chối đơn
              </button>
              <button
                onClick={() => handleApproveDoc(selectedDoc.id)}
                className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-sm transition-all flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 size={14} /> Phê duyệt & Ký số
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Detail Modal - Club Proposal */}
      <Modal 
        isOpen={showProposalModal} 
        onClose={() => setShowProposalModal(false)} 
        title="Chi tiết Đề xuất Hoạt động CLB"
        size="md"
      >
        {selectedProposal && (
          <div className="space-y-4 py-2 text-xs">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <div>
                <span className="text-slate-400 font-semibold uppercase text-[10px] block">CLB Trình nộp</span>
                <span className="font-bold text-purple-700 text-sm">{selectedProposal.club_name}</span>
              </div>
              <div>
                <span className="text-slate-400 font-semibold uppercase text-[10px] block">Tên kế hoạch</span>
                <span className="font-bold text-slate-900">{selectedProposal.title}</span>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <span className="text-slate-400 font-semibold uppercase text-[10px] block">Kinh phí đề xuất</span>
                  <span className="font-bold text-slate-900">
                    {selectedProposal.estimated_budget ? `${selectedProposal.estimated_budget.toLocaleString()} đ` : '0 đ'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold uppercase text-[10px] block">Thời gian dự kiến</span>
                  <span className="text-slate-600">{selectedProposal.event_date || 'Trong tháng này'}</span>
                </div>
              </div>
            </div>

            <div>
              <span className="text-slate-500 font-semibold block mb-1">Mục tiêu & Kế hoạch tổ chức:</span>
              <p className="p-3 bg-white border border-slate-200 rounded-xl text-slate-700 leading-relaxed">
                {selectedProposal.description || 'Chương trình giao lưu và sinh hoạt chuyên đề định kỳ của CLB.'}
              </p>
            </div>

            <div className="flex gap-2 pt-3 border-t border-slate-200">
              <button
                onClick={() => setShowProposalModal(false)}
                className="flex-1 py-2 px-3 border border-slate-200 hover:bg-slate-50 rounded-lg text-slate-700 font-semibold transition-all"
              >
                Đóng
              </button>
              <button
                onClick={() => handleApproveProposal(selectedProposal.id)}
                className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-sm transition-all flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 size={14} /> Chấp thuận Đề xuất
              </button>
            </div>
          </div>
        )}
      </Modal>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default SubAdminApprovals;