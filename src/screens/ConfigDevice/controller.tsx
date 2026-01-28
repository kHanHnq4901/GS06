import { useState, useEffect, useRef } from 'react';
import { Alert, EmitterSubscription, Platform, NativeEventEmitter, NativeModules } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BleProtocol } from '../../services/ble'; // Đảm bảo đường dẫn đúng
import BleManager from 'react-native-ble-manager';
import { sleep } from '../../utils';

export enum Step {
  SCAN_BLE = 1,      
  CONNECTING_BLE = 2,
  SCAN_WIFI = 3,     
  SELECT_WIFI = 4,   
  CONFIGURING = 5,   
  SUCCESS = 6        
}

// Khai báo các biến quản lý listener theo ý bạn
let hhuDiscoverPeripheral: EmitterSubscription | null = null;
let hhuDisconnectListener: EmitterSubscription | null = null;
let hhuReceiveDataListener: EmitterSubscription | null = null;
let hhuStopScanListener: EmitterSubscription | null = null;
let hhuScanListener: EmitterSubscription | null = null;

const bleManagerEmitter = new NativeEventEmitter(NativeModules.BleManager);

export const useConfigDeviceController = () => {
  const navigation = useNavigation();

  // --- STATE ---
  const [currentStep, setCurrentStep] = useState<Step>(Step.SCAN_BLE);
  const [isScanningBle, setIsScanningBle] = useState(false);
  const [bleDevices, setBleDevices] = useState<any[]>([]);
  const [wifiList, setWifiList] = useState<any[]>([]);
  
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSsid, setSelectedSsid] = useState('');
  const [password, setPassword] = useState('');

  // Ref lưu giữ ID thiết bị đang kết nối để dọn dẹp
  const connectedIdRef = useRef<string | null>(null);
  const [status, setStatus] = useState<string>('');
  const [connectionStatus, setConnectionStatus] = useState<'DISCONNECTED' | 'CONNECTING' | 'CONNECTED'>('DISCONNECTED');
  const [deviceName, setDeviceName] = useState<string>('');

  // --- LIFECYCLE & LISTENERS ---
  useEffect(() => {
    const initBle = async () => {
        await BleProtocol.init();
        await startScanProcess();
    };
    initBle();

    // 1. Gán sự kiện cho các biến hhu...
    hhuDiscoverPeripheral = BleProtocol.addScanListener((peripheral) => {
        // Chỉ lấy thiết bị có tên (thường là gateway của bạn)
        if (!peripheral.name || peripheral.name === 'N/A') return;

        setBleDevices(prev => {
            if (prev.find(p => p.id === peripheral.id)) return prev;
            return [...prev, peripheral];
        });
    });

    hhuStopScanListener = BleProtocol.addStopScanListener(() => {
        setIsScanningBle(false);
        console.log("BLE Scan Stopped");
    });

    hhuReceiveDataListener = BleProtocol.addDataListener((res) => {
        processDeviceResponse(res);
    });

    hhuDisconnectListener = BleProtocol.addDisconnectListener((res) => {
        console.log("Device disconnected:", res.peripheral);
        if (currentStep !== Step.SUCCESS) {
            Alert.alert("Mất kết nối", "Thiết bị đã ngắt kết nối đột ngột.");
            setCurrentStep(Step.SCAN_BLE);
        }
        // Update connection status
        setConnectionStatus('DISCONNECTED');
        setDeviceName('');
    });

    // 2. CLEANUP: Hủy toàn bộ khi thoát màn hình
    return () => {
        hhuDiscoverPeripheral?.remove();
        hhuStopScanListener?.remove();
        hhuReceiveDataListener?.remove();
        hhuDisconnectListener?.remove();
        hhuScanListener?.remove();

        // Đặt lại giá trị null
        hhuDiscoverPeripheral = null;
        hhuStopScanListener = null;
        hhuReceiveDataListener = null;
        hhuDisconnectListener = null;
        hhuScanListener = null;

        if (connectedIdRef.current) {
            BleProtocol.disconnect(connectedIdRef.current);
        }
        BleProtocol.stopScan();
    };
  }, []);

  // --- LOGIC FUNCTIONS ---

  // Button Handler: Connect to BLE device
  const connectHandle = async (id: string, name: string) => {
    try {
      // Ngắt kết nối cũ nếu khác id
      if (connectionStatus === 'CONNECTED' && connectedIdRef.current !== id) {
        await BleManager.disconnect(connectedIdRef.current || '', true);
        await BleManager.removePeripheral(connectedIdRef.current || '').catch(() => {});
      }

      if (name) {
        setStatus('Đang kết nối tới ' + name + ' ...');
        setDeviceName(name);
      }

      setConnectionStatus('CONNECTING');

      try {
        await BleManager.connect(id);
      } catch (err: any) {
        setConnectionStatus('DISCONNECTED');
        setStatus('Kết nối thất bại: ' + err.message);
        return;
      }

      // Nếu kết nối thành công
      setStatus('Kết nối thành công');
      await BleProtocol.connectAndPrepare(id);

      setConnectionStatus('CONNECTED');
      connectedIdRef.current = id;

      // Xóa thiết bị vừa kết nối khỏi list scan
      setBleDevices(prev => prev.filter(item => item.id !== id));

    } catch (err: any) {
      console.log('Connect error:', err);
      setStatus('Kết nối thất bại: ' + err.message);
    }
  };

  // Button Handler: Start BLE scan
  const onScanPress = async () => {
    if (isScanningBle) return;

    setStatus('');

    try {
      await BleProtocol.requestPermissions();
      await BleManager.enableBluetooth();

      if (Platform.OS === 'android') {
        await BleManager.start({ showAlert: false });
        console.log("BLE Module initialized");
      }

      // Xóa list device trước khi scan
      setBleDevices([]);

      // Listener phát hiện thiết bị
      hhuScanListener = bleManagerEmitter.addListener(
        "BleManagerDiscoverPeripheral",
        (peripheral) => {
          const advName = peripheral?.advertising?.localName;
          const deviceName = advName || peripheral.name || "Unknown";

          console.log("Found device:", { id: peripheral.id, name: deviceName });

          setBleDevices(prev => {
            const exists = prev.some(d => d.id === peripheral.id);
            if (!exists) {
              return [...prev, {
                id: peripheral.id, name: deviceName,
                rssi: peripheral.rssi || 0
              }];
            }
            return prev;
          });
        }
      );

      // Bắt đầu quét
      await sleep(500); // delay để tránh lấy tên cũ
      await BleManager.scan({ serviceUUIDs: [], seconds: 5 }).then(() => {
        // Success code
        console.log("Scan started");
      });
      console.log("Scan started");
      setIsScanningBle(true);

      // Auto-stop scan after 5 seconds
      setTimeout(async () => {
        try {
          await BleManager.stopScan();
          console.log("Scan stopped");
          setIsScanningBle(false);
          hhuScanListener?.remove();
        } catch (stopError) {
          console.error("Error stopping scan:", stopError);
        }
      }, 5000);

    } catch (err: any) {
      console.log('Scan error:', err);
      Alert.alert("Thiết bị cần được bật Bluetooth");
    }
  };

  // Button Handler: Disconnect from BLE device
  const disConnect = async (id: string) => {
    try {
      console.log('Disconnecting peripheral:', id);
      await BleManager.disconnect(id, true);

      // Xóa cache sau khi disconnect
      await BleManager.removePeripheral(id).catch(() => {});
      if (Platform.OS === 'android') {
        await BleManager.removeBond(id).catch(() => {});
      }

      setDeviceName('');
      setConnectionStatus('DISCONNECTED');
      connectedIdRef.current = null;

    } catch (err) {
      console.log("Disconnect error:", err);
    }
  };

  const startScanProcess = async () => {
    try {
      setBleDevices([]);
      setIsScanningBle(true);
      setCurrentStep(Step.SCAN_BLE);

      // Request permissions first
      await BleProtocol.requestPermissions();

      // Start scanning with error handling
      await BleProtocol.scanDevices();

      // Auto-stop scan after 12 seconds (2 seconds buffer after the 10-second scan)
      setTimeout(async () => {
        try {
          await BleProtocol.stopScan();
        } catch (stopError) {
          console.error("Error stopping scan:", stopError);
        } finally {
          setIsScanningBle(false);

          // If no devices found after scan, show helpful message
          if (bleDevices.length === 0) {
            Alert.alert(
              "Không tìm thấy thiết bị",
              "Hãy đảm bảo thiết bị Gateway đã được bật và ở gần điện thoại của bạn. Vui lòng thử lại."
            );
          }
        }
      }, 12000);

    } catch (err: any) {
      console.error("Scan error", err);
      setIsScanningBle(false);

      // Provide specific error messages to help users
      let errorMessage = "Không thể bắt đầu quét BLE";
      if (err && err.message && err.message.includes('permission')) {
        errorMessage = "Ứng dụng cần quyền truy cập vị trí và Bluetooth để quét thiết bị. Vui lòng cấp quyền trong cài đặt.";
      } else if (err && err.message && err.message.includes('Bluetooth')) {
        errorMessage = "Vui lòng bật Bluetooth trên thiết bị của bạn.";
      }

      Alert.alert("Lỗi quét", errorMessage);
    }
  };

  const connectToDevice = async (peripheralId: string) => {
    await BleProtocol.stopScan();
    setIsScanningBle(false);
    setCurrentStep(Step.CONNECTING_BLE);
    
    try {
        await BleProtocol.connectAndPrepare(peripheralId);
        connectedIdRef.current = peripheralId;
        
        // Sau khi kết nối thành công, yêu cầu thiết bị quét WiFi xung quanh nó
        setCurrentStep(Step.SCAN_WIFI);
        setTimeout(async () => {
            await BleProtocol.requestWifiScan(peripheralId);
        }, 1000); // Đợi 1s để MTU và Service ổn định

    } catch (error) {
        console.error("Connect error:", error);
        Alert.alert("Lỗi", "Không thể kết nối với thiết bị này.");
        setCurrentStep(Step.SCAN_BLE);
    }
  };

  const processDeviceResponse = (res: any) => {
      console.log("[Controller] Response nhận được:", res);
      
      switch (res.type) {
          case 'scan_resp': 
              if (res.data && res.data.aps) {
                  // Sắp xếp wifi theo tín hiệu mạnh nhất (RSSI)
                  const sortedWifi = res.data.aps.sort((a: any, b: any) => b.rssi - a.rssi);
                  setWifiList(sortedWifi);
                  setCurrentStep(Step.SELECT_WIFI);
              }
              break;

          case 'wifi_result': 
              if (res.data && res.data.result === 'success') {
                  setCurrentStep(Step.SUCCESS);
                  Alert.alert("Thành công", "Thiết bị đã được cấu hình WiFi!", [
                      { text: "Hoàn tất", onPress: () => navigation.goBack() }
                  ]);
              } else {
                  const reason = res.data?.reason || "Sai mật khẩu hoặc WiFi lỗi";
                  Alert.alert("Thất bại", `Cấu hình không thành công: ${reason}`);
                  setCurrentStep(Step.SELECT_WIFI);
              }
              break;
      }
  };

  const onWifiSelect = (ssid: string) => {
      setSelectedSsid(ssid);
      setPassword(''); // Reset pass mỗi lần chọn wifi mới
      setModalVisible(true);
  };

  const onSubmitConfig = async () => {
      if (!connectedIdRef.current) return;
      
      if (password.length < 8) {
          Alert.alert("Thông báo", "Mật khẩu WiFi phải từ 8 ký tự trở lên.");
          return;
      }

      setModalVisible(false);
      setCurrentStep(Step.CONFIGURING);
      
      try {
          await BleProtocol.sendWifiConfig(connectedIdRef.current, selectedSsid, password);
      } catch (e) {
          Alert.alert("Lỗi", "Không thể gửi dữ liệu cấu hình.");
          setCurrentStep(Step.SELECT_WIFI);
      }
  };

  return {
    currentStep,
    isScanningBle,
    bleDevices,
    wifiList,
    modalVisible,
    selectedSsid,
    password,
    status,
    connectionStatus,
    deviceName,
    setModalVisible,
    setPassword,
    startScanProcess,
    connectToDevice,
    onWifiSelect,
    onSubmitConfig,
    connectHandle,
    onScanPress,
    disConnect
  };
};