import React, { useState } from 'react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Pagination from '../ui/Pagination';
import { MoreVertical } from 'lucide-react';

const ClassesTable = ({ classes }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(classes.length / itemsPerPage);
  
  const paginatedClasses = classes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  return (
    <Card variant="bordered" noPadding>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">TÊN CHI ĐOÀN</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">BẠN CẦN SỰ (BỊ THƯ)</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">SỐ SV</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">SUC KHỎE ĐOÀN PHÍ & PHONG TRÀO</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">XẾP LOẠI</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">HÀNH ĐỘNG</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedClasses.map((cls) => (
              <tr key={cls.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                      {cls.id.slice(0, 2)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{cls.id}</p>
                      <p className="text-xs text-gray-500">{cls.name}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <p className="font-medium text-gray-900">NV</p>
                    <p className="text-sm text-gray-600">{cls.mentor}</p>
                    <Badge 
                      variant={cls.status === 'active' ? 'success' : 'warning'}
                      size="sm"
                      className="mt-1"
                    >
                      {cls.activeStatus}
                    </Badge>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="font-semibold text-gray-900">{cls.studentCount}/42</p>
                  <p className="text-sm text-gray-600">Activity: 🌟 98 pts</p>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${cls.completion === 100 ? 'bg-green-500' : cls.completion >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                          style={{ width: `${cls.completion}%` }}
                        />
                      </div>
                      <span className={`text-xs font-semibold ${cls.completion === 100 ? 'text-green-600' : cls.completion >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {cls.completion}%
                      </span>
                    </div>
                    <p className="text-xs text-gray-600">{cls.health}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <Badge
                    variant={
                      cls.status === 'active' ? 'success' :
                      cls.status === 'warning' ? 'danger' :
                      'warning'
                    }
                    size="sm"
                    dot
                  >
                    {cls.status === 'active' ? 'Vừng tốt' : cls.status === 'warning' ? 'Yếu' : 'Khá'}
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <MoreVertical size={16} className="text-gray-600" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Hiển thị {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, classes.length)} trên {classes.length} kết quả
        </p>
        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </Card>
  );
};;

export default ClassesTable;
