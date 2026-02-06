import { Text, Pressable, FlatList, View } from "react-native";
import { useState, useCallback, useRef, useEffect } from "react";
import { File } from "expo-file-system";
import { SwipeableMethods } from "react-native-gesture-handler/ReanimatedSwipeable";
import { MaterialIcons } from "@expo/vector-icons";
import Screen from "../../../components/Screen";
import { getRecordings, setRecordings } from "../../../utils/storage";
import { useFocusEffect, useRouter } from "expo-router";
import { groupByDate } from "../../../utils/groupByDate";
import RecordingCard from "../../../components/recorder/RecordingCard";
import { Audio } from "expo-av";

export default function Recording() {
  const router = useRouter();
  const [groups, setGroups] = useState<any[]>([]);

  const soundRef = useRef<Audio.Sound | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);

  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0); // 0 → 1

  async function load() {
    const data = await getRecordings();
    setGroups(groupByDate(data));
  }

  useFocusEffect(
    useCallback(() => {
      load();
    }, []),
  );

  useEffect(() => {
    return () => {
      stopPlayback();
    };
  }, []);

  async function deleteRecording(rec: any) {
    // delete file
    if (rec.uri) {
      const file = new File(rec.uri);
      await file.delete();
    }

    const all = await getRecordings();
    const filtered = all.filter((r) => r.id !== rec.id);
    await setRecordings(filtered);

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
    // If same recording → pause
    if (playingId === rec.id && soundRef.current && !isPaused) {
      await soundRef.current.pauseAsync();
      setIsPaused(true);
      return;
    }

    if (playingId === rec.id && soundRef.current && isPaused) {
      await soundRef.current.playAsync();
      setIsPaused(false);
      return;
    }

    // Stop any existing playback
    await stopPlayback();

    const { sound } = await Audio.Sound.createAsync(
      { uri: rec.uri },
      { shouldPlay: true },
    );

    soundRef.current = sound;
    setPlayingId(rec.id);
    setIsPaused(false);

    sound.setOnPlaybackStatusUpdate((status) => {
      if (!status.isLoaded) return;

      if (status.durationMillis) {
        setProgress(status.positionMillis / status.durationMillis);
      }

      if (status.didJustFinish) {
        stopPlayback();
      }
    });
  }

  return (
    <Screen>
      <Pressable
        className="flex-1"
        onPress={() => {
          openSwipeRef.current?.close();
          openSwipeRef.current = null;
        }}
      >
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
                  key={rec.id}
                  rec={rec}
                  onPress={() => {
                    openSwipeRef.current?.close();
                    router.push(`/record-note/${rec.id}`);
                  }}
                  onDelete={() => deleteRecording(rec)}
                  onOpen={handleOpen}
                  onPlay={() => playRecording(rec)}
                  isPlaying={playingId === rec.id}
                  isPaused={playingId === rec.id && isPaused}
                  progress={playingId === rec.id ? progress : 0}
                />
              ))}
            </View>
          )}
        />
      </Pressable>

      <Pressable
        className="absolute bottom-6 right-6 bg-green-600 p-5 rounded-full shadow-lg"
        onPress={() => router.push("/record-note/new")}
      >
        <MaterialIcons name="mic" size={30} color="white" />
      </Pressable>
    </Screen>
  );
}
