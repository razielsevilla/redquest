import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView, SafeAreaView, Animated } from 'react-native';
import { XPBar } from '../components/Shared';

export default function DonorHome({ navigation }) {
  const [isAvailable, setIsAvailable] = useState(true);
  const [isOnCooldown, setIsOnCooldown] = useState(false);
  const [isLevelUpAvailable, setIsLevelUpAvailable] = useState(true);

  const slideAnim = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    if (isLevelUpAvailable) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
      }).start();

      // Auto-dismiss after 5 seconds
      const timer = setTimeout(() => {
        setIsLevelUpAvailable(false);
      }, 5000);

      return () => clearTimeout(timer);
    } else {
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [isLevelUpAvailable]);

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.levelUpBanner, { transform: [{ translateY: slideAnim }] }]}>
        <Text style={styles.levelUpText}>🎉 Level up available! Tap to claim.</Text>
      </Animated.View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.greeting}>👋 Good morning, Juan!</Text>
        </View>

        <View style={styles.availabilityCard}>
          <View>
            <Text style={styles.availabilityText}>Available for quests: {isAvailable ? 'ON' : 'OFF'}</Text>
            {!isAvailable && <Text style={styles.cooldownText}>Cooldown: 56 days</Text>}
          </View>
          <Switch
            value={isAvailable}
            onValueChange={setIsAvailable}
            trackColor={{ false: '#374151', true: '#E24B4A' }}
            thumbColor={'#fff'}
          />
        </View>

        <View style={styles.profileSummary}>
          <Text style={styles.bloodType}>Blood type: <Text style={styles.boldRed}>O+</Text></Text>
          <XPBar currentXP={1240} targetXP={2000} level={4} />

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>7</Text>
              <Text style={styles.statLabel}>dons</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>56 days</Text>
              <Text style={styles.statLabel}>until next</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent quests (2)</Text>
          <View style={styles.historyItem}>
            <Text style={styles.historyText}>Apr 30  •  O+  •  St. Luke's</Text>
          </View>
          <View style={styles.historyItem}>
            <Text style={styles.historyText}>Apr 12  •  O+  •  PGH</Text>
          </View>
          <TouchableOpacity style={styles.viewHistoryButton}>
            <Text style={styles.viewHistoryText}>View full history</Text>
          </TouchableOpacity>
        </View>

        {/* Temporary button to trigger Quest Alert for demonstration */}
        <TouchableOpacity
          style={styles.demoAlertButton}
          onPress={() => navigation.navigate('QuestAlert')}
        >
          <Text style={styles.demoAlertText}>Demo: Trigger Quest Alert</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#111827' },
  levelUpBanner: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#10B981',
    padding: 16,
    zIndex: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelUpText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cooldownText: {
    color: '#E24B4A',
    fontSize: 14,
    marginTop: 4,
    fontWeight: '600'
  },
  scrollContent: { padding: 20, paddingTop: 40 },
  header: { marginBottom: 20 },
  greeting: { color: '#F9FAFB', fontSize: 24, fontWeight: 'bold' },
  availabilityCard: {
    backgroundColor: '#1F2937',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  availabilityText: { color: '#F9FAFB', fontSize: 16, fontWeight: '600' },
  profileSummary: { marginBottom: 32 },
  bloodType: { color: '#9CA3AF', fontSize: 16, marginBottom: 12 },
  boldRed: { color: '#E24B4A', fontWeight: 'bold', fontSize: 18 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 },
  statBox: {
    flex: 1,
    backgroundColor: '#1F2937',
    padding: 16,
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#374151'
  },
  statValue: { color: '#F9FAFB', fontSize: 20, fontWeight: 'bold' },
  statLabel: { color: '#9CA3AF', fontSize: 12, marginTop: 4 },
  section: { marginBottom: 24 },
  sectionTitle: { color: '#F9FAFB', fontSize: 18, fontWeight: '600', marginBottom: 12 },
  historyItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#374151'
  },
  historyText: { color: '#D1D5DB', fontSize: 14 },
  viewHistoryButton: { marginTop: 16, alignItems: 'center' },
  viewHistoryText: { color: '#E24B4A', fontSize: 14, fontWeight: '600' },
  demoAlertButton: {
    backgroundColor: '#374151',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 40,
  },
  demoAlertText: { color: '#fff', fontWeight: 'bold' }
});
