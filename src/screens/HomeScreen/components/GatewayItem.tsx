import React, { useState } from 'react';
import { 
  View, 
  Image, 
  TouchableOpacity, 
  Text as RNText, 
  Alert, 
  Modal, 
  TextInput, 
  StyleSheet,
  ActivityIndicator 
} from 'react-native';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';
import Animated, { FadeInDown } from 'react-native-reanimated';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import moment from 'moment';

// Import Services & Styles
import { styles } from '../styles';
import { MqttProtocolService } from '../../../services/mqtt';
import { renameGateway, removeGatewayFromHome } from '../../../services/api/common';

interface GatewayItemProps {
  item: any;
  index: number;
  navigation: any;
  onHandlePress: (id: string) => void;
  onRefresh: () => void;
}

export const GatewayItem = React.memo(({ item, index, navigation, onHandlePress, onRefresh }: GatewayItemProps) => {
  const status = item.latestStatus;
  const isOnline = item.ONLINE === 1;

  // States
  const [isRenameModalVisible, setRenameModalVisible] = useState(false);
  const [newName, setNewName] = useState(item.GATEWAY_NAME);
  const [isUpdating, setIsUpdating] = useState(false);

  // --- LOGIC 1: ĐỔI TÊN ---
  const handleRenameSubmit = async () => {
    if (!newName.trim()) {
      Alert.alert("Thông báo", "Tên thiết bị không được để trống");
      return;
    }
    setIsUpdating(true);
    try {
      const res = await renameGateway(item.GATEWAY_ID, newName.trim());
      if (res.CODE === 1) {
        setRenameModalVisible(false);
        onRefresh();
      } else {
        Alert.alert("Lỗi", res.MESSAGE_VI);
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Lỗi", "Không thể kết nối máy chủ");
    } finally {
      setIsUpdating(false);
    }
  };

  // --- LOGIC 2: GỠ THIẾT BỊ (XÓA) ---
  const handleRemoveGateway = () => {
    Alert.alert(
      "Xác nhận gỡ",
      `Bạn có chắc chắn muốn gỡ Gateway "${item.GATEWAY_NAME}" khỏi khu vực này không?`,
      [
        { text: "Hủy", style: "cancel" },
        { 
          text: "Gỡ thiết bị", 
          style: "destructive", 
          // onPress: async () => {
          //   try {
          //     // Lưu ý: item.HOME_ID lấy từ dữ liệu Gateway trả về
          //     const res = await removeGatewayFromHome(item.GATEWAY_ID, item.HOME_ID);
          //     if (res.CODE === 1) {
          //       Alert.alert("Thành công", "Đã gỡ thiết bị khỏi nhà");
          //       onRefresh();
          //     } else {
          //       Alert.alert("Thất bại", res.MESSAGE_VI);
          //     }
          //   } catch (e) {
          //     Alert.alert("Lỗi", "Gỡ thiết bị thất bại");
          //   }
          // }
        }
      ]
    );
  };

  // --- UI: CÁC NÚT KHI VUỐT (SWIPE) ---
  const renderRightActions = () => (
    <View style={styles.swipeActionContainer}>
      <TouchableOpacity 
        style={[styles.swipeButton, { backgroundColor: '#3B82F6' }]} 
        onPress={() => {
            setNewName(item.GATEWAY_NAME);
            setRenameModalVisible(true);
        }}
      >
        <MaterialIcons name="edit" size={20} color="#fff" />
        <RNText style={styles.swipeButtonText}>Sửa tên</RNText>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.swipeButton, { backgroundColor: '#EF4444' }]} 
        onPress={handleRemoveGateway}
      >
        <MaterialIcons name="delete-forever" size={20} color="#fff" />
        <RNText style={styles.swipeButtonText}>Gỡ bỏ</RNText>
      </TouchableOpacity>
    </View>
  );

  return (
    <GestureHandlerRootView>
      <Swipeable renderRightActions={renderRightActions} friction={2}>
        <Animated.View entering={FadeInDown.delay(index * 100).springify()}>
          <TouchableOpacity 
            style={styles.cardGateway} 
            activeOpacity={0.8} 
            onPress={() => onHandlePress(item.GATEWAY_ID)}
          >
            {/* PHẦN TRÊN: Ảnh & Trạng thái */}
            <View style={styles.rowBetween}>
              <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                <Image source={require('../../../asset/images/device/gateway.webp')} style={styles.gwImage} resizeMode="contain" />
                <View style={{ marginLeft: 10 }}>
                  <RNText style={styles.gwName}>{item.GATEWAY_NAME}</RNText>
                  <RNText style={styles.gwSerial}>ID: {item.GATEWAY_ID} | Line: {item.LINE_ID}</RNText>
                </View>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity style={{ padding: 6 }} onPress={() => navigation.navigate('CreateQrGateway', item)}>
                  <MaterialIcons name="qr-code-scanner" size={22} color="#4B5563" />
                </TouchableOpacity>
                <TouchableOpacity style={{ padding: 6 }} onPress={() => MqttProtocolService.sirenOff(item.GATEWAY_ID)}>
                  <MaterialIcons 
                    name={item.isSirenActive ? "volume-up" : "volume-off"} 
                    size={24} 
                    color={item.isSirenActive ? "#DC2626" : "#4B5563"} 
                  />
                </TouchableOpacity>
                <TouchableOpacity style={{ padding: 6, marginRight: 4 }} onPress={() => navigation.navigate('HistoryGateway', { gatewayId: item.GATEWAY_ID })}>
                  <MaterialIcons name="history" size={22} color="#2563EB" />
                </TouchableOpacity>
                <View style={[styles.statusBadge, { backgroundColor: isOnline ? '#DCFCE7' : '#FEE2E2' }]}>
                  <RNText style={{ color: isOnline ? '#166534' : '#991B1B', fontSize: 10, fontWeight: 'bold' }}>
                    {isOnline ? 'ONLINE' : 'OFFLINE'}
                  </RNText>
                </View>
              </View>
            </View>

            <View style={styles.divider} />

            {/* PHẦN DƯỚI: Thông số Heartbeat */}
            <View style={{ marginTop: 10 }}>
              <View style={styles.rowBetween}>
                <View style={{ flex: 1 }}>
                  <View style={styles.paramRow}>
                    <MaterialIcons 
                      name={status?.POWER === 1 ? "battery-alert" : "power"} 
                      size={14} 
                      color={status?.POWER === 1 ? "#D97706" : "#059669"} 
                    />
                    <RNText style={[styles.paramText, { color: status?.POWER === 1 ? "#D97706" : "#059669", fontWeight: 'bold' }]}>
                      {status?.POWER === 1 ? "Pin dự phòng" : "Điện lưới"}
                    </RNText>
                  </View>
                  <View style={styles.paramRow}>
                    <MaterialIcons name="battery-std" size={14} color="#4B5563" />
                    <RNText style={styles.paramText}>Pin: {status?.BATTERY ?? '--'}%</RNText>
                  </View>
                  <View style={styles.paramRow}>
                    <MaterialIcons name="thermostat" size={14} color="#DC2626" />
                    <RNText style={styles.paramText}>Nhiệt: {status?.TEMERATURE ?? '--'}°C</RNText>
                  </View>
                </View>

                <View style={{ flex: 1, paddingLeft: 10 }}>
                  <View style={styles.paramRow}>
                    <MaterialIcons name="wifi" size={14} color="#2563EB" />
                    <RNText style={styles.paramText} numberOfLines={1}>
                      {status?.WIFI_SSID || 'N/A'} ({status?.WIFI_RSSI ?? '--'}dBm)
                    </RNText>
                  </View>
                  <View style={styles.paramRow}>
                    <MaterialIcons name="sensors" size={14} color="#6366F1" />
                    <RNText style={styles.paramText}>Node: {status?.LORA_NODES_ON ?? 0}/{status?.LORA_NODES_TOTAL ?? 0}</RNText>
                  </View>
                  <View style={styles.paramRow}>
                    <MaterialIcons name="hub" size={14} color="#8B5CF6" />
                    <RNText style={styles.paramText}>Link: {status?.LORA_LINKS_ON ?? 0}/{status?.LORA_LINKS_TOTAL ?? 0}</RNText>
                  </View>
                </View>
              </View>

              <View style={localStyles.footerTime}>
                <RNText style={localStyles.timeText}>
                  Cập nhật: {status?.TIME_STAMP ? moment(status.TIME_STAMP).fromNow() : 'N/A'}
                </RNText>
              </View>
            </View>
          </TouchableOpacity>
        </Animated.View>
      </Swipeable>

      {/* MODAL ĐỔI TÊN */}
      <Modal visible={isRenameModalVisible} transparent animationType="fade" onRequestClose={() => setRenameModalVisible(false)}>
        <View style={localStyles.modalOverlay}>
          <View style={localStyles.modalContent}>
            <RNText style={localStyles.modalTitle}>Đổi tên thiết bị</RNText>
            <TextInput 
              style={localStyles.input} 
              value={newName} 
              onChangeText={setNewName} 
              placeholder="Nhập tên mới..." 
              autoFocus 
            />
            <View style={localStyles.modalActionRow}>
              <TouchableOpacity style={[localStyles.modalBtn, { backgroundColor: '#94A3B8' }]} onPress={() => setRenameModalVisible(false)}>
                <RNText style={localStyles.btnText}>Hủy</RNText>
              </TouchableOpacity>
              <TouchableOpacity style={[localStyles.modalBtn, { backgroundColor: '#2563EB' }]} onPress={handleRenameSubmit} disabled={isUpdating}>
                {isUpdating ? <ActivityIndicator size="small" color="#fff" /> : <RNText style={localStyles.btnText}>Lưu</RNText>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </GestureHandlerRootView>
  );
});

const localStyles = StyleSheet.create({
  footerTime: { marginTop: 8, paddingTop: 6, borderTopWidth: 0.5, borderTopColor: '#F1F5F9', alignItems: 'flex-end' },
  timeText: { fontSize: 10, color: '#94A3B8', fontStyle: 'italic' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalContent: { width: '100%', backgroundColor: '#fff', borderRadius: 16, padding: 20, elevation: 10 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, padding: 12, fontSize: 16, marginBottom: 20, color: '#1E293B' },
  modalActionRow: { flexDirection: 'row', justifyContent: 'space-between' },
  modalBtn: { flex: 0.48, padding: 12, borderRadius: 8, alignItems: 'center', minHeight: 45, justifyContent: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold' }
});