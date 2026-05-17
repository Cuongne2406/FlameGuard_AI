import React, { createContext, useState, useContext, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { login as loginApi, getCurrentUser } from '../api/client';
import { Platform } from 'react-native';

interface AuthContextType {
  user: any | null;
  userToken: string | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userToken: null,
  isLoading: true,
  login: async () => { },
  logout: async () => { },
  refreshUser: async () => { },
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState<string | null>(null);
  const [user, setUser] = useState<any | null>(null);

  // Khôi phục phiên đăng nhập khi khởi động app
  useEffect(() => {
    const bootstrapAsync = async () => {
      let token;

      try {
        if (Platform.OS !== 'web') {
          token = await SecureStore.getItemAsync('userToken');
        } else {
          token = localStorage.getItem('userToken');
        }
      } catch (e) {
        console.error('Failed to restore token:', e);
      }

      if (token) {
        setUserToken(token);
        try {
          // Lấy profile người dùng thật từ Backend
          const userData = await getCurrentUser();
          setUser(userData);
        } catch (e) {
          console.error('Failed to fetch user profile during bootstrap:', e);
          // Nếu token hết hạn hoặc lỗi, xóa token
          if (Platform.OS !== 'web') {
            await SecureStore.deleteItemAsync('userToken');
          } else {
            localStorage.removeItem('userToken');
          }
          setUserToken(null);
        }
      }
      setIsLoading(false);
    };

    bootstrapAsync();
  }, []);

  const authContext = {
    user,
    userToken,
    isLoading,
    login: async (username: string, password: string) => {
      setIsLoading(true);
      try {
        const data = await loginApi(username, password);
        if (data.access_token) {
          if (Platform.OS !== 'web') {
            await SecureStore.setItemAsync('userToken', data.access_token);
          } else {
            localStorage.setItem('userToken', data.access_token);
          }
          setUserToken(data.access_token);
          // Sau khi login thành công, lấy thông tin user đầy đủ
          const profile = await getCurrentUser();
          setUser(profile);
        }
      } catch (e) {
        throw e;
      } finally {
        setIsLoading(false);
      }
    },
    logout: async () => {
      try {
        if (Platform.OS !== 'web') {
          await SecureStore.deleteItemAsync('userToken');
        } else {
          localStorage.removeItem('userToken');
          localStorage.removeItem('accessToken');
        }
        setUserToken(null);
        setUser(null);
      } catch (e) {
        console.error('Logout error:', e);
      }
    },
    refreshUser: async () => {
      try {
        const profile = await getCurrentUser();
        setUser(profile);
      } catch (e) {
        console.error('Refresh user error:', e);
      }
    },
  };

  return (
    <AuthContext.Provider value={authContext}>
      {children}
    </AuthContext.Provider>
  );
};
