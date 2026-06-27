import React, { useRef, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Platform,
  useWindowDimensions,
  Animated,
  PanResponder,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Home,
  MessageSquare,
  Plus,
  Clapperboard,
  User,
  Search,
} from "lucide-react-native";

const CustomBottomNav = ({ navigation, activeRoute, isDark = false }) => {
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const isCompact = width < 360;
  const iconSize = isCompact ? 21 : 24;

  const [isExpanded, setIsExpanded] = useState(false);
  const [expandDirection, setExpandDirection] = useState("up");
  const expandAnim = useRef(new Animated.Value(0)).current; // 1 = expanded, 0 = collapsed

  // Draggable Logic
  const pan = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const lastTap = useRef(0);

  const openCreatePost = () => {
    toggleMenu();
  };

  const toggleMenu = () => {
    setIsExpanded((prev) => {
      const nextValue = !prev;
      const toValue = nextValue ? 1 : 0;

      if (nextValue) {
        setExpandDirection("up");
      }

      Animated.spring(expandAnim, {
        toValue,
        useNativeDriver: false,
        friction: 8,
        tension: 40,
      }).start();

      return nextValue;
    });
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 5 || Math.abs(gestureState.dy) > 5;
      },
      onPanResponderGrant: () => {
        pan.setOffset({
          x: pan.x._value,
          y: pan.y._value,
        });
        pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: (e, gestureState) => {
        const nextX = pan.x._offset + gestureState.dx;
        const nextY = pan.y._offset + gestureState.dy;

        // Container width is 75
        const maxX = 20;
        const minX = -(width - 75 - 20);

        // Use collapsed height for boundary calculation to allow full movement
        // We'll handle expansion safety separately if needed
        const collapsedHeight = 58 + 20;
        const expandedHeight = 350;

        const maxY = 40;
        // If expanded, use expandedHeight, else use collapsedHeight for minY
        const effectiveHeight = isExpanded ? expandedHeight : collapsedHeight;
        const minY = -(height - effectiveHeight - 40 - insets.top - 10);

        const clampedX = Math.max(minX, Math.min(maxX, nextX));
        const clampedY = Math.max(minY, Math.min(maxY, nextY));

        pan.x.setValue(clampedX - pan.x._offset);
        pan.y.setValue(clampedY - pan.y._offset);
      },
      onPanResponderRelease: (e, gestureState) => {
        pan.flattenOffset();

        // Detect Click (very small movement)
        if (Math.abs(gestureState.dx) < 10 && Math.abs(gestureState.dy) < 10) {
          openCreatePost();
        }
      },
    }),
  ).current;

  const navItems = [
    { name: "Create", icon: Plus, route: null, isCreate: true },
    { name: "Search", icon: Search, route: "UserSearch" },
    { name: "SMS", icon: MessageSquare, route: "ChatList" },
    { name: "Reels", icon: Clapperboard, route: "Reels" },
    { name: "Profile", icon: User, route: "Profile" },
  ];

  const createSize = 58;
  const fullHeight = 345; // Total height when expanded

  const containerHeight = expandAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [createSize + 20, fullHeight],
  });

  const containerBgColor = expandAnim.interpolate({
    inputRange: [0, 0.2, 1],
    outputRange: [
      "transparent",
      isDark ? "rgba(26, 26, 26, 0.98)" : "rgba(255, 255, 255, 0.98)",
      isDark ? "rgba(26, 26, 26, 0.98)" : "rgba(255, 255, 255, 0.98)",
    ],
  });

  const containerBorderColor = expandAnim.interpolate({
    inputRange: [0, 0.2, 1],
    outputRange: [
      "transparent",
      "rgba(255,255,255,0.1)",
      "rgba(255,255,255,0.1)",
    ],
  });

  const containerShadowOpacity = expandAnim.interpolate({
    inputRange: [0, 0.2, 1],
    outputRange: [0, 0.2, 0.2],
  });

  const plusRotation = expandAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "45deg"],
  });

  return (
    <Animated.View
      style={[
        styles.outerContainer,
        {
          transform: [{ translateX: pan.x }, { translateY: pan.y }],
          height: containerHeight,
          justifyContent: expandDirection === "up" ? "flex-end" : "flex-start",
        },
      ]}
    >
      <Animated.View
        style={[
          styles.container,
          {
            backgroundColor: containerBgColor,
            borderColor: containerBorderColor,
            shadowOpacity: containerShadowOpacity,
            elevation: isExpanded ? 20 : 0,
            flexDirection:
              expandDirection === "up" ? "column-reverse" : "column",
          },
        ]}
      >
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = activeRoute === item.name;

          if (item.isCreate) {
            return (
              <View key={index} style={styles.navItemCreateContainer}>
                <View
                  {...panResponder.panHandlers}
                  style={[
                    styles.floatingCreateButton,
                    {
                      width: createSize,
                      height: createSize,
                      borderRadius: createSize / 2,
                    },
                  ]}
                >
                  <Animated.View
                    style={{ transform: [{ rotate: plusRotation }] }}
                  >
                    <Plus size={32} color="#FFFFFF" strokeWidth={3} />
                  </Animated.View>
                </View>
              </View>
            );
          }

          const activeColor = "#008000";
          const inactiveColor = isDark ? "#888" : "#666";

          return (
            <Animated.View
              key={index}
              style={[
                styles.navItem,
                {
                  opacity: expandAnim,
                  transform: [{ scale: expandAnim }],
                  height: isExpanded ? "auto" : 0,
                  flex: isExpanded ? 1 : 0,
                },
              ]}
            >
              <TouchableOpacity
                onPress={() => {
                  if (item.route) {
                    navigation.navigate(item.route);
                    toggleMenu();
                  }
                }}
                activeOpacity={0.7}
                disabled={!isExpanded}
              >
                <View style={styles.iconContainer}>
                  <Icon
                    size={iconSize}
                    color={isActive ? activeColor : inactiveColor}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                  {isActive && <View style={styles.activeDot} />}
                  <Text
                    style={[
                      styles.quickLabel,
                      { color: isDark ? "#DDD" : "#111" },
                    ]}
                  >
                    {" "}
                    {item.name}
                  </Text>
                </View>
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    position: "absolute",
    bottom: 40,
    right: 20,
    zIndex: 1000,
    width: 75,
  },
  container: {
    alignItems: "center",
    justifyContent: "space-around",
    width: "100%",
    height: "100%",
    borderRadius: 40,
    elevation: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    overflow: "hidden",
  },
  navItem: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  navItemCreateContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    paddingVertical: 5,
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: 60,
    height: 60,
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#008000",
    marginTop: 4,
    position: "absolute",
    right: 10,
  },
  floatingCreateButton: {
    backgroundColor: "#000000",
    justifyContent: "center",
    alignItems: "center",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
});

export default CustomBottomNav;
