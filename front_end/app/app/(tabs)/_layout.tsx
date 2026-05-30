import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  Calendar, 
  Bell, 
  User,
  LayoutDashboard
} from 'lucide-react-native';
import { COLORS, SHADOWS } from '../../src/constants/theme';

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const baseTabHeight = Platform.OS === 'ios' ? 58 : 62;
  const bottomPadding = Platform.OS === 'ios' ? Math.max(insets.bottom, 16) : Math.max(insets.bottom, 10);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopWidth: 1,
          borderTopColor: COLORS.border,
          height: baseTabHeight + bottomPadding,
          paddingBottom: bottomPadding,
          paddingTop: 10,
          ...SHADOWS.medium,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '700',
          marginBottom: Platform.OS === 'ios' ? 0 : 2,
        },
        tabBarItemStyle: {
          paddingVertical: 2,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <LayoutDashboard size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="events"
        options={{
          title: 'Sự kiện',
          tabBarIcon: ({ color }) => <Calendar size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: 'Thông báo',
          tabBarIcon: ({ color }) => <Bell size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Cá nhân',
          tabBarIcon: ({ color }) => <User size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
