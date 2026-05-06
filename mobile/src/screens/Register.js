import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Animated,
  Platform,
} from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import { registerUser } from '../lib/api';

// ─────────────────────────────────────────────────────────────
// Red blood drop logo (for light background)
// ─────────────────────────────────────────────────────────────
function RedDropLogo({ size = 72 }) {
  const s = size / 90;
  return (
    <Svg width={size} height={size * 1.33} viewBox="0 0 90 120">
      <Defs>
        <LinearGradient id="rdrop" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor="#FF5252" />
          <Stop offset="100%" stopColor="#B71C1C" />
        </LinearGradient>
      </Defs>
      <Path
        d="M45 4 C33 20 14 38 10 58 C6 80 23 108 45 108 C67 108 84 80 80 58 C76 38 57 20 45 4 Z"
        fill="url(#rdrop)"
      />
      <Path
        d="M26 38 C22 52 21 66 25 78"
        stroke="rgba(255,255,255,0.45)"
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
      />
      <Path
        d="M37 65 C37 60 42 57 45 62 C48 57 53 60 53 65 C53 70 45 76 45 76 C45 76 37 70 37 65 Z"
        fill="rgba(255,255,255,0.55)"
      />
    </Svg>
  );
}

// ─────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────
const ROLES = [
  { key: 'donor',         label: 'Donor' },
  { key: 'requester',     label: 'Family' },
  { key: 'hospital_staff',label: '🏥 Hospital' },
];

const BASE_TYPES = ['A', 'B', 'O', 'AB'];

