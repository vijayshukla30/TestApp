import * as FileSystem from "expo-file-system/legacy";
const APP_ROOT = `${FileSystem.documentDirectory}HeyGennie/`;

export const STORAGE_PATHS = {
  root: APP_ROOT,
  recordings: `${APP_ROOT}recordings/`,
};
