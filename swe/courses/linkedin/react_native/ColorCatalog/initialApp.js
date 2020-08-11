import React from 'react';
import {
  ActivityIndicator,
  Alert,
  Button,  
  Dimensions,
  Image,
  Platform,
  ProgressBarAndroid,
  ProgressViewIOS,
  StyleSheet,
  Text,
  View
} from 'react-native';

import expoBG from './assets/expoBG.png';

const { height, width } = Dimensions.get('window');

export default function App() {
  const onButtonPress = () => {
    Alert.alert(`${new Date().toLocaleDateString()} button press`);
  }
  return (
    <View style={styles.view}>
      <Image style={styles.image} source={expoBG} />
      <View style={styles.info}>
        <ActivityIndicator style={{padding: 10}} size='large' color='#61DBFB' />
        { Platform.OS === 'ios' && <ProgressViewIOS progress={0.5} /> }
        { Platform.OS === 'android' && (
        <ProgressBarAndroid 
          styleAttr='Horizontal'
          indeterminate={false}
          color='blue'
          progress={0.5} />
        ) }
        <Button title='click me' onPress={onButtonPress} />
        <View style={styles.cell}>
          <Text style={styles.textOS}>OS: {Platform.OS}</Text>
        </View>
        <View style={styles.cell}>
          <Text style={styles.text}>Height: {height}</Text>
          <Text style={styles.text}>Width: {width}</Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  page: {
    flex: 1,
    marginTop: 40,
    backgroundColor: '#DDD'
  },
  cell: {
    backgroundColor: 'dodgerblue',
    margin: 10,
    padding: 5,
    borderRadius: 8
  },
  textOS: {
    fontSize: 28,
    color: 'white',
    fontWeight: '900',
    textAlign: 'center'
  },
  text: {
    color: 'white',
    textAlign: 'center'
  },
  image: {
    flex: 1,
    borderRadius: 50,
    margin: 10,
    width: width - 10
  },
  info: {
    flex: 1,
    margin: 10,
    width: width - 10
  }
})