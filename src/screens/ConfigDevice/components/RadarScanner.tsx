import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  withDelay,
  Easing,
  interpolate
} from 'react-native-reanimated';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const Ripple = ({ delay }) => {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(
      delay,
      withRepeat(
        withTiming(1, { duration: 2000, easing: Easing.out(Easing.ease) }),
        -1, // Lặp vô hạn
        false
      )
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: interpolate(progress.value, [0, 1], [0.5, 4]) }], // Phóng to từ 0.5 lên 4 lần
      opacity: interpolate(progress.value, [0, 0.6, 1], [0.8, 0.4, 0]), // Mờ dần
    };
  });

  return <Animated.View style={[styles.ripple, animatedStyle]} />;
};

export const RadarScanner = () => {
  return (
    <View style={styles.container}>
      {/* Các vòng sóng lan tỏa liên tục */}
      <Ripple delay={0} />
      <Ripple delay={500} />
      <Ripple delay={1000} />
      <Ripple delay={1500} />
      
      {/* Icon tĩnh ở giữa */}
      <View style={styles.centerIcon}>
        <MaterialIcons name="wifi-tethering" size={40} color="#fff" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 250,
    width: '100%',
    overflow: 'hidden', // Cắt bớt phần sóng tràn ra ngoài
  },
  ripple: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(37, 99, 235, 0.2)', // Màu xanh #2563EB mờ
    borderWidth: 1,
    borderColor: 'rgba(37, 99, 235, 0.4)',
  },
  centerIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 10,
    zIndex: 10,
  },
});