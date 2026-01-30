import React, { useState, useEffect, useMemo } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Text as RNText, ActivityIndicator } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getFireAlarmHistory, getGatewayHeartbeatHistory } from '../../services/api/common';
// Import 2 hàm API của bạn


const FILTER_TABS = ['Tất cả', 'Lỗi', 'Cảnh báo', 'Thông tin'];

export function HistoryGatewayScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const [activeTab, setActiveTab] = useState('Tất cả');
  
  // Trạng thái dữ liệu
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Lấy gatewayId từ params truyền vào
  const { gatewayId, serial } = route.params as { gatewayId: string,serial: string };
  useEffect(() => {
    loadData();
  }, [gatewayId]);

  const loadData = async () => {
  try {
    setIsLoading(true);
    
    // 1. Gọi API
    const [heartbeatRes, alarmRes] = await Promise.all([
      getGatewayHeartbeatHistory(gatewayId, 20),
      getFireAlarmHistory(gatewayId)
    ]);

    // LƯU Ý: Phải truy cập vào .DATA vì cấu trúc API trả về { CODE, MESSAGE, DATA }
    const rawHeartbeats = heartbeatRes?.DATA || [];
    const rawAlarms = alarmRes?.DATA || [];

    // 2. Format Heartbeat (Sử dụng các trường UPTIME, BATTERY, WIFI_RSSI từ C#)
    const formattedHeartbeats = rawHeartbeats.map((hb: any) => ({
      id: `hb-${hb.TIME_STAMP}-${Math.random()}`,
      // Chuyển đổi Unix Timestamp (giây) sang Date object
      time: new Date(hb.TIME_STAMP * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: new Date(hb.TIME_STAMP * 1000).toLocaleDateString('vi-VN'),
      type: 'INFO',
      title: 'Báo cáo định kỳ',
      detail: `Pin: ${hb.BATTERY}% • Wifi: ${hb.WIFI_RSSI}dBm • Temp: ${hb.TEMERATURE}°C`,
      value: 'Online',
    }));

    // 3. Format Fire Alarm (Dựa trên trường ACTION: START, END, CLEAR)
    const formattedAlarms = rawAlarms.map((al: any) => {
      let statusInfo = { type: 'WARNING', title: 'Cảnh báo cháy', val: al.ACTION };
      
      if (al.ACTION === 'START') statusInfo = { type: 'ERROR', title: 'BÁO CHÁY KHẨN CẤP', val: '🔥 Start' };
      if (al.ACTION === 'CLEAR') statusInfo = { type: 'INFO', title: 'Đã xóa cảnh báo', val: 'Clear' };
      if (al.ACTION === 'END') statusInfo = { type: 'WARNING', title: 'Kết thúc sự cố', val: 'Ended' };

      return {
        id: `al-${al.TIME_STAMP}-${Math.random()}`,
        time: new Date(al.TIME_STAMP * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: new Date(al.TIME_STAMP * 1000).toLocaleDateString('vi-VN'),
        type: statusInfo.type,
        title: statusInfo.title,
        detail: `Mã lỗi: ${al.MSGID} • ID Nguồn: ${al.SRCID}`,
        value: statusInfo.val,
      };
    });

    // 4. Gộp và Sắp xếp theo thời gian mới nhất lên đầu
    const combined = [...formattedAlarms, ...formattedHeartbeats].sort((a, b) => {
      // Vì id có chứa timestamp hoặc bạn có thể lưu timestamp gốc để so sánh
      return b.id.localeCompare(a.id); 
    });

    setHistoryData(combined);
  } catch (error) {
    console.error("❌ Lỗi khi tải lịch sử:", error);
  } finally {
    setIsLoading(false);
  }
};

  // Logic Lọc dữ liệu dựa trên Tab
  const filteredData = useMemo(() => {
    if (activeTab === 'Tất cả') return historyData;
    if (activeTab === 'Lỗi') return historyData.filter(i => i.type === 'ERROR');
    if (activeTab === 'Cảnh báo') return historyData.filter(i => i.type === 'WARNING');
    if (activeTab === 'Thông tin') return historyData.filter(i => i.type === 'INFO');
    return historyData;
  }, [activeTab, historyData]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'ERROR': return { name: 'wifi-off', color: '#EF4444', bg: '#FEE2E2' };
      case 'WARNING': return { name: 'local-fire-department', color: '#F97316', bg: '#FFEDD5' };
      default: return { name: 'check-circle', color: '#10B981', bg: '#D1FAE5' };
    }
  };

  const renderItem = ({ item, index }: { item: any, index: number }) => {
    const iconData = getIcon(item.type);
    return (
      <Animated.View entering={FadeInDown.delay(index * 50)} style={styles.timelineItem}>
        <View style={styles.timeCol}>
          <RNText style={styles.timeText}>{item.time}</RNText>
          <RNText style={styles.dateText}>{item.date}</RNText>
        </View>

        <View style={styles.timelineLineContainer}>
           <View style={styles.line} />
           <View style={[styles.iconBubble, { backgroundColor: iconData.bg }]}>
              <MaterialIcons name={iconData.name} size={18} color={iconData.color} />
           </View>
        </View>

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
      {/* Header giữ nguyên */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>
        <View style={{marginLeft: 15}}>
           <RNText style={styles.headerTitle}>Lịch sử hoạt động</RNText>
           <RNText style={styles.headerSub}>{gatewayId}</RNText>
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

      {/* List hoặc Loading */}
      {isLoading ? (
        <View style={{flex: 1, justifyContent: 'center'}}><ActivityIndicator color="#2563EB" /></View>
      ) : (
        <FlatList
          data={filteredData}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 16 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<RNText style={{textAlign: 'center', marginTop: 20, color: '#9CA3AF'}}>Không có dữ liệu lịch sử</RNText>}
        />
      )}
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