import React, { useEffect, useState } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, StackNavigationOptions } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
  Easing,
  interpolate,
  Extrapolate
} from 'react-native-reanimated';

import { useAppDispatch, useAppSelector } from './src/store/hooks';
import { API_BASE_URL } from './src/services/api';
import { login, logout } from './src/store/smartHomeSlice';
import { AppProvider } from './src/context/AppContext';

// Screens
import { ConfigDeviceScreen } from './src/screens/ConfigDevice';
import { LoginScreen, RegisterScreen } from './src/screens/Auth';
import MainTabNavigator from './src/navigation/MainTabNavigator';
import RoomDetailScreen from './src/screens/RoomDetail';
import { TermsScreen } from './src/screens/TermsScreen';
import { PrivacyPolicyScreen } from './src/screens/PrivacyPolicyScreen';
import { HistoryGatewayScreen } from './src/screens/HistoryGatewayScreen';
import { HistorySensorScreen } from './src/screens/HistorySensorScreen';
import { ChangePasswordScreen } from './src/screens/ChangePasswordScreen';
import { EditProfileScreen } from './src/screens/UploadImageScreen';
import { requestInitialPermissions } from './src/services/permission';
import { store, StoreProvider } from './src/store';
import { Provider } from 'react-redux';

// 1. IMPORT HOOK DỊCH THUẬT
import { useAppTranslation } from './src/hooks/useAppTranslation';
import { AddDeviceScreen } from './src/screens/AddDeviceScreen';
import { QrCodeScreen } from './src/screens/QrCodeScreen';
import { CreateQrGatewayScreen } from './src/screens/CreateQrGateway';

const Stack = createStackNavigator();

// Header Options chung (chỉ giữ style, title sẽ override sau)
const commonHeaderOptions: StackNavigationOptions = {
  headerShown: true,
  headerBackTitleVisible: false, 
  headerBackTitle: '',           
  headerTitleAlign: 'center',    
  headerStyle: {
    backgroundColor: '#fff',
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb'
  },
  headerTintColor: '#111827',
  headerTitleStyle: {
    fontWeight: 'bold', 
    fontSize: 18,
  },
  animationEnabled: true,
};

const AnimatedSplashOverlay = ({ animationProgress }) => {
  // ... (Code Splash giữ nguyên không đổi)
  const animatedContainerStyle = useAnimatedStyle(() => {
    const opacity = interpolate(animationProgress.value, [0, 0.8, 1], [1, 1, 0], Extrapolate.CLAMP);
    return { opacity: opacity, pointerEvents: animationProgress.value > 0.9 ? 'none' : 'auto' };
  });
   const animatedImageStyle = useAnimatedStyle(() => {
      const scale = interpolate(animationProgress.value, [0, 1], [1, 1.3], Extrapolate.CLAMP);
      return { transform: [{ scale: scale }] }
   })
  return (
    <Animated.View style={[styles.splashOverlay, animatedContainerStyle]}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <Animated.Image source={require('./src/asset/images/image/login6.png')} style={[styles.splashImage, animatedImageStyle]} resizeMode="cover" />
    </Animated.View>
  );
};

// --- AppNavigator ---
const AppNavigator = () => {
  // 2. SỬ DỤNG HOOK ĐỂ LẤY HÀM DỊCH
  // Khi ngôn ngữ thay đổi, hook này sẽ làm AppNavigator render lại -> Title cập nhật
  const { t } = useAppTranslation();

  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector(state => state.smartHome.auth);
  const [isSplashVisible, setIsSplashVisible] = useState(true);
  const splashProgress = useSharedValue(0);

  const handleAnimationFinish = (isFinished) => {
    if (isFinished) setIsSplashVisible(false);
  };

  useEffect(() => {
    requestInitialPermissions();
    const prepareApp = async () => {
       // ... (Giữ nguyên logic check session)
       try {
        const minimumWait = new Promise(resolve => setTimeout(resolve, 2000));
        const sessionCheck = (async () => {
           try {
             const session = await AsyncStorage.getItem('USER_SESSION');
             if (session) {
               const { user, token } = JSON.parse(session);
               const response = await axios.post(`${API_BASE_URL}/VerifyToken`, null, { params: { token: token } });
               if (response.data.CODE === 1) {
                  dispatch(login({ user: response.data.DATA, token: token }));
               } else {
                  await AsyncStorage.removeItem('USER_SESSION');
                  dispatch(logout());
               }
             } else {
               dispatch(logout());
             }
           } catch (err) {
             console.log("Session check error:", err);
             dispatch(logout());
           }
        })();
        await Promise.all([minimumWait, sessionCheck]);
        splashProgress.value = withTiming(1, { duration: 800, easing: Easing.bezier(0.25, 0.1, 0.25, 1) }, (isFinished) => {
          runOnJS(handleAnimationFinish)(isFinished);
        });
      } catch (e) { console.warn(e); }
    };
    prepareApp();
  }, [dispatch]);

  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false, animationEnabled: false }}>
          {!isAuthenticated ? (
            <>
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Register" component={RegisterScreen} />
            </>
          ) : (
            <>
              {/* MainTabs */}
              <Stack.Screen name="MainTabs" component={MainTabNavigator} screenOptions={{ animationEnabled: true }} />
              
              <Stack.Screen name="HistoryGateway" component={HistoryGatewayScreen} />
              <Stack.Screen name="HistorySensor" component={HistorySensorScreen} />

              {/* 3. DÙNG t() CHO TITLE */}
              <Stack.Screen 
                name="RoomDetail" 
                component={RoomDetailScreen} 
                options={{ ...commonHeaderOptions, title: t('room_detail_title') }} 
              />
              <Stack.Screen 
                name="ConfigDevice" 
                component={ConfigDeviceScreen} 
                options={{ ...commonHeaderOptions, title: t('config_device_title') }} 
              />
              <Stack.Screen 
                name="Terms" 
                component={TermsScreen} 
                options={{ ...commonHeaderOptions, title: t('terms') }} 
              />
              <Stack.Screen 
                name="PrivacyPolicy" 
                component={PrivacyPolicyScreen} 
                options={{ ...commonHeaderOptions, title: t('privacy_policy') }} 
              />
              <Stack.Screen 
                name="ChangePassword" 
                component={ChangePasswordScreen} 
                options={{ ...commonHeaderOptions, title: t('change_pass') }} 
              />
              <Stack.Screen 
                name="EditProfile" 
                component={EditProfileScreen} 
                options={{ ...commonHeaderOptions, title: t('edit_profile_title') }} 
              />
              <Stack.Screen 
                name="AddDevice" 
                component={AddDeviceScreen} 
                options={{ ...commonHeaderOptions, title: t('edit_profile_title') }} 
              />
               <Stack.Screen 
                name="QrCode" 
                component={QrCodeScreen} 
                options={{ ...commonHeaderOptions, title: t('edit_profile_title') }} 
              />
                <Stack.Screen 
                name="CreateQrGateway" 
                component={CreateQrGatewayScreen} 
                options={{ ...commonHeaderOptions, title: t('edit_profile_title') }} 
              />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
      {isSplashVisible && <AnimatedSplashOverlay animationProgress={splashProgress} />}
    </View>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <StoreProvider>
        <AppProvider>
          <AppNavigator />
        </AppProvider>
      </StoreProvider>
    </Provider>
  );
};

const styles = StyleSheet.create({
  splashOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: '#050A18', zIndex: 9999, alignItems: 'center', justifyContent: 'center' },
  splashImage: { width: '100%', height: '100%' },
});

export default App;