import React, { useState } from 'react';
import {
  View, Text, TextInput, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { defaultProfile } from '../constants/types';
import { Colors, FontSize, FontWeight, Spacing, Radius, Shadow } from '../constants/theme';
import { Button, PINPad } from '../components/ui/UIComponents';

type Step = 'welcome' | 'name' | 'security' | 'pin_set' | 'goals' | 'done';

export default function OnboardingScreen() {
  const { theme, isDark } = useTheme();
  const { setupProfile, biometricAvailable, biometricType } = useAuth();

  const [step, setStep] = useState<Step>('welcome');
  const [name, setName] = useState('');
  const [pinEnabled, setPinEnabled] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [pinValue, setPinValue] = useState('');
  const [pinConfirm, setPinConfirm] = useState('');
  const [pinStage, setPinStage] = useState<'set' | 'confirm'>('set');
  const [stepGoal, setStepGoal] = useState('8000');
  const [waterGoal, setWaterGoal] = useState('2.0');
  const [sleepGoal, setSleepGoal] = useState('8');
  const [weightGoal, setWeightGoal] = useState('70');
  const [loading, setLoading] = useState(false);

  const bg = theme.bg;
  const surface = theme.surface;
  const textPrimary = theme.text;
  const textSecondary = theme.textSecondary;

  async function finish() {
    setLoading(true);
    const initials = name.trim().split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
    const profile = {
      ...defaultProfile(),
      name: name.trim(),
      avatarInitials: initials,
      pinEnabled,
      biometricEnabled,
      stepGoal: parseInt(stepGoal) || 8000,
      waterGoal: parseFloat(waterGoal) || 2.0,
      sleepGoal: parseInt(sleepGoal) || 8,
      weightGoal: parseFloat(weightGoal) || 70,
    };
    await setupProfile(profile, pinEnabled ? pinValue : undefined);
    setLoading(false);
  }

  function handlePinSet(pin: string) {
    if (pinStage === 'set') {
      setPinValue(pin);
      setPinStage('confirm');
    } else {
      if (pin === pinValue) {
        setPinEnabled(true);
        setStep('goals');
      } else {
        Alert.alert('PINs do not match', 'Please try again.');
        setPinStage('set');
        setPinValue('');
      }
    }
  }

  // ── Welcome ──────────────────────────────────────────────────────────────

  if (step === 'welcome') {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.primaryDeep }}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing.xxxl }}>
          <View style={{
            width: 88, height: 88, borderRadius: 24,
            backgroundColor: 'rgba(255,255,255,0.15)',
            alignItems: 'center', justifyContent: 'center',
            marginBottom: Spacing.xxxl,
          }}>
            <Text style={{ fontSize: 42 }}>🧬</Text>
          </View>
          <Text style={{ fontSize: 32, fontWeight: FontWeight.bold, color: '#fff', textAlign: 'center', marginBottom: 12 }}>
            ZAZU
          </Text>
          <Text style={{ fontSize: FontSize.base, color: 'rgba(255,255,255,0.7)', textAlign: 'center', lineHeight: 24, marginBottom: Spacing.xxxl * 2 }}>
            Your private health companion.{'\n'}All data stays on your device.
          </Text>

          <View style={{ gap: 14, width: '100%', alignItems: 'center' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: 14 }}>📱</Text>
              </View>
              <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: FontSize.md }}>Stored locally on your device</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: 14 }}>☁️</Text>
              </View>
              <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: FontSize.md }}>Backup to your Google Drive / iCloud</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: 14 }}>🔒</Text>
              </View>
              <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: FontSize.md }}>PIN & biometric protection</Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => setStep('name')}
            style={{
              marginTop: 48,
              backgroundColor: '#fff',
              borderRadius: Radius.lg,
              height: 52,
              width: '100%',
              alignItems: 'center',
              justifyContent: 'center',
              ...Shadow.md,
            }}
          >
            <Text style={{ fontSize: FontSize.base, fontWeight: FontWeight.bold, color: Colors.primaryDeep }}>
              Get Started →
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ── Name ─────────────────────────────────────────────────────────────────

  if (step === 'name') {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: bg }}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={{ flexGrow: 1, padding: Spacing.xl }}>
            <ProgressDots current={1} total={3} />
            <Text style={{ fontSize: 26, fontWeight: FontWeight.bold, color: textPrimary, marginBottom: 8 }}>
              What's your name?
            </Text>
            <Text style={{ fontSize: FontSize.md, color: textSecondary, marginBottom: Spacing.xxxl }}>
              This stays private — it's just for your greeting.
            </Text>
            <TextInput
              style={{
                fontSize: 22, fontWeight: FontWeight.medium, color: textPrimary,
                borderBottomWidth: 2, borderBottomColor: Colors.primary,
                paddingVertical: Spacing.md, marginBottom: Spacing.xxxl,
              }}
              placeholder="Your name..."
              placeholderTextColor={theme.textTertiary}
              value={name}
              onChangeText={setName}
              autoFocus
              returnKeyType="next"
            />
            <Button
              label="Continue"
              onPress={() => setStep('security')}
              disabled={name.trim().length < 2}
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  // ── Security ──────────────────────────────────────────────────────────────

  if (step === 'security') {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: bg }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, padding: Spacing.xl }}>
          <ProgressDots current={2} total={3} />
          <Text style={{ fontSize: 26, fontWeight: FontWeight.bold, color: textPrimary, marginBottom: 8 }}>
            Secure your app
          </Text>
          <Text style={{ fontSize: FontSize.md, color: textSecondary, marginBottom: Spacing.xxxl }}>
            Choose how you want to protect your personal data.
          </Text>

          <SecurityOption
            icon="🔢"
            title="4-digit PIN"
            desc="Quick and reliable access"
            selected={pinEnabled}
            onPress={() => setPinEnabled(!pinEnabled)}
            theme={theme}
          />

          {biometricAvailable && (
            <SecurityOption
              icon={biometricType === 'Face ID' ? '🧠' : '👆'}
              title={biometricType}
              desc={`Use ${biometricType} to unlock instantly`}
              selected={biometricEnabled}
              onPress={() => setBiometricEnabled(!biometricEnabled)}
              theme={theme}
            />
          )}

          <SecurityOption
            icon="🚪"
            title="No lock"
            desc="Open directly (not recommended)"
            selected={!pinEnabled && !biometricEnabled}
            onPress={() => { setPinEnabled(false); setBiometricEnabled(false); }}
            theme={theme}
          />

          <View style={{ marginTop: Spacing.xl }}>
            <Button
              label="Continue"
              onPress={() => pinEnabled ? setStep('pin_set') : setStep('goals')}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ── PIN Setup ─────────────────────────────────────────────────────────────

  if (step === 'pin_set') {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: bg }}>
        <PINPad
          title={pinStage === 'set' ? 'Create a 4-digit PIN' : 'Confirm your PIN'}
          onComplete={handlePinSet}
        />
      </SafeAreaView>
    );
  }

  // ── Goals ─────────────────────────────────────────────────────────────────

  if (step === 'goals') {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: bg }}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={{ flexGrow: 1, padding: Spacing.xl }}>
            <ProgressDots current={3} total={3} />
            <Text style={{ fontSize: 26, fontWeight: FontWeight.bold, color: textPrimary, marginBottom: 8 }}>
              Set your goals
            </Text>
            <Text style={{ fontSize: FontSize.md, color: textSecondary, marginBottom: Spacing.xxxl }}>
              These help track your progress. You can change them anytime.
            </Text>

            {[
              { label: '👟  Daily step goal', value: stepGoal, set: setStepGoal, unit: 'steps', keyboard: 'numeric' as const },
              { label: '💧  Daily water goal', value: waterGoal, set: setWaterGoal, unit: 'liters', keyboard: 'decimal-pad' as const },
              { label: '😴  Sleep goal', value: sleepGoal, set: setSleepGoal, unit: 'hours', keyboard: 'numeric' as const },
              { label: '⚖️  Weight goal', value: weightGoal, set: setWeightGoal, unit: 'kg', keyboard: 'decimal-pad' as const },
            ].map(item => (
              <View key={item.label} style={{ marginBottom: Spacing.lg }}>
                <Text style={{ fontSize: FontSize.sm, color: textSecondary, marginBottom: 6 }}>{item.label}</Text>
                <View style={{
                  flexDirection: 'row', alignItems: 'center',
                  backgroundColor: theme.surfaceAlt, borderRadius: Radius.md,
                  borderWidth: 0.5, borderColor: theme.border, height: 48,
                  paddingHorizontal: Spacing.md,
                }}>
                  <TextInput
                    style={{ flex: 1, fontSize: FontSize.lg, fontWeight: FontWeight.medium, color: textPrimary }}
                    keyboardType={item.keyboard}
                    value={item.value}
                    onChangeText={item.set}
                  />
                  <Text style={{ fontSize: FontSize.sm, color: textSecondary }}>{item.unit}</Text>
                </View>
              </View>
            ))}

            <Button label="Finish Setup 🎉" onPress={finish} loading={loading} style={{ marginTop: Spacing.lg }} />
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  return null;
}

