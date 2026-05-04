import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { StatusTimeline } from '../components/Shared';

export default function RequestStatus({ navigation }) {
  const [status, setStatus] = useState('matching'); // 'matching' or 'matched'
  
  // Simulate finding a donor after a few seconds
  useEffect(() => {
    if (status === 'matching') {
      const timer = setTimeout(() => {
        setStatus('matched');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        
        <View style={styles.headerBox}>
          <Text style={styles.title}>Blood request posted</Text>
          <Text style={styles.subtitle}>O+  •  Urgent  •  St. Luke's</Text>
        </View>

        <StatusTimeline 
          steps={['Matching', 'Matched', 'Dispatched', 'Done']} 
          currentStep={status === 'matching' ? 0 : 1} 
        />

        {status === 'matching' ? (
          <View style={styles.matchingState}>
            <Text style={styles.statusText}>Searching for nearby compatible donors...</Text>
            <ActivityIndicator size="large" color="#E24B4A" style={styles.spinner} />
            <Text style={styles.realTimeText}>— updates in real time</Text>
            
            <View style={styles.spacer} />
            
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.cancelButtonText}>Cancel request</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.matchedState}>
            <View style={styles.successBox}>
              <Text style={styles.checkIcon}>✓</Text>
              <Text style={styles.successTitle}>Donor found!</Text>
            </View>
            
            <Text style={styles.detailText}>Blood type O+</Text>
            <Text style={styles.detailText}>A rider is picking them up</Text>
            
            <View style={styles.etaBox}>
              <Text style={styles.etaText}>Rider ETA to donor: <Text style={styles.boldWhite}>4 min</Text></Text>
              <Text style={styles.etaText}>Estimated arrival at hospital: <Text style={styles.boldWhite}>~25 minutes</Text></Text>
            </View>
            
            <Text style={styles.instructionText}>Please inform the blood bank to prepare.</Text>
            
            <View style={styles.spacer} />
            
            <TouchableOpacity 
              style={styles.homeButton}
              onPress={() => navigation.navigate('Requester')}
            >
              <Text style={styles.homeButtonText}>Back to Home</Text>
            </TouchableOpacity>
          </View>
        )}

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#111827' },
  content: { flex: 1, padding: 24 },
  headerBox: { marginBottom: 16 },
  title: { color: '#F9FAFB', fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
  subtitle: { color: '#D1D5DB', fontSize: 16 },
  
  matchingState: { flex: 1, alignItems: 'center', marginTop: 40 },
  statusText: { color: '#F9FAFB', fontSize: 18, textAlign: 'center', marginBottom: 32 },
  spinner: { marginBottom: 32 },
  realTimeText: { color: '#9CA3AF', fontSize: 14, fontStyle: 'italic' },
  
  matchedState: { flex: 1, marginTop: 40 },
  successBox: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  checkIcon: { color: '#10B981', fontSize: 24, fontWeight: 'bold', marginRight: 12 },
  successTitle: { color: '#10B981', fontSize: 22, fontWeight: 'bold' },
  detailText: { color: '#F9FAFB', fontSize: 18, marginBottom: 12 },
  etaBox: {
    backgroundColor: '#1F2937',
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#374151'
  },
  etaText: { color: '#9CA3AF', fontSize: 16, marginBottom: 8 },
  boldWhite: { color: '#F9FAFB', fontWeight: 'bold' },
  instructionText: { color: '#F59E0B', fontSize: 16, fontWeight: '600', textAlign: 'center' },
  
  spacer: { flex: 1 },
  cancelButton: { paddingVertical: 16, alignItems: 'center', width: '100%' },
  cancelButtonText: { color: '#9CA3AF', fontSize: 16, fontWeight: '600' },
  homeButton: {
    backgroundColor: '#374151',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
  homeButtonText: { color: '#F9FAFB', fontSize: 16, fontWeight: 'bold' },
});
