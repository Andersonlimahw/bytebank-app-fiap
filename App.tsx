import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigator } from '@app/presentation/navigation/RootNavigator';
import { initAuthStore } from '@app/store/authStore';

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
