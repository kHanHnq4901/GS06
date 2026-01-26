import { SettingsState } from '../types';

export const translations = {
    en: {
        // Auth
        welcomeBack: 'Welcome Back',
        signInToContinue: 'Sign in to your account',
        signIn: 'Sign In',
        signUp: 'Create Account',
        email: 'Email Address',
        password: 'Password',
        confirmPassword: 'Confirm Password',
        fullName: 'Full Name',
        dontHaveAccount: "Don't have an account?",
        alreadyHaveAccount: 'Already have an account?',
        signingIn: 'Signing In...',
        creatingAccount: 'Creating Account...',

        // Settings
        settings: 'Settings',
        configureSafetySystem: 'Configure your safety system',
        safetySettings: 'Safety Settings',
        emergencyNotifications: 'Emergency Notifications',
        receiveAlerts: 'Receive alerts for fire detection',
        autoSystemUpdates: 'Auto System Updates',
        autoUpdateFirmware: 'Automatically update firmware',
        darkMode: 'Dark Mode',
        useDarkTheme: 'Use dark theme for low light',
        systemConfiguration: 'System Configuration',
        language: 'Language',
        selectLanguage: 'Select your preferred language',
        gatewaySettings: 'Gateway Settings',
        configureGateway: 'Configure network gateway',
        deviceManagement: 'Device Management',
        manageSensors: 'Manage connected sensors',
        account: 'Account',
        profileInfo: 'Profile Information',
        updateDetails: 'Update your account details',
        securitySettings: 'Security Settings',
        changePassword: 'Change password and security options',
        backToLogin: 'Back to Login',

        // Common
        cancel: 'Cancel',
        logout: 'Logout',
        logoutConfirm: 'Are you sure you want to logout?',
        languageChanged: 'Language Changed',
        languageChangedTo: 'Language changed to',
        english: 'English',
        vietnamese: 'Tiếng Việt',
        on: 'On',
        off: 'Off',
    },
    vi: {
        // Auth
        welcomeBack: 'Chào mừng trở lại',
        signInToContinue: 'Đăng nhập vào tài khoản của bạn',
        signIn: 'Đăng nhập',
        signUp: 'Tạo tài khoản',
        email: 'Địa chỉ email',
        password: 'Mật khẩu',
        confirmPassword: 'Xác nhận mật khẩu',
        fullName: 'Họ và tên',
        dontHaveAccount: 'Chưa có tài khoản?',
        alreadyHaveAccount: 'Đã có tài khoản?',
        signingIn: 'Đang đăng nhập...',
        creatingAccount: 'Đang tạo tài khoản...',

        // Settings
        settings: 'Cài đặt',
        configureSafetySystem: 'Cấu hình hệ thống an toàn',
        safetySettings: 'Cài đặt an toàn',
        emergencyNotifications: 'Thông báo khẩn cấp',
        receiveAlerts: 'Nhận cảnh báo phát hiện cháy',
        autoSystemUpdates: 'Tự động cập nhật hệ thống',
        autoUpdateFirmware: 'Tự động cập nhật firmware',
        darkMode: 'Chế độ tối',
        useDarkTheme: 'Sử dụng giao diện tối cho ánh sáng yếu',
        systemConfiguration: 'Cấu hình hệ thống',
        language: 'Ngôn ngữ',
        selectLanguage: 'Chọn ngôn ngữ ưa thích',
        gatewaySettings: 'Cài đặt Gateway',
        configureGateway: 'Cấu hình gateway mạng',
        deviceManagement: 'Quản lý thiết bị',
        manageSensors: 'Quản lý các cảm biến đã kết nối',
        account: 'Tài khoản',
        profileInfo: 'Thông tin cá nhân',
        updateDetails: 'Cập nhật thông tin tài khoản',
        securitySettings: 'Cài đặt bảo mật',
        changePassword: 'Thay đổi mật khẩu và tùy chọn bảo mật',
        backToLogin: 'Quay lại đăng nhập',

        // Common
        cancel: 'Hủy',
        logout: 'Đăng xuất',
        logoutConfirm: 'Bạn có chắc chắn muốn đăng xuất?',
        languageChanged: 'Ngôn ngữ đã thay đổi',
        languageChangedTo: 'Ngôn ngữ đã thay đổi thành',
        english: 'English',
        vietnamese: 'Tiếng Việt',
        on: 'Bật',
        off: 'Tắt',

        // App Content
        smartHome: 'Nhà Thông Minh',
        welcomeToSmartHome: 'Chào mừng đến với Nhà Thông Minh của bạn',
        goodMorning: 'Chào buổi sáng',
        goodAfternoon: 'Chào buổi chiều',
        goodEvening: 'Chào buổi tối',
        livingRoom: 'Phòng khách',
        bedroom: 'Phòng ngủ',
        kitchen: 'Bếp',
        bathroom: 'Phòng tắm',
        office: 'Văn phòng',
        smartLight: 'Đèn thông minh',
        airConditioner: 'Điều hòa',
        smartTV: 'TV thông minh',
        bedsideLamp: 'Đèn ngủ',
        ceilingFan: 'Quạt trần',
        kitchenLight: 'Đèn bếp',
        refrigerator: 'Tủ lạnh',
        microwave: 'Lò vi sóng',
        bathroomLight: 'Đèn phòng tắm',
        deskLamp: 'Đèn bàn',
        securityCamera: 'Camera an ninh',
    },
};

export const getTranslation = (key: string, language: 'en' | 'vi' = 'en'): string => {
    return translations[language]?.[key as keyof typeof translations.en] || translations.en[key as keyof typeof translations.en] || key;
};

export const getCurrentLanguageTranslations = (settings: SettingsState) => {
    return {
        t: (key: string) => getTranslation(key, settings.language),
        language: settings.language,
    };
};
