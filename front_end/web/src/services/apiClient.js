const API_URL = import.meta.env.VITE_API_URL || 'http://api-auth.s4h.edu.vn';

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

    if (!response.ok) {
      // Handle HTTP errors
      throw new Error(data.message || 'API Error');
    }

    return data;
  } catch (error) {
    console.error(`API Error on ${endpoint}:`, error);
    throw error;
  }
};
