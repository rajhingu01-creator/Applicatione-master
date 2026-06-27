import React, { useEffect, useState } from "react";
import {
  Alert,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar as RNStatusBar,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";
import { ArrowLeft, Shield } from "lucide-react-native";

const SECURITY_SETTINGS_KEY = "@employer_security_privacy";

const EmployerSecurityPrivacyScreen = ({ navigation }) => {
  const { width, height } = useWindowDimensions();
  const topInset =
    Platform.OS === "android" ? (RNStatusBar.currentHeight ?? 0) : 0;
  const cardWidth = Math.min(width - 24, 390);
  const cardHeight = Math.max(Math.min(height - topInset - 24, 700), 580);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadSettings = async () => {
      try {
        const savedSettings = await AsyncStorage.getItem(SECURITY_SETTINGS_KEY);

        if (savedSettings && mounted) {
          const parsedSettings = JSON.parse(savedSettings);
          setTwoFactorEnabled(Boolean(parsedSettings.twoFactorEnabled));
        }
      } catch {
        if (mounted) {
          setTwoFactorEnabled(true);
        }
      }
    };

    loadSettings();

    return () => {
      mounted = false;
    };
  }, []);

  const updateTwoFactor = async (value) => {
    setTwoFactorEnabled(value);

    try {
      await AsyncStorage.setItem(
        SECURITY_SETTINGS_KEY,
        JSON.stringify({ twoFactorEnabled: value }),
      );
    } catch {
      Alert.alert("Unable to Save", "Please try again.");
    }
  };

  const openLoginActivity = () => {
    navigation.navigate("LoginHistory");
  };

  const openActiveDevices = () => {
    Alert.alert("Active Devices", "Active devices screen is coming soon.");
  };

  const logoutAllDevices = () => {
    Alert.alert(
      "Logout All Devices",
      "You will stay logged in on this device. Other sessions will be removed.",
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: topInset + 10, paddingBottom: 18 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.card, { width: cardWidth, minHeight: cardHeight }]}>
          <View style={styles.headerRow}>
            <TouchableOpacity
              activeOpacity={0.75}
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <ArrowLeft size={18} color="#20243A" strokeWidth={2.6} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Security & Privacy</Text>
            <View style={styles.headerSpacer} />
          </View>

          <View style={styles.twoFactorCard}>
            <View style={styles.cardCopy}>
              <Text style={styles.rowTitle}>Two Factor Authentication</Text>
              <Text style={styles.rowDescription}>
                Add extra security to your account
              </Text>
            </View>
            <Switch
              value={twoFactorEnabled}
              onValueChange={updateTwoFactor}
              trackColor={{ false: "#D7D9E3", true: "#5B35F5" }}
              thumbColor="#FFFFFF"
              ios_backgroundColor="#D7D9E3"
              style={styles.switchControl}
            />
          </View>

          <TouchableOpacity
            activeOpacity={0.82}
            style={styles.optionCard}
            onPress={openLoginActivity}
          >
            <View style={styles.cardCopy}>
              <Text style={styles.rowTitle}>Login Activity</Text>
              <Text style={styles.rowDescription}>See all recent login activity.</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.82}
            style={styles.optionCard}
            onPress={openActiveDevices}
          >
            <View style={styles.cardCopy}>
              <Text style={styles.rowTitle}>Active Devices</Text>
              <Text style={styles.rowDescription}>
                Manage devices where you are currently logged in.
              </Text>
            </View>
            <View style={styles.rightMeta}>
              <View style={styles.deviceBadge}>
                <Text style={styles.deviceBadgeText}>3</Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.82}
            style={styles.optionCard}
            onPress={logoutAllDevices}
          >
            <View style={styles.cardCopy}>
              <Text style={styles.logoutTitle}>Logout All Devices</Text>
              <Text style={styles.rowDescription}>
                Logout from all devices except this one.
              </Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          <View style={styles.footerSpacer} />

          <View style={styles.securityNote}>
            <View style={styles.noteIconWrap}>
              <Shield size={25} color="#6A3BFF" strokeWidth={2.3} />
            </View>
            <Text style={styles.noteText}>
              We take your security seriously. Keep your account secure.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F3FF",
  },
  scrollContent: {
    alignItems: "center",
    paddingHorizontal: 12,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 18,
    shadowColor: "#8E86A8",
    shadowOpacity: 0.12,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 9 },
    elevation: 6,
  },
  headerRow: {
    height: 34,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 27,
  },
  backButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#F3F1FA",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    color: "#20243A",
    fontSize: 17,
    fontWeight: "900",
  },
  headerSpacer: {
    width: 30,
  },
  twoFactorCard: {
    minHeight: 74,
    borderRadius: 14,
    backgroundColor: "#F5F0FF",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 18,
  },
  optionCard: {
    minHeight: 78,
    borderWidth: 1,
    borderColor: "#E8E9F1",
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 16,
    shadowColor: "#9197AD",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  cardCopy: {
    flex: 1,
    paddingRight: 12,
  },
  rowTitle: {
    color: "#20243A",
    fontSize: 12.5,
    fontWeight: "900",
    marginBottom: 6,
  },
  logoutTitle: {
    color: "#FF4A58",
    fontSize: 12.5,
    fontWeight: "900",
    marginBottom: 6,
  },
  rowDescription: {
    color: "#70768F",
    fontSize: 11,
    lineHeight: 16,
    fontWeight: "700",
  },
  switchControl: {
    transform: [{ scaleX: 0.82 }, { scaleY: 0.82 }],
  },
  chevron: {
    color: "#A1A6B7",
    fontSize: 24,
    fontWeight: "800",
    marginTop: -2,
  },
  rightMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  deviceBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#ECE5FF",
    alignItems: "center",
    justifyContent: "center",
  },
  deviceBadgeText: {
    color: "#6A3BFF",
    fontSize: 11,
    fontWeight: "900",
  },
  footerSpacer: {
    flex: 1,
    minHeight: 24,
  },
  securityNote: {
    minHeight: 78,
    borderRadius: 14,
    backgroundColor: "#F5F0FF",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  noteIconWrap: {
    width: 43,
    height: 43,
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  noteText: {
    flex: 1,
    color: "#7A7196",
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "900",
  },
});

export default EmployerSecurityPrivacyScreen;
