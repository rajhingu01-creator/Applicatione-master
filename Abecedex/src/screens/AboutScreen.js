import React from 'react';
import { StyleSheet } from 'react-native';
import {
  FileText,
  Info,
  Shield,
} from 'lucide-react-native';
import { SectionCard, SettingRow, SettingsShell } from '../components/SettingsKit';

const AboutScreen = ({ navigation }) => {
  return (
    <SettingsShell navigation={navigation} title="About">
      <SectionCard title="App Info">
        <SettingRow icon={Info} title="About this account" detail="Joined, reach and profile context" />
        <SettingRow icon={Shield} title="Privacy policy" detail="How your data is handled" />
        <SettingRow icon={FileText} title="Terms of use" detail="Rules and platform expectations" isLast />
      </SectionCard>
    </SettingsShell>
  );
};

const styles = StyleSheet.create({});

export default AboutScreen;
