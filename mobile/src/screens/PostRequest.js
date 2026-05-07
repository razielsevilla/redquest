import React, { useState, useRef, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, TextInput, StatusBar, Animated, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS, RADIUS } from '../lib/theme';
import { getHospitals, createRequest } from '../lib/api';

const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
const units = ['1', '2', '3+'];
const urgencies = [
  { id: 'standard', label: 'Standard (within 1 hr)', color: COLORS.textMuted, bg: COLORS.background },
  { id: 'urgent',   label: 'Urgent (within 20 min)', color: COLORS.warning,   bg: COLORS.warningLight },
  { id: 'critical', label: 'Critical (within 10 min)', color: COLORS.primary,   bg: COLORS.primarySurface },
];

export default function PostRequest({ navigation }) {
  const [selectedBlood, setSelectedBlood] = useState('O+');
  const [selectedUnit, setSelectedUnit] = useState('2');
  const [selectedUrgency, setSelectedUrgency] = useState('urgent');
  const [hospitals, setHospitals] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [showHospitals, setShowHospitals] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    async function loadHospitals() {
      try {
        const res = await getHospitals();
        if (res?.hospitals?.length > 0) {
          setHospitals(res.hospitals);
          setSelectedHospital(res.hospitals[0]);
        }
      } catch (err) {
        console.error('Failed to load hospitals:', err);
      }
    }
    loadHospitals();
    Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }).start();
  }, []);

  const handleSubmit = async () => {
    if (!selectedHospital) return;
    setIsSubmitting(true);
    try {
      const res = await createRequest({
        hospital_id: selectedHospital.id,
        blood_type: selectedBlood,
        units_needed: parseInt(selectedUnit.replace('+', ''), 10) || 1,
        urgency: selectedUrgency
      });
      navigation.replace('RequestStatus', { request: res.request });
    } catch (err) {
      console.error('Submit failed', err);
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Post a Request</Text>
      </View>

      <Animated.ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        style={{ opacity: fadeAnim }}
      >
        {/* Blood Type */}
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
                <Text style={[styles.gridText, selectedBlood === type && styles.gridTextActive]}>{type}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Units */}
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
                <Text style={[styles.gridText, selectedUnit === unit && styles.gridTextActive]}>{unit}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Hospital */}
        <View style={styles.card}>
          <Text style={styles.label}>Hospital</Text>
          <TouchableOpacity
            style={styles.selectInput}
            onPress={() => setShowHospitals(!showHospitals)}
            activeOpacity={0.7}
          >
            <Text style={styles.selectText}>{selectedHospital ? selectedHospital.name : 'Loading...'}</Text>
            <Ionicons name={showHospitals ? 'chevron-up' : 'chevron-down'} size={18} color={COLORS.textMuted} />
          </TouchableOpacity>
          {showHospitals && (
            <View style={styles.dropdown}>
              {hospitals.map(h => (
                <TouchableOpacity
                  key={h.id}
                  style={styles.dropdownItem}
                  onPress={() => { setSelectedHospital(h); setShowHospitals(false); }}
                >
                  <Text style={[styles.dropdownText, selectedHospital?.id === h.id && styles.dropdownTextActive]}>{h.name}</Text>
                  {selectedHospital?.id === h.id && <Ionicons name="checkmark" size={18} color={COLORS.primary} />}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Urgency */}
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
                selectedUrgency === urgency.id && { color: COLORS.textPrimary, fontWeight: '600' },
              ]}>{urgency.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Notes */}
        <View style={styles.card}>
          <Text style={styles.label}>Notes (optional)</Text>
          <TextInput
            style={styles.textInput}
            placeholder="e.g. Post-surgery, ICU bed 3"
            placeholderTextColor={COLORS.textPlaceholder}
            multiline
          />
        </View>


        {/* Submit */}
        <TouchableOpacity
          style={[styles.submitButton, isSubmitting && { opacity: 0.7 }]}
          onPress={handleSubmit}
          activeOpacity={0.88}
          disabled={isSubmitting || !selectedHospital}
        >
          {isSubmitting ? (
            <Text style={styles.submitButtonText}>Posting...</Text>
          ) : (
            <>
              <Ionicons name="paper-plane-outline" size={18} color={COLORS.white} />
              <Text style={styles.submitButtonText}>Post Request</Text>
            </>
          )}
        </TouchableOpacity>
      </Animated.ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 18, paddingTop: Platform.OS === 'android' ? 14 : 6, paddingBottom: 12,
  },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 17, fontWeight: '800', color: COLORS.textPrimary, letterSpacing: -0.3 },
  scroll: { paddingHorizontal: 18, paddingBottom: 40 },

  card: {
    backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, padding: 16,
    marginBottom: 12, ...SHADOWS.card,
  },
  label: { fontSize: 14, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 12 },

  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  gridItem: {
    width: '22%', paddingVertical: 12, alignItems: 'center',
    backgroundColor: COLORS.inputBg, borderRadius: RADIUS.sm,
    borderWidth: 1.5, borderColor: COLORS.inputBorder,
  },
  gridItemActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  gridText: { color: COLORS.textSecondary, fontSize: 15, fontWeight: '700' },
  gridTextActive: { color: COLORS.white },

  row: { flexDirection: 'row', gap: 10 },
  rowItem: {
    flex: 1, paddingVertical: 12, alignItems: 'center',
    backgroundColor: COLORS.inputBg, borderRadius: RADIUS.sm,
    borderWidth: 1.5, borderColor: COLORS.inputBorder,
  },
  rowItemActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },

  selectInput: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: COLORS.inputBg, padding: 14, borderRadius: RADIUS.sm,
    borderWidth: 1.5, borderColor: COLORS.inputBorder,
  },
  selectText: { color: COLORS.textPrimary, fontSize: 15, fontWeight: '500' },
  dropdown: {
    backgroundColor: COLORS.inputBg, borderWidth: 1.5, borderColor: COLORS.inputBorder,
    borderTopWidth: 0, borderBottomLeftRadius: RADIUS.sm, borderBottomRightRadius: RADIUS.sm, marginTop: -4,
  },
  dropdownItem: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 14, borderBottomWidth: 1, borderBottomColor: COLORS.inputBorder,
  },
  dropdownText: { color: COLORS.textSecondary, fontSize: 15 },
  dropdownTextActive: { color: COLORS.primary, fontWeight: '700' },

  radioRow: {
    flexDirection: 'row', alignItems: 'center', marginBottom: 10,
    paddingVertical: 12, paddingHorizontal: 14, borderRadius: RADIUS.sm,
    borderWidth: 1.5, borderColor: COLORS.inputBorder, backgroundColor: COLORS.inputBg,
  },
  radioOuter: {
    width: 20, height: 20, borderRadius: 10, borderWidth: 2,
    borderColor: COLORS.textMuted, alignItems: 'center', justifyContent: 'center', marginRight: 12,
  },
  radioInner: { width: 10, height: 10, borderRadius: 5 },
  radioLabel: { color: COLORS.textSecondary, fontSize: 14 },

  textInput: {
    backgroundColor: COLORS.inputBg, color: COLORS.textPrimary, padding: 14,
    borderRadius: RADIUS.sm, borderWidth: 1.5, borderColor: COLORS.inputBorder,
    fontSize: 14, minHeight: 60, textAlignVertical: 'top',
  },

  feePill: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: COLORS.primarySurface, borderRadius: RADIUS.full,
    paddingVertical: 12, paddingHorizontal: 18, justifyContent: 'center',
    borderWidth: 1, borderColor: COLORS.primaryMuted, marginBottom: 16, flexWrap: 'wrap',
  },
  feeText: { fontSize: 14, color: COLORS.textSecondary },
  feeBold: { fontWeight: '800', color: COLORS.primary },
  feeSub: { fontSize: 12, color: COLORS.textMuted, width: '100%', textAlign: 'center', marginTop: 2 },

  submitButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: COLORS.primary, paddingVertical: 16, borderRadius: RADIUS.md, ...SHADOWS.button,
  },
  submitButtonText: { color: COLORS.white, fontSize: 16, fontWeight: '700' },
});
