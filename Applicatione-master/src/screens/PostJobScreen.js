import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
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
import { createPostedJob, savePostedJob } from "../utils/postedJobs";

const steps = ["Describe", "Preview", "Publish"];

const initialDescription =
  "We need a React Native Developer\n" +
  "with 3 years of experience.\n" +
  "Good in Redux, API integration\n" +
  "and UI development.\n" +
  "Location: Ahmedabad\n" +
  "Salary: 4 - 6 LPA";

const previewFields = [
  {
    label: "Job Title",
    value: "React Native Developer",
  },
  {
    label: "Experience",
    value: "3 Years",
  },
  {
    label: "Location",
    value: "Ahmedabad, Gujarat",
  },
  {
    label: "Salary",
    value: "₹ 4 - 6 LPA",
  },
];

const skills = [
  "React Native",
  "Redux",
  "JavaScript",
  "TypeScript",
  "REST API",
  "Git",
  "API Integration",
  "UI/UX",
];

const confettiDots = [
  { top: 18, left: 46, color: "#10A9E8", size: 5 },
  { top: 46, left: 22, color: "#AE69FF", size: 4 },
  { top: 68, left: 76, color: "#FF8C24", size: 4 },
  { top: 22, right: 70, color: "#B06CFF", size: 3 },
  { top: 58, right: 34, color: "#4B2EFF", size: 5 },
  { top: 92, right: 74, color: "#FF9827", size: 4 },
  { top: 92, left: 116, color: "#FF5438", size: 4 },
  { top: 117, left: 32, color: "#DFA7FF", size: 3 },
  { top: 126, right: 34, color: "#FF9827", size: 4 },
];

