import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { calculateDistance } from '../utils/calculateDistance';
import { fetchBusStops as apiFetchBusStops } from '@/services/api';

export const useBusStops = () => {
  const [busStops, setBusStops] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchBusStops = async () => {
    try {
      setRefreshing(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Location permission denied.');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      let allBusStops: any[] = [];
      let pageNumber = 0;
      const pageSize = 500;
      let totalRecords = pageSize;

      while (totalRecords === pageSize) {
        pageNumber++;
        const data = await apiFetchBusStops(pageSize * (pageNumber - 1));

        totalRecords = data.value.length;
        allBusStops = [...allBusStops, ...data.value];
      }

      const busStopsWithDistance = allBusStops.map(stop => {
        const stopLat = parseFloat(stop.Latitude);
        const stopLon = parseFloat(stop.Longitude);
        const distance = calculateDistance(latitude, longitude, stopLat, stopLon);
        return { ...stop, distance };
      }).sort((a, b) => a.distance - b.distance).slice(0, 15);

      setBusStops(busStopsWithDistance);
    } catch (error) {
      setError('Error fetching bus stops.');
      console.error(error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchBusStops();
  }, []);

  return { busStops, error, refreshing, fetchBusStops };
};