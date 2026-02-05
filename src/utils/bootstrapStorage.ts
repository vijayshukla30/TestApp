import * as FileSystem from "expo-file-system/legacy";
import { STORAGE_PATHS } from "./storagePath";

export async function bootstrapStorage() {
  const folders = Object.values(STORAGE_PATHS);

  for (const path of folders) {
    const info = await FileSystem.getInfoAsync(path);
    if (!info.exists) {
      await FileSystem.makeDirectoryAsync(path, { intermediates: true });
    }
  }
}
