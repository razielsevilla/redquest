import React from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, StatusBar, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const QUESTS_DATA = [
  { id: '1', date: 'Apr 30', type: 'O+', hospital: "St. Luke's",  status: 'Completed', xp: '+150 XP' },
  { id: '2', date: 'Apr 12', type: 'O+', hospital: 'PGH',         status: 'Completed', xp: '+150 XP' },
  { id: '3', date: 'Mar 05', type: 'O+', hospital: 'Makati Med',  status: 'Completed', xp: '+150 XP' },
];

export default function Quests() {
  const renderItem = ({ item }) => (
    <View style={styles.questCard}>
      {/* Left: blood type pill */}
      <View style={styles.bloodPill}>
        <Text style={styles.bloodPillText}>{item.type}</Text>
      </View>

      {/* Middle: info */}
      <View style={styles.questInfo}>
        <Text style={styles.questHospital}>{item.hospital}</Text>
        <View style={styles.questMeta}>
          <Ionicons name="calendar-outline" size={12} color="#AAAAAA" />
          <Text style={styles.questMetaText}>{item.date}</Text>
        </View>
      </View>

      {/* Right: status + XP */}
      <View style={styles.questRight}>
        <View style={styles.statusChip}>
          <Text style={styles.statusChipText}>{item.status}</Text>
        </View>
        <Text style={styles.xpText}>{item.xp}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F5F7" />

      <View style={styles.header}>
        <Text style={styles.title}>Quest History</Text>
        <Text style={styles.subtitle}>Your past heroic deeds</Text>
      </View>

      {/* Summary strip */}
      <View style={styles.summaryRow}>
        <View style={styles.summaryChip}>
          <Text style={styles.summaryValue}>{QUESTS_DATA.length}</Text>
          <Text style={styles.summaryLabel}>Quests</Text>
        </View>
        <View style={styles.summaryChip}>
          <Text style={styles.summaryValue}>450</Text>
          <Text style={styles.summaryLabel}>XP Earned</Text>
        </View>
        <View style={styles.summaryChip}>
          <Text style={[styles.summaryValue, { color: '#D32F2F' }]}>O+</Text>
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
            <Ionicons name="map-outline" size={48} color="#CCCCCC" />
            <Text style={styles.emptyText}>No quests yet. Accept a request to start!</Text>
          </View>
        }
      />
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

  // Summary
  summaryRow: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 18,
    marginBottom: 14,
  },
  summaryChip: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1A1A1A',
    letterSpacing: -0.5,
  },
  summaryLabel: {
    fontSize: 11,
    color: '#888888',
    marginTop: 2,
  },

  // List
  list: {
    paddingHorizontal: 18,
    paddingBottom: 30,
    gap: 10,
  },

  // Quest card
  questCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  bloodPill: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bloodPillText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#D32F2F',
  },
  questInfo: {
    flex: 1,
  },
  questHospital: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  questMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  questMetaText: {
    fontSize: 12,
    color: '#AAAAAA',
  },
  questRight: {
    alignItems: 'flex-end',
    gap: 6,
  },
  statusChip: {
    backgroundColor: '#F0FDF4',
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  statusChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#22C55E',
  },
  xpText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#F59E0B',
  },

  // Empty
  empty: {
    alignItems: 'center',
    paddingTop: 80,
    gap: 12,
  },
  emptyText: {
    fontSize: 14,
    color: '#AAAAAA',
    textAlign: 'center',
    paddingHorizontal: 40,
    lineHeight: 20,
  },
});
