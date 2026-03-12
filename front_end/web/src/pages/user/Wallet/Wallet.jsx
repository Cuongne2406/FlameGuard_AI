import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { financeService } from "../../../services/financeService";
import {
  Wallet,
  Plus,
  CreditCard,
  BarChart3,
  History,
  CheckCircle2,
  Clock,
  ChevronRight,
  ArrowUpRight,
  ArrowDownLeft,
  Info,
  Calendar,
  X,
  QrCode,
  FileText,
  Download,
} from "lucide-react";

const WalletPage = () => {
  const { user } = useContext(AuthContext);
  const [activeModal, setActiveModal] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const data = await financeService.getTransactions();
        setTransactions(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchWallet();
  }, []);

  const studentClass = user?.class_name || 'Đoàn Nhóm';
  const nameParts = user?.full_name ? user.full_name.split(" ") : ["SV"];
  const firstName = nameParts[nameParts.length - 1].toUpperCase();
  const topUpCode = `NAP QUY ${firstName} ${studentClass}`;
  
  const balance = transactions.reduce((acc, t) => acc + (t.type === 'Thu' ? Number(t.amount.replace(/[^0-9.-]+/g,"")) : -Number(t.amount.replace(/[^0-9.-]+/g,""))), 0);
  const totalExpense = transactions.reduce((acc, t) => acc + (t.type === 'Chi' ? Number(t.amount.replace(/[^0-9.-]+/g,"")) : 0), 0);

  // Component Modal dùng chung để đồng bộ giao diện
  const Modal = ({ title, onClose, children }) => (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-[2.5rem] w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h3 className="font-black text-slate-800 uppercase tracking-tight text-sm">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-200 rounded-full transition-colors"
          >
            <X size={20} className="text-slate-500" />
          </button>
        </div>
        <div className="p-8">{children}</div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* HEADER SECTION */}
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-black text-slate-800">Ví Đoàn viên</h2>
        <p className="text-slate-500 text-sm font-medium">
          Quản lý quỹ lớp và tài chính cá nhân an toàn, minh bạch.
        </p>
      </div>

      {/* BALANCE CARD (GRADIENT) */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-[2.5rem] p-8 text-white shadow-xl shadow-blue-200/50">
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-white/20 backdrop-blur-md rounded-lg">
                <Wallet size={20} />
              </div>
              <span className="text-sm font-bold opacity-90 tracking-wide uppercase">
                Ví của tôi
              </span>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-1.5 w-fit mb-4">
              <span className="text-[10px] font-black flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                ĐÃ HOÀN THÀNH NGHĨA VỤ PHÍ THÁNG 03/2026
              </span>
            </div>

            <h1 className="text-5xl font-black tracking-tight mb-2">
              {balance.toLocaleString("vi-VN")}{" "}
              <span className="text-2xl font-medium opacity-80">VNĐ</span>
            </h1>
            <p className="text-sm font-bold opacity-70 uppercase tracking-widest">
              Số dư Quỹ lớp khả dụng
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setActiveModal("topup")}
              className="flex flex-col items-center justify-center gap-2 p-4 bg-orange-500 hover:bg-orange-600 rounded-[1.5rem] transition-all shadow-lg shadow-orange-900/20 group"
            >
              <Plus
                size={24}
                className="group-hover:rotate-90 transition-transform"
              />
              <span className="text-xs font-black uppercase">Nạp quỹ lớp</span>
            </button>
            <button
              onClick={() => setActiveModal("fee")}
              className="flex flex-col items-center justify-center gap-2 p-4 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-[1.5rem] transition-all"
            >
              <CreditCard size={24} />
              <span className="text-xs font-black uppercase">
                Đóng Đoàn phí
              </span>
            </button>
            <button
              onClick={() => setActiveModal("stats")}
              className="col-span-2 flex items-center justify-center gap-2 p-4 bg-indigo-500/50 hover:bg-indigo-500/70 border border-white/10 rounded-[1.5rem] transition-all"
            >
              <BarChart3 size={20} />
              <span className="text-xs font-black uppercase">
                Xem sao kê lớp
              </span>
            </button>
          </div>
        </div>

        {/* Abstract Background Shapes */}
        <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-20%] left-[-5%] w-48 h-48 bg-purple-400/20 rounded-full blur-3xl"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: Nghĩa vụ */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-[2rem] border border-slate-100 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-sm font-black text-slate-800 flex items-center gap-2 uppercase tracking-wider">
                <CheckCircle2 className="text-blue-600" size={18} /> Nghĩa vụ
                Đoàn viên & Hội viên
              </h4>
              <button className="text-blue-600 text-[10px] font-black uppercase hover:underline">
                Xem tất cả
              </button>
            </div>

            <div className="space-y-4">
              {/* Item 1 */}
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50/50 border border-transparent hover:border-blue-100 transition-all group">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                  <span className="text-xl">🎓</span>
                </div>
                <div className="flex-1">
                  <h5 className="text-sm font-bold text-slate-800">
                    Đoàn phí năm học 2025-2026
                  </h5>
                  <p className="text-[11px] text-slate-400 font-medium tracking-tight">
                    Hạn chót: 31/01/2026
                  </p>
                </div>
                <div className="text-right">
                  <span className="bg-emerald-50 text-emerald-600 text-[10px] font-black px-2 py-1 rounded uppercase flex items-center gap-1">
                    <CheckCircle2 size={10} /> Đã nộp
                  </span>
                  <p className="text-[9px] text-slate-400 mt-1 font-bold">
                    10/01/2026
                  </p>
                </div>
              </div>

              {/* Item 2 */}
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50/50 border border-transparent hover:border-blue-100 transition-all">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600">
                  <span className="text-xl">🍱</span>
                </div>
                <div className="flex-1">
                  <h5 className="text-sm font-bold text-slate-800">
                    Quỹ lớp tháng 03/2026
                  </h5>
                  <p className="text-[11px] text-slate-400 font-medium tracking-tight">
                    Hạn chót: 15/03/2026
                  </p>
                </div>
                <span className="bg-emerald-50 text-emerald-600 text-[10px] font-black px-2 py-1 rounded uppercase">
                  Đã hoàn thành
                </span>
              </div>

              {/* Item 3 */}
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50/50 border border-transparent hover:border-blue-100 transition-all opacity-80">
                <div className="w-12 h-12 bg-slate-200 rounded-xl flex items-center justify-center text-slate-500">
                  <Calendar size={24} />
                </div>
                <div className="flex-1">
                  <h5 className="text-sm font-bold text-slate-800">
                    Quỹ lớp tháng 04/2026
                  </h5>
                  <p className="text-[11px] text-slate-400 font-medium tracking-tight italic">
                    Sắp tới
                  </p>
                </div>
                <div className="text-right">
                  <span className="bg-amber-50 text-amber-600 text-[10px] font-black px-2 py-1 rounded uppercase flex items-center gap-1">
                    <Clock size={10} /> Chờ thanh toán
                  </span>
                  <p className="text-[9px] text-slate-400 mt-1 font-bold">
                    Mở sau 15 ngày
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Biểu đồ chi tiêu */}
          <div className="bg-white rounded-[2rem] border border-slate-100 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-sm font-black text-slate-800 flex items-center gap-2 uppercase tracking-wider">
                <BarChart3 className="text-blue-600" size={18} /> Biểu đồ chi
                tiêu của Lớp {studentClass}
              </h4>
              <Info size={16} className="text-slate-300" />
            </div>
            <p className="text-[11px] text-slate-400 font-medium mb-8">
              Dữ liệu được cập nhật tự động từ Ban Cán sự lớp.
            </p>

            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="relative w-40 h-40">
                <svg
                  viewBox="0 0 36 36"
                  className="w-full h-full transform -rotate-90"
                >
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#e2e8f0"
                    strokeWidth="3"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#2563eb"
                    strokeWidth="4"
                    strokeDasharray="50, 100"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#f97316"
                    strokeWidth="4"
                    strokeDasharray="30, 100"
                    strokeDashoffset="-50"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#94a3b8"
                    strokeWidth="4"
                    strokeDasharray="20, 100"
                    strokeDashoffset="-80"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase leading-none">
                    Tổng chi
                  </span>
                  <span className="text-lg font-black text-slate-800 tracking-tighter">
                    {totalExpense > 0 ? `${(totalExpense / 1000000).toFixed(1)}tr` : '0đ'}
                  </span>
                </div>
              </div>

              <div className="flex-1 space-y-4 w-full">
                {[
                  {
                    label: "Hoạt động ngoại khóa",
                    value: "50%",
                    color: "bg-blue-600",
                  },
                  {
                    label: "Cơ sở vật chất",
                    value: "30%",
                    color: "bg-orange-500",
                  },
                  { label: "Dự phòng", value: "20%", color: "bg-slate-400" },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-2.5 h-2.5 rounded-full ${item.color}`}
                      ></div>
                      <span className="text-xs font-bold text-slate-600 group-hover:text-slate-900 transition-colors">
                        {item.label}
                      </span>
                    </div>
                    <span className="text-xs font-black text-slate-800">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Lịch sử */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-[2rem] border border-slate-100 p-6 shadow-sm sticky top-24">
            <div className="flex items-center justify-between mb-8">
              <h4 className="text-sm font-black text-slate-800 flex items-center gap-2 uppercase tracking-wider">
                <History className="text-blue-600" size={18} /> Lịch sử giao
                dịch
              </h4>
              <button className="p-2 bg-slate-50 text-slate-400 rounded-lg hover:text-blue-600 transition-colors">
                <ChevronRight size={18} />
              </button>
            </div>

            <div className="space-y-6">
              {loading ? (
                <p className="text-xs text-slate-400 font-bold text-center">Đang tải lịch sử...</p>
              ) : transactions.length === 0 ? (
                <p className="text-xs text-slate-400 font-bold text-center">Chưa có giao dịch nào.</p>
              ) : (
                transactions.map((t) => (
                  <div
                    key={t.id}
                    className="flex items-center justify-between group cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${
                          t.type === "income"
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-red-50 text-red-500"
                        }`}
                      >
                        {t.type === "income" ? (
                          <ArrowDownLeft size={18} />
                        ) : (
                          <ArrowUpRight size={18} />
                        )}
                      </div>
                      <div>
                        <h6 className="text-[13px] font-black text-slate-800 leading-none mb-1 group-hover:text-blue-600 transition-colors">
                          {t.title}
                        </h6>
                        <p className="text-[10px] text-slate-400 font-bold">
                          {t.time}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-[13px] font-black ${
                        t.type === "income" ? "text-emerald-500" : "text-red-500"
                      }`}
                    >
                      {t.type === "income" ? "+" : "-"}
                      {Math.abs(t.amount).toLocaleString()} VNĐ
                    </span>
                  </div>
                ))
              )}
            </div>

            <button className="w-full mt-8 py-3 text-[11px] font-black text-blue-600 hover:bg-blue-50 rounded-2xl transition-all uppercase tracking-widest border border-dashed border-blue-200">
              Xem tất cả lịch sử
            </button>
          </div>
        </div>
      </div>

      {/* --- PHẦN MODAL BỔ SUNG --- */}

      {/* 1. Modal Nạp Quỹ Lớp */}
      {activeModal === "topup" && (
        <Modal title="Nạp Quỹ Lớp" onClose={() => setActiveModal(null)}>
          <div className="space-y-6 flex flex-col items-center">
            <div className="w-full p-6 bg-orange-50 rounded-[2rem] border-2 border-dashed border-orange-200 flex flex-col items-center gap-4 text-center">
              <div className="bg-white p-4 rounded-3xl shadow-sm border border-orange-100">
                <QrCode size={180} className="text-slate-800" />
              </div>
              <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest leading-relaxed">
                Quét mã VietQR để thanh toán nhanh
                <br />
                Hệ thống tự động cộng tiền sau 1-2 phút
              </p>
            </div>
            <div className="w-full space-y-3">
              <div className="flex justify-between items-center px-4 py-3 bg-slate-50 rounded-xl">
                <span className="text-[10px] font-black text-slate-400 uppercase">
                  Nội dung CK:
                </span>
                <span className="text-xs font-black text-blue-600">
                  {topUpCode}
                </span>
              </div>
            </div>
            <button
              onClick={() => setActiveModal(null)}
              className="w-full py-4 bg-orange-500 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-orange-600 shadow-lg shadow-orange-100"
            >
              Tôi đã chuyển khoản
            </button>
          </div>
        </Modal>
      )}

      {/* 2. Modal Đóng Đoàn Phí */}
      {activeModal === "fee" && (
        <Modal title="Đóng Đoàn Phí" onClose={() => setActiveModal(null)}>
          <div className="space-y-6">
            <div className="p-4 bg-blue-50 rounded-2xl flex gap-3">
              <Info size={20} className="text-blue-600 shrink-0" />
              <p className="text-[11px] font-medium text-blue-800 leading-normal">
                Khoản phí này được nộp về văn phòng Đoàn trường để duy trì các
                hoạt động phong trào và quyền lợi sinh viên năm học 2025-2026.
              </p>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-slate-100 rounded-2xl">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase">
                    Mức nộp quy định
                  </p>
                  <p className="text-xl font-black text-slate-800">
                    120.000 VNĐ
                  </p>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                  <FileText size={20} />
                </div>
              </div>
            </div>
            <button
              onClick={() => setActiveModal(null)}
              className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-blue-700 shadow-lg shadow-blue-200"
            >
              Xác nhận thanh toán
            </button>
          </div>
        </Modal>
      )}

      {/* 3. Modal Sao Kê */}
      {activeModal === "stats" && (
        <Modal title="Thống kê sao kê lớp" onClose={() => setActiveModal(null)}>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                <p className="text-[10px] font-black text-emerald-600 uppercase mb-1">
                  Tổng thu
                </p>
                <p className="text-lg font-black text-emerald-700">15.2tr</p>
              </div>
              <div className="p-4 bg-red-50 rounded-2xl border border-red-100">
                <p className="text-[10px] font-black text-red-500 uppercase mb-1">
                  Tổng chi
                </p>
                <p className="text-lg font-black text-red-600">12.5tr</p>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">
                Báo cáo gần nhất
              </p>
              {[
                { name: "Báo cáo tài chính Tháng 02/2026", size: "1.2 MB" },
                { name: "Sao kê chi tiết Tech Day 2026", size: "850 KB" },
              ].map((file, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 border border-slate-50 hover:bg-slate-50 rounded-xl transition-all group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                      <Download size={16} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-700">
                        {file.name}
                      </p>
                      <p className="text-[9px] font-medium text-slate-400">
                        {file.size}
                      </p>
                    </div>
                  </div>
                  <ChevronRight size={14} className="text-slate-300" />
                </div>
              ))}
            </div>

            <button
              onClick={() => setActiveModal(null)}
              className="w-full py-4 border-2 border-slate-900 text-slate-900 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-slate-900 hover:text-white transition-all"
            >
              Xem chi tiết trên Web
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default WalletPage;
