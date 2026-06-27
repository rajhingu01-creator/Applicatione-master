import React from "react";
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
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";

const topContentPadding =
  Platform.OS === "android" ? (RNStatusBar.currentHeight ?? 0) + 8 : 10;

const fallbackApplication = {
  title: "React Native Developer",
  company: "TechNova Solutions Pvt. Ltd.",
  appliedOn: "20 May 2024",
  status: "Under Review",
  statusColor: "#6D4DF2",
  statusBg: "#EEEAFE",
};

const JobPortalApplicationDetailsScreen = ({ route }) => {
  const { width, height } = useWindowDimensions();
  const contentWidth = Math.min(width - 28, 410);
  const compact = height < 720 || width < 370;
  const application = route?.params?.application ?? fallbackApplication;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View
        style={[
          styles.content,
          {
            width: contentWidth,
            paddingTop: topContentPadding + (compact ? 2 : 7),
          },
        ]}
      >
        <View style={[styles.card, compact && styles.cardCompact]}>
          <View style={styles.headerRow}>
            <View style={styles.headerInfo}>
              <Text style={styles.title}>{application.title}</Text>
              <Text style={styles.company}>{application.company}</Text>
            </View>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: application.statusBg ?? "#EEEAFE" },
              ]}
            >
              <Text
                style={[
                  styles.statusBadgeText,
                  { color: application.statusColor ?? "#6D4DF2" },
                ]}
              >
                {application.status}
              </Text>
            </View>
          </View>

          <View style={styles.sectionBlock}>
            <Text style={styles.label}>Applied On</Text>
            <Text style={styles.valueText}>{application.appliedOn}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.sectionBlockSmall}>
            <Text style={styles.label}>Application Status</Text>
            <Text style={styles.purpleValue}>{application.status}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.fieldBlock}>
            <Text style={styles.label}>Resume</Text>
            <View style={styles.resumeBox}>
              <View style={styles.fileIconBox}>
                <Ionicons name="document-text" size={19} color="#FFFFFF" />
              </View>
              <View style={styles.fileInfo}>
                <Text style={styles.fileName} numberOfLines={1}>
                  Meet_Vasoya_Resume.pdf
                </Text>
                <Text style={styles.fileSize}>2.4 MB</Text>
              </View>
              <TouchableOpacity activeOpacity={0.74}>
                <Ionicons name="download-outline" size={20} color="#6D4DF2" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.fieldBlockLarge}>
            <Text style={styles.label}>Cover Letter</Text>
            <View style={styles.coverBox}>
              <Text style={styles.coverText}>
                I am excited to apply for this position as{`\n`}it aligns perfectly
                with my skills and{`\n`}experience.
              </Text>
            </View>
          </View>

          <View style={styles.nextStepBlock}>
            <Text style={styles.label}>Next Step</Text>
            <Text style={styles.nextStepText}>
              Our team will review your application{`\n`}and get back to you soon.
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFE",
    alignItems: "center",
  },
  content: {
    flex: 1,
  },
  card: {
    flex: 1,
    borderRadius: 15,
    borderWidth: 1.2,
    borderColor: "#EFEFF5",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 18,
    paddingTop: 23,
    paddingBottom: 22,
    shadowColor: "#B7B8C8",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.11,
    shadowRadius: 18,
    elevation: 4,
  },
  cardCompact: {
    paddingTop: 19,
    paddingBottom: 18,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
  },
  headerInfo: {
    flex: 1,
  },
  title: {
    color: "#1A1B2D",
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "900",
  },
  company: {
    color: "#383A4B",
    fontSize: 13.5,
    lineHeight: 19,
    fontWeight: "800",
    marginTop: 4,
  },
  statusBadge: {
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  statusBadgeText: {
    fontSize: 10.5,
    fontWeight: "900",
  },
  sectionBlock: {
    marginTop: 27,
    gap: 8,
  },
  sectionBlockSmall: {
    gap: 7,
  },
  label: {
    color: "#303244",
    fontSize: 12.5,
    lineHeight: 17,
    fontWeight: "900",
  },
  valueText: {
    color: "#4F5061",
    fontSize: 13,
    lineHeight: 19,
    fontWeight: "800",
  },
  purpleValue: {
    color: "#5B35ED",
    fontSize: 13,
    lineHeight: 19,
    fontWeight: "900",
  },
  divider: {
    height: 1,
    backgroundColor: "#EFEFF5",
    marginVertical: 16,
  },
  fieldBlock: {
    gap: 9,
  },
  fieldBlockLarge: {
    gap: 9,
    marginTop: 20,
  },
  resumeBox: {
    height: 58,
    borderRadius: 6,
    borderWidth: 1.2,
    borderColor: "#E7E7F0",
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  fileIconBox: {
    width: 30,
    height: 30,
    borderRadius: 5,
    backgroundColor: "#28B657",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    color: "#303244",
    fontSize: 12.5,
    lineHeight: 17,
    fontWeight: "900",
  },
  fileSize: {
    color: "#6B6C7C",
    fontSize: 12,
    lineHeight: 17,
    fontWeight: "800",
    marginTop: 1,
  },
  coverBox: {
    minHeight: 82,
    borderRadius: 6,
    borderWidth: 1.2,
    borderColor: "#E7E7F0",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    paddingVertical: 11,
  },
  coverText: {
    color: "#303244",
    fontSize: 12.5,
    lineHeight: 20,
    fontWeight: "800",
  },
  nextStepBlock: {
    marginTop: 22,
    gap: 8,
  },
  nextStepText: {
    color: "#4F5061",
    fontSize: 12.5,
    lineHeight: 19,
    fontWeight: "800",
  },
});

export default JobPortalApplicationDetailsScreen;
