import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../config/api';
import { authService, UserProfile, LoginPayload, CollectorRegisterPayload } from '../services/auth';

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: CollectorRegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Validate session on app launch
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = await AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
        if (storedToken) {
          // Validate token with real backend
          const userProfile = await authService.getMe(storedToken);
          setToken(storedToken);
          setUser(userProfile);
          await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userProfile));
        } else {
          setToken(null);
          setUser(null);
        }
      } catch (error) {
        // Token invalid or expired - clear stored auth session
        await AsyncStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
        await AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA);
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (payload: LoginPayload) => {
    const res = await authService.login(payload);
    await AsyncStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, res.access_token);
    await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(res.user));
    setToken(res.access_token);
    setUser(res.user);
  };

  const register = async (payload: CollectorRegisterPayload) => {
    const res = await authService.registerCollector(payload);
    await AsyncStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, res.access_token);
    await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(res.user));
    setToken(res.access_token);
    setUser(res.user);
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
      await AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA);
    } catch (e) {
      // Ignore cleanup error
    } finally {
      setToken(null);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
