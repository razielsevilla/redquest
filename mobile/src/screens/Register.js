import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Animated,
  Image,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { registerUser } from '../lib/api';
import { COLORS, SHADOWS, RADIUS } from '../lib/theme';

const ROLES = [
  { key: 'donor',          label: 'Donor',    icon: 'water' },
  { key: 'requester',      label: 'Family',   icon: 'people' },
  { key: 'hospital_staff', label: 'Hospital', icon: 'medkit' },
];

const BASE_TYPES = ['A', 'B', 'O', 'AB'];

export default function Register({ navigation }) {
  const [step, setStep] = useState(1);

  // Step 1: Role
  const [role, setRole] = useState('donor');
  
  // Step 2: Account
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Step 3: Contact & Location
  const [phone, setPhone] = useState('');
  const [locationAllowed, setLocationAllowed] = useState(false);

  // Step 4: Blood Type (Donors/Requesters only)
  const [baseType, setBaseType] = useState('O');
  const [rhFactor, setRhFactor] = useState('+');
  const [wantsNotifs, setWantsNotifs] = useState(false);

  // UI State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  // Keyboard handling for tight screens
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const headerHeight = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const kShow = Keyboard.addListener(Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow', () => {
      setKeyboardVisible(true);
      Animated.timing(headerHeight, { toValue: 0, duration: 200, useNativeDriver: false }).start();
    });
    const kHide = Keyboard.addListener(Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide', () => {
      setKeyboardVisible(false);
      Animated.timing(headerHeight, { toValue: 1, duration: 200, useNativeDriver: false }).start();
    });
    return () => { kShow.remove(); kHide.remove(); };
  }, []);

  const totalSteps = role === 'hospital_staff' ? 3 : 4;

  const nextStep = () => {
    setStatusMessage('');
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      if (!name.trim() || !email.trim() || !password.trim()) {
        setStatusMessage('Please fill all account fields.');
        return;
      }
      setStep(3);
    } else if (step === 3) {
      if (!phone.trim()) {
        setStatusMessage('Please provide a contact number.');
        return;
      }
      if (role === 'hospital_staff') {
        submitRegistration();
      } else {
        setStep(4);
      }
    } else if (step === 4) {
      submitRegistration();
    }
  };

  const prevStep = () => {
    setStatusMessage('');
    if (step > 1) {
      setStep(step - 1);
    } else {
      navigation.goBack();
    }
  };

  const submitRegistration = async () => {
    setIsSubmitting(true);
    setStatusMessage('Creating account…');
    try {
      await registerUser({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        password,
        role,
        blood_type: role === 'hospital_staff' ? null : `${baseType}${rhFactor}`,
        lat: 14.5995, // Default Manila latitude
        lng: 120.9842, // Default Manila longitude
      });
      navigation.navigate('Login', {
        email: email.trim().toLowerCase(),
        message: 'Account created! Sign in to continue.',
      });
    } catch (err) {
      setStatusMessage(err.message || 'Could not create account. Try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Header progress bar
  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity onPress={prevStep} style={styles.backBtn}>
        <Ionicons name="arrow-back" size={22} color={COLORS.textPrimary} />
      </TouchableOpacity>
      <View style={styles.progressWrap}>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${(step / totalSteps) * 100}%` }]} />
        </View>
        <Text style={styles.progressText}>Step {step} of {totalSteps}</Text>
      </View>
      <View style={{ width: 36 }} />
    </View>
  );

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      
      {renderHeader()}

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          {/* Dynamic Header Section - shrinks on keyboard open */}
          <Animated.View style={[styles.titleSection, { 
            opacity: headerHeight,
            height: headerHeight.interpolate({ inputRange: [0, 1], outputRange: [0, 80] }),
            marginBottom: headerHeight.interpolate({ inputRange: [0, 1], outputRange: [0, 20] })
          }]}>
            <Text style={styles.pageTitle}>
              {step === 1 && "Who are you?"}
              {step === 2 && "Create profile"}
              {step === 3 && "Contact info"}
              {step === 4 && "Blood type"}
            </Text>
            <Text style={styles.pageSubtitle}>
              {step === 1 && "Choose your role in RedQuest."}
              {step === 2 && "Enter your basic account details."}
              {step === 3 && "How can we reach you?"}
              {step === 4 && "Help us match you correctly."}
            </Text>
          </Animated.View>

          {/* ── STEP 1: ROLE ── */}
          {step === 1 && (
            <View style={styles.stepContainer}>
              <View style={styles.roleGrid}>
                {ROLES.map(r => (
                  <TouchableOpacity
                    key={r.key}
                    style={[styles.roleCard, role === r.key && styles.roleCardActive]}
                    onPress={() => setRole(r.key)}
                    activeOpacity={0.8}
                  >
                    <View style={[styles.roleIconWrap, role === r.key && styles.roleIconWrapActive]}>
                      <Ionicons name={r.icon} size={28} color={role === r.key ? COLORS.white : COLORS.primary} />
                    </View>
                    <Text style={[styles.roleLabel, role === r.key && styles.roleLabelActive]}>{r.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* ── STEP 2: ACCOUNT ── */}
          {step === 2 && (
            <View style={styles.stepContainer}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Full Name</Text>
                <View style={styles.inputWrap}>
                  <Ionicons name="person-outline" size={18} color={COLORS.textMuted} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                    placeholder="Juan dela Cruz"
                    placeholderTextColor={COLORS.textPlaceholder}
                    returnKeyType="next"
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email Address</Text>
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
                  <TouchableOpacity style={styles.showBtn} onPress={() => setShowPassword(!showPassword)}>
                    <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={COLORS.textMuted} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}

          {/* ── STEP 3: CONTACT ── */}
          {step === 3 && (
            <View style={styles.stepContainer}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Contact Number</Text>
                <View style={styles.inputWrap}>
                  <Ionicons name="call-outline" size={18} color={COLORS.textMuted} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    value={phone}
                    onChangeText={setPhone}
                    placeholder="0917 123 4567"
                    placeholderTextColor={COLORS.textPlaceholder}
                    keyboardType="phone-pad"
                    returnKeyType="done"
                  />
                </View>
              </View>

              <Text style={[styles.label, { marginTop: 12 }]}>Location Access</Text>
              <TouchableOpacity
                style={[styles.locationBtn, locationAllowed && styles.locationBtnActive]}
                onPress={() => setLocationAllowed(!locationAllowed)}
                activeOpacity={0.8}
              >
                <View style={[styles.locationIconWrap, locationAllowed && styles.locationIconWrapActive]}>
                  <Ionicons
                    name={locationAllowed ? 'checkmark-circle' : 'location'}
                    size={20}
                    color={locationAllowed ? COLORS.success : COLORS.primary}
                  />
                </View>
                <Text style={[styles.locationText, locationAllowed && styles.locationTextActive]}>
                  {locationAllowed ? 'Location access granted' : 'Allow location access'}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* ── STEP 4: BLOOD TYPE ── */}
          {step === 4 && (
            <View style={styles.stepContainer}>
              <Text style={styles.label}>Base Type</Text>
              <View style={styles.bloodGrid}>
                {BASE_TYPES.map(bt => (
                  <TouchableOpacity
                    key={bt}
                    style={[styles.bloodCell, baseType === bt && styles.bloodCellActive]}
                    onPress={() => setBaseType(bt)}
                  >
                    <Text style={[styles.bloodCellText, baseType === bt && styles.bloodCellTextActive]}>{bt}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.label}>Rh Factor</Text>
              <View style={styles.rhRow}>
                <TouchableOpacity style={[styles.rhBtn, rhFactor === '+' && styles.rhBtnActive]} onPress={() => setRhFactor('+')}>
                  <Text style={[styles.rhBtnText, rhFactor === '+' && styles.rhBtnTextActive]}>Positive (+)</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.rhBtn, rhFactor === '-' && styles.rhBtnActive]} onPress={() => setRhFactor('-')}>
                  <Text style={[styles.rhBtnText, rhFactor === '-' && styles.rhBtnTextActive]}>Negative (−)</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.checkRow} onPress={() => setWantsNotifs(!wantsNotifs)}>
                <View style={[styles.checkbox, wantsNotifs && styles.checkboxActive]}>
                  {wantsNotifs && <Ionicons name="checkmark" size={14} color={COLORS.white} />}
                </View>
                <Text style={styles.checkLabel}>Receive blood campaign notifications</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Spacer to push buttons to bottom */}
          <View style={{ flex: 1 }} />

          {/* Status Message */}
          {!!statusMessage && (
            <View style={styles.statusWrap}>
              <Ionicons name={isSubmitting ? 'hourglass-outline' : 'alert-circle-outline'} size={14} color={isSubmitting ? COLORS.info : COLORS.primary} />
              <Text style={[styles.statusText, isSubmitting && { color: COLORS.info }]}>{statusMessage}</Text>
            </View>
          )}

          {/* Bottom Action */}
          <View style={styles.footer}>
            <TouchableOpacity 
              style={[styles.primaryBtn, isSubmitting && { opacity: 0.7 }]} 
              onPress={nextStep} 
              activeOpacity={0.85} 
              disabled={isSubmitting}
            >
              <Text style={styles.primaryBtnText}>
                {isSubmitting ? 'Processing…' : step === totalSteps ? 'Create Account' : 'Continue'}
              </Text>
              <Ionicons
                name={step === totalSteps ? 'checkmark-circle' : 'arrow-forward'}
                size={20}
                color={COLORS.white}
                style={{ marginLeft: 6 }}
              />
            </TouchableOpacity>

            {step === 1 && (
              <TouchableOpacity style={styles.linkRow} onPress={() => navigation.navigate('Login')}>
                <Text style={styles.linkText}>
                  Already have an account? <Text style={styles.linkAccent}>Sign in</Text>
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },
  keyboardView: { flex: 1 },
  content: { flex: 1, paddingHorizontal: 24, paddingBottom: 24 },
  
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12,
  },
  backBtn: { padding: 4 },
  progressWrap: { flex: 1, marginHorizontal: 20, alignItems: 'center' },
  progressTrack: { width: '100%', height: 6, backgroundColor: COLORS.border, borderRadius: 3, marginBottom: 6, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: COLORS.primary },
  progressText: { fontSize: 11, fontWeight: '600', color: COLORS.textMuted },

  titleSection: { alignItems: 'center', justifyContent: 'center' },
  pageTitle: { fontSize: 26, fontWeight: '800', color: COLORS.textPrimary, letterSpacing: -0.5, marginBottom: 4 },
  pageSubtitle: { fontSize: 14, color: COLORS.textMuted, textAlign: 'center' },

  stepContainer: { flex: 0, width: '100%', marginTop: 10 },

  // Role Grid
  roleGrid: { gap: 12 },
  roleCard: {
    flexDirection: 'row', alignItems: 'center', padding: 18,
    borderRadius: RADIUS.md, borderWidth: 1.5, borderColor: COLORS.inputBorder,
    backgroundColor: COLORS.surface, ...SHADOWS.small,
  },
  roleCardActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primarySurface },
  roleIconWrap: {
    width: 48, height: 48, borderRadius: 24, backgroundColor: COLORS.primaryMuted,
    alignItems: 'center', justifyContent: 'center', marginRight: 16,
  },
  roleIconWrapActive: { backgroundColor: COLORS.primary },
  roleLabel: { fontSize: 16, fontWeight: '600', color: COLORS.textSecondary },
  roleLabelActive: { color: COLORS.primary, fontWeight: '800' },

  // Inputs
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 12, fontWeight: '700', color: COLORS.textSecondary, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 },
  inputWrap: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface,
    borderWidth: 1.5, borderColor: COLORS.inputBorder, borderRadius: RADIUS.sm,
  },
  inputIcon: { marginLeft: 14 },
  input: { flex: 1, paddingHorizontal: 12, paddingVertical: 14, fontSize: 15, color: COLORS.textPrimary },
  showBtn: { padding: 14 },

  // Location
  locationBtn: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md, borderWidth: 1.5, borderColor: COLORS.inputBorder,
    padding: 16, gap: 12, ...SHADOWS.small,
  },
  locationBtnActive: { borderColor: COLORS.success, backgroundColor: COLORS.successLight },
  locationIconWrap: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.primaryMuted,
    alignItems: 'center', justifyContent: 'center',
  },
  locationIconWrapActive: { backgroundColor: COLORS.successLight },
  locationText: { fontSize: 14, fontWeight: '600', color: COLORS.textSecondary },
  locationTextActive: { color: COLORS.success },

  // Blood Grid
  bloodGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  bloodCell: {
    width: '48%', paddingVertical: 16, borderRadius: RADIUS.sm, backgroundColor: COLORS.surface,
    alignItems: 'center', borderWidth: 1.5, borderColor: COLORS.inputBorder,
  },
  bloodCellActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  bloodCellText: { fontSize: 18, fontWeight: '700', color: COLORS.textSecondary },
  bloodCellTextActive: { color: COLORS.white },

  // Rh
  rhRow: { flexDirection: 'row', gap: 10, marginBottom: 24 },
  rhBtn: {
    flex: 1, paddingVertical: 14, borderRadius: RADIUS.sm, backgroundColor: COLORS.surface,
    alignItems: 'center', borderWidth: 1.5, borderColor: COLORS.inputBorder,
  },
  rhBtnActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  rhBtnText: { fontSize: 14, fontWeight: '700', color: COLORS.textSecondary },
  rhBtnTextActive: { color: COLORS.white },

  // Checkbox
  checkRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  checkbox: {
    width: 22, height: 22, borderRadius: 6, borderWidth: 2, borderColor: COLORS.inputBorder,
    alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.surface,
  },
  checkboxActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  checkLabel: { flex: 1, fontSize: 13, color: COLORS.textSecondary, lineHeight: 18 },

  // Footer & Status
  footer: { width: '100%', marginTop: 'auto' },
  statusWrap: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 12 },
  statusText: { color: COLORS.primary, fontSize: 13, fontWeight: '500' },
  primaryBtn: {
    backgroundColor: COLORS.primary, paddingVertical: 16, borderRadius: RADIUS.md,
    alignItems: 'center', justifyContent: 'center', flexDirection: 'row', ...SHADOWS.button,
  },
  primaryBtnText: { color: COLORS.white, fontSize: 16, fontWeight: '700', letterSpacing: 0.4 },
  linkRow: { alignItems: 'center', paddingVertical: 16 },
  linkText: { fontSize: 13, color: COLORS.textMuted },
  linkAccent: { color: COLORS.primary, fontWeight: '700' },
});
