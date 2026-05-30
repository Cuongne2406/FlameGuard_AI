import React, { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Popover, Transition } from "@headlessui/react";
import {
  Award,
  Bell,
  Calendar,
  CheckCircle2,
  FileText,
  Home,
  LogOut,
  MessageSquare,
  Moon,
  Settings,
  UserCircle,
  X,
} from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

const menuItems = [
  { icon: <Home size={20} />, label: "Trang ch\u1EE7", path: "dashboard", end: true },
  { icon: <Calendar size={20} />, label: "S\u1EF1 ki\u1EC7n", path: "/user/event" },
  { icon: <Bell size={20} />, label: "Th\u00F4ng b\u00E1o", path: "/user/notifications" },
  { icon: <UserCircle size={20} />, label: "H\u1ED3 s\u01A1 n\u0103ng l\u1EF1c", path: "/user/profile" },
  {
    icon: <Award size={20} />,
    label: "Danh hi\u1EC7u & Khen th\u01B0\u1EDFng",
    path: "/user/awards",
  },
  { icon: <FileText size={20} />, label: "V\u0103n b\u1EA3n & Th\u1EE7 t\u1EE5c", path: "/user/documents" },
];

const userLabel = "Sinh vi\u00EAn";
const settingsLabel = "C\u00E0i \u0111\u1EB7t";
const darkModeLabel = "Ch\u1EBF \u0111\u1ED9 t\u1ED1i";
const feedbackLabel = "Ph\u1EA3n h\u1ED3i & G\u00F3p \u00FD";
const reportBugLabel = "B\u00E1o l\u1ED7i cho h\u1EC7 th\u1ED1ng";
const logoutLabel = "\u0110\u0103ng xu\u1EA5t";

const UserSidebar = ({ isOpen, setIsOpen }) => {
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-[60] bg-slate-900/20 backdrop-blur-sm md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-[60] flex h-screen w-72 shrink-0 flex-col border-r border-slate-100 bg-white/95 shadow-[0_18px_45px_rgba(15,23,42,0.08)] backdrop-blur md:relative md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out`}
      >
        <div className="border-b border-slate-100 px-5 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#4F46E5,#818CF8)] text-lg font-black text-white shadow-[0_14px_24px_rgba(79,70,229,0.26)]">
                F
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-slate-400">
                  User App
                </p>
                <h1 className="text-lg font-black text-slate-900">FlameGuard</h1>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="rounded-xl p-2 text-slate-400 transition-colors hover:bg-slate-50 md:hidden"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <nav className="custom-scrollbar flex-1 space-y-2 overflow-y-auto px-4 py-5">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `${isActive ? "app-sidebar-link app-sidebar-link-active" : "app-sidebar-link"}`
              }
            >
              <div className="flex items-center gap-3.5">
                <span className="shrink-0">{item.icon}</span>
                <span className="text-[14px] font-semibold">{item.label}</span>
              </div>
            </NavLink>
          ))}

          <div className="mx-3 my-4 border-t border-slate-100" />

          <NavLink
            to="/user/settings"
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              `${isActive ? "app-sidebar-link app-sidebar-link-active" : "app-sidebar-link"}`
            }
          >
            <div className="flex items-center gap-3.5">
              <Settings size={20} />
              <span className="text-[14px] font-semibold">{settingsLabel}</span>
            </div>
          </NavLink>
        </nav>

        <div className="border-t border-slate-100 bg-white/90 p-4">
          <Popover className="relative">
            {({ open }) => (
              <>
                <Popover.Button
                  className={`w-full rounded-[20px] p-2 text-left outline-none transition-all ${
                    open ? "bg-slate-100" : "hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative shrink-0">
                      <img
                        src={
                          user?.avatar_url ||
                          `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.student_id || "Felix"}`
                        }
                        alt="Avatar"
                        className="h-11 w-11 rounded-full border-2 border-white object-cover shadow-sm"
                      />
                      <div className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500" />
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-slate-800">
                        {user?.full_name || userLabel}
                      </p>
                      <p className="text-[11px] font-medium text-slate-500">{userLabel}</p>
                    </div>
                  </div>
                </Popover.Button>

                <Transition
                  as={React.Fragment}
                  enter="transition ease-out duration-200"
                  enterFrom="opacity-0 translate-y-1 scale-95"
                  enterTo="opacity-100 translate-y-0 scale-100"
                  leave="transition ease-in duration-150"
                  leaveFrom="opacity-100 translate-y-0 scale-100"
                  leaveTo="opacity-0 translate-y-1 scale-95"
                >
                  <Popover.Panel className="absolute bottom-full left-0 z-[70] mb-4 w-[280px]">
                    <div className="app-card overflow-hidden">
                      <div className="flex items-center gap-4 border-b border-slate-100 bg-slate-50/70 p-4">
                        <img
                          src={
                            user?.avatar_url ||
                            `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.student_id || "Felix"}`
                          }
                          alt="avatar"
                          className="h-12 w-12 rounded-full border border-white object-cover shadow-sm"
                        />

                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <h4 className="truncate text-[13px] font-black text-slate-800">
                              {user?.full_name || userLabel}
                            </h4>
                            <CheckCircle2 size={14} className="shrink-0 text-emerald-500" />
                          </div>
                          <p className="text-[10px] font-bold uppercase text-slate-400">
                            MSSV: {user?.student_id || ""}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-1 p-2">
                        <div className="flex items-center justify-between rounded-2xl p-2.5 transition-colors hover:bg-slate-50">
                          <div className="flex items-center gap-3">
                            <div className="rounded-xl bg-slate-50 p-2 text-slate-400">
                              <Moon size={16} />
                            </div>
                            <p className="text-[11px] font-black text-slate-700">{darkModeLabel}</p>
                          </div>

                          <label className="relative inline-flex cursor-pointer items-center">
                            <input
                              type="checkbox"
                              className="peer sr-only"
                              checked={theme === "dark"}
                              onChange={toggleTheme}
                            />
                            <div className="h-4 w-8 rounded-full bg-slate-200 after:absolute after:left-[2px] after:top-[2px] after:h-3 after:w-3 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-indigo-600 peer-checked:after:translate-x-full peer-checked:after:border-white" />
                          </label>
                        </div>

                        <button className="flex w-full items-center gap-3 rounded-2xl p-2.5 text-left transition-colors hover:bg-slate-50">
                          <div className="rounded-xl bg-slate-50 p-2 text-slate-400">
                            <MessageSquare size={16} />
                          </div>
                          <div>
                            <p className="text-[11px] font-black text-slate-700">{feedbackLabel}</p>
                            <p className="text-[9px] font-bold uppercase text-slate-400">{reportBugLabel}</p>
                          </div>
                        </button>

                        <div className="rounded-2xl bg-slate-50/60 p-1">
                          <button
                            onClick={() => {
                              logout();
                              navigate("/login");
                            }}
                            className="flex w-full items-center gap-3 rounded-xl p-2.5 text-red-500 transition-all hover:bg-red-50"
                          >
                            <LogOut size={16} />
                            <span className="text-[10px] font-black uppercase tracking-widest">{logoutLabel}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </Popover.Panel>
                </Transition>
              </>
            )}
          </Popover>
        </div>
      </aside>
    </>
  );
};

export default UserSidebar;
