import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#fff',
    borderBottomWidth: 1, borderBottomColor: '#E5E7EB'
  },
  backBtn: { padding: 8, marginLeft: -8 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#111827' },
  
  body: { flex: 1, padding: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#374151', marginBottom: 12 },
  
  // Item List Style
  itemContainer: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff',
    padding: 16, borderRadius: 12, marginBottom: 12,
    borderWidth: 1, borderColor: '#E5E7EB',
    shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, elevation: 1
  },
  itemTitle: { fontSize: 16, fontWeight: '600', color: '#1F2937' },
  itemSub: { fontSize: 12, color: '#6B7280', marginTop: 2 },
  
  // Status View
  centerView: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  statusText: { marginTop: 16, fontSize: 16, color: '#374151', fontWeight: '500' },
  
  // Buttons
  mainButton: {
      backgroundColor: '#2563EB', padding: 16, borderRadius: 12, 
      alignItems: 'center', marginTop: 20
  },
  mainButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalContainer: { backgroundColor: '#fff', borderRadius: 16, padding: 24 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 16, color: '#111827' },
  label: { fontSize: 14, color: '#374151', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8, padding: 12, fontSize: 16, marginBottom: 20, color: '#333' },
  modalButtons: { flexDirection: 'row', gap: 12 },
  modalBtn: { flex: 1, padding: 12, borderRadius: 8, alignItems: 'center' },
  cancelBtn: { backgroundColor: '#F3F4F6' },
  cancelBtnText: { color: '#374151', fontWeight: '600' },
  confirmBtn: { backgroundColor: '#2563EB' },
  confirmBtnText: { color: '#fff', fontWeight: '600' },
});