import React, { useEffect, useState, useCallback, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList, RefreshControl, Image } from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useColorScheme } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { calculateMinutesLeft } from '@/components/Calculation';
import { fetchBusArrivalData } from '@/services/api';

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
  const [description, setDescription] = useState('');
  const [busStopCode, setBusStopCode] = useState('');
  const [roadName, setRoadName] = useState('');
  const [distance, setDistance] = useState('');
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [busArrivalData, setBusArrivalData] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const colorScheme = useColorScheme();

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

  const fetchBusArrivalDataWrapper = async () => {
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
  };

  useEffect(() => {
    fetchBusArrivalDataWrapper();
  }, [params.busStopCode]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchBusArrivalDataWrapper();
  }, []);

  const getBackgroundColor = (load: string, time: string) => {
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
  };

  const getVehicleImage = (type: string) => {
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
  };

  const renderBusService = ({ item }: { item: Service }) => (
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
  );

  return (
    <View style={[styles.container, { backgroundColor: colorScheme === 'dark' ? '#151718' : '#fff' }]}>
      {/* MapView Component */}
      {latitude && longitude ? (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: latitude,
            longitude: longitude,
            latitudeDelta: 0.002, // Adjust the zoom level
            longitudeDelta: 0.002, // Adjust the zoom level
          }}
        >
          <Marker coordinate={{ latitude, longitude }} />
        </MapView>
      ) : null}

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
    height: 250, // Adjust the height as needed
    marginBottom: 16,
  },
  defaultImage: {
    height: 32,
    marginTop: 5,
    resizeMode: 'contain',
  },
});

export default BusStop;