import React, { useRef, useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Animated,
  Platform,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Line, Circle, Rect, Path, Polyline } from 'react-native-svg';
import { COLORS, SHADOWS, RADIUS } from '../lib/theme';

// ─── Progress Step config ──────────────────────────────────────
const STEPS = [
  { key: 'created',  label: 'Request\nCreated',  icon: 'checkmark' },
  { key: 'accepted', label: 'Donor\nAccepted',   icon: 'checkmark' },
  { key: 'route',    label: 'Rider\nRoute',      icon: null },
  { key: 'delivered',label: 'Delivered',         icon: null },
];

// Step 0 & 1 completed, step 2 active, step 3 upcoming
const CURRENT_STEP = 2;

// ─── Simulated map roads (SVG) ─────────────────────────────────
function MapView() {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.35, duration: 800, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1,    duration: 800, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <View style={map.wrapper}>
      {/* SVG "road grid" background */}
      <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
        {/* Background fill */}
        <Rect x="0" y="0" width="600" height="300" fill="#E8EEF2" />

        {/* Blocks */}
        <Rect x="0"   y="0"   width="90"  height="70"  fill="#D6DFE6" rx="4" />
        <Rect x="110" y="0"   width="120" height="50"  fill="#D6DFE6" rx="4" />
        <Rect x="250" y="0"   width="80"  height="60"  fill="#D6DFE6" rx="4" />
        <Rect x="350" y="0"   width="120" height="45"  fill="#D6DFE6" rx="4" />

        <Rect x="0"   y="90"  width="70"  height="90"  fill="#D6DFE6" rx="4" />
        <Rect x="110" y="75"  width="100" height="70"  fill="#D6DFE6" rx="4" />
        <Rect x="230" y="80"  width="90"  height="60"  fill="#D6DFE6" rx="4" />
        <Rect x="340" y="65"  width="140" height="80"  fill="#D6DFE6" rx="4" />

        <Rect x="20"  y="200" width="80"  height="60"  fill="#D6DFE6" rx="4" />
        <Rect x="130" y="185" width="110" height="70"  fill="#D6DFE6" rx="4" />
        <Rect x="260" y="195" width="80"  height="60"  fill="#D6DFE6" rx="4" />
        <Rect x="360" y="180" width="100" height="80"  fill="#D6DFE6" rx="4" />

        {/* Horizontal roads */}
        <Rect x="0" y="70"  width="600" height="14" fill="#FFFFFF" />
        <Rect x="0" y="155" width="600" height="14" fill="#FFFFFF" />
        <Rect x="0" y="265" width="600" height="14" fill="#FFFFFF" />

        {/* Vertical roads */}
        <Rect x="92"  y="0" width="14" height="300" fill="#FFFFFF" />
        <Rect x="222" y="0" width="14" height="300" fill="#FFFFFF" />
        <Rect x="338" y="0" width="14" height="300" fill="#FFFFFF" />
        <Rect x="478" y="0" width="14" height="300" fill="#FFFFFF" />

        {/* Road centre dashes (horizontal) */}
        {[0,40,80,120,160,200,240,280,320,360,400,440,480,520].map((x, i) => (
          <Rect key={`dh1-${i}`} x={x} y="76.5" width="22" height="1.5" fill="#F0C040" opacity="0.6" />
        ))}
        {[0,40,80,120,160,200,240,280,320,360,400,440,480,520].map((x, i) => (
          <Rect key={`dh2-${i}`} x={x} y="161.5" width="22" height="1.5" fill="#F0C040" opacity="0.6" />
        ))}

        {/* Road centre dashes (vertical) */}
        {[0,30,60,90,120,150,180,210,240,270].map((y, i) => (
          <Rect key={`dv1-${i}`} x="98.5" y={y} width="1.5" height="18" fill="#F0C040" opacity="0.6" />
        ))}
        {[0,30,60,90,120,150,180,210,240,270].map((y, i) => (
          <Rect key={`dv2-${i}`} x="228.5" y={y} width="1.5" height="18" fill="#F0C040" opacity="0.6" />
        ))}

        {/* Rider route (blue path) */}
        <Polyline
          points="98,270 98,162 228,162 228,77 338,77"
          fill="none"
          stroke="#3B82F6"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="12 6"
        />

        {/* Destination marker pin body */}
        <Path
          d="M338 30 C338 10 368 10 368 30 C368 50 353 65 353 65 C353 65 338 50 338 30 Z"
          fill="#D32F2F"
        />
        <Circle cx="353" cy="30" r="8" fill="#FFFFFF" />

        {/* Rider dot */}
        <Circle cx="98" cy="240" r="9" fill="#3B82F6" />
        <Circle cx="98" cy="240" r="5" fill="#FFFFFF" />
      </Svg>

      {/* Pulse ring around rider dot */}
      <View style={map.pulseContainer} pointerEvents="none">
        <Animated.View style={[map.pulseRing, { transform: [{ scale: pulseAnim }] }]} />
      </View>

      {/* Overlay label */}
      <View style={map.overlay}>
        <View style={map.overlayCard}>
          <Ionicons name="navigate" size={14} color="#3B82F6" />
          <View>
            <Text style={map.overlayTitle}>Live tracking map</Text>
            <Text style={map.overlaySub}>Rider is on the way</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

// ─── Main Screen ────────────────────────────────────────────────
export default function HospitalRequestTracking({ navigation, route }) {
  const requestId = route?.params?.requestId ?? 'VF-2345';

  const fadeAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }).start();
  }, []);

  function callPhone(number) {
    Linking.openURL(`tel:${number}`);
  }

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#1A1A1A" />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Live Tracking</Text>
          <Text style={styles.headerSub}>Request #{requestId}</Text>
        </View>
      </View>

      <Animated.ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        style={{ opacity: fadeAnim }}
      >
        {/* ── Progress stepper ── */}
        <View style={styles.stepperCard}>
          {STEPS.map((step, idx) => {
            const done   = idx < CURRENT_STEP;
            const active = idx === CURRENT_STEP;

            return (
              <React.Fragment key={step.key}>
                {/* Step node */}
                <View style={styles.stepNode}>
                  <View style={[
                    styles.stepCircle,
                    done   && styles.stepCircleDone,
                    active && styles.stepCircleActive,
                  ]}>
                    {done ? (
                      <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                    ) : (
                      <Text style={[styles.stepNum, active && styles.stepNumActive]}>
                        {idx + 1}
                      </Text>
                    )}
                  </View>
                  <Text style={[
                    styles.stepLabel,
                    done   && styles.stepLabelDone,
                    active && styles.stepLabelActive,
                  ]}>
                    {step.label}
                  </Text>
                </View>

                {/* Connector line (between steps) */}
                {idx < STEPS.length - 1 && (
                  <View style={[styles.stepLine, (done) && styles.stepLineDone]} />
                )}
              </React.Fragment>
            );
          })}
        </View>

        {/* ── Live Map ── */}
        <MapView />

        {/* ── Donor Information ── */}
        <View style={styles.infoCard}>
          <Text style={styles.infoCardTitle}>Donor Information</Text>
          <View style={styles.personRow}>
            {/* Avatar */}
            <View style={[styles.avatar, { backgroundColor: '#FECDD3' }]}>
              <Ionicons name="person" size={22} color="#D32F2F" />
            </View>
            {/* Details */}
            <View style={styles.personDetails}>
              <Text style={styles.personName}>Jitesh Kumar</Text>
              <Text style={styles.personSub}>Blood Type: O+</Text>
              <Text style={styles.personMeta}>Donor ID: VP-D-1234</Text>
            </View>
            {/* Call button */}
            <TouchableOpacity
              style={styles.callBtn}
              onPress={() => callPhone('+911234567890')}
              activeOpacity={0.8}
            >
              <Ionicons name="call" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Rider Information ── */}
        <View style={styles.infoCard}>
          <Text style={styles.infoCardTitle}>Rider Information</Text>
          <View style={styles.personRow}>
            {/* Avatar */}
            <View style={[styles.avatar, { backgroundColor: '#DBEAFE' }]}>
              <Ionicons name="bicycle" size={22} color="#3B82F6" />
            </View>
            {/* Details */}
            <View style={styles.personDetails}>
              <Text style={styles.personName}>Rahul Singh</Text>
              <Text style={styles.personSub}>Rider ID: VF-R-2341</Text>
              <Text style={styles.personMeta}>Vehicle: MH-12-AB-1234</Text>
            </View>
            {/* Call button */}
            <TouchableOpacity
              style={styles.callBtn}
              onPress={() => callPhone('+919876543210')}
              activeOpacity={0.8}
            >
              <Ionicons name="call" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* ── ETA pill ── */}
        <View style={styles.etaPill}>
          <Ionicons name="time-outline" size={16} color="#D32F2F" />
          <Text style={styles.etaText}>Estimated arrival in <Text style={styles.etaBold}>12 minutes</Text></Text>
        </View>

      </Animated.ScrollView>
    </SafeAreaView>
  );
}

