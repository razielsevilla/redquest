import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Animated,
} from 'react-native';

export default function QuestComplete({ navigation }) {

  const anims = useRef(
    Array.from({ length: 4 }, () => ({
      opacity: new Animated.Value(0),
      translateY: new Animated.Value(28),
    }))
  ).current;

  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Pop in the hero circle first
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 60,
      friction: 7,
      useNativeDriver: true,
    }).start();

    // Then stagger the cards
    Animated.stagger(
      100,
      anims.map(({ opacity, translateY }) =>
        Animated.parallel([
          Animated.timing(opacity, { toValue: 1, duration: 400, useNativeDriver: true }),
          Animated.timing(translateY, { toValue: 0, duration: 400, useNativeDriver: true }),
        ])
      )
    ).start();
  }, []);

  const Fade = ({ i, children, style }) => (
    <Animated.View
      style={[style, {
        opacity: anims[i].opacity,
        transform: [{ translateY: anims[i].translateY }],
      }]}
    >
      {children}
    </Animated.View>
  );

  const CertRow = ({ label, value, valueRed }) => (
    <View style={styles.certRow}>
      <Text style={styles.certLabel}>{label}</Text>
      <Text style={[styles.certValue, valueRed && styles.certValueRed]}>{value}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor="#F7F7F7" />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* ── HERO ── */}
        <Fade i={0} style={styles.heroSection}>
          <Animated.View style={[styles.heroCircle, { transform: [{ scale: scaleAnim }] }]}>
            <Text style={styles.heroHeart}>♥</Text>
          </Animated.View>
          <Text style={styles.heroTitle}>🎉 You Saved a Life!</Text>
          <Text style={styles.heroSub}>
            Your generous donation has made a real difference.{'\n'}Thank you for being a hero!
          </Text>
        </Fade>

        {/* ── DONATION CERTIFICATE card ── */}
        <Fade i={1}>
          <View style={styles.certCard}>
            {/* Certificate icon */}
            <View style={styles.certIconWrap}>
              <Text style={styles.certIcon}>🏅</Text>
            </View>
            <Text style={styles.certTitle}>Donation Certificate</Text>
            <Text style={styles.certDate}>October 12, 2025</Text>

            <View style={styles.certDivider} />

            <CertRow label="Donor" value="Juan dela Cruz" />
            <CertRow label="Blood Type" value="O+ Positive" />
            <CertRow label="Hemoglobin" value="14.2 g/dL" />
            <CertRow label="Blood Pressure" value="120/80 mmHg" />
            <CertRow label="Total Donations" value="13" valueRed />
          </View>
        </Fade>

        {/* ── BADGE UNLOCKED banner ── */}
        <Fade i={2}>
          <View style={styles.badgeBanner}>
            <View style={styles.badgeIconWrap}>
              <Text style={styles.badgeIcon}>🏆</Text>
            </View>
            <View style={styles.badgeInfo}>
              <Text style={styles.badgeTitle}>New Badge Unlocked!</Text>
              <Text style={styles.badgeSub}>Life Saver · 10+ Donations</Text>
            </View>
          </View>
        </Fade>

        {/* ── BUTTONS ── */}
        <Fade i={3} style={styles.buttonsSection}>
          <TouchableOpacity style={styles.shareBtn} activeOpacity={0.85}>
            <Text style={styles.shareBtnText}>Share your story</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.homeBtn}
            onPress={() => navigation.navigate('Donor')}
            activeOpacity={0.85}
          >
            <Text style={styles.homeBtnText}>Back to Home</Text>
          </TouchableOpacity>
        </Fade>

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
  scroll: {
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 40,
  },

  // Hero
  heroSection: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  heroCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 10,
  },
  heroHeart: {
    color: '#FFFFFF',
    fontSize: 44,
    lineHeight: 52,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1A1A1A',
    letterSpacing: -0.5,
    marginBottom: 10,
    textAlign: 'center',
  },
  heroSub: {
    fontSize: 14,
    color: '#888888',
    textAlign: 'center',
    lineHeight: 21,
    paddingHorizontal: 12,
  },

  // Certificate card
  certCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  certIconWrap: {
    marginBottom: 8,
  },
  certIcon: { fontSize: 32 },
  certTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1A1A1A',
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  certDate: {
    fontSize: 13,
    color: '#AAAAAA',
    marginBottom: 16,
  },
  certDivider: {
    width: '100%',
    height: 1,
    backgroundColor: '#F0F0F0',
    marginBottom: 16,
  },
  certRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  certLabel: {
    fontSize: 14,
    color: '#888888',
    fontWeight: '500',
  },
  certValue: {
    fontSize: 14,
    color: '#1A1A1A',
    fontWeight: '700',
  },
  certValueRed: {
    color: '#D32F2F',
  },

  // Badge banner
  badgeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: 14,
    padding: 14,
    width: '100%',
    marginBottom: 20,
    gap: 12,
  },
  badgeIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F59E0B',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  badgeIcon: { fontSize: 22 },
  badgeInfo: { flex: 1 },
  badgeTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  badgeSub: {
    fontSize: 12,
    color: '#888888',
    marginTop: 2,
  },

  // Buttons
  buttonsSection: {
    width: '100%',
    gap: 10,
  },
  shareBtn: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    borderRadius: 50,
    paddingVertical: 14,
    alignItems: 'center',
  },
  shareBtnText: {
    color: '#1A1A1A',
    fontWeight: '700',
    fontSize: 15,
  },
  homeBtn: {
    backgroundColor: '#D32F2F',
    borderRadius: 50,
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: '#D32F2F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  homeBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
    letterSpacing: 0.3,
  },
});
