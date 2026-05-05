import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';

export default function RequesterHome({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.headerTitle}>RedQuest</Text>

        <TouchableOpacity
          style={styles.primaryCta}
          onPress={() => navigation.navigate('PostRequest')}
        >
          <Text style={styles.primaryCtaText}>+ Post a Blood Request</Text>
        </TouchableOpacity>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your recent requests (1)</Text>

          <TouchableOpacity
            style={styles.requestCard}
            onPress={() => navigation.navigate('RequestStatus')}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.bloodType}>O+</Text>
              <Text style={styles.dot}>•</Text>
              <Text style={styles.urgency}>Urgent</Text>
              <Text style={styles.dot}>•</Text>
              <Text style={styles.date}>May 4</Text>
            </View>
            <Text style={styles.hospitalText}>St. Luke's BGC</Text>
            <View style={styles.statusRow}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>Donor matched</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#111827' },
  content: { padding: 24, flexGrow: 1 },
  headerTitle: { color: '#E24B4A', fontSize: 24, fontWeight: 'bold', marginBottom: 32, textAlign: 'center' },
  primaryCta: {
    backgroundColor: '#E24B4A',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 40,
  },
  primaryCtaText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  section: { flex: 1 },
  sectionTitle: { color: '#F9FAFB', fontSize: 18, fontWeight: '600', marginBottom: 16 },
  requestCard: {
    backgroundColor: '#1F2937',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#374151',
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  bloodType: { color: '#F9FAFB', fontWeight: 'bold', fontSize: 16 },
  dot: { color: '#9CA3AF', marginHorizontal: 8 },
  urgency: { color: '#F59E0B', fontWeight: 'bold', fontSize: 14 },
  date: { color: '#9CA3AF', fontSize: 14 },
  hospitalText: { color: '#F9FAFB', fontSize: 16, marginBottom: 12 },
  statusRow: { flexDirection: 'row', alignItems: 'center' },
  statusDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#10B981', marginRight: 8 },
  statusText: { color: '#10B981', fontSize: 14, fontWeight: '600' },
});
