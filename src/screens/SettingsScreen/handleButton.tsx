import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logout } from '../../store/smartHomeSlice';


// Hàm này cần nhận tham số 'dispatch' được truyền từ Component
export const handleLogout = (dispatch: any) => {
  Alert.alert(
    "Đăng xuất",
    "Bạn có chắc chắn muốn đăng xuất không?",
    [
      { text: "Hủy", style: "cancel" },
      { 
        text: "Đồng ý", 
        style: "destructive",
        onPress: async () => {
          try {
            // 1. Xóa dữ liệu phiên đăng nhập trong máy
            await AsyncStorage.removeItem('USER_SESSION');
            
            // 2. Bắn tín hiệu Logout vào Redux
            // (Khi Redux state đổi, AppNavigator sẽ tự đá về Login)
            dispatch(logout());
            
          } catch (error) {
            console.error("Lỗi đăng xuất:", error);
            Alert.alert("Lỗi", "Không thể đăng xuất lúc này.");
          }
        } 
      }
    ]
  );
};