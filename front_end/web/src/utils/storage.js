// Hàm lấy token
export const getToken = () => {
  return localStorage.getItem('access_token');
};

// Hàm lấy thông tin user
export const getUser = () => {
  const userStr = localStorage.getItem('user_info');
  if (userStr) return JSON.parse(userStr);
  return null;
};