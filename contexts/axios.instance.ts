// api/axios.instance.ts
import axios from 'axios';
import {
  getAccessToken,
  getRefreshToken,
  setTokens,
  clearTokens,
} from './token.service';
import { clearCredentials } from './credential.service';

const API_URL = 'http://72.60.102.111:8080';
const AUTH_BASE_URL = 'http://72.60.102.111:8080';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

/* ---------------- REQUEST INTERCEPTOR ---------------- */

api.interceptors.request.use(async config => {
  const token = await getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/* ---------------- RESPONSE INTERCEPTOR ---------------- */

api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = await getRefreshToken();
        
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        // Call refresh endpoint
        const response = await axios.post(`${AUTH_BASE_URL}/auth/refresh`, {
          refresh_token: refreshToken,
        });

        const { access_token, message } = response.data;

        if (!access_token) {
          throw new Error('Invalid token response from server');
        }

        // IMPORTANT: Backend only returns access_token, not refresh_token
        // So we keep the existing refresh token
        await setTokens(access_token, refreshToken); // Use same refresh token

        // Process queued requests with new token
        processQueue(null, access_token);

        // Retry original request
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return api(originalRequest);

      } catch (refreshError) {
        // Refresh failed - clear everything and logout
        processQueue(refreshError as Error, null);
        
        await Promise.all([
          clearTokens(),
          clearCredentials(),
        ]);

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;