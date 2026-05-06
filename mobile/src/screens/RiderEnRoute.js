import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Animated,
} from 'react-native';

// ─────────────────────────────────────────────────────────────
// Progress stepper
// ─────────────────────────────────────────────────────────────
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
              <Text style={[styles.stepNum, step.done && styles.stepNumDone]}>
                {i + 1}
              </Text>
            </View>
            <Text style={[styles.stepLabel, step.done && styles.stepLabelDone]}>
              {step.label}
            </Text>
          </View>
          {i < STEPS.length - 1 && (
            <View style={[styles.stepLine, STEPS[i + 1].done && styles.stepLineDone]} />
          )}
        </React.Fragment>
      ))}
    </View>
  );
}

// ─────────────────────────────────────────────────────────────
// Simple QR-code look-alike (pixel grid)
// Uses a pattern of filled/empty squares to simulate a QR code
// ─────────────────────────────────────────────────────────────
function FakeQR({ size = 180 }) {
  const cell = size / 21;
  // Simplified QR pattern (3 finder squares + random data cells)
  const grid = [];

  // Top-left finder
  const finderOffsets = [
    [0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0],
    [0, 1], [6, 1], [0, 2], [2, 2], [3, 2], [4, 2], [6, 2],
    [0, 3], [2, 3], [4, 3], [6, 3], [0, 4], [2, 4], [3, 4], [4, 4], [6, 4],
    [0, 5], [6, 5], [0, 6], [1, 6], [2, 6], [3, 6], [4, 6], [5, 6], [6, 6],
  ];

  // Top-right finder (offset 14, 0)
  const finderTR = finderOffsets.map(([x, y]) => [x + 14, y]);
  // Bottom-left finder (offset 0, 14)
  const finderBL = finderOffsets.map(([x, y]) => [x, y + 14]);

  const allFinderCells = new Set([
    ...finderOffsets.map(([x, y]) => `${x},${y}`),
    ...finderTR.map(([x, y]) => `${x},${y}`),
    ...finderBL.map(([x, y]) => `${x},${y}`),
  ]);

  // Seeded pseudo-random data cells
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
        <View
          key={key}
          style={{
            position: 'absolute',
            left: col * cell,
            top: row * cell,
            width: cell - 0.5,
            height: cell - 0.5,
            backgroundColor: filled ? '#000000' : '#FFFFFF',
          }}
        />
      );
    }
  }

  return (
    <View style={{
      width: size, height: size,
      backgroundColor: '#FFFFFF',
      position: 'relative',
    }}>
      {grid}
    </View>
  );
}

