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
import moment from 'moment';

// API & MQTT Services
import { 
  getSensorsByGateway, 
  getLinkGatewayStatus, 
  getNodeStatusHistory,
} from '../../services/api/common';
import { MqttProtocolService } from '../../services/mqtt';

// Components
import { SensorItem } from '../HomeScreen/components/SensorItem';
import { LinkItem } from '../HomeScreen/components/LinkItem';
import { styles } from './styles';
import { TabType } from './types';
import { handleButton } from './handleButton';

export function DetailGatewayScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const item = route.params as any;
  const gatewayId = item?.GATEWAY_ID || 'N/A';

  const [activeTab, setActiveTab] = useState<TabType>('DEVICE');
  const [loading, setLoading] = useState(false);
  const [checkingAll, setCheckingAll] = useState(false); 
  const [sensors, setSensors] = useState<any[]>([]);
  const [links, setLinks] = useState<any[]>([]);

  // 1. Logic điều hướng sang lịch sử sensor
  const handlePressSensor = (sensor: any) => {
    const nodeId = sensor?.SENSOR_ID ?? sensor?.NODE_ID;
    const deviceName = sensor?.DEVICE_NAME || `Thiết bị ${nodeId}`;
    navigation.navigate('HistorySensor', { nodeId, deviceName, gatewayId });
  };

  // 2. Logic kiểm tra tất cả thiết bị (MQTT scope 0)
  const handleTestAllDevices = async () => {
    if (!gatewayId || gatewayId === 'N/A') return;

    Alert.alert(
      "Xác nhận",
      "Gửi lệnh kiểm tra tới toàn bộ thiết bị thuộc Gateway này?",
      [
        { text: "Hủy", style: "cancel" },
        { 
          text: "Bắt đầu", 
          onPress: async () => {
            setCheckingAll(true);
            try {
              const response = await MqttProtocolService.testDevice(gatewayId, 0, "");
              
              if (response.status === 'success') {
                Alert.alert("Thành công", "Lệnh kiểm tra toàn hệ thống đã được gửi.");
              } else if (response.status === 'failure') {
                Alert.alert("Thất bại", "Gateway phản hồi lỗi xử lý.");
              } else {
                Alert.alert("Lỗi", "Không nhận được phản hồi từ Gateway (Timeout).");
              }
            } catch (error) {
              Alert.alert("Lỗi", "Lỗi kết nối MQTT.");
            } finally {
              setCheckingAll(false);
            }
          }
        }
      ]
    );
  };

  // 3. Hàm lấy dữ liệu Sensor kèm Status mới nhất
  const fetchData = useCallback(async () => {
    if (!gatewayId || gatewayId === 'N/A') return;
    setLoading(true);
    try {
      const [resSensors, resLinks] = await Promise.all([
        getSensorsByGateway(gatewayId),
        getLinkGatewayStatus(gatewayId)
      ]);

      if (resSensors.CODE === 1) {
        // Lấy thông tin bản ghi cuối cho từng Sensor để hiển thị Pin/Sóng/Online
        const sensorsWithStatus = await Promise.all(
          resSensors.DATA.map(async (s: any) => {
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
            } catch (err) {
              return s;
            }
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

  const { onRename, onRemove, onClearLink, onActionMenu } = handleButton(gatewayId, fetchData, navigation);

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
            onSelect={(selectedItem) => onActionMenu(selectedItem.action)}
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
              ? <SensorItem 
                  item={item} 
                  index={index} 
                  onRename={onRename} 
                  onRemove={onRemove} 
                  onRefresh={fetchData}
                  onPress={() => handlePressSensor(item)}
                />
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
          contentContainerStyle={{ paddingBottom: activeTab === 'DEVICE' ? 100 : 20 }}
        />

        {/* NÚT KIỂM TRA TẤT CẢ (DƯỚI CÙNG) */}
        {activeTab === 'DEVICE' && sensors.length > 0 && (
          <View style={localStyles.footerFixed}>
            <TouchableOpacity 
              style={[localStyles.btnCheckAll, checkingAll && { backgroundColor: '#94A3B8' }]}
              onPress={handleTestAllDevices}
              disabled={checkingAll}
            >
              {checkingAll ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                  <MaterialIcons name="fact-check" size={22} color="#fff" />
                  <Text style={localStyles.btnCheckAllText}>Kiểm tra tất cả thiết bị</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const localStyles = StyleSheet.create({
  footerFixed: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  btnCheckAll: {
    backgroundColor: '#2563EB',
    height: 52,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnCheckAllText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  }
});