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
  clearLinkGatewayStatus 
} from '../../services/api/common';
import { HomeHeader } from './components/HomeHeader';
import { GatewayItem } from './components/GatewayItem';
import { SensorItem } from '../../component/SensorItem'; // Component chứa onPress của bạn
import { LinkItem } from '../../component/LinkItem';

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

  // --- HÀM ĐIỀU HƯỚNG SANG LỊCH SỬ ---
  const handlePressSensor = (item: any) => {
    navigation.navigate('HistorySensorScreen', { 
      nodeId: item.SENSOR_ID, 
      deviceName: item.DEVICE_NAME
    });
  };

  const fetchData = useCallback(async () => {
    if (!selectedHouse?.HOME_ID || selectedHouse.HOME_ID === 'MANAGE_ACTION') return;
    setLoading(true);
    const homeId = selectedHouse.HOME_ID;

    try {
      if (activeTab === 'GATEWAY') {
        const res = await getGatewaysByHomeId(homeId);
        if (res.CODE === 1) {
          const data = await Promise.all(res.DATA.map(async (gw: any) => {
            const statusRes = await getGatewayHeartbeatHistory(gw.GATEWAY_ID, 1);
            return { ...gw, latestStatus: statusRes.DATA?.[0] || null };
          }));
          setGateways(data);
        }
      } else if (activeTab === 'DEVICE') {
        const res = await getSensorsByHomeId(homeId);
        if (res.CODE === 1) setSensors(res.DATA);
      } else if (activeTab === 'LINK') {
        const res = await getLinkStatusByHomeId(homeId);
        if (res.CODE === 1) setLinks(res.DATA);
      }
    } catch (e) {
      console.error("Fetch Data Error:", e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [selectedHouse, activeTab]);

  useEffect(() => {
    const fetchHomes = async () => {
      if (!user?.USER_ID) return;
      try {
        const res = await getHomesByUserId(user.USER_ID);
        if (res.CODE === 1) {
          setListHomes(res.DATA);
          if (res.DATA.length > 0 && !selectedHouse) setSelectedHouse(res.DATA[0]);
        }
      } catch (error) {
        console.error("Fetch Homes Error:", error);
      }
    };
    fetchHomes();
  }, [user?.USER_ID]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // --- Handlers cho API ---
  const onRename = (item: any) => {
    Alert.prompt("Đổi tên", "Nhập tên mới", [
      { text: "Hủy" },
      { text: "Lưu", onPress: async (name) => {
          if (name) {
            const res = await renameSensor(item.SENSOR_ID, name);
            if (res.CODE === 1) fetchData();
          }
      }}
    ], "plain-text", item.DEVICE_NAME);
  };

  const onRemove = (id: number) => {
    Alert.alert("Xác nhận", "Bạn muốn xóa cảm biến này?", [
      { text: "Hủy" },
      { text: "Xóa", style: 'destructive', onPress: async () => {
          const res = await removeSensor(id);
          if (res.CODE === 1) fetchData();
      }}
    ]);
  };

  const onClearLink = (gwId: number) => {
    Alert.alert("Xóa lịch sử", "Xóa toàn bộ liên gia của Gateway này?", [
      { text: "Hủy" },
      { text: "Xóa", style: 'destructive', onPress: async () => {
          const res = await clearLinkGatewayStatus(gwId);
          if (res.CODE === 1) fetchData();
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
            <MaterialIcons 
               name={tab.icon as any} 
               size={18} 
               color={activeTab === tab.id ? '#2563EB' : '#6B7280'} 
            />
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
        onSelectHouse={(item) => item.HOME_ID === 'MANAGE_ACTION' 
          ? navigation.navigate('ManagerHomeScreen') 
          : setSelectedHouse(item)
        }
        onPressAdd={() => navigation.navigate('ConfigDevice')} 
      />
      
      {loading && !refreshing && getCurrentData().length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <ActivityIndicator size="large" color="#2563EB" />
        </View>
      ) : (
        <FlatList
          data={getCurrentData()}
          keyExtractor={(item, index) => `${activeTab}_${index}`}
          ListHeaderComponent={renderListHeader}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={() => { setRefreshing(true); fetchData(); }} 
              tintColor="#2563EB" 
            />
          }
          renderItem={({ item, index }) => {
            if (activeTab === 'GATEWAY') {
              return (
                <GatewayItem 
                  item={item} 
                  index={index} 
                  navigation={navigation} 
                  onHandlePress={() => setActiveTab('DEVICE')} 
                  onRefresh={fetchData}
                />
              );
            }
            // Trong HomeScreen.tsx
            const handlePressSensor = (item: any) => {
              console.log("Nhấn vào sensor:", item.SENSOR_ID); // Thêm log để kiểm tra
              navigation.navigate('HistorySensorScreen', { 
                nodeId: item.SENSOR_ID, 
                deviceName: item.DEVICE_NAME || `Thiết bị ${item.SENSOR_ID}`
              });
            };

            // Trong FlatList renderItem:
            if (activeTab === 'DEVICE') {
              return (
                <SensorItem 
                  item={item} 
                  index={index} 
                  onRename={onRename} 
                  onRemove={onRemove} 
                  onPress={() => handlePressSensor(item)} // Nên bọc arrow function ở đây
                />
              );
            }
            return <LinkItem item={item} onClear={onClearLink} />;
          }}
          ListEmptyComponent={
            <View style={{ alignItems: 'center', marginTop: 40 }}>
              <RNText style={{ color: '#9CA3AF' }}>Không có dữ liệu</RNText>
            </View>
          }
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </SafeAreaView>
  );
}