import { Alert, Platform } from 'react-native';
import BleManager from 'react-native-ble-manager';
import { BleProtocol } from '../../services/ble';
import { sleep } from '../../utils';

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

  const connectHandle = async (id: string, name: string) => {
    try {
      if (connectionStatus === 'CONNECTED' && connectedIdRef.current !== id) {
        await BleManager.disconnect(connectedIdRef.current || '', true);
      }

      setDeviceName(name);
      setConnectionStatus('CONNECTING');

      await BleManager.connect(id);
      await BleProtocol.connectAndPrepare(id);

      setConnectionStatus('CONNECTED');
      connectedIdRef.current = id;
      
      // Chuyển sang màn hình cấu hình WiFi
    navigation.navigate('WifiConfigScreen', {
          peripheralId: id,
          deviceName: name  
      });
    } catch (err: any) {
      setConnectionStatus('DISCONNECTED');
      Alert.alert("Lỗi kết nối", err.message || "Không thể kết nối");
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