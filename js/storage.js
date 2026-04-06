const STORAGE_KEY = "tankEntries";

export function loadEntries() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
}

export function saveEntries(entries) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}
