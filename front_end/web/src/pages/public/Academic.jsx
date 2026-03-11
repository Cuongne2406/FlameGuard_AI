import React, { useState, useEffect } from 'react';
import { Download, FileText, Search } from "lucide-react";
import { publicService } from "../../services/publicService";

const Academic = () => {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const data = await publicService.getAcademicDocs();
        setDocs(data);
      } catch (error) {
        console.error("Failed to fetch academic docs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDocs();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="flex flex-col md:flex-row justify-between items-end gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-black text-gray-900 uppercase italic">
            Góc Học thuật
          </h1>
          <p className="text-gray-500">
            Kho lưu trữ tài liệu, đề thi và các cuộc thi nghiên cứu khoa học.
          </p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Tìm tài liệu..."
            className="pl-10 pr-4 py-2 bg-white border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none w-64"
          />
        </div>
      </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Sidebar bộ lọc */}
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border">
          <h3 className="font-bold mb-4">Chuyên mục</h3>
          <ul className="space-y-3 text-sm text-gray-600 font-medium">
            <li className="text-blue-600 font-bold">Tất cả tài liệu</li>
            <li className="hover:text-blue-600 cursor-pointer">
              Công nghệ thông tin
            </li>
            <li className="hover:text-blue-600 cursor-pointer">
              Kỹ thuật phần mềm
            </li>
            <li className="hover:text-blue-600 cursor-pointer">
              An toàn thông tin
            </li>
          </ul>
        </div>
      </div>

      {/* Danh sách tài liệu */}
      <div className="lg:col-span-2 space-y-4">
        {loading ? (
          <div className="text-center py-10 text-slate-500 font-bold">Đang tải tài liệu...</div>
        ) : docs.length > 0 ? (
          docs.map((doc) => (
            <div
              key={doc.id}
              className="bg-white p-5 rounded-2xl border flex items-center justify-between hover:border-blue-300 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-red-50 text-red-500 rounded-lg">
                  <FileText />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">
                    {doc.title}
                  </h4>
                  <p className="text-[10px] text-gray-400 uppercase font-bold mt-1">
                    {doc.type} • {doc.size} • {doc.downloads.toLocaleString()} lượt tải
                  </p>
                </div>
              </div>
              <button className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg">
                <Download size={20} />
              </button>
            </div>
          ))
        ) : (
           <div className="text-center py-10 text-slate-500 italic">Không có tài liệu nào.</div>
        )}
      </div>
    </div>
  </div>
  );
};
export default Academic;