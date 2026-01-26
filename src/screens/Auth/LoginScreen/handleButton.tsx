import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage'; // <--- Import này

import { useAppDispatch } from '../../../store/hooks';
import { login } from '../../../store/smartHomeSlice';
import { getCurrentLanguageTranslations } from '../../../utils/localization';
import { API_BASE_URL } from '../../../services/api';
import messaging from '@react-native-firebase/messaging';
export const useLoginHandlers = (
  phone: string,
  password: string,
  setLoading: (loading: boolean) => void,
  settings: any
) => {
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();
  const { t } = getCurrentLanguageTranslations(settings);

  const handleLogin = async () => {
    // 1. Validate đầu vào
    if (!phone.trim() || !password) {
      Alert.alert(t('common.error'), t('auth.fill_all_fields'));
      return;
    }

    try {
      setLoading(true);

      // 2. Gọi API Login
      const response = await axios.post(
        `${API_BASE_URL}/Login`,
        { Username: phone.trim(), Password: password },
        { timeout: 10000 }
      );

      const data = response.data;

      if (data.CODE === 1) {
        const userData = data.DATA;
        const token = userData.TOKEN; 

        // --- BẮT ĐẦU ĐOẠN MỚI: CẬP NHẬT FCM KEY ---
        try {
            // A. Lấy token từ thiết bị
            const fcmToken = await messaging().getToken();
            
            if (fcmToken) {
                console.log('Lấy FCM Token thành công:', fcmToken);
                
                // B. Gọi API UpdateFcmkey của bạn
                // Lưu ý: Tên tham số trong body phải khớp với tên tham số trong hàm C# (userId, fcmKey)
                await axios.post(`${API_BASE_URL}/UpdateFcmkey`, {
                    userId: userData.USER_ID, // Lấy ID từ kết quả Login
                    fcmKey: fcmToken          // Token vừa lấy được
                });
                
                console.log('Đã cập nhật FCM Key lên server');
            }
        } catch (fcmError) {
            // Quan trọng: Nếu lỗi cập nhật FCM, KHÔNG chặn đăng nhập
            // Chỉ log ra để debug
            console.error('Lỗi cập nhật FCM Key:', fcmError);
        }
        // --- KẾT THÚC ĐOẠN MỚI ---

        // 3. Lưu vào bộ nhớ máy (AsyncStorage)
        const sessionData = JSON.stringify({ user: userData, token: token });
        await AsyncStorage.setItem('USER_SESSION', sessionData);

        // 4. Lưu vào Redux để App chuyển màn hình
        dispatch(login({
          user: userData,
          token: token
        }));
        
      } else {
        // Xử lý khi Login thất bại (sai pass, tk khóa...)
        Alert.alert(
          t('common.error'),
          settings.language === 'vi' ? data.MESSAGE_VI : data.MESSAGE_EN
        );
      }

    } catch (error) {
      console.error(error);
      Alert.alert(t('common.error'), t('common.system_error'));
    } finally {
      setLoading(false);
    }
  };

  const navigateToRegister = () => navigation.navigate('Register');
  const navigateToSettings = () => navigation.navigate('Settings');

  return { handleLogin, navigateToRegister, navigateToSettings };
};
