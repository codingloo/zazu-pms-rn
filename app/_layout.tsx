import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { ThemeProvider, useTheme } from '../context/ThemeContext';
import { setupDatabase } from '../db/database';
import { Colors } from '../constants/theme';

// Screens imported directly — avoids expo-router dynamic resolution issues
import OnboardingScreen from './onboarding';
import LockScreen from './lock';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <RootNavigator />
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

function RootNavigator() {
  const { isAuthenticated, isFirstLaunch, isLoading } = useAuth();
  const { isDark } = useTheme();
  const [dbReady, setDbReady] = useState(false);

  useEffect(() => {
    try {
      setupDatabase();
    } catch (e) {
      console.warn('DB setup error:', e);
    } finally {
      setDbReady(true);
    }
  }, []);

  if (isLoading || !dbReady) {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.primaryDeep, alignItems: 'center', justifyContent: 'center' }}>
        <StatusBar style="light" />
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  if (isFirstLaunch) {
    return (
      <>
        <StatusBar style="light" />
        <OnboardingScreen />
      </>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <StatusBar style={isDark ? 'light' : 'dark'} />
        <LockScreen />
      </>
    );
  }

  // Authenticated — show the main app via Stack
  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'none',
          contentStyle: { backgroundColor: 'transparent' },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="health/log" />
        <Stack.Screen name="health/charts" />
        <Stack.Screen name="health/history" />
        <Stack.Screen name="finance/index" />
        <Stack.Screen name="plans/index" />
        <Stack.Screen name="settings" />
      </Stack>
    </>
  );
}
