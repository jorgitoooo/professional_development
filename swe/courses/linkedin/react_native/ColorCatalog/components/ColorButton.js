import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableHighlight,
  View
} from 'react-native';

export default function ColorButton({ backgroundColor, onPress = f => f }) {
  if (typeof(backgroundColor) !== 'string'
      || backgroundColor.length < 1) {
    backgroundColor = 'blue';
  }
  return (
    <TouchableHighlight
        style={styles.button}
        onPress={() => onPress(backgroundColor)}
      >
        <View style={styles.row}>
          <View style={[styles.colorSample, { backgroundColor }]}/>
          <Text style={styles.buttonText}>{
            backgroundColor.charAt(0).toUpperCase() + backgroundColor.slice(1)
            }
          </Text>
        </View>
      </TouchableHighlight>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  button: {
    alignSelf: 'stretch',
    margin: 5,
    padding: 5,
    borderColor: 'white',
    borderWidth: 3,
    borderRadius: 5,
    backgroundColor: 'rgba(0,0,0, 0.4)'
  },
  buttonText: {
    fontSize: 20,
    textAlign: 'center',
    fontWeight: '900',
    color: 'white',
  },
  colorSample: {
    width: 20,
    height: 20,
    marginRight: 5,
    borderRadius: 10,
    backgroundColor: 'white'
  }
})