import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';

import Color from 'color';

export default function ColorDetails({ route }) {
  const { color: name } = route.params;

  const color = Color(name);
  const colorStyle = {
      fontSize: 15,
      color: color.negate().toString()
  }

  return (
    <View style={[styles.container, { backgroundColor: name}]}>
      <Text style={colorStyle}>Color Details: { name }</Text>
      <Text style={colorStyle}>{name}</Text>
      <Text style={colorStyle}>{color.rgb().toString()}</Text>
      <Text style={colorStyle}>{color.hsl().toString()}</Text>
      <Text style={colorStyle}>{color.luminosity()}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }
})