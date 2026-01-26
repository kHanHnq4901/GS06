import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Animated,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { selectRoom } from '../../../store/smartHomeSlice';
import { Room } from '../../../types';

interface RoomCardProps {
    room: Room;
    isSelected: boolean;
    scrollY?: Animated.Value;
    index?: number;
}

const RoomCard = ({
    room,
    isSelected,
    scrollY,
    index = 0,
}: RoomCardProps) => {
    const dispatch = useAppDispatch();
    const { devices } = useAppSelector((state) => state.smartHome);

    const activeDevices = devices.filter(
        device => room.deviceIds.includes(device.id) && device.isOn
    ).length;

    const totalDevices = room.deviceIds.length;

    const handlePress = () => {
        dispatch(selectRoom(room.id));
    };

    // Map room icons to emojis
    const getRoomEmoji = (iconName: string) => {
        const emojiMap: { [key: string]: string } = {
            'sofa': '🛋️',
            'bed': '🛏️',
            'utensils': '🍽️',
            'bath': '🛁',
            'laptop': '💻',
            'car': '🚗',
            'home': '🏠',
        };
        return emojiMap[iconName] || '🏠';
    };

    // Parallax effect for room cards
    const cardTranslateY = scrollY ? scrollY.interpolate({
        inputRange: [-1, 0, 100, 101],
        outputRange: [0, 0, -10, -10],
        extrapolate: 'clamp',
    }) : 0;

    const cardScale = scrollY ? scrollY.interpolate({
        inputRange: [-1, 0, 100, 101],
        outputRange: [1, 1, 0.95, 0.95],
        extrapolate: 'clamp',
    }) : 1;

    const cardOpacity = scrollY ? scrollY.interpolate({
        inputRange: [-1, 0, 50, 100, 101],
        outputRange: [1, 1, 0.9, 0.8, 0.8],
        extrapolate: 'clamp',
    }) : 1;

    return (
        <Animated.View style={[
            styles.cardContainer,
            {
                transform: [
                    { translateY: cardTranslateY },
                    { scale: cardScale },
                ],
                opacity: cardOpacity,
            }
        ]}>
            <TouchableOpacity
                style={[
                    styles.container,
                    { backgroundColor: room.backgroundColor },
                    isSelected && styles.selectedContainer,
                ]}
                onPress={handlePress}
                activeOpacity={0.8}
            >
                {/* Background Pattern */}
                <View style={styles.backgroundPattern} />

                {/* Content */}
                <View style={styles.content}>
                    <View style={styles.iconContainer}>
                        <Text style={styles.roomEmoji}>{getRoomEmoji(room.icon)}</Text>
                    </View>

                    <Text style={styles.roomName}>{room.name}</Text>

                    <View style={styles.deviceInfo}>
                        <View style={styles.deviceCount}>
                            <Text style={styles.deviceDot}>●</Text>
                            <Text style={styles.deviceCountText}>
                                {activeDevices} of {totalDevices} active
                            </Text>
                        </View>

                        <View style={styles.deviceBar}>
                            <View
                                style={[
                                    styles.deviceBarFill,
                                    { width: `${(activeDevices / totalDevices) * 100}%` }
                                ]}
                            />
                        </View>
                    </View>
                </View>

                {/* Selection Indicator */}
                {isSelected && (
                    <View style={styles.selectedIndicator}>
                        <Text style={styles.selectedEmoji}>✅</Text>
                    </View>
                )}

                {/* Hover Effect */}
                <View style={styles.hoverEffect} />
            </TouchableOpacity>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    cardContainer: {
        marginHorizontal: 8,
    },
    container: {
        width: 140,
        borderRadius: 24,
        position: 'relative',
        overflow: 'hidden',
    },
    selectedContainer: {
        transform: [{ scale: 1.05 }],
        shadowOpacity: 0.25,
        shadowRadius: 12,
        elevation: 10,
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
    content: {
        flex: 1,
        padding: 20,
        justifyContent: 'space-between',
    },
    iconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    roomEmoji: {
        fontSize: 24,
    },
    roomName: {
        fontSize: 18,
        fontWeight: '700',
        color: '#FFFFFF',
        textAlign: 'center',
        marginBottom: 16,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    deviceInfo: {
        alignItems: 'center',
    },
    deviceCount: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        marginBottom: 8,
    },
    deviceDot: {
        fontSize: 8,
        color: '#FFFFFF',
    },
    deviceCountText: {
        fontSize: 12,
        color: '#FFFFFF',
        fontWeight: '600',
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    deviceBar: {
        width: '100%',
        height: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        borderRadius: 2,
        overflow: 'hidden',
    },
    deviceBarFill: {
        height: '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: 2,
    },
    selectedIndicator: {
        position: 'absolute',
        top: 12,
        right: 12,
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    selectedEmoji: {
        fontSize: 12,
    },
    hoverEffect: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        opacity: 0,
    },
});

export default RoomCard; 