import React from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Text as RNText } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useNavigation, useRoute } from '@react-navigation/native';

// --- MOCK DATA ---
const SENSOR_HISTORY = [
  { id: '1', time: '14:32', date: 'Hôm nay', type: 'ALARM', title: 'CẢNH BÁO KHÓI', detail: 'Nồng độ khói: Cao', rf: '-45dBm', battery: '90%' },

  { id: '3', time: '12:00', date: 'Hôm nay', type: 'INFO', title: 'Định kỳ', detail: 'Trạng thái bình thường', rf: '-48dBm', battery: '89%' },
  { id: '4', time: '09:15', date: 'Hôm qua', type: 'ERROR', title: 'Pin yếu', detail: 'Vui lòng thay pin', rf: '-50dBm', battery: '15%' },
];

export function HistorySensorScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const device = route.params || { name: 'Đầu báo Khói P.Khách', rf: '-45dBm', battery: '90%' };

  const renderItem = ({ item, index }: { item: any, index: number }) => {
    const isAlarm = item.type === 'ALARM';
    return (
      <Animated.View entering={FadeInDown.delay(index * 100)} style={[styles.card, isAlarm && styles.alarmCard]}>
        <View style={styles.cardHeader}>
           <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <MaterialIcons 
                name={isAlarm ? "notifications-active" : item.type === 'ERROR' ? "battery-alert" : "info"} 
                size={20} 
                color={isAlarm ? "#DC2626" : item.type === 'ERROR' ? "#F59E0B" : "#2563EB"} 
              />
              <RNText style={[styles.cardTitle, isAlarm && { color: '#DC2626' }]}>{item.title}</RNText>
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
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>
        <View style={{marginLeft: 15}}>
           <RNText style={styles.headerTitle}>Thông tin thiết bị</RNText>
           <RNText style={styles.headerSub}>{device.name}</RNText>
        </View>
        <TouchableOpacity style={{marginLeft: 'auto'}}> 
           <MaterialIcons name="calendar-today" size={20} color="#6B7280" />
        </TouchableOpacity>
      </View>

      {/* SUMMARY CONTAINER - ĐÃ THÊM PIN VÀ RF */}
      <View style={styles.summaryContainer}>
         {/* Báo động */}
         <View style={styles.summaryItem}>
            <MaterialIcons name="notifications-active" size={18} color="#DC2626" />
            <RNText style={[styles.summaryValue, { color: '#DC2626' }]}>2</RNText>
            <RNText style={styles.summaryLabel}>Báo động</RNText>
         </View>

         <View style={styles.summaryLine} />

         {/* Tổng Sự kiện */}
         <View style={styles.summaryItem}>
            <MaterialIcons name="event-note" size={18} color="#4B5563" />
            <RNText style={styles.summaryValue}>24</RNText>
            <RNText style={styles.summaryLabel}>Sự kiện</RNText>
         </View>

         <View style={styles.summaryLine} />

         {/* Trạng thái Pin */}
         <View style={styles.summaryItem}>
            <MaterialIcons name="battery-charging-full" size={18} color="#059669" />
            <RNText style={[styles.summaryValue, { color: '#059669' }]}>{device.battery || '90%'}</RNText>
            <RNText style={styles.summaryLabel}>Pin</RNText>
         </View>

         <View style={styles.summaryLine} />

         {/* Tín hiệu sóng */}
         <View style={styles.summaryItem}>
            <MaterialIcons name="settings-input-antenna" size={18} color="#2563EB" />
            <RNText style={[styles.summaryValue, { color: '#2563EB' }]}>{device.rf || '-45'}</RNText>
            <RNText style={styles.summaryLabel}>Sóng RF</RNText>
         </View>
      </View>

      <FlatList
        data={SENSOR_HISTORY}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      />

      {/* NÚT KIỂM TRA THIẾT BỊ Ở CUỐI */}
      <View style={styles.footer}>
         <TouchableOpacity 
            style={styles.checkButton}
            onPress={() => console.log("Kiểm tra thiết bị")}
         >
            <MaterialIcons name="check-circle" size={22} color="#fff" />
            <RNText style={styles.checkButtonText}>Kiểm tra thiết bị ngay</RNText>
         </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 16, 
    backgroundColor: '#fff', 
    borderBottomWidth: 1, 
    borderColor: '#E5E7EB' 
  },
  headerTitle: { fontSize: 17, fontWeight: 'bold', color: '#111827' },
  headerSub: { fontSize: 12, color: '#6B7280' },

  summaryContainer: { 
    flexDirection: 'row', 
    backgroundColor: '#fff', 
    margin: 16, 
    borderRadius: 12, 
    paddingVertical: 15,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  summaryItem: { flex: 1, alignItems: 'center' },
  summaryLine: { width: 1, height: '70%', backgroundColor: '#E5E7EB', alignSelf: 'center' },
  summaryLabel: { fontSize: 10, color: '#6B7280', textTransform: 'uppercase', fontWeight: '600' },
  summaryValue: { fontSize: 15, fontWeight: 'bold', color: '#111827', marginTop: 4 },

  card: { backgroundColor: '#fff', borderRadius: 10, padding: 12, marginBottom: 12, borderWidth: 1, borderColor: '#E5E7EB' },
  alarmCard: { borderColor: '#FECACA', backgroundColor: '#FEF2F2' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { fontSize: 14, fontWeight: 'bold', color: '#1F2937', marginLeft: 8 },
  timeText: { fontSize: 11, color: '#9CA3AF' },
  divider: { height: 1, backgroundColor: '#F3F4F6', marginVertical: 8 },
  cardBody: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  detailText: { fontSize: 13, color: '#4B5563', flex: 1 },
  statsRow: { flexDirection: 'row' },
  statItem: { flexDirection: 'row', alignItems: 'center', marginLeft: 10, backgroundColor: '#F3F4F6', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  statText: { fontSize: 10, color: '#6B7280', marginLeft: 4 },

  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 16,
    borderTopWidth: 1,
    borderColor: '#E5E7EB',
  },
  checkButton: {
    backgroundColor: '#2563EB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#2563EB',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 4 },
  },
  checkButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  }
});