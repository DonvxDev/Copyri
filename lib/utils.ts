export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat("de-DE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(dateStr));
}

export function generateId(): string {
  return Math.random().toString(36).slice(2, 11) + Date.now().toString(36);
}

export const LICENSES = [
  { value: "CC-BY-4.0", label: "CC BY 4.0 — Namensnennung" },
  { value: "CC-BY-SA-4.0", label: "CC BY-SA 4.0 — Namensnennung + Weitergabe" },
  { value: "CC-BY-NC-4.0", label: "CC BY-NC 4.0 — Nicht-kommerziell" },
  { value: "CC-BY-NC-SA-4.0", label: "CC BY-NC-SA 4.0 — Nicht-kommerziell + Weitergabe" },
  { value: "CC-BY-ND-4.0", label: "CC BY-ND 4.0 — Keine Bearbeitung" },
  { value: "CC0-1.0", label: "CC0 1.0 — Gemeinfrei" },
  { value: "MIT", label: "MIT License" },
  { value: "Apache-2.0", label: "Apache 2.0" },
  { value: "GPL-3.0", label: "GNU GPL v3" },
  { value: "All-Rights-Reserved", label: "Alle Rechte vorbehalten" },
];

export const CATEGORIES = [
  { value: "image", label: "Bilder & Fotos" },
  { value: "meme", label: "Memes" },
  { value: "audio", label: "Audio & Sounds" },
  { value: "video", label: "Videos" },
  { value: "document", label: "Dokumente" },
  { value: "font", label: "Schriften" },
  { value: "code", label: "Code & Software" },
  { value: "other", label: "Sonstiges" },
];

export const MAX_FILE_SIZE = 5 * 1024 * 1024 * 1024; // 5 GB
