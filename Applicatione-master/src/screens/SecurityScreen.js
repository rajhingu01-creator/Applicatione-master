import React, { useState } from 'react';
import { Platform, StyleSheet, Switch, Text, View } from 'react-native';
import {
  Fingerprint,
  History,
  KeyRound,
  Lock,
  Radar,
  Shield,
  Smartphone,
} from 'lucide-react-native';
import { InfoStrip, PageHero, SectionCard, SettingRow, SettingsShell } from '../components/SettingsKit';

const SecurityScreen = ({ navigation }) => {
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);

  return (
    <SettingsShell navigation={navigation} title="Security">
      <PageHero
        icon={Shield}
        eyebrow="Security Score"
        title="Your account has a strong shield"
        text="Review login protection, trusted devices and recent activity without digging through plain menus."
        metric="92/100"
      />

      <View style={styles.scoreCard}>
        <View style={styles.scoreRing}>
          <Text style={styles.scoreNumber}>92</Text>
          <Text style={styles.scoreUnit}>safe</Text>
        </View>
        <View style={styles.scoreCopy}>
          <Text style={styles.scoreTitle}>Protected sign-in</Text>
          <Text style={styles.scoreText}>Password is fresh enough, sessions look normal, and no risky login was found.</Text>
        </View>
      </View>

      <SectionCard title="Login & Recovery">
        <SettingRow
          icon={Lock}
          title="Change Password"
          detail="Last changed 3 months ago"
          onPress={() => navigation.navigate('ChangePassword')}
        />
        <SettingRow
          icon={Smartphone}
          title="Two-Factor Authentication"
          detail="Add a second approval step"
          right={
            <Switch
              value={is2FAEnabled}
              onValueChange={setIs2FAEnabled}
              trackColor={{ false: '#E8EAED', true: '#BFEAC8' }}
              thumbColor={Platform.OS === 'ios' ? '#fff' : is2FAEnabled ? '#008000' : '#fff'}
            />
          }
        />
        <SettingRow icon={KeyRound} title="Recovery Codes" detail="Backup access keys" isLast />
      </SectionCard>

      <SectionCard title="Security Checks">
        <SettingRow
          icon={Radar}
          title="Where You're Logged In"
          detail="Review active devices"
          onPress={() => navigation.navigate('LoginHistory')}
        />
        <SettingRow icon={History} title="Login Activity" detail="Recent sign-in timeline" />
        <SettingRow icon={Fingerprint} title="Device Trust" detail="Known phones and browsers" isLast />
      </SectionCard>

      <InfoStrip
        icon={Shield}
        title="Security check complete"
        text="Regularly reviewing this page keeps your account difficult to misuse."
      />
    </SettingsShell>
  );
};

const styles = StyleSheet.create({
  scoreCard: {
    minHeight: 112,
    borderRadius: 24,
    backgroundColor: '#111',
    marginTop: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  scoreRing: {
    width: 78,
    height: 78,
    borderRadius: 39,
    borderWidth: 7,
    borderColor: '#008000',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  scoreNumber: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '900',
  },
  scoreUnit: {
    color: '#BFEAC8',
    fontSize: 10,
    fontWeight: '900',
    marginTop: -2,
  },
  scoreCopy: {
    flex: 1,
    minWidth: 0,
  },
  scoreTitle: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '900',
  },
  scoreText: {
    color: 'rgba(255,255,255,0.68)',
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '700',
    marginTop: 6,
  },
});

export default SecurityScreen;
