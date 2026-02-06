import {
  View,
  Text,
  Pressable,
  Modal,
  TextInput,
  BackHandler,
} from "react-native";
import { useEffect, useRef, useState, useLayoutEffect } from "react";
import { useRouter, useNavigation } from "expo-router";
import { File } from "expo-file-system";
import { startRecording, stopRecording } from "../../../utils/audioRecorder";
import { saveRecording } from "../../../utils/storage";
import {
  generateSeoName,
  getDefaultRecordingName,
} from "../../../utils/format";
import { STORAGE_PATHS } from "../../../utils/storagePath";
import RecordMicSection from "../../../components/agent/RecordMicSection";
import { Audio } from "expo-av";

export default function NewRecording() {
  const router = useRouter();
  const [recording, setRecording] = useState<any>(null);
  const recordingRef = useRef<Audio.Recording | null>(null);

  const [result, setResult] = useState<any>(null);
  const [confirmVisible, setConfirmVisible] = useState(false);

  const [fileName, setFileName] = useState("");
  const [isPaused, setIsPaused] = useState(false);

  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      gestureEnabled: !recording,
      headerBackVisible: !recording,
    });
  }, [recording]);

  useEffect(() => {
    if (!recording) return;

    const sub = BackHandler.addEventListener("hardwareBackPress", () => true);

    return () => sub.remove();
  }, [recording]);

  useEffect(() => {
    let mounted = true;

    (async () => {
      const rec = await startRecording();
      if (!mounted) return;

      recordingRef.current = rec;
      setRecording(rec);
    })();

    return () => {
      mounted = false;
      recording?.stopAndUnloadAsync?.();
      recordingRef.current = null;
    };
  }, []);

  const handleStop = async () => {
    const rec = recordingRef.current;
    if (!rec) return;

    const res = await stopRecording(rec);

    recordingRef.current = null;
    setRecording(null);
    setIsPaused(false);

    if (!res) {
      router.back();
      return;
    }

    setResult(res);
    setFileName(getDefaultRecordingName());
    setConfirmVisible(true);
  };

  const handlePause = async () => {
    if (!recording || isPaused) return;

    try {
      await recording.pauseAsync();
      setIsPaused(true);
    } catch (e) {
      console.warn("Pause failed", e);
    }
  };

  const handleResume = async () => {
    if (!recording || !isPaused) return;

    try {
      await recording.startAsync(); // resume
      setIsPaused(false);
    } catch (e) {
      console.warn("Resume failed", e);
    }
  };

  async function onSave() {
    if (!result) return;

    const safeName = fileName.trim() || getDefaultRecordingName();
    const seoName = generateSeoName(safeName);

    const finalUri = `${STORAGE_PATHS.recordings}${seoName}`;

    const file = new File(result.uri);
    await file.move(new File(finalUri));

    await saveRecording({
      id: Date.now().toString(),
      uri: finalUri,
      name: safeName,
      seoName,
      createdAt: result.createdAt,
      duration: result.duration,
    });

    setConfirmVisible(false);
    router.back();
  }

  async function onDelete() {
    if (result?.uri) {
      const file = new File(result.uri);
      await file.delete();
    }

    setConfirmVisible(false);
    router.back();
  }

  return (
    <View className="flex-1 justify-center items-center bg-black">
      <Text className="text-white text-lg mb-4">Recording…</Text>

      <RecordMicSection
        recording={recording}
        onStop={handleStop}
        isPaused={isPaused}
        onPause={handlePause}
        onResume={handleResume}
      />

      <Modal transparent visible={confirmVisible} animationType="fade">
        <View className="flex-1 justify-center items-center bg-black/60">
          <View className="bg-white p-6 rounded-xl w-80">
            <Text className="text-lg font-bold mb-2">Save recording</Text>

            <View className="border rounded-lg px-3 py-2 mb-4">
              <TextInput
                value={fileName}
                onChangeText={setFileName}
                autoFocus
                selectTextOnFocus
                placeholder="Recording name"
              />
              <Text className="text-gray-400 text-sm mt-1">.m4a</Text>
            </View>

            <Pressable
              className="bg-green-600 p-3 rounded-lg mb-3"
              onPress={onSave}
            >
              <Text className="text-white text-center">Save</Text>
            </Pressable>

            <Pressable
              className="bg-gray-200 p-3 rounded-lg"
              onPress={onDelete}
            >
              <Text className="text-center">Delete</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}
