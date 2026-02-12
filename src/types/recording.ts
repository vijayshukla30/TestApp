export type RecordingItem = {
  id: string;
  uri: string;
  name: string;
  seoName: string;
  createdAt: string; // ISO date
  duration?: number;
};

export type UploadStatus = "PENDING" | "UPLOADING" | "FAILED" | "UPLOADED";
export type TranscriptionStatus = "PENDING" | "PROCESSING" | "DONE" | "FAILED";

export type RecordingApiItem = {
  uuid: string;
  name?: string;
  createdAt: string;
  duration?: number;
  resource?: string;

  transcriptionStatus?: TranscriptionStatus;
  transcript?: string;
};

export type RecordingListItem = RecordingApiItem & {
  uploadStatus: UploadStatus;
  progress?: number;
  localUri?: string;
  uploadUrl?: string;
  resourceId?: string;
};

export type InitUploadResponse = {
  resourceId: string;
  uploadUrl: string;
  s3Key: string;
};
