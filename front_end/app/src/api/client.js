import axios from 'axios';
import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const expoApiUrl = Constants.expoConfig?.extra?.apiUrl;
const envApiUrl = process.env.EXPO_PUBLIC_API_URL;
const API_URL = envApiUrl || expoApiUrl || 'http://192.168.10.51:8000/api/v1';

const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
    async (config) => {
        let token = null;
        try {
            if (Platform.OS === 'web') {
                token = localStorage.getItem('userToken');
            } else {
                token = await SecureStore.getItemAsync('userToken');
            }
        } catch (error) {
            console.error('Error fetching token:', error);
        }

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// --- AUTH APIS ---

export const login = async (username, password) => {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    try {
        const response = await apiClient.post('/auth/login', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        if (error?.message === 'Network Error') {
            console.error(`Login network error. API_URL=${API_URL}`);
        }
        throw error;
    }
};

export const getCurrentUser = async () => {
    try {
        const response = await apiClient.get('/users/me');
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateUser = async (userData) => {
    try {
        const response = await apiClient.put('/users/me', userData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const uploadAvatar = async (imageUri) => {
    const formData = new FormData();

    // React Native FormData requires an object with uri, type, and name
    const uriParts = imageUri.split('.');
    const fileType = uriParts[uriParts.length - 1];

    formData.append('file', {
        uri: imageUri,
        name: `avatar.${fileType}`,
        type: `image/${fileType}`,
    });

    try {
        const response = await apiClient.post('/users/me/avatar', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Cập nhật Push Token cho User
export const updatePushToken = async (token) => {
    try {
        const response = await apiClient.put('/users/me', {
            push_token: token
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

// --- EVENT APIS ---

export const getEvents = async (skip = 0, limit = 10) => {
    try {
        const response = await apiClient.get('/events/', { params: { skip, limit } });
        return response.data;
    } catch (error) {
        console.error('Get events error:', error);
        throw error;
    }
};

export const getEventDetail = async (eventId) => {
    try {
        const response = await apiClient.get(`/events/${eventId}`);
        return response.data;
    } catch (error) {
        console.error('Get event detail error:', error);
        throw error;
    }
};

// Lấy chi tiết/tóm tắt sự kiện (stats)
export const getEventSummary = async (eventId) => {
    try {
        const response = await apiClient.get(`/events/${eventId}/summary`);
        return response.data;
    } catch (error) {
        console.error('Get event summary error:', error);
        throw error;
    }
};

// Đăng ký tham gia sự kiện
export const registerEvent = async (eventId, userId) => {
    try {
        const response = await apiClient.post(`/events/${eventId}/register`, {
            event_id: eventId,
            user_id: userId
        });
        return response.data;
    } catch (error) {
        console.error('Register event error:', error);
        throw error;
    }
};

// Lấy danh sách đăng ký của user hiện tại (để tìm registration_id)
export const getUserRegistrations = async (userId) => {
    try {
        const response = await apiClient.get('/users/me/events');
        return response.data;
    } catch (error) {
        console.error('Get user registrations error:', error);
        throw error;
    }
};

// Cập nhật trạng thái tham gia sự kiện (Check-in)
export const updateRegistrationStatus = async (registrationId, status) => {
    try {
        const response = await apiClient.put(`/events/registrations/${registrationId}/approve`);
        // Note: The backend endpoint is named 'approve' but it can be used for check-in
        return response.data;
    } catch (error) {
        console.error('Update registration status error:', error);
        throw error;
    }
};

// --- NOTIFICATION APIS ---

// Lấy danh sách thông báo của tôi
export const getMyNotifications = async (skip = 0, limit = 50) => {
    try {
        const response = await apiClient.get('/notifications/me', { params: { skip, limit } });
        return response.data;
    } catch (error) {
        console.error('Get notifications error:', error);
        throw error;
    }
};

// Đánh dấu một thông báo đã đọc
export const markNotificationRead = async (notificationId) => {
    try {
        const response = await apiClient.put(`/notifications/${notificationId}/read`);
        return response.data;
    } catch (error) {
        console.error('Mark notification read error:', error);
        throw error;
    }
};

// Đánh dấu tất cả thông báo đã đọc
export const markAllNotificationsRead = async () => {
    try {
        const response = await apiClient.post('/notifications/read-all');
        return response.data;
    } catch (error) {
        console.error('Mark all notifications read error:', error);
        throw error;
    }
};

// --- Q&A APIS ---

// Lấy danh sách câu hỏi của một sự kiện
export const getEventQA = async (eventId, skip = 0, limit = 50) => {
    try {
        const response = await apiClient.get(`/events/${eventId}/qa`, { params: { skip, limit } });
        return response.data;
    } catch (error) {
        console.error('Get event QA error:', error);
        throw error;
    }
};

// Đặt câu hỏi cho một sự kiện
export const postQuestion = async (eventId, question, userId) => {
    try {
        const response = await apiClient.post(`/events/${eventId}/qa`, {
            event_id: eventId,
            user_id: userId,
            question: question
        });
        return response.data;
    } catch (error) {
        console.error('Post question error:', error);
        throw error;
    }
};

// --- FEEDBACK APIS ---

// Gửi phản hồi/đánh giá cho một sự kiện
export const submitFeedback = async (eventId, rating, comment, userId) => {
    try {
        const response = await apiClient.post(`/events/${eventId}/feedbacks`, {
            event_id: eventId,
            user_id: userId,
            rating: rating,
            comment: comment
        });
        return response.data;
    } catch (error) {
        console.error('Submit feedback error:', error);
        throw error;
    }
};

// --- AWARDS APIS ---
export const getAwards = async (skip = 0, limit = 100) => {
    try {
        const response = await apiClient.get('/awards/', { params: { skip, limit } });
        return response.data;
    } catch (error) {
        console.error('Get awards error:', error);
        throw error;
    }
};

export const submitAwardRequest = async (awardData) => {
    try {
        const response = await apiClient.post('/awards/', awardData);
        return response.data;
    } catch (error) {
        console.error('Submit award request error:', error);
        throw error;
    }
};

// --- DOCUMENTS APIS ---
export const getDocuments = async (skip = 0, limit = 100) => {
    try {
        const response = await apiClient.get('/documents/', { params: { skip, limit } });
        return response.data;
    } catch (error) {
        console.error('Get documents error:', error);
        throw error;
    }
};

export const createDocumentRequest = async (docData) => {
    try {
        const response = await apiClient.post('/documents/', docData);
        return response.data;
    } catch (error) {
        console.error('Create document request error:', error);
        throw error;
    }
};

// --- SECURE CHECK-IN API ---
export const checkInSecure = async (registrationId, qrData) => {
    try {
        const response = await apiClient.post(`/events/registrations/${registrationId}/check-in-secure`, null, {
            params: { qr_data: qrData }
        });
        return response.data;
    } catch (error) {
        console.error('Check in secure error:', error);
        throw error;
    }
};

export default apiClient;
