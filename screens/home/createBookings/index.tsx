// In App.js in a new project

import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SelectTime from "./SelectLocationAndTime"
import CarsListScreen from "./CarsListScreen"
import CarExtras from "./CarExtras"
import PaymentScreen from "./PaymentScreen"
import WebView from "./WebView"
import Confirmation from "./Confirmation"

const Stack = createStackNavigator();

function App() {
  return (
      <Stack.Navigator headerMode="none">
        <Stack.Screen name="SelectTime" component={SelectTime} />
        <Stack.Screen name="CarsList" component={CarsListScreen} />
        <Stack.Screen name="CarExtras" component={CarExtras} />
        <Stack.Screen name="Payment" component={PaymentScreen} />
        <Stack.Screen name="WebView" component={WebView} />
        <Stack.Screen name="Confirmation" component={Confirmation} />
      </Stack.Navigator>
  );
}

export default App;