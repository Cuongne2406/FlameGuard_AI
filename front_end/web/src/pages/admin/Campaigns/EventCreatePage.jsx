import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ChevronLeft, ArrowRight, ArrowLeft, Sparkles, Building, Calendar, 
  MapPin, Clock, DollarSign, Upload, Users, User, Shield, 
  Award, CheckCircle, Check, Loader2, AlertCircle, Image 
} from "lucide-react";
import { organizationService } from "../../../services/organizationService";
import { systemService } from "../../../services/systemService";
import { eventService } from "../../../services/eventService";

const EventCreatePage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0); // 0 is Pre-selection, 1-5 are standard wizard steps
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);
  const [error, setError] = useState(null);

  // System options
  const [organizations, setOrganizations] = useState([]);
  const [academicTerms, setAcademicTerms] = useState([]);
  const [availableLocations, setAvailableLocations] = useState([
    { id: "HTA", name: "Hội trường A", capacity: 500 },
    { id: "HTB", name: "Hội trường B", capacity: 300 },
    { id: "G3", name: "Hội trường G3", capacity: 200 },
    { id: "PH", name: "Phòng họp số 1", capacity: 50 },
    { id: "SVD", name: "Sân vận động", capacity: 1000 }
  ]);

  // Default beautiful event cover images
  const defaultCovers = [
    { name: "Hội thảo / Chuyên đề", url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=60" },
    { name: "Chiến dịch Tình nguyện", url: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&auto=format&fit=crop&q=60" },
    { name: "Giải đấu Thể thao", url: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&auto=format&fit=crop&q=60" },
    { name: "Cuộc thi Sáng tạo", url: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=60" }
  ];

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location: "",
    locationType: "preset",
    customLocation: "",
    start_time: "",
    end_time: "",
    capacity: 100,
    points_awarded: 10,
    status: "PUBLISHED",
    image_url: "",
    participationType: "individual", // individual vs team (pre-selected in Step 0)
    minTeamSize: 3,
    maxTeamSize: 5,
    allowInternal: true,
    allowExternal: false,
    budget: "",
    fundingSource: "Quỹ Khoa",
    org_id: "",
    organizer: "",
    smartCheckin: true,
    geofencing: true,
    eCertificate: true,
    certificateTemplate: "blue",
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  // Load organizations and terms
  useEffect(() => {
    const loadData = async () => {
      try {
        const [orgsRes, termsRes] = await Promise.all([
          organizationService.getOrganizations(),
          systemService.getAcademicTerms(),
        ]);
        if (Array.isArray(orgsRes)) setOrganizations(orgsRes);
        if (Array.isArray(termsRes)) setAcademicTerms(termsRes);
      } catch (err) {
        console.error("Error loading event requirements:", err);
      } finally {
        setFetchingData(false);
      }
    };
    loadData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSelectCover = (url) => {
    setSelectedFile(null);
    setPreviewUrl(url);
    setFormData((prev) => ({ ...prev, image_url: url }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const fakeUrl = URL.createObjectURL(file);
      setPreviewUrl(fakeUrl);
      setFormData((prev) => ({ ...prev, image_url: fakeUrl }));
    }
  };

  const handleIntentSelection = (type) => {
    setFormData((prev) => ({
      ...prev,
      participationType: type,
      // Default configurations matching participation mode
      minTeamSize: type === "team" ? 3 : 1,
      maxTeamSize: type === "team" ? 5 : 1,
    }));
    setStep(1);
  };

  const validateStep = () => {
    if (step === 1) {
      if (!formData.name.trim()) return "Tên sự kiện không được để trống!";
      if (!formData.start_time || !formData.end_time) return "Vui lòng nhập đầy đủ thời gian bắt đầu và kết thúc!";
      if (new Date(formData.start_time) > new Date(formData.end_time)) return "Thời gian kết thúc phải diễn ra sau thời gian bắt đầu!";
      if (formData.locationType === "preset" && !formData.location) return "Vui lòng chọn địa điểm tổ chức!";
      if (formData.locationType === "custom" && !formData.customLocation.trim()) return "Vui lòng nhập địa điểm mới!";
      if (!formData.image_url) return "Ảnh bìa sự kiện là BẮT BUỘC. Vui lòng chọn ảnh bìa hoặc tải ảnh lên!";
    }
    if (step === 2) {
      if (formData.participationType === "team") {
        if (parseInt(formData.minTeamSize) < 2) return "Số lượng thành viên tối thiểu của đội phải từ 2 người!";
        if (parseInt(formData.maxTeamSize) < parseInt(formData.minTeamSize)) {
          return "Số lượng thành viên tối đa phải lớn hơn hoặc bằng số lượng tối thiểu!";
        }
      }
    }
    if (step === 3) {
      if (!formData.org_id) return "Vui lòng chọn đơn vị tổ chức phụ trách!";
      if (!formData.organizer.trim()) return "Vui lòng nhập tên trưởng ban tổ chức!";
    }
    return null;
  };

  const handleNext = () => {
    const errorMsg = validateStep();
    if (errorMsg) {
      setError(errorMsg);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setError(null);
    if (step < 5) setStep(step + 1);
  };

  const handlePrev = () => {
    setError(null);
    if (step > 0) setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const actualLocation = formData.locationType === "preset"
        ? availableLocations.find(l => l.id === formData.location)?.name || formData.location
        : formData.customLocation;

      const payload = {
        name: formData.name,
        location: actualLocation,
        start_time: formData.start_time,
        end_time: formData.end_time,
        capacity: parseInt(formData.capacity) || 100,
        status: formData.status,
        description: formData.description,
        image_url: formData.image_url,
        points_awarded: parseInt(formData.points_awarded) || 10,
        org_id: formData.org_id,
        // Custom structures can be handled by backend
      };

      await eventService.createEvent(payload);
      navigate("/admin/campaigns/calendar");
    } catch (err) {
      console.error("Error creating event:", err);
      setError(err.message || "Đã xảy ra lỗi khi tạo sự kiện. Vui lòng kiểm tra lại.");
    } finally {
      setLoading(false);
    }
  };

  if (fetchingData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] gap-3">
        <Loader2 className="animate-spin text-[#0061D5]" size={36} />
        <p className="text-slate-500 font-medium text-sm">Đang tải biểu mẫu sự kiện...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Quay lại & Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-5">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/admin/campaigns/calendar")}
            className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors border border-slate-200 bg-white shadow-sm"
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1 px-2.5 rounded bg-orange-50 text-orange-600 font-bold text-xs uppercase tracking-wider">
                Event Setup Wizard
              </span>
              <Sparkles size={16} className="text-amber-500 animate-pulse" />
            </div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight mt-1">Cấu Hình Sự Kiện Mới</h1>
          </div>
        </div>
      </div>

      {/* Thông báo lỗi */}
      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-xl text-red-700 text-sm font-semibold animate-in slide-in-from-top-4 duration-200">
          <AlertCircle size={20} className="shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* STEPPER PROGRESS BAR */}
      {step > 0 && (
        <div className="flex items-center justify-between max-w-3xl mx-auto relative mb-8 px-4 py-2 bg-slate-50 rounded-2xl border border-slate-100">
          {[1, 2, 3, 4, 5].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                step >= s 
                  ? 'bg-[#0061D5] text-white shadow-md' 
                  : 'bg-white border-2 border-slate-200 text-slate-400'
              }`}>
                {step > s ? <Check size={14} /> : s}
              </div>
              <span className={`text-xs font-bold hidden sm:inline ${step >= s ? 'text-[#0061D5]' : 'text-slate-400'}`}>
                {s === 1 ? 'Thông tin chung' : 
                 s === 2 ? 'Hình thức' : 
                 s === 3 ? 'Kinh phí' : 
                 s === 4 ? 'Công nghệ' : 'Xác nhận'}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* CONTENT ZONE */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden min-h-[450px] flex flex-col">
        
        {/* STEP 0: PRE-SELECTION WIZARD */}
        {step === 0 && (
          <div className="p-8 md:p-12 space-y-8 flex-1 flex flex-col justify-center animate-in fade-in duration-300">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <h2 className="text-2xl font-black text-slate-800">Chọn Mục Đích Tổ Chức Sự Kiện</h2>
              <p className="text-slate-500 font-medium text-sm">
                Vui lòng chọn loại hình sự kiện của bạn. Hệ thống sẽ cá nhân hóa biểu mẫu thiết lập tương ứng giúp giảm tải thông tin không cần thiết.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto w-full pt-4">
              
              {/* CARD 1: CÁ NHÂN */}
              <div 
                onClick={() => handleIntentSelection("individual")}
                className="group border border-slate-200 hover:border-blue-400 rounded-3xl p-8 cursor-pointer hover:shadow-2xl hover:shadow-blue-50 bg-gradient-to-br from-white to-slate-50/50 hover:to-blue-50/10 transition-all active:scale-98 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-bl-full group-hover:bg-blue-500/10 transition-colors"></div>
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white mb-6 shadow-lg shadow-blue-100 group-hover:scale-110 transition-transform">
                  <User size={28} />
                </div>
                <h3 className="text-lg font-black text-slate-800 mb-2 flex items-center gap-2 group-hover:text-blue-600 transition-colors">
                  Cá Nhân Tham Gia
                  <Sparkles size={16} className="text-amber-500" />
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed font-medium">
                  Phù hợp cho các buổi thảo luận, seminar khoa học, hoạt động hiến máu, chiến dịch tình nguyện cá nhân... Sinh viên đăng ký và quét QR điểm danh đơn lẻ.
                </p>
              </div>

              {/* CARD 2: ĐỘI NHÓM */}
              <div 
                onClick={() => handleIntentSelection("team")}
                className="group border border-slate-200 hover:border-orange-400 rounded-3xl p-8 cursor-pointer hover:shadow-2xl hover:shadow-orange-50 bg-gradient-to-br from-white to-slate-50/50 hover:to-orange-50/10 transition-all active:scale-98 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 rounded-bl-full group-hover:bg-orange-500/10 transition-colors"></div>
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white mb-6 shadow-lg shadow-orange-100 group-hover:scale-110 transition-transform">
                  <Users size={28} />
                </div>
                <h3 className="text-lg font-black text-slate-800 mb-2 flex items-center gap-2 group-hover:text-orange-600 transition-colors">
                  Đội Nhóm Thi Đấu
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed font-medium">
                  Phù hợp cho các cuộc thi học thuật, giải thể thao cấp trường/khoa, các trò chơi teambuilding tập thể... Cho phép Trưởng nhóm đăng ký và xác nhận thành viên.
                </p>
              </div>

            </div>
          </div>
        )}

        {/* STEP 1: GENERAL INFO */}
        {step === 1 && (
          <div className="p-8 space-y-6 flex-1 animate-in slide-in-from-right-4 duration-300">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 border-b pb-3">
              <Calendar size={18} className="text-[#0061D5]" />
              1. Thông Tin Chung & Ảnh Bìa Sự Kiện
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Cột trái: Text Fields */}
              <div className="lg:col-span-7 space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                    Tên sự kiện <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Ví dụ: Hội thảo Nghiên cứu Khoa học Sinh viên 2026..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#0061D5] outline-none font-bold text-slate-700 shadow-inner"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                      <Clock size={14} className="text-slate-400" />
                      Thời gian bắt đầu <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="datetime-local"
                      name="start_time"
                      value={formData.start_time}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#0061D5] outline-none font-bold text-slate-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                      <Clock size={14} className="text-slate-400" />
                      Thời gian kết thúc <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="datetime-local"
                      name="end_time"
                      value={formData.end_time}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#0061D5] outline-none font-bold text-slate-700"
                    />
                  </div>
                </div>

                {/* Địa điểm */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <MapPin size={14} className="text-slate-400" />
                    Địa điểm tổ chức <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-2">
                    {formData.locationType === "preset" ? (
                      <select
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        className="flex-1 px-4 py-3 rounded-xl border border-slate-200 outline-none font-bold text-slate-700 bg-white"
                      >
                        <option value="">-- Chọn Địa điểm có sẵn --</option>
                        {availableLocations.map((loc) => (
                          <option key={loc.id} value={loc.id}>
                            {loc.name} (Sức chứa: {loc.capacity})
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        name="customLocation"
                        value={formData.customLocation}
                        onChange={handleInputChange}
                        placeholder="Nhập địa điểm tùy chỉnh mới..."
                        className="flex-1 px-4 py-3 rounded-xl border border-slate-200 outline-none font-bold text-slate-700"
                      />
                    )}
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ 
                        ...prev, 
                        locationType: prev.locationType === "preset" ? "custom" : "preset" 
                      }))}
                      className="px-4 py-2 rounded-xl bg-blue-50 text-blue-600 font-bold text-xs uppercase tracking-wider hover:bg-blue-100 transition-colors border border-blue-100"
                    >
                      {formData.locationType === "preset" ? "+ Tùy chỉnh" : "Chọn phòng"}
                    </button>
                  </div>
                </div>

                {/* Mô tả chi tiết */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Mô tả sự kiện</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Mô tả tóm tắt ý nghĩa, nội dung chi tiết của sự kiện..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#0061D5] outline-none font-medium text-slate-700 shadow-inner resize-none"
                  />
                </div>
              </div>

              {/* Cột phải: Upload Cover Image - BẮT BUỘC */}
              <div className="lg:col-span-5 space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                    Ảnh bìa sự kiện <span className="text-red-500">* (Bắt buộc)</span>
                  </label>

                  {/* Vùng xem trước / Tải ảnh */}
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="event-cover-upload"
                    />
                    {!previewUrl ? (
                      <label
                        htmlFor="event-cover-upload"
                        className="h-48 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 flex flex-col items-center justify-center p-6 text-center cursor-pointer hover:border-blue-400 hover:bg-white transition-all shadow-inner group"
                      >
                        <div className="h-10 w-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-blue-600 mb-3 group-hover:scale-110 transition-transform">
                          <Upload size={20} />
                        </div>
                        <p className="text-xs font-bold text-slate-800">Tải ảnh bìa lên (16:9)</p>
                        <p className="text-[10px] font-medium text-slate-400 mt-1 uppercase">PNG, JPG tối đa 5MB</p>
                      </label>
                    ) : (
                      <div className="relative h-48 rounded-2xl overflow-hidden border border-blue-200 shadow-lg group">
                        <img 
                          src={previewUrl} 
                          alt="Cover Preview" 
                          className="w-full h-full object-cover"
                        />
                        <label
                          htmlFor="event-cover-upload"
                          className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 text-white font-bold text-xs cursor-pointer transition-opacity backdrop-blur-xs"
                        >
                          <Image size={16} /> Thay đổi ảnh
                        </label>
                      </div>
                    )}
                  </div>
                </div>

                {/* Chọn từ mẫu ảnh chất lượng cao */}
                <div className="space-y-3 pt-2">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Hoặc chọn ảnh mẫu cao cấp</p>
                  <div className="grid grid-cols-2 gap-3">
                    {defaultCovers.map((cover, i) => (
                      <div 
                        key={i}
                        onClick={() => handleSelectCover(cover.url)}
                        className={`group relative h-20 rounded-xl overflow-hidden cursor-pointer border-2 transition-all hover:scale-[1.02] ${
                          formData.image_url === cover.url ? "border-blue-500 ring-2 ring-blue-100" : "border-transparent"
                        }`}
                      >
                        <img 
                          src={cover.url} 
                          alt={cover.name} 
                          className="w-full h-full object-cover" 
                        />
                        <div className="absolute inset-0 bg-slate-900/30 flex items-end p-2">
                          <span className="text-[9px] font-bold text-white leading-tight truncate">{cover.name}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* STEP 2: PARTICIPATION SETTINGS */}
        {step === 2 && (
          <div className="p-8 space-y-6 flex-1 animate-in slide-in-from-right-4 duration-300">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 border-b pb-3">
              <Users size={18} className="text-[#0061D5]" />
              2. Hình Thức Đăng Ký & Đối Tượng Tham Gia
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Phần 1: Số lượng và Cấu hình Đội thi */}
              <div className="space-y-5 bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Cấu Hình Số Lượng</h4>
                
                {formData.participationType === "team" ? (
                  <div className="space-y-4">
                    <p className="p-3 bg-orange-50 text-orange-700 text-xs font-semibold rounded-xl border border-orange-100">
                      Sự kiện được cấu hình dưới dạng <b>Đội Nhóm</b>. Vui lòng thiết lập quy mô thành viên.
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-600 block">Số thành viên tối thiểu/đội</label>
                        <input
                          type="number"
                          name="minTeamSize"
                          value={formData.minTeamSize}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none font-bold text-slate-700"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-600 block">Số thành viên tối đa/đội</label>
                        <input
                          type="number"
                          name="maxTeamSize"
                          value={formData.maxTeamSize}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none font-bold text-slate-700"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="p-3 bg-blue-50 text-blue-700 text-xs font-semibold rounded-xl border border-blue-100">
                      Sự kiện được cấu hình dưới dạng <b>Đăng ký Cá nhân</b>. Bỏ qua cấu hình nhóm.
                    </p>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-600 block">Sức chứa tối đa (Sinh viên) <span className="text-red-500">*</span></label>
                      <input
                        type="number"
                        name="capacity"
                        value={formData.capacity}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none font-bold text-slate-700"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Phần 2: Đối tượng tham gia */}
              <div className="space-y-5 bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Phạm Vi Tham Gia</h4>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200">
                    <div>
                      <span className="text-xs font-bold text-slate-700 block">Nội bộ khoa/đoàn trường</span>
                      <span className="text-[10px] text-slate-400 font-medium">Chỉ cho phép sinh viên thuộc đơn vị phụ trách đăng ký</span>
                    </div>
                    <input
                      type="checkbox"
                      name="allowInternal"
                      checked={formData.allowInternal}
                      onChange={handleInputChange}
                      className="w-5 h-5 accent-[#0061D5] cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200">
                    <div>
                      <span className="text-xs font-bold text-slate-700 block">Cho phép bên ngoài tham gia</span>
                      <span className="text-[10px] text-slate-400 font-medium">Khách mời hoặc sinh viên các đơn vị khác có thể đăng ký</span>
                    </div>
                    <input
                      type="checkbox"
                      name="allowExternal"
                      checked={formData.allowExternal}
                      onChange={handleInputChange}
                      className="w-5 h-5 accent-[#0061D5] cursor-pointer"
                    />
                  </div>

                  <div className="space-y-2 pt-2">
                    <label className="text-xs font-bold text-slate-600 block">Điểm rèn luyện cộng thưởng</label>
                    <input
                      type="number"
                      name="points_awarded"
                      value={formData.points_awarded}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none font-bold text-slate-700"
                    />
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* STEP 3: FUNDING & HOST */}
        {step === 3 && (
          <div className="p-8 space-y-6 flex-1 animate-in slide-in-from-right-4 duration-300">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 border-b pb-3">
              <Building size={18} className="text-[#0061D5]" />
              3. Dự Trù Kinh Phí & Đơn Vị Phụ Trách
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Đơn vị tổ chức */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                    Đơn vị chủ trì / phụ trách <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="org_id"
                    value={formData.org_id}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none font-bold text-slate-700 bg-white cursor-pointer"
                  >
                    <option value="">-- Chọn Đơn vị phụ trách --</option>
                    {organizations.map((org) => (
                      <option key={org.id} value={org.id}>
                        {org.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                    Trưởng ban tổ chức sự kiện <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="organizer"
                    value={formData.organizer}
                    onChange={handleInputChange}
                    placeholder="Họ và tên cán bộ/giảng viên phụ trách"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#0061D5] outline-none font-bold text-slate-700"
                  />
                </div>
              </div>

              {/* Ngân sách */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                    Ngân sách dự kiến (VNĐ)
                  </label>
                  <input
                    type="number"
                    name="budget"
                    value={formData.budget}
                    onChange={handleInputChange}
                    placeholder="0"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#0061D5] outline-none font-bold text-slate-700"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                    Nguồn kinh phí
                  </label>
                  <select
                    name="fundingSource"
                    value={formData.fundingSource}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none font-bold text-slate-700 bg-white cursor-pointer"
                  >
                    <option value="Quỹ Khoa">Quỹ Khoa</option>
                    <option value="Quỹ Đoàn trường">Quỹ Đoàn trường</option>
                    <option value="Tài trợ bên ngoài">Tài trợ bên ngoài (Sponsors)</option>
                    <option value="Kinh phí tự có">Kinh phí tự túc sinh viên</option>
                  </select>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* STEP 4: TECHNOLOGY CONFIGS */}
        {step === 4 && (
          <div className="p-8 space-y-6 flex-1 animate-in slide-in-from-right-4 duration-300">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 border-b pb-3">
              <Shield size={18} className="text-[#0061D5]" />
              4. Cấu Hình Công Nghệ Điểm Danh & Giấy Chứng Nhận
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Công nghệ điểm danh */}
              <div className="space-y-4 bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Điểm Danh Thông Minh</h4>

                <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200">
                  <div>
                    <span className="text-xs font-bold text-slate-700 block">Smart Check-in</span>
                    <span className="text-[10px] text-slate-400 font-medium">Tự động thay đổi Token QR Code mỗi 15 giây để chống gian lận</span>
                  </div>
                  <input
                    type="checkbox"
                    name="smartCheckin"
                    checked={formData.smartCheckin}
                    onChange={handleInputChange}
                    className="w-5 h-5 accent-[#0061D5] cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200">
                  <div>
                    <span className="text-xs font-bold text-slate-700 block">Định vị Geofencing</span>
                    <span className="text-[10px] text-slate-400 font-medium">Chỉ cho phép điểm danh nếu tọa độ GPS ở trong bán kính 100m hội trường</span>
                  </div>
                  <input
                    type="checkbox"
                    name="geofencing"
                    checked={formData.geofencing}
                    onChange={handleInputChange}
                    className="w-5 h-5 accent-[#0061D5] cursor-pointer"
                  />
                </div>
              </div>

              {/* Giấy chứng nhận điện tử */}
              <div className="space-y-4 bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Giấy Chứng Nhận Điện Tử</h4>

                <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200">
                  <div>
                    <span className="text-xs font-bold text-slate-700 block">Cấp E-Certificate</span>
                    <span className="text-[10px] text-slate-400 font-medium">Tự động sinh phôi và gửi Giấy chứng nhận PDF qua email sinh viên</span>
                  </div>
                  <input
                    type="checkbox"
                    name="eCertificate"
                    checked={formData.eCertificate}
                    onChange={handleInputChange}
                    className="w-5 h-5 accent-[#0061D5] cursor-pointer"
                  />
                </div>

                {formData.eCertificate && (
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-600 block">Mẫu Giấy Chứng Nhận (Template)</label>
                    <select
                      name="certificateTemplate"
                      value={formData.certificateTemplate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none font-bold text-slate-700 bg-white cursor-pointer"
                    >
                      <option value="blue">Mẫu Xanh Thanh Niên (Youth Blue)</option>
                      <option value="gold">Mẫu Học Thuật Vàng Kim (Academic Gold)</option>
                      <option value="red">Mẫu Thể Thao Đỏ Đô (Sporty Red)</option>
                    </select>
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {/* STEP 5: REVIEW & CONFIRM */}
        {step === 5 && (
          <div className="p-8 space-y-6 flex-1 animate-in slide-in-from-right-4 duration-300">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 border-b pb-3">
              <CheckCircle size={18} className="text-emerald-500" />
              5. Xác Nhận Cấu Hình & Lưu Sự Kiện
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Tóm tắt */}
              <div className="lg:col-span-8 space-y-4">
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded text-[9px] font-bold uppercase ${
                      formData.participationType === "team" ? "bg-orange-100 text-orange-700" : "bg-blue-100 text-blue-700"
                    }`}>
                      {formData.participationType === "team" ? "Đội nhóm" : "Cá nhân"}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">STATUS: PUBLISHED</span>
                  </div>
                  <h4 className="text-xl font-black text-slate-800 leading-tight">{formData.name}</h4>
                  <p className="text-slate-500 text-sm font-medium">{formData.description || "Chưa nhập mô tả."}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 border border-slate-100 rounded-xl">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Địa điểm</span>
                    <span className="text-sm font-bold text-slate-700">
                      {formData.locationType === "preset"
                        ? availableLocations.find(l => l.id === formData.location)?.name || formData.location
                        : formData.customLocation}
                    </span>
                  </div>
                  <div className="p-4 border border-slate-100 rounded-xl">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Điểm thưởng</span>
                    <span className="text-sm font-bold text-[#0061D5]">{formData.points_awarded} ĐRL</span>
                  </div>
                  <div className="p-4 border border-slate-100 rounded-xl">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Thời gian diễn ra</span>
                    <span className="text-xs font-bold text-slate-700 block">Bắt đầu: {formData.start_time.replace("T", " ")}</span>
                    <span className="text-xs font-bold text-slate-700">Kết thúc: {formData.end_time.replace("T", " ")}</span>
                  </div>
                  <div className="p-4 border border-slate-100 rounded-xl">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Đơn vị chủ trì</span>
                    <span className="text-xs font-bold text-slate-700 block">
                      {organizations.find(o => o.id === formData.org_id)?.name || "Chưa xác định"}
                    </span>
                    <span className="text-xs font-bold text-slate-700">BTC: {formData.organizer}</span>
                  </div>
                </div>
              </div>

              {/* Ảnh bìa */}
              <div className="lg:col-span-4 space-y-4">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Ảnh bìa sự kiện</span>
                <div className="h-44 rounded-2xl overflow-hidden border shadow-inner">
                  <img src={formData.image_url} alt="Cover Review" className="w-full h-full object-cover" />
                </div>
                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 flex items-start gap-2 text-emerald-800 text-xs font-semibold">
                  <CheckCircle size={16} className="shrink-0 text-emerald-600 mt-0.5" />
                  <p>Hệ thống tự động liên kết sự kiện này làm sự kiện con của Chiến dịch có khung thời gian phù hợp!</p>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* CONTROLS FOOTER */}
        <div className="flex items-center justify-between px-8 py-5 bg-slate-50 border-t border-slate-100">
          <div>
            {step > 0 && (
              <button
                type="button"
                onClick={handlePrev}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm bg-white hover:bg-slate-50 transition-colors"
              >
                <ArrowLeft size={16} />
                Quay lại
              </button>
            )}
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => navigate("/admin/campaigns/calendar")}
              className="px-6 py-2.5 rounded-xl border border-slate-200 text-slate-500 font-bold text-sm bg-white hover:bg-slate-50 transition-colors"
            >
              Hủy bỏ
            </button>
            {step > 0 && step < 5 ? (
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center gap-1.5 bg-[#0061D5] text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors shadow-lg shadow-blue-100"
              >
                Tiếp theo
                <ArrowRight size={16} />
              </button>
            ) : step === 5 ? (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="flex items-center gap-2 bg-emerald-600 text-white px-8 py-2.5 rounded-xl font-bold text-sm hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-100 active:scale-95 disabled:bg-slate-300 disabled:text-slate-500 disabled:shadow-none"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    Đang tạo sự kiện...
                  </>
                ) : (
                  <>
                    <Award size={18} />
                    Hoàn thành & Tạo sự kiện
                  </>
                )}
              </button>
            ) : null}
          </div>
        </div>

      </div>
    </div>
  );
};

export default EventCreatePage;
