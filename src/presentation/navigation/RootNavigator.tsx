import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../providers/AuthProvider';
import { LoginScreen } from '../screens/Auth/LoginScreen';
import { OnboardingScreen } from '../screens/Onboarding/OnboardingScreen';
import { HomeScreen } from '../screens/Home/HomeScreen';
import { DashboardScreen } from '../screens/Dashboard/DashboardScreen';
import { Text } from 'react-native';

type AuthStackParamList = {
  Onboarding: undefined;
  Login: undefined;
  Register: undefined;
};

type AppTabParamList = {
  Home: undefined;
  Dashboard: undefined;
  Onboarding: undefined;
  Login: undefined;
};

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const Tab = createBottomTabNavigator<AppTabParamList>();

function AppTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: true }}>
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: 'Home', headerTitle: 'Home' }} />
      <Tab.Screen name="Dashboard" component={DashboardScreen} options={{ tabBarLabel: 'Dashboard', headerTitle: 'Dashboard' }} />
      <Tab.Screen name="Onboarding" component={OnboardingScreen} options={{ tabBarLabel: 'Onboarding', headerTitle: 'Onboarding' }} />
    </Tab.Navigator>
  );
}

export function RootNavigator() {
  const { user, loading } = useAuth();

  if (loading || user === undefined) {
    return <Text style={{ marginTop: 64, textAlign: 'center' }}>Loading...</Text>;
  }

  if (!user) {
    return (
      <AuthStack.Navigator initialRouteName="Onboarding">
        <AuthStack.Screen name="Onboarding" component={OnboardingScreen} options={{ headerShown: false }} />
        <AuthStack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <AuthStack.Screen name="Register" component={require('../screens/Auth/RegisterScreen').RegisterScreen} options={{ headerShown: false }} />
      </AuthStack.Navigator>
    );
  }

  return <AppTabs />;
}
