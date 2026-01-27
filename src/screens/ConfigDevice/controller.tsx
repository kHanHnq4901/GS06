import { useState, useEffect, useRef } from 'react';
import { Alert, EmitterSubscription, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BleProtocol } from '../../gateway/ble'; // Đảm bảo đường dẫn đúng

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
    });

    // 2. CLEANUP: Hủy toàn bộ khi thoát màn hình
    return () => {
        hhuDiscoverPeripheral?.remove();
        hhuStopScanListener?.remove();
        hhuReceiveDataListener?.remove();
        hhuDisconnectListener?.remove();
        
        // Đặt lại giá trị null
        hhuDiscoverPeripheral = null;
        hhuStopScanListener = null;
        hhuReceiveDataListener = null;
        hhuDisconnectListener = null;

        if (connectedIdRef.current) {
            BleProtocol.disconnect(connectedIdRef.current);
        }
        BleProtocol.stopScan();
    };
  }, []);

  // --- LOGIC FUNCTIONS ---

  const startScanProcess = async () => {
    await BleProtocol.requestPermissions();
    setBleDevices([]);
    setIsScanningBle(true);
    setCurrentStep(Step.SCAN_BLE);
    
    try {
        await BleProtocol.scanDevices();
        // Tự động dừng scan sau 5 giây nếu không có StopScanListener gọi
        setTimeout(async () => {
            await BleProtocol.stopScan();
            setIsScanningBle(false);
        }, 5000);
    } catch (err) {
        console.error("Scan error", err);
        setIsScanningBle(false);
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
    setModalVisible,
    setPassword,
    startScanProcess,
    connectToDevice,
    onWifiSelect,
    onSubmitConfig
  };
};