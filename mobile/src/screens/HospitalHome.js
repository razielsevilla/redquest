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

// ─── Sample data ────────────────────────────────────────────────
const ACTIVE_DELIVERIES = [
  {
    id: '1',
    name: 'Jitesh Kumar',
    bloodType: 'O+',
    units: 2,
    status: 'In Transit',
    statusColor: '#3B82F6',
    statusBg: '#EFF6FF',
    eta: '12 mins',
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    bloodType: 'A+',
    units: 1,
    status: 'Collection',
    statusColor: '#F59E0B',
    statusBg: '#FFFBEB',
    eta: '25 mins',
  },
];

const STOCK_TYPES = [
  { type: 'A+',  units: 18 },
  { type: 'B+',  units: 17 },
  { type: 'O+',  units: 2  },
  { type: 'AB+', units: 17 },
];

// ─── Component ──────────────────────────────────────────────────
export default function HospitalHome({ navigation }) {
  const [hasNotification, setHasNotification] = useState(true);

  // Staggered entrance animations (5 sections)
  const cardAnims = useRef(
    Array.from({ length: 5 }, () => ({
      opacity:    new Animated.Value(0),
      translateY: new Animated.Value(20),
    }))
  ).current;

  useEffect(() => {
    Animated.stagger(
      70,
      cardAnims.map(({ opacity, translateY }) =>
        Animated.parallel([
          Animated.timing(opacity,    { toValue: 1, duration: 380, useNativeDriver: true }),
          Animated.timing(translateY, { toValue: 0, duration: 380, useNativeDriver: true }),
        ])
      )
    ).start();
  }, []);

  const Stagger = ({ index, children, style }) => (
    <Animated.View
      style={[
        style,
        {
          opacity:   cardAnims[index].opacity,
          transform: [{ translateY: cardAnims[index].translateY }],
        },
      ]}
    >
      {children}
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F5F7" />

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* ── HEADER ── */}
        <Stagger index={0}>
          <View style={styles.header}>
            <View>
              <Text style={styles.hospitalName}>City General Hospital</Text>
              <Text style={styles.hospitalSub}>Emergency Requests</Text>
            </View>
            <TouchableOpacity
              style={styles.bellWrap}
              onPress={() => setHasNotification(false)}
            >
              <Ionicons name="notifications-outline" size={24} color="#D32F2F" />
              {hasNotification && <View style={styles.bellDot} />}
            </TouchableOpacity>
          </View>
        </Stagger>

        {/* ── STAT CHIPS ── */}
        <Stagger index={1}>
          <View style={styles.statsRow}>
            <View style={styles.statChip}>
              <Ionicons name="pulse" size={18} color="#3B82F6" style={styles.statChipIcon} />
              <Text style={styles.statChipValue}>5</Text>
              <Text style={styles.statChipLabel}>Active</Text>
            </View>
            <View style={styles.statChip}>
              <Ionicons name="time-outline" size={18} color="#F59E0B" style={styles.statChipIcon} />
              <Text style={styles.statChipValue}>3</Text>
              <Text style={styles.statChipLabel}>Pending</Text>
            </View>
            <View style={styles.statChip}>
              <Ionicons name="checkmark-circle-outline" size={18} color="#22C55E" style={styles.statChipIcon} />
              <Text style={styles.statChipValue}>28</Text>
              <Text style={styles.statChipLabel}>Today</Text>
            </View>
          </View>
        </Stagger>

        {/* ── CREATE NEW REQUEST ── */}
        <Stagger index={2}>
          <TouchableOpacity
            style={styles.createBtn}
            activeOpacity={0.88}
            onPress={() => navigation.navigate('CreateBloodRequest')}
          >
            <Ionicons name="add" size={20} color="#FFFFFF" />
            <Text style={styles.createBtnText}>Create New Request</Text>
          </TouchableOpacity>
        </Stagger>

        {/* ── ACTIVE DELIVERIES ── */}
        <Stagger index={3}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Active Deliveries</Text>

            {ACTIVE_DELIVERIES.map((d, i) => (
              <View
                key={d.id}
                style={[
                  styles.deliveryCard,
                  i < ACTIVE_DELIVERIES.length - 1 && styles.deliveryCardBorder,
                ]}
              >
                {/* Left info */}
                <View style={styles.deliveryLeft}>
                  <Text style={styles.deliveryName}>{d.name}</Text>
                  <Text style={styles.deliveryBlood}>Blood Type:</Text>
                  <Text style={styles.deliveryBloodType}>{d.bloodType}</Text>
                  <Text style={styles.deliveryUnits}>{d.units} units</Text>
                </View>

                {/* Right status + ETA */}
                <View style={styles.deliveryRight}>
                  <View style={[styles.statusBadge, { backgroundColor: d.statusBg }]}>
                    <Text style={[styles.statusBadgeText, { color: d.statusColor }]}>
                      {d.status}
                    </Text>
                  </View>
                  <Text style={styles.deliveryEta}>ETA: {d.eta}</Text>
                </View>
              </View>
            ))}
          </View>
        </Stagger>

        {/* ── AVAILABLE STOCK ── */}
        <Stagger index={4}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Available Stock</Text>
            <View style={styles.stockGrid}>
              {STOCK_TYPES.map(({ type, units }) => (
                <View key={type} style={styles.stockChip}>
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

// ─── Styles ─────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F5F5F7',
  },
  scroll: {
    padding: 18,
    paddingBottom: 40,
  },

  // ── Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
    marginTop: 4,
  },
  hospitalName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1A1A1A',
    letterSpacing: -0.3,
  },
  hospitalSub: {
    fontSize: 13,
    color: '#888888',
    marginTop: 2,
  },
  bellWrap: {
    position: 'relative',
    padding: 4,
  },
  bellDot: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D32F2F',
  },

  // ── Stat chips
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  statChip: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  statChipIcon: {
    marginBottom: 4,
  },
  statChipValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1A1A1A',
    letterSpacing: -0.5,
  },
  statChipLabel: {
    fontSize: 11,
    color: '#888888',
    marginTop: 2,
  },

  // ── Create Request button
  createBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#D32F2F',
    borderRadius: 14,
    paddingVertical: 16,
    marginBottom: 18,
    shadowColor: '#D32F2F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  createBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
    letterSpacing: 0.2,
  },

  // ── Section wrapper (white card)
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 12,
  },

  // ── Delivery cards
  deliveryCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 12,
  },
  deliveryCardBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  deliveryLeft: {
    flex: 1,
  },
  deliveryName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  deliveryBlood: {
    fontSize: 12,
    color: '#888888',
  },
  deliveryBloodType: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  deliveryUnits: {
    fontSize: 12,
    color: '#888888',
    marginTop: 4,
  },
  deliveryRight: {
    alignItems: 'flex-end',
    gap: 8,
    paddingTop: 2,
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
  deliveryEta: {
    fontSize: 12,
    color: '#888888',
    marginTop: 4,
  },

  // ── Stock grid
  stockGrid: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
  },
  stockChip: {
    flex: 1,
    minWidth: '20%',
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  stockType: {
    fontSize: 14,
    fontWeight: '800',
    color: '#D32F2F',
  },
  stockUnits: {
    fontSize: 11,
    color: '#888888',
    marginTop: 3,
  },
});
