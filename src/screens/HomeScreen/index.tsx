import React, { useMemo, useState } from 'react';
import {
  View,
  FlatList,
  Image,
  StatusBar,
  Text as RNText,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Text } from 'react-native-paper';
import Animated, { FadeInDown, Layout } from 'react-native-reanimated';
import SelectDropdown from 'react-native-select-dropdown';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Import Store & Utils
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { styles } from './styles';
import { BannerSlider } from './components/BannerSlider';
import { ACTIONS_DATA, BANNER_IMAGES, MOCK_GATEWAYS } from './controller';
import MaterialIcons from '@react-native-vector-icons/material-icons';

type TabType = 'GATEWAY' | 'DEVICE';

export function HomeScreen() {
  const navigation = useNavigation<any>(); // Thêm <any> để tránh lỗi TS khi navigate
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.smartHome.auth.user);

  // State quản lý Tab và Filter
  const [activeTab, setActiveTab] = useState<TabType>('GATEWAY');
  const [selectedGatewayId, setSelectedGatewayId] = useState<string | null>(null);

  // Lấy danh sách thiết bị dựa trên tab và filter
  const displayData = useMemo(() => {
    if (activeTab === 'GATEWAY') {
      return MOCK_GATEWAYS;
    } else {
      // Nếu ở tab DEVICE
      let devices: any[] = [];
      
      // Nếu đã chọn Gateway cụ thể -> Lọc thiết bị của Gateway đó
      if (selectedGatewayId) {
        const gw = MOCK_GATEWAYS.find(g => g.id === selectedGatewayId);
        if (gw) devices = gw.devices.map(d => ({ ...d, gatewayName: gw.name }));
      } else {
        // Nếu không -> Lấy tất cả thiết bị từ tất cả Gateway (Flatten)
        MOCK_GATEWAYS.forEach(gw => {
           const gwDevices = gw.devices.map(d => ({ ...d, gatewayName: gw.name }));
           devices = [...devices, ...gwDevices];
        });
      }
      return devices;
    }
  }, [activeTab, selectedGatewayId]);

  // Xử lý chuyển Tab
  const handleTabPress = (tab: TabType) => {
    setActiveTab(tab);
    if (tab === 'GATEWAY') {
      setSelectedGatewayId(null); // Reset filter khi quay về tab Gateway
    }
  };

  // Xử lý khi ấn vào Gateway Item (để lọc)
  const handleGatewayPress = (gwId: string) => {
    setSelectedGatewayId(gwId);
    setActiveTab('DEVICE'); // Chuyển sang tab thiết bị
  };

  // --- RENDER HEADER (Banner + Tabs) ---
  const renderListHeader = () => (
    <>
      <Animated.View entering={FadeInDown.duration(600)}>
        <BannerSlider data={BANNER_IMAGES} />
      </Animated.View>

      {/* THANH TAB TÙY CHỈNH */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tabItem, activeTab === 'GATEWAY' && styles.tabItemActive]}
          onPress={() => handleTabPress('GATEWAY')}
        >
          <MaterialIcons name="router" size={20} color={activeTab === 'GATEWAY' ? '#2563EB' : '#6B7280'} />
          <RNText style={[styles.tabText, activeTab === 'GATEWAY' && styles.tabTextActive]}>
            Gateway
          </RNText>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.tabItem, activeTab === 'DEVICE' && styles.tabItemActive]}
          onPress={() => handleTabPress('DEVICE')}
        >
          <MaterialIcons name="sensors" size={20} color={activeTab === 'DEVICE' ? '#2563EB' : '#6B7280'} />
          <RNText style={[styles.tabText, activeTab === 'DEVICE' && styles.tabTextActive]}>
            Đầu báo {selectedGatewayId ? '(Lọc)' : ''}
          </RNText>
        </TouchableOpacity>
      </View>
    </>
  );

  // --- ITEM: GATEWAY ---
  const renderGatewayItem = ({ item, index }: { item: any, index: number }) => (
    <Animated.View entering={FadeInDown.delay(index * 100).springify()}>
      <TouchableOpacity 
        style={styles.cardGateway}
        activeOpacity={0.8}
        onPress={() => handleGatewayPress(item.id)} // Logic cũ: Ấn vào card để lọc thiết bị
      >
        {/* Header Card */}
        <View style={styles.rowBetween}>
           <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image source={require('../../asset/images/device/gateway.webp')} style={styles.gwImage} resizeMode="contain" />
              <View style={{ marginLeft: 10 }}>
                 <RNText style={styles.gwName}>{item.name}</RNText>
                 <RNText style={styles.gwSerial}>{item.serial}</RNText>
              </View>
           </View>

           {/* --- SỬA ĐỔI: Thêm nút xem Lịch sử Gateway --- */}
           <View style={{ flexDirection: 'row', alignItems: 'center' }}>
             <TouchableOpacity 
                style={{ padding: 6, marginRight: 8 }}
                onPress={() => navigation.navigate('HistoryGateway', item)}
             >
                <MaterialIcons name="history" size={24} color="#2563EB" />
             </TouchableOpacity>

             <View style={[styles.statusBadge, { backgroundColor: item.isOnline ? '#DCFCE7' : '#FEE2E2' }]}>
                <RNText style={{ color: item.isOnline ? '#166534' : '#991B1B', fontSize: 10, fontWeight: 'bold' }}>
                  {item.isOnline ? 'ONLINE' : 'OFFLINE'}
                </RNText>
             </View>
           </View>
        </View>

        <View style={styles.divider} />

        {/* Thông số kỹ thuật */}
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
               <View style={styles.paramRow}>
                  <MaterialIcons name="device-hub" size={14} color="#4B5563" />
                  <RNText style={styles.paramText}>Thiết bị: {item.onlineDevices}/{item.totalDevices}</RNText>
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
  );

  // --- ITEM: DEVICE (ĐẦU BÁO) ---
  const renderDeviceItem = ({ item, index }: { item: any, index: number }) => (
    <Animated.View entering={FadeInDown.delay(index * 50).duration(400)}>
      {/* --- SỬA ĐỔI: Chuyển View thành TouchableOpacity để ấn xem lịch sử --- */}
      <TouchableOpacity 
        style={styles.cardDevice}
        activeOpacity={0.7}
        onPress={() => navigation.navigate('HistorySensor', item)}
      >
        <View style={styles.rowBetween}>
           <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {/* Icon thay đổi theo tên */}
              <View style={[styles.iconBox, { backgroundColor: item.name.includes('nhiệt') ? '#FEF3C7' : '#E0F2FE' }]}>
                 <MaterialIcons 
                    name={item.name.includes('nhiệt') ? "whatshot" : "sensors"} 
                    size={24} 
                    color={item.name.includes('nhiệt') ? "#D97706" : "#0284C7"} 
                 />
              </View>
              <View style={{ marginLeft: 12 }}>
                 <RNText style={styles.deviceName}>{item.location}</RNText>
                 <RNText style={styles.deviceSub}>{item.name} • {item.gatewayName}</RNText>
              </View>
           </View>

           {/* Trạng thái + Mũi tên chỉ dẫn */}
           <View style={{ alignItems: 'flex-end', flexDirection: 'row' }}>
               <View style={{ alignItems: 'flex-end', marginRight: 8 }}>
                  <MaterialIcons 
                      name="fiber-manual-record" 
                      size={14} 
                      color={item.isOnline ? '#22C55E' : '#9CA3AF'} 
                  />
                  <RNText style={{ fontSize: 10, color: '#6B7280', marginTop: 2 }}>
                      {item.isOnline ? 'Kết nối' : 'Mất KN'}
                  </RNText>
               </View>
               {/* Mũi tên nhỏ để gợi ý người dùng ấn vào */}
               <MaterialIcons name="chevron-right" size={20} color="#D1D5DB" />
           </View>
        </View>

        {/* Thông số bên dưới */}
        <View style={[styles.rowBetween, { marginTop: 12 }]}>
           <View style={styles.tag}>
              <MaterialIcons name="battery-std" size={12} color="#4B5563" />
              <RNText style={styles.tagText}>{item.battery}</RNText>
           </View>
           <View style={styles.tag}>
              <MaterialIcons name="rss-feed" size={12} color="#4B5563" />
              <RNText style={styles.tagText}>RF: {item.rfSignal}dBm</RNText>
           </View>
           
           {/* Nếu có lỗi thì hiện tag đỏ */}
           {item.error ? (
             <View style={[styles.tag, { backgroundColor: '#FEE2E2' }]}>
                <MaterialIcons name="error-outline" size={12} color="#DC2626" />
                <RNText style={[styles.tagText, { color: '#DC2626' }]}>{item.error}</RNText>
             </View>
           ) : <View />}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.container}>
        
        {/* HEADER */}
        <View style={styles.header}>
          <View>
            <RNText style={styles.hello}>Xin chào, {user?.USER_NAME || "Người dùng"}</RNText>
            <RNText style={styles.subHello}>Chúc bạn ngày mới an toàn!</RNText>
          </View>

          <SelectDropdown
            data={ACTIONS_DATA}
            onSelect={(selectedItem) => {
              if (selectedItem.title === 'Cấu hình thiết bị') navigation.navigate('ConfigDevice');
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
                <MaterialIcons name={item.icon} size={22} color={item.color} style={{ marginRight: 12 }} />
                <RNText style={styles.dropdownText}>{item.title}</RNText>
              </View>
            )}
            showsVerticalScrollIndicator={false}
            dropdownStyle={styles.dropdown} 
          />
        </View>

        {/* LIST CHÍNH */}
        <FlatList
          data={displayData}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={renderListHeader}
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
          renderItem={activeTab === 'GATEWAY' ? renderGatewayItem : renderDeviceItem}
          ListEmptyComponent={() => (
            <View style={{ alignItems: 'center', marginTop: 50 }}>
              <MaterialIcons name="inbox" size={40} color="#D1D5DB" />
              <RNText style={{ color: '#9CA3AF', marginTop: 10 }}>Không có dữ liệu</RNText>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}