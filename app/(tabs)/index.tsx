import React, { useCallback } from 'react';
import { StyleSheet, FlatList, RefreshControl, View } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay'; // Import the spinner component
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import BusStopItem from '@/components/BusStopTouchable';
import { useBusStops } from '@/hooks/useBusStop';

const Nearby = () => {
  const { busStops, error, refreshing, fetchBusStops } = useBusStops();

  const onRefresh = useCallback(() => {
    fetchBusStops();
  }, [fetchBusStops]);

  return (
    <ThemedView style={styles.container}>
      {error ? (
        <ThemedText>{error}</ThemedText>
      ) : busStops.length > 0 ? (
        <FlatList
          showsVerticalScrollIndicator={false}
          style={styles.list}
          data={busStops}
          renderItem={({ item }) => <BusStopItem item={item} />}
          keyExtractor={item => item.BusStopCode}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
        />
      ) : (
        <View style={styles.loadingContainer}>
          <Spinner visible={refreshing}/>
        </View>
      )}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  list: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Nearby;
