// Hàm định dạng tiền tệ VNĐ
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

// Hàm định dạng ngày tháng (DD/MM/YYYY)
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN');
};