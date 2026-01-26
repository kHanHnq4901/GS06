import React, { useState, memo } from 'react';
import { View, Image, Dimensions } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { styles } from '../styles'; // Import styles chung

const { width } = Dimensions.get('window');

// Dùng memo để tránh render lại không cần thiết
export const BannerSlider = memo(({ data }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <View>
      {/* Wrapper */}
      <View style={styles.bannerWrapper}>
        <Carousel
          loop={true}
          width={width - 32}
          height={160}
          autoPlay={true}
          data={data}
          scrollAnimationDuration={1000}
          autoPlayInterval={3000}
          // Cập nhật index chỉ trong component này -> HẾT LAG
          onSnapToItem={(index) => setActiveIndex(index)}
          renderItem={({ item }) => (
            <View style={{ flex: 1 }}>
              <Image source={item} style={styles.banner} />
            </View>
          )}
        />
      </View>

      {/* Pagination (Dấu chấm) */}
      <View style={styles.paginationContainer}>
        {data.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              activeIndex === index ? styles.activeDot : styles.inactiveDot,
            ]}
          />
        ))}
      </View>
    </View>
  );
});