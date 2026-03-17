import React, { useState, useEffect, useMemo } from "react";
import {
  Plus,
  Minus,
  Maximize,
  Minimize,
  Users,
  Home,
  GraduationCap,
  Download,
  Loader2,
} from "lucide-react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { organizationService } from "../../../services/organizationService";

const OrgChart = () => {
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedNodes, setExpandedNodes] = useState(new Set());

  useEffect(() => {
    const fetchOrgData = async () => {
      setLoading(true);
      try {
        const data = await organizationService.getOrganizations();
        setOrganizations(data);
        // Tự động mở rộng các đơn vị cấp cao (ví dụ: cấp 1)
        const roots = data.filter(org => !org.parent_id);
        setExpandedNodes(new Set(roots.map(r => r.id)));
      } catch (error) {
        console.error("Failed to fetch org chart data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrgData();
  }, []);

  const buildTree = (items, parentId = null) => {
    return items
      .filter((item) => (parentId === null ? !item.parent_id : item.parent_id === parentId))
      .map((item) => ({
        ...item,
        children: buildTree(items, item.id),
      }));
  };

  const orgTree = useMemo(() => buildTree(organizations), [organizations]);

  const toggleNode = (id) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedNodes(newExpanded);
  };

  const exportToPDF = () => {
    const input = document.getElementById("org-chart-container");
    if (!input) return;

    html2canvas(input, { scale: 2, useCORS: true, logging: false }).then(
      (canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("l", "mm", "a4");
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save("So-Do-To-Chuc-DYUS.pdf");
      },
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] text-slate-400 gap-4">
        <Loader2 className="animate-spin" size={48} />
        <p className="font-bold">Đang tải sơ đồ tổ chức...</p>
      </div>
    );
  }

  return (
    <div className="relative w-full overflow-hidden bg-slate-50/50 rounded-3xl min-h-[700px] border border-slate-100">
      <div className="absolute top-8 right-8 z-20">
        <button
          onClick={exportToPDF}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 rounded-2xl text-xs font-black text-white shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95"
        >
          <Download size={16} />
          <span>Xuất Sơ đồ (PDF)</span>
        </button>
      </div>

      <TransformWrapper
        initialScale={0.8}
        centerOnInit={true}
        minScale={0.2}
        maxScale={2}
      >
        {({ zoomIn, zoomOut, state }) => (
          <>
            <div className="absolute bottom-8 right-8 flex flex-col gap-2 z-20">
              <button
                onClick={() => zoomIn()}
                className="p-3 bg-white shadow-lg rounded-full text-slate-600 hover:text-blue-600 border border-slate-50"
              >
                <Plus size={20} />
              </button>
              <button
                onClick={() => zoomOut()}
                className="p-3 bg-white shadow-lg rounded-full text-slate-600 hover:text-blue-600 border border-slate-50"
              >
                <Minus size={20} />
              </button>
            </div>

            <TransformComponent wrapperClassName="!w-full !h-[700px]">
              <div
                id="org-chart-container"
                className="p-20 flex flex-col items-center min-w-[2000px] bg-slate-50/20"
              >
                {orgTree.map((root) => (
                  <TreeNode
                    key={root.id}
                    node={root}
                    isExpanded={expandedNodes.has(root.id)}
                    onToggle={() => toggleNode(root.id)}
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
  );
};

const TreeNode = ({ node, isExpanded, onToggle, expandedNodes, toggleNode, level }) => {
  const isRoot = level === 1;
  const isFaculty = node.type === "FACULTY" || node.type === "UNIVERSITY";

  return (
    <div className="flex flex-col items-center">
      {/* Node Content */}
      <div className={`${isRoot ? "w-72" : "w-64"} bg-white rounded-2xl border-2 ${isRoot ? "border-blue-500 shadow-xl" : "border-slate-100 shadow-sm"} p-4 transition-all hover:border-blue-300`}>
        <div className="flex flex-col items-center text-center gap-3">
          {isRoot ? (
             <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl border-4 border-white shadow-sm">
                {node.name.charAt(0)}
             </div>
          ) : (
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
              <GraduationCap />
            </div>
          )}
          
          <div className="flex-1 w-full text-center">
             <h3 className={`font-black text-slate-800 flex items-center justify-center gap-2 ${isRoot ? "text-base" : "text-xs"}`}>
                {isRoot && <Home size={16} />} {node.name}
             </h3>
             <p className={`text-blue-600 font-bold ${isRoot ? "text-sm" : "text-[10px]"}`}>
                {node.leader_name || "Đang cập nhật"}
             </p>
             {!isRoot && (
               <p className="text-[9px] text-slate-400 mt-1">
                 {node.total_members || 0} Thành viên
               </p>
             )}
          </div>

          {node.children && node.children.length > 0 && (
            <button
               onClick={onToggle}
               className={`p-1.5 rounded-full mt-2 transition-all ${isExpanded ? "bg-red-50 text-red-500" : "bg-blue-50 text-blue-600"}`}
            >
               {isExpanded ? <Minus size={14} /> : <Plus size={14} />}
            </button>
          )}
        </div>
      </div>

      {/* Children */}
      {isExpanded && node.children && node.children.length > 0 && (
        <div className="relative pt-12 flex justify-center gap-8">
           {/* Line connects from parent to horizontal line */}
           <div className="absolute top-0 left-1/2 w-0.5 h-12 bg-slate-200"></div>
           
           {/* Horizontal Line connects all children */}
           {node.children.length > 1 && (
             <div className="absolute top-12 left-[10%] right-[10%] h-0.5 bg-slate-200"></div>
           )}

           {node.children.map((child) => (
             <div key={child.id} className="relative pt-8">
               {/* Line connects from horizontal line to child */}
               <div className="absolute top-0 left-1/2 w-0.5 h-8 bg-slate-200"></div>
               <TreeNode
                 node={child}
                 isExpanded={expandedNodes.has(child.id)}
                 onToggle={() => toggleNode(child.id)}
                 expandedNodes={expandedNodes}
                 toggleNode={toggleNode}
                 level={level + 1}
               />
             </div>
           ))}
        </div>
      )}
    </div>
  );
};

export default OrgChart;

