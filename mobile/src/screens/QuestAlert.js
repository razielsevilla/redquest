import React, { useRef, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS, RADIUS } from '../lib/theme';
import { acceptQuest, declineQuest } from '../lib/api';

// ─────────────────────────────────────────────────────────────
// Mock map placeholder with pins
// ─────────────────────────────────────────────────────────────
function MapPlaceholder() {
  return (
    <View style={styles.mapBox}>
      <View style={styles.mapGrid}>
        {[0.25, 0.5, 0.75].map(v => (
          <View key={`h${v}`} style={[styles.gridLineH, { top: `${v * 100}%` }]} />
        ))}
        {[0.25, 0.5, 0.75].map(v => (
          <View key={`v${v}`} style={[styles.gridLineV, { left: `${v * 100}%` }]} />
        ))}
      </View>
      <View style={[styles.roadH, { top: '45%' }]} />
      <View style={[styles.roadH, { top: '68%' }]} />
      <View style={[styles.roadV, { left: '35%' }]} />
      <View style={[styles.roadV, { left: '62%' }]} />
      <View style={[styles.pin, styles.pinRed, { top: '30%', left: '28%' }]}>
        <Ionicons name="location" size={14} color={COLORS.white} />
      </View>
      <View style={[styles.pin, styles.pinGrey, { top: '55%', left: '50%' }]}>
        <Ionicons name="location" size={14} color={COLORS.white} />
      </View>
      <View style={[styles.pin, styles.pinRed, { top: '38%', left: '72%' }]}>
        <Ionicons name="location" size={14} color={COLORS.white} />
      </View>
      <View style={styles.mapLabel}>
        <Ionicons name="map-outline" size={12} color={COLORS.textSecondary} />
        <Text style={styles.mapLabelText}>Nearby Requests</Text>
      </View>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────
// Request card
// ─────────────────────────────────────────────────────────────
function RequestCard({ quest, onAccept, onDecline, isSubmitting }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 400, useNativeDriver: true }),
    ]).start();
  }, []);

  if (!quest) return null;

  const isHigh = quest.urgency === 'urgent' || quest.urgency === 'critical';
  const priorityText = quest.urgency === 'critical' ? 'Critical' : quest.urgency === 'urgent' ? 'High' : 'Normal';

  return (
    <Animated.View
      style={[
        styles.requestCard,
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
      ]}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.cardName}>{quest.hospital_name || 'Hospital Request'}</Text>
        <View style={[styles.priorityBadge, isHigh ? styles.priorityHigh : styles.priorityNormal]}>
          <Text style={[styles.priorityText, isHigh ? styles.priorityHighText : styles.priorityNormalText]}>
            {priorityText}
          </Text>
        </View>
      </View>

      <View style={styles.distanceRow}>
        <Ionicons name="location-outline" size={14} color={COLORS.textMuted} />
        <Text style={styles.distanceText}>{quest.distance_meters ? `${(quest.distance_meters / 1000).toFixed(1)} km away` : 'Nearby'}</Text>
      </View>

      <View style={styles.detailsRow}>
        <View style={styles.detailChip}>
          <Ionicons name="water" size={12} color={COLORS.primary} />
          <Text style={styles.bloodTypeChip}>{quest.request_blood_type || 'Unknown'}</Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="cube-outline" size={13} color={COLORS.textSecondary} />
          <Text style={styles.detailMeta}>{quest.units_needed || 1} units</Text>
        </View>
      </View>

      <View style={{ flexDirection: 'row', gap: 10 }}>
        <TouchableOpacity
          style={[styles.acceptBtn, { flex: 1, backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border }]}
          onPress={onDecline}
          disabled={isSubmitting}
        >
          <Text style={[styles.acceptBtnText, { color: COLORS.textPrimary }]}>Decline</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.acceptBtn, { flex: 2, opacity: isSubmitting ? 0.7 : 1 }]}
          onPress={onAccept}
          activeOpacity={0.85}
          disabled={isSubmitting}
        >
          <Ionicons name="checkmark-circle-outline" size={18} color={COLORS.white} />
          <Text style={styles.acceptBtnText}>{isSubmitting ? 'Accepting...' : 'Accept Quest'}</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

