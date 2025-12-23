// services/credential.service.ts
import * as SecureStore from 'expo-secure-store';

const CREDENTIALS_KEY = 'user_credentials';

export interface StoredCredentials {
  email: string;
  password: string;
}

export const saveCredentials = async (email: string, password: string) => {
  try {
    const credentials: StoredCredentials = { email, password };
    await SecureStore.setItemAsync(CREDENTIALS_KEY, JSON.stringify(credentials));
  } catch (error) {
    console.error('Failed to save credentials:', error);
  }
};

export const getCredentials = async (): Promise<StoredCredentials | null> => {
  try {
    const json = await SecureStore.getItemAsync(CREDENTIALS_KEY);
    return json ? JSON.parse(json) : null;
  } catch (error) {
    console.error('Failed to get credentials:', error);
    return null;
  }
};

export const clearCredentials = async () => {
  try {
    await SecureStore.deleteItemAsync(CREDENTIALS_KEY);
  } catch (error) {
    console.error('Failed to clear credentials:', error);
  }
};