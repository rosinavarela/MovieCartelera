// navigation/AppNavigator.tsx

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from '../screens/HomeScreen';
import DetailScreen from '../screens/DetailScreen';

export type RootStackParamList = {
  Home: undefined;
  Detail: {
    pelicula: any;
    cinema: string;
  };
};

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#ff006c', // color del movie
          },
          headerTintColor: '#000000', // Negro para el texto
          headerTitleStyle: {
            fontWeight: 'bold',
            color: '#FFFFFF', // Título en blanco
          },
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ title: 'Cartelera' }} 
        />
        <Stack.Screen 
          name="Detail" 
          component={DetailScreen} 
          options={{ title: 'Detalle' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
