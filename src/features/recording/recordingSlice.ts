import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as FileSystem from "expo-file-system/legacy";
import { uploadToS3 } from "../../services/uploadToS3";
import { api } from "../../services/api";
import {
  removeUploadItem,
  updateUploadProgress,
  updateUploadStatus,
} from "../../utils/uploadQueue";

type UploadRecordingArgs = {
  token: string;
  recordingId: string;
  resourceId: string;
  uploadUrl: string;
  fileUri: string;
};

export const uploadRecording = createAsyncThunk(
  "recordings/uploadRecording",
  async (
    { token, recordingId, resourceId, uploadUrl, fileUri }: UploadRecordingArgs,
    { rejectWithValue },
  ) => {
    try {
      await updateUploadStatus(recordingId, "UPLOADING");
      const size = await uploadToS3(uploadUrl, fileUri, (progress) => {
        updateUploadProgress(recordingId, progress);
      });

      await api.completeResourceUpload(token, resourceId, size);
      try {
        await FileSystem.deleteAsync(fileUri, { idempotent: true });
      } catch (err) {
        console.warn("Failed to delete local file", err);
      }

      await removeUploadItem(recordingId);
      return { recordingId };
    } catch (err: any) {
      await updateUploadStatus(recordingId, "FAILED");
      return rejectWithValue(err.message || "Upload failed");
    }
  },
);

const recordingSlice = createSlice({
  name: "recordings",
  initialState: {
    items: [],
    uploading: false,
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(uploadRecording.pending, (state) => {
        state.uploading = true;
        state.error = null;
      })
      .addCase(uploadRecording.fulfilled, (state, action) => {
        state.uploading = false;
        state.items.unshift(action.payload);
      })
      .addCase(uploadRecording.rejected, (state, action) => {
        state.uploading = false;
        state.error = action.payload as string;
      });
  },
});

export default recordingSlice.reducer;
