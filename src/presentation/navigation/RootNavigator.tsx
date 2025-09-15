import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../../store/authStore';
import { LoginScreen } from '../screens/Auth/LoginScreen';
import { OnboardingScreen } from '../screens/Onboarding/OnboardingScreen';
import { HomeScreen } from '../screens/Home/HomeScreen';
import { DashboardScreen } from '../screens/Dashboard/DashboardScreen';
import { InvestmentsScreen } from '../screens/Investments/InvestmentsScreen';
import { ExtractScreen } from '../screens/Extract/ExtractScreen';
import { Text } from 'react-native';
import { rootNavigatorStyles as styles } from './RootNavigator.styles';

type AuthStackParamList = {
  Onboarding: undefined;
  Login: undefined;
  Register: undefined;
};

type AppTabParamList = {
  Home: undefined;
  Dashboard: undefined;
  Investments: undefined;
  Extract: undefined;
};

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const Tab = createBottomTabNavigator<AppTabParamList>();
const AppStack = createNativeStackNavigator();

function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
        tabBarHideOnKeyboard: true,
        // Mantém navegação fluida entre tabs; as telas já animam ao focar
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: 'Home', headerTitle: 'Home' }} />
      <Tab.Screen name="Dashboard" component={DashboardScreen} options={{ tabBarLabel: 'Dashboard', headerTitle: 'Dashboard' }} />
      <Tab.Screen name="Investments" component={InvestmentsScreen} options={{ tabBarLabel: 'Investimentos', headerTitle: 'Investimentos' }} />
      <Tab.Screen name="Extract" component={ExtractScreen} options={{ tabBarLabel: 'Extrato', headerTitle: 'Extrato' }} />
    </Tab.Navigator>
  );
}

export function RootNavigator() {
  const { user, loading } = useAuth();

  if (loading || user === undefined) {
    return <Text style={styles.loading}>Loading...</Text>;
  }

  if (!user) {
    return (
      <AuthStack.Navigator
        initialRouteName="Onboarding"
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          animationTypeForReplace: 'push',
          fullScreenGestureEnabled: true,
          contentStyle: { backgroundColor: 'white' },
        }}
      >
        <AuthStack.Screen
          name="Onboarding"
          component={OnboardingScreen}
          options={{
            // Onboarding entra com fade para dar sensação de leveza
            animation: 'fade',
          }}
        />
        <AuthStack.Screen
          name="Login"
          component={LoginScreen}
          options={{
            // Login mantém push padrão lateral
            animation: 'slide_from_right',
          }}
        />
        <AuthStack.Screen
          name="Register"
          component={require('../screens/Auth/RegisterScreen').RegisterScreen}
          options={{
            // Registro sobe de baixo para cima (modal-like)
            animation: 'slide_from_bottom',
          }}
        />
      </AuthStack.Navigator>
    );
  }

  return (
    <AppStack.Navigator>
      <AppStack.Screen
        name="MainTabs"
        component={AppTabs}
        options={{ headerShown: false }}
      />
      <AppStack.Screen
        name="AddTransaction"
        component={require('../screens/Transactions/AddTransactionScreen').AddTransactionScreen}
        options={{
          presentation: 'modal',
          title: 'Nova transação',
        }}
      />
    </AppStack.Navigator>
  );
}
