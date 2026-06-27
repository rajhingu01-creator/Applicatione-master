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
import { Check, ChevronLeft, Pencil } from "lucide-react-native";

const topContentPadding =
  Platform.OS === "android" ? (RNStatusBar.currentHeight ?? 0) + 8 : 10;

const jobTypes = [
  "Full Time",
  "Part Time",
  "Contract",
  "Freelance",
  "Internship",
];

const JobPortalPreferencesScreen = ({ navigation }) => {
  const { width, height } = useWindowDimensions();
  const contentWidth = Math.min(width - 42, 390);
  const compact = height < 720 || width < 370;
  const [selectedJobType, setSelectedJobType] = useState("Full Time");

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
              Job Preferences
            </Text>
            <Text style={styles.subtitle}>
              What type of job are you looking for?
            </Text>

            <Text style={styles.sectionTitle}>Job Type</Text>
            <View style={styles.jobTypeWrap}>
              {jobTypes.map((jobType) => {
                const selected = selectedJobType === jobType;

                return (
                  <TouchableOpacity
                    key={jobType}
                    activeOpacity={0.78}
                    style={[
                      styles.jobTypeChip,
                      selected && styles.jobTypeChipSelected,
                    ]}
                    onPress={() => setSelectedJobType(jobType)}
                  >
                    <Text
                      style={[
                        styles.jobTypeText,
                        selected && styles.jobTypeTextSelected,
                      ]}
                    >
                      {jobType}
                    </Text>
                    {selected ? (
                      <View style={styles.selectedBadge}>
                        <Check size={8} color="#FFFFFF" strokeWidth={3.4} />
                      </View>
                    ) : null}
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={[styles.fieldLabel, styles.locationLabel]}>
              Preferred Location
            </Text>
            <TouchableOpacity activeOpacity={0.82} style={styles.infoField}>
              <Text style={styles.infoFieldText}>Ahmedabad, Gujarat</Text>
              <Pencil size={21} color="#5B35ED" strokeWidth={2.5} />
            </TouchableOpacity>

            <Text style={styles.fieldLabel}>Expected Salary (Annual)</Text>
            <TouchableOpacity activeOpacity={0.82} style={styles.infoField}>
              <Text style={styles.infoFieldText}>₹ 4,00,000 - ₹ 6,00,000</Text>
              <Pencil size={21} color="#5B35ED" strokeWidth={2.5} />
            </TouchableOpacity>
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
              style={styles.finishTouchable}
              onPress={() => navigation.navigate("JobPortalHome")}
            >
              <LinearGradient
                colors={["#673BF2", "#4B2BE7"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.finishButton}
              >
                <Text style={styles.finishButtonText}>Finish</Text>
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
  sectionTitle: {
    color: "#303244",
    fontSize: 13,
    fontWeight: "900",
    marginTop: 36,
    marginBottom: 13,
  },
  jobTypeWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    paddingRight: 12,
  },
  jobTypeChip: {
    minWidth: 96,
    height: 42,
    borderRadius: 7,
    borderWidth: 1.3,
    borderColor: "#E7E7F0",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 13,
    position: "relative",
  },
  jobTypeChipSelected: {
    borderColor: "#B7A7FF",
    backgroundColor: "#F8F5FF",
  },
  jobTypeText: {
    color: "#565767",
    fontSize: 13,
    fontWeight: "900",
  },
  jobTypeTextSelected: {
    color: "#5635EC",
  },
  selectedBadge: {
    position: "absolute",
    right: -5,
    top: -5,
    width: 13,
    height: 13,
    borderRadius: 7,
    backgroundColor: "#5635EC",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.6,
    borderColor: "#FFFFFF",
  },
  locationLabel: {
    marginTop: 36,
  },
  fieldLabel: {
    color: "#303244",
    fontSize: 13,
    fontWeight: "900",
    marginBottom: 12,
    marginTop: 25,
  },
  infoField: {
    height: 51,
    borderWidth: 1.3,
    borderColor: "#E7E7F0",
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: 18,
    paddingRight: 12,
  },
  infoFieldText: {
    color: "#4F5061",
    fontSize: 16,
    fontWeight: "900",
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
  finishTouchable: {
    flex: 1,
  },
  finishButton: {
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
  finishButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "900",
  },
});

export default JobPortalPreferencesScreen;
