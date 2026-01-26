import React from 'react';
import {
    View,
    Text,
    StyleSheet,
} from 'react-native';

const QuickActions = () => {
    const quickActions = [
        { emoji: '💡', text: 'All Lights' },
        { emoji: '🔒', text: 'Security' },
        { emoji: '🌡️', text: 'Climate' },
        { emoji: '🎮', text: 'Entertainment' },
    ];

    return (
        <View style={styles.quickActionsSection}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Quick Actions</Text>
                <Text style={styles.sectionSubtitle}>Control multiple devices at once</Text>
            </View>
            <View style={styles.quickActionsGrid}>
                {quickActions.map((action, index) => (
                    <View key={index} style={styles.quickAction}>
                        <View style={styles.quickActionIcon}>
                            <Text style={styles.quickActionEmoji}>{action.emoji}</Text>
                        </View>
                        <Text style={styles.quickActionText}>{action.text}</Text>
                    </View>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    quickActionsSection: {
        marginBottom: 20,
    },
    sectionHeader: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1a1a2e',
        marginBottom: 4,
        letterSpacing: -0.5,
    },
    sectionSubtitle: {
        fontSize: 14,
        color: '#6c757d',
        fontWeight: '500',
    },
    quickActionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 16,
        gap: 16,
    },
    quickAction: {
        backgroundColor: '#ffffff',
        borderRadius: 20,
        padding: 20,
        width: '47%',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 4,
        borderWidth: 1,
        borderColor: '#f1f3f4',
    },
    quickActionIcon: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#f8f9fa',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    quickActionEmoji: {
        fontSize: 24,
    },
    quickActionText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1a1a2e',
        textAlign: 'center',
    },
});

export default QuickActions; 