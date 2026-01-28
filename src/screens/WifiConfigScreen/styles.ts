import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  // Phần thông tin thiết bị
  deviceHeader: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: '#F8FAFC',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  imagePlaceholder: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    marginBottom: 15
  },
  deviceNameText: { fontSize: 22, fontWeight: '800', color: '#1E293B' },
  deviceIdText: { fontSize: 14, color: '#64748B', marginTop: 4 },
  
  // Nút Quét WiFi lớn
  scanActionBtn: {
    flexDirection: 'row',
    backgroundColor: '#2563EB',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 30,
    marginTop: 25,
    alignItems: 'center',
    elevation: 8,
  },
  scanActionBtnText: { color: '#FFF', fontWeight: '800', marginLeft: 8, letterSpacing: 1 },

  // Danh sách WiFi
  listSection: { flex: 1, paddingHorizontal: 20, paddingTop: 20 },
  listTitle: { fontSize: 16, fontWeight: '700', color: '#475569', marginBottom: 15 },
  wifiCard: { 
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#F1F5F9', 
    padding: 14, borderRadius: 16, marginBottom: 10 
  },
  wifiIconCircle: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center' },
  ssidText: { fontSize: 15, fontWeight: '600', color: '#1E293B' },
  signalText: { fontSize: 12, color: '#64748B' },

  // Thành công & Modal (Sửa lại từ bản cũ)
  successContainer: { flex: 1, backgroundColor: '#10B981', justifyContent: 'center', alignItems: 'center' },
  successTitle: { color: '#FFF', fontSize: 24, fontWeight: '800', marginTop: 20 },
  successSub: { color: '#D1FAE5', marginTop: 8 },
  btnFinish: { backgroundColor: '#FFF', paddingHorizontal: 30, paddingVertical: 15, borderRadius: 12, marginTop: 40 },
  btnFinishText: { color: '#10B981', fontWeight: '800' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 25 },
  modalHeader: { fontSize: 18, fontWeight: '800', textAlign: 'center' },
  selectedSsidDisplay: { textAlign: 'center', color: '#2563EB', marginVertical: 10, fontWeight: '600' },
  passwordInput: { backgroundColor: '#F1F5F9', borderRadius: 12, padding: 15, marginVertical: 15 },
  modalActionRow: { flexDirection: 'row', gap: 10 },
  btnPrimary: { flex: 1, backgroundColor: '#2563EB', padding: 15, borderRadius: 12, alignItems: 'center' },
  btnPrimaryText: { color: '#FFF', fontWeight: '700' },
  btnSecondary: { flex: 1, backgroundColor: '#E2E8F0', padding: 15, borderRadius: 12, alignItems: 'center' },
  btnSecondaryText: { color: '#475569', fontWeight: '600' },

  centerCol: { marginTop: 50, alignItems: 'center' },
  loadingText: { marginTop: 10, color: '#64748B' },
  fullOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center', zIndex: 99 },
  whiteText: { color: '#FFF', marginTop: 10 }
});