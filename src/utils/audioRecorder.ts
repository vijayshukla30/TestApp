import { Audio } from "expo-av";
import { File, Directory } from "expo-file-system";
import { STORAGE_PATHS } from "./storagePath";

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

export async function stopRecording(recording: Audio.Recording) {
  await recording.stopAndUnloadAsync();

  const tempUri = recording.getURI();
  if (!tempUri) return null;

  const sourceFile = new File(tempUri);

  const fileName = `rec-${Date.now()}.m4a`;
  const targetUri = `${STORAGE_PATHS.recordings}${fileName}`;
  console.log("targetUri :>> ", targetUri);

  await sourceFile.move(new File(targetUri));

  return {
    uri: targetUri,
    createdAt: new Date().toISOString(),
  };
}
