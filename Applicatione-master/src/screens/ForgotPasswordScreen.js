import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Animated,
  useWindowDimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Mail, ArrowLeft, User } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { spacingForWidth } from '../utils/responsive';

const ForgotPasswordScreen = ({ navigation }) => {
  const { width } = useWindowDimensions();
  const { compact } = spacingForWidth(width);
  const horizontalPadding = compact ? 20 : 25;
  const [identifier, setIdentifier] = useState('');

  // Animation for background blobs
  const blob1Anim = useRef(new Animated.Value(0)).current;
  const blob2Anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const createAnimation = (anim, duration) => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: 1,
            duration: duration,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: duration,
            useNativeDriver: true,
          }),
        ])
      );
    };

    createAnimation(blob1Anim, 4000).start();
    createAnimation(blob2Anim, 6000).start();
  }, []);

  const blob1Style = {
    transform: [
      {
        translateX: blob1Anim.interpolate({
          inputRange: [0, 1],
          outputRange: [-20, 20],
        }),
      },
      {
        translateY: blob1Anim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 30],
        }),
      },
    ],
  };

  const blob2Style = {
    transform: [
      {
        translateX: blob2Anim.interpolate({
          inputRange: [0, 1],
          outputRange: [30, -30],
        }),
      },
      {
        translateY: blob2Anim.interpolate({
          inputRange: [0, 1],
          outputRange: [20, -20],
        }),
      },
    ],
  };

  const handleSubmit = () => {
    if (!identifier.trim()) {
      Alert.alert('Error', 'Please enter your username or email address.');
      return;
    }
    
    // In a real app, you would call an API here
    Alert.alert(
      'Reset Link Sent',
      `If an account exists for "${identifier}", you will receive an email with reset instructions shortly.`,
      [{ text: 'OK', onPress: () => navigation.goBack() }]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Mesh Background */}
      <View style={StyleSheet.absoluteFill}>
        <LinearGradient
          colors={['#FFF7ED', '#F0FDF4']}
          style={StyleSheet.absoluteFill}
        />
        <Animated.View style={[styles.blob, styles.blob1, blob1Style]}>
          <LinearGradient colors={['#FFEDD5', '#FED7AA']} style={styles.blobInner} />
        </Animated.View>
        <Animated.View style={[styles.blob, styles.blob2, blob2Style]}>
          <LinearGradient colors={['#DCFCE7', '#BBF7D0']} style={styles.blobInner} />
        </Animated.View>
      </View>

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()} 
            style={styles.backButton}
          >
            <ArrowLeft size={24} color="#000" />
          </TouchableOpacity>
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={[styles.content, { paddingHorizontal: horizontalPadding }, compact && styles.contentCompact]}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.textContainer}>
              <Text style={[styles.title, compact && styles.titleCompact]}>Forgot Password?</Text>
              <Text style={[styles.subtitle, compact && styles.subtitleCompact]}>
                Don't worry! It happens. Please enter the username or email address associated with your account.
              </Text>
            </View>

            <View style={styles.form}>
              <View style={styles.inputWrapper}>
                <User size={18} color="#999" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Username or Email"
                  placeholderTextColor="#999"
                  value={identifier}
                  onChangeText={setIdentifier}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleSubmit}
                style={styles.submitButtonContainer}
              >
                <LinearGradient
                  colors={['#FF8C00', '#008000']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.submitButton}
                >
                  <Text style={styles.submitButtonText}>Submit</Text>
                </LinearGradient>
              </TouchableOpacity>

              <View style={styles.footer}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                  <Text style={styles.footerText}>
                    Remember your password? <Text style={styles.loginLink}>Log In</Text>
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  blob: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    opacity: 0.5,
  },
  blobInner: {
    flex: 1,
    borderRadius: 150,
  },
  blob1: {
    top: -50,
    left: -50,
  },
  blob2: {
    bottom: 100,
    right: -50,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginTop: Platform.OS === 'android' ? 25 : 0,
  },
  backButton: {
    padding: 5,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingTop: 40,
    paddingBottom: 30,
  },
  contentCompact: {
    paddingTop: 20,
  },
  textContainer: {
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  titleCompact: {
    fontSize: 24,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
  },
  subtitleCompact: {
    fontSize: 14,
    lineHeight: 20,
  },
  form: {
    width: '100%',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(248, 249, 250, 0.8)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    paddingHorizontal: 15,
    height: 56,
    marginBottom: 25,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  submitButtonContainer: {
    width: '100%',
  },
  submitButton: {
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#666',
  },
  loginLink: {
    color: '#008000',
    fontWeight: 'bold',
  },
});

export default ForgotPasswordScreen;
