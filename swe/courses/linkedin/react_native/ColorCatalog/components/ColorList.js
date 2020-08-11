import React, { useState } from 'react';
import {
  StyleSheet,
  FlatList
} from 'react-native';

import ColorForm from './ColorForm';
import ColorButton from './ColorButton';

import { useColors } from '../hooks';

export default function ColorList({ navigation }) {
  const { colors, addColor } = useColors();

  return (
    <>
      <ColorForm onNewColor={addColor} />
      <FlatList
        style={styles.view}
        data={colors}
        renderItem={({item}) => {
          return (
            <ColorButton 
              key={item.id}
              backgroundColor={item.color}
              onPress={() => navigation.navigate('Details', {color: item.color})}
            />
          )
        }}
      />
    </>
  )
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    display: 'flex'
  }
})