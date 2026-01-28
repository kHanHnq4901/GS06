import { Platform, PermissionsAndroid, EventSubscription } from 'react-native';
import BleManager, { ScanOptions } from 'react-native-ble-manager';
import { Buffer } from 'buffer';

// Cấu hình UUID (Đảm bảo khớp với Firmware thiết bị)
const SERVICE_UUID = 'a500';
const CHAR_CONTROL = 'a501'; // Gửi lệnh
const CHAR_DATA    = 'a502'; // Gửi dữ liệu Wifi
const CHAR_STATUS  = 'a503'; // Nhận phản hồi (Notify)

export class BleProtocol {

  /**
   * Khởi tạo module BleManager
   */
  static async init(): Promise<void> {
    try {
      await BleManager.start({ showAlert: false });
      console.log('[BLE] Manager initialized');
    } catch (error) {
      console.error('[BLE] Init failed:', error);
    }
  }
  static async requestPermissions(): Promise<boolean> {
    if (Platform.OS === 'android') {
      try {
        if (Platform.Version >= 31) {
          const result = await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
          ]);
          return result['android.permission.BLUETOOTH_SCAN'] === 'granted' &&
                 result['android.permission.BLUETOOTH_CONNECT'] === 'granted';
        } else {
          const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
          return granted === PermissionsAndroid.RESULTS.GRANTED;
        }
      } catch (err) {
        return false;
      }
    }
    return true;
  }

  static async scanDevices(): Promise<void> {
    console.log('[BLE] Starting Scan...');
    
    const options: ScanOptions = {
      seconds: 10,
      serviceUUIDs: [], // Tìm tất cả thiết bị
      allowDuplicates: false,
      scanMode: 2, // Low Latency (Quét nhanh nhất)
    };

    try {
      await BleManager.scan(options);
      console.log("[BLE] Scan command sent");
    } catch (error) {
      console.error('[BLE] Scan failed:', error);
      throw error;
    }
  }

  static async stopScan(): Promise<void> {
    return BleManager.stopScan();
  }

  // static async connectAndPrepare(peripheralId: string): Promise<void> {
  //   console.log(`[BLE] Connecting to ${peripheralId}...`);
  //   await BleManager.connect(peripheralId);
  //   await BleManager.retrieveServices(peripheralId);
    
  //   if (Platform.OS === 'android') {
  //     await BleManager.requestMTU(peripheralId, 512);
  //   }
    
  //   await BleManager.startNotification(peripheralId, SERVICE_UUID, CHAR_STATUS);
  //   console.log('[BLE] Device ready');
  // }
  static async connectAndPrepare(peripheralId: string): Promise<void> {
  try {
    console.log(`[BLE] Connecting to ${peripheralId}...`);

    await BleManager.connect(peripheralId);

    const res = await BleManager.retrieveServices(peripheralId);

    if (Platform.OS === 'android') {
      await BleManager.requestMTU(peripheralId, 512);
    }

    const element = res.characteristics?.find(char => {
      return (
        char.characteristic &&
        char.service &&
        // Kiểm tra properties (tùy phiên bản thư viện mà nó là mảng hoặc object)
        (Array.isArray(char.properties) 
          ? char.properties.includes('Notify') && char.properties.includes('Write')
          : char.properties?.Notify && char.properties?.Write)
      );
    });

    if (element) {
      console.log('[BLE] Found matching characteristic:', element.characteristic);
      
      await BleManager.startNotification(
        peripheralId,
        element.service,
        element.characteristic
      );
      
      console.log("Notification started successfully");
    } else {
      console.warn('[BLE] No characteristic found with both Write and Notify properties');
    }

    console.log('[BLE] Device fully ready');
  } catch (error) {
    console.error("[BLE] connectAndPrepare Error:", error);
    throw error;
  }
}

  static async disconnect(peripheralId: string): Promise<void> {
    try {
      await BleManager.disconnect(peripheralId);
      console.log('[BLE] Disconnected');
    } catch (e) {
      console.error('[BLE] Disconnect error', e);
    }
  }

  static async requestWifiScan(peripheralId: string): Promise<void> {
    const command = JSON.stringify({ cmd: 'scan_wifi' });
    const data = Buffer.from(command).toJSON().data;
    return BleManager.write(peripheralId, SERVICE_UUID, CHAR_CONTROL, data);
  }

  static async sendWifiConfig(peripheralId: string, ssid: string, pass: string): Promise<void> {
    const config = JSON.stringify({ cmd: 'config_wifi', ssid, pass });
    const data = Buffer.from(config).toJSON().data;
    return BleManager.write(peripheralId, SERVICE_UUID, CHAR_DATA, data);
  }


  static addScanListener(callback: (peripheral: any) => void): EventSubscription {
    return BleManager.onDiscoverPeripheral((data) => {
      callback(data);
    });
  }

  static addStopScanListener(callback: () => void): EventSubscription {
    return BleManager.onStopScan(() => {
      callback();
    });
  }

  static addDataListener(callback: (data: any) => void): EventSubscription {
    return BleManager.onDidUpdateValueForCharacteristic((data) => {
      if (data.characteristic.toLowerCase().includes(CHAR_STATUS)) {
        const dataString = Buffer.from(data.value).toString('utf-8');
        try {
          callback(JSON.parse(dataString));
        } catch (e) {
          callback({ type: 'raw', data: dataString });
        }
      }
    });
  }

  static addDisconnectListener(callback: (data: any) => void): EventSubscription {
    return BleManager.onDisconnectPeripheral((data) => {
      callback(data);
    });
  }
}