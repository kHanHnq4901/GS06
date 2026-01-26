import React, { useState } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Text as RNText } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useNavigation, useRoute } from '@react-navigation/native';

// --- MOCK DATA: Lịch sử Đầu báo ---
const SENSOR_HISTORY = [
  { id: '1', time: '14:32', date: 'Hôm nay', type: 'ALARM', title: 'CẢNH BÁO KHÓI', detail: 'Nồng độ khói: Cao', rf: '-45dBm', battery: '90%' },
  { id: '2', time: '14:30', date: 'Hôm nay', type: 'ALARM', title: 'CẢNH BÁO NHIỆT', detail: 'Nhiệt độ: 55°C', rf: '-46dBm', battery: '90%' },
  { id: '3', time: '12:00', date: 'Hôm nay', type: 'INFO', title: 'Định kỳ', detail: 'Trạng thái bình thường', rf: '-48dBm', battery: '89%' },
  { id: '4', time: '09:15', date: 'Hôm qua', type: 'ERROR', title: 'Pin yếu', detail: 'Vui lòng thay pin', rf: '-50dBm', battery: '15%' },
  { id: '5', time: '08:00', date: 'Hôm qua', type: 'INFO', title: 'Kết nối lại', detail: 'Đã khôi phục kết nối', rf: '-42dBm', battery: '89%' },
];

export function HistorySensorScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  
  // Nhận params từ màn hình Home
  const device = route.params || { name: 'Đầu báo Khói P.Khách', gatewayName: 'Gateway Tầng 1' };

  const renderItem = ({ item, index }: { item: any, index: number }) => {
    const isAlarm = item.type === 'ALARM';
    
    return (
      <Animated.View entering={FadeInDown.delay(index * 100)} style={[
        styles.card, 
        isAlarm && styles.alarmCard 
      ]}>
        <View style={styles.cardHeader}>
           <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <MaterialIcons 
                name={isAlarm ? "notifications-active" : item.type === 'ERROR' ? "battery-alert" : "info"} 
                size={20} 
                color={isAlarm ? "#DC2626" : item.type === 'ERROR' ? "#F59E0B" : "#2563EB"} 
              />
              <RNText style={[styles.cardTitle, isAlarm && { color: '#DC2626' }]}>
                {item.title}
              </RNText>
           </View>
           <RNText style={styles.timeText}>{item.time} - {item.date}</RNText>
        </View>

        <View style={styles.divider} />

        <View style={styles.cardBody}>
           <RNText style={styles.detailText}>{item.detail}</RNText>
           
           <View style={styles.statsRow}>
              <View style={styles.statItem}>
                 <MaterialIcons name="battery-std" size={14} color="#6B7280" />
                 <RNText style={styles.statText}>{item.battery}</RNText>
              </View>
              <View style={styles.statItem}>
                 <MaterialIcons name="rss-feed" size={14} color="#6B7280" />
                 <RNText style={styles.statText}>{item.rf}</RNText>
              </View>
           </View>
        </View>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      
      {/* --- HEADER ĐỒNG BỘ VỚI HISTORY GATEWAY --- */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>
        <View style={{marginLeft: 15}}>
           <RNText style={styles.headerTitle}>Lịch sử thiết bị</RNText>
           {/* Hiển thị tên thiết bị ở dòng sub */}
           <RNText style={styles.headerSub}>{device.name}</RNText>
        </View>
        {/* Có thể thêm icon Lịch bên phải nếu muốn */}
        <TouchableOpacity style={{marginLeft: 'auto'}}> 
           <MaterialIcons name="calendar-today" size={20} color="#6B7280" />
        </TouchableOpacity>
      </View>

      {/* Statistics Summary */}
      <View style={styles.summaryContainer}>
         <View style={styles.summaryItem}>
            <RNText style={styles.summaryLabel}>Tổng sự kiện</RNText>
            <RNText style={styles.summaryValue}>24</RNText>
         </View>
         <View style={styles.summaryLine} />
         <View style={styles.summaryItem}>
            <RNText style={styles.summaryLabel}>Báo động</RNText>
            <RNText style={[styles.summaryValue, { color: '#DC2626' }]}>2</RNText>
         </View>
      </View>

      <FlatList
        data={SENSOR_HISTORY}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  
  // --- HEADER STYLE (Copy y hệt từ Gateway Screen) ---
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 16, 
    backgroundColor: '#fff', 
    borderBottomWidth: 1, 
    borderColor: '#E5E7EB' 
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
  headerSub: { fontSize: 13, color: '#6B7280' },

  // --- Styles riêng cho màn hình Sensor ---
  summaryContainer: { 
    flexDirection: 'row', 
    backgroundColor: '#fff', 
    margin: 16, 
    borderRadius: 8, 
    padding: 12, 
    // Shadow nhẹ
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F3F4F6'
  },
  summaryItem: { flex: 1, alignItems: 'center' },
  summaryLine: { width: 1, backgroundColor: '#E5E7EB' },
  summaryLabel: { fontSize: 12, color: '#6B7280' },
  summaryValue: { fontSize: 18, fontWeight: 'bold', color: '#111827', marginTop: 4 },

  card: { 
    backgroundColor: '#fff', 
    borderRadius: 10, 
    padding: 12, 
    marginBottom: 12, 
    borderWidth: 1, 
    borderColor: '#E5E7EB', 
    elevation: 1 
  },
  alarmCard: { 
    borderColor: '#FECACA', 
    backgroundColor: '#FEF2F2' 
  },
  
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { fontSize: 15, fontWeight: 'bold', color: '#1F2937', marginLeft: 8 },
  timeText: { fontSize: 12, color: '#9CA3AF' },
  
  divider: { height: 1, backgroundColor: '#F3F4F6', marginVertical: 8 },
  
  cardBody: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  detailText: { fontSize: 13, color: '#4B5563', flex: 1 },
  
  statsRow: { flexDirection: 'row' },
  statItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginLeft: 12, 
    backgroundColor: '#F3F4F6', 
    paddingHorizontal: 6, 
    paddingVertical: 2, 
    borderRadius: 4 
  },
  statText: { fontSize: 11, color: '#6B7280', marginLeft: 4 }
});