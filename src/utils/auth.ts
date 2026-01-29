import * as Crypto from "expo-crypto";

export function createAuthState(
  consumer: any,
  assistantId: string,
  assistant: any,
  role: any,
  platformType: string,
  seoName: string | any,
  isConfigRequired: boolean | any,
  extUserId: any | null,
  source: any,
) {
  return btoa(
    JSON.stringify({
      uuid: consumer.uuid,
      userId: consumer.userId,
      assistantId,
      assistant,
      seoName,
      role,
      isConfigRequired,
      platformType,
      timestamp: Date.now(),
      nonce: Crypto.randomUUID(),
      extUserId,
      source,
    }),
  );
}
