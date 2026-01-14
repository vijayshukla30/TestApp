import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  Pressable,
  StyleSheet,
  Animated,
  Modal,
  Platform,
  BackHandler,
  Alert,
  PanResponder,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { router } from "expo-router";
import { BlurView } from "expo-blur";
import { Audio } from "expo-av";
import * as Haptics from "expo-haptics";
import { MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import useTheme from "../../hooks/useTheme";
import useAssistantSocket from "../../hooks/useAssistantSocket";
import { MicWaveform } from "./MicWaveform";
import AppCard from "../ui/AppCard";

const genId = () => `${Date.now()}-${Math.random().toString(36).slice(2)}`;

/* ----------------------------- thinking dots ---------------------------- */

function ThinkingDots({ color }: any) {
  const dots = [
    useRef(new Animated.Value(0.2)).current,
    useRef(new Animated.Value(0.2)).current,
    useRef(new Animated.Value(0.2)).current,
  ];

  useEffect(() => {
    const anims = dots.map((d, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(i * 150),
          Animated.timing(d, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(d, {
            toValue: 0.2,
            duration: 400,
            useNativeDriver: true,
          }),
        ])
      )
    );
    anims.forEach((a) => a.start());
    return () => dots.forEach((d) => d.stopAnimation());
  }, []);

  return (
    <View style={{ flexDirection: "row", gap: 6, padding: 6 }}>
      {dots.map((d, i) => (
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

/* ------------------------------ bubble ---------------------------------- */

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
    <Animated.View style={[style, { transform: [{ scale }], opacity }]}>
      {children}
    </Animated.View>
  );
}

/* ------------------------------ main ------------------------------------ */

export default function AgentChat({ agent, consumer, userId }: any) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  /* ---------------- voice animation ---------------- */

  const pulseAnim = useRef(new Animated.Value(1)).current;

  const startPulse = () => {
    Animated.loop(
      Animated.sequence([
        Animated.spring(pulseAnim, { toValue: 1.15, useNativeDriver: true }),
        Animated.spring(pulseAnim, { toValue: 1, useNativeDriver: true }),
      ])
    ).start();
  };

  const stopPulse = () => {
    pulseAnim.stopAnimation();
    pulseAnim.setValue(1);
  };

  /* ---------------- pan to close modal ---------------- */

  const panY = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => g.dy > 12,
      onPanResponderMove: Animated.event([null, { dy: panY }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: (_, g) => {
        if (g.dy > 120) {
          setShowHistory(false);
          panY.setValue(0);
        } else {
          Animated.spring(panY, {
            toValue: 0,
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

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
      if (role === "assistant") setThinking(false);
    },
  });

  useEffect(() => {
    socket.connect();
    return () => socket.close();
  }, []);

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
      startPulse();
    } catch {}
  };

  const stopRecording = async () => {
    const rec = recordingRef.current;
    if (!rec || stoppingRef.current) return;
    stoppingRef.current = true;

    try {
      await rec.stopAndUnloadAsync().catch(() => {});
      if (Date.now() - startedAtRef.current < 400) return;
      const uri = rec.getURI();
      if (!uri) return;
      const blob = await fetch(uri).then((r) => r.blob());
      socket.sendAudio(blob);
    } finally {
      recordingRef.current = null;
      stoppingRef.current = false;
      startedAtRef.current = 0;
      setRecording(null);
      stopPulse();
    }
  };

  /* ---------------- end chat ---------------- */

  const endChatAndExit = () => {
    try {
      recordingRef.current?.stopAndUnloadAsync();
    } catch {}
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
        { text: "End Chat", style: "destructive", onPress: endChatAndExit },
      ]
    );
  };

  /* ---------------- render ---------------- */

  return (
    <View style={{ flex: 1 }}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={{ color: theme.text, fontWeight: "600" }}>
          {agent.agentName}
        </Text>
        <Pressable onPress={confirmEndChat} style={styles.endBtn}>
          <Text style={{ color: "#EF4444", fontWeight: "600" }}>End Chat</Text>
        </Pressable>
      </View>

      {/* MIC AREA */}
      <View style={styles.micArea}>
        <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
          <Pressable
            onPressIn={startRecording}
            onPressOut={stopRecording}
            hitSlop={20}
            style={[
              styles.micButton,
              { backgroundColor: recording ? "#EF4444" : theme.primary },
            ]}
          >
            <MaterialIcons name="mic" size={56} color="#000" />
          </Pressable>
        </Animated.View>

        <Text style={[styles.micStatus, { color: theme.subText }]}>
          {recording ? "Listening…" : thinking ? "Thinking…" : "Tap and speak"}
        </Text>

        {recording && <MicWaveform active color={theme.primary} />}
      </View>

      {/* COMPOSER */}
      <AppCard
        style={[
          styles.composerCardOuter,
          {
            backgroundColor: theme.surface,
            padding: 5,
          },
        ]}
      >
        <BlurView
          intensity={25}
          tint={theme.mode === "dark" ? "dark" : "light"}
          style={styles.composerCard}
        >
          <Pressable onPress={() => setShowHistory(true)}>
            <MaterialIcons name="history" size={22} color={theme.subText} />
          </Pressable>

          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Type or speak…"
            placeholderTextColor={theme.subText}
            style={[styles.input, { color: theme.text }]}
          />

          <Pressable
            onPress={sendText}
            style={[styles.sendBtn, { backgroundColor: theme.primary }]}
          >
            <MaterialIcons name="send" size={18} color="#000" />
          </Pressable>
        </BlurView>
      </AppCard>

      {/* HISTORY MODAL */}
      <Modal
        visible={showHistory}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View
            style={{
              flex: 1,
              paddingTop: insets.top,
              backgroundColor: theme.background,
            }}
          >
            <Pressable
              style={StyleSheet.absoluteFill}
              onPress={Keyboard.dismiss}
            />
            <BlurView
              intensity={25}
              tint={theme.mode === "dark" ? "dark" : "light"}
              style={[
                styles.historyHeader,
                {
                  paddingTop: insets.top, // 👈 THIS IS THE REAL FIX
                  height: 56 + insets.top,
                },
              ]}
            >
              <Text style={[styles.historyTitle, { color: theme.text }]}>
                Conversation
              </Text>
              <Pressable onPress={() => setShowHistory(false)} hitSlop={12}>
                <MaterialIcons name="close" size={24} color={theme.text} />
              </Pressable>
            </BlurView>

            <Animated.View
              style={{ flex: 1, transform: [{ translateY: panY }] }}
              {...panResponder.panHandlers}
            >
              <FlatList
                data={messages}
                keyExtractor={(i) => i.id}
                keyboardDismissMode="on-drag"
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{
                  paddingTop: 56 + insets.top + 16,
                  paddingHorizontal: 16,
                  paddingBottom: 24,
                }}
                renderItem={({ item }) => (
                  <AnimatedBubble
                    style={[
                      styles.bubble,
                      item.role === "user"
                        ? styles.userBubble
                        : styles.botBubble,
                      {
                        backgroundColor:
                          item.role === "user" ? theme.primary : theme.surface,
                      },
                    ]}
                  >
                    <Text
                      style={{
                        color:
                          item.role === "user" ? theme.background : theme.text,
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
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

/* ------------------------------ styles ---------------------------------- */

const styles = StyleSheet.create({
  header: {
    height: 48,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  endBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: "rgba(239,68,68,0.12)",
  },
  micArea: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  micButton: {
    width: 140,
    height: 140,
    borderRadius: 70,
    alignItems: "center",
    justifyContent: "center",
    elevation: 30,
    shadowOpacity: 0.4,
    shadowRadius: 40,
  },
  micStatus: {
    marginTop: 16,
    fontSize: 15,
    opacity: 0.85,
  },
  composerCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  input: {
    flex: 1,
    marginHorizontal: 10,
    fontSize: 15,
    paddingVertical: 6,
  },
  sendBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  historyHeader: {
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
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
  composerCardOuter: {
    position: "absolute",
    left: 12,
    right: 12,
    bottom: Platform.OS === "ios" ? 24 : 12, // safe spacing
    borderRadius: 28,
    overflow: "hidden",
  },
});
