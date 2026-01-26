import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { toggleDevice } from '../../../store/smartHomeSlice';

interface QuickAction {
    id: string;
    title: string;
    subtitle: string;
    emoji: string;
    backgroundColor: string;
    action: () => void;
}

const QuickActions = () => {
    const dispatch = useAppDispatch();
    const { devices } = useAppSelector((state) => state.smartHome);

    const lightDevices = devices.filter(device => device.type === 'light');
    const acDevices = devices.filter(device => device.type === 'ac');
    const allDevices = devices;

    const quickActions: QuickAction[] = [
        {
            id: 'all-lights-on',
            title: 'All Lights On',
            subtitle: `${lightDevices.filter(d => !d.isOn).length} lights off`,
            emoji: '💡',
            backgroundColor: '#FFD93D',
            action: () => {
                lightDevices.forEach(device => {
                    if (!device.isOn) {
                        dispatch(toggleDevice(device.id));
                    }
                });
            },
        },
        {
            id: 'all-lights-off',
            title: 'All Lights Off',
            subtitle: `${lightDevices.filter(d => d.isOn).length} lights on`,
            emoji: '🌙',
            backgroundColor: '#6C5CE7',
            action: () => {
                lightDevices.forEach(device => {
                    if (device.isOn) {
                        dispatch(toggleDevice(device.id));
                    }
                });
            },
        },
        {
            id: 'ac-off',
            title: 'AC Off',
            subtitle: `${acDevices.filter(d => d.isOn).length} AC units on`,
            emoji: '❄️',
            backgroundColor: '#74B9FF',
            action: () => {
                acDevices.forEach(device => {
                    if (device.isOn) {
                        dispatch(toggleDevice(device.id));
                    }
                });
            },
        },
        {
            id: 'good-night',
            title: 'Good Night',
            subtitle: 'Turn off everything',
            emoji: '😴',
            backgroundColor: '#2D3436',
            action: () => {
                allDevices.forEach(device => {
                    if (device.isOn) {
                        dispatch(toggleDevice(device.id));
                    }
                });
            },
        },
        {
            id: 'movie-mode',
            title: 'Movie Mode',
            subtitle: 'Dim lights, TV on',
            emoji: '🎬',
            backgroundColor: '#E17055',
            action: () => {
                // Turn off lights, turn on TV
                lightDevices.forEach(device => {
                    if (device.isOn) {
                        dispatch(toggleDevice(device.id));
                    }
                });
                const tvDevices = devices.filter(device => device.type === 'tv');
                tvDevices.forEach(device => {
                    if (!device.isOn) {
                        dispatch(toggleDevice(device.id));
                    }
                });
            },
        },
        {
            id: 'work-mode',
            title: 'Work Mode',
            subtitle: 'Office lights on',
            emoji: '💼',
            backgroundColor: '#00B894',
            action: () => {
                // Turn on office lights
                const officeLights = lightDevices.filter(device =>
                    device.roomId === '5' // Office room
                );
                officeLights.forEach(device => {
                    if (!device.isOn) {
                        dispatch(toggleDevice(device.id));
                    }
                });
            },
        },
    ];

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Quick Actions</Text>
                <Text style={styles.subtitle}>Control multiple devices at once</Text>
            </View>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {quickActions.map((action) => (
                    <TouchableOpacity
                        key={action.id}
                        style={[
                            styles.actionCard,
                            { backgroundColor: action.backgroundColor },
                        ]}
                        onPress={action.action}
                        activeOpacity={0.8}
                    >
                        <View style={styles.actionContent}>
                            <Text style={styles.actionEmoji}>{action.emoji}</Text>
                            <Text style={styles.actionTitle}>{action.title}</Text>
                            <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
                        </View>

                        {/* Background Pattern */}
                        <View style={styles.backgroundPattern} />
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 0,
    },
    header: {
        paddingHorizontal: 20,
        marginBottom: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1a1a2e',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
        color: '#6c757d',
        fontWeight: '500',
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingRight: 20,
    },
    actionCard: {
        width: 140,
        height: 120,
        borderRadius: 20,
        marginRight: 12,
        position: 'relative',
        overflow: 'hidden',
    },
    actionContent: {
        flex: 1,
        padding: 16,
        justifyContent: 'space-between',
        zIndex: 1,
    },
    actionEmoji: {
        fontSize: 24,
        marginBottom: 8,
    },
    actionTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#ffffff',
        marginBottom: 4,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    actionSubtitle: {
        fontSize: 11,
        color: 'rgba(255, 255, 255, 0.9)',
        fontWeight: '500',
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    backgroundPattern: {
        position: 'absolute',
        top: -20,
        right: -20,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
});

export default QuickActions; 