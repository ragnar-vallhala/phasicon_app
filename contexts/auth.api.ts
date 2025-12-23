import api from './axios.instance';
import { LoginResponse } from './auth.types';
import { saveCredentials, getCredentials, clearCredentials } from './credential.service';

/* ---------------- LOGIN ---------------- */

export const loginAPI = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  const { data } = await api.post('/auth/login', { email, password });
  await saveCredentials(email, password);
  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    user: data.user,
  };
};

/* ---------------- SIGNUP ---------------- */

export const signupAPI = async (
  email: string,
  password: string
) => {
  const { data } = await api.post('/auth/register', {
    email,
    password,
  });
  // expects: { next_step: "verify_otp" }
  await saveCredentials(email, password);
  return data;
};

/* ---------------- VERIFY OTP ---------------- */

export const verifyOTPAPI = async (
  email: string,
  otp: string
) => {
  const { data } = await api.post('/auth/verify-otp', {
    email,
    otp,
  });

  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    user: data.user,
  };
};

export const autoLoginAPI = async (): Promise<LoginResponse | null> => {
  const credentials = await getCredentials();
  
  if (!credentials) {
    return null;
  }
  
  try {
    const { data } = await api.post('/auth/login', {
      email: credentials.email,
      password: credentials.password,
    });
    
    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      user: data.user,
    };
  } catch (error) {
    // If auto-login fails, clear stored credentials
    await clearCredentials();
    return null;
  }
};