// ─────────────────────────────────────────────────────────────
// MAIN SCREEN
// ─────────────────────────────────────────────────────────────
export default function RiderEnRoute({ navigation }) {
  const anims = useRef(
    Array.from({ length: 4 }, () => ({
      opacity: new Animated.Value(0),
      translateY: new Animated.Value(24),
    }))
  ).current;

  useEffect(() => {
    Animated.stagger(
      100,
      anims.map(({ opacity, translateY }) =>
        Animated.parallel([
          Animated.timing(opacity, { toValue: 1, duration: 400, useNativeDriver: true }),
          Animated.timing(translateY, { toValue: 0, duration: 400, useNativeDriver: true }),
        ])
      )
    ).start();
  }, []);

  const Fade = ({ i, children, style }) => (
    <Animated.View
      style={[style, {
        opacity: anims[i].opacity,
        transform: [{ translateY: anims[i].translateY }],
      }]}
    >
      {children}
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor="#F7F7F7" />

      {/* ── HEADER ── */}
      <Fade i={0} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Donation in Progress</Text>
          <Text style={styles.headerSub}>City General Hospital</Text>
        </View>
        <View style={{ width: 36 }} />
      </Fade>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* ── PROGRESS STEPPER ── */}
        <Fade i={1}>
          <View style={styles.card}>
            <ProgressStepper />
          </View>
        </Fade>

        {/* ── YOUR RIDER card ── */}
        <Fade i={2}>
          <View style={styles.card}>
            <Text style={styles.cardLabel}>Your Rider</Text>

            <View style={styles.riderRow}>
              {/* Avatar */}
              <View style={styles.riderAvatar}>
                <Text style={styles.riderAvatarText}>RS</Text>
              </View>

              {/* Info */}
              <View style={styles.riderInfo}>
                <Text style={styles.riderName}>Rahul Singh</Text>
                <Text style={styles.riderId}>Rider ID: VF-R-2341</Text>
              </View>

              {/* Call button */}
              <TouchableOpacity style={styles.callBtn} activeOpacity={0.8}>
                <Text style={styles.callBtnIcon}>📞</Text>
              </TouchableOpacity>
            </View>

            {/* Arriving row */}
            <View style={styles.arrivingRow}>
              <View style={styles.greenDot} />
              <Text style={styles.arrivingLabel}>Arriving in</Text>
              <Text style={styles.arrivingTime}>12 mins</Text>
            </View>
          </View>
        </Fade>

        {/* ── QR CODE card ── */}
        <Fade i={3}>
          <View style={styles.card}>
            <Text style={styles.cardLabel}>Verification QR Code</Text>
            <Text style={styles.qrHint}>Show this at the blood bank counter</Text>
            <View style={styles.qrWrap}>
              <FakeQR size={200} />
            </View>
          </View>
        </Fade>

        {/* ── DEMO button ── */}
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => navigation.navigate('QuestComplete')}
          activeOpacity={0.85}
        >
          <Text style={styles.primaryBtnText}>Demo: QR Scanned → Complete</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

// ─────────────────────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EEEEEE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backArrow: { fontSize: 18, color: '#1A1A1A', lineHeight: 20 },
  headerCenter: { alignItems: 'center' },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1A1A1A',
    letterSpacing: -0.3,
  },
  headerSub: {
    fontSize: 12,
    color: '#888888',
    marginTop: 2,
  },

  scroll: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },

  // Shared card
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#AAAAAA',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 14,
  },

  // Stepper
  stepperWrap: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  stepCol: {
    alignItems: 'center',
    width: 60,
  },
  stepCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#EEEEEE',
    borderWidth: 1.5,
    borderColor: '#DDDDDD',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  stepCircleDone: {
    backgroundColor: '#D32F2F',
    borderColor: '#D32F2F',
  },
  stepNum: {
    color: '#AAAAAA',
    fontWeight: '700',
    fontSize: 13,
  },
  stepNumDone: {
    color: '#FFFFFF',
  },
  stepLabel: {
    fontSize: 10,
    color: '#AAAAAA',
    textAlign: 'center',
    lineHeight: 14,
    fontWeight: '500',
  },
  stepLabelDone: {
    color: '#555555',
    fontWeight: '600',
  },
  stepLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#EEEEEE',
    marginTop: 15,
    marginHorizontal: 2,
  },
  stepLineDone: {
    backgroundColor: '#D32F2F',
  },

  // Rider card
  riderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  riderAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
  },
  riderAvatarText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 16,
  },
  riderInfo: { flex: 1 },
  riderName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  riderId: {
    fontSize: 12,
    color: '#888888',
    marginTop: 2,
  },
  callBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  callBtnIcon: { fontSize: 18 },

  // Arriving row
  arrivingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F7F7F7',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  greenDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
  },
  arrivingLabel: {
    fontSize: 13,
    color: '#555555',
    fontWeight: '500',
    flex: 1,
  },
  arrivingTime: {
    fontSize: 14,
    fontWeight: '800',
    color: '#4CAF50',
  },

  // QR code
  qrHint: {
    fontSize: 12,
    color: '#888888',
    marginBottom: 16,
  },
  qrWrap: {
    alignItems: 'center',
    paddingVertical: 8,
  },

  // Primary button
  primaryBtn: {
    backgroundColor: '#D32F2F',
    borderRadius: 50,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 4,
    shadowColor: '#D32F2F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
