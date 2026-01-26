import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Switch,
    Animated
} from 'react-native';
import { useAppDispatch } from '../../../store/hooks';
import { toggleDevice, updateDeviceValue } from '../../../store/smartHomeSlice';
import { Device } from '../../../types';

interface DeviceCardProps {
    device: Device;
}

const DeviceCard = ({ device }: DeviceCardProps) => {
    const dispatch = useAppDispatch();
    const [isExpanded, setIsExpanded] = useState(false);
    const [sliderValue] = useState(new Animated.Value(device.value || 0));

    const handleToggle = () => {
        dispatch(toggleDevice(device.id));
    };

    const handleSliderChange = (value: number) => {
        dispatch(updateDeviceValue({ deviceId: device.id, value }));
    };

    const getStatusColor = () => {
        return device.isOn ? '#28a745' : '#6c757d';
    };

    const getIconColor = () => {
        return device.isOn ? '#007AFF' : '#6c757d';
    };

    const getBackgroundColor = () => {
        return device.isOn ? '#f8f9fa' : '#ffffff';
    };

    const isDimmable = device.type === 'light' && device.value !== undefined;

    // Map device icons to emojis
    const getDeviceEmoji = (iconName: string) => {
        const emojiMap: { [key: string]: string } = {
            'lightbulb': '💡',
            'snowflake': '❄️',
            'tv': '📺',
            'fan': '💨',
            'door-open': '🚪',
            'video': '📹',
            'circle': '⚪',
        };
        return emojiMap[iconName] || '⚪';
    };

    const handleCardPress = () => {
        if (isDimmable) {
            setIsExpanded(!isExpanded);
        }
    };

    return (
        <TouchableOpacity
            style={[styles.container, { backgroundColor: getBackgroundColor() }]}
            onPress={handleCardPress}
            activeOpacity={0.9}
        >
            {/* Header */}
            <View style={styles.header}>
                <View style={[styles.iconContainer, { backgroundColor: device.isOn ? '#e3f2fd' : '#f8f9fa' }]}>
                    <Text style={styles.deviceEmoji}>{getDeviceEmoji(device.icon)}</Text>
                </View>

                <Switch
                    value={device.isOn}
                    onValueChange={handleToggle}
                    trackColor={{ false: '#e9ecef', true: '#28a745' }}
                    thumbColor="#ffffff"
                    ios_backgroundColor="#e9ecef"
                    style={styles.switch}
                />
            </View>

            {/* Device Info */}
            <View style={styles.deviceInfo}>
                <Text style={styles.deviceName}>{device.name}</Text>

                {device.value !== undefined && (
                    <View style={styles.valueContainer}>
                        <Text style={[styles.value, { color: getStatusColor() }]}>
                            {device.value}{device.unit}
                        </Text>
                        <View style={styles.valueIndicator}>
                            <Text style={styles.valueDot}>●</Text>
                        </View>
                    </View>
                )}
            </View>

            {/* Dimmable Slider */}
            {isDimmable && device.isOn && (
                <Animated.View style={[styles.sliderContainer, { opacity: isExpanded ? 1 : 0, height: isExpanded ? 60 : 0 }]}>
                    <View style={styles.sliderTrack}>
                        <View style={[styles.sliderFill, { width: `${device.value}%` }]} />
                        <View style={[styles.sliderThumb, { left: `${device.value}%` }]} />
                    </View>
                    <View style={styles.sliderLabels}>
                        <Text style={styles.sliderLabel}>0%</Text>
                        <Text style={styles.sliderLabel}>100%</Text>
                    </View>
                </Animated.View>
            )}

            {/* Status Bar */}
            <View style={styles.statusContainer}>
                <View style={[styles.statusDot, { backgroundColor: getStatusColor() }]} />
                <Text style={[styles.statusText, { color: getStatusColor() }]}>
                    {device.isOn ? 'ON' : 'OFF'}
                </Text>
                <View style={styles.statusSpacer} />
                <Text style={styles.deviceType}>{device.type.toUpperCase()}</Text>
            </View>

            {/* Active Indicator */}
            {device.isOn && (
                <View style={styles.activeIndicator}>
                    <Text style={styles.activeEmoji}>⚡</Text>
                </View>
            )}

            {/* Expand Indicator */}
            {isDimmable && (
                <View style={styles.expandIndicator}>
                    <Text style={styles.expandEmoji}>{isExpanded ? '▼' : '▲'}</Text>
                </View>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 20,
        padding: 20,
        margin: 8,
        width: '45%',
        borderWidth: 0.1,
        borderColor: '#000',
        position: 'relative',
        minHeight: 140,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    iconContainer: {
        width: 45,
        height: 45,
        borderRadius: 22.5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    deviceEmoji: {
        fontSize: 20,
    },
    switch: {
        transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }],
    },
    deviceInfo: {
        marginBottom: 16,
    },
    deviceName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1a1a2e',
        marginBottom: 8,
        letterSpacing: -0.3,
    },
    valueContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    value: {
        fontSize: 18,
        fontWeight: '800',
        letterSpacing: -0.5,
    },
    valueIndicator: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: 'rgba(40, 167, 69, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    valueDot: {
        fontSize: 8,
        color: '#28a745',
    },
    sliderContainer: {
        marginBottom: 16,
        overflow: 'hidden',
    },
    sliderTrack: {
        height: 6,
        backgroundColor: '#e9ecef',
        borderRadius: 3,
        position: 'relative',
        marginBottom: 8,
    },
    sliderFill: {
        height: '100%',
        backgroundColor: '#007AFF',
        borderRadius: 3,
    },
    sliderThumb: {
        position: 'absolute',
        top: -4,
        width: 14,
        height: 14,
        backgroundColor: '#007AFF',
        borderRadius: 7,
        borderWidth: 2,
        borderColor: '#ffffff',
    },
    sliderLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    sliderLabel: {
        fontSize: 10,
        color: '#6c757d',
        fontWeight: '500',
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    statusSpacer: {
        flex: 1,
    },
    deviceType: {
        fontSize: 10,
        color: '#6c757d',
        fontWeight: '600',
        letterSpacing: 0.5,
    },
    activeIndicator: {
        position: 'absolute',
        top: 12,
        right: 12,
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: 'rgba(40, 167, 69, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    activeEmoji: {
        fontSize: 12,
    },
    expandIndicator: {
        position: 'absolute',
        bottom: 8,
        right: 8,
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: 'rgba(0, 122, 255, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    expandEmoji: {
        fontSize: 10,
        color: '#007AFF',
    },
});

export default DeviceCard; 