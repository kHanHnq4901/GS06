import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { Text } from 'react-native-paper';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from '@react-native-vector-icons/material-icons';

// --- DỮ LIỆU GIẢ THIẾT BỊ LORA ---
const MOCK_LORA_DEVICES = [
  { id: 'LR-915-001', name: 'Đầu báo khói tầng 1', rssi: -85, snr: 7.5, type: 'SMOKE', status: 'ready' },
  { id: 'LR-915-042', name: 'Cảm biến nhiệt kho', rssi: -92, snr: 5.2, type: 'HEAT', status: 'ready' },
  { id: 'LR-915-108', name: 'Nút nhấn khẩn cấp', rssi: -70, snr: 9.1, type: 'BUTTON', status: 'ready' },
  { id: 'LR-915-015', name: 'Đầu báo gas bếp', rssi: -105, snr: -2.1, type: 'GAS', status: 'ready' },
  { id: 'LR-915-220', name: 'Cảm biến cửa thoát hiểm', rssi: -88, snr: 6.8, type: 'DOOR', status: 'ready' },
];

export function AddDeviceScreen() {
  const [devices, setDevices] = useState<any[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    // Giả lập quá trình Gateway quét tìm thiết bị LoRa
    handleRefresh();
  }, []);

  const handleRefresh = () => {
    setIsSyncing(true);
    setDevices([]);
    // Mô phỏng độ trễ khi nhận gói tin LoRa từ Gateway
    setTimeout(() => {
      setDevices(MOCK_LORA_DEVICES);
      setIsSyncing(false);
    }, 1500);
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'SMOKE': return 'detector-smoke';
      case 'HEAT': return 'whatshot';
      case 'GAS': return 'gas-meter';
      case 'BUTTON': return 'touch-app';
      default: return 'sensors';
    }
  };

  const renderItem = ({ item, index }: { item: any; index: number }) => (
    <Animated.View entering={FadeInUp.delay(index * 100)} style={localStyles.deviceCard}>
      <View style={[localStyles.iconBox, { backgroundColor: item.rssi > -90 ? '#ECFDF5' : '#FFF7ED' }]}>
        <MaterialIcons 
          name={getDeviceIcon(item.type)} 
          size={24} 
          color={item.rssi > -90 ? '#10B981' : '#F97316'} 
        />
      </View>

      <View style={{ flex: 1, marginLeft: 15 }}>
        <Text style={localStyles.deviceName}>{item.name}</Text>
        <Text style={localStyles.deviceInfo}>ID: {item.id}  •  SNR: {item.snr}dB</Text>
        
        <View style={localStyles.signalRow}>
          <MaterialIcons 
            name="podcasts" 
            size={14} 
            color={item.rssi > -90 ? '#10B981' : '#EF4444'} 
          />
          <Text style={[localStyles.rssiText, { color: item.rssi > -90 ? '#10B981' : '#EF4444' }]}>
            Tín hiệu: {item.rssi} dBm ({item.rssi > -90 ? 'Tốt' : 'Yếu'})
          </Text>
        </View>
      </View>

      <TouchableOpacity 
        style={localStyles.addButton}
        onPress={() => console.log('Thêm thiết bị:', item.id)}
      >
        <MaterialIcons name="add" size={24} color="#fff" />
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <SafeAreaView style={localStyles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" />

      {/* HEADER SECTION */}
      <View style={localStyles.header}>
        <View>
          <Text style={localStyles.headerTitle}>Thiết bị LoRa</Text>
          <Text style={localStyles.headerSubTitle}>Tìm thấy {devices.length} thiết bị mới xung quanh</Text>
        </View>
        <TouchableOpacity 
          onPress={handleRefresh} 
          disabled={isSyncing}
          style={localStyles.refreshCircle}
        >
          {isSyncing ? (
            <ActivityIndicator size="small" color="#2563EB" />
          ) : (
            <MaterialIcons name="sync" size={24} color="#2563EB" />
          )}
        </TouchableOpacity>
      </View>

      <FlatList
        data={devices}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => !isSyncing && (
          <View style={localStyles.emptyContainer}>
            <MaterialIcons name="router" size={60} color="#D1D5DB" />
            <Text style={{ color: '#9CA3AF', marginTop: 10 }}>Chưa nhận được tín hiệu LoRa nào</Text>
          </View>
        )}
      />

      {/* FIXED FOOTER BUTTON */}
      {devices.length > 0 && (
        <Animated.View entering={FadeInDown.duration(500)} style={localStyles.footer}>
          <TouchableOpacity 
            style={localStyles.mainButton}
            onPress={() => console.log('Thêm tất cả thiết bị LoRa')}
            activeOpacity={0.8}
          >
            <MaterialIcons name="playlist-add-check" size={24} color="#fff" />
            <Text style={localStyles.mainButtonText}>THÊM TẤT CẢ THIẾT BỊ</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </SafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#111827' },
  headerSubTitle: { fontSize: 13, color: '#6B7280', marginTop: 4 },
  refreshCircle: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
  },
  iconBox: {
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deviceName: { fontSize: 16, fontWeight: 'bold', color: '#1F2937' },
  deviceInfo: { fontSize: 12, color: '#6B7280', marginTop: 2 },
  signalRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  rssiText: { fontSize: 11, fontWeight: '600', marginLeft: 4 },
  addButton: {
    backgroundColor: '#2563EB',
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 20,
    borderTopWidth: 1,
    borderColor: '#E5E7EB',
  },
  mainButton: {
    backgroundColor: '#2563EB',
    flexDirection: 'row',
    height: 55,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#2563EB',
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
  mainButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginLeft: 10 },
  emptyContainer: { alignItems: 'center', marginTop: 100 },
});