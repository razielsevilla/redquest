import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView
} from 'react-native';
import { registerUser } from '../lib/api';

const ROLES = [
  { key: 'donor', label: 'Donor' },
  { key: 'requester', label: 'Family' },
  { key: 'hospital_staff', label: 'Hospital Staff' },
];

const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

export default function Register({ navigation }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('donor');
  const [bloodType, setBloodType] = useState('O+');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [locationAllowed, setLocationAllowed] = useState(false);

  async function handleRegister() {
    if (!name.trim() || !email.trim() || !phone.trim() || !password.trim()) {
      setStatusMessage('Fill in name, email, phone, and password.');
      return;
    }

    setIsSubmitting(true);
    setStatusMessage('Creating account...');

    try {
      await registerUser({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        password,
        role,
        blood_type: role === 'donor' ? bloodType : null,
      });

      setStatusMessage('Account created. Please sign in.');
      navigation?.navigate('Login', {
        email: email.trim().toLowerCase(),
        message: 'Account created. Sign in with your new account.',
      });
    } catch (error) {
      setStatusMessage(error.message || 'Could not create account. Try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleLocationAccess = () => {
    // In a real app, this would request Expo Location permissions
    setLocationAllowed(true);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Register</Text>
        <Text style={styles.subtitle}>Join RedQuest to turn donation into a quest.</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Full name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Juan dela Cruz"
            placeholderTextColor="#6B7280"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Mobile number</Text>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            placeholder="0917 123 4567"
            placeholderTextColor="#6B7280"
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email address</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="juan@email.com"
            placeholderTextColor="#6B7280"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            placeholderTextColor="#6B7280"
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>I am a:</Text>
          <View style={styles.roleRow}>
            {ROLES.map(r => (
              <TouchableOpacity
                key={r.key}
                style={[styles.roleButton, role === r.key && styles.roleButtonActive]}
                onPress={() => setRole(r.key)}
              >
                <Text style={[styles.roleText, role === r.key && styles.roleTextActive]}>{r.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {role === 'donor' && (
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Blood type:</Text>
            <View style={styles.bloodRow}>
              {BLOOD_TYPES.map(bt => (
                <TouchableOpacity
                  key={bt}
                  style={[styles.bloodButton, bloodType === bt && styles.bloodButtonActive]}
                  onPress={() => setBloodType(bt)}
                >
                  <Text style={[styles.bloodText, bloodType === bt && styles.bloodTextActive]}>{bt}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        <View style={styles.locationContainer}>
          <TouchableOpacity
            style={[styles.locationButton, locationAllowed && styles.locationButtonSuccess]}
            onPress={handleLocationAccess}
          >
            <Text style={[styles.locationButtonText, locationAllowed && styles.locationButtonTextSuccess]}>
              {locationAllowed ? '✓ Location access granted' : 'Allow location access'}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.submit, isSubmitting && styles.submitDisabled]}
          onPress={handleRegister}
          disabled={isSubmitting}
        >
          <Text style={styles.submitText}>{isSubmitting ? 'Creating account...' : 'Create Account'}</Text>
        </TouchableOpacity>

        {!!statusMessage && <Text style={styles.statusText}>{statusMessage}</Text>}

        <TouchableOpacity style={styles.linkButton} onPress={() => navigation?.navigate('Login')}>
          <Text style={styles.linkButtonText}>I already have an account</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#111827' },
  container: {
    flexGrow: 1,
    padding: 24,
  },
  title: { fontSize: 28, fontWeight: 'bold', color: '#F9FAFB', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#9CA3AF', marginBottom: 24 },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', color: '#D1D5DB', marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: '#374151',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#1F2937',
    color: '#F9FAFB',
    fontSize: 16,
  },
  roleRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  roleButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#374151',
    backgroundColor: '#1F2937',
  },
  roleButtonActive: { backgroundColor: '#E24B4A', borderColor: '#E24B4A' },
  roleText: { color: '#9CA3AF', fontWeight: '600' },
  roleTextActive: { color: '#fff' },
  bloodRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  bloodButton: {
    width: '22%',
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#374151',
    backgroundColor: '#1F2937',
  },
  bloodButtonActive: { backgroundColor: '#E24B4A', borderColor: '#E24B4A' },
  bloodText: { color: '#9CA3AF', fontWeight: 'bold', fontSize: 16 },
  bloodTextActive: { color: '#fff' },
  locationContainer: { marginBottom: 24, marginTop: 8 },
  locationButton: {
    borderWidth: 1,
    borderColor: '#374151',
    borderStyle: 'dashed',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: 'rgba(31, 41, 55, 0.5)',
  },
  locationButtonSuccess: {
    borderColor: '#10B981',
    borderStyle: 'solid',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  locationButtonText: { color: '#9CA3AF', fontWeight: '600' },
  locationButtonTextSuccess: { color: '#10B981' },
  submit: {
    backgroundColor: '#E24B4A',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitDisabled: { opacity: 0.75 },
  submitText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  statusText: { marginTop: 16, color: '#F59E0B', textAlign: 'center' },
  linkButton: { marginTop: 24, alignItems: 'center' },
  linkButtonText: { color: '#9CA3AF', fontWeight: '600', fontSize: 16 },
});
