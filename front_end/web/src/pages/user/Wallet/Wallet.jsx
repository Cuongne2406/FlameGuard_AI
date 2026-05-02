import React, { useContext, useEffect, useMemo, useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  Download,
  FileText,
  History,
  Info,
  Plus,
  QrCode,
  Wallet as WalletIcon,
  X,
} from "lucide-react";
import { AuthContext } from "../../../context/AuthContext";
import { financeService } from "../../../services/financeService";
import { userService } from "../../../services/userService";

const Modal = ({ title, onClose, children }) => (
  <div className="fixed inset-0 z-[999] flex items-center justify-center px-4">
    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose} />
    <div className="app-card relative z-10 w-full max-w-md overflow-hidden">
      <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 p-6">
        <h3 className="text-base font-black text-slate-800">{title}</h3>
        <button onClick={onClose} className="rounded-full p-2 text-slate-400 hover:bg-slate-100">
          <X size={18} />
        </button>
      </div>
      <div className="p-6">{children}</div>
    </div>
  </div>
);

const WalletPage = () => {
  const { user } = useContext(AuthContext);
  const [activeModal, setActiveModal] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [obligations, setObligations] = useState([]);
  const [spendingStats, setSpendingStats] = useState({ total_expense: 0, data: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [transData, obliData, spentData] = await Promise.all([
          financeService.getFacultyTransactions(),
          userService.getObligations(),
          userService.getSpendingStats(),
        ]);
        setTransactions(Array.isArray(transData) ? transData : []);
        setObligations(Array.isArray(obliData) ? obliData : []);
        setSpendingStats(spentData || { total_expense: 0, data: [] });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const normalizedTransactions = useMemo(
    () =>
      transactions.map((item) => {
        const amount = Number(String(item.amount || "0").replace(/[^0-9.-]+/g, "")) || 0;
        const isIncome =
          item.type === "Thu" || item.type === "income" || item.type === "INCOME";
        return {
          ...item,
          amount,
          isIncome,
        };
      }),
    [transactions]
  );

  const balance = normalizedTransactions.reduce(
    (acc, item) => (item.isIncome ? acc + item.amount : acc - item.amount),
    0
  );

  const totalExpense = normalizedTransactions.reduce(
    (acc, item) => (item.isIncome ? acc : acc + item.amount),
    0
  );

  const studentClass = user?.class_name || "Đoàn Nhóm";
  const nameParts = user?.full_name ? user.full_name.split(" ") : ["SV"];
  const firstName = nameParts[nameParts.length - 1].toUpperCase();
  const topUpCode = `NAP QUY ${firstName} ${studentClass}`;

  return (
    <div className="space-y-6">
      <section className="app-card overflow-hidden">
        <div className="app-hero relative px-5 pb-8 pt-6 md:px-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.22),transparent_28%)]" />
          <div className="relative grid gap-5 lg:grid-cols-[1.3fr_0.85fr]">
            <div>
              <div className="inline-flex rounded-full bg-white/18 px-3 py-1 text-[11px] font-black text-white">
                VÍ ĐOÀN VIÊN
              </div>
              <h2 className="mt-4 text-3xl font-black tracking-tight text-white md:text-4xl">
                Tài chính cá nhân & quỹ lớp
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/82">
                Trang ví trên web được kéo về đúng tinh thần app user: rõ số dư, thao tác nhanh và minh bạch giao dịch hơn.
              </p>
              <h3 className="mt-6 text-5xl font-black text-white">
                {balance.toLocaleString("vi-VN")}
                <span className="ml-2 text-2xl font-semibold text-white/80">VNĐ</span>
              </h3>
              <p className="mt-2 text-sm font-semibold uppercase tracking-[0.2em] text-white/72">
                Số dư khả dụng
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-2">
              <button
                onClick={() => setActiveModal("topup")}
                className="rounded-[24px] bg-orange-500 p-5 text-left text-white shadow-[0_16px_28px_rgba(234,88,12,0.22)]"
              >
                <Plus size={20} />
                <p className="mt-5 text-sm font-black uppercase">Nạp quỹ lớp</p>
              </button>
              <button
                onClick={() => setActiveModal("fee")}
                className="rounded-[24px] bg-white/16 p-5 text-left text-white backdrop-blur"
              >
                <CreditCard size={20} />
                <p className="mt-5 text-sm font-black uppercase">Đóng Đoàn phí</p>
              </button>
              <button
                onClick={() => setActiveModal("stats")}
                className="col-span-full rounded-[24px] bg-white/12 p-5 text-left text-white backdrop-blur"
              >
                <BarChart3 size={20} />
                <p className="mt-5 text-sm font-black uppercase">Xem sao kê lớp</p>
              </button>
            </div>
          </div>
        </div>

        <div className="grid gap-6 p-5 lg:grid-cols-[1.1fr_0.9fr] md:p-6">
          <div className="space-y-6">
            <div className="app-card p-6">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={18} className="text-indigo-600" />
                <h3 className="text-lg font-black text-slate-800">Nghĩa vụ tài chính</h3>
              </div>
              <div className="mt-5 space-y-3">
                {obligations.length > 0 ? (
                  obligations.map((item, index) => (
                    <div key={item.id || index} className="app-card-muted p-4">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-sm font-black text-slate-800">{item.title}</p>
                          <p className="mt-1 text-xs text-slate-500">Hạn chót: {item.due_date}</p>
                        </div>
                        <div className="text-right">
                          <span className="rounded-full bg-emerald-100 px-3 py-1 text-[10px] font-black uppercase text-emerald-600">
                            {item.status === "APPROVED" ? "Đã duyệt" : "Chờ nộp"}
                          </span>
                          <p className="mt-1 text-xs font-bold text-slate-500">
                            {Number(item.amount || 0).toLocaleString("vi-VN")} VNĐ
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="app-card-muted p-5 text-sm text-slate-500">
                    Không có nghĩa vụ tài chính nào cần xử lý.
                  </div>
                )}
              </div>
            </div>

            <div className="app-card p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BarChart3 size={18} className="text-indigo-600" />
                  <h3 className="text-lg font-black text-slate-800">Thống kê chi tiêu</h3>
                </div>
                <Info size={16} className="text-slate-300" />
              </div>

              <div className="mt-6 flex flex-col gap-8 md:flex-row md:items-center">
                <div className="relative mx-auto h-40 w-40">
                  <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#E2E8F0"
                      strokeWidth="3"
                    />
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#4F46E5"
                      strokeWidth="4"
                      strokeDasharray="50, 100"
                    />
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#F97316"
                      strokeWidth="4"
                      strokeDasharray="30, 100"
                      strokeDashoffset="-50"
                    />
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#94A3B8"
                      strokeWidth="4"
                      strokeDasharray="20, 100"
                      strokeDashoffset="-80"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
                      Tổng chi
                    </span>
                    <span className="mt-2 text-xl font-black text-slate-800">
                      {totalExpense.toLocaleString("vi-VN")}đ
                    </span>
                  </div>
                </div>

                <div className="flex-1 space-y-4">
                  {(spendingStats.data.length > 0
                    ? spendingStats.data
                    : [
                        { label: "Hoạt động ngoại khóa", value: "50%", color: "bg-indigo-600" },
                        { label: "Cơ sở vật chất", value: "30%", color: "bg-orange-500" },
                        { label: "Dự phòng", value: "20%", color: "bg-slate-400" },
                      ]
                  ).map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`h-2.5 w-2.5 rounded-full ${item.color || "bg-slate-400"}`} />
                        <span className="text-sm font-semibold text-slate-600">{item.label}</span>
                      </div>
                      <span className="text-sm font-black text-slate-800">
                        {typeof item.value === "number" ? `${item.value}%` : item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="app-card p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <History size={18} className="text-indigo-600" />
                <h3 className="text-lg font-black text-slate-800">Lịch sử giao dịch</h3>
              </div>
              <ChevronRight size={16} className="text-slate-300" />
            </div>

            <div className="mt-5 space-y-4">
              {loading ? (
                [1, 2, 3].map((item) => <div key={item} className="app-card-muted h-20 animate-pulse" />)
              ) : normalizedTransactions.length > 0 ? (
                normalizedTransactions.map((item) => (
                  <div key={item.id} className="app-card-muted p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-[16px] ${item.isIncome ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-500"}`}>
                          {item.isIncome ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-800">{item.title}</p>
                          <p className="mt-1 text-xs font-medium text-slate-500">{item.user || item.time || "Hệ thống"}</p>
                        </div>
                      </div>
                      <span className={`text-sm font-black ${item.isIncome ? "text-emerald-600" : "text-rose-500"}`}>
                        {item.isIncome ? "+" : "-"}
                        {Math.abs(item.amount).toLocaleString("vi-VN")} VNĐ
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="app-card-muted p-5 text-sm text-slate-500">
                  Chưa có giao dịch nào được ghi nhận.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {activeModal === "topup" && (
        <Modal title="Nạp quỹ lớp" onClose={() => setActiveModal(null)}>
          <div className="space-y-5 text-center">
            <div className="rounded-[24px] border-2 border-dashed border-orange-200 bg-orange-50 p-5">
              <div className="mx-auto flex h-[210px] w-[210px] items-center justify-center rounded-[24px] bg-white shadow-sm">
                <QrCode size={180} className="text-slate-800" />
              </div>
            </div>
            <div className="rounded-[20px] bg-slate-50 px-4 py-3 text-left">
              <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">Nội dung chuyển khoản</p>
              <p className="mt-2 text-sm font-black text-indigo-600">{topUpCode}</p>
            </div>
            <button className="w-full rounded-full bg-orange-500 px-5 py-3 text-sm font-black text-white">
              Tôi đã chuyển khoản
            </button>
          </div>
        </Modal>
      )}

      {activeModal === "fee" && (
        <Modal title="Đóng Đoàn phí" onClose={() => setActiveModal(null)}>
          <div className="space-y-5">
            <div className="rounded-[20px] bg-indigo-50 p-4 text-sm leading-7 text-indigo-800">
              Khoản phí này được nộp về Đoàn trường để duy trì các hoạt động phong trào và quyền lợi sinh viên.
            </div>
            <div className="rounded-[20px] border border-slate-100 bg-slate-50 p-5">
              <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">Mức nộp quy định</p>
              <p className="mt-2 text-2xl font-black text-slate-800">120.000 VNĐ</p>
            </div>
            <button className="w-full rounded-full bg-indigo-600 px-5 py-3 text-sm font-black text-white">
              Xác nhận thanh toán
            </button>
          </div>
        </Modal>
      )}

      {activeModal === "stats" && (
        <Modal title="Thống kê sao kê lớp" onClose={() => setActiveModal(null)}>
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-[20px] bg-emerald-50 p-4">
                <p className="text-[11px] font-black uppercase tracking-[0.18em] text-emerald-600">Tổng thu</p>
                <p className="mt-2 text-xl font-black text-emerald-700">{balance.toLocaleString("vi-VN")}đ</p>
              </div>
              <div className="rounded-[20px] bg-rose-50 p-4">
                <p className="text-[11px] font-black uppercase tracking-[0.18em] text-rose-500">Tổng chi</p>
                <p className="mt-2 text-xl font-black text-rose-600">{totalExpense.toLocaleString("vi-VN")}đ</p>
              </div>
            </div>

            <div className="space-y-3">
              {[
                { name: "Báo cáo tài chính tháng gần nhất", size: "1.2 MB" },
                { name: "Sao kê sự kiện gần nhất", size: "860 KB" },
              ].map((file) => (
                <div key={file.name} className="app-card-muted flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-[14px] bg-slate-100 text-slate-500">
                      <Download size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-700">{file.name}</p>
                      <p className="text-xs text-slate-400">{file.size}</p>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-slate-300" />
                </div>
              ))}
            </div>

            <button className="w-full rounded-full border border-slate-900 px-5 py-3 text-sm font-black text-slate-900">
              Xem chi tiết trên web
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default WalletPage;
