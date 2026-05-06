import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
  StatusBar,
  Animated,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
const units = ['1', '2', '3+'];
const urgencies = [
  { id: 'standard', label: 'Standard (within 1 hr)', color: '#9CA3AF', bg: '#F3F4F6' },
  { id: 'urgent', label: 'Urgent (within 20 min)', color: '#F59E0B', bg: '#FFFBEB' },
  { id: 'critical', label: 'Critical (within 10 min)', color: '#EF4444', bg: '#FEF2F2' },
];
const hospitals = ["St. Luke's BGC", 'Makati Medical Center', 'Philippine General Hospital', 'Asian Hospital'];

export default function PostRequest({ navigation }) {
  const [selectedBlood, setSelectedBlood] = useState('O+');
  const [selectedUnit, setSelectedUnit] = useState('2');
  const [selectedUrgency, setSelectedUrgency] = useState('urgent');
  const [selectedHospital, setSelectedHospital] = useState(hospitals[0]);
  const [showHospitals, setShowHospitals] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }).start();
  }, []);

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F5F7" />

      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Post a Request</Text>
      </View>

      <Animated.ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        style={{ opacity: fadeAnim }}
      >
        {/* ── Blood Type ── */}
        <View style={styles.card}>
          <Text style={styles.label}>Blood type needed</Text>
          <View style={styles.grid}>
            {bloodTypes.map(type => (
              <TouchableOpacity
                key={type}
                style={[styles.gridItem, selectedBlood === type && styles.gridItemActive]}
                onPress={() => setSelectedBlood(type)}
                activeOpacity={0.7}
              >
                <Text style={[styles.gridText, selectedBlood === type && styles.gridTextActive]}>
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ── Units Needed ── */}
        <View style={styles.card}>
          <Text style={styles.label}>Units needed</Text>
          <View style={styles.row}>
            {units.map(unit => (
              <TouchableOpacity
                key={unit}
                style={[styles.rowItem, selectedUnit === unit && styles.rowItemActive]}
                onPress={() => setSelectedUnit(unit)}
                activeOpacity={0.7}
              >
                <Text style={[styles.gridText, selectedUnit === unit && styles.gridTextActive]}>
                  {unit}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ── Hospital ── */}
        <View style={styles.card}>
          <Text style={styles.label}>Hospital</Text>
          <TouchableOpacity
            style={styles.selectInput}
            onPress={() => setShowHospitals(!showHospitals)}
            activeOpacity={0.7}
          >
            <Text style={styles.selectText}>{selectedHospital}</Text>
            <Ionicons
              name={showHospitals ? 'chevron-up' : 'chevron-down'}
              size={18}
              color="#888888"
            />
          </TouchableOpacity>
          {showHospitals && (
            <View style={styles.dropdown}>
              {hospitals.map(h => (
                <TouchableOpacity
                  key={h}
                  style={styles.dropdownItem}
                  onPress={() => { setSelectedHospital(h); setShowHospitals(false); }}
                >
                  <Text style={[styles.dropdownText, selectedHospital === h && styles.dropdownTextActive]}>
                    {h}
                  </Text>
                  {selectedHospital === h && (
                    <Ionicons name="checkmark" size={18} color="#D32F2F" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* ── Urgency ── */}
        <View style={styles.card}>
          <Text style={styles.label}>Urgency</Text>
          {urgencies.map(urgency => (
            <TouchableOpacity
              key={urgency.id}
              style={[
                styles.radioRow,
                selectedUrgency === urgency.id && { backgroundColor: urgency.bg, borderColor: urgency.color },
              ]}
              onPress={() => setSelectedUrgency(urgency.id)}
              activeOpacity={0.7}
            >
              <View style={[styles.radioOuter, selectedUrgency === urgency.id && { borderColor: urgency.color }]}>
                {selectedUrgency === urgency.id && (
                  <View style={[styles.radioInner, { backgroundColor: urgency.color }]} />
                )}
              </View>
              <Text style={[
                styles.radioLabel,
                selectedUrgency === urgency.id && { color: '#1A1A1A', fontWeight: '600' },
              ]}>
                {urgency.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Notes ── */}
        <View style={styles.card}>
          <Text style={styles.label}>Notes (optional)</Text>
          <TextInput
            style={styles.textInput}
            placeholder="e.g. Post-surgery, ICU bed 3"
            placeholderTextColor="#AAAAAA"
            multiline
          />
        </View>

        {/* ── Transport Fee ── */}
        <View style={styles.feePill}>
          <Ionicons name="bicycle-outline" size={18} color="#D32F2F" />
          <Text style={styles.feeText}>Transport fee: <Text style={styles.feeBold}>₱150</Text></Text>
          <Text style={styles.feeSub}>Rider cost, paid by you</Text>
        </View>

        {/* ── Submit ── */}
        <TouchableOpacity
          style={styles.submitButton}
          onPress={() => navigation.navigate('RequestStatus')}
          activeOpacity={0.88}
        >
          <Ionicons name="paper-plane-outline" size={18} color="#FFFFFF" />
          <Text style={styles.submitButtonText}>Post Request</Text>
        </TouchableOpacity>
      </Animated.ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F5F5F7',
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 18,
    paddingTop: Platform.OS === 'android' ? 14 : 6,
    paddingBottom: 12,
  },
  backBtn: { padding: 4 },
  headerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#1A1A1A',
    letterSpacing: -0.3,
  },

  scroll: {
    paddingHorizontal: 18,
    paddingBottom: 40,
  },

  // ── Card wrapper
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 12,
  },

  // ── Blood type grid
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  gridItem: {
    width: '22%',
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#F5F5F7',
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
  },
  gridItemActive: {
    backgroundColor: '#D32F2F',
    borderColor: '#D32F2F',
  },
  gridText: {
    color: '#555555',
    fontSize: 15,
    fontWeight: '700',
  },
  gridTextActive: {
    color: '#FFFFFF',
  },

  // ── Units row
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  rowItem: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#F5F5F7',
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
  },
  rowItemActive: {
    backgroundColor: '#D32F2F',
    borderColor: '#D32F2F',
  },

  // ── Hospital selector
  selectInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F5F5F7',
    padding: 14,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
  },
  selectText: {
    color: '#1A1A1A',
    fontSize: 15,
    fontWeight: '500',
  },
  dropdown: {
    backgroundColor: '#F5F5F7',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderTopWidth: 0,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    marginTop: -4,
  },
  dropdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  dropdownText: {
    color: '#555555',
    fontSize: 15,
  },
  dropdownTextActive: {
    color: '#D32F2F',
    fontWeight: '700',
  },

  // ── Urgency radio
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    backgroundColor: '#F5F5F7',
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#CCCCCC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  radioLabel: {
    color: '#555555',
    fontSize: 14,
  },

  // ── Text input
  textInput: {
    backgroundColor: '#F5F5F7',
    color: '#1A1A1A',
    padding: 14,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    fontSize: 14,
    minHeight: 60,
    textAlignVertical: 'top',
  },

  // ── Fee pill
  feePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FEF2F2',
    borderRadius: 50,
    paddingVertical: 12,
    paddingHorizontal: 18,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FECACA',
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  feeText: {
    fontSize: 14,
    color: '#555555',
  },
  feeBold: {
    fontWeight: '800',
    color: '#D32F2F',
  },
  feeSub: {
    fontSize: 12,
    color: '#AAAAAA',
    width: '100%',
    textAlign: 'center',
    marginTop: 2,
  },

  // ── Submit
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#D32F2F',
    paddingVertical: 16,
    borderRadius: 14,
    shadowColor: '#D32F2F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
