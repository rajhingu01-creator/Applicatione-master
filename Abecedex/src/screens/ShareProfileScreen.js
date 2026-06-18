import React, { useRef, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Animated,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  X, 
  Share2, 
  Copy, 
  Download, 
  QrCode,
  Palette
} from 'lucide-react-native';
import QRCode from 'react-native-qrcode-svg';
import ViewShot from 'react-native-view-shot';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
// import * as MediaLibrary from 'expo-media-library';
import * as Clipboard from 'expo-clipboard';
import { API_URL } from '../utils/api';
import { clamp, spacingForWidth } from '../utils/responsive';

const ShareProfileScreen = ({ navigation }) => {
  const { width } = useWindowDimensions();
  const { compact } = spacingForWidth(width);
  const headerPadding = compact ? 16 : 20;
  const actionsPadding = compact ? 20 : 25;
  const qrSize = clamp(width * 0.56, 170, 250);
  const viewShotRef = useRef();
  const blob1Anim = useRef(new Animated.Value(0)).current;
  const blob2Anim = useRef(new Animated.Value(0)).current;
  
  const [userData, setUserData] = useState({
    name: 'User',
    username: 'username'
  });

  useEffect(() => {
    fetchUserData();
    
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

  const fetchUserData = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) return;

      const response = await fetch(`${API_URL}/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success && data.data && data.data.user) {
        setUserData({
          name: data.data.user.name,
          username: data.data.user.username
        });
      }
    } catch (error) {
      console.error('Error fetching user data for share:', error);
    }
  };
  
  const username = userData.username.startsWith('@') ? userData.username : `@${userData.username}`;
  const profileUrl = `exp://192.168.1.3:8082/--/profile/${userData.username}`;

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

  const handleCopyLink = async () => {
    await Clipboard.setStringAsync(profileUrl);
    Alert.alert("Copied", "Profile link copied to clipboard!");
  };

  const handleDownload = async () => {
    try {
      const uri = await viewShotRef.current.capture();
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri);
      }
    } catch (error) {
      Alert.alert("Error", "Could not process QR Code.");
    }
  };

  const handleShareProfile = async () => {
    try {
      const uri = await viewShotRef.current.capture();
      await Sharing.shareAsync(uri);
    } catch (error) {
      Alert.alert("Error", "Could not share profile.");
    }
  };

  return (
    <View style={styles.container}>
      {/* Mesh Background */}
      <View style={StyleSheet.absoluteFill}>
        <LinearGradient
          colors={['#FFF7ED', '#F0FDF4']} // Very light orange to light green
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
        {/* Custom Header */}
        <View style={[styles.header, { paddingHorizontal: headerPadding }]}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerCircleButton}>
            <X size={24} color="#333" />
          </TouchableOpacity>
          
          <View style={styles.headerTitleContainer}>
            <Palette size={18} color="#008000" />
            <Text style={styles.headerTitle}>Customize</Text>
          </View>

          <TouchableOpacity style={styles.headerCircleButton}>
            <QrCode size={22} color="#333" />
          </TouchableOpacity>
        </View>

        {/* Floating QR Card */}
        <View style={styles.cardContainer}>
          <ViewShot ref={viewShotRef} options={{ format: "png", quality: 1.0 }}>
            <View style={styles.qrCard}>
              <LinearGradient
                colors={['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.7)']}
                style={styles.cardGradient}
              >
                <View style={styles.qrInnerContainer}>
                  <QRCode
                    value={profileUrl}
                    size={qrSize}
                    color="#008000"
                    backgroundColor="transparent"
                    logo={require('../../assets/icon.png')}
                    logoSize={50}
                    logoBackgroundColor="white"
                    logoBorderRadius={12}
                  />
                </View>
                <View style={styles.userInfo}>
                  <Text style={styles.usernameText}>{username}</Text>
                  <Text style={styles.subText}>Scan to follow</Text>
                </View>
              </LinearGradient>
            </View>
          </ViewShot>
        </View>

        {/* Stylized Action Buttons */}
        <View style={[styles.actionsContainer, { paddingHorizontal: actionsPadding }]}>
          <TouchableOpacity style={styles.mainActionButton} onPress={handleShareProfile}>
            <LinearGradient
              colors={['#FF8C00', '#008000']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.mainActionGradient}
            >
              <Share2 size={20} color="white" />
              <Text style={styles.mainActionText}>Share Profile</Text>
            </LinearGradient>
          </TouchableOpacity>

          <View style={[styles.secondaryActions, compact && styles.secondaryActionsCompact]}>
            <TouchableOpacity style={styles.secondaryButton} onPress={handleCopyLink}>
              <Copy size={20} color="#444" />
              <Text style={styles.secondaryText}>Copy Link</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryButton} onPress={handleDownload}>
              <Download size={20} color="#444" />
              <Text style={styles.secondaryText}>Download</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  blob: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    opacity: 0.6,
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
    bottom: 50,
    right: -50,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 30 : 10,
  },
  headerCircleButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    gap: 8,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrCard: {
    width: '85%',
    maxWidth: 360,
    borderRadius: 30,
    overflow: 'hidden',
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.15,
    shadowRadius: 25,
    backgroundColor: 'white',
  },
  cardGradient: {
    padding: 30,
    alignItems: 'center',
  },
  qrInnerContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  userInfo: {
    marginTop: 25,
    alignItems: 'center',
  },
  usernameText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111',
    letterSpacing: 1,
  },
  subText: {
    fontSize: 13,
    color: '#666',
    marginTop: 5,
  },
  actionsContainer: {
    paddingHorizontal: 25,
    paddingBottom: 40,
    gap: 15,
  },
  mainActionButton: {
    height: 56,
    borderRadius: 18,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#008000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  mainActionGradient: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  mainActionText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryActions: {
    flexDirection: 'row',
    gap: 12,
  },
  secondaryActionsCompact: {
    gap: 8,
  },
  secondaryButton: {
    flex: 1,
    height: 56,
    backgroundColor: 'white',
    borderRadius: 18,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  secondaryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#444',
  },
});

export default ShareProfileScreen;
