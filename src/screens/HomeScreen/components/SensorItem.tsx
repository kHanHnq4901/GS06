import React, { useState } from 'react';
import { 
  View, 
  Text as RNText, 
  StyleSheet, 
  Alert, 
  Modal, 
  TextInput, 
  ActivityIndicator,
  TouchableOpacity as RNTouchableOpacity 
} from 'react-native';
// QUAN TRỌNG: Phải dùng TouchableOpacity từ gesture-handler để không bị Swipeable nuốt mất event nhấn
import { Swipeable, TouchableOpacity } from 'react-native-gesture-handler';
import Animated, { FadeInDown } from 'react-native-reanimated';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import moment from 'moment';

// Import API & Styles chung
import { renameSensor, removeSensor } from '../../../services/api/common';
import { styles } from '../styles'; 
import { MqttProtocolService } from '../../../services/mqtt';
export const SensorItem = React.memo(({ item, index, onRefresh, onPress }: any) => {
  console.log ('item sensor', item);
  const isOnline = item.ONLINE === 1;
  
  // States
  const [isRenameModalVisible, setRenameModalVisible] = useState(false);
  const [newName, setNewName] = useState(item.DEVICE_NAME || '');
  const [isUpdating, setIsUpdating] = useState(false);

  // --- LOGIC: ĐỔI TÊN ---
  const handleRename = async () => {
    if (!newName.trim()) {
      Alert.alert("Thông báo", "Tên thiết bị không được để trống");
      return;
    }
    setIsUpdating(true);
    try {
      const res = await renameSensor(item.SENSOR_ID, newName.trim());
      if (res.CODE === 1) {
        setRenameModalVisible(false);
        onRefresh();
      } else {
        Alert.alert("Lỗi", res.MESSAGE_VI);
      }
    } catch (error) {
      Alert.alert("Lỗi", "Không thể kết nối máy chủ");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemove = () => {
    Alert.alert(
      "Xác nhận gỡ", 
      `Bạn muốn gửi lệnh gỡ thiết bị "${item.DEVICE_NAME || item.SENSOR_ID}" khỏi Gateway?`, 
      [
        { text: "Hủy", style: "cancel" },
        { 
          text: "Xác nhận", 
          style: "destructive", 
          onPress: async () => {
            try {
              // BƯỚC 1: Gửi lệnh MQTT xuống Gateway trước
              // Đảm bảo item có chứa GATEWAY_ID
              if (!item.GATEWAY_ID) {
                Alert.alert("Lỗi", "Không tìm thấy ID Gateway để gửi lệnh.");
                return;
              }
              console.log("🚀 Gửi lệnh gỡ node qua MQTT...", item.GATEWAY_ID, item.SENSOR_ID);
              const mqttRes = await MqttProtocolService.removeNode(
                item.GATEWAY_ID, 
                item.SENSOR_ID.toString()
              );

              // BƯỚC 2: Kiểm tra phản hồi từ MQTT
              if (mqttRes.status === 'success') {
                // Gateway đã phản hồi result: 1 (Thành công)
                console.log("🎯 MQTT gỡ node thành công, bắt đầu xóa API...");

                // BƯỚC 3: Gọi API xóa trên máy chủ
                // const res = await removeSensor(item.SENSOR_ID);
                
                // if (res.CODE === 1) {
                //   Alert.alert("Thành công", "Đã gỡ thiết bị khỏi hệ thống.");
                //   onRefresh(); // Load lại danh sách
                // } else {
                //   Alert.alert("Thông báo", "Gateway đã gỡ nhưng không thể xóa trên máy chủ.");
                // }
              } 
              else if (mqttRes.status === 'failure') {
                // Gateway phản hồi result: 0
                Alert.alert("Thất bại", "Gateway từ chối lệnh gỡ thiết bị. Vui lòng kiểm tra trạng thái thiết bị.");
              } 
              else {
                // Trường hợp Timeout
                Alert.alert("Lỗi", "Gateway không phản hồi. Không thể gỡ thiết bị lúc này.");
              }

            } catch (error) {
              console.error("Remove Error:", error);
              Alert.alert("Lỗi", "Đã xảy ra lỗi kết nối MQTT.");
            }
          } 
        }
      ]
    );
  };

  // --- UI: NÚT VUỐT (Fix khoảng hở bên phải) ---
  const renderRightActions = () => (
    <View style={[styles.swipeActionContainer, { marginRight: 0, paddingRight: 16 }]}> 
      <TouchableOpacity 
        style={[styles.swipeButton, { backgroundColor: '#3B82F6' }]} 
        onPress={() => {
          setNewName(item.DEVICE_NAME);
          setRenameModalVisible(true);
        }}
      >
        <MaterialIcons name="edit" size={20} color="#fff" />
        <RNText style={styles.swipeButtonText}>Sửa tên</RNText>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.swipeButton, { backgroundColor: '#EF4444' }]} 
        onPress={handleRemove}
      >
        <MaterialIcons name="delete-forever" size={20} color="#fff" />
        <RNText style={styles.swipeButtonText}>Gỡ bỏ</RNText>
      </TouchableOpacity>
    </View>
  );

  return (
    <View>
      <Swipeable renderRightActions={renderRightActions} friction={2}>
        <Animated.View entering={FadeInDown.delay(index * 100).springify()}>
          {/* SỬ DỤNG TouchableOpacity CỦA GESTURE-HANDLER TẠI ĐÂY */}
          <TouchableOpacity 
            style={styles.cardGateway} 
            onPress={() => onPress?.(item)} 
            activeOpacity={0.8}
          >
            <View style={styles.rowBetween}>
              <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                <View style={localStyles.iconBoxContainer}>
                  <MaterialIcons name="settings-remote" size={24} color={isOnline ? '#16A34A' : '#64748B'} />
                </View>
                <View style={{ marginLeft: 10, flex: 1 }}>
                  <RNText style={styles.gwName} numberOfLines={1}>
                    {item.DEVICE_NAME || 'Cảm biến chưa đặt tên'}
                  </RNText>
                  <RNText style={styles.gwSerial}>ID: {item.SENSOR_ID} | {item.SENSOR_TYPE}</RNText>
                </View>
              </View>

              <View style={[styles.statusBadge, { backgroundColor: isOnline ? '#DCFCE7' : '#FEE2E2' }]}>
                <RNText style={{ color: isOnline ? '#166534' : '#991B1B', fontSize: 10, fontWeight: 'bold' }}>
                  {isOnline ? 'ONLINE' : 'OFFLINE'}
                </RNText>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.rowBetween}>
              <View style={{ flex: 1, flexDirection: 'row' }}>
                <View style={localStyles.paramItem}>
                  <MaterialIcons name="battery-std" size={14} color="#64748B" />
                  <RNText style={localStyles.paramText}>Pin: {item.BATTERY ?? '--'}%</RNText>
                </View>
                <View style={[localStyles.paramItem, { marginLeft: 15 }]}>
                  <MaterialIcons name="wifi" size={14} color="#2563EB" />
                  <RNText style={localStyles.paramText}>Sóng: {item.RSSI ?? '--'}dBm</RNText>
                </View>
              </View>
              <MaterialIcons name="chevron-right" size={20} color="#CBD5E1" />
            </View>

            <View style={localStyles.footerTime}>
              <RNText style={localStyles.timeText}>
                {item.TIME_STAMP ? `Cập nhật: ${moment(item.TIME_STAMP).fromNow()}` : 'N/A'}
              </RNText>
            </View>
          </TouchableOpacity>
        </Animated.View>
      </Swipeable>

      {/* MODAL ĐỔI TÊN - Đồng bộ UI với Gateway */}
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
              <RNTouchableOpacity style={[localStyles.modalBtn, { backgroundColor: '#94A3B8' }]} onPress={() => setRenameModalVisible(false)}>
                <RNText style={localStyles.btnText}>Hủy</RNText>
              </RNTouchableOpacity>
              <RNTouchableOpacity style={[localStyles.modalBtn, { backgroundColor: '#2563EB' }]} onPress={handleRename} disabled={isUpdating}>
                {isUpdating ? <ActivityIndicator size="small" color="#fff" /> : <RNText style={localStyles.btnText}>Lưu</RNText>}
              </RNTouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
});

const localStyles = StyleSheet.create({
  iconBoxContainer: { width: 45, height: 45, backgroundColor: '#F1F5F9', borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  paramItem: { flexDirection: 'row', alignItems: 'center' },
  paramText: { fontSize: 12, color: '#4B5563', marginLeft: 5 },
  footerTime: { marginTop: 8, paddingTop: 6, borderTopWidth: 0.5, borderTopColor: '#F1F5F9', alignItems: 'flex-end' },
  timeText: { fontSize: 10, color: '#94A3B8', fontStyle: 'italic' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalContent: { width: '100%', backgroundColor: '#fff', borderRadius: 16, padding: 20, elevation: 10 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, textAlign: 'center', color: '#1E293B' },
  input: { borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, padding: 12, fontSize: 16, marginBottom: 20, color: '#1E293B' },
  modalActionRow: { flexDirection: 'row', justifyContent: 'space-between' },
  modalBtn: { flex: 0.48, padding: 12, borderRadius: 8, alignItems: 'center', minHeight: 45, justifyContent: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold' }
});