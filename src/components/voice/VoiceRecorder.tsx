import { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { Audio } from "expo-av";
import { MaterialIcons } from "@expo/vector-icons";
import useTheme from "../../hooks/useTheme";

type Props = {
  onSend: (uri: string) => Promise<void>;
};

export default function VoiceRecorder({ onSend }: Props) {
  const { theme } = useTheme();

  const recordingRef = useRef<Audio.Recording | null>(null);

  const [audioUri, setAudioUri] = useState<string | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sending, setSending] = useState(false);

  /* ---------------- Permission ---------------- */

  const ensurePermission = async () => {
    const { granted } = await Audio.requestPermissionsAsync();
    if (!granted) throw new Error("Microphone permission denied");
  };

  /* ---------------- Recording ---------------- */

  const startRecording = async () => {
    try {
      await ensurePermission();

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
    } catch (err) {
      console.error("Start recording error", err);
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
      setAudioUri(uri || null);
    } catch (err) {
      console.error("Stop recording error", err);
    }
  };

  /* ---------------- Playback ---------------- */

  const togglePlay = async () => {
    if (!audioUri) return;

    if (!sound) {
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: audioUri },
        { shouldPlay: true },
        (status) => {
          if (!status.isLoaded) return;
          if (status.didJustFinish) {
            setIsPlaying(false);
            newSound.unloadAsync();
            setSound(null);
          }
        }
      );

      setSound(newSound);
      setIsPlaying(true);
    } else {
      await sound.stopAsync();
      await sound.unloadAsync();
      setSound(null);
      setIsPlaying(false);
    }
  };

  /* ---------------- Clear ---------------- */

  const clearRecording = async () => {
    if (sound) {
      await sound.unloadAsync();
      setSound(null);
    }
    setAudioUri(null);
    setIsPlaying(false);
  };

  /* ---------------- Send ---------------- */

  const handleSend = async () => {
    if (!audioUri) return;

    try {
      setSending(true);
      await onSend(audioUri);
      await clearRecording();
    } finally {
      setSending(false);
    }
  };

  /* ---------------- Cleanup ---------------- */

  useEffect(() => {
    return () => {
      if (recordingRef.current) {
        recordingRef.current.stopAndUnloadAsync().catch(() => {});
      }
      if (sound) {
        sound.unloadAsync().catch(() => {});
      }
    };
  }, []);

  /* ---------------- UI ---------------- */

  return (
    <View style={styles.container}>
      {/* Mic Button */}
      {!audioUri && (
        <Pressable
          onPressIn={startRecording}
          onPressOut={stopRecording}
          style={[
            styles.micButton,
            { backgroundColor: isRecording ? "#EF4444" : theme.primary },
          ]}
        >
          <MaterialIcons name="mic" size={40} color="#fff" />
        </Pressable>
      )}

      {isRecording && (
        <Text style={[styles.recordingText, { color: theme.subText }]}>
          Recording...
        </Text>
      )}

      {/* Playback Controls */}
      {audioUri && (
        <View style={styles.actions}>
          <Pressable onPress={togglePlay} style={styles.iconBtn}>
            <MaterialIcons
              name={isPlaying ? "stop" : "play-arrow"}
              size={28}
              color={theme.text}
            />
          </Pressable>

          <Pressable onPress={clearRecording} style={styles.iconBtn}>
            <MaterialIcons name="delete" size={26} color="#EF4444" />
          </Pressable>

          <Pressable
            onPress={handleSend}
            disabled={sending}
            style={[styles.sendBtn, { backgroundColor: theme.primary }]}
          >
            {sending ? (
              <ActivityIndicator color="#000" />
            ) : (
              <>
                <MaterialIcons name="send" size={20} color="#000" />
                <Text style={styles.sendText}>Send</Text>
              </>
            )}
          </Pressable>
        </View>
      )}
    </View>
  );
}

/* ---------------- Styles ---------------- */

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginTop: 40,
  },

  micButton: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: "center",
    justifyContent: "center",
  },

  recordingText: {
    marginTop: 12,
    fontSize: 14,
  },

  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 18,
    marginTop: 24,
  },

  iconBtn: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#1F2937",
  },

  sendBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 14,
    gap: 6,
  },

  sendText: {
    fontWeight: "600",
  },
});
