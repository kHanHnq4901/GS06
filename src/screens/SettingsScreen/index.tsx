import React from 'react'; 
import { View, TouchableOpacity, Alert, ScrollView, StatusBar } from 'react-native'; // Thêm ScrollView
import { useNavigation } from '@react-navigation/native';
import { Text, Avatar } from 'react-native-paper';
import Animated, { FadeInUp } from 'react-native-reanimated';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'; 
import DeviceInfo from 'react-native-device-info';
import { SafeAreaView } from 'react-native-safe-area-context'; // Đảm bảo an toàn vùng hiển thị

// IMPORT TỪ STORE
import { useGlobalState, PropsState } from '../../store';
import { saveAppSetting } from '../../services/storage'; 
import { API_IMAGE } from '../../services/api';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { useAppTranslation } from '../../hooks/useAppTranslation';

import { handleLogout } from './handleButton'; 
import { SettingItem } from './components/SettingItem';
import { styles } from './styles';

export function SettingsScreen() {
  const { t } = useAppTranslation();
  const { state, setState } = useGlobalState(); 
  const currentLanguage = state.appSetting.language;

  const buildNumber = DeviceInfo.getBuildNumber();
  const appVersion = DeviceInfo.getVersion();
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  
  const user = useAppSelector(state => state.smartHome.auth.user);

  const updateLanguage = (lang: 'vi' | 'en') => {
    setState((prev: PropsState) => ({
        ...prev,
        appSetting: { ...prev.appSetting, language: lang }
    }));
    saveAppSetting({ ...state.appSetting, language: lang });
  };

  const handleChangeLanguage = () => {
    Alert.alert(
      t('select_lang_title'),
      t('select_lang_msg'),
      [
        { text: "Tiếng Việt 🇻🇳", onPress: () => updateLanguage('vi'), style: 'default' },
        { text: "English 🇺🇸", onPress: () => updateLanguage('en'), style: 'default' },
        { text: t('cancel'), style: 'cancel' }
      ],
      { cancelable: true }
    );
  };

  const avatarUrl = user?.IMAGE ? { uri: `${API_IMAGE}${user.IMAGE}` } : null;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" />
      
      {/* --- THÊM SCROLLVIEW TẠI ĐÂY --- */}
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent} // Bạn nhớ thêm style này vào styles.ts
        key={currentLanguage}
      >
        {/* Tiêu đề màn hình */}
        <Text style={styles.header}>{t('settings_title')}</Text>

        {/* --- PHẦN 1: PROFILE --- */}
        <Animated.View entering={FadeInUp} style={styles.profileCard}>
          <View style={{ position: 'relative' }}>
              {avatarUrl ? (
                  <Avatar.Image size={88} source={avatarUrl} style={{ backgroundColor: '#fff' }} />
              ) : (
                  <Avatar.Icon size={88} icon="account" style={styles.avatar} />
              )}
              <TouchableOpacity 
                  style={styles.editBtn} 
                  onPress={() => navigation.navigate('EditProfile' as never)} 
              >
                <MaterialIcons name="edit" size={18} color="#FFF" />
              </TouchableOpacity>
          </View>
          <Text style={styles.name}>{user?.USER_NAME || t('default_user')}</Text>
          <Text style={styles.phone}>{user?.USER_ACCOUNT || "..."}</Text>
        </Animated.View>

        {/* --- PHẦN 2: CÀI ĐẶT CHUNG --- */}
        <Text style={styles.section}>{t('general_settings')}</Text>
        <SettingItem 
          icon="language" 
          title={t('language')} 
          color="#3B82F6"
          rightText={currentLanguage === 'vi' ? "Tiếng Việt" : "English"} 
          onPress={handleChangeLanguage}
        />

        {/* --- PHẦN 3: BẢO MẬT --- */}
        <Text style={styles.section}>{t('security')}</Text>
        <SettingItem 
          icon="lock" 
          title={t('change_pass')} 
          color="#F59E0B" 
          onPress={() => navigation.navigate('ChangePassword' as never)} 
        />
        <SettingItem 
          icon="fingerprint" 
          title={t('biometrics')} 
          color="#10B981" 
          onPress={() => console.log(t('biometrics_msg'))}
        />

        {/* --- PHẦN 4: THÔNG TIN --- */}
        <Text style={styles.section}>{t('info')}</Text>
        <SettingItem 
          icon="description" 
          title={t('terms')} 
          onPress={() => navigation.navigate('Terms' as never)}
        />
        <SettingItem 
          icon="policy" 
          title={t('privacy_policy')} 
          onPress={() => navigation.navigate('PrivacyPolicy' as never)}
        />

        {/* --- PHẦN 5: ĐĂNG XUẤT --- */}
        <Animated.View 
          entering={FadeInUp.delay(200).springify()} 
          style={styles.logoutContainer}
        >
          <TouchableOpacity 
            style={styles.logoutBtn} 
            onPress={() => handleLogout(dispatch)}
          >
            <MaterialIcons name="logout" size={20} color="#EF4444" />
            <Text style={styles.logoutText}>{t('logout')}</Text>
          </TouchableOpacity>
          <Text style={styles.versionText}>{t('version')} {appVersion} ({buildNumber})</Text>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}