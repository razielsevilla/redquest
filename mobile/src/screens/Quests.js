import React from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS, RADIUS } from '../lib/theme';

const QUESTS_DATA = [
  { id: '1', date: 'Apr 30', type: 'O+', hospital: "St. Luke's",  status: 'Completed', xp: '+150 XP' },
  { id: '2', date: 'Apr 12', type: 'O+', hospital: 'PGH',         status: 'Completed', xp: '+150 XP' },
  { id: '3', date: 'Mar 05', type: 'O+', hospital: 'Makati Med',  status: 'Completed', xp: '+150 XP' },
];

export default function Quests() {
  const renderItem = ({ item }) => (
    <View style={styles.questCard}>
      <View style={styles.bloodPill}>
        <Ionicons name="water" size={14} color={COLORS.primary} />
        <Text style={styles.bloodPillText}>{item.type}</Text>
      </View>
      <View style={styles.questInfo}>
        <Text style={styles.questHospital}>{item.hospital}</Text>
        <View style={styles.questMeta}>
          <Ionicons name="calendar-outline" size={12} color={COLORS.textMuted} />
          <Text style={styles.questMetaText}>{item.date}</Text>
        </View>
      </View>
      <View style={styles.questRight}>
        <View style={styles.statusChip}>
          <Ionicons name="checkmark-circle" size={12} color={COLORS.success} />
          <Text style={styles.statusChipText}>{item.status}</Text>
        </View>
        <Text style={styles.xpText}>{item.xp}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <View style={styles.header}>
        <Text style={styles.title}>Quest History</Text>
        <Text style={styles.subtitle}>Your past heroic deeds</Text>
      </View>

      <View style={styles.summaryRow}>
        <View style={styles.summaryChip}>
          <Ionicons name="flash" size={16} color={COLORS.primary} />
          <Text style={styles.summaryValue}>{QUESTS_DATA.length}</Text>
          <Text style={styles.summaryLabel}>Quests</Text>
        </View>
        <View style={styles.summaryChip}>
          <Ionicons name="star" size={16} color={COLORS.warning} />
          <Text style={styles.summaryValue}>450</Text>
          <Text style={styles.summaryLabel}>XP Earned</Text>
        </View>
        <View style={styles.summaryChip}>
          <Ionicons name="water" size={16} color={COLORS.primary} />
          <Text style={[styles.summaryValue, { color: COLORS.primary }]}>O+</Text>
          <Text style={styles.summaryLabel}>Blood Type</Text>
        </View>
      </View>

      <FlatList
        data={QUESTS_DATA}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="map-outline" size={48} color={COLORS.textMuted} />
            <Text style={styles.emptyText}>No quests yet. Accept a request to start!</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },
  header: { paddingHorizontal: 18, paddingTop: 14, paddingBottom: 10 },
  title: { fontSize: 20, fontWeight: '800', color: COLORS.textPrimary, letterSpacing: -0.3 },
  subtitle: { fontSize: 13, color: COLORS.textMuted, marginTop: 2 },

  summaryRow: { flexDirection: 'row', gap: 10, paddingHorizontal: 18, marginBottom: 14 },
  summaryChip: {
    flex: 1, backgroundColor: COLORS.surface, borderRadius: RADIUS.md,
    paddingVertical: 12, alignItems: 'center', ...SHADOWS.card,
  },
  summaryValue: { fontSize: 18, fontWeight: '800', color: COLORS.textPrimary, letterSpacing: -0.5, marginTop: 4 },
  summaryLabel: { fontSize: 11, color: COLORS.textMuted, marginTop: 2 },

  list: { paddingHorizontal: 18, paddingBottom: 30, gap: 10 },
  questCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md, padding: 14, gap: 12, ...SHADOWS.card,
  },
  bloodPill: {
    width: 44, height: 44, borderRadius: 12, backgroundColor: COLORS.primarySurface,
    alignItems: 'center', justifyContent: 'center', gap: 2,
  },
  bloodPillText: { fontSize: 11, fontWeight: '800', color: COLORS.primary },
  questInfo: { flex: 1 },
  questHospital: { fontSize: 14, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 4 },
  questMeta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  questMetaText: { fontSize: 12, color: COLORS.textMuted },
  questRight: { alignItems: 'flex-end', gap: 6 },
  statusChip: {
    backgroundColor: COLORS.successLight, borderRadius: 20, paddingVertical: 4,
    paddingHorizontal: 10, flexDirection: 'row', alignItems: 'center', gap: 4,
  },
  statusChipText: { fontSize: 11, fontWeight: '700', color: COLORS.success },
  xpText: { fontSize: 12, fontWeight: '700', color: COLORS.warning },

  empty: { alignItems: 'center', paddingTop: 80, gap: 12 },
  emptyText: { fontSize: 14, color: COLORS.textMuted, textAlign: 'center', paddingHorizontal: 40, lineHeight: 20 },
});
