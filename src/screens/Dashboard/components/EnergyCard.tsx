import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useAppSelector } from '../../../store/hooks';

interface EnergyCardProps {
    scrollY?: Animated.Value;
}

const EnergyCard = ({ scrollY }: EnergyCardProps) => {
    const { energyUsage } = useAppSelector((state) => state.smartHome);

    // Parallax effect for energy card
    const cardTranslateY = scrollY ? scrollY.interpolate({
        inputRange: [-1, 0, 100, 101],
        outputRange: [0, 0, -5, -5],
        extrapolate: 'clamp',
    }) : 0;

    const cardScale = scrollY ? scrollY.interpolate({
        inputRange: [-1, 0, 100, 101],
        outputRange: [1, 1, 0.98, 0.98],
        extrapolate: 'clamp',
    }) : 1;

    return (
        <Animated.View style={[
            styles.container,
            {
                transform: [
                    { translateY: cardTranslateY },
                    { scale: cardScale },
                ],
            }
        ]}>
            <View style={styles.header}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>⚡ Energy Usage</Text>
                    <Text style={styles.subtitle}>Real-time monitoring</Text>
                </View>
                <View style={styles.iconContainer}>
                    <Text style={styles.iconEmoji}>⚡</Text>
                </View>
            </View>

            <View style={styles.usageContainer}>
                <View style={styles.usageItem}>
                    <View style={styles.usageIcon}>
                        <Text style={styles.usageEmoji}>🟢</Text>
                    </View>
                    <Text style={styles.usageLabel}>Current</Text>
                    <Text style={styles.usageValue}>
                        {energyUsage.current} {energyUsage.unit}
                    </Text>
                    <Text style={styles.usageTrend}>↗ +0.2</Text>
                </View>

                <View style={styles.divider} />

                <View style={styles.usageItem}>
                    <View style={styles.usageIcon}>
                        <Text style={styles.usageEmoji}>📅</Text>
                    </View>
                    <Text style={styles.usageLabel}>Daily</Text>
                    <Text style={styles.usageValue}>
                        {energyUsage.daily} {energyUsage.unit}
                    </Text>
                    <Text style={styles.usageTrend}>↘ -1.2</Text>
                </View>

                <View style={styles.divider} />

                <View style={styles.usageItem}>
                    <View style={styles.usageIcon}>
                        <Text style={styles.usageEmoji}>📊</Text>
                    </View>
                    <Text style={styles.usageLabel}>Monthly</Text>
                    <Text style={styles.usageValue}>
                        {energyUsage.monthly} {energyUsage.unit}
                    </Text>
                    <Text style={styles.usageTrend}>↗ +15</Text>
                </View>
            </View>

            <View style={styles.efficiencyContainer}>
                <View style={styles.efficiencyItem}>
                    <Text style={styles.efficiencyEmoji}>🌱</Text>
                    <Text style={styles.efficiencyText}>Efficient</Text>
                </View>
                <View style={styles.efficiencyItem}>
                    <Text style={styles.efficiencyEmoji}>📈</Text>
                    <Text style={styles.efficiencyText}>On Track</Text>
                </View>
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 24,
        marginHorizontal: 20,
        marginVertical: 8,
        borderWidth: 0.1,
        borderColor: '#000',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 24,
    },
    titleContainer: {
        flex: 1,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1a1a2e',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
        color: '#6c757d',
        fontWeight: '500',
    },
    iconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#fff3cd',
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconEmoji: {
        fontSize: 24,
    },
    usageContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    usageItem: {
        flex: 1,
        alignItems: 'center',
    },
    usageIcon: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#f8f9fa',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    usageEmoji: {
        fontSize: 16,
    },
    usageLabel: {
        fontSize: 12,
        color: '#6c757d',
        marginBottom: 6,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    usageValue: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1a1a2e',
        marginBottom: 4,
    },
    usageTrend: {
        fontSize: 11,
        fontWeight: '600',
        color: '#28a745',
    },
    divider: {
        width: 1,
        height: 60,
        backgroundColor: '#e9ecef',
    },
    efficiencyContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#f1f3f4',
    },
    efficiencyItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    efficiencyEmoji: {
        fontSize: 16,
    },
    efficiencyText: {
        fontSize: 12,
        color: '#6c757d',
        fontWeight: '600',
    },
});

export default EnergyCard; 