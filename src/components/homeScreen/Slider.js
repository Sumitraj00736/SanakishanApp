import React, { useRef, useState, useEffect } from "react";
import { ScrollView, StyleSheet, Dimensions, View, Image } from "react-native";

const { width } = Dimensions.get("window");
const imageHeight = (width - 32) * 9 / 16; // same aspect ratio

export default function Slider() {
  const banners = [
    "https://res.cloudinary.com/dhah3xwej/image/upload/v1764401658/poster2_1_ms7cdf.jpg",
    "https://res.cloudinary.com/dhah3xwej/image/upload/v1764401714/poster3_1_u3kw3o.jpg",
    // "https://res.cloudinary.com/dhah3xwej/image/upload/v1761277349/PixVerse_V5_Image_Text_360P_generate_image_rel_lutx4v.jpg",
  ];

  const scrollRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto slide effect
  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % banners.length;
      scrollRef.current.scrollTo({ x: nextIndex * (width - 32 + 10), animated: true });
      setCurrentIndex(nextIndex);
    }, 4000); // every 4 seconds
    return () => clearInterval(interval);
  }, [currentIndex]);

  const handleScroll = (event) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / (width - 32 + 10));
    setCurrentIndex(index);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        ref={scrollRef}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={styles.scrollView}
      >
        {banners.map((imageUri, index) => (
          <Image
            key={index}
            source={{ uri: imageUri }}
            style={[styles.bannerImage, { height: imageHeight }]}
            resizeMode="cover"
          />
        ))}
      </ScrollView>

      {/* Dots */}
      <View style={styles.dotsContainer}>
        {banners.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              currentIndex === index ? styles.activeDot : null,
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 12 },
  scrollView: {},
  bannerImage: {
    width: width - 32,
    borderRadius: 10,
    marginRight: 10,
    backgroundColor: "#000",
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ccc",
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: "black",
  },
});
