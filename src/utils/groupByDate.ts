import { RecordingItem } from "../types/recording";

export function groupByDate(items: RecordingItem[]) {
  const map: Record<string, RecordingItem[]> = {};

  items.forEach((item) => {
    const date = item.createdAt.split("T")[0];
    if (!map[date]) map[date] = [];
    map[date].push(item);
  });

  return Object.keys(map).map((date) => ({
    date,
    items: map[date],
  }));
}
