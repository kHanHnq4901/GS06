import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

interface EmptyStateProps {
    type: 'no-room' | 'no-devices';
}

const EmptyState = ({ type }: EmptyStateProps) => {
    const navigation = useNavigation();

    const getEmptyStateData = () => {
        if (type === 'no-room') {
            return {
                emoji: '🏠',
                title: 'No Room Selected',
                text: 'Go back to the dashboard and select a room to view its devices',
                showBackButton: true,
            };
        } else {
            return {
                emoji: '💡',
                title: 'No Devices Found',
                text: 'This room doesn\'t have any smart devices configured yet',
                showBackButton: false,
            };
        }
    };

    const data = getEmptyStateData();

    return (
        <View style={styles.emptyState}>
            <View style={styles.emptyIconContainer}>
                <Text style={styles.emptyEmoji}>{data.emoji}</Text>
            </View>
            <Text style={styles.emptyStateTitle}>{data.title}</Text>
            <Text style={styles.emptyStateText}>{data.text}</Text>
            {data.showBackButton && (
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.backButtonEmoji}>←</Text>
                    <Text style={styles.backButtonText}>Back to Dashboard</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32,
        paddingVertical: 40,
    },
    emptyIconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#f8f9fa',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    emptyEmoji: {
        fontSize: 48,
    },
    emptyStateTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1a1a2e',
        textAlign: 'center',
        marginBottom: 8,
    },
    emptyStateText: {
        fontSize: 16,
        color: '#6c757d',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 24,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#007AFF',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 25,
    },
    backButtonEmoji: {
        fontSize: 16,
        color: '#ffffff',
    },
    backButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#ffffff',
        marginLeft: 8,
    },
});

export default EmptyState; 