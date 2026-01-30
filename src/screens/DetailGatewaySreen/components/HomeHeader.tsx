import React from 'react';
import { View, TouchableOpacity, Text as RNText, StyleSheet, Dimensions } from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import MaterialIcons from '@react-native-vector-icons/material-icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface HomeHeaderProps {
  selectedHouse: any;
  dropdownData: any[];
  onSelectHouse: (item: any) => void;
  onPressAdd: () => void; 
}

export const HomeHeader = ({ 
  selectedHouse, 
  dropdownData, 
  onSelectHouse, 
  onPressAdd 
}: HomeHeaderProps) => {
  return (
    <View style={styles.header}>
      {/* Phần bên trái: Chọn nhà */}
      <View style={styles.leftWrapper}>
        <View style={styles.housePickerContainer}>
          <MaterialIcons name="home-work" size={26} color="#2563EB" />
          <SelectDropdown
            data={dropdownData}
            onSelect={onSelectHouse}
            renderButton={(selectedItem, isOpened) => (
              <View style={styles.houseSelector}>
                <RNText style={styles.houseName} numberOfLines={1}>
                  {selectedHouse ? selectedHouse.HOME_NAME : 'Đang tải...'}
                </RNText>
                <MaterialIcons 
                  name={isOpened ? 'keyboard-arrow-up' : 'keyboard-arrow-down'} 
                  size={20} 
                  color="#6B7280" 
                />
              </View>
            )}
            renderItem={(item, index, isSelected) => (
              <View style={[styles.houseDropdownItem, isSelected && { backgroundColor: '#EFF6FF' }]}>
                <RNText style={[styles.houseDropdownText, isSelected && { color: '#2563EB', fontWeight: 'bold' }]}>
                  {item.HOME_NAME}
                </RNText>
              </View>
            )}
            dropdownStyle={styles.houseDropdown}
            dropdownOverlayColor="transparent"
          />
        </View>
      </View>

      {/* Phần bên phải: Nút thêm - Dùng định vị tuyệt đối để ép nó hiện ra */}
      <TouchableOpacity 
        style={styles.absoluteAddBtn} 
        onPress={onPressAdd}
        activeOpacity={0.7}
      >
        <MaterialIcons name="add-circle" size={34} color="#2563EB" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    width: '100%',
    height: 65, // Cố định chiều cao
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    position: 'relative', // Làm mốc cho nút Add
  },
  leftWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    // Giới hạn phần bên trái để chừa chỗ cho nút Add bên phải (khoảng 50px)
    width: SCREEN_WIDTH - 70, 
  },
  housePickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  houseSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
    flexShrink: 1,
  },
  houseName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
    marginRight: 4,
  },
  // Nút Add được ghim vào góc phải
  absoluteAddBtn: {
    position: 'absolute',
    right: 12, // Cách mép phải 12px
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    width: 44,
    zIndex: 99, // Đảm bảo luôn nằm trên cùng
  },
  houseDropdown: {
    borderRadius: 12,
    backgroundColor: '#FFF',
    elevation: 5,
  },
  houseDropdownItem: {
    padding: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#F1F5F9',
  },
  houseDropdownText: {
    fontSize: 15,
    color: '#334155',
  },
});