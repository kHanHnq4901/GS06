import { Platform } from 'react-native';
import {
  check,
  request,
  PERMISSIONS,
  RESULTS,
  openSettings,
  Permission,
} from 'react-native-permissions';
import {
  getMessaging,
  requestPermission as requestFirebasePermission,
  AuthorizationStatus,
} from '@react-native-firebase/messaging';

const TAG = '[PermissionHelper]';

/**
 * Hàm Helper chung để kiểm tra và xin quyền
 */
const checkAndRequest = async (permission: Permission, name: string): Promise<boolean> => {
  try {
    let result = await check(permission);

    switch (result) {
      case RESULTS.UNAVAILABLE:
        console.warn(TAG, name, 'UNAVAILABLE (Device does not support this)');
        return false;
      case RESULTS.BLOCKED:
        console.warn(TAG, name, 'BLOCKED - Please open settings manually');
        // Tùy chọn: Có thể gọi openSettings() ở đây nếu muốn force user
        return false;
      case RESULTS.GRANTED:
        console.log(TAG, name, 'GRANTED (Already)');
        return true;
      case RESULTS.LIMITED:
        console.log(TAG, name, 'LIMITED');
        return true;
      case RESULTS.DENIED:
        console.log(TAG, name, 'DENIED -> Requesting...');
        const requestResult = await request(permission);
        const isGranted = requestResult === RESULTS.GRANTED || requestResult === RESULTS.LIMITED;
        console.log(TAG, name, isGranted ? 'GRANTED (After request)' : 'DENIED (After request)');
        return isGranted;
    }
    return false;
  } catch (error: any) {
    console.error(TAG, name, 'ERROR:', error.message);
    return false;
  }
};

/**
 * 1. QUYỀN VỊ TRÍ (GPS)
 * - Android: ACCESS_FINE_LOCATION
 * - iOS: LOCATION_WHEN_IN_USE
 */
export const requestLocationPermission = async (): Promise<boolean> => {
  if (Platform.OS === 'ios') {
    return checkAndRequest(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE, 'iOS Location');
  } else {
    return checkAndRequest(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION, 'Android Location');
  }
};

/**
 * 2. QUYỀN CAMERA
 */
export const requestCameraPermission = async (): Promise<boolean> => {
  if (Platform.OS === 'ios') {
    return checkAndRequest(PERMISSIONS.IOS.CAMERA, 'iOS Camera');
  } else {
    return checkAndRequest(PERMISSIONS.ANDROID.CAMERA, 'Android Camera');
  }
};

/**
 * 3. QUYỀN BLUETOOTH (SCAN & CONNECT)
 * - iOS: PERMISSIONS.IOS.BLUETOOTH
 * - Android < 31 (Android 11 trở xuống): Cần quyền Location (ACCESS_FINE_LOCATION)
 * - Android >= 31 (Android 12 trở lên): Cần BLUETOOTH_SCAN và BLUETOOTH_CONNECT
 */
export const requestBluetoothPermission = async (): Promise<boolean> => {
  if (Platform.OS === 'ios') {
    // iOS thường chỉ cần khai báo trong Info.plist, nhưng một số library cần request này
    return checkAndRequest(PERMISSIONS.IOS.BLUETOOTH, 'iOS Bluetooth');
  }

  // Xử lý Android
  const platformVersion = Number(Platform.Version);

  if (platformVersion >= 31) {
    // Android 12+ cần xin cả 2 quyền Scan và Connect
    const scanResult = await checkAndRequest(PERMISSIONS.ANDROID.BLUETOOTH_SCAN, 'Android BT Scan');
    const connectResult = await checkAndRequest(PERMISSIONS.ANDROID.BLUETOOTH_CONNECT, 'Android BT Connect');
    
    return scanResult && connectResult;
  } else {
    // Android 11 trở xuống dùng Location để quét BLE
    return checkAndRequest(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION, 'Android BT (Location Based)');
  }
};

/**
 * 4. QUYỀN BỘ NHỚ (STORAGE)
 * - iOS: Thường không cần quyền này cho file nội bộ. 
 * - Android: WRITE_EXTERNAL_STORAGE (Lưu ý: Android 13+ cơ chế này đã thay đổi, nhưng code dưới hỗ trợ logic cũ)
 */
export const requestStoragePermission = async (): Promise<boolean> => {
  if (Platform.OS === 'ios') {
    return true; // iOS không cần quyền Write External Storage như Android
  }

  // Với Android 13 (SDK 33), quyền WRITE_EXTERNAL_STORAGE không còn tác dụng với Media.
  // Nếu bạn cần lưu ảnh/video ở Android 13, hãy dùng READ_MEDIA_IMAGES / VIDEO.
  // Ở đây giữ logic cơ bản cho SDK thấp hơn hoặc file chung.
  const platformVersion = Number(Platform.Version);
  if (platformVersion >= 33) {
      // Android 13+ không cần xin quyền Write nếu chỉ lưu file vào thư mục app
      // Nếu cần truy cập ảnh, phải xin quyền PERMISSIONS.ANDROID.READ_MEDIA_IMAGES
      return true; 
  }

  return checkAndRequest(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE, 'Android Storage');
};

/**
 * 5. QUYỀN THÔNG BÁO (NOTIFICATION - FIREBASE)
 * - Android 13+ (SDK 33): Cần xin quyền POST_NOTIFICATIONS
 * - iOS & Android cũ: Dùng Firebase messaging requestPermission
 */
export const requestNotificationPermission = async (): Promise<boolean> => {
  // BƯỚC 1: Xử lý quyền hệ thống cho Android 13+
  if (Platform.OS === 'android' && Number(Platform.Version) >= 33) {
    // Sử dụng cách kiểm tra an toàn nếu thư viện chưa cập nhật type
    const permissionStr = (PERMISSIONS.ANDROID as any).POST_NOTIFICATIONS 
                          || 'android.permission.POST_NOTIFICATIONS';

    const granted = await checkAndRequest(
      permissionStr as Permission,
      'Thông báo'
    );
    if (!granted) return false;
  }

  // BƯỚC 2: Đăng ký với Firebase
  try {
    const messaging = getMessaging();
    const authStatus = await messaging.requestPermission(); // Sử dụng hàm chuẩn của RNFirebase
    
    const enabled =
      authStatus === 1 || // AUTHORIZED
      authStatus === 2;   // PROVISIONAL

    console.log('Firebase Messaging Status:', authStatus);
    return enabled;
  } catch (error: any) {
    console.error('Firebase Permission Error:', error.message);
    return false;
  }
};

/**
 * Hàm tiện ích: Xin tất cả quyền cần thiết khi khởi động App
 */
export const requestInitialPermissions = async () => {
    console.log(TAG, '--- START REQUESTING ALL PERMISSIONS ---');
    await requestLocationPermission();
    await requestBluetoothPermission();
    await requestNotificationPermission();
    // await requestStoragePermission(); // Bật nếu cần
    // await requestCameraPermission(); // Bật nếu cần
    console.log(TAG, '--- END REQUESTING ALL PERMISSIONS ---');
}