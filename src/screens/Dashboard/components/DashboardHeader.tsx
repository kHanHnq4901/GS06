import React from 'react';
import {
    Text,
    StyleSheet,
    Animated,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { logout } from '../../../store/smartHomeSlice';
import { getGreeting } from '../../../utils/helpers';
import { getCurrentLanguageTranslations } from '../../../utils/localization';

interface DashboardHeaderProps {
    headerHeight: Animated.AnimatedInterpolation<string | number>;
    greetingOpacity: Animated.AnimatedInterpolation<string | number>;
    greetingScale: Animated.AnimatedInterpolation<string | number>;
    titleOpacity: Animated.AnimatedInterpolation<string | number>;
    titleTranslateY: Animated.AnimatedInterpolation<string | number>;
}

const DashboardHeader = ({
    headerHeight,
    greetingOpacity,
    greetingScale,
    titleOpacity,
    titleTranslateY,
}: DashboardHeaderProps) => {
    const navigation = useNavigation();
    const dispatch = useAppDispatch();
    const settings = useAppSelector(state => state.smartHome.settings);
    const { t } = getCurrentLanguageTranslations(settings);

    const handleLogout = () => {
        Alert.alert(
            t('logout'),
            t('logoutConfirm'),
            [
                { text: t('cancel'), style: 'cancel' },
                {
                    text: t('logout'),
                    style: 'destructive',
                    onPress: () => {
                        dispatch(logout());
                        navigation.navigate('Login' as never);
                    },
                },
            ]
        );
    };

    return (
        <Animated.View style={[
            styles.header,
            {
                height: headerHeight,
                opacity: 1,
            }
        ]}>
            {/* Collapsed Title */}
            <Animated.View style={[
                styles.collapsedTitle,
                {
                    opacity: titleOpacity,
                    transform: [{ translateY: titleTranslateY }],
                }
            ]}>
                <Text style={styles.collapsedTitleText}>🏠 {settings.language === 'vi' ? 'Nhà Thông Minh' : 'Smart Home'}</Text>
                <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={handleLogout}
                >
                    <Text style={styles.logoutText}>🚪</Text>
                </TouchableOpacity>
            </Animated.View>

            {/* Expanded Greeting */}
            <Animated.View style={[
                styles.greetingContainer,
                {
                    opacity: greetingOpacity,
                    transform: [{ scale: greetingScale }],
                }
            ]}>
                <TouchableOpacity
                    style={styles.logoutButtonExpanded}
                    onPress={handleLogout}
                >
                    <Text style={styles.logoutTextExpanded}>🚪 {t('logout')}</Text>
                </TouchableOpacity>
                <Text style={styles.greeting}>{getGreeting(settings.language)}</Text>
                <Text style={styles.subtitle}>{settings.language === 'vi' ? 'Chào mừng đến với Nhà Thông Minh của bạn' : 'Welcome to your Smart Home'}</Text>
                <Text style={styles.dateText}>
                    {new Date().toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}
                </Text>
            </Animated.View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    header: {
        backgroundColor: '#1a1a2e',
        paddingTop: 20,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 8,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
    },
    collapsedTitle: {
        position: 'absolute',
        top: 20,
        left: 20,
        right: 20,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    collapsedTitleText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#ffffff',
        textAlign: 'center',
    },
    greetingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    greeting: {
        fontSize: 32,
        fontWeight: '800',
        color: '#ffffff',
        marginBottom: 8,
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: 18,
        color: '#e8e8e8',
        fontWeight: '500',
        marginBottom: 8,
    },
    dateText: {
        fontSize: 14,
        color: '#b0b0b0',
        fontWeight: '400',
    },
    logoutButton: {
        padding: 4,
    },
    logoutText: {
        fontSize: 18,
        color: '#ffffff',
    },
    logoutButtonExpanded: {
        alignSelf: 'flex-end',
        padding: 8,
        marginBottom: 10,
    },
    logoutTextExpanded: {
        fontSize: 16,
        color: '#ffffff',
        fontWeight: '500',
    },
});

export default DashboardHeader;
