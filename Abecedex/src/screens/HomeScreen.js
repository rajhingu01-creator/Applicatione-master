import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  FlatList,
  Platform,
  Animated,
  useWindowDimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL, BASE_URL } from '../utils/api';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Search, 
  Heart, 
  MessageCircle, 
  Plus, 
  MoreHorizontal, 
  MapPin, 
  CheckCircle,
  Send,
  Bookmark,
  Zap,
  TrendingUp,
  Filter,
  PlayCircle,
  Users,
} from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import CustomBottomNav from '../components/CustomBottomNav';
import { bottomNavSpace } from '../utils/responsive';

const HomeScreen = ({ navigation }) => {
  const { width } = useWindowDimensions();
  const cardWidth = Math.min(width - 30, 430);
  const mediaHeight = Math.min(cardWidth * 1.08, 470);
  const [activeTab, setActiveTab] = useState('For you');
  const [userAvatar, setUserAvatar] = useState('https://i.pravatar.cc/150?u=sam');
  const [posts, setPosts] = useState([]);
  const scrollY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fetchUserData();
    fetchPosts();
    
    // Refresh avatar and posts when screen comes into focus
    const unsubscribe = navigation.addListener('focus', () => {
      fetchUserData();
      fetchPosts();
    });

    return unsubscribe;
  }, [navigation]);

  const fetchUserData = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) return;

      const response = await fetch(`${API_URL}/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success && data.data.user.profilePicture) {
        let avatarUrl = data.data.user.profilePicture;
        if (!avatarUrl.includes('cloudinary')) {
          avatarUrl = avatarUrl.replace('localhost', '192.168.1.3');
          if (!avatarUrl.startsWith('http')) {
            avatarUrl = `${BASE_URL}${avatarUrl}`;
          }
        }
        setUserAvatar(avatarUrl);
      }
    } catch (error) {
      console.error('Error fetching user data for home:', error);
    }
  };

  const fetchPosts = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) return;

      const response = await fetch(`${API_URL}/profile/posts/all`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      console.log('HomeScreen posts data:', data);
      if (data.success && data.data && data.data.posts) {
        setPosts(data.data.posts);
        console.log('HomeScreen posts set:', data.data.posts);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const stories = [];

  const moodTabs = [
    { name: 'For you', icon: Zap },
    { name: 'Following', icon: Users },
    { name: 'Trending', icon: TrendingUp },
  ];

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [1, 0.9],
    extrapolate: 'clamp',
  });

  const renderHeader = () => (
    <Animated.View style={[styles.header, { opacity: headerOpacity }]}>
      <View style={styles.headerTopRow}>
        <View>
          {/* <Text style={styles.welcomeText}>Good Morning,</Text> */}
          <Text style={styles.logoText}>Changis</Text>
        </View>
        <View style={styles.headerIcons}>
          {/* <TouchableOpacity style={styles.headerIconBtn}><Search size={22} color="#111" /></TouchableOpacity> */}
          <TouchableOpacity style={styles.headerIconBtn} onPress={() => navigation.navigate('ChatList')}>
            <MessageCircle size={22} color="#111" />
            <View style={[styles.notifBadge, { backgroundColor: '#FF3B30' }]}>
              <Text style={styles.notifText}>3</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.profileBtn} onPress={() => navigation.navigate('Profile')}>
            <Image source={{ uri: userAvatar }} style={styles.headerProfileImg} />
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );

  const renderStories = () => (
    <View style={styles.storiesSection}>
      <View style={styles.storiesTitleRow}>
        <Text style={styles.storiesTitle}>Stories</Text>
        <Text style={styles.storiesHint}>New moments</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.storiesContainer}>
        <TouchableOpacity style={styles.addStoryItem}>
          <View style={styles.addStoryCircle}>
            <Image source={{ uri: userAvatar }} style={styles.addStoryAvatar} />
            <View style={styles.plusBadge}>
              <Plus size={12} color="white" />
            </View>
          </View>
          <Text style={styles.storyNameText}>You</Text>
        </TouchableOpacity>

        {stories.map((story) => (
          <TouchableOpacity key={story.id} style={styles.storyItem}>
            <LinearGradient 
              colors={['#FF8C00', '#8A2BE2', '#008000']} 
              start={{x: 0, y: 0}} 
              end={{x: 1, y: 1}}
              style={styles.storyRing}
            >
              <View style={styles.storyAvatarInner}>
                <Image source={{ uri: story.image }} style={styles.storyAvatar} />
              </View>
            </LinearGradient>
            {story.isLive && (
              <View style={styles.liveBadge}>
                <Text style={styles.liveBadgeText}>LIVE</Text>
              </View>
            )}
            <Text style={styles.storyNameText}>{story.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderMoodTabs = () => (
    <View style={styles.moodTabsWrapper}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.moodTabsContent}>
        {moodTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.name;
          return (
            <TouchableOpacity
              key={tab.name}
              onPress={() => setActiveTab(tab.name)}
              style={[styles.moodTab, isActive && styles.moodTabActive]}
            >
              {isActive ? (
                <LinearGradient
                  colors={['#FF8C00', '#008000']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.moodTabGradient}
                >
                  <Icon size={14} color="white" />
                  <Text style={[styles.moodTabText, styles.moodTabTextActive]}>{tab.name}</Text>
                </LinearGradient>
              ) : (
                <>
                  <Icon size={14} color="#666" />
                  <Text style={styles.moodTabText}>{tab.name}</Text>
                </>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );

  const renderPost = (post) => {
    // Format user avatar URL same as profile image
    let userAvatarUrl = post.user.profilePicture || 'https://i.pravatar.cc/150?u=' + post.user._id;
    if (userAvatarUrl && !userAvatarUrl.includes('cloudinary')) {
      userAvatarUrl = userAvatarUrl.replace('localhost', '192.168.1.3');
      if (userAvatarUrl && !userAvatarUrl.startsWith('http')) {
        userAvatarUrl = `${BASE_URL}${userAvatarUrl}`;
      }
    }

    return (
      <View key={post._id} style={[styles.postCard, { width: cardWidth }]}>
        {/* Post Header */}
        <View style={styles.postHeader}>
          <View style={styles.postAuthorGroup}>
            <LinearGradient
              colors={['#FF8C00', '#8A2BE2', '#008000']}
              style={styles.headerAvatarRing}
            >
              <View style={styles.headerAvatarInner}>
                <Image source={{ uri: userAvatarUrl }} style={styles.postAuthorAvatar} />
              </View>
            </LinearGradient>
            <View style={styles.postAuthorTextGroup}>
              <View style={styles.authorNameRow}>
                <Text style={styles.postAuthorName}>{post.user.name}</Text>
                <CheckCircle size={12} color="#1D9BF0" fill="#1D9BF0" />
              </View>
              {post.location && (
                <View style={styles.locationRow}>
                  <MapPin size={11} color="#777" />
                  <Text style={styles.postLocationText}>{post.location}</Text>
                </View>
              )}
            </View>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.headerActionBtn}><Bookmark size={20} color="#333" /></TouchableOpacity>
            <TouchableOpacity style={styles.moreBtn}><MoreHorizontal size={20} color="#333" /></TouchableOpacity>
          </View>
        </View>

        {/* Post Media */}
        <View style={[styles.postImageWrapper, { height: mediaHeight }]}>
          <Image 
            source={{ uri: post.image }} 
            style={styles.postImage} 
            resizeMode="cover"
          />
          <LinearGradient
            colors={['rgba(0,0,0,0.0)', 'rgba(0,0,0,0.42)']}
            style={styles.mediaShade}
          />
          <View style={styles.mediaTopPill}>
            <Text style={styles.mediaTopPillText}>Photo</Text>
          </View>
          <View style={styles.mediaBottomMeta}>
            <Text style={styles.mediaTime}>{new Date(post.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</Text>
          </View>
        </View>

        {/* Post Actions */}
        <View style={styles.postFooter}>
          <View style={styles.postActionsMain}>
            <TouchableOpacity activeOpacity={0.85}>
              <LinearGradient
                colors={['rgba(255,140,0,0.16)', 'rgba(0,128,0,0.12)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.actionShell}
              >
                <View style={styles.actionInner}>
                  <Heart size={18} color="#111" />
                  <Text style={styles.actionText}>{post.likes.length}</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.85}>
              <LinearGradient
                colors={['rgba(0,128,0,0.12)', 'rgba(255,140,0,0.12)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.actionShell}
              >
                <View style={styles.actionInner}>
                  <MessageCircle size={18} color="#111" />
                  <Text style={styles.actionText}>{post.comments.length}</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.85}>
              <LinearGradient
                colors={['#FF8C00', '#008000']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.sendActionShell}
              >
                <Send size={18} color="#fff" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        {/* Post Content */}
        <View style={styles.postContentSection}>
          {post.likes.length > 0 && (
            <View style={styles.likedByRow}>
              <View style={styles.miniAvatars}>
                <Image source={{ uri: 'https://i.pravatar.cc/150?u=1' }} style={styles.miniAvatar} />
                <Image source={{ uri: 'https://i.pravatar.cc/150?u=2' }} style={[styles.miniAvatar, { marginLeft: -8 }]} />
                <Image source={{ uri: 'https://i.pravatar.cc/150?u=3' }} style={[styles.miniAvatar, { marginLeft: -8 }]} />
              </View>
              <Text style={styles.likedByText}>
                Loved by <Text style={styles.boldText}>{post.likes.length > 0 ? 'someone' : '...'}</Text> and <Text style={styles.boldText}>{post.likes.length} others</Text>
              </Text>
            </View>
          )}

          {post.caption && (
            <Text style={styles.postCaptionText} numberOfLines={2}>
              <Text style={styles.postAuthorNameSmall}>{post.user.username} </Text>
              {post.caption}
            </Text>
          )}

          {post.hashtags && <Text style={styles.hashtagsText}>{post.hashtags}</Text>}
          
          {post.comments.length > 0 && (
            <TouchableOpacity>
              <Text style={styles.viewCommentsText}>View all {post.comments.length} comments</Text>
            </TouchableOpacity>
          )}
          
          <Text style={styles.postTimeTextSmall}>{new Date(post.createdAt).toLocaleDateString().toUpperCase()}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.safeArea}>
        {renderHeader()}
        <FlatList
          data={posts}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => renderPost(item)}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconCircle}>
                <Plus size={32} color="#008000" />
              </View>
              <Text style={styles.emptyTitle}>No posts yet</Text>
              <Text style={styles.emptySubtitle}>Follow people or create your first post to see updates here.</Text>
              <TouchableOpacity style={styles.createPostBtn}>
                <LinearGradient
                  colors={['#FF8C00', '#008000']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.createPostGradient}
                >
                  <Text style={styles.createPostBtnText}>Create Post</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}
          ListHeaderComponent={() => (
            <>
              {renderStories()}
              {renderMoodTabs()}
              <View style={styles.sectionHeader}>
                <View>
                  <Text style={styles.sectionTitle}>Fresh Feed</Text>
                  <Text style={styles.sectionSubtitle}>Curated posts from creators</Text>
                </View>
                <TouchableOpacity style={styles.filterBtn}>
                  <Filter size={18} color="#0095f6" />
                  <Text style={styles.filterText}>Filter</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
          ListFooterComponent={<View style={{ height: bottomNavSpace }} />}
          removeClippedSubviews={Platform.OS === 'android'}
          maxToRenderPerBatch={5}
          windowSize={10}
          initialNumToRender={3}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
        />
      </SafeAreaView>
      <CustomBottomNav navigation={navigation} activeRoute="Home" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8F5',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    backgroundColor: '#fff',
    zIndex: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#efefef',
    paddingTop: Platform.OS === 'android' ? 45 : 10,
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingBottom: 15,
  },
  welcomeText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  logoText: {
    fontSize: 29,
    fontWeight: '900',
    color: '#000',
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerIconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.86)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
  },
  profileBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    padding: 2,
    backgroundColor: '#fff',
  },
  headerProfileImg: {
    width: '100%',
    height: '100%',
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#008000',
  },
  notifBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#FF3B30',
    borderWidth: 2,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  notifText: {
    color: 'white',
    fontSize: 8,
    fontWeight: 'bold',
  },
  scrollContent: {
    paddingTop: 0,
  },
  storiesSection: {
    paddingTop: 16,
    paddingBottom: 10,
  },
  storiesTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginBottom: 12,
  },
  storiesTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#111',
  },
  storiesHint: {
    fontSize: 12,
    fontWeight: '700',
    color: '#008000',
  },
  storiesContainer: {
    paddingLeft: 15,
    paddingRight: 15,
  },
  addStoryItem: {
    alignItems: 'center',
    marginRight: 14,
  },
  addStoryCircle: {
    width: 72,
    height: 72,
    borderRadius: 22,
    padding: 2,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 7,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  addStoryAvatar: {
    width: '100%',
    height: '100%',
    borderRadius: 19,
  },
  plusBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#0095f6',
    borderWidth: 2,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  storyItem: {
    alignItems: 'center',
    marginRight: 14,
  },
  storyRing: {
    width: 72,
    height: 72,
    borderRadius: 22,
    padding: 2,
    marginBottom: 7,
  },
  storyAvatarInner: {
    flex: 1,
    borderRadius: 20,
    backgroundColor: '#fff',
    padding: 2,
  },
  storyAvatar: {
    flex: 1,
    borderRadius: 18,
  },
  liveBadge: {
    position: 'absolute',
    top: 56,
    backgroundColor: '#FF3B30',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#fff',
  },
  liveBadgeText: {
    color: 'white',
    fontSize: 8,
    fontWeight: '900',
  },
  storyNameText: {
    fontSize: 12,
    color: '#262626',
    fontWeight: '700',
  },
  moodTabsWrapper: {
    paddingVertical: 8,
  },
  moodTabsContent: {
    paddingHorizontal: 15,
    gap: 8,
  },
  moodTab: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 18,
    gap: 6,
    borderWidth: 1,
    borderColor: '#EDEDED',
  },
  moodTabActive: {
    paddingHorizontal: 0,
    paddingVertical: 0,
    borderWidth: 0,
    backgroundColor: 'transparent',
  },
  moodTabGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 18,
    paddingHorizontal: 15,
    paddingVertical: 10,
    gap: 6,
  },
  moodTabText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#262626',
  },
  moodTabTextActive: {
    color: '#fff',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: 12,
    paddingBottom: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#000',
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#777',
    marginTop: 2,
    fontWeight: '600',
  },
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#EEF7F0',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0095f6',
  },
  postCard: {
    backgroundColor: '#fff',
    alignSelf: 'center',
    marginBottom: 24,
    borderRadius: 35,
    paddingTop: 6,
    paddingBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.1,
    shadowRadius: 25,
    elevation: 6,
    borderWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.03)',
    overflow: 'hidden',
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  postAuthorGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  postImageWrapper: {
    marginHorizontal: 14,
    borderRadius: 28,
    backgroundColor: '#fafafa',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  headerAvatarRing: {
    width: 42,
    height: 42,
    borderRadius: 21,
    padding: 1.5,
  },
  headerAvatarInner: {
    flex: 1,
    borderRadius: 20,
    backgroundColor: '#fff',
    padding: 1,
  },
  postAuthorAvatar: {
    flex: 1,
    borderRadius: 19,
  },
  postAuthorTextGroup: {
    minWidth: 0,
    flexShrink: 1,
  },
  authorNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  postAuthorName: {
    fontSize: 14,
    fontWeight: '900',
    color: '#262626',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 2,
  },
  postLocationText: {
    fontSize: 11,
    color: '#777',
    fontWeight: '600',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerActionBtn: {
    padding: 4,
  },
  moreBtn: {
    padding: 4,
  },
  postImageWrapper: {
    marginHorizontal: 12,
    borderRadius: 22,
    backgroundColor: '#fafafa',
    overflow: 'hidden',
  },
  mediaShade: {
    ...StyleSheet.absoluteFillObject,
  },
  mediaTopPill: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
  },
  mediaTopPillText: {
    fontSize: 11,
    color: '#111',
    fontWeight: '900',
  },
  videoOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  postImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  mediaBottomMeta: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 10,
  },
  mediaCaptionPreview: {
    flex: 1,
    color: '#fff',
    fontSize: 12,
    fontWeight: '800',
  },
  mediaTime: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
    opacity: 0.9,
  },
  hashtagsText: {
    fontSize: 13,
    color: '#00376b',
    fontWeight: '600',
    marginBottom: 6,
  },
  postFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 8,
  },
  postActionsMain: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },
  actionShell: {
    minHeight: 36,
    borderRadius: 20,
    padding: 1.2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  actionInner: {
    minHeight: 34,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.94)',
    borderRadius: 19,
    paddingHorizontal: 12,
    gap: 5,
  },
  sendActionShell: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#008000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  actionText: {
    fontSize: 12,
    color: '#111',
    fontWeight: '900',
  },
  postContentSection: {
    paddingHorizontal: 14,
  },
  likedByRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  miniAvatars: {
    flexDirection: 'row',
    marginRight: 8,
  },
  miniAvatar: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#fff',
  },
  likedByText: {
    flex: 1,
    fontSize: 13,
    color: '#262626',
  },
  boldText: {
    fontWeight: '700',
  },
  postCaptionText: {
    fontSize: 14,
    color: '#262626',
    lineHeight: 20,
    marginBottom: 7,
  },
  postAuthorNameSmall: {
    fontWeight: '700',
  },
  viewCommentsText: {
    fontSize: 13,
    color: '#8e8e8e',
    marginBottom: 6,
    fontWeight: '600',
  },
  postTimeTextSmall: {
    fontSize: 10,
    color: '#8e8e8e',
    marginBottom: 10,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F0F9F1',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#111',
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#777',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  createPostBtn: {
    borderRadius: 16,
    overflow: 'hidden',
    minWidth: 160,
  },
  createPostGradient: {
    paddingVertical: 14,
    paddingHorizontal: 25,
    alignItems: 'center',
  },
  createPostBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
