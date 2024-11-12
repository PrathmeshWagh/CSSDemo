import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import SplashScreen from 'react-native-splash-screen'
import { NavigationContainer } from '@react-navigation/native';
import AppNavigation from './src/AppNavigation/AppNavigation';


const App = () => {

  useEffect(() => {
    setTimeout(() => {
      SplashScreen.hide();
    }, 3000);
  }, []);
  return (
    <NavigationContainer>
      <AppNavigation />
    </NavigationContainer>
  )
}

export default App

const styles = StyleSheet.create({})