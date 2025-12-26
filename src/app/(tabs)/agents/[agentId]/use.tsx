import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Audio } from "expo-av";
import { useLocalSearchParams } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

import Screen from "../../../../components/Screen";
import useTheme from "../../../../hooks/useTheme";
import AppCard from "../../../../components/ui/AppCard";
import { Agent } from "../../../../types/agent";

export default function AgentUse() {
  const { theme } = useTheme();
  const params = useLocalSearchParams();

  const agent: Agent | null = params.agent
    ? JSON.parse(params.agent as string)
    : null;

  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    return () => {
      recording?.stopAndUnloadAsync();
    };
  }, [recording]);

  if (!agent) {
    return (
      <Screen>
        <Text style={{ color: theme.text }}>Agent not found</Text>
      </Screen>
    );
  }

  const startRecording = async () => {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      setRecording(recording);
      setIsRecording(true);
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  };

  const stopRecording = async () => {
    try {
      if (!recording) return;

      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();

      setIsRecording(false);
      setRecording(null);

      if (uri) {
        uploadAudio(uri);
      }
    } catch (err) {
      console.error("Failed to stop recording", err);
    }
  };

  const uploadAudio = async (uri: string) => {
    const formData = new FormData();

    formData.append("audio", {
      uri,
      name: "voice.m4a",
      type: "audio/m4a",
    } as any);

    try {
      await fetch("https://api.heygennie.com/api/v1/voice", {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });
    } catch (err) {
      console.error("Upload failed", err);
    }
  };

  return (
    <Screen center>
      <Text style={[styles.agentName, { color: theme.text }]}>
        {agent.agentName}
      </Text>

      <AppCard style={styles.micCard}>
        <Pressable
          onPress={isRecording ? stopRecording : startRecording}
          style={[
            styles.micButton,
            { backgroundColor: isRecording ? "#EF4444" : theme.primary },
          ]}
        >
          <MaterialIcons
            name={isRecording ? "stop" : "mic"}
            size={56}
            color="#fff"
          />
        </Pressable>

        <Text style={[styles.micText, { color: theme.subText }]}>
          {isRecording ? "Listening..." : "Tap to speak"}
        </Text>
      </AppCard>
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
