import * as Crypto from "expo-crypto";

const API_BASE_URL = process.env.EXPO_API_BASE_URL;

export function createAuthState(
  consumer: { uuid: string; userId: string },
  assistantId: string
) {
  return btoa(
    JSON.stringify({
      uuid: consumer.uuid,
      userId: consumer.userId,
      assistantId,
      timestamp: Date.now(),
      nonce: Crypto.randomUUID(),
    })
  );
}

export function buildAuthUrl(assistantId: string, state: string) {
  return `${API_BASE_URL}/general-auth/auth/${assistantId}?state=${encodeURIComponent(
    state
  )}`;
}
