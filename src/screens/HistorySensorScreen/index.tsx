import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  FlatList, 
  StyleSheet, 
  TouchableOpacity, 
  Text as RNText, 
  ActivityIndicator, 
  RefreshControl, 
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useNavigation, useRoute } from '@react-navigation/native';
import dayjs from 'dayjs';

// Import API
import { getNodeStatusHistory } from '../../services/api/common';
import { MqttProtocolService } from '../../services/mqtt';

export function HistorySensorScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  // Lấy params truyền từ màn hình danh sách thiết bị
  const { nodeId, deviceName, gatewayId } = (route.params as any) || {};
  console.log ("HistorySensorScreen - nodeId:", nodeId, "deviceName:", deviceName, "gatewayId:", gatewayId);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [historyData, setHistoryData] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const [summary, setSummary] = useState({
    alarmCount: 0,
    totalEvents: 0,
    battery: '--',
    rf: '--'
  });

  // Hàm gọi API lấy dữ liệu
  const fetchData = async () => {
    try {
      const response = await getNodeStatusHistory(nodeId);
      
      if (response && response.CODE === 1) {
        const rawData = response.DATA || [];
        
        // Map dữ liệu từ API sang định dạng UI
        const mappedData = rawData.map((item: any) => ({
          id: item.MSGID?.toString() || Math.random().toString(),
          time: dayjs(item.TIME_STAMP).format('HH:mm'),
          date: dayjs(item.TIME_STAMP).format('DD/MM/YYYY'),
          // Logic: Nếu FAULT > 0 là báo động, hoặc tùy theo quy định của bạn
          type: item.FAULT > 0 ? 'ALARM' : (item.BATTERY < 20 ? 'ERROR' : 'INFO'),
          title: item.FAULT > 0 ? 'CẢNH BÁO KHÓI' : (item.BATTERY < 20 ? 'PIN YẾU' : 'ĐỊNH KỲ'),
          detail: item.ONLINE ? 'Trạng thái ổn định' : 'Mất kết nối',
          rf: `${item.RSSI || 0}dBm`,
          battery: `${item.BATTERY || 0}%`,
        }));

        setHistoryData(mappedData);

        // Cập nhật thông số tóm tắt (lấy từ bản ghi mới nhất)
        if (rawData.length > 0) {
          const latest = rawData[0];
          setSummary({
            alarmCount: rawData.filter((x: any) => x.FAULT > 0).length,
            totalEvents: rawData.length,
            battery: `${latest.BATTERY}%`,
            rf: `${latest.RSSI}`
          });
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [nodeId]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, []);
  const handleTestDevice = async () => {
    if (!gatewayId || !nodeId) {
      Alert.alert("Lỗi", "Không tìm thấy thông tin Gateway hoặc Node ID");
      return;
    }

    setIsSending(true);
    try {
      // scope: 1 là kiểm tra đơn lẻ một node, nodeId là id của cảm biến hiện tại
      const response = await MqttProtocolService.testDevice(gatewayId, 1, nodeId);

      if (response.status === 'success') {
        Alert.alert("Thành công", "Lệnh kiểm tra đã được gửi. Vui lòng quan sát thiết bị.");
      } else if (response.status === 'failure') {
        Alert.alert("Thất bại", "Gateway phản hồi lỗi xử lý lệnh.");
      } else {
        Alert.alert("Lỗi", "Thiết bị không phản hồi (Timeout).");
      }
    } catch (error) {
      Alert.alert("Lỗi", "Không thể kết nối tới Broker MQTT");
    } finally {
      setIsSending(false);
    }
  };
  const renderItem = ({ item, index }: { item: any, index: number }) => {
    const isAlarm = item.type === 'ALARM';
    const isError = item.type === 'ERROR';
    
    return (
      <Animated.View 
        entering={FadeInDown.delay(index * 50)} 
        style={[styles.card, isAlarm && styles.alarmCard]}
      >
        <View style={styles.cardHeader}>
           <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <MaterialIcons 
                name={isAlarm ? "notifications-active" : isError ? "battery-alert" : "info"} 
                size={20} 
                color={isAlarm ? "#DC2626" : isError ? "#F59E0B" : "#2563EB"} 
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
        <View style={{ marginLeft: 15 }}>
           <RNText style={styles.headerTitle}>Thông tin thiết bị</RNText>
           <RNText style={styles.headerSub}>{deviceName}</RNText>
        </View>
        <TouchableOpacity style={{ marginLeft: 'auto' }}> 
           <MaterialIcons name="calendar-today" size={20} color="#6B7280" />
        </TouchableOpacity>
      </View>

      {/* SUMMARY */}
      <View style={styles.summaryContainer}>
         <View style={styles.summaryItem}>
            <MaterialIcons name="notifications-active" size={18} color="#DC2626" />
            <RNText style={[styles.summaryValue, { color: '#DC2626' }]}>{summary.alarmCount}</RNText>
            <RNText style={styles.summaryLabel}>Báo động</RNText>
         </View>
         <View style={styles.summaryLine} />
         <View style={styles.summaryItem}>
            <MaterialIcons name="event-note" size={18} color="#4B5563" />
            <RNText style={styles.summaryValue}>{summary.totalEvents}</RNText>
            <RNText style={styles.summaryLabel}>Sự kiện</RNText>
         </View>
         <View style={styles.summaryLine} />
         <View style={styles.summaryItem}>
            <MaterialIcons name="battery-charging-full" size={18} color="#059669" />
            <RNText style={[styles.summaryValue, { color: '#059669' }]}>{summary.battery}</RNText>
            <RNText style={styles.summaryLabel}>Pin</RNText>
         </View>
         <View style={styles.summaryLine} />
         <View style={styles.summaryItem}>
            <MaterialIcons name="settings-input-antenna" size={18} color="#2563EB" />
            <RNText style={[styles.summaryValue, { color: '#2563EB' }]}>{summary.rf}</RNText>
            <RNText style={styles.summaryLabel}>Sóng RF</RNText>
         </View>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#2563EB" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={historyData}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <RNText style={{ textAlign: 'center', marginTop: 50, color: '#9CA3AF' }}>
              Không có dữ liệu lịch sử
            </RNText>
          }
        />
      )}

      {/* FOOTER */}
      <View style={styles.footer}>
         <TouchableOpacity 
            style={[styles.checkButton, isSending && { backgroundColor: '#94A3B8' }]}
            onPress={handleTestDevice}
            disabled={isSending}
         >
            {isSending ? (
              <ActivityIndicator color="#fff" style={{ marginRight: 8 }} />
            ) : (
              <MaterialIcons name="playlist-add-check" size={24} color="#fff" />
            )}
            <RNText style={styles.checkButtonText}>
              {isSending ? "Đang gửi lệnh..." : "Kiểm tra thiết bị ngay"}
            </RNText>
         </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// Giữ nguyên phần styles của bạn
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#E5E7EB' },
  headerTitle: { fontSize: 17, fontWeight: 'bold', color: '#111827' },
  headerSub: { fontSize: 12, color: '#6B7280' },
  summaryContainer: { flexDirection: 'row', backgroundColor: '#fff', margin: 16, borderRadius: 12, paddingVertical: 15, borderWidth: 1, borderColor: '#E5E7EB', elevation: 2 },
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
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#fff', padding: 16, borderTopWidth: 1, borderColor: '#E5E7EB' },
  checkButton: { backgroundColor: '#2563EB', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, borderRadius: 10 },
  checkButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginLeft: 8 }
});