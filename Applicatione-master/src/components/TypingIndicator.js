import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated } from "react-native";

const TypingIndicator = () => {
  const dot1 = useRef(new Animated.Value(0.28)).current;
  const dot2 = useRef(new Animated.Value(0.28)).current;
  const dot3 = useRef(new Animated.Value(0.28)).current;

  useEffect(() => {
    const createDotAnimation = (dot, delay) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, {
            toValue: 1,
            duration: 220,
            useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 0.28,
            duration: 220,
            useNativeDriver: true,
          }),
          Animated.delay(90),
        ]),
      );

    const animation = Animated.parallel([
      createDotAnimation(dot1, 0),
      createDotAnimation(dot2, 120),
      createDotAnimation(dot3, 240),
    ]);

    animation.start();

    return () => {
      animation.stop();
    };
  }, [dot1, dot2, dot3]);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.dot, { opacity: dot1 }]} />
      <Animated.View style={[styles.dot, { opacity: dot2 }]} />
      <Animated.View style={[styles.dot, { opacity: dot3 }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    minHeight: 18,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#8E8E93",
  },
});

export default TypingIndicator;
