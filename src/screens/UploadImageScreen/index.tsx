import React from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { Button, Text, Avatar } from 'react-native-paper';
import MaterialIcons from '@react-native-vector-icons/material-icons';

import { useEditProfileController } from './controller';
import { styles } from './styles';

export function EditProfileScreen({ navigation }: any) {
  // Lấy mọi thứ từ Controller
  const { 
    user, 
    loading, 
    selectedImage, 
    displayImage, 
    onSelectImage, 
    onUpload 
  } = useEditProfileController(navigation);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Cập nhật ảnh đại diện</Text>

      {/* Khu vực Avatar + Nút Camera */}
      <View style={styles.avatarContainer}>
        {displayImage ? (
           <Image source={displayImage} style={styles.avatar} />
        ) : (
           <Avatar.Icon size={130} icon="account" style={styles.avatar} />
        )}
        
        <TouchableOpacity 
            style={styles.cameraIcon} 
            onPress={onSelectImage}
            activeOpacity={0.8}
        >
            <MaterialIcons name="camera-alt" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Thông tin User */}
      <Text style={styles.username}>{user?.USER_NAME || "Người dùng"}</Text>
      <Text style={styles.subtext}>Chọn ảnh đẹp nhất của bạn để làm hồ sơ</Text>

      {/* Nút Lưu */}
      <Button 
        mode="contained" 
        onPress={onUpload} 
        loading={loading}
        disabled={loading || !selectedImage} // Chỉ active khi đã chọn ảnh mới
        style={styles.button}
        labelStyle={styles.buttonLabel}
        icon="cloud-upload"
        contentStyle={{ height: 48 }}
      >
        Lưu ảnh đại diện
      </Button>
    </View>
  );
}