// ─── Map sub-styles ──────────────────────────────────────────────
const map = StyleSheet.create({
  wrapper: {
    height: 190,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 14,
    backgroundColor: '#E8EEF2',
  },
  pulseContainer: {
    position: 'absolute',
    // rider dot is roughly at 98/total_width * wrapper_width from left
    // and 240/300 * 190 from top — approximate center
    left: '16%',
    top: '75%',
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseRing: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: '#3B82F6',
    opacity: 0.45,
  },
  overlay: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
    alignItems: 'center',
  },
  overlayCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 20,
    paddingVertical: 7,
    paddingHorizontal: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  overlayTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  overlaySub: {
    fontSize: 11,
    color: '#888888',
  },
});

// ─── Main styles ─────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background, paddingTop: 10, },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 18,
    paddingTop: Platform.OS === 'android' ? 14 : 6,
    paddingBottom: 12,
  },
  backBtn: { padding: 4 },
  headerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#1A1A1A',
    letterSpacing: -0.3,
  },
  headerSub: {
    fontSize: 12,
    color: '#888888',
    marginTop: 1,
  },

  scroll: {
    paddingHorizontal: 18,
    paddingBottom: 40,
  },

  // ── Stepper
  stepperCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  stepNode: {
    alignItems: 'center',
    width: 60,
  },
  stepCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  stepCircleDone: {
    backgroundColor: '#22C55E',
  },
  stepCircleActive: {
    backgroundColor: '#F59E0B',
  },
  stepNum: {
    fontSize: 13,
    fontWeight: '700',
    color: '#9CA3AF',
  },
  stepNumActive: {
    color: '#FFFFFF',
  },
  stepLabel: {
    fontSize: 10,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 14,
    fontWeight: '500',
  },
  stepLabelDone: {
    color: '#22C55E',
    fontWeight: '700',
  },
  stepLabelActive: {
    color: '#F59E0B',
    fontWeight: '700',
  },
  stepLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#E5E7EB',
    marginTop: 14,
    borderRadius: 1,
  },
  stepLineDone: {
    backgroundColor: '#22C55E',
  },

  // ── Info cards
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  infoCardTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#888888',
    marginBottom: 14,
    letterSpacing: 0.2,
    textTransform: 'uppercase',
  },
  personRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  personDetails: {
    flex: 1,
  },
  personName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  personSub: {
    fontSize: 12,
    color: '#555555',
    marginTop: 2,
  },
  personMeta: {
    fontSize: 11,
    color: '#AAAAAA',
    marginTop: 2,
  },
  callBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#22C55E',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#22C55E',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 4,
  },

  // ── ETA pill
  etaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FEF2F2',
    borderRadius: 50,
    paddingVertical: 12,
    paddingHorizontal: 18,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  etaText: {
    fontSize: 13,
    color: '#555555',
  },
  etaBold: {
    fontWeight: '800',
    color: '#D32F2F',
  },
});
