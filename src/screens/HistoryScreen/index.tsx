import React from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  StatusBar, // Import thêm StatusBar
  Platform
} from 'react-native';
import { Text, Searchbar } from 'react-native-paper';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context'; // Import SafeAreaView từ đây
import { styles } from './styles';

const DATA = [1, 2, 3, 4];

export function HistoryScreen() {
  
  return (
    // Thay View thường thành SafeAreaView
    // edges={['top']} giúp chỉ đẩy phần trên xuống, không ảnh hưởng phần dưới nếu bạn có tabbar
    <SafeAreaView style={[styles.container, { flex: 1 }]} edges={['top', 'left', 'right']}>
      
      {/* Cấu hình màu cho thanh status bar nếu cần */}
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      {/* SEARCH */}
      <Searchbar
        placeholder="Tìm kiếm"
        style={styles.search}
        inputStyle={{ fontSize: 14 }}
      />

      {/* LIST */}
      <FlatList
        data={DATA}
        keyExtractor={(_, i) => i.toString()}
        contentContainerStyle={{ paddingBottom: 90 }}
        renderItem={({ item, index }) => (
          <Animated.View
            entering={FadeInUp.delay(index * 80)}
            style={styles.card}
          >
            {/* ICON */}
            <View style={styles.iconWrap}>
              <Text style={styles.icon}>🔥</Text>
            </View>

            {/* CONTENT */}
            <View style={{ flex: 1 }}>
              <View style={styles.rowBetween}>
                <Text style={styles.title}>Tin cảnh báo cháy</Text>
                <View style={styles.badgeWarning}>
                  <Text style={styles.badgeText}>Chưa xác minh</Text>
                </View>
              </View>

              <Text style={styles.place}>Showroom trưng bày GEIC</Text>
              <Text style={styles.address}>
                📍 KCN Đại Đồng, Xã Đại Đồng, Bắc Ninh
              </Text>

              <View style={styles.timeRow}>
                <Text style={styles.time}>⏱ Báo: 14:20:08 03/12/2025</Text>
                <Text style={styles.time}>✅ Xử lý: 14:21:40</Text>
              </View>
            </View>
          </Animated.View>
        )}
      />
    </SafeAreaView>
  );
}