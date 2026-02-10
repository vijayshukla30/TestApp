import {
  Text,
  Pressable,
  FlatList,
  View,
  ActivityIndicator,
} from "react-native";
import { useState, useCallback, useRef, useEffect } from "react";
import * as FileSystem from "expo-file-system/legacy";
import { SwipeableMethods } from "react-native-gesture-handler/ReanimatedSwipeable";
import { MaterialIcons } from "@expo/vector-icons";
import Screen from "../../../components/Screen";
import { useFocusEffect, useRouter } from "expo-router";
import { groupByDate } from "../../../utils/groupByDate";
import RecordingCard from "../../../components/recorder/RecordingCard";
import { Audio } from "expo-av";
import { getUploadQueue } from "../../../utils/uploadQueue";
import useAuth from "../../../hooks/useAuth";
import { api } from "../../../services/api";
import useAppDispatch from "../../../hooks/useAppDispatch";
import { uploadRecording } from "../../../features/recording/recordingSlice";

export default function Recording() {
  const router = useRouter();
  const { token } = useAuth();
  const dispatch = useAppDispatch();

  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const soundRef = useRef<Audio.Sound | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);

  async function load() {
    if (!token) return;

    try {
      setLoading(true);

      const recordings = await api.getAllRecordings(token);
      const queue = await getUploadQueue();
      const queueMap = new Map(queue.map((q) => [q.recordingId, q]));

      const hydrated = recordings.map((r: any) => {
        const local = queueMap.get(r.uuid);
        return {
          ...r,
          uploadStatus: local?.uploadStatus ?? "UPLOADED",
          progress: local?.progress,
          localUri: local?.localUri,
          uploadUrl: local?.uploadUrl,
          resourceId: local?.resourceId,
        };
      });

      setGroups(groupByDate(hydrated));
    } finally {
      setLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      load();
    }, [token]),
  );

  useEffect(() => {
    return () => {
      void stopPlayback();
    };
  }, []);

  function manualUpload(rec: any) {
    console.log("UPLOAD CLICK", {
      token: !!token,
      localUri: rec.localUri,
      uploadUrl: rec.uploadUrl,
      resourceId: rec.resourceId,
    });

    if (!token || !rec.localUri || !rec.uploadUrl || !rec.resourceId) return;

    dispatch(
      uploadRecording({
        token,
        recordingId: rec.uuid,
        resourceId: rec.resourceId,
        uploadUrl: rec.uploadUrl,
        fileUri: rec.localUri,
      }),
    );
  }

  async function deleteRecording(rec: any) {
    if (rec.localUri) {
      try {
        await FileSystem.deleteAsync(rec.localUri, { idempotent: true });
      } catch {}
    }
    await api.deleteRecording(rec.uuid, token);
    load();
  }

  const openSwipeRef = useRef<SwipeableMethods | null>(null);

  function handleOpen(ref: SwipeableMethods) {
    if (openSwipeRef.current && openSwipeRef.current !== ref) {
      openSwipeRef.current.close();
    }
    openSwipeRef.current = ref;
  }

  async function stopPlayback() {
    if (soundRef.current) {
      await soundRef.current.stopAsync();
      await soundRef.current.unloadAsync();
      soundRef.current = null;
    }
    setPlayingId(null);
    setIsPaused(false);
    setProgress(0);
  }

  async function playRecording(rec: any) {
    if (rec.uploadStatus !== "UPLOADED") return;

    if (playingId === rec.uuid && soundRef.current && !isPaused) {
      await soundRef.current.pauseAsync();
      setIsPaused(true);
      return;
    }

    if (playingId === rec.uuid && soundRef.current && isPaused) {
      await soundRef.current.playAsync();
      setIsPaused(false);
      return;
    }

    await stopPlayback();
    const { url } = await api.getSignedPlaybackUrl(token, rec.resource);
    const { sound } = await Audio.Sound.createAsync(
      { uri: url },
      { shouldPlay: true },
    );

    soundRef.current = sound;
    setPlayingId(rec.uuid);
    setIsPaused(false);

    sound.setOnPlaybackStatusUpdate((status) => {
      if (!status.isLoaded) return;
      if (status.durationMillis) {
        setProgress(status.positionMillis / status.durationMillis);
      }
      if (status.didJustFinish) stopPlayback();
    });
  }

  return (
    <Screen>
      {loading && (
        <View className="p-4">
          <ActivityIndicator />
        </View>
      )}

      <FlatList
        data={groups}
        keyExtractor={(item) => item.date}
        renderItem={({ item }) => (
          <View className="p-4">
            <Text className="text-gray-500 font-semibold mb-3">
              {item.date}
            </Text>

            {item.items.map((rec: any) => (
              <RecordingCard
                key={rec.uuid}
                rec={rec}
                onPress={() => router.push(`/record-note/${rec.uuid}`)}
                onDelete={() => deleteRecording(rec)}
                onOpen={handleOpen}
                onPlay={() => playRecording(rec)}
                onUpload={() => manualUpload(rec)}
                isPlaying={playingId === rec.uuid}
                isPaused={playingId === rec.uuid && isPaused}
                progress={
                  playingId === rec.uuid ? progress : (rec.progress ?? 0)
                }
              />
            ))}
          </View>
        )}
      />

      <Pressable
        className="absolute bottom-6 right-6 bg-green-600 p-5 rounded-full"
        onPress={() => router.push("/record-note/new")}
      >
        <MaterialIcons name="mic" size={30} color="white" />
      </Pressable>
    </Screen>
  );
}
