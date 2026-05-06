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

export default function QuestAccepted({ navigation }) {

  // Staggered entrance animations
  const anims = useRef(
    Array.from({ length: 5 }, () => ({
      opacity: new Animated.Value(0),
      translateY: new Animated.Value(28),
    }))
  ).current;

  // Pulse animation for the checkmark
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Stagger cards in
    Animated.stagger(
      90,
      anims.map(({ opacity, translateY }) =>
        Animated.parallel([
          Animated.timing(opacity, { toValue: 1, duration: 400, useNativeDriver: true }),
          Animated.timing(translateY, { toValue: 0, duration: 400, useNativeDriver: true }),
        ])
      )
    ).start();

    // Pulse the check icon
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.12, duration: 800, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1.00, duration: 800, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const Fade = ({ i, children, style }) => (
    <Animated.View
      style={[
        style,
        {
          opacity: anims[i].opacity,
          transform: [{ translateY: anims[i].translateY }],
        },
      ]}
    >
      {children}
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor="#F7F7F7" />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* ── HERO: Accepted badge ── */}
        <Fade i={0} style={styles.heroSection}>
          <Animated.View style={[styles.checkCircle, { transform: [{ scale: pulseAnim }] }]}>
            <Text style={styles.checkIcon}>✓</Text>
          </Animated.View>
          <Text style={styles.heroTitle}>Quest Accepted!</Text>
          <Text style={styles.heroSubtitle}>A rider has been dispatched to you.</Text>
        </Fade>

        {/* ── STATUS card ── */}
        <Fade i={1}>
          <View style={[styles.card, styles.statusCard]}>
            <View style={styles.statusDot} />
            <View style={styles.statusTextWrap}>
              <Text style={styles.statusTitle}>Rider En Route</Text>
              <Text style={styles.statusSub}>Your rider is on the way — please be ready outside.</Text>
            </View>
          </View>
        </Fade>

        {/* ── RIDER card ── */}
        <Fade i={2}>
          <View style={styles.card}>
            <Text style={styles.cardLabel}>Your Rider</Text>
            <View style={styles.riderRow}>
              <View style={styles.riderAvatar}>
                <Text style={styles.riderAvatarText}>🏍️</Text>
              </View>
              <View style={styles.riderInfo}>
                <Text style={styles.riderName}>Ramon Santos</Text>
                <Text style={styles.riderPlate}>Plate: ABC 1234</Text>
              </View>
              <View style={styles.etaBadge}>
                <Text style={styles.etaLabel}>ETA</Text>
                <Text style={styles.etaValue}>4 min</Text>
              </View>
            </View>
          </View>
        </Fade>

        {/* ── DESTINATION card ── */}
        <Fade i={3}>
          <View style={styles.card}>
            <Text style={styles.cardLabel}>Destination</Text>
            <View style={styles.destRow}>
              <Text style={styles.destIcon}>🏥</Text>
              <View style={styles.destInfo}>
                <Text style={styles.destName}>St. Luke's Medical Center</Text>
                <Text style={styles.destDetail}>BGC Blood Bank, Floor 2</Text>
                <View style={styles.distRow}>
                  <Text style={styles.distIcon}>📍</Text>
                  <Text style={styles.distText}>1.3 km from you</Text>
                </View>
              </View>
            </View>
          </View>
        </Fade>

        {/* ── QUEST DETAILS card ── */}
        <Fade i={4}>
          <View style={styles.card}>
            <Text style={styles.cardLabel}>Quest Details</Text>
            <View style={styles.questDetailsRow}>
              <View style={styles.questDetailChip}>
                <Text style={styles.questDetailKey}>Blood Type</Text>
                <Text style={styles.questDetailVal}>O+</Text>
              </View>
              <View style={styles.questDetailChip}>
                <Text style={styles.questDetailKey}>Units</Text>
                <Text style={styles.questDetailVal}>2</Text>
              </View>
              <View style={styles.questDetailChip}>
                <Text style={styles.questDetailKey}>Priority</Text>
                <Text style={[styles.questDetailVal, { color: '#D32F2F' }]}>High</Text>
              </View>
            </View>
            <View style={styles.infoNote}>
              <Text style={styles.infoNoteText}>
                🚗 Transport is covered. A rider will pick you up.
              </Text>
            </View>
          </View>
        </Fade>

        {/* ── DEMO button ── */}
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => navigation.navigate('RiderEnRoute')}
          activeOpacity={0.85}
        >
          <Text style={styles.primaryBtnText}>Demo: Rider Arrives →</Text>
        </TouchableOpacity>

        {/* ── Cancel link ── */}
        <TouchableOpacity
          style={styles.cancelBtn}
          onPress={() => navigation.navigate('Donor')}
          activeOpacity={0.7}
        >
          <Text style={styles.cancelText}>Can't make it? Cancel</Text>
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
  scroll: {
    padding: 20,
    paddingBottom: 40,
  },

  // Hero section
  heroSection: {
    alignItems: 'center',
    paddingVertical: 28,
  },
  checkCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#D32F2F',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#D32F2F',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 8,
  },
  checkIcon: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: '800',
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1A1A1A',
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  heroSubtitle: {
    fontSize: 14,
    color: '#888888',
    textAlign: 'center',
  },

  // Shared card
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
  cardLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#AAAAAA',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 12,
  },

  // Status card
  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FFF4',
    borderWidth: 1,
    borderColor: '#C8F0D4',
    gap: 12,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CAF50',
  },
  statusTextWrap: { flex: 1 },
  statusTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  statusSub: {
    fontSize: 12,
    color: '#555555',
    marginTop: 2,
    lineHeight: 17,
  },

  // Rider card
  riderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  riderAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  riderAvatarText: { fontSize: 26 },
  riderInfo: { flex: 1 },
  riderName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  riderPlate: {
    fontSize: 13,
    color: '#888888',
    marginTop: 2,
  },
  etaBadge: {
    backgroundColor: '#FFF3E0',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 14,
    alignItems: 'center',
  },
  etaLabel: {
    fontSize: 10,
    color: '#F59E0B',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  etaValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#F59E0B',
    marginTop: 2,
  },

  // Destination card
  destRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  destIcon: { fontSize: 26, marginTop: 2 },
  destInfo: { flex: 1 },
  destName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  destDetail: {
    fontSize: 13,
    color: '#888888',
    marginTop: 3,
  },
  distRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
  },
  distIcon: { fontSize: 13 },
  distText: {
    fontSize: 13,
    color: '#D32F2F',
    fontWeight: '600',
  },

  // Quest details
  questDetailsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  questDetailChip: {
    flex: 1,
    backgroundColor: '#F7F7F7',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
  },
  questDetailKey: {
    fontSize: 11,
    color: '#AAAAAA',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  questDetailVal: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  infoNote: {
    backgroundColor: '#FFF8E1',
    borderRadius: 8,
    padding: 10,
  },
  infoNoteText: {
    fontSize: 13,
    color: '#555555',
    lineHeight: 18,
  },

  // Buttons
  primaryBtn: {
    backgroundColor: '#D32F2F',
    borderRadius: 50,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 12,
    shadowColor: '#D32F2F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  cancelBtn: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  cancelText: {
    color: '#AAAAAA',
    fontSize: 14,
    fontWeight: '600',
  },
});
