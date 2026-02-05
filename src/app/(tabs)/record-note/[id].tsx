import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { getRecordings } from "../../../utils/storage";

export default function RecordingDetail() {
  const { id } = useLocalSearchParams();
  const [rec, setRec] = useState<any>(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const list = await getRecordings();
    setRec(list.find((r) => r.id === id));
  }

  if (!rec) return null;

  return (
    <View className="p-5">
      <Text className="text-lg font-bold">Recording</Text>
      <Text className="text-gray-500 mt-2">{rec.uri}</Text>

      {/* Playback later */}
    </View>
  );
}
