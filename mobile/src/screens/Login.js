import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
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
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>Welcome back</Text>
      <Text style={styles.subtitle}>Sign in now. The JWT is stored locally for the demo.</Text>

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
      <View style={styles.passwordRow}>
        <TextInput
          style={[styles.input, styles.passwordInput]}
          value={password}
          onChangeText={setPassword}
          placeholder="••••••••"
          secureTextEntry={!showPassword}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TouchableOpacity style={styles.toggleButton} onPress={() => setShowPassword((current) => !current)}>
          <Text style={styles.toggleButtonText}>{showPassword ? 'Hide' : 'Show'}</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.submit, isSubmitting && styles.submitDisabled]}
        onPress={handleLogin}
        disabled={isSubmitting}
      >
        <Text style={styles.submitText}>{isSubmitting ? 'Signing in...' : 'Sign in'}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.secondaryButton} onPress={handleClearSession}>
        <Text style={styles.secondaryButtonText}>Clear local session</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.linkButton} onPress={() => navigation?.navigate('Register')}>
        <Text style={styles.linkButtonText}>Need an account? Register here</Text>
      </TouchableOpacity>

      {!!storedEmail && <Text style={styles.sessionText}>Stored session: {storedEmail}</Text>}
      {!!statusMessage && <Text style={styles.statusText}>{statusMessage}</Text>}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginTop: 12,
    marginBottom: 6,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  passwordInput: {
    flex: 1,
  },
  toggleButton: {
    marginLeft: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  toggleButtonText: {
    color: '#333',
    fontWeight: '600',
  },
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
  submitText: {
    color: '#fff',
    fontWeight: '700',
  },
  secondaryButton: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#E24B4A',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#E24B4A',
    fontWeight: '700',
  },
  linkButton: {
    marginTop: 14,
    alignItems: 'center',
  },
  linkButtonText: {
    color: '#E24B4A',
    fontWeight: '600',
  },
  sessionText: {
    marginTop: 16,
    color: '#444',
  },
  statusText: {
    marginTop: 8,
    color: '#666',
  },
});
