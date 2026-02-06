import React, { useState, useEffect } from 'react';
import { Card, Button, Badge } from '../../../components/ui';

/**
 * Checkin Page - Trang điểm danh qua mã QR
 */
const Checkin = () => {
    const [scanState, setScanState] = useState('idle'); // idle, scanning, success, error
    const [scannedData, setScannedData] = useState(null);

    const handleStartScan = () => {
        setScanState('scanning');
        // Giả lập quét thành công sau 2 giây
        setTimeout(() => {
            setScanState('success');
            setScannedData({
                eventName: 'Hội nghị học tập Nghị quyết Đại hội Đoàn',
                time: '08:15',
                date: '06/02/2026',
                points: '+15 điểm'
            });
        }, 2000);
    };

    return (
        <div className="max-w-md mx-auto space-y-6 animate-fade-in">
            <div className="text-center space-y-2">
                <h1 className="text-2xl font-bold text-gray-900">Điểm danh sự kiện</h1>
                <p className="text-sm text-gray-500">Quét mã QR tại địa điểm tổ chức để ghi nhận tham gia</p>
            </div>

            <Card noPadding className="overflow-hidden">
                <div className="aspect-square bg-black relative flex items-center justify-center">
                    {scanState === 'idle' && (
                        <div className="text-center space-y-4">
                            <span className="material-symbols-outlined text-white/20 text-8xl">qr_code_scanner</span>
                            <div className="px-6">
                                <Button variant="primary" fullWidth onClick={handleStartScan}>
                                    Bắt đầu quét
                                </Button>
                            </div>
                        </div>
                    )}

                    {scanState === 'scanning' && (
                        <>
                            {/* Simulator Camera View */}
                            <div className="absolute inset-0 bg-gray-900 flex items-center justify-center overflow-hidden">
                                <div className="w-64 h-64 border-2 border-white/50 rounded-3xl relative">
                                    <div className="absolute inset-0 border-2 border-primary rounded-3xl animate-pulse"></div>
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-primary shadow-[0_0_15px_rgba(0,102,179,0.8)] animate-scan-line"></div>
                                </div>
                            </div>
                            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white font-medium bg-black/40 px-4 py-2 rounded-full backdrop-blur-md text-sm">
                                Đang tìm mã QR...
                            </div>
                        </>
                    )}

                    {scanState === 'success' && (
                        <div className="absolute inset-0 bg-green-600 flex flex-col items-center justify-center text-white p-8 text-center space-y-4 animate-in fade-in zoom-in duration-300">
                            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-2">
                                <span className="material-symbols-outlined text-5xl">check_circle</span>
                            </div>
                            <h3 className="text-2xl font-bold">Điểm danh thành công!</h3>
                            <div className="space-y-1 opacity-90">
                                <p className="font-medium text-lg">{scannedData.eventName}</p>
                                <p className="text-sm">Vào lúc: {scannedData.time} - {scannedData.date}</p>
                            </div>
                            <Badge variant="warning" size="lg" className="bg-white/20 text-white border-white/40">
                                {scannedData.points}
                            </Badge>
                            <div className="pt-4 w-full">
                                <Button variant="secondary" fullWidth onClick={() => setScanState('idle')}>
                                    Tiếp tục điểm danh
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </Card>

            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                <h4 className="text-sm font-bold text-blue-900 mb-2 flex items-center gap-2">
                    <span className="material-symbols-outlined text-base">info</span>
                    Hướng dẫn
                </h4>
                <ul className="text-xs text-blue-700 space-y-2 list-disc pl-4 leading-relaxed">
                    <li>Đưa mã QR vào khung ngắm để hệ thống tự động nhận diện.</li>
                    <li>Sử dụng trình duyệt trên điện thoại để có trải nghiệm tốt nhất.</li>
                    <li>Đảm bảo bạn đứng đủ gần và ánh sáng tốt.</li>
                </ul>
            </div>

            <style>{`
                @keyframes scan-line {
                    0% { top: 0; }
                    100% { top: 100%; }
                }
                .animate-scan-line {
                    animation: scan-line 2s linear infinite;
                }
            `}</style>
        </div>
    );
};

export default Checkin;
