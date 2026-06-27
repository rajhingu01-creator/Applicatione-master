import React from "react";
import {
  Image,
  Platform,
  SafeAreaView,
  StatusBar as RNStatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { Briefcase, ChevronRight, Compass, Users } from "lucide-react-native";

const topContentPadding =
  Platform.OS === "android" ? (RNStatusBar.currentHeight ?? 0) + 8 : 12;

const jobOptions = [
  {
    id: "find-work",
    eyebrow: "FOR INDIVIDUALS",
    title: "Explore Opportunities",
    detail:
      "Discover jobs, freelance projects and opportunities that match your skills and goals.",
    icon: Compass,
    cardColors: ["#FFFFFF", "#FBF9FF"],
    tileColors: ["#8A66FF", "#4A2DE1"],
    accent: "#6544F1",
    border: "#E7DFFF",
    soft: "rgba(112,76,244,0.08)",
    shadow: "#D7CAFF",
    badge: "individual",
  },
  {
    id: "hire-employees",
    eyebrow: "FOR ORGANIZATIONS",
    title: "Build Your Team",
    detail:
      "Post jobs, review applications and connect with top talent to grow your team.",
    icon: Users,
    cardColors: ["#FFFCF9", "#FFF6ED"],
    tileColors: ["#FFA943", "#FF6424"],
    accent: "#F5792A",
    border: "#FFE0C8",
    soft: "rgba(255,121,45,0.08)",
    shadow: "#FFD5B8",
    badge: "organization",
  },
];

const CardDotPattern = ({ color }) => (
  <View style={styles.cardDotGrid} pointerEvents="none">
    {Array.from({ length: 48 }).map((_, index) => (
      <View key={index} style={[styles.cardDot, { backgroundColor: color }]} />
    ))}
  </View>
);

const OptionArtwork = ({ option, small }) => {
  const Icon = option.icon;
  const iconSize = small ? 25 : 31;

  return (
    <LinearGradient
      colors={option.tileColors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.optionArtwork, small && styles.optionArtworkCompact]}
    >
      <View
        style={[
          styles.optionArtworkCircle,
          small && styles.optionArtworkCircleCompact,
        ]}
      >
        <Icon size={iconSize} color={option.accent} strokeWidth={2.45} />
      </View>
    </LinearGradient>
  );
};

