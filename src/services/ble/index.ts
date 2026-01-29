import { Platform, PermissionsAndroid, EventSubscription } from 'react-native';
import BleManager from 'react-native-ble-manager';
import { Buffer } from 'buffer';

// Cấu hình UUID theo tài liệu và yêu cầu mới [cite: 21, 24]
const SERVICE_UUID = 'a500';
const CHAR_NOTIFY  = 'a501'; // Status - DEVICE → Mobile (Phản hồi trạng thái) [cite: 26]
const CHAR_WRITE   = 'a503'; // Control/Data - Mobile → DEVICE (Gửi lệnh/dữ liệu) [cite: 26]

export class BleProtocol {
  private static sequenceId: number = 1;

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
      if (Platform.Version >= 31) {
        const result = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        ]);
        return result['android.permission.BLUETOOTH_SCAN'] === 'granted' &&
               result['android.permission.BLUETOOTH_CONNECT'] === 'granted';
      }
      const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  }

  static async scanDevices(): Promise<void> {
    // Quét các thiết bị có Service UUID là A500 theo tài liệu [cite: 21]
    await BleManager.scan([SERVICE_UUID], 10, false, { scanMode: 2 });
  }

  static async stopScan(): Promise<void> {
    return BleManager.stopScan();
  }

  static async connectAndPrepare(peripheralId: string): Promise<void> {
    try {
      await BleManager.connect(peripheralId);
      await BleManager.retrieveServices(peripheralId);

      if (Platform.OS === 'android') {
        await BleManager.requestMTU(peripheralId, 512);
      }

      // Bắt đầu lắng nghe Notify từ characteristic Status (A503) [cite: 26, 27]
      await BleManager.startNotification(peripheralId, SERVICE_UUID, CHAR_NOTIFY);
      
      console.log('[BLE] Device connected and notification started');
    } catch (error) {
      console.error("[BLE] Connection Error:", error);
      throw error;
    }
  }

  static async disconnect(peripheralId: string): Promise<void> {
    try {
      await BleManager.disconnect(peripheralId);
      this.sequenceId = 1; // Reset sequence khi ngắt kết nối
    } catch (e) {
      console.error('[BLE] Disconnect error', e);
    }
  }

  /**
   * Gửi lệnh quét WiFi (Luồng 6.2) [cite: 40, 41, 42]
   */
  static async requestWifiScan(peripheralId: string): Promise<void> {
    this.sequenceId++;
    const payload = {
      type: "scan",
      seq: this.sequenceId
    };
    return this.sendData(peripheralId, payload);
  }

  /**
   * Gửi cấu hình WiFi (Luồng 6.3) [cite: 53, 54, 55, 56, 57, 58]
   */
  static async sendWifiConfig(peripheralId: string, ssid: string, password: string): Promise<void> {
    this.sequenceId++;
    const payload = {
      type: "wifi_cfg",
      seq: this.sequenceId,
      data: { ssid, password }
    };
    return this.sendData(peripheralId, payload);
  }

  /**
   * Hàm helper gửi dữ liệu qua characteristic Write (A501) [cite: 26]
   */
  private static async sendData(peripheralId: string, payload: object): Promise<void> {
    const dataString = JSON.stringify(payload) + 0x04;
    const data = Buffer.from(dataString).toJSON().data;
    
    console.log(`[BLE] Sending to ${CHAR_WRITE}:`, dataString);
    return BleManager.write(peripheralId, SERVICE_UUID, CHAR_WRITE, data);
  }

  // --- Listeners ---

  static addScanListener(callback: (peripheral: any) => void): EventSubscription {
    return BleManager.onDiscoverPeripheral(callback);
  }

  static addStopScanListener(callback: () => void): EventSubscription {
    return BleManager.onStopScan(callback);
  }

  /**
   * Lắng nghe phản hồi từ characteristic Status (A503) [cite: 26]
   */
  static addDataListener(callback: (res: any) => void): EventSubscription {
    let acc = "";

    const MAX_ACC_LEN = 32 * 1024; 

    return BleManager.onDidUpdateValueForCharacteristic((data) => {
      const ch = String(data.characteristic || "").toLowerCase();
      const svc = String(data.service || "").toLowerCase();
      const raw = Buffer.from(data.value || []).toString("utf-8");

      console.log("[BLE] NOTIFY:", { svc, ch, raw });


      if (!data?.characteristic) return;

      if (!String(data.characteristic).toLowerCase().includes(String(CHAR_NOTIFY).toLowerCase())) {
        return;
      }
      const bytes: number[] = data.value || [];
      if (!bytes.length) return;

      const chunkStr = Buffer.from(bytes).toString("utf-8");

      acc += chunkStr;

      if (acc.length > MAX_ACC_LEN) {
        console.warn("[BLE] Accumulator overflow, resetting buffer");
        acc = "";
        return;
      }

      const parts = acc.split("\x04");

      acc = parts.pop() ?? "";

      for (const frame of parts) {
        const trimmed = frame.trim();
        if (!trimmed) continue;

        try {
          const jsonObj = JSON.parse(trimmed);
          console.log("[BLE] Received JSON (framed):", jsonObj);
          callback(jsonObj);
        } catch (e) {
          // Nếu vẫn lỗi thì log raw để debug
          console.warn("[BLE] Frame is not valid JSON:", trimmed);
          callback({ type: "raw", data: trimmed });
        }
      }
    });
  }

  static addDisconnectListener(callback: (data: any) => void): EventSubscription {
    return BleManager.onDisconnectPeripheral(callback);
  }
}