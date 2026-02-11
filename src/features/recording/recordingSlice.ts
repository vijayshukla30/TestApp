import { createAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as FileSystem from "expo-file-system/legacy";
import { File } from "expo-file-system";
import { uploadToS3 } from "../../services/uploadToS3";
import { api } from "../../services/api";
import {
  getUploadQueue,
  removeUploadItem,
  updateUploadProgress,
  updateUploadStatus,
  upsertUploadItem,
  type UploadItem,
} from "../../utils/uploadQueue";
import {
  RecordingApiItem,
  RecordingListItem,
  UploadStatus,
} from "../../types/recording";
import { STORAGE_PATHS } from "../../utils/storagePath";

type UploadRecordingArgs = {
  token: string;
  recordingId: string;
  resourceId: string;
  uploadUrl: string;
  fileUri: string;
};

type InitRecordingUploadArgs = {
  token: string;
  name: string;
  seoName: string;
  duration: number;
  mimeType: string;
  fileUri: string;
};

type RecordingState = {
  items: RecordingListItem[];
  uploadQueue: UploadItem[];
  loading: boolean;
  uploading: boolean;
  error: string | null;
};

function decorateRecordingsWithQueue(
  recordings: RecordingApiItem[],
  queue: UploadItem[],
): RecordingListItem[] {
  const queueMap = new Map(queue.map((q) => [q.recordingId, q]));

  return recordings.map((rec) => {
    const local = queueMap.get(rec.uuid);
    return {
      ...rec,
      uploadStatus: local?.uploadStatus ?? "UPLOADED",
      progress: local?.progress,
      localUri: local?.localUri,
      uploadUrl: local?.uploadUrl,
      resourceId: local?.resourceId,
    };
  });
}

function applyQueueToItems(
  items: RecordingListItem[],
  queue: UploadItem[],
): RecordingListItem[] {
  const queueMap = new Map(queue.map((q) => [q.recordingId, q]));

  return items.map((item) => {
    const local = queueMap.get(item.uuid);
    if (local) {
      return {
        ...item,
        uploadStatus: local.uploadStatus,
        progress: local.progress,
        localUri: local.localUri,
        uploadUrl: local.uploadUrl,
        resourceId: local.resourceId,
      };
    }

    return {
      ...item,
      uploadStatus: "UPLOADED",
      progress: undefined,
      localUri: undefined,
      uploadUrl: undefined,
      resourceId: undefined,
    };
  });
}

function upsertQueueItem(queue: UploadItem[], item: UploadItem) {
  return [item, ...queue.filter((q) => q.recordingId !== item.recordingId)];
}

export const restoreUploadQueue = createAsyncThunk(
  "recordings/restoreUploadQueue",
  async () => {
    return getUploadQueue();
  },
);

export const uploadQueueRestored = createAction<UploadItem[]>(
  "recordings/uploadQueueRestored",
);
export const uploadQueueItemUpserted = createAction<UploadItem>(
  "recordings/uploadQueueItemUpserted",
);
export const uploadStatusUpdated = createAction<{
  recordingId: string;
  status: UploadItem["uploadStatus"] | UploadStatus;
}>("recordings/uploadStatusUpdated");
export const uploadProgressUpdated = createAction<{
  recordingId: string;
  progress: number;
}>("recordings/uploadProgressUpdated");
export const uploadQueueItemRemoved = createAction<{
  recordingId: string;
}>("recordings/uploadQueueItemRemoved");

export const fetchRecordings = createAsyncThunk(
  "recordings/fetchRecordings",
  async ({ token }: { token: string }, { rejectWithValue }) => {
    try {
      const [recordings, queue] = await Promise.all([
        api.getAllRecordings(token),
        getUploadQueue(),
      ]);

      return {
        items: decorateRecordingsWithQueue(recordings, queue),
        queue,
      };
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to load recordings");
    }
  },
);

export const initRecordingUpload = createAsyncThunk(
  "recordings/initRecordingUpload",
  async (
    {
      token,
      name,
      seoName,
      duration,
      mimeType,
      fileUri,
    }: InitRecordingUploadArgs,
    { rejectWithValue },
  ) => {
    try {
      const { recording, resource, uploadUrl } =
        await api.createRecordingAndInitUpload(token, {
          name,
          seoName,
          duration,
          mimeType,
        });

      const finalUri = `${STORAGE_PATHS.recordings}${seoName}`;
      await new File(fileUri).move(new File(finalUri));

      const uploadItem: UploadItem = {
        recordingId: recording.uuid,
        resourceId: resource.uuid,
        uploadUrl,
        localUri: finalUri,
        uploadStatus: "PENDING",
      };

      await upsertUploadItem(uploadItem);
      return uploadItem;
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to init upload");
    }
  },
);

export const uploadRecording = createAsyncThunk(
  "recordings/uploadRecording",
  async (
    { token, recordingId, resourceId, uploadUrl, fileUri }: UploadRecordingArgs,
    { rejectWithValue, dispatch, getState },
  ) => {
    const state = getState() as { recording: RecordingState };
    const existing = state.recording.uploadQueue.find(
      (q) => q.recordingId === recordingId,
    );

    if (existing?.uploadStatus === "UPLOADING") {
      return;
    }

    try {
      await updateUploadStatus(recordingId, "UPLOADING");
      dispatch(
        uploadStatusUpdated({
          recordingId,
          status: "UPLOADING",
        }),
      );
      const size = await uploadToS3(uploadUrl, fileUri, (progress) => {
        void updateUploadProgress(recordingId, progress);
        dispatch(
          uploadProgressUpdated({
            recordingId,
            progress,
          }),
        );
      });

      await api.completeResourceUpload(token, resourceId, size);
      try {
        const fileInfo = await FileSystem.getInfoAsync(fileUri);
        if (fileInfo.exists) {
          await FileSystem.deleteAsync(fileUri, { idempotent: true });
        }
      } catch (err) {
        console.warn("Failed to delete local file", err);
      }

      await removeUploadItem(recordingId);
      dispatch(uploadQueueItemRemoved({ recordingId }));
      return { recordingId };
    } catch (err: any) {
      await updateUploadStatus(recordingId, "FAILED");
      dispatch(
        uploadStatusUpdated({
          recordingId,
          status: "FAILED",
        }),
      );
      return rejectWithValue(err.message || "Upload failed");
    }
  },
);

const recordingSlice = createSlice({
  name: "recordings",
  initialState: {
    items: [],
    uploadQueue: [],
    loading: false,
    uploading: false,
    error: null as string | null,
  } as RecordingState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(restoreUploadQueue.fulfilled, (state, action) => {
        state.uploadQueue = action.payload;
        state.items = applyQueueToItems(state.items, action.payload);
      })
      .addCase(uploadQueueRestored, (state, action) => {
        state.uploadQueue = action.payload;
        state.items = applyQueueToItems(state.items, action.payload);
      })
      .addCase(uploadQueueItemUpserted, (state, action) => {
        state.uploadQueue = upsertQueueItem(state.uploadQueue, action.payload);
        state.items = applyQueueToItems(state.items, state.uploadQueue);
      })
      .addCase(uploadStatusUpdated, (state, action) => {
        const { recordingId, status } = action.payload;
        state.uploadQueue = state.uploadQueue.map((item) =>
          item.recordingId === recordingId
            ? { ...item, uploadStatus: status as UploadItem["uploadStatus"] }
            : item,
        );
        state.items = state.items.map((item) =>
          item.uuid === recordingId ? { ...item, uploadStatus: status } : item,
        );
      })
      .addCase(uploadProgressUpdated, (state, action) => {
        const { recordingId, progress } = action.payload;
        state.uploadQueue = state.uploadQueue.map((item) =>
          item.recordingId === recordingId ? { ...item, progress } : item,
        );
        state.items = state.items.map((item) =>
          item.uuid === recordingId ? { ...item, progress } : item,
        );
      })
      .addCase(uploadQueueItemRemoved, (state, action) => {
        const { recordingId } = action.payload;
        state.uploadQueue = state.uploadQueue.filter(
          (item) => item.recordingId !== recordingId,
        );
        state.items = state.items.map((item) =>
          item.uuid === recordingId
            ? {
                ...item,
                uploadStatus: "UPLOADED",
                progress: undefined,
                localUri: undefined,
                uploadUrl: undefined,
                resourceId: undefined,
              }
            : item,
        );
      })
      .addCase(fetchRecordings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecordings.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.uploadQueue = action.payload.queue;
      })
      .addCase(fetchRecordings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(initRecordingUpload.fulfilled, (state, action) => {
        state.uploadQueue = upsertQueueItem(state.uploadQueue, action.payload);
        state.items = applyQueueToItems(state.items, state.uploadQueue);
      })
      .addCase(initRecordingUpload.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(uploadRecording.pending, (state) => {
        state.uploading = true;
        state.error = null;
      })
      .addCase(uploadRecording.fulfilled, (state, action) => {
        state.uploading = false;
      })
      .addCase(uploadRecording.rejected, (state, action) => {
        state.uploading = false;
        state.error = action.payload as string;
      });
  },
});

export default recordingSlice.reducer;
