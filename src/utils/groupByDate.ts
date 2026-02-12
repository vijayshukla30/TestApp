type DatedItem = { createdAt: string };

export function groupByDate<T extends DatedItem>(items: T[]) {
  const map: Record<string, T[]> = {};

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
