import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  SafeAreaView, StatusBar, Platform,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { Colors, FontSize, FontWeight, Spacing, Radius, Shadow } from '../../constants/theme';
import Sidebar from './Sidebar';

interface AppShellProps {
  title: string;
  children: React.ReactNode;
  /** Optional right-side element in the top bar */
  headerRight?: React.ReactNode;
  /** Hide default avatar in top bar */
  hideAvatar?: boolean;
}

export default function AppShell({ title, children, headerRight, hideAvatar }: AppShellProps) {
  const { theme, isDark } = useTheme();
  const { profile } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: theme.bg }]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.surface}
      />

      {/* Top bar */}
      <View style={[styles.topbar, {
        backgroundColor: theme.surface,
        borderBottomColor: theme.border,
      }]}>
        {/* Hamburger */}
        <TouchableOpacity
          onPress={() => setSidebarOpen(true)}
          style={[styles.menuBtn, { backgroundColor: theme.surfaceAlt, borderColor: theme.border }]}
          activeOpacity={0.7}
          accessibilityLabel="Open navigation menu"
        >
          <MenuIcon color={theme.text} />
        </TouchableOpacity>

        {/* Title */}
        <Text style={[styles.topbarTitle, { color: theme.text }]} numberOfLines={1}>
          {title}
        </Text>

        {/* Right side */}
        {headerRight ? (
          headerRight
        ) : !hideAvatar && (
          <View style={styles.avatarSmall}>
            <Text style={styles.avatarSmallText}>{profile?.avatarInitials || '?'}</Text>
          </View>
        )}
      </View>

      {/* Content + Sidebar overlay */}
      <View style={{ flex: 1, position: 'relative' }}>
        <View style={{ flex: 1 }}>
          {children}
        </View>
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      </View>
    </SafeAreaView>
  );
}

function MenuIcon({ color }: { color: string }) {
  return (
    <View style={{ gap: 4, padding: 2 }}>
      {[0, 1, 2].map(i => (
        <View key={i} style={{ width: 16, height: 1.5, backgroundColor: color, borderRadius: 1 }} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  topbar: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
    borderBottomWidth: 0.5,
    ...Shadow.sm,
  },
  menuBtn: {
    width: 36,
    height: 36,
    borderRadius: Radius.md,
    borderWidth: 0.5,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  topbarTitle: {
    flex: 1,
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
  },
  avatarSmall: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primaryLight,
    borderWidth: 2,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  avatarSmallText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Colors.primaryDark,
  },
});
