import 'react-native-reanimated';
import 'text-encoding-polyfill';
import React from 'react';
import { AppRegistry } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import MyNavigation from './src/navigation/Navigation';
import { name as appName } from './app.json';

function Root() {
  return (
    <SafeAreaProvider>
      <MyNavigation />
    </SafeAreaProvider>
  );
}

AppRegistry.registerComponent(appName, () => Root);
