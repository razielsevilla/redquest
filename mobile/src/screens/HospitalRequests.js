import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS, RADIUS } from '../lib/theme';

// ─── Mock data ───────────────────────────────────────────────────
const ALL_REQUESTS = [
  {
    id: 'R001',
    bloodType: 'O+',
    units: 2,
    urgency: 'critical',
    status: 'In Transit',
    statusColor: '#3B82F6',
    statusBg: '#EFF6FF',
    donor: 'Jitesh Kumar',
    requested: '10 mins ago',
    eta: '12 mins',
  },
  {
    id: 'R002',
    bloodType: 'A+',
    units: 1,
    urgency: 'medium',
    status: 'Collection',
    statusColor: '#F59E0B',
    statusBg: '#FFFBEB',
    donor: 'Sarah Johnson',
    requested: '22 mins ago',
    eta: '25 mins',
  },
  {
    id: 'R003',
    bloodType: 'B+',
    units: 3,
    urgency: 'low',
    status: 'Pending',
    statusColor: '#6B7280',
    statusBg: '#F3F4F6',
    donor: 'Matching…',
    requested: '1 hr ago',
    eta: '—',
  },
  {
    id: 'R004',
    bloodType: 'AB-',
    units: 2,
    urgency: 'critical',
    status: 'Pending',
    statusColor: '#6B7280',
    statusBg: '#F3F4F6',
    donor: 'Matching…',
    requested: '2 hrs ago',
    eta: '—',
  },
  {
    id: 'R005',
    bloodType: 'O-',
    units: 1,
    urgency: 'medium',
    status: 'Delivered',
    statusColor: '#22C55E',
    statusBg: '#F0FDF4',
    donor: 'Marco Reyes',
    requested: '3 hrs ago',
    eta: 'Done',
  },
];

const FILTERS = ['All', 'Active', 'Pending', 'Delivered'];

const URGENCY_COLOR = {
  critical: '#EF4444',
  medium:   '#F59E0B',
  low:      '#22C55E',
};

// ─── Component ──────────────────────────────────────────────────
export default function HospitalRequests({ navigation }) {
  const [filter, setFilter] = useState('All');

  const fadeAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 350, useNativeDriver: true }).start();
  }, []);

  const filtered = ALL_REQUESTS.filter(r => {
    if (filter === 'All')       return true;
    if (filter === 'Active')    return r.status === 'In Transit' || r.status === 'Collection';
    if (filter === 'Pending')   return r.status === 'Pending';
    if (filter === 'Delivered') return r.status === 'Delivered';
    return true;
  });

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      {/* ── Header ── */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Blood Requests</Text>
          <Text style={styles.subtitle}>{ALL_REQUESTS.length} total requests today</Text>
        </View>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => navigation.navigate('CreateBloodRequest')}
          activeOpacity={0.85}
        >
          <Ionicons name="add" size={22} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* ── Filter pills ── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
      >
        {FILTERS.map(f => (
          <TouchableOpacity
            key={f}
            style={[styles.filterPill, filter === f && styles.filterPillActive]}
            onPress={() => setFilter(f)}
            activeOpacity={0.8}
          >
            <Text style={[styles.filterPillText, filter === f && styles.filterPillTextActive]}>
              {f}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* ── Request cards ── */}
      <Animated.ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        style={{ opacity: fadeAnim }}
      >
        {filtered.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="document-outline" size={48} color="#CCCCCC" />
            <Text style={styles.emptyText}>No requests found</Text>
          </View>
        ) : (
          filtered.map(req => (
            <TouchableOpacity key={req.id} style={styles.card} activeOpacity={0.88}>
              {/* Top row */}
              <View style={styles.cardTop}>
                {/* Blood type badge */}
                <View style={styles.bloodBadge}>
                  <Text style={styles.bloodBadgeText}>{req.bloodType}</Text>
                </View>

                {/* Urgency dot + label */}
                <View style={styles.urgencyRow}>
                  <View style={[styles.urgencyDot, { backgroundColor: URGENCY_COLOR[req.urgency] }]} />
                  <Text style={[styles.urgencyLabel, { color: URGENCY_COLOR[req.urgency] }]}>
                    {req.urgency.charAt(0).toUpperCase() + req.urgency.slice(1)}
                  </Text>
                </View>

                {/* Status badge */}
                <View style={[styles.statusBadge, { backgroundColor: req.statusBg }]}>
                  <Text style={[styles.statusBadgeText, { color: req.statusColor }]}>
                    {req.status}
                  </Text>
                </View>
              </View>

              {/* Mid row */}
              <View style={styles.cardMid}>
                <View style={styles.cardInfo}>
                  <Ionicons name="person-outline" size={14} color="#888888" />
                  <Text style={styles.cardInfoText}>{req.donor}</Text>
                </View>
                <View style={styles.cardInfo}>
                  <Ionicons name="water-outline" size={14} color="#888888" />
                  <Text style={styles.cardInfoText}>{req.units} unit{req.units !== 1 ? 's' : ''}</Text>
                </View>
              </View>

              {/* Bottom row */}
              <View style={styles.cardBottom}>
                <Text style={styles.cardId}>#{req.id}</Text>
                <Text style={styles.cardRequested}>{req.requested}</Text>
                {req.eta !== '—' && req.eta !== 'Done' && (
                  <View style={styles.etaChip}>
                    <Ionicons name="time-outline" size={12} color="#D32F2F" />
                    <Text style={styles.etaText}>ETA {req.eta}</Text>
                  </View>
                )}
                {req.eta === 'Done' && (
                  <View style={styles.doneChip}>
                    <Ionicons name="checkmark-circle" size={12} color="#22C55E" />
                    <Text style={styles.doneText}>Completed</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))
        )}
      </Animated.ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ─────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  addBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#D32F2F',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#D32F2F',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },

  // Filter pills
  filterRow: {
    paddingHorizontal: 18,
    paddingBottom: 12,
    gap: 8,
    flexDirection: 'row',
  },
  filterPill: {
    paddingVertical: 7,
    paddingHorizontal: 16,
    borderRadius: 50,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E5E5E5',
  },
  filterPillActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterPillText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666666',
  },
  filterPillTextActive: {
    color: '#FFFFFF',
  },

  // Scroll
  scroll: {
    paddingHorizontal: 18,
    paddingBottom: 30,
    gap: 12,
  },

  // Empty state
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
    gap: 12,
  },
  emptyText: {
    fontSize: 15,
    color: '#AAAAAA',
    fontWeight: '500',
  },

  // Request card
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  bloodBadge: {
    backgroundColor: '#FEF2F2',
    borderRadius: 8,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  bloodBadgeText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#D32F2F',
  },
  urgencyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    flex: 1,
  },
  urgencyDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  urgencyLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '700',
  },

  cardMid: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  cardInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  cardInfoText: {
    fontSize: 13,
    color: '#555555',
    fontWeight: '500',
  },

  cardBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 10,
  },
  cardId: {
    fontSize: 12,
    color: '#AAAAAA',
    fontWeight: '600',
    flex: 1,
  },
  cardRequested: {
    fontSize: 12,
    color: '#AAAAAA',
  },
  etaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEF2F2',
    borderRadius: 20,
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  etaText: {
    fontSize: 11,
    color: '#D32F2F',
    fontWeight: '700',
  },
  doneChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F0FDF4',
    borderRadius: 20,
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  doneText: {
    fontSize: 11,
    color: '#22C55E',
    fontWeight: '700',
  },
});
