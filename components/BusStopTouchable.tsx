import React from 'react';
import { TouchableHighlight, StyleSheet, useColorScheme } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Link } from 'expo-router';

const BusStopTouchable = ({ item }) => {
  const colorScheme = useColorScheme();
  
  return (
    <Link
      href={{
        pathname: '/busStop',
        params: {
          description: item.Description,
          busStopCode: item.BusStopCode,
          roadName: item.RoadName,
          distance: item.distance?.toFixed(0),
          latitude: item.Latitude,
          longitude: item.Longitude,
        },
      }}
      asChild
    >
      <TouchableHighlight style={styles.section}>
        <ThemedView style={styles.flex}>
          <ThemedView>
            <ThemedText style={styles.name}>{item.Description}</ThemedText>
            <ThemedText style={styles.information}>
              {item.BusStopCode} | {item.RoadName} {item.distance && `| ${item.distance.toFixed(0)}m`}
            </ThemedText>
          </ThemedView>
          <Ionicons
            style={styles.icon}
            name='chevron-forward'
            size={20}
            color={colorScheme === 'dark' ? '#fff' : '#000'}
          />
        </ThemedView>
      </TouchableHighlight>
    </Link>
  );
};

const styles = StyleSheet.create({
  flex: {
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  section: {
    borderBottomWidth: 1,
    borderBottomColor: '#777',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  information: {
    fontSize: 16,
  },
  icon: {
    justifyContent: 'center',
  },
});

export default BusStopTouchable;