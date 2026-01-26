import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, TouchableOpacity, FlatList, ActivityIndicator,
  Alert, StatusBar, Modal, TextInput
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

// Import Logic và Styles riêng
import { styles } from './styles';
import { BleProtocol } from '../../gateway/ble';

// Enum các bước trong quy trình [cite: 36]
enum Step {
  SCAN_BLE = 1,      
  CONNECTING_BLE = 2,
  SCAN_WIFI = 3,     
  SELECT_WIFI = 4,   
  CONFIGURING = 5,   
  SUCCESS = 6        
}

export function ConfigDeviceScreen() {
  // 1. Hook useNavigation ĐƯỢC GỌI ĐẦU TIÊN (Đúng luật Hooks)
  const navigation = useNavigation();
  
  // 2. Sau đó đến các useState
  const [currentStep, setCurrentStep] = useState<Step>(Step.SCAN_BLE);
  const [isScanningBle, setIsScanningBle] = useState(false);
  
  // Dữ liệu
  const [bleDevices, setBleDevices] = useState<any[]>([]);
  const [wifiList, setWifiList] = useState<any[]>([]);
  
  // Dùng Ref để lưu connectedId giúp cleanup trong useEffect hoạt động đúng
  const connectedIdRef = useRef<string | null>(null);
  
  // Modal nhập pass
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSsid, setSelectedSsid] = useState('');
  const [password, setPassword] = useState('');

  // 3. useEffect (Lifecycle)
  useEffect(() => {
    // Khởi tạo BLE
    BleProtocol.init();
    handleScanBle();

    // Lắng nghe phản hồi từ thiết bị (Notify A503) [cite: 26]
    const dataListener = BleProtocol.addDataListener((res) => {
        processDeviceResponse(res);
    });

    // Lắng nghe tìm thấy thiết bị khi scan (Advertising) [cite: 17]
    const scanListener = BleProtocol.addScanListener((peripheral) => {
        if (!peripheral.name) return;
        setBleDevices(prev => {
            if (prev.find(p => p.id === peripheral.id)) return prev;
            return [...prev, peripheral];
        });
    });

    // Cleanup khi thoát màn hình
    return () => {
        dataListener.remove();
        scanListener.remove();
        // Ngắt kết nối nếu đang có kết nối [cite: 65]
        if(connectedIdRef.current) {
            BleProtocol.disconnect(connectedIdRef.current);
        }
    };
  }, []);

  // --- CÁC HÀM XỬ LÝ LOGIC ---

  const handleScanBle = async () => {
    await BleProtocol.requestPermissions();
    setBleDevices([]);
    setIsScanningBle(true);
    setCurrentStep(Step.SCAN_BLE);

    // Bắt đầu quét thiết bị [cite: 19]
    BleProtocol.scanDevices().then(() => {
        console.log('Scanning started...');
        setTimeout(() => setIsScanningBle(false), 5000);
    });
  };

  const handleConnectBle = async (peripheralId: string) => {
    setIsScanningBle(false);
    setCurrentStep(Step.CONNECTING_BLE);
    
    try {
        await BleProtocol.connectAndPrepare(peripheralId);
        connectedIdRef.current = peripheralId; // Lưu vào Ref
        
        // Sau khi kết nối, gửi lệnh Scan Wifi ngay [cite: 41]
        setCurrentStep(Step.SCAN_WIFI);
        await BleProtocol.requestWifiScan(peripheralId);

    } catch (error) {
        console.log("Connect error:", error);
        Alert.alert("Lỗi", "Không thể kết nối thiết bị");
        setCurrentStep(Step.SCAN_BLE);
    }
  };

  const handleSubmitWifi = async () => {
      if (!connectedIdRef.current) return;
      if (password.length < 8) {
          Alert.alert("Lỗi", "Mật khẩu quá ngắn");
          return;
      }
      setModalVisible(false);
      setCurrentStep(Step.CONFIGURING);

      // Gửi lệnh cấu hình Wifi xuống thiết bị [cite: 54]
      await BleProtocol.sendWifiConfig(connectedIdRef.current, selectedSsid, password);
  };

  // --- XỬ LÝ PHẢN HỒI JSON TỪ THIẾT BỊ [cite: 28, 30] ---
  const processDeviceResponse = (res: any) => {
      console.log("Device Response:", res);
      switch (res.type) {
          case 'scan_resp': 
          case 'scan_resp ': // Fix lỗi dư khoảng trắng trong tài liệu [cite: 45]
              // Nhận danh sách Wifi [cite: 48]
              if (res.data && res.data.aps) {
                  setWifiList(res.data.aps);
                  setCurrentStep(Step.SELECT_WIFI);
              }
              break;

          case 'wifi_result': // Nhận kết quả cấu hình [cite: 60]
              if (res.data && res.data.result === 'success') {
                  setCurrentStep(Step.SUCCESS);
                  Alert.alert("Thành công", "Thiết bị đã kết nối Wifi!", [
                      { text: "OK", onPress: () => navigation.goBack() }
                  ]);
              } else {
                  // Xử lý lỗi (AUTH_ERROR, v.v.) [cite: 64, 69]
                  Alert.alert("Thất bại", `Lỗi: ${res.data?.reason || 'Unknown'}`);
                  setCurrentStep(Step.SELECT_WIFI);
              }
              break;
      }
  };

  // --- RENDER UI COMPONENTS ---

  const renderBleItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.itemContainer} onPress={() => handleConnectBle(item.id)}>
        <MaterialIcons name="bluetooth" size={24} color="#2563EB" />
        <View style={{ marginLeft: 12 }}>
            <Text style={styles.itemTitle}>{item.name || "Không tên"}</Text>
            <Text style={styles.itemSub}>{item.id}</Text>
        </View>
        <MaterialIcons name="chevron-right" size={24} color="#9CA3AF" style={{ marginLeft: 'auto' }} />
    </TouchableOpacity>
  );

  const renderWifiItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
        style={styles.itemContainer}
        onPress={() => { setSelectedSsid(item.ssid); setModalVisible(true); }}
    >
        <MaterialIcons name="wifi" size={24} color="#059669" />
        <View style={{ marginLeft: 12 }}>
            <Text style={styles.itemTitle}>{item.ssid}</Text>
            <Text style={styles.itemSub}>RSSI: {item.rssi} | {item.sec}</Text>
        </View>
    </TouchableOpacity>
  );

  // --- MAIN RENDER ---
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      {/* Body */}
      <View style={styles.body}>
        
        {/* Step 1: List BLE Devices */}
        {currentStep === Step.SCAN_BLE && (
            <>
                <Text style={styles.sectionTitle}>Tìm thiết bị...</Text>
                {isScanningBle && <ActivityIndicator size="large" color="#2563EB" style={{ marginVertical: 20 }} />}
                
                <FlatList
                    data={bleDevices}
                    keyExtractor={item => item.id}
                    renderItem={renderBleItem}
                    ListEmptyComponent={!isScanningBle ? <Text style={{textAlign:'center', marginTop: 20, color: '#666'}}>Không tìm thấy thiết bị</Text> : null}
                />
                 <TouchableOpacity style={styles.mainButton} onPress={handleScanBle}>
                    <Text style={styles.mainButtonText}>Quét lại</Text>
                </TouchableOpacity>
            </>
        )}

        {/* Step 2 & 3: Loading States */}
        {(currentStep === Step.CONNECTING_BLE || currentStep === Step.SCAN_WIFI) && (
            <View style={styles.centerView}>
                <ActivityIndicator size="large" color="#2563EB" />
                <Text style={styles.statusText}>
                    {currentStep === Step.CONNECTING_BLE ? "Đang kết nối..." : "Đang lấy danh sách Wifi..."}
                </Text>
            </View>
        )}

        {/* Step 4: List Wifi */}
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

        {/* Step 5: Configuring */}
        {currentStep === Step.CONFIGURING && (
            <View style={styles.centerView}>
                <ActivityIndicator size="large" color="#10B981" />
                <Text style={styles.statusText}>Đang gửi cấu hình...</Text>
            </View>
        )}

         {/* Step 6: Success */}
         {currentStep === Step.SUCCESS && (
            <View style={styles.centerView}>
                <MaterialIcons name="check-circle" size={80} color="#10B981" />
                <Text style={[styles.statusText, {color: '#10B981', fontWeight: 'bold'}]}>Thành công!</Text>
            </View>
        )}
      </View>

      {/* Modal Input Password */}
      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Wifi: {selectedSsid}</Text>
            <Text style={styles.label}>Mật khẩu:</Text>
            <TextInput
              style={styles.input} placeholder="Nhập mật khẩu..." secureTextEntry={true}
              value={password} onChangeText={setPassword}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={[styles.modalBtn, styles.cancelBtn]} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelBtnText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalBtn, styles.confirmBtn]} onPress={handleSubmitWifi}>
                <Text style={styles.confirmBtnText}>Kết nối</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}