import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  ScrollView,
  Animated,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { XPBar } from '../components/Shared';
import { COLORS, SHADOWS, RADIUS } from '../lib/theme';

export default function DonorHome({ navigation }) {
  const [isAvailable, setIsAvailable]               = useState(true);
  const [isLevelUpAvailable, setIsLevelUpAvailable] = useState(true);

  const bannerAnim = useRef(new Animated.Value(-80)).current;

  // Staggered card animations (8 sections)
  const cardAnims = useRef(
    Array.from({ length: 8 }, () => ({
      opacity:    new Animated.Value(0),
      translateY: new Animated.Value(24),
    }))
  ).current;

  useEffect(() => {
    Animated.stagger(
      80,
      cardAnims.map(({ opacity, translateY }) =>
        Animated.parallel([
          Animated.timing(opacity,    { toValue: 1, duration: 400, useNativeDriver: true }),
          Animated.timing(translateY, { toValue: 0, duration: 400, useNativeDriver: true }),
        ])
      )
    ).start();
  }, []);

  useEffect(() => {
    if (isLevelUpAvailable) {
      Animated.spring(bannerAnim, { toValue: 0, useNativeDriver: true }).start();
      const t = setTimeout(() => setIsLevelUpAvailable(false), 5000);
      return () => clearTimeout(t);
    } else {
      Animated.timing(bannerAnim, { toValue: -80, duration: 250, useNativeDriver: true }).start();
    }
  }, [isLevelUpAvailable]);

  const Stagger = ({ index, children, style }) => (
    <Animated.View
      style={[
        style,
        {
          opacity:   cardAnims[index].opacity,
          transform: [{ translateY: cardAnims[index].translateY }],
        },
      ]}
    >
      {children}
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      {/* Level-up banner */}
      <Animated.View style={[styles.levelUpBanner, { transform: [{ translateY: bannerAnim }] }]}>
        <Ionicons name="arrow-up-circle" size={18} color={COLORS.white} />
        <Text style={styles.levelUpText}>Level up available! Tap to claim.</Text>
      </Animated.View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* ── HEADER ── */}
        <Stagger index={0}>
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>Hi, Juan</Text>
              <Text style={styles.subGreeting}>Ready to save a life?</Text>
            </View>
            <TouchableOpacity style={styles.bellBtn}>
              <Ionicons name="notifications-outline" size={22} color={COLORS.primary} />
              <View style={styles.bellDot} />
            </TouchableOpacity>
          </View>
        </Stagger>

        {/* ── VERIFIED DONOR card ── */}
        <Stagger index={1}>
          <View style={[styles.card, styles.verifiedCard]}>
            <View style={styles.verifiedIconWrap}>
              <Text style={styles.verifiedIconText}>O</Text>
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.verifiedRow}>
                <Text style={styles.verifiedTitle}>Verified Donor</Text>
                <Ionicons name="checkmark-circle" size={18} color={COLORS.success} />
              </View>
              <Text style={styles.verifiedSub}>Your profile is verified and active</Text>
            </View>
          </View>
        </Stagger>

        {/* ── AVAILABILITY toggle card ── */}
        <Stagger index={2}>
          <View style={[styles.card, styles.availCard]}>
            <View style={styles.availLeft}>
              <View style={styles.availIconWrap}>
                <Ionicons
                  name={isAvailable ? 'calendar' : 'calendar-outline'}
                  size={20}
                  color={isAvailable ? COLORS.success : COLORS.textMuted}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.availTitle}>
                  {isAvailable ? 'Eligible to Donate' : 'Currently Unavailable'}
                </Text>
                <Text style={[styles.availStatus, isAvailable && styles.availStatusGreen]}>
                  {isAvailable ? 'Available Now' : 'Cooldown: 56 days'}
                </Text>
                <Text style={styles.availSub}>
                  {isAvailable
                    ? 'You can accept donation requests'
                    : 'Rest up before your next quest'}
                </Text>
              </View>
            </View>
            <View style={styles.availRight}>
              <Switch
                value={isAvailable}
                onValueChange={setIsAvailable}
                trackColor={{ false: '#E0E0E0', true: COLORS.primary }}
                thumbColor={COLORS.white}
              />
            </View>
          </View>
        </Stagger>

        {/* ── BLOOD TYPE + LEVEL ── */}
        <Stagger index={3}>
          <View style={styles.card}>
            <View style={styles.bloodLevelRow}>
              <Ionicons name="water" size={18} color={COLORS.primary} />
              <Text style={styles.bloodTypeLabel}>
                Blood type: <Text style={styles.bloodTypeValue}>O+</Text>
              </Text>
            </View>
            <Text style={styles.levelLabel}>Level 4 Hero</Text>
            <XPBar currentXP={1240} targetXP={2000} level={4} />
          </View>
        </Stagger>

        {/* ── STATS ROW ── */}
        <Stagger index={4}>
          <View style={styles.statsRow}>
            <View style={[styles.statCard, { marginRight: 8 }]}>
              <View style={styles.statIconWrap}>
                <Ionicons name="heart" size={22} color={COLORS.primary} />
              </View>
              <Text style={styles.statValue}>7</Text>
              <Text style={styles.statLabel}>Total Donations</Text>
            </View>
            <View style={[styles.statCard, { marginLeft: 8 }]}>
              <View style={styles.statIconWrap}>
                <Ionicons name="time" size={22} color={COLORS.warning} />
              </View>
              <Text style={styles.statValue}>56 days</Text>
              <Text style={styles.statLabel}>Until Next</Text>
            </View>
          </View>
        </Stagger>

        {/* ── REWARDS & POINTS card ── */}
        <Stagger index={5}>
          <TouchableOpacity 
            style={[styles.card, styles.rewardsCard]} 
            onPress={() => navigation.navigate('Badges')}
            activeOpacity={0.85}
          >
            <View style={styles.rewardsLeft}>
              <View style={styles.rewardsIconWrap}>
                <Ionicons name="trophy" size={22} color={COLORS.white} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.rewardsTitle}>Rewards & Points</Text>
                <Text style={styles.rewardsSub}>2,350 RedQuest points earned</Text>
                <View style={styles.rewardsBadgeRow}>
                  <View style={[styles.badge, styles.badgeGreen]}>
                    <Text style={styles.badgeTextGreen}>4 Badges</Text>
                  </View>
                  <View style={[styles.badge, styles.badgeRed]}>
                    <Text style={styles.badgeTextRed}>3 Rewards</Text>
                  </View>
                </View>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
          </TouchableOpacity>
        </Stagger>

        {/* ── RECENT QUESTS ── */}
        <TouchableOpacity 
          style={styles.card} 
          onPress={() => navigation.navigate('Quests')}
          activeOpacity={0.9}
        >
          <Text style={styles.sectionTitle}>Recent quests (2)</Text>
          {[
            { date: 'Apr 30', type: 'O+', hospital: "St. Luke's" },
            { date: 'Apr 12', type: 'O+', hospital: 'PGH' },
          ].map((q, i) => (
            <View key={i} style={styles.questRow}>
              <View style={styles.questDot}>
                <Ionicons name="water" size={14} color={COLORS.primary} />
              </View>
              <Text style={styles.questText}>
                {q.date}  <Text style={styles.questType}>{q.type}</Text>  {q.hospital}
              </Text>
            </View>
          ))}
          <View style={styles.viewHistoryBtn}>
            <Text style={styles.viewHistoryText}>View full history</Text>
            <Ionicons name="arrow-forward" size={14} color={COLORS.primary} />
          </View>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

