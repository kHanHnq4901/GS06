import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    FlatList,
} from 'react-native';
import { useAppSelector } from '../../../store/hooks';
import { Device, Room } from '../../../types';

interface DeviceSearchProps {
    onDeviceSelect: (device: Device) => void;
}

interface SearchResult {
    device: Device;
    room: Room;
}

const DeviceSearch = ({ onDeviceSelect }: DeviceSearchProps) => {
    const { devices, rooms } = useAppSelector((state) => state.smartHome);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        if (searchQuery.trim().length > 0) {
            setIsSearching(true);
            const results = devices
                .filter(device =>
                    device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    device.type.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map(device => {
                    const room = rooms.find(r => r.id === device.roomId);
                    return { device, room: room! };
                })
                .slice(0, 10); // Limit to 10 results
            setSearchResults(results);
        } else {
            setSearchResults([]);
            setIsSearching(false);
        }
    }, [searchQuery, devices, rooms]);

    const handleDeviceSelect = (result: SearchResult) => {
        onDeviceSelect(result.device);
        setSearchQuery('');
        setSearchResults([]);
    };

    const renderSearchResult = ({ item }: { item: SearchResult }) => (
        <TouchableOpacity
            style={styles.searchResult}
            onPress={() => handleDeviceSelect(item)}
            activeOpacity={0.7}
        >
            <View style={styles.resultContent}>
                <View style={styles.deviceInfo}>
                    <Text style={styles.deviceName}>{item.device.name}</Text>
                    <Text style={styles.roomName}>{item.room.name}</Text>
                </View>

                <View style={styles.deviceStatus}>
                    <View style={[
                        styles.statusDot,
                        { backgroundColor: item.device.isOn ? '#28a745' : '#6c757d' }
                    ]} />
                    <Text style={[
                        styles.statusText,
                        { color: item.device.isOn ? '#28a745' : '#6c757d' }
                    ]}>
                        {item.device.isOn ? 'ON' : 'OFF'}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search devices..."
                    placeholderTextColor="#9ca3af"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    autoCapitalize="none"
                    autoCorrect={false}
                />
                {searchQuery.length > 0 && (
                    <TouchableOpacity
                        style={styles.clearButton}
                        onPress={() => {
                            setSearchQuery('');
                            setSearchResults([]);
                        }}
                    >
                        <Text style={styles.clearText}>✕</Text>
                    </TouchableOpacity>
                )}
            </View>

            {isSearching && searchResults.length > 0 && (
                <View style={styles.resultsContainer}>
                    <Text style={styles.resultsTitle}>
                        {searchResults.length} device{searchResults.length !== 1 ? 's' : ''} found
                    </Text>
                    <FlatList
                        data={searchResults}
                        renderItem={renderSearchResult}
                        keyExtractor={(item) => item.device.id}
                        showsVerticalScrollIndicator={false}
                        style={styles.resultsList}
                    />
                </View>
            )}

            {isSearching && searchQuery.length > 0 && searchResults.length === 0 && (
                <View style={styles.noResults}>
                    <Text style={styles.noResultsText}>No devices found</Text>
                    <Text style={styles.noResultsSubtext}>Try a different search term</Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: '#f1f3f4',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    searchInput: {
        flex: 1,
        height: 40,
        backgroundColor: '#f8f9fa',
        borderRadius: 20,
        paddingHorizontal: 16,
        fontSize: 16,
        color: '#1a1a2e',
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    clearButton: {
        marginLeft: 8,
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#e9ecef',
        justifyContent: 'center',
        alignItems: 'center',
    },
    clearText: {
        fontSize: 12,
        color: '#6c757d',
        fontWeight: '600',
    },
    resultsContainer: {
        maxHeight: 300,
        borderTopWidth: 1,
        borderTopColor: '#f1f3f4',
    },
    resultsTitle: {
        fontSize: 12,
        color: '#6c757d',
        fontWeight: '600',
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: '#f8f9fa',
    },
    resultsList: {
        maxHeight: 250,
    },
    searchResult: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f3f4',
    },
    resultContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    deviceInfo: {
        flex: 1,
    },
    deviceName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1a1a2e',
        marginBottom: 2,
    },
    roomName: {
        fontSize: 12,
        color: '#6c757d',
        fontWeight: '500',
    },
    deviceStatus: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
    },
    noResults: {
        padding: 20,
        alignItems: 'center',
    },
    noResultsText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#6c757d',
        marginBottom: 4,
    },
    noResultsSubtext: {
        fontSize: 14,
        color: '#9ca3af',
    },
});

export default DeviceSearch; 