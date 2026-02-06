export const extractUSLocalNumber = (num: any) => {
  if (!num) return "";
  const cleaned = String(num).replace(/\D/g, "");
  return cleaned.slice(-10);
};

export const formatPhoneNumberUS = (digits: any) => {
  if (!digits) return "";

  const cleaned = String(digits).replace(/\D/g, "");

  if (cleaned.length !== 10) return cleaned;

  return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
};

export function slugify(text: string, maxLength = 20) {
  const slug = text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

  return slug.slice(0, maxLength).replace(/-$/, "");
}

function shortId(length = 4) {
  return Math.random()
    .toString(36)
    .slice(2, 2 + length);
}

function timeStamp() {
  const d = new Date();
  return (
    d.getFullYear().toString() +
    String(d.getMonth() + 1).padStart(2, "0") +
    String(d.getDate()).padStart(2, "0") +
    "-" +
    String(d.getHours()).padStart(2, "0") +
    String(d.getMinutes()).padStart(2, "0")
  );
}

export function generateSeoName(userName: string, extension = "m4a") {
  const base = slugify(userName) || "recording";
  return `${base}-${timeStamp()}-${shortId()}.${extension}`;
}

export function getDefaultRecordingName() {
  const now = new Date();

  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const hh = String(now.getHours()).padStart(2, "0");
  const min = String(now.getMinutes()).padStart(2, "0");

  return `recording_${yyyy}_${mm}_${dd}_${hh}_${min}`;
}

export function formatDate(date: string) {
  const d = new Date(date);
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatTime(date: string) {
  const d = new Date(date);
  return d.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDuration(ms?: number) {
  if (!ms) return "00:00";
  const total = Math.floor(ms / 1000);
  const mm = String(Math.floor(total / 60)).padStart(2, "0");
  const ss = String(total % 60).padStart(2, "0");
  return `${mm}:${ss}`;
}
