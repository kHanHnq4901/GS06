import React from 'react';
import { View, TouchableOpacity, Text as RNText, StyleSheet } from 'react-native';
import { Swipeable, GestureHandlerRootView } from 'react-native-gesture-handler';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import moment from 'moment';

export const LinkItem = ({ item, index, onClear }: any) => {
  const isOnline = item.ONLINE === 1;

  // Hành động khi kéo sang trái (hiện nút xóa bên phải)
  const renderRightActions = () => (
    <View style={styles.swipeContainer}>
      <TouchableOpacity 
        style={styles.deleteButton} 
        onPress={() => onClear(item.GATEWAY_ID)}
      >
        <MaterialIcons name="delete-forever" size={22} color="#fff" />
        <RNText style={styles.swipeText}>Xóa lịch sử</RNText>
      </TouchableOpacity>
    </View>
  );

  return (
    <GestureHandlerRootView>
      <Swipeable renderRightActions={renderRightActions} friction={2}>
        <Animated.View entering={FadeInDown.delay(index * 50)}>
          <View style={styles.card}>
            <View style={[styles.iconBox, { backgroundColor: isOnline ? '#DCFCE7' : '#F1F5F9' }]}>
              <MaterialIcons name="hub" size={24} color={isOnline ? '#16A34A' : '#64748B'} />
            </View>
            
            <View style={styles.info}>
              <View style={styles.rowBetween}>
                <RNText style={styles.title}>Kết nối: {item.GATEWAY_ID2}</RNText>
                {/* Status Badge */}
                <View style={[styles.statusBadge, { backgroundColor: isOnline ? '#DCFCE7' : '#FEE2E2' }]}>
                  <RNText style={[styles.statusText, { color: isOnline ? '#166534' : '#991B1B' }]}>
                    {isOnline ? 'ONLINE' : 'OFFLINE'}
                  </RNText>
                </View>
              </View>
              <RNText style={styles.sub}>RSSI: {item.RSSI}dBm | Kênh: {item.CHANNEL}</RNText>
              <RNText style={styles.time}>{moment(item.TIME_STAMP).fromNow()}</RNText>
            </View>
          </View>
        </Animated.View>
      </Swipeable>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', marginHorizontal: 16, marginTop: 10, padding: 12, borderRadius: 12, elevation: 1 },
  iconBox: { width: 44, height: 44, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  info: { flex: 1, marginLeft: 12 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 14, fontWeight: 'bold', color: '#1E293B' },
  sub: { fontSize: 12, color: '#64748B', marginTop: 2 },
  time: { fontSize: 10, color: '#94A3B8', marginTop: 4, fontStyle: 'italic' },
  statusBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  statusText: { fontSize: 9, fontWeight: 'bold' },
  swipeContainer: { width: 100, marginTop: 10, marginRight: 16 },
  deleteButton: { flex: 1, backgroundColor: '#EF4444', justifyContent: 'center', alignItems: 'center', borderRadius: 12 },
  swipeText: { color: '#fff', fontSize: 10, fontWeight: 'bold', marginTop: 4 }
});