import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { useAppDispatch } from '../../store/hooks';
import { login } from '../../store/smartHomeSlice';
import { getCurrentLanguageTranslations } from '../../utils/localization';
import { API_BASE_URL } from '../../services/api';


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
    if (!phone.trim() || !password) {
      Alert.alert(
        t('common.error'),
        t('auth.fill_all_fields')
      );
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `${API_BASE_URL}/Login`,
        {
          Username: phone.trim(),
          Password: password,
        },
        { timeout: 10000 }
      );

      const data = response.data;

      if (data.CODE === 1) {
        // ✅ Lưu user vào redux
        dispatch(login({
          user: data.DATA,
        }));

        Alert.alert(
          t('common.success'),
          settings.language === 'vi'
            ? data.MESSAGE_VI
            : data.MESSAGE_EN
        );

        navigation.reset({
          index: 0,
          routes: [{ name: 'Dashboard' }],
        });

      } else {
        Alert.alert(
          t('common.error'),
          settings.language === 'vi'
            ? data.MESSAGE_VI
            : data.MESSAGE_EN
        );
      }

    } catch (error) {
      Alert.alert(
        t('common.error'),
        t('common.system_error')
      );
    } finally {
      setLoading(false);
    }
  };

  const navigateToRegister = () => {
    navigation.navigate('Register');
  };

  const navigateToSettings = () => {
    navigation.navigate('Settings');
  };

  return {
    handleLogin,
    navigateToRegister,
    navigateToSettings,
  };
};
