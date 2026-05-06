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
import Quests from './src/screens/Quests';
import Badges from './src/screens/Badges';
import Profile from './src/screens/Profile';
import HospitalHome from './src/screens/HospitalHome';
import CreateBloodRequest from './src/screens/CreateBloodRequest';
import HospitalRequests from './src/screens/HospitalRequests';
import HospitalHistory from './src/screens/HospitalHistory';
import HospitalRequestTracking from './src/screens/HospitalRequestTracking';
import { Ionicons } from '@expo/vector-icons';



const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function PlaceholderScreen({ route }) {
  return (
    <View style={{ flex: 1, backgroundColor: '#111827', alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ color: '#F9FAFB', fontSize: 18 }}>{route.name} Screen</Text>
    </View>
  );
}

function DonorTabs() {
  return (
    <Tab.Navigator screenOptions={({ route }) => ({
      headerShown: false,
      tabBarStyle: {
        backgroundColor: '#FFFFFF',
        borderTopColor: '#E5E7EB',
        borderTopWidth: 1,
      },
      tabBarActiveTintColor: '#D32F2F',
      tabBarInactiveTintColor: '#9CA3AF',
      tabBarLabelStyle: {
        fontSize: 11,
        fontWeight: '600',
      },
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === 'Home') {
          iconName = focused ? 'home' : 'home-outline';
        } else if (route.name === 'Quests') {
          iconName = focused ? 'map' : 'map-outline';
        } else if (route.name === 'Badges') {
          iconName = focused ? 'medal' : 'medal-outline';
        } else if (route.name === 'Profile') {
          iconName = focused ? 'person' : 'person-outline';
        }

        return <Ionicons name={iconName} size={size} color={color} />;
      },
    })}>
      <Tab.Screen name="Home" component={DonorHome} options={{ title: 'Home' }} />
      <Tab.Screen name="Quests" component={Quests} options={{ title: 'Quests' }} />
      <Tab.Screen name="Badges" component={Badges} options={{ title: 'Badges' }} />
      <Tab.Screen name="Profile" component={Profile} options={{ title: 'Profile' }} />
    </Tab.Navigator>
  );
}


function RequesterTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#E5E7EB',
          borderTopWidth: 1,
        },
        tabBarActiveTintColor: '#D32F2F',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = focused ? 'home' : 'home-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={RequesterHome} options={{ title: 'Home' }} />
    </Tab.Navigator>
  );
}

function HospitalTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: { backgroundColor: '#FFFFFF', borderTopColor: '#E5E7EB' },
        tabBarActiveTintColor: '#D32F2F',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'Requests') iconName = focused ? 'document-text' : 'document-text-outline';
          else if (route.name === 'History') iconName = focused ? 'time' : 'time-outline';
          else if (route.name === 'Profile') iconName = focused ? 'person' : 'person-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HospitalHome} options={{ title: 'Home' }} />
      <Tab.Screen name="Requests" component={HospitalRequests} options={{ title: 'Requests' }} />
      <Tab.Screen name="History" component={HospitalHistory} options={{ title: 'History' }} />
      <Tab.Screen name="Profile" component={Profile} options={{ title: 'Profile' }} />
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
        <Stack.Screen name="Hospital" component={HospitalTabs} options={{ headerShown: false }} />
        <Stack.Screen name="CreateBloodRequest" component={CreateBloodRequest} options={{ headerShown: false }} />
        <Stack.Screen name="HospitalRequestTracking" component={HospitalRequestTracking} options={{ headerShown: false }} />
        <Stack.Screen name="QuestAlert" component={QuestAlert} options={{ presentation: 'fullScreenModal', headerShown: false }} />
        <Stack.Screen name="QuestAccepted" component={QuestAccepted} options={{ headerShown: false }} />
        <Stack.Screen name="RiderEnRoute" component={RiderEnRoute} options={{ headerShown: false }} />
        <Stack.Screen name="QuestComplete" component={QuestComplete} options={{ headerShown: false }} />
        <Stack.Screen name="PostRequest" component={PostRequest} options={{ headerShown: false }} />
        <Stack.Screen name="RequestStatus" component={RequestStatus} options={{ headerShown: false }} />
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
