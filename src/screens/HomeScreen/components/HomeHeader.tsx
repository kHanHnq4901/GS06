import React from 'react';
import { View, TouchableOpacity, Text as RNText } from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import { styles } from '../styles';

interface HomeHeaderProps {
  selectedHouse: any;
  dropdownData: any[];
  onSelectHouse: (item: any) => void;
  actionsData: any[];
  onSelectAction: (item: any) => void;
}

export const HomeHeader = ({ selectedHouse, dropdownData, onSelectHouse, actionsData, onSelectAction }: HomeHeaderProps) => (
  <View style={styles.header}>
    <View style={styles.housePickerContainer}>
      <MaterialIcons name="home-work" size={26} color="#2563EB" />
      <SelectDropdown
        data={dropdownData}
        onSelect={onSelectHouse}
        renderButton={(selectedItem, isOpened) => (
          <View style={styles.houseSelector}>
            <View>
              <RNText style={styles.houseLabel}>Khu vực:</RNText>
              <RNText style={styles.houseName} numberOfLines={1}>{selectedHouse ? selectedHouse.HOME_NAME : 'Đang tải...'}</RNText>
            </View>
            <MaterialIcons name={isOpened ? 'keyboard-arrow-up' : 'keyboard-arrow-down'} size={20} color="#6B7280" />
          </View>
        )}
        renderItem={(item, index, isSelected) => (
          <View style={[styles.houseDropdownItem, isSelected && { backgroundColor: '#EFF6FF' }]}>
            <RNText style={[styles.houseDropdownText, isSelected && { color: '#2563EB', fontWeight: 'bold' }]}>{item.HOME_NAME}</RNText>
          </View>
        )}
        dropdownStyle={styles.houseDropdown}
      />
    </View>
    <SelectDropdown
      data={actionsData}
      onSelect={onSelectAction}
      renderButton={() => <View style={styles.addBtn}><RNText style={styles.addIcon}>＋</RNText></View>}
      renderItem={(item, index) => (
        <View style={[styles.dropdownRow, { borderBottomWidth: index === actionsData.length - 1 ? 0 : 1 }]}>
          <MaterialIcons name={item.icon} size={22} color={item.color} style={{ marginRight: 12 }} />
          <RNText style={styles.dropdownText}>{item.title}</RNText>
        </View>
      )}
      dropdownStyle={styles.dropdown} 
    />
  </View>
);