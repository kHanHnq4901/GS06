import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  headerContainer: { backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  topBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, height: 60 },
  sideColumn: { width: 50 },
  centerColumn: { flex: 1, alignItems: 'center' },
  leftBtn: { paddingVertical: 8, paddingRight: 8 },
  rightBtn: { paddingVertical: 8, paddingLeft: 8, alignItems: 'flex-end' },
  headerTitle: { fontSize: 16, fontWeight: 'bold', color: '#1E293B' },
  headerSub: { fontSize: 11, color: '#64748B' },
  dropdownStyle: { 
    borderRadius: 12, 
    width: 200, 
    backgroundColor: '#fff', 
    marginTop: 5, 
    marginLeft: -150, 
    elevation: 10, 
    shadowColor: '#000', 
    shadowOpacity: 0.1, 
    shadowRadius: 10 
  },
  dropdownRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, borderBottomColor: '#F1F5F9' },
  dropdownText: { fontSize: 14, marginLeft: 12, color: '#334155', fontWeight: '500' },
  tabContainer: { flexDirection: 'row', paddingHorizontal: 16, marginTop: 8 },
  tabItem: { 
    flex: 1, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    paddingVertical: 12, 
    borderBottomWidth: 2, 
    borderBottomColor: 'transparent' 
  },
  tabItemActive: { borderBottomColor: '#2563EB' },
  tabText: { fontSize: 13, color: '#64748B', marginLeft: 6 },
  tabTextActive: { color: '#2563EB', fontWeight: 'bold' },
  empty: { alignItems: 'center', marginTop: 60 }
});