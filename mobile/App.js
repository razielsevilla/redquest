import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View } from 'react-native';

function PlaceholderScreen({ title }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function DonorTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" options={{ title: 'Donor Home' }}>
        {() => <PlaceholderScreen title="Donor Home" />}
      </Tab.Screen>
      <Tab.Screen name="Profile" options={{ title: 'Profile' }}>
        {() => <PlaceholderScreen title="Profile" />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome">
        <Stack.Screen name="Welcome" options={{ headerShown: false }}>
          {() => <PlaceholderScreen title="Welcome to RedQuest" />}
        </Stack.Screen>
        <Stack.Screen name="Login" options={{ title: 'Login' }}>
          {() => <PlaceholderScreen title="Login" />}
        </Stack.Screen>
        <Stack.Screen name="Register" options={{ title: 'Register' }}>
          {() => <PlaceholderScreen title="Register" />}
        </Stack.Screen>
        <Stack.Screen name="Donor" component={DonorTabs} options={{ headerShown: false }} />
        <Stack.Screen name="Requester" options={{ title: 'Requester Home' }}>
          {() => <PlaceholderScreen title="Requester Home" />}
        </Stack.Screen>
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
});
