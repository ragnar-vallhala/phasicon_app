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
} from './auth.api';
import { setTokens, clearTokens } from './token.service';
import { User } from './auth.types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: ( email: string, password: string) => Promise<any>;
  verifyOTP: (email: string, otp: string) => Promise<any>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /* ---------------- APP BOOTSTRAP ---------------- */

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
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
    } finally {
      setIsLoading(false);
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
      setIsLoading(false); // 🔥 THIS WAS MISSING
    }
  };

  /* ---------------- SIGNUP ---------------- */

  const signup = async (email: string, password: string) => {
    return signupAPI(email, password);
  };

  /* ---------------- OTP ---------------- */

  const verifyOTP = async (email: string, otp: string) => {
    return verifyOTPAPI(email, otp);
  };

  /* ---------------- LOGOUT ---------------- */

  const logout = async () => {
    setIsLoading(true);
    try {
      await clearTokens();
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
        isLoading,
        isAuthenticated: !!user,
        login,
        signup,
        verifyOTP,
        logout,
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
