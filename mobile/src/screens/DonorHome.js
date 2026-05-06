import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Animated,
  StatusBar,
} from 'react-native';
import { XPBar } from '../components/Shared';

export default function DonorHome({ navigation }) {
  const [isAvailable, setIsAvailable]               = useState(true);
  const [isLevelUpAvailable, setIsLevelUpAvailable] = useState(true);

  const bannerAnim = useRef(new Animated.Value(-80)).current;

  // Staggered card animations (8 sections)
  const cardAnims = useRef(
    Array.from({ length: 8 }, () => ({
      opacity:   new Animated.Value(0),
      translateY: new Animated.Value(24),
    }))
  ).current;

  useEffect(() => {
    // Stagger each card in with 80ms delay
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

  // Helper to wrap a section in its stagger animation
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
      <StatusBar barStyle="dark-content" backgroundColor="#F7F7F7" />

      {/* Level-up banner */}
      <Animated.View style={[styles.levelUpBanner, { transform: [{ translateY: bannerAnim }] }]}>
        <Text style={styles.levelUpText}>🎉 Level up available! Tap to claim.</Text>
      </Animated.View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* ── HEADER ── */}
        <Stagger index={0}>
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>Hi, Juan 👋</Text>
              <Text style={styles.subGreeting}>Ready to save a life?</Text>
            </View>
            <TouchableOpacity style={styles.bellBtn}>
              <Text style={styles.bellIcon}>🔔</Text>
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
                <Text style={styles.verifiedCheck}>✓</Text>
              </View>
              <Text style={styles.verifiedSub}>Your profile is verified and active</Text>
            </View>
          </View>
        </Stagger>

        {/* ── AVAILABILITY toggle card ── */}
        <Stagger index={2}>
          <View style={[styles.card, styles.availCard]}>
            <View style={styles.availLeft}>
              <Text style={styles.calIcon}>📅</Text>
              <View>
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
                trackColor={{ false: '#E0E0E0', true: '#D32F2F' }}
                thumbColor="#FFFFFF"
              />
              <Text style={styles.checkCircle}>✓</Text>
            </View>
          </View>
        </Stagger>

        {/* ── BLOOD TYPE + LEVEL ── */}
        <Stagger index={3}>
          <View style={styles.card}>
            <View style={styles.bloodLevelRow}>
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
              <Text style={styles.statIcon}>🩺</Text>
              <Text style={styles.statValue}>7</Text>
              <Text style={styles.statLabel}>Total Donations</Text>
            </View>
            <View style={[styles.statCard, { marginLeft: 8 }]}>
              <Text style={styles.statIcon}>🧡</Text>
              <Text style={styles.statValue}>56 days</Text>
              <Text style={styles.statLabel}>Until Next</Text>
            </View>
          </View>
        </Stagger>

        {/* ── REWARDS & POINTS card ── */}
        <Stagger index={5}>
          <TouchableOpacity style={[styles.card, styles.rewardsCard]} activeOpacity={0.85}>
            <View style={styles.rewardsLeft}>
              <View style={styles.rewardsIconWrap}>
                <Text style={styles.rewardsIcon}>🏆</Text>
              </View>
              <View>
                <Text style={styles.rewardsTitle}>Rewards & Points</Text>
                <Text style={styles.rewardsSub}>2,350 VitaPoints earned</Text>
                <View style={styles.rewardsBadgeRow}>
                  <View style={[styles.badge, styles.badgeGreen]}>
                    <Text style={styles.badgeText}>4 Badges Unlocked</Text>
                  </View>
                  <View style={[styles.badge, styles.badgeRed]}>
                    <Text style={styles.badgeText}>3 Rewards Available</Text>
                  </View>
                </View>
              </View>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        </Stagger>

        {/* ── RECENT QUESTS ── */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Recent quests (2)</Text>
          {[
            { date: 'Apr 30', type: 'O+', hospital: "St. Luke's" },
            { date: 'Apr 12', type: 'O+', hospital: 'PGH' },
          ].map((q, i) => (
            <View key={i} style={styles.questRow}>
              <Text style={styles.questDot}>•</Text>
              <Text style={styles.questText}>
                {q.date}  <Text style={styles.questType}>{q.type}</Text>  {q.hospital}
              </Text>
            </View>
          ))}
          <TouchableOpacity style={styles.viewHistoryBtn}>
            <Text style={styles.viewHistoryText}>View full history</Text>
          </TouchableOpacity>
        </View>

        {/* ── URGENT REQUESTS card ── */}
        <View style={styles.urgentCard}>
          <View style={styles.urgentLeft}>
            <Text style={styles.urgentIcon}>📍</Text>
            <View>
              <View style={styles.urgentTitleRow}>
                <Text style={styles.urgentTitle}>Urgent Requests</Text>
                <View style={styles.urgentBadge}>
                  <Text style={styles.urgentBadgeText}>3</Text>
                </View>
              </View>
              <Text style={styles.urgentSub}>Blood needed within 5 km</Text>
            </View>
          </View>
          <View style={styles.urgentTypes}>
            {['O+', 'A+', 'B+'].map(t => (
              <View key={t} style={styles.urgentTypeChip}>
                <Text style={styles.urgentTypeText}>{t}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── DEMO BUTTON ── */}
        <TouchableOpacity
          style={styles.demoBtn}
          onPress={() => navigation.navigate('QuestAlert')}
          activeOpacity={0.85}
        >
          <Text style={styles.demoBtnText}>Demo: Trigger Quest Alert</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

// ─────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },

  // Level-up banner
  levelUpBanner: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    alignItems: 'center',
    zIndex: 20,
  },
  levelUpText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 15,
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
    color: '#1A1A1A',
    letterSpacing: -0.5,
  },
  subGreeting: {
    fontSize: 14,
    color: '#888888',
    marginTop: 2,
  },
  bellBtn: {
    position: 'relative',
    padding: 4,
  },
  bellIcon: { fontSize: 22 },
  bellDot: {
    position: 'absolute',
    top: 4, right: 4,
    width: 8, height: 8,
    borderRadius: 4,
    backgroundColor: '#D32F2F',
  },

  // Shared card base
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },

  // Verified donor card
  verifiedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FFF4',
    borderWidth: 1,
    borderColor: '#C8F0D4',
    gap: 12,
  },
  verifiedIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifiedIconText: {
    color: '#FFF',
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
    color: '#1A1A1A',
  },
  verifiedCheck: {
    color: '#4CAF50',
    fontWeight: '800',
    fontSize: 16,
  },
  verifiedSub: {
    fontSize: 12,
    color: '#666666',
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
    gap: 10,
  },
  calIcon: { fontSize: 20, marginTop: 2 },
  availTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  availStatus: {
    fontSize: 13,
    fontWeight: '600',
    color: '#D32F2F',
    marginTop: 2,
  },
  availStatusGreen: {
    color: '#4CAF50',
  },
  availSub: {
    fontSize: 12,
    color: '#888888',
    marginTop: 3,
  },
  availRight: {
    alignItems: 'center',
    gap: 4,
  },
  checkCircle: {
    color: '#4CAF50',
    fontWeight: '800',
    fontSize: 16,
  },

  // Blood type + level card
  bloodLevelRow: {
    marginBottom: 8,
  },
  bloodTypeLabel: {
    fontSize: 14,
    color: '#555555',
    fontWeight: '500',
  },
  bloodTypeValue: {
    color: '#D32F2F',
    fontWeight: '800',
    fontSize: 16,
  },
  levelLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 6,
  },

  // Stats
  statsRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statIcon: { fontSize: 22, marginBottom: 6 },
  statValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1A1A1A',
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: 12,
    color: '#888888',
    marginTop: 4,
    textAlign: 'center',
  },

  // Rewards card
  rewardsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
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
    backgroundColor: '#F59E0B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rewardsIcon: { fontSize: 22 },
  rewardsTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  rewardsSub: {
    fontSize: 12,
    color: '#666666',
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
    borderRadius: 50,
  },
  badgeGreen: { backgroundColor: '#D1FAE5' },
  badgeRed:   { backgroundColor: '#FEE2E2' },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  chevron: {
    fontSize: 22,
    color: '#AAAAAA',
    marginLeft: 8,
  },

  // Recent quests
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  questRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    gap: 8,
  },
  questDot: { color: '#D32F2F', fontSize: 16 },
  questText: { fontSize: 14, color: '#555555' },
  questType: { color: '#D32F2F', fontWeight: '700' },
  viewHistoryBtn: {
    marginTop: 14,
    alignItems: 'center',
  },
  viewHistoryText: {
    color: '#D32F2F',
    fontWeight: '600',
    fontSize: 14,
  },

  // Urgent requests card
  urgentCard: {
    backgroundColor: '#D32F2F',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
  },
  urgentLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 12,
  },
  urgentIcon: { fontSize: 22 },
  urgentTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  urgentTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  urgentBadge: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 50,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  urgentBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  urgentSub: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  urgentTypes: {
    flexDirection: 'row',
    gap: 8,
  },
  urgentTypeChip: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 50,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  urgentTypeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },

  // Demo button
  demoBtn: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
  },
  demoBtnText: {
    color: '#1A1A1A',
    fontWeight: '700',
    fontSize: 14,
  },
});
