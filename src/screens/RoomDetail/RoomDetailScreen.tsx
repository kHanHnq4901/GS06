import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
    FlatList,
    StatusBar,
} from 'react-native';
import { useAppSelector } from '../../store/hooks';
import DeviceCard from '../Dashboard/components/DeviceCard';
import DeviceFilter from '../Dashboard/components/DeviceFilter';
import DeviceSearch from './components/DeviceSearch';
import { styles } from './styles';
import { RoomDetailHeader, ProgressBar, EmptyState } from './components';
import { Device } from '../../types';
import { SafeAreaView } from 'react-native-safe-area-context';

const RoomDetailScreen = () => {
    const { rooms, devices, selectedRoomId } = useAppSelector(
        (state) => state.smartHome
    );
    const [filteredDevices, setFilteredDevices] = useState<Device[]>([]);

    // Memoize the selected room to prevent unnecessary recalculations
    const selectedRoom = useMemo(() =>
        rooms.find(room => room.id === selectedRoomId),
        [rooms, selectedRoomId]
    );

    // Memoize room devices to prevent infinite re-renders
    const roomDevices = useMemo(() =>
        devices.filter(device => selectedRoom?.deviceIds.includes(device.id)),
        [devices, selectedRoom?.deviceIds]
    );

    // Memoize device counts
    const activeDevices = useMemo(() =>
        roomDevices.filter(device => device.isOn).length,
        [roomDevices]
    );

    const totalDevices = useMemo(() =>
        roomDevices.length,
        [roomDevices]
    );

    // Initialize filtered devices with all room devices
    useEffect(() => {
        setFilteredDevices(roomDevices);
    }, [roomDevices]);

    const handleFilterChange = useCallback((filtered: Device[]) => {
        setFilteredDevices(filtered);
    }, []);

    const handleDeviceSelect = useCallback((device: Device) => {
        if (device.roomId !== selectedRoomId) {
            setFilteredDevices([device]);
        }
    }, [selectedRoomId]);

    const renderDeviceCard = useCallback(({ item }: { item: Device }) => (
        <DeviceCard device={item} />
    ), []);

    if (!selectedRoom) {
        return (
            <SafeAreaView style={styles.container}>
                <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
                <EmptyState type="no-room" />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

            {/* Header */}
            <RoomDetailHeader
                room={selectedRoom}
                activeDevices={activeDevices}
                totalDevices={totalDevices}
            />

            {/* Progress Bar */}
            <ProgressBar
                activeDevices={activeDevices}
                totalDevices={totalDevices}
                backgroundColor={selectedRoom.backgroundColor}
            />

            {/* Device Search */}
            <DeviceSearch onDeviceSelect={handleDeviceSelect} />

            {/* Device Filter */}
            <DeviceFilter
                devices={roomDevices}
                onFilterChange={handleFilterChange}
            />

            {/* Devices Grid */}
            <FlatList
                data={filteredDevices}
                renderItem={renderDeviceCard}
                keyExtractor={(item) => item.id}
                numColumns={2}
                contentContainerStyle={styles.devicesGrid}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <EmptyState
                        type={roomDevices.length === 0 ? "no-devices" : "no-filtered-devices"}
                    />
                }
            />
        </SafeAreaView>
    );
};

export default RoomDetailScreen; 