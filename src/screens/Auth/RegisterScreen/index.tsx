import React from 'react';
import {
  View,
  Image,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import Animated, {
  FadeInDown,
  FadeInUp,
  FadeIn,
} from 'react-native-reanimated';

import { useRegisterController } from './controller';
import { useRegisterHandlers } from './handleButton';
import { styles } from './styles';

const RegisterScreen = () => {
  const {
    name,
    phone,
    password,
    confirmPassword,
    loading,
    showPassword,
    showConfirmPassword,
    t,
    setName,
    setPhone,
    setPassword,
    setConfirmPassword,
    setShowPassword,
    setShowConfirmPassword,
    setLoading,
  } = useRegisterController();

  const { handleRegister, navigateToLogin } = useRegisterHandlers(
    name,
    phone,
    password,
    confirmPassword,
    setLoading,
    { language: t.language }
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* 🔹 TOP IMAGE */}
      <Animated.View
        entering={FadeInDown.duration(700)}
        style={styles.topContainer}
      >
        <Image
          source={require('../../../asset/images/image/login.png')}
          style={styles.logo}
          resizeMode="stretch"
        />
      </Animated.View>

      {/* 🔹 FORM */}
      <Animated.View
        entering={FadeInUp.delay(200).duration(900)}
        style={styles.formContainer}
      >
        <Text style={styles.title}>Đăng ký</Text>

        <Animated.View entering={FadeInUp.delay(300)}>
          <TextInput
            placeholder="Họ và tên"
            value={name}
            onChangeText={setName}
            mode="outlined"
            style={styles.input}
            outlineStyle={styles.inputOutline}
          />
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(400)}>
          <TextInput
            placeholder="Số điện thoại"
            value={phone}
            onChangeText={setPhone}
            mode="outlined"
            keyboardType="phone-pad"
            style={styles.input}
            outlineStyle={styles.inputOutline}
          />
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(500)}>
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
                onPress={() => setShowPassword(!showPassword)}
              />
            }
          />
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(600)}>
          <TextInput
            placeholder="Nhập lại mật khẩu"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            mode="outlined"
            secureTextEntry={!showConfirmPassword}
            style={styles.input}
            outlineStyle={styles.inputOutline}
            right={
              <TextInput.Icon
                icon={showConfirmPassword ? 'eye-off' : 'eye'}
                onPress={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
              />
            }
          />
        </Animated.View>

        {/* 🔹 REGISTER BUTTON */}
        <Animated.View entering={FadeInUp.delay(700)}>
          <Button
            mode="contained"
            onPress={handleRegister}
            loading={loading}
            disabled={loading}
            style={styles.loginButton}
            labelStyle={styles.loginLabel}
          >
            Đăng ký
          </Button>
        </Animated.View>

        {/* 🔹 BACK TO LOGIN */}
        <Animated.View entering={FadeIn.delay(900)}>
          <TouchableOpacity
            style={styles.registerFooter}
            onPress={navigateToLogin}
          >
            <Text style={styles.registerText}>
              Đã có tài khoản?{' '}
              <Text style={styles.registerLink}>Đăng nhập</Text>
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;
