import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import Onboarding from './onboarding';
const Index = () => {
  const [loading, setLoading] = useState(true);
  const [onboarded, setOnboarded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkOnboarding = async () => {
      const onboardedStatus = await AsyncStorage.getItem('onboarded');
      setOnboarded(onboardedStatus === 'true');
      setLoading(false);
    };
    checkOnboarding();
  }, []);

  useEffect(() => {
    if (!loading) {
      if (onboarded) {
        router.replace('/(tabs)');
      }
    }
  }, [loading, onboarded]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <Onboarding />;
};

export default Index;