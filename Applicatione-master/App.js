import "react-native-gesture-handler";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActivityIndicator, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { StatusBar } from "expo-status-bar";
import { useScreenshotProtection } from "./src/utils/screenshotProtection";
import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import HomeScreen from "./src/screens/HomeScreen";
import ShareProfileScreen from "./src/screens/ShareProfileScreen";
import JobScreen from "./src/screens/JobScreen";
import JobPortalScreen from "./src/screens/JobPortalScreen";
import JobPortalLoginScreen from "./src/screens/JobPortalLoginScreen";
import JobPortalRegisterScreen from "./src/screens/JobPortalRegisterScreen";
import JobPortalOtpScreen from "./src/screens/JobPortalOtpScreen";
import JobPortalSkillsScreen from "./src/screens/JobPortalSkillsScreen";
import JobPortalExperienceScreen from "./src/screens/JobPortalExperienceScreen";
import JobPortalPreferencesScreen from "./src/screens/JobPortalPreferencesScreen";
import JobPortalHomeScreen from "./src/screens/JobPortalHomeScreen";
import JobPortalJobsScreen from "./src/screens/JobPortalJobsScreen";
import JobPortalJobDetailsScreen from "./src/screens/JobPortalJobDetailsScreen";
import JobPortalApplyScreen from "./src/screens/JobPortalApplyScreen";
import JobPortalApplicationsScreen from "./src/screens/JobPortalApplicationsScreen";
import JobPortalApplicationDetailsScreen from "./src/screens/JobPortalApplicationDetailsScreen";
import JobPortalMessagesScreen from "./src/screens/JobPortalMessagesScreen";
import JobPortalProfileScreen from "./src/screens/JobPortalProfileScreen";
import JobPortalChatScreen from "./src/screens/JobPortalChatScreen";
import JobPortalSettingsScreen from "./src/screens/JobPortalSettingsScreen";
import JobPortalEditProfileScreen from "./src/screens/JobPortalEditProfileScreen";
import JobPortalChangePasswordScreen from "./src/screens/JobPortalChangePasswordScreen";
import JobPortalPrivacySettingsScreen from "./src/screens/JobPortalPrivacySettingsScreen";
import JobPortalNotificationSettingsScreen from "./src/screens/JobPortalNotificationSettingsScreen";
import JobPortalJobPreferencesScreen from "./src/screens/JobPortalJobPreferencesScreen";
import JobPortalBlockedCompaniesScreen from "./src/screens/JobPortalBlockedCompaniesScreen";
import JobPortalHelpSupportScreen from "./src/screens/JobPortalHelpSupportScreen";
import JobPortalSubscriptionScreen from "./src/screens/JobPortalSubscriptionScreen";
import HireEmployeesScreen from "./src/screens/HireEmployeesScreen";
import CompanyRegisterScreen from "./src/screens/CompanyRegisterScreen";
import OtpVerificationScreen from "./src/screens/OtpVerificationScreen";
import CompanyProfileScreen from "./src/screens/CompanyProfileScreen";
import EmployerDashboardScreen from "./src/screens/EmployerDashboardScreen";
import EmployerJobsScreen from "./src/screens/EmployerJobsScreen";
import EmployerCandidatesScreen from "./src/screens/EmployerCandidatesScreen";
import EmployerCandidateProfileScreen from "./src/screens/EmployerCandidateProfileScreen";
import EmployerCandidateChatScreen from "./src/screens/EmployerCandidateChatScreen";
import EmployerSettingsScreen from "./src/screens/EmployerSettingsScreen";
import EmployerCompanyProfileScreen from "./src/screens/EmployerCompanyProfileScreen";
import EmployerTeamMembersScreen from "./src/screens/EmployerTeamMembersScreen";
import EmployerSubscriptionBillingScreen from "./src/screens/EmployerSubscriptionBillingScreen";
import EmployerJobPreferencesScreen from "./src/screens/EmployerJobPreferencesScreen";
import EmployerApplicationSettingsScreen from "./src/screens/EmployerApplicationSettingsScreen";
import EmployerNotificationSettingsScreen from "./src/screens/EmployerNotificationSettingsScreen";
import EmployerChangePasswordScreen from "./src/screens/EmployerChangePasswordScreen";
import EmployerSecurityPrivacyScreen from "./src/screens/EmployerSecurityPrivacyScreen";
import EmployerHelpSupportScreen from "./src/screens/EmployerHelpSupportScreen";
import EmployerAboutAccountScreen from "./src/screens/EmployerAboutAccountScreen";
import EmployerPrivacyPolicyScreen from "./src/screens/EmployerPrivacyPolicyScreen";
import EmployerTermsOfUseScreen from "./src/screens/EmployerTermsOfUseScreen";
import PostJobScreen from "./src/screens/PostJobScreen";
import JobDetailsScreen from "./src/screens/JobDetailsScreen";
import ChatListScreen from "./src/screens/ChatListScreen";
import IndividualChatScreen from "./src/screens/IndividualChatScreen";
import UserSearchScreen from "./src/screens/UserSearchScreen";
import UserProfileScreen from "./src/screens/UserProfileScreen";
import FollowersScreen from "./src/screens/FollowersScreen";
import ReelsScreen from "./src/screens/ReelsScreen";
import SettingsScreen from "./src/screens/SettingsScreen";
import SecurityScreen from "./src/screens/SecurityScreen";
import AccountSettingsScreen from "./src/screens/AccountSettingsScreen";
import ChangePasswordScreen from "./src/screens/ChangePasswordScreen";
import LoginHistoryScreen from "./src/screens/LoginHistoryScreen";
import ForgotPasswordScreen from "./src/screens/ForgotPasswordScreen";
import AboutScreen from "./src/screens/AboutScreen";
import AccountVisibilityScreen from "./src/screens/AccountVisibilityScreen";
import BlockedUsersScreen from "./src/screens/BlockedUsersScreen";
import SnoozedAccountsScreen from "./src/screens/SnoozedAccountsScreen";
import SavedReelsScreen from "./src/screens/SavedReelsScreen";
import NotificationSettingsScreen from "./src/screens/NotificationSettingsScreen";
import NotificationDetailScreen from "./src/screens/NotificationDetailScreen";

