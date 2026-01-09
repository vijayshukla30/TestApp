import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  Pressable,
  StyleSheet,
  Animated,
  Easing,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { BlurView } from "expo-blur";
import { Audio } from "expo-av";
import { MaterialIcons } from "@expo/vector-icons";
import useTheme from "../../hooks/useTheme";
import useAssistantSocket from "../../hooks/useAssistantSocket";

/* -------------------------------- utils -------------------------------- */

const genId = () => `${Date.now()}-${Math.random().toString(36).slice(2)}`;

/* ----------------------------- waveform --------------------------------- */

function MicWaveform({ active, color }: any) {
  const bars = Array.from({ length: 7 });
  const anims = useRef(bars.map(() => new Animated.Value(6))).current;

  useEffect(() => {
    if (!active) return;

    const loops = anims.map((a, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(a, {
            toValue: 24,
            duration: 260 + i * 40,
            useNativeDriver: false,
          }),
          Animated.timing(a, {
            toValue: 6,
            duration: 260 + i * 40,
            useNativeDriver: false,
          }),
        ])
      )
    );

    loops.forEach((l) => l.start());
    return () => anims.forEach((a) => a.stopAnimation());
  }, [active]);

  if (!active) return null;

  return (
    <View style={styles.waveform}>
      {anims.map((a, i) => (
        <Animated.View
          key={i}
          style={[styles.waveBar, { height: a, backgroundColor: color }]}
        />
      ))}
    </View>
  );
}

/* ------------------------------ component -------------------------------- */

export default function AgentChat({ agent, consumer, userId }: any) {
  const { theme } = useTheme();

  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [recording, setRecording] = useState<Audio.Recording | null>(null);

  /* ------------------ voice overlay animation ------------------ */

  const voiceAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const overlayHeight = voiceAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 260],
  });

  const overlayOpacity = voiceAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const chatDim = voiceAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.25],
  });

  const showVoice = () => {
    Animated.timing(voiceAnim, {
      toValue: 1,
      duration: 320,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.15,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const hideVoice = () => {
    Animated.timing(voiceAnim, {
      toValue: 0,
      duration: 260,
      easing: Easing.in(Easing.cubic),
      useNativeDriver: false,
    }).start();

    pulseAnim.stopAnimation();
    pulseAnim.setValue(1);
  };

  /* ------------------ recording safety ------------------ */

  const recordingRef = useRef<Audio.Recording | null>(null);
  const stoppingRef = useRef(false);
  const startedAtRef = useRef(0);

  /* ------------------ websocket ------------------ */

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
    },
  });

  useEffect(() => {
    socket.connect();
    return () => socket.close();
  }, []);

  /* ------------------ text ------------------ */

  const sendText = () => {
    if (!input.trim()) return;

    setMessages((m) => [...m, { id: genId(), role: "user", content: input }]);

    socket.sendText(input);
    setInput("");
  };

  /* ------------------ audio ------------------ */

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
      startedAtRef.current = Date.now();

      await rec.prepareToRecordAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      await rec.startAsync();

      setRecording(rec);
      showVoice();
    } catch {
      recordingRef.current = null;
    }
  };

  const stopRecording = async () => {
    const rec = recordingRef.current;
    if (!rec || stoppingRef.current) return;

    stoppingRef.current = true;

    try {
      await rec.stopAndUnloadAsync().catch(() => {});
      const duration = Date.now() - startedAtRef.current;
      if (duration < 400) return;

      const uri = rec.getURI();
      if (!uri) return;

      const blob = await fetch(uri).then((r) => r.blob());
      socket.sendAudio(blob);
    } finally {
      recordingRef.current = null;
      stoppingRef.current = false;
      startedAtRef.current = 0;
      setRecording(null);
      hideVoice();
    }
  };

  /* ------------------ UI ------------------ */

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: theme.background }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* CHAT */}
      <Animated.View style={{ flex: 1, opacity: chatDim }}>
        <FlatList
          data={messages}
          keyExtractor={(i) => i.id}
          contentContainerStyle={{
            padding: 16,
            paddingBottom: 120,
          }}
          renderItem={({ item }) => (
            <View
              style={[
                styles.bubble,
                item.role === "user" ? styles.userBubble : styles.botBubble,
                {
                  backgroundColor:
                    item.role === "user" ? theme.primary : theme.surface,
                },
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
      </Animated.View>

      {/* COMPOSER */}
      <View style={styles.composerWrapper}>
        <BlurView
          intensity={Platform.OS === "ios" ? 25 : 0}
          tint={theme.mode === "dark" ? "dark" : "light"}
          style={[styles.composer, { backgroundColor: theme.surface }]}
        >
          <Pressable
            onPressIn={startRecording}
            onPressOut={stopRecording}
            style={[styles.micSmall, recording && styles.micActive]}
          >
            <MaterialIcons name="mic" size={20} color="#fff" />
          </Pressable>

          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Type your message…"
            placeholderTextColor={theme.subText}
            style={[styles.input, { color: theme.text }]}
          />

          <Pressable
            onPress={sendText}
            style={[styles.send, { backgroundColor: theme.primary }]}
          >
            <MaterialIcons name="send" size={18} color="#fff" />
          </Pressable>
        </BlurView>
      </View>

      {/* VOICE OVERLAY */}
      <Animated.View
        pointerEvents={recording ? "auto" : "none"}
        style={[
          styles.voiceOverlay,
          {
            height: overlayHeight,
            opacity: overlayOpacity,
          },
        ]}
      >
        <MicWaveform active={recording} color={theme.primary} />

        <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
          <View style={[styles.bigMic, { backgroundColor: theme.primary }]}>
            <MaterialIcons name="mic" size={34} color="#fff" />
          </View>
        </Animated.View>

        <Text style={{ color: theme.subText }}>Listening…</Text>
      </Animated.View>
    </KeyboardAvoidingView>
  );
}

/* ------------------------------- styles --------------------------------- */

const styles = StyleSheet.create({
  bubble: {
    maxWidth: "78%",
    padding: 12,
    borderRadius: 16,
    marginVertical: 6,
  },
  userBubble: {
    alignSelf: "flex-end",
    borderBottomRightRadius: 4,
  },
  botBubble: {
    alignSelf: "flex-start",
    borderBottomLeftRadius: 4,
  },

  composerWrapper: {
    position: "absolute",
    bottom: 16,
    left: 12,
    right: 12,
  },

  composer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 24,
    paddingHorizontal: 12,
    paddingVertical: 10,
    elevation: 10,
    shadowOpacity: 0.12,
    shadowRadius: 18,
  },

  micSmall: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#7C3AED",
    alignItems: "center",
    justifyContent: "center",
  },

  micActive: {
    backgroundColor: "#EF4444",
  },

  input: {
    flex: 1,
    marginHorizontal: 10,
    fontSize: 15,
  },

  send: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },

  voiceOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.35)",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },

  bigMic: {
    width: 84,
    height: 84,
    borderRadius: 42,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 16,
    elevation: 16,
  },

  waveform: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 12,
  },

  waveBar: {
    width: 4,
    borderRadius: 2,
  },
});
