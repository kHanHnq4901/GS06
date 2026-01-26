import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

export function PrivacyPolicyScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
      >
        {/* Khung nội dung (Card Style) */}
        <View style={styles.card}>
          <Text style={styles.sectionHeader}>1. Dữ liệu chúng tôi thu thập</Text>
          <Text style={styles.text}>
            Để vận hành hệ thống báo cháy liên gia, chúng tôi cần thu thập:{"\n"}
            • <Text style={styles.boldText}>Thông tin cá nhân:</Text> Họ tên, Số điện thoại.{"\n"}
            • <Text style={styles.boldText}>Thông tin vị trí (Location):</Text> Tọa độ chính xác ngôi nhà của bạn để hiển thị trên bản đồ cứu hộ.{"\n"}
            • <Text style={styles.boldText}>Trạng thái thiết bị:</Text> Tình trạng Pin, kết nối mạng của cảm biến khói.
          </Text>

          <Text style={styles.sectionHeader}>2. Mục đích sử dụng</Text>
          <Text style={styles.text}>
            • Gửi cảnh báo khẩn cấp đến hàng xóm và cơ quan chức năng khi có cháy.{"\n"}
            • Xác thực tài khoản người dùng chính chủ.{"\n"}
            • Nhắc nhở bảo trì thiết bị khi sắp hết pin hoặc mất kết nối.
          </Text>

          <Text style={styles.sectionHeader}>3. Chia sẻ thông tin</Text>
          <Text style={styles.text}>
            Thông tin Tên và Địa chỉ của bạn sẽ được hiển thị cho các thành viên trong cùng "Tổ liên gia" để họ biết vị trí ứng cứu khi có sự cố. Chúng tôi cam kết KHÔNG bán dữ liệu của bạn cho bên thứ ba vì mục đích quảng cáo.
          </Text>

          <Text style={styles.sectionHeader}>4. Quyền truy cập thiết bị</Text>
          <Text style={styles.text}>
            Ứng dụng cần quyền truy cập Vị trí (Location) để xác định điểm cháy và quyền Thông báo (Notification) để phát âm thanh cảnh báo ngay cả khi điện thoại ở chế độ im lặng.
          </Text>
        </View>

        <Text style={styles.footerText}>Hiệu lực từ ngày: 01/01/2024</Text>
        <View style={{height: 20}} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // Nền xám nhạt đồng bộ
  container: { 
    flex: 1, 
    backgroundColor: '#F9FAFB' 
  },

  scrollContent: { 
    padding: 20 
  },

  // Style khung trắng bo góc
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },

  // Màu xanh lá (#10B981) bạn đã chọn
  sectionHeader: { 
    fontSize: 16, 
    fontWeight: '700', 
    marginTop: 16, 
    marginBottom: 8, 
    color: '#10B981' 
  },

  text: { 
    fontSize: 14, 
    lineHeight: 24, 
    color: '#374151', 
    textAlign: 'justify' 
  },

  // Thêm style in đậm cho các từ khóa quan trọng
  boldText: {
    fontWeight: '600',
    color: '#111827',
  },

  footerText: {
    marginTop: 20,
    textAlign: 'center',
    fontSize: 12,
    color: '#9CA3AF',
    fontStyle: 'italic'
  }
});