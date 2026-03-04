import React, { useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Card from '../ui/Card';

const AddClassModal = ({ isOpen, onClose, onSubmit }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    classId: '',
    className: '',
    academicYear: '2025-2029',
    major: '',
    mentor: '',
    students: [],
    notifications: {
      email: true,
      zalo: true
    }
  });

  const [selectedFile, setSelectedFile] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = () => {
    const newClass = {
      id: formData.classId,
      name: formData.className,
      status: 'active',
      activeStatus: 'Online',
      studentCount: formData.students.length,
      mentor: formData.mentor,
      completion: 0,
      health: 'Mới'
    };
    onSubmit(newClass);
  };

  if (!isOpen) return null;

  // Stepper Header
  const stepperContent = (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        {[1, 2, 3].map((s) => (
          <React.Fragment key={s}>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold transition-colors ${
                s <= step
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {s}
            </div>
            {s < 3 && (
              <div
                className={`flex-1 h-1 mx-2 transition-colors ${
                  s < step ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
      <div className="flex justify-between text-sm font-medium">
        <span className={step === 1 ? 'text-blue-600' : 'text-gray-600'}>Thông tin chung</span>
        <span className={step === 2 ? 'text-blue-600' : 'text-gray-600'}>Bạn cần sự & Danh sách</span>
        <span className={step === 3 ? 'text-blue-600' : 'text-gray-600'}>Xác nhận</span>
      </div>
    </div>
  );

  // Step Content
  const renderStepContent = () => {
    switch(step) {
      case 1:
        return (
          <div className="space-y-4">
            <Input
              label="Mã Chi Đoàn"
              name="classId"
              value={formData.classId}
              onChange={handleInputChange}
              placeholder="Vd: 25CT111"
            />
            <p className="text-xs text-gray-500">Mã lớp là duy nhất.</p>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Niên Khoá <span className="text-red-500">*</span>
              </label>
              <select
                name="academicYear"
                value={formData.academicYear}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>2025-2029</option>
                <option>2024-2028</option>
                <option>2023-2027</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chuyên Ngành <span className="text-red-500">*</span>
              </label>
              <select
                name="major"
                value={formData.major}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Kỹ Thuật Phần Mềm (Software Engineering)</option>
                <option value="">Công Nghệ Thông Tin</option>
                <option value="">Mạng Máy Tính</option>
              </select>
            </div>

            <Input
              label="Giáo Viên Chủ Nhiệm"
              name="mentor"
              value={formData.mentor}
              onChange={handleInputChange}
              placeholder="Nhập tên giáo viên..."
            />
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Danh sách lớp (.xlsx) <span className="text-red-500">*</span>
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer">
                <div className="material-symbols-outlined text-4xl text-gray-400 mx-auto mb-2">
                  cloud_upload
                </div>
                <p className="text-sm text-gray-700 font-medium">
                  Tải lên Hoặc kéo thả vào đây
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Excel, CSV lên đến 10MB
                </p>
                {selectedFile && (
                  <div className="mt-4 p-3 bg-green-50 rounded-lg flex items-center gap-3">
                    <span className="material-symbols-outlined text-green-600">
                      check_circle
                    </span>
                    <div className="text-left">
                      <p className="text-sm font-medium text-green-700">
                        {selectedFile.name}
                      </p>
                      <p className="text-xs text-green-600">
                        ✓ Đã tải lên (45 sinh viên)
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Chi Định Bỉ Thư (Tùy chọn)
              </label>
              <Card variant="bordered">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-lg font-bold text-blue-600">A</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Lê Văn A - 2500xxxx</p>
                    <p className="text-xs text-gray-600">Người được chỉ định để điều hành lớp</p>
                  </div>
                  <button className="px-3 py-1 border border-gray-300 rounded-lg text-sm text-blue-600 hover:bg-blue-50 transition-colors">
                    Đã chọn ✓
                  </button>
                </div>
              </Card>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <Card variant="bordered" className="border-l-4 border-l-blue-600">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">CHI ĐOÀN / LỚP</span>
                  <span className="font-semibold text-gray-900">{formData.classId} - {formData.major}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">SỐ LỚP KIẾN</span>
                  <span className="font-semibold text-gray-900">45 Sinh viên</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">BỊ THƯ CHỈ BIỂU</span>
                  <span className="font-semibold text-gray-900">{formData.mentor}</span>
                </div>
              </div>
            </Card>

            <div>
              <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.notifications.email}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    notifications: { ...prev.notifications, email: e.target.checked }
                  }))}
                  className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Gửi Email kích hoạt</p>
                  <p className="text-xs text-gray-600">
                    Gửi thông tin đăng nhập cho Bỉ thư và Ban cần sự lớp
                  </p>
                </div>
              </label>
            </div>

            <div>
              <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.notifications.zalo}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    notifications: { ...prev.notifications, zalo: e.target.checked }
                  }))}
                  className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Tạo Group Zalo</p>
                  <p className="text-xs text-gray-600">
                    Tự động tạo nhóm Zalo cho lớp và thêm Bỉ thư
                  </p>
                </div>
              </label>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const footerContent = (
    <div className="flex items-center justify-between gap-3">
      <Button
        variant="secondary"
        onClick={handlePrev}
        disabled={step === 1}
        leftIcon={<span className="material-symbols-outlined">arrow_back</span>}
      >
        Quay Lại
      </Button>

      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={onClose}
        >
          Hủy
        </Button>
        {step < 3 ? (
          <Button
            variant="primary"
            onClick={handleNext}
            rightIcon={<span className="material-symbols-outlined">arrow_forward</span>}
          >
            Tiếp Tục
          </Button>
        ) : (
          <Button
            variant="primary"
            onClick={handleSubmit}
            leftIcon={<span className="material-symbols-outlined">check</span>}
          >
            Hoàn Tất & Khởi Tạo
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Thêm Chi Đoàn Mới"
      size="lg"
      footer={footerContent}
    >
      {stepperContent}
      <div className="mt-8">
        {renderStepContent()}
      </div>
    </Modal>
  );
};;

export default AddClassModal;
