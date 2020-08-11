import { useState, useEffect } from 'react';
import { AsyncStorage } from 'react-native';

import { generate } from 'shortid';

const COLORS_KEY = '@ColorListStore:Colors';

export function useColors() {
  const [ colors, setColors ] = useState([]);

  async function loadColors() {
      const colorData = 
        await AsyncStorage.getItem(COLORS_KEY);
    if (colorData) {
        const colors = JSON.parse(colorData);
        setColors(colors);
    }
  }

  function addColor(color) {
    const newColor = {
      id: generate(),
      color
    }
    setColors([newColor, ...colors]);
  }

  // Loads colors when component is first loaded
  useEffect(() => {
    if (colors.length > 0) return;
    loadColors();
  }, [])

  // Saves colors when 'colors' is modified
  useEffect(() => {
      AsyncStorage.setItem(COLORS_KEY, JSON.stringify(colors));
  }, [colors]);

  return { colors, addColor };
}