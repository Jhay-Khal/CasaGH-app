// Rough center coordinates for Ghanaian cities we know about.
// Properties without exact lat/long get placed near their city's center
// instead of an exact address, with a small deterministic offset so
// multiple properties in the same city don't stack on the same pixel.
export const CITY_COORDS: Record<string, { lat: number; lng: number }> = {
  Kumasi: { lat: 6.6885, lng: -1.6244 },
  Accra: { lat: 5.6037, lng: -0.187 },
  Tamale: { lat: 9.4008, lng: -0.8393 },
  'Cape Coast': { lat: 5.1053, lng: -1.2466 },
  Takoradi: { lat: 4.8845, lng: -1.7554 },
};

const DEFAULT_COORDS = CITY_COORDS['Kumasi'];

function deterministicOffset(id: number): { dLat: number; dLng: number } {
  const seed = (id * 2654435761) % 1000;
  const dLat = ((seed % 100) - 50) / 5000; // roughly ±0.01 degrees
  const dLng = (((seed * 7) % 100) - 50) / 5000;
  return { dLat, dLng };
}

export function getPropertyCoords(property: any): { lat: number; lng: number } {
  if (property.latitude != null && property.longitude != null) {
    return { lat: property.latitude, lng: property.longitude };
  }
  const base = CITY_COORDS[property.city] || DEFAULT_COORDS;
  const { dLat, dLng } = deterministicOffset(property.id || 0);
  return { lat: base.lat + dLat, lng: base.lng + dLng };
}