import * as Crypto from "expo-crypto";

const API_BASE_URL = process.env.EXPO_API_BASE_URL;

export function createAuthState(
  consumer: any,
  assistantId: string,
  platformType: string,
  seoName: string | any
) {
  return btoa(
    JSON.stringify({
      uuid: consumer.uuid,
      userId: consumer.userId,
      assistantId,
      seoName,
      platformType,
      timestamp: Date.now(),
      nonce: Crypto.randomUUID(),
    })
  );
}
