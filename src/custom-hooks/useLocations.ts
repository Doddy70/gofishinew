// Indonesian fishing locations with coordinates
// Based on real dermaga/pelabuhan areas in Jakarta and surroundings

export interface LocationCoords {
  value: string;
  label: string;
  region: string;
  latlng: [number, number];
  area?: string;
}

export const INDONESIAN_LOCATIONS: LocationCoords[] = [
  // Jakarta Area
  { value: "ancol", label: "Dermaga Ancol", region: "Jakarta Utara", latlng: [-6.1167, 106.8333], area: "Taman Impian Jaya Ancol" },
  { value: "muara-angke", label: "Muara Angke", region: "Jakarta Utara", latlng: [-6.1183, 106.7667], area: "Taman Nasional Muara Angke" },
  { value: "marina-ancol", label: "Marina Ancol", region: "Jakarta Utara", latlng: [-6.1100, 106.8450], area: "Marina Jaya Ancol" },
  { value: "pademangan", label: "Pademangan", region: "Jakarta Utara", latlng: [-6.1333, 106.8167], area: "Pelabuhan Pademangan" },
  { value: "sunter", label: "Sunter", region: "Jakarta Utara", latlng: [-6.1500, 106.8000], area: "Pelabuhan Sunter" },
  { value: "tanjung-priok", label: "Tanjung Priok", region: "Jakarta Utara", latlng: [-6.0833, 106.8833], area: "Pelabuhan Tanjung Priok" },
  { value: "kalibaru", label: "Kalibaru", region: "Jakarta Utara", latlng: [-6.1167, 106.8667], area: "Pelabuhan Kalibaru" },

  // Kepulauan Seribu
  { value: "kepulauan-seribu", label: "Kepulauan Seribu", region: "Kepulauan Seribu", latlng: [-5.7500, 106.5833] },
  { value: "pulau-pramuka", label: "Pulau Pramuka", region: "Kepulauan Seribu", latlng: [-5.7333, 106.6167], area: "KCD Pramuka" },
  { value: "pulau-untu", label: "Pulau Untung Jawa", region: "Kepulauan Seribu", latlng: [-5.9333, 106.7500], area: "Dermaga Untung Jawa" },
  { value: "pulau-bidadari", label: "Pulau Bidadari", region: "Kepulauan Seribu", latlng: [-5.9500, 106.7167], area: "Pulau Bidadari" },
  { value: "pulau-tidung", label: "Pulau Tidung", region: "Kepulauan Seribu", latlng: [-5.8667, 106.5333], area: "Pulau Tidung" },
  { value: "pulau-harapan", label: "Pulau Harapan", region: "Kepulauan Seribu", latlng: [-5.9167, 106.6167], area: "Pulau Harapan" },

  // Jakarta & Tanggerang
  { value: "pantaimutiara", label: "Pantai Mutiara", region: "Jakarta Utara", latlng: [-6.1083, 106.7417], area: "Pantai Mutiara" },
  { value: "pantaisabang", label: "Pantai Sabang", region: "Jakarta Utara", latlng: [-6.1056, 106.7800], area: "Pantai Sabang" },
  { value: "tanjung-tokyo", label: "Tanjung Tokyo", region: "Tangerang", latlng: [-6.0167, 106.7333], area: "Pelabuhan Tanjung Tokyo" },
  { value: "batuceper", label: "Batuceper", region: "Tangerang", latlng: [-6.0833, 106.6667], area: "Pelabuhan Batuceper" },
  { value: "tanjung-bayang", label: "Tanjung Bayang", region: "Makassar", latlng: [-5.1333, 119.4167], area: "Pelabuhan Tanjung Bayang" },

  // West Java Coastal
  { value: "karawang", label: "Karawang", region: "Jawa Barat", latlng: [-6.3000, 107.3333], area: "Pelabuhan Karawang" },
  { value: "subang", label: "Subang", region: "Jawa Barat", latlng: [-6.5667, 107.8000], area: "Pelabuhan Patimban" },
  { value: "pangandaran", label: "Pangandaran", region: "Jawa Barat", latlng: [-7.6833, 108.6500], area: "Pelabuhan Pangandaran" },
  { value: "carita", label: "Carita", region: "Banten", latlng: [-6.2333, 105.7333], area: "Pantai Carita" },
  { value: "anyer", label: "Anyer", region: "Banten", latlng: [-6.0333, 105.8500], area: "Pantai Anyer" },
  { value: "sampit", label: "Sampit", region: "Kalimantan Tengah", latlng: [-2.5333, 112.9500], area: "Pelabuhan Sampit" },

  // Default fallback - Jakarta center
  { value: "jakarta", label: "Jakarta", region: "Jakarta", latlng: [-6.1751, 106.8272] },
];

// Search locations by name/region
export function searchLocations(query: string): LocationCoords[] {
  if (!query || query.length < 1) return [];

  const q = query.toLowerCase();
  return INDONESIAN_LOCATIONS.filter(
    (loc) =>
      loc.label.toLowerCase().includes(q) ||
      loc.region.toLowerCase().includes(q) ||
      loc.value.toLowerCase().includes(q) ||
      (loc.area && loc.area.toLowerCase().includes(q))
  ).slice(0, 10);
}

// Get location by value
export function getLocationByValue(value: string): LocationCoords | undefined {
  return INDONESIAN_LOCATIONS.find(
    (loc) => loc.value === value.toLowerCase() || loc.label.toLowerCase() === value.toLowerCase()
  );
}

// Get all locations
export function getAllLocations(): LocationCoords[] {
  return INDONESIAN_LOCATIONS;
}

const useLocations = () => {
  const getAll = () => INDONESIAN_LOCATIONS;

  const getByValue = (value: string) => {
    return INDONESIAN_LOCATIONS.find(
      (loc) => loc.value === value.toLowerCase() || loc.label.toLowerCase() === value.toLowerCase()
    );
  };

  const search = (query: string) => searchLocations(query);

  return {
    getAllLocations: getAll,
    getByValue,
    searchLocations: search,
  };
};

export default useLocations;