const Stack = createStackNavigator();

export default function App() {
  const [initialRouteName, setInitialRouteName] = useState(null);

  // Enable screenshot protection app-wide
  useScreenshotProtection(true);

  useEffect(() => {
    const bootstrapAuth = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        setInitialRouteName(token ? "Home" : "Login");
      } catch (error) {
        console.error("Auth bootstrap error:", error);
        setInitialRouteName("Login");
      }
    };

    bootstrapAuth();
  }, []);

  if (!initialRouteName) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#fff",
        }}
      >
        <ActivityIndicator size="large" color="#008000" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={initialRouteName}
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: "#fff" },
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="ShareProfile" component={ShareProfileScreen} />
        <Stack.Screen name="Job" component={JobScreen} />
        <Stack.Screen name="JobPortal" component={JobPortalScreen} />
        <Stack.Screen name="JobPortalLogin" component={JobPortalLoginScreen} />
        <Stack.Screen
          name="JobPortalRegister"
          component={JobPortalRegisterScreen}
        />
        <Stack.Screen name="JobPortalOtp" component={JobPortalOtpScreen} />
        <Stack.Screen
          name="JobPortalSkills"
          component={JobPortalSkillsScreen}
        />
        <Stack.Screen
          name="JobPortalExperience"
          component={JobPortalExperienceScreen}
        />
        <Stack.Screen
          name="JobPortalPreferences"
          component={JobPortalPreferencesScreen}
        />
        <Stack.Screen name="JobPortalHome" component={JobPortalHomeScreen} />
        <Stack.Screen name="JobPortalJobs" component={JobPortalJobsScreen} />
        <Stack.Screen
          name="JobPortalProfile"
          component={JobPortalProfileScreen}
        />
        <Stack.Screen name="JobPortalChat" component={JobPortalChatScreen} />
        <Stack.Screen
          name="JobPortalSettings"
          component={JobPortalSettingsScreen}
        />
        <Stack.Screen
          name="JobPortalEditProfile"
          component={JobPortalEditProfileScreen}
        />
        <Stack.Screen
          name="JobPortalChangePassword"
          component={JobPortalChangePasswordScreen}
        />
        <Stack.Screen
          name="JobPortalPrivacySettings"
          component={JobPortalPrivacySettingsScreen}
        />
        <Stack.Screen
          name="JobPortalNotificationSettings"
          component={JobPortalNotificationSettingsScreen}
        />
        <Stack.Screen
          name="JobPortalJobPreferences"
          component={JobPortalJobPreferencesScreen}
        />
        <Stack.Screen
          name="JobPortalBlockedCompanies"
          component={JobPortalBlockedCompaniesScreen}
        />
        <Stack.Screen
          name="JobPortalHelpSupport"
          component={JobPortalHelpSupportScreen}
        />
        <Stack.Screen
          name="JobPortalSubscription"
          component={JobPortalSubscriptionScreen}
        />
        <Stack.Screen
          name="JobPortalJobDetails"
          component={JobPortalJobDetailsScreen}
        />
        <Stack.Screen name="JobPortalApply" component={JobPortalApplyScreen} />
        <Stack.Screen
          name="JobPortalApplications"
          component={JobPortalApplicationsScreen}
        />
        <Stack.Screen
          name="JobPortalApplicationDetails"
          component={JobPortalApplicationDetailsScreen}
        />
        <Stack.Screen
          name="JobPortalMessages"
          component={JobPortalMessagesScreen}
        />
        <Stack.Screen name="HireEmployees" component={HireEmployeesScreen} />
        <Stack.Screen
          name="CompanyRegister"
          component={CompanyRegisterScreen}
        />
        <Stack.Screen
          name="OtpVerification"
          component={OtpVerificationScreen}
        />
        <Stack.Screen name="CompanyProfile" component={CompanyProfileScreen} />
        <Stack.Screen
          name="EmployerDashboard"
          component={EmployerDashboardScreen}
        />
        <Stack.Screen name="EmployerJobs" component={EmployerJobsScreen} />
        <Stack.Screen
          name="EmployerCandidates"
          component={EmployerCandidatesScreen}
        />
        <Stack.Screen
          name="EmployerCandidateProfile"
          component={EmployerCandidateProfileScreen}
        />
        <Stack.Screen
          name="EmployerCandidateChat"
          component={EmployerCandidateChatScreen}
        />
        <Stack.Screen
          name="EmployerSettings"
          component={EmployerSettingsScreen}
        />
        <Stack.Screen
          name="EmployerCompanyProfile"
          component={EmployerCompanyProfileScreen}
        />
        <Stack.Screen
          name="EmployerTeamMembers"
          component={EmployerTeamMembersScreen}
        />
        <Stack.Screen
          name="EmployerSubscriptionBilling"
          component={EmployerSubscriptionBillingScreen}
        />
        <Stack.Screen
          name="EmployerJobPreferences"
          component={EmployerJobPreferencesScreen}
        />
        <Stack.Screen
          name="EmployerApplicationSettings"
          component={EmployerApplicationSettingsScreen}
        />
        <Stack.Screen
          name="EmployerNotificationSettings"
          component={EmployerNotificationSettingsScreen}
        />
        <Stack.Screen
          name="EmployerChangePassword"
          component={EmployerChangePasswordScreen}
        />
        <Stack.Screen
          name="EmployerSecurityPrivacy"
          component={EmployerSecurityPrivacyScreen}
        />
        <Stack.Screen
          name="EmployerHelpSupport"
          component={EmployerHelpSupportScreen}
        />
        <Stack.Screen
          name="EmployerAboutAccount"
          component={EmployerAboutAccountScreen}
        />
        <Stack.Screen
          name="EmployerPrivacyPolicy"
          component={EmployerPrivacyPolicyScreen}
        />
        <Stack.Screen
          name="EmployerTermsOfUse"
          component={EmployerTermsOfUseScreen}
        />
        <Stack.Screen name="PostJob" component={PostJobScreen} />
        <Stack.Screen name="JobDetails" component={JobDetailsScreen} />
        <Stack.Screen name="ChatList" component={ChatListScreen} />
        <Stack.Screen name="IndividualChat" component={IndividualChatScreen} />
        <Stack.Screen name="UserSearch" component={UserSearchScreen} />
        <Stack.Screen name="UserProfile" component={UserProfileScreen} />
        <Stack.Screen name="Followers" component={FollowersScreen} />
        <Stack.Screen name="Reels" component={ReelsScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen
          name="AccountSettings"
          component={AccountSettingsScreen}
        />
        <Stack.Screen name="Security" component={SecurityScreen} />
        <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
        <Stack.Screen name="LoginHistory" component={LoginHistoryScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="About" component={AboutScreen} />
        <Stack.Screen
          name="AccountVisibility"
          component={AccountVisibilityScreen}
        />
        <Stack.Screen name="BlockedUsers" component={BlockedUsersScreen} />
        <Stack.Screen
          name="SnoozedAccounts"
          component={SnoozedAccountsScreen}
        />
        <Stack.Screen name="SavedReels" component={SavedReelsScreen} />
        <Stack.Screen
          name="NotificationSettings"
          component={NotificationSettingsScreen}
        />
        <Stack.Screen
          name="NotificationDetail"
          component={NotificationDetailScreen}
        />
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
