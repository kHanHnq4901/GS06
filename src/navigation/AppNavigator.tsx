import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAppSelector } from '../store/hooks';

// --- 1. Import các màn hình ---
import { LoginScreen, RegisterScreen } from '../screens/Auth';
import MainTabNavigator from './MainTabNavigator';
import RoomDetailScreen from '../screens/RoomDetail';
import { ConfigDeviceScreen } from '../screens/ConfigDevice'; 
import { TermsScreen } from '../screens/TermsScreen';
import { PrivacyPolicyScreen } from '../screens/PrivacyPolicyScreen';

// Import thêm 2 màn hình settings
import { ChangePasswordScreen } from '../screens/ChangePasswordScreen';
import { EditProfileScreen } from '../screens/UploadImageScreen'; 

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  MainTabs: undefined;
  RoomDetail: undefined;
  ConfigDevice: undefined;
  Terms: undefined;
  PrivacyPolicy: undefined;
  ChangePassword: undefined; 
  EditProfile: undefined;    
};

const Stack = createStackNavigator<RootStackParamList>();

// --- CẤU HÌNH HEADER CHUNG ---
const commonHeaderOptions = {
  headerShown: true,
  headerBackTitleVisible: false,
  
  // Bạn đã sửa đúng cái này
  headerTitleAlign: 'center' as 'center', 
  
  headerStyle: {
    backgroundColor: '#fff',
    elevation: 0, 
    shadowOpacity: 0, 
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb'
  },
  headerTintColor: '#111827',
  headerTitleStyle: {
    // --- LỖI Ở ĐÂY ---
    // Cũ: fontWeight: 'bold', 
    // Mới (Sửa lại):
    fontWeight: 'bold' as 'bold', 
    
    fontSize: 18,
  },
};

const AppNavigator = () => {
  const { isAuthenticated } = useAppSelector(
    state => state.smartHome.auth
  );

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="MainTabs" component={MainTabNavigator} />
            
            <Stack.Screen 
              name="RoomDetail" 
              component={RoomDetailScreen} 
              options={{
                ...commonHeaderOptions,
                title: 'Chi tiết phòng'
              }}
            />

            <Stack.Screen 
              name="ConfigDevice" 
              component={ConfigDeviceScreen} 
              options={{
                ...commonHeaderOptions,
                title: 'Cấu hình thiết bị'
              }}
            />
            
            <Stack.Screen 
              name="Terms" 
              component={TermsScreen} 
              options={{
                ...commonHeaderOptions,
                title: 'Điều khoản sử dụng' 
              }}
            />

            <Stack.Screen 
              name="PrivacyPolicy" 
              component={PrivacyPolicyScreen} 
              options={{
                ...commonHeaderOptions,
                title: 'Chính sách bảo mật' 
              }}
            />

            <Stack.Screen 
              name="ChangePassword" 
              component={ChangePasswordScreen} 
              options={{
                ...commonHeaderOptions,
                title: 'Đổi mật khẩu' 
              }}
            />

            <Stack.Screen 
              name="EditProfile" 
              component={EditProfileScreen} 
              options={{
                ...commonHeaderOptions,
                title: 'Cập nhật hồ sơ' 
              }}
            />
            
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;