import {
  View,
  Text,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useEffect, useLayoutEffect, useState } from "react";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { useAppSelector } from "../../../hooks/useAppSelector";
import useAppDispatch from "../../../hooks/useAppDispatch";
import useAuth from "../../../hooks/useAuth";
import {
  fetchRecordingById,
  startTranscription,
} from "../../../features/recording/recordingSlice";
import Screen from "../../../components/Screen";
import { api } from "../../../services/api";

export default function RecordingDetail() {
  const { id } = useLocalSearchParams();
  const { token } = useAuth();
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const [menuOpen, setMenuOpen] = useState(false);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable
          onPress={() => setMenuOpen(true)}
          className="w-10 h-10 rounded-full bg-primary items-center justify-center"
        >
          <MaterialIcons name="menu" size={22} color="white" />
        </Pressable>
      ),
    });
  }, [id]);

  const recording = useAppSelector((state) =>
    state.recording.items.find((r) => r.uuid === id),
  );

  console.log("recording :>> ", recording);

  if (!recording) {
    return (
      <View className="p-5">
        <Text>No Recording found</Text>
      </View>
    );
  }

  async function handleTranscribe() {
    if (!token || !recording) return;

    await dispatch(
      startTranscription({
        recordingId: recording.uuid,
        token,
      }),
    );

    // Immediately fetch updated status
    dispatch(
      fetchRecordingById({
        recordingId: recording.uuid,
        token,
      }),
    );
  }

  useEffect(() => {
    if (!recording || recording.transcriptionStatus !== "PROCESSING") return;

    const interval = setInterval(() => {
      dispatch(
        fetchRecordingById({
          recordingId: recording.uuid,
          token,
        }),
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [recording?.transcriptionStatus, token]);
  async function handleDelete() {
    if (!token || !recording) return;
    await api.deleteRecording(recording.uuid, token);
    setMenuOpen(false);
  }

  return (
    <Screen>
      {menuOpen && (
        <>
          {/* overlay */}
          <Pressable
            onPress={() => setMenuOpen(false)}
            className="absolute inset-0 bg-black/40"
          />

          <View className="absolute right-5 top-24 bg-surface rounded-xl w-48 py-2 animate-in fade-in duration-150 border border-border z-50">
            <Pressable
              onPress={() => {
                setMenuOpen(false);
              }}
              className="px-4 py-3 active:opacity-70"
            >
              <Text className="text-text">Play</Text>
            </Pressable>

            <Pressable
              onPress={handleTranscribe}
              className="px-4 py-3 active:opacity-70"
            >
              <Text className="text-text">
                {recording.transcriptionStatus === "DONE"
                  ? "Retranscript"
                  : "Transcript"}
              </Text>
            </Pressable>

            <View className="h-px bg-border my-1" />

            <Pressable
              onPress={handleDelete}
              className="px-4 py-3 active:opacity-70"
            >
              <Text className="text-red-500">Delete</Text>
            </Pressable>
          </View>
        </>
      )}
      <View className="p-5">
        <Text className="text-text text-xl font-semibold mb-4">
          {recording.name}
        </Text>

        {recording.uploadStatus !== "UPLOADED" && (
          <Text className="text-subText mb-3">
            Upload must complete before transcription
          </Text>
        )}

        {recording.uploadStatus === "UPLOADED" &&
          recording.transcriptionStatus === "PENDING" && (
            <View className="mt-4">
              <Text className="text-subText mb-4">
                No transcript generated yet.
              </Text>

              <Pressable
                onPress={handleTranscribe}
                className="bg-primary px-4 py-3 rounded-xl items-center"
              >
                <Text className="text-background font-medium">
                  Convert to Text
                </Text>
              </Pressable>
            </View>
          )}

        {recording.transcriptionStatus === "PROCESSING" && (
          <View className="items-center mt-6">
            <ActivityIndicator />
            <Text className="text-subText mt-2">
              Converting audio to text...
            </Text>
          </View>
        )}

        {recording.transcriptionStatus === "DONE" && (
          <ScrollView className="mt-4">
            <Text className="text-text leading-6">{recording.transcript}</Text>
          </ScrollView>
        )}
      </View>
    </Screen>
  );
}
