// contexts/AuthContext.tsx
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  loginAPI,
  signupAPI,
  verifyOTPAPI,
  autoLoginAPI,
} from './auth.api';
import { setTokens, clearTokens } from './token.service';
import { User } from './auth.types';
import { clearCredentials } from './credential.service';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<any>;
  verifyOTP: (email: string, otp: string) => Promise<any>;
  logout: () => Promise<void>;
  autoLogin: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitializing, setIsInitializing] = useState(true);

  /* ---------------- APP BOOTSTRAP ---------------- */

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      // Try auto-login first
      const success = await autoLogin();
      
      if (!success) {
        // If auto-login fails, check for existing session
        await loadExistingSession();
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
      setIsInitializing(false);
    }
  };

  const loadExistingSession = async () => {
    try {
      const userData = await AsyncStorage.getItem('user_data');
      const accessToken = await AsyncStorage.getItem('access_token');

      if (userData && accessToken) {
        setUser(JSON.parse(userData));
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    }
  };

  /* ---------------- AUTO LOGIN ---------------- */

  const autoLogin = async (): Promise<boolean> => {
    try {
      const result = await autoLoginAPI();
      
      if (result) {
        await setTokens(result.accessToken, result.refreshToken);
        await AsyncStorage.setItem('user_data', JSON.stringify(result.user));
        setUser(result.user);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Auto-login failed:', error);
      return false;
    }
  };

  /* ---------------- LOGIN ---------------- */

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { accessToken, refreshToken, user } =
        await loginAPI(email, password);

      await setTokens(accessToken, refreshToken);
      await AsyncStorage.setItem('user_data', JSON.stringify(user));
      setUser(user);
    } catch (err: any) {
      setUser(null);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /* ---------------- SIGNUP ---------------- */

  const signup = async (email: string, password: string) => {
    return signupAPI(email, password);
  };

  /* ---------------- OTP ---------------- */

  const verifyOTP = async (email: string, otp: string) => {
    setIsLoading(true);
    try {
      const { accessToken, refreshToken, user } = await verifyOTPAPI(email, otp);
      
      await setTokens(accessToken, refreshToken);
      await AsyncStorage.setItem('user_data', JSON.stringify(user));
      setUser(user);
      return { success: true };
    } catch (err: any) {
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /* ---------------- LOGOUT ---------------- */

  const logout = async () => {
    setIsLoading(true);
    try {
      await clearTokens();
      await clearCredentials();
      await AsyncStorage.removeItem('user_data');
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading: isLoading || isInitializing, // Show loading during initialization too
        isAuthenticated: !!user,
        login,
        signup,
        verifyOTP,
        logout,
        autoLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return ctx;
};