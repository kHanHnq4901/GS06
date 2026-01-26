import React, { useState, useRef } from 'react';
import { Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppSelector, useAppDispatch } from '../../../store/hooks';
import { updateSettings } from '../../../store/smartHomeSlice';
import { getCurrentLanguageTranslations } from '../../../utils/localization';

export const useSettingsController = () => {
    const navigation = useNavigation();
    const dispatch = useAppDispatch();
    const settings = useAppSelector(state => state.smartHome.settings);
    const { t } = getCurrentLanguageTranslations(settings);

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;

    React.useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 600,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true,
            }),
        ]).start();
    }, [fadeAnim, slideAnim]);

    const handleSettingChange = (key: string, value: any) => {
        dispatch(updateSettings({ [key]: value }));
    };

    const handleLanguageChange = () => {
        const newLanguage = settings.language === 'en' ? 'vi' : 'en';
        handleSettingChange('language', newLanguage);
        // Alert is handled in handleButton
    };

    const navigateToLogin = () => {
        navigation.navigate('Login' as never);
    };

    return {
        settings,
        fadeAnim,
        slideAnim,
        t,
        handleSettingChange,
        handleLanguageChange,
        navigateToLogin,
    };
};
