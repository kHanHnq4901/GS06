import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, StatusBar, Alert } from 'react-native';
import { Text } from 'react-native-paper';
import { CameraScreen } from 'react-native-camera-kit'; // Thư viện mới
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import Animated, { FadeIn } from 'react-native-reanimated';

export function QrCodeScreen({ navigation }: any) {
  const [isScanned, setIsScanned] = useState(false);

  // Logic xử lý khi quét được mã QR
  const onReadCode = (event: any) => {
    if (isScanned) return; 

    const value = event.nativeEvent.codeStringValue;
    setIsScanned(true); // Tạm dừng logic quét

    Alert.alert("Quét thành công", `Mã Serial: ${value}`, [
      { text: "Xác nhận", onPress: () => navigation.goBack() },
      { text: "Quét lại", onPress: () => setIsScanned(false) }
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      <CameraScreen
        actions={{ rightFilterTabBarMenuItems: [] }}
        onReadCode={onReadCode}
        scanBarcode={!isScanned} // Bật/tắt quét
        hideControls={true} 
        showFrame={false} // Tắt khung mặc định của thư viện để dùng khung tự chế bên dưới
      />

      {/* OVERLAY LỚP PHỦ TỐI (Giữ nguyên giao diện của bạn) */}
      <View style={styles.overlay} pointerEvents="none">
        <View style={styles.unfocusedContainer}></View>
        <View style={styles.middleContainer}>
          <View style={styles.unfocusedContainer}></View>
          {/* KHUNG QUÉT CHÍNH */}
          <View style={styles.focusedContainer}>
             <Animated.View entering={FadeIn.delay(500)} style={styles.cornerTopLeft} />
             <Animated.View entering={FadeIn.delay(500)} style={styles.cornerTopRight} />
             <Animated.View entering={FadeIn.delay(500)} style={styles.cornerBottomLeft} />
             <Animated.View entering={FadeIn.delay(500)} style={styles.cornerBottomRight} />
          </View>
          <View style={styles.unfocusedContainer}></View>
        </View>
        <View style={styles.bottomContainer}></View>
      </View>

      {/* NÚT BẤM VÀ CHÚ THÍCH (Nằm trên cùng lớp overlay) */}
      <View style={styles.contentUI}>
          <Text style={styles.hintText}>Di chuyển camera đến mã QR trên thiết bị</Text>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
              <MaterialIcons name="close" size={30} color="#fff" />
          </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  overlay: { ...StyleSheet.absoluteFillObject, zIndex: 1 },
  contentUI: { 
    position: 'absolute', 
    bottom: 50, 
    left: 0, 
    right: 0, 
    alignItems: 'center', 
    zIndex: 2 
  },
  unfocusedContainer: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' },
  middleContainer: { flexDirection: 'row', height: 260 },
  focusedContainer: { width: 260, position: 'relative' },
  cornerTopLeft: { position: 'absolute', top: 0, left: 0, width: 40, height: 40, borderTopWidth: 4, borderLeftWidth: 4, borderColor: '#2563EB' },
  cornerTopRight: { position: 'absolute', top: 0, right: 0, width: 40, height: 40, borderTopWidth: 4, borderRightWidth: 4, borderColor: '#2563EB' },
  cornerBottomLeft: { position: 'absolute', bottom: 0, left: 0, width: 40, height: 40, borderBottomWidth: 4, borderLeftWidth: 4, borderColor: '#2563EB' },
  cornerBottomRight: { position: 'absolute', bottom: 0, right: 0, width: 40, height: 40, borderBottomWidth: 4, borderRightWidth: 4, borderColor: '#2563EB' },
  bottomContainer: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' },
  hintText: { color: '#fff', fontSize: 14, marginBottom: 30, opacity: 0.8 },
  backBtn: { width: 60, height: 60, borderRadius: 30, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' }
});