import React, { useState } from 'react';
import {
  StyleSheet,
  FlatList
} from 'react-native';

import ColorButton from './components/ColorButton';
import defaultColors from './data/defaultColors.json';

export default function App() {
  const [ backgroundColor, setBackgroundColor ] = useState('blue');
  
  return (
    <FlatList
      style={[styles.view, { backgroundColor }]}
      data={defaultColors}
      renderItem={({item}) => {
        return (
          <ColorButton 
            key={item.id}
            backgroundColor={item.color}
            onPress={setBackgroundColor}
          />
        )
      }}
    />
  )
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    display: 'flex'
  }
})