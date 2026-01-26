import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import { Device } from '../../../types';

interface DeviceFilterProps {
    devices: Device[];
    onFilterChange: (filteredDevices: Device[]) => void;
}

type FilterType = 'all' | 'light' | 'ac' | 'tv' | 'fan' | 'camera';
type StatusFilter = 'all' | 'on' | 'off';

const DeviceFilter = ({
    devices,
    onFilterChange,
}: DeviceFilterProps) => {
    const [activeTypeFilter, setActiveTypeFilter] = useState<FilterType>('all');
    const [activeStatusFilter, setActiveStatusFilter] = useState<StatusFilter>('all');

    const typeFilters: { type: FilterType; label: string; emoji: string }[] = [
        { type: 'all', label: 'All', emoji: '🏠' },
        { type: 'light', label: 'Lights', emoji: '💡' },
        { type: 'ac', label: 'AC', emoji: '❄️' },
        { type: 'tv', label: 'TV', emoji: '📺' },
        { type: 'fan', label: 'Fans', emoji: '💨' },
        { type: 'camera', label: 'Cameras', emoji: '📹' },
    ];

    const statusFilters: { status: StatusFilter; label: string; color: string }[] = [
        { status: 'all', label: 'All', color: '#6c757d' },
        { status: 'on', label: 'On', color: '#28a745' },
        { status: 'off', label: 'Off', color: '#dc3545' },
    ];

    const applyFilters = (typeFilter: FilterType, statusFilter: StatusFilter) => {
        let filtered = devices;

        // Apply type filter
        if (typeFilter !== 'all') {
            filtered = filtered.filter(device => device.type === typeFilter);
        }

        // Apply status filter
        if (statusFilter !== 'all') {
            filtered = filtered.filter(device =>
                statusFilter === 'on' ? device.isOn : !device.isOn
            );
        }

        onFilterChange(filtered);
    };

    const handleTypeFilter = (type: FilterType) => {
        setActiveTypeFilter(type);
        applyFilters(type, activeStatusFilter);
    };

    const handleStatusFilter = (status: StatusFilter) => {
        setActiveStatusFilter(status);
        applyFilters(activeTypeFilter, status);
    };

    return (
        <View style={styles.container}>
            {/* Type Filters */}
            <View style={styles.filterSection}>
                <Text style={styles.sectionTitle}>Device Type</Text>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.filterScroll}
                >
                    {typeFilters.map((filter) => (
                        <TouchableOpacity
                            key={filter.type}
                            style={[
                                styles.filterChip,
                                activeTypeFilter === filter.type && styles.activeChip,
                            ]}
                            onPress={() => handleTypeFilter(filter.type)}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.filterEmoji}>{filter.emoji}</Text>
                            <Text style={[
                                styles.filterLabel,
                                activeTypeFilter === filter.type && styles.activeLabel,
                            ]}>
                                {filter.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* Status Filters */}
            <View style={styles.filterSection}>
                <Text style={styles.sectionTitle}>Status</Text>
                <View style={styles.statusFilters}>
                    {statusFilters.map((filter) => (
                        <TouchableOpacity
                            key={filter.status}
                            style={[
                                styles.statusChip,
                                activeStatusFilter === filter.status && styles.activeStatusChip,
                                { borderColor: filter.color },
                            ]}
                            onPress={() => handleStatusFilter(filter.status)}
                            activeOpacity={0.7}
                        >
                            <View style={[
                                styles.statusDot,
                                { backgroundColor: filter.color },
                            ]} />
                            <Text style={[
                                styles.statusLabel,
                                activeStatusFilter === filter.status && { color: filter.color },
                            ]}>
                                {filter.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: '#f1f3f4',
    },
    filterSection: {
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1a1a2e',
        marginBottom: 8,
        letterSpacing: 0.5,
    },
    filterScroll: {
        paddingRight: 16,
    },
    filterChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginRight: 12,
        borderRadius: 20,
        backgroundColor: '#f8f9fa',
        borderWidth: 1,
        borderColor: '#e9ecef',
        minWidth: 80,
        justifyContent: 'center',
    },
    activeChip: {
        backgroundColor: '#007AFF',
        borderColor: '#007AFF',
    },
    filterEmoji: {
        fontSize: 16,
        marginRight: 6,
    },
    filterLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: '#6c757d',
    },
    activeLabel: {
        color: '#ffffff',
    },
    statusFilters: {
        flexDirection: 'row',
        gap: 12,
    },
    statusChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#e9ecef',
        minWidth: 60,
        justifyContent: 'center',
    },
    activeStatusChip: {
        backgroundColor: 'rgba(0, 122, 255, 0.1)',
        borderColor: '#007AFF',
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 6,
    },
    statusLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: '#6c757d',
    },
});

export default DeviceFilter; 