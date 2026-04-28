// Burç hesaplama, tarihten burcu döner (Türkçe ad)
export const ZODIAC_SIGNS = [
  { name: "Oğlak", from: [12, 22], to: [1, 19] },
  { name: "Kova", from: [1, 20], to: [2, 18] },
  { name: "Balık", from: [2, 19], to: [3, 20] },
  { name: "Koç", from: [3, 21], to: [4, 19] },
  { name: "Boğa", from: [4, 20], to: [5, 20] },
  { name: "İkizler", from: [5, 21], to: [6, 20] },
  { name: "Yengeç", from: [6, 21], to: [7, 22] },
  { name: "Aslan", from: [7, 23], to: [8, 22] },
  { name: "Başak", from: [8, 23], to: [9, 22] },
  { name: "Terazi", from: [9, 23], to: [10, 22] },
  { name: "Akrep", from: [10, 23], to: [11, 21] },
  { name: "Yay", from: [11, 22], to: [12, 21] },
];

export function zodiacFromDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const inRange = (m, dd, fromM, fromD, toM, toD) => {
    if (fromM === toM) return m === fromM && dd >= fromD && dd <= toD;
    // wrap (Oğlak)
    if (fromM > toM) return (m === fromM && dd >= fromD) || (m === toM && dd <= toD);
    return (m === fromM && dd >= fromD) || (m === toM && dd <= toD) || (m > fromM && m < toM);
  };
  for (const z of ZODIAC_SIGNS) {
    const [fM, fD] = z.from;
    const [tM, tD] = z.to;
    if (inRange(month, day, fM, fD, tM, tD)) return z.name;
  }
  return "";
}
