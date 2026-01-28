import { useState, useEffect, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import { BleProtocol } from '../../services/ble';
import { createButtonHandlers } from './handleButton';

export enum Step {
  SCAN_BLE = 1, CONNECTING_BLE = 2, SCAN_WIFI = 3,
  SELECT_WIFI = 4, CONFIGURING = 5, SUCCESS = 6
}

export const useConfigDeviceController = () => {
  const navigation = useNavigation();
  const connectedIdRef = useRef<string | null>(null);

  // --- States ---
  const [currentStep, setCurrentStep] = useState<Step>(Step.SCAN_BLE);
  const [isScanningBle, setIsScanningBle] = useState(false);
  const [bleDevices, setBleDevices] = useState<any[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<'DISCONNECTED' | 'CONNECTING' | 'CONNECTED'>('DISCONNECTED');
  const [deviceName, setDeviceName] = useState<string>('');
  const [status, setStatus] = useState('');

  // --- Listeners ---
  useEffect(() => {
    BleProtocol.init();
    
    const hhuDiscover = BleProtocol.addScanListener((peripheral) => {
      if (!peripheral.name || peripheral.name === 'N/A') return;
      setBleDevices(prev => {
        if (prev.find(p => p.id === peripheral.id)) return prev;
        return [...prev, peripheral];
      });
    });

    const hhuStopScan = BleProtocol.addStopScanListener(() => setIsScanningBle(false));

    return () => {
      hhuDiscover?.remove();
      hhuStopScan?.remove();
      if (connectedIdRef.current) BleProtocol.disconnect(connectedIdRef.current);
    };
  }, []);

  // --- gom nhóm State và Setters ---
  const state = { isScanningBle, bleDevices, connectionStatus, currentStep };
  const setters = { 
    setIsScanningBle, setBleDevices, setStatus, 
    setConnectionStatus, setDeviceName, setCurrentStep 
  };

  // --- Khởi tạo Handlers ---
  const handlers = createButtonHandlers(state, setters, navigation, connectedIdRef);

  return {
    ...state,
    ...handlers,
    deviceName,
    status
  };
};