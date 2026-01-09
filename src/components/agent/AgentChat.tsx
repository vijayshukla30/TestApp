import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  Pressable,
  StyleSheet,
  Animated,
  KeyboardAvoidingView,
  Platform,
  BackHandler,
  Alert,
} from "react-native";
import { Portal, Dialog, Button, Appbar } from "react-native-paper";
import { router } from "expo-router";
import { BlurView } from "expo-blur";
import { Audio } from "expo-av";
import * as Haptics from "expo-haptics";
import { MaterialIcons } from "@expo/vector-icons";
import useTheme from "../../hooks/useTheme";
import useAssistantSocket from "../../hooks/useAssistantSocket";
import { MicWaveform } from "./MicWaveform";

const genId = () => `${Date.now()}-${Math.random().toString(36).slice(2)}`;

function ThinkingDots({ color }: any) {
  const dot1 = useRef(new Animated.Value(0.2)).current;
  const dot2 = useRef(new Animated.Value(0.2)).current;
  const dot3 = useRef(new Animated.Value(0.2)).current;

  useEffect(() => {
    const pulse = (dot: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 0.2,
            duration: 400,
            useNativeDriver: true,
          }),
        ])
      );

    const a1 = pulse(dot1, 0);
    const a2 = pulse(dot2, 150);
    const a3 = pulse(dot3, 300);

    a1.start();
    a2.start();
    a3.start();

    return () => {
      dot1.stopAnimation();
      dot2.stopAnimation();
      dot3.stopAnimation();
    };
  }, []);

  return (
    <View style={{ flexDirection: "row", gap: 6, padding: 6 }}>
      {[dot1, dot2, dot3].map((d, i) => (
        <Animated.View
          key={i}
          style={{
            width: 6,
            height: 6,
            borderRadius: 3,
            backgroundColor: color,
            opacity: d,
          }}
        />
      ))}
    </View>
  );
}

/* ----------------------------- bubble item ------------------------------ */

function AnimatedBubble({ children, style }: any) {
  const scale = useRef(new Animated.Value(0.92)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        damping: 14,
        stiffness: 120,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 160,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        style,
        {
          transform: [{ scale }],
          opacity,
        },
      ]}
    >
      {children}
    </Animated.View>
  );
}

/* ------------------------------ component ------------------------------- */

export default function AgentChat({ agent, consumer, userId }: any) {
  const { theme } = useTheme();

  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [showEndDialog, setShowEndDialog] = useState(false);

  /* ---------------- voice overlay spring ---------------- */

  const voiceAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const showVoice = () => {
    Animated.spring(voiceAnim, {
      toValue: 1,
      damping: 18,
      stiffness: 120,
      useNativeDriver: false,
    }).start();

    Animated.loop(
      Animated.sequence([
        Animated.spring(pulseAnim, {
          toValue: 1.15,
          useNativeDriver: true,
        }),
        Animated.spring(pulseAnim, {
          toValue: 1,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const hideVoice = () => {
    Animated.spring(voiceAnim, {
      toValue: 0,
      damping: 20,
      stiffness: 140,
      useNativeDriver: false,
    }).start();

    pulseAnim.stopAnimation();
    pulseAnim.setValue(1);
  };

  const overlayHeight = voiceAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 260],
  });

  const chatDim = voiceAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.25],
  });

  /* ---------------- audio safety ---------------- */

  const recordingRef = useRef<Audio.Recording | null>(null);
  const stoppingRef = useRef(false);
  const startedAtRef = useRef(0);

  /* ---------------- websocket ---------------- */

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
      if (role === "assistant") {
        setThinking(false); // 👈 stop thinking ONLY here
      }
    },
  });

  useEffect(() => {
    socket.connect();
    return () => socket.close();
  }, []);

  useEffect(() => {
    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        confirmEndChat();
        return true; // block default back
      }
    );

    return () => subscription.remove();
  }, []);

  /* ---------------- text ---------------- */

  const sendText = () => {
    if (!input.trim()) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    setMessages((m) => [...m, { id: genId(), role: "user", content: input }]);

    setThinking(true);
    socket.sendText(input);
    setInput("");
  };

  /* ---------------- audio ---------------- */

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

      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

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

  const endChatAndExit = () => {
    // 1. Stop recording safely
    try {
      recordingRef.current?.stopAndUnloadAsync();
    } catch {}

    // 2. Close websocket
    socket.close();

    // 3. Reset session state
    setMessages([]);
    setThinking(false);
    setRecording(null);

    // 4. Navigate home
    router.replace("/(tabs)/home");
  };

  const confirmEndChat = () => {
    Alert.alert(
      "End this assistant session?",
      "Your current conversation will be cleared. You can start a new session anytime.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "End Chat",
          style: "destructive",
          onPress: () => {
            endChatAndExit();
          },
        },
      ]
    );
  };

  /* ---------------- UI ---------------- */

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: theme.background }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View
        style={{
          height: 48,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 12,
          borderBottomWidth: 1,
          borderColor: theme.border,
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: "600", color: theme.text }}>
          {agent.agentName}
        </Text>

        <Pressable
          onPress={() => setShowEndDialog(true)}
          hitSlop={12}
          style={{
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 6,
            backgroundColor: "rgba(239,68,68,0.12)",
          }}
        >
          <Text
            style={{
              color: "#EF4444",
              fontSize: 13,
              fontWeight: "600",
            }}
          >
            End Chat
          </Text>
        </Pressable>
      </View>

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
            <AnimatedBubble
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
            </AnimatedBubble>
          )}
          ListFooterComponent={
            thinking ? <ThinkingDots color={theme.subText} /> : null
          }
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
        style={[styles.voiceOverlay, { height: overlayHeight }]}
      >
        <MicWaveform active={recording} color={theme.primary} />

        <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
          <View style={[styles.bigMic, { backgroundColor: theme.primary }]}>
            <MaterialIcons name="mic" size={34} color="#fff" />
          </View>
        </Animated.View>

        <Text style={{ color: theme.subText, marginTop: 8 }}>Listening…</Text>
      </Animated.View>
      <Portal>
        <Dialog
          visible={showEndDialog}
          onDismiss={() => setShowEndDialog(false)}
        >
          <Dialog.Title>End this assistant session?</Dialog.Title>
          <Dialog.Content>
            <Text style={{ color: theme.text }}>
              Your current conversation will be cleared. You can start a new
              session anytime.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowEndDialog(false)}>Cancel</Button>
            <Button textColor="#EF4444" onPress={endChatAndExit}>
              End Chat
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </KeyboardAvoidingView>
  );
}

/* -------------------------------- styles -------------------------------- */

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
});
