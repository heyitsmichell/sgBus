import React, { useEffect, useState, useCallback, useLayoutEffect, useRef, useMemo } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList, RefreshControl, Image, TouchableOpacity, Platform } from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useColorScheme } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { calculateMinutesLeft } from '@/components/Calculation';
import { fetchBusArrivalData } from '@/services/api';
import Ionicons from '@expo/vector-icons/Ionicons';
import { getCurrentLocation } from '../components/Location';

interface Arrival {
  key: string;
  time: string;
  load: string;
  type: string;
}

interface Service {
  ServiceNo: string;
  sortedArrivals: Arrival[];
}

const BusStop = () => {
  const params = useLocalSearchParams();
  const navigation = useNavigation();
  const mapRef = useRef<MapView>(null);
  const colorScheme = useColorScheme();

  const [description, setDescription] = useState('');
  const [busStopCode, setBusStopCode] = useState('');
  const [roadName, setRoadName] = useState('');
  const [distance, setDistance] = useState('');
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null);
  const [busArrivalData, setBusArrivalData] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    setDescription(String(params.description));
    setBusStopCode(String(params.busStopCode));
    setRoadName(String(params.roadName));
    setDistance(String(params.distance));
    const lat = parseFloat(String(params.latitude));
    const lon = parseFloat(String(params.longitude));
    if (!isNaN(lat) && !isNaN(lon)) {
      setLatitude(lat);
      setLongitude(lon);
    } else {
      setLatitude(null);
      setLongitude(null);
    }
  }, [params]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: description,
    });
  }, [navigation, description]);

  const fetchBusArrivalDataWrapper = useCallback(async () => {
    try {
      const data = await fetchBusArrivalData(params.busStopCode);
      const sortedData = data.Services.sort((a: any, b: any) => a.ServiceNo.localeCompare(b.ServiceNo)).map((service: any) => {
        const arrivals: Arrival[] = [
          { key: 'NextBus', time: service.NextBus.EstimatedArrival, load: service.NextBus.Load, type: service.NextBus.Type },
          { key: 'NextBus2', time: service.NextBus2.EstimatedArrival, load: service.NextBus2.Load, type: service.NextBus2.Type },
          { key: 'NextBus3', time: service.NextBus3.EstimatedArrival, load: service.NextBus3.Load, type: service.NextBus3.Type }
        ];

        const sortedArrivals = arrivals.sort((a, b) => {
          const timeA = calculateMinutesLeft(a.time);
          const timeB = calculateMinutesLeft(b.time);
          if (timeA === 'Arr') return -1;
          if (timeB === 'Arr') return 1;
          if (timeA === 'NA') return 1;
          if (timeB === 'NA') return -1;
          return timeA - timeB;
        });

        return {
          ...service,
          sortedArrivals: sortedArrivals.map((arrival, index) => {
            if (index > 0 && calculateMinutesLeft(arrival.time) === 'Arr') {
              return { ...arrival, time: 'NA' };
            }
            return arrival;
          })
        };
      });

      setBusArrivalData(sortedData);
    } catch (error) {
      console.error('Error fetching bus arrival data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [params.busStopCode]);

  useEffect(() => {
    fetchBusArrivalDataWrapper();
  }, [fetchBusArrivalDataWrapper]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchBusArrivalDataWrapper();
  }, [fetchBusArrivalDataWrapper]);

  const getBackgroundColor = useCallback((load: string, time: string) => {
    if (time === 'NA') {
      return colorScheme === 'dark' ? '#151718' : '#fff'; // Set to black for dark mode, white for light mode
    }
    switch (load) {
      case 'SEA':
        return '#3A9679'; // Green
      case 'SDA':
        return '#FABC60'; // Yellow
      case 'LSD':
        return '#EF4E4E'; // Red
      default:
        return '#11144C'; // Navy
    }
  }, [colorScheme]);

  const getVehicleImage = useCallback((type: string) => {
    switch (type) {
      case 'SD':
        return require('../assets/images/singlebus.png');
      case 'DD':
        return require('../assets/images/doublebus.png');
      case 'BD':
        return require('../assets/images/bendybus.png');
      default:
        return null;
    }
  }, []);

  const renderBusService = useCallback(({ item }: { item: Service }) => (
    <View style={styles.serviceContainer}>
      <Text style={[styles.serviceNumber, { color: colorScheme === 'dark' ? '#fff' : '#000' }]}>{item.ServiceNo}</Text>
      <View style={styles.arrivalsContainer}>
        {item.sortedArrivals.map((arrival, index) => (
          <View key={index} style={[styles.arrivalBox, { backgroundColor: getBackgroundColor(arrival.load, calculateMinutesLeft(arrival.time)) }]}>
            <Text style={[styles.arrivalText, { color: colorScheme === 'dark' ? '#fff' : '#000' }]}>
              {calculateMinutesLeft(arrival.time)}
            </Text>
            {getVehicleImage(arrival.type) && (
              <Image source={getVehicleImage(arrival.type)} style={styles.defaultImage} />
            )}
          </View>
        ))}
      </View>
    </View>
  ), [colorScheme, getBackgroundColor, getVehicleImage]);

  useEffect(() => {
    (async () => {
      const location = await getCurrentLocation();
      setUserLocation(location);
    })();
  }, []);

  const focusOnMarker = useCallback(() => {
    if (mapRef.current && latitude && longitude) {
      mapRef.current.animateToRegion({
        latitude: latitude,
        longitude: longitude,
        latitudeDelta: 0.002,
        longitudeDelta: 0.002,
      });
    }
  }, [latitude, longitude]);

  useEffect(() => {
    if (mapRef.current && userLocation && latitude && longitude) {
      mapRef.current.fitToCoordinates(
        [
          { latitude: userLocation.coords.latitude, longitude: userLocation.coords.longitude },
          { latitude, longitude },
        ],
        {
          edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
          animated: true,
        }
      );
    }
  }, [userLocation, latitude, longitude]);

  return (
    <View style={[styles.container, { backgroundColor: colorScheme === 'dark' ? '#151718' : '#fff' }]}>
      {latitude && longitude ? (
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={{
            latitude: latitude,
            longitude: longitude,
            latitudeDelta: 0.002,
            longitudeDelta: 0.002,
          }}
          showsUserLocation={true}
          showsMyLocationButton={true}
        >
          <Marker coordinate={{ latitude, longitude }} />
        </MapView>
      ) : null}

      <TouchableOpacity style={styles.iconButton} onPress={focusOnMarker}>
        <Ionicons
          name={Platform.OS === 'ios' ? 'pin' : 'location'}
          size={16}
          color={colorScheme === 'dark' ? '#fff' : '#000'}
        />
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator size="large" color={colorScheme === 'dark' ? '#fff' : '#000'} />
      ) : (
        <FlatList
          data={busArrivalData}
          renderItem={renderBusService}
          keyExtractor={(item) => item.ServiceNo}
          ListEmptyComponent={<Text style={[{ color: colorScheme === 'dark' ? '#fff' : '#000' }]}>No bus arrival information available.</Text>}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 16,
  },
  serviceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  serviceNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    width: 80,
  },
  arrivalsContainer: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-around',
  },
  arrivalBox: {
    width: 80,
    height: 80,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  arrivalText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  map: {
    height: 250,
    marginBottom: 16,
  },
  defaultImage: {
    height: 32,
    marginTop: 5,
    resizeMode: 'contain',
  },
  iconButton: {
    position: 'absolute',
    top: 210,
    right: 8,
    padding: 8,
    backgroundColor: useColorScheme() === 'dark' ? '#151718' : '#fff',
    borderRadius: 30,
    zIndex: 10,
  },
});

export default BusStop;