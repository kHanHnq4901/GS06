import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
} from 'react-native';
import { useAppSelector } from '../../../store/hooks';
import { Device } from '../../../types';

interface StatCard {
    title: string;
    value: string;
    subtitle: string;
    emoji: string;
    color: string;
}

const DeviceStats = () => {
    const { devices, energyUsage } = useAppSelector((state) => state.smartHome);

    const totalDevices = devices.length;
    const activeDevices = devices.filter(device => device.isOn).length;
    const lightDevices = devices.filter(device => device.type === 'light');
    const activeLights = lightDevices.filter(device => device.isOn).length;
    const acDevices = devices.filter(device => device.type === 'ac');
    const activeAC = acDevices.filter(device => device.isOn).length;

    const stats: StatCard[] = [
        {
            title: 'Total Devices',
            value: totalDevices.toString(),
            subtitle: 'Connected',
            emoji: '🏠',
            color: '#007AFF',
        },
        {
            title: 'Active Now',
            value: activeDevices.toString(),
            subtitle: `${Math.round((activeDevices / totalDevices) * 100)}% usage`,
            emoji: '⚡',
            color: '#28a745',
        },
        {
            title: 'Lights On',
            value: activeLights.toString(),
            subtitle: `of ${lightDevices.length} lights`,
            emoji: '💡',
            color: '#FFD93D',
        },
        {
            title: 'AC Running',
            value: activeAC.toString(),
            subtitle: `of ${acDevices.length} units`,
            emoji: '❄️',
            color: '#74B9FF',
        },
        {
            title: 'Energy Usage',
            value: `${energyUsage.current}`,
            subtitle: `${energyUsage.unit} now`,
            emoji: '🔋',
            color: '#E17055',
        },
        {
            title: 'Daily Usage',
            value: `${energyUsage.daily}`,
            subtitle: `${energyUsage.unit} today`,
            emoji: '📊',
            color: '#00B894',
        },
    ];

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Home Statistics</Text>
                <Text style={styles.subtitle}>Real-time device overview</Text>
            </View>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {stats.map((stat, index) => (
                    <View key={index} style={styles.statCard}>
                        <View style={[styles.statIcon, { backgroundColor: `${stat.color}20` }]}>
                            <Text style={styles.statEmoji}>{stat.emoji}</Text>
                        </View>

                        <View style={styles.statContent}>
                            <Text style={styles.statValue}>{stat.value}</Text>
                            <Text style={styles.statTitle}>{stat.title}</Text>
                            <Text style={styles.statSubtitle}>{stat.subtitle}</Text>
                        </View>

                        {/* Progress indicator for active devices */}
                        {stat.title === 'Active Now' && (
                            <View style={styles.progressContainer}>
                                <View style={styles.progressTrack}>
                                    <View
                                        style={[
                                            styles.progressFill,
                                            {
                                                width: `${(activeDevices / totalDevices) * 100}%`,
                                                backgroundColor: stat.color,
                                            }
                                        ]}
                                    />
                                </View>
                            </View>
                        )}
                    </View>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 20,
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
    statCard: {
        width: 120,
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 16,
        marginRight: 12,

        borderWidth: 0.1,
        borderColor: '#000',
    },
    statIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    statEmoji: {
        fontSize: 18,
    },
    statContent: {
        flex: 1,
    },
    statValue: {
        fontSize: 20,
        fontWeight: '800',
        color: '#1a1a2e',
        marginBottom: 4,
    },
    statTitle: {
        fontSize: 12,
        fontWeight: '600',
        color: '#6c757d',
        marginBottom: 2,
    },
    statSubtitle: {
        fontSize: 10,
        color: '#9ca3af',
        fontWeight: '500',
    },
    progressContainer: {
        marginTop: 8,
    },
    progressTrack: {
        height: 4,
        backgroundColor: '#f1f3f4',
        borderRadius: 2,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: 2,
    },
});

export default DeviceStats; 