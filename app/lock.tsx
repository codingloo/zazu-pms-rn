import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { PINPad } from '../components/ui/UIComponents';
import { Colors, FontSize, FontWeight, Spacing, Shadow } from '../constants/theme';

export default function LockScreen() {
  const { theme } = useTheme();
  const { profile, login, loginWithBiometric, biometricAvailable, biometricType } = useAuth();
  const [attempts, setAttempts] = useState(0);
  const [locked, setLocked] = useState(false);
  const [lockTimer, setLockTimer] = useState(0);

  useEffect(() => {
    // Auto-attempt biometric on mount if enabled
    if (profile?.biometricEnabled && biometricAvailable) {
      setTimeout(() => tryBiometric(), 500);
    }
  }, []);

  useEffect(() => {
    if (locked && lockTimer > 0) {
      const t = setTimeout(() => setLockTimer(n => n - 1), 1000);
      return () => clearTimeout(t);
    }
    if (lockTimer === 0) setLocked(false);
  }, [locked, lockTimer]);

  async function tryBiometric() {
    const ok = await loginWithBiometric();
    if (!ok && attempts >= 2) {
      // fall through to PIN
    }
  }

  async function handlePin(pin: string) {
    if (locked) return;
    const ok = await login(pin);
    if (!ok) {
      const next = attempts + 1;
      setAttempts(next);
      if (next >= 5) {
        setLocked(true);
        setLockTimer(30);
        Alert.alert('Too many attempts', 'Please wait 30 seconds before trying again.');
      } else {
        Alert.alert('Incorrect PIN', `${5 - next} attempts remaining.`);
      }
    }
  }

  const initials = profile?.avatarInitials || '??';
  const name = profile?.name || 'User';

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing.xl }}>
        {/* Avatar */}
        <View style={{
          width: 72, height: 72, borderRadius: 36,
          backgroundColor: Colors.primaryLight,
          alignItems: 'center', justifyContent: 'center',
          borderWidth: 2.5, borderColor: Colors.primary,
          marginBottom: Spacing.md,
          ...Shadow.md,
        }}>
          <Text style={{ fontSize: FontSize.xxl, fontWeight: FontWeight.bold, color: Colors.primaryDark }}>
            {initials}
          </Text>
        </View>

        <Text style={{ fontSize: FontSize.lg, fontWeight: FontWeight.semibold, color: theme.text, marginBottom: 4 }}>
          Welcome back, {name.split(' ')[0]}
        </Text>
        <Text style={{ fontSize: FontSize.sm, color: theme.textSecondary, marginBottom: Spacing.xxxl }}>
          Personal Manager
        </Text>

        {locked ? (
          <View style={{ alignItems: 'center', padding: Spacing.xl }}>
            <Text style={{ fontSize: 40, marginBottom: Spacing.md }}>🔒</Text>
            <Text style={{ fontSize: FontSize.lg, fontWeight: FontWeight.semibold, color: theme.text }}>
              App locked
            </Text>
            <Text style={{ fontSize: FontSize.md, color: theme.textSecondary, marginTop: 6 }}>
              Try again in {lockTimer}s
            </Text>
          </View>
        ) : (
          <>
            {profile?.pinEnabled && (
              <PINPad title="Enter PIN to unlock" onComplete={handlePin} />
            )}

            {profile?.biometricEnabled && biometricAvailable && (
              <TouchableOpacity
                onPress={tryBiometric}
                style={{
                  flexDirection: 'row', alignItems: 'center', gap: 8,
                  backgroundColor: Colors.primaryLight,
                  paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md,
                  borderRadius: 999, borderWidth: 1, borderColor: Colors.primary,
                  marginTop: Spacing.lg,
                }}
              >
                <Text style={{ fontSize: 20 }}>{biometricType === 'Face ID' ? '🧠' : '👆'}</Text>
                <Text style={{ fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: Colors.primaryDark }}>
                  Use {biometricType}
                </Text>
              </TouchableOpacity>
            )}
          </>
        )}
      </View>
    </SafeAreaView>
  );
}
