import { Alert, Platform } from 'react-native';
import axios from 'axios';
import { API_BASE_URL } from '../../services/api';
import { updateUserProfile } from '../../store/smartHomeSlice';

interface UploadImageProps {
  user: any;
  selectedImage: any;
  dispatch: any;
  navigation: any;
  setLoading: (loading: boolean) => void;
}

export const handleUploadImage = async ({
  user,
  selectedImage,
  dispatch,
  navigation,
  setLoading
}: UploadImageProps) => {
  // 1. Validate
  if (!selectedImage) {
    Alert.alert("Thông báo", "Bạn chưa chọn ảnh mới");
    return;
  }

  setLoading(true);

  try {
    const formData = new FormData();
    
    // Tham số userId theo API
    formData.append('userId', user.USER_ID);

    // Xử lý File ảnh cho FormData (Cực quan trọng với React Native)
    const fileToUpload = {
      uri: Platform.OS === 'android' 
            ? selectedImage.uri 
            : selectedImage.uri.replace('file://', ''), // iOS cần bỏ file://
      type: selectedImage.type || 'image/jpeg',
      name: selectedImage.fileName || `avatar_${user.USER_ID}.jpg`,
    };

    formData.append('file', fileToUpload as any);

    // 2. Gọi API
    const response = await axios.post(`${API_BASE_URL}/UploadImage`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    const { CODE, MESSAGE_VI, DATA } = response.data;

    if (CODE === 1) {
      // 3. Cập nhật Redux Store ngay lập tức
      // DATA.IMAGE là đường dẫn mới từ server trả về
      dispatch(updateUserProfile({ IMAGE: DATA.IMAGE }));
      
      Alert.alert("Thành công", MESSAGE_VI, [
           { text: "OK", onPress: () => navigation.goBack() }
      ]);
    } else {
      Alert.alert("Thất bại", MESSAGE_VI);
    }

  } catch (error) {
    console.error("Upload Error:", error);
    Alert.alert("Lỗi", "Upload thất bại. Vui lòng kiểm tra kết nối.");
  } finally {
    setLoading(false);
  }
};