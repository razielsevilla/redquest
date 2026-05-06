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
// Mock map placeholder with pins (replaces real react-native-maps)
// ─────────────────────────────────────────────────────────────
function MapPlaceholder() {
  return (
    <View style={styles.mapBox}>
      {/* Map-like grid lines */}
      <View style={styles.mapGrid}>
        {[0.25, 0.5, 0.75].map(v => (
          <View key={`h${v}`} style={[styles.gridLineH, { top: `${v * 100}%` }]} />
        ))}
        {[0.25, 0.5, 0.75].map(v => (
          <View key={`v${v}`} style={[styles.gridLineV, { left: `${v * 100}%` }]} />
        ))}
      </View>

      {/* Simulated road lines */}
      <View style={[styles.roadH, { top: '45%' }]} />
      <View style={[styles.roadH, { top: '68%' }]} />
      <View style={[styles.roadV, { left: '35%' }]} />
      <View style={[styles.roadV, { left: '62%' }]} />

      {/* Pin markers */}
      <View style={[styles.pin, styles.pinRed, { top: '30%', left: '28%' }]}>
        <View style={styles.pinDot} />
      </View>
      <View style={[styles.pin, styles.pinGrey, { top: '55%', left: '50%' }]}>
        <View style={[styles.pinDot, { backgroundColor: '#888' }]} />
      </View>
      <View style={[styles.pin, styles.pinRed, { top: '38%', left: '72%' }]}>
        <View style={styles.pinDot} />
      </View>

      {/* Map label */}
      <View style={styles.mapLabel}>
        <Text style={styles.mapLabelText}>Nearby Requests</Text>
      </View>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────
// Request card
// ─────────────────────────────────────────────────────────────
function RequestCard({ name, distance, bloodType, units, time, priority, onAccept, delay }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, delay, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 400, delay, useNativeDriver: true }),
    ]).start();
  }, []);

  const isHigh = priority === 'High';

  return (
    <Animated.View
      style={[
        styles.requestCard,
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
      ]}
    >
      {/* Card header row */}
      <View style={styles.cardHeader}>
        <Text style={styles.cardName}>{name}</Text>
        <View style={[styles.priorityBadge, isHigh ? styles.priorityHigh : styles.priorityNormal]}>
          <Text style={[styles.priorityText, isHigh ? styles.priorityHighText : styles.priorityNormalText]}>
            {priority}
          </Text>
        </View>
      </View>

      {/* Distance */}
      <View style={styles.distanceRow}>
        <Text style={styles.distanceIcon}>📍</Text>
        <Text style={styles.distanceText}>{distance}</Text>
      </View>

      {/* Details row */}
      <View style={styles.detailsRow}>
        <View style={styles.detailChip}>
          <Text style={styles.detailChipText}>
            <Text style={styles.bloodTypeChip}>{bloodType}</Text>
          </Text>
        </View>
        <Text style={styles.detailSep}>  </Text>
        <Text style={styles.detailMeta}>📦 {units}</Text>
        <Text style={styles.detailSep}>  </Text>
        <Text style={styles.detailMeta}>⏱ {time}</Text>
      </View>

      {/* Accept button */}
      <TouchableOpacity
        style={styles.acceptBtn}
        onPress={onAccept}
        activeOpacity={0.85}
      >
        <Text style={styles.acceptBtnText}>Accept Request</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

// ─────────────────────────────────────────────────────────────
// MAIN SCREEN
// ─────────────────────────────────────────────────────────────
export default function QuestAlert({ navigation }) {
  const headerAnim = useRef(new Animated.Value(0)).current;
  const filterAnim = useRef(new Animated.Value(0)).current;
  const mapAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.stagger(100, [
      Animated.timing(headerAnim, { toValue: 1, duration: 350, useNativeDriver: true }),
      Animated.timing(filterAnim, { toValue: 1, duration: 350, useNativeDriver: true }),
      Animated.timing(mapAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();
  }, []);

  const REQUESTS = [
    {
      name: 'Gitanjali Hostel (Bhankrota)',
      distance: '1.2 km',
      bloodType: 'O+',
      units: '2 units',
      time: '2 hours',
      priority: 'High',
    },
    {
      name: 'Balaji Soni Hospital',
      distance: '2.5 km',
      bloodType: 'O+',
      units: '1 unit',
      time: '6 hours',
      priority: 'Normal',
    },
    {
      name: "St. Luke's Medical Center",
      distance: '3.8 km',
      bloodType: 'O+',
      units: '3 units',
      time: '4 hours',
      priority: 'High',
    },
  ];

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor="#F7F7F7" />

      {/* ── HEADER ── */}
      <Animated.View style={[styles.header, { opacity: headerAnim }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nearby Requests</Text>
        <View style={{ width: 36 }} />
      </Animated.View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ── FILTER BAR ── */}
        <Animated.View style={[styles.filterBar, { opacity: filterAnim }]}>
          <Text style={styles.filterIcon}>⚗️</Text>
          <Text style={styles.filterText}>Filter by blood type & distance</Text>
        </Animated.View>

        {/* ── MAP ── */}
        <Animated.View style={{ opacity: mapAnim, marginHorizontal: 16, marginBottom: 16 }}>
          <MapPlaceholder />
        </Animated.View>

        {/* ── REQUEST CARDS ── */}
        <View style={styles.cardsSection}>
          {REQUESTS.map((r, i) => (
            <RequestCard
              key={i}
              {...r}
              delay={i * 120}
              onAccept={() => navigation.navigate('QuestAccepted')}
            />
          ))}
        </View>
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
    backgroundColor: '#F7F7F7',
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EEEEEE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backArrow: {
    fontSize: 18,
    color: '#1A1A1A',
    lineHeight: 20,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1A1A1A',
    letterSpacing: -0.3,
  },

  // Filter bar
  filterBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  filterIcon: { fontSize: 14 },
  filterText: {
    fontSize: 13,
    color: '#555555',
    fontWeight: '500',
  },

  // Map placeholder
  mapBox: {
    height: 190,
    backgroundColor: '#E8F0E8',
    borderRadius: 14,
    overflow: 'hidden',
    position: 'relative',
  },
  mapGrid: {
    ...StyleSheet.absoluteFillObject,
  },
  gridLineH: {
    position: 'absolute',
    left: 0, right: 0,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  gridLineV: {
    position: 'absolute',
    top: 0, bottom: 0,
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  roadH: {
    position: 'absolute',
    left: 0, right: 0,
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.7)',
  },
  roadV: {
    position: 'absolute',
    top: 0, bottom: 0,
    width: 6,
    backgroundColor: 'rgba(255,255,255,0.7)',
  },
  pin: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  pinRed: { backgroundColor: '#D32F2F' },
  pinGrey: { backgroundColor: '#AAAAAA' },
  pinDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
  },
  mapLabel: {
    position: 'absolute',
    bottom: 10, right: 12,
    backgroundColor: 'rgba(255,255,255,0.85)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  mapLabelText: {
    fontSize: 11,
    color: '#555555',
    fontWeight: '600',
  },

  // Cards section
  cardsSection: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },

  // Request card
  requestCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  cardName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A1A',
    flex: 1,
    paddingRight: 8,
  },
  priorityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 50,
  },
  priorityHigh: { backgroundColor: '#FEE2E2' },
  priorityNormal: { backgroundColor: '#F3F4F6' },
  priorityHighText: { color: '#D32F2F', fontWeight: '700', fontSize: 11 },
  priorityNormalText: { color: '#555555', fontWeight: '700', fontSize: 11 },
  priorityText: { fontSize: 11, fontWeight: '700' },

  distanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 10,
  },
  distanceIcon: { fontSize: 13 },
  distanceText: { fontSize: 13, color: '#888888', fontWeight: '500' },

  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    flexWrap: 'wrap',
  },
  detailChip: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 50,
  },
  detailChipText: {
    fontSize: 13,
    fontWeight: '700',
  },
  bloodTypeChip: {
    color: '#D32F2F',
    fontWeight: '800',
  },
  detailSep: { color: '#DDDDDD' },
  detailMeta: { fontSize: 13, color: '#555555', fontWeight: '500' },

  acceptBtn: {
    backgroundColor: '#D32F2F',
    borderRadius: 50,
    paddingVertical: 13,
    alignItems: 'center',
    shadowColor: '#D32F2F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  acceptBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
