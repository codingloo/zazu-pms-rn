import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { Colors, FontSize, FontWeight, Spacing, Radius } from '../../constants/theme';
import { Card } from '../../components/ui/UIComponents';
import AppShell from '../../components/layout/AppShell';

const FEATURES = [
  { icon: '🧾', title: 'Expense tracking', desc: 'Log daily spending by category' },
  { icon: '🥧', title: 'Budget planner', desc: 'Set monthly limits per category' },
  { icon: '🐖', title: 'Savings goals', desc: 'Track progress toward targets' },
  { icon: '📊', title: 'Monthly reports', desc: 'Income vs expenses overview' },
  { icon: '💳', title: 'Accounts', desc: 'Cash, bank, cards in one place' },
  { icon: '📥', title: 'Import CSV', desc: 'Import from your bank export' },
];

export default function FinanceScreen() {
  const { theme } = useTheme();
  return (
    <AppShell title="Finance">
      <ScrollView contentContainerStyle={{ padding: Spacing.lg, paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        <View style={{ alignItems: 'center', paddingVertical: Spacing.xxxl }}>
          <View style={{ width: 72, height: 72, borderRadius: 20, backgroundColor: Colors.infoLight, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.lg }}>
            <Text style={{ fontSize: 36 }}>💳</Text>
          </View>
          <Text style={{ fontSize: 22, fontWeight: FontWeight.bold, color: theme.text, marginBottom: 8 }}>Finance — coming soon</Text>
          <Text style={{ fontSize: FontSize.md, color: theme.textSecondary, textAlign: 'center', lineHeight: 22, maxWidth: 280 }}>
            Track income, expenses, and savings — all stored privately on your device, just like your health data.
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

        <Card style={{ padding: Spacing.lg }}>
          <Text style={{ fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: theme.text, marginBottom: 4 }}>
            Same architecture as health
          </Text>
          <Text style={{ fontSize: FontSize.xs, color: theme.textSecondary, lineHeight: 18 }}>
            Finance data will be stored in the same local SQLite database on your device. You'll be able to back it up to Google Drive or iCloud alongside your health data.
          </Text>
        </Card>
      </ScrollView>
    </AppShell>
  );
}
