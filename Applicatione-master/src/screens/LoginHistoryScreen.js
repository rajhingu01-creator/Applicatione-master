import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {
  AlertCircle,
  Clock,
  Laptop,
  LocateFixed,
  LogOut,
  MoreVertical,
  Radar,
  Shield,
  Smartphone,
} from 'lucide-react-native';
import { InfoStrip, PageHero, SettingsShell } from '../components/SettingsKit';

const loginData = [
  {
    id: '1',
    deviceName: 'iPhone 15 Pro Max',
    location: 'Mumbai, India',
    date: 'June 02, 2026',
    time: '10:30 AM',
    isActive: true,
    browser: 'Changis App',
    type: 'phone',
  },
  {
    id: '2',
    deviceName: 'Samsung Galaxy S24 Ultra',
    location: 'Surat, India',
    date: 'May 28, 2026',
    time: '04:15 PM',
    isActive: false,
    browser: 'Chrome Mobile',
    type: 'phone',
  },
  {
    id: '3',
    deviceName: 'MacBook Pro 16"',
    location: 'Ahmedabad, India',
    date: 'May 20, 2026',
    time: '11:00 AM',
    isActive: false,
    browser: 'Safari',
    type: 'desktop',
  },
  {
    id: '4',
    deviceName: 'Google Pixel 8',
    location: 'Delhi, India',
    date: 'May 15, 2026',
    time: '09:45 AM',
    isActive: false,
    browser: 'Changis App',
    type: 'phone',
  },
];

const LoginHistoryScreen = ({ navigation }) => {
  return (
    <SettingsShell navigation={navigation} title="Login History">
      <PageHero
        icon={Shield}
        eyebrow="Security Audit"
        title="Check where you're signed in"
        text="Review active sessions across devices and log out from any unfamiliar activity to keep your account safe."
      />

      <View style={styles.listContainer}>
        {loginData.map((item) => (
          <View key={item.id} style={styles.loginItem}>
            <View style={styles.deviceIcon}>
              {item.type === 'phone' ? <Smartphone size={22} color="#008000" /> : <Laptop size={22} color="#008000" />}
            </View>
            <View style={styles.loginInfo}>
              <View style={styles.nameRow}>
                <Text style={styles.deviceName}>{item.deviceName}</Text>
                {item.isActive && <View style={styles.activeTag}><Text style={styles.activeText}>Active Now</Text></View>}
              </View>
              <Text style={styles.locationText}>{item.location} • {item.browser}</Text>
              <View style={styles.timeRow}>
                <Clock size={12} color="#73777D" />
                <Text style={styles.timeText}>{item.date} at {item.time}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.moreButton}>
              <MoreVertical size={20} color="#73777D" />
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.logoutAllButton}>
        <LogOut size={18} color="#FF3B30" />
        <Text style={styles.logoutAllText}>Log Out from All Other Sessions</Text>
      </TouchableOpacity>

      <InfoStrip
        icon={AlertCircle}
        text="If you see a device you don't recognize, we recommend changing your password immediately."
      />
    </SettingsShell>
  );
};

const styles = StyleSheet.create({
  timelineCard: {
    borderRadius: 24,
    backgroundColor: '#fff',
    marginTop: 20,
    padding: 15,
    borderWidth: 1,
    borderColor: '#EEF0EA',
  },
  timelineHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  timelineTitle: {
    color: '#111',
    fontSize: 17,
    fontWeight: '900',
  },
  liveBadge: {
    height: 30,
    borderRadius: 15,
    paddingHorizontal: 10,
    backgroundColor: '#F2FBF3',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  liveText: {
    color: '#008000',
    fontSize: 12,
    fontWeight: '900',
  },
  sessionRow: {
    flexDirection: 'row',
  },
  timelineRail: {
    width: 24,
    alignItems: 'center',
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#D6DBD4',
    marginTop: 23,
  },
  dotActive: {
    backgroundColor: '#008000',
  },
  line: {
    flex: 1,
    width: 2,
    backgroundColor: '#EEF0EA',
    marginTop: 4,
  },
  sessionCard: {
    flex: 1,
    borderRadius: 20,
    backgroundColor: '#F8F9F6',
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#EEF0EA',
  },
  sessionCardActive: {
    backgroundColor: '#F3FBF4',
    borderColor: '#BFEAC8',
  },
  sessionTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deviceIcon: {
    width: 42,
    height: 42,
    borderRadius: 16,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  sessionCopy: {
    flex: 1,
    minWidth: 0,
  },
  deviceNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 0,
  },
  deviceName: {
    flex: 1,
    color: '#111',
    fontSize: 14,
    fontWeight: '900',
  },
  activeBadge: {
    height: 22,
    borderRadius: 11,
    paddingHorizontal: 8,
    backgroundColor: '#008000',
    justifyContent: 'center',
    marginLeft: 6,
  },
  activeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '900',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 5,
  },
  metaText: {
    flex: 1,
    color: '#7D8389',
    fontSize: 12,
    fontWeight: '700',
  },
  moreButton: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutAllButton: {
    height: 54,
    borderRadius: 20,
    backgroundColor: '#FFF0F0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 22,
  },
  logoutAllText: {
    color: '#FF3B30',
    fontSize: 15,
    fontWeight: '900',
  },
});

export default LoginHistoryScreen;
