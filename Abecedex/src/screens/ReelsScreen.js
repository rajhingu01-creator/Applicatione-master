import React, { useMemo, useState } from 'react';
import {
  FlatList,
  Image,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import {
  Eye,
  Flame,
  Music,
  Play,
  Plus,
  Search,
  Sparkles,
  Settings,
} from 'lucide-react-native';
import CustomBottomNav from '../components/CustomBottomNav';
import { bottomNavSpace, clamp } from '../utils/responsive';

const tabs = ['For You', 'Fresh','Trending'];

const reelsData = [];

const ReelsScreen = ({ navigation }) => {
  const { width, height } = useWindowDimensions();
  const [activeTab, setActiveTab] = useState('For You');
  
  // Adjusted height to ensure it fills the available space correctly
  const pageHeight = height; 
  const horizontalPad = clamp(width * 0.045, 14, 20);
  const compact = width < 360;

  const reelLayout = useMemo(
    () => ({
      width,
      height: pageHeight,
    }),
    [width, pageHeight]
  );

  const renderReel = ({ item, index }) => (
    <View style={[styles.reelPage, reelLayout]}>
      <Image source={{ uri: item.image }} style={styles.reelImage} />
      <LinearGradient
        colors={['rgba(0,0,0,0.4)', 'transparent', 'rgba(0,0,0,0.8)']}
        locations={[0, 0.5, 1]}
        style={StyleSheet.absoluteFill}
      />

      <View style={[styles.reelTopMeta, { left: horizontalPad, right: horizontalPad }]}>
        <View style={styles.rankPill}>
          <Flame size={13} color="#F5A400" fill="#F5A400" />
          <Text style={styles.rankText}>{item.rank}</Text>
        </View>
        <View style={styles.viewsPill}>
          <Eye size={14} color="#fff" />
          <Text style={styles.rankText}>{item.views}</Text>
        </View>
      </View>

      <TouchableOpacity activeOpacity={0.8} style={styles.sideSettingsButton}>
        <Settings size={20} color="white" />
      </TouchableOpacity>

      <TouchableOpacity activeOpacity={0.8} style={styles.playButton}>
        <LinearGradient colors={['rgba(245,164,0,0.96)', 'rgba(0,128,0,0.86)']} style={styles.playGradient}>
          <Play size={32} color="#fff" fill="#fff" />
        </LinearGradient>
      </TouchableOpacity>

      <View style={[styles.creatorPanel, { left: horizontalPad, right: horizontalPad }]}>
        <View style={styles.creatorRow}>
          <Image source={{ uri: item.avatar }} style={styles.avatar} />
          <View style={styles.creatorTextBlock}>
            <Text numberOfLines={1} style={styles.username}>{item.user}</Text>
            <Text numberOfLines={1} style={styles.name}>{item.name}</Text>
          </View>
          <TouchableOpacity activeOpacity={0.85} style={styles.followButton}>
            <Plus size={13} color="#111" strokeWidth={3} />
            <Text style={styles.followText}>Follow</Text>
          </TouchableOpacity>
        </View>

        <Text numberOfLines={2} style={[styles.title, compact && styles.titleCompact]}>{item.title}</Text>
        <View style={styles.audioRow}>
          <Music size={15} color="#fff" />
          <Text numberOfLines={1} style={styles.audioText}>{item.audio}</Text>
        </View>
        <View style={styles.chipRow}>
          <View style={styles.tagChip}>
            <Sparkles size={12} color="#17B43A" />
            <Text style={styles.tagText}>{item.tag}</Text>
          </View>
          <View style={styles.tagChip}>
            <Text style={styles.tagText}>{index + 1}/{reelsData.length}</Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.mainContent}>
        <View style={[styles.topBar, { left: horizontalPad, right: horizontalPad }]}>
          <View>
            <Text style={styles.kicker}>VIDEO LAB</Text>
            <Text style={styles.headerTitle}>Reels</Text>
          </View>
          <TouchableOpacity activeOpacity={0.82} style={styles.searchButton}>
            <Search size={21} color="#111" />
          </TouchableOpacity>
        </View>

        <View style={[styles.tabsRow, { left: horizontalPad, top: Platform.OS === 'android' ? 75 : 65 }]}>
          {tabs.map((tab) => {
            const active = activeTab === tab;
            return (
              <TouchableOpacity
                key={tab}
                activeOpacity={0.86}
                onPress={() => setActiveTab(tab)}
                style={[styles.tabButton, active && styles.tabButtonActive]}
              >
                <Text style={[styles.tabText, active && styles.tabTextActive]}>{tab}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <FlatList
          data={reelsData}
          renderItem={renderReel}
          keyExtractor={(item) => item.id}
          pagingEnabled={true}
          snapToInterval={pageHeight}
          snapToAlignment="start"
          decelerationRate="fast"
          disableIntervalMomentum={true}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          bounces={false}
          removeClippedSubviews={true}
          maxToRenderPerBatch={1}
          windowSize={2}
          initialNumToRender={1}
          getItemLayout={(_, index) => ({
            length: pageHeight,
            offset: pageHeight * index,
            index,
          })}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconCircle}>
                <Play size={32} color="#fff" fill="#fff" />
              </View>
              <Text style={styles.emptyTitle}>No reels found</Text>
              <Text style={styles.emptySubtitle}>Be the first to upload a reel and share your moments!</Text>
              <TouchableOpacity style={styles.createReelBtn}>
                <LinearGradient
                  colors={['#FF8C00', '#008000']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.createReelGradient}
                >
                  <Text style={styles.createReelBtnText}>Upload Reel</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
      <CustomBottomNav navigation={navigation} activeRoute="Reels" isDark />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  mainContent: {
    flex: 1,
    backgroundColor: '#000',
  },
  topBar: {
    position: 'absolute',
    top: Platform.OS === 'android' ? 15 : 5, // Even higher
    zIndex: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  kicker: {
    color: '#18C342',
    fontSize: 8, // Smaller
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 22, // Smaller header
    fontWeight: '900',
    lineHeight: 26,
  },
  searchButton: {
    width: 34, // Smaller button
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 4,
  },
  tabsRow: {
    position: 'absolute',
    zIndex: 5,
    flexDirection: 'row', 
    gap: 6,
  },
  tabButton: {
    minWidth: 50, // Narrower
    height: 26, // Shorter
    paddingHorizontal: 10,
    borderRadius: 13,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center', 
  },
  tabButtonActive: {
    backgroundColor: '#fff',
    borderColor: '#fff',
  },
  tabText: {
    color: '#fff',
    fontSize: 10, // Smaller text
    fontWeight: '800',
  },
  tabTextActive: {
    color: '#111',
  },
  reelPage: {
    backgroundColor: '#000',
    overflow: 'hidden', 
  },
  reelImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  reelTopMeta: {
    position: 'absolute', 
    top: Platform.OS === 'android' ? 115 : 105, // Much higher up
    zIndex: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rankPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  viewsPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  rankText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '800',
  },
  sideSettingsButton: {
    position: 'absolute',
    right: 15,
    top: '40%',
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 5,
  },
  playButton: {
    position: 'absolute',
    top: '45%',
    left: '50%',
    marginLeft: -25,
    marginTop: -25,
    width: 50,
    height: 50,
    borderRadius: 25,
    padding: 3,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  playGradient: {
    flex: 1,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 3,
  },
  creatorPanel: {
    position: 'absolute',
    bottom: 110, // Moved lower from 155 to be closer to bottom nav
    zIndex: 3,
  },
  creatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4, // Reduced
  },
  avatar: {
    width: 34, // Smaller
    height: 34,
    borderRadius: 17,
    borderWidth: 1.5,
    borderColor: '#fff',
    marginRight: 8,
  },
  creatorTextBlock: {
    flex: 1,
    minWidth: 0,
    justifyContent: 'center',
  },
  username: {
    color: '#fff',
    fontSize: 13, // Smaller
    fontWeight: '900',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  name: {
    color: 'rgba(255,255,255,0.95)',
    fontSize: 10, // Smaller
    fontWeight: '700',
    marginTop: -2,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  followButton: {
    height: 28, // Smaller
    borderRadius: 14,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255,255,255,0.95)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginLeft: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  followText: {
    color: '#111',
    fontSize: 10, // Smaller
    fontWeight: '900',
  },
  title: {
    color: '#fff',
    fontSize: 15, // Smaller height
    lineHeight: 18,
    fontWeight: '800',
    maxWidth: '100%',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  titleCompact: {
    fontSize: 13,
    lineHeight: 16,
  },
  audioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4, // Reduced
  },
  audioText: {
    flex: 1,
    color: '#fff',
    fontSize: 11, // Smaller
    fontWeight: '700',
  },
  chipRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 6, // Reduced
  },
  tagChip: {
    height: 20, // Smaller height
    paddingHorizontal: 8,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  tagText: {
    color: '#fff',
    fontSize: 9, // Smaller
    fontWeight: '800',
  },
  emptyContainer: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#fff',
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  createReelBtn: {
    borderRadius: 16,
    overflow: 'hidden',
    minWidth: 160,
  },
  createReelGradient: {
    paddingVertical: 14,
    paddingHorizontal: 25,
    alignItems: 'center',
  },
  createReelBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
});

export default ReelsScreen;
