import React, { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  BackHandler,
  Alert,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { router } from "expo-router";
import { Audio } from "expo-av";
import * as Haptics from "expo-haptics";
import useAssistantSocket from "../../hooks/useAssistantSocket";
import AgentHeader from "./AgentHeader";
import MicSection from "./MicSection";
import ChatComposer from "./ChatComposer";
import HistoryModal from "./HistoryModal";
import useTheme from "../../hooks/useTheme";

const genId = () => `${Date.now()}-${Math.random().toString(36).slice(2)}`;

export default function AgentChat({ agent, consumer, userId }: any) {
  const { theme } = useTheme();

  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [isRecording, setIsRecording] = useState<Audio.Recording | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  const recordingRef = useRef<Audio.Recording | null>(null);
  const stoppingRef = useRef(false);
  const startedAtRef = useRef(0);

  const socket = useAssistantSocket({
    agent,
    consumer,
    userId,
    onMessage: (data: any) => {
      if (data?.type !== "ConversationText") return;

      const { role, content, from } = data.message;

      if (from === "transcriber") {
        setInput((p) => (p ? `${p} ${content}` : content));
        return;
      }

      setMessages((m) => [...m, { id: genId(), role, content }]);
      if (role === "assistant") setThinking(false);
    },
  });

  useEffect(() => {
    socket.connect();
    return () => {
      socket.close();
    };
  }, [agent?.id]);

  useEffect(() => {
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      confirmEndChat();
      return true;
    });
    return () => sub.remove();
  }, []);

  const sendText = () => {
    if (!input.trim()) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setMessages((m) => [...m, { id: genId(), role: "user", content: input }]);
    setThinking(true);
    socket.sendText(input);
    setInput("");
  };

  const startRecording = async () => {
    if (recordingRef.current || stoppingRef.current) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const rec = new Audio.Recording();
      recordingRef.current = rec;
      startedAtRef.current = Date.now();

      await rec.prepareToRecordAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      await rec.startAsync();

      setIsRecording(rec);
    } catch {}
  };

  const stopRecording = async () => {
    const rec = recordingRef.current;
    if (!rec || stoppingRef.current) return;
    stoppingRef.current = true;

    try {
      await rec.stopAndUnloadAsync().catch(() => {});
      const duration = Date.now() - startedAtRef.current;

      if (duration < 300) return;

      const uri = rec.getURI();
      if (!uri) return;

      const blob = await fetch(uri).then((r) => r.blob());
      socket.sendAudio(blob);
    } finally {
      recordingRef.current = null;
      stoppingRef.current = false;
      startedAtRef.current = 0;
      setIsRecording(null);
    }
  };

  const endChatAndExit = () => {
    try {
      recordingRef.current?.stopAndUnloadAsync();
    } catch {}
    socket.close();
    setMessages([]);
    setThinking(false);
    setIsRecording(null);
    router.replace("/(tabs)/home");
  };

  const confirmEndChat = () => {
    Alert.alert(
      "End this assistant session?",
      "Your current conversation will be cleared.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Back", style: "destructive", onPress: endChatAndExit },
      ]
    );
  };

  const toggleRecording = async () => {
    if (recordingRef.current) {
      await stopRecording();
    } else {
      await startRecording();
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={{ flex: 1, backgroundColor: theme.background }}>
        <AgentHeader title={agent.agentName} onBack={confirmEndChat} />

        <View style={styles.micSection}>
          <MicSection
            recording={isRecording}
            thinking={thinking}
            onToggle={toggleRecording}
          />
        </View>

        <View style={styles.composerSection}>
          <ChatComposer
            value={input}
            onChange={setInput}
            onSend={sendText}
            onHistory={() => setShowHistory(true)}
          />
        </View>

        <HistoryModal
          visible={showHistory}
          messages={messages}
          thinking={thinking}
          onClose={() => setShowHistory(false)}
        />
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {},

  micSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  composerSection: {
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === "ios" ? 24 : 16,
  },
});
