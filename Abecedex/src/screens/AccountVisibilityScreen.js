import React, { useState } from 'react';
import { StyleSheet, Text, View, Switch } from 'react-native';
import { Eye, Lock, Globe } from 'lucide-react-native';
import { SettingsShell, SectionCard, SettingRow, PageHero } from '../components/SettingsKit';

const AccountVisibilityScreen = ({ navigation }) => {
  const [isPrivate, setIsPrivate] = useState(false);

  return (
    <SettingsShell navigation={navigation} title="Account Visibility">
      <PageHero 
        icon={Eye}
        eyebrow="Privacy"
        title="Who can see your content"
        text="Manage your account visibility and control how people interact with your profile."
      />

      <SectionCard title="Visibility Status">
        <SettingRow 
          icon={isPrivate ? Lock : Globe}
          title="Private Account"
          detail={isPrivate ? "Only approved people can see your posts" : "Anyone can see your posts and reels"}
          right={
            <Switch
              value={isPrivate}
              onValueChange={setIsPrivate}
              trackColor={{ false: '#E8EAED', true: '#BFEAC8' }}
              thumbColor={isPrivate ? '#008000' : '#fff'}
            />
          }
          isLast
        />
      </SectionCard>

      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          When your account is private, only people you approve can see your photos and videos. Your existing followers won't be affected.
        </Text>
      </View>
    </SettingsShell>
  );
};

const styles = StyleSheet.create({
  infoBox: {
    marginTop: 16,
    paddingHorizontal: 4,
  },
  infoText: {
    fontSize: 13,
    color: '#626970',
    lineHeight: 18,
    fontWeight: '500',
  },
});

export default AccountVisibilityScreen;
