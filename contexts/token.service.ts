import * as SecureStore from 'expo-secure-store';

export const getAccessToken = () =>
  SecureStore.getItemAsync('access_token');

export const getRefreshToken = () =>
  SecureStore.getItemAsync('refresh_token');

export const setTokens = async (
  access: string,
  refresh: string
) => {
  await SecureStore.setItemAsync('access_token', access);
  await SecureStore.setItemAsync('refresh_token', refresh);
};

export const clearTokens = async () => {
  await SecureStore.deleteItemAsync('access_token');
  await SecureStore.deleteItemAsync('refresh_token');
};
