import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, SafeAreaView, StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as storage from '../lib/storage';

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
      <StatusBar barStyle="dark-content" backgroundColor="#F5F5F7" />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* ── Avatar ── */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <Text style={styles.userName}>{user?.name || 'User Name'}</Text>
          <View style={styles.rolePill}>
            <Text style={styles.rolePillText}>
              {user?.role ? user.role.replace('_', ' ').toUpperCase() : 'DONOR'}
            </Text>
          </View>
        </View>

        {/* ── Account Details ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Details</Text>
          <View style={styles.card}>
            <View style={styles.infoRow}>
              <View style={styles.infoIconWrap}>
                <Ionicons name="mail-outline" size={16} color="#D32F2F" />
              </View>
              <View style={styles.infoBody}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>{user?.email || 'user@example.com'}</Text>
              </View>
            </View>

            <View style={[styles.infoRow, styles.infoRowBorder]}>
              <View style={styles.infoIconWrap}>
                <Ionicons name="call-outline" size={16} color="#D32F2F" />
              </View>
              <View style={styles.infoBody}>
                <Text style={styles.infoLabel}>Phone</Text>
                <Text style={styles.infoValue}>{user?.phone || '+63 917 000 0000'}</Text>
              </View>
            </View>

            {user?.role === 'donor' && (
              <View style={[styles.infoRow, styles.infoRowBorder]}>
                <View style={styles.infoIconWrap}>
                  <Ionicons name="water-outline" size={16} color="#D32F2F" />
                </View>
                <View style={styles.infoBody}>
                  <Text style={styles.infoLabel}>Blood Type</Text>
                  <Text style={[styles.infoValue, { color: '#D32F2F', fontWeight: '800' }]}>
                    {user?.blood_type || 'O+'}
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* ── Preferences ── */}
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
                    <Ionicons name={item.icon} size={18} color="#555555" />
                  </View>
                  <Text style={styles.menuLabel}>{item.label}</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#CCCCCC" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ── Logout ── */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.85}>
          <Ionicons name="log-out-outline" size={18} color="#D32F2F" />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F5F5F7',
  },
  scroll: {
    paddingHorizontal: 18,
    paddingBottom: 40,
  },

  // Avatar section
  avatarSection: {
    alignItems: 'center',
    paddingVertical: 28,
  },
  avatarCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#D32F2F',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    shadowColor: '#D32F2F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  userName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1A1A1A',
    letterSpacing: -0.3,
    marginBottom: 8,
  },
  rolePill: {
    backgroundColor: '#FEF2F2',
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 14,
  },
  rolePillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#D32F2F',
    letterSpacing: 0.5,
  },

  // Section
  section: {
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#888888',
    marginBottom: 10,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },

  // Info rows
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 12,
  },
  infoRowBorder: {
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  infoIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoBody: { flex: 1 },
  infoLabel: {
    fontSize: 11,
    color: '#AAAAAA',
    fontWeight: '600',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    color: '#1A1A1A',
    fontWeight: '600',
  },

  // Menu items
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 16,
  },
  menuItemBorder: {
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuLabel: {
    fontSize: 15,
    color: '#1A1A1A',
    fontWeight: '500',
  },

  // Logout
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 15,
    borderWidth: 1.5,
    borderColor: '#FECACA',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  logoutText: {
    color: '#D32F2F',
    fontWeight: '700',
    fontSize: 15,
  },
});
