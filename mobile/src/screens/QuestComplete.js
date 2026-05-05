import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { XPBar } from '../components/Shared';

export default function QuestComplete({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.confettiIcon}>🎉</Text>
        <Text style={styles.title}>Quest Complete!</Text>

        <Text style={styles.thankYouText}>Thank you, Juan.</Text>
        <Text style={styles.subtitle}>You may have saved a life.</Text>

        <View style={styles.xpSection}>
          <Text style={styles.xpEarnedText}>+250 XP earned</Text>
          <XPBar currentXP={1490} targetXP={2000} level={4} />
        </View>

        <View style={styles.badgeCard}>
          <Text style={styles.badgeHeader}>🏅 New badge unlocked!</Text>
          <Text style={styles.badgeName}>Speed Hero</Text>
          <Text style={styles.badgeDesc}>"Accepted a quest in under 60 seconds"</Text>
        </View>

        <View style={styles.spacer} />

        <TouchableOpacity style={styles.shareButton}>
          <Text style={styles.shareButtonText}>Share your story</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.homeButton}
          onPress={() => navigation.navigate('Donor')}
        >
          <Text style={styles.homeButtonText}>Back to home</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#111827' },
  content: { padding: 24, alignItems: 'center', flexGrow: 1 },
  confettiIcon: { fontSize: 48, marginTop: 40, marginBottom: 16 },
  title: { color: '#F59E0B', fontSize: 28, fontWeight: 'bold', marginBottom: 24 },
  thankYouText: { color: '#F9FAFB', fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
  subtitle: { color: '#D1D5DB', fontSize: 16, marginBottom: 40 },
  xpSection: { width: '100%', marginBottom: 40 },
  xpEarnedText: { color: '#10B981', fontSize: 18, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  badgeCard: {
    backgroundColor: '#1F2937',
    padding: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#374151',
    alignItems: 'center',
    width: '100%',
    marginBottom: 40,
  },
  badgeHeader: { color: '#F59E0B', fontSize: 16, fontWeight: 'bold', marginBottom: 16 },
  badgeName: { color: '#F9FAFB', fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
  badgeDesc: { color: '#9CA3AF', fontSize: 14, textAlign: 'center', fontStyle: 'italic' },
  spacer: { flex: 1 },
  shareButton: {
    backgroundColor: '#374151',
    paddingVertical: 16,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
  },
  shareButtonText: { color: '#F9FAFB', fontSize: 16, fontWeight: 'bold' },
  homeButton: {
    backgroundColor: '#E24B4A',
    paddingVertical: 16,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  homeButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
