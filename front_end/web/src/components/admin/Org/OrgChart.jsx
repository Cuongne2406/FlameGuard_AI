import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Plus,
  Minus,
  Users,
  Home,
  GraduationCap,
  Download,
  Loader2,
  List,
  X,
  Sparkles,
  ChevronDown,
  ChevronRight,
  Building2,
} from "lucide-react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { organizationService } from "../../../services/organizationService";

/* ─────────────────────────────────────────────────────── */
/*  Utility: build nested tree from flat list              */
/* ─────────────────────────────────────────────────────── */
const buildTree = (items, parentId = null) =>
  items
    .filter((i) => (parentId === null ? !i.parent_id : i.parent_id === parentId))
    .map((i) => ({ ...i, children: buildTree(items, i.id) }));

/* ─────────────────────────────────────────────────────── */
/*  TreeNode: recursive visual node                         */
/* ─────────────────────────────────────────────────────── */
const TreeNode = ({ node, expandedNodes, toggleNode, level }) => {
  const isRoot = level === 1;
  const hasChildren = node.children && node.children.length > 0;
  const isExpanded = expandedNodes.has(node.id);

  const avatarLetter = node.name ? node.name.charAt(0).toUpperCase() : "?";

  const colors = [
    { bg: "bg-blue-600",   light: "bg-blue-50",    text: "text-blue-600",   border: "border-blue-400"   },
    { bg: "bg-emerald-600",light: "bg-emerald-50",  text: "text-emerald-600",border: "border-emerald-400"},
    { bg: "bg-violet-600", light: "bg-violet-50",   text: "text-violet-600", border: "border-violet-400" },
    { bg: "bg-orange-500", light: "bg-orange-50",   text: "text-orange-600", border: "border-orange-400" },
    { bg: "bg-rose-500",   light: "bg-rose-50",     text: "text-rose-600",   border: "border-rose-400"   },
  ];
  const color = colors[(level - 1) % colors.length];

  return (
    <div className="flex flex-col items-center select-none">
      {/* ── Card ── */}
      <div
        className={`
          relative bg-white rounded-2xl border-2 shadow-md cursor-pointer transition-all duration-200
          hover:shadow-xl hover:-translate-y-0.5
          ${isRoot
            ? `w-72 ${color.border} shadow-lg`
            : `w-56 border-slate-200 hover:${color.border}`}
        `}
      >
        <div className="flex flex-col items-center gap-2 p-4 text-center">
          {/* Avatar */}
          <div
            className={`
              flex items-center justify-center rounded-full font-black text-white shadow-sm
              ${isRoot ? "w-14 h-14 text-xl" : "w-10 h-10 text-sm"}
              ${color.bg}
            `}
          >
            {avatarLetter}
          </div>

          {/* Name */}
          <div>
            <h3 className={`font-black text-slate-800 leading-tight ${isRoot ? "text-sm" : "text-xs"}`}>
              {node.name}
            </h3>
            <p className={`font-semibold mt-0.5 truncate ${isRoot ? "text-xs" : "text-[10px]"} ${color.text}`}>
              {node.leader_name || "Đang cập nhật"}
            </p>
            {!isRoot && (
              <p className="text-[9px] text-slate-400 mt-0.5">
                {node.total_members || 0} thành viên
              </p>
            )}
          </div>

          {/* Toggle button */}
          {hasChildren && (
            <button
              onClick={() => toggleNode(node.id)}
              className={`
                mt-1 flex items-center gap-1 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider transition-all
                ${isExpanded
                  ? "bg-red-50 text-red-500 hover:bg-red-100"
                  : `${color.light} ${color.text} hover:brightness-95`}
              `}
            >
              {isExpanded ? (
                <><Minus size={10} /> Thu gọn</>
              ) : (
                <><Plus size={10} /> Mở rộng ({node.children.length})</>
              )}
            </button>
          )}
        </div>
      </div>

      {/* ── Children ── */}
      {isExpanded && hasChildren && (
        <div className="relative mt-0">
          {/* Vertical stem from parent card to horizontal bar */}
          <div className="flex justify-center">
            <div className="w-0.5 h-10 bg-slate-300" />
          </div>

          {/* Horizontal connector bar + child columns */}
          <div className="relative flex items-start justify-center gap-16">
            {/* Horizontal line spanning children */}
            {node.children.length > 1 && (
              <div
                className="absolute top-0 h-0.5 bg-slate-300"
                style={{
                  /* stretch from center of first child to center of last child */
                  left: "calc(50% - (var(--child-span) / 2))",
                  width: "var(--child-span)",
                }}
              />
            )}

            {node.children.map((child) => (
              <div key={child.id} className="relative flex flex-col items-center">
                {/* Vertical drop from horizontal bar to child card */}
                <div className="w-0.5 h-10 bg-slate-300" />
                <TreeNode
                  node={child}
                  expandedNodes={expandedNodes}
                  toggleNode={toggleNode}
                  level={level + 1}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────────────────── */
/*  ListView                                               */
/* ─────────────────────────────────────────────────────── */
const ListView = ({ orgTree }) => {
  const flatten = (nodes, depth = 0) => {
    let out = [];
    nodes.forEach((n) => {
      out.push({ ...n, depth });
      if (n.children?.length) out.push(...flatten(n.children, depth + 1));
    });
    return out;
  };
  const flat = flatten(orgTree);

  const dotColors = ["bg-blue-500", "bg-emerald-500", "bg-violet-500", "bg-orange-400", "bg-rose-400"];

  return (
    <div
      id="org-list-container"
      className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm max-w-5xl mx-auto space-y-4 my-8"
    >
      <div className="flex items-center justify-between border-b pb-4 mb-2">
        <div>
          <span className="px-2.5 py-1 rounded bg-blue-50 text-blue-600 font-bold text-xs uppercase tracking-wider">
            Danh sách chính thức
          </span>
          <h3 className="text-lg font-black text-slate-800 mt-1">Danh sách Đơn vị Tổ chức</h3>
        </div>
        <Sparkles className="text-blue-400" size={20} />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <th className="pb-3 pl-4">Tên đơn vị</th>
              <th className="pb-3">Người đứng đầu</th>
              <th className="pb-3">Số thành viên</th>
              <th className="pb-3 pr-4 text-right">Loại hình</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {flat.map((org) => (
              <tr key={org.id} className="hover:bg-slate-50/60 transition-colors">
                <td
                  className="py-3.5 text-sm font-bold text-slate-800"
                  style={{ paddingLeft: `${org.depth * 32 + 16}px` }}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full shrink-0 ${
                        dotColors[org.depth % dotColors.length]
                      }`}
                    />
                    {org.name}
                  </div>
                </td>
                <td className="py-3.5 text-sm font-semibold text-blue-600">
                  {org.leader_name || "Chưa cập nhật"}
                </td>
                <td className="py-3.5 text-xs font-semibold text-slate-500">
                  {org.total_members || 0} thành viên
                </td>
                <td className="py-3.5 pr-4 text-right">
                  <span
                    className={`px-2.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                      org.type === "UNIVERSITY"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {org.type}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────── */
/*  ExportModal                                            */
/* ─────────────────────────────────────────────────────── */
const ExportModal = ({ onClose, onExport }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm">
    <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl max-w-md w-full p-6 space-y-5 relative m-4">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
      >
        <X size={18} />
      </button>

      <div className="text-center">
        <span className="px-2.5 py-1 rounded bg-blue-50 text-blue-600 font-bold text-xs uppercase tracking-wider">
          Xuất dữ liệu PDF
        </span>
        <h3 className="text-lg font-black text-slate-800 mt-2">Chọn định dạng tài liệu</h3>
        <p className="text-xs text-slate-400 font-medium mt-1">
          Chọn kiểu hiển thị của tài liệu PDF khi tải xuống.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {[
          {
            key: "tree",
            icon: <Users size={20} />,
            color: "bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white",
            hover: "hover:border-blue-400 hover:bg-blue-50/20",
            title: "Sơ đồ hình cây",
            desc: "Xuất biểu đồ tổ chức hình cây trực quan, sinh động.",
          },
          {
            key: "list",
            icon: <List size={20} />,
            color: "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white",
            hover: "hover:border-emerald-400 hover:bg-emerald-50/20",
            title: "Bảng danh sách",
            desc: "Xuất dạng bảng phân cấp đơn vị chi tiết, dễ in ấn.",
          },
        ].map((opt) => (
          <button
            key={opt.key}
            onClick={() => onExport(opt.key)}
            className={`group flex items-center gap-4 p-4 rounded-2xl border-2 border-slate-100 text-left transition-all ${opt.hover}`}
          >
            <div className={`p-3 rounded-xl transition-all ${opt.color}`}>{opt.icon}</div>
            <div>
              <h4 className="text-sm font-bold text-slate-800">{opt.title}</h4>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">{opt.desc}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  </div>
);

/* ─────────────────────────────────────────────────────── */
/*  OrgChart (main component)                              */
/* ─────────────────────────────────────────────────────── */
const OrgChart = () => {
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedNodes, setExpandedNodes] = useState(new Set());
  const [displayMode, setDisplayMode] = useState("tree");
  const [showExportModal, setShowExportModal] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const data = await organizationService.getOrganizations();
        setOrganizations(data);
        // Auto-expand all nodes by default so tree is visible
        setExpandedNodes(new Set(data.map((o) => o.id)));
      } catch (e) {
        console.error("Failed to fetch org data:", e);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const orgTree = useMemo(() => buildTree(organizations), [organizations]);

  const toggleNode = (id) => {
    setExpandedNodes((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleExport = async (format) => {
    setShowExportModal(false);
    const prev = displayMode;
    setDisplayMode(format);

    setTimeout(async () => {
      const id = format === "tree" ? "org-chart-container" : "org-list-container";
      const el = document.getElementById(id);
      if (!el) { setDisplayMode(prev); return; }
      try {
        const canvas = await html2canvas(el, { scale: 2, useCORS: true, logging: false });
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("l", "mm", "a4");
        const w = pdf.internal.pageSize.getWidth();
        const h = (canvas.height * w) / canvas.width;
        pdf.addImage(imgData, "PNG", 0, 0, w, h);
        pdf.save(format === "tree" ? "So-Do-To-Chuc.pdf" : "Danh-Sach-To-Chuc.pdf");
      } catch (e) {
        console.error("Export failed:", e);
      } finally {
        setDisplayMode(prev);
      }
    }, 700);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] text-slate-400 gap-4">
        <Loader2 className="animate-spin text-blue-500" size={48} />
        <p className="font-bold text-sm">Đang tải sơ đồ tổ chức...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* ── Control bar ── */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex bg-slate-100 p-1 rounded-xl">
          {[
            { key: "tree", label: "Sơ đồ hình cây", Icon: Users },
            { key: "list", label: "Dạng danh sách", Icon: List },
          ].map(({ key, label, Icon }) => (
            <button
              key={key}
              onClick={() => setDisplayMode(key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-black transition-all ${
                displayMode === key
                  ? "bg-white text-blue-600 shadow-md"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>

        <button
          onClick={() => setShowExportModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 rounded-xl text-xs font-black text-white shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95"
        >
          <Download size={15} />
          Xuất dữ liệu (PDF)
        </button>
      </div>

      {/* ── Tree View ── */}
      {displayMode === "tree" && (
        <div className="relative w-full overflow-hidden bg-gradient-to-br from-slate-50 to-blue-50/30 rounded-3xl min-h-[750px] border border-slate-200 shadow-sm">
          <TransformWrapper
            initialScale={0.75}
            centerOnInit={true}
            minScale={0.15}
            maxScale={2.5}
            limitToBounds={false}
          >
            {({ zoomIn, zoomOut, resetTransform }) => (
              <>
                {/* Zoom controls */}
                <div className="absolute bottom-6 right-6 flex flex-col gap-2 z-20">
                  <button
                    onClick={() => zoomIn()}
                    className="p-3 bg-white shadow-lg rounded-full text-slate-600 hover:text-blue-600 border border-slate-100 transition-colors"
                  >
                    <Plus size={18} />
                  </button>
                  <button
                    onClick={() => zoomOut()}
                    className="p-3 bg-white shadow-lg rounded-full text-slate-600 hover:text-blue-600 border border-slate-100 transition-colors"
                  >
                    <Minus size={18} />
                  </button>
                  <button
                    onClick={() => resetTransform()}
                    className="p-3 bg-white shadow-lg rounded-full text-slate-600 hover:text-blue-600 border border-slate-100 transition-colors text-[10px] font-bold leading-none"
                  >
                    Fit
                  </button>
                </div>

                <TransformComponent
                  wrapperClassName="!w-full !h-[750px]"
                  contentClassName="!w-auto"
                >
                  <div
                    id="org-chart-container"
                    className="p-20 flex flex-row flex-wrap items-start justify-center gap-20"
                  >
                    {orgTree.map((root) => (
                      <TreeNode
                        key={root.id}
                        node={root}
                        expandedNodes={expandedNodes}
                        toggleNode={toggleNode}
                        level={1}
                      />
                    ))}
                  </div>
                </TransformComponent>
              </>
            )}
          </TransformWrapper>
        </div>
      )}

      {/* ── List View ── */}
      {displayMode === "list" && <ListView orgTree={orgTree} />}

      {/* ── Export Modal ── */}
      {showExportModal && (
        <ExportModal
          onClose={() => setShowExportModal(false)}
          onExport={handleExport}
        />
      )}
    </div>
  );
};

export default OrgChart;
