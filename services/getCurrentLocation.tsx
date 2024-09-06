import * as Location from 'expo-location';

export const getCurrentLocation = async () => {
  try {
    let location = await Location.getLastKnownPositionAsync();
    if (location) {
      return location;
    } else {
      location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
        timeInterval: 10000,
        distanceInterval: 80,
      });
      return location;
    }
  } catch (error) {
    console.error('Error fetching current location:', error);
    throw error;
  }
};
