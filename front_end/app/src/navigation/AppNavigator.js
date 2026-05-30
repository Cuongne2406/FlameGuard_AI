import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { View, Text } from 'react-native';

// Màn hình tạm thời (Placeholder)
const HomeScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Màn hình Sự kiện (Wow UI Coming Soon...)</Text>
  </View>
);

const ProfileScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Màn hình Hồ sơ (Wow UI Coming Soon...)</Text>
  </View>
);

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Khám phá' }} />
        <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Cá nhân' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
