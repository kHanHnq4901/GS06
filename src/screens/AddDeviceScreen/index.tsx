import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from 'react-native';
import { Text } from 'react-native-paper';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import { useRoute, useNavigation } from '@react-navigation/native';

// Import Services
import { MqttProtocolService } from '../../services/mqtt';
import { getSensorsByGateway } from '../../services/api/common';

export function AddDeviceScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { serial } = (route.params as any) || {};
  
  const [devices, setDevices] = useState<any[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isAdding, setIsAdding] = useState(false); // Trạng thái đang thêm node
  
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  // --- FETCH DỮ LIỆU ---
  const fetchLoraDevices = useCallback(async () => {
    if (!serial) return;
    try {
      setIsSyncing(true);
      const res = await getSensorsByGateway(serial);
      if (res.CODE === 1) {
        setDevices(res.DATA);
      }
    } catch (error) {
      console.error("Lỗi lấy dữ liệu LoRa:", error);
    } finally {
      setIsSyncing(false);
    }
  }, [serial]);

  // --- REFRESH GỬI LẠI LỆNH ADD_NODE ---
  const handleManualRefresh = async () => {
    if (isAdding) return;
    setIsSyncing(true);
    try {
      await MqttProtocolService.addNode(serial); // Gửi lại lệnh ghép nối
      await fetchLoraDevices(); // Tải lại danh sách
    } catch (e) {
      console.log(e);
    } finally {
      setIsSyncing(false);
    }
  };

  // --- LOGIC THOÁT (Bị chặn nếu isAdding = true) ---
  const handleExit = async () => {
    if (isAdding) {
      Alert.alert("Thông báo", "Vui lòng hoàn tất quá trình thêm thiết bị trước khi thoát.");
      return;
    }
    
    try {
      await MqttProtocolService.disconnectPairing(serial);
      console.log(`[MQTT] Đã gửi lệnh thoát ghép nối (EOP) tới Gateway: ${serial}`);
    } catch (error) {
      console.log("Lỗi khi gửi lệnh thoát:", error);
    } finally {
      navigation.goBack();
    }
  };

  useEffect(() => {
    MqttProtocolService.addNode(serial); 
    fetchLoraDevices();

    pollingRef.current = setInterval(() => {
      fetchLoraDevices();
    }, 10000);

    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [serial, fetchLoraDevices]);

  // --- XỬ LÝ THÊM NODE ---
  const onAddNode = (nodeId: string) => {
    setIsAdding(true); // Khóa các tính năng thoát/refresh
    Alert.alert(
      "Xác nhận", 
      `Bạn muốn thêm thiết bị ${nodeId}?`, 
      [
        { 
          text: "Hủy", 
          style: "cancel",
          onPress: () => setIsAdding(false) // Mở khóa nếu hủy
        },
        { 
          text: "Đồng ý", 
          onPress: async () => {
            try {
              console.log("Đang thực hiện thêm node:", nodeId);
              // Thực hiện logic API thêm ở đây nếu có
              // await addNodeApi(nodeId); 
            } finally {
              setIsAdding(false); // Hoàn tất thì mở khóa
            }
          } 
        }
      ],
      { cancelable: false }
    );
  };

  const renderItem = ({ item, index }: { item: any; index: number }) => (
    <Animated.View entering={FadeInUp.delay(index * 100)} style={localStyles.deviceCard}>
      <View style={localStyles.iconBox}>
        <MaterialIcons name="settings-remote" size={22} color="#2563EB" />
      </View>
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={localStyles.deviceName}>{item.DEVICE_NAME || 'Cảm biến LoRa'}</Text>
        <Text style={localStyles.deviceInfo}>ID: {item.SENSOR_ID}  •  Loại: {item.SENSOR_TYPE}</Text>
      </View>
      <TouchableOpacity 
        style={[localStyles.addSmallBtn, isAdding && { opacity: 0.5 }]} 
        onPress={() => onAddNode(item.SENSOR_ID)}
        disabled={isAdding}
      >
        <MaterialIcons name="add" size={20} color="#2563EB" />
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <SafeAreaView style={localStyles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" />

      {/* HEADER */}
      <View style={localStyles.minimalHeader}>
        <TouchableOpacity 
          onPress={handleExit} 
          style={localStyles.backBtn}
          disabled={isAdding}
        >
          <MaterialIcons name="close" size={24} color={isAdding ? "#CBD5E1" : "#1F2937"} />
        </TouchableOpacity>
        
        <View style={localStyles.headerTextCenter}>
          <Text style={localStyles.headerTitle}>Đang quét thiết bị</Text>
          <Text style={localStyles.headerSub}>Gateway: {serial}</Text>
        </View>

        <TouchableOpacity 
          style={localStyles.syncBtn} 
          onPress={handleManualRefresh}
          disabled={isSyncing || isAdding}
        >
          {isSyncing ? (
            <ActivityIndicator size="small" color="#2563EB" />
          ) : (
            <MaterialIcons name="sync" size={22} color={isAdding ? "#CBD5E1" : "#2563EB"} />
          )}
        </TouchableOpacity>
      </View>

      <FlatList
        data={devices}
        keyExtractor={(item, index) => item.SENSOR_ID?.toString() || index.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 10, paddingBottom: 100 }}
        ListEmptyComponent={() => (
          <View style={localStyles.emptyContainer}>
            <ActivityIndicator size="large" color="#CBD5E1" style={{ marginBottom: 15 }} />
            <Text style={localStyles.emptyText}>Đang chờ thiết bị LoRa phản hồi...</Text>
            <Text style={{ color: '#CBD5E1', fontSize: 11, marginTop: 5 }}>Tự động cập nhật mỗi 10s</Text>
          </View>
        )}
      />

      {/* FOOTER */}
      <Animated.View entering={FadeInDown} style={localStyles.footer}>
        <TouchableOpacity 
          style={[localStyles.exitBtn, isAdding && { backgroundColor: '#94A3B8' }]} 
          activeOpacity={0.8}
          onPress={handleExit}
          disabled={isAdding}
        >
          <MaterialIcons name="power-settings-new" size={20} color="#fff" style={{marginRight: 8}} />
          <Text style={localStyles.exitBtnText}>THOÁT CHẾ ĐỘ GHÉP NỐI</Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  minimalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 60,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  backBtn: { width: 40, height: 40, justifyContent: 'center' },
  headerTextCenter: { alignItems: 'center' },
  headerTitle: { fontSize: 17, fontWeight: '700', color: '#1F2937' },
  headerSub: { fontSize: 11, color: '#64748B', fontWeight: '500' },
  syncBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'flex-end' },
  deviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deviceName: { fontSize: 15, fontWeight: '600', color: '#1F2937' },
  deviceInfo: { fontSize: 12, color: '#94A3B8', marginTop: 2 },
  addSmallBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F0F7FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: 20,
    backgroundColor: 'rgba(248, 250, 252, 0.9)',
  },
  exitBtn: {
    backgroundColor: '#1E293B',
    height: 54,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    elevation: 5,
  },
  exitBtnText: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  emptyContainer: { alignItems: 'center', marginTop: 100 },
  emptyText: { color: '#94A3B8', fontSize: 14, marginTop: 10 },
});