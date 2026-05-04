import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';

export default function QuestAccepted({ navigation }) {
  // Simulate rider arriving after some time, or navigate manually for demo
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Quest accepted!</Text>
        
        <View style={styles.dispatchBox}>
          <Text style={styles.checkIcon}>✓</Text>
          <Text style={styles.dispatchText}>A rider has been dispatched to you.</Text>
        </View>

        <View style={styles.riderCard}>
          <View style={styles.riderRow}>
            <Text style={styles.riderIcon}>🏍️</Text>
            <View>
              <Text style={styles.riderName}>Ramon Santos</Text>
              <Text style={styles.riderPlate}>ABC 1234</Text>
            </View>
          </View>
          <Text style={styles.riderEta}>ETA: 4 minutes</Text>
        </View>

        <View style={styles.destinationBox}>
          <Text style={styles.label}>Your destination:</Text>
          <Text style={styles.destinationText}>St. Luke's Medical Center</Text>
          <Text style={styles.destinationText}>BGC Blood Bank, Floor 2</Text>
        </View>

        <Text style={styles.instructionText}>Please be ready outside your location.</Text>

        <TouchableOpacity 
          style={styles.demoNextButton}
          onPress={() => navigation.navigate('RiderEnRoute')}
        >
          <Text style={styles.demoNextText}>Demo: Rider Arrives</Text>
        </TouchableOpacity>

        <View style={styles.spacer} />

        <TouchableOpacity 
          style={styles.cancelButton}
          onPress={() => navigation.navigate('Donor')}
        >
          <Text style={styles.cancelButtonText}>Can't make it? Cancel</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#111827' },
  content: { flex: 1, padding: 24, paddingTop: 60 },
  title: { color: '#F9FAFB', fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 24 },
  dispatchBox: { flexDirection: 'row', alignItems: 'center', marginBottom: 32 },
  checkIcon: { color: '#10B981', fontSize: 24, fontWeight: 'bold', marginRight: 12 },
  dispatchText: { color: '#F9FAFB', fontSize: 18, flex: 1 },
  riderCard: {
    backgroundColor: '#1F2937',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#374151',
    marginBottom: 32,
  },
  riderRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  riderIcon: { fontSize: 32, marginRight: 16 },
  riderName: { color: '#F9FAFB', fontSize: 18, fontWeight: 'bold' },
  riderPlate: { color: '#9CA3AF', fontSize: 16 },
  riderEta: { color: '#F59E0B', fontSize: 16, fontWeight: 'bold', marginTop: 8 },
  destinationBox: { marginBottom: 24 },
  label: { color: '#9CA3AF', fontSize: 16, marginBottom: 8 },
  destinationText: { color: '#F9FAFB', fontSize: 18, fontWeight: '600', marginBottom: 4 },
  instructionText: { color: '#D1D5DB', fontSize: 16, textAlign: 'center', fontStyle: 'italic', marginBottom: 40 },
  spacer: { flex: 1 },
  cancelButton: { alignItems: 'center', paddingVertical: 16 },
  cancelButtonText: { color: '#9CA3AF', fontSize: 16, fontWeight: '600' },
  demoNextButton: {
    backgroundColor: '#E24B4A',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  demoNextText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});
