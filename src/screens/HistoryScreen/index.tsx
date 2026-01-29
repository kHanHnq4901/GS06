import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  FlatList,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Text, Searchbar } from 'react-native-paper';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import moment from 'moment';
import { styles } from './styles';
import { useAppSelector } from '../../store/hooks';
import { 
  getActionDisplay, 

} from './handleButton';
import { getFireAlarmHistory, getGatewaysByHomeId, getHomesByUserId } from '../../services/api/common';

export function HistoryScreen() {
  const user = useAppSelector(state => state.smartHome.auth.user);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);

  const loadAllGatewaysHistory = useCallback(async () => {
    if (!user?.USER_ID) return;

    try {
      if (!refreshing) setLoading(true);

      // Bước 1: Lấy danh sách Nhà của User
      const homesRes = await getHomesByUserId(user.USER_ID);
      if (homesRes.CODE !== 1) throw new Error("Không lấy được danh sách nhà");

      // Bước 2: Lấy danh sách toàn bộ Gateway từ tất cả các nhà
      const allGateways: any[] = [];
      await Promise.all(
        homesRes.DATA.map(async (home: any) => {
          const gwRes = await getGatewaysByHomeId(home.HOME_ID);
          if (gwRes.CODE === 1) allGateways.push(...gwRes.DATA);
        })
      );

      // Bước 3: Lấy lịch sử của từng Gateway
      const allHistory: any[] = [];
      await Promise.all(
        allGateways.map(async (gw: any) => {
          const histRes = await getFireAlarmHistory(gw.GATEWAY_ID);
          if (histRes.CODE === 1) {
            // Gắn thêm tên Gateway vào mỗi bản ghi để dễ nhận diện
            const historyWithGwInfo = histRes.DATA.map((h: any) => ({
              ...h,
              GATEWAY_NAME: gw.GATEWAY_NAME
            }));
            allHistory.push(...historyWithGwInfo);
          }
        })
      );

      // Bước 4: Sắp xếp theo thời gian mới nhất (vì gom từ nhiều nguồn)
      const sortedHistory = allHistory.sort((a, b) => 
        moment(b.TIME_STAMP).valueOf() - moment(a.TIME_STAMP).valueOf()
      );

      setHistoryData(sortedHistory);
      setFilteredData(sortedHistory);
    } catch (error) {
      console.error("Lỗi tổng hợp lịch sử:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user?.USER_ID]);

  useEffect(() => {
    loadAllGatewaysHistory();
  }, [loadAllGatewaysHistory]);

  const onSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = historyData.filter((item: any) => 
      item.ACTION?.toLowerCase().includes(query.toLowerCase()) || 
      item.SRCID?.toString().includes(query) ||
      item.GATEWAY_NAME?.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredData(filtered);
  };

  const renderItem = ({ item, index }: { item: any; index: number }) => {
    const actionConfig = getActionDisplay(item.ACTION);
    
    return (
      <Animated.View
        entering={FadeInUp.delay(index * 30)}
        style={[styles.card, { borderLeftColor: actionConfig.color, borderLeftWidth: 5 }]}
      >
        <View style={[styles.iconWrap, { backgroundColor: actionConfig.color + '15' }]}>
          <Text style={styles.icon}>{actionConfig.icon}</Text>
        </View>

        <View style={{ flex: 1 }}>
          <View style={styles.rowBetween}>
            <Text style={[styles.title, { color: actionConfig.color }]}>{actionConfig.text}</Text>
            <View style={[styles.badgeWarning, { backgroundColor: actionConfig.color }]}>
              <Text style={styles.badgeText}>{actionConfig.badge}</Text>
            </View>
          </View>

          <Text style={styles.place}>
            🏢 {item.GATEWAY_NAME} • {item.SRCTYPE || 'Cảm biến'}
          </Text>
          <Text style={styles.address}>
            📍 Node: {item.SRCID} | Tín hiệu: {item.RSSI || 'N/A'} dBm
          </Text>

          <View style={styles.timeRow}>
            <Text style={styles.time}>
              ⏱ {moment(item.TIME_STAMP).format('HH:mm:ss DD/MM/YYYY')}
            </Text>
          </View>
        </View>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" />
      
      <Searchbar
        placeholder="Tìm theo ID, sự kiện, Gateway..."
        onChangeText={onSearch}
        value={searchQuery}
        style={styles.search}
        inputStyle={{ fontSize: 14 }}
      />

      {loading && !refreshing ? (
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <ActivityIndicator size="large" color="#2563EB" />
          <Text style={{ textAlign: 'center', marginTop: 10, color: '#6B7280' }}>
            Đang tổng hợp dữ liệu...
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredData}
          keyExtractor={(item, i) => i.toString()}
          contentContainerStyle={{ paddingBottom: 20, paddingHorizontal: 16 }}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={() => { setRefreshing(true); loadAllGatewaysHistory(); }} 
            />
          }
          ListEmptyComponent={
            <Text style={{ textAlign: 'center', marginTop: 50, color: '#9CA3AF' }}>
              Không có dữ liệu lịch sử nào
            </Text>
          }
        />
      )}
    </SafeAreaView>
  );
}