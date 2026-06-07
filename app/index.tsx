import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { getLogByDate, getRecentLogs, getWeeklyStats } from '../db/database';
import { DailyHealthLog } from '../constants/types';
import { Colors, FontSize, FontWeight, Spacing, Radius, Shadow } from '../constants/theme';
import { Card, MetricCard } from '../components/ui/UIComponents';
import AppShell from '../components/layout/AppShell';
import { format } from 'date-fns';

export default function DashboardScreen() {
  const { profile } = useAuth();
  const { theme } = useTheme();
  const router = useRouter();
  const [todayLog, setTodayLog] = useState<DailyHealthLog | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [recentLogs, setRecentLogs] = useState<DailyHealthLog[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const today = new Date().toISOString().split('T')[0];

  function load() {
    setTodayLog(getLogByDate(today));
    setStats(getWeeklyStats(7));
    setRecentLogs(getRecentLogs(7));
  }
  useFocusEffect(useCallback(() => { load(); }, []));
  function onRefresh() { setRefreshing(true); load(); setRefreshing(false); }

  const firstName = profile?.name?.split(' ')[0] || 'there';
  const h = new Date().getHours();
  const greeting = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
  const healthScore = todayLog ? calcScore(todayLog, profile) : 0;

  return (
    <AppShell title="Dashboard">
      <ScrollView
        contentContainerStyle={{ padding: Spacing.lg, paddingBottom: 32 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
        showsVerticalScrollIndicator={false}
      >
        {/* Greeting */}
        <View style={{ marginBottom: Spacing.lg }}>
          <Text style={{ fontSize: FontSize.sm, color: theme.textSecondary }}>{greeting},</Text>
          <Text style={{ fontSize: 26, fontWeight: FontWeight.bold, color: theme.text }}>{firstName} 👋</Text>
          <Text style={{ fontSize: FontSize.xs, color: theme.textTertiary, marginTop: 2 }}>
            {format(new Date(), 'EEEE, d MMMM yyyy')}
          </Text>
        </View>

        {/* Health score banner */}
        <TouchableOpacity
          onPress={() => router.push('/health/log')}
          style={{ backgroundColor: Colors.primary, borderRadius: Radius.lg, padding: Spacing.lg, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Spacing.lg, ...Shadow.lg }}
          activeOpacity={0.85}
        >
          <View>
            <Text style={{ fontSize: FontSize.sm, color: 'rgba(255,255,255,0.75)', marginBottom: 4 }}>
              {todayLog ? "Today's health score" : 'No log yet today'}
            </Text>
            <Text style={{ fontSize: 36, fontWeight: FontWeight.bold, color: '#fff' }}>
              {todayLog ? `${healthScore}%` : '—'}
            </Text>
            <Text style={{ fontSize: FontSize.sm, color: 'rgba(255,255,255,0.75)', marginTop: 2 }}>
              {todayLog ? scoreLabel(healthScore) : 'Tap to log your day →'}
            </Text>
          </View>
          <View style={{ width: 64, height: 64, borderRadius: 32, borderWidth: 5, borderColor: 'rgba(255,255,255,0.3)', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 14, fontWeight: FontWeight.bold, color: '#fff' }}>{todayLog ? healthScore : '—'}</Text>
          </View>
        </TouchableOpacity>

        {/* Module tiles */}
        <Text style={{ fontSize: FontSize.xs, fontWeight: FontWeight.semibold, color: theme.textSecondary, textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: Spacing.sm }}>
          Modules
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: Spacing.lg }}>
          <ModuleTile icon="❤️" label="Health" sub="Active" color={Colors.primary} onPress={() => router.push('/health/log')} theme={theme} />
          <ModuleTile icon="💳" label="Finance" sub="Coming soon" color={Colors.info} onPress={() => {}} disabled theme={theme} />
          <ModuleTile icon="✅" label="Daily Plans" sub="Coming soon" color={Colors.accent} onPress={() => {}} disabled theme={theme} />
          <ModuleTile icon="📓" label="Journal" sub="Coming soon" color="#7F77DD" onPress={() => {}} disabled theme={theme} />
        </View>

        {/* 7-day health stats */}
        <Text style={{ fontSize: FontSize.xs, fontWeight: FontWeight.semibold, color: theme.textSecondary, textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: Spacing.sm }}>
          7-day health averages
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: Spacing.lg }}>
          <MetricCard icon="👟" label="Steps" value={stats ? stats.avgSteps.toLocaleString() : '—'} color={Colors.primary} theme={theme} />
          <MetricCard icon="😴" label="Sleep" value={stats ? `${stats.avgSleep.toFixed(1)}h` : '—'} color="#7F77DD" theme={theme} />
          <MetricCard icon="💧" label="Water" value={stats ? `${stats.avgWater.toFixed(1)}L` : '—'} color={Colors.info} theme={theme} />
          <MetricCard icon="🏋️" label="Workouts" value={stats ? `${stats.workoutDays}/7` : '—'} color={Colors.accentDark} theme={theme} />
        </View>

        {/* Today snapshot */}
        {todayLog && (
          <>
            <Text style={{ fontSize: FontSize.xs, fontWeight: FontWeight.semibold, color: theme.textSecondary, textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: Spacing.sm }}>Today</Text>
            <Card style={{ marginBottom: Spacing.lg }}>
              {[
                { icon: '👟', label: 'Steps', val: todayLog.stepsCount.toLocaleString() },
                { icon: '💧', label: 'Water', val: `${todayLog.waterIntakeLiters}L` },
                { icon: '😴', label: 'Sleep', val: `${todayLog.sleepHours}h — ${todayLog.sleepQuality}` },
                { icon: '🏋️', label: 'Workout', val: todayLog.workoutDone ? `${todayLog.workoutDurationMinutes} min` : 'Rest day' },
                { icon: '😊', label: 'Mood', val: ['', '😞 Terrible', '😕 Bad', '😐 Neutral', '🙂 Good', '😄 Great'][todayLog.mood] || '—' },
              ].map(r => (
                <View key={r.label} style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: 7 }}>
                  <Text style={{ width: 20 }}>{r.icon}</Text>
                  <Text style={{ fontSize: FontSize.sm, color: theme.textSecondary, width: 56 }}>{r.label}</Text>
                  <Text style={{ fontSize: FontSize.sm, color: theme.text, flex: 1, fontWeight: FontWeight.medium }}>{r.val}</Text>
                </View>
              ))}
              <TouchableOpacity onPress={() => router.push('/health/log')} style={{ marginTop: Spacing.sm, paddingTop: Spacing.sm, borderTopWidth: 0.5, borderTopColor: theme.border, alignItems: 'center' }}>
                <Text style={{ fontSize: FontSize.sm, color: Colors.primary, fontWeight: FontWeight.semibold }}>Edit today's log →</Text>
              </TouchableOpacity>
            </Card>
          </>
        )}

        {/* Recent logs */}
        {recentLogs.length > 0 && (
          <>
            <Text style={{ fontSize: FontSize.xs, fontWeight: FontWeight.semibold, color: theme.textSecondary, textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: Spacing.sm }}>Recent days</Text>
            <View style={{ gap: 6 }}>
              {recentLogs.slice().reverse().slice(0, 5).map(log => {
                const sc = calcScore(log, profile);
                return (
                  <Card key={log.date} padding={Spacing.md} style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: scoreColor(sc) + '22', alignItems: 'center', justifyContent: 'center', marginRight: Spacing.md }}>
                      <Text style={{ fontSize: FontSize.sm, fontWeight: FontWeight.bold, color: scoreColor(sc) }}>{sc}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: FontSize.md, fontWeight: FontWeight.medium, color: theme.text }}>
                        {log.date === today ? 'Today' : format(new Date(log.date + 'T12:00:00'), 'EEE, MMM d')}
                      </Text>
                      <Text style={{ fontSize: FontSize.xs, color: theme.textSecondary }}>
                        {log.stepsCount.toLocaleString()} steps · {log.sleepHours}h sleep · {log.waterIntakeLiters}L
                      </Text>
                    </View>
                  </Card>
                );
              })}
            </View>
          </>
        )}

        {/* Empty state */}
        {recentLogs.length === 0 && (
          <Card style={{ alignItems: 'center', padding: Spacing.xxxl }}>
            <Text style={{ fontSize: 48, marginBottom: Spacing.md }}>🌱</Text>
            <Text style={{ fontSize: FontSize.lg, fontWeight: FontWeight.semibold, color: theme.text, marginBottom: 6 }}>Start your journey</Text>
            <Text style={{ fontSize: FontSize.md, color: theme.textSecondary, textAlign: 'center', marginBottom: Spacing.xl }}>Log your first health entry to see your stats here.</Text>
            <TouchableOpacity onPress={() => router.push('/health/log')} style={{ backgroundColor: Colors.primary, paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md, borderRadius: Radius.md }}>
              <Text style={{ color: '#fff', fontWeight: FontWeight.semibold }}>Log today →</Text>
            </TouchableOpacity>
          </Card>
        )}
        <View style={{ height: 8 }} />
      </ScrollView>
    </AppShell>
  );
}

