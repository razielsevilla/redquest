import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const isWeb = Platform.OS === 'web';

export const setItem = async (key, value) => {
  try {
    if (isWeb) {
      localStorage.setItem(key, value);
      return;
    }
    
    if (SecureStore.setItemAsync) {
      await SecureStore.setItemAsync(key, value);
    } else {
      console.warn('SecureStore.setItemAsync is not available, falling back to localStorage');
      localStorage.setItem(key, value);
    }
  } catch (error) {
    console.error('Error in storage.setItem:', error);
    if (isWeb) {
      localStorage.setItem(key, value);
    }
  }
};

export const getItem = async (key) => {
  try {
    if (isWeb) {
      return localStorage.getItem(key);
    }
    
    if (SecureStore.getItemAsync) {
      return await SecureStore.getItemAsync(key);
    } else {
      console.warn('SecureStore.getItemAsync is not available, falling back to localStorage');
      return localStorage.getItem(key);
    }
  } catch (error) {
    console.error('Error in storage.getItem:', error);
    return isWeb ? localStorage.getItem(key) : null;
  }
};

export const deleteItem = async (key) => {
  try {
    if (isWeb) {
      localStorage.removeItem(key);
      return;
    }
    
    if (SecureStore.deleteItemAsync) {
      await SecureStore.deleteItemAsync(key);
    } else {
      console.warn('SecureStore.deleteItemAsync is not available, falling back to localStorage');
      localStorage.removeItem(key);
    }
  } catch (error) {
    console.error('Error in storage.deleteItem:', error);
    if (isWeb) {
      localStorage.removeItem(key);
    }
  }
};
