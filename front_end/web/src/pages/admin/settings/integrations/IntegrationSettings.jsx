import React from 'react';

const IntegrationSettings = () => {
  // Mock Data cho các dịch vụ tích hợp
  const services = [
    {
      id: 1,
      name: "Microsoft 365",
      desc: "Đăng nhập & Lưu trữ",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/2048px-Microsoft_logo.svg.png", // Dùng link logo thật cho đẹp
      isImage: true,
      status: "connected",
      statusLabel: "Đã kết nối",
      info: "Cập nhật: 2 giờ trước"
    },
    {
      id: 2,
      name: "Google Firebase",
      desc: "Thông báo & Dữ liệu",
      logo: "https://firebase.google.com/static/images/brand-guidelines/logo-logomark.png",
      isImage: true,
      status: "connected",
      statusLabel: "Đã kết nối",
      info: "Cập nhật: 1 ngày trước"
    },
    {
      id: 3,
      name: "VNPay Payment",
      desc: "Cổng thanh toán phí",
      logo: "VNPAY", // Text Logo
      isImage: false,
      status: "active",
      statusLabel: "Đang hoạt động",
      info: "Môi trường: Production"
    },
    {
      id: 4,
      name: "SMS Brandname",
      desc: "Tin nhắn định danh",
      logo: "sms", // Icon Material
      isIcon: true,
      status: "pending",
      statusLabel: "Đang chờ",
      info: "Số dư: 0 VNĐ"
    }
  ];

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 pb-20">
      
      {/* Page Heading */}
      <div className="flex flex-col gap-1 px-2">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Cấu hình Tích Hợp</h2>
        <p className="text-slate-500 text-sm">Quản lý kết nối với các dịch vụ bên thứ ba và API hệ thống.</p>
      </div>

      {/* Grid Services */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map(service => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>

      {/* Webhooks Section */}
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Webhooks & API Keys</h3>
            <p className="text-xs text-slate-500 mt-1">Cấu hình endpoint nhận dữ liệu từ các dịch vụ khác.</p>
          </div>
          <button className="text-primary text-xs font-bold flex items-center gap-1 hover:underline">
            <span className="material-symbols-outlined text-sm font-bold">add</span> Thêm Webhook
          </button>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-800 group">
            <div className="flex items-center gap-4">
              <span className="material-symbols-outlined text-slate-400">link</span>
              <div>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">System Activity Sync</p>
                <p className="text-xs text-slate-500 font-mono">https://api.youthhub.lhu.edu.vn/webhooks/activity</p>
              </div>
            </div>
            <button 
              className="material-symbols-outlined text-slate-400 hover:text-primary transition-colors active:scale-95"
              title="Copy URL"
              onClick={() => navigator.clipboard.writeText("https://api.youthhub.lhu.edu.vn/webhooks/activity")}
            >
              content_copy
            </button>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Action Bar */}
      <div className="sticky bottom-8 flex justify-end z-20">
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-xl flex items-center gap-4">
          <span className="text-xs text-slate-400 font-medium px-2 italic">Thay đổi chưa được lưu...</span>
          <button className="bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-slate-50 transition-all border dark:border-slate-700">
            Hủy bỏ
          </button>
          <button className="bg-accent text-white px-8 py-2.5 rounded-lg text-sm font-bold shadow-lg shadow-accent/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">save</span>
            Lưu Thay Đổi
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Sub Component: Service Card ---
const ServiceCard = ({ service }) => {
  // Logic hiển thị Badge trạng thái
  let badgeClass = "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700";
  if (service.status === 'connected' || service.status === 'active') {
    badgeClass = "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400";
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 flex flex-col justify-between hover:shadow-md transition-shadow group">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="size-12 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center border border-slate-100 dark:border-slate-700 overflow-hidden p-2">
            {service.isImage ? (
              <img alt={service.name} className="size-full object-contain" src={service.logo} />
            ) : service.isIcon ? (
               <span className="material-symbols-outlined text-slate-400">{service.logo}</span>
            ) : (
               <span className="text-primary font-black text-xs">{service.logo}</span>
            )}
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white">{service.name}</h3>
            <p className="text-xs text-slate-500">{service.desc}</p>
          </div>
        </div>
        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-transparent ${badgeClass}`}>
          {service.statusLabel}
        </span>
      </div>
      
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-50 dark:border-slate-800">
        <p className="text-xs text-slate-500">{service.info}</p>
        <button className="text-primary text-xs font-bold hover:bg-primary/5 px-3 py-1.5 rounded-lg transition-colors border border-primary/20 group-hover:bg-primary group-hover:text-white group-hover:border-primary">
          Cấu hình
        </button>
      </div>
    </div>
  );
};

export default IntegrationSettings;