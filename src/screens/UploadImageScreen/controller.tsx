// 1. Thêm useEffect vào import
import { useState, useMemo, useEffect } from 'react';
import { Alert } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { API_BASE_URL,API_IMAGE } from '../../services/api';
import { handleUploadImage } from './handleButton';

export const useEditProfileController = (navigation: any) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.smartHome.auth.user);
  
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<any>(null);

  const displayImage = useMemo(() => {
    if (selectedImage?.uri) {
        return { uri: selectedImage.uri };
    }
    if (user?.IMAGE) {
        // Log thêm URL ảnh để kiểm tra
        const fullUrl = `${API_IMAGE}${user.IMAGE}`;
        console.log("Display Image URL:", fullUrl);
        return { uri: fullUrl };
    }
    
    return null;
  }, [selectedImage, user]);

  const onSelectImage = async () => {
    const options = {
      mediaType: 'photo' as const,
      maxWidth: 800,
      maxHeight: 800,
      quality: 0.8,
      selectionLimit: 1,
    };

    try {
      const result = await launchImageLibrary(options);

      if (result.didCancel) return;
      if (result.errorCode) {
        Alert.alert('Lỗi Camera', result.errorMessage);
        return;
      }
      
      if (result.assets && result.assets.length > 0) {
        console.log("Ảnh mới chọn:", result.assets[0]); // Log ảnh vừa chọn
        setSelectedImage(result.assets[0]);
      }
    } catch (error) {
       console.log(error);
    }
  };

  const onUpload = () => {
    handleUploadImage({
      user,
      selectedImage,
      dispatch,
      navigation,
      setLoading
    });
  };

  return {
    user,
    loading,
    selectedImage,
    displayImage,
    onSelectImage,
    onUpload
  };
};