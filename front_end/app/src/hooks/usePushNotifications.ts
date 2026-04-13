import { useState, useEffect, useRef } from 'react';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { updatePushToken } from '../api/client';

// Định nghĩa lại các Interface cục bộ để không phải import trực tiếp gây crash
export interface PushNotificationState {
  notification?: any;
  expoPushToken?: string;
}

export const usePushNotifications = (): PushNotificationState => {
  const [expoPushToken, setExpoPushToken] = useState<string | undefined>();
  const [notification, setNotification] = useState<any | undefined>();
  
  // Lưu trữ các subscription bằng useRef
  const notificationListener = useRef<any>();
  const responseListener = useRef<any>();

  async function registerForPushNotificationsAsync() {
    // Chỉ nạp thư viện nếu KHÔNG phải Expo Go
    if (Constants.appOwnership === 'expo' || Platform.OS === 'web') {
      console.log('Push Notification registration skipped (Expo Go or Web)');
      return undefined;
    }

    try {
      // Dynamic require để tránh crash module level
      const Notifications = require('expo-notifications');
      
      let token;

      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }

      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.log('Failed to get push token for push notification!');
        return;
      }

      const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ||
        Constants?.easConfig?.projectId;
        
      if (!projectId) {
          console.log('Project ID not found in build config');
      }

      token = (await Notifications.getExpoPushTokenAsync({
          projectId,
      })).data;
      
      if (token) {
          console.log('Expo Push Token obtained:', token);
          await updatePushToken(token);
      }
      
      return token;
    } catch (e) {
      console.log('Push registration error (Development Build required for full support):', e);
      return undefined;
    }
  }

  useEffect(() => {
    // Chỉ khởi tạo listener nếu KHÔNG phải Expo Go
    if (Constants.appOwnership === 'expo' || Platform.OS === 'web') {
      return;
    }

    try {
      const Notifications = require('expo-notifications');

      registerForPushNotificationsAsync().then((token) => setExpoPushToken(token));

      notificationListener.current = Notifications.addNotificationReceivedListener((notif: any) => {
        setNotification(notif);
      });

      responseListener.current = Notifications.addNotificationResponseReceivedListener((response: any) => {
        console.log('Notification Response:', response);
      });

      return () => {
        if (notificationListener.current) {
          Notifications.removeNotificationSubscription(notificationListener.current);
        }
        if (responseListener.current) {
          Notifications.removeNotificationSubscription(responseListener.current);
        }
      };
    } catch (e) {
      console.log('Notification listener setup error:', e);
    }
  }, []);

  return {
    expoPushToken,
    notification,
  };
};
