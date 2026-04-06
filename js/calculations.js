export function calcVerbrauch(liter, km) {
  return (liter / km) * 100;
}

export function calcKosten(liter, preis) {
  return liter * preis;
}

export function calcDurchschnitt(entries, key) {
  if (entries.length === 0) return 0;
  return entries.reduce((s, e) => s + e[key], 0) / entries.length;
}
