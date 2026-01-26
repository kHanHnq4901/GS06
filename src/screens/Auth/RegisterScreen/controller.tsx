import React, { useState, useRef } from 'react';
import { Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppSelector } from '../../../store/hooks';
import { getCurrentLanguageTranslations } from '../../../utils/localization';

export const useRegisterController = () => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const navigation = useNavigation();
    const settings = useAppSelector(state => state.smartHome.settings);
    const { t } = getCurrentLanguageTranslations(settings);

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;

    React.useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 600,
                useNativeDriver: true,
            }),
        ]).start();
    }, [fadeAnim, slideAnim]);

    return {
        // State
        name,
        phone,
        password,
        confirmPassword,
        loading,
        showPassword,
        showConfirmPassword,
        fadeAnim,
        slideAnim,
        t,

        // Setters
        setName,
        setPhone,
        setPassword,
        setConfirmPassword,
        setShowPassword,
        setShowConfirmPassword,
        setLoading,
    };
};
