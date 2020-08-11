import React, { useState, useEffect } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text
} from 'react-native';

import Constants from 'expo-constants';

const { height } = Dimensions.get('window');

export default function App() {
  const [pet, setPet] = useState();
  const [loading, setLoading] = useState(false);
  
  async function loadPet() {
    setLoading(true);
    const res = 
      await fetch('http://pet-library.moonhighway.com/api/randomPet');
    const data = await res.json();
    await Image.prefetch(data.photo.full);
    setPet(data);
    setLoading(false);
  }

  
  useEffect(() => {
    loadPet();
  }, []);
  
  if (!pet) return (<ActivityIndicator size='large' />);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        refreshControl={<RefreshControl refreshing={loading} onRefresh={loadPet} />}
      >
        <Image style={styles.image} source={{uri: pet.photo.full}} />
        <Text style={styles.paragraph}>{pet.name} -  {pet.category}</Text>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
    padding: 8
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  image: {
    flex: 1,
    height: height / 2
  }
})