const PostJobScreen = ({ navigation }) => {
  const { width, height } = useWindowDimensions();
  const topInset =
    Platform.OS === "android" ? (RNStatusBar.currentHeight ?? 0) : 0;
  const [activeStep, setActiveStep] = useState(1);
  const [description, setDescription] = useState(initialDescription);
  const [isPosting, setIsPosting] = useState(false);

  const bottomInset = Platform.OS === "android" ? 18 : 22;
  const cardWidth = Math.min(width - 28, 390);
  const cardMinHeight = Math.max(548, height - topInset - bottomInset - 34);

  const handlePostJobNow = async () => {
    if (isPosting) {
      return;
    }

    if (!description.trim()) {
      Alert.alert(
        "Description Required",
        "Please describe the job before posting.",
      );
      return;
    }

    try {
      setIsPosting(true);
      const job = createPostedJob({ description });
      await savePostedJob(job);
      navigation.navigate("JobDetails", { job });
    } catch {
      Alert.alert("Post Failed", "Unable to save this job. Please try again.");
    } finally {
      setIsPosting(false);
    }
  };

  const renderStepper = () => (
    <View style={styles.stepper}>
      <View style={styles.stepLine} />
      {steps.map((label, index) => {
        const active = index === activeStep - 1;

        return (
          <View key={label} style={styles.stepItem}>
            {active ? (
              <LinearGradient
                colors={["#654DFF", "#3823EA"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.activeStepCircle}
              >
                <Text style={styles.activeStepNumber}>{index + 1}</Text>
              </LinearGradient>
            ) : (
              <View style={styles.inactiveStepCircle}>
                <Text style={styles.inactiveStepNumber}>{index + 1}</Text>
              </View>
            )}
            <Text
              numberOfLines={1}
              style={[styles.stepLabel, active && styles.activeStepLabel]}
            >
              {label}
            </Text>
          </View>
        );
      })}
    </View>
  );

  const renderDescribeStep = () => (
    <>
      <View>
        {renderStepper()}

        <Text style={styles.formLabel}>
          Describe the role you want to hire for
        </Text>

        <View style={styles.textAreaBox}>
          <TextInput
            value={description}
            onChangeText={setDescription}
            maxLength={500}
            multiline
            textAlignVertical="top"
            style={styles.descriptionInput}
            placeholder="Write the job role, experience, skills, location and salary"
            placeholderTextColor="#9AA0B6"
          />
          <Text style={styles.characterCount}>{description.length}/500</Text>
        </View>
      </View>

      <TouchableOpacity
        activeOpacity={0.9}
        style={styles.generateButton}
        onPress={() => setActiveStep(2)}
      >
        <LinearGradient
          colors={["#3E31FF", "#654DFF", "#F13391"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.generateGradient}
        >
          <Text style={styles.generateText}>Generate with AI ✨</Text>
        </LinearGradient>
      </TouchableOpacity>
    </>
  );

  const renderPreviewStep = () => (
    <>
      <View>
        <Text style={styles.previewTitle}>AI Generated Preview</Text>

        <View style={styles.previewFields}>
          {previewFields.map((field) => (
            <View key={field.label} style={styles.previewFieldRow}>
              <View style={styles.previewFieldTextBlock}>
                <Text style={styles.previewFieldLabel}>{field.label}</Text>
                <Text numberOfLines={1} style={styles.previewFieldValue}>
                  {field.value}
                </Text>
              </View>

              <TouchableOpacity
                activeOpacity={0.78}
                style={styles.editButton}
                onPress={() =>
                  Alert.alert(field.label, "Edit option is coming soon.")
                }
              >
                <Text style={styles.editText}>Edit</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <Text style={styles.skillsLabel}>Skills</Text>
        <View style={styles.skillsWrap}>
          {skills.map((skill) => (
            <View key={skill} style={styles.skillChip}>
              <Text numberOfLines={1} style={styles.skillText}>
                {skill}
              </Text>
            </View>
          ))}
          <TouchableOpacity
            activeOpacity={0.78}
            style={[styles.skillChip, styles.addSkillChip]}
            onPress={() =>
              Alert.alert("Add Skill", "Add skill option is coming soon.")
            }
          >
            <Text style={styles.addSkillText}>+ Add Skill</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.previewActionsRow}>
        <TouchableOpacity
          activeOpacity={0.82}
          style={styles.backButton}
          onPress={() => setActiveStep(1)}
        >
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.nextButton}
          onPress={() => setActiveStep(3)}
        >
          <LinearGradient
            colors={["#3E31FF", "#654DFF", "#F13391"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.nextGradient}
          >
            <Text style={styles.nextText}>Next</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </>
  );

  const renderPublishStep = () => (
    <>
      <View>
        <View style={styles.rocketArea}>
          {confettiDots.map((dot, index) => (
            <View
              key={`${dot.color}-${index}`}
              style={[
                styles.confettiDot,
                {
                  top: dot.top,
                  left: dot.left,
                  right: dot.right,
                  width: dot.size,
                  height: dot.size,
                  borderRadius: dot.size / 2,
                  backgroundColor: dot.color,
                },
              ]}
            />
          ))}
          <Text style={styles.rocketEmoji}>🚀</Text>
        </View>

        <Text style={styles.readyTitle}>
          Your job is ready to be posted! 🎊
        </Text>

        <View style={styles.jobSummaryCard}>
          <View style={styles.summaryIconBox}>
            <Text style={styles.summaryIcon}>▣</Text>
          </View>
          <View style={styles.summaryTextBlock}>
            <Text numberOfLines={1} style={styles.summaryTitle}>
              React Native Developer
            </Text>
            <Text numberOfLines={1} style={styles.summaryMeta}>
              3 Years Experience • Full Time
            </Text>
            <Text numberOfLines={1} style={styles.summaryMeta}>
              Ahmedabad, Gujarat • ₹ 4 - 6 LPA
            </Text>
          </View>
        </View>

        <View style={styles.publishChecks}>
          <View style={styles.publishCheckRow}>
            <Text style={styles.publishCheckText}>
              Visible to relevant candidates
            </Text>
            <Text style={styles.checkMark}>✓</Text>
          </View>
          <View style={styles.publishDivider} />
          <View style={styles.publishCheckRow}>
            <Text style={styles.publishCheckText}>
              Auto Suggestions{`\n`}Enabled
            </Text>
            <Text style={styles.checkMark}>✓</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        activeOpacity={0.9}
        style={[
          styles.postNowButton,
          isPosting && styles.postNowButtonDisabled,
        ]}
        onPress={handlePostJobNow}
        disabled={isPosting}
      >
        <LinearGradient
          colors={["#3341FF", "#654DFF", "#F13391"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.postNowGradient}
        >
          <Text style={styles.postNowText}>
            {isPosting ? "Posting..." : "Post Job Now 🚀"}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </>
  );

  const renderCurrentStep = () => {
    if (activeStep === 1) {
      return renderDescribeStep();
    }

    if (activeStep === 2) {
      return renderPreviewStep();
    }

    return renderPublishStep();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingTop: topInset + 8, paddingBottom: bottomInset },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View
            style={[
              styles.card,
              activeStep === 2 && styles.previewCard,
              activeStep === 3 && styles.publishCard,
              { width: cardWidth, minHeight: cardMinHeight },
            ]}
          >
            {renderCurrentStep()}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F7FF",
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: "center",
    paddingHorizontal: 14,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#EBEEF8",
    paddingHorizontal: 22,
    paddingTop: 47,
    paddingBottom: 34,
    justifyContent: "space-between",
    shadowColor: "#6D728A",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 22,
    elevation: 7,
  },
  previewCard: {
    paddingTop: 24,
    paddingBottom: 34,
  },
  publishCard: {
    paddingTop: 12,
    paddingBottom: 34,
  },
  stepper: {
    position: "relative",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 34,
  },
  stepLine: {
    position: "absolute",
    left: 30,
    right: 30,
    top: 9,
    height: 2,
    borderRadius: 1,
    backgroundColor: "#E5E8F4",
  },
  stepItem: {
    width: 72,
    alignItems: "center",
    zIndex: 1,
  },
  activeStepCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#543CFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  inactiveStepCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#C8CCDA",
    alignItems: "center",
    justifyContent: "center",
  },
  activeStepNumber: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "900",
    lineHeight: 12,
  },
  inactiveStepNumber: {
    color: "#5E657B",
    fontSize: 10,
    fontWeight: "900",
    lineHeight: 12,
  },
  stepLabel: {
    color: "#4C5268",
    fontSize: 12,
    fontWeight: "900",
    marginTop: 9,
  },
  activeStepLabel: {
    color: "#563CFF",
  },
  formLabel: {
    color: "#11162E",
    fontSize: 13,
    fontWeight: "900",
    marginBottom: 15,
  },
  textAreaBox: {
    minHeight: 221,
    borderRadius: 11,
    borderWidth: 1.4,
    borderColor: "#E2DDF8",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 15,
    paddingTop: 17,
    paddingBottom: 30,
  },
  descriptionInput: {
    minHeight: 166,
    color: "#272D51",
    fontSize: 13,
    fontWeight: "800",
    lineHeight: 28,
    padding: 0,
  },
  characterCount: {
    position: "absolute",
    right: 14,
    bottom: 12,
    color: "#202643",
    fontSize: 11.5,
    fontWeight: "900",
  },
  generateButton: {
    borderRadius: 9,
    overflow: "hidden",
    marginTop: 58,
    shadowColor: "#5B42FF",
    shadowOffset: { width: 0, height: 9 },
    shadowOpacity: 0.22,
    shadowRadius: 13,
    elevation: 8,
  },
  generateGradient: {
    height: 45,
    alignItems: "center",
    justifyContent: "center",
  },
  generateText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "900",
  },
  previewTitle: {
    color: "#101633",
    fontSize: 15,
    fontWeight: "900",
    marginBottom: 25,
  },
  previewFields: {
    marginBottom: 14,
  },
  previewFieldRow: {
    minHeight: 64,
    borderBottomWidth: 1,
    borderBottomColor: "#EEF0F7",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  previewFieldTextBlock: {
    flex: 1,
    minWidth: 0,
    paddingRight: 14,
  },
  previewFieldLabel: {
    color: "#858CA5",
    fontSize: 11.5,
    fontWeight: "800",
    marginBottom: 7,
  },
  previewFieldValue: {
    color: "#151B36",
    fontSize: 13.5,
    fontWeight: "900",
  },
  editButton: {
    minWidth: 38,
    height: 27,
    borderRadius: 8,
    backgroundColor: "#F3EEFF",
    borderWidth: 1,
    borderColor: "#E4D9FF",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  editText: {
    color: "#6347FF",
    fontSize: 11.5,
    fontWeight: "900",
  },
  skillsLabel: {
    color: "#858CA5",
    fontSize: 11.5,
    fontWeight: "800",
    marginBottom: 8,
  },
  skillsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  skillChip: {
    minHeight: 27,
    borderRadius: 8,
    backgroundColor: "#F3EEFF",
    borderWidth: 1,
    borderColor: "#ECE5FF",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
  },
  skillText: {
    color: "#674AFF",
    fontSize: 11,
    fontWeight: "900",
  },
  addSkillChip: {
    backgroundColor: "#F8F5FF",
    borderColor: "#E5DAFF",
  },
  addSkillText: {
    color: "#674AFF",
    fontSize: 11.5,
    fontWeight: "900",
  },
  previewActionsRow: {
    flexDirection: "row",
    gap: 18,
    marginTop: 20,
  },
  backButton: {
    flex: 1,
    height: 47,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: "#E3E6F0",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  backButtonText: {
    color: "#1E2541",
    fontSize: 14,
    fontWeight: "900",
  },
  nextButton: {
    flex: 1,
    borderRadius: 9,
    overflow: "hidden",
    shadowColor: "#5B42FF",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 7,
  },
  nextGradient: {
    height: 47,
    alignItems: "center",
    justifyContent: "center",
  },
  nextText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "900",
  },
  rocketArea: {
    height: 165,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    marginBottom: 2,
  },
  confettiDot: {
    position: "absolute",
  },
  rocketEmoji: {
    fontSize: 86,
    lineHeight: 98,
    transform: [{ rotate: "-8deg" }],
  },
  readyTitle: {
    color: "#151B36",
    fontSize: 16,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 23,
  },
  jobSummaryCard: {
    minHeight: 99,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E8F2",
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 15,
    marginBottom: 25,
    shadowColor: "#4F5671",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  summaryIconBox: {
    width: 25,
    height: 25,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#654DFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 13,
  },
  summaryIcon: {
    color: "#654DFF",
    fontSize: 12,
    fontWeight: "900",
    lineHeight: 14,
  },
  summaryTextBlock: {
    flex: 1,
    minWidth: 0,
  },
  summaryTitle: {
    color: "#151B36",
    fontSize: 13.5,
    fontWeight: "900",
    marginBottom: 9,
  },
  summaryMeta: {
    color: "#6F768E",
    fontSize: 11.2,
    fontWeight: "800",
    marginTop: 2,
  },
  publishChecks: {
    marginBottom: 27,
  },
  publishCheckRow: {
    minHeight: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  publishCheckText: {
    color: "#5B6279",
    fontSize: 12.5,
    fontWeight: "800",
    lineHeight: 20,
  },
  checkMark: {
    color: "#28B567",
    fontSize: 23,
    fontWeight: "900",
  },
  publishDivider: {
    height: 1,
    backgroundColor: "#EEF0F7",
  },
  postNowButton: {
    borderRadius: 9,
    overflow: "hidden",
    shadowColor: "#5B42FF",
    shadowOffset: { width: 0, height: 9 },
    shadowOpacity: 0.22,
    shadowRadius: 13,
    elevation: 8,
  },
  postNowButtonDisabled: {
    opacity: 0.72,
  },
  postNowGradient: {
    height: 47,
    alignItems: "center",
    justifyContent: "center",
  },
  postNowText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "900",
  },
});

export default PostJobScreen;
