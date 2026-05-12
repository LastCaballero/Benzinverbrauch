import { calcDurchschnitt } from "./calculations.js";
let verbrauchChartInstance = null;
let preisChartInstance = null;

export function renderHistory(entries, deleteEntry, editEntry) {
  const container = document.getElementById("historyList");

  container.innerHTML = "";

  entries.forEach((e, index) => {
    const card = document.createElement("div");
    card.className = "card";

    const content = document.createElement("div");
    content.className = "card-content";

    content.innerHTML = `
      <strong>${e.date}</strong><br>
      km: ${e.km}<br>
      Liter: ${e.liter}<br>
      Verbrauch: ${e.verbrauch.toFixed(2)}<br>
      Kosten: ${e.kosten.toFixed(2)} €
    `;

    // Button-Container
    const buttonContainer = document.createElement("div");
    buttonContainer.className = "card-buttons";

    // Bearbeiten-Button
    const editBtn = document.createElement("button");
    editBtn.className = "edit-btn";
    editBtn.textContent = "Bearbeiten";

    editBtn.addEventListener("click", () => {
      editEntry(index);
    });

    // Löschen-Button
    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.textContent = "Löschen";

    deleteBtn.addEventListener("click", () => {
      deleteEntry(index);
    });

    // Buttons anhängen
    buttonContainer.appendChild(editBtn);
    buttonContainer.appendChild(deleteBtn);

    // Karte zusammensetzen
    card.appendChild(content);
    card.appendChild(buttonContainer);

    container.appendChild(card);
  });
}

export function renderStats(entries) {

  if (entries.length === 0) {

    document.getElementById("avgVerbrauch")
      .textContent = "–";

    document.getElementById("avgKosten")
      .textContent = "–";

    return;
  }

  // Durchschnittswerte
  document.getElementById("avgVerbrauch")
    .textContent =
      calcDurchschnitt(entries, "verbrauch")
        .toFixed(2);

  document.getElementById("avgKosten")
    .textContent =
      calcDurchschnitt(entries, "kosten")
        .toFixed(2);

// Gesamte Liter
const totalLiter = entries.reduce((sum, e) => {
  return sum + e.liter;
}, 0);

document.getElementById("totalLiter")
  .textContent = totalLiter.toFixed(2);

// Gesamtkosten
const totalKosten = entries.reduce((sum, e) => {
  return sum + e.kosten;
}, 0);

document.getElementById("totalKosten")
  .textContent = totalKosten.toFixed(2);

  // Nach Datum sortieren
  const sorted = [...entries].sort((a, b) => {
    return new Date(a.date) - new Date(b.date);
  });

  const labels = sorted.map(e => e.date);

  const verbrauchData = sorted.map(e => {
    return Number(e.verbrauch.toFixed(2));
  });

  const preisData = sorted.map(e => {

    if (!e.liter || !e.kosten) {
      return 0;
    }

    return Number(
      (e.kosten / e.liter).toFixed(2)
    );
  });

  // Alte Charts zerstören
  if (verbrauchChartInstance) {
    verbrauchChartInstance.destroy();
  }

  if (preisChartInstance) {
    preisChartInstance.destroy();
  }

  // Verbrauchsdiagramm
  verbrauchChartInstance = new Chart(
    document.getElementById("verbrauchChart"),
    {
      type: "line",

      data: {
        labels,

        datasets: [
          {
            label: "Verbrauch",
            data: verbrauchData,
            borderWidth: 2,
            tension: 0.25
          }
        ]
      },

      options: {
        responsive: true
      }
    }
  );

  // Preisdiagramm
  preisChartInstance = new Chart(
    document.getElementById("preisChart"),
    {
      type: "line",

      data: {
        labels,

        datasets: [
          {
            label: "Preis/Liter",
            data: preisData,
            borderWidth: 2,
            tension: 0.25
          }
        ]
      },

      options: {
        responsive: true
      }
    }
  );
}