const JobScreen = ({ navigation }) => {
  const { width, height } = useWindowDimensions();
  const contentWidth = Math.min(width, 448);
  const compact = width < 380;
  const shortHeight = height < 760;
  const veryShortHeight = height < 700;
  const heroHeight = veryShortHeight
    ? 218
    : shortHeight
      ? 250
      : compact
        ? 292
        : 318;
  const heroImageWidth = Math.min(contentWidth * 0.72, 318);
  const cardHeight = veryShortHeight ? 122 : shortHeight ? 138 : 164;
  const cardGap = veryShortHeight ? 10 : shortHeight ? 13 : 20;
  const cardRadius = shortHeight ? 27 : 34;
  const smallCards = shortHeight || compact;
  const titleSize = veryShortHeight ? 27 : compact ? 29 : 31;
  const titleLineHeight = veryShortHeight ? 33 : compact ? 36 : 38;

  const handleOptionPress = (option) => {
    if (option.id === "hire-employees") {
      navigation.navigate("HireEmployees");
      return;
    }

    navigation.navigate("JobPortal");
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <LinearGradient
        colors={["#FFFFFF", "#FFFFFF", "#FFFCF8"]}
        locations={[0, 0.72, 1]}
        style={StyleSheet.absoluteFill}
      />
      <View style={[styles.backgroundOrb, styles.backgroundOrbTop]} />
      <View style={[styles.backgroundOrb, styles.backgroundOrbBottom]} />

      <SafeAreaView style={styles.safeArea}>
        <View
          style={[
            styles.pageContent,
            { width: contentWidth, paddingTop: topContentPadding },
          ]}
        >
          <View style={styles.topRow}>
            <LinearGradient
              colors={["#835BFF", "#5A37EF"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.brandIcon}
            >
              <Briefcase size={25} color="#FFFFFF" strokeWidth={2.5} />
            </LinearGradient>

            <View style={styles.jobsPill}>
              <Text style={styles.jobsPillText}>Jobs</Text>
            </View>
          </View>

          <View style={[styles.heroSection, { height: heroHeight }]}>
            <View style={styles.heroSoftCircle} />
            <View style={styles.dotGrid}>
              {Array.from({ length: 42 }).map((_, index) => (
                <View key={index} style={styles.dot} />
              ))}
            </View>

            <View
              pointerEvents="none"
              style={[
                styles.heroPhotoFrame,
                {
                  width: heroImageWidth,
                  height: heroHeight,
                },
              ]}
            >
              <Image
                source={require("../../assets/login-side.jpeg")}
                resizeMode="cover"
                style={styles.heroImage}
              />
              <LinearGradient
                colors={[
                  "#FFFFFF",
                  "rgba(255,255,255,0.92)",
                  "rgba(255,255,255,0.22)",
                  "rgba(255,255,255,0)",
                ]}
                locations={[0, 0.32, 0.72, 1]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 0.62, y: 0.5 }}
                style={styles.heroImageSideFade}
              />
              <LinearGradient
                colors={["rgba(255,255,255,0)", "#FFFFFF"]}
                start={{ x: 0.5, y: 0.32 }}
                end={{ x: 0.5, y: 1 }}
                style={styles.heroImageBottomFade}
              />
            </View>

            <View style={styles.heroCopy}>
              <Text style={styles.heroEyebrow}>JOB CENTER</Text>
              <View style={styles.heroEyebrowLine} />

              <Text
                style={[
                  styles.heroTitle,
                  {
                    fontSize: titleSize,
                    lineHeight: titleLineHeight,
                  },
                ]}
              >
                What do{"\n"}you want to{" "}
                <Text style={styles.heroTitleAccent}>do?</Text>
              </Text>

              <Text style={styles.heroSubtitle}>
                Choose if you want to find work or hire employees from Abecedex.
              </Text>
            </View>
          </View>

          <View style={styles.optionsWrap}>
            {jobOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                activeOpacity={0.88}
                style={[
                  styles.optionTouchable,
                  {
                    borderRadius: cardRadius,
                    marginBottom: cardGap,
                    shadowColor: option.shadow,
                  },
                ]}
                onPress={() => handleOptionPress(option)}
              >
                <LinearGradient
                  colors={option.cardColors}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={[
                    styles.optionCard,
                    {
                      minHeight: cardHeight,
                      borderColor: option.border,
                      borderRadius: cardRadius,
                      paddingVertical: smallCards ? 10 : 15,
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.cardGlowOne,
                      { backgroundColor: option.soft },
                    ]}
                  />
                  <View
                    style={[
                      styles.cardGlowTwo,
                      { backgroundColor: option.soft },
                    ]}
                  />
                  <CardDotPattern color={option.accent} />

                  <OptionArtwork option={option} small={smallCards} />

                  <View style={styles.optionCopy}>
                    <Text
                      style={[
                        styles.optionEyebrow,
                        { color: option.accent },
                        smallCards && styles.optionEyebrowCompact,
                      ]}
                    >
                      {option.eyebrow}
                    </Text>
                    <Text
                      style={[
                        styles.optionTitle,
                        smallCards && styles.optionTitleCompact,
                      ]}
                    >
                      {option.title}
                    </Text>
                    <Text
                      style={[
                        styles.optionDetail,
                        smallCards && styles.optionDetailCompact,
                      ]}
                    >
                      {option.detail}
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.optionArrow,
                      smallCards && styles.optionArrowCompact,
                    ]}
                  >
                    <ChevronRight
                      size={25}
                      color={option.accent}
                      strokeWidth={3}
                    />
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  safeArea: {
    flex: 1,
    alignItems: "center",
  },
  backgroundOrb: {
    position: "absolute",
    borderRadius: 999,
    opacity: 0.28,
  },
  backgroundOrbTop: {
    width: 250,
    height: 250,
    right: -116,
    top: 68,
    backgroundColor: "#F3EEFF",
  },
  backgroundOrbBottom: {
    width: 270,
    height: 270,
    left: -150,
    bottom: -76,
    backgroundColor: "#FFF3E7",
  },
  pageContent: {
    flex: 1,
    alignSelf: "center",
    paddingBottom: 8,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
    marginBottom: 10,
    paddingHorizontal: 20,
    zIndex: 5,
  },
  brandIcon: {
    width: 54,
    height: 54,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#7A5DFF",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.22,
    shadowRadius: 18,
    elevation: 8,
  },
  jobsPill: {
    minHeight: 38,
    borderRadius: 19,
    paddingHorizontal: 22,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#E2D7FA",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 15,
    elevation: 6,
  },
  jobsPillText: {
    color: "#6B48F4",
    fontSize: 13,
    fontWeight: "900",
  },
  heroSection: {
    position: "relative",
    overflow: "hidden",
  },
  heroSoftCircle: {
    position: "absolute",
    width: 248,
    height: 286,
    borderRadius: 124,
    right: 28,
    top: 0,
    backgroundColor: "rgba(213,199,255,0.24)",
  },
  dotGrid: {
    position: "absolute",
    right: 170,
    top: 62,
    width: 62,
    flexDirection: "row",
    flexWrap: "wrap",
    opacity: 0.28,
    zIndex: 2,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: "#7B58F4",
    margin: 4,
  },
  heroPhotoFrame: {
    position: "absolute",
    top: 0,
    right: 0,
    borderTopLeftRadius: 96,
    borderBottomLeftRadius: 118,
    overflow: "hidden",
    backgroundColor: "#F1ECFF",
    zIndex: 1,
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  heroImageSideFade: {
    ...StyleSheet.absoluteFillObject,
  },
  heroImageBottomFade: {
    ...StyleSheet.absoluteFillObject,
  },
  heroCopy: {
    width: "61%",
    maxWidth: 268,
    paddingTop: 34,
    marginLeft: 20,
    zIndex: 3,
  },
  heroEyebrow: {
    color: "#5D42EE",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 0.2,
  },
  heroEyebrowLine: {
    width: 27,
    height: 2,
    borderRadius: 2,
    backgroundColor: "#7350FF",
    marginTop: 8,
    marginBottom: 19,
  },
  heroTitle: {
    color: "#0B0D28",
    fontWeight: "900",
    letterSpacing: -0.75,
  },
  heroTitleAccent: {
    color: "#6847F3",
  },
  heroSubtitle: {
    width: "96%",
    color: "#706D80",
    fontSize: 13.2,
    lineHeight: 20,
    fontWeight: "600",
    marginTop: 17,
  },
  optionsWrap: {
    marginTop: 18,
  },
  optionTouchable: {
    marginHorizontal: 20,
    marginBottom: 17,
    borderRadius: 34,
    shadowOffset: { width: 0, height: 13 },
    shadowOpacity: 0.14,
    shadowRadius: 20,
    elevation: 7,
  },
  optionCard: {
    minHeight: 170,
    borderRadius: 34,
    borderWidth: 1,
    paddingHorizontal: 18,
    paddingVertical: 17,
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
  },
  cardGlowOne: {
    position: "absolute",
    width: 148,
    height: 148,
    borderRadius: 74,
    right: -52,
    top: -58,
    backgroundColor: "rgba(255,255,255,0.16)",
  },
  cardGlowTwo: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    left: -54,
    bottom: -52,
    backgroundColor: "rgba(255,255,255,0.11)",
  },
  cardDotGrid: {
    position: "absolute",
    right: 14,
    top: 20,
    width: 70,
    flexDirection: "row",
    flexWrap: "wrap",
    opacity: 0.14,
  },
  cardDot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    margin: 4,
  },
  optionArtwork: {
    width: 88,
    height: 104,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 18,
  },
  optionArtworkCompact: {
    width: 68,
    height: 78,
    borderRadius: 22,
    marginRight: 10,
  },
  optionArtworkCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  optionArtworkCircleCompact: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },

  optionCopy: {
    flex: 1,
    minWidth: 0,
    paddingRight: 8,
  },
  optionEyebrow: {
    color: "rgba(255,255,255,0.76)",
    fontSize: 10.5,
    lineHeight: 14,
    fontWeight: "900",
    letterSpacing: 1.05,
    marginBottom: 8,
  },
  optionEyebrowCompact: {
    fontSize: 9.5,
    lineHeight: 12,
    marginBottom: 5,
  },
  optionTitle: {
    color: "#101229",
    fontSize: 22,
    lineHeight: 27,
    fontWeight: "900",
    letterSpacing: -0.35,
    marginBottom: 8,
  },
  optionTitleCompact: {
    fontSize: 18.5,
    lineHeight: 22,
    marginBottom: 5,
  },
  optionDetail: {
    color: "#6D6980",
    fontSize: 12.6,
    lineHeight: 18,
    fontWeight: "700",
  },
  optionDetailCompact: {
    fontSize: 10.8,
    lineHeight: 15,
  },
  optionArrow: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 4,
    shadowColor: "#CFC6E8",
    shadowOffset: { width: 0, height: 7 },
    shadowOpacity: 0.28,
    shadowRadius: 12,
    elevation: 5,
  },
  optionArrowCompact: {
    width: 35,
    height: 35,
    borderRadius: 18,
  },
});

export default JobScreen;
