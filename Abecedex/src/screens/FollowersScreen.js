import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  TextInput,
  Platform,
  useWindowDimensions,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  ArrowLeft, 
  Search, 
  UserPlus, 
  UserCheck, 
  MoreVertical,
  Circle
} from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { spacingForWidth } from '../utils/responsive';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../utils/api';

const FollowersScreen = ({ navigation, route }) => {
  const { width } = useWindowDimensions();
  const { compact } = spacingForWidth(width);
  const initialTab = route.params?.initialTab || 'Followers';
  const [activeTab, setActiveTab] = useState(initialTab);
  const [searchQuery, setSearchText] = useState('');
  const [followersData, setFollowersData] = useState([]);
  const [followingData, setFollowingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState({ username: '' });

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        navigation.navigate('Login');
        return;
      }

      // Fetch both followers and following
      const [followersRes, followingRes, profileRes] = await Promise.all([
        fetch(`${API_URL}/profile/followers`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${API_URL}/profile/following`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${API_URL}/profile`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      const followersJson = await followersRes.json();
      const followingJson = await followingRes.json();
      const profileJson = await profileRes.json();

      if (followersJson.success) {
        setFollowersData(followersJson.data.followers);
      }
      if (followingJson.success) {
        setFollowingData(followingJson.data.following);
      }
      if (profileJson.success) {
        setCurrentUser(profileJson.data.user);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      Alert.alert('Error', 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const toggleFollow = async (userId, isFollowing) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const endpoint = isFollowing ? 'unfollow' : 'follow';
      
      const res = await fetch(`${API_URL}/profile/${endpoint}/${userId}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const json = await res.json();
      
      if (json.success) {
        // Update local state
        if (activeTab === 'Followers') {
          setFollowersData(prev => prev.map(user => 
            user.id === userId ? { ...user, isFollowing: !user.isFollowing } : user
          ));
        } else {
          if (isFollowing) {
            setFollowingData(prev => prev.filter(user => user.id !== userId));
          } else {
            setFollowingData(prev => prev.map(user => 
              user.id === userId ? { ...user, isFollowing: !user.isFollowing } : user
            ));
          }
        }
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
      Alert.alert('Error', 'Failed to update follow status');
    }
  };

  const data = activeTab === 'Followers' ? followersData : followingData;
  const filteredData = data.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderUserItem = ({ item }) => (
    <View style={styles.userItem}>
      <TouchableOpacity style={styles.userInfo} onPress={() => {}}>
        <View style={styles.avatarContainer}>
          <Image source={{ uri: item.image }} style={styles.avatar} />
          <View style={styles.activeDot} />
        </View>
        <View style={styles.nameContainer}>
          <Text style={styles.nameText}>{item.name}</Text>
          <Text style={styles.usernameText}>@{item.username}</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity 
        activeOpacity={0.8} 
        style={[styles.actionButton, compact && styles.actionButtonCompact]}
        onPress={() => toggleFollow(item.id, item.isFollowing)}
      >
        <LinearGradient
          colors={item.isFollowing ? ['#F1F3F5', '#F1F3F5'] : ['#FF8C00', '#008000']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.buttonGradient, item.isFollowing && styles.followingButton]}
        >
          {item.isFollowing ? (
            <Text style={styles.followingText}>Following</Text>
          ) : (
            <View style={styles.followBtnContent}>
              <UserPlus size={16} color="white" />
              <Text style={styles.followText}>Follow</Text>
            </View>
          )}
        </LinearGradient>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.moreButton}>
        <MoreVertical size={20} color="#999" />
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#008000" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeft size={26} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>@{currentUser.username || 'user'}</Text>
        <View style={{ width: 40 }} />
      </View>

        {/* Tab Switcher */}
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            onPress={() => setActiveTab('Followers')}
            style={[styles.tabButton, activeTab === 'Followers' && styles.activeTabButton]}
          >
            <Text style={[styles.tabText, activeTab === 'Followers' && styles.activeTabText]}>
              {followersData.length} Followers
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => setActiveTab('Following')}
            style={[styles.tabButton, activeTab === 'Following' && styles.activeTabButton]}
          >
            <Text style={[styles.tabText, activeTab === 'Following' && styles.activeTabText]}>
              {followingData.length} Following
            </Text>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Search size={20} color="#999" />
            <TextInput
              style={styles.searchInput}
              placeholder={`Search ${activeTab.toLowerCase()}...`}
              placeholderTextColor="#999"
              value={searchQuery}
              onChangeText={setSearchText}
            />
          </View>
        </View>

        {/* User List */}
        <FlatList
          data={filteredData}
          renderItem={renderUserItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconCircle}>
                <UserPlus size={32} color="#008000" />
              </View>
              <Text style={styles.emptyTitle}>
                {activeTab === 'Followers' ? 'No followers yet' : 'Not following anyone'}
              </Text>
              <Text style={styles.emptySubtitle}>
                {activeTab === 'Followers' 
                  ? 'When people follow you, they will appear here.' 
                  : 'Start following your friends to see their updates!'}
              </Text>
              <TouchableOpacity 
                style={styles.discoverBtn}
                onPress={() => {}}
              >
                <LinearGradient
                  colors={['#FF8C00', '#008000']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.discoverGradient}
                >
                  <Text style={styles.discoverBtnText}>Discover People</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}
        />
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: Platform.OS === 'android' ? 35 : 10,
    marginBottom: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111',
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F3F5',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
  },
  activeTabButton: {
    borderBottomWidth: 2,
    borderBottomColor: '#008000',
  },
  tabText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#999',
  },
  activeTabText: {
    color: '#008000',
  },
  searchContainer: {
    padding: 15,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 15,
    borderRadius: 12,
    height: 45,
    borderWidth: 1,
    borderColor: '#eee',
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    color: '#333',
  },
  listContent: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  userInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 0,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
    backgroundColor: '#eee',
  },
  activeDot: {
    position: 'absolute',
    right: 2,
    bottom: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: 'white',
  },
  nameContainer: {
    marginLeft: 15,
    flex: 1,
    minWidth: 0,
  },
  nameText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111',
  },
  usernameText: {
    fontSize: 14,
    color: '#777',
    marginTop: 2,
  },
  actionButton: {
    width: 100,
  },
  actionButtonCompact: {
    width: 84,
  },
  buttonGradient: {
    height: 34,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  followingButton: {
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  followBtnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  followText: {
    color: 'white',
    fontSize: 13,
    fontWeight: '700',
  },
  followingText: {
    color: '#333',
    fontSize: 13,
    fontWeight: '700',
  },
  moreButton: {
    padding: 5,
    marginLeft: 5,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 50,
    paddingHorizontal: 40,
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
    fontSize: 20,
    fontWeight: '900',
    color: '#111',
    marginBottom: 10,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#777',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 30,
  },
  discoverBtn: {
    borderRadius: 12,
    overflow: 'hidden',
    minWidth: 160,
  },
  discoverGradient: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  discoverBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
});

export default FollowersScreen;
