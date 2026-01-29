import React, { useState, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { Text } from 'react-native-paper';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import SelectDropdown from 'react-native-select-dropdown';
import { useNavigation, useRoute } from '@react-navigation/native';
import moment from 'moment';

// API Services
import { getSensorsByGateway, getLinkGatewayStatus, getNodeStatusHistory } from '../../services/api/common';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type TabType = 'DEVICE' | 'LINK';

export function DetailGatewayScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const item = route.params as any;
  const gatewayId = item?.GATEWAY_ID || 'N/A';

  const [activeTab, setActiveTab] = useState<TabType>('DEVICE');
  const [loading, setLoading] = useState(false);
  const [sensors, setSensors] = useState<any[]>([]);
  const [links, setLinks] = useState<any[]>([]);

  const actionMenu = [
    { title: 'Thêm thiết bị', icon: 'sensors', action: 'ADD_DEVICE' },
    { title: 'Thêm mạng liên gia', icon: 'hub', action: 'ADD_LINK' },
  ];

  const fetchData = async () => {
    if (!gatewayId || gatewayId === 'N/A') return;
    setLoading(true);
    try {
      if (activeTab === 'DEVICE') {
        const res = await getSensorsByGateway(gatewayId);
        if (res.CODE === 1) {
          const sensorsWithStatus = await Promise.all(
            res.DATA.map(async (s: any) => {
              const stRes = await getNodeStatusHistory(s.SENSOR_ID, 1);
              return { ...s, latestStatus: stRes.DATA?.[0] || null };
            })
          );
          setSensors(sensorsWithStatus);
        }
      } else {
        const res = await getLinkGatewayStatus(gatewayId);
        if (res.CODE === 1) setLinks(res.DATA);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchData(); 
  }, [activeTab, gatewayId]);

  const handleAction = (action: string) => {
    if (action === 'ADD_DEVICE') {
      navigation.navigate('AddDeviceScreen', { gatewayId });
    } else {
      console.log("Thêm mạng liên gia cho:", gatewayId);
    }
  };

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.topBar}>
        {/* Cột trái: Nút Back */}
        <View style={styles.sideColumn}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.leftBtn}>
            <MaterialIcons name="arrow-back-ios" size={22} color="#1E293B" />
          </TouchableOpacity>
        </View>

        {/* Cột giữa: Title */}
        <View style={styles.centerColumn}>
          <Text numberOfLines={1} style={styles.headerTitle}>ID: {gatewayId}</Text>
          <Text numberOfLines={1} style={styles.headerSub}>{item?.GATEWAY_NAME || 'Chưa đặt tên'}</Text>
        </View>

        {/* Cột phải: Dropdown - FIX mất bên phải */}
        <View style={styles.sideColumn}>
          <SelectDropdown
            data={actionMenu}
            onSelect={(selectedItem) => handleAction(selectedItem.action)}
            // Quan trọng: căn chỉnh dropdown đổ về bên trái
            dropdownStyle={styles.dropdownStyle}
            dropdownOverlayColor="rgba(0,0,0,0.2)"
            renderButton={() => (
              <View style={styles.rightBtn}>
                <MaterialIcons name="add-circle-outline" size={28} color="#2563EB" />
              </View>
            )}
            renderItem={(item, index) => (
              <View style={[styles.dropdownRow, { borderBottomWidth: index === 0 ? 0.5 : 0 }]}>
                <MaterialIcons name={item.icon} size={20} color="#2563EB" />
                <Text style={styles.dropdownText}>{item.title}</Text>
              </View>
            )}
          />
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        {[
          { id: 'DEVICE', label: 'Thiết bị', icon: 'sensors' },
          { id: 'LINK', label: 'Liên gia', icon: 'hub' },
        ].map((tab) => (
          <TouchableOpacity 
            key={tab.id}
            style={[styles.tabItem, activeTab === tab.id && styles.tabItemActive]}
            onPress={() => setActiveTab(tab.id as TabType)}
          >
            <MaterialIcons name={tab.icon as any} size={18} color={activeTab === tab.id ? '#2563EB' : '#6B7280'} />
            <Text style={[styles.tabText, activeTab === tab.id && styles.tabTextActive]}>{tab.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderSensorItem = ({ item: sensor, index }: any) => {
    const st = sensor.latestStatus;
    const isOnline = st?.ONLINE === 1;
    return (
      <Animated.View entering={FadeInDown.delay(index * 50)} style={styles.listItem}>
        <View style={[styles.iconWrap, { backgroundColor: isOnline ? '#DCFCE7' : '#F1F5F9' }]}>
          <MaterialIcons name="settings-remote" size={22} color={isOnline ? '#166534' : '#64748B'} />
        </View>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.itemTitle}>{sensor.DEVICE_NAME}</Text>
          <View style={styles.statusRow}>
            <View style={styles.miniParam}>
              <MaterialIcons name="battery-charging-full" size={12} color="#64748B" />
              <Text style={styles.miniText}>{st?.BATTERY ?? '--'}%</Text>
            </View>
            <View style={styles.miniParam}>
              <MaterialIcons name="wifi" size={12} color="#64748B" />
              <Text style={styles.miniText}>{st?.RSSI ?? '--'}dBm</Text>
            </View>
            <Text style={[styles.onlineStatus, { color: isOnline ? '#10B981' : '#EF4444' }]}>
              {isOnline ? '● Online' : '● Offline'}
            </Text>
          </View>
        </View>
        <MaterialIcons name="chevron-right" size={20} color="#CBD5E1" />
      </Animated.View>
    );
  };

  const renderLinkItem = ({ item: link, index }: any) => (
    <Animated.View entering={FadeInDown.delay(index * 50)} style={styles.listItem}>
      <View style={[styles.iconWrap, { backgroundColor: '#EFF6FF' }]}>
        <MaterialIcons name="router" size={22} color="#2563EB" />
      </View>
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={styles.itemTitle}>Kết nối: {link.GATEWAY_ID2}</Text>
        <Text style={styles.itemSub}>RSSI: {link.RSSI} dBm | Ch: {link.CHANNEL}</Text>
      </View>
      <Text style={styles.timeText}>{moment(link.TIME_STAMP).fromNow()}</Text>
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <FlatList
        data={activeTab === 'DEVICE' ? sensors : links}
        keyExtractor={(i, idx) => idx.toString()}
        ListHeaderComponent={renderHeader}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchData} tintColor="#2563EB" />}
        renderItem={activeTab === 'DEVICE' ? renderSensorItem : renderLinkItem}
        ListEmptyComponent={
          !loading ? (
            <View style={styles.empty}>
              <MaterialIcons name="inbox" size={48} color="#CBD5E1" />
              <Text style={{ color: '#94A3B8', marginTop: 8 }}>Không có dữ liệu</Text>
            </View>
          ) : (
            <ActivityIndicator style={{ marginTop: 30 }} color="#2563EB" />
          )
        }
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  headerContainer: { backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  topBar: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 12, 
    height: 60 
  },
  
  // 3 Cột để Title luôn ở giữa
  sideColumn: { width: 50 },
  centerColumn: { flex: 1, alignItems: 'center' },
  
  leftBtn: { paddingVertical: 8, paddingRight: 8 },
  rightBtn: { paddingVertical: 8, paddingLeft: 8, alignItems: 'flex-end' },

  headerTitle: { fontSize: 16, fontWeight: 'bold', color: '#1E293B' },
  headerSub: { fontSize: 11, color: '#64748B' },

  // --- FIX DROP DOWN ---
  dropdownStyle: { 
    borderRadius: 12, 
    width: 200, // Độ rộng menu
    backgroundColor: '#fff',
    marginTop: 5,
    // Thủ thuật: Di chuyển menu sang trái để không bị tràn màn hình
    // Nếu width là 200, ta dịch ngược lại khoảng 150 để menu đổ vào trong
    marginLeft: -150, 
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  dropdownRow: { flexDirection: 'row', alignItems: 'center', padding: 15, borderBottomColor: '#F1F5F9' },
  dropdownText: { fontSize: 14, marginLeft: 12, color: '#334155' },

  tabContainer: { flexDirection: 'row', paddingHorizontal: 16, marginTop: 8 },
  tabItem: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabItemActive: { borderBottomColor: '#2563EB' },
  tabText: { fontSize: 13, color: '#64748B', marginLeft: 6 },
  tabTextActive: { color: '#2563EB', fontWeight: 'bold' },

  listItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', marginHorizontal: 16, marginTop: 12, padding: 14, borderRadius: 16, elevation: 1 },
  iconWrap: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  itemTitle: { fontSize: 14, fontWeight: '600', color: '#1E293B' },
  itemSub: { fontSize: 11, color: '#64748B', marginTop: 3 },
  statusRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  miniParam: { flexDirection: 'row', alignItems: 'center', marginRight: 14 },
  miniText: { fontSize: 11, color: '#64748B', marginLeft: 4 },
  onlineStatus: { fontSize: 10, fontWeight: '700' },
  timeText: { fontSize: 10, color: '#94A3B8' },
  empty: { alignItems: 'center', marginTop: 60 }
});