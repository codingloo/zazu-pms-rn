import React from 'react';
import {
  View, Text, TouchableOpacity, TextInput, Switch,
  StyleSheet, ActivityIndicator, ViewStyle, TextStyle,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { Colors, Spacing, Radius, FontSize, FontWeight, Shadow } from '../../constants/theme';

// ─── Button ──────────────────────────────────────────────────────────────────

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
}

export function Button({ label, onPress, variant = 'primary', size = 'md', loading, disabled, icon, style }: ButtonProps) {
  const { theme, isDark } = useTheme();

  const bgColors = {
    primary: Colors.primary,
    secondary: isDark ? theme.surfaceAlt : Colors.primaryLight,
    ghost: 'transparent',
    danger: Colors.danger,
  };
  const textColors = {
    primary: '#fff',
    secondary: Colors.primaryDark,
    ghost: Colors.primary,
    danger: '#fff',
  };
  const heights = { sm: 36, md: 44, lg: 52 };
  const fontSizes = { sm: FontSize.sm, md: FontSize.md, lg: FontSize.base };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.75}
      style={[{
        height: heights[size],
        backgroundColor: disabled ? theme.border : bgColors[variant],
        borderRadius: Radius.md,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: Spacing.lg,
        gap: 6,
        opacity: disabled ? 0.6 : 1,
        ...(variant === 'primary' ? Shadow.lg : {}),
      }, style]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={textColors[variant]} />
      ) : (
        <>
          {icon}
          <Text style={{ fontSize: fontSizes[size], fontWeight: FontWeight.semibold, color: disabled ? theme.textSecondary : textColors[variant] }}>
            {label}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
}

// ─── Card ─────────────────────────────────────────────────────────────────────

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  padding?: number;
}

export function Card({ children, style, padding = Spacing.lg }: CardProps) {
  const { theme } = useTheme();
  return (
    <View style={[{
      backgroundColor: theme.surface,
      borderRadius: Radius.lg,
      padding,
      borderWidth: 0.5,
      borderColor: theme.border,
    }, Shadow.sm, style]}>
      {children}
    </View>
  );
}

// ─── Section Header ───────────────────────────────────────────────────────────

export function SectionHeader({ title, icon }: { title: string; icon?: string }) {
  const { theme } = useTheme();
  return (
    <Text style={{
      fontSize: FontSize.xs,
      fontWeight: FontWeight.semibold,
      color: theme.textSecondary,
      textTransform: 'uppercase',
      letterSpacing: 0.8,
      marginBottom: Spacing.md,
    }}>
      {icon ? `${icon}  ${title}` : title}
    </Text>
  );
}

// ─── NumberInput ──────────────────────────────────────────────────────────────

interface NumberInputProps {
  label: string;
  value: number;
  onChange: (val: number) => void;
  unit?: string;
  step?: number;
  min?: number;
  max?: number;
  placeholder?: string;
}

export function NumberInput({ label, value, onChange, unit, placeholder }: NumberInputProps) {
  const { theme } = useTheme();
  return (
    <View style={{ marginBottom: Spacing.md }}>
      <Text style={{ fontSize: FontSize.sm, color: theme.textSecondary, marginBottom: 6 }}>{label}</Text>
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.surfaceAlt,
        borderRadius: Radius.md,
        borderWidth: 0.5,
        borderColor: theme.border,
        height: 44,
        paddingHorizontal: Spacing.md,
      }}>
        <TextInput
          style={{ flex: 1, fontSize: FontSize.md, color: theme.text, padding: 0 }}
          keyboardType="decimal-pad"
          value={value > 0 ? String(value) : ''}
          onChangeText={t => onChange(parseFloat(t) || 0)}
          placeholder={placeholder || '0'}
          placeholderTextColor={theme.textTertiary}
        />
        {unit && (
          <Text style={{ fontSize: FontSize.sm, color: theme.textSecondary }}>{unit}</Text>
        )}
      </View>
    </View>
  );
}

// ─── ToggleRow ────────────────────────────────────────────────────────────────

interface ToggleRowProps {
  label: string;
  value: boolean;
  onChange: (val: boolean) => void;
  subtitle?: string;
}

