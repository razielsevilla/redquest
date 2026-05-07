import React, { useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, SafeAreaView,
  ScrollView, StatusBar, Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS, RADIUS } from '../lib/theme';
import { checkinSimulate } from '../lib/api';

// ─── Progress stepper ────────────────────────────────────────
const STEPS = [
  { label: 'Request\nAccepted', done: true },
  { label: 'Rider\nAssigned', done: true },
  { label: 'Blood\nCollection', done: false },
  { label: 'Delivered', done: false },
];

function ProgressStepper() {
  return (
    <View style={styles.stepperWrap}>
      {STEPS.map((step, i) => (
        <React.Fragment key={i}>
          <View style={styles.stepCol}>
            <View style={[styles.stepCircle, step.done && styles.stepCircleDone]}>
              {step.done
                ? <Ionicons name="checkmark" size={14} color={COLORS.white} />
                : <Text style={styles.stepNum}>{i + 1}</Text>}
            </View>
            <Text style={[styles.stepLabel, step.done && styles.stepLabelDone]}>{step.label}</Text>
          </View>
          {i < STEPS.length - 1 && (
            <View style={[styles.stepLine, STEPS[i + 1].done && styles.stepLineDone]} />
          )}
        </React.Fragment>
      ))}
    </View>
  );
}

// ─── QR code simulation ─────────────────────────────────────
function FakeQR({ size = 180 }) {
  const cell = size / 21;
  const grid = [];
  const finderOffsets = [
    [0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],
    [0,1],[6,1],[0,2],[2,2],[3,2],[4,2],[6,2],
    [0,3],[2,3],[4,3],[6,3],[0,4],[2,4],[3,4],[4,4],[6,4],
    [0,5],[6,5],[0,6],[1,6],[2,6],[3,6],[4,6],[5,6],[6,6],
  ];
  const finderTR = finderOffsets.map(([x,y]) => [x+14,y]);
  const finderBL = finderOffsets.map(([x,y]) => [x,y+14]);
  const allFinderCells = new Set([
    ...finderOffsets.map(([x,y])=>`${x},${y}`),
    ...finderTR.map(([x,y])=>`${x},${y}`),
    ...finderBL.map(([x,y])=>`${x},${y}`),
  ]);
  const dataCells = new Set();
  let seed = 42;
  for (let i = 0; i < 90; i++) {
    seed = (seed * 1664525 + 1013904223) & 0xffffffff;
    const x = Math.abs(seed % 21);
    seed = (seed * 1664525 + 1013904223) & 0xffffffff;
    const y = Math.abs(seed % 21);
    if (!allFinderCells.has(`${x},${y}`)) dataCells.add(`${x},${y}`);
  }
  for (let row = 0; row < 21; row++) {
    for (let col = 0; col < 21; col++) {
      const key = `${col},${row}`;
      const filled = allFinderCells.has(key) || dataCells.has(key);
      grid.push(
        <View key={key} style={{
          position: 'absolute', left: col * cell, top: row * cell,
          width: cell - 0.5, height: cell - 0.5,
          backgroundColor: filled ? COLORS.textPrimary : COLORS.white,
        }} />
      );
    }
  }
  return (
    <View style={{ width: size, height: size, backgroundColor: COLORS.white, position: 'relative' }}>
      {grid}
    </View>
  );
}

