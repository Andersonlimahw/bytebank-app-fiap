import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigator } from './src/presentation/navigation/RootNavigator';
import { initAuthStore } from './src/store/authStore';
import { enableScreens } from 'react-native-screens';

// Improves navigation performance and avoids potential blank screens on some setups
enableScreens(true);

export default function App() {
  useEffect(() => {
    // Initialize auth subscription once at app start
    initAuthStore();
  }, []);
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
