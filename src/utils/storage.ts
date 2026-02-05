import * as SecureStore from "expo-secure-store";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { RecordingItem } from "../types/recording";

const KEY = "RECORDINGS";
const THEME_KEY = "APP_THEME";

export type ThemeMode = "light" | "dark";

export async function saveTheme(mode: ThemeMode) {
  await SecureStore.setItemAsync(THEME_KEY, mode);
}

export async function getTheme(): Promise<ThemeMode | null> {
  const value = await SecureStore.getItemAsync(THEME_KEY);
  if (value === "light" || value === "dark") {
    return value;
  }
  return null;
}

export async function getRecordings(): Promise<RecordingItem[]> {
  const raw = await AsyncStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : [];
}

export async function saveRecording(rec: RecordingItem) {
  const list = await getRecordings();
  await AsyncStorage.setItem(KEY, JSON.stringify([rec, ...list]));
}
export async function setRecordings(list: any[]) {
  await AsyncStorage.setItem(KEY, JSON.stringify(list));
}
