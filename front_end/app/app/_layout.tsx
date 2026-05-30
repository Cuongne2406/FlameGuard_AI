import React, { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { QueryProvider } from '../src/context/QueryProvider';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { COLORS } from '../src/constants/theme';
import { AuthProvider, useAuth } from '../src/context/AuthContext';
import { usePushNotifications } from '../src/hooks/usePushNotifications';

// Expo Router configuration
export const unstable_settings = {
  initialRouteName: '(tabs)',
};

function InitialLayout() {
  const { userToken, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const colorScheme = useColorScheme();
  
  // Initialize push notification settings safely
  usePushNotifications();

  useEffect(() => {
    if (isLoading) return;

    const inLoginGroup = segments[0] === 'login';

    if (!userToken && !inLoginGroup) {
      // Redirect to login if not authenticated
      router.replace('/login');
    } else if (userToken && inLoginGroup) {
      // Redirect to tabs if authenticated
      router.replace('/(tabs)');
    }
  }, [userToken, isLoading, segments, router]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="login" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="settings" options={{ presentation: 'card' }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <QueryProvider>
        <AuthProvider>
          <InitialLayout />
        </AuthProvider>
      </QueryProvider>
    </SafeAreaProvider>
  );
}
