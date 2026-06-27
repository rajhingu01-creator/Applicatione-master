import React from "react";
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
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";

const topContentPadding =
  Platform.OS === "android" ? (RNStatusBar.currentHeight ?? 0) + 8 : 10;

const getCompanyName = (job = {}) => {
  if (
    job.id === "react-native-developer" ||
    job.title === "React Native Developer"
  ) {
    return "TechNova Solutions Pvt. Ltd.";
  }

  return job.company ?? "TechNova Solutions Pvt. Ltd.";
};

const JobPortalApplyScreen = ({ navigation, route }) => {
  const { width, height } = useWindowDimensions();
  const contentWidth = Math.min(width - 22, 410);
  const compact = height < 720 || width < 370;
  const job = route?.params?.job ?? {};
  const title = job.title ?? "React Native Developer";
  const company = getCompanyName(job);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View
        style={[
          styles.content,
          {
            width: contentWidth,
            paddingTop: topContentPadding + (compact ? 0 : 4),
            paddingBottom: compact ? 12 : 20,
          },
        ]}
      >
        <View style={[styles.card, compact && styles.cardCompact]}>
          <Text style={styles.eyebrow}>Apply for</Text>
          <Text style={[styles.title, compact && styles.titleCompact]}>
            {title}
          </Text>
          <Text style={styles.company}>{company}</Text>

          <View style={styles.divider} />

          <View style={styles.fieldBlock}>
            <Text style={styles.label}>Resume</Text>
            <View style={styles.resumeBox}>
              <View style={styles.fileIconBox}>
                <Ionicons name="document-text" size={22} color="#FFFFFF" />
              </View>
              <View style={styles.fileInfo}>
                <Text style={styles.fileName} numberOfLines={1}>
                  Meet_Vasoya_Resume.pdf
                </Text>
                <Text style={styles.fileSize}>2.4 MB</Text>
              </View>
              <TouchableOpacity activeOpacity={0.74}>
                <Text style={styles.changeText}>Change</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.fieldBlockLarge}>
            <Text style={styles.label}>Cover Letter (Optional)</Text>
            <View style={styles.coverBox}>
              <TextInput
                multiline
                editable={false}
                pointerEvents="none"
                value={
                  "I am excited to apply for this position as\nit aligns perfectly with my skills and\nexperience."
                }
                style={styles.coverInput}
                textAlignVertical="top"
              />
              <Text style={styles.counterText}>0/500</Text>
            </View>
          </View>

          <TouchableOpacity
            activeOpacity={0.9}
            style={styles.submitTouchable}
            onPress={() => navigation.navigate("JobPortalHome")}
          >
            <LinearGradient
              colors={["#673BF2", "#4B2BE7"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.submitButton}
            >
              <Text style={styles.submitText}>Submit Application</Text>
            </LinearGradient>
          </TouchableOpacity>
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
    paddingHorizontal: 19,
    paddingTop: 27,
    paddingBottom: 32,
    shadowColor: "#B7B8C8",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 4,
  },
  cardCompact: {
    paddingTop: 23,
    paddingBottom: 24,
  },
  eyebrow: {
    color: "#555667",
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "800",
  },
  title: {
    color: "#1A1B2D",
    fontSize: 22,
    lineHeight: 28,
    fontWeight: "900",
    letterSpacing: -0.4,
    marginTop: 4,
  },
  titleCompact: {
    fontSize: 20,
    lineHeight: 26,
  },
  company: {
    color: "#4F5061",
    fontSize: 13.5,
    lineHeight: 19,
    fontWeight: "800",
    marginTop: 3,
  },
  divider: {
    height: 1,
    backgroundColor: "#F0F0F5",
    marginTop: 20,
    marginBottom: 17,
  },
  fieldBlock: {
    gap: 10,
  },
  fieldBlockLarge: {
    gap: 10,
    marginTop: 22,
  },
  label: {
    color: "#303244",
    fontSize: 13.5,
    lineHeight: 18,
    fontWeight: "900",
  },
  resumeBox: {
    height: 58,
    borderRadius: 5,
    borderWidth: 1.2,
    borderColor: "#E7E7F0",
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  fileIconBox: {
    width: 33,
    height: 33,
    borderRadius: 6,
    backgroundColor: "#41A9FF",
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
  changeText: {
    color: "#6F4EF1",
    fontSize: 12.5,
    fontWeight: "900",
  },
  coverBox: {
    minHeight: 119,
    borderRadius: 5,
    borderWidth: 1.2,
    borderColor: "#E7E7F0",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 22,
  },
  coverInput: {
    minHeight: 74,
    color: "#303244",
    fontSize: 13.5,
    lineHeight: 22,
    fontWeight: "800",
    padding: 0,
  },
  counterText: {
    alignSelf: "flex-end",
    color: "#8D8E9B",
    fontSize: 12,
    fontWeight: "800",
  },
  submitTouchable: {
    marginTop: 55,
  },
  submitButton: {
    height: 41,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#5634EC",
    shadowOffset: { width: 0, height: 9 },
    shadowOpacity: 0.22,
    shadowRadius: 14,
    elevation: 5,
  },
  submitText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "900",
  },
});

export default JobPortalApplyScreen;
