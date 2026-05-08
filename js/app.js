import {
  loadEntries,
  saveEntries,
  exportBackup,
  importBackupFile
} from "./storage.js";
import { calcVerbrauch, calcKosten } from "./calculations.js";
import { renderHistory, renderStats } from "./ui.js";





let entries = loadEntries();

// DOM-Elemente einmalig referenzieren
const kmInput = document.getElementById("km");
const literInput = document.getElementById("liter");
const preisInput = document.getElementById("preis");
const saveBtn = document.getElementById("saveEntry");
const feedbackBox = document.getElementById("feedback");

function switchTab(tab) {
  document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
  document.querySelectorAll(".tabs button").forEach(b => b.classList.remove("active"));

  document.getElementById(tab).classList.add("active");
  document.querySelector(`[data-tab="${tab}"]`).classList.add("active");
}

function showFeedback(message, duration = 5000) {
  feedbackBox.textContent = message;
  feedbackBox.classList.add("show");

  setTimeout(() => {
    feedbackBox.classList.remove("show");
  }, duration);
}

function deleteEntry(index) {
  entries.splice(index, 1);
  saveEntries(entries);
  renderHistory(entries, deleteEntry);
  renderStats(entries);
  showFeedback("✓ Eintrag gelöscht");
}

document.querySelectorAll(".tabs button").forEach(btn => {
  btn.addEventListener("click", () => switchTab(btn.dataset.tab));
});

saveBtn.addEventListener("click", () => {
  const km = parseFloat(kmInput.value);
  const liter = parseFloat(literInput.value);
  const preis = parseFloat(preisInput.value);

  // Validierung
  if (isNaN(km) || isNaN(liter) || isNaN(preis)) {
    showFeedback("⚠ Bitte alle Felder ausfüllen", 2000);
    return;
  }

  if (km <= 0 || liter <= 0 || preis <= 0) {
    showFeedback("⚠ Werte müssen größer als 0 sein", 2000);
    return;
  }

  const verbrauch = calcVerbrauch(liter, km);
  const kosten = calcKosten(liter, preis);

  entries.push({
    date: new Date().toISOString().split("T")[0], // stabiles Datum
    km,
    liter,
    verbrauch,
    kosten
  });

  saveEntries(entries);
  renderHistory(entries, deleteEntry);
  renderStats(entries);

  // Eingabefelder leeren – km bleibt stehen
  literInput.value = "";
  preisInput.value = "";

  showFeedback("✓ Werte wurden gespeichert und erscheinen jetzt in der Historie", 5000);
});

renderHistory(entries, deleteEntry);
renderStats(entries);
document
  .getElementById("exportBtn")
  .addEventListener("click", exportBackup);

const importFile = document.getElementById("importFile");
const importBtn = document.getElementById("importBtn");

importBtn.addEventListener("click", () => {
  importFile.click();
});

importFile.addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  await importBackupFile(file);

  // Reset damit gleiche Datei erneut geladen werden kann
  importFile.value = "";
});