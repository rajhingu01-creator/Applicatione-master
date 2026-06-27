import React from "react";
import {
  Alert,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar as RNStatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import {
  Bell,
  Briefcase,
  HelpCircle,
  Info,
  Lock,
  LogOut,
  Settings,
  Shield,
  User,
  Users,
} from "lucide-react-native";
import EmployerBottomNav from "../components/EmployerBottomNav";

const settingsSections = [
  {
    title: "Company",
    items: [
      { label: "Company Profile", Icon: User, route: "EmployerCompanyProfile" },
      { label: "Team Members", Icon: Users, route: "EmployerTeamMembers" },
      {
        label: "Subscription & Billing",
        Icon: Shield,
        route: "EmployerSubscriptionBilling",
      },
    ],
  },
  {
    title: "Hiring",
    items: [
      {
        label: "Job Preferences",
        Icon: Briefcase,
        route: "EmployerJobPreferences",
      },
      {
        label: "Application Settings",
        Icon: Settings,
        route: "EmployerApplicationSettings",
      },
    ],
  },
  {
    title: "Account",
    items: [
      {
        label: "Notification Settings",
        Icon: Bell,
        route: "EmployerNotificationSettings",
      },
      {
        label: "Change Password",
        Icon: Lock,
        route: "EmployerChangePassword",
      },
      {
        label: "Security & Privacy",
        Icon: Shield,
        route: "EmployerSecurityPrivacy",
      },
    ],
  },
  {
    title: "Support",
    items: [
      {
        label: "Help & Support",
        Icon: HelpCircle,
        route: "EmployerHelpSupport",
      },
      { label: "About Connectly", Icon: Info, route: "About" },
    ],
  },
];

const EmployerSettingsScreen = ({ navigation }) => {
  const { width } = useWindowDimensions();
  const topInset =
    Platform.OS === "android" ? (RNStatusBar.currentHeight ?? 0) : 0;
  const bottomInset = Platform.OS === "android" ? 6 : 8;
  const cardWidth = Math.min(width - 28, 390);

  const openSetting = (item) => {
    if (item.route) {
      navigation.navigate(item.route);
      return;
    }

    Alert.alert(item.label, `${item.label} section is coming soon.`);
  };

  const logout = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: topInset + 18, paddingBottom: bottomInset + 132 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.brandRow}>
          <LinearGradient
            colors={["#8A47FF", "#FF4DCE"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.logoMark}
          >
            <Text style={styles.logoText}>∞</Text>
          </LinearGradient>
          <Text style={styles.brandName}>Connectly</Text>
        </View>

        <View style={[styles.card, { width: cardWidth }]}>
          {settingsSections.map((section) => (
            <View key={section.title} style={styles.sectionBlock}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              <View style={styles.sectionItems}>
                {section.items.map(({ label, Icon, route }) => (
                  <TouchableOpacity
                    key={label}
                    activeOpacity={0.78}
                    style={styles.settingRow}
                    onPress={() => openSetting({ label, route })}
                  >
                    <Icon size={17} color="#7A7F98" strokeWidth={2.25} />
                    <Text numberOfLines={1} style={styles.settingLabel}>
                      {label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}

          <TouchableOpacity
            activeOpacity={0.84}
            style={styles.logoutButton}
            onPress={logout}
          >
            <LogOut size={17} color="#FF5A5F" strokeWidth={2.3} />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <EmployerBottomNav
        navigation={navigation}
        activeRoute="More"
        bottomOffset={bottomInset}
      />
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
    paddingHorizontal: 14,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  logoMark: {
    width: 34,
    height: 20,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 7,
  },
  logoText: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "900",
    lineHeight: 22,
  },
  brandName: {
    color: "#262145",
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: -0.2,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    paddingHorizontal: 24,
    paddingTop: 22,
    paddingBottom: 18,
    shadowColor: "#8E86A8",
    shadowOpacity: 0.12,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 9 },
    elevation: 6,
  },
  sectionBlock: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: "#8A47FF",
    fontSize: 12.5,
    fontWeight: "900",
    marginBottom: 12,
  },
  sectionItems: {
    gap: 16,
  },
  settingRow: {
    minHeight: 24,
    flexDirection: "row",
    alignItems: "center",
  },
  settingLabel: {
    flex: 1,
    color: "#565D78",
    fontSize: 12.5,
    fontWeight: "900",
    marginLeft: 14,
  },
  logoutButton: {
    height: 54,
    borderRadius: 12,
    backgroundColor: "#FFF4FA",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    marginTop: 2,
  },
  logoutText: {
    color: "#FF5A5F",
    fontSize: 12.5,
    fontWeight: "900",
    marginLeft: 12,
  },
});

export default EmployerSettingsScreen;
