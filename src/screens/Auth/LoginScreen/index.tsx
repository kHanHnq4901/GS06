import React from 'react';
import {
    View,
    Image,
    KeyboardAvoidingView,
    Platform,
    TouchableOpacity,
} from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { useLoginController } from './controller';
import { useLoginHandlers } from './handleButton';
import { styles } from './styles';
import Animated, {
  FadeInDown,
  FadeInUp,
  FadeIn,
} from 'react-native-reanimated';
import { MaterialIcons } from '@react-native-vector-icons/material-icons';

export const LoginScreen = () => {
    const {
        phone,
        password,
        loading,
        showPassword,
        t,
        setPhone,
        setPassword,
        setShowPassword,
        setLoading,
    } = useLoginController();

    const { handleLogin, navigateToRegister } = useLoginHandlers(
        phone,
        password,
        setLoading,
        { language: t.language }
    );

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <Animated.View
                entering={FadeInDown.duration(600)}
                style={styles.topContainer}
                >
                <Image
                    source={require('../../../asset/images/image/login.png')}
                    style={styles.logo}
                    resizeMode="stretch"
                />
                </Animated.View>

           <Animated.View
            entering={FadeInUp.delay(400).duration(1100)}
            style={styles.formContainer}
            >
                <Text style={styles.title}>Đăng nhập</Text>

                <TextInput
                    placeholder="Số điện thoại"
                    value={phone}
                    onChangeText={setPhone}
                    mode="outlined"
                    keyboardType="phone-pad"
                    style={styles.input}
                    outlineStyle={styles.inputOutline}
                />

                <TextInput
                    placeholder="Mật khẩu"
                    value={password}
                    onChangeText={setPassword}
                    mode="outlined"
                    secureTextEntry={!showPassword}
                    style={styles.input}
                    outlineStyle={styles.inputOutline}
                    right={
                        <TextInput.Icon
                        icon={showPassword ? 'eye-off' : 'eye'}
                        onPress={() => setShowPassword(prev => !prev)}
                        />
                    }
                />

                <TouchableOpacity style={styles.forgotContainer}>
                    <Text style={styles.forgotText}>Quên mật khẩu?</Text>
                </TouchableOpacity>

                {/* 🔹 LOGIN */}
                <Animated.View entering={FadeIn.delay(400)}>
                    <Button 
                        mode="contained"
                        onPress={handleLogin}
                        loading={loading}
                        disabled={loading}
                        style={styles.loginButton}
                        labelStyle={styles.loginLabel}
                    >
                        Đăng nhập
                    </Button>
                </Animated.View>

                {/* 🔹 DIVIDER */}
                <View style={styles.dividerContainer}>
                    <View style={styles.divider} />
                    <Text style={styles.dividerText}>HOẶC</Text>
                    <View style={styles.divider} />
                </View>

                {/* 🔹 REGISTER */}
                <Animated.View entering={FadeIn.delay(400)}>
                    <Button
                        mode="outlined"
                        onPress={navigateToRegister}
                        style={styles.registerButton}
                        labelStyle={styles.registerLabel}
                    >
                        Đăng ký tài khoản
                    </Button>
                </Animated.View>
            </Animated.View>
        </KeyboardAvoidingView>
    );
};

export default LoginScreen;
