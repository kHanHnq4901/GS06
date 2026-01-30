import React from 'react';
import { View, TouchableOpacity, Text as RNText, StyleSheet, FlatList } from 'react-native';
import { Swipeable, GestureHandlerRootView } from 'react-native-gesture-handler';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';

// 1. COMPONENT HIỂN THỊ TỪNG DÒNG LỊCH SỬ (Dữ liệu từ GetNodeStatusHistory)
export const StatusHistoryItem = ({ log }: any) => {
  const isOnline = log.ONLINE === 1;
  // Format thời gian từ Timestamp
  const formatTime = (ts: any) => {
    const date = new Date(ts * 1000);
    return date.toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit', day: '2-digit', month: '2-digit' });
  };

  return (
    <View style={styles.historyCard}>
      <View style={styles.historyHeader}>
        <RNText style={styles.historyTime}>{formatTime(log.TIME_STAMP)}</RNText>
        <View style={[styles.miniStatus, { backgroundColor: isOnline ? '#10B981' : '#EF4444' }]}>
          <RNText style={styles.miniStatusText}>{isOnline ? 'ONLINE' : 'OFFLINE'}</RNText>
        </View>
      </View>

      <View style={styles.grid}>
        <View style={styles.gridItem}>
          <MaterialIcons name="battery-6-bar" size={14} color="#64748B" />
          <RNText style={styles.gridText}>Pin: {log.BATTERY}%</RNText>
        </View>
        <View style={styles.gridItem}>
          <MaterialIcons name="wifi" size={14} color="#64748B" />
          <RNText style={styles.gridText}>Sóng: {log.RSSI}dBm</RNText>
        </View>
        <View style={styles.gridItem}>
          <MaterialIcons name="error-outline" size={14} color={log.FAULT > 0 ? '#EF4444' : '#64748B'} />
          <RNText style={[styles.gridText, log.FAULT > 0 && {color: '#EF4444'}]}>Lỗi: {log.FAULT}</RNText>
        </View>
        <View style={styles.gridItem}>
          <MaterialIcons name="router" size={14} color="#64748B" />
          <RNText style={styles.gridText} numberOfLines={1}>GW: {log.GATEWAY_ID}</RNText>
        </View>
      </View>
    </View>
  );
};

// 2. COMPONENT ITEM CHÍNH (SensorItem)
export const SensorItem = ({ item, index, onRename, onRemove, onPress }: any) => {
  const isOnline = item.ONLINE === 1;

  const renderRightActions = () => (
    <View style={styles.swipeContainer}>
      <TouchableOpacity 
        style={[styles.swipeBtn, { backgroundColor: '#3B82F6' }]} 
        onPress={() => onRename(item)}
      >
        <MaterialIcons name="edit" size={20} color="#fff" />
        <RNText style={styles.swipeText}>Sửa</RNText>
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.swipeBtn, { backgroundColor: '#EF4444' }]} 
        onPress={() => onRemove(item.SENSOR_ID)}
      >
        <MaterialIcons name="delete-forever" size={20} color="#fff" />
        <RNText style={styles.swipeText}>Xóa</RNText>
      </TouchableOpacity>
    </View>
  );

  return (
    <GestureHandlerRootView>
      <Swipeable renderRightActions={renderRightActions} friction={2}>
        <Animated.View entering={FadeInDown.delay(index * 50)}>
          {/* QUAN TRỌNG: Thêm onPress vào đây */}
          <TouchableOpacity 
            style={styles.card} 
            onPress={() => onPress?.(item)} // Gọi function truyền từ bên ngoài vào
            activeOpacity={0.7}
          >
            <View style={[styles.iconBox, { backgroundColor: isOnline ? '#DCFCE7' : '#F1F5F9' }]}>
              <MaterialIcons name="settings-remote" size={24} color={isOnline ? '#16A34A' : '#64748B'} />
            </View>
            
            <View style={styles.info}>
              <View style={styles.rowBetween}>
                <RNText style={styles.title} numberOfLines={1}>{item.DEVICE_NAME || 'Cảm biến chưa đặt tên'}</RNText>
                <View style={[styles.statusCircle, { backgroundColor: isOnline ? '#10B981' : '#EF4444' }]} />
              </View>
              
              <RNText style={styles.sub}>ID: {item.SENSOR_ID} | Loại: {item.SENSOR_TYPE}</RNText>
              
              <View style={styles.miniStatsRow}>
                <RNText style={styles.miniStatLabel}>Pin: <RNText style={{color: '#1E293B'}}>{item.BATTERY}%</RNText></RNText>
                <RNText style={styles.miniStatLabel}> | Sóng: <RNText style={{color: '#1E293B'}}>{item.RSSI}dBm</RNText></RNText>
              </View>
            </View>
            
            <MaterialIcons name="chevron-right" size={20} color="#CBD5E1" />
          </TouchableOpacity>
        </Animated.View>
      </Swipeable>
    </GestureHandlerRootView>
  );
};

// 3. STYLESHEET CHI TIẾT
const styles = StyleSheet.create({
  // Card chính
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 12,
    marginVertical: 6,
    marginHorizontal: 16,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  iconBox: {
    width: 52,
    height: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    flex: 1,
  },
  statusCircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginLeft: 8,
  },
  sub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  miniStatsRow: {
    flexDirection: 'row',
    marginTop: 4,
  },
  miniStatLabel: {
    fontSize: 11,
    color: '#94A3B8',
  },
  // Swipe Actions
  swipeContainer: {
    flexDirection: 'row',
    width: 160,
    marginVertical: 6,
    marginRight: 16,
  },
  swipeBtn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    marginLeft: 8,
  },
  swipeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 2,
  },
  // History List Styles
  historyCard: {
    backgroundColor: '#F8FAFC',
    padding: 12,
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#CBD5E1', // Màu mặc định
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  historyTime: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#334155',
  },
  miniStatus: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  miniStatusText: {
    fontSize: 9,
    color: '#FFF',
    fontWeight: 'bold',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  gridItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
    paddingVertical: 2,
  },
  gridText: {
    fontSize: 12,
    color: '#475569',
    marginLeft: 5,
  },
});