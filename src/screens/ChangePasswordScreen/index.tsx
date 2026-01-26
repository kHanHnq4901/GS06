import React from 'react';
import { View, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';

import { useChangePasswordController } from './controller';
import { styles } from './styles';

export function ChangePasswordScreen({ navigation }: any) {
  const {
    oldPass, setOldPass,
    newPass, setNewPass,
    confirmPass, setConfirmPass,
    loading, onPressSave
  } = useChangePasswordController(navigation);

  return (
    // Bọc để bấm ra ngoài tự ẩn bàn phím
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        
        <Text style={styles.title}>Đổi mật khẩu</Text>
        <Text style={styles.subTitle}>
          Vui lòng nhập mật khẩu hiện tại và mật khẩu mới để bảo vệ tài khoản.
        </Text>
        
        <View style={styles.inputContainer}>
          <TextInput
            label="Mật khẩu hiện tại"
            value={oldPass}
            onChangeText={setOldPass}
            secureTextEntry
            mode="outlined"
            style={styles.input}
            outlineColor="#E5E7EB"       // Viền xám nhạt khi chưa focus
            activeOutlineColor="#2563EB" // Viền xanh khi focus
            textColor="#1F2937"
          />
        </View>
        
        <View style={styles.inputContainer}>
          <TextInput
            label="Mật khẩu mới"
            value={newPass}
            onChangeText={setNewPass}
            secureTextEntry
            mode="outlined"
            style={styles.input}
            outlineColor="#E5E7EB"
            activeOutlineColor="#2563EB"
            textColor="#1F2937"
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            label="Xác nhận mật khẩu mới"
            value={confirmPass}
            onChangeText={setConfirmPass}
            secureTextEntry
            mode="outlined"
            style={styles.input}
            outlineColor="#E5E7EB"
            activeOutlineColor="#2563EB"
            textColor="#1F2937"
          />
        </View>

        <Button 
          mode="contained" 
          onPress={onPressSave} 
          loading={loading}
          disabled={loading}
          style={styles.button}
          labelStyle={styles.buttonLabel} // Chỉnh font chữ trong nút
          contentStyle={{ height: 48 }}   // Tăng chiều cao nút cho dễ bấm
        >
          Lưu thay đổi
        </Button>
      </View>
    </TouchableWithoutFeedback>
  );
}