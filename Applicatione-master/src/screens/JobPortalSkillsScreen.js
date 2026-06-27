import React, { useState } from "react";
import {
  Platform,
  SafeAreaView,
  StatusBar as RNStatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import {
  Check,
  ChevronLeft,
  Search,
  SlidersHorizontal,
} from "lucide-react-native";

const topContentPadding =
  Platform.OS === "android" ? (RNStatusBar.currentHeight ?? 0) + 8 : 10;

const popularSkills = [
  "React Native",
  "JavaScript",
  "Node.js",
  "Python",
  "PHP",
  "MongoDB",
  "MySQL",
  "Firebase",
  "UI/UX",
  "AWS",
  "Docker",
];

const initialSelectedSkills = ["React Native", "JavaScript", "MongoDB"];

const JobPortalSkillsScreen = ({ navigation }) => {
  const { width, height } = useWindowDimensions();
  const contentWidth = Math.min(width - 42, 390);
  const compact = height < 720 || width < 370;
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSkills, setSelectedSkills] = useState(initialSelectedSkills);

  const toggleSkill = (skill) => {
    setSelectedSkills((currentSkills) =>
      currentSkills.includes(skill)
        ? currentSkills.filter((item) => item !== skill)
        : [...currentSkills, skill],
    );
  };

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
              Tell us your key skills
            </Text>
            <Text style={styles.subtitle}>
              This helps us show relevant jobs
            </Text>

            <View style={styles.searchBox}>
              <Search size={18} color="#8F91A1" strokeWidth={2.4} />
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                style={styles.searchInput}
                placeholder="Search skills..."
                placeholderTextColor="#A7A8B7"
              />
              <TouchableOpacity
                activeOpacity={0.75}
                style={styles.filterButton}
              >
                <SlidersHorizontal
                  size={18}
                  color="#6B6C7C"
                  strokeWidth={2.5}
                />
              </TouchableOpacity>
            </View>

            <Text style={styles.sectionTitle}>Popular Skills</Text>

            <View style={styles.skillsWrap}>
              {popularSkills.map((skill) => {
                const selected = selectedSkills.includes(skill);
                const mongoSelected = selected && skill === "MongoDB";

                return (
                  <TouchableOpacity
                    key={skill}
                    activeOpacity={0.78}
                    style={[
                      styles.skillChip,
                      selected && styles.skillChipSelected,
                    ]}
                    onPress={() => toggleSkill(skill)}
                  >
                    <Text
                      style={[
                        styles.skillText,
                        selected && styles.skillTextSelected,
                      ]}
                    >
                      {skill}
                    </Text>
                    {selected ? (
                      <View
                        style={[
                          styles.selectedBadge,
                          mongoSelected && styles.selectedBadgeGreen,
                        ]}
                      >
                        <Check size={8} color="#FFFFFF" strokeWidth={3.4} />
                      </View>
                    ) : null}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View style={styles.actionsRow}>
            <TouchableOpacity
              activeOpacity={0.82}
              style={styles.skipButton}
              onPress={() => navigation.navigate("Home")}
            >
              <Text style={styles.skipButtonText}>Skip</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.88}
              style={styles.nextTouchable}
              onPress={() => navigation.navigate("JobPortalExperience")}
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
  searchBox: {
    height: 48,
    borderWidth: 1.3,
    borderColor: "#E7E7F0",
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 14,
    marginTop: 33,
    backgroundColor: "#FFFFFF",
  },
  searchInput: {
    flex: 1,
    height: "100%",
    paddingHorizontal: 11,
    color: "#232435",
    fontSize: 14,
    fontWeight: "800",
  },
  filterButton: {
    width: 44,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  sectionTitle: {
    color: "#303244",
    fontSize: 15,
    fontWeight: "900",
    marginTop: 29,
    marginBottom: 14,
  },
  skillsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    paddingRight: 14,
  },
  skillChip: {
    minWidth: 78,
    height: 39,
    borderRadius: 7,
    borderWidth: 1.3,
    borderColor: "#E7E7F0",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 14,
    position: "relative",
  },
  skillChipSelected: {
    borderColor: "#B7A7FF",
    backgroundColor: "#F8F5FF",
  },
  skillText: {
    color: "#565767",
    fontSize: 13,
    fontWeight: "900",
  },
  skillTextSelected: {
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
  selectedBadgeGreen: {
    backgroundColor: "#0AA67C",
  },
  actionsRow: {
    flexDirection: "row",
    gap: 14,
  },
  skipButton: {
    flex: 1,
    height: 55,
    borderRadius: 7,
    borderWidth: 1.2,
    borderColor: "#EEEAFB",
    backgroundColor: "#FBF9FF",
    alignItems: "center",
    justifyContent: "center",
  },
  skipButtonText: {
    color: "#8069E8",
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

export default JobPortalSkillsScreen;
