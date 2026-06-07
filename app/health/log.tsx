import React, { useState, useCallback } from 'react';
import { ScrollView, View, Text, Alert, Modal, TouchableOpacity, FlatList } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { saveHealthLog, getLogByDate } from '../../db/database';
import { defaultLog, DailyHealthLog } from '../../constants/types';
import { MEAL_OPTIONS, WORKOUT_TYPES, SNACK_OPTIONS, SLEEP_QUALITY_OPTIONS, MOOD_OPTIONS, Colors, FontSize, FontWeight, Spacing, Radius, Shadow } from '../../constants/theme';
import { Button, Card, SectionHeader, NumberInput, ToggleRow, SelectPicker, ChipSelector } from '../../components/ui/UIComponents';
import { WaterTracker } from '../../components/ui/WaterTracker';
import AppShell from '../../components/layout/AppShell';

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];

function formatDisplayDate(dateStr: string, today: string): string {
  if (dateStr === today) return 'Today';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
}

function daysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

function DatePickerModal({ visible, currentDate, today, onClose, onConfirm }: {
  visible: boolean; currentDate: string; today: string;
  onClose: () => void; onConfirm: (date: string) => void;
}) {
  const { theme } = useTheme();
  const todayY = parseInt(today.slice(0, 4));
  const todayM = parseInt(today.slice(5, 7));
  const todayD = parseInt(today.slice(8, 10));

  const [selYear, setSelYear] = useState(parseInt(currentDate.slice(0, 4)));
  const [selMonth, setSelMonth] = useState(parseInt(currentDate.slice(5, 7)));
  const [selDay, setSelDay] = useState(parseInt(currentDate.slice(8, 10)));

  const years = Array.from({ length: todayY - 2019 }, (_, i) => 2020 + i);
  const maxMonth = selYear === todayY ? todayM : 12;
  const maxDay = (selYear === todayY && selMonth === todayM)
    ? todayD : daysInMonth(selYear, selMonth);
  const days = Array.from({ length: maxDay }, (_, i) => i + 1);

  function clampAndConfirm() {
    const m = Math.min(selMonth, maxMonth);
    const d = Math.min(selDay, daysInMonth(selYear, m));
    const finalDay = (selYear === todayY && m === todayM) ? Math.min(d, todayD) : d;
    onConfirm(`${selYear}-${String(m).padStart(2, '0')}-${String(finalDay).padStart(2, '0')}`);
    onClose();
  }

  const colStyle = { flex: 1, maxHeight: 200 };
  const itemStyle = (selected: boolean) => ({
    paddingVertical: 10, alignItems: 'center' as const,
    backgroundColor: selected ? Colors.primaryLight : 'transparent',
    borderRadius: Radius.sm,
  });
  const itemText = (selected: boolean) => ({
    fontSize: FontSize.sm,
    color: selected ? Colors.primaryDark : theme.text,
    fontWeight: selected ? FontWeight.semibold : FontWeight.regular,
  });

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'center', alignItems: 'center' }} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity activeOpacity={1} style={[{ backgroundColor: theme.surface, borderRadius: Radius.xl, padding: Spacing.lg, width: 320 }, Shadow.lg]}>
          <Text style={{ fontSize: FontSize.base, fontWeight: FontWeight.semibold, color: theme.text, marginBottom: Spacing.md, textAlign: 'center' }}>
            Select Date
          </Text>
          <View style={{ flexDirection: 'row', gap: Spacing.sm }}>
            {/* Year column */}
            <View style={colStyle}>
              <Text style={{ fontSize: FontSize.xs, color: theme.textSecondary, textAlign: 'center', marginBottom: 4 }}>Year</Text>
              <FlatList
                data={years}
                keyExtractor={String}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                  <TouchableOpacity style={itemStyle(item === selYear)} onPress={() => setSelYear(item)}>
                    <Text style={itemText(item === selYear)}>{item}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
            {/* Month column */}
            <View style={colStyle}>
              <Text style={{ fontSize: FontSize.xs, color: theme.textSecondary, textAlign: 'center', marginBottom: 4 }}>Month</Text>
              <FlatList
                data={Array.from({ length: maxMonth }, (_, i) => i + 1)}
                keyExtractor={String}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                  <TouchableOpacity style={itemStyle(item === selMonth)} onPress={() => setSelMonth(item)}>
                    <Text style={itemText(item === selMonth)}>{MONTH_NAMES[item - 1].slice(0, 3)}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
            {/* Day column */}
            <View style={colStyle}>
              <Text style={{ fontSize: FontSize.xs, color: theme.textSecondary, textAlign: 'center', marginBottom: 4 }}>Day</Text>
              <FlatList
                data={days}
                keyExtractor={String}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                  <TouchableOpacity style={itemStyle(item === selDay)} onPress={() => setSelDay(item)}>
                    <Text style={itemText(item === selDay)}>{String(item).padStart(2, '0')}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
          <View style={{ flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.lg }}>
            <TouchableOpacity
              onPress={onClose}
              style={{ flex: 1, height: 44, borderRadius: Radius.md, borderWidth: 1, borderColor: theme.border, alignItems: 'center', justifyContent: 'center' }}
            >
              <Text style={{ color: theme.textSecondary, fontWeight: FontWeight.medium }}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={clampAndConfirm}
              style={{ flex: 1, height: 44, borderRadius: Radius.md, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center' }}
            >
              <Text style={{ color: '#fff', fontWeight: FontWeight.semibold }}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

export default function HealthLogScreen() {
  const { theme } = useTheme();
  const { profile } = useAuth();
  const today = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(today);
  const [log, setLog] = useState<DailyHealthLog>(defaultLog());
  const [saving, setSaving] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  function loadLog(date: string) {
    const existing = getLogByDate(date);
    setLog(existing || { ...defaultLog(), date });
  }

  useFocusEffect(useCallback(() => {
    loadLog(selectedDate);
  }, []));

  function changeDate(date: string) {
    if (date > today) return;
    setSelectedDate(date);
    loadLog(date);
  }

  function shiftDay(delta: number) {
    const d = new Date(selectedDate + 'T00:00:00');
    d.setDate(d.getDate() + delta);
    const next = d.toISOString().split('T')[0];
    if (next <= today) changeDate(next);
  }

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
      saveHealthLog({ ...log, date: selectedDate });
      const label = selectedDate === today ? "Today's" : `${selectedDate}'s`;
      Alert.alert('Saved ✓', `${label} health log has been saved.`);
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

  const isToday = selectedDate === today;

  return (
    <AppShell title="Daily log" headerRight={headerRight} hideAvatar>
      <DatePickerModal
        visible={showDatePicker}
        currentDate={selectedDate}
        today={today}
        onClose={() => setShowDatePicker(false)}
        onConfirm={changeDate}
      />
      <ScrollView
        contentContainerStyle={{ padding: Spacing.lg, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Date Selector ─────────────────────────── */}
        <View style={{
          flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
          backgroundColor: theme.surface, borderRadius: Radius.lg, padding: Spacing.md,
          marginBottom: Spacing.md, borderWidth: 0.5, borderColor: theme.border,
        }}>
          <TouchableOpacity
            onPress={() => shiftDay(-1)}
            style={{ width: 36, height: 36, borderRadius: Radius.md, backgroundColor: theme.surfaceAlt, alignItems: 'center', justifyContent: 'center' }}
          >
            <Text style={{ fontSize: 18, color: theme.text }}>‹</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setShowDatePicker(true)} style={{ flex: 1, alignItems: 'center', paddingHorizontal: Spacing.sm }}>
            <Text style={{ fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: theme.text }}>
              {formatDisplayDate(selectedDate, today)}
            </Text>
            <Text style={{ fontSize: FontSize.xs, color: Colors.primary, marginTop: 2 }}>tap to change</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => shiftDay(1)}
            disabled={isToday}
            style={{ width: 36, height: 36, borderRadius: Radius.md, backgroundColor: theme.surfaceAlt, alignItems: 'center', justifyContent: 'center', opacity: isToday ? 0.3 : 1 }}
          >
            <Text style={{ fontSize: 18, color: theme.text }}>›</Text>
          </TouchableOpacity>
        </View>

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

        <Button label={isToday ? "Save today's log" : `Save log for ${selectedDate}`} onPress={handleSave} loading={saving} />
        <View style={{ height: 16 }} />
      </ScrollView>
    </AppShell>
  );
}
