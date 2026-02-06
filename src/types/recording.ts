export type RecordingItem = {
  id: string;
  uri: string;
  name: string;
  seoName: string;
  createdAt: string; // ISO date
  duration?: number;
};

export type InitUploadResponse = {
  resourceId: string;
  uploadUrl: string;
  s3Key: string;
};
