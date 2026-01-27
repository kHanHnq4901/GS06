import React, { useMemo, useState } from 'react';
import {
  View,
  FlatList,
  Image,
  StatusBar,
  Text as RNText,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import SelectDropdown from 'react-native-select-dropdown';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  GestureHandlerRootView, 
  Swipeable 
} from 'react-native-gesture-handler';

// Import Store & Utils
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { styles } from './styles';
import { BannerSlider } from './components/BannerSlider';
import { ACTIONS_DATA, BANNER_IMAGES, MOCK_GATEWAYS } from './controller';
import MaterialIcons from '@react-native-vector-icons/material-icons';

type TabType = 'GATEWAY' | 'DEVICE';

export function HomeScreen() {
  const navigation = useNavigation<any>();
  const user = useAppSelector(state => state.smartHome.auth.user);

  const [activeTab, setActiveTab] = useState<TabType>('GATEWAY');
  const [selectedGatewayId, setSelectedGatewayId] = useState<string | null>(null);

  const displayData = useMemo(() => {
    if (activeTab === 'GATEWAY') {
      return MOCK_GATEWAYS;
    } else {
      let devices: any[] = [];
      if (selectedGatewayId) {
        const gw = MOCK_GATEWAYS.find(g => g.id === selectedGatewayId);
        if (gw) devices = gw.devices.map(d => ({ ...d, gatewayName: gw.name }));
      } else {
        MOCK_GATEWAYS.forEach(gw => {
           const gwDevices = gw.devices.map(d => ({ ...d, gatewayName: gw.name }));
           devices = [...devices, ...gwDevices];
        });
      }
      return devices;
    }
  }, [activeTab, selectedGatewayId]);

  const handleTabPress = (tab: TabType) => {
    setActiveTab(tab);
    if (tab === 'GATEWAY') setSelectedGatewayId(null);
  };

  const handleGatewayPress = (gwId: string) => {
    setSelectedGatewayId(gwId);
    setActiveTab('DEVICE');
  };

  const handleDelete = (id: string, name: string) => {
    Alert.alert("Xác nhận", `Bạn có chắc chắn muốn xóa ${name}?`, [
      { text: "Hủy", style: "cancel" },
      { text: "Xóa", style: "destructive", onPress: () => console.log("Deleted:", id) }
    ]);
  };

  // --- RENDER RIGHT ACTIONS (Nút ẩn khi kéo ngang) ---
  const renderRightActions = (id: string, name: string) => (
    <View style={localStyles.swipeActionContainer}>
      <TouchableOpacity 
        style={[localStyles.swipeButton, { backgroundColor: '#3B82F6' }]}
        onPress={() => console.log("Edit:", id)}
      >
        <MaterialIcons name="edit" size={20} color="#fff" />
        <RNText style={localStyles.swipeButtonText}>Sửa</RNText>
      </TouchableOpacity>
      <TouchableOpacity 
        style={[localStyles.swipeButton, { backgroundColor: '#EF4444' }]}
        onPress={() => handleDelete(id, name)}
      >
        <MaterialIcons name="delete" size={20} color="#fff" />
        <RNText style={localStyles.swipeButtonText}>Xóa</RNText>
      </TouchableOpacity>
    </View>
  );

  const renderListHeader = () => (
    <>
      <Animated.View entering={FadeInDown.duration(600)}>
        <BannerSlider data={BANNER_IMAGES} />
      </Animated.View>
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tabItem, activeTab === 'GATEWAY' && styles.tabItemActive]}
          onPress={() => handleTabPress('GATEWAY')}
        >
          <MaterialIcons name="router" size={20} color={activeTab === 'GATEWAY' ? '#2563EB' : '#6B7280'} />
          <RNText style={[styles.tabText, activeTab === 'GATEWAY' && styles.tabTextActive]}>Gateway</RNText>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tabItem, activeTab === 'DEVICE' && styles.tabItemActive]}
          onPress={() => handleTabPress('DEVICE')}
        >
          <MaterialIcons name="sensors" size={20} color={activeTab === 'DEVICE' ? '#2563EB' : '#6B7280'} />
          <RNText style={[styles.tabText, activeTab === 'DEVICE' && styles.tabTextActive]}>Thiết bị {selectedGatewayId ? '(Lọc)' : ''}</RNText>
        </TouchableOpacity>
      </View>
    </>
  );

  // --- ITEM: GATEWAY ---
  const renderGatewayItem = ({ item, index }: { item: any, index: number }) => (
  <GestureHandlerRootView>
    <Swipeable renderRightActions={() => renderRightActions(item.id, item.name)} friction={2}>
      <Animated.View entering={FadeInDown.delay(index * 100).springify()}>
        <TouchableOpacity 
          style={styles.cardGateway} 
          activeOpacity={0.8} 
          onPress={() => handleGatewayPress(item.id)}
        >
          <View style={styles.rowBetween}>
            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
              <Image source={require('../../asset/images/device/gateway.webp')} style={styles.gwImage} resizeMode="contain" />
              <View style={{ marginLeft: 10 }}>
                <RNText style={styles.gwName}>{item.name}</RNText>
                <RNText style={styles.gwSerial}>{item.serial}</RNText>
              </View>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              
              {/* --- SỬA TẠI ĐÂY: Navigate sang CreateQrGateway --- */}
              <TouchableOpacity 
                style={{ padding: 6 }} 
                onPress={() => navigation.navigate('CreateQrGateway', item)}
              >
                <MaterialIcons name="qr-code-scanner" size={22} color="#4B5563" />
              </TouchableOpacity>

              <TouchableOpacity 
                style={{ padding: 6, marginRight: 4 }} 
                onPress={() => navigation.navigate('HistoryGateway', item)}
              >
                <MaterialIcons name="history" size={22} color="#2563EB" />
              </TouchableOpacity>

              <View style={[styles.statusBadge, { backgroundColor: item.isOnline ? '#DCFCE7' : '#FEE2E2' }]}>
                <RNText style={{ color: item.isOnline ? '#166534' : '#991B1B', fontSize: 10, fontWeight: 'bold' }}>
                  {item.isOnline ? 'ONLINE' : 'OFFLINE'}
                </RNText>
              </View>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.rowBetween}>
            <View>
              <View style={styles.paramRow}>
                <MaterialIcons name="battery-full" size={14} color="#4B5563" />
                <RNText style={styles.paramText}>Pin: {item.batteryVoltage}</RNText>
              </View>
              <View style={styles.paramRow}>
                <MaterialIcons name="power" size={14} color="#2563EB" />
                <RNText style={styles.paramText}>Nguồn: {item.powerSource}</RNText>
              </View>
            </View>
            <View>
              <View style={styles.paramRow}>
                <MaterialIcons name="thermostat" size={14} color="#DC2626" />
                <RNText style={styles.paramText}>Nhiệt độ: {item.temperature}</RNText>
              </View>
              <View style={styles.paramRow}>
                <MaterialIcons name="wifi" size={14} color="#059669" />
                <RNText style={styles.paramText}>Wifi: {item.wifiSignal} dBm</RNText>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    </Swipeable>
  </GestureHandlerRootView>
);

  // --- ITEM: DEVICE ---
  const renderDeviceItem = ({ item, index }: { item: any, index: number }) => (
    <GestureHandlerRootView>
      <Swipeable renderRightActions={() => renderRightActions(item.id, item.name)} overshootRight={false}>
        <Animated.View entering={FadeInDown.delay(index * 50).duration(400)}>
          <TouchableOpacity style={styles.cardDevice} activeOpacity={0.7} onPress={() => navigation.navigate('HistorySensor', item)}>
            <View style={styles.rowBetween}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={[styles.iconBox, { backgroundColor: item.name.includes('nhiệt') ? '#FEF3C7' : '#E0F2FE' }]}>
                  <MaterialIcons name={item.name.includes('nhiệt') ? "whatshot" : "sensors"} size={24} color={item.name.includes('nhiệt') ? "#D97706" : "#0284C7"} />
                </View>
                <View style={{ marginLeft: 12 }}>
                  <RNText style={styles.deviceName}>{item.location}</RNText>
                  <RNText style={styles.deviceSub}>{item.name} • {item.gatewayName}</RNText>
                </View>
              </View>
              <MaterialIcons name="chevron-right" size={20} color="#D1D5DB" />
            </View>
            <View style={[styles.rowBetween, { marginTop: 12 }]}>
              <View style={styles.tag}><MaterialIcons name="battery-std" size={12} color="#4B5563" /><RNText style={styles.tagText}>{item.battery}</RNText></View>
              <View style={styles.tag}><MaterialIcons name="rss-feed" size={12} color="#4B5563" /><RNText style={styles.tagText}>RF: {item.rfSignal}dBm</RNText></View>
              {item.error ? <View style={[styles.tag, { backgroundColor: '#FEE2E2' }]}><MaterialIcons name="error-outline" size={12} color="#DC2626" /><RNText style={[styles.tagText, { color: '#DC2626' }]}>{item.error}</RNText></View> : <View />}
            </View>
          </TouchableOpacity>
        </Animated.View>
      </Swipeable>
    </GestureHandlerRootView>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.container}>
        <View style={styles.header}>
          <View>
            <RNText style={styles.hello}>Xin chào, {user?.USER_NAME || "Người dùng"}</RNText>
            <RNText style={styles.subHello}>Chúc bạn ngày mới an toàn!</RNText>
          </View>
          <SelectDropdown
            data={ACTIONS_DATA}
            onSelect={(selectedItem) => {
              // Navigate dựa trên thuộc tính route đã định nghĩa trong ACTIONS_DATA
              if (selectedItem.route) {
                navigation.navigate(selectedItem.route);
              }
            }}
            renderButton={() => (
              <View style={styles.addBtn}>
                <RNText style={styles.addIcon}>＋</RNText>
              </View>
            )}
            renderItem={(item, index) => (
              <View style={{ 
                ...styles.dropdownRow, 
                borderBottomWidth: index === ACTIONS_DATA.length - 1 ? 0 : 1 
              }}>
                <MaterialIcons 
                  name={item.icon} 
                  size={22} 
                  color={item.color} 
                  style={{ marginRight: 12 }} 
                />
                <RNText style={styles.dropdownText}>{item.title}</RNText>
              </View>
            )}
            dropdownStyle={styles.dropdown} 
          />
        </View>

        <FlatList
          data={displayData}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={renderListHeader}
          contentContainerStyle={{ paddingBottom: selectedGatewayId ? 100 : 20 }}
          showsVerticalScrollIndicator={false}
          renderItem={activeTab === 'GATEWAY' ? renderGatewayItem : renderDeviceItem}
        />

        {selectedGatewayId && (
          <View style={localStyles.footerContainer}>
            <TouchableOpacity style={localStyles.checkAllBtn} onPress={() => console.log('Check All')}>
              <MaterialIcons name="fact-check" size={22} color="#fff" />
              <RNText style={localStyles.checkAllText}>Kiểm tra tất cả thiết bị</RNText>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  swipeActionContainer: {
    flexDirection: 'row',
    width: 140,
    marginBottom: 12,
    marginRight: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  swipeButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  swipeButtonText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
    marginTop: 4,
  },
  footerContainer: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    backgroundColor: 'white',
    padding: 16,
    borderTopWidth: 1,
    borderColor: '#E5E7EB',
  },
  checkAllBtn: {
    backgroundColor: '#2563EB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
  },
  checkAllText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  }
});