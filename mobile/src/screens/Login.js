import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Animated,
  StatusBar,
  Image,
  Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as storage from '../lib/storage';
import { loginUser } from '../lib/api';
import { COLORS, SHADOWS, RADIUS } from '../lib/theme';

const AUTH_TOKEN_KEY = 'redquest.authToken';
const AUTH_EMAIL_KEY = 'redquest.authEmail';
const AUTH_ROLE_KEY = 'redquest.authRole';
const AUTH_USER_KEY = 'redquest.authUser';

export default function Login({ navigation, route }) {
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const formAnim = useRef(new Animated.Value(30)).current;
  const formOpacity = useRef(new Animated.Value(0)).current;
  const topFlex = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }).start();

    // Responsive keyboard behavior: shrink the top red section when keyboard opens
    const kShow = Keyboard.addListener(Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow', () => {
      Animated.timing(topFlex, { toValue: 0.01, duration: 250, useNativeDriver: false }).start();
    });
    const kHide = Keyboard.addListener(Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide', () => {
      Animated.timing(topFlex, { toValue: 1, duration: 250, useNativeDriver: false }).start();
    });

    if (route?.params?.email) setEmail(route.params.email);
    if (route?.params?.message) setStatusMessage(route.params.message);

    return () => { kShow.remove(); kHide.remove(); };
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
      const dest = user.role === 'donor' ? 'Donor' : 'Requester';
      navigation?.navigate(dest);
    } catch (err) {
      setStatusMessage(err.message || 'Could not sign in. Try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>

        {/* ── RESPONSIVE RED TOP SECTION ── */}
        <Animated.View style={[styles.redSection, { flex: topFlex, opacity: topFlex }]}>
          <View style={styles.decorCircleLarge} />
          <View style={styles.decorCircleSmall} />
          <View style={styles.decorCircleRight} />

          <Animated.View style={[styles.logoArea, { opacity: fadeAnim }]}>
            <Image
              source={require('../../assets/logo.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
            <Text style={styles.logoTitle}>
              Red<Text style={{ fontWeight: '800', color: COLORS.primary }}>Quest</Text>
            </Text>
          </Animated.View>
        </Animated.View>

        {/* ── WHITE BOTTOM PANEL ── */}
        <View style={styles.whitePanel}>
          {!showForm ? (
            <View style={styles.splashContent}>
              <TouchableOpacity style={styles.signInBtn} activeOpacity={0.85} onPress={openForm}>
                <Ionicons name="log-in-outline" size={20} color={COLORS.white} />
                <Text style={styles.signInBtnText}>Sign In</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.createBtn} activeOpacity={0.85} onPress={() => navigation.navigate('Register')}>
                <Ionicons name="person-add-outline" size={18} color={COLORS.textPrimary} />
                <Text style={styles.createBtnText}>Create Account</Text>
              </TouchableOpacity>

              <View style={styles.splashFooter}>
                <TouchableOpacity activeOpacity={0.7}>
                  <Text style={styles.learnMore}>Learn more</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <Animated.View style={[styles.formContent, { opacity: formOpacity, transform: [{ translateY: formAnim }] }]}>
              <Text style={styles.formTitle}>Welcome back</Text>
              <Text style={styles.formSubtitle}>Sign in to continue your quest.</Text>

              {/* Email */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email address</Text>
                <View style={styles.inputWrap}>
                  <Ionicons name="mail-outline" size={18} color={COLORS.textMuted} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="juan@email.com"
                    placeholderTextColor={COLORS.textPlaceholder}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    returnKeyType="next"
                  />
                </View>
              </View>

              {/* Password */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Password</Text>
                <View style={styles.inputWrap}>
                  <Ionicons name="lock-closed-outline" size={18} color={COLORS.textMuted} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    value={password}
                    onChangeText={setPassword}
                    placeholder="••••••••"
                    placeholderTextColor={COLORS.textPlaceholder}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                    returnKeyType="done"
                  />
                  <TouchableOpacity style={styles.toggleBtn} onPress={() => setShowPassword(!showPassword)}>
                    <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={COLORS.textMuted} />
                  </TouchableOpacity>
                </View>
              </View>

              {!!statusMessage && (
                <View style={styles.statusWrap}>
                  <Ionicons name={statusMessage.includes('Signing') ? 'hourglass-outline' : 'alert-circle-outline'} size={14} color={statusMessage.includes('Signing') ? COLORS.info : COLORS.primary} />
                  <Text style={[styles.statusText, statusMessage.includes('Signing') && { color: COLORS.info }]}>{statusMessage}</Text>
                </View>
              )}

              {/* Submit */}
              <TouchableOpacity style={[styles.submitBtn, isSubmitting && { opacity: 0.7 }]} onPress={handleLogin} disabled={isSubmitting} activeOpacity={0.85}>
                <Text style={styles.submitBtnText}>{isSubmitting ? 'Signing in…' : 'Sign In'}</Text>
              </TouchableOpacity>

              {/* Footer Links */}
              <View style={styles.formFooterRow}>
                <TouchableOpacity onPress={goBack} style={styles.backRow}>
                  <Ionicons name="arrow-back" size={16} color={COLORS.textMuted} />
                  <Text style={styles.backLink}>Back</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                  <Text style={styles.registerLink}>Create account</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },

  redSection: {
    alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden',
  },
  decorCircleLarge: { position: 'absolute', top: -70, left: -70, width: 220, height: 220, borderRadius: 110, backgroundColor: COLORS.primarySurface },
  decorCircleSmall: { position: 'absolute', top: 30, left: 40, width: 80, height: 80, borderRadius: 40, backgroundColor: COLORS.primarySurface },
  decorCircleRight: { position: 'absolute', bottom: 20, right: -40, width: 160, height: 160, borderRadius: 80, backgroundColor: COLORS.primarySurface },
  logoArea: { alignItems: 'center', justifyContent: 'center' },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    ...SHADOWS.small,
  },
  logoImage: { width: 68, height: 68 },
  logoTitle: { fontSize: 28, fontWeight: '800', color: COLORS.textPrimary, letterSpacing: -0.5 },

  whitePanel: {
    flex: 1,
    overflow: 'hidden', paddingBottom: Platform.OS === 'ios' ? 20 : 0,
  },

  splashContent: { paddingHorizontal: 28, paddingTop: 32, paddingBottom: 28 },
  signInBtn: { backgroundColor: COLORS.primary, borderRadius: RADIUS.md, paddingVertical: 15, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8, marginBottom: 14, ...SHADOWS.button },
  signInBtnText: { color: COLORS.white, fontSize: 16, fontWeight: '700', letterSpacing: 0.3 },
  createBtn: { backgroundColor: COLORS.surface, borderWidth: 1.5, borderColor: COLORS.inputBorder, borderRadius: RADIUS.md, paddingVertical: 15, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8 },
  createBtnText: { color: COLORS.textPrimary, fontSize: 16, fontWeight: '700', letterSpacing: 0.3 },
  splashFooter: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 24 },
  learnMore: { color: COLORS.textMuted, fontSize: 13, fontWeight: '500' },

  formContent: { paddingHorizontal: 28, paddingTop: 28, paddingBottom: 20 },
  formTitle: { fontSize: 24, fontWeight: '800', color: COLORS.textPrimary, marginBottom: 4, letterSpacing: -0.5 },
  formSubtitle: { fontSize: 14, color: COLORS.textSecondary, marginBottom: 22 },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 12, fontWeight: '600', color: COLORS.textSecondary, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 },
  inputWrap: { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderColor: COLORS.inputBorder, borderRadius: RADIUS.sm, backgroundColor: COLORS.inputBg, overflow: 'hidden' },
  inputIcon: { marginLeft: 14 },
  input: { flex: 1, paddingHorizontal: 12, paddingVertical: 13, color: COLORS.textPrimary, fontSize: 15 },
  toggleBtn: { paddingHorizontal: 14, paddingVertical: 13 },
  statusWrap: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 10 },
  statusText: { color: COLORS.primary, fontSize: 13 },
  submitBtn: { backgroundColor: COLORS.primary, paddingVertical: 15, borderRadius: RADIUS.sm, alignItems: 'center', marginTop: 4, ...SHADOWS.button },
  submitBtnText: { color: COLORS.white, fontSize: 16, fontWeight: '700', letterSpacing: 0.4 },
  formFooterRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 22 },
  backRow: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 4 },
  backLink: { color: COLORS.textMuted, fontSize: 13, fontWeight: '500' },
  registerLink: { color: COLORS.primary, fontSize: 13, fontWeight: '600', paddingVertical: 4 },
});
