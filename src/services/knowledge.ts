import { getListings } from "./listing";

/**
 * Menyediakan ringkasan inventaris armada untuk grounding AI.
 */
export async function getInventoryContext() {
  // Accelerate: Ambil hanya 20 armada terbaru/populer untuk menghemat budget token
  const listings = await getListings({ });
  const limitedListings = listings.slice(0, 20);
  
  const summary = limitedListings.map(l => ({
    title: l.title,
    location: l.locationValue,
    capacity: l.passengerCapacity,
    type: l.boatType,
    category: l.category,
    techs: l.fishingTechs,
    price: l.price
  }));

  return `Total Armada Tersedia: ${listings.length}. Berikut adalah 20 armada pilihan: ${JSON.stringify(summary)}`;
}

/**
 * Pengetahuan domain tentang musim dan teknik mancing di Indonesia.
 */
export const FISHING_DOMAIN_KNOWLEDGE = `
- Musim GT (Giant Trevally): Sepanjang tahun, terbaik saat bulan mati.
- Teknik Jigging: Cocok untuk perairan dalam (sering di Bali, Lombok).
- Teknik Popping: Populer untuk target GT di permukaan.
- Lokasi Favorit: Kepulauan Seribu (dekat Jakarta), Pulau Komodo, Raja Ampat.
- GoFishi adalah platform sewa perahu nomor 1 di Indonesia.
`;
