import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from './src/lib/theme';

// ─── Screens ────────────────────────────────────────────────
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
import RequesterHistory from './src/screens/RequesterHistory';
import HospitalRequestTracking from './src/screens/HospitalRequestTracking';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// ─── Shared tab bar config ──────────────────────────────────
const TAB_BAR_STYLE = {
  backgroundColor: COLORS.surface,
  borderTopColor: COLORS.border,
  borderTopWidth: 1,
  paddingTop: 4,
  height: 60,
};

// ─── Donor Tabs ─────────────────────────────────────────────
function DonorTabs() {
  return (
    <Tab.Navigator screenOptions={({ route }) => ({
      headerShown: false,
      tabBarStyle: TAB_BAR_STYLE,
      tabBarActiveTintColor: COLORS.primary,
      tabBarInactiveTintColor: COLORS.textMuted,
      tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;
        if (route.name === 'Home')    iconName = focused ? 'home' : 'home-outline';
        if (route.name === 'Quests')  iconName = focused ? 'map' : 'map-outline';
        if (route.name === 'Badges')  iconName = focused ? 'medal' : 'medal-outline';
        if (route.name === 'Profile') iconName = focused ? 'person' : 'person-outline';
        return <Ionicons name={iconName} size={size} color={color} />;
      },
    })}>
      <Tab.Screen name="Home"    component={DonorHome} options={{ title: 'Home' }} />
      <Tab.Screen 
        name="Quests"  
        component={Quests}    
        options={{ 
          title: 'Quests',
          tabBarBadge: 3,
          tabBarBadgeStyle: { backgroundColor: COLORS.primary, color: COLORS.white, fontSize: 10 }
        }} 
      />
      <Tab.Screen name="Badges"  component={Badges}    options={{ title: 'Badges' }} />
      <Tab.Screen name="Profile" component={Profile}   options={{ title: 'Profile' }} />
    </Tab.Navigator>
  );
}

// ─── Requester Tabs ─────────────────────────────────────────
function RequesterTabs() {
  return (
    <Tab.Navigator screenOptions={({ route }) => ({
      headerShown: false,
      tabBarStyle: TAB_BAR_STYLE,
      tabBarActiveTintColor: COLORS.primary,
      tabBarInactiveTintColor: COLORS.textMuted,
      tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;
        if (route.name === 'Home')    iconName = focused ? 'home' : 'home-outline';
        if (route.name === 'History') iconName = focused ? 'time' : 'time-outline';
        if (route.name === 'Profile') iconName = focused ? 'person' : 'person-outline';
        return <Ionicons name={iconName} size={size} color={color} />;
      },
    })}>
      <Tab.Screen name="Home"    component={RequesterHome} options={{ title: 'Home' }} />
      <Tab.Screen name="History" component={RequesterHistory} options={{ title: 'History' }} />
      <Tab.Screen name="Profile" component={Profile}       options={{ title: 'Profile' }} />
    </Tab.Navigator>
  );
}

// ─── Hospital Tabs ──────────────────────────────────────────
function HospitalTabs() {
  return (
    <Tab.Navigator screenOptions={({ route }) => ({
      headerShown: false,
      tabBarStyle: TAB_BAR_STYLE,
      tabBarActiveTintColor: COLORS.primary,
      tabBarInactiveTintColor: COLORS.textMuted,
      tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;
        if (route.name === 'Home')     iconName = focused ? 'home' : 'home-outline';
        if (route.name === 'Requests') iconName = focused ? 'document-text' : 'document-text-outline';
        if (route.name === 'History')  iconName = focused ? 'time' : 'time-outline';
        if (route.name === 'Profile')  iconName = focused ? 'person' : 'person-outline';
        return <Ionicons name={iconName} size={size} color={color} />;
      },
    })}>
      <Tab.Screen name="Home"     component={HospitalHome}     options={{ title: 'Home' }} />
      <Tab.Screen name="Requests" component={HospitalRequests} options={{ title: 'Requests' }} />
      <Tab.Screen name="History"  component={HospitalHistory}  options={{ title: 'History' }} />
      <Tab.Screen name="Profile"  component={Profile}          options={{ title: 'Profile' }} />
    </Tab.Navigator>
  );
}

// ─── Root Navigator ─────────────────────────────────────────
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Onboarding">
        <Stack.Screen name="Onboarding"             component={Onboarding}               options={{ headerShown: false }} />
        <Stack.Screen name="Login"                   component={Login}                    options={{ headerShown: false }} />
        <Stack.Screen name="Register"                component={Register}                 options={{ headerShown: false }} />
        <Stack.Screen name="Donor"                   component={DonorTabs}                options={{ headerShown: false }} />
        <Stack.Screen name="Requester"               component={RequesterTabs}            options={{ headerShown: false }} />
        <Stack.Screen name="Hospital"                component={HospitalTabs}             options={{ headerShown: false }} />
        <Stack.Screen name="CreateBloodRequest"      component={CreateBloodRequest}       options={{ headerShown: false }} />
        <Stack.Screen name="HospitalRequestTracking" component={HospitalRequestTracking}  options={{ headerShown: false }} />
        <Stack.Screen name="QuestAlert"              component={QuestAlert}               options={{ presentation: 'fullScreenModal', headerShown: false }} />
        <Stack.Screen name="QuestAccepted"           component={QuestAccepted}            options={{ headerShown: false }} />
        <Stack.Screen name="RiderEnRoute"            component={RiderEnRoute}             options={{ headerShown: false }} />
        <Stack.Screen name="QuestComplete"           component={QuestComplete}            options={{ headerShown: false }} />
        <Stack.Screen name="PostRequest"             component={PostRequest}              options={{ headerShown: false }} />
        <Stack.Screen name="RequestStatus"           component={RequestStatus}            options={{ headerShown: false }} />
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
