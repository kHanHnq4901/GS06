import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
} from 'react-native';
import { useAppSelector } from '../../../store/hooks';
import RoomCard from '../../RoomDetail/components/RoomCard';

interface RoomsSectionProps {
    scrollY: any;
}

const RoomsSection = ({ scrollY }: RoomsSectionProps) => {
    const { rooms, selectedRoomId } = useAppSelector(
        (state) => state.smartHome
    );

    const renderRoomCard = ({ item, index }: { item: any; index: number }) => (
        <RoomCard
            room={item}
            isSelected={selectedRoomId === item.id}
            scrollY={scrollY}
            index={index}
        />
    );

    return (
        <View style={styles.roomsSection}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Your Rooms</Text>
                <Text style={styles.sectionSubtitle}>Tap to control devices</Text>
            </View>
            <FlatList
                data={rooms}
                renderItem={renderRoomCard}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.roomsList}
                decelerationRate="fast"
                snapToInterval={140}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    roomsSection: {
        marginBottom: 30,
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
    roomsList: {
        paddingHorizontal: 16,
    },
});

export default RoomsSection; 