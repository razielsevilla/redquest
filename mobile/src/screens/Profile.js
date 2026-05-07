import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as storage from '../lib/storage';
import { COLORS, SHADOWS, RADIUS } from '../lib/theme';

const MENU_ITEMS = [
  { icon: 'notifications-outline', label: 'Notifications',       chevron: true },
  { icon: 'lock-closed-outline',   label: 'Privacy and Security', chevron: true },
  { icon: 'help-circle-outline',   label: 'Help and Support',     chevron: true },
];

export default function Profile({ navigation }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    (async () => {
      const userStr = await storage.getItem('redquest.authUser');
      if (userStr) setUser(JSON.parse(userStr));
    })();
  }, []);

  const handleLogout = async () => {
    await storage.deleteItem('redquest.authToken');
    await storage.deleteItem('redquest.authEmail');
    await storage.deleteItem('redquest.authRole');
    await storage.deleteItem('redquest.authUser');
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  };

  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : 'U';

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Avatar */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <Text style={styles.userName}>{user?.name || 'User Name'}</Text>
          <View style={styles.rolePill}>
            <Ionicons
              name={user?.role === 'hospital_staff' ? 'medkit' : user?.role === 'requester' ? 'people' : 'water'}
              size={12}
              color={COLORS.primary}
            />
            <Text style={styles.rolePillText}>
              {user?.role ? user.role.replace('_', ' ').toUpperCase() : 'DONOR'}
            </Text>
          </View>
        </View>

        {/* Account Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Details</Text>
          <View style={styles.card}>
            <View style={styles.infoRow}>
              <View style={styles.infoIconWrap}>
                <Ionicons name="mail-outline" size={16} color={COLORS.primary} />
              </View>
              <View style={styles.infoBody}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>{user?.email || 'user@example.com'}</Text>
              </View>
            </View>

            <View style={[styles.infoRow, styles.infoRowBorder]}>
              <View style={styles.infoIconWrap}>
                <Ionicons name="call-outline" size={16} color={COLORS.primary} />
              </View>
              <View style={styles.infoBody}>
                <Text style={styles.infoLabel}>Phone</Text>
                <Text style={styles.infoValue}>{user?.phone || '+63 917 000 0000'}</Text>
              </View>
            </View>

            {user?.role === 'donor' && (
              <View style={[styles.infoRow, styles.infoRowBorder]}>
                <View style={styles.infoIconWrap}>
                  <Ionicons name="water-outline" size={16} color={COLORS.primary} />
                </View>
                <View style={styles.infoBody}>
                  <Text style={styles.infoLabel}>Blood Type</Text>
                  <Text style={[styles.infoValue, { color: COLORS.primary, fontWeight: '800' }]}>
                    {user?.blood_type || 'O+'}
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={styles.card}>
            {MENU_ITEMS.map((item, idx) => (
              <TouchableOpacity
                key={item.label}
                style={[styles.menuItem, idx > 0 && styles.menuItemBorder]}
                activeOpacity={0.7}
              >
                <View style={styles.menuLeft}>
                  <View style={styles.menuIconWrap}>
                    <Ionicons name={item.icon} size={18} color={COLORS.textSecondary} />
                  </View>
                  <Text style={styles.menuLabel}>{item.label}</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.85}>
          <Ionicons name="log-out-outline" size={18} color={COLORS.primary} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },
  scroll: { paddingHorizontal: 18, paddingTop: 6, paddingBottom: 40 },

  avatarSection: { alignItems: 'center', paddingVertical: 28 },
  avatarCircle: {
    width: 88, height: 88, borderRadius: 44, backgroundColor: COLORS.primary,
    alignItems: 'center', justifyContent: 'center', marginBottom: 14, ...SHADOWS.button,
  },
  avatarText: { fontSize: 32, fontWeight: '800', color: COLORS.white },
  userName: { fontSize: 20, fontWeight: '800', color: COLORS.textPrimary, letterSpacing: -0.3, marginBottom: 8 },
  rolePill: {
    backgroundColor: COLORS.primarySurface, borderRadius: 20, paddingVertical: 4,
    paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', gap: 6,
  },
  rolePillText: { fontSize: 11, fontWeight: '700', color: COLORS.primary, letterSpacing: 0.5 },

  section: { marginBottom: 18 },
  sectionTitle: {
    fontSize: 13, fontWeight: '700', color: COLORS.textMuted, marginBottom: 10,
    letterSpacing: 0.3, textTransform: 'uppercase',
  },
  card: { backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, overflow: 'hidden', ...SHADOWS.card },

  infoRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 16, gap: 12 },
  infoRowBorder: { borderTopWidth: 1, borderTopColor: COLORS.border },
  infoIconWrap: {
    width: 32, height: 32, borderRadius: 8, backgroundColor: COLORS.primarySurface,
    alignItems: 'center', justifyContent: 'center',
  },
  infoBody: { flex: 1 },
  infoLabel: { fontSize: 11, color: COLORS.textMuted, fontWeight: '600', marginBottom: 2 },
  infoValue: { fontSize: 14, color: COLORS.textPrimary, fontWeight: '600' },

  menuItem: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: 15, paddingHorizontal: 16,
  },
  menuItemBorder: { borderTopWidth: 1, borderTopColor: COLORS.border },
  menuLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  menuIconWrap: {
    width: 32, height: 32, borderRadius: 8, backgroundColor: COLORS.background,
    alignItems: 'center', justifyContent: 'center',
  },
  menuLabel: { fontSize: 15, color: COLORS.textPrimary, fontWeight: '500' },

  logoutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: COLORS.surface, borderRadius: RADIUS.md, paddingVertical: 15,
    borderWidth: 1.5, borderColor: COLORS.primaryMuted, ...SHADOWS.small,
  },
  logoutText: { color: COLORS.primary, fontWeight: '700', fontSize: 15 },
});
