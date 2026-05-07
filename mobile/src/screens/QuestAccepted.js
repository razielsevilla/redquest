import React, { useRef, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, StatusBar, Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS, RADIUS } from '../lib/theme';

export default function QuestAccepted({ navigation, route }) {
  const quest = route.params?.quest || {};
  const anims = useRef(
    Array.from({ length: 5 }, () => ({
      opacity: new Animated.Value(0),
      translateY: new Animated.Value(28),
    }))
  ).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.stagger(90,
      anims.map(({ opacity, translateY }) =>
        Animated.parallel([
          Animated.timing(opacity, { toValue: 1, duration: 400, useNativeDriver: true }),
          Animated.timing(translateY, { toValue: 0, duration: 400, useNativeDriver: true }),
        ])
      )
    ).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.12, duration: 800, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1.00, duration: 800, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const Fade = ({ i, children, style }) => (
    <Animated.View style={[style, {
      opacity: anims[i].opacity,
      transform: [{ translateY: anims[i].translateY }],
    }]}>{children}</Animated.View>
  );

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={20} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerBarTitle}>Quest Details</Text>
        <View style={{ width: 36 }} />
      </View>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <Fade i={0} style={styles.heroSection}>
          <Animated.View style={[styles.checkCircle, { transform: [{ scale: pulseAnim }] }]}>
            <Ionicons name="checkmark" size={36} color={COLORS.white} />
          </Animated.View>
          <Text style={styles.heroTitle}>Quest Accepted!</Text>
          <Text style={styles.heroSubtitle}>Proceed to the hospital when you are ready.</Text>
        </Fade>

        {/* Status card */}
        <Fade i={1}>
          <View style={[styles.card, styles.statusCard]}>
            <View style={styles.statusDot} />
            <View style={styles.statusTextWrap}>
              <Text style={styles.statusTitle}>Quest Active</Text>
              <Text style={styles.statusSub}>Make your way to the hospital at your earliest convenience.</Text>
            </View>
          </View>
        </Fade>


        {/* Destination card */}
        <Fade i={3}>
          <View style={styles.card}>
            <Text style={styles.cardLabel}>Destination</Text>
            <View style={styles.destRow}>
              <View style={styles.destIconWrap}>
                <Ionicons name="medkit" size={22} color={COLORS.primary} />
              </View>
              <View style={styles.destInfo}>
                <Text style={styles.destName}>{quest.hospital_name || "St. Luke's Medical Center"}</Text>
                <Text style={styles.destDetail}>{quest.hospital_address || "BGC Blood Bank"}</Text>
                <View style={styles.distRow}>
                  <Ionicons name="location-outline" size={14} color={COLORS.primary} />
                  <Text style={styles.distText}>{quest.distance_meters ? `${(quest.distance_meters / 1000).toFixed(1)} km from you` : '1.3 km from you'}</Text>
                </View>
              </View>
            </View>
          </View>
        </Fade>

        {/* Quest Details */}
        <Fade i={4}>
          <View style={styles.card}>
            <Text style={styles.cardLabel}>Quest Details</Text>
            <View style={styles.questDetailsRow}>
              <View style={styles.questDetailChip}>
                <Ionicons name="water" size={16} color={COLORS.primary} />
                <Text style={styles.questDetailKey}>Blood Type</Text>
                <Text style={styles.questDetailVal}>{quest.request_blood_type || 'O+'}</Text>
              </View>
              <View style={styles.questDetailChip}>
                <Ionicons name="cube-outline" size={16} color={COLORS.textSecondary} />
                <Text style={styles.questDetailKey}>Units</Text>
                <Text style={styles.questDetailVal}>{quest.units_needed || 2}</Text>
              </View>
              <View style={styles.questDetailChip}>
                <Ionicons name="alert-circle-outline" size={16} color={COLORS.primary} />
                <Text style={styles.questDetailKey}>Priority</Text>
                <Text style={[styles.questDetailVal, { color: COLORS.primary }]}>{quest.urgency === 'critical' ? 'CRITICAL' : quest.urgency === 'urgent' ? 'HIGH' : 'NORMAL'}</Text>
              </View>
            </View>
          </View>
        </Fade>

        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => navigation.navigate('Donor')}
          activeOpacity={0.85}
        >
          <Text style={styles.primaryBtnText}>I am On My Way</Text>
          <Ionicons name="navigate-outline" size={18} color={COLORS.white} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelBtn}
          onPress={() => navigation.navigate('Donor')} activeOpacity={0.7}>
          <Text style={styles.cancelText}>Can't make it? Cancel</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },
  scroll: { padding: 20, paddingBottom: 40 },

  headerBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12,
  },
  backBtn: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.surface,
    alignItems: 'center', justifyContent: 'center', ...SHADOWS.small,
  },
  headerBarTitle: { fontSize: 17, fontWeight: '700', color: COLORS.textPrimary, letterSpacing: -0.3 },

  heroSection: { alignItems: 'center', paddingVertical: 28 },
  checkCircle: {
    width: 80, height: 80, borderRadius: 40, backgroundColor: COLORS.primary,
    alignItems: 'center', justifyContent: 'center', marginBottom: 16, ...SHADOWS.button,
  },
  heroTitle: { fontSize: 26, fontWeight: '800', color: COLORS.textPrimary, letterSpacing: -0.5, marginBottom: 6 },
  heroSubtitle: { fontSize: 14, color: COLORS.textMuted, textAlign: 'center' },

  card: { backgroundColor: COLORS.surface, borderRadius: RADIUS.md, padding: 16, marginBottom: 12, ...SHADOWS.card },
  cardLabel: {
    fontSize: 11, fontWeight: '700', color: COLORS.textMuted, textTransform: 'uppercase',
    letterSpacing: 0.8, marginBottom: 12,
  },

  statusCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.successLight,
    borderWidth: 1, borderColor: '#C8E6C9', gap: 12,
  },
  statusDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: COLORS.success },
  statusTextWrap: { flex: 1 },
  statusTitle: { fontSize: 14, fontWeight: '700', color: COLORS.textPrimary },
  statusSub: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2, lineHeight: 17 },

  riderRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  riderAvatar: {
    width: 52, height: 52, borderRadius: 26, backgroundColor: COLORS.primarySurface,
    alignItems: 'center', justifyContent: 'center',
  },
  riderInfo: { flex: 1 },
  riderName: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary },
  riderPlate: { fontSize: 13, color: COLORS.textMuted, marginTop: 2 },
  etaBadge: {
    backgroundColor: COLORS.warningLight, borderRadius: RADIUS.sm, paddingVertical: 8,
    paddingHorizontal: 14, alignItems: 'center',
  },
  etaLabel: { fontSize: 10, color: COLORS.warning, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  etaValue: { fontSize: 16, fontWeight: '800', color: COLORS.warning, marginTop: 2 },

  destRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  destIconWrap: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.primarySurface,
    alignItems: 'center', justifyContent: 'center', marginTop: 2,
  },
  destInfo: { flex: 1 },
  destName: { fontSize: 15, fontWeight: '700', color: COLORS.textPrimary },
  destDetail: { fontSize: 13, color: COLORS.textMuted, marginTop: 3 },
  distRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 },
  distText: { fontSize: 13, color: COLORS.primary, fontWeight: '600' },

  questDetailsRow: { flexDirection: 'row', gap: 10, marginBottom: 14 },
  questDetailChip: {
    flex: 1, backgroundColor: COLORS.background, borderRadius: RADIUS.sm, padding: 10, alignItems: 'center', gap: 4,
  },
  questDetailKey: { fontSize: 10, color: COLORS.textMuted, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  questDetailVal: { fontSize: 16, fontWeight: '800', color: COLORS.textPrimary },
  infoNote: {
    backgroundColor: COLORS.warningLight, borderRadius: 8, padding: 10,
    flexDirection: 'row', alignItems: 'center', gap: 8,
  },
  infoNoteText: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 18, flex: 1 },

  primaryBtn: {
    backgroundColor: COLORS.primary, borderRadius: RADIUS.full, paddingVertical: 15,
    alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 6,
    marginTop: 8, marginBottom: 12, ...SHADOWS.button,
  },
  primaryBtnText: { color: COLORS.white, fontSize: 15, fontWeight: '700', letterSpacing: 0.3 },
  cancelBtn: { alignItems: 'center', paddingVertical: 8 },
  cancelText: { color: COLORS.textMuted, fontSize: 14, fontWeight: '600' },
});
