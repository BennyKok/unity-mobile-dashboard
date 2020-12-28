import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

const CLOUD_BUILD_API_KEY = 'CLOUD_BUILD_API_KEY';


 export default class StoreUtils {
  static loadApiKey = async (callback?: (value: string | null) => any): Promise<string> => {
    try {
      const credentials = await SecureStore.getItemAsync(CLOUD_BUILD_API_KEY);
      if (callback != null)
        callback(credentials);
      if (credentials) {
        return credentials;
      }
    } catch (e) {
      if (callback != null)
        callback(null);
      console.log(e);
    }
    return '';
  };
  static removeApiKey = async (callback: () => any) => {
    try {
      await SecureStore.deleteItemAsync(CLOUD_BUILD_API_KEY);
      callback();
    } catch (e) {
      console.log(e);
    }
  };
  static setApiKey = async (apiKey: string, callback: () => any) => {
    if (apiKey) {
      await SecureStore.setItemAsync(CLOUD_BUILD_API_KEY, apiKey);
      callback();
    }
  };
  static storePinnedProject = async (value: string[]) => {
    try {
      const jsonValue = JSON.stringify(value)
      await AsyncStorage.setItem('@pinnedProject', jsonValue)
    } catch (e) {
      // saving error
    }
  }
  static getPinnedProject = async (): Promise<string[]> => {
    try {
      const value = await AsyncStorage.getItem('@pinnedProject')
      if (value !== null) {
        return JSON.parse(value);
      }
    } catch (e) {
      // error reading value
    }
    return [];
  }
}


