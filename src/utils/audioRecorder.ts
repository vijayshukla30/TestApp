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

  const tempUri = recording.getURI();
  if (!tempUri) return null;

  const duration = Math.floor((Date.now() - startedAt) / 1000);

  return {
    uri: tempUri,
    createdAt: new Date().toISOString(),
    duration,
  };

  // const sourceFile = new File(tempUri);
  // const ext = tempUri.split(".").pop() ?? "m4a";
  // const fileName = `rec-${Date.now()}.${ext}`;
  // const targetUri = `${STORAGE_PATHS.recordings}${fileName}`;
  // console.log("targetUri :>> ", targetUri);

  // await sourceFile.move(new File(targetUri));

  // return {
  //   uri: targetUri,
  //   createdAt: new Date().toISOString(),
  //   duration,
  // };
}
