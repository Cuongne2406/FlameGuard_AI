const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

/**
 * Generic API client handling JSON parsing and Authentication tokens.
 * Usage: apiClient('/users/me', { method: 'GET' })
 */
export const apiClient = async (endpoint, options = {}) => {
  const token = localStorage.getItem('accessToken');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);
    
    // Check if the response is empty (e.g. 204 No Content)
    const text = await response.text();
    const data = text ? JSON.parse(text) : {};

    if (response.status === 401) {
      // Don't redirect if it's a login failure
      if (endpoint === '/auth/login') {
        const errorMessage = data.detail || data.message || 'Tài khoản hoặc mật khẩu không chính xác.';
        throw new Error(errorMessage);
      }
      
      // Clear token and redirect to login if unauthorized
      localStorage.removeItem('accessToken');
      window.location.href = '/'; 
      throw new Error('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
    }

    if (!response.ok) {
      // Handle HTTP errors
      const errorMessage = data.detail || data.message || 'API Error';
      throw new Error(errorMessage);
    }

    return data;
  } catch (error) {
    console.error(`API Error on ${endpoint}:`, error);
    throw error;
  }
};
