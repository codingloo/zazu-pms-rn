import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions,
} from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { Colors, FontSize, FontWeight, Spacing, Radius, Shadow } from '../../constants/theme';

const { width: SCREEN_W } = Dimensions.get('window');
export const SIDEBAR_W = Math.min(280, SCREEN_W * 0.78);

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: string;
  route: string;
  soon?: boolean;
  section?: string;
}

const NAV_ITEMS: NavItem[] = [
  // Overview
  { id: 'home',      label: 'Dashboard',  icon: '📊', route: '/',                section: 'Overview' },
  // Health
  { id: 'hlog',      label: 'Daily log',  icon: '✏️', route: '/health/log',      section: 'Health' },
  { id: 'htrends',   label: 'Trends',     icon: '📈', route: '/health/charts',   section: '' },
  { id: 'hhistory',  label: 'History',    icon: '📅', route: '/health/history',  section: '' },
  // Finance
  { id: 'foverview', label: 'Overview',   icon: '💳', route: '/finance',         section: 'Finance',     soon: true },
  { id: 'fbudget',   label: 'Budget',     icon: '🥧', route: '/finance/budget',  section: '',            soon: true },
  { id: 'fgoals',    label: 'Savings',    icon: '🐖', route: '/finance/savings', section: '',            soon: true },
  // Daily Plans
  { id: 'tasks',     label: 'Tasks',      icon: '✅', route: '/plans/tasks',     section: 'Daily Plans', soon: true },
  { id: 'habits',    label: 'Habits',     icon: '🔁', route: '/plans/habits',    section: '',            soon: true },
  { id: 'goals',     label: 'Goals',      icon: '🎯', route: '/plans/goals',     section: '',            soon: true },
  { id: 'journal',   label: 'Journal',    icon: '📓', route: '/plans/journal',   section: '',            soon: true },
  // More
  { id: 'settings',  label: 'Settings',   icon: '⚙️', route: '/settings',        section: 'More' },
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { theme } = useTheme();
  const { profile, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  function navigate(item: NavItem) {
    if (item.soon) return;
    onClose();
    setTimeout(() => router.push(item.route as any), 180);
  }

  function isActive(item: NavItem) {
    if (item.route === '/') return pathname === '/';
    return pathname.startsWith(item.route);
  }

  if (!isOpen) return null;

  return (
    <>
      {/* Dimmed overlay */}
      <TouchableOpacity
        style={[StyleSheet.absoluteFillObject, { backgroundColor: 'rgba(0,0,0,0.42)', zIndex: 98 }]}
        onPress={onClose}
        activeOpacity={1}
      />

      {/* Drawer panel */}
      <View style={[styles.drawer, {
        width: SIDEBAR_W,
        backgroundColor: theme.surface,
        borderRightColor: theme.border,
      }]}>

        {/* Profile header */}
        <View style={[styles.header, { borderBottomColor: theme.border }]}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{profile?.avatarInitials || '?'}</Text>
          </View>
          <Text style={[styles.profileName, { color: theme.text }]} numberOfLines={1}>
            {profile?.name || 'User'}
          </Text>
          <Text style={{ fontSize: FontSize.xs, color: theme.textSecondary }}>
            Personal Manager · v1.0
          </Text>
        </View>

        {/* Navigation */}
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          <View style={{ paddingVertical: Spacing.sm }}>
            {NAV_ITEMS.map((item) => {
              const active = isActive(item);
              return (
                <React.Fragment key={item.id}>
                  {/* Section label */}
                  {item.section !== undefined && item.section !== '' && (
                    <Text style={[styles.sectionLabel, { color: theme.textTertiary }]}>
                      {item.section}
                    </Text>
                  )}

                  {/* Nav row */}
                  <TouchableOpacity
                    onPress={() => navigate(item)}
                    activeOpacity={item.soon ? 1 : 0.7}
                    style={[
                      styles.navRow,
                      active && { backgroundColor: Colors.primaryLight },
                    ]}
                  >
                    <Text style={styles.navIcon}>{item.icon}</Text>
                    <Text style={[
                      styles.navLabel,
                      { color: item.soon ? theme.textTertiary : active ? Colors.primaryDark : theme.textSecondary },
                      active && { fontWeight: FontWeight.semibold },
                    ]}>
                      {item.label}
                    </Text>
                    {item.soon && (
                      <View style={[styles.soonPill, { backgroundColor: theme.surfaceAlt, borderColor: theme.border }]}>
                        <Text style={{ fontSize: 9, color: theme.textTertiary }}>soon</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                </React.Fragment>
              );
            })}
          </View>
        </ScrollView>

        {/* Lock footer */}
        <View style={[styles.footer, { borderTopColor: theme.border }]}>
          <TouchableOpacity
            onPress={() => { onClose(); setTimeout(logout, 200); }}
            style={styles.lockRow}
            activeOpacity={0.7}
          >
            <Text style={{ fontSize: 18 }}>🔒</Text>
            <Text style={{ fontSize: FontSize.sm, color: theme.textSecondary }}>Lock app</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  drawer: {
    position: 'absolute',
    top: 0, left: 0, bottom: 0,
    borderRightWidth: 0.5,
    flexDirection: 'column',
    zIndex: 99,
    ...Shadow.lg,
  },
  header: {
    padding: Spacing.lg,
    paddingTop: Spacing.xl,
    borderBottomWidth: 0.5,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.primaryLight,
    borderWidth: 2.5,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  avatarText: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.primaryDark,
  },
  profileName: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    marginBottom: 2,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: FontWeight.semibold,
    textTransform: 'uppercase',
    letterSpacing: 0.7,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: 5,
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginHorizontal: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
    borderRadius: Radius.md,
    marginBottom: 2,
  },
  navIcon: {
    fontSize: 18,
    width: 24,
    textAlign: 'center',
  },
  navLabel: {
    fontSize: FontSize.md,
    flex: 1,
  },
  soonPill: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: Radius.full,
    borderWidth: 0.5,
  },
  footer: {
    borderTopWidth: 0.5,
    padding: Spacing.md,
  },
  lockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    padding: Spacing.sm,
    borderRadius: Radius.md,
  },
});
