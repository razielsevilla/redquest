import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, TextInput } from 'react-native';

const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
const units = ['1', '2', '3+'];
const urgencies = [
  { id: 'standard', label: 'Standard (within 1 hr)', color: '#9CA3AF' },
  { id: 'urgent', label: 'Urgent (within 20 min)', color: '#F59E0B' },
  { id: 'critical', label: 'Critical (within 10 min)', color: '#E24B4A' },
];

export default function PostRequest({ navigation }) {
  const [selectedBlood, setSelectedBlood] = useState('O+');
  const [selectedUnit, setSelectedUnit] = useState('2');
  const [selectedUrgency, setSelectedUrgency] = useState('urgent');

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        
        <View style={styles.field}>
          <Text style={styles.label}>Blood type needed</Text>
          <View style={styles.grid}>
            {bloodTypes.map(type => (
              <TouchableOpacity 
                key={type} 
                style={[styles.gridItem, selectedBlood === type && styles.gridItemActive]}
                onPress={() => setSelectedBlood(type)}
              >
                <Text style={[styles.gridText, selectedBlood === type && styles.gridTextActive]}>{type}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Units needed</Text>
          <View style={styles.row}>
            {units.map(unit => (
              <TouchableOpacity 
                key={unit} 
                style={[styles.rowItem, selectedUnit === unit && styles.rowItemActive]}
                onPress={() => setSelectedUnit(unit)}
              >
                <Text style={[styles.gridText, selectedUnit === unit && styles.gridTextActive]}>{unit}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Hospital</Text>
          <TouchableOpacity style={styles.selectInput}>
            <Text style={styles.selectText}>St. Luke's BGC</Text>
            <Text style={styles.checkIcon}>✓</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Urgency</Text>
          {urgencies.map(urgency => (
            <TouchableOpacity 
              key={urgency.id} 
              style={styles.radioRow}
              onPress={() => setSelectedUrgency(urgency.id)}
            >
              <View style={[styles.radioOuter, selectedUrgency === urgency.id && { borderColor: urgency.color }]}>
                {selectedUrgency === urgency.id && <View style={[styles.radioInner, { backgroundColor: urgency.color }]} />}
              </View>
              <Text style={styles.radioLabel}>{urgency.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Notes (optional)</Text>
          <TextInput 
            style={styles.textInput}
            placeholder="e.g. Post-surgery, ICU bed 3"
            placeholderTextColor="#6B7280"
          />
        </View>

        <View style={styles.feeBox}>
          <Text style={styles.feeLabel}>Transport fee: ₱150</Text>
          <Text style={styles.feeSub}>Rider cost, paid by you</Text>
        </View>

        <TouchableOpacity 
          style={styles.submitButton}
          onPress={() => navigation.navigate('RequestStatus')}
        >
          <Text style={styles.submitButtonText}>Post Request</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#111827' },
  content: { padding: 24, paddingBottom: 40 },
  field: { marginBottom: 24 },
  label: { color: '#F9FAFB', fontSize: 16, fontWeight: '600', marginBottom: 12 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  gridItem: {
    width: '22%',
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#1F2937',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#374151'
  },
  gridItemActive: { backgroundColor: '#E24B4A', borderColor: '#E24B4A' },
  gridText: { color: '#D1D5DB', fontSize: 16, fontWeight: 'bold' },
  gridTextActive: { color: '#fff' },
  row: { flexDirection: 'row', gap: 10 },
  rowItem: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#1F2937',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#374151'
  },
  rowItemActive: { backgroundColor: '#E24B4A', borderColor: '#E24B4A' },
  selectInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1F2937',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#374151'
  },
  selectText: { color: '#F9FAFB', fontSize: 16 },
  checkIcon: { color: '#10B981', fontSize: 18, fontWeight: 'bold' },
  radioRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  radioOuter: {
    width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: '#6B7280',
    alignItems: 'center', justifyContent: 'center', marginRight: 12
  },
  radioInner: { width: 10, height: 10, borderRadius: 5 },
  radioLabel: { color: '#D1D5DB', fontSize: 16 },
  textInput: {
    backgroundColor: '#1F2937',
    color: '#F9FAFB',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#374151',
    fontSize: 16
  },
  feeBox: { marginBottom: 32, alignItems: 'center' },
  feeLabel: { color: '#F9FAFB', fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  feeSub: { color: '#9CA3AF', fontSize: 14 },
  submitButton: {
    backgroundColor: '#E24B4A',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});