// ─────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background, paddingTop: 10, },

  // Level-up banner
  levelUpBanner: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    backgroundColor: COLORS.success,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    zIndex: 20,
  },
  levelUpText: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: 14,
  },

  scroll: {
    padding: 18,
    paddingBottom: 40,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 18,
    marginTop: 6,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: -0.5,
  },
  subGreeting: {
    fontSize: 14,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  bellBtn: {
    position: 'relative',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.small,
  },
  bellDot: {
    position: 'absolute',
    top: 8, right: 8,
    width: 8, height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
  },

  // Shared card base
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: 16,
    marginBottom: 12,
    ...SHADOWS.card,
  },

  // Verified donor card
  verifiedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.successLight,
    borderWidth: 1,
    borderColor: '#C8E6C9',
    gap: 12,
  },
  verifiedIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifiedIconText: {
    color: COLORS.white,
    fontWeight: '800',
    fontSize: 18,
  },
  verifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  verifiedTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  verifiedSub: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },

  // Availability card
  availCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  availLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
    gap: 12,
  },
  availIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  availTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  availStatus: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.primary,
    marginTop: 2,
  },
  availStatusGreen: {
    color: COLORS.success,
  },
  availSub: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 3,
  },
  availRight: {
    alignItems: 'center',
    paddingLeft: 8,
  },

  // Blood type + level card
  bloodLevelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  bloodTypeLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  bloodTypeValue: {
    color: COLORS.primary,
    fontWeight: '800',
    fontSize: 16,
  },
  levelLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },

  // Stats
  statsRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: 16,
    alignItems: 'center',
    ...SHADOWS.card,
  },
  statIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primarySurface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 4,
    textAlign: 'center',
  },

  // Rewards card
  rewardsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.warningLight,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  rewardsLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  rewardsIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: COLORS.warning,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rewardsTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  rewardsSub: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  rewardsBadgeRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 8,
    flexWrap: 'wrap',
  },
  badge: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: RADIUS.full,
  },
  badgeGreen: { backgroundColor: '#C8E6C9' },
  badgeRed:   { backgroundColor: COLORS.primaryMuted },
  badgeTextGreen: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.success,
  },
  badgeTextRed: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.primary,
  },

  // Recent quests
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  questRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    gap: 10,
  },
  questDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.primarySurface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  questText: { fontSize: 14, color: COLORS.textSecondary },
  questType: { color: COLORS.primary, fontWeight: '700' },
  viewHistoryBtn: {
    marginTop: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 4,
  },
  viewHistoryText: {
    color: COLORS.primary,
    fontWeight: '600',
    fontSize: 14,
  },

});
