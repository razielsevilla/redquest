import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function DonorHome() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Donor Home</Text>
      <Text>Availability toggle, blood type, quick actions (placeholder)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 20, fontWeight: '600', marginBottom: 8 },
});
