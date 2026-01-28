import { Alert } from 'react-native';
import { BleProtocol } from '../../services/ble';

export const createWifiHandlers = (
  peripheralId: string,
  setters: any,
  navigation: any
) => {
  const { setModalVisible, setSelectedSsid, setPassword, setIsConfiguring } = setters;

  const onWifiSelect = (ssid: string) => {
    setSelectedSsid(ssid); // Gán tên WiFi được chọn
    setPassword('');       // Reset mật khẩu cũ
    setModalVisible(true); // Lúc này mới mở Modal
  };

  const onSubmitConfig = async (ssid: string, pass: string) => {
    if (pass.length < 8) {
      Alert.alert("Lỗi", "Mật khẩu WiFi phải từ 8 ký tự.");
      return;
    }
    setModalVisible(false);
    setIsConfiguring(true);

    try {
      await BleProtocol.sendWifiConfig(peripheralId, ssid, pass);
    } catch (e) {
      Alert.alert("Lỗi", "Không thể gửi dữ liệu cấu hình.");
      setIsConfiguring(false);
    }
  };

  return { onWifiSelect, onSubmitConfig };
};