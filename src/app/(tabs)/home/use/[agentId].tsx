import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Audio } from "expo-av";
import { useLocalSearchParams } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

import Screen from "../../../../components/Screen";
import useTheme from "../../../../hooks/useTheme";
import AppCard from "../../../../components/ui/AppCard";
import { Agent } from "../../../../types/agent";
import VoiceRecorder from "../../../../components/voice/VoiceRecorder";

export default function AgentUse() {
  const { theme } = useTheme();
  const params = useLocalSearchParams();

  const agent: Agent | null = params.agent
    ? JSON.parse(params.agent as string)
    : null;

  if (!agent) {
    return (
      <Screen>
        <Text style={{ color: theme.text }}>Agent not found</Text>
      </Screen>
    );
  }

  const sendAudio = async (uri: string) => {
    const formData = new FormData();
    console.log("uri :>> ", uri);
    formData.append("file", {
      uri,
      name: "voice.mp3",
      type: "audio/mpeg",
    } as any);

    // await fetch("YOUR_API_URL", {
    //   method: "POST",
    //   headers: {
    //     Authorization: `Bearer ${token}`,
    //   },
    //   body: formData,
    // });
  };

  return (
    <Screen center>
      <Text style={[styles.agentName, { color: theme.text }]}>
        {agent.agentName}
      </Text>

      <VoiceRecorder onSend={sendAudio} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  agentName: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 32,
    textAlign: "center",
  },
  micCard: {
    alignItems: "center",
    paddingVertical: 40,
  },
  micButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  micText: {
    marginTop: 20,
    fontSize: 14,
  },
});
