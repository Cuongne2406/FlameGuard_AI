import React, { useState } from "react";
import {
  Plus,
  Minus,
  Maximize,
  Minimize,
  Users,
  Home,
  GraduationCap,
  Download,
} from "lucide-react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const OrgChart = () => {
  const [isCNTTExpanded, setIsCNTTExpanded] = useState(true);
  const [isKinhTeExpanded, setIsKinhTeExpanded] = useState(false);

  const exportToPDF = () => {
    const input = document.getElementById("org-chart-container");
    if (!input) return; // Kiểm tra an toàn

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
        initialScale={1}
        centerOnInit={true}
        minScale={0.4}
        maxScale={2}
      >
        {/* Fix: Sử dụng destructuring an toàn cho zoom tools và state */}
        {({ zoomIn, zoomOut, resetTransform, state }) => {
          // Kiểm tra an toàn giá trị scale
          const currentScale = state?.scale || 1;

          return (
            <>
              {/* Nút điều khiển Zoom */}
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

                {/* Fix: Sử dụng currentScale đã kiểm tra thay vì state.scale trực tiếp */}
                {/* <button
                  onClick={() =>
                    currentScale > 1 ? resetTransform() : zoomIn(0.5)
                  }
                  className="p-3 bg-white shadow-lg rounded-full text-blue-600 border-2 border-blue-50"
                >
                  {currentScale > 1 ? (
                    <Minimize size={20} />
                  ) : (
                    <Maximize size={20} />
                  )}
                </button> */}
              </div>

              <TransformComponent wrapperClassName="!w-full !h-[700px]">
                <div
                  id="org-chart-container"
                  className="p-20 flex flex-col items-center min-w-[1200px] bg-slate-50/20"
                >
                  {/* CẤP 1: BAN CHẤP HÀNH */}
                  <div className="flex flex-col items-center">
                    <div className="w-72 bg-white rounded-2xl border-2 border-blue-500 p-5 shadow-xl">
                      <div className="flex flex-col items-center text-center gap-3">
                        <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl border-4 border-white shadow-sm">
                          PH
                        </div>
                        <div>
                          <h3 className="font-black text-slate-800 flex items-center gap-2">
                            <Home size={16} /> BCH Đoàn Trường
                          </h3>
                          <p className="text-sm font-bold text-blue-600">
                            Lê Trọng Phúc Hậu
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="h-12 w-0.5 bg-slate-200"></div>
                  </div>

                  {/* CẤP 2 */}
                  <div className="relative flex justify-center gap-16 pt-8 before:content-[''] before:absolute before:top-0 before:w-[70%] before:h-0.5 before:bg-slate-200">
                    {/* ĐOÀN KHOA CNTT */}
                    <div className="relative flex flex-col items-center">
                      <div className="absolute -top-8 left-1/2 w-0.5 h-8 bg-slate-200"></div>
                      <div
                        className={`relative z-10 w-64 bg-white rounded-xl border p-4 shadow-sm flex items-center gap-3 transition-all ${isCNTTExpanded ? "border-blue-400 ring-4 ring-blue-50" : "border-slate-100"}`}
                      >
                        <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                          <GraduationCap />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-xs font-black">Đoàn Khoa CNTT</h4>
                          <p className="text-[10px] text-slate-400">
                            1,500 SV • 12 Chi đoàn
                          </p>
                        </div>
                        <button
                          onClick={() => setIsCNTTExpanded(!isCNTTExpanded)}
                          className={`p-1.5 rounded-full transition-all ${isCNTTExpanded ? "bg-red-50 text-red-500" : "bg-blue-50 text-blue-600"}`}
                        >
                          {isCNTTExpanded ? (
                            <Minus size={14} />
                          ) : (
                            <Plus size={14} />
                          )}
                        </button>
                      </div>

                      {isCNTTExpanded && (
                        <div className="flex gap-6 pt-10 relative before:content-[''] before:absolute before:top-0 before:w-full before:h-0.5 before:bg-slate-100">
                          <SubNode
                            label="Chi Đoàn 23CT112"
                            sub="45 Đoàn viên"
                            icon={<Users size={14} />}
                          />
                          <SubNode
                            label="CLB Tin học"
                            sub="30 Thành viên"
                            icon={
                              <span className="text-[10px] font-bold">
                                {"<>"}
                              </span>
                            }
                            isClub
                          />
                        </div>
                      )}
                    </div>

                    {/* ĐOÀN KHOA KINH TẾ */}
                    <div className="relative flex flex-col items-center">
                      <div className="absolute -top-8 left-1/2 w-0.5 h-8 bg-slate-200"></div>
                      <div
                        className={`relative z-10 w-64 bg-white rounded-xl border p-4 shadow-sm flex items-center gap-3 transition-all ${isKinhTeExpanded ? "border-blue-400 ring-4 ring-blue-50" : "border-slate-100"}`}
                      >
                        <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                          <GraduationCap />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-xs font-black">
                            Đoàn Khoa Kinh Tế
                          </h4>
                          <p className="text-[10px] text-slate-400">
                            2,100 SV • 18 Chi đoàn
                          </p>
                        </div>
                        <button
                          onClick={() => setIsKinhTeExpanded(!isKinhTeExpanded)}
                          className={`p-1.5 rounded-full transition-all ${isKinhTeExpanded ? "bg-red-50 text-red-500" : "bg-blue-50 text-blue-600"}`}
                        >
                          {isKinhTeExpanded ? (
                            <Minus size={14} />
                          ) : (
                            <Plus size={14} />
                          )}
                        </button>
                      </div>
                      {isKinhTeExpanded && (
                        <div className="pt-10 relative before:content-[''] before:absolute before:top-0 before:w-0.5 before:h-full before:bg-slate-100">
                          <SubNode
                            label="Chi Đoàn 23KT01"
                            sub="50 Đoàn viên"
                            icon={<Users size={14} />}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </TransformComponent>
            </>
          );
        }}
      </TransformWrapper>
    </div>
  );
};

const SubNode = ({ label, sub, icon, isClub }) => (
  <div className="relative flex flex-col items-center">
    <div className="absolute -top-10 left-1/2 w-0.5 h-10 bg-slate-100"></div>
    <div className="bg-white rounded-xl border border-slate-100 p-3 shadow-sm w-44 flex items-center gap-2 hover:border-blue-200 transition-colors">
      <div
        className={`w-8 h-8 rounded-lg flex items-center justify-center ${isClub ? "bg-emerald-50 text-emerald-600" : "bg-slate-50 text-slate-500"}`}
      >
        {icon}
      </div>
      <div>
        <h5 className="text-[10px] font-black text-slate-700">{label}</h5>
        <p className="text-[9px] text-slate-400">{sub}</p>
      </div>
    </div>
  </div>
);

export default OrgChart;
