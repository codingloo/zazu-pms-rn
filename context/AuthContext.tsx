import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as SecureStore from 'expo-secure-store';
import * as LocalAuthentication from 'expo-local-authentication';
import { UserProfile, defaultProfile } from '../constants/types';

const PROFILE_KEY = 'pm_user_profile';
const PIN_KEY = 'pm_user_pin';

interface AuthContextType {
  profile: UserProfile | null;
  isAuthenticated: boolean;
  isFirstLaunch: boolean;
  isLoading: boolean;
  biometricAvailable: boolean;
  biometricType: string;
  setupProfile: (profile: UserProfile, pin?: string) => Promise<void>;
  login: (pin?: string) => Promise<boolean>;
  loginWithBiometric: () => Promise<boolean>;
  logout: () => void;
  updateProfile: (profile: UserProfile) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isFirstLaunch, setIsFirstLaunch] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [biometricType, setBiometricType] = useState('Biometric');

  useEffect(() => { initialize(); }, []);

  async function initialize() {
    try {
      // Check biometrics
      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      if (compatible && enrolled) {
        setBiometricAvailable(true);
        const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
        if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
          setBiometricType('Face ID');
        } else if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
          setBiometricType('Fingerprint');
        }
      }

      // Load saved profile
      const raw = await SecureStore.getItemAsync(PROFILE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as UserProfile;
        setProfile(parsed);
        setIsFirstLaunch(false);
        // Auto-login if no security set
        if (!parsed.pinEnabled && !parsed.biometricEnabled) {
          setIsAuthenticated(true);
        }
      } else {
        setIsFirstLaunch(true);
      }
    } catch (e) {
      console.warn('Auth init error:', e);
      setIsFirstLaunch(true);
    } finally {
      setIsLoading(false);
    }
  }

  const setupProfile = useCallback(async (newProfile: UserProfile, pin?: string) => {
    try {
      await SecureStore.setItemAsync(PROFILE_KEY, JSON.stringify(newProfile));
      if (pin) await SecureStore.setItemAsync(PIN_KEY, pin);
      setProfile(newProfile);
      setIsAuthenticated(true);
      setIsFirstLaunch(false);
    } catch (e) {
      console.warn('setupProfile error:', e);
    }
  }, []);

  const login = useCallback(async (pin?: string): Promise<boolean> => {
    if (!profile) return false;
    if (!profile.pinEnabled) {
      setIsAuthenticated(true);
      return true;
    }
    if (pin) {
      try {
        const stored = await SecureStore.getItemAsync(PIN_KEY);
        if (stored === pin) {
          setIsAuthenticated(true);
          return true;
        }
      } catch (e) {
        console.warn('login error:', e);
      }
      return false;
    }
    return false;
  }, [profile]);

  const loginWithBiometric = useCallback(async (): Promise<boolean> => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Unlock Personal Manager',
        fallbackLabel: 'Use PIN',
        disableDeviceFallback: false,
      });
      if (result.success) {
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  }, []);

  const logout = useCallback(() => setIsAuthenticated(false), []);

  const updateProfile = useCallback(async (updated: UserProfile) => {
    try {
      await SecureStore.setItemAsync(PROFILE_KEY, JSON.stringify(updated));
      setProfile(updated);
    } catch (e) {
      console.warn('updateProfile error:', e);
    }
  }, []);

  return (
    <AuthContext.Provider value={{
      profile, isAuthenticated, isFirstLaunch, isLoading,
      biometricAvailable, biometricType,
      setupProfile, login, loginWithBiometric, logout, updateProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
