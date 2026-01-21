import React, {
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import { View, Keyboard, TouchableWithoutFeedback } from "react-native";
import { Audio } from "expo-av";
import * as Haptics from "expo-haptics";

import useAssistantSocket from "../../hooks/useAssistantSocket";
import MicSection from "./MicSection";
import ChatComposer from "./ChatComposer";
import HistoryModal from "./HistoryModal";
import ChatContextCard from "./ChatContextCard";

const genId = () => `${Date.now()}-${Math.random().toString(36).slice(2)}`;

type Props = {
  agent: any;
  consumer: any;
  userId?: string;
};

export type AgentChatRef = {
  end: () => void;
};

function AgentChat({ agent, consumer, userId }: Props, ref: any) {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  const recordingRef = useRef<Audio.Recording | null>(null);

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

  useEffect(() => {
    if (!thinking) return;

    const timeout = setTimeout(() => {
      console.warn("Thinking timeout — resetting state");
      setThinking(false);
    }, 10_000); // 12 seconds max

    return () => clearTimeout(timeout);
  }, [thinking]);

  const cleanup = () => {
    socket.close();
    setMessages([]);
    setThinking(false);
    setRecording(null);
    recordingRef.current = null;
  };

  useImperativeHandle(ref, () => ({
    end: cleanup,
  }));

  const sendText = () => {
    if (!input.trim()) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setMessages((m) => [...m, { id: genId(), role: "user", content: input }]);
    setThinking(true);
    socket.sendText(input);
    setInput("");
  };

  const toggleRecording = async () => {
    console.log("thinking :>> ", thinking);
    if (thinking) return;

    if (recordingRef.current) {
      const rec = recordingRef.current;
      recordingRef.current = null;
      setRecording(null);

      try {
        await rec.stopAndUnloadAsync();
        const uri = rec.getURI();
        if (!uri) {
          setThinking(false);
          return;
        }

        const blob = await fetch(uri).then((r) => r.blob());
        console.log("blob.size :>> ", blob.size);
        if (blob.size < 2000) {
          setThinking(false);
          return;
        }
        setThinking(true);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

        socket.sendAudio(blob);
      } catch (e) {
        console.warn("Recording error", e);
        setThinking(false);
      }

      return;
    }

    // start
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
      setThinking(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
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

export default forwardRef(AgentChat);
