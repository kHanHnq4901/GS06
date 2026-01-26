import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    Animated,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { toggleTemperatureUnit } from '../../../store/smartHomeSlice';
import { formatTemperature } from '../../../utils/helpers';

interface WeatherCardProps {
    scrollY?: Animated.Value;
}

const WeatherCard = ({ scrollY }: WeatherCardProps) => {
    const dispatch = useAppDispatch();
    const { weather, temperatureUnit, isLoading } = useAppSelector(
        (state) => state.smartHome
    );

    // Parallax effect for weather card
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

    if (isLoading) {
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
                <ActivityIndicator size="large" color="#007AFF" />
            </Animated.View>
        );
    }

    if (!weather) {
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
                <Text style={styles.errorText}>Weather data unavailable</Text>
            </Animated.View>
        );
    }

    // Get temperature based on current unit
    const getCurrentTemperature = () => {
        return temperatureUnit === 'C' ? weather.current.temp_c : weather.current.temp_f;
    };

    // Get feels like temperature based on current unit
    const getFeelsLikeTemperature = () => {
        return temperatureUnit === 'C' ? weather.current.feelslike_c : weather.current.feelslike_f;
    };

    // Get weather condition emoji based on condition text
    const getWeatherEmoji = (conditionText: string): string => {
        const condition = conditionText.toLowerCase();
        if (condition.includes('rain') && condition.includes('thunder')) return '⛈️';
        if (condition.includes('rain')) return '🌧️';
        if (condition.includes('thunder')) return '⛈️';
        if (condition.includes('cloud')) return '☁️';
        if (condition.includes('sun') || condition.includes('clear')) return '☀️';
        if (condition.includes('snow')) return '❄️';
        if (condition.includes('fog') || condition.includes('mist')) return '🌫️';
        if (condition.includes('wind')) return '💨';
        return '🌤️';
    };

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
                    <Text style={styles.title}>🌤️ Weather</Text>
                    <Text style={styles.location}>
                        📍 {weather.location.name}, {weather.location.country}
                    </Text>
                </View>
                <TouchableOpacity
                    style={styles.toggleButton}
                    onPress={() => dispatch(toggleTemperatureUnit())}
                >
                    <Text style={styles.toggleText}>
                        °{temperatureUnit === 'C' ? 'F' : 'C'}
                    </Text>
                </TouchableOpacity>
            </View>

            <View style={styles.weatherInfo}>
                <View style={styles.temperatureContainer}>
                    <Text style={styles.temperature}>
                        {formatTemperature(getCurrentTemperature(), temperatureUnit)}
                    </Text>
                    <View style={styles.temperatureIcon}>
                        <Text style={styles.temperatureEmoji}>🌡️</Text>
                    </View>
                </View>


            </View>
            <View style={styles.conditionContainer}>
                <View style={styles.conditionIcon}>
                    <Text style={styles.conditionEmoji}>
                        {getWeatherEmoji(weather.current.condition.text)}
                    </Text>
                </View>
                <View style={styles.conditionText}>
                    <Text style={styles.condition}>{weather.current.condition.text}</Text>
                </View>
            </View>
            <View style={{
                height: 10
            }} />
            <View style={styles.weatherDetails}>
                <View style={styles.detailItem}>
                    <Text style={styles.detailEmoji}>💨</Text>
                    <Text style={styles.detailText}>{weather.current.wind_kph} km/h</Text>
                </View>
                <View style={styles.detailItem}>
                    <Text style={styles.detailEmoji}>💧</Text>
                    <Text style={styles.detailText}>{weather.current.humidity}%</Text>
                </View>
                <View style={styles.detailItem}>
                    <Text style={styles.detailEmoji}>👁️</Text>
                    <Text style={styles.detailText}>{weather.current.vis_km} km</Text>
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
        marginBottom: 20,
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
    location: {
        fontSize: 14,
        color: '#6c757d',
        fontWeight: '500',
    },
    toggleButton: {
        backgroundColor: '#f8f9fa',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    toggleText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#007AFF',
    },
    weatherInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    temperatureContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    temperature: {
        fontSize: 48,
        fontWeight: '800',
        color: '#1a1a2e',
        letterSpacing: -1,
    },
    temperatureIcon: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#f8f9fa',
        justifyContent: 'center',
        alignItems: 'center',
    },
    temperatureEmoji: {
        fontSize: 24,
    },
    conditionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        flex: 1,
        justifyContent: 'flex-end',
    },
    conditionIcon: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#f8f9fa',
        justifyContent: 'center',
        alignItems: 'center',
    },
    conditionEmoji: {
        fontSize: 24,
    },
    conditionText: {
        flex: 1,
        alignItems: 'flex-end',
    },
    condition: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1a1a2e',
        textAlign: 'right',
        marginBottom: 4,
    },
    feelsLike: {
        fontSize: 12,
        color: '#6c757d',
        fontWeight: '500',
        textAlign: 'right',
    },
    weatherDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#f1f3f4',
    },
    detailItem: {
        alignItems: 'center',
        flex: 1,
    },
    detailEmoji: {
        fontSize: 20,
        marginBottom: 4,
    },
    detailText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#6c757d',
    },
    errorText: {
        fontSize: 16,
        color: '#6c757d',
        textAlign: 'center',
        padding: 20,
    },
});

export default WeatherCard; 