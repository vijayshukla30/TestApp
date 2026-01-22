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
  const recordStartRef = useRef<number | null>(null);

  const socket = useAssistantSocket({
    agent,
    consumer,
    userId,
    onMessage: (data: any) => {
      if (data?.type !== "ConversationText") return;
      console.log("data.message :>> ", data.message);
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
      cleanup();
    };
  }, []);

  useEffect(() => {
    if (!thinking) return;

    const timeout = setTimeout(() => {
      setThinking(false);
      setRecording(null);
      recordingRef.current = null;
      recordStartRef.current = null;
    }, 10_000);

    return () => clearTimeout(timeout);
  }, [thinking]);

  const forceStopRecording = async () => {
    const rec = recordingRef.current;

    if (!rec) return;

    try {
      await rec.stopAndUnloadAsync();
    } catch (e) {
    } finally {
      recordingRef.current = null;
      recordStartRef.current = null;
      setRecording(null);
    }
  };

  const cleanup = async () => {
    await forceStopRecording();
    socket.close();
    setMessages([]);
    setThinking(false);
    setRecording(null);
    recordingRef.current = null;
    recordStartRef.current = null;
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
    if (thinking) return;

    if (recordingRef.current) {
      const rec = recordingRef.current;

      try {
        // ⛔ stop FIRST
        await rec.stopAndUnloadAsync();
        const uri = rec.getURI();

        const start = recordStartRef.current;
        const duration = start ? Date.now() - start : 0;

        console.log("duration :>>", duration);

        // cleanup refs AFTER stop
        recordingRef.current = null;
        recordStartRef.current = null;
        setRecording(null);

        // 🔕 accidental tap / silence
        if (!uri || duration < 800) {
          setThinking(false);
          return;
        }

        // ✅ valid audio
        const blob = await fetch(uri).then((r) => r.blob());

        setThinking(true);
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

        socket.sendAudio(blob);
      } catch (e) {
        console.warn("Recording error", e);
        recordingRef.current = null;
        recordStartRef.current = null;
        setRecording(null);
        setThinking(false);
      }

      return;
    }

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

      recordStartRef.current = Date.now(); // ✅ MUST be before start
      await rec.startAsync();

      setRecording(rec);
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (e) {
      console.warn("Failed to start recording", e);
      recordingRef.current = null;
      recordStartRef.current = null;
      setRecording(null);
      setThinking(false);
    }
  };

  return (
    <View className="flex-1 bg-background dark:bg-dark-background">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View className="flex-1">
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
