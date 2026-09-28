import React, { createContext, useContext, useState, useEffect } from 'react';
import { STORAGE_KEYS } from '../services/api';
import { authService, UserProfile, LoginPayload, RecyclerRegisterPayload } from '../services/auth';

interface RecyclerAuthContextType {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RecyclerRegisterPayload) => Promise<void>;
  logout: () => void;
}

const RecyclerAuthContext = createContext<RecyclerAuthContextType | undefined>(undefined);

export const RecyclerAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
        if (storedToken) {
          const userProfile = await authService.getMe(storedToken);
          if (userProfile.role === 'RECYCLER') {
            setToken(storedToken);
            setUser(userProfile);
            localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userProfile));
          } else {
            // Not a recycler account
            localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
            localStorage.removeItem(STORAGE_KEYS.USER_DATA);
            setToken(null);
            setUser(null);
          }
        } else {
          setToken(null);
          setUser(null);
        }
      } catch (e) {
        localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER_DATA);
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
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, res.access_token);
    localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(res.user));
    setToken(res.access_token);
    setUser(res.user);
  };

  const register = async (payload: RecyclerRegisterPayload) => {
    const res = await authService.registerRecycler(payload);
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, res.access_token);
    localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(res.user));
    setToken(res.access_token);
    setUser(res.user);
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);
    setToken(null);
    setUser(null);
  };

  return (
    <RecyclerAuthContext.Provider
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
    </RecyclerAuthContext.Provider>
  );
};

export const useRecyclerAuth = () => {
  const context = useContext(RecyclerAuthContext);
  if (!context) {
    throw new Error('useRecyclerAuth must be used within a RecyclerAuthProvider');
  }
  return context;
};
