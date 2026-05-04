import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function RequesterHome() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Requester Home</Text>
      <Text>Post a blood request and track status (placeholder)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 20, fontWeight: '600', marginBottom: 8 },
});
