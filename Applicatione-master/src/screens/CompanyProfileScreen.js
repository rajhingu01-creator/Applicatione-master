import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as DocumentPicker from "expo-document-picker";
import { StatusBar } from "expo-status-bar";
import { ChevronDown, Upload } from "lucide-react-native";

const supportedLogoExtensions = [
  "cdr",
  "pdf",
  "jpg",
  "jpeg",
  "png",
  "webp",
  "heic",
  "gif",
];
const supportedCdrMimeTypes = [
  "application/cdr",
  "application/coreldraw",
  "application/vnd.corel-draw",
  "application/x-cdr",
  "image/cdr",
  "image/x-cdr",
  "image/x-coreldraw",
];

const primaryGradientColors = ["#7452FF", "#A338FF", "#EF36A1"];
const dotPatternItems = Array.from({ length: 42 });

const getFileExtension = (fileName = "") => {
  const parts = fileName.split(".");
  return parts.length > 1 ? parts.pop().toLowerCase() : "";
};

const formatFileSize = (size) => {
  if (!size) {
    return "";
  }

  if (size < 1024 * 1024) {
    return `${Math.round(size / 1024)} KB`;
  }

  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
};

const isSupportedLogoFile = (asset) => {
  const extension = getFileExtension(asset?.name);
  const mimeType = asset?.mimeType?.toLowerCase() ?? "";

  return (
    supportedLogoExtensions.includes(extension) ||
    mimeType.startsWith("image/") ||
    mimeType === "application/pdf" ||
    supportedCdrMimeTypes.includes(mimeType)
  );
};

const getLogoMeta = (asset) => {
  const extension = getFileExtension(asset?.name).toUpperCase();
  const size = formatFileSize(asset?.size);

  return [extension || asset?.mimeType || "FILE", size]
    .filter(Boolean)
    .join(" • ");
};

