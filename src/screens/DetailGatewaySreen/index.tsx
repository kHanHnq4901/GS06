import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import SelectDropdown from 'react-native-select-dropdown';
import { useNavigation, useRoute } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// API Services
import { 
  getSensorsByGateway, 
  getLinkGatewayStatus, 
  getNodeStatusHistory,
} from '../../services/api/common';

// Tái sử dụng các Components đã tách
import { SensorItem } from '../../component/SensorItem';
import { LinkItem } from '../../component/LinkItem';
import { styles } from './styles';
import { TabType } from './types';


import { handleButton } from './handleButton'; // Import file vừa tạo

export function DetailGatewayScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const item = route.params as any;
  const gatewayId = item?.GATEWAY_ID || 'N/A';

  const [activeTab, setActiveTab] = useState<TabType>('DEVICE');
  const [loading, setLoading] = useState(false);
  const [sensors, setSensors] = useState<any[]>([]);
  const [links, setLinks] = useState<any[]>([]);

  const fetchData = useCallback(async () => {
    if (!gatewayId || gatewayId === 'N/A') return;
    setLoading(true);
    try {
      const [resSensors, resLinks] = await Promise.all([
        getSensorsByGateway(gatewayId),
        getLinkGatewayStatus(gatewayId)
      ]);

      if (resSensors.CODE === 1) {
        const sensorsWithStatus = await Promise.all(
          resSensors.DATA.map(async (s: any) => {
            const stRes = await getNodeStatusHistory(s.SENSOR_ID, 1);
            return { 
              ...s, 
              ONLINE: stRes.DATA?.[0]?.ONLINE ?? 0, 
              latestStatus: stRes.DATA?.[0] || null 
            };
          })
        );
        setSensors(sensorsWithStatus);
      }
      if (resLinks.CODE === 1) setLinks(resLinks.DATA);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [gatewayId]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Khởi tạo các handlers từ file tách riêng
  const { onRename, onRemove, onClearLink, onActionMenu } = handleButton(
    gatewayId, 
    fetchData, 
    navigation
  );

  const actionMenu = [
    { title: 'Thêm thiết bị', icon: 'add-circle-outline', action: 'ADD_DEVICE' },
    { title: 'Thêm mạng liên gia', icon: 'qr-code-scanner', action: 'ADD_LINK' },
  ];

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.topBar}>
        <View style={styles.sideColumn}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.leftBtn}>
            <MaterialIcons name="arrow-back-ios" size={22} color="#1E293B" />
          </TouchableOpacity>
        </View>

        <View style={styles.centerColumn}>
          <Text numberOfLines={1} style={styles.headerTitle}>ID: {gatewayId}</Text>
          <Text numberOfLines={1} style={styles.headerSub}>{item?.GATEWAY_NAME || 'Chi tiết Gateway'}</Text>
        </View>

        <View style={styles.sideColumn}>
          <SelectDropdown
            data={actionMenu}
            onSelect={(selectedItem) => onActionMenu(selectedItem.action)} // Sử dụng handler mới
            dropdownStyle={styles.dropdownStyle}
            dropdownOverlayColor="rgba(0,0,0,0.1)"
            renderButton={() => (
              <View style={styles.rightBtn}>
                <MaterialIcons name="add-circle-outline" size={28} color="#2563EB" />
              </View>
            )}
            renderItem={(item, index) => (
              <View style={[styles.dropdownRow, { borderBottomWidth: index === actionMenu.length - 1 ? 0 : 0.5 }]}>
                <MaterialIcons name={item.icon as any} size={22} color="#2563EB" />
                <Text style={styles.dropdownText}>{item.title}</Text>
              </View>
            )}
          />
        </View>
      </View>

      <View style={styles.tabContainer}>
        {[
          { id: 'DEVICE', label: 'Thiết bị', count: sensors.length, icon: 'sensors' },
          { id: 'LINK', label: 'Liên gia', count: links.length, icon: 'hub' },
        ].map((tab) => (
          <TouchableOpacity 
            key={tab.id}
            style={[styles.tabItem, activeTab === tab.id && styles.tabItemActive]}
            onPress={() => setActiveTab(tab.id as TabType)}
          >
            <MaterialIcons name={tab.icon as any} size={18} color={activeTab === tab.id ? '#2563EB' : '#6B7280'} />
            <Text style={[styles.tabText, activeTab === tab.id && styles.tabTextActive]}>
              {tab.label} ({loading && tab.count === 0 ? '...' : tab.count})
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container} edges={['top']}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <FlatList
          data={activeTab === 'DEVICE' ? sensors : links}
          keyExtractor={(i, idx) => idx.toString()}
          ListHeaderComponent={renderHeader}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchData} tintColor="#2563EB" />}
          renderItem={({ item, index }) => (
            activeTab === 'DEVICE' 
              ? <SensorItem item={item} index={index} onRename={onRename} onRemove={onRemove}  onPress={handlePressSensor}/>
              : <LinkItem item={item} index={index} onClear={onClearLink} />
          )}
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
    </GestureHandlerRootView>
  );
}

