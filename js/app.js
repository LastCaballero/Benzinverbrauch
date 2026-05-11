import {
  loadEntries,
  saveEntries,
  exportBackup,
  importBackupFile
} from "./storage.js";

import {
  calcVerbrauch,
  calcKosten
} from "./calculations.js";

import {
  renderHistory,
  renderStats
} from "./ui.js";

let entries = loadEntries();

let editIndex = null;

// DOM-Elemente
const datumInput = document.getElementById("datum");

const kmInput = document.getElementById("km");
const literInput = document.getElementById("liter");
const preisInput = document.getElementById("preis");

const saveBtn = document.getElementById("saveEntry");

const feedbackBox = document.getElementById("feedback");

// Standarddatum = heute
datumInput.value = new Date()
  .toISOString()
  .split("T")[0];

// Tabs wechseln
function switchTab(tab) {

  document
    .querySelectorAll(".tab")
    .forEach(t => t.classList.remove("active"));

  document
    .querySelectorAll(".tabs button")
    .forEach(b => b.classList.remove("active"));

  document
    .getElementById(tab)
    .classList.add("active");

  document
    .querySelector(`[data-tab="${tab}"]`)
    .classList.add("active");
}

// Feedback anzeigen
function showFeedback(message, duration = 5000) {

  feedbackBox.textContent = message;

  feedbackBox.classList.add("show");

  setTimeout(() => {
    feedbackBox.classList.remove("show");
  }, duration);
}

// Eintrag löschen
function deleteEntry(index) {

  entries.splice(index, 1);

  saveEntries(entries);

  renderHistory(
    entries,
    deleteEntry,
    editEntry
  );

  renderStats(entries);

  showFeedback("✓ Eintrag gelöscht");
}

// Eintrag bearbeiten
function editEntry(index) {

  const entry = entries[index];

  datumInput.value = entry.date;

  kmInput.value = entry.km;

  literInput.value = entry.liter;

  preisInput.value =
    (entry.kosten / entry.liter).toFixed(2);

  editIndex = index;

  saveBtn.textContent =
    "Änderung speichern";

  switchTab("eingabe");

  showFeedback(
    "Eintrag wird bearbeitet",
    2000
  );
}

// Tabs
document
  .querySelectorAll(".tabs button")
  .forEach(btn => {

    btn.addEventListener("click", () => {
      switchTab(btn.dataset.tab);
    });

  });

// Speichern / Bearbeiten
saveBtn.addEventListener("click", () => {

  const datum = datumInput.value;

  const km = parseFloat(kmInput.value);

  const liter = parseFloat(literInput.value);

  const preis = parseFloat(preisInput.value);

  // Validierung
  if (
    !datum ||
    isNaN(km) ||
    isNaN(liter) ||
    isNaN(preis)
  ) {

    showFeedback(
      "⚠ Bitte alle Felder ausfüllen",
      2000
    );

    return;
  }

  if (
    km <= 0 ||
    liter <= 0 ||
    preis <= 0
  ) {

    showFeedback(
      "⚠ Werte müssen größer als 0 sein",
      2000
    );

    return;
  }

  // Berechnungen
  const verbrauch =
    calcVerbrauch(liter, km);

  const kosten =
    calcKosten(liter, preis);

  // Neuer Datensatz
  const newEntry = {
    date: datum,
    km,
    liter,
    verbrauch,
    kosten
  };

  // Bearbeiten oder Neu
  if (editIndex !== null) {

    entries[editIndex] = newEntry;

    editIndex = null;

    saveBtn.textContent = "Speichern";

    showFeedback(
      "✓ Eintrag aktualisiert",
      3000
    );

  } else {

    entries.push(newEntry);

    showFeedback(
      "✓ Werte wurden gespeichert und erscheinen jetzt in der Historie",
      5000
    );
  }

  // Speichern
  saveEntries(entries);

  // UI aktualisieren
  renderHistory(
    entries,
    deleteEntry,
    editEntry
  );

  renderStats(entries);

  // Felder leeren
  literInput.value = "";
  preisInput.value = "";

  // Datum zurück auf heute
  datumInput.value = new Date()
    .toISOString()
    .split("T")[0];
});

// Initial render
renderHistory(
  entries,
  deleteEntry,
  editEntry
);

renderStats(entries);

// Export
document
  .getElementById("exportBtn")
  .addEventListener(
    "click",
    exportBackup
  );

// Import
const importFile =
  document.getElementById("importFile");

const importBtn =
  document.getElementById("importBtn");

importBtn.addEventListener("click", () => {
  importFile.click();
});

importFile.addEventListener(
  "change",
  async (e) => {

    const file = e.target.files[0];

    if (!file) return;

    await importBackupFile(file);

    importFile.value = "";
  }
);