import React, { useMemo, useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Eye, EyeOff, KeyRound, Lock, Shield } from 'lucide-react-native';
import { InfoStrip, PageHero, SettingsShell } from '../components/SettingsKit';

const PasswordField = ({ label, value, onChangeText, visible, onToggle, placeholder }) => (
  <View style={styles.inputBlock}>
    <Text style={styles.inputLabel}>{label}</Text>
    <View style={styles.inputShell}>
      <Lock size={18} color="#008000" style={styles.inputIcon} />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#9AA0A6"
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={!visible}
      />
      <TouchableOpacity onPress={onToggle} activeOpacity={0.7} style={styles.eyeButton}>
        {visible ? <EyeOff size={18} color="#73777D" /> : <Eye size={18} color="#73777D" />}
      </TouchableOpacity>
    </View>
  </View>
);

const ChangePasswordScreen = ({ navigation }) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const strength = useMemo(() => {
    let score = 0;
    if (newPassword.length >= 6) score += 1;
    if (/[A-Z]/.test(newPassword)) score += 1;
    if (/\d/.test(newPassword)) score += 1;
    if (/[^A-Za-z0-9]/.test(newPassword)) score += 1;
    return score;
  }, [newPassword]);

  const handleSubmit = () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New passwords do not match.');
      return;
    }
    if (newPassword.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long.');
      return;
    }

    Alert.alert('Success', 'Your password has been changed successfully.', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <SettingsShell navigation={navigation} title="Change Password">
      <PageHero
        icon={KeyRound}
        eyebrow="Password Vault"
        title="Refresh access without losing trust"
        text="Use a stronger password and keep your account recovery smooth."
        metric="Secure"
      />

      <View style={styles.strengthCard}>
        <View style={styles.strengthTop}>
          <Text style={styles.strengthTitle}>Password strength</Text>
          <Text style={styles.strengthScore}>{strength}/4</Text>
        </View>
        <View style={styles.barRow}>
          {[0, 1, 2, 3].map((item) => (
            <View key={item} style={[styles.bar, item < strength && styles.barActive]} />
          ))}
        </View>
        <Text style={styles.strengthHint}>Use letters, numbers, capitals and a special character.</Text>
      </View>

      <View style={styles.formCard}>
        <PasswordField
          label="Current Password"
          placeholder="Enter current password"
          value={oldPassword}
          onChangeText={setOldPassword}
          visible={showOldPassword}
          onToggle={() => setShowOldPassword(!showOldPassword)}
        />
        <PasswordField
          label="New Password"
          placeholder="Enter new password"
          value={newPassword}
          onChangeText={setNewPassword}
          visible={showNewPassword}
          onToggle={() => setShowNewPassword(!showNewPassword)}
        />
        <PasswordField
          label="Confirm New Password"
          placeholder="Confirm new password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          visible={showConfirmPassword}
          onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
        />

        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')} activeOpacity={0.75}>
          <Text style={styles.forgotText}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={0.84} onPress={handleSubmit} style={styles.submitWrap}>
          <LinearGradient colors={['#F5A400', '#008000']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.submitButton}>
            <ShieldCheck size={18} color="#fff" />
            <Text style={styles.submitText}>Update Password</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <InfoStrip
        icon={Lock}
        title="Keep it private"
        text="Never reuse passwords from other apps or share OTPs with anyone."
      />
    </SettingsShell>
  );
};

const styles = StyleSheet.create({
  strengthCard: {
    borderRadius: 24,
    backgroundColor: '#111',
    padding: 16,
    marginTop: 16,
  },
  strengthTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  strengthTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '900',
  },
  strengthScore: {
    color: '#F5A400',
    fontSize: 14,
    fontWeight: '900',
  },
  barRow: {
    flexDirection: 'row',
    gap: 7,
    marginTop: 14,
  },
  bar: {
    flex: 1,
    height: 7,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.16)',
  },
  barActive: {
    backgroundColor: '#008000',
  },
  strengthHint: {
    color: 'rgba(255,255,255,0.68)',
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '700',
    marginTop: 12,
  },
  formCard: {
    borderRadius: 24,
    backgroundColor: '#fff',
    padding: 15,
    marginTop: 18,
    borderWidth: 1,
    borderColor: '#EEF0EA',
  },
  inputBlock: {
    marginBottom: 16,
  },
  inputLabel: {
    color: '#17191B',
    fontSize: 13,
    fontWeight: '900',
    marginBottom: 8,
    marginLeft: 3,
  },
  inputShell: {
    height: 56,
    borderRadius: 18,
    backgroundColor: '#F7F8F5',
    borderWidth: 1,
    borderColor: '#E7EAE4',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: '#111',
    fontSize: 15,
    fontWeight: '700',
  },
  eyeButton: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  forgotText: {
    color: '#008000',
    fontSize: 13,
    fontWeight: '900',
    textAlign: 'right',
    marginTop: -2,
  },
  submitWrap: {
    marginTop: 22,
  },
  submitButton: {
    height: 56,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  submitText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '900',
  },
});

export default ChangePasswordScreen;
