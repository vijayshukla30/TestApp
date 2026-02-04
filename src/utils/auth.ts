import * as Crypto from "expo-crypto";

export function createAuthState(
  consumer: any,
  assistant: any,
  role: any,
  platformType: string,
  isConfigRequired: boolean | any,
  extUserId: any | null,
  source: any,
) {
  console.log("consumer :>> ", consumer);
  console.log("assistantId :>> ", assistant.uuid);
  console.log("role :>> ", role);
  console.log("platformType :>> ", platformType);
  console.log("seoName :>> ", assistant.seoName);
  console.log("isConfigRequired :>> ", isConfigRequired);
  console.log("extUserId :>> ", extUserId);
  console.log("source :>> ", source);

  const data = JSON.stringify({
    uuid: consumer.uuid,
    userId: consumer.userId,
    assistantId: assistant.uuid,
    assistant,
    seoName: assistant.seoName,
    role,
    isConfigRequired,
    platformType,
    timestamp: Date.now(),
    nonce: Crypto.randomUUID(),
    extUserId,
    source,
  });
  console.log("data :>> ", data);
  return btoa(data);
}

export function decodeAuthState(raw?: string) {
  if (!raw) return null;

  // Be resilient to URL decoding quirks (+ vs space) and base64url variants.
  const normalized = raw.replace(/ /g, "+");

  let decoded = normalized;
  try {
    decoded = decodeURIComponent(normalized);
  } catch {
    // If it's already decoded, keep as-is.
  }

  let base64 = decoded.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4 !== 0) {
    base64 += "=";
  }

  const json = atob(base64);
  return JSON.parse(json);
}
