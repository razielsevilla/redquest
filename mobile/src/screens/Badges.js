import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';

const BADGES_DATA = [
  { id: '1', name: 'First Blood', description: 'Completed your first donation.', icon: '🩸', unlocked: true },
  { id: '2', name: 'Life Saver', description: 'Saved 3 lives.', icon: '🦸‍♂️', unlocked: true },
  { id: '3', name: 'Speed Demon', description: 'Accepted a quest within 5 minutes.', icon: '⚡', unlocked: true },
  { id: '4', name: 'Centurion', description: 'Donated 10 times.', icon: '💯', unlocked: false },
  { id: '5', name: 'Night Owl', description: 'Completed a quest after midnight.', icon: '🦉', unlocked: false },
];

export default function Badges() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Badges</Text>
        <Text style={styles.subtitle}>Achievements you have unlocked.</Text>

        <View style={styles.badgesGrid}>
          {BADGES_DATA.map((badge) => (
            <View key={badge.id} style={[styles.badgeCard, !badge.unlocked && styles.lockedBadgeCard]}>
              <View style={[styles.iconContainer, !badge.unlocked && styles.lockedIconContainer]}>
                <Text style={styles.icon}>{badge.icon}</Text>
              </View>
              <Text style={styles.badgeName}>{badge.name}</Text>
              <Text style={styles.badgeDescription}>{badge.description}</Text>
              {!badge.unlocked && <Text style={styles.lockedText}>Locked</Text>}
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#111827',
  },
  container: {
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#F9FAFB',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#9CA3AF',
    marginBottom: 24,
  },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  badgeCard: {
    width: '48%',
    backgroundColor: '#1F2937',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#374151',
  },
  lockedBadgeCard: {
    opacity: 0.6,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#374151',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  lockedIconContainer: {
    backgroundColor: '#111827',
  },
  icon: {
    fontSize: 32,
  },
  badgeName: {
    color: '#F9FAFB',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
    textAlign: 'center',
  },
  badgeDescription: {
    color: '#9CA3AF',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 8,
  },
  lockedText: {
    color: '#E24B4A',
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
});
