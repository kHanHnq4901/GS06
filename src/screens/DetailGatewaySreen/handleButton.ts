import { Alert } from 'react-native';
import { 
  renameSensor, 
  removeSensor, 
  clearLinkGatewayStatus 
} from '../../services/api/common';

export const handleButton = (
  gatewayId: string, 
  fetchData: () => void, 
  navigation: any
) => {
  
  const onRename = (sensor: any) => {
    Alert.prompt(
      "Đổi tên", 
      "Nhập tên mới cho thiết bị", 
      [
        { text: "Hủy" },
        { 
          text: "Lưu", 
          onPress: async (name) => {
            if (name?.trim()) {
              const res = await renameSensor(sensor.SENSOR_ID, name.trim());
              if (res.CODE === 1) fetchData();
              else Alert.alert("Thông báo", res.MESSAGE_VI);
            }
          } 
        }
      ], 
      "plain-text", 
      sensor.DEVICE_NAME
    );
  };

  const onRemove = (id: number) => {
    Alert.alert("Xác nhận", "Bạn có chắc chắn muốn xóa cảm biến này?", [
      { text: "Hủy", style: "cancel" },
      { 
        text: "Xóa", 
        style: 'destructive', 
        onPress: async () => {
          const res = await removeSensor(id);
          if (res.CODE === 1) fetchData();
          else Alert.alert("Lỗi", res.MESSAGE_VI);
        }
      }
    ]);
  };

  const onClearLink = (gwId: number) => {
    Alert.alert("Xóa lịch sử", "Xóa sạch lịch sử liên gia của Gateway này?", [
      { text: "Hủy", style: "cancel" },
      { 
        text: "Xóa sạch", 
        style: 'destructive', 
        onPress: async () => {
          const res = await clearLinkGatewayStatus(gwId);
          if (res.CODE === 1) fetchData();
          else Alert.alert("Lỗi", res.MESSAGE_VI);
        }
      }
    ]);
  };

  const onActionMenu = (action: string) => {
    if (action === 'ADD_DEVICE') {
      navigation.navigate('AddDevice', { serial: gatewayId });
    } else if (action === 'ADD_LINK') {
      navigation.navigate('QrCode', { serial: gatewayId });
    }
  };

  return {
    onRename,
    onRemove,
    onClearLink,
    onActionMenu
  };
};