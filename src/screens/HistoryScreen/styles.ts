import { StyleSheet, Dimensions, Platform } from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const scale = SCREEN_WIDTH / 375; // Tỉ lệ chuẩn dựa trên iPhone 11/x

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB', // Màu nền nhạt giúp card nổi bật hơn
    paddingHorizontal: 12 * scale,
    paddingTop: 8,
  },

  search: {
    borderRadius: 12,
    marginBottom: 10,
    backgroundColor: '#FFFFFF',
    elevation: 2, // Tạo bóng đổ nhẹ trên Android
    shadowColor: '#000', // Bóng đổ trên iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    height: 45 * scale, // Scale chiều cao searchbar
  },

  card: {
    flexDirection: 'row',
    padding: 10 * scale, // Giảm padding để tiết kiệm diện tích
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 10,
    // Đảm bảo viền trái không bị đè bởi padding
    overflow: 'hidden', 
  },

  iconWrap: {
    width: 40 * scale, // Thu nhỏ một chút để dành chỗ cho nội dung
    height: 40 * scale,
    borderRadius: 10, // Bo góc vuông hiện đại hơn tròn hoàn toàn
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10 * scale,
  },

  icon: {
    fontSize: 20 * scale,
  },

  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start', // Căn trên để nếu title dài không bị lệch badge
  },

  title: {
    fontSize: 14 * scale,
    fontWeight: '700',
    color: '#111827',
    flex: 1, // Để title không đè lên badge
    marginRight: 4,
  },

  badgeWarning: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    minWidth: 60,
    alignItems: 'center',
  },

  badgeText: {
    fontSize: 10 * scale,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },

  place: {
    marginTop: 2,
    fontSize: 12 * scale,
    fontWeight: '600',
    color: '#374151',
  },

  address: {
    fontSize: 11 * scale,
    color: '#6B7280',
    marginTop: 1,
  },

  timeRow: {
    marginTop: 6,
    flexDirection: 'row', // Chuyển sang hàng ngang để tiết kiệm chiều dọc
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 0.5,
    borderTopColor: '#F3F4F6',
    paddingTop: 4,
  },

  time: {
    fontSize: 10 * scale,
    color: '#9CA3AF',
    fontStyle: 'italic',
  },
});