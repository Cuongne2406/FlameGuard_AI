import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';
import * as Application from 'expo-application';
import { Platform } from 'react-native';

// Tự động lấy IP của máy tính đang chạy Metro Bundler để thay cho 'localhost'
// Điều này giúp App chạy trên điện thoại thật vẫn kết nối được tới Backend trên máy tính.
const getBaseUrl = () => {
    const hostUri = Constants.expoConfig?.hostUri;
    if (!hostUri) return 'http://localhost:8000/api/v1';

    // hostUri thường có dạng 192.168.x.x:8081, ta cần đổi sang port 8000 của Backend
    const ip = hostUri.split(':')[0];
    return `http://${ip}:8000/api/v1`;
};

const BASE_URL = getBaseUrl();

const apiClient = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Hàm lấy Device ID duy nhất (Punch 11 & 12)
export const getDeviceId = async () => {
    let deviceId = await SecureStore.getItemAsync('deviceId');

    if (!deviceId) {
        if (Platform.OS === 'android') {
            deviceId = Application.androidId;
        } else if (Platform.OS === 'ios') {
            deviceId = await Application.getIosIdForVendorAsync();
        } else {
            // Web hoặc fallback
            deviceId = Constants.installationId || `web-${Date.now()}`;
        }

        if (deviceId) {
            try {
                if (Platform.OS !== 'web') {
                    await SecureStore.setItemAsync('deviceId', deviceId);
                }
            } catch (e) {
                console.error('Failed to save deviceId:', e);
            }
        }
        return deviceId;
    }
};

// Interceptor xử lý Auth Token & Device ID
apiClient.interceptors.request.use(async (config) => {
    try {
        if (Platform.OS !== 'web') {
            const token = await SecureStore.getItemAsync('userToken');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }

        const deviceId = await getDeviceId();
        if (deviceId) {
            config.headers['X-Device-ID'] = deviceId;
        }
    } catch (e) {
        console.error('Auth interceptor error:', e);
    }

    return config;
}, (error) => {
    return Promise.reject(error);
});

// Hàm lấy thông tin người dùng hiện tại
export const getCurrentUser = async () => {
    try {
        const response = await apiClient.get('/users/me');
        return response.data;
    } catch (error) {
        console.error('Fetch user error:', error);
        throw error;
    }
};

// Hàm đăng nhập chính thức
export const login = async (username, password) => {
    const deviceId = await getDeviceId();

    // OAuth2 expects form-data for /login endpoint inside auth.py
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    try {
        const response = await apiClient.post('/auth/login', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'X-Device-ID': deviceId
            }
        });

        if (response.data.access_token && Platform.OS !== 'web') {
            await SecureStore.setItemAsync('userToken', response.data.access_token);
        }

        return response.data;
    } catch (error) {
        console.error('Login request error:', error);
        throw error;
    }
};

// --- EVENT APIS ---

// Lấy danh sách sự kiện
export const getEvents = async (skip = 0, limit = 20) => {
    try {
        const response = await apiClient.get('/events/', { params: { skip, limit } });
        return response.data;
    } catch (error) {
        console.error('Get events error:', error);
        throw error;
    }
};

// Lấy thông tin chi tiết một sự kiện
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
        // Backend không có endpoint /me/registrations trực tiếp trả về object đầy đủ dễ dàng, 
        // nhưng có /me/events trả về list tóm tắt.
        const response = await apiClient.get('/users/me/events');
        return response.data;
    } catch (error) {
        console.error('Get user registrations error:', error);
        throw error;
    }
};

// Cập nhật trạng thái đăng ký (Dùng cho Check-in)
export const updateRegistrationStatus = async (registrationId, status) => {
    try {
        const response = await apiClient.put(`/events/registrations/${registrationId}`, {
            status: status
        });
        return response.data;
    } catch (error) {
        console.error('Update registration status error:', error);
        throw error;
    }
};

export default apiClient;
