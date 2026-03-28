import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Context
import { SessionProvider } from './contexts/SessionContext';

// Screens
import HomeScreen from './screens/HomeScreen';
import HouseholdRatingScreen from './screens/HouseholdRatingScreen';
import HistoryScreen from './screens/HistoryScreen';
import SessionDetailScreen from './screens/SessionDetailScreen';

// Stitch Integration Screens (keeping existing functionality)
import StitchProjectsScreen from './screens/StitchProjectsScreen';
import StitchScreen from './screens/StitchScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <SessionProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerShown: false,
            cardStyle: { backgroundColor: '#f5f8f7' },
          }}
        >
          {/* Main App Flow - Simplified */}
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="HouseholdRating" component={HouseholdRatingScreen} />
          <Stack.Screen name="History" component={HistoryScreen} />
          <Stack.Screen name="SessionDetail" component={SessionDetailScreen} />

          {/* Stitch Integration Flow */}
          <Stack.Screen name="StitchProjects" component={StitchProjectsScreen} />
          <Stack.Screen name="StitchScreen" component={StitchScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SessionProvider>
  );
}

// Styles removed - using navigation now