const CompanyProfileScreen = ({ navigation }) => {
  const { width, height } = useWindowDimensions();
  const [activeStep, setActiveStep] = useState(1);
  const [companyName, setCompanyName] = useState("");
  const [website, setWebsite] = useState("");
  const [aboutCompany, setAboutCompany] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [selectedLogo, setSelectedLogo] = useState(null);

  const cardWidth = Math.min(width - 44, 390);
  const isShortScreen = height < 760;
  const cardMinHeight =
    activeStep === 1
      ? isShortScreen
        ? 520
        : 548
      : activeStep === 2
        ? isShortScreen
          ? 470
          : 492
        : isShortScreen
          ? 492
          : 528;

  const pickCompanyLogo = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        multiple: false,
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        return;
      }

      const asset = result.assets?.[0];

      if (!asset) {
        return;
      }

      if (!isSupportedLogoFile(asset)) {
        Alert.alert(
          "Unsupported File",
          "Please upload a CDR, PDF, JPG, PNG, WEBP, HEIC or GIF file.",
        );
        return;
      }

      setSelectedLogo(asset);
    } catch {
      Alert.alert(
        "Upload Failed",
        "Unable to select this file. Please try again.",
      );
    }
  };

  const goToPreviousStep = () => {
    setActiveStep((step) => Math.max(1, step - 1));
  };

  const goToNextStep = () => {
    setActiveStep((step) => Math.min(3, step + 1));
  };

  const completeProfile = () => {
    navigation.navigate("EmployerDashboard");
  };

  const renderSelectBox = (value, placeholder, iconName = "briefcase") => (
    <TouchableOpacity activeOpacity={0.78} style={styles.selectBox}>
      <View style={styles.selectLeft}>
        <View style={styles.fieldIconBox}>
          <Ionicons name={iconName} size={17} color="#744BFF" />
        </View>
        <Text style={[styles.selectPlaceholder, value && styles.selectValue]}>
          {value || placeholder}
        </Text>
      </View>
      <ChevronDown size={19} color="#8B91A8" strokeWidth={2.2} />
    </TouchableOpacity>
  );

  const renderStepIndicator = () => {
    const steps = [
      { number: 1, label: "Basic Info" },
      { number: 2, label: "Company Details" },
      { number: 3, label: "Location" },
    ];

    return (
      <View style={styles.stepperRow}>
        {steps.map((step, index) => {
          const isComplete = activeStep > step.number;
          const isActive = activeStep === step.number;

          return (
            <React.Fragment key={step.number}>
              <View style={styles.stepperItem}>
                <View
                  style={[
                    styles.stepperCircle,
                    (isComplete || isActive) && styles.stepperCircleActive,
                  ]}
                >
                  {isComplete ? (
                    <Ionicons name="checkmark" size={11} color="#FFFFFF" />
                  ) : (
                    <Text
                      style={[
                        styles.stepperNumber,
                        isActive && styles.stepperNumberActive,
                      ]}
                    >
                      {step.number}
                    </Text>
                  )}
                </View>
                <Text
                  numberOfLines={1}
                  style={[
                    styles.stepperLabel,
                    isActive && styles.stepperLabelActive,
                  ]}
                >
                  {step.label}
                </Text>
              </View>
              {index < steps.length - 1 ? (
                <View
                  style={[
                    styles.stepperLine,
                    activeStep > step.number && styles.stepperLineActive,
                  ]}
                />
              ) : null}
            </React.Fragment>
          );
        })}
      </View>
    );
  };

  const renderStepOne = () => (
    <>
      <View>
        <Text style={styles.title}>Tell us about your company</Text>
        <Text style={styles.subtitle}>
          This will help job seekers know more about you
        </Text>

        <View style={styles.fieldBlock}>
          <Text style={styles.label}>Company Logo</Text>
          <TouchableOpacity
            activeOpacity={0.78}
            style={[styles.uploadBox, selectedLogo && styles.uploadBoxSelected]}
            onPress={pickCompanyLogo}
          >
            {selectedLogo ? (
              <>
                <View style={styles.uploadIconCircle}>
                  <Upload size={22} color="#C43EDF" strokeWidth={2.6} />
                </View>
                <Text style={styles.selectedFileName} numberOfLines={1}>
                  {selectedLogo.name}
                </Text>
                <Text style={styles.selectedFileMeta} numberOfLines={1}>
                  {getLogoMeta(selectedLogo)}
                </Text>
                <Text style={styles.uploadHint}>Tap to change</Text>
              </>
            ) : (
              <>
                <View style={styles.uploadIconCircle}>
                  <Upload size={22} color="#C43EDF" strokeWidth={2.6} />
                </View>
                <Text style={styles.uploadText}>Upload Logo</Text>
                <Text style={styles.uploadHint}>CDR, PDF or Photo</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.fieldBlock}>
          <Text style={styles.label}>
            Company Name <Text style={styles.required}>*</Text>
          </Text>
          <View style={styles.inputShell}>
            <View style={styles.fieldIconBox}>
              <Ionicons name="business" size={17} color="#744BFF" />
            </View>
            <TextInput
              style={styles.inputField}
              value={companyName}
              onChangeText={setCompanyName}
              placeholder="Enter company name"
              placeholderTextColor="#9AA0B6"
            />
          </View>
        </View>

        <View style={styles.fieldBlock}>
          <Text style={styles.label}>
            Industry <Text style={styles.required}>*</Text>
          </Text>
          {renderSelectBox("", "Select industry", "briefcase")}
        </View>

        <View style={styles.fieldBlock}>
          <Text style={styles.label}>
            Company Size <Text style={styles.required}>*</Text>
          </Text>
          {renderSelectBox("", "Select company size", "people")}
        </View>
      </View>

      <View style={styles.stepOneFooter}>
        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.nextButton}
          onPress={goToNextStep}
        >
          <LinearGradient
            colors={primaryGradientColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.nextGradient}
          >
            <Text style={styles.nextText}>Next</Text>
            <Ionicons name="arrow-forward" size={21} color="#FFFFFF" />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </>
  );

  const renderStepTwo = () => (
    <>
      <View>
        <Text style={styles.sectionTitle}>Company Details</Text>
        <Text style={styles.sectionSubtitle}>
          Tell us more about your company
        </Text>

        <View style={styles.fieldBlockCompact}>
          <Text style={styles.label}>Website</Text>
          <View style={styles.inputShell}>
            <View style={styles.fieldIconBox}>
              <Ionicons name="globe-outline" size={17} color="#744BFF" />
            </View>
            <TextInput
              style={styles.inputField}
              value={website}
              onChangeText={setWebsite}
              placeholder="https://company.com"
              placeholderTextColor="#9AA0B6"
              keyboardType="url"
              autoCapitalize="none"
            />
          </View>
        </View>

        <View style={styles.fieldBlockCompact}>
          <Text style={styles.label}>Founded Year</Text>
          {renderSelectBox("", "Select year", "calendar-outline")}
        </View>

        <View style={styles.fieldBlockCompact}>
          <Text style={styles.label}>
            About Company <Text style={styles.required}>*</Text>
          </Text>
          <View style={styles.stepTwoTextAreaShell}>
            <View style={styles.textAreaIconBox}>
              <Ionicons
                name="document-text-outline"
                size={16}
                color="#744BFF"
              />
            </View>
            <TextInput
              style={styles.stepTwoTextArea}
              value={aboutCompany}
              onChangeText={setAboutCompany}
              placeholder="Write about your company..."
              placeholderTextColor="#9AA0B6"
              multiline
              maxLength={500}
              textAlignVertical="top"
            />
            <Text style={styles.characterCount}>{aboutCompany.length}/500</Text>
          </View>
        </View>

        <View style={styles.aiSummaryBox}>
          <View style={styles.aiIconBox}>
            <Ionicons name="sparkles" size={16} color="#D239C9" />
          </View>
          <View style={styles.aiSummaryCopy}>
            <Text style={styles.aiTitle}>AI Company Summary</Text>
            <Text style={styles.aiText} numberOfLines={2}>
              Let AI help you generate a professional summary for your company.
            </Text>
          </View>
          <TouchableOpacity activeOpacity={0.8} style={styles.generateButton}>
            <Text style={styles.generateText}>Generate</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.footerBlock}>
        <View style={styles.footerButtonsRow}>
          <TouchableOpacity
            activeOpacity={0.82}
            style={styles.backButton}
            onPress={goToPreviousStep}
          >
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.9}
            style={styles.footerPrimaryButton}
            onPress={goToNextStep}
          >
            <LinearGradient
              colors={primaryGradientColors}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.footerPrimaryGradient}
            >
              <Text style={styles.nextText}>Next</Text>
              <Ionicons name="arrow-forward" size={17} color="#FFFFFF" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );

  const renderStepThree = () => (
    <>
      <View>
        <Text style={[styles.sectionTitle, styles.locationTitle]}>
          Company Location
        </Text>

        <View style={styles.fieldBlock}>
          <Text style={styles.label}>
            Country <Text style={styles.required}>*</Text>
          </Text>
          {renderSelectBox("India", "Select country")}
        </View>

        <View style={styles.fieldBlock}>
          <Text style={styles.label}>
            State <Text style={styles.required}>*</Text>
          </Text>
          {renderSelectBox("Gujarat", "Select state")}
        </View>

        <View style={styles.fieldBlock}>
          <Text style={styles.label}>
            City <Text style={styles.required}>*</Text>
          </Text>
          {renderSelectBox("Ahmedabad", "Select city")}
        </View>

        <View style={styles.fieldBlock}>
          <Text style={styles.label}>
            Company Address <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={[styles.textAreaShell, styles.addressInput]}
            value={companyAddress}
            onChangeText={setCompanyAddress}
            placeholder="Enter full address"
            placeholderTextColor="#9AA0B6"
            multiline
            textAlignVertical="top"
          />
        </View>
      </View>

      <View style={styles.footerBlock}>
        <View style={styles.footerButtonsRow}>
          <TouchableOpacity
            activeOpacity={0.82}
            style={styles.backButton}
            onPress={goToPreviousStep}
          >
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.9}
            style={styles.footerPrimaryButton}
            onPress={completeProfile}
          >
            <LinearGradient
              colors={primaryGradientColors}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.footerPrimaryGradient}
            >
              <Text style={styles.nextText}>Complete</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.backgroundDecor} pointerEvents="none">
        <LinearGradient
          colors={["rgba(238,54,160,0.2)", "rgba(238,54,160,0)"]}
          style={styles.topPinkBlob}
        />
        <LinearGradient
          colors={["rgba(24,170,255,0.18)", "rgba(24,170,255,0)"]}
          style={styles.bottomBlueBlob}
        />
        <LinearGradient
          colors={["rgba(116,82,255,0.14)", "rgba(116,82,255,0)"]}
          style={styles.leftPurpleBlob}
        />
        <View style={styles.dotPattern}>
          {dotPatternItems.map((_, index) => (
            <View key={`profile-dot-${index}`} style={styles.dot} />
          ))}
        </View>
      </View>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.content, { width: cardWidth }]}>
            <View style={styles.stepHeader}>
              <TouchableOpacity
                activeOpacity={0.82}
                style={styles.headerBackButton}
                onPress={() => navigation.goBack()}
              >
                <Ionicons name="chevron-back" size={23} color="#101633" />
              </TouchableOpacity>
              <Text style={styles.stepTitle}>
                {activeStep === 1 ? (
                  <>
                    Create{" "}
                    <Text style={styles.stepTitleAccent}>Company Profile</Text>
                  </>
                ) : (
                  <>
                    Company Profile{" "}
                    <Text style={styles.stepTitleAccent}>
                      (Step {activeStep})
                    </Text>
                  </>
                )}
              </Text>
              {renderStepIndicator()}
            </View>

            <View
              style={[
                styles.card,
                activeStep === 2 && styles.stepTwoCard,
                activeStep === 3 && styles.stepThreeCard,
                { minHeight: cardMinHeight },
              ]}
            >
              {activeStep === 1 ? renderStepOne() : null}
              {activeStep === 2 ? renderStepTwo() : null}
              {activeStep === 3 ? renderStepThree() : null}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
    backgroundColor: "#F8FAFF",
  },
  keyboardView: {
    flex: 1,
    zIndex: 1,
    elevation: 1,
  },
  backgroundDecor: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
    overflow: "hidden",
  },
  topPinkBlob: {
    position: "absolute",
    right: -92,
    top: -76,
    width: 250,
    height: 255,
    borderRadius: 130,
  },
  bottomBlueBlob: {
    position: "absolute",
    left: -100,
    bottom: -98,
    width: 280,
    height: 260,
    borderRadius: 140,
  },
  leftPurpleBlob: {
    position: "absolute",
    left: -82,
    top: -70,
    width: 205,
    height: 205,
    borderRadius: 105,
  },
  dotPattern: {
    position: "absolute",
    right: 14,
    top: 90,
    width: 74,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 5,
    opacity: 0.22,
  },
  dot: {
    width: 2.4,
    height: 2.4,
    borderRadius: 2,
    backgroundColor: "#C56BFF",
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 22,
    paddingTop: Platform.OS === "android" ? 10 : 8,
    paddingBottom: 12,
  },
  content: {
    alignSelf: "center",
  },

  stepHeader: {
    marginBottom: 17,
  },
  headerBackButton: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
    shadowColor: "#8390BC",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 14,
    elevation: 5,
  },
  stepTitle: {
    color: "#101633",
    fontSize: 20,
    lineHeight: 25,
    fontWeight: "900",
    letterSpacing: -0.45,
    marginBottom: 7,
  },
  stepTitleAccent: {
    color: "#744BFF",
  },
  stepperRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginTop: 8,
    paddingHorizontal: 4,
  },
  stepperItem: {
    width: 82,
    alignItems: "center",
  },
  stepperCircle: {
    width: 21,
    height: 21,
    borderRadius: 11,
    borderWidth: 1.6,
    borderColor: "#DDE2EF",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  stepperCircleActive: {
    borderColor: "#7452FF",
    backgroundColor: "#7452FF",
  },
  stepperNumber: {
    color: "#8B91A8",
    fontSize: 9.5,
    lineHeight: 12,
    fontWeight: "900",
  },
  stepperNumberActive: {
    color: "#FFFFFF",
  },
  stepperLabel: {
    color: "#70778C",
    fontSize: 8.8,
    lineHeight: 11,
    fontWeight: "800",
    textAlign: "center",
  },
  stepperLabelActive: {
    color: "#7452FF",
    fontWeight: "900",
  },
  stepperLine: {
    flex: 1,
    height: 2.5,
    borderRadius: 2,
    backgroundColor: "#E4E7F1",
    marginHorizontal: -17,
    marginTop: 9.5,
  },
  stepperLineActive: {
    backgroundColor: "#7452FF",
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "rgba(231,233,245,0.82)",
    paddingHorizontal: 18,
    paddingTop: 20,
    paddingBottom: 20,
    justifyContent: "space-between",
    shadowColor: "#9BA5C9",
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.13,
    shadowRadius: 26,
    elevation: 9,
  },
  stepTwoCard: {
    paddingTop: 24,
    paddingBottom: 18,
  },
  stepThreeCard: {
    paddingTop: 24,
    paddingBottom: 18,
  },
  title: {
    color: "#101633",
    fontSize: 18,
    lineHeight: 23,
    fontWeight: "900",
    marginBottom: 7,
  },
  subtitle: {
    color: "#697087",
    fontSize: 11.5,
    lineHeight: 15,
    fontWeight: "700",
    marginBottom: 27,
  },
  sectionTitle: {
    color: "#101633",
    fontSize: 20,
    lineHeight: 25,
    fontWeight: "900",
    marginBottom: 8,
  },
  sectionSubtitle: {
    color: "#697087",
    fontSize: 12,
    lineHeight: 17,
    fontWeight: "700",
    marginBottom: 16,
  },
  locationTitle: {
    marginBottom: 22,
  },
  fieldBlock: {
    marginBottom: 18,
  },
  fieldBlockCompact: {
    marginBottom: 12,
  },
  label: {
    color: "#101633",
    fontSize: 11.5,
    fontWeight: "900",
    marginBottom: 9,
  },
  required: {
    color: "#FF4C64",
  },
  uploadBox: {
    height: 135,
    borderRadius: 11,
    borderWidth: 1.4,
    borderColor: "#DDC9FF",
    borderStyle: "dashed",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  uploadBoxSelected: {
    borderStyle: "solid",
    borderColor: "#CDB8FF",
    backgroundColor: "#FCFAFF",
  },
  uploadIconCircle: {
    width: 45,
    height: 45,
    borderRadius: 23,
    backgroundColor: "#F4E4FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 13,
  },
  uploadText: {
    color: "#744BFF",
    fontSize: 13,
    lineHeight: 17,
    fontWeight: "900",
    marginBottom: 5,
  },
  uploadHint: {
    color: "#71788E",
    fontSize: 11.5,
    lineHeight: 15,
    fontWeight: "800",
  },
  selectedFileName: {
    width: "100%",
    color: "#101633",
    fontSize: 14,
    fontWeight: "900",
    textAlign: "center",
    marginTop: 9,
  },
  selectedFileMeta: {
    width: "100%",
    color: "#626A84",
    fontSize: 12,
    fontWeight: "800",
    textAlign: "center",
    marginTop: 5,
    marginBottom: 8,
  },
  input: {
    height: 43,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E2E6F1",
    backgroundColor: "#FFFFFF",
    color: "#101633",
    fontSize: 13,
    fontWeight: "700",
    paddingHorizontal: 14,
  },
  inputShell: {
    height: 43,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E8F0",
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 11,
  },
  fieldIconBox: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: "#F1E8FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },
  textAreaIconBox: {
    position: "absolute",
    left: 11,
    top: 12,
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: "#F1E8FF",
    alignItems: "center",
    justifyContent: "center",
  },
  inputField: {
    flex: 1,
    height: "100%",
    color: "#101633",
    fontSize: 12,
    fontWeight: "800",
    padding: 0,
  },
  selectBox: {
    height: 43,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E8F0",
    backgroundColor: "#FFFFFF",
    paddingLeft: 11,
    paddingRight: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  selectLeft: {
    flex: 1,
    minWidth: 0,
    flexDirection: "row",
    alignItems: "center",
  },
  selectPlaceholder: {
    color: "#8D94AA",
    fontSize: 12,
    fontWeight: "800",
  },
  selectValue: {
    color: "#4E5570",
    fontWeight: "800",
  },
  textAreaShell: {
    minHeight: 154,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E2E6F1",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 26,
  },
  stepTwoTextAreaShell: {
    minHeight: 92,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E8F0",
    backgroundColor: "#FFFFFF",
    paddingLeft: 52,
    paddingRight: 48,
    paddingTop: 14,
    paddingBottom: 28,
  },
  stepTwoTextArea: {
    minHeight: 50,
    color: "#101633",
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "800",
    padding: 0,
  },
  textArea: {
    flex: 1,
    minHeight: 108,
    color: "#101633",
    fontSize: 13,
    fontWeight: "700",
    padding: 0,
  },
  characterCount: {
    position: "absolute",
    right: 12,
    bottom: 10,
    color: "#8B91A8",
    fontSize: 12,
    fontWeight: "800",
  },
  addressInput: {
    minHeight: 112,
    color: "#101633",
    fontSize: 13,
    fontWeight: "700",
    paddingBottom: 14,
  },
  aiSummaryBox: {
    minHeight: 64,
    borderRadius: 13,
    backgroundColor: "#FCF8FF",
    borderWidth: 1,
    borderColor: "#EFE3FF",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 11,
    paddingVertical: 9,
    marginTop: 0,
  },
  aiIconBox: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: "#F7E6FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  aiSummaryCopy: {
    flex: 1,
    minWidth: 0,
    paddingRight: 8,
  },
  aiTitle: {
    color: "#101633",
    fontSize: 12.5,
    fontWeight: "900",
    marginBottom: 4,
  },
  aiText: {
    color: "#697087",
    fontSize: 11,
    lineHeight: 15,
    fontWeight: "700",
  },
  generateButton: {
    minWidth: 70,
    height: 32,
    borderRadius: 9,
    backgroundColor: "#744BFF",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  generateText: {
    color: "#FFFFFF",
    fontSize: 11.5,
    fontWeight: "900",
  },
  stepOneFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: 14,
  },
  nextButton: {
    width: 132,
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#A338FF",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.22,
    shadowRadius: 16,
    elevation: 9,
  },
  nextGradient: {
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 18,
  },
  footerBlock: {
    marginTop: 18,
  },
  footerButtonsRow: {
    flexDirection: "row",
    gap: 14,
  },
  backButton: {
    flex: 1,
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#D7DBE8",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#2B3153",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 3,
  },
  backText: {
    color: "#744BFF",
    fontSize: 15,
    fontWeight: "900",
  },
  footerPrimaryButton: {
    flex: 1,
    borderRadius: 10,
    overflow: "hidden",
    shadowColor: "#A338FF",
    shadowOffset: { width: 0, height: 11 },
    shadowOpacity: 0.18,
    shadowRadius: 15,
    elevation: 7,
  },
  footerPrimaryGradient: {
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  nextText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
  },
});

export default CompanyProfileScreen;
