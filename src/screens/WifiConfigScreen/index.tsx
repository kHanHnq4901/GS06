import React from 'react';
import { 
  View, Text, FlatList, TouchableOpacity, Modal, 
  TextInput, ActivityIndicator, StatusBar, SafeAreaView 
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useWifiSetupController } from './controller';
import { styles } from './styles';

export default function WifiConfigScreen({ route, navigation }: any) {
  const { peripheralId, deviceName } = route.params;
  const ctl = useWifiSetupController(peripheralId, navigation);

  // Màn hình thành công
  if (ctl.step === 'SUCCESS') {
    return (
      <View style={styles.successContainer}>
        <StatusBar barStyle="light-content" />
        <MaterialIcons name="check-circle" size={100} color="#FFF" />
        <Text style={styles.successTitle}>Cấu hình thành công!</Text>
        <Text style={styles.successSub}>Thiết bị đã sẵn sàng sử dụng</Text>
        <TouchableOpacity style={styles.btnFinish} onPress={() => navigation.popToTop()}>
          <Text style={styles.btnFinishText}>HOÀN TẤT</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const renderWifiItem = ({ item }: any) => (
    <TouchableOpacity style={styles.wifiCard} onPress={() => ctl.onWifiSelect(item.ssid)}>
      <View style={styles.wifiIconCircle}>
        <MaterialIcons name="wifi" size={22} color="#2563EB" />
      </View>
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={styles.ssidText}>{item.ssid}</Text>
        <Text style={styles.signalText}>Tín hiệu: {item.rssi} dBm</Text>
      </View>
      <MaterialIcons name="lock-outline" size={18} color="#D1D5DB" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Thông tin thiết bị */}
      <View style={styles.deviceHeader}>
        <View style={styles.imagePlaceholder}>
           <MaterialIcons name="router" size={80} color="#2563EB" />
        </View>
        <Text style={styles.deviceNameText}>{deviceName}</Text>
        <Text style={styles.deviceIdText}>ID: {peripheralId}</Text>
        
        {!ctl.hasStartedScan && (
          <TouchableOpacity style={styles.scanActionBtn} onPress={ctl.startWifiScan}>
            <MaterialIcons name="search" size={24} color="#FFF" />
            <Text style={styles.scanActionBtnText}>QUÉT MẠNG WIFI</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.listSection}>
        {ctl.loading ? (
          <View style={styles.centerCol}>
            <ActivityIndicator size="large" color="#2563EB" />
            <Text style={styles.loadingText}>Đang tìm kiếm WiFi...</Text>
          </View>
        ) : (
          <FlatList
            data={ctl.wifiList}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderWifiItem}
            contentContainerStyle={{ paddingBottom: 40 }}
            ListHeaderComponent={ctl.wifiList.length > 0 ? <Text style={styles.listTitle}>Mạng khả dụng</Text> : null}
            ListEmptyComponent={ctl.hasStartedScan && !ctl.loading ? <Text style={styles.emptyText}>Không tìm thấy WiFi nào</Text> : null}
          />
        )}
      </View>

      {/* Sửa lỗi: Chỉ render Modal khi có WiFi được chọn */}
      {ctl.selectedSsid !== '' && (
        <Modal 
          visible={ctl.modalVisible} 
          transparent 
          animationType="slide"
          onRequestClose={() => ctl.setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalHeader}>Kết nối WiFi</Text>
              <Text style={styles.selectedSsidDisplay}>{ctl.selectedSsid}</Text>
              
              <TextInput
                style={styles.passwordInput}
                secureTextEntry
                placeholder="Nhập mật khẩu WiFi"
                value={ctl.password}
                onChangeText={ctl.setPassword}
                autoFocus
              />
              
              <View style={styles.modalActionRow}>
                <TouchableOpacity style={styles.btnSecondary} onPress={() => ctl.setModalVisible(false)}>
                  <Text style={styles.btnSecondaryText}>Hủy</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnPrimary} onPress={() => ctl.onSubmitConfig(ctl.selectedSsid, ctl.password)}>
                  <Text style={styles.btnPrimaryText}>Kết nối</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}

      {ctl.isConfiguring && (
        <View style={styles.fullOverlay}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.whiteText}>Đang cấu hình thiết bị...</Text>
        </View>
      )}
    </SafeAreaView>
  );
}