function ModuleTile({ icon, label, sub, color, onPress, disabled, theme }: any) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.75}
      style={{ width: '47%', backgroundColor: theme.surfaceAlt, borderRadius: Radius.md, padding: Spacing.md, opacity: disabled ? 0.5 : 1 }}
    >
      <Text style={{ fontSize: 26, marginBottom: 6 }}>{icon}</Text>
      <Text style={{ fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: theme.text }}>{label}</Text>
      <Text style={{ fontSize: FontSize.xs, color: disabled ? theme.textTertiary : color, marginTop: 2 }}>{sub}</Text>
    </TouchableOpacity>
  );
}

function calcScore(log: DailyHealthLog, profile: any): number {
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
  const sq: any = { great: 10, good: 8, ok: 6, fair: 4, poor: 2 };
  pts += sq[log.sleepQuality] || 0;
  pts += (log.mood / 5) * 10;
  return Math.min(100, Math.round(pts));
}
function scoreLabel(s: number) {
  if (s >= 85) return 'Excellent day! 🌟';
  if (s >= 70) return 'Great progress!';
  if (s >= 50) return 'Good effort, keep going';
  return 'Room to improve';
}
function scoreColor(s: number) {
  if (s >= 75) return Colors.primary;
  if (s >= 50) return Colors.accentDark;
  return Colors.danger;
}
