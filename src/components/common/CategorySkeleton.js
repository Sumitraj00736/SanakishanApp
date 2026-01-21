import React, { useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Animated,
  ScrollView,
} from "react-native";

export default function CategorySkeleton() {
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(shimmer, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const translateX = shimmer.interpolate({
    inputRange: [0, 1],
    outputRange: [-100, 100],
  });

  return (
    <View style={styles.container}>
      <View style={styles.labelSkeleton} />

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {Array.from({ length: 6 }).map((_, index) => (
          <View key={index} style={styles.categoryWrapper}>
            <View style={styles.categorySkeleton} />
            <Animated.View
              style={[
                styles.shimmer,
                { transform: [{ translateX }] },
              ]}
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },

  labelSkeleton: {
    width: 120,
    height: 20,
    backgroundColor: "#d0d0d0",
    borderRadius: 6,
    marginBottom: 12,
  },

  categoryWrapper: {
    marginRight: 10,
    borderRadius: 20,
    overflow: "hidden",
  },

  categorySkeleton: {
    width: 80,
    height: 40,
    backgroundColor: "#e0e0e0",
    borderRadius: 20,
  },

  shimmer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "60%",
    height: "100%",
    backgroundColor: "rgba(255,255,255,0.45)",
  },
});
