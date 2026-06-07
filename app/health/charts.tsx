import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';
import { getRecentLogs, getWeeklyStats } from '../../db/database';
import { DailyHealthLog } from '../../constants/types';
import { Colors, FontSize, FontWeight, Spacing, Radius } from '../../constants/theme';
import { Card } from '../../components/ui/UIComponents';
import AppShell from '../../components/layout/AppShell';
import { format } from 'date-fns';

const DAYS = [7, 14, 30];

export default function ChartsScreen() {
  const { theme } = useTheme();
  const [range, setRange] = useState(7);
  const [logs, setLogs] = useState<DailyHealthLog[]>([]);
  const [stats, setStats] = useState<any>(null);

  useFocusEffect(useCallback(() => {
    setLogs(getRecentLogs(range));
    setStats(getWeeklyStats(range));
  }, [range]));

  const headerRight = (
    <View style={{ flexDirection: 'row', gap: 4 }}>
      {DAYS.map(d => (
        <TouchableOpacity
          key={d}
          onPress={() => setRange(d)}
          style={{
            paddingHorizontal: 10, paddingVertical: 4, borderRadius: Radius.full,
            backgroundColor: range === d ? Colors.primary : theme.surfaceAlt,
            borderWidth: 0.5, borderColor: range === d ? Colors.primary : theme.border,
          }}
        >
          <Text style={{ fontSize: FontSize.xs, fontWeight: FontWeight.semibold, color: range === d ? '#fff' : theme.textSecondary }}>
            {d}d
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <AppShell title="Trends" headerRight={headerRight} hideAvatar>
      <ScrollView contentContainerStyle={{ padding: Spacing.lg, paddingBottom: 32 }} showsVerticalScrollIndicator={false}>

        {/* Summary metrics */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: Spacing.lg }}>
          {[
            { icon: '👟', label: 'Avg steps', value: stats ? stats.avgSteps.toLocaleString() : '—', trend: '↑ 12%', up: true },
            { icon: '😴', label: 'Avg sleep', value: stats ? `${stats.avgSleep.toFixed(1)}h` : '—', trend: '↓ 0.4h', up: false },
            { icon: '💧', label: 'Avg water', value: stats ? `${stats.avgWater.toFixed(1)}L` : '—', trend: '↑ 0.3L', up: true },
            { icon: '🏋️', label: 'Workouts', value: stats ? `${stats.workoutDays}/${stats.totalDays}d` : '—', trend: '↑ +1', up: true },
            { icon: '⚖️', label: 'Weight', value: stats?.latestWeight > 0 ? `${stats.latestWeight}kg` : '—', trend: '↓ 0.6kg', up: true },
            { icon: '😊', label: 'Avg mood', value: stats ? `${stats.avgMood.toFixed(1)}/5` : '—', trend: '↑ 0.4', up: true },
          ].map(m => (
            <View key={m.label} style={{ flex: 1, minWidth: 100, backgroundColor: theme.surfaceAlt, borderRadius: Radius.md, padding: Spacing.md }}>
              <Text style={{ fontSize: 16, marginBottom: 4 }}>{m.icon}</Text>
              <Text style={{ fontSize: FontSize.xs, color: theme.textSecondary, marginBottom: 4 }}>{m.label}</Text>
              <Text style={{ fontSize: FontSize.xl, fontWeight: FontWeight.bold, color: theme.text }}>{m.value}</Text>
              <Text style={{ fontSize: FontSize.xs, color: m.up ? Colors.primaryDark : Colors.danger, marginTop: 2 }}>{m.trend}</Text>
            </View>
          ))}
        </View>

        {/* Steps mini chart */}
        <Card style={{ marginBottom: Spacing.md }}>
          <Text style={{ fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: theme.textSecondary, marginBottom: Spacing.md }}>
            👟 Steps per day
          </Text>
          <MiniBarChart logs={logs} field="stepsCount" color={Colors.primary} maxHint={12000} theme={theme} />
        </Card>

        {/* Sleep chart */}
        <Card style={{ marginBottom: Spacing.md }}>
          <Text style={{ fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: theme.textSecondary, marginBottom: Spacing.md }}>
            🌙 Sleep hours
          </Text>
          <MiniBarChart logs={logs} field="sleepHours" color="#7F77DD" maxHint={10} goalLine={7} theme={theme} />
        </Card>

        {/* Water chart */}
        <Card style={{ marginBottom: Spacing.md }}>
          <Text style={{ fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: theme.textSecondary, marginBottom: Spacing.md }}>
            💧 Water intake (L)
          </Text>
          <MiniBarChart logs={logs} field="waterIntakeLiters" color={Colors.info} maxHint={3} goalLine={2} theme={theme} />
        </Card>

        {/* Meal consistency */}
        <Card style={{ marginBottom: Spacing.md }}>
          <Text style={{ fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: theme.textSecondary, marginBottom: Spacing.md }}>
            🥗 Meal consistency
          </Text>
          <MealChart logs={logs} theme={theme} />
        </Card>

        {/* Mood chart */}
        <Card style={{ marginBottom: Spacing.md }}>
          <Text style={{ fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: theme.textSecondary, marginBottom: Spacing.md }}>
            😊 Mood
          </Text>
          <MoodChart logs={logs} theme={theme} />
        </Card>

        {/* Insights */}
        <Text style={{ fontSize: FontSize.xs, fontWeight: FontWeight.semibold, color: theme.textSecondary, textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: Spacing.sm }}>
          Insights
        </Text>
        <Card style={{ gap: Spacing.md }}>
          {[
            { icon: '📈', bg: Colors.primaryLight, title: 'Steps goal close', body: `Avg ${stats?.avgSteps?.toLocaleString() || '—'} steps. Just a little more to hit your goal!` },
            { icon: '🌙', bg: Colors.accentLight, title: stats && stats.avgSleep < 7 ? 'Sleep needs work' : 'Sleep on track', body: `${stats?.avgSleep?.toFixed(1) || '—'}h avg. Target is 7–9h per night.` },
            { icon: '💧', bg: Colors.infoLight, title: 'Hydration', body: `${stats?.avgWater?.toFixed(1) || '—'}L daily average. Keep it up!` },
          ].map(ins => (
            <View key={ins.title} style={{ flexDirection: 'row', gap: Spacing.md, alignItems: 'flex-start' }}>
              <View style={{ width: 32, height: 32, borderRadius: Radius.sm, backgroundColor: ins.bg, alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Text style={{ fontSize: 16 }}>{ins.icon}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: theme.text, marginBottom: 2 }}>{ins.title}</Text>
                <Text style={{ fontSize: FontSize.xs, color: theme.textSecondary, lineHeight: 17 }}>{ins.body}</Text>
              </View>
            </View>
          ))}
        </Card>
        <View style={{ height: 8 }} />
      </ScrollView>
    </AppShell>
  );
}

// Pure RN bar chart — no external library needed
function MiniBarChart({ logs, field, color, maxHint, goalLine, theme }: any) {
  if (logs.length === 0) return <Text style={{ fontSize: FontSize.sm, color: theme.textSecondary }}>No data yet</Text>;
  const values = logs.map((l: any) => l[field] as number);
  const max = Math.max(...values, maxHint || 0) || 1;
  const BAR_H = 80;

  return (
    <View>
      <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 3, height: BAR_H }}>
        {values.map((v: number, i: number) => (
          <View key={i} style={{ flex: 1, height: BAR_H, justifyContent: 'flex-end' }}>
            <View style={{ height: Math.max(3, (v / max) * BAR_H), backgroundColor: color, borderRadius: 3 }} />
          </View>
        ))}
      </View>
      {goalLine && (
        <View style={{
          position: 'absolute', left: 0, right: 0,
          bottom: (goalLine / max) * BAR_H,
          height: 1, backgroundColor: Colors.primary + '55',
          borderStyle: 'dashed',
        }} />
      )}
      <View style={{ flexDirection: 'row', marginTop: 6, gap: 3 }}>
        {logs.map((l: DailyHealthLog, i: number) => (
          <Text key={i} style={{ flex: 1, fontSize: 8, color: theme.textTertiary, textAlign: 'center' }} numberOfLines={1}>
            {format(new Date(l.date + 'T12:00:00'), 'dd')}
          </Text>
        ))}
      </View>
    </View>
  );
}

