import React, { useRef, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS, RADIUS } from '../lib/theme';

// ─── Mock history data ───────────────────────────────────────────
const HISTORY = [
  {
    date: 'Today',
    items: [
      { id: 'R005', bloodType: 'O-',  units: 1, donor: 'Marco Reyes',    time: '09:14 AM', outcome: 'delivered' },
      { id: 'R004', bloodType: 'AB-', units: 2, donor: 'N/A',            time: '08:30 AM', outcome: 'cancelled' },
    ],
  },
  {
    date: 'Yesterday',
    items: [
      { id: 'R003', bloodType: 'B+',  units: 3, donor: 'Ana Torres',     time: '11:50 PM', outcome: 'delivered' },
      { id: 'R002', bloodType: 'A+',  units: 1, donor: 'Luis Mendez',    time: '06:22 PM', outcome: 'delivered' },
      { id: 'R001', bloodType: 'O+',  units: 2, donor: 'Jitesh Kumar',   time: '01:10 PM', outcome: 'delivered' },
    ],
  },
  {
    date: 'May 4, 2026',
    items: [
      { id: 'R000', bloodType: 'A-',  units: 1, donor: 'Sarah Johnson',  time: '08:05 AM', outcome: 'delivered' },
    ],
  },
];

const OUTCOME_CONFIG = {
  delivered: { label: 'Delivered', color: '#22C55E', bg: '#F0FDF4', icon: 'checkmark-circle' },
  cancelled: { label: 'Cancelled', color: '#EF4444', bg: '#FEF2F2', icon: 'close-circle'    },
};

// ─── Summary stats ───────────────────────────────────────────────
const totalDelivered = HISTORY.flatMap(g => g.items).filter(i => i.outcome === 'delivered').length;
const totalCancelled = HISTORY.flatMap(g => g.items).filter(i => i.outcome === 'cancelled').length;
const totalRequests  = HISTORY.flatMap(g => g.items).length;

// ─── Component ──────────────────────────────────────────────────
export default function HospitalHistory() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 350, useNativeDriver: true }).start();
  }, []);

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      {/* ── Header ── */}
      <View style={styles.header}>
        <Text style={styles.title}>Request History</Text>
        <Text style={styles.subtitle}>Complete log of all blood requests</Text>
      </View>

      <Animated.ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        style={{ opacity: fadeAnim }}
      >
        {/* ── Summary cards ── */}
        <View style={styles.summaryRow}>
          <View style={[styles.summaryCard, { borderTopColor: '#3B82F6' }]}>
            <Text style={styles.summaryValue}>{totalRequests}</Text>
            <Text style={styles.summaryLabel}>Total</Text>
          </View>
          <View style={[styles.summaryCard, { borderTopColor: '#22C55E' }]}>
            <Text style={styles.summaryValue}>{totalDelivered}</Text>
            <Text style={styles.summaryLabel}>Delivered</Text>
          </View>
          <View style={[styles.summaryCard, { borderTopColor: '#EF4444' }]}>
            <Text style={styles.summaryValue}>{totalCancelled}</Text>
            <Text style={styles.summaryLabel}>Cancelled</Text>
          </View>
        </View>

        {/* ── Grouped history ── */}
        {HISTORY.map(group => (
          <View key={group.date} style={styles.group}>
            {/* Date divider */}
            <View style={styles.dateDivider}>
              <View style={styles.dateLine} />
              <Text style={styles.dateLabel}>{group.date}</Text>
              <View style={styles.dateLine} />
            </View>

            {/* Items */}
            {group.items.map((item, idx) => {
              const cfg = OUTCOME_CONFIG[item.outcome];
              return (
                <View
                  key={item.id}
                  style={[
                    styles.historyCard,
                    idx < group.items.length - 1 && styles.historyCardBorder,
                  ]}
                >
                  {/* Left: blood type pill */}
                  <View style={styles.bloodPill}>
                    <Text style={styles.bloodPillText}>{item.bloodType}</Text>
                  </View>

                  {/* Middle: details */}
                  <View style={styles.historyMid}>
                    <Text style={styles.historyDonor}>{item.donor}</Text>
                    <View style={styles.historyMeta}>
                      <Ionicons name="water-outline" size={12} color="#AAAAAA" />
                      <Text style={styles.historyMetaText}>{item.units} unit{item.units !== 1 ? 's' : ''}</Text>
                      <Text style={styles.historyMetaDot}>·</Text>
                      <Ionicons name="time-outline" size={12} color="#AAAAAA" />
                      <Text style={styles.historyMetaText}>{item.time}</Text>
                    </View>
                  </View>

                  {/* Right: outcome badge */}
                  <View style={[styles.outcomeBadge, { backgroundColor: cfg.bg }]}>
                    <Ionicons name={cfg.icon} size={13} color={cfg.color} />
                    <Text style={[styles.outcomeText, { color: cfg.color }]}>{cfg.label}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        ))}

        {/* Bottom nudge */}
        <Text style={styles.endNote}>Showing last 30 days of activity</Text>
      </Animated.ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ─────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background, paddingTop: 10, },

  header: {
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1A1A1A',
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 13,
    color: '#888888',
    marginTop: 2,
  },

  scroll: {
    paddingHorizontal: 18,
    paddingBottom: 40,
  },

  // Summary row
  summaryRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
    marginTop: 4,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    borderTopWidth: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  summaryValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1A1A1A',
    letterSpacing: -0.5,
  },
  summaryLabel: {
    fontSize: 11,
    color: '#888888',
    marginTop: 3,
  },

  // Group
  group: {
    marginBottom: 8,
  },
  dateDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  dateLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E8E8E8',
  },
  dateLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#AAAAAA',
    letterSpacing: 0.3,
  },

  // History card (inside white section)
  historyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 8,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  historyCardBorder: {
    // kept for potential future use; each card is its own element
  },

  // Blood type pill
  bloodPill: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bloodPillText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#D32F2F',
  },

  // Middle info
  historyMid: {
    flex: 1,
  },
  historyDonor: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  historyMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  historyMetaText: {
    fontSize: 12,
    color: '#AAAAAA',
  },
  historyMetaDot: {
    color: '#CCCCCC',
    marginHorizontal: 2,
  },

  // Outcome badge
  outcomeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  outcomeText: {
    fontSize: 11,
    fontWeight: '700',
  },

  endNote: {
    textAlign: 'center',
    fontSize: 12,
    color: '#CCCCCC',
    marginTop: 8,
  },
});
