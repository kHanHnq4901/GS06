import React from 'react';
import {
    View,
    Text,
    StyleSheet,
} from 'react-native';

interface ProgressBarProps {
    activeDevices: number;
    totalDevices: number;
    backgroundColor: string;
}

const ProgressBar = ({
    activeDevices,
    totalDevices,
    backgroundColor,
}: ProgressBarProps) => {
    const progressPercentage = totalDevices > 0 ? (activeDevices / totalDevices) * 100 : 0;

    return (
        <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
                <View
                    style={[
                        styles.progressFill,
                        {
                            width: `${progressPercentage}%`,
                            backgroundColor: backgroundColor
                        }
                    ]}
                />
            </View>
            <Text style={styles.progressText}>
                {Math.round(progressPercentage)}% active
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    progressContainer: {
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: '#f1f3f4',
    },
    progressBar: {
        height: 6,
        backgroundColor: '#e9ecef',
        borderRadius: 3,
        marginBottom: 8,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: 3,
    },
    progressText: {
        fontSize: 12,
        color: '#6c757d',
        fontWeight: '600',
        textAlign: 'center',
    },
});

export default ProgressBar; 