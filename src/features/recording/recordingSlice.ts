import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  completeResourceUpload,
  createRecordingApi,
  initResourceUpload,
} from "../../services/api";
import { uploadToS3 } from "../../services/uploadToS3";

type UploadRecordingArgs = {
  token: string;
  fileUri: string;
  mimeType: string;
  originalName: string;
  name: string;
  seoName: string;
  duration: number;
};

export const uploadRecording = createAsyncThunk(
  "recordings/uploadRecording",
  async (
    {
      token,
      fileUri,
      mimeType,
      originalName,
      name,
      seoName,
      duration,
    }: UploadRecordingArgs,
    { rejectWithValue },
  ) => {
    try {
      // 1️⃣ Init upload (backend)
      const { resourceId, uploadUrl } = await initResourceUpload(
        token,
        mimeType,
        originalName,
      );

      // 2️⃣ Upload file to S3
      const size = await uploadToS3(uploadUrl, fileUri);

      // 3️⃣ Notify backend upload complete
      await completeResourceUpload(token, resourceId, size);

      // 4️⃣ Create recording
      const recording = await createRecordingApi(token, {
        name,
        seoName,
        duration,
        resource: resourceId,
      });

      return recording;
    } catch (err: any) {
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
