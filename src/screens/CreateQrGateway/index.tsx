import React from 'react';
import {
  View,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  Share,
} from 'react-native';
import { Text } from 'react-native-paper';
import Animated, { FadeInUp, ZoomIn } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import QRCode from 'react-native-qrcode-svg'; // Thư viện tạo QR

export function CreateQrGatewayScreen() {
  // Dữ liệu giả định của thiết bị/Gateway
  const deviceData = {
    serial: 'GW-SAFE-2026-X89',
    type: 'LORA_GATEWAY',
    name: 'SafeHome Gateway Tầng 1'
  };

  // Hàm chia sẻ Serial/Link
  const onShare = async () => {
    try {
      await Share.share({
        message: `Mã Serial thiết bị SafeHome: ${deviceData.serial}`,
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <SafeAreaView style={localStyles.container}>
      <StatusBar barStyle="dark-content" />

      {/* HEADER SECTION */}
      <View style={localStyles.header}>
        <Text style={localStyles.headerTitle}>Mã QR Thiết bị</Text>
        <Text style={localStyles.headerSubTitle}>Sử dụng mã này để chia sẻ quyền quản trị</Text>
      </View>

      <View style={localStyles.content}>
        {/* QR CARD */}
        <Animated.View entering={ZoomIn.duration(600)} style={localStyles.qrCard}>
          <View style={localStyles.qrWrapper}>
            <QRCode
              value={deviceData.serial}
              size={220}
              color="#111827"
              backgroundColor="white"
            />
          </View>
          
          <View style={localStyles.divider} />

          <View style={localStyles.infoSection}>
            <Text style={localStyles.label}>Số Serial thiết bị</Text>
            <Text style={localStyles.serialText}>{deviceData.serial}</Text>
            
            <View style={localStyles.typeBadge}>
               <MaterialIcons name="router" size={16} color="#2563EB" />
               <Text style={localStyles.typeText}>LORA GATEWAY</Text>
            </View>
          </View>
        </Animated.View>

        {/* ACTIONS */}
        <Animated.View entering={FadeInUp.delay(400)} style={localStyles.actionRow}>
          <TouchableOpacity style={localStyles.actionButton} onPress={onShare}>
            <MaterialIcons name="share" size={24} color="#2563EB" />
            <Text style={localStyles.actionLabel}>Chia sẻ</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={localStyles.actionButton} onPress={() => {}}>
            <MaterialIcons name="file-download" size={24} color="#2563EB" />
            <Text style={localStyles.actionLabel}>Lưu ảnh</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>

      {/* FOOTER NOTE */}
      <View style={localStyles.footer}>
        <MaterialIcons name="info-outline" size={18} color="#6B7280" />
        <Text style={localStyles.footerNote}>
          Người được chia sẻ cần quét mã này bằng ứng dụng SafeHome để kết nối.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F3F4F6' 
  },
  header: {
    padding: 24,
    alignItems: 'center',
  },
  headerTitle: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    color: '#111827' 
  },
  headerSubTitle: { 
    fontSize: 14, 
    color: '#6B7280', 
    marginTop: 6,
    textAlign: 'center' 
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  qrCard: {
    backgroundColor: '#fff',
    padding: 25,
    borderRadius: 30,
    alignItems: 'center',
    width: '100%',
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 20,
  },
  qrWrapper: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    borderRadius: 20,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 25,
  },
  infoSection: {
    alignItems: 'center',
  },
  label: {
    fontSize: 12,
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  serialText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 8,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 15,
  },
  typeText: {
    fontSize: 12,
    color: '#2563EB',
    fontWeight: '600',
    marginLeft: 6,
  },
  actionRow: {
    flexDirection: 'row',
    marginTop: 40,
    width: '100%',
    justifyContent: 'space-around',
  },
  actionButton: {
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 20,
    width: '40%',
    elevation: 2,
  },
  actionLabel: {
    fontSize: 14,
    color: '#2563EB',
    fontWeight: '600',
    marginTop: 5,
  },
  footer: {
    padding: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerNote: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 10,
    textAlign: 'center',
    flex: 1,
  },
});