import { useEffect, useRef, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Audio } from "expo-av";
import { useLocalSearchParams } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import useTheme from "../../../../hooks/useTheme";
import useAuth from "../../../../hooks/useAuth";
import { Agent } from "../../../../types/agent";
import Screen from "../../../../components/Screen";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export default function AgentUse() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const params = useLocalSearchParams();

  const agent: Agent = params.agent ? JSON.parse(params.agent as string) : null;

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const recordingRef = useRef<Audio.Recording | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectingRef = useRef(false);
  const unmountedRef = useRef(false);
  const shouldReconnectRef = useRef(true);

  useEffect(() => {
    const interval = setInterval(() => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ type: "ping" }));
      }
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const connectWebSocket = useCallback(() => {
    if (reconnectingRef.current || unmountedRef.current) return;

    reconnectingRef.current = true;

    const wsUrl = `ws://${agent.seoName}.${process.env.EXPO_PUBLIC_WSS_URL}`;
    console.log("🔌 WS connect:", wsUrl);

    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("✅ WS open");
      reconnectingRef.current = false;

      ws.send(
        JSON.stringify({
          type: "metadata",
          userId: user?.uuid,
          assistantId: agent.uuid,
        })
      );
    };

    ws.onmessage = (event) => {
      if (typeof event.data !== "string") return;

      const data = JSON.parse(event.data);

      if (data.type === "ConversationText" && data.message) {
        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            role: data.message.role,
            content: data.message.content,
          },
        ]);

        setIsThinking(false);
      }
    };

    ws.onclose = () => {
      console.log("⚠️ WS closed");
      wsRef.current = null;
      if (shouldReconnectRef.current) {
        console.log("ℹ️ will reconnect on next action");
      }
    };

    ws.onerror = (e) => {
      console.log("❌ WS error", e);
    };
  }, [agent.uuid, agent.seoName, user?.uuid]);

  const sendWS = async (payload: string | Blob) => {
    let ws = wsRef.current;

    if (!ws || ws.readyState !== WebSocket.OPEN) {
      connectWebSocket();
      await new Promise((r) => setTimeout(r, 400));
      ws = wsRef.current;
    }

    if (!ws || ws.readyState !== WebSocket.OPEN) return;

    ws.send(
      JSON.stringify({
        type: "start_audio",
        format: payload.type || "audio/webm",
      })
    );

    ws.send(payload);
  };

  const sendText = async () => {
    if (!input.trim()) return;

    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), role: "user", content: input },
    ]);

    setIsThinking(true);

    await sendWS(
      JSON.stringify({
        type: "user_message",
        message: input,
      })
    );

    setInput("");
  };

  const startRecording = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (!permission.granted) return;

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      await recording.startAsync();

      recordingRef.current = recording;
      setIsRecording(true);
    } catch (e) {
      console.log("🎤 record error", e);
    }
  };

  const stopRecording = async () => {
    try {
      const recording = recordingRef.current;
      if (!recording) return;

      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      recordingRef.current = null;
      setIsRecording(false);

      if (!uri) return;

      setIsThinking(true);

      const blob = await fetch(uri).then((r) => r.blob());
      await sendWS(blob);
    } catch (e) {
      console.log("🎤 stop error", e);
    }
  };

  useEffect(() => {
    connectWebSocket();

    return () => {
      unmountedRef.current = true;
      wsRef.current?.close();
      wsRef.current = null;
    };
  }, []);

  return (
    <Screen>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <FlatList
          data={messages}
          keyExtractor={(i) => i.id}
          contentContainerStyle={styles.chat}
          renderItem={({ item }) => (
            <View
              style={[
                styles.bubble,
                item.role === "user" ? styles.userBubble : styles.botBubble,
              ]}
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

        {isThinking && (
          <Text style={[styles.thinking, { color: theme.subText }]}>
            Thinking…
          </Text>
        )}

        <View style={[styles.inputBar, { borderTopColor: theme.border }]}>
          <TextInput
            multiline
            value={input}
            onChangeText={setInput}
            placeholder="Type a message…"
            placeholderTextColor={theme.subText}
            style={[
              styles.input,
              {
                backgroundColor: theme.surface,
                color: theme.text,
                borderColor: theme.border,
              },
            ]}
          />

          <Pressable
            style={[styles.button, { backgroundColor: theme.primary }]}
            onPress={sendText}
          >
            <MaterialIcons name="send" size={22} color="#fff" />
          </Pressable>

          <Pressable
            style={[
              styles.button,
              {
                backgroundColor: isRecording ? "#EF4444" : theme.surface,
                borderColor: theme.border,
                borderWidth: 1,
              },
            ]}
            onPressIn={startRecording}
            onPressOut={stopRecording}
          >
            <MaterialIcons
              name="mic"
              size={22}
              color={isRecording ? "#fff" : theme.text}
            />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  chat: {
    padding: 16,
  },
  bubble: {
    maxWidth: "78%",
    padding: 12,
    borderRadius: 16,
    marginBottom: 10,
  },
  userBubble: {
    alignSelf: "flex-end",
    backgroundColor: "#162F4B",
    borderBottomRightRadius: 6,
  },
  botBubble: {
    alignSelf: "flex-start",
    backgroundColor: "#EDF2F7",
    borderBottomLeftRadius: 6,
  },
  thinking: {
    textAlign: "center",
    marginBottom: 8,
  },
  inputBar: {
    flexDirection: "row",
    padding: 10,
    gap: 10,
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
    minHeight: 56,
    maxHeight: 120,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    fontSize: 15,
  },
  button: {
    width: 52,
    height: 52,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
});
