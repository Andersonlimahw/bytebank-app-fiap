import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../providers/AuthProvider';
import { LoginScreen } from '../screens/Auth/LoginScreen';
import { HomeScreen } from '../screens/Home/HomeScreen';
import { DashboardScreen } from '../screens/Dashboard/DashboardScreen';
import { Text } from 'react-native';

type AuthStackParamList = {
  Login: undefined;
};

type AppTabParamList = {
  Home: undefined;
  Dashboard: undefined;
};

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const Tab = createBottomTabNavigator<AppTabParamList>();

function AppTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: true }}>
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: 'Home', headerTitle: 'Home' }} />
      <Tab.Screen name="Dashboard" component={DashboardScreen} options={{ tabBarLabel: 'Dashboard', headerTitle: 'Dashboard' }} />
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
      <AuthStack.Navigator>
        <AuthStack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      </AuthStack.Navigator>
    );
  }

  return <AppTabs />;
}
