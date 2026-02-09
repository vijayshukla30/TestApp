import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "uploadQueue";

export type UploadItem = {
  recordingId: string;
  resourceId: string;
  uploadUrl: string;
  localUri: string;
  uploadStatus: "PENDING" | "UPLOADING" | "FAILED";
  progress?: number;
};

export async function getUploadQueue(): Promise<UploadItem[]> {
  const raw = await AsyncStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : [];
}

export async function upsertUploadItem(item: UploadItem) {
  const list = await getUploadQueue();
  const next = [
    item,
    ...list.filter((i) => i.recordingId !== item.recordingId),
  ];
  await AsyncStorage.setItem(KEY, JSON.stringify(next));
}

export async function removeUploadItem(recordingId: string) {
  const list = await getUploadQueue();
  await AsyncStorage.setItem(
    KEY,
    JSON.stringify(list.filter((i) => i.recordingId !== recordingId)),
  );
}
export async function updateUploadStatus(
  recordingId: string,
  status: UploadItem["uploadStatus"],
) {
  const list = await getUploadQueue();
  const next = list.map((i) =>
    i.recordingId === recordingId ? { ...i, uploadStatus: status } : i,
  );
  await AsyncStorage.setItem(KEY, JSON.stringify(next));
}
export async function updateUploadProgress(
  recordingId: string,
  progress: number,
) {
  const list = await getUploadQueue();
  const next = list.map((i) =>
    i.recordingId === recordingId ? { ...i, progress } : i,
  );
  await AsyncStorage.setItem(KEY, JSON.stringify(next));
}
