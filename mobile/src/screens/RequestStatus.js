import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, StatusBar, Animated, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Rect, Circle, Path, Polyline } from 'react-native-svg';
import { COLORS, SHADOWS, RADIUS } from '../lib/theme';

// ─── Status steps ───────────────────────────────────────────
const STEPS = [
  { key: 'matching',   label: 'Matching' },
  { key: 'matched',    label: 'Matched' },
  { key: 'dispatched', label: 'Dispatched' },
  { key: 'done',       label: 'Done' },
];
const STEP_INDEX = { matching: 0, matched: 1, dispatched: 2, done: 3 };

// ─── Progress Stepper ───────────────────────────────────────
function ProgressStepper({ currentIndex }) {
  return (
    <View style={stepper.card}>
      {STEPS.map((step, idx) => {
        const done   = idx < currentIndex;
        const active = idx === currentIndex;
        return (
          <React.Fragment key={step.key}>
            <View style={stepper.node}>
              <View style={[stepper.circle, done && stepper.circleDone, active && stepper.circleActive]}>
                {done
                  ? <Ionicons name="checkmark" size={14} color={COLORS.white} />
                  : <Text style={[stepper.num, active && stepper.numActive]}>{idx + 1}</Text>}
              </View>
              <Text style={[stepper.label, done && stepper.labelDone, active && stepper.labelActive]}>
                {step.label}
              </Text>
            </View>
            {idx < STEPS.length - 1 && (
              <View style={[stepper.line, done && stepper.lineDone]} />
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
}

const stepper = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, paddingVertical: 18,
    paddingHorizontal: 14, flexDirection: 'row', alignItems: 'flex-start',
    justifyContent: 'center', marginBottom: 14, ...SHADOWS.card,
  },
  node: { alignItems: 'center', width: 65 },
  circle: {
    width: 30, height: 30, borderRadius: 15, backgroundColor: COLORS.inputBorder,
    alignItems: 'center', justifyContent: 'center', marginBottom: 6,
  },
  circleDone: { backgroundColor: COLORS.success },
  circleActive: { backgroundColor: COLORS.primary },
  num: { fontSize: 13, fontWeight: '700', color: COLORS.textMuted },
  numActive: { color: COLORS.white },
  label: { fontSize: 10, color: COLORS.textMuted, textAlign: 'center', lineHeight: 14, fontWeight: '500' },
  labelDone: { color: COLORS.success, fontWeight: '700' },
  labelActive: { color: COLORS.primary, fontWeight: '700' },
  line: { flex: 1, height: 2, backgroundColor: COLORS.inputBorder, marginTop: 14, borderRadius: 1 },
  lineDone: { backgroundColor: COLORS.success },
});

// ─── Spinner ────────────────────────────────────────────────
function PulseSpinner() {
  const anim = useRef(new Animated.Value(0.3)).current;
  useEffect(() => {
    Animated.loop(Animated.sequence([
      Animated.timing(anim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(anim, { toValue: 0.3, duration: 800, useNativeDriver: true }),
    ])).start();
  }, []);
  return (
    <View style={{ alignItems: 'center', marginVertical: 20 }}>
      <Animated.View style={{
        width: 48, height: 48, borderRadius: 24,
        borderWidth: 4, borderColor: COLORS.primary, borderTopColor: 'transparent', opacity: anim,
      }} />
    </View>
  );
}

// ─── Map View Component ─────────────────────────────────────
function MapView({ isReached }) {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const riderPos = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.4, duration: 1000, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
      ])
    ).start();

    if (!isReached) {
      Animated.timing(riderPos, {
        toValue: 1,
        duration: 15000,
        useNativeDriver: false,
      }).start();
    }
  }, [isReached]);

  const riderX = riderPos.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [98, 228, 338],
  });
  const riderY = riderPos.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [240, 162, 77],
  });

  return (
    <View style={mapStyles.wrapper}>
      <Svg width="100%" height="100%" viewBox="0 0 480 300" preserveAspectRatio="xMidYMid slice">
        <Rect x="0" y="0" width="480" height="300" fill="#F1F5F9" />
        <Rect x="20" y="20" width="100" height="80" fill="#E2E8F0" rx="8" />
        <Rect x="140" y="20" width="150" height="60" fill="#E2E8F0" rx="8" />
        <Rect x="310" y="20" width="150" height="80" fill="#E2E8F0" rx="8" />
        <Rect x="20" y="120" width="100" height="150" fill="#E2E8F0" rx="8" />
        <Rect x="140" y="100" width="150" height="80" fill="#E2E8F0" rx="8" />
        <Rect x="310" y="120" width="150" height="150" fill="#E2E8F0" rx="8" />
        
        <Rect x="0" y="100" width="480" height="16" fill="white" />
        <Rect x="120" y="0" width="16" height="300" fill="white" />
        <Rect x="290" y="0" width="16" height="300" fill="white" />

        <Polyline
          points="98,270 98,162 228,162 228,77 338,77"
          fill="none"
          stroke={COLORS.primaryMuted}
          strokeWidth="4"
          strokeDasharray="8 4"
        />

        <Path
          d="M338 30 C338 10 368 10 368 30 C368 50 353 65 353 65 C353 65 338 50 338 30 Z"
          fill={COLORS.primary}
          transform="translate(-15, 10)"
        />

        <AnimatedCircle cx={riderX} cy={riderY} r="8" fill={isReached ? COLORS.success : COLORS.info} />
      </Svg>
      
      {!isReached && (
        <View style={mapStyles.pulseWrap}>
          <Animated.View style={[mapStyles.pulse, { transform: [{ scale: pulseAnim }] }]} />
        </View>
      )}

      <View style={mapStyles.overlay}>
        <View style={mapStyles.overlayBadge}>
          <Ionicons name="navigate" size={14} color={isReached ? COLORS.success : COLORS.info} />
          <Text style={mapStyles.overlayText}>
            {isReached ? "Rider has arrived!" : "Rider is en route"}
          </Text>
        </View>
      </View>
    </View>
  );
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const mapStyles = StyleSheet.create({
  wrapper: { height: 180, backgroundColor: '#F1F5F9', position: 'relative', borderRadius: RADIUS.lg, overflow: 'hidden', marginBottom: 14, ...SHADOWS.small },
  pulseWrap: { position: 'absolute', left: '18%', bottom: '20%', width: 30, height: 30, alignItems: 'center', justifyContent: 'center' },
  pulse: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: COLORS.info, opacity: 0.6 },
  overlay: { position: 'absolute', top: 12, left: 12 },
  overlayBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(255,255,255,0.95)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, ...SHADOWS.small },
  overlayText: { fontSize: 12, fontWeight: '700', color: COLORS.textPrimary },
});

