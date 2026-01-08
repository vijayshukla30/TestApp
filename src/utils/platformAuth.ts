import * as Linking from "expo-linking";
import { Agent } from "../types/agent";
import { createAuthState } from "./auth";

export const handlePlatformAuth = async ({
  assistant,
  consumer,
}: {
  assistant: Agent;
  consumer: any;
}) => {
  if (!consumer?.uuid) {
    throw new Error("Consumer missing");
  }

  const platformType = assistant.platform?.type?.toLowerCase() || "custom";

  const serverBase = process.env.EXPO_PUBLIC_API_BASE_URL;
  if (!serverBase) {
    throw new Error("Auth base URLs is not defined");
  }

  const state = createAuthState(
    consumer,
    assistant.uuid,
    platformType,
    assistant.seoName
  );
  let url = `${serverBase}?state=${encodeURIComponent(state)}`;

  if (platformType.includes("slack")) {
    url = `${serverBase}/slack/auth/${state}`;
  }
  if (platformType.includes("trello")) {
    url = `${serverBase}/trello/auth/${state}`;
  }

  await Linking.openURL(url);
};
