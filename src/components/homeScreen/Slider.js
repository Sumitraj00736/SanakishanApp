import React, { useRef, useState, useEffect } from "react";
import { ScrollView, StyleSheet, View, Image, Text, useWindowDimensions } from "react-native";
import { useTranslation } from "react-i18next";

export default function Slider() {
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const isSmall = width < 380;
  const cardWidth = width - (isSmall ? 36 : 44);
  const itemGap = isSmall ? 8 : 10;
  const imageHeight = cardWidth * (isSmall ? 7.2 / 16 : 7.6 / 16);
  const snapWidth = cardWidth + itemGap;
  const banners = [
    {
      image: "https://res.cloudinary.com/dhah3xwej/image/upload/v1764401658/poster2_1_ms7cdf.jpg",
      titleKey: "slider.slide1Title",
      subtitleKey: "slider.slide1Subtitle",
    },
    {
      image: "https://res.cloudinary.com/dhah3xwej/image/upload/v1764401714/poster3_1_u3kw3o.jpg",
      titleKey: "slider.slide2Title",
      subtitleKey: "slider.slide2Subtitle",
    },
    {
      image: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=1200&q=80",
      titleKey: "slider.slide3Title",
      subtitleKey: "slider.slide3Subtitle",
    },
    {
      image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=1200&q=80",
      titleKey: "slider.slide4Title",
      subtitleKey: "slider.slide4Subtitle",
    },
  ];

  const scrollRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto slide effect
  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % banners.length;
      scrollRef.current?.scrollTo({ x: nextIndex * snapWidth, animated: true });
      setCurrentIndex(nextIndex);
    }, 4500);
    return () => clearInterval(interval);
  }, [currentIndex, snapWidth, banners.length]);

  const handleScroll = (event) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / snapWidth);
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
        decelerationRate="fast"
        snapToInterval={snapWidth}
        snapToAlignment="start"
        style={styles.scrollView}
      >
        {banners.map((banner, index) => (
          <View key={index} style={[styles.slideCard, { width: cardWidth, marginRight: itemGap, borderRadius: isSmall ? 12 : 14 }]}>
            <Image
              source={{ uri: banner.image }}
              style={[styles.bannerImage, { width: cardWidth, height: imageHeight }]}
              resizeMode="cover"
            />
            <View style={styles.overlay}>
              <Text style={styles.overlayTitle}>{t(banner.titleKey)}</Text>
              <Text style={styles.overlaySub}>{t(banner.subtitleKey)}</Text>
            </View>
          </View>
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
  container: { marginTop: 4, marginBottom: 12 },
  scrollView: {},
  slideCard: {
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#22c55e",
    backgroundColor: "#14532d",
  },
  bannerImage: {
    backgroundColor: "#000",
  },
  overlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "rgba(20, 83, 45, 0.62)",
  },
  overlayTitle: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "800",
  },
  overlaySub: {
    color: "#dcfce7",
    fontSize: 11,
    marginTop: 2,
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: "#86efac",
    marginHorizontal: 4,
  },
  activeDot: {
    width: 20,
    borderRadius: 4,
    backgroundColor: "#166534",
  },
});
