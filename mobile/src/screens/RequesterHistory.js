import React, { useRef, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  Animated,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS, RADIUS } from '../lib/theme';

// ─── Mock history data ───────────────────────────────────────────
const HISTORY = [
  {
    date: 'Today',
    items: [
      { id: '1', type: 'O+', hospital: "St. Luke's BGC", status: 'Delivered', statusColor: COLORS.success, statusBg: COLORS.successLight, time: '09:14 AM' },
    ],
  },
  {
    date: 'Last Week',
    items: [
      { id: '2', type: 'A+', hospital: 'Makati Med',     status: 'Completed', statusColor: COLORS.success, statusBg: COLORS.successLight, time: '02:30 PM' },
      { id: '3', type: 'B-', hospital: 'Medical City',  status: 'Cancelled', statusColor: '#D32F2F', statusBg: '#FFF5F5', time: '11:15 AM' },
    ],
  },
  {
    date: 'April 2026',
    items: [
      { id: '4', type: 'O-', hospital: 'General Hosp',  status: 'Completed', statusColor: COLORS.success, statusBg: COLORS.successLight, time: '08:05 AM' },
      { id: '5', type: 'AB+', hospital: 'St. Luke\'s QC', status: 'Completed', statusColor: COLORS.success, statusBg: COLORS.successLight, time: '04:20 PM' },
    ],
  },
];

// ─── Summary stats ───────────────────────────────────────────────
const totalCompleted = HISTORY.flatMap(g => g.items).filter(i => i.status === 'Completed' || i.status === 'Delivered').length;
const totalCancelled = HISTORY.flatMap(g => g.items).filter(i => i.status === 'Cancelled').length;
const totalRequests  = HISTORY.flatMap(g => g.items).length;

export default function RequesterHistory({ navigation }) {
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
        <Text style={styles.subtitle}>Track all your past blood requests</Text>
      </View>

      <Animated.ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        style={{ opacity: fadeAnim }}
      >
        {/* ── Summary cards ── */}
        <View style={styles.summaryRow}>
          <View style={[styles.summaryCard, { borderTopColor: COLORS.primary }]}>
            <Text style={styles.summaryValue}>{totalRequests}</Text>
            <Text style={styles.summaryLabel}>Total</Text>
          </View>
          <View style={[styles.summaryCard, { borderTopColor: COLORS.success }]}>
            <Text style={styles.summaryValue}>{totalCompleted}</Text>
            <Text style={styles.summaryLabel}>Success</Text>
          </View>
          <View style={[styles.summaryCard, { borderTopColor: '#D32F2F' }]}>
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
            {group.items.map((item, idx) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.historyCard,
                  idx < group.items.length - 1 && styles.historyCardBorder,
                ]}
                activeOpacity={0.7}
                onPress={() => navigation.navigate('RequestStatus', { requestId: item.id })}
              >
                {/* Left: blood type pill */}
                <View style={styles.bloodPill}>
                  <Text style={styles.bloodPillText}>{item.type}</Text>
                </View>

                {/* Middle: details */}
                <View style={styles.historyMid}>
                  <Text style={styles.hospitalName}>{item.hospital}</Text>
                  <View style={styles.historyMeta}>
                    <Ionicons name="time-outline" size={12} color={COLORS.textMuted} />
                    <Text style={styles.historyMetaText}>{item.time}</Text>
                  </View>
                </View>

                {/* Right: status badge */}
                <View style={[styles.statusBadge, { backgroundColor: item.statusBg }]}>
                  <Text style={[styles.statusText, { color: item.statusColor }]}>{item.status}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ))}

        {/* Bottom nudge */}
        <Text style={styles.endNote}>End of history</Text>
      </Animated.ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },

  header: {
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 2,
  },

  scroll: {
    paddingHorizontal: 18,
    paddingBottom: 40,
  },

  summaryRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
    marginTop: 4,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    paddingVertical: 14,
    alignItems: 'center',
    borderTopWidth: 3,
    ...SHADOWS.card,
  },
  summaryValue: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: -0.5,
  },
  summaryLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 3,
  },

  group: {
    marginBottom: 16,
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
    backgroundColor: COLORS.border,
  },
  dateLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textMuted,
    letterSpacing: 0.3,
  },

  historyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: 14,
    marginBottom: 10,
    gap: 12,
    ...SHADOWS.card,
  },
  historyCardBorder: {},

  bloodPill: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: COLORS.primarySurface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bloodPillText: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.primary,
  },

  historyMid: {
    flex: 1,
  },
  hospitalName: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  historyMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  historyMetaText: {
    fontSize: 12,
    color: COLORS.textMuted,
  },

  statusBadge: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },

  endNote: {
    textAlign: 'center',
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 8,
    opacity: 0.6,
  },
});
