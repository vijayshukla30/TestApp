export type RecordingItem = {
  id: string;
  uri: string;
  name: string;
  seoName: string;
  createdAt: string; // ISO date
  duration?: number;
};

type GroupedRecordings = {
  date: string; // yyyy-mm-dd
  items: RecordingItem[];
};
