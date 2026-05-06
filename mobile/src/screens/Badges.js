import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, StatusBar } from 'react-native';

const BADGES_DATA = [
  { id: '1', name: 'First Blood',  description: 'Completed your first donation.',    icon: '🩸', unlocked: true  },
  { id: '2', name: 'Life Saver',   description: 'Saved 3 lives.',                    icon: '🦸', unlocked: true  },
  { id: '3', name: 'Speed Demon',  description: 'Accepted a quest within 5 minutes.', icon: '⚡', unlocked: true  },
  { id: '4', name: 'Centurion',    description: 'Donated 10 times.',                 icon: '💯', unlocked: false },
  { id: '5', name: 'Night Owl',    description: 'Completed a quest after midnight.', icon: '🦉', unlocked: false },
];

const unlocked = BADGES_DATA.filter(b => b.unlocked).length;

export default function Badges() {
  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F5F7" />

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
                <Text style={styles.icon}>{badge.icon}</Text>
              </View>
              <Text style={[styles.badgeName, !badge.unlocked && styles.badgeNameLocked]}>
                {badge.name}
              </Text>
              <Text style={styles.badgeDesc}>{badge.description}</Text>
              {!badge.unlocked && (
                <View style={styles.lockedChip}>
                  <Text style={styles.lockedChipText}>Locked</Text>
                </View>
              )}
              {badge.unlocked && (
                <View style={styles.unlockedChip}>
                  <Text style={styles.unlockedChipText}>✓ Earned</Text>
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
  root: {
    flex: 1,
    backgroundColor: '#F5F5F7',
  },
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
    paddingBottom: 30,
  },

  // Progress card
  progressCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  progressLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#555555',
  },
  progressPct: {
    fontSize: 13,
    fontWeight: '800',
    color: '#D32F2F',
  },
  progressTrack: {
    height: 8,
    backgroundColor: '#F0F0F0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#D32F2F',
    borderRadius: 4,
  },

  // Badge grid
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  badgeCard: {
    width: '47%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  badgeCardLocked: {
    opacity: 0.55,
  },
  iconWrap: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  iconWrapLocked: {
    backgroundColor: '#F0F0F0',
  },
  icon: {
    fontSize: 30,
  },
  badgeName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 4,
  },
  badgeNameLocked: {
    color: '#AAAAAA',
  },
  badgeDesc: {
    fontSize: 11,
    color: '#888888',
    textAlign: 'center',
    lineHeight: 16,
    marginBottom: 10,
  },
  unlockedChip: {
    backgroundColor: '#F0FDF4',
    borderRadius: 20,
    paddingVertical: 3,
    paddingHorizontal: 10,
  },
  unlockedChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#22C55E',
  },
  lockedChip: {
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingVertical: 3,
    paddingHorizontal: 10,
  },
  lockedChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#AAAAAA',
  },
});
