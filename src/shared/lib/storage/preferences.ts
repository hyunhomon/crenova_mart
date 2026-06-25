import AsyncStorage from '@react-native-async-storage/async-storage';

export async function getPreference<T>(key: string, fallback: T): Promise<T> {
  const rawValue = await AsyncStorage.getItem(key);

  if (!rawValue) {
    return fallback;
  }

  try {
    return JSON.parse(rawValue) as T;
  } catch {
    return fallback;
  }
}

export async function setPreference<T>(key: string, value: T) {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

export async function removePreference(key: string) {
  await AsyncStorage.removeItem(key);
}
