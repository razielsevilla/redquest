import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';

export default function QuestAlert({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.modalContent}>
        <View style={styles.timerContainer}>
          <Text style={styles.timerIcon}>⏱️</Text>
          <Text style={styles.timerText}>04:32</Text>
        </View>

        <View style={styles.questBox}>
          <Text style={styles.questHeader}>URGENT QUEST</Text>

          <View style={styles.detailRow}>
            <Text style={styles.label}>Blood type needed:</Text>
            <View style={styles.bloodTypeBadge}>
              <Text style={styles.bloodTypeText}>💧 O+</Text>
            </View>
          </View>

          <Text style={styles.detailText}>2 units</Text>
          <Text style={styles.detailText}>St. Luke's BGC</Text>
          <Text style={styles.detailText}>1.3 km from you</Text>

          <View style={styles.infoBox}>
            <Text style={styles.infoText}>A rider will pick you up. Transport is covered.</Text>
          </View>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.acceptButton}
            onPress={() => navigation.navigate('QuestAccepted')}
          >
            <Text style={styles.acceptButtonText}>✓ Accept Quest</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.declineButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.declineButtonText}>Decline</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'rgba(17, 24, 39, 0.95)', justifyContent: 'center' },
  modalContent: { padding: 24, alignItems: 'center' },
  timerContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  timerIcon: { fontSize: 24, marginRight: 8 },
  timerText: { color: '#E24B4A', fontSize: 24, fontWeight: 'bold' },
  questBox: {
    width: '100%',
    backgroundColor: '#1F2937',
    borderWidth: 2,
    borderColor: '#374151',
    borderRadius: 12,
    padding: 24,
    marginBottom: 32,
  },
  questHeader: { color: '#F59E0B', fontSize: 18, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  detailRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  label: { color: '#9CA3AF', fontSize: 16, marginRight: 12 },
  bloodTypeBadge: { backgroundColor: '#E24B4A', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  bloodTypeText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  detailText: { color: '#F9FAFB', fontSize: 18, marginBottom: 12, fontWeight: '500' },
  infoBox: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#374151',
    borderRadius: 8,
  },
  infoText: { color: '#D1D5DB', fontSize: 14, textAlign: 'center', lineHeight: 20 },
  actionButtons: { width: '100%' },
  acceptButton: {
    backgroundColor: '#E24B4A',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  acceptButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  declineButton: {
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  declineButtonText: { color: '#9CA3AF', fontSize: 16, fontWeight: '600' },
});
