import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';

export default function RiderEnRoute({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.headerTitle}>En route to hospital</Text>

        <View style={styles.hospitalCard}>
          <Text style={styles.hospitalIcon}>🏥</Text>
          <View>
            <Text style={styles.hospitalName}>St. Luke's BGC</Text>
            <Text style={styles.estimatedTime}>Estimated: 12 minutes</Text>
          </View>
        </View>

        <View style={styles.detailsBox}>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Blood type:</Text>
            <Text style={styles.value}>O+</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Units needed:</Text>
            <Text style={styles.value}>2</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Location:</Text>
            <Text style={styles.value}>Floor 2, Blood Bank</Text>
          </View>
        </View>

        <Text style={styles.instructionText}>
          Show your QR at the blood bank counter.
        </Text>

        <View style={styles.spacer} />

        {/* Skipped S09 (QR Code), so this jumps to S10 */}
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => navigation.navigate('QuestComplete')}
        >
          <Text style={styles.actionButtonText}>Demo: QR Scanned (Complete Quest)</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#111827' },
  content: { flex: 1, padding: 24, paddingTop: 40 },
  headerTitle: { color: '#F9FAFB', fontSize: 22, fontWeight: 'bold', marginBottom: 24, textAlign: 'center' },
  hospitalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F2937',
    padding: 20,
    borderRadius: 12,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#374151'
  },
  hospitalIcon: { fontSize: 32, marginRight: 16 },
  hospitalName: { color: '#F9FAFB', fontSize: 18, fontWeight: 'bold' },
  estimatedTime: { color: '#10B981', fontSize: 16, marginTop: 4, fontWeight: '600' },
  detailsBox: {
    backgroundColor: '#1F2937',
    padding: 20,
    borderRadius: 12,
    marginBottom: 32,
  },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  label: { color: '#9CA3AF', fontSize: 16 },
  value: { color: '#F9FAFB', fontSize: 16, fontWeight: 'bold' },
  instructionText: { color: '#D1D5DB', fontSize: 16, textAlign: 'center', lineHeight: 24 },
  spacer: { flex: 1 },
  actionButton: {
    backgroundColor: '#E24B4A',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  actionButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});
