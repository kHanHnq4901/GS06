import React from 'react';
import {
  View,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  Share,
  Dimensions, // Thêm Dimensions
} from 'react-native';
import { Text } from 'react-native-paper';
import Animated, { FadeInUp, ZoomIn } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import QRCode from 'react-native-qrcode-svg';
import { useNavigation, useRoute } from '@react-navigation/native';

// Tính toán tỉ lệ màn hình
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const scale = SCREEN_WIDTH / 375; // 375 là chiều rộng chuẩn của iPhone 11/X

export function CreateQrGatewayScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  
  const item = route.params as any;
  const gatewaySerial = item?.GATEWAY_ID?.toString() || 'N/A';
  const gatewayName = item?.GATEWAY_NAME || 'Thiết bị chưa đặt tên';

  const onShare = async () => {
    try {
      await Share.share({
        message: `Mã Serial thiết bị SafeHome: ${gatewaySerial}\nTên thiết bị: ${gatewayName}`,
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <SafeAreaView style={localStyles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={localStyles.content}>
        <Animated.View entering={ZoomIn.duration(600)} style={localStyles.qrCard}>
          <View style={localStyles.qrWrapper}>
            <QRCode
              value={gatewaySerial}
              size={SCREEN_WIDTH * 0.55} // QR luôn chiếm 55% chiều rộng màn hình
              color="#111827"
              backgroundColor="white"
            />
          </View>
          
          <View style={localStyles.divider} />

          <View style={localStyles.infoSection}>
            <Text style={localStyles.label}>Tên Gateway</Text>
            <Text style={localStyles.nameText} numberOfLines={1}>{gatewayName}</Text>
            
            <Text style={[localStyles.label, { marginTop: 12 * scale }]}>Số Serial / ID</Text>
            <Text style={localStyles.serialText}>{gatewaySerial}</Text>
            
            <View style={localStyles.typeBadge}>
               <MaterialIcons name="router" size={14 * scale} color="#2563EB" />
               <Text style={localStyles.typeText}>LORA GATEWAY</Text>
            </View>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(400)} style={localStyles.actionRow}>
          <TouchableOpacity style={localStyles.actionButton} onPress={onShare}>
            <MaterialIcons name="share" size={22 * scale} color="#2563EB" />
            <Text style={localStyles.actionLabel}>Chia sẻ</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={localStyles.actionButton} onPress={() => {}}>
            <MaterialIcons name="file-download" size={22 * scale} color="#2563EB" />
            <Text style={localStyles.actionLabel}>Lưu ảnh</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>

      <View style={localStyles.footer}>
        <MaterialIcons name="info-outline" size={16 * scale} color="#6B7280" />
        <Text style={localStyles.footerNote}>
          Người được chia sẻ cần quét mã này bằng ứng dụng GS06 để kết nối.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  backBtn: { padding: 16 * scale, position: 'absolute', zIndex: 10 },
  header: { paddingVertical: 20 * scale, alignItems: 'center', marginTop: 30 * scale },
  headerTitle: { fontSize: 22 * scale, fontWeight: 'bold', color: '#111827' },
  headerSubTitle: { 
    fontSize: 13 * scale, 
    color: '#6B7280', 
    marginTop: 6 * scale, 
    textAlign: 'center',
    paddingHorizontal: 40 * scale 
  },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 25 * scale },
  qrCard: { 
    backgroundColor: '#fff', 
    padding: 20 * scale, 
    borderRadius: 25 * scale, 
    alignItems: 'center', 
    width: '100%', 
    elevation: 8, 
    shadowColor: '#000', 
    shadowOpacity: 0.1, 
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 5 }
  },
  qrWrapper: { padding: 8 * scale, borderWidth: 1, borderColor: '#F3F4F6', borderRadius: 15 * scale },
  divider: { width: '100%', height: 1, backgroundColor: '#F3F4F6', marginVertical: 18 * scale },
  infoSection: { alignItems: 'center', width: '100%' },
  label: { fontSize: 10 * scale, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 1 },
  nameText: { fontSize: 18 * scale, fontWeight: '700', color: '#111827', marginTop: 4 * scale },
  serialText: { fontSize: 16 * scale, fontWeight: '600', color: '#374151', marginTop: 4 * scale },
  typeBadge: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#EFF6FF', 
    paddingHorizontal: 10 * scale, 
    paddingVertical: 5 * scale, 
    borderRadius: 15 * scale, 
    marginTop: 12 * scale 
  },
  typeText: { fontSize: 11 * scale, color: '#2563EB', fontWeight: '600', marginLeft: 6 * scale },
  actionRow: { flexDirection: 'row', marginTop: 30 * scale, width: '100%', justifyContent: 'space-around' },
  actionButton: { 
    alignItems: 'center', 
    backgroundColor: '#fff', 
    padding: 12 * scale, 
    borderRadius: 18 * scale, 
    width: '42%', 
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5
  },
  actionLabel: { fontSize: 13 * scale, color: '#2563EB', fontWeight: '600', marginTop: 5 * scale },
  footer: { padding: 20 * scale, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  footerNote: { fontSize: 11 * scale, color: '#6B7280', marginLeft: 8 * scale, textAlign: 'center', flex: 1 },
});