export function ToggleRow({ label, value, onChange, subtitle }: ToggleRowProps) {
  const { theme } = useTheme();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Spacing.md }}>
      <View style={{ flex: 1, marginRight: Spacing.md }}>
        <Text style={{ fontSize: FontSize.md, color: theme.text, fontWeight: FontWeight.medium }}>{label}</Text>
        {subtitle && <Text style={{ fontSize: FontSize.xs, color: theme.textSecondary, marginTop: 2 }}>{subtitle}</Text>}
      </View>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: theme.border, true: Colors.primaryLight }}
        thumbColor={value ? Colors.primary : theme.textTertiary}
        ios_backgroundColor={theme.border}
      />
    </View>
  );
}

// ─── SelectPicker ─────────────────────────────────────────────────────────────

interface SelectPickerProps {
  label: string;
  value: string;
  options: string[];
  onChange: (val: string) => void;
  enabled?: boolean;
}

export function SelectPicker({ label, value, options, onChange, enabled = true }: SelectPickerProps) {
  const { theme } = useTheme();
  const [open, setOpen] = React.useState(false);

  return (
    <View style={{ marginBottom: Spacing.sm, opacity: enabled ? 1 : 0.4 }}>
      <Text style={{ fontSize: FontSize.sm, color: theme.textSecondary, marginBottom: 5 }}>{label}</Text>
      <TouchableOpacity
        disabled={!enabled}
        onPress={() => setOpen(!open)}
        style={{
          backgroundColor: theme.surfaceAlt,
          borderRadius: Radius.md,
          borderWidth: 0.5,
          borderColor: open ? Colors.primary : theme.border,
          height: 44,
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: Spacing.md,
          justifyContent: 'space-between',
        }}
      >
        <Text style={{ fontSize: FontSize.md, color: value ? theme.text : theme.textTertiary }}>
          {value || 'Select...'}
        </Text>
        <Text style={{ color: theme.textSecondary }}>{open ? '▲' : '▼'}</Text>
      </TouchableOpacity>
      {open && (
        <View style={{
          backgroundColor: theme.surface,
          borderRadius: Radius.md,
          borderWidth: 0.5,
          borderColor: theme.border,
          marginTop: 2,
          overflow: 'hidden',
          zIndex: 100,
          ...Shadow.md,
        }}>
          {options.map(opt => (
            <TouchableOpacity
              key={opt}
              onPress={() => { onChange(opt); setOpen(false); }}
              style={{
                padding: Spacing.md,
                borderBottomWidth: 0.5,
                borderBottomColor: theme.borderLight,
                backgroundColor: opt === value ? Colors.primaryLight : 'transparent',
              }}
            >
              <Text style={{ fontSize: FontSize.md, color: opt === value ? Colors.primaryDark : theme.text }}>
                {opt}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

// ─── ChipSelector ─────────────────────────────────────────────────────────────

interface ChipSelectorProps {
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  allowCustom?: boolean;
}

export function ChipSelector({ options, selected, onChange, allowCustom = true }: ChipSelectorProps) {
  const { theme } = useTheme();
  const [customInput, setCustomInput] = React.useState('');
  const [showInput, setShowInput] = React.useState(false);

  function toggle(opt: string) {
    onChange(selected.includes(opt) ? selected.filter(s => s !== opt) : [...selected, opt]);
  }

  function addCustom() {
    if (customInput.trim() && !selected.includes(customInput.trim())) {
      onChange([...selected, customInput.trim()]);
      setCustomInput('');
      setShowInput(false);
    }
  }

  const allOptions = [...options, ...selected.filter(s => !options.includes(s))];

  return (
    <View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
        {allOptions.map(opt => {
          const active = selected.includes(opt);
          return (
            <TouchableOpacity
              key={opt}
              onPress={() => toggle(opt)}
              style={{
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: Radius.full,
                backgroundColor: active ? Colors.primaryLight : theme.surfaceAlt,
                borderWidth: 0.5,
                borderColor: active ? Colors.primary : theme.border,
              }}
            >
              <Text style={{ fontSize: FontSize.sm, color: active ? Colors.primaryDark : theme.textSecondary, fontWeight: active ? FontWeight.semibold : FontWeight.regular }}>
                {opt}
              </Text>
            </TouchableOpacity>
          );
        })}
        {allowCustom && !showInput && (
          <TouchableOpacity
            onPress={() => setShowInput(true)}
            style={{
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: Radius.full,
              borderWidth: 0.5,
              borderStyle: 'dashed',
              borderColor: theme.border,
            }}
          >
            <Text style={{ fontSize: FontSize.sm, color: theme.textTertiary }}>+ custom</Text>
          </TouchableOpacity>
        )}
      </View>
      {showInput && (
        <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
          <TextInput
            style={{
              flex: 1, height: 36, backgroundColor: theme.surfaceAlt, borderRadius: Radius.md,
              borderWidth: 0.5, borderColor: Colors.primary, paddingHorizontal: Spacing.md,
              fontSize: FontSize.md, color: theme.text,
            }}
            placeholder="Type custom option..."
            placeholderTextColor={theme.textTertiary}
            value={customInput}
            onChangeText={setCustomInput}
            onSubmitEditing={addCustom}
            autoFocus
          />
          <TouchableOpacity onPress={addCustom} style={{ width: 36, height: 36, backgroundColor: Colors.primary, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: '#fff', fontSize: 18 }}>+</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowInput(false)} style={{ width: 36, height: 36, backgroundColor: theme.surfaceAlt, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: theme.textSecondary, fontSize: 18 }}>✕</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

// ─── MetricCard ───────────────────────────────────────────────────────────────

interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  icon: string;
  color?: string;
  trend?: string;
  trendUp?: boolean;
}

export function MetricCard({ label, value, unit, icon, color = Colors.primary, trend, trendUp }: MetricCardProps) {
  const { theme } = useTheme();
  return (
    <View style={{
      flex: 1,
      backgroundColor: theme.surfaceAlt,
      borderRadius: Radius.md,
      padding: Spacing.md,
      minWidth: 100,
    }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 8 }}>
        <Text style={{ fontSize: 15 }}>{icon}</Text>
        <Text style={{ fontSize: FontSize.xs, color: theme.textSecondary, flex: 1 }} numberOfLines={1}>{label}</Text>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 3 }}>
        <Text style={{ fontSize: FontSize.xxl, fontWeight: FontWeight.bold, color: theme.text }}>{value}</Text>
        {unit && <Text style={{ fontSize: FontSize.xs, color: theme.textSecondary }}>{unit}</Text>}
      </View>
      {trend && (
        <Text style={{ fontSize: FontSize.xs, color: trendUp ? Colors.primaryDark : Colors.danger, marginTop: 3 }}>
          {trendUp ? '↑' : '↓'} {trend}
        </Text>
      )}
    </View>
  );
}

// ─── PINPad ───────────────────────────────────────────────────────────────────

interface PINPadProps {
  onComplete: (pin: string) => void;
  title?: string;
}

export function PINPad({ onComplete, title = 'Enter your PIN' }: PINPadProps) {
  const { theme } = useTheme();
  const [pin, setPin] = React.useState('');

  function press(digit: string) {
    const next = pin + digit;
    setPin(next);
    if (next.length === 4) {
      setTimeout(() => { onComplete(next); setPin(''); }, 100);
    }
  }

  function del() { setPin(p => p.slice(0, -1)); }

  const keys = ['1','2','3','4','5','6','7','8','9','','0','⌫'];

  return (
    <View style={{ alignItems: 'center', paddingVertical: Spacing.xl }}>
      <Text style={{ fontSize: FontSize.lg, fontWeight: FontWeight.semibold, color: theme.text, marginBottom: Spacing.xl }}>{title}</Text>
      <View style={{ flexDirection: 'row', gap: 14, marginBottom: Spacing.xxxl }}>
        {[0,1,2,3].map(i => (
          <View key={i} style={{
            width: 14, height: 14, borderRadius: 7,
            backgroundColor: i < pin.length ? Colors.primary : theme.border,
          }} />
        ))}
      </View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', width: 240, gap: 12 }}>
        {keys.map((k, i) => (
          <TouchableOpacity
            key={i}
            onPress={k === '⌫' ? del : k ? () => press(k) : undefined}
            style={{
              width: 68, height: 68,
              backgroundColor: k ? theme.surfaceAlt : 'transparent',
              borderRadius: 34,
              alignItems: 'center', justifyContent: 'center',
              borderWidth: k ? 0.5 : 0,
              borderColor: theme.border,
            }}
            disabled={!k && k !== '⌫'}
          >
            <Text style={{ fontSize: k === '⌫' ? 20 : FontSize.xxl, color: theme.text, fontWeight: FontWeight.medium }}>
              {k}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
