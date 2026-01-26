import React, { useState } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Text as RNText } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

// --- MOCK DATA: Lịch sử Gateway ---
const GATEWAY_HISTORY = [
  { id: '1', time: '14:30', date: 'Hôm nay', type: 'ERROR', title: 'Mất kết nối Internet', detail: 'Wifi Signal: 0', value: 'Offline' },
  { id: '2', time: '14:25', date: 'Hôm nay', type: 'INFO', title: 'Báo cáo định kỳ', detail: 'Pin: 12.4V • Nhiệt độ: 36°C', value: 'Online' },
  { id: '3', time: '10:00', date: 'Hôm nay', type: 'WARNING', title: 'Chuyển nguồn dự phòng', detail: 'Nguồn chính mất', value: 'Backup' },
  { id: '4', time: '08:00', date: 'Hôm nay', type: 'INFO', title: 'Khởi động lại', detail: 'Hệ thống reset', value: 'Reboot' },
  { id: '5', time: '22:00', date: 'Hôm qua', type: 'INFO', title: 'Báo cáo định kỳ', detail: 'Pin: 12.5V • Nhiệt độ: 34°C', value: 'Online' },
];

const FILTER_TABS = ['Tất cả', 'Lỗi', 'Cảnh báo', 'Thông tin'];

export function HistoryGatewayScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const [activeTab, setActiveTab] = useState('Tất cả');
  
  // Lấy thông tin gateway từ màn hình trước (nếu có)
  const gatewayInfo = route.params || { name: 'Gateway Tầng 1', serial: 'GW-888222' };

  const getIcon = (type: string) => {
    switch (type) {
      case 'ERROR': return { name: 'wifi-off', color: '#EF4444', bg: '#FEE2E2' };
      case 'WARNING': return { name: 'electrical-services', color: '#F59E0B', bg: '#FEF3C7' };
      default: return { name: 'check-circle', color: '#10B981', bg: '#D1FAE5' };
    }
  };

  const renderItem = ({ item, index }: { item: any, index: number }) => {
    const iconData = getIcon(item.type);
    return (
      <Animated.View entering={FadeInDown.delay(index * 100)} style={styles.timelineItem}>
        {/* Cột thời gian */}
        <View style={styles.timeCol}>
          <RNText style={styles.timeText}>{item.time}</RNText>
          <RNText style={styles.dateText}>{item.date}</RNText>
        </View>

        {/* Đường kẻ dọc + Icon */}
        <View style={styles.timelineLineContainer}>
           <View style={styles.line} />
           <View style={[styles.iconBubble, { backgroundColor: iconData.bg }]}>
              <MaterialIcons name={iconData.name} size={18} color={iconData.color} />
           </View>
        </View>

        {/* Nội dung */}
        <View style={styles.contentCard}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
             <RNText style={styles.title}>{item.title}</RNText>
             <View style={[styles.statusTag, { backgroundColor: iconData.bg }]}>
                <RNText style={{ fontSize: 10, color: iconData.color, fontWeight: 'bold' }}>{item.value}</RNText>
             </View>
          </View>
          <RNText style={styles.detail}>{item.detail}</RNText>
        </View>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>
        <View style={{marginLeft: 15}}>
           <RNText style={styles.headerTitle}>Lịch sử hoạt động</RNText>
           <RNText style={styles.headerSub}>{gatewayInfo.name} ({gatewayInfo.serial})</RNText>
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={styles.tabContainer}>
        {FILTER_TABS.map((tab) => (
          <TouchableOpacity 
            key={tab} 
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <RNText style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</RNText>
          </TouchableOpacity>
        ))}
      </View>

      {/* List */}
      <FlatList
        data={GATEWAY_HISTORY}
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
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#E5E7EB' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
  headerSub: { fontSize: 13, color: '#6B7280' },
  
  tabContainer: { flexDirection: 'row', padding: 10, backgroundColor: '#fff' },
  tab: { marginRight: 10, paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20, backgroundColor: '#F3F4F6' },
  activeTab: { backgroundColor: '#2563EB' },
  tabText: { color: '#4B5563', fontSize: 13 },
  activeTabText: { color: '#fff', fontWeight: 'bold' },

  timelineItem: { flexDirection: 'row', marginBottom: 20 },
  timeCol: { width: 50, alignItems: 'flex-end', marginRight: 10 },
  timeText: { fontSize: 14, fontWeight: 'bold', color: '#374151' },
  dateText: { fontSize: 10, color: '#9CA3AF' },
  
  timelineLineContainer: { alignItems: 'center', width: 30 },
  line: { position: 'absolute', top: 0, bottom: -20, width: 2, backgroundColor: '#E5E7EB', zIndex: -1 },
  iconBubble: { width: 30, height: 30, borderRadius: 15, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', borderWidth: 2, borderColor: '#fff' },
  
  contentCard: { flex: 1, backgroundColor: '#fff', padding: 12, borderRadius: 8, elevation: 1, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 2, shadowOffset: {width:0, height:1} },
  title: { fontSize: 14, fontWeight: 'bold', color: '#1F2937', marginBottom: 4 },
  detail: { fontSize: 12, color: '#6B7280' },
  statusTag: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 }
});