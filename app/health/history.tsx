import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { getAllLogs } from '../../db/database';
import { DailyHealthLog } from '../../constants/types';
import { Colors, FontSize, FontWeight, Spacing, Radius } from '../../constants/theme';
import { Card } from '../../components/ui/UIComponents';
import AppShell from '../../components/layout/AppShell';
import { format, parseISO } from 'date-fns';

export default function HistoryScreen() {
  const { theme } = useTheme();
  const { profile } = useAuth();
  const [logs, setLogs] = useState<DailyHealthLog[]>([]);

  useFocusEffect(useCallback(() => {
    setLogs(getAllLogs());
  }, []));

  function calcScore(log: DailyHealthLog): number {
    let pts = 0;
    const stepGoal = profile?.stepGoal || 8000;
    if (log.stepsCount >= stepGoal) pts += 20;
    else if (log.stepsCount >= stepGoal * 0.6) pts += 12;
    else if (log.stepsCount > 0) pts += 5;
    if (log.workoutDone) pts += 15;
    pts += [log.isBreakfastTaken, log.isLunchTaken, log.isDinnerTaken].filter(Boolean).length * 5;
    pts += Math.min(15, Math.round((log.waterIntakeLiters / (profile?.waterGoal || 2)) * 15));
    if (log.sleepHours >= 7 && log.sleepHours <= 9) pts += 15;
    else if (log.sleepHours >= 6) pts += 10;
    else if (log.sleepHours > 0) pts += 5;
    pts += (log.mood / 5) * 10;
    return Math.min(100, Math.round(pts));
  }

  function scoreColor(s: number) {
    if (s >= 75) return { bg: Colors.primaryLight, text: Colors.primaryDark };
    if (s >= 50) return { bg: Colors.accentLight, text: Colors.accentDark };
    return { bg: Colors.dangerLight, text: Colors.danger };
  }

  // Group logs by month
  const grouped: Record<string, DailyHealthLog[]> = {};
  logs.forEach(log => {
    const month = format(parseISO(log.date), 'MMMM yyyy');
    if (!grouped[month]) grouped[month] = [];
    grouped[month].push(log);
  });

  const moodEmoji = ['', '😞', '😕', '😐', '🙂', '😄'];

  return (
    <AppShell title="History">
      <ScrollView contentContainerStyle={{ padding: Spacing.lg, paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        {logs.length === 0 ? (
          <Card style={{ alignItems: 'center', padding: 40 }}>
            <Text style={{ fontSize: 40, marginBottom: 12 }}>📋</Text>
            <Text style={{ fontSize: FontSize.lg, fontWeight: FontWeight.semibold, color: theme.text }}>No history yet</Text>
            <Text style={{ fontSize: FontSize.sm, color: theme.textSecondary, marginTop: 6, textAlign: 'center' }}>
              Start logging your daily health data to see your history here.
            </Text>
          </Card>
        ) : (
          Object.entries(grouped).map(([month, monthLogs]) => (
            <View key={month}>
              <Text style={{ fontSize: FontSize.xs, fontWeight: FontWeight.semibold, color: theme.textSecondary, textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: Spacing.sm }}>
                {month}
              </Text>
              <View style={{ gap: 6, marginBottom: Spacing.lg }}>
                {monthLogs.map(log => {
                  const score = calcScore(log);
                  const sc = scoreColor(score);
                  const meals = [log.isBreakfastTaken, log.isLunchTaken, log.isDinnerTaken].filter(Boolean).length;
                  return (
                    <Card key={log.date} padding={Spacing.md} style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.md }}>
                      {/* Score circle */}
                      <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: sc.bg, alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Text style={{ fontSize: FontSize.sm, fontWeight: FontWeight.bold, color: sc.text }}>{score}</Text>
                      </View>

                      {/* Details */}
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: FontSize.md, fontWeight: FontWeight.medium, color: theme.text }}>
                          {format(parseISO(log.date), 'EEE, d MMM')}
                        </Text>
                        <Text style={{ fontSize: FontSize.xs, color: theme.textSecondary, marginTop: 2 }}>
                          {log.stepsCount.toLocaleString()} steps · {log.sleepHours}h sleep · {log.waterIntakeLiters}L
                        </Text>
                        <View style={{ flexDirection: 'row', gap: 6, marginTop: 4 }}>
                          {log.workoutDone && (
                            <View style={{ paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, backgroundColor: Colors.primaryLight }}>
                              <Text style={{ fontSize: 9, color: Colors.primaryDark }}>🏋️ {log.workoutDurationMinutes}min</Text>
                            </View>
                          )}
                          {meals > 0 && (
                            <View style={{ paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, backgroundColor: theme.surfaceAlt, borderWidth: 0.5, borderColor: theme.border }}>
                              <Text style={{ fontSize: 9, color: theme.textSecondary }}>{meals}/3 meals</Text>
                            </View>
                          )}
                          {log.mood > 0 && <Text style={{ fontSize: 13 }}>{moodEmoji[log.mood]}</Text>}
                        </View>
                      </View>
                    </Card>
                  );
                })}
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </AppShell>
  );
}
