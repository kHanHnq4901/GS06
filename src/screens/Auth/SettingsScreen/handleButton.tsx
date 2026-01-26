import { Alert } from 'react-native';
import { getCurrentLanguageTranslations } from '../../../utils/localization';

export const useSettingsHandlers = (
    handleLanguageChange: () => void,
    settings: any
) => {
    const { t } = getCurrentLanguageTranslations(settings);

    const showComingSoonAlert = (feature: string) => {
        Alert.alert('Coming Soon', `${feature} ${t('comingSoon') || 'will be available in a future update'}`);
    };

    const handleGatewaySettings = () => {
        showComingSoonAlert('Gateway settings');
    };

    const handleDeviceManagement = () => {
        showComingSoonAlert('Device management');
    };

    const handleProfileInfo = () => {
        showComingSoonAlert('Profile settings');
    };

    const handleSecuritySettings = () => {
        showComingSoonAlert('Security settings');
    };

    const handleLanguagePress = () => {
        const newLanguage = settings.language === 'en' ? 'vi' : 'en';
        handleLanguageChange();
        Alert.alert(
            t('languageChanged'),
            `${t('languageChangedTo')} ${newLanguage === 'en' ? t('english') : t('vietnamese')}`,
            [{ text: 'OK' }]
        );
    };

    return {
        showComingSoonAlert,
        handleGatewaySettings,
        handleDeviceManagement,
        handleProfileInfo,
        handleSecuritySettings,
        handleLanguagePress,
    };
};
