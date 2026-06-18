import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import HomeScreen from './src/screens/HomeScreen';
import ShareProfileScreen from './src/screens/ShareProfileScreen';
import ChatListScreen from './src/screens/ChatListScreen';
import IndividualChatScreen from './src/screens/IndividualChatScreen';
import FollowersScreen from './src/screens/FollowersScreen';
import ReelsScreen from './src/screens/ReelsScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import SecurityScreen from './src/screens/SecurityScreen';
import AccountSettingsScreen from './src/screens/AccountSettingsScreen';
import ChangePasswordScreen from './src/screens/ChangePasswordScreen';
import LoginHistoryScreen from './src/screens/LoginHistoryScreen';
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';
import AboutScreen from './src/screens/AboutScreen';
import AccountVisibilityScreen from './src/screens/AccountVisibilityScreen';
import BlockedUsersScreen from './src/screens/BlockedUsersScreen';
import SnoozedAccountsScreen from './src/screens/SnoozedAccountsScreen';
import SavedReelsScreen from './src/screens/SavedReelsScreen';
import NotificationSettingsScreen from './src/screens/NotificationSettingsScreen';
import NotificationDetailScreen from './src/screens/NotificationDetailScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: '#fff' }
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="ShareProfile" component={ShareProfileScreen} />
        <Stack.Screen name="ChatList" component={ChatListScreen} />
        <Stack.Screen name="IndividualChat" component={IndividualChatScreen} />
        <Stack.Screen name="Followers" component={FollowersScreen} />
        <Stack.Screen name="Reels" component={ReelsScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="AccountSettings" component={AccountSettingsScreen} />
        <Stack.Screen name="Security" component={SecurityScreen} />
        <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
        <Stack.Screen name="LoginHistory" component={LoginHistoryScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="About" component={AboutScreen} />
        <Stack.Screen name="AccountVisibility" component={AccountVisibilityScreen} />
        <Stack.Screen name="BlockedUsers" component={BlockedUsersScreen} />
        <Stack.Screen name="SnoozedAccounts" component={SnoozedAccountsScreen} />
        <Stack.Screen name="SavedReels" component={SavedReelsScreen} />
        <Stack.Screen name="NotificationSettings" component={NotificationSettingsScreen} />
        <Stack.Screen name="NotificationDetail" component={NotificationDetailScreen} />
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
