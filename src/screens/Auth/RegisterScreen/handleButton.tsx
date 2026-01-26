import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { getCurrentLanguageTranslations } from '../../../utils/localization';
import { API_BASE_URL } from '../../../services/api';

interface RegisterSettings {
  language: 'vi' | 'en';
}

export const useRegisterHandlers = (
  name: string,
  phone: string,
  password: string,
  confirmPassword: string,
  setLoading: (loading: boolean) => void,
  settings: RegisterSettings
) => {
  const navigation = useNavigation<any>();
  const { t } = getCurrentLanguageTranslations(settings);

  const handleRegister = async () => {
    // 🔹 Validate
    if (!name.trim() || !phone.trim() || !password || !confirmPassword) {
      Alert.alert(
        t('common.error'),
        t('auth.fill_all_fields')
      );
      return;
    }

    if (password.length < 6) {
      Alert.alert(
        t('common.error'),
        t('auth.password_min_6')
      );
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert(
        t('common.error'),
        t('auth.password_not_match')
      );
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `${API_BASE_URL}/CreateAccount`,
        {
          Account: phone.trim(),
          Username: name.trim(),
          Password: password,
        },
        {
          timeout: 10000,
        }
      );

      const data = response.data;

      if (data.CODE === 1) {
        Alert.alert(
          t('common.success'),
          settings.language === 'vi'
            ? data.MESSAGE_VI
            : data.MESSAGE_EN,
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack(),
            },
          ]
        );
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
      console.log(error)
    } finally {
      setLoading(false);
    }
  };

  const navigateToLogin = () => {
    navigation.goBack();
  };

  return {
    handleRegister,
    navigateToLogin,
  };
};
