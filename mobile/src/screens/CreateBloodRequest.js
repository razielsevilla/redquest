import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  TextInput,
  StatusBar,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS, RADIUS } from '../lib/theme';

// ─── Constants ──────────────────────────────────────────────────
const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

const URGENCY_LEVELS = [
  { key: 'low',      label: 'Low',      note: null },
  { key: 'medium',   label: 'Medium',   note: null },
  { key: 'critical', label: 'Critical', note: 'Within 2 hours' },
];

const TIME_OPTIONS = [
  'Within 1 hour',
  'Within 2 hours',
  'Within 4 hours',
  'Within 24 hours',
  'Flexible',
];

// ─── Component ──────────────────────────────────────────────────
export default function CreateBloodRequest({ navigation }) {
  const [bloodType,  setBloodType]  = useState('O+');
  const [units,      setUnits]      = useState('2');
  const [urgency,    setUrgency]    = useState('medium');
  const [timeNeeded, setTimeNeeded] = useState('Within 2 hours');
  const [notes,      setNotes]      = useState('');
  const [showTime,   setShowTime]   = useState(false);

  function handleSubmit() {
    // Generate a simple request ID and open the live tracking screen
    const requestId = `VF-${Math.floor(1000 + Math.random() * 9000)}`;
    navigation.navigate('HospitalRequestTracking', { requestId });
  }

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      {/* ── HEADER ── */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Create Blood Request</Text>
          <Text style={styles.headerSub}>Fill in the details below</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── BLOOD TYPE ── */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Blood Type Required</Text>
          <View style={styles.bloodGrid}>
            {BLOOD_TYPES.map(bt => (
              <TouchableOpacity
                key={bt}
                style={[styles.bloodCell, bloodType === bt && styles.bloodCellActive]}
                onPress={() => setBloodType(bt)}
                activeOpacity={0.8}
              >
                <Text style={[styles.bloodCellText, bloodType === bt && styles.bloodCellTextActive]}>
                  {bt}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ── UNITS REQUIRED ── */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Units Required</Text>
          <TextInput
            style={styles.input}
            value={units}
            onChangeText={setUnits}
            keyboardType="number-pad"
            maxLength={2}
            placeholder="e.g. 2"
            placeholderTextColor={COLORS.textPlaceholder}
          />
        </View>

        {/* ── URGENCY LEVEL ── */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Urgency Level</Text>
          {URGENCY_LEVELS.map(u => {
            const isSelected = urgency === u.key;
            return (
              <TouchableOpacity
                key={u.key}
                style={[styles.radioRow, isSelected && styles.radioRowActive]}
                onPress={() => setUrgency(u.key)}
                activeOpacity={0.8}
              >
                {/* Radio circle */}
                <View style={[styles.radioOuter, isSelected && styles.radioOuterActive]}>
                  {isSelected && <View style={styles.radioInner} />}
                </View>

                <Text style={[styles.radioLabel, isSelected && styles.radioLabelActive]}>
                  {u.label}
                </Text>

                {u.note && (
                  <Text style={styles.radioNote}>{u.note}</Text>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ── TIME NEEDED BY ── */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Time Needed By</Text>
          <TouchableOpacity
            style={styles.selectBox}
            onPress={() => setShowTime(v => !v)}
            activeOpacity={0.8}
          >
            <Text style={styles.selectBoxText}>{timeNeeded}</Text>
            <Ionicons
              name={showTime ? 'chevron-up' : 'chevron-down'}
              size={18}
              color="#888888"
            />
          </TouchableOpacity>
          {showTime && (
            <View style={styles.dropdown}>
              {TIME_OPTIONS.map(opt => (
                <TouchableOpacity
                  key={opt}
                  style={[
                    styles.dropdownItem,
                    timeNeeded === opt && styles.dropdownItemActive,
                  ]}
                  onPress={() => { setTimeNeeded(opt); setShowTime(false); }}
                >
                  <Text style={[
                    styles.dropdownText,
                    timeNeeded === opt && styles.dropdownTextActive,
                  ]}>
                    {opt}
                  </Text>
                  {timeNeeded === opt && (
                    <Ionicons name="checkmark" size={16} color={COLORS.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* ── PATIENT / WARD NOTES ── */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Notes (optional)</Text>
          <TextInput
            style={[styles.input, styles.inputMulti]}
            value={notes}
            onChangeText={setNotes}
            placeholder="e.g. Post-surgery, ICU Ward 3, for Dr. Santos"
            placeholderTextColor="#BDBDBD"
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>

        {/* ── SUMMARY PILL ── */}
        <View style={styles.summaryPill}>
          <Ionicons name="information-circle-outline" size={16} color={COLORS.primary} />
          <Text style={styles.summaryText}>
            Request: <Text style={styles.summaryAccent}>{bloodType}</Text>
            {' · '}{units} unit{units !== '1' ? 's' : ''}
            {' · '}<Text style={{ textTransform: 'capitalize' }}>{urgency}</Text> urgency
          </Text>
        </View>

        {/* ── SUBMIT ── */}
        <TouchableOpacity
          style={styles.submitBtn}
          onPress={handleSubmit}
          activeOpacity={0.88}
        >
          <Text style={styles.submitBtnText}>Submit Request</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ─────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 18,
    paddingTop: Platform.OS === 'android' ? 14 : 6,
    paddingBottom: 12,
    backgroundColor: COLORS.background,
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: -0.3,
  },
  headerSub: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 1,
  },

  // Scroll
  scroll: {
    paddingHorizontal: 18,
    paddingBottom: 40,
  },

  // Section label
  section: {
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textSecondary,
    marginBottom: 10,
    letterSpacing: 0.1,
  },

  // Blood type grid (4 columns)
  bloodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  bloodCell: {
    width: '22%',
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#E5E5E5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  bloodCellActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primarySurface,
  },
  bloodCellText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#555555',
  },
  bloodCellTextActive: {
    color: COLORS.primary,
  },

  // Input
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E8E8E8',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#1A1A1A',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  inputMulti: {
    height: 90,
    paddingTop: 14,
  },

  // Urgency radio rows
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E8E8E8',
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 10,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  radioRowActive: {
    borderColor: '#D32F2F',
    backgroundColor: '#FFF5F5',
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#CCCCCC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterActive: {
    borderColor: COLORS.primary,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#D32F2F',
  },
  radioLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: '#444444',
  },
  radioLabelActive: {
    color: '#D32F2F',
    fontWeight: '700',
  },
  radioNote: {
    fontSize: 12,
    color: '#888888',
    fontWeight: '500',
  },

  // Time dropdown
  selectBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E8E8E8',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  selectBoxText: {
    fontSize: 15,
    color: '#1A1A1A',
    fontWeight: '500',
  },
  dropdown: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E8E8E8',
    borderTopWidth: 0,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    marginTop: -4,
    overflow: 'hidden',
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 13,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  dropdownItemActive: {
    backgroundColor: '#FFF5F5',
  },
  dropdownText: {
    fontSize: 14,
    color: '#555555',
  },
  dropdownTextActive: {
    color: COLORS.primary,
    fontWeight: '700',
  },

  // Summary pill
  summaryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFF5F5',
    borderRadius: 50,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  summaryText: {
    fontSize: 13,
    color: '#555555',
    flex: 1,
    flexWrap: 'wrap',
  },
  summaryAccent: {
    color: '#D32F2F',
    fontWeight: '800',
  },

  // Submit button
  submitBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingVertical: 17,
    alignItems: 'center',
    ...SHADOWS.button,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
