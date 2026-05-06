import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Animated,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// ─── Status steps ───────────────────────────────────────────────
const STEPS = [
  { key: 'matching',   label: 'Matching' },
  { key: 'matched',    label: 'Matched' },
  { key: 'dispatched', label: 'Dispatched' },
  { key: 'done',       label: 'Done' },
];

// Step index lookup
const STEP_INDEX = { matching: 0, matched: 1, dispatched: 2, done: 3 };

// ─── Progress Stepper (white theme) ─────────────────────────────
function ProgressStepper({ currentIndex }) {
  return (
    <View style={stepper.card}>
      {STEPS.map((step, idx) => {
        const done   = idx < currentIndex;
        const active = idx === currentIndex;

        return (
          <React.Fragment key={step.key}>
            <View style={stepper.node}>
              <View style={[
                stepper.circle,
                done   && stepper.circleDone,
                active && stepper.circleActive,
              ]}>
                {done ? (
                  <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                ) : (
                  <Text style={[stepper.num, active && stepper.numActive]}>
                    {idx + 1}
                  </Text>
                )}
              </View>
              <Text style={[
                stepper.label,
                done   && stepper.labelDone,
                active && stepper.labelActive,
              ]}>
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
  node: {
    alignItems: 'center',
    width: 65,
  },
  circle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  circleDone: {
    backgroundColor: '#22C55E',
  },
  circleActive: {
    backgroundColor: '#D32F2F',
  },
  num: {
    fontSize: 13,
    fontWeight: '700',
    color: '#9CA3AF',
  },
  numActive: {
    color: '#FFFFFF',
  },
  label: {
    fontSize: 10,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 14,
    fontWeight: '500',
  },
  labelDone: {
    color: '#22C55E',
    fontWeight: '700',
  },
  labelActive: {
    color: '#D32F2F',
    fontWeight: '700',
  },
  line: {
    flex: 1,
    height: 2,
    backgroundColor: '#E5E7EB',
    marginTop: 14,
    borderRadius: 1,
  },
  lineDone: {
    backgroundColor: '#22C55E',
  },
});

// ─── Spinner animation (for matching state) ─────────────────────
function PulseSpinner() {
  const anim = useRef(new Animated.Value(0.3)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0.3, duration: 800, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <View style={{ alignItems: 'center', marginVertical: 20 }}>
      <Animated.View style={{
        width: 48,
        height: 48,
        borderRadius: 24,
        borderWidth: 4,
        borderColor: '#D32F2F',
        borderTopColor: 'transparent',
        opacity: anim,
      }} />
    </View>
  );
}

// ─── Main Screen ────────────────────────────────────────────────
export default function RequestStatus({ navigation }) {
  const [status, setStatus] = useState('matching');

  const fadeAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }).start();
  }, []);

  // Simulate the full flow: matching → matched → dispatched → done
  useEffect(() => {
    if (status === 'matching') {
      const timer = setTimeout(() => setStatus('matched'), 5000);
      return () => clearTimeout(timer);
    }
    if (status === 'matched') {
      const timer = setTimeout(() => setStatus('dispatched'), 5000);
      return () => clearTimeout(timer);
    }
    if (status === 'dispatched') {
      const timer = setTimeout(() => setStatus('done'), 8000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  const currentIndex = STEP_INDEX[status];

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F5F7" />

      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#1A1A1A" />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Live Tracking</Text>
          <Text style={styles.headerSub}>Blood Request</Text>
        </View>
      </View>

      <Animated.ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        style={{ opacity: fadeAnim }}
      >
        {/* ── Request summary ── */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Blood request posted</Text>
          <View style={styles.summaryRow}>
            <View style={styles.summaryBadge}>
              <Text style={styles.summaryBadgeText}>O+</Text>
            </View>
            <Text style={styles.summarySep}>•</Text>
            <Text style={styles.summaryDetail}>Urgent</Text>
            <Text style={styles.summarySep}>•</Text>
            <Text style={styles.summaryDetail}>St. Luke's</Text>
          </View>
        </View>

        {/* ── Progress stepper ── */}
        <ProgressStepper currentIndex={currentIndex} />

        {/* ── MATCHING STATE ── */}
        {status === 'matching' && (
          <View style={styles.stateCard}>
            <View style={styles.stateIconWrap}>
              <Ionicons name="search-outline" size={28} color="#D32F2F" />
            </View>
            <Text style={styles.stateTitle}>Searching for nearby compatible donors...</Text>
            <PulseSpinner />
            <Text style={styles.stateSubtitle}>— updates in real time</Text>

            <View style={{ flex: 1 }} />

            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelBtnText}>Cancel request</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ── MATCHED STATE ── */}
        {status === 'matched' && (
          <View>
            {/* Success banner */}
            <View style={styles.successBanner}>
              <View style={styles.successIconWrap}>
                <Ionicons name="checkmark-circle" size={24} color="#22C55E" />
              </View>
              <View>
                <Text style={styles.successTitle}>Donor found!</Text>
                <Text style={styles.successSub}>Blood type O+ confirmed</Text>
              </View>
            </View>

            {/* Rider info */}
            <View style={styles.infoCard}>
              <Text style={styles.infoCardLabel}>RIDER INFORMATION</Text>
              <View style={styles.personRow}>
                <View style={[styles.avatar, { backgroundColor: '#DBEAFE' }]}>
                  <Ionicons name="bicycle" size={22} color="#3B82F6" />
                </View>
                <View style={styles.personDetails}>
                  <Text style={styles.personName}>Miguel Santos • Lalamove</Text>
                  <Text style={styles.personMeta}>Plate: ABC 1234</Text>
                </View>
              </View>
            </View>

            {/* ETA info */}
            <View style={styles.etaCard}>
              <View style={styles.etaRow}>
                <Ionicons name="time-outline" size={16} color="#D32F2F" />
                <Text style={styles.etaText}>
                  Rider ETA to donor: <Text style={styles.etaBold}>4 min</Text>
                </Text>
              </View>
              <View style={styles.etaRow}>
                <Ionicons name="location-outline" size={16} color="#D32F2F" />
                <Text style={styles.etaText}>
                  Estimated arrival at hospital: <Text style={styles.etaBold}>~25 minutes</Text>
                </Text>
              </View>
            </View>

            <View style={styles.warningPill}>
              <Ionicons name="alert-circle-outline" size={16} color="#F59E0B" />
              <Text style={styles.warningText}>Please inform the blood bank to prepare.</Text>
            </View>
          </View>
        )}

        {/* ── DISPATCHED STATE ── */}
        {status === 'dispatched' && (
          <View>
            {/* Dispatched banner */}
            <View style={styles.dispatchBanner}>
              <View style={styles.dispatchIconWrap}>
                <Ionicons name="bicycle" size={24} color="#3B82F6" />
              </View>
              <View>
                <Text style={styles.dispatchTitle}>Blood is on the way!</Text>
                <Text style={styles.dispatchSub}>Rider has picked up the blood unit</Text>
              </View>
            </View>

            {/* Rider info */}
            <View style={styles.infoCard}>
              <Text style={styles.infoCardLabel}>RIDER EN ROUTE</Text>
              <View style={styles.personRow}>
                <View style={[styles.avatar, { backgroundColor: '#DBEAFE' }]}>
                  <Ionicons name="bicycle" size={22} color="#3B82F6" />
                </View>
                <View style={styles.personDetails}>
                  <Text style={styles.personName}>Miguel Santos • Lalamove</Text>
                  <Text style={styles.personMeta}>Plate: ABC 1234</Text>
                </View>
              </View>
            </View>

            {/* ETA pill */}
            <View style={styles.etaPill}>
              <Ionicons name="time-outline" size={16} color="#D32F2F" />
              <Text style={styles.etaPillText}>
                Arriving at hospital in <Text style={styles.etaBold}>~15 minutes</Text>
              </Text>
            </View>

            <View style={styles.warningPill}>
              <Ionicons name="medkit-outline" size={16} color="#F59E0B" />
              <Text style={styles.warningText}>Blood bank should be ready for receiving.</Text>
            </View>
          </View>
        )}

        {/* ── DONE STATE ── */}
        {status === 'done' && (
          <View>
            {/* Completed banner */}
            <View style={styles.doneBanner}>
              <View style={styles.doneIconWrap}>
                <Ionicons name="checkmark-done-circle" size={32} color="#22C55E" />
              </View>
              <Text style={styles.doneTitle}>Blood Delivered!</Text>
              <Text style={styles.doneSub}>
                The blood has been successfully delivered to{'\n'}St. Luke's BGC
              </Text>
            </View>

            {/* Summary card */}
            <View style={styles.infoCard}>
              <Text style={styles.infoCardLabel}>DELIVERY SUMMARY</Text>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryItemLabel}>Blood Type</Text>
                <Text style={styles.summaryItemValue}>O+</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryItemLabel}>Donor</Text>
                <Text style={styles.summaryItemValue}>Verified Donor</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryItemLabel}>Rider</Text>
                <Text style={styles.summaryItemValue}>Miguel Santos</Text>
              </View>
              <View style={[styles.summaryItem, { borderBottomWidth: 0 }]}>
                <Text style={styles.summaryItemLabel}>Delivered to</Text>
                <Text style={styles.summaryItemValue}>St. Luke's BGC</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.homeBtn}
              onPress={() => navigation.navigate('Requester')}
              activeOpacity={0.88}
            >
              <Ionicons name="home-outline" size={18} color="#FFFFFF" />
              <Text style={styles.homeBtnText}>Back to Home</Text>
            </TouchableOpacity>
          </View>
        )}
      </Animated.ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ─────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F5F5F7',
  },

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
    flexGrow: 1,
  },

  // ── Summary card
  summaryCard: {
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
  summaryTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 10,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  summaryBadge: {
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  summaryBadgeText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#D32F2F',
  },
  summarySep: {
    color: '#CCCCCC',
    fontSize: 14,
  },
  summaryDetail: {
    fontSize: 14,
    color: '#555555',
    fontWeight: '500',
  },

  // ── Matching state
  stateCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    minHeight: 280,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  stateIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  stateTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    textAlign: 'center',
  },
  stateSubtitle: {
    fontSize: 13,
    color: '#AAAAAA',
    fontStyle: 'italic',
  },
  cancelBtn: {
    paddingVertical: 14,
    alignItems: 'center',
    width: '100%',
  },
  cancelBtnText: {
    color: '#AAAAAA',
    fontSize: 14,
    fontWeight: '600',
  },

  // ── Matched state — success banner
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#F0FDF4',
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#DCFCE7',
  },
  successIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  successTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#16A34A',
  },
  successSub: {
    fontSize: 13,
    color: '#555555',
    marginTop: 2,
  },

  // ── Dispatched state — dispatch banner
  dispatchBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#EFF6FF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  dispatchIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dispatchTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#2563EB',
  },
  dispatchSub: {
    fontSize: 13,
    color: '#555555',
    marginTop: 2,
  },

  // ── Done state
  doneBanner: {
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    borderRadius: 16,
    padding: 24,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#DCFCE7',
  },
  doneIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  doneTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#16A34A',
    marginBottom: 6,
  },
  doneSub: {
    fontSize: 14,
    color: '#555555',
    textAlign: 'center',
    lineHeight: 20,
  },

  // ── Info cards (rider, summary)
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
  infoCardLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#888888',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  personRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
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
  personMeta: {
    fontSize: 12,
    color: '#AAAAAA',
    marginTop: 3,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },

  // ── ETA card
  etaCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  etaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  etaText: {
    fontSize: 14,
    color: '#555555',
  },
  etaBold: {
    fontWeight: '800',
    color: '#D32F2F',
  },

  // ── ETA pill (dispatched)
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
    marginBottom: 14,
  },
  etaPillText: {
    fontSize: 13,
    color: '#555555',
  },

  // ── Warning pill
  warningPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFBEB',
    borderRadius: 50,
    paddingVertical: 12,
    paddingHorizontal: 18,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FDE68A',
    marginBottom: 14,
  },
  warningText: {
    fontSize: 13,
    color: '#92400E',
    fontWeight: '600',
  },

  // ── Summary items (done state)
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  summaryItemLabel: {
    fontSize: 13,
    color: '#888888',
  },
  summaryItemValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A1A',
  },

  // ── Home button
  homeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#D32F2F',
    paddingVertical: 16,
    borderRadius: 14,
    shadowColor: '#D32F2F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  homeBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
