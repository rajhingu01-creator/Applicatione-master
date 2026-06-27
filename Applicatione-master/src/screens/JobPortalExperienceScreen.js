import React, { useState } from "react";
import {
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
import { ChevronLeft } from "lucide-react-native";

const topContentPadding =
  Platform.OS === "android" ? (RNStatusBar.currentHeight ?? 0) + 8 : 10;

const experienceOptions = [
  "Fresher (0 - 6 months)",
  "6 months - 1 year",
  "1 - 2 years",
  "2 - 3 years",
  "3 - 5 years",
  "5+ years",
];

const JobPortalExperienceScreen = ({ navigation }) => {
  const { width, height } = useWindowDimensions();
  const contentWidth = Math.min(width - 42, 390);
  const compact = height < 720 || width < 370;
  const [selectedExperience, setSelectedExperience] = useState("2 - 3 years");

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View
        style={[
          styles.content,
          {
            width: contentWidth,
            paddingTop: topContentPadding + (compact ? 4 : 12),
            paddingBottom: compact ? 18 : 28,
          },
        ]}
      >
        <View style={styles.topBar}>
          <TouchableOpacity
            activeOpacity={0.72}
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <ChevronLeft size={22} color="#9092A0" strokeWidth={2.7} />
          </TouchableOpacity>
          <Text style={styles.topTitle}>connectifyjobportal</Text>
          <View style={styles.topSpacer} />
        </View>

        <View style={styles.screenBody}>
          <View>
            <Text style={[styles.title, compact && styles.titleCompact]}>
              Your Experience
            </Text>
            <Text style={styles.subtitle}>
              Select your total work experience
            </Text>
            <View style={styles.divider} />

            <View style={styles.optionsList}>
              {experienceOptions.map((option) => {
                const selected = selectedExperience === option;

                return (
                  <TouchableOpacity
                    key={option}
                    activeOpacity={0.78}
                    style={styles.optionRow}
                    onPress={() => setSelectedExperience(option)}
                  >
                    <View
                      style={[
                        styles.radioOuter,
                        selected && styles.radioOuterActive,
                      ]}
                    >
                      {selected ? <View style={styles.radioInner} /> : null}
                    </View>
                    <Text
                      style={[
                        styles.optionText,
                        selected && styles.optionTextActive,
                      ]}
                    >
                      {option}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View style={styles.actionsRow}>
            <TouchableOpacity
              activeOpacity={0.82}
              style={styles.backActionButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.backActionText}>Back</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.88}
              style={styles.nextTouchable}
              onPress={() => navigation.navigate("JobPortalPreferences")}
            >
              <LinearGradient
                colors={["#673BF2", "#4B2BE7"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.nextButton}
              >
                <Text style={styles.nextButtonText}>Next</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
  },
  content: {
    flex: 1,
  },
  topBar: {
    height: 34,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  backButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },
  topTitle: {
    color: "#C8C8D6",
    fontSize: 9,
    fontWeight: "800",
  },
  topSpacer: {
    width: 34,
  },
  screenBody: {
    flex: 1,
    justifyContent: "space-between",
    paddingTop: 20,
  },
  title: {
    color: "#1A1B2D",
    fontSize: 24,
    lineHeight: 31,
    fontWeight: "900",
    letterSpacing: -0.4,
  },
  titleCompact: {
    fontSize: 22,
    lineHeight: 28,
  },
  subtitle: {
    color: "#3F4052",
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "800",
    marginTop: 3,
  },
  divider: {
    height: 1.2,
    backgroundColor: "#EFEFF5",
    marginTop: 24,
  },
  optionsList: {
    paddingTop: 21,
  },
  optionRow: {
    height: 48,
    flexDirection: "row",
    alignItems: "center",
  },
  radioOuter: {
    width: 21,
    height: 21,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "#8D8F9A",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 18,
  },
  radioOuterActive: {
    borderColor: "#5B35ED",
    backgroundColor: "#F2EDFF",
  },
  radioInner: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: "#5B35ED",
  },
  optionText: {
    color: "#4F5061",
    fontSize: 14,
    fontWeight: "900",
  },
  optionTextActive: {
    color: "#5B35ED",
  },
  actionsRow: {
    flexDirection: "row",
    gap: 14,
  },
  backActionButton: {
    flex: 1,
    height: 55,
    borderRadius: 7,
    borderWidth: 1.2,
    borderColor: "#EEEAFB",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  backActionText: {
    color: "#4F5061",
    fontSize: 16,
    fontWeight: "900",
  },
  nextTouchable: {
    flex: 1,
  },
  nextButton: {
    height: 55,
    borderRadius: 7,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#5634EC",
    shadowOffset: { width: 0, height: 9 },
    shadowOpacity: 0.2,
    shadowRadius: 14,
    elevation: 5,
  },
  nextButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "900",
  },
});

export default JobPortalExperienceScreen;
