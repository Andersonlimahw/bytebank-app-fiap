import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigator } from './src/presentation/navigation/RootNavigator';
import { initAuthStore } from './src/store/authStore';
import { enableScreens } from 'react-native-screens';
import { Platform, UIManager } from 'react-native';
import { I18nProvider } from './src/presentation/i18n/I18nProvider';

// Improves navigation performance and avoids potential blank screens on some setups
enableScreens(true);

export default function App() {
  useEffect(() => {
    // Initialize auth subscription once at app start
    initAuthStore();
    // Enable LayoutAnimation on Android for smoother list updates
    if (Platform.OS === 'android' && (UIManager as any)?.setLayoutAnimationEnabledExperimental) {
      (UIManager as any).setLayoutAnimationEnabledExperimental(true);
    }
  }, []);
  return (
    <I18nProvider>
      <SafeAreaProvider>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </SafeAreaProvider>
    </I18nProvider>
  );
}
