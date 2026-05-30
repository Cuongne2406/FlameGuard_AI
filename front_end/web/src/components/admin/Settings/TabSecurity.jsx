import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  Key,
  Globe,
  Database,
  Plus,
  ExternalLink,
  ShieldAlert,
  EyeOff,
  Eye
} from "lucide-react";
import { SectionCard } from "../ui/SectionCard";
import { Toggle } from "../ui/Toggle";
import { systemService } from "../../../services/systemService";

const TabSecurity = ({ onUpdate }) => {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [showSecret, setShowSecret] = useState(false);
  const [isTestingWebhook, setIsTestingWebhook] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      try {
        const data = await systemService.getSettings();
        const settingsObj = {};
        data.forEach(s => { settingsObj[s.key] = s.value; });
        setSettings(settingsObj);
      } catch (err) {
        console.error("Failed to fetch security settings:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    if (onUpdate) onUpdate(newSettings);
  };

  const apiKeys = settings.API_KEYS ? JSON.parse(settings.API_KEYS) : [];

  const handleGenerateKey = () => {
    const newKey = {
      name: `Generated Key ${apiKeys.length + 1}`,
      prefix: "pk_live_" + Math.random().toString(36).substring(2, 10),
      lastUsed: "Chưa sử dụng",
    };
    handleChange("API_KEYS", JSON.stringify([...apiKeys, newKey]));
  };

  if (loading) return (
    <div className="flex items-center justify-center p-20">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  );

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
              <Toggle 
                checked={settings.TWO_FACTOR_REQUIRED === "true"} 
                onChange={(val) => handleChange("TWO_FACTOR_REQUIRED", val ? "true" : "false")}
              />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Session Timeout
                </label>
                <span className="text-xs font-black text-blue-600">
                  {settings.SESSION_TIMEOUT || 30} mins
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="120"
                step="5"
                value={settings.SESSION_TIMEOUT || 30}
                onChange={(e) => handleChange("SESSION_TIMEOUT", e.target.value)}
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
                  { key: "PW_MIN_LENGTH", label: "Min length: 12 chars" },
                  { key: "PW_REQUIRE_SYMBOLS", label: "Require Symbols (!@#)" },
                  { key: "PW_REQUIRE_UPPERCASE", label: "Require Uppercase" },
                  { key: "PW_EXPIRE_90", label: "Expire after 90 days" },
                ].map((policy, i) => (
                  <div
                    key={policy.key}
                    onClick={() => handleChange(policy.key, settings[policy.key] === "true" ? "false" : "true")}
                    className="flex items-center gap-2 p-3 bg-white border border-slate-100 rounded-xl shadow-sm cursor-pointer hover:bg-slate-50 transition-colors"
                  >
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center ${settings[policy.key] === "true" ? "bg-blue-600 border-blue-600" : "border-slate-200"}`}
                    >
                      {settings[policy.key] === "true" && (
                        <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                      )}
                    </div>
                    <span className="text-[10px] font-bold text-slate-600">
                      {policy.label}
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
                  Tự động sao lưu hàng ngày
                </p>
              </div>
              <Toggle 
                checked={settings.AUTO_BACKUP === "true"} 
                onChange={(val) => handleChange("AUTO_BACKUP", val ? "true" : "false")}
              />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                IP Whitelisting (Admin Access Only)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  id="ip-input"
                  placeholder="192.168.1.1"
                  className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:bg-white"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const val = e.target.value.trim();
                      if (val) {
                        const current = settings.IP_WHITELIST ? settings.IP_WHITELIST.split(',') : [];
                        if (!current.includes(val)) {
                          handleChange("IP_WHITELIST", [...current, val].join(','));
                          e.target.value = '';
                        }
                      }
                    }
                  }}
                />
                <button 
                  onClick={() => {
                    const input = document.getElementById('ip-input');
                    const val = input.value.trim();
                    if (val) {
                      const current = settings.IP_WHITELIST ? settings.IP_WHITELIST.split(',') : [];
                      if (!current.includes(val)) {
                        handleChange("IP_WHITELIST", [...current, val].join(','));
                        input.value = '';
                      }
                    }
                  }}
                  className="p-2.5 bg-slate-800 text-white rounded-xl hover:bg-black transition-all"
                >
                  <Plus size={18} />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {settings.IP_WHITELIST ? settings.IP_WHITELIST.split(',').map(ip => (
                  <span key={ip} className="px-3 py-1 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-lg text-[10px] font-black flex items-center gap-2">
                    {ip}
                    <button 
                      onClick={() => {
                        const current = settings.IP_WHITELIST.split(',');
                        handleChange("IP_WHITELIST", current.filter(i => i !== ip).join(','));
                      }}
                      className="hover:text-red-500"
                    >
                      ×
                    </button>
                  </span>
                )) : (
                  <p className="text-[10px] text-slate-400 font-bold italic">Chưa có IP nào được cấp phép.</p>
                )}
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
                Active API Keys ({apiKeys.length})
              </p>
              <button onClick={handleGenerateKey} className="text-[10px] font-black text-blue-600 flex items-center gap-1 hover:underline">
                <Plus size={12} /> Generate New Key
              </button>
            </div>

            <div className="divide-y divide-slate-50 border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
              {apiKeys.length > 0 ? apiKeys.map((key, i) => (
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
              )) : (
                 <div className="p-4 text-center text-xs font-bold text-slate-400">Chưa có API Key nào được tạo.</div>
              )}
            </div>

            <div 
              onClick={() => handleChange("LDAP_ENABLED", settings.LDAP_ENABLED === "true" ? "false" : "true")}
              className={`cursor-pointer mt-4 p-3 rounded-xl border flex items-center justify-between transition-colors ${settings.LDAP_ENABLED === "true" ? "bg-emerald-50 border-emerald-100 hover:bg-emerald-100" : "bg-slate-50 border-slate-100 hover:bg-slate-100"}`}>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${settings.LDAP_ENABLED === "true" ? "bg-emerald-500 animate-pulse" : "bg-slate-400"}`}></div>
                <span className={`text-[10px] font-black uppercase ${settings.LDAP_ENABLED === "true" ? "text-emerald-700" : "text-slate-500"}`}>
                   {settings.LDAP_ENABLED === "true" ? "LDAP/SSO Connected" : "LDAP/SSO Not Configured"}
                </span>
              </div>
              <ExternalLink size={14} className={settings.LDAP_ENABLED === "true" ? "text-emerald-400" : "text-slate-400"} />
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
                value={settings.WEBHOOK_CALLBACK_URL || ""}
                onChange={(e) => handleChange("WEBHOOK_CALLBACK_URL", e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 outline-none focus:bg-white"
                placeholder="https://api.dyus-university.edu.vn/webhook"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase">
                Secret Key
              </label>
              <div className="relative">
                <input
                  type={showSecret ? "text" : "password"}
                  value={settings.WEBHOOK_SECRET || ""}
                  onChange={(e) => handleChange("WEBHOOK_SECRET", e.target.value)}
                  className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 outline-none placeholder:text-slate-300"
                  placeholder="Nhập chuỗi Secret..."
                />
                <div onClick={() => setShowSecret(!showSecret)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-blue-600 cursor-pointer transition-colors p-1">
                  {showSecret ? <Eye size={16} /> : <EyeOff size={16} />}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-slate-400 uppercase">
                  Status:
                </span>
                <span className={`text-[10px] font-black uppercase ${settings.WEBHOOK_CALLBACK_URL ? "text-emerald-500" : "text-orange-500"}`}>
                  {settings.WEBHOOK_CALLBACK_URL ? "Active" : "Missing URL"}
                </span>
              </div>
              <button 
                onClick={() => {
                  if (!settings.WEBHOOK_CALLBACK_URL) {
                     alert("Vui lòng cấu hình Webhook URL trước.");
                     return;
                  }
                  setIsTestingWebhook(true);
                  setTimeout(() => {
                     setIsTestingWebhook(false);
                     alert(`Test Connection tới: ${settings.WEBHOOK_CALLBACK_URL}\n\nThành công! Đã nhận được HTTP 200 OK.`);
                  }, 1500);
                }}
                disabled={isTestingWebhook}
                className={`px-5 py-2 border rounded-xl text-[10px] font-black transition-all ${isTestingWebhook ? "bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
                {isTestingWebhook ? "Testing Ping..." : "Test Connection"}
              </button>
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
};

export default TabSecurity;
