import React from "react";
import {
  ShieldCheck,
  Key,
  Globe,
  Database,
  Plus,
  ExternalLink,
  ShieldAlert,
  EyeOff,
} from "lucide-react";
import { SectionCard } from "../ui/SectionCard";
import { Toggle } from "../ui/Toggle";

const TabSecurity = () => {
  const apiKeys = [
    {
      name: "Mobile App (Student)",
      prefix: "pk_live_...4a2b",
      lastUsed: "Vừa xong",
    },
    {
      name: "Financial Service",
      prefix: "sk_live_...99x1",
      lastUsed: "2 giờ trước",
    },
    {
      name: "Public Website",
      prefix: "pk_test_...11z9",
      lastUsed: "1 ngày trước",
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* CỘT TRÁI: BẢO MẬT TRUY CẬP & DỮ LIỆU */}
      <div className="space-y-6">
        {/* Bảo mật truy cập */}
        <SectionCard
          title="Bảo mật Truy cập (Access Security)"
          icon={<ShieldCheck size={16} className="text-blue-600" />}
        >
          <div className="space-y-6">
            <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="space-y-1">
                <p className="text-xs font-black text-slate-700">
                  2FA Enforcement
                </p>
                <p className="text-[10px] text-slate-400 font-bold">
                  Yêu cầu xác thực hai bước cho Admin
                </p>
              </div>
              <Toggle checked={false} />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Session Timeout
                </label>
                <span className="text-xs font-black text-blue-600">
                  30 mins
                </span>
              </div>
              <input
                type="range"
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-[10px] font-bold text-slate-300">
                <span>5m</span>
                <span>120m</span>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Password Policy
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  "Min length: 12 chars",
                  "Require Symbols (!@#)",
                  "Require Uppercase",
                  "Expire after 90 days",
                ].map((policy, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 p-3 bg-white border border-slate-100 rounded-xl shadow-sm"
                  >
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center ${i < 3 ? "bg-blue-600 border-blue-600" : "border-slate-200"}`}
                    >
                      {i < 3 && (
                        <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                      )}
                    </div>
                    <span className="text-[10px] font-bold text-slate-600">
                      {policy}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </SectionCard>

        {/* Bảo vệ dữ liệu */}
        <SectionCard
          title="Bảo vệ Dữ liệu (Data Protection)"
          icon={<Database size={16} className="text-blue-600" />}
        >
          <div className="space-y-5">
            <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100 flex items-start gap-4">
              <div className="p-2 bg-white rounded-xl shadow-sm">
                <ShieldAlert size={20} className="text-blue-600" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-black text-blue-900">
                  Chuẩn mã hóa cấp cao
                </p>
                <p className="text-[10px] text-blue-600/70 font-bold leading-relaxed">
                  Dữ liệu nhạy cảm được mã hóa bằng thuật toán AES-256 trước khi
                  lưu trữ.
                </p>
              </div>
            </div>

            <div className="flex justify-between items-center px-2">
              <div className="space-y-0.5">
                <p className="text-xs font-black text-slate-700">
                  Daily Backup (Auto)
                </p>
                <p className="text-[10px] text-slate-400 font-bold">
                  Tự động sao lưu lúc 02:00 AM
                </p>
              </div>
              <Toggle checked={true} />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                IP Whitelisting (Admin Access Only)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="192.168.1.1"
                  className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:bg-white"
                />
                <button className="p-2.5 bg-slate-800 text-white rounded-xl hover:bg-black transition-all">
                  <Plus size={18} />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-lg text-[10px] font-black">
                  113.22.19.102 (Office) ×
                </span>
                <span className="px-3 py-1 bg-slate-100 text-slate-500 border border-slate-200 rounded-lg text-[10px] font-black">
                  14.232.112.55 (VPN) ×
                </span>
              </div>
            </div>
          </div>
        </SectionCard>
      </div>

      {/* CỘT PHẢI: API & WEBHOOKS */}
      <div className="space-y-6">
        {/* API Gateway */}
        <SectionCard
          title="API Gateway & Integrations"
          icon={<Key size={16} className="text-blue-600" />}
        >
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-2">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Active API Keys
              </p>
              <button className="text-[10px] font-black text-blue-600 flex items-center gap-1 hover:underline">
                <Plus size={12} /> Generate New Key
              </button>
            </div>

            <div className="divide-y divide-slate-50 border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
              {apiKeys.map((key, i) => (
                <div
                  key={i}
                  className="p-4 bg-white flex justify-between items-center hover:bg-slate-50 transition-colors"
                >
                  <div className="space-y-1">
                    <p className="text-xs font-black text-slate-700">
                      {key.name}
                    </p>
                    <p className="text-[10px] font-mono text-slate-400">
                      {key.prefix}
                    </p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-[10px] font-bold text-slate-300 uppercase tracking-tighter">
                      Last used
                    </p>
                    <p className="text-[10px] font-black text-slate-500">
                      {key.lastUsed}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 p-3 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-[10px] font-black text-emerald-700 uppercase">
                  LDAP/SSO Connected
                </span>
              </div>
              <ExternalLink size={14} className="text-emerald-400" />
            </div>
          </div>
        </SectionCard>

        {/* Webhooks */}
        <SectionCard
          title="Webhooks Configuration"
          icon={<Globe size={16} className="text-blue-600" />}
        >
          <div className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase">
                Callback URL (Event: USER.CREATED)
              </label>
              <input
                type="text"
                defaultValue="https://api.dyus-university.edu.vn/webhook"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 outline-none focus:bg-white"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase">
                Secret Key
              </label>
              <div className="relative">
                <input
                  type="password"
                  defaultValue="••••••••••••••••••••••••••••"
                  className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 outline-none"
                />
                <EyeOff
                  size={16}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 cursor-pointer"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-slate-400 uppercase">
                  Status:
                </span>
                <span className="text-[10px] font-black text-emerald-500 uppercase">
                  Active
                </span>
              </div>
              <button className="px-5 py-2 border border-slate-200 rounded-xl text-[10px] font-black text-slate-600 hover:bg-slate-50 transition-all">
                Test Connection
              </button>
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
};

export default TabSecurity;
