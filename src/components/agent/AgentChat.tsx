import React, { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Keyboard,
  BackHandler,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { Audio } from "expo-av";
import * as Haptics from "expo-haptics";
import useAssistantSocket from "../../hooks/useAssistantSocket";
import AgentHeader from "./AgentHeader";
import MicSection from "./MicSection";
import ChatComposer from "./ChatComposer";
import HistoryModal from "./HistoryModal";
import ChatContextCard from "./ChatContextCard";

const genId = () => `${Date.now()}-${Math.random().toString(36).slice(2)}`;

export default function AgentChat({ agent, consumer, userId }: any) {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  /* ---------------- socket ---------------- */

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
    return () => socket.close();
  }, []);

  /* ---------------- back handling ---------------- */

  useEffect(() => {
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      confirmEndChat();
      return true;
    });
    return () => sub.remove();
  }, []);

  /* ---------------- send text ---------------- */

  const sendText = () => {
    if (!input.trim()) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setMessages((m) => [...m, { id: genId(), role: "user", content: input }]);
    setThinking(true);
    socket.sendText(input);
    setInput("");
  };

  /* ---------------- recording (toggle) ---------------- */

  const recordingRef = useRef<Audio.Recording | null>(null);

  const toggleRecording = async () => {
    if (recordingRef.current) {
      await recordingRef.current.stopAndUnloadAsync();
      recordingRef.current = null;
      setRecording(null);
      return;
    }

    await Audio.requestPermissionsAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });

    const rec = new Audio.Recording();
    recordingRef.current = rec;
    await rec.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
    await rec.startAsync();
    setRecording(rec);
  };

  /* ---------------- end chat ---------------- */

  const endChatAndExit = () => {
    socket.close();
    setMessages([]);
    setThinking(false);
    setRecording(null);
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

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      {/* dismiss keyboard when tapping outside */}
      <Pressable style={{ flex: 1 }} onPress={Keyboard.dismiss}>
        <View style={{ flex: 1 }}>
          <AgentHeader title={agent.agentName} onBack={confirmEndChat} />

          <MicSection
            recording={recording}
            thinking={thinking}
            onToggle={toggleRecording}
          />
        </View>
      </Pressable>

      <ChatContextCard
        messages={messages}
        onOpenHistory={() => setShowHistory(true)}
      />

      {/* composer pinned to bottom */}
      <View style={styles.composerContainer}>
        <ChatComposer value={input} onChange={setInput} onSend={sendText} />
      </View>

      <HistoryModal
        visible={showHistory}
        messages={messages}
        thinking={thinking}
        onClose={() => setShowHistory(false)}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  composerContainer: {
    paddingHorizontal: 12,
    paddingBottom: 0,
  },
  historyFloating: {
    position: "absolute",
    right: 16,
    top: "52%",
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
    zIndex: 10,
  },
});
