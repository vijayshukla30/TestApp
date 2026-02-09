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
import { Audio } from "expo-av";

import { startRecording, stopRecording } from "../../../utils/audioRecorder";
import {
  generateSeoName,
  getDefaultRecordingName,
} from "../../../utils/format";
import { STORAGE_PATHS } from "../../../utils/storagePath";
import RecordMicSection from "../../../components/agent/RecordMicSection";
import useAuth from "../../../hooks/useAuth";
import useAppDispatch from "../../../hooks/useAppDispatch";
import { uploadRecording } from "../../../features/recording/recordingSlice";
import { upsertUploadItem } from "../../../utils/uploadQueue";
import { api } from "../../../services/api";

export default function NewRecording() {
  const router = useRouter();
  const navigation = useNavigation();
  const { token } = useAuth();
  const dispatch = useAppDispatch();

  const recordingRef = useRef<Audio.Recording | null>(null);
  const startedAtRef = useRef<number | null>(null);
  const pausedAtRef = useRef<number | null>(null);

  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [fileName, setFileName] = useState("");
  const [confirmVisible, setConfirmVisible] = useState(false);

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
    (async () => {
      const rec = await startRecording();
      recordingRef.current = rec;
      startedAtRef.current = Date.now();
      pausedAtRef.current = null;
      setRecording(rec);
    })();

    return () => {
      recordingRef.current?.stopAndUnloadAsync();
      recordingRef.current = null;
    };
  }, []);

  /* ---------- Controls ---------- */

  const handleStop = async () => {
    if (!recordingRef.current || !startedAtRef.current) return;

    const res = await stopRecording(recordingRef.current, startedAtRef.current);

    recordingRef.current = null;
    startedAtRef.current = null;
    pausedAtRef.current = null;

    setRecording(null);
    setIsPaused(false);

    if (!res) return router.back();

    setResult(res);
    setFileName(getDefaultRecordingName());
    setConfirmVisible(true);
  };

  const handlePause = async () => {
    if (!recording || isPaused) return;
    await recording.pauseAsync();
    pausedAtRef.current = Date.now();
    setIsPaused(true);
  };

  const handleResume = async () => {
    if (!recording || !isPaused) return;
    await recording.startAsync();

    if (pausedAtRef.current && startedAtRef.current) {
      startedAtRef.current += Date.now() - pausedAtRef.current;
    }

    pausedAtRef.current = null;
    setIsPaused(false);
  };

  /* ---------- Save ---------- */

  async function onSave() {
    if (!result || !token) return;

    const name = fileName.trim() || getDefaultRecordingName();
    const seoName = generateSeoName(name);

    // 1️⃣ init upload
    const { recording, resource, uploadUrl } =
      await api.createRecordingAndInitUpload(token, {
        name: name,
        seoName,
        duration: result.duration,
        mimeType: "audio/m4a",
      });

    // 3️⃣ move file
    const finalUri = `${STORAGE_PATHS.recordings}${seoName}`;
    await new File(result.uri).move(new File(finalUri));

    await upsertUploadItem({
      recordingId: recording.uuid,
      resourceId: resource.uuid,
      uploadUrl,
      localUri: finalUri,
      uploadStatus: "PENDING",
    });

    dispatch(
      uploadRecording({
        token,
        recordingId: recording.uuid,
        resourceId: resource.uuid,
        uploadUrl,
        fileUri: finalUri,
      }),
    );

    setConfirmVisible(false);
    router.back();
  }

  return (
    <View className="flex-1 bg-black items-center justify-center">
      <Text className="text-white text-lg mb-4">Recording…</Text>

      <RecordMicSection
        recording={recording}
        isPaused={isPaused}
        onStop={handleStop}
        onPause={handlePause}
        onResume={handleResume}
      />

      <Modal transparent visible={confirmVisible}>
        <View className="flex-1 bg-black/60 items-center justify-center">
          <View className="bg-white p-6 rounded-xl w-80">
            <Text className="text-lg font-bold mb-2">Save recording</Text>

            <TextInput
              value={fileName}
              onChangeText={setFileName}
              autoFocus
              selectTextOnFocus
              placeholder="Recording name"
              className="border px-3 py-2 rounded mb-4"
            />

            <Pressable
              className="bg-green-600 p-3 rounded mb-2"
              onPress={onSave}
            >
              <Text className="text-white text-center">Save</Text>
            </Pressable>

            <Pressable
              className="bg-gray-200 p-3 rounded"
              onPress={() => router.back()}
            >
              <Text className="text-center">Delete</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}
