import {
  Text,
  Pressable,
  FlatList,
  View,
  ActivityIndicator,
} from "react-native";
import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import * as FileSystem from "expo-file-system/legacy";
import { MaterialIcons } from "@expo/vector-icons";
import Screen from "../../../components/Screen";
import { useFocusEffect, useRouter } from "expo-router";
import { groupByDate } from "../../../utils/groupByDate";
import RecordingCard from "../../../components/recorder/RecordingCard";
import { Audio } from "expo-av";
import useAuth from "../../../hooks/useAuth";
import { api } from "../../../services/api";
import useAppDispatch from "../../../hooks/useAppDispatch";
import { useAppSelector } from "../../../hooks/useAppSelector";
import {
  fetchRecordings,
  uploadRecording,
} from "../../../features/recording/recordingSlice";

export default function Recording() {
  const router = useRouter();
  const { token } = useAuth();
  const dispatch = useAppDispatch();

  const items = useAppSelector((state) => state.recording.items);
  const loading = useAppSelector((state) => state.recording.loading);
  const [refreshing, setRefreshing] = useState(false);

  const soundRef = useRef<Audio.Sound | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);

  async function onRefresh() {
    if (!token) return;
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }

  async function load() {
    if (!token) return;
    await dispatch(fetchRecordings({ token }));
  }

  useFocusEffect(
    useCallback(() => {
      load();
    }, [token]),
  );

  const groups = useMemo(() => groupByDate(items), [items]);

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
    console.log("rec :>> ", rec);
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
    let uri: string;

    // 🔑 prefer local file if still exists
    if (rec.localUri) {
      const info = await FileSystem.getInfoAsync(rec.localUri);
      if (info.exists) {
        uri = rec.localUri;
      } else {
        // fallback to remote
        const res = await api.getSignedPlaybackUrl(token, rec.uuid);
        uri = res.url;
      }
    } else {
      // remote only
      const res = await api.getSignedPlaybackUrl(token, rec.resource);
      uri = res.url;
    }
    console.log("uri :>> ", uri);
    const { sound } = await Audio.Sound.createAsync(
      { uri },
      { shouldPlay: true },
    );

    soundRef.current = sound;
    setPlayingId(rec.uuid);
    setIsPaused(false);

    sound.setOnPlaybackStatusUpdate((status) => {
      if (!status.isLoaded) return;

      if (status.didJustFinish) {
        stopPlayback();
      }
    });
  }

  console.log("groups :>> ", groups[0]?.items);

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
        refreshing={refreshing}
        onRefresh={onRefresh}
        renderItem={({ item }) => (
          <View className="p-4">
            <Text className="text-gray-500 font-semibold mb-3">
              {item.date}
            </Text>

            {item.items.map((rec: any) => (
              <RecordingCard
                key={rec.uuid}
                rec={rec}
                onScript={() => router.push(`/record-note/${rec.uuid}`)}
                onDelete={() => deleteRecording(rec)}
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
