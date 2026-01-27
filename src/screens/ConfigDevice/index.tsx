import React from 'react';
import {
  View, Text, TouchableOpacity, FlatList, ActivityIndicator,
  Alert, StatusBar, Modal, TextInput
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaView } from 'react-native-safe-area-context';

// Imports
import { styles } from './styles';
import { useConfigDeviceController, Step } from './controller';

export function ConfigDeviceScreen() {
  // Gọi Controller
  const {
    currentStep, isScanningBle, bleDevices, wifiList,
    modalVisible, selectedSsid, password,
    setModalVisible, setPassword,
    startScanProcess, connectToDevice, onWifiSelect, onSubmitConfig
  } = useConfigDeviceController();

  // --- RENDER ITEMS ---
  const renderBleItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.itemContainer} onPress={() => connectToDevice(item.id)}>
        <MaterialIcons name="bluetooth" size={24} color="#2563EB" />
        <View style={{ marginLeft: 12 }}>
            <Text style={styles.itemTitle}>{item.name || "Không tên"}</Text>
            <Text style={styles.itemSub}>{item.id}</Text>
        </View>
        <MaterialIcons name="chevron-right" size={24} color="#9CA3AF" style={{ marginLeft: 'auto' }} />
    </TouchableOpacity>
  );

  const renderWifiItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.itemContainer} onPress={() => onWifiSelect(item.ssid)}>
        <MaterialIcons name="wifi" size={24} color="#059669" />
        <View style={{ marginLeft: 12 }}>
            <Text style={styles.itemTitle}>{item.ssid}</Text>
            <Text style={styles.itemSub}>RSSI: {item.rssi} | {item.sec}</Text>
        </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.body}>
        
        {currentStep === Step.SCAN_BLE && (
            <>
                <Text style={styles.sectionTitle}>Tìm thiết bị...</Text>
                {isScanningBle && <ActivityIndicator size="large" color="#2563EB" style={{ marginVertical: 20 }} />}
                
                <FlatList
                    data={bleDevices}
                    keyExtractor={item => item.id}
                    renderItem={renderBleItem}
                    ListEmptyComponent={!isScanningBle ? <Text style={{textAlign:'center', marginTop: 20}}>Không tìm thấy thiết bị</Text> : null}
                />
                 <TouchableOpacity style={styles.mainButton} onPress={startScanProcess}>
                    <Text style={styles.mainButtonText}>Quét lại</Text>
                </TouchableOpacity>
            </>
        )}

        {(currentStep === Step.CONNECTING_BLE || currentStep === Step.SCAN_WIFI) && (
            <View style={styles.centerView}>
                <ActivityIndicator size="large" color="#2563EB" />
                <Text style={styles.statusText}>
                    {currentStep === Step.CONNECTING_BLE ? "Đang kết nối..." : "Đang lấy danh sách Wifi..."}
                </Text>
            </View>
        )}

        {currentStep === Step.SELECT_WIFI && (
            <>
                <Text style={styles.sectionTitle}>Chọn Wifi để kết nối</Text>
                <FlatList
                    data={wifiList}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={renderWifiItem}
                />
            </>
        )}

        {currentStep === Step.CONFIGURING && (
            <View style={styles.centerView}>
                <ActivityIndicator size="large" color="#10B981" />
                <Text style={styles.statusText}>Đang gửi cấu hình...</Text>
            </View>
        )}

         {currentStep === Step.SUCCESS && (
            <View style={styles.centerView}>
                <MaterialIcons name="check-circle" size={80} color="#10B981" />
                <Text style={{color: '#10B981', fontWeight: 'bold', fontSize: 18}}>Thành công!</Text>
            </View>
        )}
      </View>
      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Wifi: {selectedSsid}</Text>
            <TextInput
              style={styles.input} placeholder="Nhập mật khẩu..." secureTextEntry={true}
              value={password} onChangeText={setPassword}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={[styles.modalBtn, styles.cancelBtn]} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelBtnText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalBtn, styles.confirmBtn]} onPress={onSubmitConfig}>
                <Text style={styles.confirmBtnText}>Kết nối</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}