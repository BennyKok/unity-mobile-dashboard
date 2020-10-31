import * as SecureStore from 'expo-secure-store';

const CLOUD_BUILD_API_KEY = 'CLOUD_BUILD_API_KEY';

export const loadApiKey = async (callback?: (value: string | null) => any): Promise<string> => {
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
export const removeApiKey = async (callback: () => any) => {
  try {
    await SecureStore.deleteItemAsync(CLOUD_BUILD_API_KEY);
    callback();
  } catch (e) {
    console.log(e);
  }
};
export const setApiKey = async (apiKey: string, callback: () => any) => {
  if (apiKey) {
    await SecureStore.setItemAsync(CLOUD_BUILD_API_KEY, apiKey);
    callback();
  }
};
