import * as SecureStore from "expo-secure-store";
import { User } from "../types/auth";

const TOKEN_KEY = "AUTH_TOKEN";
const USER_KEY = "AUTH_USER";

export async function saveSession(token: string, user: User) {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
  await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
}

export async function getSession(): Promise<{
  token: string;
  user: User;
} | null> {
  const token = await SecureStore.getItemAsync(TOKEN_KEY);
  const userStr = await SecureStore.getItemAsync(USER_KEY);

  if (!token || !userStr) return null;

  return {
    token,
    user: JSON.parse(userStr) as User,
  };
}

export async function clearSession() {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
  await SecureStore.deleteItemAsync(USER_KEY);
}
