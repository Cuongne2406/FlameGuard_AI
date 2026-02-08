import axios from 'axios';

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/v1', // Địa chỉ Backend của bạn
    headers: { 'Content-Type': 'application/json' }
});

// Tự động gắn Token vào mọi yêu cầu gửi đi
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("access_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export default api;