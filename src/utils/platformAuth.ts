import * as Linking from "expo-linking";
import { Agent } from "../types/agent";
import { createAuthState } from "./auth";

export const handlePlatformAuth = async ({
  assistant,
  consumer,
  user,
}: {
  assistant: Agent;
  consumer: any;
  user: any;
}) => {
  if (!consumer?.uuid) {
    throw new Error("Consumer missing");
  }

  console.log("assistant.platform :>> ", assistant.platform);
  const platformType = assistant.platform?.type?.toLowerCase() || "custom";

  const serverBase = process.env.EXPO_PUBLIC_API_BASE_URL;
  if (!serverBase) {
    throw new Error("Auth base URLs is not defined");
  }

  const state = createAuthState(
    consumer,
    assistant,
    user?.role,
    platformType,
    assistant.platform?.isConfigRequired,
    null,
    "mobile",
  );

  console.log("state install agent :>> ", state);

  let url = `${serverBase}/general-auth/auth/${
    assistant.uuid
  }?state=${encodeURIComponent(state)}`;

  if (platformType.includes("slack")) {
    url = `${serverBase}/slack/auth/${state}`;
  }
  if (platformType.includes("trello")) {
    url = `${serverBase}/trello/auth/${state}`;
  }

  await Linking.openURL(url);
};
