import React, { useRef, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, StatusBar, Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS, RADIUS } from '../lib/theme';

export default function QuestComplete({ navigation, route }) {
  const stats = route.params?.stats || {};
  const quest = route.params?.quest || {};
  const user  = route.params?.user  || {};

  const donorName   = user.name      || 'Donor';
  const bloodType   = user.blood_type || quest.request_blood_type || 'O+';
  const donationDate = new Date().toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' });
  const newDonations = (user.donation_count || 0) + 1;
  const anims = useRef(
    Array.from({ length: 4 }, () => ({
      opacity: new Animated.Value(0),
      translateY: new Animated.Value(28),
    }))
  ).current;
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, { toValue: 1, tension: 60, friction: 7, useNativeDriver: true }).start();
    Animated.stagger(100,
      anims.map(({ opacity, translateY }) =>
        Animated.parallel([
          Animated.timing(opacity, { toValue: 1, duration: 400, useNativeDriver: true }),
          Animated.timing(translateY, { toValue: 0, duration: 400, useNativeDriver: true }),
        ])
      )
    ).start();
  }, []);

  const Fade = ({ i, children, style }) => (
    <Animated.View style={[style, {
      opacity: anims[i].opacity,
      transform: [{ translateY: anims[i].translateY }],
    }]}>{children}</Animated.View>
  );

  const CertRow = ({ label, value, valueRed }) => (
    <View style={styles.certRow}>
      <Text style={styles.certLabel}>{label}</Text>
      <Text style={[styles.certValue, valueRed && styles.certValueRed]}>{value}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Hero */}
        <Fade i={0} style={styles.heroSection}>
          <Animated.View style={[styles.heroCircle, { transform: [{ scale: scaleAnim }] }]}>
            <Ionicons name="heart" size={44} color={COLORS.white} />
          </Animated.View>
          <Text style={styles.heroTitle}>You Saved a Life!</Text>
          <Text style={styles.heroSub}>
            Your generous donation has made a real difference.{'\n'}Thank you for being a hero!
          </Text>
        </Fade>

        {/* Donation Certificate */}
        <Fade i={1}>
          <View style={styles.certCard}>
            <View style={styles.certIconWrap}>
              <Ionicons name="ribbon" size={28} color={COLORS.warning} />
            </View>
            <Text style={styles.certTitle}>Donation Certificate</Text>
            <Text style={styles.certDate}>{donationDate}</Text>
            <View style={styles.certDivider} />
            <CertRow label="Donor" value={donorName} />
            <CertRow label="Blood Type" value={`${bloodType} Positive`.replace('++', '+')} />
            <CertRow label="Donation #" value={`${newDonations}`} />
            <CertRow label="Hospital" value={quest.hospital_name || 'Blood Bank'} />
            <CertRow label="XP Earned" value={`+${stats.xp_gained || 200} XP`} valueRed />
          </View>
        </Fade>

        {/* Badge Unlocked */}
        {stats.leveled_up ? (
          <Fade i={2}>
            <View style={styles.badgeBanner}>
              <View style={styles.badgeIconWrap}>
                <Ionicons name="trophy" size={22} color={COLORS.white} />
              </View>
              <View style={styles.badgeInfo}>
                <Text style={styles.badgeTitle}>Level Up!</Text>
                <Text style={styles.badgeSub}>Congratulations! You are now Level {stats.new_level}.</Text>
              </View>
            </View>
          </Fade>
        ) : (
          <Fade i={2}>
            <View style={styles.badgeBanner}>
              <View style={[styles.badgeIconWrap, { backgroundColor: COLORS.success }]}>
                <Ionicons name="star" size={22} color={COLORS.white} />
              </View>
              <View style={styles.badgeInfo}>
                <Text style={styles.badgeTitle}>Heroic Effort</Text>
                <Text style={styles.badgeSub}>You're getting closer to your next level!</Text>
              </View>
            </View>
          </Fade>
        )}

        {/* Buttons */}
        <Fade i={3} style={styles.buttonsSection}>
          <TouchableOpacity style={styles.shareBtn} activeOpacity={0.85}>
            <Ionicons name="share-social-outline" size={18} color={COLORS.textPrimary} />
            <Text style={styles.shareBtnText}>Share your story</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.homeBtn}
            onPress={() => navigation.navigate('Donor')} activeOpacity={0.85}>
            <Ionicons name="home-outline" size={18} color={COLORS.white} />
            <Text style={styles.homeBtnText}>Back to Home</Text>
          </TouchableOpacity>
        </Fade>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },
  scroll: { paddingHorizontal: 14, paddingTop: 10, paddingBottom: 40 },

  heroSection: { alignItems: 'center', paddingVertical: 32 },
  heroCircle: {
    width: 100, height: 100, borderRadius: 50, backgroundColor: COLORS.success,
    alignItems: 'center', justifyContent: 'center', marginBottom: 20,
    shadowColor: COLORS.success, shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35, shadowRadius: 16, elevation: 10,
  },
  heroTitle: {
    fontSize: 24, fontWeight: '800', color: COLORS.textPrimary, letterSpacing: -0.5,
    marginBottom: 10, textAlign: 'center',
  },
  heroSub: { fontSize: 14, color: COLORS.textMuted, textAlign: 'center', lineHeight: 21, paddingHorizontal: 12 },

  certCard: {
    backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, padding: 20, width: '100%',
    marginBottom: 12, alignItems: 'center', ...SHADOWS.card, borderWidth: 1, borderColor: COLORS.border,
  },
  certIconWrap: { marginBottom: 8 },
  certTitle: { fontSize: 18, fontWeight: '800', color: COLORS.textPrimary, letterSpacing: -0.3, marginBottom: 4 },
  certDate: { fontSize: 13, color: COLORS.textMuted, marginBottom: 16 },
  certDivider: { width: '100%', height: 1, backgroundColor: COLORS.border, marginBottom: 16 },
  certRow: {
    flexDirection: 'row', justifyContent: 'space-between', width: '100%',
    paddingVertical: 9, borderBottomWidth: 1, borderBottomColor: COLORS.background,
  },
  certLabel: { fontSize: 14, color: COLORS.textMuted, fontWeight: '500' },
  certValue: { fontSize: 14, color: COLORS.textPrimary, fontWeight: '700' },
  certValueRed: { color: COLORS.primary },

  badgeBanner: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.warningLight,
    borderWidth: 1, borderColor: '#FDE68A', borderRadius: RADIUS.md, padding: 14,
    width: '100%', marginBottom: 20, gap: 12,
  },
  badgeIconWrap: {
    width: 44, height: 44, borderRadius: 12, backgroundColor: COLORS.warning,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  badgeInfo: { flex: 1 },
  badgeTitle: { fontSize: 14, fontWeight: '700', color: COLORS.textPrimary },
  badgeSub: { fontSize: 12, color: COLORS.textMuted, marginTop: 2 },

  buttonsSection: { width: '100%', gap: 10 },
  shareBtn: {
    backgroundColor: COLORS.surface, borderWidth: 1.5, borderColor: COLORS.inputBorder,
    borderRadius: RADIUS.full, paddingVertical: 14, alignItems: 'center', justifyContent: 'center',
    flexDirection: 'row', gap: 8,
  },
  shareBtnText: { color: COLORS.textPrimary, fontWeight: '700', fontSize: 15 },
  homeBtn: {
    backgroundColor: COLORS.primary, borderRadius: RADIUS.full, paddingVertical: 14,
    alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8, ...SHADOWS.button,
  },
  homeBtnText: { color: COLORS.white, fontWeight: '700', fontSize: 15, letterSpacing: 0.3 },
});
