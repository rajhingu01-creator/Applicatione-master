import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Mail, Lock, Eye, EyeOff, ChevronDown, Globe } from 'lucide-react-native';
import { FontAwesome, AntDesign, Entypo } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { API_URL } from '../utils/api';
import { clamp, spacingForWidth } from '../utils/responsive';

const LoginScreen = ({ navigation }) => {
  const { width, height } = useWindowDimensions();
  const { screen, compact } = spacingForWidth(width);
  const headerHeight = clamp(height * 0.34, compact ? 210 : 230, 310);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    // Demo mode - skip API calls
    if (true) {
      alert('Demo login successful!');
      navigation.navigate('Home');
      return;
    }

    if (!email || !password) {
      alert('Please fill all fields');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          emailOrUsername: email, // Backend accepts emailOrUsername
          password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Save token and navigate
        if (data.data && data.data.token) {
          console.log('Login Token saved:', data.data.token);
          await AsyncStorage.setItem('userToken', data.data.token);
        }
        alert('Login successful!');
        navigation.navigate('Home');
      } else {
        alert(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Network error. Make sure backend is running and IP is correct.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <ImageBackground
        source={require('../../assets/login.jpeg')}
        style={[styles.headerBackground, { height: headerHeight }]}
      >
        <SafeAreaView style={[styles.headerContent, { paddingHorizontal: screen }]}>
          <View style={styles.topBar}>
            <View style={styles.logoContainer}>
              <View style={styles.indiaFlag}>
                <View style={[styles.flagStrip, { backgroundColor: '#FF9933' }]} />
                <View style={[styles.flagStrip, { backgroundColor: '#FFFFFF' }]} />
                <View style={[styles.flagStrip, { backgroundColor: '#128807' }]} />
              </View>
              <Text style={styles.logoText}>changis</Text>
            </View>
            {/* <TouchableOpacity style={styles.languageSelector}>
              <Globe size={16} color="white" />
              <Text style={styles.languageText}>English</Text>
              <ChevronDown size={16} color="white" />
            </TouchableOpacity> */}
          </View>

          <View style={styles.heroSection}>
            <Text style={styles.heroTitle}>Discover.{"\n"}Connect.{"\n"}Create Impact.</Text>
            <Text style={styles.heroSubtitle}>Join a community that shares,{"\n"}explores and inspires.</Text>
          </View>
        </SafeAreaView>
      </ImageBackground>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={[styles.formContainer, { paddingHorizontal: screen }]}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.welcomeText}>Welcome back!</Text>
            <Text style={styles.subWelcomeText}>Log in to continue your journey on Changis.</Text>

            <View style={styles.inputWrapper}>
              <Mail size={18} color="#999" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Email address or username"
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputWrapper}>
              <Lock size={18} color="#999" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#999"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                {showPassword ? (
                  <EyeOff size={18} color="#999" />
                ) : (
                  <Eye size={18} color="#999" />
                )}
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              style={styles.forgotPassword}
              onPress={() => navigation.navigate('ForgotPassword')}
            >
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              activeOpacity={0.8}
              onPress={handleLogin}
              disabled={isLoading}
            >
              <LinearGradient
                colors={['#FF8C00', '#008000']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.loginButton, isLoading && { opacity: 0.7 }]}
              >
                <Text style={styles.loginButtonText}>
                  {isLoading ? 'Logging In...' : 'Log In'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.separatorWrapper}>
              <View style={styles.separatorLine} />
              <Text style={styles.separatorText}>or continue with</Text>
              <View style={styles.separatorLine} />
            </View>

            <View style={styles.socialButtons}>
              <TouchableOpacity style={styles.socialButton}>
                <View style={styles.socialButtonContent}>
                  <FontAwesome name="google" size={18} color="#DB4437" style={styles.socialIcon} />
                  <Text style={styles.socialButtonText}>Continue with Google</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton}>
                <View style={styles.socialButtonContent}>
                  <FontAwesome name="apple" size={18} color="#000" style={styles.socialIcon} />
                  <Text style={styles.socialButtonText}>Continue with Apple</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton}>
                <View style={styles.socialButtonContent}>
                  <FontAwesome name="facebook" size={18} color="#4267B2" style={styles.socialIcon} />
                  <Text style={styles.socialButtonText}>Continue with Facebook</Text>
                </View>
              </TouchableOpacity>
            </View>

            <View style={styles.bottomSection}>
              <View style={styles.signupWrapper}>
                <Text style={styles.noAccountText}>Don't have an account? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                  <Text style={styles.signupText}>Sign up</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.footerText}>
                By continuing, you agree to our{' '}
                <Text style={styles.linkText}>Terms of Service</Text>{"\n"}
                and <Text style={styles.linkText}>Privacy Policy</Text>.
              </Text>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerBackground: {
    width: '100%',
  },
  headerContent: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Platform.OS === 'android' ? 30 : 10,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  indiaFlag: {
    width: 20,
    height: 14,
    borderRadius: 2,
    overflow: 'hidden',
    marginRight: 6,
  },
  flagStrip: {
    flex: 1,
  },
  logoText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  languageSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  languageText: {
    color: 'white',
    marginHorizontal: 4,
    fontSize: 12,
  },
  heroSection: {
    marginTop: 20,
  },
  heroTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    lineHeight: 30,
  },
  heroSubtitle: {
    color: 'white',
    fontSize: 14,
    marginTop: 10,
    lineHeight: 18,
    opacity: 0.9,
  },
  keyboardView: {
    flex: 1,
    marginTop: -25,
  },
  formContainer: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingHorizontal: 20,
  },
  scrollContent: {
    paddingTop: 20,
    paddingBottom: 30,
    flexGrow: 1,
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
  },
  subWelcomeText: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
    marginBottom: 15,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 12,
    height: 48,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#000',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 15,
  },
  forgotPasswordText: {
    color: '#007AFF',
    fontSize: 13,
    fontWeight: '600',
  },
  loginButton: {
    height: 48,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  separatorWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  separatorText: {
    marginHorizontal: 8,
    color: '#999',
    fontSize: 13,
  },
  socialButtons: {
    gap: 10,
    marginBottom: 15,
  },
  socialButton: {
    height: 42,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  socialButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  socialIcon: {
    marginRight: 10,
  },
  socialButtonText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  signupWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 15,
  },
  noAccountText: {
    color: '#666',
    fontSize: 14,
  },
  signupText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  bottomSection: {
    marginTop: 10,
  },
  footerText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 11,
    lineHeight: 16,
  },
  linkText: {
    color: '#007AFF',
    fontWeight: '500',
  },
});

export default LoginScreen;
