import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView
} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { loginUser } from '../lib/api';

const AUTH_TOKEN_KEY = 'redquest.authToken';
const AUTH_EMAIL_KEY = 'redquest.authEmail';
const AUTH_ROLE_KEY = 'redquest.authRole';
const AUTH_USER_KEY = 'redquest.authUser';

export default function Login({ navigation, route }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [storedEmail, setStoredEmail] = useState('');

  useEffect(() => {
    let mounted = true;

    if (route?.params?.email) {
      setEmail(route.params.email);
    }

    if (route?.params?.message) {
      setStatusMessage(route.params.message);
    }

    async function loadStoredSession() {
      const savedEmail = await SecureStore.getItemAsync(AUTH_EMAIL_KEY);
      if (mounted && savedEmail) {
        setStoredEmail(savedEmail);
      }
    }

    loadStoredSession();

    return () => {
      mounted = false;
    };
  }, []);

  async function handleLogin() {
    if (!email.trim() || !password.trim()) {
      setStatusMessage('Enter your email and password to continue.');
      return;
    }

    setIsSubmitting(true);
    setStatusMessage('Signing in...');

    try {
      const response = await loginUser({
        email: email.trim().toLowerCase(),
        password,
      });

      const token = response?.token;
      const user = response?.user;

      if (!token || !user) {
        throw new Error('Invalid login response from server');
      }

      await SecureStore.setItemAsync(AUTH_TOKEN_KEY, token);
      await SecureStore.setItemAsync(AUTH_EMAIL_KEY, email.trim().toLowerCase());
      await SecureStore.setItemAsync(AUTH_ROLE_KEY, user.role || '');
      await SecureStore.setItemAsync(AUTH_USER_KEY, JSON.stringify(user));
      setStoredEmail(email.trim().toLowerCase());
      setStatusMessage('Signed in successfully.');
      navigation?.navigate(user.role === 'donor' ? 'Donor' : 'Requester');
    } catch (error) {
      setStatusMessage(error.message || 'Could not sign in. Try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleClearSession() {
    await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
    await SecureStore.deleteItemAsync(AUTH_EMAIL_KEY);
    await SecureStore.deleteItemAsync(AUTH_ROLE_KEY);
    await SecureStore.deleteItemAsync(AUTH_USER_KEY);
    setStoredEmail('');
    setStatusMessage('Local session cleared.');
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>Sign in to continue your quest.</Text>

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
          <View style={styles.passwordRow}>
            <TextInput
              style={[styles.input, styles.passwordInput]}
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              placeholderTextColor="#6B7280"
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity style={styles.toggleButton} onPress={() => setShowPassword((current) => !current)}>
              <Text style={styles.toggleButtonText}>{showPassword ? 'Hide' : 'Show'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.submit, isSubmitting && styles.submitDisabled]}
          onPress={handleLogin}
          disabled={isSubmitting}
        >
          <Text style={styles.submitText}>{isSubmitting ? 'Signing in...' : 'Sign in'}</Text>
        </TouchableOpacity>

        {!!statusMessage && <Text style={styles.statusText}>{statusMessage}</Text>}

        <TouchableOpacity style={styles.linkButton} onPress={() => navigation?.navigate('Register')}>
          <Text style={styles.linkButtonText}>Need an account? Register here</Text>
        </TouchableOpacity>

        {!!storedEmail && (
          <TouchableOpacity style={styles.secondaryButton} onPress={handleClearSession}>
            <Text style={styles.secondaryButtonText}>Clear local session ({storedEmail})</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#111827' },
  container: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#F9FAFB',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#9CA3AF',
    marginBottom: 32,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#D1D5DB',
    marginBottom: 8,
  },
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
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  passwordInput: {
    flex: 1,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    borderRightWidth: 0,
  },
  toggleButton: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: '#1F2937',
    borderWidth: 1,
    borderColor: '#374151',
    borderLeftWidth: 0,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    justifyContent: 'center',
  },
  toggleButtonText: {
    color: '#9CA3AF',
    fontWeight: '600',
  },
  submit: {
    marginTop: 12,
    backgroundColor: '#E24B4A',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitDisabled: {
    opacity: 0.75,
  },
  submitText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  secondaryButton: {
    marginTop: 40,
    borderWidth: 1,
    borderColor: '#374151',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#9CA3AF',
    fontWeight: '600',
  },
  linkButton: {
    marginTop: 24,
    alignItems: 'center',
  },
  linkButtonText: {
    color: '#E24B4A',
    fontWeight: '600',
    fontSize: 16,
  },
  statusText: {
    marginTop: 16,
    color: '#F59E0B',
    textAlign: 'center',
    fontWeight: '500',
  },
});
