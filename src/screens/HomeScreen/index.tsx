import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { 
  View, 
  FlatList, 
  StatusBar, 
  Text as RNText, 
  TouchableOpacity, 
  Alert, 
  RefreshControl, 
  ActivityIndicator 
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from '@react-native-vector-icons/material-icons';

import { useAppSelector } from '../../store/hooks';
import { styles } from './styles';
import { BannerSlider } from './components/BannerSlider';
import { BANNER_IMAGES } from './controller';
import { 
  getGatewayHeartbeatHistory, 
  getGatewaysByHomeId, 
  getHomesByUserId,
  getSensorsByHomeId, 
  getLinkStatusByHomeId, 
  renameSensor, 
  removeSensor, 
  clearLinkGatewayStatus,
  getNodeStatusHistory 
} from '../../services/api/common';
import { HomeHeader } from './components/HomeHeader';
import { GatewayItem } from './components/GatewayItem';
import { SensorItem } from './components/SensorItem'; 
import { LinkItem } from './components/LinkItem';

type TabType = 'GATEWAY' | 'DEVICE' | 'LINK';

export function HomeScreen() {
  const navigation = useNavigation<any>();
  const user = useAppSelector(state => state.smartHome.auth.user);

  const [activeTab, setActiveTab] = useState<TabType>('GATEWAY');
  const [listHomes, setListHomes] = useState<any[]>([]);
  const [selectedHouse, setSelectedHouse] = useState<any>(null);
  
  const [gateways, setGateways] = useState<any[]>([]);
  const [sensors, setSensors] = useState<any[]>([]);
  const [links, setLinks] = useState<any[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const dropdownData = useMemo(() => [
    ...listHomes, 
    { HOME_ID: 'MANAGE_ACTION', HOME_NAME: '⚙️ Quản lý nhà' }
  ], [listHomes]);

  // --- CÁC HÀM FETCH RIÊNG BIỆT CHO TỪNG TAB ---

  const fetchGateways = async (homeId: string) => {
    const res = await getGatewaysByHomeId(homeId);
    if (res.CODE === 1) {
      const data = await Promise.all(res.DATA.map(async (gw: any) => {
        const statusRes = await getGatewayHeartbeatHistory(gw.GATEWAY_ID, 1);
        return { ...gw, latestStatus: statusRes.DATA?.[0] || null };
      }));
      setGateways(data);
    }
  };

  const fetchSensors = async (homeId: string) => {
    const res = await getSensorsByHomeId(homeId);
    if (res.CODE === 1) {
      const sensorsWithStatus = await Promise.all(
        res.DATA.map(async (s: any) => {
          try {
            const stRes = await getNodeStatusHistory(s.SENSOR_ID, 1);
            const latest = stRes.DATA?.[0] || null;
            return { 
              ...s, 
              ONLINE: latest?.ONLINE ?? 0, 
              latestStatus: latest,
              BATTERY: latest?.BATTERY ?? s.BATTERY,
              RSSI: latest?.RSSI ?? s.RSSI,
              TIME_STAMP: latest?.TIME_STAMP || null
            };
          } catch (err) { return s; }
        })
      );
      setSensors(sensorsWithStatus);
    }
  };

  const fetchLinks = async (homeId: string) => {
    const res = await getLinkStatusByHomeId(homeId);
    if (res.CODE === 1) setLinks(res.DATA);
  };

  // --- GỌI TẤT CẢ DỮ LIỆU CÙNG LÚC (DÙNG KHI VÀO MÀN HÌNH HOẶC REFRESH) ---
  const fetchAllData = useCallback(async (isRefresh = false) => {
    if (!selectedHouse?.HOME_ID || selectedHouse.HOME_ID === 'MANAGE_ACTION') return;
    
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    const homeId = selectedHouse.HOME_ID;
    try {
      // Dùng Promise.all để chạy song song 3 API
      await Promise.all([
        fetchGateways(homeId),
        fetchSensors(homeId),
        fetchLinks(homeId)
      ]);
    } catch (e) {
      console.error("Fetch All Data Error:", e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [selectedHouse]);

  // Tự động load lại dữ liệu CỦA TAB ĐÓ khi người dùng chuyển Tab
  useEffect(() => {
    if (selectedHouse?.HOME_ID) {
      if (activeTab === 'GATEWAY') fetchGateways(selectedHouse.HOME_ID);
      else if (activeTab === 'DEVICE') fetchSensors(selectedHouse.HOME_ID);
      else if (activeTab === 'LINK') fetchLinks(selectedHouse.HOME_ID);
    }
  }, [activeTab]);

  // Load tất cả khi đổi nhà hoặc lần đầu vào
  useEffect(() => {
    fetchAllData();
  }, [selectedHouse]);

  useEffect(() => {
    const fetchHomes = async () => {
      if (!user?.USER_ID) return;
      try {
        const res = await getHomesByUserId(user.USER_ID);
        if (res.CODE === 1) {
          setListHomes(res.DATA);
          if (res.DATA.length > 0 && !selectedHouse) setSelectedHouse(res.DATA[0]);
        }
      } catch (error) { console.error(error); }
    };
    fetchHomes();
  }, [user?.USER_ID]);

  // --- HANDLERS CHO CÁC ACTION ---

  const handlePressSensor = (item: any) => {
    const nodeId = item?.SENSOR_ID ?? item?.NODE_ID;
    const deviceName = item?.DEVICE_NAME || `Thiết bị ${nodeId}`;
    const gatewayId = item?.GATEWAY_ID;
    navigation.navigate('HistorySensor', { nodeId, deviceName, gatewayId });
  };

  const onRename = (item: any) => {
    Alert.prompt("Đổi tên", "Nhập tên mới", [
      { text: "Hủy" },
      { text: "Lưu", onPress: async (name) => {
          if (name) {
            const res = await renameSensor(item.SENSOR_ID, name);
            if (res.CODE === 1) fetchSensors(selectedHouse.HOME_ID);
          }
      }}
    ], "plain-text", item.DEVICE_NAME);
  };

  const onRemove = (id: number) => {
    Alert.alert("Xác nhận", "Bạn muốn xóa cảm biến này?", [
      { text: "Hủy" },
      { text: "Xóa", style: 'destructive', onPress: async () => {
          const res = await removeSensor(id);
          if (res.CODE === 1) fetchSensors(selectedHouse.HOME_ID);
      }}
    ]);
  };

  const renderListHeader = () => (
    <>
      <Animated.View entering={FadeInDown.duration(600)}>
        <BannerSlider data={BANNER_IMAGES} />
      </Animated.View>
      <View style={styles.tabContainer}>
        {[
          { id: 'GATEWAY', label: `Gateway (${gateways.length})`, icon: 'router' },
          { id: 'DEVICE', label: `Thiết bị (${sensors.length})`, icon: 'sensors' },
          { id: 'LINK', label: `Liên gia (${links.length})`, icon: 'hub' },
        ].map((tab) => (
          <TouchableOpacity 
            key={tab.id} 
            style={[styles.tabItem, activeTab === tab.id && styles.tabItemActive]} 
            onPress={() => setActiveTab(tab.id as any)}
          >
            <MaterialIcons name={tab.icon as any} size={18} color={activeTab === tab.id ? '#2563EB' : '#6B7280'} />
            <RNText style={[styles.tabText, activeTab === tab.id && styles.tabTextActive]}>
              {tab.label}
            </RNText>
          </TouchableOpacity>
        ))}
      </View>
    </>
  );

  const getCurrentData = () => {
    if (activeTab === 'GATEWAY') return gateways;
    if (activeTab === 'DEVICE') return sensors;
    return links;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <HomeHeader 
        selectedHouse={selectedHouse} 
        dropdownData={dropdownData} 
        onSelectHouse={(item) => {
            if (item.HOME_ID === 'MANAGE_ACTION') navigation.navigate('ManagerHomeScreen');
            else setSelectedHouse(item);
        }}
        onPressAdd={() => navigation.navigate('ConfigDevice')} 
      />
      
      {loading && getCurrentData().length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <ActivityIndicator size="large" color="#2563EB" />
        </View>
      ) : (
        <FlatList
          data={getCurrentData()}
          keyExtractor={(item, index) => `${activeTab}_${index}`}
          ListHeaderComponent={renderListHeader}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => fetchAllData(true)} tintColor="#2563EB" />
          }
          renderItem={({ item, index }) => {
            if (activeTab === 'GATEWAY') {
              return <GatewayItem item={item} index={index} navigation={navigation} onHandlePress={() => setActiveTab('DEVICE')} onRefresh={() => fetchGateways(selectedHouse.HOME_ID)} />;
            }
            if (activeTab === 'DEVICE') {
              return <SensorItem item={item} index={index} onRefresh={() => fetchSensors(selectedHouse.HOME_ID)} onRename={onRename} onRemove={onRemove} onPress={() => handlePressSensor(item)} />;
            }
            return <LinkItem item={item} onClear={() => {
              const gwId = item.GATEWAY_ID;
              Alert.alert("Xóa lịch sử", "Xóa toàn bộ liên gia của Gateway này?", [
                { text: "Hủy" },
                { text: "Xóa", style: 'destructive', onPress: async () => {
                    const res = await clearLinkGatewayStatus(gwId);
                    if (res.CODE === 1) fetchLinks(selectedHouse.HOME_ID);
                }}
              ]);
            }} />;
          }}
          ListEmptyComponent={
            <View style={{ alignItems: 'center', marginTop: 40 }}>
              <RNText style={{ color: '#9CA3AF' }}>Không có dữ liệu</RNText>
            </View>
          }
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}
    </SafeAreaView>
  );
}