import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { 
    paddingHorizontal: 20, 
    paddingVertical: 15, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  headerTitle: { fontSize: 22, fontWeight: '800', color: '#1E293B' },
  addBtn: { 
    backgroundColor: '#2563EB', 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 12, 
    paddingVertical: 8, 
    borderRadius: 10 
  },
  addBtnText: { color: '#fff', fontWeight: 'bold', marginLeft: 4, fontSize: 14 },
  
  card: { 
    backgroundColor: '#fff', 
    borderRadius: 16, 
    padding: 14, 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 12,
    // Shadow cho iOS
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10,
    // Elevation cho Android
    elevation: 2 
  },
  cardIconBox: { width: 48, height: 48, backgroundColor: '#EFF6FF', borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#334155' },
  cardSub: { fontSize: 12, color: '#94A3B8', marginTop: 2 },
  
  actionGroup: { flexDirection: 'row', alignItems: 'center' },
  iconBtn: { width: 36, height: 36, backgroundColor: '#F1F5F9', borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginLeft: 8 },
  
  modalOverlay: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.5)', justifyContent: 'flex-end' },
  sheetContent: { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, alignItems: 'center' },
  sheetHandle: { width: 40, height: 5, backgroundColor: '#E2E8F0', borderRadius: 10, marginBottom: 20 },
  sheetTitle: { fontSize: 18, fontWeight: 'bold', color: '#1E293B', marginBottom: 20 },
  
  input: { width: '100%', backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12, padding: 15, fontSize: 16, color: '#1E293B', marginBottom: 20 },
  submitBtn: { width: '100%', backgroundColor: '#2563EB', padding: 16, borderRadius: 12, alignItems: 'center' },
  submitBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  emptyText: { textAlign: 'center', color: '#94A3B8', marginTop: 40 }
});