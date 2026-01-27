import React from 'react';
import {
  View, Text, TouchableOpacity, FlatList, ActivityIndicator,
  Alert, StatusBar, Modal, TextInput, StyleSheet
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaView } from 'react-native-safe-area-context';

// Imports
import { styles } from './styles';
import { useConfigDeviceController, Step } from './controller';
import { RadarScanner } from './components/RadarScanner'; // Đảm bảo đúng đường dẫn

export function ConfigDeviceScreen() {
  const {
    currentStep, isScanningBle, bleDevices, wifiList,
    modalVisible, selectedSsid, password, status, connectionStatus, deviceName,
    setModalVisible, setPassword,
    onSubmitConfig, onWifiSelect,
    connectHandle, onScanPress, disConnect
  } = useConfigDeviceController();

  // --- RENDER ITEMS ---
  const renderBleItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.itemContainer} onPress={() => connectHandle(item.id, item.name)}>
      <MaterialIcons name="bluetooth" size={24} color="#2563EB" />
      <View style={{ marginLeft: 12, flex: 1 }}>
        <Text style={styles.itemTitle}>{item.name || "Thiết bị không tên"}</Text>
        <Text style={styles.itemSub}>{item.id}</Text>
      </View>
      <MaterialIcons name="chevron-right" size={24} color="#9CA3AF" />
    </TouchableOpacity>
  );

  const renderWifiItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.itemContainer} onPress={() => onWifiSelect(item.ssid)}>
      <MaterialIcons name="wifi" size={24} color="#059669" />
      <View style={{ marginLeft: 12 }}>
        <Text style={styles.itemTitle}>{item.ssid}</Text>
        <Text style={styles.itemSub}>Tín hiệu: {item.rssi} dBm</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      <View style={styles.body}>
        
        {/* STEP 1: QUÉT THIẾT BỊ BLE */}
        {currentStep === Step.SCAN_BLE && (
          <>
            <View style={localStyles.radarWrapper}>
              {isScanningBle ? (
                <RadarScanner /> 
              ) : (
                <View style={localStyles.idleIcon}>
                  <MaterialIcons name="bluetooth-disabled" size={60} color="#D1D5DB" />
                  <Text style={{color: '#9CA3AF', marginTop: 10}}>Sẵn sàng quét</Text>
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
              style={{ flex: 1 }}
              contentContainerStyle={{ paddingBottom: 20 }}
              ListEmptyComponent={!isScanningBle ? (
                <View style={localStyles.emptyBox}>
                  <Text style={{color: '#9CA3AF'}}>Chưa tìm thấy thiết bị nào xung quanh</Text>
                </View>
              ) : null}
            />

            {connectionStatus === 'CONNECTED' && (
              <View style={localStyles.connectedInfo}>
                <Text style={{color: '#10B981', fontWeight: 'bold'}}>✓ Đã kết nối: {deviceName}</Text>
                <TouchableOpacity onPress={() => disConnect(deviceName)}>
                  <Text style={{color: '#EF4444', marginLeft: 15, fontWeight: '600'}}>NGẮT</Text>
                </TouchableOpacity>
              </View>
            )}

            <TouchableOpacity 
              style={[styles.mainButton, isScanningBle && { opacity: 0.6 }]} 
              onPress={onScanPress}
              disabled={isScanningBle}
            >
              <Text style={styles.mainButtonText}>
                {isScanningBle ? "ĐANG TÌM..." : "QUÉT LẠI"}
              </Text>
            </TouchableOpacity>
          </>
        )}

        {/* STEP 2 & 3: KẾT NỐI & QUÉT WIFI (Dùng rada cho cả 2 để đẹp) */}
        {(currentStep === Step.CONNECTING_BLE || currentStep === Step.SCAN_WIFI) && (
          <View style={styles.centerView}>
            <RadarScanner />
            <Text style={[styles.statusText, { marginTop: 40 }]}>
              {currentStep === Step.CONNECTING_BLE ? "Đang thiết lập kết nối BLE..." : "Gateway đang quét WiFi..."}
            </Text>
          </View>
        )}

        {/* STEP 4: CHỌN WIFI */}
        {currentStep === Step.SELECT_WIFI && (
          <>
            <Text style={styles.sectionTitle}>Danh sách WiFi từ Gateway</Text>
            <FlatList
              data={wifiList}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderWifiItem}
              contentContainerStyle={{ paddingBottom: 20 }}
            />
          </>
        )}

        {/* STEP 5: ĐANG GỬI CẤU HÌNH */}
        {currentStep === Step.CONFIGURING && (
          <View style={styles.centerView}>
            <ActivityIndicator size="large" color="#10B981" />
            <Text style={styles.statusText}>Đang đồng bộ thông tin WiFi...</Text>
          </View>
        )}

        {/* STEP 6: THÀNH CÔNG */}
        {currentStep === Step.SUCCESS && (
          <View style={styles.centerView}>
            <MaterialIcons name="check-circle" size={100} color="#10B981" />
            <Text style={{color: '#10B981', fontWeight: 'bold', fontSize: 22, marginTop: 20}}>CẤU HÌNH HOÀN TẤT</Text>
            <Text style={{color: '#6B7280', marginTop: 10}}>Thiết bị của bạn đã sẵn sàng</Text>
          </View>
        )}
      </View>

      {/* MODAL NHẬP PASS WIFI */}
      <Modal animationType="fade" transparent={true} visible={modalVisible}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={{alignItems: 'center', marginBottom: 20}}>
              <MaterialIcons name="lock-outline" size={40} color="#2563EB" />
              <Text style={[styles.modalTitle, {marginTop: 10}]}>{selectedSsid}</Text>
            </View>
            <TextInput
              style={styles.input} 
              placeholder="Mật khẩu WiFi" 
              secureTextEntry={true}
              value={password} 
              onChangeText={setPassword}
              autoFocus={true}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={[styles.modalBtn, styles.cancelBtn]} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelBtnText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalBtn, styles.confirmBtn]} onPress={onSubmitConfig}>
                <Text style={styles.confirmBtnText}>Xác nhận</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  radarWrapper: {
    height: 280,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  idleIcon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  connectedInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ECFDF5',
    padding: 12,
    borderRadius: 12,
    marginBottom: 15,
  },
  emptyBox: {
    alignItems: 'center', 
    marginTop: 40,
    paddingHorizontal: 40,
  }
});