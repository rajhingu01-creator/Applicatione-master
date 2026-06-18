import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  BadgeCheck,
  Mail,
  Shield,
  Smartphone,
  Sparkles,
  User,
} from 'lucide-react-native';
import { InfoStrip, PageHero, SectionCard, SettingRow, SettingsShell } from '../components/SettingsKit';

const AccountSettingsScreen = ({ navigation }) => {
  return (
    <SettingsShell navigation={navigation} title="Account">
      <PageHero
        icon={User}
        eyebrow="Identity Center"
        title="Keep your profile sharp and trusted"
        text="Manage personal info, contact details and security routes from one cleaner hub."
        metric="Verified"
      />

      <View style={styles.profileCard}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=200&auto=format&fit=crop' }}
          style={styles.avatar}
        />
        <View style={styles.profileCopy}>
          <Text numberOfLines={1} style={styles.name}>Sam Brown</Text>
          <Text numberOfLines={1} style={styles.handle}>@sam_perry</Text>
        </View>
        <TouchableOpacity activeOpacity={0.84}>
          <LinearGradient colors={['#F5A400', '#008000']} style={styles.editButton}>
            <Text style={styles.editText}>Edit</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <InfoStrip
        icon={Sparkles}
        title="Profile health is strong"
        text="Your account has a good setup for discovery and secure recovery."
      />

      <SectionCard title="Profile Details">
        <SettingRow icon={User} title="Personal Information" detail="Name, birthday, gender" />
        <SettingRow icon={Mail} title="Email Address" detail="samperry@gmail.com" />
        <SettingRow icon={Smartphone} title="Phone Number" detail="+91 98765 43210" isLast />
      </SectionCard>

      <SectionCard title="Trust & Access">
        <SettingRow
          icon={Shield}
          title="Password and Security"
          detail="Password, sessions, two-factor"
          onPress={() => navigation.navigate('Security')}
        />
        <SettingRow icon={BadgeCheck} title="Verification Status" detail="Creator profile verified" isLast />
      </SectionCard>
    </SettingsShell>
  );
};

const styles = StyleSheet.create({
  profileCard: {
    minHeight: 88,
    borderRadius: 24,
    backgroundColor: '#fff',
    marginTop: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EEF0EA',
  },
  avatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    marginRight: 12,
  },
  profileCopy: {
    flex: 1,
    minWidth: 0,
  },
  name: {
    color: '#111',
    fontSize: 18,
    fontWeight: '900',
  },
  handle: {
    color: '#777D82',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 3,
  },
  editButton: {
    height: 38,
    borderRadius: 19,
    paddingHorizontal: 17,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '900',
  },
});

export default AccountSettingsScreen;
