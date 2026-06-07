import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { Colors, FontSize, FontWeight, Spacing, Radius } from '../../constants/theme';
import { Card } from '../../components/ui/UIComponents';
import AppShell from '../../components/layout/AppShell';

const FEATURES = [
  { icon: '✅', title: 'Tasks', desc: 'To-dos with priorities & due dates' },
  { icon: '🔁', title: 'Habits', desc: 'Daily streaks and consistency' },
  { icon: '🎯', title: 'Goals', desc: 'Long-term goal tracking' },
  { icon: '📓', title: 'Journal', desc: 'Daily reflections & notes' },
];

export default function PlansScreen() {
  const { theme } = useTheme();
  return (
    <AppShell title="Daily Plans">
      <ScrollView contentContainerStyle={{ padding: Spacing.lg, paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        <View style={{ alignItems: 'center', paddingVertical: Spacing.xxxl }}>
          <View style={{ width: 72, height: 72, borderRadius: 20, backgroundColor: Colors.accentLight, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.lg }}>
            <Text style={{ fontSize: 36 }}>✅</Text>
          </View>
          <Text style={{ fontSize: 22, fontWeight: FontWeight.bold, color: theme.text, marginBottom: 8 }}>Daily Plans — coming soon</Text>
          <Text style={{ fontSize: FontSize.md, color: theme.textSecondary, textAlign: 'center', lineHeight: 22, maxWidth: 280 }}>
            Manage tasks, habits, goals and your personal journal — all in one place, stored privately on your device.
          </Text>
        </View>

        <Text style={{ fontSize: FontSize.xs, fontWeight: FontWeight.semibold, color: theme.textSecondary, textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: Spacing.sm }}>
          Planned features
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: Spacing.xl }}>
          {FEATURES.map(f => (
            <View key={f.title} style={{ width: '47%', backgroundColor: theme.surfaceAlt, borderRadius: Radius.md, padding: Spacing.md }}>
              <Text style={{ fontSize: 22, marginBottom: 6 }}>{f.icon}</Text>
              <Text style={{ fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: theme.text }}>{f.title}</Text>
              <Text style={{ fontSize: FontSize.xs, color: theme.textSecondary, marginTop: 2 }}>{f.desc}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </AppShell>
  );
}
