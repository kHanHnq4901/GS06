import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  // --- LAYOUT CHUNG ---
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  
  // --- HEADER (Chào hỏi + Nút Add) ---
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    marginBottom: 12,
    zIndex: 100, // Để dropdown hiển thị đè lên trên nếu cần
  },
  hello: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  subHello: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 4,
  },
  
  addBtn: {
    width: 42, // To hơn xíu cho dễ bấm
    height: 42,
    borderRadius: 14, // Bo cong mềm hơn
    backgroundColor: '#F3F4F6', // Màu nền xám nhạt hiện đại
    alignItems: 'center',
    justifyContent: 'center',
  },
  addIcon: {
    fontSize: 24,
    color: '#2563EB',
    fontWeight: '500',
    marginTop: -2,
  },

  // --- STYLE MENU CHUYÊN NGHIỆP ---
  dropdown: {
    width: 200, // Rộng hơn để chứa Icon + Text thoải mái
    borderRadius: 12, // Bo góc chuẩn iOS
    backgroundColor: '#fff',
    
    // Đổ bóng Đậm và Sâu (Kiểu Drop Shadow)
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15, // Độ mờ bóng
    shadowRadius: 12,    // Độ lan tỏa bóng
    elevation: 10,       // Bóng cho Android
    
    // Căn chỉnh vị trí (Hack margin để kéo về bên trái)
    marginTop: 4, 
    marginLeft: -150, // Kéo lùi menu lại để không bị tràn màn hình phải
    
    paddingVertical: 8, // Padding trên dưới cho menu thoáng
  },

  dropdownRow: {
    flexDirection: 'row', // Xếp ngang
    alignItems: 'center',
    height: 48, // Chiều cao chuẩn ngón tay (Touch target)
    paddingHorizontal: 16,
    borderBottomColor: '#F3F4F6', // Màu gạch chân rất nhạt
    // borderBottomWidth xử lý logic bên renderItem
  },

  dropdownText: {
    fontSize: 15,
    fontWeight: '500', // Chữ đậm vừa phải
    color: '#374151', // Màu xám đen (Soft black) thay vì đen tuyền
  },

  // --- BANNER CAROUSEL ---
  bannerWrapper: {
    width: width - 32, 
    height: 160,       
    borderRadius: 16,
    overflow: 'hidden',
    alignSelf: 'center',
    marginBottom: 10,
  },
  banner: {
    width: '100%',
    height: '100%',
    resizeMode: 'stretch',
  },

  // --- PAGINATION (DẤU CHẤM) ---
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  activeDot: {
    backgroundColor: '#2F80ED',
    width: 20,
  },
  inactiveDot: {
    backgroundColor: '#E5E7EB',
    width: 6,
  },

  // --- TAB TITLE ---
  tabRow: {
    flexDirection: 'row',
    marginBottom: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },

  // --- CARD LIST ITEM ---
  card: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 8, 
    borderBottomColor: '#F9FAFB', 
  },
  
  // Image trong card
  imageContainer: {
    position: 'relative', 
    marginRight: 12,
    paddingTop: 4,
  },
  deviceImg: {
    width: 50,
    height: 50,
    borderRadius: 25, 
    resizeMode: 'contain',
  },
  redDot: {
    position: 'absolute',
    top: 4,
    right: 0,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    borderWidth: 1.5,
    borderColor: '#fff', 
  },

  // Content Text trong card
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  
  // Các badge (Error, Code, Battery)
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    flexWrap: 'wrap', 
  },
  badgeError: {
    backgroundColor: '#FFF7ED', 
    color: '#EA580C',           
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    fontSize: 11,
    fontWeight: '500',
    marginRight: 6,
    overflow: 'hidden',
  },
  badgeCode: {
    backgroundColor: '#EFF6FF', 
    color: '#3B82F6',           
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    fontSize: 11,
    fontWeight: '500',
    marginRight: 6,
    overflow: 'hidden',
  },
  badgeBattery: {
    backgroundColor: '#DCFCE7', 
    color: '#16A34A',           
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    fontSize: 11,
    fontWeight: '600',
    overflow: 'hidden',
  },

  time: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  gatewayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  gatewayImg: {
    width: 40,
    height: 40,
  },
  gatewayName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  gatewayDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailCol: {
    flex: 1,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  infoText: {
    fontSize: 13,
    color: '#4B5563',
    marginLeft: 6,
  },
  // Style cho phần Child (Thiết bị con)
  childContainer: {
    backgroundColor: '#F9FAFB',
    marginHorizontal: 16,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    paddingTop: 10, // Thụt xuống 1 chút để không bị card che
    marginTop: -5, // Dính liền với card trên
    paddingHorizontal: 10,
    paddingBottom: 10,
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: '#E5E7EB',
  },
  deviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  deviceIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deviceLocation: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
  },
  deviceSubText: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 4,
  },

  paramItemSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  paramTextSmall: {
    fontSize: 11,
    color: '#4B5563',
    marginLeft: 4,
  },
  errorText: {
    fontSize: 10,
    color: '#EF4444',
    marginTop: 2,
    fontWeight: 'bold',
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 10,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 4,
  },
  tabItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 6,
  },
  tabItemActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginLeft: 6,
  },
  tabTextActive: {
    color: '#2563EB',
    fontWeight: 'bold',
  },
  // Gateway Card
  cardGateway: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 2,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  gwImage: {
    width: 36,
    height: 36,
  },
  gwName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  gwSerial: {
    fontSize: 12,
    color: '#6B7280',
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 10,
  },
  paramRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  paramText: {
    fontSize: 12,
    color: '#4B5563',
    marginLeft: 6,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  // Device Card
  cardDevice: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 10,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deviceName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#374151',
  },
  deviceSub: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  tagText: {
    fontSize: 11,
    color: '#4B5563',
    marginLeft: 4,
    fontWeight: '500',
  }
});