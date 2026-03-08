import React, { useEffect } from 'react';

/**
 * Toast Component - Thông báo ngắn hạn (Success/Error)
 */
const Toast = ({ message, type = 'success', onClose, duration = 3000 }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);
        return () => clearTimeout(timer);
    }, [onClose, duration]);

    const icons = {
        success: 'check_circle',
        error: 'error',
        info: 'info',
        warning: 'warning'
    };

    const colors = {
        success: 'bg-green-50 text-green-700 border-green-100',
        error: 'bg-red-50 text-red-700 border-red-100',
        info: 'bg-blue-50 text-blue-700 border-blue-100',
        warning: 'bg-yellow-50 text-yellow-700 border-yellow-100'
    };

    const iconColors = {
        success: 'text-green-500',
        error: 'text-red-500',
        info: 'text-blue-500',
        warning: 'text-yellow-500'
    };

    return (
        <div className="fixed bottom-6 right-6 z-[200] animate-in slide-in-from-right-10 fade-in duration-300">
            <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg ${colors[type]}`}>
                <span className={`material-symbols-outlined ${iconColors[type]}`}>
                    {icons[type]}
                </span>
                <p className="text-sm font-bold">{message}</p>
                <button
                    onClick={onClose}
                    className="ml-2 hover:opacity-70 transition-opacity"
                >
                    <span className="material-symbols-outlined text-sm">close</span>
                </button>
            </div>
        </div>
    );
};

export default Toast;
