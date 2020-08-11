import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import ColorList from './components/ColorList';
import ColorDetails from './components/ColorDetails';

const { Navigator, Screen } = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Navigator>
        <Screen
          name='Home'
          options={{title: 'Color List'}}
          component={ColorList} />
        <Screen name='Details' component={ColorDetails} />
      </Navigator>
    </NavigationContainer>
  )
}