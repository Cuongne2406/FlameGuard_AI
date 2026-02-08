import React, { useState } from 'react';

const HelpCenter = () => {
  // State quản lý FAQ mở/đóng
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  // Dữ liệu mẫu FAQ
  const faqs = [
    {
      question: "Làm thế nào để thêm sinh viên mới vào hệ thống?",
      answer: "Bạn có thể vào mục 'Quản lý sinh viên', chọn nút 'Thêm mới' ở góc phải. Hệ thống hỗ trợ nhập thủ công hoặc Import qua file Excel."
    },
    {
      question: "Tôi quên mật khẩu quản trị viên thì phải làm sao?",
      answer: "Vui lòng liên hệ trực tiếp với bộ phận IT của nhà trường hoặc gửi yêu cầu qua form bên dưới. Vì lý do bảo mật, tính năng 'Quên mật khẩu' tự động đang bị tắt đối với Admin."
    },
    {
      question: "Thông báo trên Mobile App bị chậm?",
      answer: "Hãy kiểm tra đường truyền mạng và đảm bảo sinh viên đã bật quyền nhận thông báo cho ứng dụng LHU Youth trong cài đặt điện thoại."
    },
    {
      question: "Làm sao để tích hợp thanh toán VNPay?",
      answer: "Truy cập 'Cài đặt hệ thống' -> 'Tích hợp'. Bạn cần có Merchant ID và Secret Key từ VNPay để kích hoạt."
    }
  ];

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-500 pb-20">
      
      {/* Header */}
      <div className="flex flex-col gap-1 px-2">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Trung tâm hỗ trợ</h2>
        <p className="text-slate-500 text-sm">Giải đáp thắc mắc và liên hệ với đội ngũ kỹ thuật.</p>
      </div>

      {/* --- Section 1: Kênh liên hệ nhanh --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ContactCard 
          icon="support_agent" 
          title="Hotline Kỹ Thuật" 
          value="0251 3952 778" 
          color="text-orange-600 bg-orange-50 dark:bg-orange-900/20"
        />
        <ContactCard 
          icon="mail" 
          title="Email Hỗ Trợ" 
          value="it@lhu.edu.vn" 
          color="text-blue-600 bg-blue-50 dark:bg-blue-900/20"
        />
        <ContactCard 
          icon="forum" 
          title="Zalo Support" 
          value="09xxxxxxxxx" 
          color="text-green-600 bg-green-50 dark:bg-green-900/20"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* --- Section 2: FAQ (Câu hỏi thường gặp) --- */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden h-fit">
          <div className="p-6 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">quiz</span>
              Câu hỏi thường gặp
            </h3>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {faqs.map((faq, index) => (
              <div key={index} className="group">
                <button 
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 group-hover:text-primary transition-colors">
                    {faq.question}
                  </span>
                  <span className={`material-symbols-outlined text-slate-400 transition-transform duration-300 ${openFaqIndex === index ? 'rotate-180' : ''}`}>
                    expand_more
                  </span>
                </button>
                <div 
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${openFaqIndex === index ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}
                >
                  <p className="p-4 pt-0 text-sm text-slate-500 leading-relaxed bg-slate-50/50 dark:bg-slate-800/30">
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- Section 3: Form gửi yêu cầu --- */}
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden h-fit">
          <div className="p-6 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">bug_report</span>
              Báo lỗi / Góp ý
            </h3>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Tiêu đề</label>
              <input type="text" className="w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-700 dark:bg-slate-800 text-sm focus:outline-none focus:border-primary transition-colors" placeholder="Vd: Lỗi không gửi được mail..." />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Mô tả chi tiết</label>
              <textarea className="w-full h-32 p-3 rounded-lg border border-slate-200 dark:border-slate-700 dark:bg-slate-800 text-sm focus:outline-none focus:border-primary transition-colors resize-none" placeholder="Mô tả vấn đề bạn gặp phải..."></textarea>
            </div>
            <button className="w-full bg-slate-900 dark:bg-white dark:text-slate-900 text-white font-bold h-10 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 text-sm">
              <span className="material-symbols-outlined text-lg">send</span>
              Gửi yêu cầu
            </button>
            <p className="text-xs text-center text-slate-400">Chúng tôi sẽ phản hồi qua Email trong vòng 24h.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Sub-component Card liên hệ
const ContactCard = ({ icon, title, value, color }) => (
  <div className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center gap-4 hover:shadow-md transition-shadow cursor-default">
    <div className={`size-12 rounded-full flex items-center justify-center ${color}`}>
      <span className="material-symbols-outlined text-2xl">{icon}</span>
    </div>
    <div>
      <p className="text-xs text-slate-500 font-medium">{title}</p>
      <p className="text-base font-bold text-slate-900 dark:text-white">{value}</p>
    </div>
  </div>
);

export default HelpCenter;