// ─────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────
export default function Register({ navigation }) {
  const [step, setStep] = useState(1);

  // Step 1 fields
  const [name,           setName]           = useState('');
  const [email,          setEmail]          = useState('');
  const [password,       setPassword]       = useState('');
  const [showPassword,   setShowPassword]   = useState(false);
  const [phone,          setPhone]          = useState('');
  const [role,           setRole]           = useState('donor');
  const [locationAllowed,setLocationAllowed]= useState(false);

  // Step 2 fields
  const [baseType,       setBaseType]       = useState('O');
  const [rhFactor,       setRhFactor]       = useState('+');
  const [wantsNotifs,    setWantsNotifs]    = useState(false);

  // Submission
  const [isSubmitting,   setIsSubmitting]   = useState(false);
  const [statusMessage,  setStatusMessage]  = useState('');

  // Animation
  const slideAnim = useRef(new Animated.Value(0)).current;

  const goToStep2 = () => {
    if (!name.trim() || !email.trim() || !phone.trim() || !password.trim()) {
      setStatusMessage('Please fill in all fields.');
      return;
    }
    setStatusMessage('');
    // Hospital staff skip blood-type step — register immediately
    if (role === 'hospital_staff') {
      handleRegisterDirect();
      return;
    }
    slideAnim.setValue(40);
    setStep(2);
    Animated.timing(slideAnim, { toValue: 0, duration: 320, useNativeDriver: true }).start();
  };

  async function handleRegisterDirect() {
    setIsSubmitting(true);
    setStatusMessage('Creating account…');
    try {
      await registerUser({
        name:       name.trim(),
        email:      email.trim().toLowerCase(),
        phone:      phone.trim(),
        password,
        role,
        blood_type: null,
      });
      navigation?.navigate('Login', {
        email:   email.trim().toLowerCase(),
        message: 'Hospital account created! Sign in to continue.',
      });
    } catch (err) {
      setStatusMessage(err.message || 'Could not create account. Try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  const goBack = () => {
    setStep(1);
    setStatusMessage('');
  };

  const bloodType = `${baseType}${rhFactor}`;

  async function handleRegister() {
    setIsSubmitting(true);
    setStatusMessage('Creating account…');
    try {
      await registerUser({
        name:       name.trim(),
        email:      email.trim().toLowerCase(),
        phone:      phone.trim(),
        password,
        role,
        blood_type: bloodType,
      });
      navigation?.navigate('Login', {
        email:   email.trim().toLowerCase(),
        message: 'Account created! Sign in to continue.',
      });
    } catch (err) {
      setStatusMessage(err.message || 'Could not create account. Try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  // ── STEP 1 ────────────────────────────────────────────────
  if (step === 1) {
    return (
      <SafeAreaView style={styles.root}>
        <StatusBar barStyle="dark-content" backgroundColor="#F5F5F5" />
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Logo */}
          <View style={styles.logoRow}>
            <RedDropLogo size={44} />
          </View>

          {/* Header */}
          <Text style={styles.pageTitle}>Create your account</Text>
          <Text style={styles.pageSubtitle}>Join RedQuest and be a hero.</Text>

          {/* Card */}
          <View style={styles.card}>

            {/* Full name */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full name</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Juan dela Cruz"
                placeholderTextColor="#BDBDBD"
              />
            </View>

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
                  style={styles.showBtn}
                  onPress={() => setShowPassword(v => !v)}
                >
                  <Text style={styles.showBtnText}>
                    {showPassword ? 'Hide' : 'Show'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Contact number */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Contact number</Text>
              <TextInput
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                placeholder="0917 123 4567"
                placeholderTextColor="#BDBDBD"
                keyboardType="phone-pad"
              />
            </View>

          </View>

          {/* I am a… */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>I am a…</Text>
            <View style={styles.pillRow}>
              {ROLES.map(r => (
                <TouchableOpacity
                  key={r.key}
                  style={[styles.pill, role === r.key && styles.pillActive]}
                  onPress={() => setRole(r.key)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.pillText, role === r.key && styles.pillTextActive]}>
                    {r.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Location access */}
          <TouchableOpacity
            style={[styles.locationBtn, locationAllowed && styles.locationBtnActive]}
            onPress={() => setLocationAllowed(true)}
            activeOpacity={0.8}
          >
            <Text style={[styles.locationIcon]}>
              {locationAllowed ? '✓' : '📍'}
            </Text>
            <Text style={[styles.locationText, locationAllowed && styles.locationTextActive]}>
              {locationAllowed ? 'Location access granted' : 'Allow location access'}
            </Text>
          </TouchableOpacity>

          {!!statusMessage && (
            <Text style={styles.statusText}>{statusMessage}</Text>
          )}

          {/* Next / Register button */}
          <TouchableOpacity style={styles.primaryBtn} onPress={goToStep2} activeOpacity={0.85} disabled={isSubmitting}>
            <Text style={styles.primaryBtnText}>
              {isSubmitting ? 'Creating account…' : role === 'hospital_staff' ? 'Register' : 'Next'}
            </Text>
          </TouchableOpacity>

          {/* Sign in link */}
          <TouchableOpacity style={styles.linkRow} onPress={() => navigation?.navigate('Login')}>
            <Text style={styles.linkText}>Already have an account? <Text style={styles.linkAccent}>Sign in</Text></Text>
          </TouchableOpacity>

        </ScrollView>
      </SafeAreaView>
    );
  }

  // ── STEP 2 ────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F5F5" />

      <Animated.ScrollView
        contentContainerStyle={styles.step2Content}
        showsVerticalScrollIndicator={false}
        style={{ transform: [{ translateY: slideAnim }] }}
      >
        {/* Logo */}
        <View style={styles.step2Logo}>
          <RedDropLogo size={68} />
        </View>

        {/* Title */}
        <Text style={styles.step2Title}>Please pick your{'\n'}blood type</Text>

        {/* Subtitle link */}
        <TouchableOpacity activeOpacity={0.7}>
          <Text style={styles.step2Subtitle}>Don't know about your blood type?</Text>
        </TouchableOpacity>

        {/* Blood group 2×2 grid */}
        <View style={styles.bloodGrid}>
          {BASE_TYPES.map(bt => (
            <TouchableOpacity
              key={bt}
              style={[styles.bloodCell, baseType === bt && styles.bloodCellActive]}
              onPress={() => setBaseType(bt)}
              activeOpacity={0.8}
            >
              <Text style={[styles.bloodCellText, baseType === bt && styles.bloodCellTextActive]}>
                {bt}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Rh factor + / − */}
        <View style={styles.rhRow}>
          <TouchableOpacity
            style={[styles.rhBtn, rhFactor === '+' && styles.rhBtnActive]}
            onPress={() => setRhFactor('+')}
            activeOpacity={0.8}
          >
            <Text style={[styles.rhBtnText, rhFactor === '+' && styles.rhBtnTextActive]}>+</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.rhBtn, rhFactor === '-' && styles.rhBtnActive]}
            onPress={() => setRhFactor('-')}
            activeOpacity={0.8}
          >
            <Text style={[styles.rhBtnText, rhFactor === '-' && styles.rhBtnTextActive]}>−</Text>
          </TouchableOpacity>
        </View>

        {/* Selected preview */}
        <Text style={styles.bloodPreview}>
          Selected: <Text style={styles.bloodPreviewAccent}>{bloodType}</Text>
        </Text>

        {/* Notification checkbox */}
        <TouchableOpacity
          style={[styles.checkRow, { marginTop: 32 }]}
          onPress={() => setWantsNotifs(v => !v)}
          activeOpacity={0.8}
        >
          <View style={[styles.checkbox, wantsNotifs && styles.checkboxActive]}>
            {wantsNotifs && <Text style={styles.checkmark}>✓</Text>}
          </View>
          <Text style={styles.checkLabel}>
            I want to receive notification about blood donation campaigns
          </Text>
        </TouchableOpacity>

        {!!statusMessage && (
          <Text style={styles.statusText}>{statusMessage}</Text>
        )}

        {/* Finish button */}
        <TouchableOpacity
          style={[styles.primaryBtn, { marginTop: 32 }, isSubmitting && { opacity: 0.7 }]}
          onPress={handleRegister}
          disabled={isSubmitting}
          activeOpacity={0.85}
        >
          <Text style={styles.primaryBtnText}>
            {isSubmitting ? 'Creating account…' : 'Finish'}
          </Text>
        </TouchableOpacity>

      </Animated.ScrollView>
    </SafeAreaView>
  );
}

// ─────────────────────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────────────────────
const styles = StyleSheet.create({

  root: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },

  // ── Step 1 ──
  scrollContent: {
    paddingHorizontal: 22,
    paddingTop: 0,
    paddingBottom: 16,
  },
  logoRow: {
    alignItems: 'center',
    marginBottom: 8,
    marginTop: 0,
  },
  pageTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1A1A1A',
    textAlign: 'center',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  pageSubtitle: {
    fontSize: 14,
    color: '#888888',
    textAlign: 'center',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingTop: 20,
    paddingBottom: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#555555',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: '#F9F9F9',
    borderWidth: 1.5,
    borderColor: '#EFEFEF',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 15,
    color: '#1A1A1A',
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
  showBtn: {
    paddingVertical: 13,
    paddingHorizontal: 14,
    backgroundColor: '#F9F9F9',
    borderWidth: 1.5,
    borderColor: '#EFEFEF',
    borderLeftWidth: 0,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  showBtnText: {
    color: '#888888',
    fontWeight: '600',
    fontSize: 13,
  },

  // I am a…
  section: {
    marginBottom: 14,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#444444',
    marginBottom: 10,
  },
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pill: {
    paddingVertical: 9,
    paddingHorizontal: 18,
    borderRadius: 50,
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
  },
  pillActive: {
    backgroundColor: '#D32F2F',
    borderColor: '#D32F2F',
  },
  pillText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#555555',
  },
  pillTextActive: {
    color: '#FFFFFF',
  },

  // Location
  locationBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    paddingVertical: 13,
    paddingHorizontal: 16,
    marginBottom: 20,
    gap: 10,
  },
  locationBtnActive: {
    borderColor: '#4CAF50',
    backgroundColor: '#F1F8F1',
  },
  locationIcon: {
    fontSize: 18,
  },
  locationText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#777777',
  },
  locationTextActive: {
    color: '#4CAF50',
  },

  // Shared
  statusText: {
    color: '#E53935',
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 12,
  },
  primaryBtn: {
    backgroundColor: '#D32F2F',
    paddingVertical: 16,
    borderRadius: 50,
    alignItems: 'center',
    shadowColor: '#D32F2F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
    marginBottom: 14,
    width: '100%',
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  linkRow: {
    alignItems: 'center',
    paddingVertical: 4,
  },
  linkText: {
    fontSize: 13,
    color: '#888888',
  },
  linkAccent: {
    color: '#D32F2F',
    fontWeight: '700',
  },

  // ── Step 2 ──
  backBtn: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 4,
  },
  backBtnText: {
    fontSize: 22,
    color: '#1A1A1A',
  },
  step2Content: {
    paddingHorizontal: 28,
    paddingTop: 32,
    paddingBottom: 0,
    alignItems: 'center',
  },
  step2Logo: {
    marginBottom: 20,
    marginTop: 4,
  },
  step2Title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1A1A1A',
    textAlign: 'center',
    letterSpacing: -0.5,
    lineHeight: 36,
    marginBottom: 10,
  },
  step2Subtitle: {
    fontSize: 13,
    color: '#D32F2F',
    fontWeight: '600',
    marginBottom: 28,
  },

  // Blood type grid 2×2
  bloodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    width: '100%',
    marginBottom: 16,
  },
  bloodCell: {
    width: '46%',
    paddingVertical: 18,
    borderRadius: 14,
    backgroundColor: '#EEEEEE',
    alignItems: 'center',
  },
  bloodCellActive: {
    backgroundColor: '#D32F2F',
  },
  bloodCellText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#555555',
  },
  bloodCellTextActive: {
    color: '#FFFFFF',
  },

  // Rh factor row
  rhRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 10,
  },
  rhBtn: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: '#EEEEEE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rhBtnActive: {
    backgroundColor: '#D32F2F',
  },
  rhBtnText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#555555',
  },
  rhBtnTextActive: {
    color: '#FFFFFF',
  },

  bloodPreview: {
    fontSize: 13,
    color: '#888888',
    marginBottom: 24,
    fontWeight: '500',
  },
  bloodPreviewAccent: {
    color: '#D32F2F',
    fontWeight: '800',
    fontSize: 15,
  },

  // Checkbox
  checkRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 24,
    width: '100%',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#D32F2F',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
    flexShrink: 0,
  },
  checkboxActive: {
    backgroundColor: '#D32F2F',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  checkLabel: {
    flex: 1,
    fontSize: 13,
    color: '#555555',
    lineHeight: 19,
  },
});
