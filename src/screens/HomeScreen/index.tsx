import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  FlatList,
  Image,
  StatusBar,
  Text as RNText,
  TouchableOpacity,
  Alert,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import SelectDropdown from 'react-native-select-dropdown';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import moment from 'moment';

// Import Store & Utils
import { useAppSelector } from '../../store/hooks';
import { styles } from './styles';
import { BannerSlider } from './components/BannerSlider';
import { ACTIONS_DATA, BANNER_IMAGES, MOCK_GATEWAYS } from './controller';
import { MqttProtocolService } from '../../services/mqtt';
import { getGatewayHeartbeatHistory, getGatewaysByHomeId, getGatewayStatusHistory, getHomesByUserId } from '../../services/api/common';
import { HomeHeader } from './components/HomeHeader';
import { GatewayItem } from './components/GatewayItem';


type TabType = 'GATEWAY' | 'DEVICE';

export function HomeScreen() {
  const navigation = useNavigation<any>();
  const user = useAppSelector(state => state.smartHome.auth.user);

  const [activeTab, setActiveTab] = useState<TabType>('GATEWAY');
  const [listHomes, setListHomes] = useState<any[]>([]);
  const [selectedHouse, setSelectedHouse] = useState<any>(null);
  const [gateways, setGateways] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const dropdownData = useMemo(() => [...listHomes, { HOME_ID: 'MANAGE_ACTION', HOME_NAME: '⚙️ Quản lý nhà' }], [listHomes]);

  const fetchHomes = useCallback(async () => {
    if (!user?.USER_ID) return;
    const res = await getHomesByUserId(user.USER_ID);
    if (res.CODE === 1) {
      setListHomes(res.DATA);
      if (res.DATA.length > 0 && !selectedHouse) setSelectedHouse(res.DATA[0]);
    }
  }, [user?.USER_ID, selectedHouse]);

  const fetchGateways = useCallback(async () => {
    if (!selectedHouse?.HOME_ID || selectedHouse.HOME_ID === 'MANAGE_ACTION') return;
    setLoading(true);
    try {
      const res = await getGatewaysByHomeId(selectedHouse.HOME_ID);
      if (res.CODE === 1 && res.DATA) {
        const gatewaysWithStatus = await Promise.all(res.DATA.map(async (gw: any) => {
          const statusRes = await getGatewayHeartbeatHistory(gw.GATEWAY_ID, 1);
          return { ...gw, latestStatus: statusRes.DATA?.[0] || null };
        }));
        setGateways(gatewaysWithStatus);
      } else setGateways([]);
    } finally { setLoading(false); setRefreshing(false); }
  }, [selectedHouse]);

  useEffect(() => { fetchHomes(); }, [fetchHomes]);
  useEffect(() => { fetchGateways(); }, [fetchGateways]);

  const renderListHeader = () => (
    <>
      <Animated.View entering={FadeInDown.duration(600)}>
        <BannerSlider data={BANNER_IMAGES} />
      </Animated.View>
      <View style={styles.tabContainer}>
        {[
          { id: 'GATEWAY', label: `Gateway (${gateways.length})`, icon: 'router' },
          { id: 'DEVICE', label: 'Thiết bị', icon: 'sensors' },
          { id: 'LINK', label: 'Liên gia', icon: 'hub' }, // Tab mới
        ].map((tab) => (
          <TouchableOpacity 
            key={tab.id} 
            style={[styles.tabItem, activeTab === tab.id && styles.tabItemActive]} 
            onPress={() => setActiveTab(tab.id as TabType)}
          >
            <MaterialIcons 
              name={tab.icon as any} 
              size={20} 
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <HomeHeader 
        selectedHouse={selectedHouse} 
        dropdownData={dropdownData} 
        onSelectHouse={(item) => item.HOME_ID === 'MANAGE_ACTION' ? navigation.navigate('ManagerHomeScreen') : setSelectedHouse(item)}
        actionsData={ACTIONS_DATA}
        onSelectAction={(item) => item.route && navigation.navigate(item.route)}
      />
      {loading && !refreshing && gateways.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center' }}><ActivityIndicator size="large" color="#2563EB" /></View>
      ) : (
        <FlatList
          data={activeTab === 'GATEWAY' ? gateways : []}
          keyExtractor={(item) => (item.GATEWAY_ID || item.id)?.toString()}
          ListHeaderComponent={renderListHeader}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchGateways(); }} tintColor="#2563EB" />}
          renderItem={({ item, index }) => <GatewayItem item={item} index={index} navigation={navigation} onHandlePress={(id) => setActiveTab('DEVICE')} onRefresh={fetchGateways}/>}
          ListEmptyComponent={<View style={{ alignItems: 'center', marginTop: 40 }}><RNText style={{ color: '#9CA3AF' }}>Không có dữ liệu</RNText></View>}
        />
      )}
    </SafeAreaView>
  );
}