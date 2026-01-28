import { useState, useEffect } from 'react';
import { BleProtocol } from '../../services/ble';
import { createWifiHandlers } from './handleButton';

export const useWifiSetupController = (peripheralId: string, navigation: any) => {
  const [loading, setLoading] = useState(false);
  const [hasStartedScan, setHasStartedScan] = useState(false);
  const [wifiList, setWifiList] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSsid, setSelectedSsid] = useState('');
  const [password, setPassword] = useState('');
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [step, setStep] = useState('IDLE'); // IDLE | SCANNING | SUCCESS

  useEffect(() => {
    const dataListener = BleProtocol.addDataListener((res) => {
      if (res.type === 'scan_resp' && res.data?.aps) {
        const sorted = res.data.aps.sort((a: any, b: any) => b.rssi - a.rssi);
        setWifiList(sorted);
        setLoading(false);
      }
      if (res.type === 'wifi_result' && res.data?.result === 'success') {
        setIsConfiguring(false);
        setStep('SUCCESS');
      }
    });

    return () => dataListener.remove();
  }, [peripheralId]);

  const startWifiScan = () => {
    setHasStartedScan(true);
    setLoading(true);
    BleProtocol.requestWifiScan(peripheralId);
  };

  const setters = { setModalVisible, setSelectedSsid, setPassword, setIsConfiguring };
  const handlers = createWifiHandlers(peripheralId, setters, navigation);

  return {
    loading, wifiList, modalVisible, selectedSsid, password, 
    isConfiguring, step, hasStartedScan,
    startWifiScan,
    ...setters, ...handlers
  };
};