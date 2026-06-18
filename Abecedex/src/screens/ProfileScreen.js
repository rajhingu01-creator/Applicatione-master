import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Dimensions,
  Platform,
  TextInput,
  Alert,
  Modal,
  Pressable,
} from 'react-native';
import { 
  ArrowLeft, 
  Settings, 
  MapPin, 
  Users, 
  Plus, 
  Camera,
  Grid,
  Play,
  Bookmark,
  Heart,
  UserCheck,
  X,
  Image as ImageIcon,
  Trash2,
  Clapperboard,
  CircleDot,
  Radio,
} from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { API_URL, BASE_URL } from '../utils/api';
import CustomBottomNav from '../components/CustomBottomNav';

const { width } = Dimensions.get('window');

const ProfileScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('Posts');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [showImageOptions, setShowImageOptions] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showFullScreenImg, setShowFullScreenImg] = useState(false);
  const [showCreateOptions, setShowCreateOptions] = useState(false);
  const [showCreatePostModal, setShowCreatePostModal] = useState(false);
  const [postImage, setPostImage] = useState(null);
  const [tempPostImage, setTempPostImage] = useState(null);
  const [showPostPreviewModal, setShowPostPreviewModal] = useState(false);
  const [postCaption, setPostCaption] = useState('');
  const [postHashtags, setPostHashtags] = useState('');
  const [postLocation, setPostLocation] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  
  const createOptions = [
    {
      id: 'new-post',
      name: 'New Post',
      desc: 'Share a new photo or update',
      icon: Plus,
      colors: ['#FF8C00', '#FFB347'],
      bg: '#FFF3E0'
    },
    {
      id: 'go-live',
      name: 'Go Live',
      desc: 'Start a live video stream',
      icon: Radio,
      colors: ['#FF3B30', '#FF6B6B'],
      bg: '#FFF0F0'
    },
    {
      id: 'new-reel',
      name: 'New Reel',
      desc: 'Upload a short video clip',
      icon: Clapperboard,
      colors: ['#008000', '#00C853'],
      bg: '#E8F5E9'
    },
    {
      id: 'story',
      name: 'Story',
      desc: 'Post a short story update',
      icon: Camera,
      colors: ['#6A1B9A', '#AB47BC'],
      bg: '#F3E5F5'
    },
  ];

  const [profileData, setProfileData] = useState({
    name: '',
    username: '',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400',
    bio: '',
    location: '',
    gender: '',
    posts: '0',
    followers: '0',
    following: '0'
  });

  const [editData, setEditData] = useState({ ...profileData });

  const handleImagePicker = async () => {
    setShowImageOptions(true);
  };

  const handleAvatarPress = () => {
    if (isEditing) {
      setShowImageOptions(true);
    } else {
      setShowFullScreenImg(true);
    }
  };

  const galleryImages = [
    {
      id: 1,
      uri: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
      label: 'Studio Vision',
    },
    {
      id: 2,
      uri: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80',
      label: 'Curated Content',
    },
    {
      id: 3,
      uri: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
      label: 'Brand Details',
    },
    {
      id: 4,
      uri: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=800&q=80',
      label: 'Creative Space',
    },
    {
      id: 5,
      uri: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80',
      label: 'Designer Mood',
    },
    {
      id: 6,
      uri: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=800&q=80',
      label: 'Modern Frame',
    },
  ];

  const pickImage = async () => {
    try {
      // Permission request
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to make this work!');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false, // Disabling system crop to show our own preview
        quality: 0.7,
      });

      setShowImageOptions(false);
      console.log('Image picker result:', result);

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setSelectedImage(result.assets[0].uri);
        setShowPreviewModal(true); // Show our theme-based preview modal
      }
    } catch (error) {
      setShowImageOptions(false);
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Could not open gallery. Please check permissions.');
    }
  };

  const handleConfirmUpload = () => {
    if (selectedImage) {
      uploadImage(selectedImage);
      setShowPreviewModal(false);
    }
  };

  const pickPostImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions!');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 0.8,
        allowsMultipleSelection: false,
        base64: false,
        exif: false,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setTempPostImage(result.assets[0].uri);
        setShowPostPreviewModal(true);
      }
    } catch (error) {
      console.error('Error picking post image:', error);
    }
  };

  const handleConfirmPostImage = () => {
    if (tempPostImage) {
      setPostImage(tempPostImage);
      setShowPostPreviewModal(false);
    }
  };

  const handleCreateOptionPress = (optionId) => {
    setShowCreateOptions(false);
    if (optionId === 'new-post') {
      setShowCreatePostModal(true);
    } else if (optionId === 'go-live') {
      Alert.alert('Coming Soon', 'Go Live feature is coming soon!');
    }
  };

  const uploadImage = async (uri) => {
    setIsLoading(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) return;

      const formData = new FormData();
      const filename = uri.split('/').pop();
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image`;

      formData.append('profileImage', { uri, name: filename, type });

      console.log('Uploading image to:', `${API_URL}/profile/upload-image`);
      const response = await fetch(`${API_URL}/profile/upload-image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      const data = await response.json();
      console.log('Upload response:', data);

      if (data.success) {
        // Update local state immediately
        let newPic = data.data.user.profilePicture;
        if (newPic) {
          // If it's a Cloudinary URL, use it directly. Otherwise use local IP logic
          if (!newPic.includes('cloudinary')) {
            newPic = newPic.replace('localhost', '192.168.1.3');
            if (!newPic.startsWith('http')) {
              newPic = `${BASE_URL}${newPic}`;
            }
          }
        }
        
        setProfileData(prev => ({ ...prev, avatar: newPic }));
        setEditData(prev => ({ ...prev, avatar: newPic }));
        
        // Auto-save other profile changes if we are in editing mode
        if (isEditing) {
          await handleEditToggle(); 
        } else {
          Alert.alert('Success', 'Profile picture updated and saved!');
        }
      } else {
        Alert.alert('Error', data.message || 'Failed to upload image');
      }
    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert('Network Error', `Error uploading image. Check if server is running at ${BASE_URL}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveImage = async () => {
    setShowImageOptions(false);
    setIsLoading(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) return;

      const response = await fetch(`${API_URL}/profile/remove-image`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success) {
        fetchProfile();
        Alert.alert('Success', 'Profile picture removed!');
      } else {
        Alert.alert('Error', data.message || 'Failed to remove image');
      }
    } catch (error) {
      console.error('Remove error:', error);
      Alert.alert('Error', 'Error removing image');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserPosts = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) return;

      const response = await fetch(`${API_URL}/profile/posts`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      console.log('ProfileScreen user posts data:', data);

      if (data.success && data.data) {
        setUserPosts(data.data.posts);
        console.log('ProfileScreen user posts set:', data.data.posts);
      }
    } catch (error) {
      console.error('Error fetching user posts:', error);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchUserPosts();
  }, []);

  const fetchProfile = async () => {
    setIsLoading(true);
    setFetchError(null);
    try {
      const token = await AsyncStorage.getItem('userToken');
      console.log('Token being sent for Profile:', token);
      if (!token) {
        setFetchError('Please login to see profile');
        setIsLoading(false);
        return;
      }

      const response = await fetch(`${API_URL}/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      console.log('Profile data fetched:', data);

      if (data.success && data.data && data.data.user) {
        const userData = data.data.user;
        let profilePic = userData.profilePicture;
        
        if (profilePic) {
          // If it's a Cloudinary URL, use it directly. Otherwise use local IP logic
          if (!profilePic.includes('cloudinary')) {
            profilePic = profilePic.replace('localhost', '192.168.1.3');
            if (profilePic && !profilePic.startsWith('http')) {
              profilePic = `${BASE_URL}${profilePic}`;
            }
          }
        }

        const newProfileData = {
          name: userData.name || 'User',
          username: userData.username || 'username',
          avatar: profilePic || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400',
          bio: userData.bio || '',
          location: userData.location || '',
          gender: userData.gender || '',
          posts: String(userData.postsCount || '0'),
          followers: String(userData.followersCount || '0'),
          following: String(userData.followingCount || '0')
        };
        setProfileData(newProfileData);
        setEditData(newProfileData);
        setFetchError(null); // Clear error if success
      } else {
        setFetchError(data.message || 'Failed to load profile');
      }
    } catch (error) {
      console.error('Fetch profile error:', error);
      setFetchError('Network error. Is server running?');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditToggle = async () => {
    if (isEditing) {
      // API call to save profile
      setIsLoading(true);
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (!token) {
          Alert.alert('Error', 'You must be logged in to edit profile');
          return;
        }

        const response = await fetch(`${API_URL}/profile/edit`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            name: editData.name,
            username: editData.username,
            bio: editData.bio,
            location: editData.location,
            gender: editData.gender ? editData.gender.toLowerCase() : 'other'
          }),
        });

        const data = await response.json();
        if (data.success) {
          const userData = data.data.user;
          const updatedProfileData = {
            ...profileData,
            name: userData.name || editData.name,
            username: userData.username || editData.username,
            bio: userData.bio || editData.bio,
            location: userData.location || editData.location,
            gender: userData.gender || editData.gender,
          };
          setProfileData(updatedProfileData);
          setEditData(updatedProfileData);
          setIsEditing(false);
          Alert.alert('Success', 'Profile updated successfully!');
        } else {
          Alert.alert('Error', data.message || 'Failed to update profile');
        }
      } catch (error) {
        console.error('Update profile error:', error);
        Alert.alert('Network Error', 'Network error. Make sure backend is running.');
      } finally {
        setIsLoading(false);
      }
    } else {
      setEditData({ ...profileData });
      setIsEditing(true);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.safeAreaHeader}>
        <View style={styles.headerBar}>
          {isEditing ? (
            <TouchableOpacity onPress={() => setIsEditing(false)} style={styles.backButton}>
              <X size={22} color="#000" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <ArrowLeft size={22} color="#000" />
            </TouchableOpacity>
          )}
          
          <Text style={styles.headerTitle}>{isEditing ? 'Edit Profile' : 'Profile'}</Text>
          
          {isEditing ? (
            <TouchableOpacity 
              onPress={handleEditToggle}
              disabled={isLoading}
              style={styles.saveHeaderButton}
            >
              <Text style={[styles.saveHeaderText, isLoading && { opacity: 0.5 }]}>
                {isLoading ? '...' : 'Save'}
              </Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.headerRightActions}>
              <TouchableOpacity 
                style={styles.headerActionButton}
                onPress={() => setShowCreateOptions(true)}
              >
                <Plus size={24} color="#000" />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.headerActionButton}
                onPress={() => navigation.navigate('Settings')}
              >
                <Settings size={22} color="#000" />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </SafeAreaView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={styles.profileInfoSection}>
          {isEditing ? (
            <View style={styles.editForm}>
              <View style={styles.editCard}>
                <Text style={styles.sectionTitle}>Edit Profile</Text>
                <View style={styles.inputGroup}>
                  <Text style={styles.fieldLabel}>Name</Text>
                  <TextInput
                    style={styles.textInput}
                    value={editData.name}
                    onChangeText={(text) => setEditData(prev => ({ ...prev, name: text }))}
                    placeholder="Your full name"
                  />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.fieldLabel}>Username</Text>
                  <TextInput
                    style={styles.textInput}
                    value={editData.username}
                    onChangeText={(text) => setEditData(prev => ({ ...prev, username: text }))}
                    placeholder="Username"
                    autoCapitalize="none"
                  />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.fieldLabel}>Bio</Text>
                  <TextInput
                    style={[styles.textInput, styles.textArea]}
                    value={editData.bio}
                    onChangeText={(text) => setEditData(prev => ({ ...prev, bio: text }))}
                    placeholder="Add a short bio"
                    multiline
                    numberOfLines={3}
                  />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.fieldLabel}>Location</Text>
                  <TextInput
                    style={styles.textInput}
                    value={editData.location}
                    onChangeText={(text) => setEditData(prev => ({ ...prev, location: text }))}
                    placeholder="City or area"
                  />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.fieldLabel}>Gender</Text>
                  <TextInput
                    style={styles.textInput}
                    value={editData.gender}
                    onChangeText={(text) => setEditData(prev => ({ ...prev, gender: text }))}
                    placeholder="Female, Male, Other"
                  />
                </View>
                <TouchableOpacity
                  style={styles.saveButtonFull}
                  activeOpacity={0.85}
                  onPress={handleEditToggle}
                  disabled={isLoading}
                >
                  <LinearGradient
                    colors={['#008000', '#34C759']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.saveButtonGradientFull}
                  >
                    <Text style={styles.saveButtonTextFull}>{isLoading ? 'Saving...' : 'Save Changes'}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <>
              <View style={styles.profileBanner}>
                <LinearGradient
                  colors={['#E5FBF1', '#FFFFFF']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.profileBannerGradient}
                >
                  <View style={styles.bannerAvatarWrapper}>
                    <View style={styles.bannerAvatarBorder}>
                      <Image
                        source={{ uri: isEditing ? editData.avatar : profileData.avatar }}
                        style={styles.bannerAvatar}
                      />
                      <TouchableOpacity style={styles.avatarEditButton} onPress={handleAvatarPress}>
                        <Camera size={14} color="#fff" />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={styles.bannerTextContainer}>
                    <Text style={styles.bannerHeadline}>{profileData.name || 'Your Name'}</Text>
                    <Text style={styles.bannerSubtext}>A clean, unique creator profile.</Text>
                  </View>
                </LinearGradient>
              </View>
              <View style={[styles.detailsContainer, styles.profileCard]}> 
                {fetchError ? (
                  <View style={styles.fetchErrorBox}>
                    <Text style={styles.fetchErrorText}>{fetchError}</Text>
                    <TouchableOpacity onPress={fetchProfile} style={styles.tryAgainButton}>
                      <Text style={styles.tryAgainText}>Try Again</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <>
                    <View style={styles.profileCardHeader}>
                      <Text style={styles.userNameText}>{isLoading ? 'Loading...' : (profileData.name || 'User')}</Text>
                      <Text style={styles.userHandleText}>@{profileData.username || 'username'}</Text>
                    </View>

                    {profileData.bio ? (
                    <Text style={styles.profileBioText}>{profileData.bio}</Text>
                  ) : null}

                  <View style={styles.profileInfoRow}>
                    {profileData.location ? (
                      <View style={styles.profileInfoBadge}>
                        <MapPin size={12} color="#008000" />
                        <Text style={styles.profileInfoText}>{profileData.location}</Text>
                      </View>
                    ) : null}
                    {profileData.gender ? (
                      <View style={styles.profileInfoBadge}>
                        <Users size={12} color="#008000" />
                        <Text style={styles.profileInfoText}>{profileData.gender}</Text>
                      </View>
                    ) : null}
                  </View>
                </>
              )}
            </View>
            </>
          )}

          {!isEditing && (
            <View style={styles.statsCardRow}>
              {/* Posts - Blue */}
              <View style={styles.circleStatCard}>
                <View style={[styles.circleContainer, { borderColor: '#ddd' }]}>
                  <View style={[styles.circleProgress, { borderColor: '#4ECDC4' }]} />
                  <View style={[styles.circleDot, { backgroundColor: '#4ECDC4', top: 4, right: 4 }]} />
                  <Text style={styles.circleNumber}>{profileData.posts}</Text>
                </View>
                <Text style={styles.statLabel}>Posts</Text>
              </View>

              {/* Followers - Green */}
              <TouchableOpacity 
                style={styles.circleStatCard}
                onPress={() => navigation.navigate('Followers', { initialTab: 'Followers' })}
                activeOpacity={0.7}
              >
                <View style={[styles.circleContainer, { borderColor: '#ddd' }]}>
                  <View style={[styles.circleProgress, { borderColor: '#45B7A8' }]} />
                  <View style={[styles.circleDot, { backgroundColor: '#45B7A8', top: 16, left: 4 }]} />
                  <View style={[styles.circleDot, { backgroundColor: '#45B7A8', bottom: 4, right: 16 }]} />
                  <Text style={styles.circleNumber}>{profileData.followers}</Text>
                </View>
                <Text style={styles.statLabel}>Fol@</Text>
              </TouchableOpacity>

              {/* Following - Orange */}
              <TouchableOpacity 
                style={styles.circleStatCard}
                onPress={() => navigation.navigate('Followers', { initialTab: 'Following' })}
                activeOpacity={0.7}
              >
                <View style={[styles.circleContainer, { borderColor: '#ddd' }]}>
                  <View style={[styles.circleProgress, { borderColor: '#FFA07A' }]} />
                  <View style={[styles.circleDot, { backgroundColor: '#FFA07A', bottom: 8, left: 8 }]} />
                  <Text style={styles.circleNumber}>{profileData.following}</Text>
                </View>
                <Text style={styles.statLabel}>Flw+</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.actionButtonsRowCompact}>
            <TouchableOpacity 
              activeOpacity={0.85}
              style={[styles.primaryActionButton, isEditing && styles.saveButton]} 
              onPress={handleEditToggle}
              disabled={isLoading}
            >
              <Text style={[styles.primaryActionText, isEditing && styles.saveButtonText]}>
                {isLoading ? 'Saving...' : (isEditing ? 'Save' : 'Edit Profile')}
              </Text>
            </TouchableOpacity>
            
            {!isEditing && (
              <TouchableOpacity style={styles.secondaryActionButton} activeOpacity={0.85} onPress={() => navigation.navigate('ShareProfile')}>
                <Text style={styles.secondaryActionText}>Share</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <View style={styles.tabsRow}>
            {['Posts', 'Reels', 'Saved', 'Liked'].map((tab, index) => {
              const icons = {
                Posts: Grid,
                Reels: Play,
                Saved: Bookmark,
                Liked: Heart,
              };
              const Icon = icons[tab];
              const isActive = activeTab === tab;
              return (
                <TouchableOpacity 
                  key={tab}
                  style={styles.tabItem} 
                  onPress={() => setActiveTab(tab)}
                >
                  <Icon size={20} color={isActive ? '#008000' : '#ADB5BD'} />
                </TouchableOpacity>
              );
            })}
          </View>
          <View 
            style={[
              styles.tabIndicator, 
              { 
                width: width / 4, 
                left: (activeTab === 'Posts' ? 0 : activeTab === 'Reels' ? width/4 : activeTab === 'Saved' ? width/2 : width * 0.75) 
              }
            ]} 
          />
        </View>

        {/* Professional Gallery */}
        <View style={styles.gridContainer}>
          <View style={styles.gridRow}>
            {userPosts.map((post) => (
              <View
                key={post._id}
                style={[
                  styles.gridItem,
                  { width: width / 2 - 18, aspectRatio: 1080 / 1350 },
                ]}
              >
                <Image source={{ uri: post.image }} style={styles.gridImage} resizeMode="cover" />
                <LinearGradient
                  colors={['rgba(0,0,0,0.24)', 'rgba(0,0,0,0)']}
                  style={styles.gridOverlay}
                />
                {activeTab === 'Reels' && (
                  <View style={styles.reelsPlayIcon}>
                    <Play size={14} color="white" fill="white" />
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
      <CustomBottomNav navigation={navigation} activeRoute="Profile" />

      {/* Premium Create Options Modal */}
      <Modal
        visible={showCreateOptions}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowCreateOptions(false)}
      >
        <Pressable 
          style={styles.premiumOverlay} 
          onPress={() => setShowCreateOptions(false)}
        >
          <View style={styles.premiumContent}>
            <View style={styles.premiumHandle} />
            
            <View style={styles.premiumHeader}>
              <View>
                <Text style={styles.premiumTitle}>Create New</Text>
                <Text style={styles.premiumSubtitle}>What would you like to share today?</Text>
              </View>
              <TouchableOpacity 
                onPress={() => setShowCreateOptions(false)}
                style={styles.premiumCloseBtn}
              >
                <X size={20} color="#666" />
              </TouchableOpacity>
            </View>

            <View style={styles.premiumGrid}>
              {createOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <TouchableOpacity 
                    key={option.id}
                    style={styles.premiumGridItem}
                    onPress={() => handleCreateOptionPress(option.id)}
                  >
                    <View style={[styles.premiumIconBox, { backgroundColor: option.bg }]}>
                      <LinearGradient
                        colors={option.colors}
                        style={styles.iconGradient}
                      >
                        <Icon size={24} color="#fff" />
                      </LinearGradient>
                    </View>
                    <Text style={styles.premiumOptionName}>{option.name}</Text>
                    <Text style={styles.premiumOptionDesc}>{option.desc}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <TouchableOpacity 
              style={styles.premiumCancelBtn}
              onPress={() => setShowCreateOptions(false)}
            >
              <Text style={styles.premiumCancelText}>Maybe Later</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

      {/* Custom Image Picker Modal */}
      <Modal
        visible={showImageOptions}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowImageOptions(false)}
      >
        <Pressable 
          style={styles.modalOverlay} 
          onPress={() => setShowImageOptions(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Profile Picture</Text>
              <TouchableOpacity onPress={() => setShowImageOptions(false)}>
                <X size={20} color="#777" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              style={styles.modalOption} 
              onPress={pickImage}
            >
              <View style={[styles.optionIcon, { backgroundColor: '#F0F9F1' }]}>
                <ImageIcon size={20} color="#008000" />
              </View>
              <Text style={styles.optionText}>Pick from Gallery</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.modalOption} 
              onPress={handleRemoveImage}
            >
              <View style={[styles.optionIcon, { backgroundColor: '#FFF5F5' }]}>
                <Trash2 size={20} color="#FF3B30" />
              </View>
              <Text style={[styles.optionText, { color: '#FF3B30' }]}>Remove Current Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.cancelOption} 
              onPress={() => setShowImageOptions(false)}
            >
              <Text style={styles.cancelOptionText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

      {/* Full Screen Image Viewer */}
      <Modal
        visible={showFullScreenImg}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowFullScreenImg(false)}
      >
        <Pressable 
          style={styles.fullScreenOverlay}
          onPress={() => setShowFullScreenImg(false)}
        >
          <View style={styles.fullScreenHeader}>
            <TouchableOpacity 
              onPress={() => setShowFullScreenImg(false)}
              style={styles.fullScreenCloseBtn}
            >
              <X size={28} color="#fff" />
            </TouchableOpacity>
          </View>
          
          <Image 
            source={{ uri: profileData.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop' }} 
            style={styles.fullScreenImage}
            resizeMode="contain"
          />
          
          <View style={styles.fullScreenFooter}>
            <Text style={styles.fullScreenTitle}>{profileData.name}</Text>
          </View>
        </Pressable>
      </Modal>

      {/* Theme-based Image Preview & Save Modal */}
      <Modal
        visible={showPreviewModal}
        transparent={false}
        animationType="slide"
        onRequestClose={() => setShowPreviewModal(false)}
      >
        <SafeAreaView style={styles.previewContainer}>
          <View style={styles.previewHeader}>
            <TouchableOpacity 
              onPress={() => setShowPreviewModal(false)}
              style={styles.previewCloseBtn}
            >
              <X size={24} color="#000" />
            </TouchableOpacity>
            <Text style={styles.previewTitle}>Preview Photo</Text>
            <View style={{ width: 40 }} />
          </View>

          <View style={styles.previewImageWrapper}>
            {selectedImage && (
              <Image 
                source={{ uri: selectedImage }} 
                style={styles.previewImage}
                resizeMode="cover"
              />
            )}
          </View>

          <View style={styles.previewFooter}>
            <Text style={styles.previewHint}>This photo will be visible to everyone on your profile.</Text>
            
            <TouchableOpacity 
              onPress={handleConfirmUpload}
              style={styles.confirmUploadBtn}
              disabled={isLoading}
            >
              <LinearGradient
                colors={['#FF8C00', '#008000']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.confirmGradient}
              >
                <Text style={styles.confirmBtnText}>
                  {isLoading ? 'Saving...' : 'Set Profile Picture'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => setShowPreviewModal(false)}
              style={styles.repickBtn}
            >
              <Text style={styles.repickText}>Choose Another</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>

      {/* Post Image Preview Modal */}
      <Modal
        visible={showPostPreviewModal}
        transparent={false}
        animationType="slide"
        onRequestClose={() => setShowPostPreviewModal(false)}
      >
        <SafeAreaView style={styles.previewContainer}>
          <View style={styles.previewHeader}>
            <TouchableOpacity 
              onPress={() => setShowPostPreviewModal(false)}
              style={styles.previewCloseBtn}
            >
              <X size={24} color="#000" />
            </TouchableOpacity>
            <Text style={styles.previewTitle}>Preview Post Image</Text>
            <View style={{ width: 40 }} />
          </View>

          <View style={[styles.previewImageWrapper, { aspectRatio: 4/5 }]}>
            {tempPostImage && (
              <Image 
                source={{ uri: tempPostImage }} 
                style={styles.previewImage}
                resizeMode="cover"
              />
            )}
          </View>

          <View style={styles.previewFooter}>
            <Text style={styles.previewHint}>This image will be used for your post in 4:5 aspect ratio.</Text>
            
            <TouchableOpacity 
              onPress={handleConfirmPostImage}
              style={styles.confirmUploadBtn}
              disabled={isLoading}
            >
              <LinearGradient
                colors={['#FF8C00', '#008000']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.confirmGradient}
              >
                <Text style={styles.confirmBtnText}>
                  OK / Save
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => {
                setShowPostPreviewModal(false);
                pickPostImage();
              }}
              style={styles.repickBtn}
            >
              <Text style={styles.repickText}>Choose Another</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>

      {/* Create Post Modal */}
      <Modal
        visible={showCreatePostModal}
        transparent={false}
        animationType="slide"
        onRequestClose={() => {
          setShowCreatePostModal(false);
          setPostImage(null);
          setTempPostImage(null);
          setShowPostPreviewModal(false);
          setPostCaption('');
          setPostHashtags('');
          setPostLocation('');
        }}
      >
        <SafeAreaView style={styles.createPostContainer}>
          <View style={styles.createPostHeader}>
            <TouchableOpacity
              onPress={() => {
                setShowCreatePostModal(false);
                setPostImage(null);
                setTempPostImage(null);
                setShowPostPreviewModal(false);
                setPostCaption('');
                setPostHashtags('');
                setPostLocation('');
              }}
              style={styles.createPostCloseBtn}
            >
              <X size={24} color="#000" />
            </TouchableOpacity>
            <Text style={styles.createPostTitle}>Create Post</Text>
            <TouchableOpacity
              onPress={async () => {
                if (!postImage) {
                  Alert.alert('Error', 'Please select an image');
                  return;
                }
                setIsPosting(true);
                try {
                  const token = await AsyncStorage.getItem('userToken');
                  const response = await fetch(`${API_URL}/profile/posts`, {
                    method: 'POST',
                    headers: {
                      'Authorization': `Bearer ${token}`,
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      image: postImage,
                      caption: postCaption,
                      hashtags: postHashtags,
                      location: postLocation,
                    }),
                  });
                  const data = await response.json();
                  
                  if (data.success) {
                    Alert.alert('Success', 'Post created successfully!');
                    setShowCreatePostModal(false);
                    setPostImage(null);
                    setTempPostImage(null);
                    setShowPostPreviewModal(false);
                    setPostCaption('');
                    setPostHashtags('');
                    setPostLocation('');
                    fetchProfile(); // Refresh profile data
                    fetchUserPosts(); // Refresh posts
                  } else {
                    Alert.alert('Error', data.message || 'Failed to create post');
                  }
                } catch (error) {
                  console.error('Error creating post:', error);
                  Alert.alert('Error', 'Failed to create post');
                } finally {
                  setIsPosting(false);
                }
              }}
              disabled={isPosting}
            >
              <Text style={[styles.createPostText, isPosting && { opacity: 0.5 }]}>
                {isPosting ? 'Posting...' : 'Post'}
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.createPostContent}>
            {/* Image Picker */}
            <TouchableOpacity
              style={styles.imagePickerArea}
              onPress={pickPostImage}
            >
              {postImage ? (
                <Image source={{ uri: postImage }} style={styles.previewPostImage} resizeMode="cover" />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <ImageIcon size={50} color="#ADB5BD" />
                  <Text style={styles.imagePlaceholderText}>Tap to select image</Text>
                </View>
              )}
            </TouchableOpacity>

            {/* Caption Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Caption</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                placeholder="Write a caption..."
                value={postCaption}
                onChangeText={setPostCaption}
                multiline
                numberOfLines={4}
              />
            </View>

            {/* Hashtags Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Hashtags</Text>
              <TextInput
                style={styles.textInput}
                placeholder="#hashtag #fun #photo"
                value={postHashtags}
                onChangeText={setPostHashtags}
              />
            </View>

            {/* Location Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Location</Text>
              <View style={styles.locationInputWrapper}>
                <MapPin size={20} color="#008000" />
                <TextInput
                  style={styles.locationInput}
                  placeholder="Add location..."
                  value={postLocation}
                  onChangeText={setPostLocation}
                />
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  safeAreaHeader: {
    backgroundColor: '#fff',
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    marginTop: Platform.OS === 'android' ? 30 : 0,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#000',
    letterSpacing: 0.5,
  },
  topSettingsButton: {
    padding: 4,
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  headerActionButton: {
    padding: 8,
  },
  saveHeaderButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  saveHeaderText: {
    color: '#008000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  premiumOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  premiumContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 30,
    paddingTop: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 20,
  },
  premiumHandle: {
    width: 40,
    height: 5,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 20,
  },
  premiumHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 25,
  },
  premiumTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#111',
    letterSpacing: -0.5,
  },
  premiumSubtitle: {
    fontSize: 14,
    color: '#777',
    marginTop: 4,
  },
  premiumCloseBtn: {
    padding: 8,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
  },
  premiumGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  premiumGridItem: {
    width: (width - 64) / 2,
    backgroundColor: '#F9FAFB',
    borderRadius: 24,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F1F3F5',
  },
  premiumIconBox: {
    width: 60,
    height: 60,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  iconGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  premiumOptionName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111',
    marginBottom: 4,
  },
  premiumOptionDesc: {
    fontSize: 11,
    color: '#999',
    fontWeight: '600',
  },
  premiumCancelBtn: {
    marginTop: 30,
    paddingVertical: 16,
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 18,
  },
  premiumCancelText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#666',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 25,
    paddingTop: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#111',
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 15,
  },
  optionIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  cancelOption: {
    marginTop: 15,
    paddingVertical: 15,
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
  },
  cancelOptionText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#777',
  },
  fullScreenOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
    justifyContent: 'center',
  },
  fullScreenHeader: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    right: 20,
    zIndex: 10,
  },
  fullScreenCloseBtn: {
    padding: 10,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 25,
  },
  fullScreenImage: {
    width: '100%',
    height: '70%',
  },
  fullScreenFooter: {
    position: 'absolute',
    bottom: 50,
    width: '100%',
    alignItems: 'center',
  },
  fullScreenTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  previewContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  previewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F3F5',
  },
  previewCloseBtn: {
    padding: 5,
  },
  previewTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#000',
  },
  previewImageWrapper: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewImage: {
    width: '100%',
    aspectRatio: 1,
  },
  previewFooter: {
    padding: 25,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#F1F3F5',
  },
  previewHint: {
    textAlign: 'center',
    color: '#777',
    fontSize: 14,
    marginBottom: 25,
    lineHeight: 20,
  },
  confirmUploadBtn: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 15,
  },
  confirmGradient: {
    paddingVertical: 18,
    alignItems: 'center',
  },
  confirmBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  repickBtn: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  repickText: {
    color: '#777',
    fontSize: 14,
    fontWeight: '600',
  },
  profileInfoSection: {
    alignItems: 'center',
    paddingTop: 15,
    paddingBottom: 10,
    marginHorizontal: 16,
    backgroundColor: 'transparent',
  },
  profileCard: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 28,
    padding: 18,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 20,
    elevation: 12,
    borderWidth: 1,
    borderColor: '#F0F0F5',
    marginBottom: 12,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 8,
  },
  avatarBorder: {
    width: 96,
    height: 96,
    borderRadius: 28,
    backgroundColor: '#EAF8F2',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 18,
    elevation: 10,
  },
  avatarContainer: {
    width: 88,
    height: 88,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#F8F9FA',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  avatarEditButton: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#008000',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  profileBanner: {
    marginHorizontal: 16,
    marginBottom: -38,
    zIndex: 10,
  },
  profileBannerGradient: {
    borderRadius: 28,
    padding: 20,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
  },
  bannerAvatarWrapper: {
    width: 96,
    height: 96,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 20,
    elevation: 12,
    marginRight: 16,
  },
  bannerAvatarBorder: {
    width: 86,
    height: 86,
    borderRadius: 22,
    overflow: 'hidden',
    position: 'relative',
  },
  bannerAvatar: {
    width: '100%',
    height: '100%',
  },
  bannerTextContainer: {
    flex: 1,
  },
  bannerHeadline: {
    fontSize: 22,
    color: '#0B3F20',
    fontWeight: '900',
    marginBottom: 8,
  },
  bannerSubtext: {
    fontSize: 13,
    color: '#385C45',
    lineHeight: 20,
  },
  profileCardHeader: {
    marginBottom: 14,
  },
  profileMetaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 14,
  },
  profileTitleGroup: {
    flex: 1,
  },
  userNameText: {
    fontSize: 20,
    fontWeight: '900',
    color: '#111',
  },
  userHandleText: {
    fontSize: 13,
    color: '#008000',
    fontWeight: '700',
    marginTop: 4,
  },
  profileBioText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
    marginBottom: 16,
  },
  profileInfoRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  profileInfoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F3FEF5',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#E6F4EA',
  },
  profileInfoText: {
    color: '#2E7D32',
    fontSize: 12,
    fontWeight: '700',
  },
  statsCardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 4,
    marginBottom: 10,
    backgroundColor: '#fff',
    paddingVertical: 20,
    borderRadius: 20,
  },
  circleStatCard: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  circleContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 3,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginBottom: 10,
  },
  circleProgress: {
    position: 'absolute',
    top: -3,
    left: -3,
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 3,
    borderLeftColor: 'transparent',
    borderBottomColor: 'transparent',
    borderTopColor: 'transparent',
    transform: [{ rotate: '45deg' }],
  },
  circleDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    position: 'absolute',
  },
  circleNumber: {
    fontSize: 22,
    fontWeight: '900',
    color: '#111',
    zIndex: 1,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    marginHorizontal: 4,
    borderRadius: 24,
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#F0F0F5',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '900',
    color: '#111',
  },
  statLabel: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
    textTransform: 'capitalize',
    letterSpacing: 0.5,
  },
  actionButtonsRowCompact: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
    marginTop: 12,
  },
  primaryActionButton: {
    flex: 1,
    height: 44,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#008000',
    shadowColor: '#008000',
    shadowOpacity: 0.18,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 20,
    elevation: 6,
  },
  primaryActionText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '900',
  },
  secondaryActionButton: {
    flex: 1,
    height: 44,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E6E6E6',
  },
  secondaryActionText: {
    color: '#111',
    fontSize: 14,
    fontWeight: '800',
  },
  fetchErrorBox: {
    alignItems: 'center',
    marginVertical: 10,
  },
  fetchErrorText: {
    color: '#FF3B30',
    fontSize: 12,
    fontWeight: '600',
  },
  tryAgainButton: {
    marginTop: 5,
  },
  tryAgainText: {
    color: '#008000',
    fontSize: 11,
    fontWeight: '700',
  },
  compactInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 4,
  },
  infoText: {
    fontSize: 10,
    color: '#777',
    fontWeight: '600',
  },
  dotSeparator: {
    width: 2,
    height: 2,
    borderRadius: 1,
    backgroundColor: '#ccc',
    marginHorizontal: 1,
  },
  compactBioText: {
    fontSize: 12,
    color: '#444',
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 25,
    lineHeight: 18,
    fontWeight: '500',
  },
  statsRowCompact: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    marginTop: 15,
    paddingVertical: 12,
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: '#f0f0f0',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumberCompact: {
    fontSize: 14,
    fontWeight: '900',
    color: '#111',
  },
  statLabelCompact: {
    fontSize: 8,
    color: '#888',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  actionButtonsRowCompact: {
    flexDirection: 'row',
    width: '100%',
    gap: 6,
    marginTop: 10,
  },
  editButtonCompact: {
    flex: 1,
    height: 34,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: '#EAEAEA',
  },
  editButtonTextCompact: {
    color: '#111',
    fontSize: 11,
    fontWeight: '800',
  },
  shareButtonGradientCompact: {
    flex: 1,
    height: 34,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareButtonTextCompact: {
    color: 'white',
    fontSize: 11,
    fontWeight: '800',
  },
  saveButton: {
    backgroundColor: '#008000',
    borderColor: '#008000',
  },
  saveButtonText: {
    color: '#fff',
  },
  editForm: {
    width: '100%',
    paddingHorizontal: 15,
    marginTop: 5,
  },
  textInput: {
    backgroundColor: '#F8F9FA',
    borderWidth: 0.5,
    borderColor: '#E9ECEF',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: '#111',
  },
  textArea: {
    minHeight: 90,
    textAlignVertical: 'top',
  },
  editCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 10,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#111',
    marginBottom: 18,
  },
  inputGroup: {
    marginBottom: 14,
  },
  fieldLabel: {
    fontSize: 12,
    color: '#777',
    fontWeight: '700',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  saveButtonFull: {
    marginTop: 8,
    borderRadius: 16,
    overflow: 'hidden',
  },
  saveButtonGradientFull: {
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: 16,
  },
  saveButtonTextFull: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '900',
  },
  tabsContainer: {
    marginTop: 10,
    borderTopWidth: 0.5,
    borderTopColor: '#F0F0F0',
  },
  tabsRow: {
    flexDirection: 'row',
  },
  tabItem: {
    flex: 1,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    height: 2,
    backgroundColor: '#008000',
  },
  gridContainer: {
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  gridRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    marginBottom: 14,
    borderRadius: 22,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 18,
    elevation: 10,
  },
  gridImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  gridOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '40%',
  },
  gridLabelBox: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  gridLabel: {
    color: '#111',
    fontSize: 12,
    fontWeight: '800',
  },
  reelsPlayIcon: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 18,
  },
  reelsViewText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  createPostContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  createPostHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#F0F0F0',
  },
  createPostCloseBtn: {
    padding: 4,
  },
  createPostTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#000',
  },
  createPostText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#008000',
  },
  createPostContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  imagePickerArea: {
    width: '100%',
    aspectRatio: 1080 / 1350,
    backgroundColor: '#F8F9FA',
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
  },
  previewPostImage: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  imagePlaceholderText: {
    fontSize: 14,
    color: '#ADB5BD',
    fontWeight: '600',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111',
    marginBottom: 8,
  },
  locationInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderWidth: 0.5,
    borderColor: '#E9ECEF',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
  },
  locationInput: {
    flex: 1,
    fontSize: 14,
    color: '#111',
  },
});

export default ProfileScreen;
