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

function Welcome({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to RedQuest</Text>
      <Text style={styles.subtitle}>Connect blood requests, donors, and riders.</Text>
      <TouchableOpacity style={styles.primaryButton} onPress={() => navigation?.navigate('Login')}>
        <Text style={styles.primaryButtonText}>Sign in</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation?.navigate('Register')}>
        <Text style={styles.secondaryButtonText}>Create account</Text>
      </TouchableOpacity>
    </View>
  );
}

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function DonorTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={DonorHome} options={{ title: 'Donor Home' }} />
      <Tab.Screen
        name="Profile"
        options={{ title: 'Profile' }}
      >
        {() => (
          <View style={styles.container}>
            <Text style={styles.title}>Profile</Text>
          </View>
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome">
        <Stack.Screen name="Welcome" options={{ headerShown: false }} component={Welcome} />
        <Stack.Screen name="Login" options={{ title: 'Login' }} component={Login} />
        <Stack.Screen name="Register" options={{ title: 'Register' }} component={Register} />
        <Stack.Screen name="Donor" component={DonorTabs} options={{ headerShown: false }} />
        <Stack.Screen name="Requester" options={{ title: 'Requester Home' }} component={RequesterHome} />
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
