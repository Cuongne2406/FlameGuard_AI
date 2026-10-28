import React from 'react';
import { CheckCircle2, Clock, AlertCircle, XCircle, RotateCcw, FileText, Award } from 'lucide-react';

export const STATUS_CONFIG = {
  APPROVED: {
    label: 'Đã phê duyệt',
    classes: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    dot: 'bg-emerald-500',
    icon: CheckCircle2
  },
  PASSED: {
    label: 'Đạt',
    classes: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    dot: 'bg-emerald-500',
    icon: CheckCircle2
  },
  QUALIFIED: {
    label: 'Đủ tiêu chuẩn',
    classes: 'bg-purple-50 text-purple-700 border border-purple-200',
    dot: 'bg-purple-500',
    icon: Award
  },
  PENDING_PROVINCE: {
    label: 'Chờ Đoàn Trường duyệt',
    classes: 'bg-sky-50 text-sky-700 border border-sky-200',
    dot: 'bg-sky-500',
    icon: Clock
  },
  PENDING_SCHOOL: {
    label: 'Chờ Khoa sơ duyệt',
    classes: 'bg-sky-50 text-sky-700 border border-sky-200',
    dot: 'bg-sky-500',
    icon: Clock
  },
  PENDING: {
    label: 'Chờ duyệt',
    classes: 'bg-sky-50 text-sky-700 border border-sky-200',
    dot: 'bg-sky-500',
    icon: Clock
  },
  PROVINCE_RETURNED: {
    label: 'Đoàn Trường yêu cầu bổ sung',
    classes: 'bg-amber-50 text-amber-700 border border-amber-200',
    dot: 'bg-amber-500',
    icon: RotateCcw
  },
  RETURNED: {
    label: 'Khoa trả về bổ sung',
    classes: 'bg-amber-50 text-amber-700 border border-amber-200',
    dot: 'bg-amber-500',
    icon: RotateCcw
  },
  UNQUALIFIED: {
    label: 'Chưa đủ tiêu chuẩn',
    classes: 'bg-rose-50 text-rose-700 border border-rose-200',
    dot: 'bg-rose-500',
    icon: AlertCircle
  },
  REJECTED: {
    label: 'Hồ sơ không đạt',
    classes: 'bg-rose-50 text-rose-700 border border-rose-200',
    dot: 'bg-rose-500',
    icon: XCircle
  },
  FAILED: {
    label: 'Không đạt',
    classes: 'bg-rose-50 text-rose-700 border border-rose-200',
    dot: 'bg-rose-500',
    icon: XCircle
  },
  DRAFT: {
    label: 'Nháp',
    classes: 'bg-slate-100 text-slate-700 border border-slate-200',
    dot: 'bg-slate-400',
    icon: FileText
  },
  ONGOING: {
    label: 'Đang diễn ra',
    classes: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    dot: 'bg-emerald-500',
    icon: CheckCircle2
  },
  UPCOMING: {
    label: 'Chưa bắt đầu',
    classes: 'bg-sky-50 text-sky-700 border border-sky-200',
    dot: 'bg-sky-500',
    icon: Clock
  },
  ENDED: {
    label: 'Đã kết thúc',
    classes: 'bg-slate-100 text-slate-700 border border-slate-200',
    dot: 'bg-slate-400',
    icon: CheckCircle2
  }
};

const AwardStatusBadge = ({ status, isLate, size = 'sm', showIcon = true }) => {
  const config = STATUS_CONFIG[status] || {
    label: status || 'Không xác định',
    classes: 'bg-slate-100 text-slate-700 border border-slate-200',
    dot: 'bg-slate-400',
    icon: FileText
  };

  const Icon = config.icon;
  const sizeClasses = size === 'xs' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';

  return (
    <div className="inline-flex items-center gap-1.5 flex-wrap">
      <span className={`inline-flex items-center gap-1.5 rounded-md font-medium tracking-wide ${config.classes} ${sizeClasses}`}>
        {showIcon && <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />}
        {config.label}
      </span>
      {isLate && (
        <span className={`inline-flex items-center gap-1 rounded-md font-medium bg-amber-50 text-amber-700 border border-amber-200 ${sizeClasses}`}>
          <Clock size={11} />
          Gửi muộn
        </span>
      )}
    </div>
  );
};

export default AwardStatusBadge;
