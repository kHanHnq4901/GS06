import { NativeModules, NativeEventEmitter, Platform, PermissionsAndroid, EmitterSubscription } from 'react-native';
import BleManager from 'react-native-ble-manager';
import { Buffer } from 'buffer';

const BleManagerModule = NativeModules.BleManager;

/**
 * FIX: Polyfill cho NativeModules.BleManager
 * Đoạn này PHẢI chạy trước khi khởi tạo NativeEventEmitter
 */
if (BleManagerModule) {
  const propertyNames = ['addListener', 'removeListeners'];
  propertyNames.forEach((method) => {
    if (typeof BleManagerModule[method] !== 'function') {
      BleManagerModule[method] = () => {
        // Hàm trống để đánh lừa NativeEventEmitter
      };
    }
  });
}

// Khởi tạo Emitter sau khi đã Polyfill
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

const SERVICE_UUID = 'a500'; 
const CHAR_CONTROL = 'a501'; 
const CHAR_DATA    = 'a502'; 
const CHAR_STATUS  = 'a503'; 

export class BleProtocol {
  
  static async init() {
    try {
        await BleManager.start({ showAlert: false });
        console.log('[BLE] Manager initialized successfully');
    } catch (error) {
        console.error('[BLE] Init failed:', error);
    }
  }

  static async requestPermissions() {
    if (Platform.OS === 'android') {
        if (Platform.Version >= 31) {
            await PermissionsAndroid.requestMultiple([
                PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
                PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
            ]);
        } else {
            await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
        }
        console.log('[BLE] Permissions granted');
    }
  }

  static async scanDevices() {
    console.log('[BLE] Triggering Scan...');
    // Sửa lỗi tham số: scan(serviceUUIDs, seconds, allowDuplicates)
    return BleManager.scan({ serviceUUIDs: [], seconds: 5 }).then(() => {
      // Success code
      console.log("Scan started");
    });
  }

  static async stopScan() {
    return BleManager.stopScan().then(() => console.log("[BLE] Scan stopped"));
  }

  static async connectAndPrepare(peripheralId: string): Promise<void> {
    console.log(`[BLE] Attempting connection to: ${peripheralId}`);
    await BleManager.connect(peripheralId);
    await BleManager.retrieveServices(peripheralId);
    
    if (Platform.OS === 'android') {
        await BleManager.requestMTU(peripheralId, 512);
    }
    
    await BleManager.startNotification(peripheralId, SERVICE_UUID, CHAR_STATUS);
    console.log(`[BLE] Ready to receive data on ${CHAR_STATUS}`);
  }

  // --- LISTENERS VỚI LOG XÁC NHẬN ---

  static addScanListener(callback: (peripheral: any) => void): EmitterSubscription {
      console.log("[EVENT] Subscribing to: BleManagerDiscoverPeripheral");
      return bleManagerEmitter.addListener('BleManagerDiscoverPeripheral', (data) => {
          console.log(`[EVENT] Device Spotted: ${data.name || 'N/A'} [${data.id}]`);
          callback(data);
      });
  }

  static addStopScanListener(callback: () => void): EmitterSubscription {
      console.log("[EVENT] Subscribing to: BleManagerStopScan");
      return bleManagerEmitter.addListener('BleManagerStopScan', () => {
          console.log("[EVENT] Scan process completed");
          callback();
      });
  }

  static addDataListener(callback: (data: any) => void): EmitterSubscription {
      console.log("[EVENT] Subscribing to: BleManagerDidUpdateValueForCharacteristic");
      return bleManagerEmitter.addListener(
          'BleManagerDidUpdateValueForCharacteristic',
          ({ value, characteristic }) => {
            if (characteristic.toLowerCase().includes(CHAR_STATUS)) {
                const dataString = Buffer.from(value).toString('utf-8');
                console.log(`[EVENT] Data incoming: ${dataString}`);
                try {
                    callback(JSON.parse(dataString));
                } catch (e) {
                    callback({ raw: dataString });
                }
            }
          }
      );
  }

  static addDisconnectListener(callback: (data: any) => void): EmitterSubscription {
      console.log("[EVENT] Subscribing to: BleManagerDisconnectPeripheral");
      return bleManagerEmitter.addListener('BleManagerDisconnectPeripheral', (data) => {
          console.log(`[EVENT] Connection lost: ${data.peripheral}`);
          callback(data);
      });
  }
}