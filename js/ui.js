import { calcDurchschnitt } from "./calculations.js";

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
    document.getElementById("avgVerbrauch").textContent = "–";
    document.getElementById("avgKosten").textContent = "–";
  } else {
    document.getElementById("avgVerbrauch").textContent =
      calcDurchschnitt(entries, "verbrauch").toFixed(2);

    document.getElementById("avgKosten").textContent =
      calcDurchschnitt(entries, "kosten").toFixed(2);
  }
}
