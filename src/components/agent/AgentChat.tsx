import { useEffect, useRef, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
  StyleSheet,
  Animated,
  Easing,
} from "react-native";
import { Audio } from "expo-av";
import { MaterialIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import useTheme from "../../hooks/useTheme";
import useAssistantSocket from "../../hooks/useAssistantSocket";
import { ChatMessage } from "../../utils/chat";
import { MicWaveform } from "./MicWaveform";

export function AgentChat({ agent, consumer, userId }: any) {
  const { theme } = useTheme();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);

  const recordingRef = useRef<Audio.Recording | null>(null);
  const stoppingRef = useRef(false);
  const isRecordingRef = useRef(false);
  const recordingStartedAtRef = useRef<number>(0);
  const pulseAnim = useRef(new Animated.Value(1)).current;

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
    if (isRecordingRef.current || stoppingRef.current) return;
    startPulse();
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const rec = new Audio.Recording();

      recordingRef.current = rec;
      isRecordingRef.current = true;
      recordingStartedAtRef.current = Date.now();

      await rec.prepareToRecordAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      await rec.startAsync();
      setRecording(rec);
    } catch (error) {
      console.log("🎤 startRecording error", error);
      recordingRef.current = null;
      isRecordingRef.current = false;
    }
  };

  const stopRecording = async () => {
    const rec = recordingRef.current;

    if (!rec || !isRecordingRef.current || stoppingRef.current) return;

    stoppingRef.current = true;

    try {
      const duration = Date.now() - recordingStartedAtRef.current;
      if (duration < 400) {
        await rec.stopAndUnloadAsync().catch(() => {});
        return;
      }

      await rec.stopAndUnloadAsync();
      const uri = rec.getURI();

      if (!uri) return;

      setThinking(true);
      const blob = await fetch(uri).then((r) => r.blob());
      socket.sendAudio(blob);
    } catch (error) {
      console.log("🎤 stopRecording error", error);
    } finally {
      recordingRef.current = null;
      isRecordingRef.current = false;
      stoppingRef.current = false;
      recordingStartedAtRef.current = 0;
      setRecording(null);
      stopPulse();
    }
  };

  const startPulse = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.15,
          duration: 600,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 600,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const stopPulse = () => {
    pulseAnim.stopAnimation();
    pulseAnim.setValue(1);
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
      <MicWaveform active={recording} color={theme.primary} />
      <View
        style={[
          styles.composerWrapper,
          {
            backgroundColor: theme.background,
            borderTopColor: theme.border,
          },
        ]}
      >
        <BlurView
          intensity={40}
          tint={theme.mode === "dark" ? "dark" : "light"}
          style={styles.composerCard}
        >
          <TextInput
            multiline
            value={input}
            onChangeText={setInput}
            placeholder="Type a message…"
            placeholderTextColor={theme.subText}
            style={[
              styles.textInput,
              {
                color: theme.text,
              },
            ]}
          />

          <View style={styles.actionRow}>
            <Animated.View
              style={{
                transform: [{ scale: pulseAnim }],
              }}
            >
              <Pressable
                onPressIn={startRecording}
                onPressOut={stopRecording}
                style={[styles.iconButton, recording && styles.recordingButton]}
              >
                <MaterialIcons
                  name="mic"
                  size={22}
                  color={recording ? "#fff" : theme.text}
                />
              </Pressable>
            </Animated.View>

            <Pressable
              disabled={!input.trim()}
              onPress={sendText}
              style={[
                styles.sendButton,
                {
                  backgroundColor: input.trim() ? theme.primary : theme.border,
                },
              ]}
            >
              <MaterialIcons name="send" size={20} color="#fff" />
            </Pressable>
          </View>
        </BlurView>
      </View>
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
  composerWrapper: {
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: Platform.OS === "ios" ? 24 : 12,
    borderTopWidth: 1,
  },

  composerCard: {
    borderRadius: 16,
    padding: 12,

    // Shadow (iOS)
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,

    // Elevation (Android)
    elevation: 8,
    backgroundColor: "rgba(255,255,255,0.85)",
  },

  textInput: {
    minHeight: 56,
    maxHeight: 140,
    fontSize: 16,
    lineHeight: 22,
    paddingHorizontal: 12,
    paddingVertical: 10,
    textAlignVertical: "top",
  },

  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },

  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },

  recordingButton: {
    backgroundColor: "#EF4444",
  },

  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
});
