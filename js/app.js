import { loadEntries, saveEntries } from "./storage.js";
import { calcVerbrauch, calcKosten } from "./calculations.js";
import { renderHistory, renderStats } from "./ui.js";

let entries = loadEntries();

function switchTab(tab) {
  document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
  document.querySelectorAll(".tabs button").forEach(b => b.classList.remove("active"));

  document.getElementById(tab).classList.add("active");
  document.querySelector(`[data-tab="${tab}"]`).classList.add("active");
}

document.querySelectorAll(".tabs button").forEach(btn => {
  btn.addEventListener("click", () => switchTab(btn.dataset.tab));
});

document.getElementById("saveEntry").addEventListener("click", () => {
  const km = parseFloat(document.getElementById("km").value);
  const liter = parseFloat(document.getElementById("liter").value);
  const preis = parseFloat(document.getElementById("preis").value);

  const verbrauch = calcVerbrauch(liter, km);
  const kosten = calcKosten(liter, preis);

  entries.push({
    date: new Date().toLocaleDateString(),
    km, liter, verbrauch, kosten
  });

  saveEntries(entries);
  renderHistory(entries);
  renderStats(entries);
});

renderHistory(entries);
renderStats(entries);
