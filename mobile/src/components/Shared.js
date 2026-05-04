import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

export const BloodTypeBadge = ({ type }) => (
  <View style={styles.bloodTypeBadge}>
    <Text style={styles.bloodTypeText}>{type}</Text>
  </View>
);

export const UrgencyBadge = ({ level }) => {
  let bgColor = '#4B5563'; // standard gray
  if (level === 'urgent') bgColor = '#F59E0B'; // amber
  if (level === 'critical') bgColor = '#EF4444'; // red
  
  return (
    <View style={[styles.urgencyBadge, { backgroundColor: bgColor }]}>
      <Text style={styles.urgencyText}>{level.toUpperCase()}</Text>
    </View>
  );
};

export const XPBar = ({ currentXP, targetXP, level }) => {
  const progress = (currentXP / targetXP) * 100;
  return (
    <View style={styles.xpContainer}>
      <Text style={styles.xpText}>Level {level} Hero</Text>
      <View style={styles.xpBarBackground}>
        <View style={[styles.xpBarFill, { width: `${progress}%` }]} />
      </View>
      <Text style={styles.xpLabel}>{currentXP.toLocaleString()} / {targetXP.toLocaleString()}</Text>
    </View>
  );
};

export const QuestCard = ({ bloodType, urgency, hospitalName, distanceMeters, expiresAt }) => (
  <View style={styles.questCard}>
    <View style={styles.questHeader}>
      <BloodTypeBadge type={bloodType} />
      <UrgencyBadge level={urgency} />
    </View>
    <Text style={styles.questTitle}>{hospitalName}</Text>
    <Text style={styles.questSubtitle}>{distanceMeters / 1000} km away</Text>
    {expiresAt && <Text style={styles.questExpiry}>Expires in 4:32</Text>}
  </View>
);

export const RiderCard = ({ name, plate, etaMinutes, status }) => (
  <View style={styles.riderCard}>
    <View style={styles.riderInfo}>
      <Text style={styles.riderIcon}>🏍️</Text>
      <View>
        <Text style={styles.riderName}>{name}</Text>
        <Text style={styles.riderPlate}>{plate}</Text>
      </View>
    </View>
    <View style={styles.riderEta}>
      <Text style={styles.etaLabel}>ETA</Text>
      <Text style={styles.etaValue}>{etaMinutes} min</Text>
    </View>
  </View>
);

export const StatusTimeline = ({ steps, currentStep }) => (
  <View style={styles.timelineContainer}>
    {steps.map((step, index) => (
      <View key={index} style={styles.timelineStep}>
        <View style={[styles.timelineDot, index <= currentStep && styles.timelineDotActive]} />
        <Text style={[styles.timelineLabel, index <= currentStep && styles.timelineLabelActive]}>{step}</Text>
        {index < steps.length - 1 && (
          <View style={[styles.timelineLine, index < currentStep && styles.timelineLineActive]} />
        )}
      </View>
    ))}
  </View>
);

const styles = StyleSheet.create({
  bloodTypeBadge: {
    backgroundColor: '#E24B4A',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  bloodTypeText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  urgencyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  urgencyText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  xpContainer: { marginVertical: 12 },
  xpText: { color: '#F9FAFB', fontSize: 16, fontWeight: '600', marginBottom: 8 },
  xpBarBackground: { backgroundColor: '#374151', height: 12, borderRadius: 6, overflow: 'hidden' },
  xpBarFill: { backgroundColor: '#E24B4A', height: '100%', borderRadius: 6 },
  xpLabel: { color: '#9CA3AF', fontSize: 12, marginTop: 4, textAlign: 'right' },
  questCard: {
    backgroundColor: '#1F2937',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  questHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  questTitle: { color: '#F9FAFB', fontSize: 16, fontWeight: '600' },
  questSubtitle: { color: '#9CA3AF', fontSize: 14, marginTop: 4 },
  questExpiry: { color: '#E24B4A', fontSize: 14, fontWeight: 'bold', marginTop: 8 },
  riderCard: {
    backgroundColor: '#1F2937',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 16,
    borderWidth: 1,
    borderColor: '#374151'
  },
  riderInfo: { flexDirection: 'row', alignItems: 'center' },
  riderIcon: { fontSize: 24, marginRight: 12 },
  riderName: { color: '#F9FAFB', fontSize: 16, fontWeight: 'bold' },
  riderPlate: { color: '#9CA3AF', fontSize: 14 },
  riderEta: { alignItems: 'flex-end' },
  etaLabel: { color: '#9CA3AF', fontSize: 12 },
  etaValue: { color: '#F9FAFB', fontSize: 16, fontWeight: 'bold' },
  timelineContainer: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 20 },
  timelineStep: { alignItems: 'center', flex: 1, position: 'relative' },
  timelineDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#374151', zIndex: 1 },
  timelineDotActive: { backgroundColor: '#E24B4A' },
  timelineLine: { position: 'absolute', top: 5, left: '50%', right: '-50%', height: 2, backgroundColor: '#374151', zIndex: 0 },
  timelineLineActive: { backgroundColor: '#E24B4A' },
  timelineLabel: { color: '#9CA3AF', fontSize: 10, marginTop: 8, textAlign: 'center' },
  timelineLabelActive: { color: '#F9FAFB', fontWeight: 'bold' },
});
