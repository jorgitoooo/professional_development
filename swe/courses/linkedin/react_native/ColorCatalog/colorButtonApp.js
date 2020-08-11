import React, { useState } from 'react';
import {
  StyleSheet,
  View
} from 'react-native';

import ColorButton from './components/ColorButton';

export default function App() {
  const [ backgroundColor, setBackgroundColor ] = useState('blue');
  function changeBGToYellow() {
    setBackgroundColor('yellow');
  }
  function changeBGToGreen() {
    setBackgroundColor('green');
  }
  function changeBGToRed() {
    setBackgroundColor('red');
  }
  function changeBGToBlue() {
    setBackgroundColor('blue');
  }
  return (
    <View style={[styles.view, { backgroundColor }]}>
      <ColorButton backgroundColor='yellow' onPress={changeBGToYellow} />
      <ColorButton backgroundColor='green' onPress={changeBGToGreen} />
      <ColorButton backgroundColor='red' onPress={changeBGToRed} />
      {/* Default color is 'blue' */}
      <ColorButton onPress={changeBGToBlue} />
    </View>
  )
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }
})