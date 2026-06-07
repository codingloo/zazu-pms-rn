import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, Switch } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { getLogCount } from '../db/database';
import { exportBackup, importBackup, getDbSize } from '../backup/cloudBackup';
import { Colors, FontSize, FontWeight, Spacing, Radius } from '../constants/theme';
import { Card, Button } from '../components/ui/UIComponents';
import AppShell from '../components/layout/AppShell';

export default function SettingsScreen() {
  const { theme, mode, setMode } = useTheme();
  const { profile, updateProfile, logout } = useAuth();
  const [dbSize, setDbSize] = useState('—');
  const [logCount, setLogCount] = useState(0);
  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);

  useFocusEffect(useCallback(() => {
    getDbSize().then(setDbSize);
    setLogCount(getLogCount());
  }, []));

  async function handleExport() {
    setExporting(true);
    const result = await exportBackup();
    setExporting(false);
    Alert.alert(result.success ? 'Backup ready ✓' : 'Backup failed', result.message);
  }

  async function handleImport() {
    Alert.alert('Restore backup', 'This will replace all current data. Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Restore', style: 'destructive',
        onPress: async () => {
          setImporting(true);
          const result = await importBackup();
          setImporting(false);
          Alert.alert(result.success ? 'Restored ✓' : 'Failed', result.message);
        },
      },
    ]);
  }

  const themeOptions: { label: string; val: 'light' | 'dark' | 'system' }[] = [
    { label: '☀️ Light', val: 'light' },
    { label: '💻 System', val: 'system' },
    { label: '🌙 Dark', val: 'dark' },
  ];

  function sectionStyle() {
    return {
      fontSize: 10 as const,
      fontWeight: '600' as const,
      color: theme.textSecondary,
      textTransform: 'uppercase' as const,
      letterSpacing: 0.6,
      marginBottom: 8,
    };
  }

  return (
    <AppShell title="Settings">
      <ScrollView contentContainerStyle={{ padding: Spacing.lg, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>

        {/* Profile */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.md, marginBottom: Spacing.xl }}>
          <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: Colors.primaryLight, borderWidth: 2.5, borderColor: Colors.primary, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: FontSize.xl, fontWeight: FontWeight.bold, color: Colors.primaryDark }}>
              {profile?.avatarInitials || '?'}
            </Text>
          </View>
          <View>
            <Text style={{ fontSize: FontSize.lg, fontWeight: FontWeight.semibold, color: theme.text }}>{profile?.name}</Text>
            <Text style={{ fontSize: FontSize.xs, color: theme.textSecondary }}>Personal Manager · v1.0</Text>
          </View>
        </View>

        {/* Goals */}
        <Text style={sectionStyle()}>Goals</Text>
        <Card style={{ marginBottom: Spacing.md }}>
          {[
            { label: '👟 Daily steps', val: `${profile?.stepGoal?.toLocaleString() || 8000} steps` },
            { label: '💧 Water goal',  val: `${profile?.waterGoal || 2.0} L` },
            { label: '😴 Sleep goal',  val: `${profile?.sleepGoal || 8} hrs` },
            { label: '⚖️ Weight goal', val: `${profile?.weightGoal || 70} kg` },
          ].map((g, i, arr) => (
            <View key={g.label} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: i < arr.length - 1 ? 0.5 : 0, borderBottomColor: theme.border }}>
              <Text style={{ fontSize: FontSize.md, color: theme.text }}>{g.label}</Text>
              <Text style={{ fontSize: FontSize.md, color: theme.textSecondary }}>{g.val}</Text>
            </View>
          ))}
        </Card>

        {/* Security */}
        <Text style={sectionStyle()}>Security</Text>
        <Card style={{ marginBottom: Spacing.md }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 0.5, borderBottomColor: theme.border }}>
            <View>
              <Text style={{ fontSize: FontSize.md, color: theme.text }}>4-digit PIN</Text>
              <Text style={{ fontSize: FontSize.xs, color: theme.textSecondary }}>{profile?.pinEnabled ? 'Enabled' : 'Disabled'}</Text>
            </View>
            <Switch
              value={profile?.pinEnabled || false}
              onValueChange={() => Alert.alert('Change PIN', 'Re-run onboarding to change your PIN.')}
              trackColor={{ false: theme.border, true: Colors.primaryLight }}
              thumbColor={profile?.pinEnabled ? Colors.primary : theme.textTertiary}
            />
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 }}>
            <View>
              <Text style={{ fontSize: FontSize.md, color: theme.text }}>Biometric unlock</Text>
              <Text style={{ fontSize: FontSize.xs, color: theme.textSecondary }}>Face ID / Fingerprint</Text>
            </View>
            <Switch
              value={profile?.biometricEnabled || false}
              onValueChange={async (val) => { if (profile) await updateProfile({ ...profile, biometricEnabled: val }); }}
              trackColor={{ false: theme.border, true: Colors.primaryLight }}
              thumbColor={profile?.biometricEnabled ? Colors.primary : theme.textTertiary}
            />
          </View>
        </Card>

        {/* Backup */}
        <Text style={sectionStyle()}>Data & Backup</Text>
        <Card style={{ marginBottom: Spacing.md }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.md }}>
            <View>
              <Text style={{ fontSize: FontSize.md, color: theme.text }}>Database size</Text>
              <Text style={{ fontSize: FontSize.xs, color: theme.textSecondary }}>Local SQLite · {logCount} logs</Text>
            </View>
            <Text style={{ fontSize: FontSize.sm, color: theme.textSecondary }}>{dbSize}</Text>
          </View>
          <Button label={exporting ? 'Sharing…' : '☁️ Export to Drive / iCloud'} onPress={handleExport} disabled={exporting} style={{ marginBottom: Spacing.sm }} />
          <Button label={importing ? 'Restoring…' : '📥 Import backup'} onPress={handleImport} variant="secondary" disabled={importing} />
        </Card>

        {/* Appearance */}
        <Text style={sectionStyle()}>Appearance</Text>
        <Card style={{ marginBottom: Spacing.xl }}>
          <Text style={{ fontSize: FontSize.sm, color: theme.textSecondary, marginBottom: Spacing.sm }}>Theme</Text>
          <View style={{ flexDirection: 'row', gap: 6 }}>
            {themeOptions.map(opt => (
              <TouchableOpacity
                key={opt.val}
                onPress={() => setMode(opt.val)}
                style={{
                  flex: 1, paddingVertical: 9, borderRadius: Radius.md, alignItems: 'center',
                  borderWidth: mode === opt.val ? 1.5 : 0.5,
                  borderColor: mode === opt.val ? Colors.primary : theme.border,
                  backgroundColor: mode === opt.val ? Colors.primaryLight : theme.surfaceAlt,
                }}
              >
                <Text style={{ fontSize: FontSize.sm, color: mode === opt.val ? Colors.primaryDark : theme.textSecondary }}>
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* Lock */}
        <TouchableOpacity
          onPress={logout}
          style={{ alignItems: 'center', paddingVertical: 12, borderRadius: Radius.md, borderWidth: 0.5, borderColor: Colors.danger }}
        >
          <Text style={{ fontSize: FontSize.md, color: Colors.danger, fontWeight: FontWeight.medium }}>🔒 Lock app</Text>
        </TouchableOpacity>
        <View style={{ height: 8 }} />
      </ScrollView>
    </AppShell>
  );
}
