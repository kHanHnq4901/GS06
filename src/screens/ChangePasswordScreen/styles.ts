import { StyleSheet, Platform } from 'react-native';

export const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    paddingHorizontal: 24, // Tăng padding 2 bên cho thoáng
    paddingTop: 20,
    backgroundColor: '#F9FAFB', // Nền màu xám rất nhạt (off-white) nhìn sang hơn trắng tinh
  },

  // Header giống màn hình Settings
  title: { 
    fontSize: 22, 
    fontWeight: '700', 
    color: '#111827', // Màu chữ đen xám đậm
    textAlign: 'center', 
    marginTop: 10,
    marginBottom: 8, 
  },

  subTitle: {
    fontSize: 14,
    color: '#6B7280', // Màu xám nhạt
    textAlign: 'center',
    marginBottom: 32, // Cách xa phần nhập liệu ra
  },

  // Style cho container của Input
  inputContainer: {
    marginBottom: 16,
  },

  // Style đè lên TextInput của Paper
  input: { 
    backgroundColor: '#FFF',
    fontSize: 15,
  },

  // Nút bấm "Lưu thay đổi" xịn hơn
  button: { 
    marginTop: 24, 
    paddingVertical: 6, 
    borderRadius: 12, // Bo góc mềm mại
    backgroundColor: '#2563EB', // Dùng màu xanh chủ đạo (Primary) thay vì màu cam (trừ khi bạn thích màu cam)
    
    // Đổ bóng cho nút (Elevation)
    elevation: 4, 
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },

  buttonLabel: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});