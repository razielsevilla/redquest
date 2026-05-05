import React from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView } from 'react-native';

const QUESTS_DATA = [
  { id: '1', date: 'Apr 30', type: 'O+', hospital: "St. Luke's", status: 'Completed' },
  { id: '2', date: 'Apr 12', type: 'O+', hospital: 'PGH', status: 'Completed' },
  { id: '3', date: 'Mar 05', type: 'O+', hospital: 'Makati Med', status: 'Completed' },
];

export default function Quests() {
  const renderItem = ({ item }) => (
    <View style={styles.questCard}>
      <View style={styles.questHeader}>
        <Text style={styles.questDate}>{item.date}</Text>
        <Text style={styles.questStatus}>{item.status}</Text>
      </View>
      <View style={styles.questBody}>
        <Text style={styles.questType}>Blood Type: {item.type}</Text>
        <Text style={styles.questHospital}>{item.hospital}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Quest History</Text>
        <Text style={styles.subtitle}>Your past heroic deeds.</Text>

        <FlatList
          data={QUESTS_DATA}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#111827',
  },
  container: {
    flex: 1,
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
  listContainer: {
    paddingBottom: 24,
  },
  questCard: {
    backgroundColor: '#1F2937',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#374151',
  },
  questHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  questDate: {
    color: '#F9FAFB',
    fontWeight: 'bold',
    fontSize: 16,
  },
  questStatus: {
    color: '#10B981', // Green for completed
    fontWeight: '600',
    fontSize: 14,
  },
  questBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  questType: {
    color: '#E24B4A',
    fontWeight: 'bold',
  },
  questHospital: {
    color: '#9CA3AF',
  },
});
