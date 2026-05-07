import React, { useRef, useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, StatusBar, Animated, Easing,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS, RADIUS } from '../lib/theme';
import { checkinSimulate } from '../lib/api';
import * as storage from '../lib/storage';

// ─────────────────────────────────────────────────────────────
// Animated Mission Map with moving motorcycle
// ─────────────────────────────────────────────────────────────
function MissionMap({ eta }) {
  const motoAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(motoAnim, {
        toValue: 1, duration: 6000,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: false,
      })
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.4, duration: 700, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1.0, duration: 700, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const motoLeft = motoAnim.interpolate({
    inputRange: [0, 0.35, 0.65, 1],
    outputRange: ['8%', '35%', '55%', '68%'],
  });
  const motoTop = motoAnim.interpolate({
    inputRange: [0, 0.35, 0.65, 1],
    outputRange: ['72%', '48%', '38%', '25%'],
  });

  return (
    <View style={styles.mapBox}>
      {/* Background grid */}
      {[0.25, 0.5, 0.75].map(v => (
        <View key={`h${v}`} style={[styles.gridLine, { top: `${v * 100}%`, left: 0, right: 0, height: 1 }]} />
      ))}
      {[0.25, 0.5, 0.75].map(v => (
        <View key={`v${v}`} style={[styles.gridLine, { left: `${v * 100}%`, top: 0, bottom: 0, width: 1 }]} />
      ))}

      {/* Roads */}
      <View style={[styles.road, { top: '47%', left: 0, right: '35%', height: 7 }]} />
      <View style={[styles.road, { top: 0, bottom: '53%', left: '34%', width: 7 }]} />

      {/* Dashed route line */}
      <View style={styles.routeLine} />

      {/* Hospital destination pin */}
      <Animated.View style={[styles.pinPulse, { top: '18%', left: '66%', transform: [{ scale: pulseAnim }] }]} />
      <View style={[styles.mapPin, styles.pinRed, { top: '20%', left: '68%' }]}>
        <Ionicons name="medkit" size={10} color="white" />
      </View>

      {/* Donor origin pin */}
      <View style={[styles.mapPin, styles.pinBlue, { top: '72%', left: '6%' }]}>
        <Ionicons name="person" size={10} color="white" />
      </View>

      {/* Moving motorcycle */}
      <Animated.View style={[styles.motoPin, { left: motoLeft, top: motoTop }]}>
        <View style={styles.motoBubble}>
          <Ionicons name="bicycle" size={15} color={COLORS.primary} />
        </View>
      </Animated.View>

      {/* ETA badge */}
      <View style={styles.mapEtaBadge}>
        <Ionicons name="time-outline" size={11} color={COLORS.primary} />
        <Text style={styles.mapEtaText}>ETA ~{eta} min</Text>
      </View>

      {/* Map label */}
      <View style={styles.mapLabel}>
        <Ionicons name="navigate" size={11} color={COLORS.textSecondary} />
        <Text style={styles.mapLabelText}>En Route</Text>
      </View>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────
// QR Code for hospital check-in
// ─────────────────────────────────────────────────────────────
function QRCodeDisplay({ questId }) {
  const id = questId || 'RQDEFAULT';
  const short = id.replace(/-/g, '').slice(0, 8).toUpperCase();

  // Generate a deterministic 9×9 visual grid from the quest ID
  const grid = Array.from({ length: 9 }, (_, r) =>
    Array.from({ length: 9 }, (_, c) => {
      // Corner finder squares (top-left, top-right, bottom-left)
      if (r < 3 && c < 3) return true;
      if (r < 3 && c > 5) return true;
      if (r > 5 && c < 3) return true;
      // Center of corner squares are hollow
      if (r === 1 && c === 1) return false;
      if (r === 1 && c === 7) return false;
      if (r === 7 && c === 1) return false;
      // Data cells — deterministic from ID
      const code = id.charCodeAt((r * 9 + c) % id.length) || 0;
      return (code + r * 3 + c * 2) % 3 !== 0;
    })
  );

  return (
    <View style={styles.qrWrapper}>
      <View style={styles.qrBox}>
        {grid.map((row, r) => (
          <View key={r} style={styles.qrRow}>
            {row.map((filled, c) => (
              <View key={c} style={[styles.qrCell, filled ? styles.qrFilled : styles.qrEmpty]} />
            ))}
          </View>
        ))}
      </View>
      <View style={styles.qrMeta}>
        <Text style={styles.qrTitle}>Donor Check-in Code</Text>
        <Text style={styles.qrId}>#{short}</Text>
        <Text style={styles.qrHint}>Show this at the blood bank counter</Text>
      </View>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────
// XP Reward Display
// ─────────────────────────────────────────────────────────────
function XPReward({ urgency }) {
  const baseXP = 200;
  const bonusXP = urgency === 'critical' ? 100 : urgency === 'urgent' ? 50 : 0;
  const totalXP = baseXP + bonusXP;
  const scaleAnim = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, { toValue: 1, friction: 4, tension: 80, useNativeDriver: true }).start();
  }, []);

  return (
    <View style={styles.xpCard}>
      <View style={styles.xpLeft}>
        <Text style={styles.xpLabel}>XP REWARD</Text>
        <Animated.Text style={[styles.xpTotal, { transform: [{ scale: scaleAnim }] }]}>
          +{totalXP}
        </Animated.Text>
        <Text style={styles.xpSub}>Earned upon check-in</Text>
      </View>
      <View style={styles.xpDivider} />
      <View style={styles.xpRight}>
        <View style={styles.xpBreakRow}>
          <View style={[styles.xpDot, { backgroundColor: COLORS.primary }]} />
          <Text style={styles.xpBreakLabel}>Base donation</Text>
          <Text style={styles.xpBreakVal}>+{baseXP}</Text>
        </View>
        {bonusXP > 0 && (
          <View style={styles.xpBreakRow}>
            <View style={[styles.xpDot, { backgroundColor: '#FF6B35' }]} />
            <Text style={[styles.xpBreakLabel, { color: '#FF6B35' }]}>
              {urgency === 'critical' ? 'Critical' : 'Urgent'} bonus
            </Text>
            <Text style={[styles.xpBreakVal, { color: '#FF6B35' }]}>+{bonusXP}</Text>
          </View>
        )}
        <View style={styles.xpTotalRow}>
          <Text style={styles.xpTotalLabel}>Total</Text>
          <Text style={styles.xpTotalVal}>+{totalXP} XP</Text>
        </View>
      </View>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────
// ETA Countdown Timer
// ─────────────────────────────────────────────────────────────
function ETACountdown({ initialMinutes }) {
  const [seconds, setSeconds] = useState(initialMinutes * 60);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(s => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const progress = seconds / (initialMinutes * 60);

  return (
    <View style={styles.etaCard}>
      <View style={styles.etaLeft}>
        <Text style={styles.etaLabel}>TIME TO HOSPITAL</Text>
        <Text style={styles.etaTime}>
          {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
        </Text>
        <Text style={styles.etaHint}>{seconds === 0 ? 'You should be there!' : 'Keep going'}</Text>
      </View>
      <View style={styles.etaRight}>
        {/* Circular progress ring */}
        <View style={styles.etaRing}>
          <View style={[styles.etaFill, { opacity: 0.15 + progress * 0.85 }]} />
          <Ionicons name="bicycle" size={28} color={COLORS.primary} />
        </View>
      </View>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────
// MAIN SCREEN
// ─────────────────────────────────────────────────────────────
export default function QuestAccepted({ navigation, route }) {
  const quest = route.params?.quest || {};
  const urgency = quest.urgency || 'standard';
  const etaMinutes = quest.distance_meters
    ? Math.max(3, Math.round(quest.distance_meters / 1000 / 30 * 60))
    : 8;

  const [isCheckingIn, setIsCheckingIn] = useState(false);

  const handleCheckin = async () => {
    if (isCheckingIn || !quest.id) return;
    setIsCheckingIn(true);
    try {
      const stats = await checkinSimulate(quest.id);
      const userStr = await storage.getItem('redquest.authUser');
      const user = userStr ? JSON.parse(userStr) : {};
      navigation.replace('QuestComplete', {
        stats,
        quest,
        user,
      });
    } catch (err) {
      console.error('Check-in failed:', err);
      setIsCheckingIn(false);
    }
  };

  const anims = useRef(
    Array.from({ length: 6 }, () => ({
      opacity: new Animated.Value(0),
      translateY: new Animated.Value(24),
    }))
  ).current;

  useEffect(() => {
    Animated.stagger(80,
      anims.map(({ opacity, translateY }) =>
        Animated.parallel([
          Animated.timing(opacity, { toValue: 1, duration: 400, useNativeDriver: true }),
          Animated.timing(translateY, { toValue: 0, duration: 400, useNativeDriver: true }),
        ])
      )
    ).start();
  }, []);

  const Fade = ({ i, children, style }) => (
    <Animated.View style={[style, {
      opacity: anims[i]?.opacity ?? 1,
      transform: [{ translateY: anims[i]?.translateY ?? 0 }],
    }]}>
      {children}
    </Animated.View>
  );

  const urgencyColor = urgency === 'critical' ? '#DC2626' : urgency === 'urgent' ? '#F59E0B' : COLORS.primary;
  const urgencyLabel = urgency === 'critical' ? 'CRITICAL' : urgency === 'urgent' ? 'HIGH PRIORITY' : 'STANDARD';

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      {/* Header */}
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={20} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Quest Active</Text>
        <View style={[styles.urgencyPill, { backgroundColor: urgencyColor + '20' }]}>
          <Text style={[styles.urgencyText, { color: urgencyColor }]}>{urgencyLabel}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Hero */}
        <Fade i={0} style={styles.hero}>
          <View style={styles.checkCircle}>
            <Ionicons name="checkmark" size={32} color={COLORS.white} />
          </View>
          <Text style={styles.heroTitle}>Quest Accepted!</Text>
          <Text style={styles.heroSub}>Make your way to the hospital below.</Text>
        </Fade>

        {/* Animated map */}
        <Fade i={1}>
          <MissionMap eta={etaMinutes} />
        </Fade>

        {/* ETA Countdown */}
        <Fade i={2}>
          <ETACountdown initialMinutes={etaMinutes} />
        </Fade>

        {/* Quest details */}
        <Fade i={3}>
          <View style={styles.card}>
            <Text style={styles.cardLabel}>Quest Details</Text>
            <View style={styles.detailsGrid}>
              <View style={styles.detailChip}>
                <Ionicons name="water" size={16} color={COLORS.primary} />
                <Text style={styles.chipKey}>Blood Type</Text>
                <Text style={[styles.chipVal, { color: COLORS.primary }]}>
                  {quest.request_blood_type || 'O+'}
                </Text>
              </View>
              <View style={styles.detailChip}>
                <Ionicons name="cube-outline" size={16} color={COLORS.textSecondary} />
                <Text style={styles.chipKey}>Units</Text>
                <Text style={styles.chipVal}>{quest.units_needed || 1}</Text>
              </View>
              <View style={styles.detailChip}>
                <Ionicons name="location-outline" size={16} color={COLORS.textSecondary} />
                <Text style={styles.chipKey}>Distance</Text>
                <Text style={styles.chipVal}>
                  {quest.distance_meters
                    ? `${(quest.distance_meters / 1000).toFixed(1)} km`
                    : 'Nearby'}
                </Text>
              </View>
            </View>
            <View style={styles.destRow}>
              <View style={styles.destIcon}>
                <Ionicons name="medkit" size={20} color={COLORS.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.destName}>{quest.hospital_name || 'Hospital'}</Text>
                <Text style={styles.destAddr}>{quest.hospital_address || 'Blood Bank'}</Text>
              </View>
              <Ionicons name="navigate" size={18} color={COLORS.primary} />
            </View>
          </View>
        </Fade>

        {/* XP Reward */}
        <Fade i={4}>
          <XPReward urgency={urgency} />
        </Fade>

        {/* QR Code */}
        <Fade i={5}>
          <View style={styles.card}>
            <Text style={styles.cardLabel}>Check-in Code</Text>
            <QRCodeDisplay questId={quest.id} />
          </View>
        </Fade>

        {/* CTA Buttons */}
        <TouchableOpacity
          style={[styles.checkinBtn, isCheckingIn && { opacity: 0.7 }]}
          onPress={handleCheckin}
          activeOpacity={0.85}
          disabled={isCheckingIn}
        >
          <Ionicons name="qr-code-outline" size={20} color={COLORS.white} />
          <Text style={styles.checkinBtnText}>
            {isCheckingIn ? 'Completing check-in...' : 'Simulate QR Check-in'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => navigation.navigate('Donor')}
          activeOpacity={0.85}
        >
          <Ionicons name="navigate-outline" size={18} color={COLORS.primary} />
          <Text style={styles.primaryBtnText}>I am On My Way</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelBtn}
          onPress={() => navigation.navigate('Donor')}
          activeOpacity={0.7}
        >
          <Text style={styles.cancelText}>Can't make it? Cancel quest</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

// ─────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },
  scroll: { padding: 16, paddingBottom: 48 },

  headerBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12,
  },
  backBtn: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.surface,
    alignItems: 'center', justifyContent: 'center', ...SHADOWS.small,
  },
  headerTitle: { fontSize: 17, fontWeight: '700', color: COLORS.textPrimary, letterSpacing: -0.3 },
  urgencyPill: {
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: RADIUS.full,
  },
  urgencyText: { fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },

  hero: { alignItems: 'center', paddingVertical: 20 },
  checkCircle: {
    width: 72, height: 72, borderRadius: 36, backgroundColor: COLORS.primary,
    alignItems: 'center', justifyContent: 'center', marginBottom: 12, ...SHADOWS.button,
  },
  heroTitle: { fontSize: 24, fontWeight: '800', color: COLORS.textPrimary, letterSpacing: -0.4 },
  heroSub: { fontSize: 13, color: COLORS.textMuted, marginTop: 4 },

  // ── Map ──
  mapBox: {
    height: 200, backgroundColor: '#E8F4E8', borderRadius: RADIUS.md,
    overflow: 'hidden', marginBottom: 12, position: 'relative',
  },
  gridLine: { position: 'absolute', backgroundColor: 'rgba(255,255,255,0.45)' },
  road: { position: 'absolute', backgroundColor: 'rgba(255,255,255,0.7)' },
  routeLine: {
    position: 'absolute', top: '26%', left: '12%', width: '60%', height: 2,
    backgroundColor: COLORS.primary, opacity: 0.4,
    transform: [{ rotate: '-30deg' }],
  },
  pinPulse: {
    position: 'absolute', width: 40, height: 40, borderRadius: 20,
    backgroundColor: COLORS.primary, opacity: 0.2,
    marginLeft: -6, marginTop: -6,
  },
  mapPin: {
    position: 'absolute', width: 26, height: 26, borderRadius: 13,
    alignItems: 'center', justifyContent: 'center', ...SHADOWS.card,
  },
  pinRed: { backgroundColor: COLORS.primary },
  pinBlue: { backgroundColor: '#3B82F6' },
  motoPin: { position: 'absolute' },
  motoBubble: {
    backgroundColor: COLORS.white, borderRadius: 14, padding: 5,
    borderWidth: 1.5, borderColor: COLORS.primary, ...SHADOWS.small,
  },
  mapEtaBadge: {
    position: 'absolute', top: 10, left: 10,
    backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: RADIUS.sm,
    paddingHorizontal: 10, paddingVertical: 5,
    flexDirection: 'row', alignItems: 'center', gap: 4,
    borderWidth: 1, borderColor: COLORS.primarySurface, ...SHADOWS.small,
  },
  mapEtaText: { fontSize: 11, fontWeight: '700', color: COLORS.primary },
  mapLabel: {
    position: 'absolute', bottom: 10, right: 10,
    backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: 6,
    paddingHorizontal: 8, paddingVertical: 4,
    flexDirection: 'row', alignItems: 'center', gap: 4,
  },
  mapLabelText: { fontSize: 10, color: COLORS.textSecondary, fontWeight: '600' },

  // ── ETA Card ──
  etaCard: {
    backgroundColor: COLORS.surface, borderRadius: RADIUS.md, padding: 16,
    marginBottom: 12, flexDirection: 'row', alignItems: 'center',
    gap: 16, ...SHADOWS.card,
  },
  etaLeft: { flex: 1 },
  etaLabel: { fontSize: 10, fontWeight: '700', color: COLORS.textMuted, letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 4 },
  etaTime: { fontSize: 36, fontWeight: '800', color: COLORS.textPrimary, letterSpacing: -1, fontVariant: ['tabular-nums'] },
  etaHint: { fontSize: 12, color: COLORS.textMuted, marginTop: 2 },
  etaRight: { alignItems: 'center' },
  etaRing: {
    width: 68, height: 68, borderRadius: 34,
    backgroundColor: COLORS.primarySurface, borderWidth: 3, borderColor: COLORS.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  etaFill: { position: 'absolute', ...StyleSheet.absoluteFillObject, borderRadius: 34, backgroundColor: COLORS.primarySurface },

  // ── Card ──
  card: {
    backgroundColor: COLORS.surface, borderRadius: RADIUS.md,
    padding: 16, marginBottom: 12, ...SHADOWS.card,
  },
  cardLabel: {
    fontSize: 10, fontWeight: '700', color: COLORS.textMuted, textTransform: 'uppercase',
    letterSpacing: 0.8, marginBottom: 12,
  },

  // ── Quest Details ──
  detailsGrid: { flexDirection: 'row', gap: 8, marginBottom: 14 },
  detailChip: {
    flex: 1, backgroundColor: COLORS.background, borderRadius: RADIUS.sm,
    padding: 10, alignItems: 'center', gap: 4,
  },
  chipKey: { fontSize: 9, color: COLORS.textMuted, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.4 },
  chipVal: { fontSize: 15, fontWeight: '800', color: COLORS.textPrimary },
  destRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    borderTopWidth: 1, borderTopColor: COLORS.border, paddingTop: 12,
  },
  destIcon: {
    width: 42, height: 42, borderRadius: 21, backgroundColor: COLORS.primarySurface,
    alignItems: 'center', justifyContent: 'center',
  },
  destName: { fontSize: 14, fontWeight: '700', color: COLORS.textPrimary },
  destAddr: { fontSize: 12, color: COLORS.textMuted, marginTop: 2 },

  // ── XP ──
  xpCard: {
    backgroundColor: COLORS.surface, borderRadius: RADIUS.md, padding: 16,
    marginBottom: 12, flexDirection: 'row', alignItems: 'center',
    gap: 16, ...SHADOWS.card,
    borderWidth: 1, borderColor: COLORS.primarySurface,
  },
  xpLeft: { alignItems: 'center', minWidth: 80 },
  xpLabel: { fontSize: 9, fontWeight: '700', color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: 0.8 },
  xpTotal: { fontSize: 38, fontWeight: '900', color: COLORS.primary, letterSpacing: -1 },
  xpSub: { fontSize: 10, color: COLORS.textMuted, textAlign: 'center' },
  xpDivider: { width: 1, height: 60, backgroundColor: COLORS.border },
  xpRight: { flex: 1, gap: 6 },
  xpBreakRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  xpDot: { width: 7, height: 7, borderRadius: 4 },
  xpBreakLabel: { flex: 1, fontSize: 12, color: COLORS.textSecondary, fontWeight: '500' },
  xpBreakVal: { fontSize: 13, fontWeight: '700', color: COLORS.textPrimary },
  xpTotalRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    borderTopWidth: 1, borderTopColor: COLORS.border, paddingTop: 6, marginTop: 2,
  },
  xpTotalLabel: { fontSize: 12, color: COLORS.textMuted, fontWeight: '600' },
  xpTotalVal: { fontSize: 14, fontWeight: '800', color: COLORS.primary },

  // ── QR Code ──
  qrWrapper: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  qrBox: {
    padding: 8, backgroundColor: COLORS.white, borderRadius: 8,
    borderWidth: 1, borderColor: COLORS.border,
  },
  qrRow: { flexDirection: 'row' },
  qrCell: { width: 11, height: 11, margin: 0.5 },
  qrFilled: { backgroundColor: '#1A1A1A' },
  qrEmpty: { backgroundColor: COLORS.white },
  qrMeta: { flex: 1 },
  qrTitle: { fontSize: 13, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 4 },
  qrId: { fontSize: 16, fontWeight: '800', color: COLORS.primary, letterSpacing: 1, fontFamily: 'monospace' },
  qrHint: { fontSize: 11, color: COLORS.textMuted, marginTop: 6, lineHeight: 16 },

  // ── Buttons ──
  primaryBtn: {
    borderRadius: RADIUS.full, paddingVertical: 14,
    alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8,
    marginBottom: 10,
    backgroundColor: COLORS.surface,
    borderWidth: 1.5, borderColor: COLORS.primary,
  },
  primaryBtnText: { color: COLORS.primary, fontSize: 15, fontWeight: '700', letterSpacing: 0.3 },
  checkinBtn: {
    backgroundColor: COLORS.primary, borderRadius: RADIUS.full, paddingVertical: 16,
    alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8,
    marginTop: 8, marginBottom: 10, ...SHADOWS.button,
  },
  checkinBtnText: { color: COLORS.white, fontSize: 16, fontWeight: '700', letterSpacing: 0.3 },
  cancelBtn: { alignItems: 'center', paddingVertical: 10 },
  cancelText: { color: COLORS.textMuted, fontSize: 13, fontWeight: '600' },
});
