import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SHADOWS, RADIUS } from '../lib/theme';

export const BloodTypeBadge = ({ type, size = 'md' }) => {
  const isSmall = size === 'sm';
  return (
    <View style={[
      styles.bloodTypeBadge,
      isSmall && { paddingHorizontal: 8, paddingVertical: 3 },
    ]}>
      <Text style={[
        styles.bloodTypeText,
        isSmall && { fontSize: 12 },
      ]}>
        {type}
      </Text>
    </View>
  );
};

export const UrgencyBadge = ({ level }) => {
  let bgColor = '#6B7280';
  let surfaceColor = '#F3F4F6';
  if (level === 'urgent') {
    bgColor = COLORS.warning;
    surfaceColor = COLORS.warningLight;
  }
  if (level === 'critical') {
    bgColor = COLORS.primary;
    surfaceColor = COLORS.primarySurface;
  }

  return (
    <View style={[styles.urgencyBadge, { backgroundColor: surfaceColor }]}>
      <Text style={[styles.urgencyText, { color: bgColor }]}>
        {level.toUpperCase()}
      </Text>
    </View>
  );
};

export const XPBar = ({ currentXP, targetXP, level }) => {
  const progress = Math.min((currentXP / targetXP) * 100, 100);
  return (
    <View style={styles.xpContainer}>
      <View style={styles.xpHeader}>
        <Text style={styles.xpText}>Level {level}</Text>
        <Text style={styles.xpLabel}>
          {currentXP.toLocaleString()} / {targetXP.toLocaleString()} XP
        </Text>
      </View>
      <View style={styles.xpBarBackground}>
        <View style={[styles.xpBarFill, { width: `${progress}%` }]} />
      </View>
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
    <Text style={styles.questSubtitle}>{(distanceMeters / 1000).toFixed(1)} km away</Text>
    {expiresAt && <Text style={styles.questExpiry}>Expires in 4:32</Text>}
  </View>
);

export const RiderCard = ({ name, plate, etaMinutes }) => (
  <View style={styles.riderCard}>
    <View style={styles.riderInfo}>
      <View style={styles.riderIconWrap}>
        <Text style={styles.riderIconText}>R</Text>
      </View>
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
        <View style={[
          styles.timelineDot,
          index <= currentStep && styles.timelineDotActive,
        ]} />
        <Text style={[
          styles.timelineLabel,
          index <= currentStep && styles.timelineLabelActive,
        ]}>
          {step}
        </Text>
        {index < steps.length - 1 && (
          <View style={[
            styles.timelineLine,
            index < currentStep && styles.timelineLineActive,
          ]} />
        )}
      </View>
    ))}
  </View>
);

const styles = StyleSheet.create({
  bloodTypeBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: RADIUS.full,
    alignSelf: 'flex-start',
  },
  bloodTypeText: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: 14,
    letterSpacing: 0.3,
  },
  urgencyBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    alignSelf: 'flex-start',
  },
  urgencyText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  // XP Bar
  xpContainer: {
    marginVertical: 8,
  },
  xpHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  xpText: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: '700',
  },
  xpLabel: {
    color: COLORS.textMuted,
    fontSize: 12,
    fontWeight: '500',
  },
  xpBarBackground: {
    backgroundColor: COLORS.border,
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  xpBarFill: {
    backgroundColor: COLORS.primary,
    height: '100%',
    borderRadius: 4,
  },

  // Quest card
  questCard: {
    backgroundColor: COLORS.surface,
    padding: 16,
    borderRadius: RADIUS.md,
    marginBottom: 12,
    ...SHADOWS.card,
  },
  questHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  questTitle: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  questSubtitle: {
    color: COLORS.textMuted,
    fontSize: 14,
    marginTop: 4,
  },
  questExpiry: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '700',
    marginTop: 8,
  },

  // Rider card
  riderCard: {
    backgroundColor: COLORS.surface,
    padding: 16,
    borderRadius: RADIUS.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.card,
  },
  riderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  riderIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  riderIconText: {
    color: COLORS.primary,
    fontWeight: '800',
    fontSize: 16,
  },
  riderName: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
  riderPlate: {
    color: COLORS.textMuted,
    fontSize: 13,
    marginTop: 2,
  },
  riderEta: {
    alignItems: 'flex-end',
  },
  etaLabel: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  etaValue: {
    color: COLORS.primary,
    fontSize: 18,
    fontWeight: '800',
    marginTop: 2,
  },

  // Status timeline
  timelineContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 16,
  },
  timelineStep: {
    alignItems: 'center',
    flex: 1,
    position: 'relative',
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.border,
    zIndex: 1,
  },
  timelineDotActive: {
    backgroundColor: COLORS.primary,
  },
  timelineLine: {
    position: 'absolute',
    top: 5,
    left: '50%',
    right: '-50%',
    height: 2,
    backgroundColor: COLORS.border,
    zIndex: 0,
  },
  timelineLineActive: {
    backgroundColor: COLORS.primary,
  },
  timelineLabel: {
    color: COLORS.textMuted,
    fontSize: 10,
    marginTop: 8,
    textAlign: 'center',
    fontWeight: '500',
  },
  timelineLabelActive: {
    color: COLORS.textPrimary,
    fontWeight: '700',
  },
});
