export const SectionCard = ({ title, icon, children }) => (
  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
    <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
      {icon} {title}
    </h3>
    {children}
  </div>
);
