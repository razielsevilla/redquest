import React, { useState, useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  View, Text, StyleSheet, ScrollView, StatusBar, 
  TouchableOpacity, Modal, Animated, ActivityIndicator 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS, RADIUS } from '../lib/theme';

const BADGES_DATA = [
  { id: '1', name: 'First Blood',  description: 'Completed your first donation.',    icon: 'water',        unlocked: true,  longDesc: 'Awarded to heroes who have successfully completed their first blood donation. This is where your journey of saving lives begins!' },
  { id: '2', name: 'Life Saver',   description: 'Saved 3 lives.',                    icon: 'shield-checkmark', unlocked: true,  longDesc: 'By donating three times, you have directly impacted the lives of 3 patients in need. You are a true guardian of the community.' },
  { id: '3', name: 'Speed Demon',  description: 'Accepted a quest within 5 minutes.', icon: 'flash',        unlocked: true,  longDesc: 'Recognized for your incredible responsiveness! You accepted an urgent quest in under 5 minutes, showing true dedication.' },
  { id: '4', name: 'Centurion',    description: 'Donated 10 times.',                 icon: 'trophy',       unlocked: false, longDesc: 'A prestigious title for those who have donated 10 times. Keep up the consistent effort to reach this milestone!' },
  { id: '5', name: 'Night Owl',    description: 'Completed a quest after midnight.', icon: 'moon',         unlocked: false, longDesc: 'For the rare few who answer the call in the dead of night. Complete an emergency quest between 12 AM and 5 AM to unlock.' },
];

const VOUCHERS_DATA = [
  { id: '1', title: 'Blood Test', store: "St. Luke's", cost: '500 pts', icon: 'flask', desc: 'Valid for one standard blood chemistry panel at any St. Lukes branch.' },
  { id: '2', title: 'Medical Discount', store: 'HealthWay', cost: '1200 pts', icon: 'medical', desc: 'Get 20% off on all outpatient services and consultations.' },
  { id: '3', title: 'Movie Pass', store: 'SM Cinema', cost: '1500 pts', icon: 'film', desc: 'One-time admission to any 2D movie at SM Cinema branches.' },
];

const unlocked = BADGES_DATA.filter(b => b.unlocked).length;