// ─────────────────────────────────────────────────────────────
// MAIN SCREEN
// ─────────────────────────────────────────────────────────────
export default function QuestAlert({ navigation, route }) {
  const headerAnim = useRef(new Animated.Value(0)).current;
  const filterAnim = useRef(new Animated.Value(0)).current;
  const mapAnim    = useRef(new Animated.Value(0)).current;
  
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const quest = route.params?.quest;

  useEffect(() => {
    Animated.stagger(100, [
      Animated.timing(headerAnim, { toValue: 1, duration: 350, useNativeDriver: true }),
      Animated.timing(filterAnim, { toValue: 1, duration: 350, useNativeDriver: true }),
      Animated.timing(mapAnim,    { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleAccept = async () => {
    if (!quest) return;
    setIsSubmitting(true);
    try {
      const res = await acceptQuest(quest.id);
      navigation.replace('QuestAccepted', { quest: { ...quest, ...res } });
    } catch (err) {
      console.error('Accept failed', err);
      setIsSubmitting(false);
    }
  };

  const handleDecline = async () => {
    if (!quest) return;
    setIsSubmitting(true);
    try {
      await declineQuest(quest.id);
      navigation.goBack();
    } catch (err) {
      console.error('Decline failed', err);
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      <Animated.View style={[styles.header, { opacity: headerAnim }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={20} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Quest Alert</Text>
        <View style={{ width: 36 }} />
      </Animated.View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Animated.View style={[styles.filterBar, { opacity: filterAnim }]}>
          <Ionicons name="information-circle-outline" size={16} color={COLORS.textSecondary} />
          <Text style={styles.filterText}>A patient urgently needs your blood type.</Text>
        </Animated.View>

        <Animated.View style={{ opacity: mapAnim, marginHorizontal: 16, marginBottom: 16 }}>
          <MapPlaceholder />
        </Animated.View>

        <View style={styles.cardsSection}>
          {quest ? (
            <RequestCard
              quest={quest}
              isSubmitting={isSubmitting}
              onAccept={handleAccept}
              onDecline={handleDecline}
            />
          ) : (
            <Text style={{ textAlign: 'center', color: COLORS.textMuted, marginTop: 20 }}>
              No active quests to display.
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 14,
  },
  backBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: COLORS.surface, alignItems: 'center', justifyContent: 'center',
    ...SHADOWS.small,
  },
  headerTitle: { fontSize: 17, fontWeight: '700', color: COLORS.textPrimary, letterSpacing: -0.3 },
  filterBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    paddingVertical: 10, marginHorizontal: 16, marginBottom: 12,
    backgroundColor: COLORS.surface, borderRadius: RADIUS.sm, ...SHADOWS.small,
  },
  filterText: { fontSize: 13, color: COLORS.textSecondary, fontWeight: '500' },

  // Map
  mapBox: { height: 190, backgroundColor: '#E0EEE0', borderRadius: RADIUS.md, overflow: 'hidden', position: 'relative' },
  mapGrid: { ...StyleSheet.absoluteFillObject },
  gridLineH: { position: 'absolute', left: 0, right: 0, height: 1, backgroundColor: 'rgba(255,255,255,0.5)' },
  gridLineV: { position: 'absolute', top: 0, bottom: 0, width: 1, backgroundColor: 'rgba(255,255,255,0.5)' },
  roadH: { position: 'absolute', left: 0, right: 0, height: 6, backgroundColor: 'rgba(255,255,255,0.7)' },
  roadV: { position: 'absolute', top: 0, bottom: 0, width: 6, backgroundColor: 'rgba(255,255,255,0.7)' },
  pin: { position: 'absolute', width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center', ...SHADOWS.card },
  pinRed: { backgroundColor: COLORS.primary },
  pinGrey: { backgroundColor: COLORS.textMuted },
  mapLabel: {
    position: 'absolute', bottom: 10, right: 12,
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8,
    flexDirection: 'row', alignItems: 'center', gap: 4,
  },
  mapLabelText: { fontSize: 11, color: COLORS.textSecondary, fontWeight: '600' },

  cardsSection: { paddingHorizontal: 16, paddingBottom: 32 },

  // Request card
  requestCard: {
    backgroundColor: COLORS.surface, borderRadius: RADIUS.md, padding: 16, marginBottom: 12, ...SHADOWS.card,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 },
  cardName: { fontSize: 15, fontWeight: '700', color: COLORS.textPrimary, flex: 1, paddingRight: 8 },
  priorityBadge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: RADIUS.full },
  priorityHigh: { backgroundColor: COLORS.primarySurface },
  priorityNormal: { backgroundColor: COLORS.background },
  priorityHighText: { color: COLORS.primary, fontWeight: '700', fontSize: 11 },
  priorityNormalText: { color: COLORS.textSecondary, fontWeight: '700', fontSize: 11 },
  priorityText: { fontSize: 11, fontWeight: '700' },
  distanceRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 10 },
  distanceText: { fontSize: 13, color: COLORS.textMuted, fontWeight: '500' },
  detailsRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 14, gap: 12 },
  detailChip: {
    backgroundColor: COLORS.primarySurface, paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: RADIUS.full, flexDirection: 'row', alignItems: 'center', gap: 4,
  },
  bloodTypeChip: { color: COLORS.primary, fontWeight: '800', fontSize: 13 },
  detailItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  detailMeta: { fontSize: 13, color: COLORS.textSecondary, fontWeight: '500' },
  acceptBtn: {
    backgroundColor: COLORS.primary, borderRadius: RADIUS.full, paddingVertical: 13,
    alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 6, ...SHADOWS.button,
  },
  acceptBtnText: { color: COLORS.white, fontSize: 15, fontWeight: '700', letterSpacing: 0.3 },
});
