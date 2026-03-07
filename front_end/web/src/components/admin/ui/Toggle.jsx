export const Toggle = ({ checked }) => (
  <div
    className={`w-10 h-6 rounded-full p-1 cursor-pointer transition-all ${checked ? "bg-blue-600" : "bg-slate-200"}`}
  >
    <div
      className={`bg-white w-4 h-4 rounded-full shadow-sm transition-all transform ${checked ? "translate-x-4" : "translate-x-0"}`}
    ></div>
  </div>
);
