import React from 'react';
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, ChevronRight } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { spacingForWidth } from '../utils/responsive';

export const SettingsShell = ({ navigation, title, children }) => {
  const { width } = useWindowDimensions();
  const { screen } = spacingForWidth(width);

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.safeArea}>
        <View style={[styles.header, { paddingHorizontal: screen }]}>
          <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.75} style={styles.backButton}>
            <ArrowLeft size={23} color="#111" />
          </TouchableOpacity>
          <Text numberOfLines={1} style={styles.headerTitle}>{title}</Text>
          <View style={styles.headerSpacer} />
        </View>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[styles.scrollContent, { paddingHorizontal: screen }]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export const PageHero = ({ icon: Icon, eyebrow, title, text, metric, colors = ['#FFF7E7', '#F6FFF7'] }) => (
  <LinearGradient colors={colors} style={styles.hero}>
    <View style={styles.heroTop}>
      <View style={styles.heroIcon}>
        <Icon size={25} color="#fff" strokeWidth={2.5} />
      </View>
      {metric ? (
        <View style={styles.metricPill}>
          <Text style={styles.metricText}>{metric}</Text>
        </View>
      ) : null}
    </View>
    <Text style={styles.eyebrow}>{eyebrow}</Text>
    <Text style={styles.heroTitle}>{title}</Text>
    <Text style={styles.heroText}>{text}</Text>
  </LinearGradient>
);

export const InfoStrip = ({ icon: Icon, title, text }) => (
  <View style={styles.infoStrip}>
    <View style={styles.infoIcon}>
      <Icon size={18} color="#fff" />
    </View>
    <View style={styles.infoCopy}>
      <Text style={styles.infoTitle}>{title}</Text>
      <Text numberOfLines={2} style={styles.infoText}>{text}</Text>
    </View>
  </View>
);

export const SectionCard = ({ title, children }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <View style={styles.card}>{children}</View>
  </View>
);

export const SettingRow = ({ icon: Icon, title, detail, onPress, right, danger, isLast }) => (
  <TouchableOpacity
    activeOpacity={0.78}
    onPress={onPress}
    disabled={!onPress}
    style={[styles.row, isLast && styles.rowLast]}
  >
    <View style={styles.rowLeft}>
      <View style={[styles.rowIcon, danger && styles.rowIconDanger]}>
        <Icon size={20} color={danger ? '#FF3B30' : '#008000'} strokeWidth={2.25} />
      </View>
      <View style={styles.rowCopy}>
        <Text numberOfLines={1} style={[styles.rowTitle, danger && styles.rowTitleDanger]}>{title}</Text>
        {detail ? <Text numberOfLines={1} style={styles.rowDetail}>{detail}</Text> : null}
      </View>
    </View>
    {right || (onPress ? <ChevronRight size={19} color="#B6BABF" /> : null)}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8F5',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'android' ? 30 : 8,
    paddingBottom: 14,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  headerTitle: {
    flex: 1,
    color: '#111',
    fontSize: 20,
    fontWeight: '900',
    textAlign: 'center',
    marginHorizontal: 10,
  },
  headerSpacer: {
    width: 42,
    height: 42,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 34,
  },
  hero: {
    borderRadius: 26,
    padding: 17,
    borderWidth: 1,
    borderColor: 'rgba(0,128,0,0.12)',
    overflow: 'hidden',
  },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  heroIcon: {
    width: 54,
    height: 54,
    borderRadius: 20,
    backgroundColor: '#008000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricPill: {
    minHeight: 34,
    borderRadius: 17,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricText: {
    color: '#111',
    fontSize: 13,
    fontWeight: '900',
  },
  eyebrow: {
    color: '#008000',
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  heroTitle: {
    color: '#111',
    fontSize: 25,
    lineHeight: 30,
    fontWeight: '900',
    marginTop: 4,
  },
  heroText: {
    color: '#626970',
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '700',
    marginTop: 8,
  },
  infoStrip: {
    minHeight: 64,
    borderRadius: 22,
    backgroundColor: '#111',
    marginTop: 16,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#008000',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },
  infoCopy: {
    flex: 1,
    minWidth: 0,
  },
  infoTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '900',
  },
  infoText: {
    color: 'rgba(255,255,255,0.72)',
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '700',
    marginTop: 2,
  },
  section: {
    marginTop: 22,
  },
  sectionTitle: {
    color: '#777D82',
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
    marginBottom: 9,
    paddingHorizontal: 2,
  },
  card: {
    borderRadius: 24,
    backgroundColor: '#fff',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#EEF0EA',
  },
  row: {
    minHeight: 72,
    paddingHorizontal: 13,
    paddingVertical: 11,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F1EF',
  },
  rowLast: {
    borderBottomWidth: 0,
  },
  rowLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 0,
    paddingRight: 8,
  },
  rowIcon: {
    width: 42,
    height: 42,
    borderRadius: 16,
    backgroundColor: '#F2FBF3',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  rowIconDanger: {
    backgroundColor: '#FFF0F0',
  },
  rowCopy: {
    flex: 1,
    minWidth: 0,
  },
  rowTitle: {
    color: '#17191B',
    fontSize: 15,
    fontWeight: '900',
  },
  rowTitleDanger: {
    color: '#FF3B30',
  },
  rowDetail: {
    color: '#858A90',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 4,
  },
});
