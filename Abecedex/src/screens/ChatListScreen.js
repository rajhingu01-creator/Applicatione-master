import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Search, 
  Plus, 
  MessageSquare, 
  Camera,
  Edit3,
  Phone,
  Video,
  ArrowUpRight,
  ArrowDownLeft,
  PhoneMissed,
  ArrowLeft,
  Clock,
  MessageCircle,
  Users,
  PhoneCall,
  X,
  RefreshCw,
  ShieldCheck,
} from 'lucide-react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { StatusBar } from 'expo-status-bar';
import CustomBottomNav from '../components/CustomBottomNav';
import { bottomNavSpace, spacingForWidth } from '../utils/responsive';

const ChatListScreen = ({ navigation }) => {
  const { width } = useWindowDimensions();
  const { compact } = spacingForWidth(width);
  const cardWidth = Math.min(width - 30, 430);
  const [activeTab, setActiveTab] = useState('All');
  const [permission, requestPermission] = useCameraPermissions();
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [facing, setFacing] = useState('back');

  if (isCameraOpen) {
    if (!permission) {
      return <View style={styles.container} />;
    }

    if (!permission.granted) {
      return (
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionText}>We need your permission to show the camera</Text>
          <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.closeCameraButton} onPress={() => setIsCameraOpen(false)}>
            <X size={30} color="white" />
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.cameraContainer}>
        <CameraView style={styles.camera} facing={facing}>
          <View style={styles.cameraControls}>
            <TouchableOpacity style={styles.cameraIcon} onPress={() => setIsCameraOpen(false)}>
              <X size={28} color="white" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.cameraIcon} 
              onPress={() => setFacing(current => (current === 'back' ? 'front' : 'back'))}
            >
              <RefreshCw size={28} color="white" />
            </TouchableOpacity>
          </View>
          <View style={styles.captureContainer}>
            <TouchableOpacity style={styles.captureButton} onPress={() => console.log('Capture!')}>
              <View style={styles.captureInner} />
            </TouchableOpacity>
          </View>
        </CameraView>
      </View>
    );
  }

  const activeUsers = [];

  const chats = [];

  const calls = [];

  const filteredChats = chats.filter(chat => {
    if (activeTab === 'Unread') return chat.unread > 0;
    if (activeTab === 'Groups') return chat.isGroup;
    return true;
  });

  const tabs = [
    { name: 'All', icon: MessageCircle },
    { name: 'Unread', icon: Clock },
    { name: 'Groups', icon: Users },
    { name: 'Calls', icon: PhoneCall },
  ];

  const renderActiveUser = ({ item }) => (
    <TouchableOpacity style={styles.activeUserContainer} activeOpacity={0.9}>
      <View style={styles.activeUserCard}>
        <Image source={{ uri: item.image }} style={styles.activeAvatar} />
        {item.isStory ? (
          <View style={styles.addStoryBadge}>
            <Plus size={10} color="white" />
          </View>
        ) : (
          <View style={styles.onlineBadge} />
        )}
      </View>
      <Text style={styles.activeUserName} numberOfLines={1}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderChatItem = ({ item }) => (
    <TouchableOpacity 
      style={[styles.chatItem, item.unread > 0 && styles.chatItemUnread]}
      onPress={() => navigation.navigate('IndividualChat', {
        userName: item.name,
        userImage: item.image
      })}
    >
      <View style={styles.chatAvatarWrap}>
        <Image source={{ uri: item.image }} style={styles.chatAvatar} />
        {item.unread > 0 && <View style={styles.priorityDot} />}
      </View>
      <View style={styles.chatInfo}>
        <View style={styles.chatHeader}>
          <Text style={styles.chatName}>{item.name}</Text>
          <Text style={[styles.chatTime, item.unread > 0 && styles.unreadTime]}>{item.time}</Text>
        </View>
        <View style={styles.chatFooter}>
          <Text style={styles.chatMessage} numberOfLines={1}>{item.message}</Text>
          {item.unread > 0 && (
            <LinearGradient
              colors={['#FF8C00', '#008000']}
              style={styles.unreadBadge}
            >
              <Text style={styles.unreadCount}>{item.unread}</Text>
            </LinearGradient>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderCallItem = ({ item }) => (
    <TouchableOpacity style={styles.chatItem}>
      <View style={styles.chatAvatarWrap}>
        <Image source={{ uri: item.image }} style={styles.chatAvatar} />
      </View>
      <View style={styles.chatInfo}>
        <View style={styles.chatHeader}>
          <Text style={[styles.chatName, item.status === 'missed' && { color: '#FF3B30' }]}>{item.name}</Text>
          <Text style={styles.chatTime}>{item.time}</Text>
        </View>
        <View style={styles.chatFooter}>
          <View style={styles.callStatusRow}>
            {item.status === 'missed' ? (
              <PhoneMissed size={14} color="#FF3B30" />
            ) : item.status === 'incoming' ? (
              <ArrowDownLeft size={14} color="#008000" />
            ) : (
              <ArrowUpRight size={14} color="#008000" />
            )}
            <Text style={styles.callStatusText}>
              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            </Text>
          </View>
          <TouchableOpacity>
            {item.type === 'video' ? (
              <Video size={20} color="#008000" />
            ) : (
              <Phone size={20} color="#008000" />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <>
      <View style={styles.activeSection}>
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Active Now</Text>
            <Text style={styles.sectionSubtitle}>People online nearby</Text>
          </View>
          <TouchableOpacity><Text style={styles.seeAllText}>See all</Text></TouchableOpacity>
        </View>
        <FlatList
          data={activeUsers}
          renderItem={renderActiveUser}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.activeList}
        />
      </View>

      <View style={[styles.tabContainer, compact && styles.tabContainerCompact]}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.name;
          return (
            <TouchableOpacity
              key={tab.name}
              onPress={() => setActiveTab(tab.name)}
              style={[styles.tabButton, compact && styles.tabButtonCompact, isActive && styles.activeTabButton]}
            >
              {isActive ? (
                <LinearGradient
                  colors={['#FF8C00', '#008000']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.tabGradient}
                >
                  <Icon size={14} color="#fff" />
                  <Text style={[styles.tabText, styles.activeTabText]}>{tab.name}</Text>
                </LinearGradient>
              ) : (
                <>
                  <Icon size={14} color="#777" />
                  <Text style={styles.tabText}>{tab.name}</Text>
                  {tab.name === 'Unread' && chats.some(c => c.unread > 0) && (
                    <View style={styles.dotBadge} />
                  )}
                </>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.safeArea}>
        {/* Sticky Top Panel */}
        <View style={styles.topPanel}>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <ArrowLeft size={26} color="#111" />
              </TouchableOpacity>
              <View>
                <Text style={styles.headerTitle}>Messages</Text>
              </View>
            </View>
            <View style={[styles.headerIcons, compact && styles.headerIconsCompact]}>
              <TouchableOpacity style={styles.headerIcon} onPress={() => setIsCameraOpen(true)}>
                <Camera size={20} color="#333" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerIcon}>
                <Edit3 size={20} color="#333" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.searchContainer}>
            <View style={styles.searchBar}>
              <Search size={19} color="#777" />
              <Text style={styles.searchText}>Search messages...</Text>
              <ShieldCheck size={18} color="#008000" />
            </View>
          </View>
        </View>

        <FlatList
          data={activeTab === 'Calls' ? calls : filteredChats}
          renderItem={activeTab === 'Calls' ? renderCallItem : renderChatItem}
          keyExtractor={item => item.id}
          ListHeaderComponent={renderHeader}
          contentContainerStyle={styles.chatList}
          showsVerticalScrollIndicator={false}
          stickyHeaderIndices={[]}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconCircle}>
                <MessageCircle size={32} color="#008000" />
              </View>
              <Text style={styles.emptyTitle}>
                {activeTab === 'Calls' ? 'No calls yet' : 'No messages yet'}
              </Text>
              <Text style={styles.emptySubtitle}>
                {activeTab === 'Calls' 
                  ? 'Your call history will appear here once you start calling.' 
                  : 'Start a conversation with your friends to see them here.'}
              </Text>
              <TouchableOpacity style={styles.startChatBtn}>
                <LinearGradient
                  colors={['#FF8C00', '#008000']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.startChatGradient}
                >
                  <Text style={styles.startChatBtnText}>
                    {activeTab === 'Calls' ? 'Make a Call' : 'Start Chatting'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}
        />

        <TouchableOpacity style={styles.fabContainer}>
          <LinearGradient
            colors={['#FF8C00', '#008000']}
            style={styles.fab}
          >
            <MessageSquare size={24} color="white" />
          </LinearGradient>
        </TouchableOpacity>
      </SafeAreaView>
      <CustomBottomNav navigation={navigation} activeRoute="Chat" />
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
  topPanel: {
    paddingTop: Platform.OS === 'android' ? 45 : 10,
    paddingBottom: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 0.5,
    borderBottomColor: '#efefef',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 14,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 5,
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: '900',
    color: '#111',
    letterSpacing: -0.5,
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 15,
  },
  headerIconsCompact: {
    gap: 8,
  },
  headerIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    paddingHorizontal: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 12,
  },
  searchText: {
    flex: 1,
    marginLeft: 10,
    color: '#777',
    fontSize: 15,
  },
  activeSection: {
    paddingVertical: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111',
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#777',
    marginTop: 2,
  },
  seeAllText: {
    color: '#008000',
    fontWeight: '600',
    fontSize: 14,
  },
  activeList: {
    paddingLeft: 20,
    paddingRight: 10,
  },
  activeUserContainer: {
    alignItems: 'center',
    marginRight: 18,
    width: 65,
  },
  activeUserCard: {
    position: 'relative',
    marginBottom: 8,
  },
  activeAvatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    borderWidth: 2.5,
    borderColor: '#fff',
  },
  addStoryBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    backgroundColor: '#008000',
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: '#4CAF50',
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#fff',
  },
  activeUserName: {
    fontSize: 12,
    color: '#444',
    textAlign: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 10,
    gap: 10,
  },
  tabContainerCompact: {
    gap: 6,
    paddingHorizontal: 15,
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#efefef',
    gap: 6,
  },
  tabButtonCompact: {
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  activeTabButton: {
    paddingHorizontal: 0,
    paddingVertical: 0,
    borderWidth: 0,
    overflow: 'hidden',
  },
  tabGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 6,
  },
  tabText: {
    fontSize: 13,
    color: '#777',
    fontWeight: '600',
  },
  activeTabText: {
    color: '#fff',
  },
  dotBadge: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FF8C00',
  },
  chatList: {
    paddingBottom: bottomNavSpace + 80,
  },
  chatItem: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    marginBottom: 1,
  },
  chatItemUnread: {
    backgroundColor: '#f0f9f1',
  },
  chatAvatarWrap: {
    position: 'relative',
    marginRight: 15,
  },
  chatAvatar: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
  },
  priorityDot: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#FF8C00',
    borderWidth: 2,
    borderColor: '#fff',
  },
  chatInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  chatName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
  },
  chatTime: {
    fontSize: 12,
    color: '#999',
  },
  unreadTime: {
    color: '#008000',
    fontWeight: '600',
  },
  chatFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chatMessage: {
    fontSize: 14,
    color: '#666',
    flex: 1,
    marginRight: 10,
  },
  unreadBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 20,
    alignItems: 'center',
  },
  unreadCount: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  callStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  callStatusText: {
    fontSize: 13,
    color: '#777',
  },
  fabContainer: {
    position: 'absolute',
    right: 20,
    bottom: bottomNavSpace + 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  permissionContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  permissionText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  permissionButton: {
    backgroundColor: '#008000',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeCameraButton: {
    position: 'absolute',
    top: 50,
    right: 20,
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  cameraControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 50,
  },
  cameraIcon: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureContainer: {
    position: 'absolute',
    bottom: 40,
    width: '100%',
    alignItems: 'center',
  },
  captureButton: {
    width: 75,
    height: 75,
    borderRadius: 37.5,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#fff',
  },
  captureInner: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
    backgroundColor: '#fff',
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
  startChatBtn: {
    borderRadius: 16,
    overflow: 'hidden',
    minWidth: 160,
  },
  startChatGradient: {
    paddingVertical: 14,
    paddingHorizontal: 25,
    alignItems: 'center',
  },
  startChatBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
});

export default ChatListScreen;
