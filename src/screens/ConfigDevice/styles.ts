import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  body: { flex: 1, padding: 16 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 16, color: '#1F2937' },
  centerView: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  statusText: { marginTop: 16, fontSize: 16, color: '#4B5563' },
  
  // List Item
  itemContainer: {
      flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff',
      padding: 16, borderRadius: 12, marginBottom: 12,
      shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 5, elevation: 2
  },
  itemTitle: { fontSize: 16, fontWeight: '600', color: '#111827' },
  itemSub: { fontSize: 14, color: '#6B7280', marginTop: 2 },

  // Buttons
  mainButton: {
      backgroundColor: '#2563EB', padding: 16, borderRadius: 12,
      alignItems: 'center', marginTop: 10
  },
  mainButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContainer: { width: width * 0.85, backgroundColor: '#fff', borderRadius: 16, padding: 24 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  input: {
      borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8,
      padding: 12, fontSize: 16, marginBottom: 24, color: '#000'
  },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between' },
  modalBtn: { flex: 1, padding: 12, borderRadius: 8, alignItems: 'center', marginHorizontal: 4 },
  cancelBtn: { backgroundColor: '#F3F4F6' },
  confirmBtn: { backgroundColor: '#2563EB' },
  cancelBtnText: { color: '#374151', fontWeight: '600' },
  confirmBtnText: { color: '#fff', fontWeight: '600' },
});