export default function Badges() {
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [selectedBadge, setSelectedBadge] = useState(null);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Success animation values
  const successScale = useRef(new Animated.Value(0)).current;
  const successOpacity = useRef(new Animated.Value(0)).current;

  const handleRedeem = () => {
    setIsRedeeming(true);
    setTimeout(() => {
      setIsRedeeming(false);
      setIsSuccess(true);
      Animated.parallel([
        Animated.spring(successScale, { toValue: 1, tension: 50, friction: 7, useNativeDriver: true }),
        Animated.timing(successOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
      ]).start();
    }, 1500);
  };

  const closeVoucherModal = () => {
    setSelectedVoucher(null);
    setIsSuccess(false);
    successScale.setValue(0);
    successOpacity.setValue(0);
  };

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      <View style={styles.header}>
        <Text style={styles.title}>Badges & Rewards</Text>
        <Text style={styles.subtitle}>{unlocked} of {BADGES_DATA.length} badges unlocked</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Progress bar */}
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Collection progress</Text>
            <Text style={styles.progressPct}>{Math.round((unlocked / BADGES_DATA.length) * 100)}%</Text>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${(unlocked / BADGES_DATA.length) * 100}%` }]} />
          </View>
        </View>

        {/* Vouchers Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Available Rewards</Text>
          <Text style={styles.pointsBalance}>2,350 RedQuest pts</Text>
        </View>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          snapToInterval={212}
          decelerationRate="fast"
          style={styles.voucherScroll} 
          contentContainerStyle={styles.voucherContainer}
        >
          {VOUCHERS_DATA.map((v) => (
            <TouchableOpacity 
              key={v.id} 
              style={styles.voucherCard}
              activeOpacity={0.8}
              onPress={() => setSelectedVoucher(v)}
            >
              <View style={styles.voucherLeft}>
                <Ionicons name={v.icon} size={24} color={COLORS.primary} />
              </View>
              <View style={styles.voucherRight}>
                <Text style={styles.voucherTitle}>{v.title}</Text>
                <Text style={styles.voucherStore}>{v.store}</Text>
                <View style={styles.costBadge}>
                  <Text style={styles.costText}>{v.cost}</Text>
                </View>
              </View>
              <View style={styles.cutoutTop} />
              <View style={styles.cutoutBottom} />
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={[styles.sectionTitle, { marginTop: 8, marginBottom: 16 }]}>Your Badges</Text>
        <View style={styles.grid}>
          {BADGES_DATA.map((badge) => (
            <TouchableOpacity
              key={badge.id}
              style={[styles.badgeCard, !badge.unlocked && styles.badgeCardLocked]}
              onPress={() => setSelectedBadge(badge)}
              activeOpacity={0.7}
            >
              <View style={[styles.iconWrap, !badge.unlocked && styles.iconWrapLocked]}>
                <Ionicons
                  name={badge.icon}
                  size={28}
                  color={badge.unlocked ? COLORS.primary : COLORS.textMuted}
                />
              </View>
              <Text style={[styles.badgeName, !badge.unlocked && styles.badgeNameLocked]} numberOfLines={1}>
                {badge.name}
              </Text>
              <Text style={styles.badgeDesc} numberOfLines={2}>{badge.description}</Text>
              {!badge.unlocked && (
                <View style={styles.lockedChip}>
                  <Ionicons name="lock-closed" size={10} color={COLORS.textMuted} />
                  <Text style={styles.lockedChipText}>Locked</Text>
                </View>
              )}
              {badge.unlocked && (
                <View style={styles.unlockedChip}>
                  <Ionicons name="checkmark-circle" size={12} color={COLORS.success} />
                  <Text style={styles.unlockedChipText}>Earned</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Reward Detail Modal */}
      <Modal visible={!!selectedVoucher} transparent animationType="fade" onRequestClose={closeVoucherModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {!isSuccess ? (
              <>
                <TouchableOpacity style={styles.closeBtn} onPress={closeVoucherModal} disabled={isRedeeming}>
                  <Ionicons name="close" size={24} color={COLORS.textMuted} />
                </TouchableOpacity>
                <View style={styles.modalHeader}>
                  <View style={styles.modalIconWrap}>
                    <Ionicons name={selectedVoucher?.icon} size={40} color={COLORS.primary} />
                  </View>
                  <Text style={styles.modalTitle}>{selectedVoucher?.title}</Text>
                  <Text style={styles.modalStore}>{selectedVoucher?.store}</Text>
                </View>
                <View style={styles.modalDivider} />
                <View style={styles.qrContainer}>
                  <View style={styles.qrPlaceholder}>
                    <Ionicons name="qr-code" size={140} color={COLORS.textPrimary} />
                  </View>
                  <Text style={styles.qrText}>Show this code to the counter</Text>
                </View>
                <Text style={styles.modalDesc}>{selectedVoucher?.desc}</Text>
                <TouchableOpacity 
                  style={[styles.redeemBtn, isRedeeming && styles.redeemBtnDisabled]} 
                  onPress={handleRedeem} 
                  disabled={isRedeeming}
                >
                  {isRedeeming ? <ActivityIndicator color={COLORS.white} /> : <Text style={styles.redeemBtnText}>Redeem for {selectedVoucher?.cost}</Text>}
                </TouchableOpacity>
              </>
            ) : (
              <View style={styles.successContainer}>
                <Animated.View style={[styles.successIconCircle, { transform: [{ scale: successScale }], opacity: successOpacity }]}>
                  <Ionicons name="checkmark" size={60} color={COLORS.white} />
                </Animated.View>
                <Animated.View style={{ opacity: successOpacity, alignItems: 'center' }}>
                  <Text style={styles.successTitle}>Reward Redeemed!</Text>
                  <Text style={styles.successSub}>You successfully claimed the {selectedVoucher?.title}. Check your email for details.</Text>
                  <TouchableOpacity style={styles.doneBtn} onPress={closeVoucherModal}><Text style={styles.doneBtnText}>Great!</Text></TouchableOpacity>
                </Animated.View>
              </View>
            )}
          </View>
        </View>
      </Modal>

      {/* Badge Detail Modal */}
      <Modal visible={!!selectedBadge} transparent animationType="fade" onRequestClose={() => setSelectedBadge(null)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { minHeight: 350 }]}>
            <TouchableOpacity style={styles.closeBtn} onPress={() => setSelectedBadge(null)}>
              <Ionicons name="close" size={24} color={COLORS.textMuted} />
            </TouchableOpacity>

            <View style={[styles.modalIconWrap, !selectedBadge?.unlocked && { backgroundColor: COLORS.background }]}>
              <Ionicons name={selectedBadge?.icon} size={48} color={selectedBadge?.unlocked ? COLORS.primary : COLORS.textMuted} />
            </View>
            
            <Text style={styles.modalTitle}>{selectedBadge?.name}</Text>
            <View style={[styles.statusPill, !selectedBadge?.unlocked && styles.statusPillLocked]}>
              <Ionicons name={selectedBadge?.unlocked ? "checkmark-circle" : "lock-closed"} size={14} color={selectedBadge?.unlocked ? COLORS.success : COLORS.textMuted} />
              <Text style={[styles.statusPillText, !selectedBadge?.unlocked && { color: COLORS.textMuted }]}>
                {selectedBadge?.unlocked ? "UNLOCKED" : "LOCKED"}
              </Text>
            </View>

            <View style={styles.modalDivider} />
            
            <Text style={styles.modalDesc}>{selectedBadge?.longDesc}</Text>
            
            {!selectedBadge?.unlocked && (
              <View style={styles.motivatorBox}>
                <Text style={styles.motivatorText}>Keep donating to unlock this achievement!</Text>
              </View>
            )}

            <TouchableOpacity style={styles.redeemBtn} onPress={() => setSelectedBadge(null)}>
              <Text style={styles.redeemBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background, paddingTop: 10 },
  header: { paddingHorizontal: 18, paddingTop: 24, paddingBottom: 10 },
  title: { fontSize: 24, fontWeight: '800', color: COLORS.textPrimary, letterSpacing: -0.5 },
  subtitle: { fontSize: 14, color: COLORS.textMuted, marginTop: 2 },
  scroll: { paddingHorizontal: 18, paddingBottom: 30 },

  progressCard: {
    backgroundColor: COLORS.surface, borderRadius: RADIUS.md, padding: 16,
    marginBottom: 24, ...SHADOWS.card,
  },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  progressLabel: { fontSize: 13, fontWeight: '600', color: COLORS.textSecondary },
  progressPct: { fontSize: 13, fontWeight: '800', color: COLORS.primary },
  progressTrack: { height: 8, backgroundColor: COLORS.border, borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: COLORS.primary, borderRadius: 4 },

  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: COLORS.textPrimary, letterSpacing: -0.3 },
  pointsBalance: { fontSize: 13, fontWeight: '700', color: COLORS.primary },

  voucherScroll: { marginHorizontal: -18, marginBottom: 24 },
  voucherContainer: { paddingHorizontal: 18, gap: 12 },
  voucherCard: {
    width: 200, height: 90, backgroundColor: COLORS.surface, borderRadius: RADIUS.md,
    flexDirection: 'row', alignItems: 'center', padding: 12, ...SHADOWS.card,
    position: 'relative', overflow: 'hidden',
  },
  voucherLeft: {
    width: 44, height: 44, borderRadius: 12, backgroundColor: COLORS.primarySurface,
    alignItems: 'center', justifyContent: 'center', marginRight: 12,
  },
  voucherRight: { flex: 1 },
  voucherTitle: { fontSize: 14, fontWeight: '700', color: COLORS.textPrimary },
  voucherStore: { fontSize: 11, color: COLORS.textMuted, marginTop: 2 },
  costBadge: {
    alignSelf: 'flex-start', backgroundColor: COLORS.primaryMuted, borderRadius: 4,
    paddingHorizontal: 6, paddingVertical: 2, marginTop: 6,
  },
  costText: { fontSize: 10, fontWeight: '800', color: COLORS.primary },
  cutoutTop: { position: 'absolute', top: -8, left: 52, width: 16, height: 16, borderRadius: 8, backgroundColor: COLORS.background },
  cutoutBottom: { position: 'absolute', bottom: -8, left: 52, width: 16, height: 16, borderRadius: 8, backgroundColor: COLORS.background },

  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  badgeCard: { width: '47%', backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, padding: 16, alignItems: 'center', ...SHADOWS.card },
  badgeCardLocked: { opacity: 0.6 },
  iconWrap: { width: 60, height: 60, borderRadius: 30, backgroundColor: COLORS.primarySurface, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  iconWrapLocked: { backgroundColor: COLORS.background },
  badgeName: { fontSize: 13, fontWeight: '800', color: COLORS.textPrimary, textAlign: 'center', marginBottom: 4 },
  badgeNameLocked: { color: COLORS.textMuted },
  badgeDesc: { fontSize: 11, color: COLORS.textMuted, textAlign: 'center', lineHeight: 16, marginBottom: 10 },
  unlockedChip: { backgroundColor: COLORS.successLight, borderRadius: 20, paddingVertical: 3, paddingHorizontal: 10, flexDirection: 'row', alignItems: 'center', gap: 4 },
  unlockedChipText: { fontSize: 11, fontWeight: '700', color: COLORS.success },
  lockedChip: { backgroundColor: COLORS.background, borderRadius: 20, paddingVertical: 3, paddingHorizontal: 10, flexDirection: 'row', alignItems: 'center', gap: 4 },
  lockedChipText: { fontSize: 11, fontWeight: '700', color: COLORS.textMuted },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', padding: 24 },
  modalContent: { width: '100%', backgroundColor: COLORS.surface, borderRadius: RADIUS.xl, padding: 24, ...SHADOWS.xl, alignItems: 'center', position: 'relative', minHeight: 400, justifyContent: 'center' },
  closeBtn: { position: 'absolute', top: 16, right: 16, padding: 8 },
  modalHeader: { alignItems: 'center', marginBottom: 20 },
  modalIconWrap: { width: 88, height: 88, borderRadius: 44, backgroundColor: COLORS.primarySurface, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  modalTitle: { fontSize: 22, fontWeight: '800', color: COLORS.textPrimary, textAlign: 'center' },
  modalStore: { fontSize: 14, color: COLORS.textMuted, marginTop: 4 },
  modalDivider: { width: '100%', height: 1, backgroundColor: COLORS.border, marginVertical: 20 },
  qrContainer: { alignItems: 'center', marginBottom: 24 },
  qrPlaceholder: { width: 180, height: 180, backgroundColor: COLORS.white, borderRadius: RADIUS.md, alignItems: 'center', justifyContent: 'center', ...SHADOWS.small, marginBottom: 12 },
  qrText: { fontSize: 12, color: COLORS.textMuted, fontWeight: '500' },
  modalDesc: { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 22, marginBottom: 24, paddingHorizontal: 10 },
  redeemBtn: { backgroundColor: COLORS.primary, width: '100%', borderRadius: RADIUS.md, paddingVertical: 15, alignItems: 'center', ...SHADOWS.button },
  redeemBtnDisabled: { backgroundColor: COLORS.primaryMuted },
  redeemBtnText: { color: COLORS.white, fontSize: 16, fontWeight: '700' },
  successContainer: { alignItems: 'center', justifyContent: 'center', width: '100%' },
  successIconCircle: { width: 100, height: 100, borderRadius: 50, backgroundColor: COLORS.success, alignItems: 'center', justifyContent: 'center', marginBottom: 24, ...SHADOWS.button },
  successTitle: { fontSize: 24, fontWeight: '800', color: COLORS.textPrimary, marginBottom: 12 },
  successSub: { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 20, marginBottom: 32 },
  doneBtn: { backgroundColor: COLORS.success, paddingHorizontal: 40, paddingVertical: 14, borderRadius: RADIUS.md, ...SHADOWS.small },
  doneBtnText: { color: COLORS.white, fontWeight: '700', fontSize: 16 },

  statusPill: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: COLORS.successLight, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, marginTop: 10 },
  statusPillLocked: { backgroundColor: COLORS.background },
  statusPillText: { fontSize: 11, fontWeight: '800', color: COLORS.success, letterSpacing: 0.5 },
  motivatorBox: { backgroundColor: COLORS.primarySurface, padding: 14, borderRadius: RADIUS.md, marginBottom: 24, width: '100%' },
  motivatorText: { fontSize: 13, color: COLORS.primary, fontWeight: '600', textAlign: 'center' },
});
