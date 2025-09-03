import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigator } from './src/presentation/navigation/RootNavigator';
import { AppProviders } from './src/presentation/providers/AppProviders';

export default function App() {
  return (
    <SafeAreaProvider>
      <AppProviders>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </AppProviders>
    </SafeAreaProvider>
  );
}

