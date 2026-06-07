import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { Colors, FontSize, FontWeight, Spacing, Radius } from '../../constants/theme';

interface WaterTrackerProps {
  value: number; // in liters
  onChange: (liters: number) => void;
  goal?: number;
}

const CUP_ML = 250; // each cup = 250ml = 0.25L
const CUPS = 8;    // 8 cups = 2L

export function WaterTracker({ value, onChange, goal = 2.0 }: WaterTrackerProps) {
  const { theme } = useTheme();
  const filledCups = Math.round(value / 0.25);

  function setCups(cups: number) {
    onChange(Math.round(cups * 0.25 * 100) / 100);
  }

  const pct = Math.min(100, Math.round((value / goal) * 100));

  return (
    <View>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Spacing.sm }}>
        <Text style={{ fontSize: FontSize.md, color: theme.text, fontWeight: FontWeight.medium }}>
          {value.toFixed(2)}L
        </Text>
        <Text style={{ fontSize: FontSize.xs, color: pct >= 100 ? Colors.primaryDark : theme.textSecondary }}>
          {pct}% of {goal}L goal {pct >= 100 ? '✓' : ''}
        </Text>
      </View>

      <View style={{ flexDirection: 'row', gap: 6, flexWrap: 'wrap' }}>
        {Array.from({ length: CUPS }).map((_, i) => {
          const filled = i < filledCups;
          return (
            <TouchableOpacity
              key={i}
              onPress={() => setCups(i + 1 === filledCups ? i : i + 1)}
              style={{
                width: 32,
                height: 38,
                borderRadius: 4,
                borderBottomLeftRadius: 8,
                borderBottomRightRadius: 8,
                backgroundColor: filled ? Colors.info : theme.surfaceAlt,
                borderWidth: 1.5,
                borderColor: filled ? Colors.info : theme.border,
                alignItems: 'center',
                justifyContent: 'flex-end',
                paddingBottom: 4,
                overflow: 'hidden',
              }}
            >
              {filled && (
                <View style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0,
                  height: '75%',
                  backgroundColor: '#85B7EB',
                  opacity: 0.6,
                }} />
              )}
              <Text style={{ fontSize: 8, color: filled ? '#fff' : theme.textTertiary, zIndex: 1 }}>
                {((i + 1) * 250)}ml
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
        <TouchableOpacity
          onPress={() => setCups(Math.max(0, filledCups - 1))}
          style={{ paddingHorizontal: 12, paddingVertical: 4, borderRadius: Radius.sm, backgroundColor: theme.surfaceAlt, borderWidth: 0.5, borderColor: theme.border }}
        >
          <Text style={{ color: theme.textSecondary, fontSize: FontSize.md }}>− 250ml</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setCups(Math.min(CUPS, filledCups + 1))}
          style={{ paddingHorizontal: 12, paddingVertical: 4, borderRadius: Radius.sm, backgroundColor: Colors.infoLight, borderWidth: 0.5, borderColor: Colors.info }}
        >
          <Text style={{ color: '#0C447C', fontSize: FontSize.md }}>+ 250ml</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
