import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { registerUser } from '../lib/api';

const ROLES = [
  { key: 'donor', label: 'Donor' },
  { key: 'requester', label: 'Requester' },
  { key: 'hospital_staff', label: 'Hospital Staff' },
];

const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

export default function Register({ navigation }) {
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('donor');
  const [bloodType, setBloodType] = useState('O+');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

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

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>Create an account</Text>

      <Text style={styles.label}>Full name</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Juan dela Cruz" />

      <Text style={styles.label}>Phone number</Text>
      <TextInput
        style={styles.input}
        value={phone}
        onChangeText={setPhone}
        placeholder="09171234567"
        keyboardType="phone-pad"
      />

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="juan@email.com"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />

      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="••••••••"
        secureTextEntry
        autoCapitalize="none"
        autoCorrect={false}
      />

      <Text style={styles.label}>Role</Text>
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

      {role === 'donor' && (
        <>
          <Text style={styles.label}>Blood type</Text>
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
        </>
      )}

      <TouchableOpacity style={[styles.submit, isSubmitting && styles.submitDisabled]} onPress={handleRegister} disabled={isSubmitting}>
        <Text style={styles.submitText}>{isSubmitting ? 'Creating account...' : 'Register'}</Text>
      </TouchableOpacity>

      {!!statusMessage && <Text style={styles.statusText}>{statusMessage}</Text>}

      <TouchableOpacity style={styles.linkButton} onPress={() => navigation?.navigate('Login')}>
        <Text style={styles.linkButtonText}>Already have an account? Sign in</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    backgroundColor: '#fff',
  },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 16 },
  label: { fontSize: 14, marginTop: 12, marginBottom: 6, color: '#333' },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  roleRow: { flexDirection: 'row', marginTop: 6 },
  roleButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 8,
  },
  roleButtonActive: { backgroundColor: '#E24B4A', borderColor: '#E24B4A' },
  roleText: { color: '#333' },
  roleTextActive: { color: '#fff' },
  bloodRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 6 },
  bloodButton: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 8,
    marginBottom: 8,
  },
  bloodButtonActive: { backgroundColor: '#E24B4A', borderColor: '#E24B4A' },
  bloodText: { color: '#333' },
  bloodTextActive: { color: '#fff' },
  submit: {
    marginTop: 20,
    backgroundColor: '#E24B4A',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitDisabled: {
    opacity: 0.75,
  },
  submitText: { color: '#fff', fontWeight: '700' },
  statusText: {
    marginTop: 12,
    color: '#666',
  },
  linkButton: {
    marginTop: 14,
    alignItems: 'center',
  },
  linkButtonText: {
    color: '#E24B4A',
    fontWeight: '600',
  },
});

