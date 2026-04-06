import { calcDurchschnitt } from "./calculations.js";

export function renderHistory(entries) {
  const container = document.getElementById("historyList");
  container.innerHTML = "";

  entries.forEach(e => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <strong>${e.date}</strong><br>
      km: ${e.km}<br>
      Liter: ${e.liter}<br>
      Verbrauch: ${e.verbrauch.toFixed(2)}<br>
      Kosten: ${e.kosten.toFixed(2)} €
    `;
    container.appendChild(card);
  });
}

export function renderStats(entries) {
  document.getElementById("avgVerbrauch").textContent =
    calcDurchschnitt(entries, "verbrauch").toFixed(2);

  document.getElementById("avgKosten").textContent =
    calcDurchschnitt(entries, "kosten").toFixed(2);
}
