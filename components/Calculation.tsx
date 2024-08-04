export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c * 1000; // Distance in meters
  };
  
  const deg2rad = (deg: number) => deg * (Math.PI / 180);
  
  export const calculateMinutesLeft = (arrivalTime: string) => {
    const arrivalDate = new Date(arrivalTime).getTime();
    const currentDate = new Date().getTime();
    const diffMs = arrivalDate - currentDate;
    const diffMins = Math.round(diffMs / 60000); // Convert milliseconds to minutes
    if (diffMins <= 0) return 'Arr';
    return diffMins > 0 ? `${diffMins}` : 'NA';
  };
  