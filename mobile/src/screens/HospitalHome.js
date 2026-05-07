import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  SafeAreaView, StatusBar, Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS, RADIUS } from '../lib/theme';
import { getHospitalRequests } from '../lib/api';

// ─── Sample data ────────────────────────────────────────────
const STOCK_TYPES = [
  { type: 'A+', units: 18 },
  { type: 'B+', units: 17 },
  { type: 'O+', units: 2 },
  { type: 'AB+', units: 17 },
];

export default function HospitalHome({ navigation }) {
  const [hasNotification, setHasNotification] = useState(true);
  const [requests, setRequests] = useState([]);
  const [stats, setStats] = useState({ active: 0, pending: 0, today: 0 });

  const cardAnims = useRef(
    Array.from({ length: 5 }, () => ({
      opacity: new Animated.Value(0),
      translateY: new Animated.Value(20),
    }))
  ).current;

  useEffect(() => {
    async function loadRequests() {
      try {
        const res = await getHospitalRequests();
        if (res?.requests) {
          // Sort newest first
          const sorted = res.requests.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
          setRequests(sorted);
          let active = 0, pending = 0, today = 0;
          const now = new Date();
          sorted.forEach(r => {
            if (['matching', 'notified'].includes(r.status)) pending++;
            else if (r.status !== 'complete' && r.status !== 'cancelled') active++;
            
            const reqDate = new Date(r.created_at);
            if (reqDate.toDateString() === now.toDateString()) today++;
          });
          setStats({ active, pending, today });
        }
      } catch (err) {
        console.error('Failed to load hospital requests:', err);
      }
    }
    loadRequests();
    const interval = setInterval(loadRequests, 5000);

    Animated.stagger(70,
      cardAnims.map(({ opacity, translateY }) =>
        Animated.parallel([
          Animated.timing(opacity,    { toValue: 1, duration: 380, useNativeDriver: true }),
          Animated.timing(translateY, { toValue: 0, duration: 380, useNativeDriver: true }),
        ])
      )
    ).start();

    return () => clearInterval(interval);
  }, []);

  const Stagger = ({ index, children, style }) => (
    <Animated.View style={[style, {
      opacity: cardAnims[index].opacity,
      transform: [{ translateY: cardAnims[index].translateY }],
    }]}>{children}</Animated.View>
  );

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Stagger index={0}>
          <View style={styles.header}>
            <View>
              <Text style={styles.hospitalName}>City General Hospital</Text>
              <Text style={styles.hospitalSub}>Emergency Requests</Text>
            </View>
            <TouchableOpacity style={styles.bellWrap} onPress={() => setHasNotification(false)}>
              <Ionicons name="notifications-outline" size={24} color={COLORS.primary} />
              {hasNotification && <View style={styles.bellDot} />}
            </TouchableOpacity>
          </View>
        </Stagger>

        {/* Stat chips */}
        <Stagger index={1}>
          <View style={styles.statsRow}>
            <View style={styles.statChip}>
              <Ionicons name="pulse" size={18} color={COLORS.info} style={{ marginBottom: 4 }} />
              <Text style={styles.statChipValue}>{stats.active}</Text>
              <Text style={styles.statChipLabel}>Active</Text>
            </View>
            <View style={styles.statChip}>
              <Ionicons name="time-outline" size={18} color={COLORS.warning} style={{ marginBottom: 4 }} />
              <Text style={styles.statChipValue}>{stats.pending}</Text>
              <Text style={styles.statChipLabel}>Pending</Text>
            </View>
            <View style={styles.statChip}>
              <Ionicons name="checkmark-circle-outline" size={18} color={COLORS.success} style={{ marginBottom: 4 }} />
              <Text style={styles.statChipValue}>{stats.today}</Text>
              <Text style={styles.statChipLabel}>Today</Text>
            </View>
          </View>
        </Stagger>

        {/* Create New Request */}
        <Stagger index={2}>
          <TouchableOpacity
            style={styles.createBtn}
            activeOpacity={0.88}
            onPress={() => navigation.navigate('CreateBloodRequest')}
          >
            <Ionicons name="add" size={20} color={COLORS.white} />
            <Text style={styles.createBtnText}>Create New Request</Text>
          </TouchableOpacity>
        </Stagger>

        {/* Active Requests */}
        <Stagger index={3}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Request Queue</Text>
            {requests.length === 0 ? (
              <Text style={{ color: COLORS.textMuted, fontSize: 13, paddingVertical: 10 }}>No active requests in queue.</Text>
            ) : requests.slice(0, 5).map((req, i) => {
              const isComplete = req.status === 'complete';
              const isPending = req.status === 'matching' || req.status === 'notified';
              const statusLabel = isComplete ? 'Completed' : isPending ? 'Matching' : 'In Transit';
              const statusColor = isComplete ? COLORS.success : isPending ? COLORS.warning : COLORS.info;
              const statusBg = isComplete ? COLORS.successLight : isPending ? COLORS.warningLight : COLORS.infoLight;

              return (
                <View key={req.id} style={[styles.deliveryCard, i < 4 && i < requests.length - 1 && styles.deliveryCardBorder]}>
                  <View style={styles.deliveryLeft}>
                    <Text style={styles.deliveryName}>{req.patient_name || `Patient #${req.id.substring(0, 4)}`}</Text>
                    <View style={styles.deliveryBloodRow}>
                      <Ionicons name="water" size={12} color={COLORS.primary} />
                      <Text style={styles.deliveryBloodType}>{req.blood_type}</Text>
                      <Text style={styles.deliveryUnits}>· {req.units_needed || 1} units</Text>
                    </View>
                  </View>
                  <View style={styles.deliveryRight}>
                    <View style={[styles.statusBadge, { backgroundColor: statusBg }]}>
                      <Text style={[styles.statusBadgeText, { color: statusColor }]}>{statusLabel}</Text>
                    </View>
                    <Text style={styles.deliveryEta}>{req.urgency.toUpperCase()}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </Stagger>

        {/* Available Stock */}
        <Stagger index={4}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Available Stock</Text>
            <View style={styles.stockGrid}>
              {STOCK_TYPES.map(({ type, units }) => (
                <View key={type} style={styles.stockChip}>
                  <Ionicons name="water" size={14} color={COLORS.primary} />
                  <Text style={styles.stockType}>{type}</Text>
                  <Text style={styles.stockUnits}>{units} units</Text>
                </View>
              ))}
            </View>
          </View>
        </Stagger>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },
  scroll: { padding: 18, paddingBottom: 40 },

  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start',
    marginBottom: 16, marginTop: 4,
  },
  hospitalName: { fontSize: 20, fontWeight: '800', color: COLORS.textPrimary, letterSpacing: -0.3 },
  hospitalSub: { fontSize: 13, color: COLORS.textMuted, marginTop: 2 },
  bellWrap: { position: 'relative', padding: 4 },
  bellDot: {
    position: 'absolute', top: 4, right: 4, width: 8, height: 8,
    borderRadius: 4, backgroundColor: COLORS.primary,
  },

  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 14 },
  statChip: {
    flex: 1, backgroundColor: COLORS.surface, borderRadius: RADIUS.md,
    paddingVertical: 14, alignItems: 'center', ...SHADOWS.card,
  },
  statChipValue: { fontSize: 20, fontWeight: '800', color: COLORS.textPrimary, letterSpacing: -0.5 },
  statChipLabel: { fontSize: 11, color: COLORS.textMuted, marginTop: 2 },

  createBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: COLORS.primary, borderRadius: RADIUS.md, paddingVertical: 16,
    marginBottom: 18, ...SHADOWS.button,
  },
  createBtnText: { color: COLORS.white, fontWeight: '700', fontSize: 15, letterSpacing: 0.2 },

  section: {
    backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, padding: 16,
    marginBottom: 14, ...SHADOWS.card,
  },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 12 },

  deliveryCard: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingVertical: 12,
  },
  deliveryCardBorder: { borderBottomWidth: 1, borderBottomColor: COLORS.border },
  deliveryLeft: { flex: 1 },
  deliveryName: { fontSize: 14, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 4 },
  deliveryBloodRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  deliveryBloodType: { fontSize: 14, fontWeight: '700', color: COLORS.primary },
  deliveryUnits: { fontSize: 12, color: COLORS.textMuted },
  deliveryRight: { alignItems: 'flex-end', gap: 8, paddingTop: 2 },
  statusBadge: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 20 },
  statusBadgeText: { fontSize: 12, fontWeight: '700' },
  deliveryEta: { fontSize: 12, color: COLORS.textMuted, marginTop: 4 },

  stockGrid: { flexDirection: 'row', gap: 10, flexWrap: 'wrap' },
  stockChip: {
    flex: 1, minWidth: '20%', backgroundColor: COLORS.primarySurface,
    borderRadius: RADIUS.sm, paddingVertical: 12, alignItems: 'center', gap: 4,
  },
  stockType: { fontSize: 14, fontWeight: '800', color: COLORS.primary },
  stockUnits: { fontSize: 11, color: COLORS.textMuted },
});
