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
            await SecureStore.getItemAsync('deviceId', deviceId);
        }
    }
    return deviceId;
};

// Interceptor xử lý Auth Token & Device ID
apiClient.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('userToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  const deviceId = await getDeviceId();
  if (deviceId) {
    config.headers['X-Device-ID'] = deviceId;
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Hàm đăng nhập chính thức
export const login = async (username, password) => {
    const deviceId = await getDeviceId();
    
    // OAuth2 expects form-data for /login endpoint inside auth.py
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    const response = await apiClient.post('/auth/login', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
            'X-Device-ID': deviceId
        }
    });

    if (response.data.access_token) {
        await SecureStore.setItemAsync('userToken', response.data.access_token);
    }
    
    return response.data;
};

export default apiClient;
