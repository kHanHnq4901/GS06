import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, StatusBar, ActivityIndicator, Alert } from 'react-native';
import { Text } from 'react-native-paper';
import { Camera, useCameraDevice, useCodeScanner, useCameraPermission } from 'react-native-vision-camera';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { MqttProtocolService } from '../../services/mqtt';

export function QrCodeScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { serial } = (route.params as any) || {}; 
  
  const { hasPermission, requestPermission } = useCameraPermission();
  const [isActive, setIsActive] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false); 
  const device = useCameraDevice('back');

  useEffect(() => {
    requestPermission();
  }, []);

const handleLinkProcess = async (targetSerial: string) => {
    setIsProcessing(true);
    try {
      // Gọi service và đợi kết quả từ MqttProtocolService (đã có xử lý timeout/ACK bên trong)
      const result = await MqttProtocolService.addLinkGateway(serial, targetSerial);
      
      // Kiểm tra nếu kết quả trả về là timeout từ service của bạn
      if (result && result.status === 'timeout') {
         // Không cần Alert ở đây vì trong Service của bạn đã có Alert.alert rồi
         setIsActive(true); 
      } else {
        // TRƯỜNG HỢP THÀNH CÔNG
        Alert.alert(
          "Thành công", 
          `Đã liên kết thành công với Gateway: ${targetSerial}`,
          [
            { 
              text: "Tiếp tục quét", 
              onPress: () => setIsActive(true) // Bật lại camera để quét mã khác
            },
            { 
              text: "Hoàn tất", 
              onPress: () => navigation.goBack() // Thoát về màn hình trước
            }
          ]
        );
      }
    } catch (error) {
      console.log("Lỗi hệ thống MQTT:", error);
      Alert.alert("Lỗi", "Đã có lỗi xảy ra trong quá trình gửi lệnh.");
      setIsActive(true); // Cho phép quét lại
    } finally {
      setIsProcessing(false);
    }
  };

  const codeScanner = useCodeScanner({
    codeTypes: ['qr'],
    onCodeScanned: (codes) => {
      // Chống quét lặp khi đang xử lý
      if (codes.length > 0 && isActive && !isProcessing) {
        const targetSerial = codes[0].value;
        if (!targetSerial) return;

        setIsActive(false); // Dừng camera ngay lập tức

        handleLinkProcess(targetSerial);
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

      <View style={styles.overlay}>
        <View style={styles.unfocusedContainer} />
        
        <View style={styles.middleContainer}>
          <View style={styles.unfocusedContainer} />
          <View style={styles.focusedContainer}>
             {/* Góc khung quét */}
             <View style={styles.cornerTopLeft} />
             <View style={styles.cornerTopRight} />
             <View style={styles.cornerBottomLeft} />
             <View style={styles.cornerBottomRight} />
          </View>
          <View style={styles.unfocusedContainer} />
        </View>
        
        <View style={styles.bottomContainer}>
           <Text style={styles.hintText}>Gateway đang cài đặt: {serial}</Text>
           <Text style={styles.subHint}>Quét mã QR của Gateway mục tiêu</Text>
           
           {isProcessing ? (
             <View style={styles.loadingBox}>
                <ActivityIndicator size="large" color="#2563EB" />
                <Text style={styles.loadingText}>Đang chờ Gateway phản hồi...</Text>
             </View>
           ) : (
             <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                <MaterialIcons name="close" size={30} color="#fff" />
             </TouchableOpacity>
           )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  overlay: { ...StyleSheet.absoluteFillObject },
  unfocusedContainer: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)' },
  middleContainer: { flexDirection: 'row', height: 260 },
  focusedContainer: { width: 260, position: 'relative' },
  cornerTopLeft: { position: 'absolute', top: 0, left: 0, width: 30, height: 30, borderTopWidth: 5, borderLeftWidth: 5, borderColor: '#2563EB' },
  cornerTopRight: { position: 'absolute', top: 0, right: 0, width: 30, height: 30, borderTopWidth: 5, borderRightWidth: 5, borderColor: '#2563EB' },
  cornerBottomLeft: { position: 'absolute', bottom: 0, left: 0, width: 30, height: 30, borderBottomWidth: 5, borderLeftWidth: 5, borderColor: '#2563EB' },
  cornerBottomRight: { position: 'absolute', bottom: 0, right: 0, width: 30, height: 30, borderBottomWidth: 5, borderRightWidth: 5, borderColor: '#2563EB' },
  bottomContainer: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', alignItems: 'center', paddingTop: 20 },
  hintText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  subHint: { color: '#bbb', fontSize: 13, marginTop: 5, marginBottom: 30 },
  backBtn: { width: 60, height: 60, borderRadius: 30, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  loadingBox: { alignItems: 'center' },
  loadingText: { color: '#2563EB', marginTop: 10, fontWeight: 'bold' }
});