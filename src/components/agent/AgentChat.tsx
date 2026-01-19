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
import ChatContextCard from "./ChatContextCard";

const genId = () => `${Date.now()}-${Math.random().toString(36).slice(2)}`;

export default function AgentChat({ agent, consumer, userId }: any) {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [showHistory, setShowHistory] = useState(false);

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
    // ---------- STOP ----------
    if (recordingRef.current) {
      const rec = recordingRef.current;
      recordingRef.current = null;
      setRecording(null);

      try {
        await rec.stopAndUnloadAsync();

        const uri = rec.getURI();
        if (!uri) return;

        // convert to blob
        const blob = await fetch(uri).then((r) => r.blob());

        // 🔑 SEND AUDIO TO WS
        socket.sendAudio(blob);

        setThinking(true);
      } catch (e) {
        console.warn("Failed to stop/send recording", e);
      }

      return;
    }

    // ---------- START ----------
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const rec = new Audio.Recording();
      recordingRef.current = rec;

      await rec.prepareToRecordAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY,
      );
      await rec.startAsync();

      setRecording(rec);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (e) {
      console.warn("Failed to start recording", e);
    }
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
      ],
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <AgentHeader title={agent.agentName} onBack={confirmEndChat} />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={{ flex: 1 }}>
          <MicSection
            recording={recording}
            thinking={thinking}
            onToggle={toggleRecording}
          />
        </View>
      </TouchableWithoutFeedback>

      <ChatContextCard
        messages={messages}
        onOpenHistory={() => setShowHistory(true)}
      />

      <ChatComposer value={input} onChange={setInput} onSend={sendText} />

      <HistoryModal
        visible={showHistory}
        messages={messages}
        thinking={thinking}
        onClose={() => setShowHistory(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({});
