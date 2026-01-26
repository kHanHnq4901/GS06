import React from 'react';
import {
    View,
    Dimensions,
    Animated,
    ScrollView,
    Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Text, Card, Switch, List, IconButton } from 'react-native-paper';
import { useSettingsController } from './controller';
import { useSettingsHandlers } from './handleButton';
import { styles } from './styles';

const { width, height } = Dimensions.get('window');

const SettingsScreen = () => {
    const {
        settings,
        fadeAnim,
        slideAnim,
        t,
        handleSettingChange,
        handleLanguageChange,
        navigateToLogin,
    } = useSettingsController();

    const {
        handleGatewaySettings,
        handleDeviceManagement,
        handleProfileInfo,
        handleSecuritySettings,
        handleLanguagePress,
    } = useSettingsHandlers(handleLanguageChange, settings);

    return (
        <LinearGradient
            colors={['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4']}
            style={styles.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
        >
            <View style={styles.patternOverlay}>
                <View style={styles.pattern}>
                    {[...Array(25)].map((_, i) => (
                        <View key={i} style={[styles.dot, {
                            left: Math.random() * width,
                            top: Math.random() * height,
                            opacity: Math.random() * 0.15 + 0.05,
                            backgroundColor: Math.random() > 0.5 ? '#ffffff' : '#FF6B6B',
                        }]} />
                    ))}
                </View>
            </View>

            <ScrollView
                style={styles.container}
                showsVerticalScrollIndicator={false}
            >
                <Animated.View
                    style={[
                        styles.content,
                        {
                            opacity: fadeAnim,
                            transform: [{ translateY: slideAnim }],
                        },
                    ]}
                >
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>{t('settings')}</Text>
                        <Text style={styles.headerSubtitle}>{t('configureSafetySystem')}</Text>
                    </View>

                    <Card style={styles.card}>
                        <Card.Content style={styles.cardContent}>
                            <Text style={styles.sectionTitle}>{t('safetySettings')}</Text>

                            <List.Item
                                title={t('emergencyNotifications')}
                                description={t('receiveAlerts')}
                                left={props => <List.Icon {...props} icon="bell-alert" color="#FF6B6B" />}
                                right={() => (
                                    <Switch
                                        value={settings.notificationsEnabled}
                                        onValueChange={(value) => handleSettingChange('notificationsEnabled', value)}
                                        color="#FF6B6B"
                                    />
                                )}
                                style={styles.listItem}
                            />

                            <List.Item
                                title={t('autoSystemUpdates')}
                                description={t('autoUpdateFirmware')}
                                left={props => <List.Icon {...props} icon="update" color="#4ECDC4" />}
                                right={() => (
                                    <Switch
                                        value={settings.autoUpdateEnabled}
                                        onValueChange={(value) => handleSettingChange('autoUpdateEnabled', value)}
                                        color="#4ECDC4"
                                    />
                                )}
                                style={styles.listItem}
                            />

                            <List.Item
                                title={t('darkMode')}
                                description={t('useDarkTheme')}
                                left={props => <List.Icon {...props} icon="theme-light-dark" color="#45B7D1" />}
                                right={() => (
                                    <Switch
                                        value={settings.darkModeEnabled}
                                        onValueChange={(value) => handleSettingChange('darkModeEnabled', value)}
                                        color="#45B7D1"
                                    />
                                )}
                                style={styles.listItem}
                            />
                        </Card.Content>
                    </Card>

                    <Card style={styles.card}>
                        <Card.Content style={styles.cardContent}>
                            <Text style={styles.sectionTitle}>{t('systemConfiguration')}</Text>

                            <List.Item
                                title={t('language')}
                                description={t('selectLanguage')}
                                left={props => <List.Icon {...props} icon="translate" color="#96CEB4" />}
                                right={() => <Text style={styles.listValue}>
                                    {settings.language === 'en' ? t('english') : t('vietnamese')}
                                </Text>}
                                onPress={handleLanguagePress}
                                style={styles.listItem}
                            />

                            <List.Item
                                title={t('gatewaySettings')}
                                description={t('configureGateway')}
                                left={props => <List.Icon {...props} icon="router-network" color="#FFEAA7" />}
                                right={props => <List.Icon {...props} icon="chevron-right" />}
                                onPress={handleGatewaySettings}
                                style={styles.listItem}
                            />

                            <List.Item
                                title={t('deviceManagement')}
                                description={t('manageSensors')}
                                left={props => <List.Icon {...props} icon="devices" color="#DDA0DD" />}
                                right={props => <List.Icon {...props} icon="chevron-right" />}
                                onPress={handleDeviceManagement}
                                style={styles.listItem}
                            />
                        </Card.Content>
                    </Card>

                    <Card style={styles.card}>
                        <Card.Content style={styles.cardContent}>
                            <Text style={styles.sectionTitle}>{t('account')}</Text>

                            <List.Item
                                title={t('profileInfo')}
                                description={t('updateDetails')}
                                left={props => <List.Icon {...props} icon="account" color="#007AFF" />}
                                right={props => <List.Icon {...props} icon="chevron-right" />}
                                onPress={handleProfileInfo}
                                style={styles.listItem}
                            />

                            <List.Item
                                title={t('securitySettings')}
                                description={t('changePassword')}
                                left={props => <List.Icon {...props} icon="shield-check" color="#FF8C00" />}
                                right={props => <List.Icon {...props} icon="chevron-right" />}
                                onPress={handleSecuritySettings}
                                style={styles.listItem}
                            />
                        </Card.Content>
                    </Card>

                    <LinearGradient
                        colors={['#FF6B6B', '#FF8C00']}
                        style={styles.loginButton}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                    >
                        <IconButton
                            icon="arrow-left"
                            iconColor="#ffffff"
                            size={24}
                            onPress={navigateToLogin}
                            style={styles.button}
                        />
                    </LinearGradient>
                </Animated.View>
            </ScrollView>
        </LinearGradient>
    );
};

export default SettingsScreen;
