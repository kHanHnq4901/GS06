import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
  },

  search: {
    borderRadius: 14,
    marginBottom: 12,
    backgroundColor: '#F6F7FB',
  },

  card: {
    flexDirection: 'row',
    padding: 14,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 12,
  },

  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFF1F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  icon: {
    fontSize: 22,
  },

  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  title: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },

  badgeWarning: {
    backgroundColor: '#F2994A',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
  },

  badgeText: {
    fontSize: 11,
    color: '#FFFFFF',
    fontWeight: '600',
  },

  place: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: '500',
  },

  address: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },

  timeRow: {
    marginTop: 8,
  },

  time: {
    fontSize: 11,
    color: '#6B7280',
  },
});
