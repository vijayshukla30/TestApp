import * as Crypto from "expo-crypto";

export function createAuthState(
  consumer: any,
  assistantId: string,
  platformType: string,
  seoName: string | any,
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
    }),
  );
}
