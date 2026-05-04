import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Login from './src/screens/Login';
import Register from './src/screens/Register';
import DonorHome from './src/screens/DonorHome';
import RequesterHome from './src/screens/RequesterHome';
import QuestAlert from './src/screens/QuestAlert';
import QuestAccepted from './src/screens/QuestAccepted';
import RiderEnRoute from './src/screens/RiderEnRoute';
import QuestComplete from './src/screens/QuestComplete';
import PostRequest from './src/screens/PostRequest';
import RequestStatus from './src/screens/RequestStatus';
import Onboarding from './src/screens/Onboarding';




const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function DonorTabs() {
  return (
    <Tab.Navigator screenOptions={{ 
      headerShown: false,
      tabBarStyle: { backgroundColor: '#1F2937', borderTopColor: '#374151' },
      tabBarActiveTintColor: '#E24B4A',
      tabBarInactiveTintColor: '#9CA3AF'
    }}>
      <Tab.Screen name="Home" component={DonorHome} options={{ title: 'Home' }} />
    </Tab.Navigator>
  );
}

function RequesterTabs() {
  return (
    <Tab.Navigator screenOptions={{ 
      headerShown: false,
      tabBarStyle: { backgroundColor: '#1F2937', borderTopColor: '#374151' },
      tabBarActiveTintColor: '#E24B4A',
      tabBarInactiveTintColor: '#9CA3AF'
    }}>
      <Tab.Screen name="Home" component={RequesterHome} options={{ title: 'Home' }} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Onboarding">
        <Stack.Screen name="Onboarding" options={{ headerShown: false }} component={Onboarding} />
        <Stack.Screen name="Login" options={{ title: 'Login' }} component={Login} />
        <Stack.Screen name="Register" options={{ title: 'Register' }} component={Register} />
        <Stack.Screen name="Donor" component={DonorTabs} options={{ headerShown: false }} />
        <Stack.Screen name="Requester" component={RequesterTabs} options={{ headerShown: false }} />
        <Stack.Screen name="QuestAlert" component={QuestAlert} options={{ presentation: 'fullScreenModal', headerShown: false }} />
        <Stack.Screen name="QuestAccepted" component={QuestAccepted} options={{ headerShown: false }} />
        <Stack.Screen name="RiderEnRoute" component={RiderEnRoute} options={{ headerShown: false }} />
        <Stack.Screen name="QuestComplete" component={QuestComplete} options={{ headerShown: false }} />
        <Stack.Screen name="PostRequest" component={PostRequest} options={{ title: 'Post a Request', headerStyle: { backgroundColor: '#111827' }, headerTintColor: '#fff' }} />
        <Stack.Screen name="RequestStatus" component={RequestStatus} options={{ title: 'Live Tracking', headerStyle: { backgroundColor: '#111827' }, headerTintColor: '#fff' }} />
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
  subtitle: {
    marginTop: 8,
    marginBottom: 20,
    color: '#666',
    textAlign: 'center',
  },
  primaryButton: {
    backgroundColor: '#E24B4A',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 8,
    minWidth: 180,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: '#E24B4A',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 8,
    minWidth: 180,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#E24B4A',
    fontWeight: '700',
  },
});
