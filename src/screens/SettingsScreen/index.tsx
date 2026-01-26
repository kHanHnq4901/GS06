import React from 'react'; 
import { View, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Text, Avatar } from 'react-native-paper';
import Animated, { FadeInUp } from 'react-native-reanimated';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'; 
import DeviceInfo from 'react-native-device-info';

// IMPORT TỪ STORE
import { useGlobalState, PropsState } from '../../store'; // Thêm PropsState để fix lỗi typing
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
  const currentLanguage = state.appSetting.language; // Biến này thay đổi khi setState chạy

  const buildNumber = DeviceInfo.getBuildNumber();
  const appVersion = DeviceInfo.getVersion();
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  
  const user = useAppSelector(state => state.smartHome.auth.user);

  // --- LOGIC ĐỔI NGÔN NGỮ ---
  const handleChangeLanguage = () => {
    Alert.alert(
      t('select_lang_title'),
      t('select_lang_msg'),
      [
        {
          text: "Tiếng Việt 🇻🇳",
          onPress: () => updateLanguage('vi'),
          // SỬA: Luôn để default, thêm emoji hoặc dấu tick vào text nếu muốn đánh dấu
          style: 'default', 
          // Nếu muốn đẹp hơn trên iOS thì thêm logic text:
          // text: currentLanguage === 'vi' ? "Tiếng Việt 🇻🇳 (Đang chọn)" : "Tiếng Việt 🇻🇳"
        },
        {
          text: "English 🇺🇸",
          onPress: () => updateLanguage('en'),
          // SỬA: Luôn để default
          style: 'default'
        },
        { 
          text: t('cancel'), 
          onPress: () => console.log('Cancel Pressed'),
          // SỬA: Nút Hủy phải là style 'cancel' để nó nằm dưới cùng trên iOS
          style: 'cancel' 
        }
      ],
      { cancelable: true }
    );
  };

  const updateLanguage = (lang: 'vi' | 'en') => {
    // Sửa đoạn này: Bỏ 'any', dùng PropsState để code sạch và an toàn
    setState((prev: PropsState) => ({
        ...prev,
        appSetting: {
            ...prev.appSetting,
            language: lang
        }
    }));

    saveAppSetting({
        ...state.appSetting,
        language: lang
    });
  };

  const avatarUrl = user?.IMAGE ? { uri: `${API_IMAGE}${user.IMAGE}` } : null;

  return (
    // THỦ THUẬT QUAN TRỌNG: Thêm key={currentLanguage}
    // Khi key đổi, React sẽ render lại View này ngay lập tức -> Text cập nhật liền
    <View style={styles.container} key={currentLanguage}>
        
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

    </View>
  );
}