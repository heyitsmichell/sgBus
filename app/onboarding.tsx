import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Button, StyleSheet, Alert, Image } from 'react-native';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import Swiper from 'react-native-swiper';
import Ionicons from '@expo/vector-icons/Ionicons';
import Disabled from '../components/DisabledIcon';

const Onboarding = () => {
  const [locationPermission, setLocationPermission] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const swiperRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const checkPermission = async () => {
      const status = await Location.getForegroundPermissionsAsync();
      setLocationPermission(status.granted);
    };
    checkPermission();
  }, []);

  const requestPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === 'granted') {
      await AsyncStorage.setItem('onboarded', 'true');
      router.replace('/(tabs)');
    } else {
      Alert.alert('Location permission is required to use this app.');
    }
  };

  const handleIndexChange = (index) => {
    setCurrentIndex(index);
  };

  const handleSwipe = (index) => {
    if (index === 0 && currentIndex === 0) {
      swiperRef.current.scrollTo(0);
    } else {
      handleIndexChange(index);
    }
  };

  return (
    <Swiper
      style={styles.wrapper}
      dotColor="#777"
      activeDotColor="#fff"
      ref={swiperRef}
      onIndexChanged={handleIndexChange}
      onMomentumScrollEnd={(e, state) => handleSwipe(state.index)}
      loop={false}
    >
      <View style={styles.slide}>
        <Image source={require('../assets/images/singlebus.png')} style={styles.image} />
        <Text style={styles.text}>Welcome to sgBus!</Text>
        <Text style={styles.grey}>Swipe to continue</Text>
      </View>
      <View style={styles.slide}>
        <Disabled height={180} width={180} fill="#fff" />
        <Text style={styles.text}>We don't show wheelchair accessibility icons because all public buses are wheelchair accessible, as confirmed by the Ministry of Transport.</Text>
      </View>
      <View style={styles.slide}>
        <Ionicons
          name={'navigate'}
          size={160}
          color='#fff'
        />
        <Text style={styles.text}>Tap the button below to grant location access. This helps us find nearby bus stops for you.</Text>
        <Button title="Continue" onPress={requestPermission} />
      </View>
    </Swiper>
  );
};

const styles = StyleSheet.create({
  wrapper: {},
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#151718',
  },
  text: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    marginHorizontal: 20,
    marginVertical: 10,
  },
  grey: {
    color: '#777',
    fontSize: 16,
    textAlign: 'center',
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
});

export default Onboarding;