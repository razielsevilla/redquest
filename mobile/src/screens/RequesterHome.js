import React, { useState, useRef, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar, Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS, RADIUS } from '../lib/theme';

const RECENT_REQUESTS = [
  { id: '1', type: 'O+', hospital: "St. Luke's BGC", status: 'Delivered', statusColor: COLORS.success, statusBg: COLORS.successLight, date: 'Apr 30' },
  { id: '2', type: 'A+', hospital: 'Makati Med',     status: 'Pending',   statusColor: COLORS.warning, statusBg: COLORS.warningLight, date: 'Apr 28' },
];

export default function RequesterHome({ navigation }) {
  const [hasNotification, setHasNotification] = useState(true);

  const cardAnims = useRef(
    Array.from({ length: 5 }, () => ({
      opacity: new Animated.Value(0),
      translateY: new Animated.Value(22),
    }))
  ).current;

  useEffect(() => {
    Animated.stagger(80,
      cardAnims.map(({ opacity, translateY }) =>
        Animated.parallel([
          Animated.timing(opacity,    { toValue: 1, duration: 380, useNativeDriver: true }),
          Animated.timing(translateY, { toValue: 0, duration: 380, useNativeDriver: true }),
        ])
      )
    ).start();
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
              <Text style={styles.greeting}>Family Portal</Text>
              <Text style={styles.subGreeting}>Manage blood requests</Text>
            </View>
            <TouchableOpacity
              style={styles.bellBtn}
              onPress={() => setHasNotification(false)}
            >
              <Ionicons name="notifications-outline" size={22} color={COLORS.primary} />
              {hasNotification && <View style={styles.bellDot} />}
            </TouchableOpacity>
          </View>
        </Stagger>

        {/* Stats */}
        <Stagger index={1}>
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Ionicons name="pulse" size={20} color={COLORS.info} />
              <Text style={styles.statValue}>2</Text>
              <Text style={styles.statLabel}>Active</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="checkmark-circle-outline" size={20} color={COLORS.success} />
              <Text style={styles.statValue}>5</Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="time-outline" size={20} color={COLORS.warning} />
              <Text style={styles.statValue}>1</Text>
              <Text style={styles.statLabel}>Pending</Text>
            </View>
          </View>
        </Stagger>


        {/* Post New Request */}
        <Stagger index={2}>
          <TouchableOpacity
            style={styles.createBtn}
            activeOpacity={0.88}
            onPress={() => navigation.navigate('PostRequest')}
          >
            <Ionicons name="add-circle-outline" size={20} color={COLORS.primary} />
            <Text style={styles.createBtnText}>Post New Blood Request</Text>
          </TouchableOpacity>
        </Stagger>

        {/* Recent Requests */}
        <Stagger index={3}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Requests</Text>
            {RECENT_REQUESTS.map((req, i) => (
              <View key={req.id} style={[styles.requestCard, i < RECENT_REQUESTS.length - 1 && styles.requestCardBorder]}>
                <View style={styles.requestLeft}>
                  <View style={styles.bloodPill}>
                    <Ionicons name="water" size={14} color={COLORS.primary} />
                    <Text style={styles.bloodPillText}>{req.type}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.requestHospital}>{req.hospital}</Text>
                    <View style={styles.requestMeta}>
                      <Ionicons name="calendar-outline" size={12} color={COLORS.textMuted} />
                      <Text style={styles.requestDate}>{req.date}</Text>
                    </View>
                  </View>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: req.statusBg }]}>
                  <Text style={[styles.statusBadgeText, { color: req.statusColor }]}>{req.status}</Text>
                </View>
              </View>
            ))}
          </View>
        </Stagger>

        {/* Info tip */}
        <Stagger index={4}>
          <View style={styles.tipCard}>
            <Ionicons name="information-circle-outline" size={20} color={COLORS.primary} />
            <Text style={styles.tipText}>
              Post a request and nearby verified donors will be notified. A rider will handle the transport.
            </Text>
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
  greeting: { fontSize: 22, fontWeight: '800', color: COLORS.textPrimary, letterSpacing: -0.3 },
  subGreeting: { fontSize: 13, color: COLORS.textMuted, marginTop: 2 },
  bellBtn: {
    position: 'relative', width: 40, height: 40, borderRadius: 20,
    backgroundColor: COLORS.surface, alignItems: 'center', justifyContent: 'center', ...SHADOWS.small,
  },
  bellDot: {
    position: 'absolute', top: 8, right: 8, width: 8, height: 8,
    borderRadius: 4, backgroundColor: COLORS.primary,
  },

  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 14 },
  statCard: {
    flex: 1, backgroundColor: COLORS.surface, borderRadius: RADIUS.md,
    paddingVertical: 14, alignItems: 'center', ...SHADOWS.card,
  },
  statValue: { fontSize: 20, fontWeight: '800', color: COLORS.textPrimary, letterSpacing: -0.5, marginTop: 4 },
  statLabel: { fontSize: 11, color: COLORS.textMuted, marginTop: 2 },

  createBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: COLORS.surface, borderRadius: RADIUS.md, paddingVertical: 16,
    marginBottom: 18, borderWidth: 1.5, borderColor: COLORS.primary, ...SHADOWS.small,
  },
  createBtnText: { color: COLORS.primary, fontWeight: '700', fontSize: 15, letterSpacing: 0.2 },

  section: {
    backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, padding: 16,
    marginBottom: 14, ...SHADOWS.card,
  },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 12 },

  requestCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12 },
  requestCardBorder: { borderBottomWidth: 1, borderBottomColor: COLORS.border },
  requestLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  bloodPill: {
    width: 40, height: 40, borderRadius: 10, backgroundColor: COLORS.primarySurface,
    alignItems: 'center', justifyContent: 'center', gap: 1,
  },
  bloodPillText: { fontSize: 10, fontWeight: '800', color: COLORS.primary },
  requestHospital: { fontSize: 14, fontWeight: '700', color: COLORS.textPrimary },
  requestMeta: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  requestDate: { fontSize: 12, color: COLORS.textMuted },
  statusBadge: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 20 },
  statusBadgeText: { fontSize: 12, fontWeight: '700' },

  tipCard: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 10,
    backgroundColor: COLORS.primarySurface, borderRadius: RADIUS.md, padding: 14,
    borderWidth: 1, borderColor: COLORS.primaryMuted,
  },
  tipText: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 19, flex: 1 },
});
