export const colors = {
  primaryDark: "#4F46E5",
  textPrimary: "#111827",
  textSecondary: "#6B7280",
  muted: "#9CA3AF",
  danger: "#EF4444",

  background: "#0B1020",
  surface: "#141A2E",
  text: "#FFFFFF",
  subText: "#9CA3AF",
  primary: "#8B9CFF",
  border: "rgba(255,255,255,0.12)",
};

export const getIconColor = (bg: string) => {
  // Manually tuned palette (best UX, no math weirdness)
  const map: Record<string, string> = {
    "#A5B4FC": "#1E1B4B", // indigo-900
    "#86EFAC": "#064E3B", // emerald-900
    "#FDE68A": "#78350F", // amber-900
  };

  return map[bg] ?? "#111827"; // fallback: gray-900
};
