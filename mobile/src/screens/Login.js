import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Animated,
  StatusBar,
  Dimensions,
} from 'react-native';
import Svg, {
  Path,
  Defs,
  LinearGradient,
  Stop,
} from 'react-native-svg';
import * as storage from '../lib/storage';
import { loginUser } from '../lib/api';

const { height } = Dimensions.get('window');

const AUTH_TOKEN_KEY = 'redquest.authToken';
const AUTH_EMAIL_KEY = 'redquest.authEmail';
const AUTH_ROLE_KEY = 'redquest.authRole';
const AUTH_USER_KEY = 'redquest.authUser';

// ─────────────────────────────────────────────────────────────
// White blood drop (used on red background)
// ─────────────────────────────────────────────────────────────
function WhiteDropLogo() {
  return (
    <Svg width={90} height={120} viewBox="0 0 90 120">
      <Defs>
        <LinearGradient id="wdrop" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
          <Stop offset="100%" stopColor="rgba(255,255,255,0.85)" stopOpacity="1" />
        </LinearGradient>
      </Defs>
      {/* Teardrop body */}
      <Path
        d="M45 4 C33 20 14 38 10 58 C6 80 23 108 45 108 C67 108 84 80 80 58 C76 38 57 20 45 4 Z"
        fill="url(#wdrop)"
      />
      {/* Inner shine */}
      <Path
        d="M26 38 C22 52 21 66 25 78"
        stroke="rgba(220,50,50,0.25)"
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Small heart / pulse inside drop */}
      <Path
        d="M37 65 C37 60 42 57 45 62 C48 57 53 60 53 65 C53 70 45 76 45 76 C45 76 37 70 37 65 Z"
        fill="#C62828"
        opacity="0.6"
      />
    </Svg>
  );
}

