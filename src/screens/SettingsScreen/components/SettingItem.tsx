import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

// 1. Định nghĩa kiểu dữ liệu cho Props
interface SettingItemProps {
  icon: string;
  title: string;
  color?: string;       // Dấu ? nghĩa là không bắt buộc (vì đã có giá trị mặc định)
  onPress?: () => void; // Dấu ? nghĩa là có thể không truyền hàm này
  rightText?: string;   // <--- QUAN TRỌNG: Dấu ? để fix lỗi TS2741
}

// 2. Gán kiểu SettingItemProps vào component
export const SettingItem = ({ 
  icon, 
  title, 
  color = "#6B7280", 
  onPress, 
  rightText 
}: SettingItemProps) => {
  return (
    <TouchableOpacity style={styles.itemContainer} onPress={onPress}>
      <View style={styles.leftContent}>
        <View style={[styles.iconBox, { backgroundColor: `${color}20` }]}> 
          <MaterialIcons name={icon} size={22} color={color} />
        </View>
        <Text style={styles.itemTitle}>{title}</Text>
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {/* Chỉ hiển thị khi rightText có dữ liệu */}
        {rightText && (
            <Text style={{ marginRight: 8, color: '#6B7280', fontSize: 14 }}>
                {rightText}
            </Text>
        )}
        <MaterialIcons name="chevron-right" size={24} color="#9CA3AF" />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    marginBottom: 8,
    backgroundColor: '#FFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    // Shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    elevation: 1,
  },
  leftContent: { flexDirection: 'row', alignItems: 'center' },
  iconBox: { 
    width: 36, 
    height: 36, 
    borderRadius: 10, 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginRight: 12 
  },
  itemTitle: { fontSize: 16, color: '#374151', fontWeight: '500' },
});