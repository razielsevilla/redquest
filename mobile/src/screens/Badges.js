import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS, RADIUS } from '../lib/theme';

const BADGES_DATA = [
  { id: '1', name: 'First Blood',  description: 'Completed your first donation.',    icon: 'water',        unlocked: true  },
  { id: '2', name: 'Life Saver',   description: 'Saved 3 lives.',                    icon: 'shield-checkmark', unlocked: true  },
  { id: '3', name: 'Speed Demon',  description: 'Accepted a quest within 5 minutes.', icon: 'flash',        unlocked: true  },
  { id: '4', name: 'Centurion',    description: 'Donated 10 times.',                 icon: 'trophy',       unlocked: false },
  { id: '5', name: 'Night Owl',    description: 'Completed a quest after midnight.', icon: 'moon',         unlocked: false },
];

const unlocked = BADGES_DATA.filter(b => b.unlocked).length;

export default function Badges() {
  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      <View style={styles.header}>
        <Text style={styles.title}>Badges</Text>
        <Text style={styles.subtitle}>{unlocked} of {BADGES_DATA.length} unlocked</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Progress bar */}
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Collection progress</Text>
            <Text style={styles.progressPct}>{Math.round((unlocked / BADGES_DATA.length) * 100)}%</Text>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${(unlocked / BADGES_DATA.length) * 100}%` }]} />
          </View>
        </View>

        {/* Badge grid */}
        <View style={styles.grid}>
          {BADGES_DATA.map((badge) => (
            <View
              key={badge.id}
              style={[styles.badgeCard, !badge.unlocked && styles.badgeCardLocked]}
            >
              <View style={[styles.iconWrap, !badge.unlocked && styles.iconWrapLocked]}>
                <Ionicons
                  name={badge.icon}
                  size={28}
                  color={badge.unlocked ? COLORS.primary : COLORS.textMuted}
                />
              </View>
              <Text style={[styles.badgeName, !badge.unlocked && styles.badgeNameLocked]}>
                {badge.name}
              </Text>
              <Text style={styles.badgeDesc}>{badge.description}</Text>
              {!badge.unlocked && (
                <View style={styles.lockedChip}>
                  <Ionicons name="lock-closed" size={10} color={COLORS.textMuted} />
                  <Text style={styles.lockedChipText}>Locked</Text>
                </View>
              )}
              {badge.unlocked && (
                <View style={styles.unlockedChip}>
                  <Ionicons name="checkmark-circle" size={12} color={COLORS.success} />
                  <Text style={styles.unlockedChipText}>Earned</Text>
                </View>
              )}
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },
  header: { paddingHorizontal: 18, paddingTop: 14, paddingBottom: 10 },
  title: { fontSize: 20, fontWeight: '800', color: COLORS.textPrimary, letterSpacing: -0.3 },
  subtitle: { fontSize: 13, color: COLORS.textMuted, marginTop: 2 },
  scroll: { paddingHorizontal: 18, paddingBottom: 30 },

  progressCard: {
    backgroundColor: COLORS.surface, borderRadius: RADIUS.md, padding: 16,
    marginBottom: 16, ...SHADOWS.card,
  },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  progressLabel: { fontSize: 13, fontWeight: '600', color: COLORS.textSecondary },
  progressPct: { fontSize: 13, fontWeight: '800', color: COLORS.primary },
  progressTrack: { height: 8, backgroundColor: COLORS.border, borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: COLORS.primary, borderRadius: 4 },

  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  badgeCard: {
    width: '47%', backgroundColor: COLORS.surface, borderRadius: RADIUS.lg,
    padding: 16, alignItems: 'center', ...SHADOWS.card,
  },
  badgeCardLocked: { opacity: 0.55 },
  iconWrap: {
    width: 60, height: 60, borderRadius: 30, backgroundColor: COLORS.primarySurface,
    alignItems: 'center', justifyContent: 'center', marginBottom: 10,
  },
  iconWrapLocked: { backgroundColor: COLORS.background },
  badgeName: { fontSize: 13, fontWeight: '800', color: COLORS.textPrimary, textAlign: 'center', marginBottom: 4 },
  badgeNameLocked: { color: COLORS.textMuted },
  badgeDesc: { fontSize: 11, color: COLORS.textMuted, textAlign: 'center', lineHeight: 16, marginBottom: 10 },
  unlockedChip: {
    backgroundColor: COLORS.successLight, borderRadius: 20, paddingVertical: 3,
    paddingHorizontal: 10, flexDirection: 'row', alignItems: 'center', gap: 4,
  },
  unlockedChipText: { fontSize: 11, fontWeight: '700', color: COLORS.success },
  lockedChip: {
    backgroundColor: COLORS.background, borderRadius: 20, paddingVertical: 3,
    paddingHorizontal: 10, flexDirection: 'row', alignItems: 'center', gap: 4,
  },
  lockedChipText: { fontSize: 11, fontWeight: '700', color: COLORS.textMuted },
});
