import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

export function TermsScreen() {
  // Không cần useNavigation vì nút Back đã có sẵn trên Header của Stack Navigator
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
      >
        {/* Tiêu đề lớn (Optional) */}
        {/* <Text style={styles.mainTitle}>Điều Khoản & Điều Kiện</Text> */}

        {/* Khung nội dung màu trắng (Card style) */}
        <View style={styles.card}>
          <Text style={styles.sectionHeader}>1. Giới thiệu</Text>
          <Text style={styles.text}>
            Chào mừng bạn đến với ứng dụng Báo cháy liên gia. Ứng dụng này hỗ trợ kết nối các hộ gia đình để cảnh báo an toàn PCCC nhanh chóng.
          </Text>

          <Text style={styles.sectionHeader}>2. Trách nhiệm người dùng</Text>
          <Text style={styles.text}>
            • Cung cấp thông tin địa chỉ, số điện thoại chính xác để phục vụ cứu hộ.{"\n"}
            • Tuyệt đối không thực hiện hành vi báo cháy giả (spam). Hành vi này có thể bị xử lý theo quy định pháp luật.{"\n"}
            • Có trách nhiệm duy trì kết nối mạng và nguồn điện cho thiết bị báo cháy.
          </Text>

          <Text style={styles.sectionHeader}>3. Quyền sở hữu</Text>
          <Text style={styles.text}>
            Ứng dụng và các nội dung bên trong thuộc quyền sở hữu trí tuệ của nhà phát triển. Nghiêm cấm sao chép hoặc sử dụng sai mục đích.
          </Text>

          <Text style={styles.sectionHeader}>4. Miễn trừ trách nhiệm</Text>
          <Text style={styles.text}>
            Chúng tôi nỗ lực đảm bảo hệ thống hoạt động ổn định 24/7. Tuy nhiên, chúng tôi không chịu trách nhiệm trong trường hợp tín hiệu không gửi đi được do lỗi khách quan như: mất điện diện rộng, đứt cáp quang, lỗi nhà mạng viễn thông hoặc thiết bị người dùng bị hư hỏng phần cứng.
          </Text>

          <Text style={styles.sectionHeader}>5. Thay đổi điều khoản</Text>
          <Text style={styles.text}>
            Chúng tôi có quyền thay đổi các điều khoản này để phù hợp với quy định mới. Việc tiếp tục sử dụng ứng dụng đồng nghĩa với việc bạn chấp nhận các thay đổi đó.
          </Text>
        </View>

        <Text style={styles.footerText}>Cập nhật lần cuối: 23/05/2024</Text>
        <View style={{height: 20}} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // Nền xám nhạt giống màn hình Settings
  container: { 
    flex: 1, 
    backgroundColor: '#F9FAFB' 
  },
  
  scrollContent: { 
    padding: 20 
  },

  // Tạo khung trắng bo góc
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    // Hiệu ứng đổ bóng nhẹ
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },

  sectionHeader: { 
    fontSize: 16, 
    fontWeight: '700', 
    marginTop: 16, 
    marginBottom: 8, 
    color: '#2563EB' // Màu xanh chủ đạo
  },

  text: { 
    fontSize: 14, 
    lineHeight: 24, // Tăng khoảng cách dòng cho dễ đọc
    color: '#374151', // Màu chữ xám đậm dễ chịu mắt hơn đen tuyền
    textAlign: 'justify' 
  },

  footerText: {
    marginTop: 20,
    textAlign: 'center',
    fontSize: 12,
    color: '#9CA3AF',
    fontStyle: 'italic'
  }
});