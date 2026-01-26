import React, { useEffect, useRef } from 'react';
import {
    View,
    StatusBar,
    Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchWeatherAsync, loadPersistedState } from '../../store/smartHomeSlice';
import { styles, HEADER_SCROLL_DISTANCE } from './styles';
import { DashboardHeader, RoomsSection } from './components';
import WeatherCard from './components/WeatherCard';
import EnergyCard from './components/EnergyCard';
import QuickActions from '../RoomDetail/components/QuickActions';
import DeviceStats from './components/DeviceStats';

const DashboardScreen = () => {
    const dispatch = useAppDispatch();
    const navigation = useNavigation();
    const { selectedRoomId } = useAppSelector(
        (state) => state.smartHome
    );

    // Animation values
    const scrollY = useRef(new Animated.Value(0)).current;
    const headerHeight = scrollY.interpolate({
        inputRange: [0, HEADER_SCROLL_DISTANCE],
        outputRange: [200, 80],
        extrapolate: 'clamp',
    });

    const headerOpacity = scrollY.interpolate({
        inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
        outputRange: [1, 0.8, 0.6],
        extrapolate: 'clamp',
    });

    const greetingOpacity = scrollY.interpolate({
        inputRange: [0, HEADER_SCROLL_DISTANCE / 2],
        outputRange: [1, 0],
        extrapolate: 'clamp',
    });

    const greetingScale = scrollY.interpolate({
        inputRange: [0, HEADER_SCROLL_DISTANCE / 2],
        outputRange: [1, 0.8],
        extrapolate: 'clamp',
    });

    const titleOpacity = scrollY.interpolate({
        inputRange: [HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
        outputRange: [0, 1],
        extrapolate: 'clamp',
    });

    const titleTranslateY = scrollY.interpolate({
        inputRange: [HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
        outputRange: [20, 0],
        extrapolate: 'clamp',
    });

    useEffect(() => {
        dispatch(loadPersistedState());
        dispatch(fetchWeatherAsync());
    }, [dispatch]);

    // Navigate to room detail when a room is selected
    useEffect(() => {
        if (selectedRoomId) {
            navigation.navigate('RoomDetail' as never);
        }
    }, [selectedRoomId, navigation]);

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />

            {/* Animated Header */}
            <DashboardHeader
                headerHeight={headerHeight}
                greetingOpacity={greetingOpacity}
                greetingScale={greetingScale}
                titleOpacity={titleOpacity}
                titleTranslateY={titleTranslateY}
            />

            {/* Scrollable Content */}
            <Animated.ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: false }
                )}
                scrollEventThrottle={16}
            >
                {/* Weather and Energy Cards */}
                <View style={styles.cardsContainer}>
                    <WeatherCard scrollY={scrollY} />
                    <EnergyCard scrollY={scrollY} />
                </View>

                {/* Device Statistics */}
                <DeviceStats />

                {/* Rooms Section */}
                <RoomsSection scrollY={scrollY} />

                {/* Quick Actions */}
                <QuickActions />

                {/* Bottom Spacing */}
                <View style={styles.bottomSpacing} />
            </Animated.ScrollView>
        </View>
    );
};

export default DashboardScreen;
