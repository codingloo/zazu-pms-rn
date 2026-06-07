import React, { useState, useCallback } from 'react';
import { ScrollView, View, Text, Alert } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { saveHealthLog, getLogByDate } from '../../db/database';
import { defaultLog, DailyHealthLog } from '../../constants/types';
import { MEAL_OPTIONS, WORKOUT_TYPES, SNACK_OPTIONS, SLEEP_QUALITY_OPTIONS, MOOD_OPTIONS, Colors, FontSize, FontWeight, Spacing, Radius } from '../../constants/theme';
import { Button, Card, SectionHeader, NumberInput, ToggleRow, SelectPicker, ChipSelector } from '../../components/ui/UIComponents';
import { WaterTracker } from '../../components/ui/WaterTracker';
import AppShell from '../../components/layout/AppShell';

export default function HealthLogScreen() {
  const { theme } = useTheme();
  const { profile } = useAuth();
  const today = new Date().toISOString().split('T')[0];
  const [log, setLog] = useState<DailyHealthLog>(defaultLog());
  const [saving, setSaving] = useState(false);

  useFocusEffect(useCallback(() => {
    const existing = getLogByDate(today);
    setLog(existing || { ...defaultLog(), date: today });
  }, []));

  function update(partial: Partial<DailyHealthLog>) {
    setLog(prev => ({ ...prev, ...partial }));
  }

  function calcScore(): number {
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

  async function handleSave() {
    setSaving(true);
    try {
      saveHealthLog(log);
      Alert.alert('Saved ✓', "Today's health log has been saved.");
    } catch (e) {
      Alert.alert('Error', 'Could not save log. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  const score = calcScore();
  const scoreColor = score >= 75 ? Colors.primary : score >= 50 ? Colors.accentDark : Colors.danger;

  const headerRight = (
    <View style={{ paddingHorizontal: 12, paddingVertical: 4, borderRadius: Radius.full, backgroundColor: Colors.primaryLight, borderWidth: 1, borderColor: Colors.primary }}>
      <Text style={{ fontSize: FontSize.xs, fontWeight: FontWeight.semibold, color: Colors.primaryDark }}>
        Score: {score}%
      </Text>
    </View>
  );

  return (
    <AppShell title="Daily log" headerRight={headerRight} hideAvatar>
      <ScrollView
        contentContainerStyle={{ padding: Spacing.lg, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Activity ─────────────────────────────── */}
        <Card style={{ marginBottom: Spacing.md }}>
          <SectionHeader title="Activity" icon="🏃" />
          <View style={{ flexDirection: 'row', gap: Spacing.sm }}>
            <View style={{ flex: 1 }}>
              <NumberInput label="Steps" value={log.stepsCount} onChange={v => update({ stepsCount: v })} placeholder="0" />
            </View>
            <View style={{ flex: 1 }}>
              <NumberInput label="Distance (km)" value={log.walkingDistanceKm} onChange={v => update({ walkingDistanceKm: v })} placeholder="0.0" />
            </View>
          </View>
          <NumberInput label="Calories burned" value={log.caloriesBurned} onChange={v => update({ caloriesBurned: v })} unit="kcal" placeholder="0" />
        </Card>

        {/* ── Workout ──────────────────────────────── */}
        <Card style={{ marginBottom: Spacing.md }}>
          <SectionHeader title="Workout" icon="🏋️" />
          <ToggleRow label="Workout done today?" value={log.workoutDone} onChange={v => update({ workoutDone: v })} />
          {log.workoutDone && (
            <>
              <NumberInput label="Duration (minutes)" value={log.workoutDurationMinutes} onChange={v => update({ workoutDurationMinutes: v })} unit="min" />
              <Text style={{ fontSize: FontSize.sm, color: theme.textSecondary, marginBottom: Spacing.sm }}>Type</Text>
              <ChipSelector options={WORKOUT_TYPES} selected={log.workoutType} onChange={v => update({ workoutType: v })} />
            </>
          )}
        </Card>

        {/* ── Nutrition ────────────────────────────── */}
        <Card style={{ marginBottom: Spacing.md }}>
          <SectionHeader title="Nutrition" icon="🥗" />
          <ToggleRow label="Breakfast" value={log.isBreakfastTaken} onChange={v => update({ isBreakfastTaken: v, breakfast: v ? log.breakfast : '' })} />
          {log.isBreakfastTaken && <SelectPicker label="" value={log.breakfast} options={MEAL_OPTIONS.breakfast} onChange={v => update({ breakfast: v })} />}

          <ToggleRow label="Lunch" value={log.isLunchTaken} onChange={v => update({ isLunchTaken: v, lunch: v ? log.lunch : '' })} />
          {log.isLunchTaken && <SelectPicker label="" value={log.lunch} options={MEAL_OPTIONS.lunch} onChange={v => update({ lunch: v })} />}

          <ToggleRow label="Dinner" value={log.isDinnerTaken} onChange={v => update({ isDinnerTaken: v, dinner: v ? log.dinner : '' })} />
          {log.isDinnerTaken && <SelectPicker label="" value={log.dinner} options={MEAL_OPTIONS.dinner} onChange={v => update({ dinner: v })} />}

          <Text style={{ fontSize: FontSize.sm, color: theme.textSecondary, marginTop: Spacing.sm, marginBottom: Spacing.sm }}>Snacks</Text>
          <ChipSelector options={SNACK_OPTIONS} selected={log.snacks} onChange={v => update({ snacks: v })} />

          <Text style={{ fontSize: FontSize.sm, color: theme.textSecondary, marginTop: Spacing.md, marginBottom: Spacing.sm }}>
            Water intake
          </Text>
          <WaterTracker value={log.waterIntakeLiters} onChange={v => update({ waterIntakeLiters: v })} goal={profile?.waterGoal} />
        </Card>

        {/* ── Sleep ────────────────────────────────── */}
        <Card style={{ marginBottom: Spacing.md }}>
          <SectionHeader title="Sleep" icon="🌙" />
          <NumberInput label="Hours slept" value={log.sleepHours} onChange={v => update({ sleepHours: v })} unit="hrs" placeholder="0.0" />
          <Text style={{ fontSize: FontSize.sm, color: theme.textSecondary, marginBottom: Spacing.sm }}>Sleep quality</Text>
          <View style={{ flexDirection: 'row', gap: 4 }}>
            {SLEEP_QUALITY_OPTIONS.map(opt => (
              <View
                key={opt.value}
                style={{
                  flex: 1,
                  paddingVertical: 8,
                  borderRadius: Radius.md,
                  borderWidth: log.sleepQuality === opt.value ? 1.5 : 0.5,
                  borderColor: log.sleepQuality === opt.value ? Colors.primary : theme.border,
                  backgroundColor: log.sleepQuality === opt.value ? Colors.primaryLight : theme.surfaceAlt,
                  alignItems: 'center',
                }}
              >
                <Text
                  onPress={() => update({ sleepQuality: opt.value })}
                  style={{ fontSize: FontSize.xs, color: log.sleepQuality === opt.value ? Colors.primaryDark : theme.textSecondary, textAlign: 'center' }}
                >
                  {opt.label}
                </Text>
              </View>
            ))}
          </View>
        </Card>

        {/* ── Health & Mood ────────────────────────── */}
        <Card style={{ marginBottom: Spacing.lg }}>
          <SectionHeader title="Health & Mood" icon="❤️" />
          <NumberInput label="Weight (kg)" value={log.weightKg} onChange={v => update({ weightKg: v })} unit="kg" placeholder="0.0" />
          <Text style={{ fontSize: FontSize.sm, color: theme.textSecondary, marginBottom: Spacing.sm }}>Mood today</Text>
          <View style={{ flexDirection: 'row', gap: 6 }}>
            {MOOD_OPTIONS.map(opt => (
              <View
                key={opt.value}
                style={{
                  flex: 1, height: 48, borderRadius: Radius.md,
                  borderWidth: log.mood === opt.value ? 1.5 : 0.5,
                  borderColor: log.mood === opt.value ? Colors.primary : theme.border,
                  backgroundColor: log.mood === opt.value ? Colors.primaryLight : theme.surfaceAlt,
                  alignItems: 'center', justifyContent: 'center',
                }}
              >
                <Text onPress={() => update({ mood: opt.value })} style={{ fontSize: 22 }}>{opt.emoji}</Text>
              </View>
            ))}
          </View>
        </Card>

        <Button label="Save today's log" onPress={handleSave} loading={saving} />
        <View style={{ height: 16 }} />
      </ScrollView>
    </AppShell>
  );
}
