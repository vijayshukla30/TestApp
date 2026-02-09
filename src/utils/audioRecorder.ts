import { Audio } from "expo-av";

export async function startRecording() {
  await Audio.requestPermissionsAsync();

  await Audio.setAudioModeAsync({
    allowsRecordingIOS: true,
    playsInSilentModeIOS: true,
  });

  const recording = new Audio.Recording();

  await recording.prepareToRecordAsync(
    Audio.RecordingOptionsPresets.HIGH_QUALITY,
  );

  await recording.startAsync();
  return recording;
}

export async function stopRecording(
  recording: Audio.Recording,
  startedAt: number,
) {
  try {
    await recording.stopAndUnloadAsync();
  } catch {}

  const uri = recording.getURI();
  if (!uri) return null;

  const duration = Math.max(1, Math.floor((Date.now() - startedAt) / 1000));

  return {
    uri,
    duration,
    createdAt: new Date().toISOString(),
  };
}
