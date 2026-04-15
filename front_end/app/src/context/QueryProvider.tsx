import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Khởi tạo một global client cho toàn bộ App
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // Dữ liệu sẽ "tươi" (fresh) trong 5 phút, không refetch lại nếu chưa hết time
      retry: 1, // Nếu mất mạng / lỗi, chỉ tự động thử lại 1 lần
      refetchOnWindowFocus: false, // Tắt tính năng tự reload khi tab focus (thường dùng cho web)
    },
  },
});

export const QueryProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};