// ─── Main Screen ────────────────────────────────────────────
export default function RequestStatus({ navigation }) {
  const [status, setStatus] = useState('matching');
  const [isArrived, setIsArrived] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const arriveBtnAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }).start();
  }, []);

  useEffect(() => {
    if (status === 'matching') { const t = setTimeout(() => setStatus('matched'), 4000); return () => clearTimeout(t); }
    if (status === 'matched')  { const t = setTimeout(() => setStatus('dispatched'), 4000); return () => clearTimeout(t); }
    
    if (status === 'dispatched') {
      const t = setTimeout(() => {
        setIsArrived(true);
        Animated.spring(arriveBtnAnim, { toValue: 1, tension: 50, friction: 8, useNativeDriver: true }).start();
      }, 7000);
      return () => clearTimeout(t);
    }
  }, [status]);

  const currentIndex = STEP_INDEX[status];

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Live Tracking</Text>
          <Text style={styles.headerSub}>Blood Request</Text>
        </View>
      </View>

      <Animated.ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false} style={{ opacity: fadeAnim }}>
        {/* Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Blood request posted</Text>
          <View style={styles.summaryRow}>
            <View style={styles.summaryBadge}><Text style={styles.summaryBadgeText}>O+</Text></View>
            <Text style={styles.summarySep}>•</Text>
            <Text style={styles.summaryDetail}>Urgent</Text>
            <Text style={styles.summarySep}>•</Text>
            <Text style={styles.summaryDetail}>St. Luke's</Text>
          </View>
        </View>

        <ProgressStepper currentIndex={currentIndex} />

        {/* MATCHING */}
        {status === 'matching' && (
          <View style={styles.stateCard}>
            <View style={styles.stateIconWrap}>
              <Ionicons name="search-outline" size={28} color={COLORS.primary} />
            </View>
            <Text style={styles.stateTitle}>Searching for nearby compatible donors...</Text>
            <PulseSpinner />
            <Text style={styles.stateSubtitle}>— updates in real time</Text>
            <View style={{ flex: 1 }} />
            <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation.goBack()} activeOpacity={0.7}>
              <Text style={styles.cancelBtnText}>Cancel request</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* MATCHED */}
        {status === 'matched' && (
          <View>
            <View style={styles.successBanner}>
              <View style={styles.successIconWrap}>
                <Ionicons name="checkmark-circle" size={24} color={COLORS.success} />
              </View>
              <View>
                <Text style={styles.successTitle}>Donor found!</Text>
                <Text style={styles.successSub}>Blood type O+ confirmed</Text>
              </View>
            </View>
            <View style={styles.infoCard}>
              <Text style={styles.infoCardLabel}>RIDER INFORMATION</Text>
              <View style={styles.personRow}>
                <View style={[styles.avatar, { backgroundColor: COLORS.infoLight }]}>
                  <Ionicons name="bicycle" size={22} color={COLORS.info} />
                </View>
                <View style={styles.personDetails}>
                  <Text style={styles.personName}>Miguel Santos • Lalamove</Text>
                  <Text style={styles.personMeta}>Plate: ABC 1234</Text>
                </View>
              </View>
            </View>
            <View style={styles.etaCard}>
              <View style={styles.etaRow}>
                <Ionicons name="time-outline" size={16} color={COLORS.primary} />
                <Text style={styles.etaText}>Rider ETA to donor: <Text style={styles.etaBold}>4 min</Text></Text>
              </View>
              <View style={styles.etaRow}>
                <Ionicons name="location-outline" size={16} color={COLORS.primary} />
                <Text style={styles.etaText}>Estimated arrival at hospital: <Text style={styles.etaBold}>~25 minutes</Text></Text>
              </View>
            </View>
            <View style={styles.warningPill}>
              <Ionicons name="alert-circle-outline" size={16} color={COLORS.warning} />
              <Text style={styles.warningText}>Please inform the blood bank to prepare.</Text>
            </View>
          </View>
        )}

        {/* DISPATCHED */}
        {status === 'dispatched' && (
          <View>
            <View style={styles.dispatchBanner}>
              <View style={styles.dispatchIconWrap}>
                <Ionicons name="bicycle" size={24} color={COLORS.info} />
              </View>
              <View>
                <Text style={styles.dispatchTitle}>Blood is on the way!</Text>
                <Text style={styles.dispatchSub}>Rider has picked up the blood unit</Text>
              </View>
            </View>

            {/* Map View */}
            <MapView isReached={isArrived} />

            <View style={styles.infoCard}>
              <Text style={styles.infoCardLabel}>RIDER EN ROUTE</Text>
              <View style={styles.personRow}>
                <View style={[styles.avatar, { backgroundColor: COLORS.infoLight }]}>
                  <Ionicons name="bicycle" size={22} color={COLORS.info} />
                </View>
                <View style={styles.personDetails}>
                  <Text style={styles.personName}>Miguel Santos • Lalamove</Text>
                  <Text style={styles.personMeta}>Plate: ABC 1234</Text>
                </View>
              </View>
            </View>

            {!isArrived ? (
              <View>
                <View style={styles.etaPill}>
                  <Ionicons name="time-outline" size={16} color={COLORS.primary} />
                  <Text style={styles.etaPillText}>Arriving at hospital in <Text style={styles.etaBold}>~15 minutes</Text></Text>
                </View>
                <View style={styles.warningPill}>
                  <Ionicons name="medkit-outline" size={16} color={COLORS.warning} />
                  <Text style={styles.warningText}>Blood bank should be ready for receiving.</Text>
                </View>
              </View>
            ) : (
              <Animated.View style={{ 
                transform: [{ translateY: arriveBtnAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }],
                opacity: arriveBtnAnim 
              }}>
                <TouchableOpacity 
                  style={[styles.homeBtn, { backgroundColor: COLORS.success, marginBottom: 14 }]} 
                  onPress={() => setStatus('done')}
                  activeOpacity={0.88}
                >
                  <Text style={styles.homeBtnText}>Rider has Arrived! Confirm Delivery</Text>
                  <Ionicons name="arrow-forward" size={18} color={COLORS.white} />
                </TouchableOpacity>
              </Animated.View>
            )}
          </View>
        )}

        {/* DONE */}
        {status === 'done' && (
          <View>
            <View style={styles.doneBanner}>
              <View style={styles.doneIconWrap}>
                <Ionicons name="checkmark-done-circle" size={32} color={COLORS.success} />
              </View>
              <Text style={styles.doneTitle}>Blood Delivered!</Text>
              <Text style={styles.doneSub}>The blood has been successfully delivered to{'\n'}St. Luke's BGC</Text>
            </View>
            <View style={styles.infoCard}>
              <Text style={styles.infoCardLabel}>DELIVERY SUMMARY</Text>
              {[
                ['Blood Type', 'O+'], ['Donor', 'Verified Donor'], ['Rider', 'Miguel Santos'], ['Delivered to', "St. Luke's BGC"]
              ].map(([label, value], i, arr) => (
                <View key={label} style={[styles.summaryItem, i === arr.length - 1 && { borderBottomWidth: 0 }]}>
                  <Text style={styles.summaryItemLabel}>{label}</Text>
                  <Text style={styles.summaryItemValue}>{value}</Text>
                </View>
              ))}
            </View>
            <TouchableOpacity style={styles.homeBtn} onPress={() => navigation.navigate('Requester')} activeOpacity={0.88}>
              <Ionicons name="home-outline" size={18} color={COLORS.white} />
              <Text style={styles.homeBtnText}>Back to Home</Text>
            </TouchableOpacity>
          </View>
        )}
      </Animated.ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 18, paddingTop: Platform.OS === 'android' ? 14 : 6, paddingBottom: 12,
  },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 17, fontWeight: '800', color: COLORS.textPrimary, letterSpacing: -0.3 },
  headerSub: { fontSize: 12, color: COLORS.textMuted, marginTop: 1 },
  scroll: { paddingHorizontal: 18, paddingBottom: 40, flexGrow: 1 },

  summaryCard: { backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, padding: 16, marginBottom: 14, ...SHADOWS.card },
  summaryTitle: { fontSize: 18, fontWeight: '800', color: COLORS.textPrimary, marginBottom: 10 },
  summaryRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  summaryBadge: { backgroundColor: COLORS.primarySurface, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  summaryBadgeText: { fontSize: 14, fontWeight: '800', color: COLORS.primary },
  summarySep: { color: COLORS.textMuted, fontSize: 14 },
  summaryDetail: { fontSize: 14, color: COLORS.textSecondary, fontWeight: '500' },

  stateCard: {
    backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, padding: 24,
    alignItems: 'center', minHeight: 280, ...SHADOWS.card,
  },
  stateIconWrap: {
    width: 56, height: 56, borderRadius: 28, backgroundColor: COLORS.primarySurface,
    alignItems: 'center', justifyContent: 'center', marginBottom: 16,
  },
  stateTitle: { fontSize: 16, fontWeight: '600', color: COLORS.textPrimary, textAlign: 'center' },
  stateSubtitle: { fontSize: 13, color: COLORS.textMuted, fontStyle: 'italic' },
  cancelBtn: { paddingVertical: 14, alignItems: 'center', width: '100%' },
  cancelBtnText: { color: COLORS.textMuted, fontSize: 14, fontWeight: '600' },

  successBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: COLORS.successLight,
    borderRadius: RADIUS.md, padding: 16, marginBottom: 14, borderWidth: 1, borderColor: '#DCFCE7',
  },
  successIconWrap: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: '#DCFCE7',
    alignItems: 'center', justifyContent: 'center',
  },
  successTitle: { fontSize: 16, fontWeight: '800', color: COLORS.success },
  successSub: { fontSize: 13, color: COLORS.textSecondary, marginTop: 2 },

  dispatchBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: COLORS.infoLight,
    borderRadius: RADIUS.md, padding: 16, marginBottom: 14, borderWidth: 1, borderColor: '#DBEAFE',
  },
  dispatchIconWrap: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: '#DBEAFE',
    alignItems: 'center', justifyContent: 'center',
  },
  dispatchTitle: { fontSize: 16, fontWeight: '800', color: COLORS.info },
  dispatchSub: { fontSize: 13, color: COLORS.textSecondary, marginTop: 2 },

  doneBanner: {
    alignItems: 'center', backgroundColor: COLORS.successLight, borderRadius: RADIUS.lg,
    padding: 24, marginBottom: 14, borderWidth: 1, borderColor: '#DCFCE7',
  },
  doneIconWrap: {
    width: 56, height: 56, borderRadius: 28, backgroundColor: '#DCFCE7',
    alignItems: 'center', justifyContent: 'center', marginBottom: 12,
  },
  doneTitle: { fontSize: 22, fontWeight: '800', color: COLORS.success, marginBottom: 6 },
  doneSub: { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 20 },

  infoCard: { backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, padding: 16, marginBottom: 14, ...SHADOWS.card },
  infoCardLabel: { fontSize: 11, fontWeight: '700', color: COLORS.textMuted, marginBottom: 12, letterSpacing: 0.5 },
  personRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  personDetails: { flex: 1 },
  personName: { fontSize: 15, fontWeight: '700', color: COLORS.textPrimary },
  personMeta: { fontSize: 12, color: COLORS.textMuted, marginTop: 3, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace' },

  etaCard: { backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, padding: 16, marginBottom: 14, gap: 10, ...SHADOWS.card },
  etaRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  etaText: { fontSize: 14, color: COLORS.textSecondary },
  etaBold: { fontWeight: '800', color: COLORS.primary },
  etaPill: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: COLORS.primarySurface, borderRadius: RADIUS.full,
    paddingVertical: 12, paddingHorizontal: 18, justifyContent: 'center',
    borderWidth: 1, borderColor: COLORS.primaryMuted, marginBottom: 14,
  },
  etaPillText: { fontSize: 13, color: COLORS.textSecondary },

  warningPill: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: COLORS.warningLight, borderRadius: RADIUS.full,
    paddingVertical: 12, paddingHorizontal: 18, justifyContent: 'center',
    borderWidth: 1, borderColor: '#FDE68A', marginBottom: 14,
  },
  warningText: { fontSize: 13, color: '#92400E', fontWeight: '600' },

  summaryItem: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  summaryItemLabel: { fontSize: 13, color: COLORS.textMuted },
  summaryItemValue: { fontSize: 14, fontWeight: '700', color: COLORS.textPrimary },

  homeBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: COLORS.primary, paddingVertical: 16, borderRadius: RADIUS.md, ...SHADOWS.button,
  },
  homeBtnText: { color: COLORS.white, fontSize: 16, fontWeight: '700' },
});
