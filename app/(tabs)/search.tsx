import React, { useState, useEffect } from 'react';
import { TextInput, FlatList, StyleSheet, useColorScheme } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { fetchBusStops } from '@/services/api';
import BusStopItem from '@/components/BusStopTouchable';

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [busStops, setBusStops] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const colorScheme = useColorScheme();

  useEffect(() => {
    const fetchAllBusStops = async () => {
      try {
        let busStops: any[] = [];
        let pageNumber = 0;
        const pageSize = 500;

        while (true) {
          pageNumber++;
          const data = await fetchBusStops(pageSize * (pageNumber - 1));
          if (data.value.length === 0) break;

          busStops = [...busStops, ...data.value];
        }

        setBusStops(busStops);
      } catch (error) {
        setError('Error fetching bus stops.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllBusStops();
  }, []);

  const filteredBusStops = searchQuery
    ? busStops.filter(
        (busStop) =>
          busStop.RoadName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          busStop.BusStopCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
          busStop.Description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : busStops;

  return (
    <ThemedView style={styles.container}>
      <TextInput
        style={[styles.searchBar, { color: colorScheme === 'dark' ? '#fff' : '#000' }]}
        placeholder="Search by RoadName, BusStopCode or Description"
        placeholderTextColor={colorScheme === 'dark' ? '#ccc' : '#888'}
        onChangeText={setSearchQuery}
        value={searchQuery}
      />
      {loading ? (
        <ThemedText>Loading...</ThemedText>
      ) : error ? (
        <ThemedText>{error}</ThemedText>
      ) : filteredBusStops.length > 0 ? (
        <FlatList
          data={filteredBusStops}
          keyExtractor={(item) => item.BusStopCode}
          renderItem={({ item }) => <BusStopItem item={item} />}
        />
      ) : (
        <ThemedText>No results found</ThemedText>
      )}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  searchBar: {
    height: 40,
    borderColor: '#777',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 16,
  },
});

export default Search;