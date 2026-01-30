import { Alert, Platform } from 'react-native';
import BleManager from 'react-native-ble-manager';
import { BleProtocol } from '../../services/ble';
import { sleep } from '../../utils';
import { declareGateway } from '../../services/api/common';

export const createButtonHandlers = (
  state: any,
  setters: any,
  navigation: any,
  connectedIdRef: React.MutableRefObject<string | null>
) => {
  const { isScanningBle, connectionStatus } = state;
  const { 
    setIsScanningBle, setBleDevices, setStatus, 
    setConnectionStatus, setDeviceName, setCurrentStep 
  } = setters;

  const onScanPress = async () => {
    if (isScanningBle) return;
    setStatus('');
    try {
      await BleProtocol.requestPermissions();
      await BleManager.enableBluetooth();
      if (Platform.OS === 'android') await BleManager.start({ showAlert: false });

      setBleDevices([]);
      setIsScanningBle(true);
      
      await sleep(500);
      await BleManager.scan({ serviceUUIDs: [], seconds: 5 });

      setTimeout(async () => {
        await BleManager.stopScan();
        setIsScanningBle(false);
      }, 5000);
    } catch (err) {
      Alert.alert("Lỗi", "Vui lòng bật Bluetooth và cấp quyền.");
    }
  };


const connectHandle = async (id: string, name: string, homeId: number) => {
  try {
    // 1. Ngắt kết nối thiết bị cũ nếu đang có kết nối khác
    if (connectionStatus === 'CONNECTED' && connectedIdRef.current !== id) {
      await BleManager.disconnect(connectedIdRef.current || '', true);
    }

    setDeviceName(name);
    setConnectionStatus('CONNECTING');

    // 2. Kết nối Bluetooth
    await BleManager.connect(id);
    await BleProtocol.connectAndPrepare(id);

    setConnectionStatus('CONNECTED');
    connectedIdRef.current = id;

    // 3. Xử lý tách chuỗi để lấy Gateway ID
    // GW-204134134134 -> 204134134134
    const gatewayIdString = name.includes('-') ? name.split('-')[1] : name;
    const gatewayId = parseFloat(gatewayIdString); 

    // 4. Sử dụng trực tiếp tham số homeId được truyền vào
    if (!isNaN(gatewayId) && homeId) {
       console.log(`🚀 Đang khai báo Gateway: ${gatewayId} vào HomeID: ${homeId}`);
       
       const res = await declareGateway(gatewayId, homeId);
       
       if (res.CODE === 1) {
         console.log("✅ Khai báo thành công:", res.MESSAGE_VI);
       } else {
         console.log("⚠️ Khai báo thất bại:", res.MESSAGE_VI);
         // Tùy chọn: Có thể Alert ở đây nếu việc khai báo là bắt buộc
       }
    } else {
      console.log("❌ Thiếu thông tin gatewayId hoặc homeId để khai báo");
    }

    // 5. Chuyển sang màn hình cấu hình WiFi, truyền kèm homeId để các bước sau sử dụng
    navigation.navigate('WifiConfigScreen', {
      peripheralId: id,
      deviceName: name,
      gatewayId: gatewayIdString,
      homeId: homeId // Tiếp tục truyền sang màn hình sau
    });

  } catch (err: any) {
    setConnectionStatus('DISCONNECTED');
    Alert.alert("Lỗi kết nối", err.message || "Không thể kết nối với thiết bị");
  }
};

  const disConnect = async (id: string) => {
    try {
      await BleManager.disconnect(id, true);
      setConnectionStatus('DISCONNECTED');
      connectedIdRef.current = null;
    } catch (err) {
      console.log("Disconnect error:", err);
    }
  };

  return { onScanPress, connectHandle, disConnect };
};