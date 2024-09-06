// Haversine Formula to calculate distance between
// the user coordinates and the bus stop coordinates in meters
export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371000; // Earth radius in meters
  const rad = Math.PI / 180; // Radians conversion factor

  const deltaLat = (lat2 - lat1) * rad;
  const deltaLon = (lon2 - lon1) * rad;

  const lat1Rad = lat1 * rad;
  const lat2Rad = lat2 * rad;

  const a = 
    (Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2)) +
    (Math.cos(lat1Rad) * Math.cos(lat2Rad) * 
    Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2));

  return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

export const calculateMinutesLeft = (arrivalTime: string): string => {
  const arrivalDate = new Date(arrivalTime);

  // Return 'NA' if the date is invalid
  if (isNaN(arrivalDate.getTime())) return 'NA';

  const diffMins = Math.round((arrivalDate.getTime() - Date.now()) / 60000);

  return diffMins <= 0 ? 'Arr' : String(diffMins);
};
