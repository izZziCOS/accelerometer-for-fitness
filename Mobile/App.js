import React, { useState } from "react"
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator, HeaderBackButton  } from '@react-navigation/stack'
import Login from './src/Screens/Login'
import MainView from './src/Screens/MainView'
import ExerciseView from './src/Screens/ExerciseView'
import Auth0 from 'react-native-auth0'

const auth0 = new Auth0({ domain: 'dev-ygtgc0f3.eu.auth0.com', clientId: 'sioCCsqVZqvDw8hDqgQDwxkQcV3klUxR' })

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
    <Stack.Navigator initialRouteName="Prisijungimas">
      <Stack.Screen options={{
        headerLeft: null
      }} 
      name="Prisijungimas" 
      component={Login} />
      <>
      <Stack.Screen name="Pagrindinis" options={{
        headerLeft: null
      }}
      component={MainView} />
      <Stack.Screen name="Pratimas" component={ExerciseView} />
      </>
    </Stack.Navigator>
    </NavigationContainer>
  )
}