function ProgressDots({ current, total }: { current: number; total: number }) {
  return (
    <View style={{ flexDirection: 'row', gap: 6, marginBottom: Spacing.xxxl }}>
      {Array.from({ length: total }).map((_, i) => (
        <View key={i} style={{
          height: 4, flex: i < current ? 2 : 1,
          borderRadius: 2,
          backgroundColor: i < current ? Colors.primary : '#E0E0E0',
        }} />
      ))}
    </View>
  );
}

function SecurityOption({ icon, title, desc, selected, onPress, theme }: any) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
        padding: Spacing.lg, borderRadius: Radius.lg,
        backgroundColor: selected ? Colors.primaryLight : theme.surfaceAlt,
        borderWidth: selected ? 1.5 : 0.5,
        borderColor: selected ? Colors.primary : theme.border,
        marginBottom: Spacing.md,
      }}
    >
      <Text style={{ fontSize: 28 }}>{icon}</Text>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: FontSize.base, fontWeight: FontWeight.semibold, color: selected ? Colors.primaryDark : theme.text }}>{title}</Text>
        <Text style={{ fontSize: FontSize.sm, color: selected ? Colors.primary : theme.textSecondary }}>{desc}</Text>
      </View>
      <View style={{
        width: 22, height: 22, borderRadius: 11,
        backgroundColor: selected ? Colors.primary : 'transparent',
        borderWidth: 2, borderColor: selected ? Colors.primary : theme.border,
        alignItems: 'center', justifyContent: 'center',
      }}>
        {selected && <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#fff' }} />}
      </View>
    </TouchableOpacity>
  );
}
