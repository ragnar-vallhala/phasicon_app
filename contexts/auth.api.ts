import api from './axios.instance';
import { LoginResponse } from './auth.types';

/* ---------------- LOGIN ---------------- */

export const loginAPI = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  const { data } = await api.post('/auth/login', { email, password });

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
  console.log(data);
  
  // expects: { next_step: "verify_otp" }
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
