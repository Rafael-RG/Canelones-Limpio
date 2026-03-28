import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Screens
import LandingScreen from './screens/LandingScreen';
import CollectorAuthScreen from './screens/CollectorAuthScreen';
import UnitSelectionScreen from './screens/UnitSelectionScreen';
import CollectorSessionScreen from './screens/CollectorSessionScreen';
import HomeScannerScreen from './screens/HomeScannerScreen';
import HouseholdRatingScreen from './screens/HouseholdRatingScreen';
import HistoryScreen from './screens/HistoryScreen';

// Stitch Integration Screens (keeping existing functionality)
import StitchProjectsScreen from './screens/StitchProjectsScreen';
import StitchScreen from './screens/StitchScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: '#f5f8f7' },
        }}
      >
        {/* Main App Flow */}
        <Stack.Screen name="Home" component={LandingScreen} />
        <Stack.Screen name="CollectorAuth" component={CollectorAuthScreen} />
        <Stack.Screen name="UnitSelection" component={UnitSelectionScreen} />
        <Stack.Screen name="CollectorSession" component={CollectorSessionScreen} />
        <Stack.Screen name="HomeScanner" component={HomeScannerScreen} />
        <Stack.Screen name="HouseholdRating" component={HouseholdRatingScreen} />
        <Stack.Screen name="History" component={HistoryScreen} />

        {/* Stitch Integration Flow */}
        <Stack.Screen name="StitchProjects" component={StitchProjectsScreen} />
        <Stack.Screen name="StitchScreen" component={StitchScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Styles removed - using navigation now
