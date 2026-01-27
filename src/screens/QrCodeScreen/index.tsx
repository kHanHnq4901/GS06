import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, StatusBar, Alert } from 'react-native';
import { Text } from 'react-native-paper';
import { 
  Camera, 
  useCameraDevice, 
  useCodeScanner, 
  useCameraPermission 
} from 'react-native-vision-camera';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import Animated, { FadeIn } from 'react-native-reanimated';

export function QrCodeScreen({ navigation }: any) {
  const { hasPermission, requestPermission } = useCameraPermission();
  const [isActive, setIsActive] = useState(true);
  const device = useCameraDevice('back');

  // Yêu cầu quyền camera khi vào màn hình
  useEffect(() => {
    requestPermission();
  }, []);

  // Logic xử lý khi quét được mã QR
  const codeScanner = useCodeScanner({
    codeTypes: ['qr'],
    onCodeScanned: (codes) => {
      if (codes.length > 0 && isActive) {
        setIsActive(false); // Tạm dừng quét để xử lý
        const value = codes[0].value;
        
        Alert.alert("Quét thành công", `Mã Serial: ${value}`, [
          { text: "Quét lại", onPress: () => setIsActive(true) },
          { text: "Xác nhận", onPress: () => navigation.goBack() }
        ]);
      }
    }
  });

  if (!hasPermission) return <View style={styles.center}><Text>Chưa cấp quyền Camera</Text></View>;
  if (device == null) return <View style={styles.center}><Text>Không tìm thấy thiết bị Camera</Text></View>;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={isActive}
        codeScanner={codeScanner}
      />

      {/* OVERLAY LỚP PHỦ TỐI */}
      <View style={styles.overlay}>
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
        <View style={styles.bottomContainer}>
           <Text style={styles.hintText}>Di chuyển camera đến mã QR trên thiết bị</Text>
           <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
              <MaterialIcons name="close" size={30} color="#fff" />
           </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  overlay: { ...StyleSheet.absoluteFillObject },
  unfocusedContainer: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' },
  middleContainer: { flexDirection: 'row', height: 260 },
  focusedContainer: { width: 260, position: 'relative' },
  // Bo góc khung quét
  cornerTopLeft: { position: 'absolute', top: 0, left: 0, width: 40, height: 40, borderTopWidth: 4, borderLeftWidth: 4, borderColor: '#2563EB' },
  cornerTopRight: { position: 'absolute', top: 0, right: 0, width: 40, height: 40, borderTopWidth: 4, borderRightWidth: 4, borderColor: '#2563EB' },
  cornerBottomLeft: { position: 'absolute', bottom: 0, left: 0, width: 40, height: 40, borderBottomWidth: 4, borderLeftWidth: 4, borderColor: '#2563EB' },
  cornerBottomRight: { position: 'absolute', bottom: 0, right: 0, width: 40, height: 40, borderBottomWidth: 4, borderRightWidth: 4, borderColor: '#2563EB' },
  
  bottomContainer: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', alignItems: 'center', paddingTop: 40 },
  hintText: { color: '#fff', fontSize: 14, marginBottom: 30, opacity: 0.8 },
  backBtn: { width: 60, height: 60, borderRadius: 30, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' }
});