import React, { useState, useEffect } from 'react';

const NotificationManager = () => {
  // --- 1. STATE QUẢN LÝ FORM ---
  const [title, setTitle] = useState("Thông báo quan trọng về Lịch thi học kỳ I");
  const [content, setContent] = useState("Nhà trường xin thông báo lịch thi chính thức học kỳ I năm học 2023-2024 đã được cập nhật trên cổng thông tin sinh viên. Đề nghị các bạn sinh viên theo dõi để đi thi đúng giờ.");
  const [target, setTarget] = useState("ALL");
  const [type, setType] = useState("info");
  const [loading, setLoading] = useState(false);

  // --- 2. STATE QUẢN LÝ DANH SÁCH ---
  const [history, setHistory] = useState([]);

  // --- 3. CÁC HÀM XỬ LÝ LOGIC ---

  // A. Lấy danh sách (Dùng cho cả nút Reload)
  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch("http://127.0.0.1:8000/api/v1/notifications/all", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setHistory(data);
      }
    } catch (error) {
      console.error("Lỗi lấy lịch sử:", error);
    }
  };

  // Gọi lần đầu khi vào trang
  useEffect(() => {
    fetchHistory();
  }, []);

  // B. Gửi / Lưu Nháp
  const submitNotification = async (status) => {
    if (!title.trim()) { alert("Vui lòng nhập tiêu đề!"); return; }
    if (status === 'SENT' && !content.trim()) { alert("Vui lòng nhập nội dung!"); return; }

    setLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch("http://127.0.0.1:8000/api/v1/notifications/", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({
          title, content, type, target_audience: target, status
        })
      });

      if (response.ok) {
        alert(status === 'DRAFT' ? "💾 Đã lưu bản nháp!" : "✅ Đã gửi thông báo!");
        if (status === 'SENT') { setTitle(""); setContent(""); }
        fetchHistory(); // Tự động reload danh sách
      } else {
        const err = await response.json();
        alert(`❌ Lỗi: ${err.detail}`);
      }
    } catch (error) { console.error(error); alert("Lỗi kết nối Server!"); } 
    finally { setLoading(false); }
  };

  // C. Chỉnh sửa (Load lại form)
  const handleEdit = (item) => {
    setTitle(item.title);
    setContent(item.content);
    setTarget(item.target_audience);
    setType(item.type);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // D. Xóa Thông Báo (MỚI THÊM)
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa thông báo này không? Hành động này không thể hoàn tác.")) {
        return;
    }

    try {
        const token = localStorage.getItem("access_token");
        const response = await fetch(`http://127.0.0.1:8000/api/v1/notifications/${id}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (response.ok) {
            alert("🗑️ Đã xóa thành công!");
            fetchHistory(); // Reload lại bảng ngay lập tức
        } else {
            alert("❌ Lỗi khi xóa thông báo!");
        }
    } catch (error) {
        console.error("Lỗi xóa:", error);
        alert("Lỗi kết nối Server!");
    }
  };

  // --- 4. GIAO DIỆN (JSX) ---
  return (
    <div className="flex flex-col h-full bg-[#f5f7f8] dark:bg-[#0f1a23] p-6 overflow-y-auto custom-scrollbar">
      <div className="max-w-[1280px] mx-auto w-full">

        {/* BREADCRUMBS & HEADER giữ nguyên */}
        <div className="flex flex-wrap items-center gap-2 mb-6 text-sm">
          <span className="text-slate-500 hover:text-primary font-medium flex items-center gap-1 cursor-pointer">
            <span className="material-symbols-outlined text-[18px]">home</span> Dashboard
          </span>
          <span className="text-slate-400">/</span>
          <span className="text-primary font-semibold">Quản Lý Thông Báo</span>
        </div>

        <div className="flex flex-wrap justify-between items-end gap-4 mb-8">
          <div>
            <h2 className="text-slate-900 dark:text-white text-3xl font-bold leading-tight">Quản Lý Thông Báo</h2>
            <p className="text-slate-500 mt-2 text-base">Soạn thảo và gửi thông báo đẩy đến ứng dụng sinh viên.</p>
          </div>
          <div className="flex gap-3">
             <button onClick={() => submitNotification('DRAFT')} disabled={loading} className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition-colors flex items-center gap-2 shadow-sm disabled:opacity-50">
               <span className="material-symbols-outlined text-[20px]">draft</span> {loading ? "Đang lưu..." : "Lưu Nháp"}
             </button>
          </div>
        </div>

        {/* MAIN FORM GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pb-10">
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-6 border-b border-slate-100 dark:border-slate-700 pb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">edit_note</span> Chi tiết thông báo
              </h3>
              
              <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
                <div className="flex flex-col gap-2">
                   <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">Tiêu Đề <span className="text-red-500">*</span></label>
                   <input className="w-full rounded-lg border-slate-300 dark:border-slate-600 dark:bg-slate-900 h-12 px-4 shadow-sm dark:text-white" placeholder="Nhập tiêu đề..." value={title} onChange={(e) => setTitle(e.target.value)} maxLength={50} />
                </div>
                <div className="flex flex-col gap-2">
                   <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">Nội Dung <span className="text-red-500">*</span></label>
                   <textarea className="w-full rounded-lg border-slate-300 dark:border-slate-600 dark:bg-slate-900 p-4 shadow-sm min-h-[140px] dark:text-white" placeholder="Nhập nội dung..." value={content} onChange={(e) => setContent(e.target.value)}></textarea>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="flex flex-col gap-2">
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">Gửi Đến</label>
                      <select value={target} onChange={(e) => setTarget(e.target.value)} className="w-full rounded-lg border-slate-300 dark:border-slate-600 dark:bg-slate-900 h-12 px-4 shadow-sm dark:text-white">
                         <option value="ALL">Toàn Trường</option>
                         <option value="STUDENT">Sinh Viên</option>
                         <option value="SUB_ADMIN">Ban Chấp Hành</option>
                      </select>
                   </div>
                   <div className="flex flex-col gap-2">
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">Loại Tin</label>
                      <select value={type} onChange={(e) => setType(e.target.value)} className="w-full rounded-lg border-slate-300 dark:border-slate-600 dark:bg-slate-900 h-12 px-4 shadow-sm dark:text-white">
                         <option value="info">Tin Tức</option>
                         <option value="urgent">Khẩn Cấp</option>
                         <option value="warning">Học Vụ</option>
                      </select>
                   </div>
                </div>

                <div className="pt-4">
                  <button onClick={() => submitNotification('SENT')} disabled={loading} className={`w-full h-14 font-bold text-lg rounded-xl shadow-lg transition-all flex items-center justify-center gap-3 active:scale-95 ${loading ? "bg-gray-400" : "bg-primary hover:bg-primary-hover text-white shadow-primary/30"}`}>
                    <span className="material-symbols-outlined">send</span> {loading ? "Processing..." : "GỬI THÔNG BÁO"}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* PREVIEW COMPONENT (Giữ nguyên cho gọn code) */}
          <div className="lg:col-span-5 sticky top-4">
            {/* ... Phần Live Preview giữ nguyên như cũ ... */}
             <div className="flex flex-col items-center">
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2"><span className="material-symbols-outlined text-[18px]">smartphone</span> Live Preview</h3>
                <div className="relative mx-auto border-slate-900 bg-slate-900 border-[14px] rounded-[2.5rem] h-[640px] w-[320px] shadow-2xl overflow-hidden ring-1 ring-slate-900/5">
                   {/* Status Bar */}
                   <div className="absolute top-0 inset-x-0 h-8 bg-black/20 z-20 flex justify-between items-center px-6"><span className="text-white text-[10px] font-medium">9:41</span><div className="flex gap-1"><span className="material-symbols-outlined text-white text-[12px]">wifi</span><span className="material-symbols-outlined text-white text-[12px]">battery_full</span></div></div>
                   {/* Screen */}
                   <div className="h-full w-full bg-cover bg-center relative" style={{ backgroundImage: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)' }}>
                      <div className="pt-16 text-center text-white/90 flex flex-col items-center"><span className="material-symbols-outlined mb-2 text-2xl opacity-80">lock</span><div className="text-6xl font-thin tracking-tight font-display">09:41</div><div className="text-lg font-normal opacity-80 mt-1">Thứ Hai, 11 Tháng 9</div></div>
                      <div className="mt-8 mx-3">
                         <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-lg">
                            <div className="flex items-start gap-3">
                               <div className="bg-primary rounded-lg size-10 flex items-center justify-center shrink-0"><span className="material-symbols-outlined text-white text-xl">school</span></div>
                               <div className="flex-1 min-w-0">
                                  <h4 className="text-slate-900 font-bold text-sm">LHU YouthHub</h4>
                                  <p className="text-slate-800 text-sm font-semibold leading-tight mb-1 truncate">{title || "Tiêu đề..."}</p>
                                  <p className="text-slate-600 text-xs leading-relaxed line-clamp-3">{content || "Nội dung..."}</p>
                                  <span className={`mt-2 inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${type === 'urgent' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>{type === 'urgent' ? 'Khẩn Cấp' : 'Tin Tức'}</span>
                               </div>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* --- BẢNG LỊCH SỬ & NHÁP --- */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden mb-12">
          <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-slate-400">history</span> Lịch sử & Bản nháp
            </h3>
            {/* NÚT RELOAD ĐÃ HOẠT ĐỘNG */}
            <button onClick={fetchHistory} className="text-primary hover:bg-slate-100 dark:hover:bg-slate-700 p-2 rounded-full transition-all" title="Làm mới danh sách">
              <span className="material-symbols-outlined text-[20px]">refresh</span>
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 dark:bg-slate-900/50 text-xs uppercase text-slate-500 font-bold">
                <tr>
                  <th className="px-6 py-4">Tiêu Đề</th>
                  <th className="px-6 py-4">Đối Tượng</th>
                  <th className="px-6 py-4">Trạng Thái</th>
                  <th className="px-6 py-4">Ngày Tạo</th>
                  <th className="px-6 py-4 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700 text-sm">
                {history.length === 0 ? (
                  <tr><td colSpan="5" className="px-6 py-8 text-center text-slate-400">Chưa có thông báo nào</td></tr>
                ) : (
                  history.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-900 dark:text-white max-w-[300px] truncate">{item.title}</td>
                      <td className="px-6 py-4"><span className="bg-blue-50 text-blue-600 border border-blue-100 px-2 py-1 rounded-md text-[11px] font-bold">{item.target_audience === 'ALL' ? 'Toàn Trường' : item.target_audience}</span></td>
                      <td className="px-6 py-4">
                        {item.status === 'DRAFT' 
                          ? <span className="flex items-center gap-2 text-amber-600 bg-amber-50 border border-amber-100 px-2 py-1 rounded-full w-fit font-medium text-xs"><span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span> Bản Nháp</span>
                          : <span className="flex items-center gap-2 text-green-600 bg-green-50 border border-green-100 px-2 py-1 rounded-full w-fit font-medium text-xs"><span className="h-1.5 w-1.5 rounded-full bg-green-500"></span> Đã Gửi</span>
                        }
                      </td>
                      <td className="px-6 py-4 text-slate-500 text-xs">{new Date(item.created_at).toLocaleString('vi-VN')}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-1">
                          <button onClick={() => handleEdit(item)} className="text-slate-400 hover:text-primary hover:bg-slate-100 p-2 rounded-lg transition-colors" title="Sửa / Dùng lại">
                            <span className="material-symbols-outlined text-[18px]">edit</span>
                          </button>
                          {/* NÚT XÓA ĐÃ ĐƯỢC KÍCH HOẠT */}
                          <button onClick={() => handleDelete(item.id)} className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors" title="Xóa vĩnh viễn">
                            <span className="material-symbols-outlined text-[18px]">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationManager;