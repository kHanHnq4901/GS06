import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { HomeScreen } from '../screens/HomeScreen';
import { HistoryScreen } from '../screens/HistoryScreen';
import { SettingsScreen } from '../screens/SettingsScreen';

export type MainTabParamList = {
  Home: undefined;
  History: undefined;
  Settings: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#3b82f6', // Màu khi được chọn (Xanh)
        tabBarInactiveTintColor: '#94a3b8', // Màu khi không chọn (Xám)
        tabBarStyle: {
          height: 60,
          paddingBottom: 6,
          paddingTop: 6, // Thêm chút padding trên cho cân đối
        },
        tabBarLabelStyle: {
          fontSize: 12, // Chỉnh cỡ chữ nếu cần
          fontWeight: '500',
        },
        tabBarIcon: ({ color, size }) => {
          let iconName = '';

          // Giữ nguyên logic check theo tên tiếng Anh (Code chuẩn)
          if (route.name === 'Home') iconName = 'home-outline';
          if (route.name === 'History') iconName = 'time-outline';
          if (route.name === 'Settings') iconName = 'settings-outline';

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ tabBarLabel: 'Trang chủ' }} // <--- Sửa ở đây
      />
      <Tab.Screen 
        name="History" 
        component={HistoryScreen} 
        options={{ tabBarLabel: 'Lịch sử' }}   // <--- Sửa ở đây
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingsScreen} 
        options={{ tabBarLabel: 'Cài đặt' }}   // <--- Sửa ở đây
      />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;