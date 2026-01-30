import React, { useEffect } from 'react'; // Thêm useEffect để log
import { View, Text, TouchableOpacity, FlatList, StatusBar, StyleSheet } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native'; // Thêm import này

import { styles } from './styles';
import { useConfigDeviceController } from './controller';
import { RadarScanner } from './components/RadarScanner';

export function ConfigDeviceScreen() {
  // Lấy dữ liệu từ params
  const route = useRoute();
  const { homeId } = (route.params as any) || { homeId: null };

  // Log ra HOME_ID để kiểm tra
  useEffect(() => {
    console.log("-------------------------------");
    console.log("📍 Đã nhận HOME_ID tại ConfigDevice:", homeId);
    console.log("-------------------------------");
  }, [homeId]);

  const { 
    isScanningBle, 
    bleDevices, 
    onScanPress, 
    connectHandle 
  } = useConfigDeviceController();

  const renderBleItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.itemContainer} 
      // Bạn nên truyền homeId vào connectHandle nếu controller cần nó để gọi API Declare
      onPress={() => connectHandle(item.id, item.name, homeId)} 
    >
      <MaterialIcons name="bluetooth" size={24} color="#2563EB" />
      <View style={localStyles.itemTextContent}>
        <Text style={styles.itemTitle}>{item.name || "Thiết bị không tên"}</Text>
        <Text style={styles.itemSub}>{item.id}</Text>
      </View>
      <MaterialIcons name="chevron-right" size={24} color="#9CA3AF" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Hiển thị Home ID lên UI nếu muốn kiểm tra nhanh */}
      {/* <View style={{ paddingHorizontal: 20, paddingTop: 10 }}>
        <Text style={{ fontSize: 12, color: '#6B7280' }}>
          ID Nhà đang cấu hình: <Text style={{ fontWeight: 'bold', color: '#2563EB' }}>{homeId || "N/A"}</Text>
        </Text>
      </View> */}

      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.body}>
        {/* ... giữ nguyên phần còn lại ... */}
        <View style={localStyles.radarWrapper}>
          {isScanningBle ? <RadarScanner /> : (
            <View style={localStyles.idleIcon}>
              <MaterialIcons name="bluetooth-disabled" size={60} color="#D1D5DB" />
              <Text style={localStyles.idleText}>Sẵn sàng quét</Text>
            </View>
          )}
        </View>

        <Text style={styles.sectionTitle}>
          {isScanningBle ? "Đang tìm Gateway..." : "Thiết bị khả dụng"}
        </Text>
        
        <FlatList
          data={bleDevices}
          keyExtractor={item => item.id}
          renderItem={renderBleItem}
          ListEmptyComponent={!isScanningBle ? (
            <View style={localStyles.emptyBox}>
              <Text style={localStyles.emptyText}>Chưa tìm thấy thiết bị nào</Text>
            </View>
          ) : null}
        />

        <TouchableOpacity 
          style={[styles.mainButton, isScanningBle && { opacity: 0.6 }]} 
          onPress={onScanPress}
          disabled={isScanningBle}
        >
          <Text style={styles.mainButtonText}>
            {isScanningBle ? "ĐANG TÌM..." : "QUÉT LẠI"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  radarWrapper: { height: 120, justifyContent: 'center', alignItems: 'center', marginVertical: 20 },
  idleIcon: { alignItems: 'center' },
  idleText: { color: '#9CA3AF', marginTop: 10 },
  itemTextContent: { marginLeft: 12, flex: 1 },
  emptyBox: { alignItems: 'center', marginTop: 40 },
  emptyText: { color: '#9CA3AF' }
});