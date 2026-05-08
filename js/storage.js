const STORAGE_KEY = "tankEntries";

export function loadEntries() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
}

export function saveEntries(entries) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function exportBackup() {
  const data = localStorage.getItem(STORAGE_KEY);

  if (!data) {
    alert("Keine Daten vorhanden");
    return;
  }

  const blob = new Blob([data], {
    type: "application/json"
  });

  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "tankEntries-backup.json";
  a.click();

  URL.revokeObjectURL(url);
}

export async function importBackupFile(file) {
  const text = await file.text();

  // Validierung (optional aber sinnvoll)
  try {
    const parsed = JSON.parse(text);

    if (!Array.isArray(parsed)) {
      alert("Ungültiges Backup-Format");
      return;
    }

    localStorage.setItem("tankEntries", JSON.stringify(parsed));
    location.reload();
  } catch (e) {
    alert("Fehler beim Import: Datei ist kein gültiges JSON");
  }
}