// ─────────────────────────────────────────────────────────────
// MAIN SCREEN  – two states: splash buttons vs login form
// ─────────────────────────────────────────────────────────────
export default function Login({ navigation, route }) {
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [storedEmail, setStoredEmail] = useState('');

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const formAnim = useRef(new Animated.Value(30)).current;
  const formOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }).start();

    if (route?.params?.email) setEmail(route.params.email);
    if (route?.params?.message) setStatusMessage(route.params.message);

    (async () => {
      const saved = await storage.getItem(AUTH_EMAIL_KEY);
      if (saved) setStoredEmail(saved);
    })();
  }, []);

  const openForm = () => {
    setShowForm(true);
    formAnim.setValue(30);
    formOpacity.setValue(0);
    Animated.parallel([
      Animated.timing(formAnim, { toValue: 0, duration: 320, useNativeDriver: true }),
      Animated.timing(formOpacity, { toValue: 1, duration: 320, useNativeDriver: true }),
    ]).start();
  };

  const goBack = () => {
    Animated.timing(formOpacity, { toValue: 0, duration: 200, useNativeDriver: true }).start(() => {
      setShowForm(false);
      setStatusMessage('');
    });
  };

  async function handleLogin() {
    if (!email.trim() || !password.trim()) {
      setStatusMessage('Enter your email and password.');
      return;
    }
    setIsSubmitting(true);
    setStatusMessage('Signing in…');
    try {
      const response = await loginUser({
        email: email.trim().toLowerCase(),
        password,
      });
      const token = response?.token;
      const user = response?.user;
      if (!token || !user) throw new Error('Invalid login response from server');

      await storage.setItem(AUTH_TOKEN_KEY, token);
      await storage.setItem(AUTH_EMAIL_KEY, email.trim().toLowerCase());
      await storage.setItem(AUTH_ROLE_KEY, user.role || '');
      await storage.setItem(AUTH_USER_KEY, JSON.stringify(user));
      setStoredEmail(email.trim().toLowerCase());
      const dest =
        user.role === 'donor' ? 'Donor' :
          user.role === 'hospital_staff' ? 'Hospital' :
            'Requester';
      navigation?.navigate(dest);
    } catch (err) {
      setStatusMessage(err.message || 'Could not sign in. Try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#D32F2F" />

      {/* ── RED TOP SECTION ── */}
      <Animated.View style={[styles.redSection, { opacity: fadeAnim }]}>
        {/* Decorative circle top-left */}
        <View style={styles.decorCircleLarge} />
        <View style={styles.decorCircleSmall} />

        <View style={styles.logoArea}>
          <WhiteDropLogo />
        </View>
      </Animated.View>

      {/* ── WHITE BOTTOM PANEL ── */}
      <View style={styles.whitePanel}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ flex: 1 }}
        >
          {!showForm ? (
            /* ── SPLASH BUTTONS ── */
            <View style={styles.splashContent}>
              {/* Sign In button */}
              <TouchableOpacity
                style={styles.signInBtn}
                activeOpacity={0.85}
                onPress={openForm}
              >
                <Text style={styles.signInBtnText}>Sign in</Text>
              </TouchableOpacity>

              {/* Create Account */}
              <TouchableOpacity
                style={styles.createBtn}
                activeOpacity={0.85}
                onPress={() => navigation.navigate('Register')}
              >
                <Text style={styles.createBtnText}>Create Account</Text>
              </TouchableOpacity>

              {/* Bottom row */}
              <View style={styles.splashFooter}>
                <TouchableOpacity activeOpacity={0.7}>
                  <Text style={styles.learnMore}>Learn more</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => navigation.navigate('Onboarding')}
                >
                  <Text style={styles.skipNow}>Skip now  →</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            /* ── LOGIN FORM ── */
            <Animated.View style={[styles.formContent, { opacity: formOpacity, transform: [{ translateY: formAnim }] }]}>
              <Text style={styles.formTitle}>Welcome back</Text>
              <Text style={styles.formSubtitle}>Sign in to continue your quest.</Text>

              {/* Email */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email address</Text>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="juan@email.com"
                  placeholderTextColor="#BDBDBD"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              {/* Password */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Password</Text>
                <View style={styles.passwordRow}>
                  <TextInput
                    style={[styles.input, styles.passwordInput]}
                    value={password}
                    onChangeText={setPassword}
                    placeholder="••••••••"
                    placeholderTextColor="#BDBDBD"
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  <TouchableOpacity
                    style={styles.toggleBtn}
                    onPress={() => setShowPassword(v => !v)}
                  >
                    <Text style={styles.toggleBtnText}>
                      {showPassword ? 'Hide' : 'Show'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {!!statusMessage && (
                <Text style={styles.statusText}>{statusMessage}</Text>
              )}

              {/* Submit */}
              <TouchableOpacity
                style={[styles.submitBtn, isSubmitting && { opacity: 0.7 }]}
                onPress={handleLogin}
                disabled={isSubmitting}
                activeOpacity={0.85}
              >
                <Text style={styles.submitBtnText}>
                  {isSubmitting ? 'Signing in…' : 'Sign in'}
                </Text>
              </TouchableOpacity>

              {/* Back to options */}
              <View style={styles.formFooterRow}>
                <TouchableOpacity onPress={goBack}>
                  <Text style={styles.backLink}>← Back</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                  <Text style={styles.registerLink}>Create account</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          )}
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
}

// ─────────────────────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#D32F2F',
  },

  // Red section
  redSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  decorCircleLarge: {
    position: 'absolute',
    top: -60,
    left: -60,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  decorCircleSmall: {
    position: 'absolute',
    top: 30,
    left: 40,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.07)',
  },
  logoArea: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  // White panel
  whitePanel: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: 'hidden',
  },

  // Splash buttons layout
  splashContent: {
    paddingHorizontal: 28,
    paddingTop: 32,
    paddingBottom: 28,
  },
  signInBtn: {
    backgroundColor: '#D32F2F',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 14,
    shadowColor: '#D32F2F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 5,
  },
  signInBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  createBtn: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#1A1A1A',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 0,
  },
  createBtnText: {
    color: '#1A1A1A',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  splashFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  learnMore: {
    color: '#888888',
    fontSize: 13,
    fontWeight: '500',
  },
  skipNow: {
    color: '#1A1A1A',
    fontSize: 13,
    fontWeight: '600',
  },

  // Login form layout
  formContent: {
    paddingHorizontal: 28,
    paddingTop: 28,
    paddingBottom: 20,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  formSubtitle: {
    fontSize: 14,
    color: '#777777',
    marginBottom: 22,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#444444',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#E8E8E8',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 13,
    backgroundColor: '#FAFAFA',
    color: '#1A1A1A',
    fontSize: 15,
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
  toggleBtn: {
    paddingVertical: 13,
    paddingHorizontal: 14,
    backgroundColor: '#FAFAFA',
    borderWidth: 1.5,
    borderColor: '#E8E8E8',
    borderLeftWidth: 0,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  toggleBtnText: {
    color: '#888888',
    fontWeight: '600',
    fontSize: 13,
  },
  statusText: {
    color: '#E53935',
    fontSize: 13,
    marginBottom: 10,
    textAlign: 'center',
  },
  submitBtn: {
    backgroundColor: '#D32F2F',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 4,
    shadowColor: '#D32F2F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  formFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 18,
  },
  backLink: {
    color: '#888888',
    fontSize: 13,
    fontWeight: '500',
  },
  registerLink: {
    color: '#D32F2F',
    fontSize: 13,
    fontWeight: '600',
  },
});
