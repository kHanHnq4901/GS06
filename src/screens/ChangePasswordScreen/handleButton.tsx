import { Alert } from 'react-native';
import axios from 'axios';
import { API_BASE_URL } from '../../services/api';

// Định nghĩa kiểu dữ liệu cho tham số truyền vào
interface UpdatePasswordProps {
  user: any;
  oldPass: string;
  newPass: string;
  confirmPass: string;
  navigation: any;
  setLoading: (loading: boolean) => void;
}

export const handleUpdatePassword = async ({
  user,
  oldPass,
  newPass,
  confirmPass,
  navigation,
  setLoading,
}: UpdatePasswordProps) => {
  // 1. Validate
  if (!oldPass || !newPass || !confirmPass) {
    Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin");
    return;
  }
  if (newPass !== confirmPass) {
    Alert.alert("Lỗi", "Mật khẩu mới không khớp");
    return;
  }

  // 2. Bắt đầu xử lý
  setLoading(true);

  try {
    const formData = new FormData();
    formData.append('userId', user.USER_ID);
    formData.append('oldPassword', oldPass);
    formData.append('newPassword', newPass);

    // 3. Gọi API
    const response = await axios.post(`${API_BASE_URL}/ChangePassword`, formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });

    const { CODE, MESSAGE_VI } = response.data;

    if (CODE === 1) {
      Alert.alert("Thành công", MESSAGE_VI, [
        { text: "OK", onPress: () => navigation.goBack() }
      ]);
    } else {
      Alert.alert("Thất bại", MESSAGE_VI);
    }

  } catch (error) {
    console.error(error);
    Alert.alert("Lỗi", "Không thể kết nối đến máy chủ");
  } finally {
    setLoading(false);
  }
};