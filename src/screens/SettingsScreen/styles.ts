import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 20,
  },

  header: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
  },

  profileCard: {
    alignItems: 'center',
    padding: 20,
    borderRadius: 20,
    marginBottom: 24,
  },

  avatar: {
    backgroundColor: '#DBEAFE',
  },

  editBtn: {
    position: 'absolute', 
    bottom: 0, 
    right: 0, 
    borderWidth: 3,
    borderColor: '#FFF',
    backgroundColor: '#2563EB',
    borderRadius: 14, 
    padding: 6,
    
  },

  name: {
    marginTop: 12,
    fontSize: 17,
    fontWeight: '600',
  },

  phone: {
    fontSize: 13,
    color: '#6B7280',
  },

  section: {
    marginTop: 16,
    marginBottom: 8,
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
  },

  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
  },

  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  itemText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
  },

  // --- STYLE MỚI CHO PHẦN LOGOUT ---
  logoutContainer: {
    marginTop: 32,
    alignItems: 'center',
    marginBottom: 20,
  },

  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF2F2', // Màu nền đỏ rất nhạt
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30, // Bo tròn dạng viên thuốc
    borderWidth: 1,
    borderColor: '#FCA5A5', // Viền đỏ nhạt
    width: '60%',
  },

  logoutText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444', // Màu chữ đỏ đậm cảnh báo
  },

  versionText: {
    marginTop: 12,
    fontSize: 12,
    color: '#9CA3AF', // Màu xám nhạt
  }
});