import React, { useRef, useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, StatusBar, Animated, ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Rect, Circle, Path, Polyline } from 'react-native-svg';
import { COLORS, SHADOWS, RADIUS } from '../lib/theme';
import { checkinSimulate } from '../lib/api';

// ─── Progress stepper ────────────────────────────────────────
const STEPS_DATA = [
  { label: 'Request\nAccepted', done: true },
  { label: 'Rider\nAssigned', done: true },
  { label: 'Blood\nCollection', done: false },
  { label: 'Delivered', done: false },
];

function ProgressStepper({ activeStep }) {
  return (
    <View style={styles.stepperWrap}>
      {STEPS_DATA.map((step, i) => {
        const isDone = i < activeStep;
        const isActive = i === activeStep;
        return (
          <React.Fragment key={i}>
            <View style={styles.stepCol}>
              <View style={[
                styles.stepCircle, 
                isDone && styles.stepCircleDone,
                isActive && styles.stepCircleActive
              ]}>
                {isDone ? (
                  <Ionicons name="checkmark" size={14} color={COLORS.white} />
                ) : (
                  <Text style={[styles.stepNum, isActive && styles.stepNumActive]}>{i + 1}</Text>
                )}
              </View>
              <Text style={[
                styles.stepLabel, 
                isDone && styles.stepLabelDone,
                isActive && styles.stepLabelActive
              ]}>
                {step.label}
              </Text>
            </View>
            {i < STEPS_DATA.length - 1 && (
              <View style={[styles.stepLine, i < activeStep && styles.stepLineDone]} />
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
}

// ─── Simulated Live Map ─────────────────────────────────────
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
        duration: 15000, // Move over 15 seconds
        useNativeDriver: false,
      }).start();
    }
  }, [isReached]);

  // Approximate interpolation for rider position on the SVG grid
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
        <Rect x="0" y="0" width="480" height="300" fill="#E8EEF2" />
        {/* Simplified grid blocks */}
        <Rect x="20" y="20" width="100" height="80" fill="#D6DFE6" rx="8" />
        <Rect x="140" y="20" width="150" height="60" fill="#D6DFE6" rx="8" />
        <Rect x="310" y="20" width="150" height="80" fill="#D6DFE6" rx="8" />
        <Rect x="20" y="120" width="100" height="150" fill="#D6DFE6" rx="8" />
        <Rect x="140" y="100" width="150" height="80" fill="#D6DFE6" rx="8" />
        <Rect x="310" y="120" width="150" height="150" fill="#D6DFE6" rx="8" />
        
        {/* Roads */}
        <Rect x="0" y="100" width="480" height="16" fill="white" />
        <Rect x="120" y="0" width="16" height="300" fill="white" />
        <Rect x="290" y="0" width="16" height="300" fill="white" />

        {/* Path */}
        <Polyline
          points="98,270 98,162 228,162 228,77 338,77"
          fill="none"
          stroke={COLORS.primaryMuted}
          strokeWidth="4"
          strokeDasharray="8 4"
        />

        {/* Destination Pin */}
        <Path
          d="M338 30 C338 10 368 10 368 30 C368 50 353 65 353 65 C353 65 338 50 338 30 Z"
          fill={COLORS.primary}
          transform="translate(-15, 10)"
        />

        {/* Rider Dot */}
        {!isReached && (
          <AnimatedCircle cx={riderX} cy={riderY} r="8" fill={COLORS.success} />
        )}
      </Svg>
      
      {/* Pulse effect if not reached */}
      {!isReached && (
        <View style={mapStyles.pulseWrap}>
          <Animated.View style={[mapStyles.pulse, { transform: [{ scale: pulseAnim }] }]} />
        </View>
      )}

      <View style={mapStyles.overlay}>
        <View style={mapStyles.overlayBadge}>
          <Ionicons name="navigate" size={14} color={isReached ? COLORS.success : COLORS.primary} />
          <Text style={mapStyles.overlayText}>
            {isReached ? "Rider has arrived!" : "Rider is 1.2km away"}
          </Text>
        </View>
      </View>
    </View>
  );
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

// ─── Main Screen ────────────────────────────────────────────
export default function RiderEnRoute({ navigation, route }) {
  const quest = route.params?.quest || {};
  const [status, setStatus] = useState('tracking'); // 'tracking', 'reached'
  const [isSimulating, setIsSimulating] = useState(false);
  const fadeBtn = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Simulate rider arrival after 8 seconds for the demo
    const timer = setTimeout(() => {
      setStatus('reached');
      Animated.timing(fadeBtn, { toValue: 1, duration: 500, useNativeDriver: true }).start();
    }, 8000);
    return () => clearTimeout(timer);
  }, []);

  const handleConfirmDelivery = async () => {
    if (!quest.id) {
      navigation.navigate('QuestComplete');
      return;
    }
    setIsSimulating(true);
    try {
      const res = await checkinSimulate(quest.id);
      navigation.replace('QuestComplete', { stats: res });
    } catch (err) {
      console.error('Simulate failed', err);
      setIsSimulating(false);
    }
  };

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      <View style={styles.header}>
        <View style={styles.liveIndicator}>
          <View style={[styles.liveIndicatorDot, status === 'reached' && { backgroundColor: COLORS.success }]} />
          <Text style={[styles.liveIndicatorText, status === 'reached' && { color: COLORS.success }]}>
            {status === 'reached' ? 'ARRIVED' : 'LIVE'}
          </Text>
        </View>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Donation in Progress</Text>
          <Text style={styles.headerSub}>{quest.hospital_name || 'City General Hospital'}</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={24} color={COLORS.textMuted} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <ProgressStepper activeStep={status === 'reached' ? 3 : 2} />
        </View>

        <View style={[styles.card, { padding: 0, overflow: 'hidden' }]}>
          <MapView isReached={status === 'reached'} />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>Your Rider</Text>
          <View style={styles.riderRow}>
            <View style={styles.riderAvatar}>
              <Text style={styles.riderAvatarText}>
                {quest.rider?.rider_name ? quest.rider.rider_name.charAt(0) : 'RS'}
              </Text>
            </View>
            <View style={styles.riderInfo}>
              <Text style={styles.riderName}>{quest.rider?.rider_name || 'Rahul Singh'}</Text>
              <Text style={styles.riderId}>Plate: {quest.rider?.plate_number || 'ABC 1234'}</Text>
            </View>
            <TouchableOpacity style={styles.callBtn} activeOpacity={0.8}>
              <Ionicons name="call" size={18} color={COLORS.success} />
            </TouchableOpacity>
          </View>
          <View style={styles.arrivingRow}>
            <Ionicons name="time-outline" size={18} color={status === 'reached' ? COLORS.success : COLORS.warning} />
            <Text style={styles.arrivingLabel}>
              {status === 'reached' ? 'Rider reached destination' : 'Estimated arrival'}
            </Text>
            <Text style={[styles.arrivingTime, status === 'reached' && { color: COLORS.success }]}>
              {status === 'reached' ? 'Now' : (quest.rider?.eta_minutes ? `${quest.rider.eta_minutes} mins` : '8 mins')}
            </Text>
          </View>
        </View>

        {status === 'reached' ? (
          <Animated.View style={{ opacity: fadeBtn }}>
            <TouchableOpacity 
              style={[styles.primaryBtn, isSimulating && { opacity: 0.7 }]}
              onPress={handleConfirmDelivery} 
              activeOpacity={0.85}
              disabled={isSimulating}
            >
              <Text style={styles.primaryBtnText}>{isSimulating ? 'Confirming...' : 'Confirm Delivery'}</Text>
              {!isSimulating && <Ionicons name="arrow-forward" size={18} color={COLORS.white} />}
            </TouchableOpacity>
          </Animated.View>
        ) : (
          <View style={styles.waitingBox}>
            <ActivityIndicator size="small" color={COLORS.primary} />
            <Text style={styles.waitingText}>Waiting for rider to reach destination...</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const mapStyles = StyleSheet.create({
  wrapper: { height: 220, backgroundColor: '#E8EEF2', position: 'relative' },
  pulseWrap: { position: 'absolute', left: '18%', bottom: '20%', width: 30, height: 30, alignItems: 'center', justifyContent: 'center' },
  pulse: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: COLORS.success, opacity: 0.6 },
  overlay: { position: 'absolute', top: 12, left: 12 },
  overlayBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(255,255,255,0.9)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, ...SHADOWS.small },
  overlayText: { fontSize: 12, fontWeight: '700', color: COLORS.textPrimary },
});

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 18, paddingVertical: 14, paddingTop: 10,
  },
  liveIndicator: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: COLORS.primarySurface, paddingVertical: 6, paddingHorizontal: 12,
    borderRadius: RADIUS.full,
  },
  liveIndicatorDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.primary },
  liveIndicatorText: { fontSize: 11, fontWeight: '800', color: COLORS.primary, letterSpacing: 0.5 },
  headerCenter: { alignItems: 'center' },
  headerTitle: { fontSize: 16, fontWeight: '800', color: COLORS.textPrimary, letterSpacing: -0.3 },
  headerSub: { fontSize: 12, color: COLORS.textMuted, marginTop: 2 },
  scroll: { paddingHorizontal: 18, paddingBottom: 40 },
  card: { backgroundColor: COLORS.surface, borderRadius: RADIUS.md, padding: 16, marginBottom: 16, ...SHADOWS.card },
  cardLabel: { fontSize: 11, fontWeight: '700', color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 14 },

  stepperWrap: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'center', paddingVertical: 4 },
  stepCol: { alignItems: 'center', width: 65 },
  stepCircle: { width: 28, height: 28, borderRadius: 14, backgroundColor: COLORS.background, borderWidth: 1.5, borderColor: COLORS.border, alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
  stepCircleDone: { backgroundColor: COLORS.success, borderColor: COLORS.success },
  stepCircleActive: { backgroundColor: COLORS.warning, borderColor: COLORS.warning },
  stepNum: { color: COLORS.textMuted, fontWeight: '700', fontSize: 13 },
  stepNumActive: { color: COLORS.white },
  stepLabel: { fontSize: 10, color: COLORS.textMuted, textAlign: 'center', lineHeight: 14, fontWeight: '500' },
  stepLabelDone: { color: COLORS.success, fontWeight: '700' },
  stepLabelActive: { color: COLORS.warning, fontWeight: '700' },
  stepLine: { flex: 1, height: 2, backgroundColor: COLORS.border, marginTop: 14, marginHorizontal: 2 },
  stepLineDone: { backgroundColor: COLORS.success },

  riderRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
  riderAvatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: COLORS.primarySurface, alignItems: 'center', justifyContent: 'center' },
  riderAvatarText: { color: COLORS.primary, fontWeight: '800', fontSize: 16 },
  riderInfo: { flex: 1 },
  riderName: { fontSize: 15, fontWeight: '700', color: COLORS.textPrimary },
  riderId: { fontSize: 12, color: COLORS.textMuted, marginTop: 2 },
  callBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.successLight, alignItems: 'center', justifyContent: 'center' },
  arrivingRow: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: COLORS.background, borderRadius: 8, padding: 12 },
  arrivingLabel: { fontSize: 13, color: COLORS.textSecondary, fontWeight: '600', flex: 1 },
  arrivingTime: { fontSize: 14, fontWeight: '800', color: COLORS.warning },

  primaryBtn: { backgroundColor: COLORS.primary, borderRadius: RADIUS.md, paddingVertical: 16, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8, ...SHADOWS.button },
  primaryBtnText: { color: COLORS.white, fontSize: 16, fontWeight: '700' },
  
  waitingBox: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 20 },
  waitingText: { fontSize: 14, color: COLORS.textMuted, fontWeight: '500' },
});
