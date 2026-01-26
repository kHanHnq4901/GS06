import React, { useState, useRef } from 'react';
import { Alert, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { getCurrentLanguageTranslations } from '../../utils/localization';



export const useLoginController = () => {
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const navigation = useNavigation();
    const dispatch = useAppDispatch();
    const settings = useAppSelector(state => state.smartHome.settings);
    const { t } = getCurrentLanguageTranslations(settings);

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;

    React.useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 600,
                useNativeDriver: true,
            }),
        ]).start();
    }, [fadeAnim, slideAnim]);

    return {
        // State
        phone,
        password,
        loading,
        showPassword,
        fadeAnim,
        slideAnim,
        t,

        // Setters
        setPhone,
        setPassword,
        setShowPassword,
        setLoading,
    };
};
export const MOCK_GATEWAYS = [
  {
    id: 'gw1',
    name: 'Gateway Tầng 1',
    serial: 'GW-888222',
    batteryVoltage: '12.4V',
    temperature: '35°C',
    powerSource: 'Main', // Main hoặc Backup
    isOnline: true,
    wifiSignal: -45, // dBm
    totalDevices: 10,
    onlineDevices: 8,
    devices: [
      { id: 'd1', name: 'Đầu báo khói', location: 'Phòng khách', isOnline: true, battery: '90%', rfSignal: -50, error: null },
      { id: 'd2', name: 'Đầu báo nhiệt', location: 'Nhà bếp', isOnline: true, battery: '85%', rfSignal: -55, error: null },
      { id: 'd3', name: 'Đầu báo khói', location: 'Kho', isOnline: false, battery: '10%', rfSignal: -90, error: 'Mất kết nối' },
    ]
  },
  {
    id: 'gw2',
    name: 'Gateway Tầng 2',
    serial: 'GW-999111',
    batteryVoltage: '11.8V',
    temperature: '32°C',
    powerSource: 'Backup',
    isOnline: true,
    wifiSignal: -70,
    totalDevices: 5,
    onlineDevices: 5,
    devices: [
      { id: 'd4', name: 'Đầu báo khói', location: 'Phòng ngủ Master', isOnline: true, battery: '95%', rfSignal: -40, error: null },
      { id: 'd5', name: 'Đầu báo khói', location: 'Phòng trẻ em', isOnline: true, battery: '92%', rfSignal: -42, error: 'Lỗi cảm biến' },
    ]
  },
  {
    id: 'gw3',
    name: 'Gateway Sân Vườn',
    serial: 'GW-777333',
    batteryVoltage: '0V',
    temperature: '--',
    powerSource: 'Main',
    isOnline: false,
    wifiSignal: 0,
    totalDevices: 4,
    onlineDevices: 0,
    devices: []
  },
];

export const ACTIONS_DATA = [
  { title: 'Cấu hình thiết bị', icon: 'settings', color: '#4B5563' },
  { title: 'Tạo thiết bị', icon: 'add-circle-outline', color: '#2563EB' },
  { title: 'Quét mã', icon: 'qr-code-scanner', color: '#4B5563' },
];

export const BANNER_IMAGES = [
  require('../../asset/images/baner/baner.jpg'),
  require('../../asset/images/baner/baner1.png'),
  require('../../asset/images/baner/baner2.png'),
  require('../../asset/images/baner/baner3.png'),
  require('../../asset/images/baner/baner4.png'),
  require('../../asset/images/baner/baner5.png'),
  // ...
];