// ─── Main Screen ────────────────────────────────────────────
export default function RiderEnRoute({ navigation, route }) {
  const quest = route.params?.quest || {};
  const [isSimulating, setIsSimulating] = React.useState(false);
  const anims = useRef(
    Array.from({ length: 4 }, () => ({
      opacity: new Animated.Value(0),
      translateY: new Animated.Value(24),
    }))
  ).current;

  useEffect(() => {
    Animated.stagger(100,
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
      opacity: anims[i].opacity,
      transform: [{ translateY: anims[i].translateY }],
    }]}>{children}</Animated.View>
  );

  const handleSimulate = async () => {
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

      <Fade i={0} style={styles.header}>
        <View style={styles.liveIndicator}>
          <View style={styles.liveIndicatorDot} />
          <Text style={styles.liveIndicatorText}>LIVE</Text>
        </View>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Donation in Progress</Text>
          <Text style={styles.headerSub}>{quest.hospital_name || 'City General Hospital'}</Text>
        </View>
        <View style={{ width: 50 }} />
      </Fade>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Fade i={1}>
          <View style={styles.card}><ProgressStepper /></View>
        </Fade>

        <Fade i={2}>
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
                <Text style={styles.riderId}>Plate: {quest.rider?.plate_number || 'VF-R-2341'}</Text>
              </View>
              <TouchableOpacity style={styles.callBtn} activeOpacity={0.8}>
                <Ionicons name="call" size={18} color={COLORS.success} />
              </TouchableOpacity>
            </View>
            <View style={styles.arrivingRow}>
              <View style={styles.greenDot} />
              <Text style={styles.arrivingLabel}>Arriving in</Text>
              <Text style={styles.arrivingTime}>{quest.rider?.eta_minutes || 12} mins</Text>
            </View>
          </View>
        </Fade>

        <Fade i={3}>
          <View style={styles.card}>
            <Text style={styles.cardLabel}>Verification QR Code</Text>
            <Text style={styles.qrHint}>Show this at the blood bank counter</Text>
            <View style={styles.qrWrap}><FakeQR size={200} /></View>
          </View>
        </Fade>

        <TouchableOpacity 
          style={[styles.primaryBtn, isSimulating && { opacity: 0.7 }]}
          onPress={handleSimulate} 
          activeOpacity={0.85}
          disabled={isSimulating}
        >
          <Text style={styles.primaryBtnText}>{isSimulating ? 'Simulating...' : 'Demo: QR Scanned'}</Text>
          {!isSimulating && <Ionicons name="arrow-forward" size={18} color={COLORS.white} />}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 14,
  },
  liveIndicator: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: COLORS.successLight, paddingVertical: 6, paddingHorizontal: 12,
    borderRadius: RADIUS.full,
  },
  liveIndicatorDot: {
    width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.success,
  },
  liveIndicatorText: {
    fontSize: 11, fontWeight: '800', color: COLORS.success, letterSpacing: 0.5,
  },
  headerCenter: { alignItems: 'center' },
  headerTitle: { fontSize: 16, fontWeight: '800', color: COLORS.textPrimary, letterSpacing: -0.3 },
  headerSub: { fontSize: 12, color: COLORS.textMuted, marginTop: 2 },
  scroll: { paddingHorizontal: 16, paddingBottom: 40 },
  card: { backgroundColor: COLORS.surface, borderRadius: RADIUS.md, padding: 16, marginBottom: 12, ...SHADOWS.card },
  cardLabel: { fontSize: 11, fontWeight: '700', color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 14 },

  // Stepper
  stepperWrap: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'center', paddingVertical: 4 },
  stepCol: { alignItems: 'center', width: 60 },
  stepCircle: {
    width: 28, height: 28, borderRadius: 14, backgroundColor: COLORS.background,
    borderWidth: 1.5, borderColor: COLORS.inputBorder, alignItems: 'center', justifyContent: 'center', marginBottom: 6,
  },
  stepCircleDone: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  stepNum: { color: COLORS.textMuted, fontWeight: '700', fontSize: 13 },
  stepLabel: { fontSize: 10, color: COLORS.textMuted, textAlign: 'center', lineHeight: 14, fontWeight: '500' },
  stepLabelDone: { color: COLORS.textSecondary, fontWeight: '600' },
  stepLine: { flex: 1, height: 2, backgroundColor: COLORS.border, marginTop: 15, marginHorizontal: 2 },
  stepLineDone: { backgroundColor: COLORS.primary },

  // Rider
  riderRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
  riderAvatar: {
    width: 48, height: 48, borderRadius: 24, backgroundColor: COLORS.success,
    alignItems: 'center', justifyContent: 'center',
  },
  riderAvatarText: { color: COLORS.white, fontWeight: '800', fontSize: 16 },
  riderInfo: { flex: 1 },
  riderName: { fontSize: 15, fontWeight: '700', color: COLORS.textPrimary },
  riderId: { fontSize: 12, color: COLORS.textMuted, marginTop: 2 },
  callBtn: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.successLight,
    alignItems: 'center', justifyContent: 'center',
  },
  arrivingRow: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: COLORS.background, borderRadius: 8, paddingVertical: 10, paddingHorizontal: 12,
  },
  greenDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.success },
  arrivingLabel: { fontSize: 13, color: COLORS.textSecondary, fontWeight: '500', flex: 1 },
  arrivingTime: { fontSize: 14, fontWeight: '800', color: COLORS.success },

  qrHint: { fontSize: 12, color: COLORS.textMuted, marginBottom: 16 },
  qrWrap: { alignItems: 'center', paddingVertical: 8 },

  primaryBtn: {
    backgroundColor: COLORS.primary, borderRadius: RADIUS.full, paddingVertical: 15,
    alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 6,
    marginTop: 4, ...SHADOWS.button,
  },
  primaryBtnText: { color: COLORS.white, fontSize: 15, fontWeight: '700', letterSpacing: 0.3 },
});
