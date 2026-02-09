import * as FileSystem from "expo-file-system/legacy";

export async function uploadToS3(
  uploadUrl: string,
  fileUri: string,
  onProgress?: (p: number) => void,
) {
  return new Promise<number>(async (resolve, reject) => {
    const file = await FileSystem.getInfoAsync(fileUri);
    if (!file.exists) return reject("File missing");

    const xhr = new XMLHttpRequest();
    xhr.open("PUT", uploadUrl);

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(e.loaded / e.total);
      }
    };

    xhr.onload = () =>
      xhr.status === 200 ? resolve(file.size ?? 0) : reject("Upload failed");

    xhr.onerror = reject;

    xhr.send({
      uri: fileUri,
      type: "audio/m4a",
      name: "recording.m4a",
    });
  });
}
