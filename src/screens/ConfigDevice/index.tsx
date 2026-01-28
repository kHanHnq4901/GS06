import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StatusBar, StyleSheet } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './styles';
import { useConfigDeviceController } from './controller';
import { RadarScanner } from './components/RadarScanner';

export function ConfigDeviceScreen() {
  const { 
    isScanningBle, 
    bleDevices, 
    onScanPress, 
    connectHandle 
  } = useConfigDeviceController();

  const renderBleItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.itemContainer} 
      onPress={() => connectHandle(item.id, item.name)}
    >
      <MaterialIcons name="bluetooth" size={24} color="#2563EB" />
      <View style={localStyles.itemTextContent}>
        <Text style={styles.itemTitle}>{item.name || "Thiết bị không tên"}</Text>
        <Text style={styles.itemSub}>{item.id}</Text>
      </View>
      <MaterialIcons name="chevron-right" size={24} color="#9CA3AF" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.body}>
        {/* Radar Section */}
        <View style={localStyles.radarWrapper}>
          {isScanningBle ? (
            <RadarScanner /> 
          ) : (
            <View style={localStyles.idleIcon}>
              <MaterialIcons name="bluetooth-disabled" size={60} color="#D1D5DB" />
              <Text style={localStyles.idleText}>Sẵn sàng quét</Text>
            </View>
          )}
        </View>

        <Text style={styles.sectionTitle}>
          {isScanningBle ? "Đang tìm Gateway..." : "Thiết bị khả dụng"}
        </Text>
        
        <FlatList
          data={bleDevices}
          keyExtractor={item => item.id}
          renderItem={renderBleItem}
          ListEmptyComponent={!isScanningBle ? (
            <View style={localStyles.emptyBox}>
              <Text style={localStyles.emptyText}>Chưa tìm thấy thiết bị nào</Text>
            </View>
          ) : null}
        />

        <TouchableOpacity 
          style={[styles.mainButton, isScanningBle && { opacity: 0.6 }]} 
          onPress={onScanPress}
          disabled={isScanningBle}
        >
          <Text style={styles.mainButtonText}>
            {isScanningBle ? "ĐANG TÌM..." : "QUÉT LẠI"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  radarWrapper: { height: 120, justifyContent: 'center', alignItems: 'center', marginVertical: 20 },
  idleIcon: { alignItems: 'center' },
  idleText: { color: '#9CA3AF', marginTop: 10 },
  itemTextContent: { marginLeft: 12, flex: 1 },
  emptyBox: { alignItems: 'center', marginTop: 40 },
  emptyText: { color: '#9CA3AF' }
});