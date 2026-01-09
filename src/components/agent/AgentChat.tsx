import { useEffect, useRef, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { Audio } from "expo-av";
import { MaterialIcons } from "@expo/vector-icons";
import useTheme from "../../hooks/useTheme";
import useAssistantSocket from "../../hooks/useAssistantSocket";
import { ChatMessage } from "../../utils/chat";

export function AgentChat({ agent, consumer, userId }: any) {
  const { theme } = useTheme();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);

  const recordingRef = useRef<Audio.Recording | null>(null);
  const stoppingRef = useRef(false);

  const genId = () => `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  const socket = useAssistantSocket({
    agent,
    consumer,
    userId,
    onMessage: (data) => {
      console.log("WS message:", data);
      switch (data?.type) {
        case "AssistantDetails":
          return;
        case "AgentConnected":
          setThinking(false);
          return;
        case "ConversationText": {
          const { role, content, from } = data.message;

          if (from === "transcriber") {
            setInput((prev) => (prev ? `${prev} ${content}` : content));
            return;
          }

          setMessages((m) => [...m, { id: genId(), role, content }]);
          // ✅ assistant replied → stop thinking
          if (role === "assistant") {
            setThinking(false);
          }
          return;
        }

        default:
          console.log("Unknown WS type", data?.type);
      }
    },
  });

  useEffect(() => {
    socket.connect();

    return () => socket.close();
  }, []);

  // ---- TEXT ----
  const sendText = () => {
    if (!input.trim()) return;

    setMessages((m) => [...m, { id: genId(), role: "user", content: input }]);

    setThinking(true);
    socket.sendText(input);
    setInput("");
  };

  // ---- AUDIO ----
  const startRecording = async () => {
    if (recordingRef.current || stoppingRef.current) return;
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const rec = new Audio.Recording();
      recordingRef.current = rec;
      await rec.prepareToRecordAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      await rec.startAsync();
      setRecording(rec);
    } catch (error) {
      console.log("🎤 startRecording error", error);
      recordingRef.current = null;
    }
  };

  const stopRecording = async () => {
    const rec = recordingRef.current;

    // 🚫 Nothing to stop OR already stopping
    if (!rec || stoppingRef.current) return;

    stoppingRef.current = true;

    try {
      await rec.stopAndUnloadAsync();
      const uri = rec.getURI();

      recordingRef.current = null;
      setRecording(null);

      if (!uri) return;

      setThinking(true);
      const blob = await fetch(uri).then((r) => r.blob());
      socket.sendAudio(blob);
    } catch (error) {
      console.log("🎤 stopRecording error", error);
    } finally {
      stoppingRef.current = false;
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <FlatList
        data={messages}
        keyExtractor={(i) => i.id}
        contentContainerStyle={{ padding: 12 }}
        renderItem={({ item }) => (
          <View
            style={{
              alignSelf: item.role === "user" ? "flex-end" : "flex-start",
              backgroundColor:
                item.role === "user" ? theme.primary : theme.surface,
              padding: 10,
              borderRadius: 12,
              marginVertical: 4,
              maxWidth: "80%",
            }}
          >
            <Text
              style={{
                color: item.role === "user" ? theme.background : theme.text,
              }}
            >
              {item.content}
            </Text>
          </View>
        )}
      />

      {thinking && (
        <Text style={{ padding: 8, color: theme.subText }}>Thinking…</Text>
      )}

      <View
        style={{
          flexDirection: "row",
          padding: 8,
          borderTopWidth: 1,
          borderColor: theme.border,
          alignItems: "flex-end",
          gap: 8,
        }}
      >
        <TextInput
          multiline
          value={input}
          onChangeText={setInput}
          placeholder="Type a message…"
          style={{
            flex: 1,
            backgroundColor: theme.surface,
            color: theme.text,
            borderRadius: 12,
            padding: 10,
          }}
        />

        <Pressable onPress={sendText}>
          <MaterialIcons name="send" size={24} color={theme.primary} />
        </Pressable>

        <Pressable onPressIn={startRecording} onPressOut={stopRecording}>
          <MaterialIcons
            name="mic"
            size={24}
            color={recording ? "#EF4444" : theme.text}
          />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}