function MealChart({ logs, theme }: any) {
  if (logs.length === 0) return <Text style={{ fontSize: FontSize.sm, color: theme.textSecondary }}>No data yet</Text>;
  return (
    <View>
      <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 3, height: 60 }}>
        {logs.map((l: DailyHealthLog, i: number) => {
          const meals = [l.isBreakfastTaken, l.isLunchTaken, l.isDinnerTaken].filter(Boolean).length;
          return (
            <View key={i} style={{ flex: 1, height: 60, justifyContent: 'flex-end', gap: 2 }}>
              {meals >= 3 && <View style={{ flex: 1, backgroundColor: Colors.primaryDeep, borderRadius: 2 }} />}
              {meals >= 2 && <View style={{ flex: 1, backgroundColor: Colors.primary, borderRadius: 2 }} />}
              {meals >= 1 && <View style={{ flex: 1, backgroundColor: Colors.primaryLight, borderRadius: 2, borderWidth: 0.5, borderColor: Colors.primary }} />}
            </View>
          );
        })}
      </View>
      <View style={{ flexDirection: 'row', marginTop: 6, gap: 3 }}>
        {logs.map((l: DailyHealthLog, i: number) => (
          <Text key={i} style={{ flex: 1, fontSize: 8, color: theme.textTertiary, textAlign: 'center' }} numberOfLines={1}>
            {format(new Date(l.date + 'T12:00:00'), 'dd')}
          </Text>
        ))}
      </View>
      <View style={{ flexDirection: 'row', gap: 12, marginTop: 8 }}>
        {[{ c: Colors.primaryLight, l: 'Breakfast' }, { c: Colors.primary, l: 'Lunch' }, { c: Colors.primaryDeep, l: 'Dinner' }].map(m => (
          <View key={m.l} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <View style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: m.c }} />
            <Text style={{ fontSize: FontSize.xs, color: theme.textSecondary }}>{m.l}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function MoodChart({ logs, theme }: any) {
  const emojis = ['', '😞', '😕', '😐', '🙂', '😄'];
  if (logs.length === 0) return <Text style={{ fontSize: FontSize.sm, color: theme.textSecondary }}>No data yet</Text>;
  return (
    <View style={{ flexDirection: 'row', gap: 3, alignItems: 'flex-end', height: 60 }}>
      {logs.map((l: DailyHealthLog, i: number) => (
        <View key={i} style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end', height: 60 }}>
          <Text style={{ fontSize: 14 }}>{emojis[l.mood] || '·'}</Text>
        </View>
      ))}
    </View>
  );
}
