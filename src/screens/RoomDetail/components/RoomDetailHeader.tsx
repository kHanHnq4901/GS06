import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

interface RoomDetailHeaderProps {
    room: any;
    activeDevices: number;
    totalDevices: number;
}


const RoomDetailHeader = ({
    room,
    activeDevices,
    totalDevices,
}: RoomDetailHeaderProps) => {
    const navigation = useNavigation();

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

    return (
        <View style={styles.header}>
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
            >
                <Text style={styles.backButtonEmoji}>←</Text>
            </TouchableOpacity>

            <View style={styles.headerInfo}>
                <View style={styles.roomInfo}>
                    <View style={[styles.roomIcon, { backgroundColor: room.backgroundColor }]}>
                        <Text style={styles.roomEmoji}>{getRoomEmoji(room.icon)}</Text>
                    </View>
                    <View style={styles.roomText}>
                        <Text style={styles.roomName}>{room.name}</Text>
                        <Text style={styles.deviceCount}>
                            {activeDevices} of {totalDevices} devices active
                        </Text>
                    </View>
                </View>
            </View>

            <View style={styles.headerActions}>
                <TouchableOpacity style={styles.actionButton}>
                    <Text style={styles.actionEmoji}>⚙️</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: '#f1f3f4',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    backButton: {
        padding: 8,
        marginRight: 12,
    },
    backButtonEmoji: {
        fontSize: 20,
        color: '#007AFF',
    },
    headerInfo: {
        flex: 1,
    },
    roomInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    roomIcon: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    roomEmoji: {
        fontSize: 24,
    },
    roomText: {
        flex: 1,
    },
    roomName: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1a1a2e',
        marginBottom: 2,
    },
    deviceCount: {
        fontSize: 14,
        color: '#6c757d',
        fontWeight: '500',
    },
    headerActions: {
        flexDirection: 'row',
        gap: 8,
    },
    actionButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#f8f9fa',
        justifyContent: 'center',
        alignItems: 'center',
    },
    actionEmoji: {
        fontSize: 18,
    },
});

export default RoomDetailHeader; 